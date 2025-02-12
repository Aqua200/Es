export async function before(m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  // Cargar imagen de perfil
  let pp;
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image');
  } catch (e) {
    pp = 'https://qu.ax/iKouo.jpeg';  // Imagen de bienvenida por defecto
  }

  let pp2 = 'https://qu.ax/SQnJQ.jpg';  // Imagen de despedida por defecto

  // Obtener buffers de imágenes
  let img, img2;
  try {
    img = await (await fetch(pp)).buffer();
  } catch (e) {
    img = null;  // Evita que falle si la imagen no carga
  }

  try {
    img2 = await (await fetch(pp2)).buffer();
  } catch (e) {
    img2 = null;  // Evita que falle si la imagen no carga
  }

  // Verificar si `chat` está definido
  let chat = global.db.data.chats[m.chat] || {};

  if (chat.welcome) {
    let user = `@${m.messageStubParameters[0].split`@`[0]}`;
    let group = groupMetadata.subject;

    if (m.messageStubType == 27) { // Cuando alguien entra
      let wel = `ゲ◜៹ New Member ៹◞ゲ \n Usuario : ${user} \n Grupo : ${group}\n Powered By Neykoor✨`;
      await conn.sendMini(m.chat, global.packname || 'Onyx Bot', global.dev || '', wel, img || pp, img || pp, global.channel || '', global.fkontak || '');
    }

    if (m.messageStubType == 28 || m.messageStubType == 29) { // Cuando alguien sale
      let bye = `ゲ◜៹ Bye Member ៹◞ゲ \n Usuario: ${user} \n Grupo: ${group}\n Powered By Neykoor✨`;
      await conn.sendMini(m.chat, global.packname || 'Onyx Bot', global.dev || '', bye, img2 || pp2, img2 || pp2, global.channel || '', global.fkontak || '');
    }
  }
}
