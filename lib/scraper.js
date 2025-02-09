import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';

// Función para dormir (esperar) entre solicitudes
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sekaikomikDl(url) {
  try {
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} en ${url}`);
    }

    let $ = cheerio.load(await res.text());
    let scripts = $('script').map((idx, el) => $(el).html()).toArray();
    let data = scripts.find(v => /"images":/.test(v));

    if (!data) {
      throw new Error('No se encontraron datos de imágenes');
    }

    let images = JSON.parse(data.match(/"images":(.*?)/)[1]);
    return images.map(v => encodeURI(v));
  } catch (error) {
    console.error('Error en sekaikomikDl:', error);
    return null;
  }
}

async function facebookDl(url) {
  try {
    let res = await fetch('https://fdownloader.net/');
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} en fdownloader.net`);
    }

    let $ = cheerio.load(await res.text());
    let token = $('input[name="__RequestVerificationToken"]').attr('value');

    if (!token) {
      throw new Error('No se encontró el token de verificación');
    }

    let json = await (await fetch('https://fdownloader.net/api/ajaxSearch', {
      method: 'POST',
      headers: {
        cookie: res.headers.get('set-cookie') || '',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        referer: 'https://fdownloader.net/',
      },
      body: new URLSearchParams({ __RequestVerificationToken: token, q: url }),
    })).json();

    let $$ = cheerio.load(json.data);
    let result = {};

    $$('.button.is-success.is-small.download-link-fb').each(function () {
      let quality = $$(this).attr('title').split(' ')[1];
      let link = $$(this).attr('href');
      if (link) result[quality] = link;
    });

    return result;
  } catch (error) {
    console.error('Error en facebookDl:', error);
    return null;
  }
}

async function tiktokStalk(user) {
  try {
    let res = await axios.get(`https://urlebird.com/user/${user}/`);
    if (res.status !== 200) {
      throw new Error(`Error HTTP ${res.status} en urlebird.com`);
    }

    let $ = cheerio.load(res.data);
    let obj = {
      pp_user: $('div[class="col-md-auto justify-content-center text-center"] > img').attr('src') || '',
      name: $('h1.user').text().trim(),
      username: $('div.content > h5').text().trim(),
      followers: $('div[class="col-7 col-md-auto text-truncate"]').text().trim().split(' ')[1] || '0',
      following: $('div[class="col-auto d-none d-sm-block text-truncate"]').text().trim().split(' ')[1] || '0',
      description: $('div.content > p').text().trim() || 'Sin descripción',
    };

    return obj;
  } catch (error) {
    console.error('Error en tiktokStalk:', error);
    return null;
  }
}

async function igStalk(username) {
  try {
    username = username.replace(/^@/, '');
    const res = await fetch(`https://dumpor.com/v/${username}`);

    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} en dumpor.com`);
    }

    const html = await res.text();
    const $$ = cheerio.load(html);
    
    return {
      name: $$('div.user__title > a > h1').text().trim() || 'Desconocido',
      username: $$('div.user__title > h4').text().trim() || username,
      description: $$('div.user__info-desc').text().trim() || 'Sin descripción',
      profilePic: $$('div.user__img').attr('style')?.match(/url'(.+?)'/)?.[1] || '',
      posts: parseInt($$('ul.list > li.list__item').eq(0).text().replace(/\D/g, '')) || 0,
      followers: parseInt($$('ul.list > li.list__item').eq(1).text().replace(/\D/g, '')) || 0,
      following: parseInt($$('ul.list > li.list__item').eq(2).text().replace(/\D/g, '')) || 0,
    };
  } catch (error) {
    console.error('Error en igStalk:', error);
    return null;
  }
}

// Función principal con control de tasa de solicitudes
async function main() {
  try {
    console.log('Iniciando scraping...');

    let sekaikomik = await sekaikomikDl('https://someurl.com');
    console.log('sekaikomikDl:', sekaikomik);
    await sleep(5000); // Espera 5 segundos para evitar bloqueos

    let facebook = await facebookDl('https://somefburl.com');
    console.log('facebookDl:', facebook);
    await sleep(5000);

    let tiktok = await tiktokStalk('someuser');
    console.log('tiktokStalk:', tiktok);
    await sleep(5000);

    let instagram = await igStalk('someuser');
    console.log('igStalk:', instagram);
    await sleep(5000);

    console.log('Scraping completado.');
  } catch (error) {
    console.error('Error en la función principal:', error);
  }
}

// Ejecutar la función principal solo si este archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Exportar funciones para su uso en otros módulos
export {
  sekaikomikDl,
  facebookDl,
  tiktokStalk,
  igStalk
};
