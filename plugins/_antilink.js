let linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i

export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;
  let chat = global.db.data.chats[m.chat];
  let delet = m.key.participant;
  let bang = m.key.id;
  let bot = global.db.data.settings[this.user.jid] || {};
  const isGroupLink = linkRegex.exec(m.text);
  const grupo = `https://chat.whatsapp.com`;

  // Si el admin envía un enlace de grupo, le dejamos pasar
  if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
    return conn.reply(m.chat, `🏷 *Hey!! el anti link esta activo pero eres admin, ¡salvado!*`, m);
  }

  // Si está activado el antiLink y se detecta un enlace, procedemos
  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      // Asegurarse de que no es el enlace del grupo
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return !0;
    }

    // Informar al usuario que ha enviado un enlace prohibido
    await conn.reply(m.chat, `📎 *¡Enlace detectado!*\n\n*${await this.getName(m.sender)} mandaste un enlace prohibido por lo cual seras eliminado*`, m);

    // Si el bot no es admin, no puede eliminar al usuario
    if (!isBotAdmin) {
      return conn.reply(m.chat, `🌼 *No soy admin, no puedo eliminar intrusos*`, m);
    }

    // Eliminar el mensaje con el enlace
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});

    // Expulsar al usuario del grupo
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
  }

  return !0;
}
