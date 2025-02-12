import { spawn } from 'child_process';
import { join } from 'path';

const __dirname = global.__dirname(import.meta.url);

/**
 * Calcula la posición de la anotación según el nivel.
 * @param {number} level - El nivel para el que se calculará la posición.
 * @returns {string} La posición de la anotación en formato "+X+Y".
 */
function getAnnotationPosition(level) {
  const positions = {
    '>100': '+1260+260',
    '>50': '+1310+260',
    '>10': '+1330+260',
    '>2': '+1370+260',
    'default': '+1385+260'
  };

  for (let range in positions) {
    if (eval(`${level} ${range}`)) {
      return positions[range];
    }
  }

  return positions['default'];
}

/**
 * Genera una imagen "levelup" a partir de una plantilla, agregando un texto y un nivel.
 *
 * Utiliza ImageMagick o GraphicsMagick (según lo que esté soportado en global.support) para procesar la imagen.
 *
 * @param {string} teks - El texto que se agregará a la imagen.
 * @param {number} level - El nivel que se mostrará en la imagen.
 * @returns {Promise<Buffer>} - Una promesa que resuelve con el buffer de la imagen generada.
 */
export async function levelup(teks, level) {
  try {
    // Validación básica de parámetros
    if (typeof teks !== 'string' || teks.trim() === '') {
      throw new Error('El parámetro "teks" debe ser un texto no vacío.');
    }

    if (typeof level !== 'number' || isNaN(level)) {
      throw new Error('El parámetro "level" debe ser un número válido.');
    }

    // Verifica que se cuente con soporte para ImageMagick o GraphicsMagick
    if (!(global.support.convert || global.support.magick || global.support.gm)) {
      throw new Error('Herramienta de conversión no soportada.');
    }

    // Rutas a los archivos
    const fontDir = join(__dirname, '../src/font');
    const fontLevel = join(fontDir, 'level_c.otf');
    const fontTexts = join(fontDir, 'texts.otf');
    const templatePath = join(__dirname, '../src/lvlup_template.jpg');

    // Calcula la posición de la anotación según el nivel
    const annotation = getAnnotationPosition(level);

    // Comando para generar la imagen
    const commandParts = [
      ...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []),
      'convert',
      templatePath,
      '-font', fontTexts,
      '-fill', '#0F3E6A',
      '-size', '1024x784',
      '-pointsize', '68',
      '-interline-spacing', '-7.5',
      '-annotate', '+153+200', teks,
      '-font', fontLevel,
      '-fill', '#0A2A48',
      '-size', '1024x784',
      '-pointsize', '140',
      '-interline-spacing', '-1.2',
      '-annotate', annotation, level,
      '-append', 'jpg:-'
    ];

    // Ejecutar el comando y obtener el buffer de la imagen generada
    const resultBuffer = await runCommand(commandParts);
    return resultBuffer;
  } catch (err) {
    console.error('Error:', err);
    throw err; // Re-throw error for further handling if needed
  }
}

/**
 * Ejecuta el comando para generar la imagen usando ImageMagick o GraphicsMagick.
 * @param {string[]} commandParts - Los argumentos para ejecutar el comando.
 * @returns {Promise<Buffer>} - Una promesa que resuelve con el buffer de la imagen generada.
 */
function runCommand(commandParts) {
  return new Promise((resolve, reject) => {
    const [spawnCommand, ...spawnArgs] = commandParts;
    const buffers = [];
    const child = spawn(spawnCommand, spawnArgs);

    // Recibir los datos de salida del comando
    child.stdout.on('data', chunk => buffers.push(chunk));

    // Manejo de errores durante la ejecución del comando
    child.on('error', (err) => {
      console.error('Error al ejecutar el proceso:', err);
      reject(err);
    });

    // Cuando el proceso termina, resolver el buffer concatenado
    child.on('close', () => {
      resolve(Buffer.concat(buffers));
    });
  });
}
