let handler = async (m, { conn, usedPrefix, isOwner }) => {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN: Creador Anika;;\nFN:Creador Anika\nORG:Creador Anika\nTITLE:Creador de Anika\nitem1.TEL;waid=526631079388:526631079388\nitem1.X-ABLabel:creador anika\nitem2.EMAIL;type=INTERNET:creador@anika.com\nitem2.X-ABLabel:Correo Electrónico\nitem3.URL:http://www.anika.com\nitem3.X-ABLabel:Sitio Web\nitem4.URL:https://www.anika.com/creadoranika\nitem4.X-ABLabel:Instagram\nX-WA-BIZ-DESCRIPTION:anika Bot es un bot de WhatsApp que ofrece diversas funciones como respuestas automáticas, comandos personalizados y entretenimiento. ¡Interacción fácil y rápida!\nX-WA-BIZ-NAME:Creador Anika\nEND:VCARD`
    
    // Enviar el mensaje con los detalles
    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: 'Creador Anika',
            contacts: [{ vcard }]
        }
    }, {quoted: m});
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño']

export default handler
