let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  
  // Función de validación de permisos
  const checkPermissions = (permission, groupCheck = false) => {
    if (groupCheck && !m.isGroup) {
      global.dfail('group', m, conn)
      throw false
    }
    if (permission === 'admin' && !(isAdmin || isOwner)) {
      global.dfail('admin', m, conn)
      throw false
    }
    if (permission === 'rowner' && !isOwner) {
      global.dfail('rowner', m, conn)
      throw false
    }
    if (permission === 'rother' && !isROwner) {
      global.dfail('rowner', m, conn)
      throw false
    }
  }

  // Comandos
  switch (type) {
    case 'welcome':
    case 'bv':
    case 'bienvenida':
      checkPermissions('admin', true)
      chat.welcome = isEnable
      break

    case 'antiPrivate':
    case 'antiprivado':
    case 'antipriv':
      isAll = true
      checkPermissions('rowner')
      bot.antiPrivate = isEnable
      break

    case 'restrict':
    case 'restringir':
      isAll = true
      checkPermissions('rowner')
      bot.restrict = isEnable
      break

    case 'autolevelup':
    case 'autonivel':
      checkPermissions('admin', true)
      chat.autolevelup = isEnable
      break

    case 'antibot':
    case 'antibots':
      checkPermissions('admin', true)
      chat.antiBot = isEnable
      break

    case 'autoaceptar':
    case 'aceptarauto':
      checkPermissions('admin', true)
      chat.autoAceptar = isEnable
      break

    case 'autorechazar':
    case 'rechazarauto':
      checkPermissions('admin', true)
      chat.autoRechazar = isEnable
      break

    case 'antisubbots':
    case 'antisub':
    case 'antisubot':
    case 'antibot2':
      checkPermissions('admin', true)
      chat.antiBot2 = isEnable
      break

    case 'antifake':
    case 'antifakes':
      checkPermissions('admin', true)
      chat.antifake = isEnable
      break

    case 'autoresponder':
    case 'autorespond':
      checkPermissions('admin', true)
      chat.autoresponder = isEnable
      break

    case 'modoadmin':
    case 'soloadmin':
      checkPermissions('admin', true)
      chat.modoadmin = isEnable
      break

    case 'autoread':
    case 'autoleer':
    case 'autover':
      isAll = true
      checkPermissions('rother')
      global.opts['autoread'] = isEnable
      break

    case 'antiver':
    case 'antiocultar':
    case 'antiviewonce':
      checkPermissions('admin', true)
      chat.antiver = isEnable
      break

    case 'reaction':
    case 'reaccion':
    case 'emojis':
      checkPermissions('admin', true)
      chat.reaction = isEnable
      break

    case 'audios':
    case 'audiosbot':
    case 'botaudios':
      checkPermissions('admin', true)
      chat.audios = isEnable
      break

    case 'antiSpam':
    case 'antispam':
    case 'antispamosos':
      isAll = true
      checkPermissions('rowner')
      bot.antiSpam = isEnable
      break

    case 'antidelete': 
    case 'antieliminar': 
    case 'delete':
      checkPermissions('admin', true)
      chat.delete = isEnable
      break

    case 'autobio':
    case 'status':
    case 'bio':
      isAll = true
      checkPermissions('rowner')
      bot.autobio = isEnable
      break

    case 'jadibotmd':
    case 'serbot':
    case 'subbots':
      isAll = true
      checkPermissions('rowner')
      bot.jadibotmd = isEnable
      break

    case 'detect':
    case 'configuraciones':
    case 'avisodegp':
      checkPermissions('admin', true)
      chat.detect = isEnable
      break

    case 'simi':
    case 'autosimi':
    case 'simsimi':
      checkPermissions('admin', true)
      chat.simi = isEnable
      break

    case 'document':
    case 'documento':
      isUser = true
      user.useDocument = isEnable
      break

    case 'antilink':
      checkPermissions('admin', true)
      chat.antiLink = isEnable
      break

    case 'nsfw':
    case 'modohorny':
      checkPermissions('admin', true)
      chat.modohorny = isEnable
      break

    default:
      if (!/[01]/.test(command)) return conn.reply(m.chat, `
*👑 Funciones solo para owner*

${usedPrefix + command} antispam
${usedPrefix + command} antiprivado
${usedPrefix + command} status
${usedPrefix + command} autoread
${usedPrefix + command} restrict

*🚩 Funciones de grupos*

${usedPrefix + command} welcome 
${usedPrefix + command} autoaceptar
${usedPrefix + command} autorechazar
${usedPrefix + command} autoresponder
${usedPrefix + command} autolevelup
${usedPrefix + command} antibot
${usedPrefix + command} subbots
${usedPrefix + command} reaccion
${usedPrefix + command} simi
${usedPrefix + command} audios
${usedPrefix + command} antiver
${usedPrefix + command} detect 
${usedPrefix + command} delete
${usedPrefix + command} nsfw 
${usedPrefix + command} modoadmin 
${usedPrefix + command} antifake
${usedPrefix + command} antilink`, m)
      throw false
  }

  conn.reply(m.chat, `🚩 La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'para este Bot' : isUser ? '' : 'para este chat'}`, m)
}

handler.help = ['enable', 'disable']
handler.tags = ['nable', 'owner']
handler.command = ['enable', 'disable', 'on', 'off', '1', '0']

export default handler
