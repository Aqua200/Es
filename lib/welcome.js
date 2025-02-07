import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  // Usamos cadenas fijas en lugar de "em"
  let top = "*╭─⫍📢⫎─╮*\n";
  let bottom = "\n*╰─⫍📢⫎─╯*";
  
  // Asegúrate de que global.db.data.chats esté definido y tenga la configuración adecuada para este chat
  let chat = global.db.data.chats[m.chat];
  
  // Estructura para el mensaje de contacto (usada para citar el mensaje)
  let fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  // 20 mensajes de bienvenida (rellena o ajusta según tus necesidades)
  const welcomeMessages = [
    "🥳 ¡Bienvenid@ @user! Disfruta de tu estancia en *group* 🎉",
    "¡Hola @user! 👋 Bienvenid@ a *group*. ¡A divertirse! 🎈",
    "@user se unió a *group* 🎊 ¡Qué emoción! 🎉",
    "🎉 ¡Nuevo miembro! @user, bienvenid@ a *group* 🥳",
    "🎊 ¡Bienvenid@ @user! Esperamos que tu tiempo en *group* sea increíble 🤩",
    "👋 ¡Hola @user! Bienvenid@ a *group*. ¡Esperamos que disfrutes! 🥳",
    "🌟 @user se ha unido a *group*. ¡Bienvenid@ y a pasarla genial!",
    "🚀 @user ha aterrizado en *group*! ¡Que empiece la diversión!",
    "🎈 @user ya es parte de *group*. ¡Bienvenid@!",
    "💫 ¡Bienvenid@ @user a *group*! Que disfrutes cada momento.",
    "🌈 @user llegó a *group*. ¡Te damos la bienvenida!",
    "🍀 ¡Hola @user! Te damos la bienvenida a *group*!",
    "💥 ¡Bienvenid@ @user! Estamos felices de tenerte en *group*.",
    "🎆 @user se unió a *group*. ¡Que la fiesta comience!",
    "😃 ¡Hola @user! Bienvenid@ a *group*. ¡A disfrutar!",
    "👏 ¡Bienvenid@ @user! Gracias por unirte a *group*.",
    "🎊 @user ya está en *group*. ¡Esperamos que te diviertas!",
    "🛬 @user aterrizó en *group*. ¡Bienvenid@ a bordo!",
    "🌟 ¡Nuevo integrante! @user se unió a *group*.",
    "🔥 ¡Bienvenid@ @user! *group* te espera con emoción."
  ];

  // 20 mensajes de despedida (cuando un miembro abandona voluntariamente)
  const leaveMessages = [
    "👋 @user ha abandonado el grupo *group* 😢",
    "😞 @user se fue de *group*. ¡Hasta luego! 👋",
    "🖐️ @user ha dejado *group*. ¡Nos veremos pronto! 👋",
    "🚪 @user se ha ido de *group* 😔 ¡Suerte!",
    "💔 @user se despidió de *group* 😞 ¡Te extrañaremos!",
    "👋 @user se fue de *group*. ¡Hasta pronto! 🌟",
    "😢 Lamentamos que @user haya dejado *group*. ¡Adiós!",
    "🙋‍♂️ @user se despidió de *group* hoy, le deseamos lo mejor.",
    "✋ @user se ha marchado de *group*. ¡Buena suerte en tus nuevos caminos!",
    "🚶‍♀️ @user abandonó *group*. ¡Esperamos verte pronto!",
    "💤 @user se fue de *group*. ¡Descansa y cuídate!",
    "🌅 @user se despidió de *group* hoy, que tengas un buen día.",
    "🏃‍♂️ @user se fue corriendo de *group*. ¡Nos veremos en otra ocasión!",
    "🛫 @user ha partido de *group*. ¡Buen viaje!",
    "🌌 @user se ha despedido de *group*. ¡Siempre te recordaremos!",
    "💔 @user se fue y deja un gran vacío en *group*.",
    "🙏 @user nos dijo adiós en *group*. ¡Te deseamos lo mejor!",
    "👣 @user dejó *group* tras dejar huella.",
    "🍂 @user se marchó de *group* como la brisa de otoño.",
    "🌻 @user se despidió de *group*. ¡Que florezca tu camino!"
  ];

  // 20 mensajes de expulsión (cuando un miembro es removido por un administrador)
  const kickMessages = [
    "☠️ @user fue expulsad@ de *group* 🚷",
    "🚫 @user fue eliminado de *group* ❌",
    "⚠️ @user ha sido removid@ del grupo *group* 👋",
    "❌ @user fue expulsad@ de *group* 😔",
    "🚷 @user fue removid@ de *group* 😞",
    "📛 @user ya no es parte de *group* 😓",
    "👮 @user fue expulsad@ por incumplir las reglas de *group*.",
    "🛑 @user fue removid@ de *group*. Las reglas son claras.",
    "🔨 @user fue expulsad@ de *group* por mal comportamiento.",
    "🚨 @user ha sido banead@ de *group*.",
    "💣 @user fue eliminado de *group* tras repetidas infracciones.",
    "📢 @user fue removid@ de *group* por los administradores.",
    "🗑️ @user fue echad@ de *group*.",
    "⚡ @user ha sido expulsad@ de *group*.",
    "🌀 @user fue removid@ de *group* sin remedio.",
    "⛔ @user ya no pertenece a *group*.",
    "💀 @user fue expulsad@ de *group* permanentemente.",
    "🔒 @user ha sido removid@ de *group*.",
    "🔕 @user ya no se encuentra en *group*.",
    "🧹 @user fue barrid@ fuera de *group*."
  ];

  // Manejo de bienvenida (suponiendo que m.messageStubType === 27 indica bienvenida)
  if (chat.bienvenida && m.messageStubType === 27) {
    let user = `@${m.messageStubParameters[0].split('@')[0]}`;
    let welcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    await conn.reply(
      m.chat,
      top + welcome.replace('@user', user).replace('*group*', groupMetadata.subject) + bottom,
      fkontak
    );
  }

  // Manejo de salida (m.messageStubType === 28)
  if (chat.bienvenida && m.messageStubType === 28) {
    let user = `@${m.messageStubParameters[0].split('@')[0]}`;
    let bye = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];
    await conn.reply(
      m.chat,
      top + bye.replace('@user', user).replace('*group*', groupMetadata.subject) + bottom,
      fkontak
    );
  }

  // Manejo de expulsión (m.messageStubType === 32)
  if (chat.bienvenida && m.messageStubType === 32) {
    let user = `@${m.messageStubParameters[0].split('@')[0]}`;
    let kick = kickMessages[Math.floor(Math.random() * kickMessages.length)];
    await conn.reply(
      m.chat,
      top + kick.replace('@user', user).replace('*group*', groupMetadata.subject) + bottom,
      fkontak
    );
  }
}
