// node build/en.mjs <en_full.txt> <cmudict.dict>
// Cruza la lista de frecuencia (OpenSubtitles) con CMUdict (primera pronunciación) y escribe js/palabras/en.js.
import { readFileSync } from 'node:fs';
import { escribir } from './escribir.mjs';

const [frecuencia, cmudict] = process.argv.slice(2);
const MAX = 100000;

// "rhyme R AY1 M" → { cons: 'AYM', ason: 'AY', sil: 1 }: desde la última vocal tónica (1, si no 2, si no la última)
export function claves(fonemas) {
  const vocales = fonemas.map((f, i) => (/\d/.test(f) ? i : -1)).filter((i) => i >= 0);
  if (!vocales.length) return null;
  const tonica = [...vocales].reverse().find((i) => fonemas[i].endsWith('1')) ?? [...vocales].reverse().find((i) => fonemas[i].endsWith('2')) ?? vocales.at(-1);
  const desde = fonemas.slice(tonica).map((f) => f.replace(/\d/, ''));
  return { cons: desde.join(''), ason: desde.filter((f, i) => /\d/.test(fonemas[tonica + i])).join(''), sil: vocales.length };
}

export const dic = new Map();
for (const linea of readFileSync(cmudict, 'utf8').split('\n')) {
  const [w, ...f] = linea.split('#')[0].trim().split(' ');
  if (w && !w.includes('(') && !dic.has(w)) dic.set(w, f);
}

if (frecuencia) {
  const vistas = new Set();
  const salida = [];
  for (const linea of readFileSync(frecuencia, 'utf8').split('\n')) {
    const w = linea.split(' ')[0];
    if (!/^[a-z][a-z']*$/.test(w) || vistas.has(w) || !dic.has(w)) continue;
    vistas.add(w);
    const c = claves(dic.get(w));
    if (c) salida.push({ w, r: '', ...c });
    if (salida.length >= MAX) break;
  }
  escribir('en', salida);
}
