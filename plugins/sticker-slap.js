import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
import MessageType from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  try {   
    if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
    if (!m.mentionedJid.length) m.mentionedJid.push(m.sender)

    let senderJid = m.sender
    let senderNumber = `+${senderJid.split('@')[0]}` // Número del atacante

    let mentionedUsersJid = [...new Set(m.mentionedJid)] // Evita menciones duplicadas
    let mentionedNames = await Promise.all(mentionedUsersJid.map(async user => {
      let name = (await conn.getName(user)) || user.split('@')[0]
      return `~ ${name}`
    }))

    let mentions = [senderJid, ...mentionedUsersJid] // Lista de menciones reales

    let mentionedTags = mentionedUsersJid.map(user => `@${user.split('@')[0]}`).join(', ') // Etiquetas reales en grupos

    let imageUrl = s[Math.floor(Math.random() * s.length)] // Sticker aleatorio

    let caption = `${senderNumber} *golpeó a* ${mentionedTags}`

    let stiker = await sticker(null, imageUrl, caption)

    if (stiker) {
      await conn.sendMessage(m.chat, { 
        sticker: stiker, 
        mentions: mentions
      }, { quoted: m })
    } else {
      await conn.sendFile(m.chat, imageUrl, 'slap.gif', caption, m, { 
        mentions: mentions
      })
    }

    // Si golpean al bot, responde mencionando al atacante
    if (mentionedUsersJid.includes(conn.user.jid)) { 
      await conn.sendMessage(m.chat, { 
        text: `¡Oye @${senderJid.split('@')[0]}, ¿por qué me pegas?! 😠`, 
        mentions: [senderJid] 
      }, { quoted: m })
      return
    }

    // Respuesta aleatoria del bot después de la bofetada
    const respuestas = [
      `¡Eso debió doler! 😱 ¿Estás bien, ${mentionedTags}?`,
      `¡Tremenda bofetada de ${senderNumber} a ${mentionedTags}! 🤚`,
      `¡Vaya golpe, ${mentionedTags}! 😬`,
      `¡Eso fue muy personal, ${mentionedTags}! 😢 ¡Ten cuidado con ${senderNumber}!`,
      `¡Espero que ${mentionedTags} esté bien después de eso! 😆`,
      `${senderNumber} no tuvo piedad con ${mentionedTags} 😱`,
      `¡Alguien detenga a ${senderNumber}, que está muy agresivo! 😵`
    ]

    let respuestaBot = respuestas[Math.floor(Math.random() * respuestas.length)]

    await conn.sendMessage(m.chat, { 
      text: respuestaBot, 
      mentions: mentions 
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await m.reply('Ocurrió un error al generar el sticker.')
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
