import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
import fs from 'fs'

// Archivo para almacenar el ranking de golpes
const dataFile = './database/slapRank.json'

// Función para obtener GIFs dinámicos desde Tenor
const tenorApiKey = 'TU_CLAVE_DE_API'
const query = 'anime slap'
const limit = 10

async function obtenerGif() {
  try {
    let tenorUrl = `https://g.tenor.com/v1/search?q=${query}&key=${tenorApiKey}&limit=${limit}`
    let res = await fetch(tenorUrl)
    let json = await res.json()
    
    if (json.results && json.results.length > 0) {
      return json.results[Math.floor(Math.random() * json.results.length)].media[0].gif.url
    }
  } catch (e) {
    console.error('Error obteniendo GIF de Tenor:', e)
  }
  return slapGifs[Math.floor(Math.random() * slapGifs.length)].url // Si falla, usa un GIF local
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

    // Seleccionar un GIF dinámico
    let imageUrl = await obtenerGif()

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

    // Convertir la imagen a buffer
    let res = await fetch(imageUrl)
    let buffer = await res.buffer()

    // Generar el sticker
    let stiker = await sticker(buffer, null, texto)
    if (stiker) {
      await conn.sendFile(m.chat, stiker, null, { asSticker: true })
    } else {
      await conn.sendFile(m.chat, imageUrl, 'slap.gif', texto)
    }

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
    await m.reply('⚠️ No se pudo generar el sticker. Aquí tienes el GIF en su lugar.')
    let fallbackImage = slapGifs[Math.floor(Math.random() * slapGifs.length)].url
    await conn.sendFile(m.chat, fallbackImage, 'slap.gif', '⚠️ Error al generar el sticker.')
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

// Lista de GIFs en caso de que falle Tenor
const slapGifs = [
  { url: "https://media.tenor.com/XiYuU9h44-AAAAAC/anime-slap-mad.gif", source: "Tenor" },
  { url: "https://img.photobucket.com/albums/v639/aoie_emesai/100handslap.gif", source: "Photobucket" },
  { url: "https://gifdb.com/images/high/yuruyuri-akari-kyoko-anime-slap-fcacgc0edqhci6eh.gif", source: "GifDB" },
  { url: "https://gifdb.com/images/file/anime-sibling-slap-ptjipasdw3i3hsb0.gif", source: "GifDB" },
  { url: "https://c.tenor.com/Lc7C5mLIVIQAAAAC/tenor.gif", source: "Tenor" },
  { url: "https://i.pinimg.com/originals/71/a5/1c/71a51cd5b7a3e372522b5011bdf40102.gif", source: "Pinterest" }
]
