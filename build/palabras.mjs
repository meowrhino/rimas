// node build/palabras.mjs <es_full.txt> <diccionario.txt>
// Cruza la lista de frecuencia (OpenSubtitles, hermitdave/FrequencyWords) con un diccionario
// y escribe js/palabras.js: las palabras por orden de uso, una por línea, en una cadena.
import { readFileSync, writeFileSync } from 'node:fs';

const [frecuencia, diccionario] = process.argv.slice(2);
const MAX = 100000;
const sin = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const dic = new Set(readFileSync(diccionario, 'utf8').split('\n').map(sin));
const vistas = new Set();
const salida = [];
for (const linea of readFileSync(frecuencia, 'utf8').split('\n')) {
  const w = linea.split(' ')[0];
  if (!/^[a-záéíóúüñ]{2,}$/.test(w) || vistas.has(w) || !dic.has(sin(w))) continue;
  vistas.add(w);
  salida.push(w);
  if (salida.length >= MAX) break;
}
writeFileSync(new URL('../js/palabras.js', import.meta.url), `window.PALABRAS=${JSON.stringify(salida.join('\n'))};\n`);
console.log(`${salida.length} palabras`);
