// node build/fr.mjs <Lexique383.tsv>
// Una entrada por grafía (la más frecuente si se repite), por orden de uso (freqfilms2), y escribe js/palabras/fr.js.
import { readFileSync } from 'node:fs';
import { claves } from '../js/lang/fr.js';
import { escribir } from './escribir.mjs';

const MAX = 100000;
const [cabecera, ...filas] = readFileSync(process.argv[2], 'utf8').split('\n');
const col = Object.fromEntries(cabecera.split('\t').map((c, i) => [c, i]));
const mejor = new Map(); // ortho → { phon, freq, cgram }
for (const fila of filas) {
  const f = fila.split('\t');
  const w = f[col.ortho], phon = f[col.phon], freq = +f[col.freqfilms2], cgram = f[col.cgram];
  if (!/^[a-zàâäéèêëîïôöùûüÿçœæ'-]+$/.test(w) || !phon) continue;
  if (!mejor.has(w) || mejor.get(w).freq < freq) mejor.set(w, { phon, freq, cgram });
}
const salida = [...mejor].sort((a, b) => b[1].freq - a[1].freq).slice(0, MAX)
  .flatMap(([w, { phon, cgram }]) => { const c = claves(phon, w, cgram); return c ? [{ w, ...c }] : []; });
escribir('fr', salida);
