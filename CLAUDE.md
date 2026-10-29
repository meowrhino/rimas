# rimas

Buscador de rimas de manu, todo en el navegador. Un módulo por idioma en `js/lang/<idioma>.js`
(`nombre`, `describir(entrada)`, y `analizar(palabra)` si el idioma se puede analizar por reglas)
y su lista en `js/palabras/<idioma>.js`, que escribe `build/<idioma>.mjs` con `build/escribir.mjs`:
una línea por palabra, por orden de uso, campos `palabra\tlectura\tconsonante\tasonante\tsílabas\ttónica\tpronunciación`
(lectura solo ja; tónica 1 aguda, 2 llana, 3 esdrújula; pronunciación entera solo en y fr).
Las claves son cadenas internas (en castellano, `C` = ch, `R` = rr; en inglés fonemas ARPAbet separados por espacio,
`sep`); `describir` las enseña bonitas. La API común de cada módulo, que `js/app.js` usa sin saber el idioma:
`sonidos(entrada)` (la pronunciación entera como lista), `vocal(sonido)`, `sim(a, b)` (parecido 0-3 por rasgos,
`js/lang/rasgos.js`), `etiquetas` (títulos de las cinco secciones), `tonicas` (nombres de los acentos, opcional),
`umbrales` (sonidos comunes para rica/suficiente, opcional; francés 3/2, japonés 3), `imperfectas: false` para no
buscarlas (japonés), `sep` si la clave lleva separador.
Cada idioma tiene su `build/test-<idioma>.mjs` con palabras conocidas: añade casos antes de tocar reglas.
Los datos de origen (listas de frecuencia, diccionarios) no van en el repo.
