// node build/es.mjs <es_full.txt> <MM.adj MM.nom MM.verb …>
// Cruza la lista de frecuencia (OpenSubtitles, hermitdave/FrequencyWords) con el diccionario de formas
// con tildes de FreeLing (data/es/dictionary/entries/MM.*, líneas «forma lema etiqueta») y escribe js/palabras/es.js.
// El diccionario tiene que llevar tildes: sin ellas se cuelan «cancion» y «estó» de los subtítulos.
// De la etiqueta sale el tipo de palabra (primera letra EAGLES); una forma puede ser varios («canto»: nv).
import { readFileSync } from 'node:fs';
import { analizar } from '../js/lang/es.js';
import { escribir } from './escribir.mjs';

const [frecuencia, ...diccionario] = process.argv.slice(2);
const MAX = 100000;
// N sustantivo, A adjetivo, V verbo, R adverbio; pronombres, determinantes, preposiciones, conjunciones,
// interjecciones y números van juntos en «o» (otras). F (puntuación) no es palabra.
const TIPO = { N: 'n', A: 'a', V: 'v', R: 'r', P: 'o', D: 'o', S: 'o', C: 'o', I: 'o', Z: 'o' };
const dic = new Map();
for (const linea of diccionario.flatMap((f) => readFileSync(f, 'utf8').split('\n'))) {
  const [forma, , etiqueta] = linea.split(' ');
  const t = TIPO[etiqueta?.[0]];
  if (t) (dic.get(forma) || dic.set(forma, new Set()).get(forma)).add(t);
}
const vistas = new Set();
const salida = [];
for (const linea of readFileSync(frecuencia, 'utf8').split('\n')) {
  const w = linea.split(' ')[0];
  if (!/^[a-záéíóúüñ]{2,}$/.test(w) || vistas.has(w) || !dic.has(w)) continue;
  vistas.add(w);
  const e = analizar(w);
  if (e) salida.push({ ...e, tipos: [...'navro'].filter((t) => dic.get(w).has(t)).join('') });
  if (salida.length >= MAX) break;
}
escribir('es', salida);
