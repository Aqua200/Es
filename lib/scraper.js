import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';

// Función para dormir (esperar) entre solicitudes
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sekaikomikDl(url) {
  try {
    let res = await fetch(url);
    if (!res.ok) {
      console.error(`Error HTTP: ${res.status} en ${url}`);
      return;
    }
    let $ = cheerio.load(await res.text());
    let data = $('script').map((idx, el) => $(el).html()).toArray();
    data = data.filter(v => /wp-content/i.test(v));
    data = eval(data[0].split('"images":')[1].split('}],')[0]);
    return data.map(v => encodeURI(v));
  } catch (error) {
    console.error('Error en sekaikomikDl:', error);
  }
}

async function facebookDl(url) {
  try {
    let res = await fetch('https://fdownloader.net/');
    if (!res.ok) {
      console.error(`Error HTTP: ${res.status} en fdownloader.net`);
      return;
    }
    let $ = cheerio.load(await res.text());
    let token = $('input[name="__RequestVerificationToken"]').attr('value');
    let json = await (await fetch('https://fdownloader.net/api/ajaxSearch', {
      method: 'post',
      headers: {
        cookie: res.headers.get('set-cookie'),
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        referer: 'https://fdownloader.net/',
      },
      body: new URLSearchParams(Object.entries({ __RequestVerificationToken: token, q: url })),
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
  }
}

async function tiktokStalk(user) {
  try {
    let res = await axios.get(`https://urlebird.com/user/${user}/`);
    let $ = cheerio.load(res.data), obj = {};
    obj.pp_user = $('div[class="col-md-auto justify-content-center text-center"] > img').attr('src');
    obj.name = $('h1.user').text().trim();
    obj.username = $('div.content > h5').text().trim();
    obj.followers = $('div[class="col-7 col-md-auto text-truncate"]').text().trim().split(' ')[1];
    obj.following = $('div[class="col-auto d-none d-sm-block text-truncate"]').text().trim().split(' ')[1];
    obj.description = $('div.content > p').text().trim();
    return obj;
  } catch (error) {
    console.error('Error en tiktokStalk:', error);
  }
}

async function igStalk(username) {
  try {
    username = username.replace(/^@/, '');
    const html = await (await fetch(`https://dumpor.com/v/${username}`)).text();
    const $$ = cheerio.load(html);
    const name = $$('div.user__title > a > h1').text().trim();
    const Uname = $$('div.user__title > h4').text().trim();
    const description = $$('div.user__info-desc').text().trim();
    const profilePic = $$('div.user__img').attr('style')?.replace("background-image: url('", '').replace("');", '');
    const row = $$('#user-page > div.container > div > div > div:nth-child(1) > div > a');
    const postsH = row.eq(0).text().replace(/Posts/i, '').trim();
    const followersH = row.eq(2).text().replace(/Followers/i, '').trim();
    const followingH = row.eq(3).text().replace(/Following/i, '').trim();
    const list = $$('ul.list > li.list__item');
    const posts = parseInt(list.eq(0).text().replace(/Posts/i, '').trim().replace(/\s/g, ''));
    const followers = parseInt(list.eq(1).text().replace(/Followers/i, '').trim().replace(/\s/g, ''));
    const following = parseInt(list.eq(2).text().replace(/Following/i, '').trim().replace(/\s/g, ''));
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
      profilePic
    };
  } catch (error) {
    console.error('Error en igStalk:', error);
  }
}

// Reducir la tasa de solicitudes para evitar el error 429
async function main() {
  try {
    await sekaikomikDl('https://someurl.com');
    await sleep(1000); // Espera 1 segundo antes de la siguiente solicitud

    await facebookDl('https://somefburl.com');
    await sleep(1000); // Espera 1 segundo antes de la siguiente solicitud

    await tiktokStalk('someuser');
    await sleep(1000); // Espera 1 segundo antes de la siguiente solicitud

    await igStalk('someuser');
    await sleep(1000); // Espera 1 segundo antes de la siguiente solicitud

  } catch (error) {
    console.error('Error en la función principal:', error);
  }
}

main();

export {
  sekaikomikDl,
  igStalk,
  facebookDl,
  tiktokStalk
};
