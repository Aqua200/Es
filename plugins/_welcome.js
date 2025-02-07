import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let top = `*╭─${em}─── ⫍📢⫎ ───${em}─╮*\n`;
  let bottom = `\n*╰─${em}─── ⫍📢⫎ ───${em}─╯*`;
  
  let chat = global.db.data.chats[m.chat]
  let fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  }

  // Mensajes de bienvenida
  const welcomeMessages = [
    `🥳 ¡Bienvenid@ @${m.messageStubParameters[0].split('@')[0]}! Disfruta de tu estancia en *${groupMetadata.subject}* 🎉`,
    `¡Hola @${m.messageStubParameters[0].split('@')[0]}! 👋 Bienvenid@ a *${groupMetadata.subject}*. ¡A divertirse! 🎈`,
    `@${m.messageStubParameters[0].split('@')[0]} se unió a *${groupMetadata.subject}* 🎊 ¡Qué emoción! 🎉`,
    `🎉 ¡Nuevo miembro! @${m.messageStubParameters[0].split('@')[0]}, bienvenid@ a *${groupMetadata.subject}* 🥳`,
    `🎊 ¡Bienvenid@ @${m.messageStubParameters[0].split('@')[0]}! Esperamos que tu tiempo en *${groupMetadata.subject}* sea increíble 🤩`,
    `👋 ¡Hola @${m.messageStubParameters[0].split('@')[0]}! Bienvenid@ a *${groupMetadata.subject}*. ¡Esperamos que disfrutes! 🥳`
    // Puedes agregar más mensajes aquí según sea necesario
  ];

  // Mensajes de despedida
  const leaveMessages = [
    `👋 @${m.messageStubParameters[0].split('@')[0]} ha abandonado el grupo *${groupMetadata.subject}* 😢`,
    `😞 @${m.messageStubParameters[0].split('@')[0]} se fue de *${groupMetadata.subject}*. ¡Hasta luego! 👋`,
    `🖐️ @${m.messageStubParameters[0].split('@')[0]} ha dejado *${groupMetadata.subject}*. ¡Nos veremos pronto! 👋`,
    `🚪 @${m.messageStubParameters[0].split('@')[0]} se ha ido de *${groupMetadata.subject}* 😔 ¡Suerte!`,
    `💔 @${m.messageStubParameters[0].split('@')[0]} se despidió de *${groupMetadata.subject}* 😞 ¡Te extrañaremos!`,
    `👋 @${m.messageStubParameters[0].split('@')[0]} se fue de *${groupMetadata.subject}*. ¡Hasta pronto! 🌟`
    // Puedes agregar más mensajes aquí según sea necesario
  ];

  // Mensajes de expulsión
  const kickMessages = [
    `☠️ @${m.messageStubParameters[0].split('@')[0]} fue expulsad@ de *${groupMetadata.subject}* 🚷`,
    `🚫 @${m.messageStubParameters[0].split('@')[0]} fue eliminado de *${groupMetadata.subject}* ❌`,
    `⚠️ @${m.messageStubParameters[0].split('@')[0]} ha sido removid@ del grupo *${groupMetadata.subject}* 👋`,
    `❌ @${m.messageStubParameters[0].split('@')[0]} fue expulsad@ de *${groupMetadata.subject}* 😔`,
    `🚷 @${m.messageStubParameters[0].split('@')[0]} fue removid@ de *${groupMetadata.subject}* 😞`,
    `📛 @${m.messageStubParameters[0].split('@')[0]} ya no es parte de *${groupMetadata.subject}* 😓`
    // Puedes agregar más mensajes aquí según sea necesario
  ];

  // Manejo de bienvenida
  if (chat.bienvenida && m.messageStubType == WAMessageStubType.JOIN) {
    let user = `@${m.messageStubParameters[0].split('@')[0]}`;
    let welcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

    await conn.reply(m.chat, welcome.replace('@user', user), fkontak);
  }

  // Manejo de salida
  if (chat.bienvenida && m.messageStubType == WAMessageStubType.LEFT) {
    let user = `@${m.messageStubParameters[0].split('@')[0]}`;
    let bye = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];

    await conn.reply(m.chat, bye.replace('@user', user), fkontak);
  }

  // Manejo de expulsión
  if (chat.bienvenida && m.messageStubType == WAMessageStubType.KICKOUT) {
    let user = `@${m.messageStubParameters[0].split('@')[0]}`;
    let kick = kickMessages[Math.floor(Math.random() * kickMessages.length)];

    await conn.reply(m.chat, kick.replace('@user', user), fkontak);
  }
}
