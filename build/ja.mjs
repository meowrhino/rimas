// node build/ja.mjs <jmdict-eng-common.json> <ja_full.txt>
// Las entradas comunes de JMdict (scriptin/jmdict-simplified) con su lectura en kana,
// ordenadas por la frecuencia de OpenSubtitles (hermitdave/FrequencyWords); escribe js/palabras/ja.js.
import { readFileSync } from 'node:fs';
import { analizar } from '../js/lang/ja.js';
import { escribir } from './escribir.mjs';

const [jmdict, frecuencia] = process.argv.slice(2);
const rango = new Map();
readFileSync(frecuencia, 'utf8').split('\n').forEach((l, i) => { const w = l.split(' ')[0]; rango.has(w) || rango.set(w, i); });
const vistas = new Set();
const salida = [];
for (const { kanji, kana, sense } of JSON.parse(readFileSync(jmdict, 'utf8')).words) {
  const enKana = sense.some((x) => x.misc.includes('uk')); // «usually kana»: あなた, no 貴方
  const k = (!enKana && kanji.find((x) => x.common)) || null;
  const lectura = kana.find((x) => x.common && (!k || x.appliesToKanji.includes('*') || x.appliesToKanji.includes(k.text))) || kana[0];
  if (!lectura) continue;
  const w = k ? k.text : lectura.text;
  const e = analizar(lectura.text);
  if (!e || vistas.has(w)) continue;
  vistas.add(w);
  salida.push({ ...e, w, r: lectura.text, rango: rango.get(w) ?? rango.get(lectura.text) ?? Infinity });
}
salida.sort((a, b) => a.rango - b.rango);
escribir('ja', salida);
