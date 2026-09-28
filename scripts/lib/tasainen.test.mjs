// Logotunnistin (tasaisen pohjan osuus), jota check-image-fit.mjs käyttää.
// Aja: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tasaisenOsuus, TASAINEN_RAJA } from './tasainen.mjs';

const W = 320, H = 180;
const kuva = (vari) => {
  const buf = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) buf.set(vari(x, y), (y * W + x) * 3);
  return buf;
};
const raw = { width: W, height: H, channels: 3 };

test('logo valkoisella: nimi keskellä, muu pohja tasaista valkoista => yli rajan', async () => {
  const logo = kuva((x, y) => (x > 70 && x < 250 && y > 80 && y < 100 ? [110, 20, 20] : [255, 255, 255]));
  const osuus = await tasaisenOsuus(logo, raw);
  assert.ok(osuus > 0.9, `osuus ${osuus}`);
  assert.ok(osuus > TASAINEN_RAJA);
});

test('valokuvan kaltainen liukuväri + kohina => selvästi alle rajan', async () => {
  let s = 7;
  const kohina = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) % 24) - 12;
  const foto = kuva((x, y) => [120 + (x >> 2) + kohina(), 90 + (y >> 1) + kohina(), 60 + kohina()].map((v) => Math.max(0, Math.min(255, v))));
  const osuus = await tasaisenOsuus(foto, raw);
  assert.ok(osuus < 0.3, `osuus ${osuus}`);
});

test('talvikuvan kaltainen iso vaalea ala, jossa sävyvaihtelua => alle rajan', async () => {
  // Lumi ei ole yhtä väriä: kirkkaus vaihtelee rinteen ja valon mukaan.
  const lumi = kuva((x, y) => { const v = 200 + ((x * 3 + y * 5) % 50); return [v, v, Math.min(255, v + 8)]; });
  const osuus = await tasaisenOsuus(lumi, raw);
  assert.ok(osuus < TASAINEN_RAJA, `osuus ${osuus}`);
});
