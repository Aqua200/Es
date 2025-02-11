import fetch from 'node-fetch'
import fs from 'fs'

// Archivo para almacenar el ranking de golpes
const dataFile = './database/slapRank.json'

// Lista de videos personalizados
const customVideos = [
  'https://telegra.ph/file/3ba192c3806b097632d3f.mp4',
  'https://telegra.ph/file/58b33c082a81f761bbee8.mp4',
  'https://telegra.ph/file/da5011a1c504946832c81.mp4',
  'https://telegra.ph/file/20ac5be925e6cd48f549f.mp4',
  'https://telegra.ph/file/a00bc137b0beeec056b04.mp4',
  'https://telegra.ph/file/080f08d0faa15119621fe.mp4',
  'https://telegra.ph/file/eb0b010b2f249dd189d06.mp4',
  'https://telegra.ph/file/734cb1e4416d80a299dac.mp4',
  'https://telegra.ph/file/fc494a26b4e46c9b147d2.mp4'
]

// Función para obtener GIFs dinámicos en MP4 desde Tenor
const tenorApiKey = 'TU_CLAVE_DE_API'
const query = 'anime slap'
const limit = 10

async function obtenerGif() {
  try {
    let tenorUrl = `https://g.tenor.com/v1/search?q=${query}&key=${tenorApiKey}&limit=${limit}`
    let res = await fetch(tenorUrl)
    let json = await res.json()
    
    if (json.results && json.results.length > 0) {
      return json.results[Math.floor(Math.random() * json.results.length)].media[0].mp4.url
    }
  } catch (e) {
    console.error('Error obteniendo GIF de Tenor:', e)
  }
  return customVideos[Math.floor(Math.random() * customVideos.length)] // Si falla, usa un video local
}

let handler = async (m, { conn }) => {
  try {
    if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
    if (!m.mentionedJid || m.mentionedJid.length === 0) m.mentionedJid.push(m.sender)

    // Cooldown para evitar spam
    const cooldown = global.slapCooldown || new Map()
    const delay = 5000 // 5 segundos
    if (cooldown.has(m.sender)) {
      return await m.reply('⏳ Espera unos segundos antes de usar este comando otra vez.')
    }
    cooldown.set(m.sender, Date.now())
    setTimeout(() => cooldown.delete(m.sender), delay)
    global.slapCooldown = cooldown

    // Seleccionar aleatoriamente entre los videos personalizados y los de Tenor
    let videoUrl = Math.random() < 0.5 ? await obtenerGif() : customVideos[Math.floor(Math.random() * customVideos.length)]

    let sender = `+${m.sender.split('@')[0]}`
    let texto = sender === `+${m.mentionedJid[0].split('@')[0]}`
      ? `${sender} intentó golpearse a sí mismo, ¿todo bien? 🤨`
      : `${sender} le dio una bofetada a ${m.mentionedJid.map(user => `+${user.split('@')[0]}`).join(', ')}`

    // Guardar el último golpe para permitir contraataque
    global.lastSlap = global.lastSlap || {}
    global.lastSlap[m.mentionedJid[0]] = m.sender

    // Guardar en ranking de golpes
    let slapRank = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : {}

    for (let user of m.mentionedJid) {
      if (!slapRank[m.sender]) slapRank[m.sender] = 0
      if (!slapRank[user]) slapRank[user] = 0
      slapRank[m.sender] += 1
    }
    fs.writeFileSync(dataFile, JSON.stringify(slapRank, null, 2))

    // Enviar el MP4 como video
    await conn.sendFile(m.chat, videoUrl, 'slap.mp4', texto, m)

    // Respuesta aleatoria del bot
    const respuestas = [
      "¡Toma eso! 😆",
      "¡Vaya golpe! 😱",
      "Eso debió doler... 🤕",
      "¡Qué agresividad! 😳",
      "¿Todo bien por aquí? 🤨",
      "¡Directo en la cara! 😵",
      "¡Eso estuvo fuerte! 😬",
      "¡Golpe crítico! 🎯",
      "¡Eso dejó marca! 🤯",
      "¡Eso es jugar sucio! 😡",
      "¡Uy, eso tuvo que doler! 😰",
      "¡Espero que no haya represalias! 😬",
      "¡Mortal Kombat estaría orgulloso! 🥋",
      "¡Bofetada con estilo! ✨",
      "¡Te pasaste de la raya! 😤",
      "¡Reacciona! No te dejes golpear así. 🤨",
      "¡Cuidado con la venganza! 😈",
      "¡Qué rápido fue eso! ⚡",
      "¡No lo vio venir! 🤣",
      "¡Bofetada a la velocidad de la luz! 🚀"
    ]
    let randomRespuesta = respuestas[Math.floor(Math.random() * respuestas.length)]
    await m.reply(randomRespuesta)

  } catch (e) {
    console.error(e)
    await m.reply('⚠️ No se pudo enviar el video. Aquí tienes un MP4 en su lugar.')
    let fallbackVideo = customVideos[Math.floor(Math.random() * customVideos.length)]
    await conn.sendFile(m.chat, fallbackVideo, 'slap.mp4', '⚠️ Error al cargar el video.')
  }
}

handler.help = ['slap']
handler.tags = ['General']
handler.command = /^(slap|bofetada|manotada|abofetear|golpear|cachetada|puñetazo)$/i

export default handler

// Comando de contraataque
let contraHandler = async (m, { conn }) => {
  let target = global.lastSlap ? global.lastSlap[m.sender] : null
  if (!target) return await m.reply("⚠️ Nadie te ha golpeado recientemente.")

  await m.reply(`¡${m.sender} contraatacó a ${target}! 🔥`)
  delete global.lastSlap[m.sender]
}

contraHandler.command = /^contraataque$/i
export { contraHandler }
