import { resolve, dirname as _dirname } from 'path'
import _fs, { existsSync } from 'fs'
const { promises: fs } = _fs

class Database {
    constructor(filepath, ...args) {
        this.file = resolve(filepath)
        this.logger = console
        
        // Intentar cargar el archivo de manera segura
        try {
            this._load()
        } catch (e) {
            this.logger.error('Error loading database:', e)
            this._data = {}  // Establecer datos predeterminados en caso de error
        }

        this._jsonargs = args
        this._state = false
        this._queue = []
    }

    get data() {
        return this._data
    }

    set data(value) {
        this._data = value
        this.save()
    }

    load() {
        this._queue.push('_load')
        this.processQueue()
    }

    save() {
        this._queue.push('_save')
        this.processQueue()
    }

    // Procesar la cola de operaciones de manera eficiente
    async processQueue() {
        if (this._queue.length > 0 && !this._state) {
            this._state = true
            const action = this._queue.shift()
            try {
                await this[action]()
            } catch (e) {
                this.logger.error(e)
            }
            this._state = false
        }
    }

    // Cargar datos de manera asincrónica
    async _load() {
        try {
            const data = existsSync(this.file) ? await fs.readFile(this.file, 'utf-8') : '{}'
            this._data = JSON.parse(data)
            if (typeof this._data !== 'object') {
                this._data = {} // Asegurarse de que _data siempre sea un objeto
            }
        } catch (e) {
            this.logger.error('Error loading data:', e)
            this._data = {}  // Establecer valores predeterminados en caso de error
        }
    }

    // Guardar datos de manera asincrónica
    async _save() {
        try {
            let dirname = _dirname(this.file)
            if (!existsSync(dirname)) await fs.mkdir(dirname, { recursive: true })
            await fs.writeFile(this.file, JSON.stringify(this._data, ...this._jsonargs))
        } catch (e) {
            this.logger.error('Error saving data:', e)
        }
    }

    // Eliminar el archivo de base de datos
    async delete() {
        try {
            await fs.unlink(this.file)
        } catch (e) {
            this.logger.error('Error deleting file:', e)
        }
    }
}

export default Database
