// français: sin acento léxico, la rima va desde la última vocal. La pronunciación viene de Lexique 383 (build/fr.mjs)
// y va entera en la lista (campo f); sin analizar: una palabra fuera de la lista no se puede buscar.
// Grados clásicos por sonidos en común desde la última vocal: pauvre 1, suffisante 2, riche 3 o más.
import { simRasgos } from './rasgos.js';
export const nombre = 'français';
export const tonicas = ['masculine', 'féminine'];                   // féminine: acaba en e muda (rivière / fière)
export const etiquetas = { homofonas: 'homophones', ricas: 'rimes riches (3 sons ou plus)', consonantes: 'rimes suffisantes (2 sons)', asonantes: 'rimes pauvres · assonances', imperfectas: 'contre-assonances (mêmes consonnes, autre voyelle)', multisilabicas: 'assonances sur plusieurs syllabes', facil: 'rime facile' };
export const umbrales = { rica: 3, suficiente: 2 };                 // en sonidos comunes desde el final

const VOCALES = [...'aeEiouy2@51§'];
export const sim = simRasgos({
  p: 'ocl bil sor', b: 'ocl bil son', t: 'ocl den sor', d: 'ocl den son', k: 'ocl vel sor', g: 'ocl vel son',
  f: 'fri lab sor', v: 'fri lab son', s: 'fri alv sor', z: 'fri alv son', S: 'fri pal sor', Z: 'fri pal son',
  m: 'nas bil son', n: 'nas alv son', N: 'nas pal son', G: 'nas vel son', l: 'liq alv son', R: 'liq uvu son',
  j: 'liq pal son', w: 'liq lab son', 8: 'liq lab son',
}, VOCALES, ['e E', 'o O', 'i e', 'u o', 'y 2', 'a @', 'E 5', '2 1', 'O §', 'o §', 'a O', 'e 2', 'i y', 'a E']);
export const sonidos = (e) => (e.f ? [...e.f] : null);
export const vocal = (s) => (VOCALES.includes(s) ? s : null);

// Claves de una transcripción de Lexique. 2 y 9 (eu cerrada/abierta) se juntan: Lexique no las separa con criterio.
// tonica: 2 (féminine) si la grafía acaba en e muda (-e, -es, o -ent de verbo), 1 (masculine) si no.
export function claves(phon, ortho = '', cgram = '') {
  phon = phon.replace(/9/g, '2').replace(/°$/, '');
  const vocales = phon.match(/[aeEiouy2@51§°]/g) || [];
  if (!vocales.length) return null;
  const ultima = phon.search(/[aeEiouy2@51§°][^aeEiouy2@51§°]*$/);
  const femenina = /(^|[^é])es?$/.test(ortho) || (cgram.startsWith('VER') && /ent$/.test(ortho));
  return { cons: phon.slice(ultima), ason: phon[ultima], sil: vocales.length, tonica: femenina ? 2 : 1, f: phon };
}

const LEGIBLE = { E: 'è', O: 'o', 2: 'eu', 9: 'eu', '@': 'an', 5: 'in', 1: 'un', '§': 'on', y: 'u', u: 'ou', S: 'ch', Z: 'j', N: 'gn', G: 'ng', R: 'r', 8: 'u', j: 'y', '°': 'e' };
const mostrar = (clave) => [...clave].map((c) => LEGIBLE[c] ?? c).join('');

export function describir(e) {
  const tipo = e.tonica ? `, ${tonicas[e.tonica - 1]}` : '';
  return `${e.sil} ${e.sil === 1 ? 'syllabe' : 'syllabes'}${tipo} · rime <b>-${mostrar(e.cons)}</b> · voyelle <b>${mostrar(e.ason)}</b>`;
}
