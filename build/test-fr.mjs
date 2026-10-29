// node build/test-fr.mjs — comprueba las claves del francés con transcripciones de Lexique.
import { claves } from '../js/lang/fr.js';
import assert from 'node:assert/strict';

const casos = [
  // palabra, phon (Lexique), cons, ason, sílabas
  ['table', 'tabl', 'abl', 'a', 1],
  ['sable', 'sabl', 'abl', 'a', 1],
  ['chanter', 'S@te', 'e', 'e', 2],
  ['été', 'ete', 'e', 'e', 2],
  ['nez', 'ne', 'e', 'e', 1],
  ['vin', 'v5', '5', '5', 1],
  ['pain', 'p5', '5', '5', 1],
  ['main', 'm5', '5', '5', 1],
  ['peur', 'p2R', '2R', '2', 1],
  ['fleur', 'fl9R', '2R', '2', 1],
  ['peu', 'p2', '2', '2', 1],
  ['feu', 'f2', '2', '2', 1],
  ['fille', 'fij', 'ij', 'i', 1],
  ['famille', 'famij', 'ij', 'i', 2],
  ['oui', 'wi', 'i', 'i', 1],
  ['lui', 'l8i', 'i', 'i', 1],
  ['bon', 'b§', '§', '§', 1],
  ['son', 's§', '§', '§', 1],
  ['maison', 'mEz§', '§', '§', 2],
  ['petite', 'p°tit', 'it', 'i', 2],
  ['aime', 'Em', 'Em', 'E', 1],
  ['heureux', '2R2', '2', '2', 2],
  ['monde', 'm§d', '§d', '§', 1],
];
let mal = 0;
for (const [p, phon, cons, ason, sil] of casos) {
  const r = claves(phon);
  try { assert.deepEqual([r.cons, r.ason, r.sil], [cons, ason, sil]); }
  catch { mal++; console.log(`✗ ${p}: esperaba ${[cons, ason, sil].join(' ')} y salió ${[r.cons, r.ason, r.sil].join(' ')}`); }
}
// oui y lui riman entre sí (i), pero no con fille (ij)
assert.notEqual(claves('wi').cons, claves('fij').cons);
console.log(mal ? `${mal} de ${casos.length} mal` : `✓ ${casos.length} palabras bien`);
process.exit(mal ? 1 : 0);
