var handler = async (m, { conn, isBotAdmin }) => {
    try {
        let group = m.chat;

        // Omitir la restricción de banchat para este comando
        if (global.db.data.chats[group]?.isBanned) {
            global.db.data.chats[group].isBanned = false;
        }

        // Intentar obtener el enlace
        let link = await conn.groupInviteCode(group).catch(() => null);
        if (!link) {
            return conn.reply(m.chat, '*⚠️ No se pudo generar el enlace. Es posible que el grupo tenga restricciones.*', m);
        }

        // Enviar el enlace con formato mejorado
        let mensaje = `✿:･✧ *Link del Grupo* ✧･:✿\n\n` +
                      `🔗 *Enlace:* https://chat.whatsapp.com/${link}\n\n` +
                      `📢 *Nota:* Si el enlace no funciona, verifique si el grupo permite nuevas invitaciones.`;
        conn.reply(m.chat, mensaje.trim(), m, { detectLink: true });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '*⚠️ Ocurrió un error al intentar obtener el enlace del grupo.*', m);
    }
};

// Se quita la restricción de banchat SOLO en este comando
handler.help = ['link'];
handler.tags = ['grupo'];
handler.command = ['link', 'enlace'];
handler.group = true;
handler.botAdmin = true;
handler.restrict = false;
handler.rowner = false;
handler.mods = false;
handler.admin = false;
handler.private = false;

export default handler;
