# rimas

Buscador de rimas en castellano, catalán, inglés, francés y japonés, sin servidor: todo pasa en el navegador.
En https://rimas.meowrhino.studio (Cloudflare Workers, `npx wrangler deploy`).

- `js/lang/<idioma>.js`: lo que sabe cada idioma. Castellano y catalán analizan cualquier palabra por reglas
  (sílabas, tónica, claves consonante y asonante). Inglés y francés solo buscan en su lista (la pronunciación
  viene de CMUdict y Lexique 383). Japonés acepta kanji (busca en la lista), kana o romaji, y rima por moras.
- `js/palabras/<idioma>.js`: la lista, por orden de uso (OpenSubtitles), limpiada con un diccionario de formas con tildes (FreeLing para es y ca). Se regenera con `node build/<idioma>.mjs …`
  (cada script dice qué ficheros de origen necesita; no van en el repo).
- `node build/test-<idioma>.mjs`: palabras conocidas que tienen que salir bien. Añade casos antes de tocar reglas.

Para verla en local: cualquier servidor estático en la carpeta. La búsqueda va en la URL (`#ca:cançó`).
