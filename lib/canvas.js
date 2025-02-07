import { spawn } from 'child_process'
import { join } from 'path'

const __dirname = global.__dirname(import.meta.url)

/**
 * Calcula la posición de la anotación según el nivel.
 * @param {number} level - El nivel para el que se calculará la posición.
 * @returns {string} La posición de la anotación en formato "+X+Y".
 */
function getAnnotationPosition(level) {
  if (level > 100) return '+1260+260'
  if (level > 50) return '+1310+260'
  if (level > 10) return '+1330+260'
  if (level > 2) return '+1370+260'
  return '+1385+260'
}

/**
 * Genera una imagen "levelup" a partir de una plantilla, agregando un texto y un nivel.
 *
 * Utiliza ImageMagick o GraphicsMagick (según lo que esté soportado en global.support) para procesar la imagen.
 *
 * @param {string} teks - El texto que se agregará a la imagen.
 * @param {number} level - El nivel que se mostrará en la imagen.
 * @returns {Promise<Buffer>} - Una promesa que resuelve con el buffer de la imagen generada.
 */
export function levelup(teks, level) {
  return new Promise((resolve, reject) => {
    // Validación básica de parámetros.
    if (typeof teks !== 'string' || teks.trim() === '') {
      return reject(new Error('El parámetro "teks" debe ser un texto no vacío.'))
    }
    if (typeof level !== 'number' || isNaN(level)) {
      return reject(new Error('El parámetro "level" debe ser un número válido.'))
    }

    // Verifica que se cuente con soporte para ImageMagick o GraphicsMagick.
    if (!(global.support.convert || global.support.magick || global.support.gm)) {
      return reject(new Error('Herramienta de conversión no soportada.'))
    }

    // Definir las rutas a los recursos.
    const fontDir = join(__dirname, '../src/font')
    const fontLevel = join(fontDir, 'level_c.otf')
    const fontTexts = join(fontDir, 'texts.otf')
    const templatePath = join(__dirname, '../src/lvlup_template.jpg')

    // Calcula la posición de la anotación según el nivel.
    const annotation = getAnnotationPosition(level)

    // Preparación de los argumentos para la llamada a ImageMagick o GraphicsMagick.
    const commandParts = [
      ...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []),
      'convert',
      templatePath,
      '-font',
      fontTexts,
      '-fill',
      '#0F3E6A',
      '-size',
      '1024x784',
      '-pointsize',
      '68',
      '-interline-spacing',
      '-7.5',
      '-annotate',
      '+153+200',
      teks,
      '-font',
      fontLevel,
      '-fill',
      '#0A2A48',
      '-size',
      '1024x784',
      '-pointsize',
      '140',
      '-interline-spacing',
      '-1.2',
      '-annotate',
      annotation,
      level,
      '-append',
      'jpg:-'
    ]

    // Desestructura el comando y los argumentos.
    const [spawnCommand, ...spawnArgs] = commandParts

    let buffers = []
    const child = spawn(spawnCommand, spawnArgs)

    child.stdout.on('data', chunk => buffers.push(chunk))
    child.on('error', (err) => {
      console.error('Error al ejecutar el proceso:', err)
      reject(err)
    })
    child.on('close', () => {
      resolve(Buffer.concat(buffers))
    })
  })
}
