// inglés: las claves salen de CMUdict en el build (build/en.mjs); aquí solo se enseñan.
export const nombre = 'english';

const GRAFIA = { AY: 'ai', IY: 'ee', EH: 'e', AE: 'a', AA: 'ah', AO: 'aw', OW: 'o', UW: 'oo', UH: 'u', AH: 'uh', ER: 'er', EY: 'ay', OY: 'oy', AW: 'ow', IH: 'i', CH: 'ch', SH: 'sh', TH: 'th', DH: 'th', ZH: 'zh', NG: 'ng', JH: 'j', HH: 'h', Y: 'y' };
const mostrar = (clave) => clave.match(/[A-Z][A-Z]?/g).map((f) => GRAFIA[f] || f.toLowerCase()).join('');

export function describir(e) {
  return `${e.sil} ${e.sil === 1 ? 'syllable' : 'syllables'} · rhyme <b>-${mostrar(e.cons)}</b> · vowels <b>${mostrar(e.ason)}</b>`;
}
