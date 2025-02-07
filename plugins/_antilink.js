let linkRegex     = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1    = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;
let facebookLink  = /facebook\.com\/[^\s]+/i;
let instagramLink = /instagram\.com\/[^\s]+/i;
let tiktokLink    = /tiktok\.com\/[^\s]+/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return;
  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  let chat    = global.db.data.chats[m.chat];
  let delet   = m.key.participant;
  let bang    = m.key.id;
  const user  = `@${m.sender.split`@`[0]}`;
  const groupAdmins = participants.filter(p => p.admin);
  let bot     = global.db.data.settings[this.user.jid] || {};

  // Detectar enlaces prohibidos
  const isGroupLink     = linkRegex.exec(m.text) || linkRegex1.exec(m.text);
  const isFacebookLink  = facebookLink.exec(m.text);
  const isInstagramLink = instagramLink.exec(m.text);
  const isTiktokLink    = tiktokLink.exec(m.text);

  // Si se detecta cualquier enlace prohibido y el usuario no es admin:
  if (chat.antiLink && (isGroupLink || isFacebookLink || isInstagramLink || isTiktokLink) && !isAdmin) {
    if (isBotAdmin) {
      // 1. Eliminar el mensaje que contiene el enlace
      await conn.sendMessage(m.chat, { 
        delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } 
      });
      // 2. Eliminar al usuario del grupo al instante
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      // 3. Notificar en el grupo
      await conn.sendMessage(m.chat, {
        text: `*「 ENLACE DETECTADO 」*\n\n${user} ha sido eliminado instantáneamente por compartir un enlace no permitido.`,
      }, { quoted: m });
    } else {
      // Si el bot no es admin, notificar a los administradores
      return conn.sendMessage(m.chat, {
        text: `✦ El antilink está activo pero no puedo eliminarte porque no soy admin.`,
        mentions: groupAdmins.map(v => v.id)
      }, { quoted: m });
    }
  }
  return !0;
} 
