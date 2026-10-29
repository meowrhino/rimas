// Parecido entre sonidos, por rasgos fonéticos: modo, punto de articulación y sonoridad.
// Sirve para ordenar las rimas: d se parece a t (dental, oclusiva), no a l. Alfabeto fonético de es.js y ca.js.
const RASGOS = {
  p: 'ocl bil sor', b: 'ocl bil son', t: 'ocl den sor', d: 'ocl den son', k: 'ocl vel sor', g: 'ocl vel son',
  f: 'fri lab sor', z: 'fri den sor', s: 'fri alv sor', j: 'fri vel sor', S: 'fri pal sor', Z: 'fri pal son',
  C: 'afr pal sor', J: 'afr pal son', m: 'nas bil son', n: 'nas alv son', ñ: 'nas pal son',
  l: 'liq alv son', L: 'liq pal son', y: 'liq pal son', r: 'liq alv son', R: 'liq alv son',
};
const VOCALES = 'aeiouEO@';
const VECINAS = ['ae', 'ei', 'ou', 'ao', 'a@', 'e@', 'eE', 'oO', 'iE', 'uO'];

// 3 = el mismo sonido; consonantes: rasgos que comparten (0-3); vocales: vecinas 1, lejanas 0; vocal con consonante 0.
export function parecidoSonido(a, b) {
  if (a === b) return 3;
  const va = VOCALES.includes(a), vb = VOCALES.includes(b);
  if (va && vb) return VECINAS.includes(a + b) || VECINAS.includes(b + a) ? 1 : 0;
  if (va || vb || !RASGOS[a] || !RASGOS[b]) return 0;
  const rb = RASGOS[b].split(' ');
  return RASGOS[a].split(' ').filter((r) => rb.includes(r)).length;
}

// Parecido de dos formas fonéticas (sin tildes) comparadas desde el final; cada paso atrás pesa ×0,75.
export function parecido(a, b) {
  let s = 0, peso = 1;
  for (let i = 1; i <= Math.min(a.length, b.length); i++, peso *= 0.75) s += parecidoSonido(a.at(-i), b.at(-i)) * peso;
  return s;
}
