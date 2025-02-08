import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  try {
    if (!m.messageStubType || !m.isGroup) return true

    let who = m.messageStubParameters[0]
    let taguser = `@${who.split('@')[0]}`
    let chat = global.db.data.chats[m.chat]

    // Mensajes de bienvenida
    const welcomeMessages = [
      `🌸 *¡Bienvenido* a la familia de ${groupMetadata.subject}*\n✨ *Hola, ${taguser}!*\n💖 *Nos alegra mucho tenerte aquí.*\n🌟 *¡Disfruta y si necesitas ayuda, escribe #help!*`,
      `🎉 *Un nuevo miembro ha llegado a ${groupMetadata.subject}*!\n💫 *Bienvenido, ${taguser}!* Nos alegra tenerte con nosotros.\n✨ *¡Aquí te sentirás como en casa!*`,
      // Agrega más mensajes aquí según lo necesites
    ];

    // Mensajes de despedida
    const goodbyeMessages = [
      `🍂 *Adiós, ${taguser}* 😢\n🌻 *Te deseamos lo mejor en tu camino.*\n💖 *Gracias por haber sido parte de ${groupMetadata.subject}.*\n✨ *Te esperamos pronto.*`,
      `🌸 *Adiós, ${taguser}* 💖\n🌺 *Nos entristece verte ir, pero te deseamos lo mejor.*\n🌼 *Gracias por ser parte de ${groupMetadata.subject}*.\n✨ *Vuelve cuando quieras.*`,
      // Agrega más mensajes aquí según lo necesites
    ];

    // Función para seleccionar un mensaje aleatorio
    const getRandomMessage = (messages) => messages[Math.floor(Math.random() * messages.length)];

    // Verificar si la bienvenida está activada
    if (chat.welcome) {
      if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        let bienvenida = getRandomMessage(welcomeMessages);
        console.log("Enviando mensaje de bienvenida:", bienvenida);  // Depuración
        await conn.sendMessage(m.chat, { text: bienvenida, mentions: [who] });
      } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
        let bye = getRandomMessage(goodbyeMessages);
        console.log("Enviando mensaje de despedida:", bye);  // Depuración
        await conn.sendMessage(m.chat, { text: bye, mentions: [who] });
      }
    }

    return true;
  } catch (error) {
    console.error("Error en el proceso de bienvenida/despedida:", error);
    return false;
  }
}
