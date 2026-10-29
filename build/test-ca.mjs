// node build/test-ca.mjs — comprueba el catalán con palabras conocidas.
import { analizar } from '../js/lang/ca.js';
import assert from 'node:assert/strict';

const casos = [
  // palabra, sílabas, tónica (1 aguda, 2 plana, 3 esdrúixola), consonante, asonante
  ['casa', 2, 2, 'az@', 'a@'],
  ['pare', 2, 2, 'ar@', 'a@'],
  ['cançó', 2, 1, 'o', 'o'],
  ['amor', 2, 1, 'o', 'o'],
  ['color', 2, 1, 'o', 'o'],
  ['colors', 2, 1, 'os', 'o'],
  ['cor', 1, 1, 'or', 'o'],
  ['mar', 1, 1, 'ar', 'a'],
  ['cantar', 2, 1, 'a', 'a'],
  ['palau', 2, 1, 'au', 'a'],
  ['blau', 1, 1, 'au', 'a'],
  ['museu', 2, 1, 'eu', 'e'],
  ['noia', 2, 2, 'oi@', 'o@'],
  ['joia', 2, 2, 'oi@', 'o@'],
  ['aigua', 2, 2, 'aigu@', 'a@'],
  ['pont', 1, 1, 'on', 'o'],
  ['bon', 1, 1, 'on', 'o'],
  ['molt', 1, 1, 'ol', 'o'],
  ['sol', 1, 1, 'ol', 'o'],
  ['fred', 1, 1, 'et', 'e'],
  ['net', 1, 1, 'et', 'e'],
  ['roig', 1, 1, 'oC', 'o'],
  ['boig', 1, 1, 'oC', 'o'],
  ['peix', 1, 1, 'eS', 'e'],
  ['mateix', 2, 1, 'eS', 'e'],
  ['any', 1, 1, 'añ', 'a'],
  ['company', 2, 1, 'añ', 'a'],
  ['cavall', 2, 1, 'aL', 'a'],
  ['vall', 1, 1, 'aL', 'a'],
  ['platja', 2, 2, 'aJ@', 'a@'],
  ['pluja', 2, 2, 'uZ@', 'u@'],
  ['puja', 2, 2, 'uZ@', 'u@'],
  ['camí', 2, 1, 'i', 'i'],
  ['aquí', 2, 1, 'i', 'i'],
  ['cafè', 2, 1, 'E', 'E'],
  ['què', 1, 1, 'E', 'E'],
  ['cases', 2, 2, 'az@s', 'a@'],
  ['nois', 1, 1, 'ois', 'o'],
  ['examen', 3, 2, 'am@n', 'a@'],
  ['raïm', 2, 1, 'im', 'i'],
  ['veïna', 3, 2, 'in@', 'i@'],
  ['cuina', 2, 2, 'uin@', 'u@'],
  ['història', 4, 3, 'Ori@', 'O@'],
  ['gràcies', 3, 3, 'asi@s', 'a@'],
  ['llum', 1, 1, 'um', 'u'],
  ['xoc', 1, 1, 'ok', 'o'],
  ['taxi', 2, 2, 'aksi', 'ai'],
  ['sang', 1, 1, 'an', 'a'],
  ['camp', 1, 1, 'am', 'a'],
  ['temps', 1, 1, 'ems', 'e'],
  ['viu', 1, 1, 'iu', 'i'],
  ['ràpidament', 4, 1, 'en', 'e'],
  ['content', 2, 1, 'en', 'e'],
  ['senyor', 2, 1, 'o', 'o'],
  ['dona', 2, 2, 'on@', 'o@'],
  ['persona', 3, 2, 'on@', 'o@'],
  ['lluna', 2, 2, 'un@', 'u@'],
  ['qüestió', 3, 1, 'o', 'o'],
  ['iogurt', 2, 1, 'urt', 'u'],
  ['país', 2, 1, 'is', 'i'],
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
console.log(mal ? `${mal} de ${casos.length} mal` : `✓ ${casos.length} palabras bien`);
process.exit(mal ? 1 : 0);
