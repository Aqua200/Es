import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let defaultImage = 'https://files.catbox.moe/xr2m6u.jpg';

  // Asegúrate de que global.welcom1 y global.welcom2 estén definidos
  let welcomeMessage = global.welcom1 || '¡Bienvenido al grupo, que alegría tenerte aquí!'
  let goodbyeMessage = global.welcom2 || 'Nos da tristeza verte ir, ¡esperamos verte de nuevo pronto!'
  let removedMessage = global.welcom3 || 'Parece que alguien ha sido eliminado... ¡Esperamos que todo esté bien!'

  if (chat.welcome) {
    let img;
    try {
      let pp = await conn.profilePictureUrl(who, 'image');
      img = await (await fetch(pp)).buffer();
    } catch {
      img = await (await fetch(defaultImage)).buffer();
    }

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = `🌸 *Bienvenido* a ${groupMetadata.subject}\n ✨ ${taguser}\n${welcomeMessage}\n •(=^●ω●^=)• ¡Disfruta mucho de tu estadía y no dudes en interactuar!\n> ✐ Usa *#help* para conocer todos los comandos disponibles.`
      await conn.sendMessage(m.chat, { text: bienvenida, mentions: [who] })
    } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      let bye = `🌙 *Adiós* de ${groupMetadata.subject}\n ✨ ${taguser}\n${goodbyeMessage}\n •(=^●ω●^=)• ¡Te esperamos con los brazos abiertos la próxima vez!\n> ✐ No olvides que puedes usar *#help* para ver todos los comandos cuando regreses.`
      await conn.sendMessage(m.chat, { text: bye, mentions: [who] })
    } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_KICK) {
      let removed = `💨 *Eliminado* de ${groupMetadata.subject}\n ✨ ${taguser}\n${removedMessage}\n •(=^●ω●^=)• ¡Que todo esté bien, te esperamos si decides regresar!\n> ✐ Recuerda usar *#help* cuando regreses para ver los comandos.`
      await conn.sendMessage(m.chat, { text: removed, mentions: [who] })
    }
  }

  return true
}
