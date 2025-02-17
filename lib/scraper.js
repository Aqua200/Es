import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

async function sekaikomikDl(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Extraer los contenidos de todos los script y filtrar aquellos que tengan contenido
    const scripts = $('script')
      .map((idx, el) => $(el).html())
      .toArray()
      .filter(script => script); // nos aseguramos de que no sean undefined o null

    // Buscar el script que contenga "wp-content"
    const targetScript = scripts.find(v => /wp-content/i.test(v));
    if (!targetScript) {
      throw new Error('No se encontraron imágenes en el script.');
    }

    // Extraer la parte del JSON que contiene el array de imágenes
    // Se asume que en el script aparece algo como "images":[{...},{...},...]
    const jsonStringPart = targetScript.split('"images":')[1];
    if (!jsonStringPart) {
      throw new Error('No se encontró la propiedad "images" en el script.');
    }
    
    // Se extrae hasta el cierre del array
    const jsonString = jsonStringPart.split('}],')[0] + '}]';
    const images = JSON.parse(jsonString);

    return images.map(v => encodeURI(v));
  } catch (error) {
    console.error('Error en sekaikomikDl:', error);
    return null;
  }
}

async function facebookDl(url) {
  try {
    const res = await fetch('https://fdownloader.net/');
    const html = await res.text();
    const $ = cheerio.load(html);

    // Obtener el token CSRF
    const token = $('input[name="__RequestVerificationToken"]').attr('value');
    if (!token) throw new Error('No se pudo obtener el token CSRF.');

    // Realizar la solicitud POST
    const postResponse = await fetch('https://fdownloader.net/api/ajaxSearch', {
      method: 'POST',
      headers: {
        // Algunos servidores esperan que la cookie se pase así
        cookie: res.headers.get('set-cookie') || '',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        referer: 'https://fdownloader.net/',
      },
      body: new URLSearchParams({ __RequestVerificationToken: token, q: url }),
    });

    const json = await postResponse.json();
    const $$ = cheerio.load(json.data);

    // Extraer enlaces de descarga
    const result = {};
    $$('.button.is-success.is-small.download-link-fb').each(function () {
      const title = $$(this).attr('title');
      if (title) {
        const quality = title.split(' ')[1];
        const link = $$(this).attr('href');
        if (link) result[quality] = link;
      }
    });

    return result;
  } catch (error) {
    console.error('Error en facebookDl:', error);
    return null;
  }
}

async function tiktokStalk(user) {
  try {
    const res = await fetch(`https://urlebird.com/user/${user}/`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const obj = {
      pp_user: $('div[class="col-md-auto justify-content-center text-center"] > img').attr('src'),
      name: $('h1.user').text().trim(),
      username: $('div.content > h5').text().trim(),
      followers: $('div[class="col-7 col-md-auto text-truncate"]')
                    .text()
                    .trim()
                    .split(' ')[1],
      following: $('div[class="col-auto d-none d-sm-block text-truncate"]')
                    .text()
                    .trim()
                    .split(' ')[1],
      description: $('div.content > p').text().trim(),
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
    const html = await res.text();
    const $$ = cheerio.load(html);

    const name = $$('div.user__title > a > h1').text().trim();
    const Uname = $$('div.user__title > h4').text().trim();
    const description = $$('div.user__info-desc').text().trim();
    const profilePic = $$('div.user__img')
      .attr('style')
      ?.replace("background-image: url('", '')
      .replace("');", '');

    const row = $$('#user-page > div.container > div > div > div:nth-child(1) > div > a');
    const postsH = row.eq(0).text().replace(/Posts/i, '').trim();
    const followersH = row.eq(2).text().replace(/Followers/i, '').trim();
    const followingH = row.eq(3).text().replace(/Following/i, '').trim();
    const list = $$('ul.list > li.list__item');
    const posts = parseInt(
      list.eq(0).text().replace(/Posts/i, '').trim().replace(/\s/g, '')
    );
    const followers = parseInt(
      list.eq(1).text().replace(/Followers/i, '').trim().replace(/\s/g, '')
    );
    const following = parseInt(
      list.eq(2).text().replace(/Following/i, '').trim().replace(/\s/g, '')
    );

    return {
      name,
      username: Uname,
      description,
      postsH,
      posts,
      followersH,
      followers,
      followingH,
      following,
      profilePic,
    };
  } catch (error) {
    console.error('Error en igStalk:', error);
    return null;
  }
}

export {
  sekaikomikDl,
  igStalk,
  facebookDl,
  tiktokStalk,
};
