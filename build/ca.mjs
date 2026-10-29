// node build/ca.mjs <ca_full.txt> <diccionario.txt>
// Cruza la lista de frecuencia del catalán (OpenSubtitles, hermitdave/FrequencyWords) con un diccionario
// de formas (FreeLing, data/ca/dictionary/entries, primera columna) y escribe js/palabras/ca.js.
import { readFileSync } from 'node:fs';
import { analizar } from '../js/lang/ca.js';
import { escribir } from './escribir.mjs';

const [frecuencia, diccionario] = process.argv.slice(2);
const dic = new Set(readFileSync(diccionario, 'utf8').split('\n'));
const MAX = 60000;
const vistas = new Set();
const salida = [];
for (const linea of readFileSync(frecuencia, 'utf8').split('\n')) {
  const w = linea.split(' ')[0];
  if (!/^[a-zàèéíòóúïüç·]{2,}$/.test(w) || vistas.has(w) || !dic.has(w)) continue;
  vistas.add(w);
  const e = analizar(w);
  if (e) salida.push(e);
  if (salida.length >= MAX) break;
}
escribir('ca', salida);
