// Escribe js/palabras/<idioma>.js: una palabra por línea, por orden de uso,
// con sus campos separados por tabulador: palabra, lectura (solo ja), consonante, asonante, sílabas, tónica (1 aguda, 2 llana, 3 esdrújula; solo es y ca).
import { writeFileSync } from 'node:fs';

export function escribir(idioma, entradas) {
  const lineas = entradas.map((e) => [e.w, e.r || '', e.cons, e.ason, e.sil, e.tonica || ''].join('\t'));
  writeFileSync(new URL(`../js/palabras/${idioma}.js`, import.meta.url), `window.PALABRAS=${JSON.stringify(lineas.join('\n'))};\n`);
  console.log(`${idioma}: ${entradas.length} palabras`);
}
