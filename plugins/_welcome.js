import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  // Asegúrate de que m.messageStubType y m.isGroup estén definidos correctamente
  if (!m.messageStubType || !m.isGroup) return true;

  // Asegúrate de que la variable imagen1 esté definida correctamente (puede ser una ruta relativa)
  let img = imagen1
  let chat = global.db.data.chats[m.chat]

  // Configuración de bienvenida
  if (chat.welcome && m.messageStubType == 27) {
    let welcome = `「✿」Anika - MD \n「 Bienvenido :3 」\n「 @${m.messageStubParameters[0].split`@`[0]} 」\n「 Bienvenido/a 」\n「 ${groupMetadata.subject} 」\n\n> ✐ Usa *.menu* para ver mi menu.\n> 🜸 por el momento no hay url`
    await conn.sendMini(m.chat, packname, textbot, welcome, img, img, redes, fkontak)
  }

  // Configuración de despedida
  if (chat.welcome && m.messageStubType == 28) {
    let bye = `「✿」Anika - MD \n「 Adios 」\n「 @${m.messageStubParameters[0].split`@`[0]} 」\n「 Se fue 」\n「 Vuelve pronto :3 」\n\n> ✐ Usa *.menu* para ver menu.\n> 🜸 por el momento no hay url`
    await conn.sendMini(m.chat, packname, textbot, bye, img, img, redes, fkontak)
  }

  // Configuración para la eliminación de participantes
  if (chat.welcome && m.messageStubType == 32) {
    let kick = `「✿」Anika - MD \n「 Adios 」\n「 @${m.messageStubParameters[0].split`@`[0]} 」\n「 Se fue 」\n「 Vuelve pronto :3」\n\n> ✐ Usa *.menu* para ver mi menu.\n> 🜸 por el momento no hay url`
    await conn.sendMini(m.chat, packname, textbot, kick, img, img, redes, fkontak)
    await conn.sendMessage(m.chat, { image: img, caption: bye, mentions: [who] })
  }
}
