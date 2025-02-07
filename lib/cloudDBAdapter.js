import got from 'got'

// Funciones de serialización y deserialización
const stringify = obj => JSON.stringify(obj, null, 2)
const parse = str =>
  JSON.parse(str, (_, v) => {
    if (
      v !== null &&
      typeof v === 'object' &&
      'type' in v &&
      v.type === 'Buffer' &&
      'data' in v &&
      Array.isArray(v.data)
    ) {
      return Buffer.from(v.data)
    }
    return v
  })

class CloudDBAdapter {
  /**
   * Crea una instancia del adaptador para la base de datos en la nube.
   * @param {string} url - La URL de la API.
   * @param {object} [options] - Opciones de configuración.
   * @param {Function} [options.serialize] - Función para serializar objetos (por defecto usa JSON.stringify).
   * @param {Function} [options.deserialize] - Función para deserializar la respuesta (por defecto usa JSON.parse con Buffer support).
   * @param {object} [options.fetchOptions] - Opciones adicionales para got (por ejemplo, headers, timeout, retry).
   */
  constructor(url, { serialize = stringify, deserialize = parse, fetchOptions = {} } = {}) {
    this.url = url
    this.serialize = serialize
    this.deserialize = deserialize
    this.fetchOptions = fetchOptions

    // Opciones por defecto para las peticiones HTTP
    this.defaultOptions = {
      timeout: { request: 5000 }, // 5 segundos de timeout
      retry: { limit: 2 } // Reintenta hasta 2 veces en caso de error
    }
  }

  /**
   * Combina las opciones por defecto, las personalizadas y las específicas de la petición.
   * @param {string} method - Método HTTP (GET, POST, etc.).
   * @param {object} customHeaders - Headers específicos para la petición.
   * @param {string} [body] - Cuerpo de la petición, si aplica.
   * @returns {object} Opciones combinadas para la petición.
   */
  mergeOptions(method, customHeaders = {}, body = null) {
    return {
      ...this.defaultOptions,
      ...this.fetchOptions,
      method,
      headers: {
        ...customHeaders,
        ...(this.fetchOptions.headers || {})
      },
      ...(body && { body })
    }
  }

  /**
   * Realiza una petición GET para leer datos de la base de datos en la nube.
   * @returns {Promise<any>} Los datos deserializados.
   * @throws {Error} Si ocurre un error en la petición o en la deserialización.
   */
  async read() {
    const options = this.mergeOptions('GET', {
      'Accept': 'application/json;q=0.9,text/plain'
    })

    try {
      const res = await got(this.url, options)
      // Verifica que el código de respuesta sea 2xx
      if (res.statusCode < 200 || res.statusCode >= 300) {
        throw new Error(`HTTP error: ${res.statusCode} - ${res.statusMessage}`)
      }
      try {
        return this.deserialize(res.body)
      } catch (parseError) {
        throw new Error(`Error deserializing response: ${parseError.message}`)
      }
    } catch (error) {
      // Propaga el error para que sea gestionado por el llamador
      throw error
    }
  }

  /**
   * Realiza una petición POST para escribir datos en la base de datos en la nube.
   * @param {any} obj - Objeto a serializar y enviar.
   * @returns {Promise<string>} La respuesta del servidor.
   * @throws {Error} Si ocurre un error en la petición.
   */
  async write(obj) {
    const body = this.serialize(obj)
    const options = this.mergeOptions('POST', {
      'Content-Type': 'application/json'
    }, body)

    try {
      const res = await got(this.url, options)
      // Verifica que el código de respuesta sea 2xx
      if (res.statusCode < 200 || res.statusCode >= 300) {
        throw new Error(`HTTP error: ${res.statusCode} - ${res.statusMessage}`)
      }
      return res.body
    } catch (error) {
      throw error
    }
  }
}

export default CloudDBAdapter
