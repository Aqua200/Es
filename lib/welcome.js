const generateMessage = (type, { name, group }) => {
    const welcomeMessages = [
        `¡Bienvenido/a ${name}! 🎉 Disfruta tu estancia en ${group}.`,
        `¡Hey ${name}! 😃 Acabas de entrar a ${group}. ¡Pásala bien!`,
        `${name} ha llegado a ${group}, ¡espero que traigas memes! 😂`,
        `¡Hola ${name}! 🌟 Bienvenido/a a ${group}, aquí somos una gran familia.`,
        `🎊 ¡${name} se unió a la fiesta en ${group}! Que empiece la diversión.`,
        `¡${name} ha aterrizado en ${group}! 🚀 Disfruta el viaje.`,
        `👋 ¡Bienvenido/a, ${name}! Esperamos que tu estancia en ${group} sea épica.`,
        `¡${name} llegó al mejor grupo: ${group}! 🤩 Bienvenido/a.`,
        `Bienvenido/a ${name} a ${group}. ¡No olvides leer las reglas! 📜`,
        `🌟 ${name} se ha unido a ${group}. ¡Pásalo genial con nosotros!`,
        `¡${name} ha entrado en el mundo de ${group}! 🌍 ¡Disfruta la estadía!`,
        `Bienvenido/a ${name}! 🎶 En ${group} siempre hay buen ambiente.`,
        `🛬 ${name} ha aterrizado en ${group}. ¡Listo para la aventura!`,
        `¡${name} se ha unido a ${group}! 🚀 La diversión está asegurada.`,
        `🎉 ¡Nuevo miembro! ${name} ha llegado a ${group}.`,
        `¡Hola, ${name}! 😊 Pásala increíble en ${group}.`,
        `🌟 ${name} ahora es parte de ${group}. ¡A disfrutar!`,
        `¡${name} ha llegado! 💃 Bienvenido/a a ${group}.`,
        `🎊 ¡${name} ahora está en ${group}! Bienvenido/a.`,
        `¡${name} ha entrado en ${group}! Que la buena vibra te acompañe. ✨`
    ];

    const leaveMessages = [
        `😢 ${name} ha salido de ${group}. ¡Buena suerte!`,
        `Adiós, ${name} 👋. Esperamos verte de nuevo en ${group}.`,
        `¡${name} se ha ido de ${group}! 🏃💨 ¡Hasta pronto!`,
        `🔚 ${name} ha dejado el grupo ${group}.`,
        `🎭 ${name} se ha marchado de ${group}, ¿volverá algún día?`,
        `🏃💨 ${name} se ha ido de ${group}. ¡Que le vaya bien!`,
        `💔 ${name} abandonó ${group}. ¡Te extrañaremos!`,
        `🛫 ${name} ha despegado fuera de ${group}. ¡Buen viaje!`,
        `🎤 ${name} dejó ${group} y se fue sin decir adiós...`,
        `😞 ${name} ya no está en ${group}. ¡Esperamos verte de nuevo!`,
        `⏳ ${name} ha dejado el chat de ${group}.`,
        `🌪️ ${name} desapareció de ${group}. ¡Hasta nunca o hasta luego!`,
        `🚪 ${name} se ha ido de ${group}. ¿Volverá?`,
        `💨 ${name} ha salido del grupo ${group}.`,
        `📴 ${name} se ha desconectado de ${group}.`,
        `🚶‍♂️ ${name} se fue de ${group}. ¿Quién será el siguiente?`,
        `💀 ${name} ya no está entre nosotros en ${group}.`,
        `🔕 ${name} ha silenciado su presencia en ${group}.`,
        `🙃 ${name} dejó el grupo sin decir nada...`,
        `📉 ${name} ha salido de ${group}. Bajamos un miembro.`
    ];

    const removeMessages = [
        `🛑 ${name} ha sido eliminado de ${group}.`,
        `🚫 ${name} fue removido de ${group}.`,
        `🔨 ${name} fue expulsado de ${group}. ¡Ups!`,
        `👮 ${name} ha sido removido. ¡No rompan las reglas!`,
        `📢 ${name} fue echado de ${group}.`,
        `💣 ${name} ha sido eliminado. Algo hizo mal...`,
        `⚠️ ${name} fue removido de ${group}.`,
        `🗑️ ${name} fue sacado del grupo ${group}.`,
        `❌ ${name} ha sido eliminado por la administración.`,
        `🚷 ${name} ya no pertenece a ${group}.`,
        `💀 ${name} fue baneado de ${group}.`,
        `🤐 ${name} fue removido. Parece que habló de más...`,
        `🔥 ${name} fue expulsado de ${group}. Que arda el drama. 😈`,
        `🔫 ${name} fue eliminado. Se acabó la paciencia.`,
        `📛 ${name} ya no está en ${group}. Fue removido.`,
        `🚨 ${name} fue removido. No preguntes por qué...`,
        `⚰️ ${name} fue removido de ${group}. Descanse en paz.`,
        `👀 ${name} ya no está en ${group}. ¿Qué habrá pasado?`,
        `💀 ${name} fue eliminado. La justicia ha hablado.`,
        `🌀 ${name} se fue... por la fuerza.`
    ];

    let messages;
    switch (type) {
        case 'welcome':
            messages = welcomeMessages;
            break;
        case 'leave':
            messages = leaveMessages;
            break;
        case 'remove':
            messages = removeMessages;
            break;
        default:
            return '';
    }

    return messages[Math.floor(Math.random() * messages.length)];
};

// Exportar la función
module.exports = generateMessage;
