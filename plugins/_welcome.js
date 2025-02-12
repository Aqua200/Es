import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let chat = global.db.data.chats[m.chat];
  let user = `@${m.messageStubParameters[0].split`@`[0]}`;
  let isWelcome = m.messageStubType == 27;
  let isBye = [28, 32].includes(m.messageStubType);

  // URLs de imagen predeterminadas
  let defaultWelcomeImg = 'https://qu.ax/iKouo.jpeg';
  let defaultByeImg = 'https://qu.ax/SQnJQ.jpg';

  // Obtener imagen de perfil o usar la predeterminada según el evento
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ =>
    isWelcome ? defaultWelcomeImg : defaultByeImg
  );
  let img = await (await fetch(pp)).buffer();

  // Mensaje de bienvenida
  if (chat.bienvenida && isWelcome) {
    let welcome = chat.sWelcome
      ? chat.sWelcome.replace('@user', user)
                   .replace('@group', groupMetadata.subject)
                   .replace('@desc', groupMetadata.desc || 'sin descripción')
      : `┌─★ 𝐀𝐍𝐈𝐊𝐀 𝐃𝐌  
│「 ✨ ¡Bienvenid@! ✨ 」  
└┬★ 「 ${user} 」  
   │✑  Qué alegría tenerte aquí  
   │✑  Disfruta en ${groupMetadata.subject}  
   │✑  No olvides leer las reglas 💖  
   └───────────────┈ ⳹`;

    await conn.sendMessage(m.chat, { image: img, caption: welcome }, { quoted: m });
  }

  // Mensaje de salida o expulsión
  if (chat.bienvenida && isBye) {
    let bye = chat.sBye
      ? chat.sBye.replace('@user', user)
                 .replace('@group', groupMetadata.subject)
                 .replace('@desc', groupMetadata.desc || 'sin descripción')
      : `┌─★ 𝐀𝐍𝐈𝐊𝐀 𝐃𝐌  
│「 👋 Adiós, estimad@ 」  
└┬★ 「 ${user} 」  
   │✑  Se ha ido del grupo 💔  
   │✑  Esperamos verte regresar algún día ✨  
   └───────────────┈ ⳹`;

    await conn.sendMessage(m.chat, { image: img, caption: bye }, { quoted: m });
  }
}
