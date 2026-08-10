/**
 * Generoi omat kuvat niille kaupunkibannereille jotka jakoivat kuvan toisen
 * kaupungin kanssa.
 *
 * Vesa 2026-08-10 (kuvakaappaus): Levi ja Kittilä näyttivät saman kuvan
 * peräkkäisissä osioissa. Auditti paljasti kolme muuta ryhmää: foodMoody
 * neljällä kaupungilla, ingredientsAlt kahdella, snowVillage kolmella +
 * sivun herolla talvella.
 *
 * Malli gpt-image-2 (Vesan ohje 28.7.: halvempi, 1824x1024 riittää
 * bannerikaistalle; gemini 4K = ~68 cr/kuva eli hukkaa tähän).
 * Resumoituva: valmiit tiedostot ohitetaan.
 *
 * Aja: node scripts/_gen-city-banners.mjs [--limit N]
 */
import { exec as execCb } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const exec = promisify(execCb);
/** gen-ai on Windowsilla .cmd-shim → komento ajetaan kuorella merkkijonona. */
const q = (s) => `"${String(s).replace(/["\\]/g, '').replace(/\r?\n/g, ' ')}"`;
const OUT_DIR = 'public/images/drive';
const WIDTH = 1280;
const NEGATIVE = 'text, letters, words, signage, logo, watermark, caption, menu text, brand name, poster, people facing camera, recognisable faces';

/**
 * Jokainen prompt on kaupungin oma, ei geneerinen "ravintola Lapissa".
 * Kaikki ovat ruokailukohtauksia, koska banneri on ravintolasivuston osio-otsikko.
 */
const JOBS = [
  {
    key: 'kittilaDining',
    city: 'Kittilä',
    prompt: 'a village restaurant dining room in Kittilä, Finnish Lapland, in the Ounasjoki river valley — '
      + 'long shared pine table, mismatched wooden chairs, a low autumn sun through small-paned windows, '
      + 'plates of reindeer and root vegetables mid-meal',
  },
  {
    key: 'sodankylaDining',
    city: 'Sodankylä',
    prompt: 'a restaurant table beside the Kitinen river in Sodankylä, Finnish Lapland — '
      + 'old timber church visible across the water through the window, summer night light, '
      + 'grilled river fish and new potatoes on enamel plates',
  },
  {
    key: 'hettaDining',
    city: 'Hetta',
    prompt: 'a lakeside dining room in Hetta, Enontekiö, Finnish Lapland — '
      + 'the Pallas fells rising across Ounasjärvi lake through wide windows, '
      + 'a Sámi-influenced table setting with dried fish, flatbread and cloudberries, pale summer light',
  },
  {
    key: 'posioDining',
    city: 'Posio',
    // 🔴 Ensimmäinen yritys sisälsi erisnimen "Riisitunturi" ja malli piirsi
    // sen KYLTIKSI ikkunan taakse — kirjoitettuna väärin ("Riiisitunturi").
    // Negatiiviprompti ei estänyt sitä. Maisema kuvaillaan nyt nimeämättä.
    prompt: 'a small ceramics-town restaurant in Posio, Finnish Lapland — '
      + 'handmade stoneware plates and mugs on a rough oak table, '
      + 'dense spruce forest and a lake on the far shore through the window, '
      + 'autumn ruska colours, lingonberries and dark rye. '
      + 'No signs, no signposts, no lettering anywhere in the frame',
  },
  {
    key: 'muonioDining',
    city: 'Muonio',
    prompt: 'a wilderness lodge dining room in Muonio, Finnish Lapland, near Jerisjärvi lake — '
      + 'reindeer hides over bentwood chairs, an iron stove in the corner, '
      + 'smoked whitefish and berries on a scrubbed wooden table, low golden evening light',
  },
  {
    key: 'luostoWinter',
    city: 'Luosto',
    prompt: 'a candlelit restaurant in Luosto, Finnish Lapland, in deep winter — '
      + 'snow-laden old-growth pines pressing against tall windows, amethyst-purple dusk sky, '
      + 'a hot cast-iron pan of reindeer sauté on a dark table',
  },
  {
    key: 'sallaWinter',
    city: 'Salla',
    prompt: 'a remote wilderness restaurant in Salla, eastern Finnish Lapland, in deep winter — '
      + 'heavy snow on the roofline outside, warm lamp light on rough log walls, '
      + 'a bowl of dark game stew and rye bread, complete stillness',
  },
  {
    // MidnightSunDining-sivun CTA-kaistalla oli talvikuva (luminen metsä
    // ikkunassa) keskiyön aurinko -sivulla. Vesa 2026-08-10.
    key: 'midnightSunBand',
    city: 'Lapland',
    prompt: 'a long outdoor table on a lakeside deck in Finnish Lapland at one in the morning under the midnight sun — '
      + 'low golden light skimming the water, no darkness in the sky, '
      + 'plates cleared and wine glasses half full, birch trees and open fell horizon behind',
  },
  {
    key: 'restaurantsHeroWinter',
    city: 'Lapland',
    prompt: 'a wide winter dining scene in Finnish Lapland at blue hour — '
      + 'a long table set inside a glass-walled restaurant, frozen lake and snow-covered fells beyond, '
      + 'candles and warm interior light against the deep blue outside, panoramic composition',
  },
];

const args = process.argv.slice(2);
const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
const todo = JOBS.filter((j) => !fs.existsSync(path.join(OUT_DIR, `${j.key}.webp`))).slice(0, limit);

console.log(`Generoidaan ${todo.length}/${JOBS.length} kaupunkibanneria, malli gpt-image-2\n`);

let ok = 0;
let failed = 0;
for (const job of todo) {
  const webp = path.join(OUT_DIR, `${job.key}.webp`);
  const full = `Photorealistic editorial food-travel photograph. ${job.prompt}. `
    + 'Natural light mixed with warm interior lamps, shallow depth of field, '
    + 'authentic and understated — not a stock photo.';
  try {
    const cmd = `gen-ai image --model gpt-image-2 --prompt ${q(full)} `
      + `--aspect-ratio 16:9 --negative-prompt ${q(NEGATIVE)} `
      + '--save-to-drive --folder laplandvibes --json';
    const { stdout } = await exec(cmd, { maxBuffer: 1024 * 1024 * 32, timeout: 300000 });
    const url = (stdout.match(/https?:\/\/[^\s"']+\.(?:png|jpg|jpeg|webp)/i) || [])[0];
    if (!url) throw new Error(`ei URLia vastauksessa: ${stdout.slice(0, 200)}`);
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(WIDTH).webp({ quality: 82 }).toFile(webp);
    const m = await sharp(webp).metadata();
    console.log(`✓ ${job.key.padEnd(24)} ${job.city.padEnd(12)} ${m.width}x${m.height}`);
    ok++;
  } catch (e) {
    console.error(`✗ ${job.key.padEnd(24)} ${String(e.message).slice(0, 120)}`);
    failed++;
  }
}
console.log(`\nValmis: ${ok} onnistui, ${failed} epäonnistui`);
console.log('Tarkista kuvat SILMÄLLÄ ennen wirausta — tekninen portti ei paljasta väärää kohtausta.');
