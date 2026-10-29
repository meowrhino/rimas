// node build/test.mjs — comprueba el algoritmo con palabras conocidas.
import { analizar } from '../js/rima.js';
import assert from 'node:assert/strict';

const casos = [
  // palabra, sílabas, tónica (1 aguda, 2 llana, 3 esdrújula), consonante, asonante
  ['casa', 2, 2, 'asa', 'aa'],
  ['caza', 2, 2, 'aza', 'aa'],
  ['cielo', 2, 2, 'elo', 'eo'],
  ['pelo', 2, 2, 'elo', 'eo'],
  ['canción', 2, 1, 'on', 'o'],
  ['corazón', 3, 1, 'on', 'o'],
  ['pájaro', 3, 3, 'ajaro', 'ao'],
  ['mano', 2, 2, 'ano', 'ao'],
  ['poeta', 3, 2, 'eta', 'ea'],
  ['día', 2, 2, 'ia', 'ia'],
  ['mía', 2, 2, 'ia', 'ia'],
  ['país', 2, 1, 'is', 'i'],
  ['baúl', 2, 1, 'ul', 'u'],
  ['azul', 2, 1, 'ul', 'u'],
  ['rey', 1, 1, 'ei', 'e'],
  ['ley', 1, 1, 'ei', 'e'],
  ['jersey', 2, 1, 'ei', 'e'],
  ['hoy', 1, 1, 'oi', 'o'],
  ['aire', 2, 2, 'aire', 'ae'],
  ['nadie', 2, 2, 'adie', 'ae'],
  ['ciudad', 2, 1, 'ad', 'a'],
  ['verdad', 2, 1, 'ad', 'a'],
  ['fui', 1, 1, 'i', 'i'],
  ['aquí', 2, 1, 'i', 'i'],
  ['queso', 2, 2, 'eso', 'eo'],
  ['beso', 2, 2, 'eso', 'eo'],
  ['guerra', 2, 2, 'eRa', 'ea'],
  ['perra', 2, 2, 'eRa', 'ea'],
  ['pera', 2, 2, 'era', 'ea'],
  ['pingüino', 3, 2, 'ino', 'io'],
  ['vino', 2, 2, 'ino', 'io'],
  ['valla', 2, 2, 'aya', 'aa'],
  ['vaya', 2, 2, 'aya', 'aa'],
  ['gente', 2, 2, 'ente', 'ee'],
  ['crisis', 2, 2, 'isis', 'ie'],
  ['firme', 2, 2, 'irme', 'ie'],
  ['espíritu', 4, 3, 'iritu', 'io'],
  ['robots', 2, 1, 'ots', 'o'],
  ['examen', 3, 2, 'amen', 'ae'],
  ['ahí', 2, 1, 'i', 'i'],
  ['buey', 1, 1, 'ei', 'e'],
  ['leer', 2, 1, 'er', 'e'],
  ['hecho', 2, 2, 'eCo', 'eo'],
  ['echo', 2, 2, 'eCo', 'eo'],
];
let mal = 0;
for (const [p, s, t, c, a] of casos) {
  const r = analizar(p);
  try {
    assert.deepEqual([r.silabas, r.tonica, r.consonante, r.asonante], [s, t, c, a]);
  } catch {
    mal++;
    console.log(`✗ ${p}: esperaba ${[s, t, c, a].join(' ')} y salió ${[r.silabas, r.tonica, r.consonante, r.asonante].join(' ')}`);
  }
}
console.log(mal ? `${mal} de ${casos.length} mal` : `✓ ${casos.length} palabras bien`);
process.exit(mal ? 1 : 0);
