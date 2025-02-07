/**
 * Genera un mensaje específico para bienvenida, salida o eliminación.
 * @param {string} type - Tipo de mensaje: "welcome", "leave" o "remove".
 * @param {object} options
 * @param {string} options.name - Nombre del usuario.
 * @param {string} options.group - Nombre del grupo.
 * @returns {string} - Mensaje generado.
 */
const generateMessage = (type, { name = 'Usuario', group = 'Grupo' } = {}) => {
    if (!name || !group) return '⚠️ Datos inválidos.';

    const messages = {
        welcome: [
            `🎉 ¡Bienvenido/a, ${name}! Disfruta en *${group}*.`,
            `🌟 ${name}, ahora eres parte de *${group}*!`,
            `🚀 ${name} ha aterrizado en *${group}*. ¡Prepárense!`,
            `🔥 ¡Bienvenido/a, ${name}! *${group}* te recibe con gusto.`,
            `📢 ¡Atención! ${name} se ha unido a *${group}*.`,
            `🏆 ${name} ha entrado a *${group}*. ¡Esperamos que te diviertas!`,
            `🎊 ${name} acaba de llegar a *${group}*. ¡Saluden!`,
            `🛸 ${name} apareció de la nada en *${group}*.`,
            `🍀 ${name}, qué bueno verte en *${group}*!`,
            `🎶 ${name} ha entrado en sintonía con *${group}*.`,
            `🕹️ ${name} ha insertado su ficha en *${group}*.`,
            `🎩 ${name} apareció mágicamente en *${group}*!`,
            `🌎 Bienvenido/a, ${name}. *${group}* es tu nuevo hogar.`,
            `💥 ¡Boom! ${name} ha ingresado a *${group}*!`,
            `🎯 ¡Diana! ${name} ha llegado a *${group}*.`,
            `📢 ¡Atención todos! ${name} se ha unido a *${group}*!`,
            `✨ ${name} brilla en su llegada a *${group}*.`,
            `⚡ ${name} entró con toda la energía a *${group}*!`,
            `🎆 ¡Fuegos artificiales para ${name} en *${group}*!`,
            `🏅 ${name}, eres un nuevo miembro de *${group}*!`,
        ],
        leave: [
            `😢 ${name} ha salido de *${group}*.`,
            `👋 ${name} decidió abandonar *${group}*.`,
            `🏃‍♂️ ${name} se fue voluntariamente de *${group}*.`,
            `💨 ${name} se marchó por su cuenta de *${group}*.`,
            `🌪️ ${name} eligió salir de *${group}*.`,
            `🚪 ${name} abrió la puerta y se fue de *${group}*.`,
            `📴 ${name} desconectó su sesión y se retiró de *${group}*.`,
            `🛫 ${name} tomó un vuelo lejos de *${group}*.`,
            `🛶 ${name} zarpó hacia otro destino, dejando *${group}*.`,
            `🚗 ${name} se fue en su auto, dejando *${group}*.`,
            `🕶️ ${name} se retiró en silencio de *${group}*.`,
            `🎭 ${name} dejó el escenario de *${group}*.`,
            `📦 ${name} empacó sus cosas y se fue de *${group}*.`,
            `🦅 ${name} alzó vuelo y dejó *${group}*.`,
            `🌊 ${name} se dejó llevar por la marea y salió de *${group}*.`,
            `🔚 ${name} puso punto final a su estancia en *${group}*.`,
            `🛑 ${name} decidió que su viaje en *${group}* terminó.`,
            `💔 ${name} optó por despedirse de *${group}*.`,
            `🕵️ ${name} se fue sin dejar rastro en *${group}*.`,
            `🎻 ${name} tocó su última melodía y se retiró de *${group}*.`,
        ],
        remove: [
            `🚨 ${name} fue eliminado/a de *${group}*.`,
            `🛑 ${name} ha sido expulsado/a de *${group}*.`,
            `👢 ${name} recibió una patada fuera de *${group}*.`,
            `⚠️ ${name} fue removido/a de *${group}*.`,
            `🧹 ${name} ha sido barrido/a fuera de *${group}*.`,
            `🚫 ${name} fue eliminado/a por un administrador de *${group}*.`,
            `❌ ${name} no cumplió las reglas y fue expulsado/a de *${group}*.`,
            `🔕 ${name} ha sido silenciado/a permanentemente en *${group}*.`,
            `⛔ ${name} cruzó la línea y fue eliminado/a de *${group}*.`,
            `⚡ ${name} desapareció de *${group}* por decisión de los administradores.`,
            `📉 ${name} perdió su nivel y fue eliminado/a de *${group}*.`,
            `🔥 ${name} fue quemado/a y removido/a de *${group}*.`,
            `🕳️ ${name} cayó en el abismo y fue eliminado/a de *${group}*.`,
            `💣 ${name} explotó y fue removido/a de *${group}*.`,
            `🎭 ${name} perdió su papel y fue eliminado/a de *${group}*.`,
            `🚀 ${name} fue lanzado/a al espacio desde *${group}*.`,
            `🎲 ${name} jugó mal sus cartas y fue eliminado/a de *${group}*.`,
            `📛 ${name} perdió su insignia y fue removido/a de *${group}*.`,
            `🦠 ${name} fue erradicado/a de *${group}*.`,
            `🎤 ${name} dijo sus últimas palabras y fue expulsado/a de *${group}*.`,
        ],
    };

    if (!messages[type]) return '⚠️ Tipo de mensaje no reconocido.';
    return messages[type][Math.floor(Math.random() * messages[type].length)];
};

// Evita errores si se ejecuta directamente en Termux
if (require.main === module) {
    try {
        console.log('Ejemplo de mensajes generados:');
        console.log(generateMessage('welcome', { name: 'Juan', group: 'Onyx Chat' }));
        console.log(generateMessage('leave', { name: 'Maria', group: 'Onyx Chat' }));
        console.log(generateMessage('remove', { name: 'Carlos', group: 'Onyx Chat' }));
    } catch (error) {
        console.error('Error al generar el mensaje:', error.message);
    }
}

module.exports = generateMessage;
