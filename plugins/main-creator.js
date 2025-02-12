let handler = async (m, { conn, usedPrefix, isOwner }) => {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN: Creador Anika;;\nFN:Creador Anika\nORG:Creador Anika\nTITLE:\nitem1.TEL;waid=526631079388:526631079388\nitem1.X-ABLabel:Creador anika\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Creador Anika\nEND:VCARD`
    await conn.sendMessage(m.chat, { contacts: { displayName: 'おNeykoor', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño']

export default handler
