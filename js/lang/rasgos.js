// Parecido entre sonidos por rasgos fonéticos (modo, punto, sonoridad) y parecido entre dos palabras
// comparadas desde el final. Cada idioma trae su tabla; aquí la de castellano y catalán.
// Kawahara (2007) midió lo mismo en el rap japonés: riman más los pares de consonantes que comparten rasgos.

// Fabrica una función sim(a, b) → 0-3: 3 el mismo sonido; consonantes, rasgos que comparten;
// vocales, 1 si son vecinas; vocal con consonante, 0.
export function simRasgos(tabla, vocales, vecinas) {
  return (a, b) => {
    if (a === b) return 3;
    const va = vocales.includes(a), vb = vocales.includes(b);
    if (va && vb) return vecinas.includes(a + ' ' + b) || vecinas.includes(b + ' ' + a) ? 1 : 0;
    if (va || vb || !tabla[a] || !tabla[b]) return 0;
    const rb = tabla[b].split(' ');
    return tabla[a].split(' ').filter((r) => rb.includes(r)).length;
  };
}

// Castellano y catalán (alfabeto de es.js y ca.js: C = ch/tx, R = rr, L = ll, Z = j catalana, S = x, J = tj, @ = neutra)
export const simEs = simRasgos({
  p: 'ocl bil sor', b: 'ocl bil son', t: 'ocl den sor', d: 'ocl den son', k: 'ocl vel sor', g: 'ocl vel son',
  f: 'fri lab sor', z: 'fri den sor', s: 'fri alv sor', j: 'fri vel sor', S: 'fri pal sor', Z: 'fri pal son',
  C: 'afr pal sor', J: 'afr pal son', m: 'nas bil son', n: 'nas alv son', ñ: 'nas pal son',
  l: 'liq alv son', L: 'liq pal son', y: 'liq pal son', r: 'liq alv son', R: 'liq alv son',
}, ['a', 'e', 'i', 'o', 'u', '@'], ['a e', 'e i', 'o u', 'a o', 'a @', 'e @']);

// Parecido de dos palabras (listas de sonidos, o cadenas de un sonido por letra) desde el final; cada paso atrás pesa ×0,75.
export function parecido(a, b, sim = simEs) {
  a = Array.from(a); b = Array.from(b);
  let s = 0, peso = 1;
  for (let i = 1; i <= Math.min(a.length, b.length); i++, peso *= 0.75) s += sim(a.at(-i), b.at(-i)) * peso;
  return s;
}
