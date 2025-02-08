import path from 'path';
import { promises as fs, existsSync } from 'fs';

let WAMessageStubType = (await import('@whiskeysockets/baileys')).default;

async function sendResponse(chatId, message, mentions = []) {
  await conn.sendMessage(chatId, { text: message, mentions }, { quoted: fkontak });
}

export async function before(m, { conn, participants, groupMetadata }) {
  // Asegurar que el mensaje sea válido y sea un grupo
  if (!m.messageStubType || !m.isGroup) return;

  const fkontak = {
    key: { 
      participants: "0@s.whatsapp.net", 
      remoteJid: "status@broadcast", 
      fromMe: false, 
      id: "Halo"
    },
    message: { 
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    }, 
    participant: "0@s.whatsapp.net"
  };

  let chat = global.db.data.chats[m.chat];
  let usuario = `@${m.sender.split('@')[0]}`;
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg';

  const messages = {
    21: `《✧》${usuario} Ha cambiado el nombre del grupo.\n\n✦ Ahora el grupo se llama:\n*<${m.messageStubParameters[0]}>*.`,
    22: { image: { url: pp }, caption: `《✧》${usuario} Ha cambiado la imagen del grupo.` },
    23: `《✧》El enlace del grupo ha sido restablecido por:\n> » ${usuario}`,
    25: `《✧》${usuario} Ha permitido que ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo.`,
    26: `《✧》El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado 🔒*' : '*abierto 🔓*'} Por ${usuario}\n\n✦ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensaje.`,
    27: `《✧》Ha llegado un nuevo participante al grupo.\n\n◦ ✐ Grupo: *${groupMetadata.subject}*\n\n◦ ⚘ Bienvenido/a: @${m.messageStubParameters[0].split('@')[0]} ingresado al grupo\n\n◦ ✦ Aceptado por: @${m.sender.split('@')[0]} que aceptó la solicitud de @${m.messageStubParameters[0].split('@')[0]} a ingresar al grupo.`,
    29: `《✧》@${m.messageStubParameters[0].split('@')[0]} Ahora es admin del grupo.\n\n✦ Acción hecha por:\n> » ${usuario}`,
    30: `《✧》@${m.messageStubParameters[0].split('@')[0]} Deja de ser admin del grupo.\n\n✦ Acción hecha por:\n> » ${usuario}`,
    72: `${usuario} 𝐂𝐀𝐌𝐁𝐈𝐎 𝐋𝐀 𝐃𝐔𝐑𝐀𝐂𝐈𝐎́𝐍 𝐃𝐄 𝐋𝐎𝐒 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐋𝐄𝐒 𝐀 *@${m.messageStubParameters[0]}*`,
    123: `${usuario} 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐎 𝐋𝐎𝐒 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐋𝐄𝐒.`
  };

  // Detectar cambios en el grupo
  if (chat.detect && messages[m.messageStubType]) {
    if (typeof messages[m.messageStubType] === 'string') {
      await sendResponse(m.chat, messages[m.messageStubType], [m.sender]);
    } else {
      await conn.sendMessage(m.chat, messages[m.messageStubType], { quoted: fkontak });
    }
  } else {
    console.log("Tipo de mensaje no reconocido:", m.messageStubType);
  }

  // Manejo de sesiones (para evitar el "undefined" en algunos casos)
  if (chat.detect && m.messageStubType == 2) {
    const chatId = m.isGroup ? m.chat : m.sender;
    const uniqid = chatId.split('@')[0];
    const sessionPath = './sessions/';
    if (existsSync(sessionPath)) {
      const files = await fs.readdir(sessionPath);
      for (const file of files) {
        if (file.includes(uniqid)) {
          await fs.unlink(path.join(sessionPath, file));
          console.log(`⚠️ Eliminación de session (PreKey) que provocan el "undefined" en el chat`);
        }
      }
    } else {
      console.log('La carpeta de sesiones no existe.');
    }
  }

  // Notificación a los admins cuando hay un cambio importante
  let adminMentions = participants.filter(p => p.isAdmin).map(p => p.id);
  if (adminMentions.length > 0 && chat.detect) {
    await sendResponse(m.chat, `Admins, se ha realizado un cambio importante en el grupo: ${messages[m.messageStubType]}`, adminMentions);
  }

  // Registro de actividades
  const logMessage = `Acción realizada por ${usuario}: ${m.messageStubType}`;
  console.log(logMessage);

  // Crear archivo de log si no existe y escribir el registro
  const logFilePath = './logs.txt';
  fs.appendFile(logFilePath, logMessage + '\n', (err) => {
    if (err) {
      console.error('Error al guardar el registro:', err);
    } else {
      console.log('Registro guardado correctamente en logs.txt');
    }
  });

  // Confirmación de acción exitosa
  await conn.sendMessage(m.chat, { text: 'Acción completada exitosamente.' });
}
