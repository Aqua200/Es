import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  // Cargar imágenes de perfil
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => welcome);
  let pp2 = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => adios);

  let img = await (await fetch(`${pp}`)).buffer();
  let img2 = await (await fetch(`${pp2}`)).buffer();

  // Obtener información del chat
  let chat = global.db.data.chats[m.chat];

  if (chat.welcome && m.messageStubType == 27) { // Cuando alguien entra
    let wel = `ゲ◜៹ New Member ៹◞ゲ \n Usuario : @${m.messageStubParameters[0].split`@`[0]} \n Grupo : ${groupMetadata.subject}\n Powered By Neykoor✨`;
    await conn.sendMini(m.chat, packname, dev, wel, img, img, channel, fkontak);
  }

  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 29)) { // Cuando alguien sale
    let bye = `ゲ◜៹ Bye Member ៹◞ゲ \n Usuario: @${m.messageStubParameters[0].split`@`[0]} 」\n Grupo: ${groupMetadata.subject}\n Powered By Neykoor✨`;
    await conn.sendMini(m.chat, packname, dev, bye, img2, img2, channel, fkontak);
  }
}
