import { promises as fs } from 'fs'
import { join } from 'path'
import { spawnSync } from 'child_process'
import axios from 'axios'
import { Worker, isMainThread, parentPort } from 'worker_threads'

const TMP_DIR = join(process.cwd(), 'tmp')

const MAX_CONCURRENT = 5 // Límite de archivos concurrentes procesados a la vez

// Verificación de ffmpeg
function checkFFmpeg() {
  const result = spawnSync('ffmpeg', ['-version'], { encoding: 'utf-8' })
  if (result.error) throw new Error('FFmpeg no está instalado. Usa: pkg install ffmpeg')
}

// Función para trabajar con Workers (para conversiones en segundo plano)
function createWorkerJob(buffer, args, ext, ext2, quality = 'standard') {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename)
    worker.on('message', (result) => resolve(result))
    worker.on('error', reject)

    worker.postMessage({ buffer, args, ext, ext2, quality })
  })
}

// Función para convertir el archivo en un Worker (multiproceso)
if (!isMainThread) {
  parentPort.on('message', async (data) => {
    try {
      let { buffer, args, ext, ext2, quality } = data
      const result = await ffmpeg(buffer, args, ext, ext2, quality)
      parentPort.postMessage(result)
    } catch (error) {
      parentPort.postMessage({ error: error.message })
    }
  })
}

// Función de conversión principal
async function ffmpeg(buffer, args = [], ext = '', ext2 = '', quality = 'standard') {
  checkFFmpeg()

  await fs.mkdir(TMP_DIR, { recursive: true })

  let inputFile = join(TMP_DIR, `${Date.now()}.${ext}`)
  let outputFile = `${inputFile}.${ext2}`

  await fs.writeFile(inputFile, buffer)

  let qualityArgs = []
  if (quality === 'low') qualityArgs = ['-crf', '35']
  if (quality === 'high') qualityArgs = ['-crf', '20']

  return new Promise((resolve, reject) => {
    const result = spawnSync('ffmpeg', ['-y', '-i', inputFile, ...args, ...qualityArgs, outputFile], { encoding: 'utf-8' })

    fs.unlink(inputFile).catch(() => {})

    if (result.error) return reject(`FFmpeg error: ${result.error.message}`)

    fs.readFile(outputFile)
      .then((data) => resolve({
        data,
        filename: outputFile,
        async delete() {
          try { await fs.unlink(outputFile) } catch {}
        }
      }))
      .catch((e) => reject(`File read error: ${e.message}`))
  })
}

// Convertir a PTT
function toPTT(buffer, ext, quality = 'standard') {
  return ffmpeg(buffer, ['-vn', '-c:a', 'libopus', '-b:a', '64k', '-vbr', 'on'], ext, 'ogg', quality)
}

// Convertir a Audio (opus/mp3)
function toAudio(buffer, ext, format = 'opus', quality = 'standard') {
  let codec = format === 'mp3' ? ['-c:a', 'libmp3lame', '-q:a', '2'] : ['-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on']
  return ffmpeg(buffer, ['-vn', ...codec], ext, format, quality)
}

// Convertir a Video
function toVideo(buffer, ext, quality = 'standard', resolution = '720') {
  let resolutionArgs = resolution === '1080' ? ['-s', '1920x1080'] : ['-s', '1280x720']
  return ffmpeg(buffer, ['-c:v', 'libx264', '-preset', 'fast', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', ...resolutionArgs], ext, 'mp4', quality)
}

// Función para extraer subtítulos de un video
async function extractSubtitles(buffer, ext) {
  const tempVideoPath = join(TMP_DIR, `${Date.now()}.${ext}`)
  await fs.writeFile(tempVideoPath, buffer)

  return new Promise((resolve, reject) => {
    const outputSubtitles = tempVideoPath.replace(ext, '.srt')

    const result = spawnSync('ffmpeg', ['-i', tempVideoPath, '-map', '0:s:0', outputSubtitles], { encoding: 'utf-8' })

    fs.unlink(tempVideoPath).catch(() => {})

    if (result.error) return reject(`Error al extraer subtítulos: ${result.error.message}`)

    fs.readFile(outputSubtitles, 'utf8')
      .then((subtitles) => {
        fs.unlink(outputSubtitles).catch(() => {})
        resolve(subtitles)
      })
      .catch((e) => reject(`Error al leer subtítulos: ${e.message}`))
  })
}

// Función para convertir subtítulos entre formatos
async function convertSubtitles(buffer, ext, outputFormat = 'vtt') {
  const tempSubtitlePath = join(TMP_DIR, `${Date.now()}.${ext}`)
  await fs.writeFile(tempSubtitlePath, buffer)

  return new Promise((resolve, reject) => {
    const outputPath = tempSubtitlePath.replace(ext, `.${outputFormat}`)

    const result = spawnSync('ffmpeg', ['-i', tempSubtitlePath, outputPath], { encoding: 'utf-8' })

    fs.unlink(tempSubtitlePath).catch(() => {})

    if (result.error) return reject(`Error al convertir subtítulos: ${result.error.message}`)

    fs.readFile(outputPath, 'utf8')
      .then((convertedSubtitles) => {
        fs.unlink(outputPath).catch(() => {})
        resolve(convertedSubtitles)
      })
      .catch((e) => reject(`Error al leer subtítulos convertidos: ${e.message}`))
  })
}

// Función de compresión sin pérdida
async function compressLossless(buffer, ext) {
  const inputFile = join(TMP_DIR, `${Date.now()}.${ext}`)
  const outputFile = `${inputFile}.compressed.${ext}`

  await fs.writeFile(inputFile, buffer)

  return new Promise((resolve, reject) => {
    const result = spawnSync('ffmpeg', ['-i', inputFile, '-c:v', 'libx264', '-crf', '0', '-preset', 'medium', outputFile], { encoding: 'utf-8' })

    fs.unlink(inputFile).catch(() => {})

    if (result.error) return reject(`Error al comprimir: ${result.error.message}`)

    fs.readFile(outputFile)
      .then((data) => {
        fs.unlink(outputFile).catch(() => {})
        resolve({
          data,
          filename: outputFile,
          async delete() {
            try { await fs.unlink(outputFile) } catch {}
          }
        })
      })
      .catch((e) => reject(`Error al leer archivo comprimido: ${e.message}`))
  })
}

// Función para agregar metadatos a un video
async function addMetadataToVideo(buffer, ext, metadata) {
  const tempVideoPath = join(TMP_DIR, `${Date.now()}.${ext}`)
  await fs.writeFile(tempVideoPath, buffer)

  return new Promise((resolve, reject) => {
    const outputVideoPath = tempVideoPath.replace(ext, '-metadata.' + ext)

    const metadataArgs = Object.entries(metadata).flatMap(([key, value]) => ['-metadata', `${key}=${value}`])

    const result = spawnSync('ffmpeg', ['-i', tempVideoPath, ...metadataArgs, outputVideoPath], { encoding: 'utf-8' })

    fs.unlink(tempVideoPath).catch(() => {})

    if (result.error) return reject(`Error al agregar metadatos: ${result.error.message}`)

    fs.readFile(outputVideoPath)
      .then((data) => {
        fs.unlink(outputVideoPath).catch(() => {})
        resolve({
          data,
          filename: outputVideoPath,
          async delete() {
            try { await fs.unlink(outputVideoPath) } catch {}
          }
        })
      })
      .catch((e) => reject(`Error al leer archivo con metadatos: ${e.message}`))
  })
}

export { 
  toAudio, 
  toPTT, 
  toVideo, 
  batchConvert, 
  createWorkerJob, 
  convertFromUrl, 
  extractSubtitles, 
  convertSubtitles, 
  compressLossless, 
  addMetadataToVideo 
}
