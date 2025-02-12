import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;

  let chat = global.db.data.chats[m.chat];
  if (!chat || !chat.welcome) return;

  let who = m.messageStubParameters[0] + '@s.whatsapp.net';
  let user = global.db.data.users?.[who] || {};
  let userName = user.name || await conn.getName(who);

  let pp;
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image');
  } catch {
    pp = 'https://qu.ax/FvZdo.jpg';
  }

  let img;
  try {
    img = await (await fetch(pp)).arrayBuffer(); // Se cambió buffer() por arrayBuffer()
  } catch {
    img = null; // Si hay error al obtener la imagen, evita que falle el envío.
  }

  let message;
  switch (m.messageStubType) {
    case 27:
      message = `Bienvenido @${m.messageStubParameters[0].split`@`[0]} a ${groupMetadata.subject}`;
      break;
    case 28:
    case 32:
      message = `Adiós @${m.messageStubParameters[0].split`@`[0]} de ${groupMetadata.subject}`;
      break;
    default:
      return;
  }

  // Definir las variables necesarias
  const packname = "NombreDelPack"; // Cambia este valor según tu necesidad
  const dev = "Desarrollador"; // Nombre del desarrollador
  const channel = "Canal"; // Canal si es necesario
  const estilo = "Estilo"; // Estilo o personalización si es necesario

  await conn.sendMini(m.chat, packname, dev, message, img, img, channel, estilo);
}
