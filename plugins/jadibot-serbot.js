import fs from 'fs';
import path from 'path';

const loadPlugin = (pluginName) => {
    const pluginPath = path.resolve(`/data/data/com.termux/files/home/ri/plugins/${pluginName}`);
    
    return new Promise((resolve, reject) => {
        // Verificar si el archivo existe en la ruta especificada
        if (fs.existsSync(pluginPath)) {
            // Intentar importar el plugin
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
            const errorMsg = `El archivo ${pluginName} no se encuentra en la ruta especificada.`;
            console.error(errorMsg);
            reject(new Error(errorMsg));
        }
    });
};

export default loadPlugin;
