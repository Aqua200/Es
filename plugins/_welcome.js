import { WAMessageStubType } from '@whiskeysockets/baileys';
import axios from 'axios';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;
  
  let chat = global.db.data.chats[m.chat];
  if (!chat.bienvenida) return;

  let user = `@${m.messageStubParameters[0].split`@`[0]}`;
  let groupName = groupMetadata.subject;
  
  // Tiempo de espera configurable
  let timerDelay = chat.timerDelay || 300000; // Valor por defecto: 5 minutos (300,000 ms)

  // Descargar imagen solo si es necesario
  let imgBuffer = null;
  try {
    let ppUrl = await conn.profilePictureUrl(m.messageStubParameters[0], 'image');
    let response = await axios.get(ppUrl, { responseType: 'arraybuffer' });
    imgBuffer = Buffer.from(response.data);
  } catch {
    imgBuffer = null;
  }

  const sendMessage = async (text) => {
    let messageOptions = { 
      image: imgBuffer, 
      mimetype: 'image/jpeg', 
      caption: text, 
      mentions: [m.messageStubParameters[0]] 
    };
    await conn.sendMessage(m.chat, messageOptions);
  };

  // Descripciones personalizadas
  const customDescriptions = [
    `¡Un grupo donde la diversión nunca termina! 🎉`,
    `Aquí compartimos buenos momentos y risas. 😄`,
    `Bienvenido a *${groupName}*, donde la comunidad es lo más importante. 🤝`,
    `Disfruta tu estadía en *${groupName}*, aquí todos somos familia. 💙`,
    `Este grupo es un espacio para aprender, compartir y crecer juntos. 📚✨`
  ];
  
  // Mensajes personalizados
  const welcomeMessages = [
    `¡Bienvenido, ${user}! 🎉 ${customDescriptions[Math.floor(Math.random() * customDescriptions.length)]}`,
    `🎊 ¡${user} ha llegado! Pásala bien en *${groupName}*. ${customDescriptions[Math.floor(Math.random() * customDescriptions.length)]}`,
    `¡Hey ${user}, qué gusto tenerte en *${groupName}*! ${customDescriptions[Math.floor(Math.random() * customDescriptions.length)]}`,
    `Bienvenido ${user}, recuerda ser respetuoso y disfrutar el grupo 😉. ${customDescriptions[Math.floor(Math.random() * customDescriptions.length)]}`,
  ];
  
  const leftMessages = [
    `Adiós ${user}, esperamos verte pronto 👋`,
    `¡${user} ha salido de *${groupName}*! 😢`,
    `Lamentamos que te vayas, ${user}. ¡Éxito en todo!`,
    `Hasta luego ${user}, el grupo no será lo mismo sin ti 😔`,
  ];

  const kickedMessagesSerious = [
    `🚨 ¡${user} ha sido eliminado de *${groupName}*!`,
    `🔴 ${user} ha sido removido por un administrador.`,
    `Un moderador ha decidido expulsar a ${user}. Respetemos las reglas.`,
  ];

  const kickedMessagesFunny = [
    `💀 ${user} fue eyectado del grupo. ¡Sayonara!`,
    `🎭 ${user} intentó escapar, pero fue eliminado primero.`,
    `👮‍♂️ ${user} ha sido arrestado y removido del grupo.`,
  ];

  if (m.messageStubType == 27) { // Usuario añadido
    let welcome = chat.sWelcome || welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    await sendMessage(welcome);

    // Temporizador para enviar un mensaje extra después del tiempo configurable
    setTimeout(async () => {
      let followUpMessages = [
        `¡Hola ${user}! No olvides presentarte con los demás. 🤝`,
        `Recuerda leer las reglas y participar en *${groupName}*. ¡Bienvenido!`,
        `Esperamos verte activo en *${groupName}*, ${user}. ¡Únete a la conversación! 🗣️`,
      ];
      let followUp = followUpMessages[Math.floor(Math.random() * followUpMessages.length)];
      await sendMessage(followUp);
    }, timerDelay); // Tiempo configurable

    // Encuesta automática después de 10 minutos
    setTimeout(async () => {
      let surveyMessage = `Encuesta de bienvenida para ${user}:\n\n¿Qué te trae al grupo?\n1. Conocer gente\n2. Aprender\n3. Solo curiosidad`;
      await sendMessage(surveyMessage);
    }, 600000); // 10 minutos (600,000 ms)
  }

  if (m.messageStubType == 28) { // Usuario salió voluntariamente
    let bye = chat.sBye || leftMessages[Math.floor(Math.random() * leftMessages.length)];
    await sendMessage(bye);
  }

  if (m.messageStubType == 32) { // Usuario fue eliminado
    let reason = chat.kickReason || "";
    let kickedMessage = Math.random() < 0.5 
      ? kickedMessagesSerious[Math.floor(Math.random() * kickedMessagesSerious.length)] 
      : kickedMessagesFunny[Math.floor(Math.random() * kickedMessagesFunny.length)];

    if (reason) {
      kickedMessage += `\n📌 Razón: ${reason}`;
    }

    await sendMessage(kickedMessage);
  }
}
