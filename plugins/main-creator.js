let handler = async (m, { conn, usedPrefix, isOwner }) => {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN: Creador Anika;;\nFN:Creador Anika\nORG:Creador Anika\nTITLE:Creador de Anika\nitem1.TEL;waid=526631079388:526631079388\nitem1.X-ABLabel:creador anika\nitem2.EMAIL;type=INTERNET:creador@anika.com\nitem2.X-ABLabel:Correo Electrónico\nitem3.URL:http://www.Anika.com\nitem3.X-ABLabel:Sitio Web\nX-WA-BIZ-DESCRIPTION:Anika Bot es un bot de WhatsApp que ofrece diversas funciones para automatización y entretenimiento.\nX-WA-BIZ-NAME:Creador Anika\nEND:VCARD`
    
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
