// français: sin acento léxico, la rima va desde la última vocal. La pronunciación viene de Lexique 383
// (build/fr.mjs); no hay analizar: una palabra que no esté en la lista no se puede analizar.
export const nombre = 'français';

const VOCAL = /[aeEiouy29@51§°]/g;

// Claves de una transcripción de Lexique. 2 y 9 (eu cerrada/abierta) se juntan: Lexique no las separa con criterio.
export function claves(phon) {
  phon = phon.replace(/9/g, '2').replace(/°$/, '');
  const vocales = phon.match(VOCAL) || [];
  if (!vocales.length) return null;
  const ultima = phon.search(/[aeEiouy2@51§°][^aeEiouy2@51§°]*$/);
  return { cons: phon.slice(ultima), ason: phon[ultima], sil: vocales.length };
}

const LEGIBLE = { E: 'è', O: 'o', 2: 'eu', 9: 'eu', '@': 'an', 5: 'in', 1: 'un', '§': 'on', y: 'u', u: 'ou', S: 'ch', Z: 'j', N: 'gn', G: 'ng', R: 'r', 8: 'u', j: 'y', '°': 'e' };
const mostrar = (clave) => [...clave].map((c) => LEGIBLE[c] ?? c).join('');

export function describir(e) {
  return `${e.sil} ${e.sil === 1 ? 'syllabe' : 'syllabes'} · rime <b>-${mostrar(e.cons)}</b> · voyelle <b>${mostrar(e.ason)}</b>`;
}
