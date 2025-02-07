import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]

  // Mensajes de bienvenida
  const welcomeMessages = [
    `🌸 *¡Bienvenido* a la familia de ${groupMetadata.subject}*\n✨ *Hola, ${taguser}!*\n💖 *Nos alegra mucho tenerte aquí.*\n🌟 *¡Disfruta y si necesitas ayuda, escribe #help!*`,
    `🎉 *Un nuevo miembro ha llegado a ${groupMetadata.subject}*!\n💫 *Bienvenido, ${taguser}!* Nos alegra tenerte con nosotros.\n✨ *¡Aquí te sentirás como en casa!*`,
    `🌼 *Bienvenido* al grupo, ${taguser}!\n💖 *Tu presencia hace a ${groupMetadata.subject} aún mejor.*\n🌟 *Recuerda usar #help para conocer los comandos.*`,
    `🌹 *¡Hola, ${taguser}!* 👋\n✨ *Bienvenido a ${groupMetadata.subject}*, tu nueva familia.\n🌺 *Aquí disfrutarás de buenos momentos. ¡Que lo pases genial!*`,
    `💐 *Bienvenido a bordo, ${taguser}!* 🎉\n✨ *En ${groupMetadata.subject} te tenemos un lugar especial.*\n🌻 *¡Disfruta y si tienes dudas, siempre puedes escribir #help!*`,
    `🌻 *¡Bienvenida/o a ${groupMetadata.subject}, ${taguser}!* 🎉\n💖 *Esperamos que disfrutes cada momento aquí.*\n💫 *Si necesitas ayuda, usa #help.*`,
    `✨ *Bienvenido/a, ${taguser}!* 🌸\n🌼 *Gracias por unirte a ${groupMetadata.subject}*. Aquí aprenderás, compartirás y disfrutarás.\n💖 *¡Diviértete!*`,
    `🌟 *Hola, ${taguser}!* 🌸\n💖 *Qué alegría tenerte en ${groupMetadata.subject}*. Aquí encontrarás muchos amigos.\n🌺 *¡Bienvenido y no dudes en escribir #help!*`,
    `🌿 *Un nuevo miembro se une a ${groupMetadata.subject}*: ${taguser} 🎉\n💫 *Estamos felices de tenerte aquí.*\n💖 *Si tienes alguna duda, #help es tu amigo.*`,
    `🎀 *¡Bienvenido, ${taguser}!* ✨\n🌼 *Nos encanta tenerte en ${groupMetadata.subject}.*\n🌸 *¡A disfrutar y no olvides usar #help si necesitas algo!*`,
    `🌸 *Hola, ${taguser}!* Bienvenido/a a la comunidad de ${groupMetadata.subject}.\n🌟 *Te esperamos con los brazos abiertos.*\n💖 *Escribe #help para más información.*`,
    `🎉 *Bienvenido a ${groupMetadata.subject}*, ${taguser}! 🎉\n🌼 *Te invitamos a disfrutar de este espacio.*\n💫 *Si tienes alguna pregunta, #help te guiará.*`,
    `🌟 *¡Saludos, ${taguser}! Bienvenido a ${groupMetadata.subject}* 🎉\n🌸 *Esperamos que te diviertas y disfrutes el grupo.*\n✨ *Recuerda que puedes usar #help.*`,
    `🌺 *Bienvenido a ${groupMetadata.subject}, ${taguser}!* ✨\n💖 *Estamos emocionados de tenerte aquí.*\n🌸 *¡No dudes en pedir ayuda usando #help si lo necesitas!*`,
    `🌷 *Bienvenida/o a ${groupMetadata.subject}*, ${taguser}! 🌼\n🌟 *Aquí te sentirás bienvenido/a.*\n💖 *Recuerda que puedes usar #help en cualquier momento.*`,
    `🌻 *Un gran saludo a ${taguser}* 🎉\n✨ *Nos alegra mucho tenerte en ${groupMetadata.subject}.*\n🌸 *¡Que disfrutes del grupo y si necesitas algo, usa #help!*`,
    `💖 *Bienvenido a ${groupMetadata.subject}, ${taguser}!* 🌼\n✨ *Nos encanta que estés con nosotros.*\n🌸 *Disfruta y no olvides que #help está para ti.*`,
    `🌼 *¡Hola, ${taguser}!* 🌸\n🎉 *Bienvenido a ${groupMetadata.subject}.* Estamos felices de que formes parte de nuestro grupo.\n💖 *Escribe #help si tienes alguna pregunta.*`,
    `🌿 *Bienvenida/o, ${taguser}!* 🌸\n🎉 *Te damos la bienvenida a ${groupMetadata.subject}.*\n💖 *Aquí estarás rodeado/a de buenos amigos y momentos increíbles.*`,
    `🎉 *Un nuevo capítulo comienza con ${taguser} en ${groupMetadata.subject}!* 🌟\n🌸 *Nos alegra mucho tu llegada.*\n💖 *Recuerda que #help está para asistirte en lo que necesites.*`
  ];

  // Mensajes de despedida
  const goodbyeMessages = [
    `🍂 *Adiós, ${taguser}* 😢\n🌻 *Te deseamos lo mejor en tu camino.*\n💖 *Gracias por haber sido parte de ${groupMetadata.subject}.*\n✨ *Te esperamos pronto.*`,
    `🌸 *Adiós, ${taguser}* 💖\n🌺 *Nos entristece verte ir, pero te deseamos lo mejor.*\n🌼 *Gracias por ser parte de ${groupMetadata.subject}*.\n✨ *Vuelve cuando quieras.*`,
    `💐 *Adiós, ${taguser}* 🌿\n✨ *Esperamos que te haya ido bien en tu tiempo en ${groupMetadata.subject}.*\n🌸 *Te extrañaremos y esperamos verte pronto.*`,
    `🌻 *Hasta luego, ${taguser}!* 💖\n✨ *Te agradecemos por haberte unido a ${groupMetadata.subject}.*\n🌸 *Siempre serás bienvenido de vuelta.*`,
    `🍃 *Nos despedimos de ti, ${taguser}.* 😢\n🌼 *Esperamos verte pronto en ${groupMetadata.subject}.*\n🌷 *Te deseamos lo mejor en lo que sigas.*`,
    `🌸 *Hasta pronto, ${taguser}!* 💖\n✨ *Gracias por ser parte de ${groupMetadata.subject}.*\n🌺 *Nos encantaría verte regresar pronto.*`,
    `🌻 *Adiós, ${taguser}* 🌟\n💖 *Te deseamos lo mejor en tus nuevos caminos.*\n✨ *Te recordaremos siempre en ${groupMetadata.subject}.*`,
    `🌼 *Nos despedimos de ti, ${taguser}* 😢\n💖 *Gracias por tu tiempo con nosotros en ${groupMetadata.subject}.*\n🌸 *Te esperamos con los brazos abiertos cuando quieras regresar.*`,
    `🌺 *Bye, ${taguser}* 💖\n🌷 *Te vamos a extrañar en ${groupMetadata.subject}.*\n✨ *Recuerda que siempre serás bienvenido/a.*`,
    `🌿 *Nos dices adiós, ${taguser}?* 💖\n✨ *Esperamos que te vaya de maravilla.*\n🌸 *Nos alegra haberte tenido con nosotros.*`,
    `💐 *¡Adiós, ${taguser}!* 🎉\n🌺 *Gracias por tu tiempo en ${groupMetadata.subject}.*\n✨ *Siempre habrá un lugar para ti aquí.*`,
    `🌻 *Adiós, ${taguser}* 🌸\n💖 *Te deseamos todo lo mejor.*\n🌼 *Siempre serás bienvenido en ${groupMetadata.subject}.*`,
    `🍂 *Hasta luego, ${taguser}* 😢\n🌸 *Te extrañaremos, pero siempre tendrás un lugar en ${groupMetadata.subject}.*\n✨ *Regresa cuando quieras.*`,
    `🌷 *Te despedimos con cariño, ${taguser}* 💖\n🌼 *Te deseamos lo mejor en tu camino.*\n💖 *Te esperamos de vuelta en ${groupMetadata.subject}.*`,
    `🌸 *Te despedimos, ${taguser}* 😢\n💖 *Gracias por haberte unido a ${groupMetadata.subject}.*\n✨ *Te deseamos lo mejor en todo.*`,
    `🌺 *Hasta pronto, ${taguser}* 💖\n✨ *Nos encantó tenerte en ${groupMetadata.subject}.*\n🌷 *Vuelve pronto, siempre serás bienvenido/a.*`,
    `🌼 *Adiós, ${taguser}* 😢\n💖 *Te deseamos lo mejor en lo que emprendas.*\n✨ *Recuerda que siempre tendrás un hogar aquí en ${groupMetadata.subject}.*`,
    `💖 *Adiós, ${taguser}* 🌸\n✨ *Te agradecemos por tu tiempo en ${groupMetadata.subject}.*\n🌼 *Te esperamos con los brazos abiertos cuando quieras volver.*`,
    `🌿 *Te decimos adiós, ${taguser}* 💖\n🌷 *Te vamos a extrañar en ${groupMetadata.subject}.*\n✨ *Te deseamos todo lo mejor.*`
  ];

  // Función para seleccionar un mensaje aleatorio
  const getRandomMessage = (messages) => messages[Math.floor(Math.random() * messages.length)];

  if (chat.welcome) {
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = getRandomMessage(welcomeMessages);
      await conn.sendMessage(m.chat, { text: bienvenida, mentions: [who] });
    } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      let bye = getRandomMessage(goodbyeMessages);
      await conn.sendMessage(m.chat, { text: bye, mentions: [who] });
    }
  }

  return true;
}
