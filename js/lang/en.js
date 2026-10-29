// english: la pronunciación viene de CMUdict (build/en.mjs) y va entera en la lista (campo f, ARPAbet sin acentos).
// Rima perfecta desde la última vocal con acento primario; sin analizar: una palabra fuera de la lista no se puede buscar.
import { simRasgos } from './rasgos.js';
export const nombre = 'english';
export const sep = ' ';                                             // las claves llevan los fonemas separados: "AY M"
export const tonicas = ['masculine', 'feminine', 'dactylic'];       // acento en la última, penúltima o antepenúltima sílaba
export const etiquetas = { homofonas: 'homophones', ricas: 'identical rhymes (same onset · leave / believe)', consonantes: 'perfect rhymes', asonantes: 'assonance', imperfectas: 'slant rhymes (consonance · shape / keep)', multisilabicas: 'multisyllabic assonance', facil: 'easy rhyme' };

const VOCALES = ['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'];
export const sim = simRasgos({
  P: 'ocl bil sor', B: 'ocl bil son', T: 'ocl alv sor', D: 'ocl alv son', K: 'ocl vel sor', G: 'ocl vel son',
  CH: 'afr pal sor', JH: 'afr pal son', F: 'fri lab sor', V: 'fri lab son', TH: 'fri den sor', DH: 'fri den son',
  S: 'fri alv sor', Z: 'fri alv son', SH: 'fri pal sor', ZH: 'fri pal son', HH: 'fri glo sor',
  M: 'nas bil son', N: 'nas alv son', NG: 'nas vel son', L: 'liq alv son', R: 'liq alv son', W: 'liq lab son', Y: 'liq pal son',
}, VOCALES, ['IY IH', 'EH AE', 'EH IH', 'AH AA', 'AO AA', 'UW UH', 'OW AO', 'EY IY', 'EY EH', 'AY AA', 'AW AA', 'OY AO', 'ER AH', 'AH UH']);
export const sonidos = (e) => (e.f ? e.f.split(' ') : null);
export const vocal = (s) => (VOCALES.includes(s) ? s : null);

// "rhyme R AY1 M" → { cons: 'AY M', ason: 'AY', sil: 1, tonica: 1, f: 'R AY M' }:
// desde la última vocal con acento 1 (si no 2, si no la última); tonica = sílabas desde ella (1 masculine, 2 feminine, 3 dactylic).
export function claves(fonemas) {
  const vocales = fonemas.map((f, i) => (/\d/.test(f) ? i : -1)).filter((i) => i >= 0);
  if (!vocales.length) return null;
  const tonica = [...vocales].reverse().find((i) => fonemas[i].endsWith('1')) ?? [...vocales].reverse().find((i) => fonemas[i].endsWith('2')) ?? vocales.at(-1);
  const limpio = fonemas.map((f) => f.replace(/\d/, ''));
  const desde = limpio.slice(tonica);
  return { cons: desde.join(' '), ason: desde.filter((f) => VOCALES.includes(f)).join(' '), sil: vocales.length, tonica: Math.min(3, vocales.filter((i) => i >= tonica).length), f: limpio.join(' ') };
}

const GRAFIA = { AY: 'ai', IY: 'ee', EH: 'e', AE: 'a', AA: 'ah', AO: 'aw', OW: 'o', UW: 'oo', UH: 'u', AH: 'uh', ER: 'er', EY: 'ay', OY: 'oy', AW: 'ow', IH: 'i', CH: 'ch', SH: 'sh', TH: 'th', DH: 'th', ZH: 'zh', NG: 'ng', JH: 'j', HH: 'h', Y: 'y' };
const mostrar = (clave) => clave.split(' ').map((f) => GRAFIA[f] || f.toLowerCase()).join('');

export function describir(e) {
  const tipo = e.tonica ? `, ${tonicas[e.tonica - 1]}` : '';
  return `${e.sil} ${e.sil === 1 ? 'syllable' : 'syllables'}${tipo} · rhyme <b>-${mostrar(e.cons)}</b> · vowels <b>${mostrar(e.ason)}</b>`;
}
