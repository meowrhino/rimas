// català (central): de una palabra saca su sílaba tónica y sus claves de rima.
// Sirve en el navegador y en node (build/ca.mjs, build/test-ca.mjs).
import { simEs } from './rasgos.js';
export const nombre = 'català';
export const tonicas = ['aguda', 'plana', 'esdrúixola']; // 1, 2, 3; sirve para colorear y filtrar por métrica
export const etiquetas = { homofonas: 'homòfones', ricas: 'consonants riques', consonantes: 'consonants', asonantes: 'assonants', imperfectas: 'imperfectes', multisilabicas: 'assonants multisil·làbiques', facil: 'rima fàcil' };
export const sim = simEs;
export const sonidos = (e) => [...sinAccent(fonetica(e.w))];          // la pronunciación entera, un sonido por letra
export const vocal = (s) => ('aeiou@'.includes(s) ? s : null);

const VOCAL = 'aeiouàèéíòóúïü';
const DEBIL = 'iu';                 // ï y ü nunca forman diptongo
// è/é i ò/ó sonen diferent, però sense diccionari de pronúncia no sabem el timbre de les e/o sense accent:
// les claus no el distingeixen (cafè rima amb pedra), i el parecido tampoc.
const BASE = { à: 'a', è: 'e', é: 'e', í: 'i', ò: 'o', ó: 'o', ú: 'u', ï: 'i', ü: 'u' };
const sinAccent = (s) => s.replace(/[àèéíòóúïü]/g, (c) => BASE[c]);

// Forma fonética aproximada: una letra por sonido (C = tx, J = tj, Z = j/g, S = x, L = ll, ñ = ny, @ = vocal neutra).
export function fonetica(palabra) {
  let f = palabra
    .toLowerCase()
    .replace(/([aeiouàèéíòóúïü])s(?=[aeiouàèéíòóúïü])/g, '$1z')
    .replace(/l[·.]l/g, 'l')
    .replace(/ny/g, 'ñ')
    .replace(/ll/g, 'L')
    .replace(/tx/g, 'C')
    .replace(/([aeiouàèéíòóú])ig$/, '$1C')
    .replace(/ig$/, 'iC')
    .replace(/tj/g, 'J')
    .replace(/tg(?=[eèéií])/g, 'J')
    .replace(/g(?=[eèéií])/g, 'Z')
    .replace(/j/g, 'Z')
    .replace(/([aeiouàèéíòóú])ix/g, '$1S')
    .replace(/(^|[^aeiouàèéíòóú])x/g, '$1S')
    .replace(/x/g, 'ks')
    .replace(/qu(?=[eèéií])/g, 'k')
    .replace(/qü/g, 'ku')
    .replace(/qu/g, 'ku')
    .replace(/gu(?=[eèéií])/g, 'g')
    .replace(/gü/g, 'gu')
    .replace(/ç/g, 's')
    .replace(/c(?=[eèéií])/g, 's')
    .replace(/c/g, 'k')
    .replace(/h/g, '')
    .replace(/v/g, 'b')
    .replace(/ss/g, 's')
    .replace(/w/g, 'u')
    .replace(/y/g, 'i')
    .replace(/nt(s?)$/, 'n$1')
    .replace(/lt(s?)$/, 'l$1')
    .replace(/mp(s?)$/, 'm$1')
    .replace(/ng(s?)$/, 'n$1')
    .replace(/b$/, 'p').replace(/d$/, 't').replace(/g$/, 'k');
  return f;
}

// Núcleos vocálicos: [inicio, fin). Diptongo decreciente (ai, eu, ou…), creciente solo tras k/g (qua, gua, qüe) o al principio (iogurt).
function nucleos(f) {
  const n = [];
  let i = 0;
  while (i < f.length) {
    if (!VOCAL.includes(f[i])) { i++; continue; }
    let j = i + 1;
    if (DEBIL.includes(f[i]) && j < f.length && VOCAL.includes(f[j]) && (i === 0 || 'kg'.includes(f[i - 1]))) j++;
    if (j < f.length && DEBIL.includes(f[j])) j++;
    n.push([i, j]);
    i = j;
  }
  return n;
}

// Vocal que lleva la voz dentro del núcleo: la del acento, si no la fuerte, si no la primera (viu → i, cuina → u).
function vocalTonica(f, [a, b]) {
  for (let i = a; i < b; i++) if ('àèéíòóú'.includes(f[i])) return i;
  for (let i = a; i < b; i++) if ('aeo'.includes(f[i])) return i;
  return a;
}

export function analizar(palabra) {
  const p = palabra.toLowerCase().trim();
  let f = fonetica(p);
  let ns = nucleos(f);
  if (!ns.length) return null;
  // la r final es muda en las palabras de más de una sílaba (cantar, color, senyor); en «mar», «cor», no
  if (ns.length > 1 && /r(s?)$/.test(f)) { f = f.replace(/r(s?)$/, '$1'); ns = nucleos(f); }
  let tonica = ns.findIndex(([a, b]) => /[àèéíòóú]/.test(f.slice(a, b)));
  if (/.ment$/.test(p) && p.length > 5) tonica = ns.length - 1; // «ràpidament»: la voz va en «ment»
  if (tonica < 0) {
    const fin = p[p.length - 1];
    const antes = p[p.length - 2] || '';
    const ultimo = ns[ns.length - 1];
    const diptongo = ultimo[1] - ultimo[0] > 1 && DEBIL.includes(f[ultimo[1] - 1]); // decreciente (palau, nois); aigua es plana
    const llana = ('aeiou'.includes(fin) && !diptongo) || (fin === 's' && 'aeiou'.includes(antes) && !diptongo) || /[ei]n$/.test(p);
    tonica = ns.length === 1 ? 0 : llana ? ns.length - 2 : ns.length - 1;
  }
  const vt = vocalTonica(f, ns[tonica]);
  // desde la tónica: a/e átonas → @ (neutra), o → u
  const reducir = (c, i) => (i === 0 ? sinAccent(c) : { a: '@', e: '@', o: 'u' }[c] || sinAccent(c));
  const consonante = [...f.slice(vt)].map(reducir).join('');
  let vocales = ns.slice(tonica).map((n, i) => reducir(f[i === 0 ? vt : vocalTonica(f, n)], i));
  if (vocales.length > 2) vocales = [vocales[0], vocales[vocales.length - 1]];
  return { w: p, sil: ns.length, tonica: ns.length - tonica, cons: consonante, ason: vocales.join('') };
}

const BONITO = { '@': 'ə', L: 'll', Z: 'j', S: 'x', C: 'tx', J: 'tj', ñ: 'ny' };
const mostrar = (clave) => [...clave].map((c) => BONITO[c] || c).join('');

export function describir(e) {
  const tipo = e.tonica ? ', ' + (['aguda', 'plana', 'esdrúixola'][e.tonica - 1] || 'sobreesdrúixola') : '';
  return `${e.sil} ${e.sil === 1 ? 'síl·laba' : 'síl·labes'}${tipo} · consonant <b>-${mostrar(e.cons)}</b> · assonant <b>${[...e.ason].map((c) => BONITO[c] || c).join('-')}</b>`;
}
