
import path from 'path';  // Agregar la importación de 'path'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default;
import { promises as fs, readdirSync, unlinkSync, existsSync } from 'fs';

async function sendResponse(chatId, message, mentions = []) {
  await conn.sendMessage(chatId, { text: message, mentions: mentions }, { quoted: fkontak });
}

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;

  const fkontak = {
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
  };

  let chat = global.db.data.chats[m.chat];
  let usuario = `@${m.sender.split`@`[0]}`;
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg';

  let nombre, foto, edit, newlink, status, admingp, noadmingp, aceptar;
  
  nombre = `《✧》${usuario} Ha cambiado el nombre del grupo.\n\n✦ Ahora el grupo se llama:\n*<${m.messageStubParameters[0]}>*.`;
  foto = `《✧》${usuario} Ha cambiado la imagen del grupo.`;
  edit = `《✧》${usuario} Ha permitido que ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo.`;
  newlink = `《✧》El enlace del grupo ha sido restablecido por:\n> » ${usuario}`;
  status = `《✧》El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado 🔒*' : '*abierto 🔓*'} Por ${usuario}\n\n✦ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensaje.`;
  admingp = `《✧》@${m.messageStubParameters[0].split`@`[0]} Ahora es admin del grupo.\n\n✦ Acción hecha por:\n> » ${usuario}`;
  noadmingp = `《✧》@${m.messageStubParameters[0].split`@`[0]} Deja de ser admin del grupo.\n\n✦ Acción hecha por:\n> » ${usuario}`;
  aceptar = `《✧》Ha llegado un nuevo participante al grupo.\n\n◦ ✐ Grupo: *${groupMetadata.subject}*\n\n◦ ⚘ Bienvenido/a: @${m.messageStubParameters[0].split('@')[0]} ingresado al grupo\n\n◦ ✦ Aceptado por: @${m.sender.split('@')[0]} que aceptó la solicitud de @${m.messageStubParameters[0].split('@')[0]} a ingresar al grupo.`; 

  // Detectar cambios en el grupo
  if (chat.detect && m.messageStubType == 21) {
    await sendResponse(m.chat, nombre, [m.sender]);

  } else if (chat.detect && m.messageStubType == 22) {
    await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak });

  } else if (chat.detect && m.messageStubType == 23) {
    await sendResponse(m.chat, newlink, [m.sender]);

  } else if (chat.detect && m.messageStubType == 25) {
    await sendResponse(m.chat, edit, [m.sender]);

  } else if (chat.detect && m.messageStubType == 26) {
    await sendResponse(m.chat, status, [m.sender]);

  } else if (chat.detect2 && m.messageStubType == 27) {
    await sendResponse(m.chat, aceptar, [`${m.sender}`, `${m.messageStubParameters[0]}`]);

  } else if (chat.detect && m.messageStubType == 29) {
    await sendResponse(m.chat, admingp, [`${m.sender}`,`${m.messageStubParameters[0]}`]);

  } else if (chat.detect && m.messageStubType == 30) {
    await sendResponse(m.chat, noadmingp, [`${m.sender}`,`${m.messageStubParameters[0]}`]);

  } else if (chat.detect && m.messageStubType == 72) {
    await sendResponse(m.chat, `${usuario} 𝐂𝐀𝐌𝐁𝐈𝐎 𝐋𝐀 𝐃𝐔𝐑𝐀𝐂𝐈𝐎́𝐍 𝐃𝐄 𝐋𝐎𝐒 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐋𝐄𝐒 𝐀 *@${m.messageStubParameters[0]}*`, [m.sender]);

  } else if (chat.detect && m.messageStubType == 123) {
    await sendResponse(m.chat, `${usuario} 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐎 𝐋𝐎𝐒 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐋𝐄𝐒.`, [m.sender]);
  } else {
    console.log({
      messageStubType: m.messageStubType,
      messageStubParameters: m.messageStubParameters,
      type: WAMessageStubType[m.messageStubType],
    });
  }

  // Manejo de sesiones (para evitar el "undefined" en algunos casos)
  if (chat.detect && m.messageStubType == 2) {
    const chatId = m.isGroup ? m.chat : m.sender;
    const uniqid = chatId.split('@')[0];
    const sessionPath = './sessions/';
    if (existsSync(sessionPath)) {
      const files = await fs.readdir(sessionPath);
      let filesDeleted = 0;
      for (const file of files) {
        if (file.includes(uniqid)) {
          await fs.unlink(path.join(sessionPath, file));
          filesDeleted++;
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
    await sendResponse(m.chat, `Admins, se ha realizado un cambio importante en el grupo: ${nombre}`, adminMentions);
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
