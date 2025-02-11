import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
    if (!m.mentionedJid.length) m.mentionedJid.push(m.sender)

    // Selecciona una URL aleatoria de la lista
    let imageUrl = s[Math.floor(Math.random() * s.length)]

    // Convierte la imagen en buffer
    let res = await fetch(imageUrl)
    let buffer = await res.buffer()

    // Genera el sticker
    let stiker = await sticker(buffer, null, `+${m.sender.split('@')[0]} le dio una bofetada a ${m.mentionedJid.map((user) => (user === m.sender) ? 'alguien' : `+${user.split('@')[0]}`).join(', ')}`)

    // Envía el sticker
    await conn.sendFile(m.chat, stiker, null, { asSticker: true })
  } catch (e) {
    console.error(e)
  }
}

handler.help = ['slap']
handler.tags = ['General']
handler.command = /^slap|bofetada|manotada|abofetear|golpear/i

export default handler

const s = [
  "https://media.tenor.com/XiYuU9h44-AAAAAC/anime-slap-mad.gif",
  "https://img.photobucket.com/albums/v639/aoie_emesai/100handslap.gif",
  "https://gifdb.com/images/high/yuruyuri-akari-kyoko-anime-slap-fcacgc0edqhci6eh.gif",
  "https://gifdb.com/images/file/anime-sibling-slap-ptjipasdw3i3hsb0.gif",
  "https://c.tenor.com/Lc7C5mLIVIQAAAAC/tenor.gif",
  "https://i.pinimg.com/originals/71/a5/1c/71a51cd5b7a3e372522b5011bdf40102.gif"
]
