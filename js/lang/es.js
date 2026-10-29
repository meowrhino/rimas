// castellano: de una palabra saca su sílaba tónica y sus claves de rima.
// Sirve en el navegador y en node (build/es.mjs, build/test-es.mjs).
export const nombre = 'castellano';

const VOCAL = 'aeiouáéíóúü';
const FUERTE = 'aeoáéíóú';          // una débil con tilde (í, ú) rompe el diptongo: cuenta como fuerte
const DEBIL = 'iuü';
const SIN_TILDE = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u' };
const quitarTildes = (s) => s.replace(/[áéíóúü]/g, (c) => SIN_TILDE[c]);

// Forma fonética aproximada: una letra por sonido (C = ch, R = rr, y = ll/y).
export function fonetica(palabra) {
  return palabra
    .toLowerCase()
    .replace(/y$/, 'i')
    .replace(/y(?![aeiouáéíóú])/g, 'i')
    .replace(/ch/g, 'C')
    .replace(/ll/g, 'y')
    .replace(/rr/g, 'R')
    .replace(/h/g, '')
    .replace(/qu(?=[eéií])/g, 'k')
    .replace(/gu(?=[eéií])/g, 'g')
    .replace(/gü/g, 'gu')
    .replace(/c(?=[eéií])/g, 'z')
    .replace(/c/g, 'k')
    .replace(/g(?=[eéií])/g, 'j')
    .replace(/v/g, 'b')
    .replace(/x/g, 'ks')
    .replace(/w/g, 'u');
}

// Núcleos vocálicos: [inicio, fin) sobre la forma fonética. Un diptongo es un solo núcleo.
function nucleos(f) {
  const n = [];
  let i = 0;
  while (i < f.length) {
    if (!VOCAL.includes(f[i])) { i++; continue; }
    let j = i + 1;
    let fuertes = FUERTE.includes(f[i]) ? 1 : 0;
    while (j < f.length && VOCAL.includes(f[j])) {
      const esFuerte = FUERTE.includes(f[j]);
      if (!(DEBIL.includes(f[j - 1]) || DEBIL.includes(f[j])) || fuertes + esFuerte > 1) break;
      fuertes += esFuerte;
      j++;
    }
    n.push([i, j]);
    i = j;
  }
  return n;
}

// Vocal que lleva la voz dentro de un núcleo: la de la tilde, si no la fuerte, si no la última.
function vocalTonica(f, [a, b]) {
  for (let i = a; i < b; i++) if ('áéíóú'.includes(f[i])) return i;
  for (let i = a; i < b; i++) if (FUERTE.includes(f[i])) return i;
  return b - 1;
}

export function analizar(palabra) {
  const p = palabra.toLowerCase().trim();
  const f = fonetica(p);
  const ns = nucleos(f);
  if (!ns.length) return null;
  let tonica = ns.findIndex(([a, b]) => /[áéíóú]/.test(f.slice(a, b)));
  if (/.mente$/.test(p) && p.length > 6) tonica = ns.length - 2; // «rápidamente»: la voz va en «men», no en la tilde
  if (tonica < 0) {
    if (ns.length === 1) tonica = 0;
    else {
      const fin = p[p.length - 1];
      const antes = p[p.length - 2] || '';
      // llana si acaba en vocal, n o s (pero «robots», «zigzags»: agudas); la y final cuenta como consonante
      const llana = 'aeiou'.includes(fin) || ('ns'.includes(fin) && 'aeiouy'.includes(antes));
      tonica = llana ? ns.length - 2 : ns.length - 1;
    }
  }
  const vt = vocalTonica(f, ns[tonica]);
  const consonante = quitarTildes(f.slice(vt));
  const desde = ns.slice(tonica);
  let vocales = desde.map((n) => quitarTildes(f[vocalTonica(f, n)]));
  if (vocales.length > 2) vocales = [vocales[0], vocales[vocales.length - 1]]; // esdrújulas: tónica y última
  if (vocales.length === 2) vocales[1] = { i: 'e', u: 'o' }[vocales[1]] || vocales[1];
  return {
    w: p,
    sil: ns.length,
    tonica: ns.length - tonica,       // 1 = aguda, 2 = llana, 3 = esdrújula
    cons: consonante,
    ason: vocales.join(''),
  };
}

const mostrar = (clave) => clave.replace(/C/g, 'ch').replace(/R/g, 'rr');

// La línea que sale debajo del buscador.
export function describir(e) {
  const tipo = e.tonica ? ', ' + (['aguda', 'llana', 'esdrújula'][e.tonica - 1] || 'sobresdrújula') : '';
  return `${e.sil} ${e.sil === 1 ? 'sílaba' : 'sílabas'}${tipo} · consonante <b>-${mostrar(e.cons)}</b> · asonante <b>${[...e.ason].join('-')}</b>`;
}
