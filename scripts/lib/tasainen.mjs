/**
 * Kuinka suuri osa kuvasta on yhtä ja samaa väriä: logon tai tekstin tasainen pohja.
 *
 * Kuvasuhdeportti (check-image-fit.mjs) nappaa neliö- ja pystylogot, mutta ei leveää
 * logoa: Kukkolaforsenin og:image oli 800×420 (suhde 1,90, kortin kehys 1,78), eli
 * nimi viininpunaisella valkoisen pohjan keskellä, ja kortissa luki "Photo:" (28.9.2026).
 * Mitattu kaikista 86 korttikuvasta: Kukkolaforsen 95 % yhtä väriä, seuraavaksi suurin
 * 29 % (kuvituskuva), mediaani 7,6 %. Valokuvassa kohina ja liukuvärit hajottavat
 * värit, logon pohja on sama väri pikselistä toiseen.
 *
 * Menetelmä: kuva pienennetään 160×90:een, kanavat kvantisoidaan 16 tasoon (4 bittiä)
 * ja lasketaan yleisimmän värilokeron osuus pikseleistä.
 */
import sharp from 'sharp';

export const TASAINEN_RAJA = 0.6;

/** @param {string | Buffer} input tiedosto tai kuvapuskuri (sharpin syöte) */
export async function tasaisenOsuus(input, raw) {
  const { data, info } = await sharp(input, raw ? { raw } : undefined)
    .resize(160, 90, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const lokerot = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    const k = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    lokerot.set(k, (lokerot.get(k) ?? 0) + 1);
  }
  return Math.max(...lokerot.values()) / (info.width * info.height);
}
