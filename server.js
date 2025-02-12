import express from 'express';
import { createServer } from 'http';
import { toBuffer } from 'qrcode';
import fetch from 'node-fetch';

function connect(conn, PORT, opts = {}) {
  let app = global.app = express();
  console.log(app);

  let server = global.server = createServer(app);
  let _qr = 'invalid';

  conn.ev.on('connection.update', function appQR({ qr }) {
    if (qr) _qr = qr;
  });

  app.use(async (req, res) => {
    res.setHeader('content-type', 'image/png');
    res.end(await toBuffer(_qr));
  });

  server.listen(PORT, () => {
    console.log('App listened on port', PORT);
    // Si opts['keepalive'] está definido y es verdadero, ejecuta keepAlive
    if (opts.keepalive) keepAlive();
  });
}

function pipeEmit(event, event2, prefix = '') {
  let old = event.emit;
  event.emit = function (event, ...args) {
    old.emit(event, ...args);
    event2.emit(prefix + event, ...args);
  };
  return {
    unpipeEmit() {
      event.emit = old;
    },
  };
}

function keepAlive() {
  // Verifica que las variables de entorno estén definidas
  if (!process.env.REPL_SLUG || !process.env.REPL_OWNER) {
    console.error("Las variables de entorno REPL_SLUG o REPL_OWNER no están definidas.");
    return;
  }

  const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  // Evita que se haga la solicitud si la URL contiene "undefined"
  if (/(\/\/|\.)undefined\./.test(url)) return;

  setInterval(() => {
    fetch(url)
      .catch(console.error); // Captura y muestra cualquier error
  }, 5 * 1000 * 60); // 5 minutos
}

export default connect;
