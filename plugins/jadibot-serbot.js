// jadibot-serbot.js
function yukiJadiBot() {
  // código de la función...
}

import fs from 'fs';
import path from 'path';

const loadPlugin = (pluginName) => {
  const pluginPath = path.resolve(`/data/data/com.termux/files/home/ri/plugins/${pluginName}.js`);

  return new Promise((resolve, reject) => {
      if (fs.existsSync(pluginPath)) {
          import(pluginPath)
              .then((plugin) => {
                  console.log(`Plugin ${pluginName} cargado correctamente.`);
                  resolve(plugin);
              })
              .catch((error) => {
                  console.error(`Error al cargar el plugin ${pluginName}:`, error);
                  reject(error);
              });
      } else {
          const errorMsg = `El archivo ${pluginName}.js no se encuentra en la ruta especificada.`;
          console.error(errorMsg);
          reject(new Error(errorMsg));
      }
  });
};

export { yukiJadiBot, loadPlugin };
