const fs = require('fs')
const path = require('path')
const assert = require('assert')
const syntaxError = require('syntax-error')

const __dirname = __dirname || path.resolve()

// ⚠️ Archivos que NO se verifican (usar expresiones regulares)
const archivosExcluidos = [/^test/i]; // Ignora test.js, test1.js, test-large.js
const maxFileSize = 1_000_000; // 1MB en bytes

let packageJsonPath = path.join(__dirname, 'package.json')
let directories = {}

if (fs.existsSync(packageJsonPath)) {
    try {
        let packageJson = require(packageJsonPath)
        directories = packageJson.directories || {}
    } catch (e) {
        console.error('Error al leer package.json:', e)
    }
}

let folders = ['.', ...Object.keys(directories)]
let files = []

// Obtener todos los archivos .js en las carpetas
for (let folder of folders) {
    if (!fs.existsSync(folder)) continue
    for (let file of fs.readdirSync(folder)) {
        if (!file.endsWith('.js') || archivosExcluidos.some(rx => rx.test(file)) || file.startsWith('.')) continue
        files.push(path.resolve(path.join(folder, file)))
    }
}

let erroresEncontrados = [];

// Verificación de cada archivo en paralelo
async function verificarArchivo(file) {
    if (file === __filename) return;

    let stats;
    try {
        stats = fs.statSync(file);
    } catch (e) {
        console.error(`⚠️ No se pudo acceder a ${file}:`, e.message);
        return;
    }

    if (stats.size > maxFileSize) {
        console.log(`⏩ Saltando ${file} (archivo muy grande: ${stats.size} bytes)`);
        return;
    }

    console.error('Verificando', file);

    try {
        // Si el archivo es grande, leerlo por fragmentos
        if (stats.size > 500_000) {
            let fileContent = '';
            const stream = fs.createReadStream(file, { encoding: 'utf8', highWaterMark: 64 * 1024 }); // 64KB por fragmento
            
            stream.on('data', (chunk) => {
                fileContent += chunk;
            });

            stream.on('end', () => {
                const error = syntaxError(fileContent, file, {
                    sourceType: 'script',
                    allowReturnOutsideFunction: true,
                    allowAwaitOutsideFunction: true
                });
                if (error) {
                    console.error('❌ Error en', file, '\n', error);
                    erroresEncontrados.push({ file, error });
                } else {
                    console.log('✅ Correcto:', file);
                }
            });

            stream.on('error', (err) => {
                console.error(`❌ Error al leer ${file}:`, err);
            });
        } else {
            const contenido = await fs.promises.readFile(file, 'utf8');
            const error = syntaxError(contenido, file, {
                sourceType: 'script',
                allowReturnOutsideFunction: true,
                allowAwaitOutsideFunction: true
            });

            if (error) {
                console.error('❌ Error en', file, '\n', error);
                erroresEncontrados.push({ file, error });
            } else {
                console.log('✅ Correcto:', file);
            }
        }

    } catch (e) {
        console.error('❌ Error en', file, '\n', e);
        erroresEncontrados.push({ file, error: e.message });
    }
}

async function verificarArchivos() {
    await Promise.all(files.map(verificarArchivo));

    // Mostrar resumen de errores
    console.log('\n📋 **Resumen de verificación:**');
    if (erroresEncontrados.length === 0) {
        console.log('✅ Todos los archivos están correctos.');
    } else {
        console.log(`❌ Se encontraron ${erroresEncontrados.length} errores:`);
        erroresEncontrados.forEach(({ file, error }) => {
            console.log(`  - ${file}: ${error}`);
        });
    }
}

verificarArchivos();
