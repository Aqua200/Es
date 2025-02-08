import fetch from 'node-fetch'

// Definir las variables faltantes
const botname = "Onyx Bot"; // Nombre del bot
const textbot = "Bienvenido a Onyx Bot"; // Texto del cuerpo
const canal = "https://t.me/OnyxChannel"; // URL del canal
const catalogo = 'https://qu.ax/sKZrP.jpg'; // Imagen de catálogo

export async function before(m, { conn }) {
    let img = catalogo;

    global.fake = {
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "",
                serverMessageId: 100,
                newsletterName: '「  Anika-News  」',
            },
            externalAdReply: {
                showAdAttribution: true,
                title: botname,
                body: 'Hola',
                mediaUrl: null,
                description: null,
                previewType: "PHOTO",
                thumbnailUrl: 'https://qu.ax/sKZrP.jpg',
                sourceUrl: canal,
                mediaType: 1,
                renderLargerThumbnail: false
            },
        },
    };

    global.adReply = {
        contextInfo: {
            forwardingScore: 9999,
            isForwarded: false,
            externalAdReply: {
                showAdAttribution: true,
                title: botname,
                body: textbot,
                mediaUrl: null,
                description: null,
                previewType: "PHOTO",
                thumbnailUrl: img,
                thumbnail: img,
                sourceUrl: canal,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    };

    global.rcanal = {
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "",
                serverMessageId: 100,
                newsletterName: '「  Anika-news  」',
            },
            externalAdReply: {
                showAdAttribution: true,
                title: 'Anika',
                body: 'Anika para servirle',
                previewType: "PHOTO",
                thumbnailUrl: 'https://qu.ax/sKZrP.jpg',
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    };
}
