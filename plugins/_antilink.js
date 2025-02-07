let linkRegex   = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1  = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;
let facebookLink  = /facebook\.com\/[^\s]+/i;
let instagramLink = /instagram\.com\/[^\s]+/i;
let tiktokLink    = /tiktok\.com\/[^\s]+/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return;
  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  let chat = global.db.data.chats[m.chat];
  let delet = m.key.participant;
  let bang = m.key.id;
  const user = `@${m.sender.split`@`[0]}`;
  const groupAdmins = participants.filter(p => p.admin);
  let bot = global.db.data.settings[this.user.jid] || {};

  // Detectar enlaces de grupo y redes sociales
  const isGroupLink   = linkRegex.exec(m.text) || linkRegex1.exec(m.text);
  const isFacebookLink  = facebookLink.exec(m.text);
  const isInstagramLink = instagramLink.exec(m.text);
  const isTiktokLink    = tiktokLink.exec(m.text);

  const grupo = `https://chat.whatsapp.com`;

  // Si el mensaje contiene el enlace del grupo y es admin, se ignora
  if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
    return m.reply(`✦ El antilink está activo pero te salvaste por ser admin.`);
  }

  // Si se detecta algún enlace prohibido y el usuario no es admin
  if (chat.antiLink && (isGroupLink || isFacebookLink || isInstagramLink || isTiktokLink) && !isAdmin) {

    // Si el enlace es el del grupo actual, no hacer nada
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return !0;
    }

    if (isBotAdmin) {
      // 1. Eliminar el mensaje ofensivo
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
      // 2. Eliminar al usuario del grupo al instante
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      // 3. Notificar en el grupo que se realizó la eliminación
      await conn.sendMessage(m.chat, {
        text: `*「 ENLACE DETECTADO 」*\n\n${user} ha sido eliminado instantáneamente por compartir un enlace no permitido.`,
      }, { quoted: m });
    } else {
      // Si el bot no es admin, se notifica a los administradores
      return conn.sendMessage(m.chat, {
        text: `✦ El antilink está activo pero no puedo eliminarte porque no soy admin.`,
        mentions: groupAdmins.map(v => v.id)
      }, { quoted: m });
    }
  }
  return !0;
}
