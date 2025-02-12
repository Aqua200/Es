import WAMessageStubType from '@whiskeysockets/baileys'; // Usar import en lugar de require

/**
 * Esta función maneja los eventos de cambios en el grupo (nombre, imagen, enlace, etc.).
 * Se encarga de enviar mensajes automáticos cuando estos eventos ocurren.
 * 
 * @param {Object} m - El mensaje de WhatsApp que contiene la información del evento.
 * @param {Object} conn - La conexión de Baileys para enviar mensajes.
 * @param {Object} participants - Los participantes del grupo.
 * @param {Object} groupMetadata - Los metadatos del grupo.
 */
export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return;

    const userId = m.sender.split('@')[0]; // Extraer el ID de usuario
    const usuario = `@${userId}`;
    let pp;

    try {
        pp = await conn.profilePictureUrl(m.chat, 'image'); // Obtener la foto de perfil
    } catch (error) {
        console.error('Error al obtener la foto de perfil:', error);
        pp = 'https://files.catbox.moe/xr2m6u.jpg'; // Foto predeterminada
    }

    const fkontak = {
        "key": { "participants": "0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${userId}:${userId}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    };

    let chat = global.db.data.chats[m.chat];
    
    // Definir los mensajes para diferentes tipos de eventos
    const messages = {
        21: `*${usuario}*\n🍡 Ha cambiado el nombre del grupo.\n\n🪷 Ahora el grupo se llama:\n*<${m.messageStubParameters[0]}>*...`,
        22: { image: { url: pp }, caption: `*${usuario}*\n🍡 Ha cambiado la imagen del grupo...` },
        23: `🍡 El enlace del grupo ha sido restablecido por:\n*» ${usuario}*...`,
        25: `*${usuario}*\n🪷 Ha permitido que ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo...`,
        26: `🍡 El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado 🔒*' : '*abierto 🔓*'} Por *${usuario}*\n\n🪷 Ahora ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensaje...`,
        29: `*@${m.messageStubParameters[0].split`@`[0]}* Ahora es admin del grupo 🦄\n\n🍡 Acción hecha por:\n*» ${usuario}*...`,
        30: `*@${m.messageStubParameters[0].split`@`[0]}* Deja de ser admin del grupo 🦄\n\n🍡 Acción hecha por:\n*» ${usuario}*...`
    };

    // Verificar y enviar el mensaje correspondiente según el tipo de evento
    if (chat.detect && messages[m.messageStubType]) {
        const messageContent = messages[m.messageStubType];
        if (messageContent.image) {
            await conn.sendMessage(m.chat, messageContent, { quoted: fkontak });
        } else {
            await conn.sendMessage(m.chat, { text: messageContent, mentions: [m.sender] }, { quoted: fkontak });
        }
    } else {
        // Si el tipo de mensaje no es compatible, puedes agregar una respuesta para depuración
        // const unsupportedMessageType = `🍡 El tipo de mensaje no es compatible.`;
        // await conn.sendMessage(m.chat, { text: unsupportedMessageType, mentions: [m.sender] }, { quoted: fkontak });
    }
}
