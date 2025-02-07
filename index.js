console.log('@Sisked ☆')

import { join, dirname } from 'path'
import { createRequire } from 'module';
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts';
import { createInterface } from 'readline'
import yargs from 'yargs'
import express from 'express'
import chalk from 'chalk'
import os from 'os'
import { promises as fsPromises } from 'fs'
import cron from 'node-cron' // Para tareas programadas
import osUtils from 'os-utils' // Para monitoreo de uso de CPU y memoria

// Configuración de directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

const app = express()
const port = process.env.PORT || 8080;

say('Onyx\nBot', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']})

let isRunning = false;
let restartAttempts = 0; // Contador de intentos de reinicio
const logs = []; // Array para almacenar logs de eventos

// Función para loguear eventos
const logEvent = (message) => {
  const timestamp = new Date().toISOString();
  logs.push(`[${timestamp}] ${message}`);
  console.log(`[LOG] ${message}`);
};

// Manejo de errores y reintentos
const retryStart = async (files, retries = 5, delay = 1000) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await start(files);
      return; // Si el inicio es exitoso, salimos
    } catch (error) {
      logEvent(`Intento ${attempt + 1}/${retries} fallido: ${error}`);
      attempt++;
      await new Promise(resolve => setTimeout(resolve, delay)); // Esperar antes de reintentar
    }
  }
  logEvent('Número máximo de reintentos alcanzado. El bot no se pudo iniciar.');
  process.exit(1);
};

// Monitoreo de recursos del sistema (CPU y memoria)
const monitorSystemResources = () => {
  osUtils.cpuUsage(cpuPercent => {
    logEvent(`Uso de CPU: ${cpuPercent.toFixed(2)}%`);
  });

  logEvent(`Uso de Memoria: ${(os.totalmem() - os.freemem()) / os.totalmem() * 100}%`);
};

// Función para iniciar el bot
const start = async (files) => {
  if (isRunning) return;
  isRunning = true;
  restartAttempts++;

  for (const file of files) {
    const currentFilePath = new URL(import.meta.url).pathname;
    const args = [join(__dirname, file), ...process.argv.slice(2)];

    // Mostrar la línea de comando que se ejecutará
    say([process.argv[0], ...args].join(' '), {
      font: 'console',
      align: 'center',
      gradient: ['red', 'magenta']
    });

    setupMaster({
      exec: args[0],
      args: args.slice(1),
    });

    const p = fork();

    // Manejo de mensajes del proceso hijo
    p.on('message', (data) => {
      console.log('[RECEIVED]', data);
      switch (data) {
        case 'reset':
          p.process.kill();
          isRunning = false;
          retryStart(files); // Reiniciar el bot de manera controlada
          break;
        case 'uptime':
          p.send(process.uptime());
          break;
      }
    });

    // Manejo del evento de salida del proceso
    p.on('exit', async (_, code) => {
      isRunning = false;
      logEvent(`Ocurrió un error inesperado: ${code}`);
      if (code !== 0) {
        logEvent('Intentando reiniciar el proceso...');
        await retryStart(files);
      }

      // Si el proceso termina correctamente, monitorear el archivo
      if (code === 0) return;

      watchFile(args[0], () => {
        unwatchFile(args[0]);
        retryStart(files);
      });
    });

    // Manejo de argumentos de línea de comando
    const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
    if (!opts['test']) {
      if (!rl.listenerCount()) rl.on('line', (line) => {
        p.emit('message', line.trim()); // Enviar mensaje al proceso hijo
      });
    }
  }
};

// Crear un servidor express para manejar posibles conexiones
app.get('/', (req, res) => {
  res.send('¡Onyx Bot está en funcionamiento!');
});

app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    restartAttempts,
    logs: logs.slice(-10), // Devolver los últimos 10 logs
  });
});

app.listen(port, () => {
  logEvent(`Servidor Express corriendo en http://localhost:${port}`);
});

// Tareas programadas para monitorear recursos del sistema cada 1 minuto
cron.schedule('*/1 * * * *', () => {
  monitorSystemResources();
});

// Iniciar el bot con la funcionalidad de reintentos
retryStart(['sisked.js']);
