import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  let chat = global.db.data.chats[m.chat];
  let user = `@${m.messageStubParameters[0].split`@`[0]}`;
  let isWelcome = m.messageStubType == 27;
  let isBye = [28, 32].includes(m.messageStubType);

  // URLs de imagen predeterminadas
  let defaultWelcomeImg = 'https://qu.ax/iKouo.jpeg';
  let defaultByeImg = 'https://qu.ax/SQnJQ.jpg';

  // Obtener imagen de perfil o usar la predeterminada según el evento
  let pp = '';
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image');
    console.log('Foto de perfil obtenida:', pp); // Log para verificar la URL obtenida
  } catch (e) {
    console.log('Error al obtener la foto de perfil:', e.message);
    pp = isWelcome ? defaultWelcomeImg : defaultByeImg;
  }

  // Verificar si la URL obtenida es válida
  if (!pp || pp === 'undefined') {
    pp = isWelcome ? defaultWelcomeImg : defaultByeImg;
  }

  console.log('URL de imagen usada:', pp); // Log para verificar la imagen final usada

  let img = await (await fetch(pp)).buffer();
  console.log('Imagen cargada:', img); // Log para verificar que la imagen se ha cargado correctamente

  // Verificar el tipo de evento
  console.log('Tipo de evento:', m.messageStubType);

  // Mensaje de bienvenida
  if (chat.bienvenida && isWelcome) {
    console.log('Enviando mensaje de bienvenida a', m.chat);
    let welcome = chat.sWelcome
      ? chat.sWelcome.replace('@user', user)
                   .replace('@group', groupMetadata.subject)
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
      : `┌─★ 𝐀𝐍𝐈𝐊𝐀 𝐃𝐌  
│「 👋 Adiós, estimad@ 」  
└┬★ 「 ${user} 」  
   │✑  Se ha ido del grupo 💔  
   │✑  Esperamos verte regresar algún día ✨  
   └───────────────┈ ⳹`;

    await conn.sendMessage(m.chat, { image: img, caption: bye }, { quoted: m });
  }
}
