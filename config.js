import fs, { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

global.owner = [
  ['5216631079388', '@Neykoor⛩️', true], // Número corregido
  ['521XXXXXXXXXX', '@Three✨', true],
]

global.mods = []
global.prems = []

const packname = `✨Anika🌸`
const author = '🌃Neykoor✨'
const wait = '🌹Anika✨'
const botname = '🌸Anika✨'
const textbot = `🌸Anika a tu servicio✨`
const listo = 'Anika lista para servirle🌹!'
const namechannel = '「  Anika-news  」'
const baileys = '@whiskeysockets/baileys'

const catalogoPath = './storage/img/catalogo.png'
const siskedurlPath = './storage/img/siskedurl.jpg'

global.catalogo = fs.existsSync(catalogoPath) ? fs.readFileSync(catalogoPath) : null
global.siskedurl = fs.existsSync(siskedurlPath) ? fs.readFileSync(siskedurlPath) : null

global.group = 'https://chat.whatsapp.com/LcweEoBy4W16ngE2Pr4ClR'
global.canal = 'https://whatsapp.com/channel/0029Vb3uTsb90x2rvI6D3G3b'

global.estilo = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {})
  },
  message: {
    orderMessage: {
      itemCount: -999999,
      status: 1,
      surface: 1,
      message: botname,
      orderTitle: 'Bang',
      thumbnail: global.catalogo,
      sellerJid: '0@s.whatsapp.net'
    }
  }
}

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment	

global.multiplier = 69 
global.maxwarn = '2'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(file).then(() => console.log(chalk.greenBright('Config.js actualizado!')))
})

export { packname, author, wait, botname, textbot, listo, namechannel, baileys };
