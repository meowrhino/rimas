// node build/test.mjs — comprueba el algoritmo con palabras conocidas.
import { analizar, fonetica } from '../js/lang/es.js';
import { parecido } from '../js/lang/rasgos.js';
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
  ['rápidamente', 5, 2, 'ente', 'ee'],
  ['solamente', 4, 2, 'ente', 'ee'],
  ['gente', 2, 2, 'ente', 'ee'],
  ['mente', 2, 2, 'ente', 'ee'],
  ['búho', 2, 2, 'uo', 'uo'],
  ['ahora', 3, 2, 'ora', 'oa'],
  ['reír', 2, 1, 'ir', 'i'],
  ['huir', 1, 1, 'ir', 'i'],
  ['muy', 1, 1, 'i', 'i'],
  ['cuídate', 3, 3, 'idate', 'ie'],
  ['elle', 2, 2, 'eye', 'ee'],
  ['éxito', 3, 3, 'eksito', 'eo'],
  ['acción', 2, 1, 'on', 'o'],
  ['pasión', 2, 1, 'on', 'o'],
  ['abrazo', 3, 2, 'azo', 'ao'],
  ['paso', 2, 2, 'aso', 'ao'],
  ['lunes', 2, 2, 'unes', 'ue'],
  ['virus', 2, 2, 'irus', 'io'],
  ['guion', 1, 1, 'on', 'o'],
  ['línea', 3, 3, 'inea', 'ia'],
  ['héroe', 3, 3, 'eroe', 'ee'],
  ['oír', 2, 1, 'ir', 'i'],
  ['ruido', 2, 2, 'ido', 'io'],
  ['agua', 2, 2, 'agua', 'aa'],
  ['antigua', 3, 2, 'igua', 'ia'],
  ['lengua', 2, 2, 'engua', 'ea'],
  ['yo', 1, 1, 'o', 'o'],
  ['y', 1, 1, 'i', 'i'],
];
let mal = 0;
for (const [p, s, t, c, a] of casos) {
  const r = analizar(p);
  try {
    assert.deepEqual([r.sil, r.tonica, r.cons, r.ason], [s, t, c, a]);
  } catch {
    mal++;
    console.log(`✗ ${p}: esperaba ${[s, t, c, a].join(' ')} y salió ${[r.sil, r.tonica, r.cons, r.ason].join(' ')}`);
  }
}
// parecido fonético: «quieres ir» suena más a «decir» (es-ir ~ ez-ir) que a «salir»
for (const [frase, mejor, peor] of [['quieres ir', 'decir', 'salir'], ['mi corazón', 'razón', 'canción'], ['cielo', 'hielo', 'pelo'], ['gato', 'pato', 'palo']]) {
  const q = fonetica(frase.replace(/\s+/g, ''));
  const [a, b] = [mejor, peor].map((w) => parecido(q, fonetica(w)));
  if (!(a > b)) { mal++; console.log(`✗ parecido: con «${frase}», ${mejor} (${a.toFixed(2)}) tendría que ganar a ${peor} (${b.toFixed(2)})`); }
}
console.log(mal ? `${mal} de ${casos.length} mal` : `✓ ${casos.length} palabras bien`);
process.exit(mal ? 1 : 0);
