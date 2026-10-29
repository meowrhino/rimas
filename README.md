# rimas

Buscador de rimas en castellano, sin servidor: todo pasa en el navegador.

- `js/rima.js`: de una palabra saca sílabas, tónica y las dos claves de rima (consonante y asonante).
- `js/palabras.js`: 100 000 palabras por orden de uso (OpenSubtitles, cruzado con un diccionario). Se regenera con `node build/palabras.mjs es_full.txt diccionario.txt`.
- `node build/test.mjs`: comprueba el algoritmo con palabras conocidas.

Para verla: cualquier servidor estático en la carpeta (o GitHub Pages), y `index.html`. La palabra va en la URL (`#cielo`).
