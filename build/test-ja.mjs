// node build/test-ja.mjs — comprueba romaji → kana y las claves por moras.
import { kana, analizar } from '../js/lang/ja.js';
import assert from 'node:assert/strict';

const aKana = [
  ['sekai', 'せかい'], ['jikan', 'じかん'], ['kitte', 'きって'], ['tōkyō', 'とうきょう'], ['toukyou', 'とうきょう'],
  ['shinbun', 'しんぶん'], ['kin\'en', 'きんえん'], ['kinnen', 'きんえん'], ['matcha', 'まっちゃ'], ['fuji', 'ふじ'],
  ['tsunami', 'つなみ'], ['tunami', 'つなみ'], ['jya', 'じゃ'], ['コーヒー', 'こーひー'], ['ryokan', 'りょかん'],
  ['kon\'nichiwa', 'こんにちわ'], ['fōku', 'ふぉうく'], ['パーティー', 'ぱーてぃー'],
];
// palabra, moras, consonante (dos últimas moras), asonante (sus vocales)
const claves = [
  ['せかい', 3, 'kai', 'ai'], ['機械', null], ['きかい', 3, 'kai', 'ai'], ['じかん', 3, 'kaN', 'aN'], ['にんげん', 4, 'geN', 'eN'],
  ['きって', 3, 'Qte', 'Qe'], ['とうきょう', 4, 'kyou', 'ou'], ['こーひー', 4, 'hii', 'ii'], ['め', 1, 'me', 'e'],
  ['sakura', 3, 'kura', 'ua'], ['kaisan', 4, 'saN', 'aN'],
];
let mal = 0;
const prueba = (nombre, f) => { try { f(); } catch (e) { mal++; console.log(`✗ ${nombre}: ${e.message}`); } };
for (const [r, k] of aKana) prueba(r, () => assert.equal(kana(r), k));
for (const [p, sil, cons, ason] of claves) prueba(p, () => {
  const e = analizar(p);
  if (sil === null) return assert.equal(e, null);
  assert.deepEqual([e.sil, e.cons, e.ason], [sil, cons, ason]);
});
// 時間 y 解散 asuenan (aN); 時間 y 人間 no
prueba('jikan≠ningen', () => assert.notEqual(analizar('じかん').cons, analizar('にんげん').cons));
prueba('jikan~kaisan', () => assert.equal(analizar('じかん').ason, analizar('かいさん').ason));
const total = aKana.length + claves.length + 2;
console.log(mal ? `${mal} de ${total} mal` : `✓ ${total} casos bien`);
process.exit(mal ? 1 : 0);
