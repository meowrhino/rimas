// node build/test-en.mjs — comprueba las claves con palabras conocidas (necesita cmudict en $D).
import assert from 'node:assert/strict';
process.argv[3] = process.argv[2] || process.env.CMUDICT || '/private/tmp/claude-501/-Users-meowrhino-Library-Application-Support-Claude-scratch-workspaces-62ce0ff5-a944-4048-933e-ad6d3381c4d7-5a68afc5-2e24-4cf6-8fe9-e2e087e87af8-scratch-2026-10-29-d4724a/a5540ba9-d2df-4408-8e45-8d0523334f07/scratchpad/dl/cmudict.dict';
process.argv[2] = '';
const { claves, dic } = await import('./en.mjs');
const { describir } = await import('../js/lang/en.js');

const c = (w) => claves(dic.get(w));
const casos = [
  // palabra, cons, ason, sil
  ['rhyme', 'AYM', 'AY', 1],
  ['time', 'AYM', 'AY', 1],
  ['climb', 'AYM', 'AY', 1],
  ['little', 'IHTAHL', 'IHAH', 2],
  ['brittle', 'IHTAHL', 'IHAH', 2],
  ['nation', 'EYSHAHN', 'EYAH', 2],
  ['station', 'EYSHAHN', 'EYAH', 2],
  ['moon', 'UWN', 'UW', 1],
  ['june', 'UWN', 'UW', 1],
  ['through', 'UW', 'UW', 1],
  ['blue', 'UW', 'UW', 1],
  ['orange', 'AORAHNJH', 'AOAH', 2],
  ['banana', 'AENAH', 'AEAH', 3],
  ['about', 'AWT', 'AW', 2],
  ['computer', 'UWTER', 'UWER', 3],
  ['beautiful', 'UWTAHFAHL', 'UWAHAH', 3],
  ['love', 'AHV', 'AH', 1],
  ['above', 'AHV', 'AH', 2],
];
let mal = 0;
for (const [w, cons, ason, sil] of casos) {
  const r = c(w);
  try {
    assert.deepEqual([r.cons, r.ason, r.sil], [cons, ason, sil]);
  } catch {
    mal++;
    console.log(`✗ ${w}: esperaba ${[cons, ason, sil].join(' ')} y salió ${[r.cons, r.ason, r.sil].join(' ')}`);
  }
}
assert.equal(describir({ ...c('rhyme'), w: 'rhyme' }), '1 syllable · rhyme <b>-aim</b> · vowels <b>ai</b>');
assert.notEqual(c('orange').cons, c('door').cons);
console.log(mal ? `${mal} de ${casos.length} mal` : `✓ ${casos.length} palabras bien`);
process.exit(mal ? 1 : 0);
