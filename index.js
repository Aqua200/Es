import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import chalk from 'chalk';

// Mensaje inicial con color
console.log(chalk.green('\n✿ Iniciando Anika-Bot ✿'));

// Obtener el directorio actual y cargar package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { name, description, author, version } = require(join(__dirname, 'package.json'));

// Configurar cfonts para mostrar mensajes estilizados
const { say } = cfonts;
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

say('Anika-Bot', {
  font: 'block',
  align: 'center',
  colors: ['yellow']
});
say('Multi Device', {
  font: 'chrome',
  align: 'center',
  colors: ['redBright']
});
say('Editor By • Legna', {
  font: 'console',
  align: 'center',
  colors: ['blueBright']
});

let isRunning = false;

function start(file) {
  if (isRunning) return;
  isRunning = true;

  const filePath = join(__dirname, file);
  const args = [filePath, ...process.argv.slice(2)];

  // Mostrar la línea de comando que se usará para el proceso hijo
  say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    colors: ['candy']
  });

  // Configurar y lanzar el proceso hijo usando cluster
  setupMaster({
    exec: args[0],
    args: args.slice(1)
  });

  const worker = fork();

  worker.on('message', (data) => {
    switch (data) {
      case 'reset':
        worker.process.kill();
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        worker.send(process.uptime());
        break;
      default:
        // Aquí puedes manejar otros mensajes si fuera necesario
        break;
    }
  });

  worker.on('exit', (code, signal) => {
    isRunning = false;
    if (code !== 0) {
      console.error(
        chalk.red(
          `✖️ Error: El proceso hijo terminó con código ${code}${
            signal ? ' y señal ' + signal : ''
          }`
        )
      );
      // Reiniciar el proceso hijo después de 1 segundo
      setTimeout(() => start(file), 1000);
    } else {
      console.log(chalk.yellow('Proceso hijo finalizó correctamente.'));
      process.exit(0);
    }
  });

  // Analizar argumentos sin que yargs finalice el proceso en caso de error
  const opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
  if (!opts.test) {
    if (!rl.listenerCount('line')) {
      rl.on('line', (line) => {
        worker.emit('message', line.trim());
      });
    }
  }
}

// Manejo de advertencias (por ejemplo, por exceso de listeners)
process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning') {
    console.warn(chalk.yellow('🍡 Se excedió el límite de Listeners en:'));
    console.warn(warning.stack);
  }
});

// Iniciar el proceso con el archivo principal (main.js)
start('main.js');
