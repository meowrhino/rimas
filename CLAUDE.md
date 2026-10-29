# rimas

Buscador de rimas de manu, todo en el navegador. Un módulo por idioma en `js/lang/<idioma>.js`
(`nombre`, `describir(entrada)`, y `analizar(palabra)` si el idioma se puede analizar por reglas)
y su lista en `js/palabras/<idioma>.js`, que escribe `build/<idioma>.mjs` con `build/escribir.mjs`:
una línea por palabra, por orden de uso, campos `palabra\tlectura\tconsonante\tasonante\tsílabas`.
Las claves son cadenas internas (en castellano, `C` = ch, `R` = rr); `describir` las enseña bonitas.
Cada idioma tiene su `build/test-<idioma>.mjs` con palabras conocidas: añade casos antes de tocar reglas.
Los datos de origen (listas de frecuencia, diccionarios) no van en el repo.
