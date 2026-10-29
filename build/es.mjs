// node build/es.mjs <es_full.txt> <diccionario.txt>
// Cruza la lista de frecuencia (OpenSubtitles, hermitdave/FrequencyWords) con un diccionario de formas
// con tildes (FreeLing, data/es/dictionary/entries, primera columna) y escribe js/palabras/es.js.
// El diccionario tiene que llevar tildes: sin ellas se cuelan «cancion» y «estó» de los subtítulos.
import { readFileSync } from 'node:fs';
import { analizar } from '../js/lang/es.js';
import { escribir } from './escribir.mjs';

const [frecuencia, diccionario] = process.argv.slice(2);
const MAX = 100000;
const dic = new Set(readFileSync(diccionario, 'utf8').split('\n'));
const vistas = new Set();
const salida = [];
for (const linea of readFileSync(frecuencia, 'utf8').split('\n')) {
  const w = linea.split(' ')[0];
  if (!/^[a-záéíóúüñ]{2,}$/.test(w) || vistas.has(w) || !dic.has(w)) continue;
  vistas.add(w);
  const e = analizar(w);
  if (e) salida.push(e);
  if (salida.length >= MAX) break;
}
escribir('es', salida);
