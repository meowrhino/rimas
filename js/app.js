// app.js — carga el idioma, indexa su lista y pinta las rimas. Lo que sabe de cada idioma está en js/lang/<idioma>.js.
import { parecido } from './lang/rasgos.js';
const IDIOMAS = { es: 'castellano', ca: 'català', en: 'english', fr: 'français', ja: '日本語' };
const TOPE = 400;   // palabras que se pintan de golpe; el resto, con «más»
const RARO = 0.4;   // a partir de esta fracción de la lista (por uso), la palabra sale en gris

const $ = (s) => document.querySelector(s);
const input = $('#palabra');
let idioma = '';
let mod;            // el módulo del idioma: analizar (opcional) y describir
let entradas = [];  // [{ w, r, cons, ason, sil }] por orden de uso
let porPalabra, porLlano, porCons, porAson, porEsqueleto; // esqueleto: la clave consonante sin su vocal tónica (pelo/palo)
const llano = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').replace(/œ/g, 'oe').replace(/æ/g, 'ae'); // sin acentos, para buscar «cancion» o «ete»
let filtro = 0;     // sílabas; 0 = todas
let filtroT = 0;    // tónica: 1 aguda, 2 llana, 3 esdrújula; 0 = todas
// la clave consonante en sonidos (en los separa con espacio) y su esqueleto: sin la vocal tónica (pelo → ·lo)
const tokens = (clave) => (mod.sep ? clave.split(mod.sep) : [...clave]);
const esqueleto = (clave) => tokens(clave).slice(1).join(mod.sep || '');
const entrada = (w) => porPalabra.get(w) || porLlano.get(llano(w)) || mod.analizar?.(w);
// los sonidos de una frase: sus palabras desde el final, hasta la primera que no se conozca
function sonidosFrase(q) {
  const palabras = q.split(/\s+/);
  let out = [];
  for (let i = palabras.length - 1; i >= 0; i--) {
    const s = mod.sonidos(entrada(palabras[i]) || {});
    if (!s) break;
    out = [...s, ...out];
  }
  return out;
}

async function cargar(l) {
  if (l === idioma) return;
  idioma = l;
  document.documentElement.lang = l;
  $('#idiomas').innerHTML = Object.entries(IDIOMAS).map(([k, v]) => `<button data-l="${k}" aria-pressed="${k === l}">${v}</button>`).join('');
  input.placeholder = { es: 'una palabra', ca: 'una paraula', en: 'a word', fr: 'un mot', ja: 'ことば・kotoba・言葉' }[l];
  [mod] = await Promise.all([import(`./lang/${l}.js`), new Promise((ok, mal) => {
    const s = Object.assign(document.createElement('script'), { src: `js/palabras/${l}.js`, onload: ok, onerror: mal });
    document.head.append(s);
  })]);
  for (const [k, v] of Object.entries(mod.etiquetas || {})) { const h = $(`#${k} h2`); if (h) h.textContent = v; }
  entradas = window.PALABRAS.split('\n').map((linea, pos) => {
    const [w, r, cons, ason, sil, tonica, f] = linea.split('\t');
    return { w, r, cons, ason, sil: +sil, tonica: +tonica, f, pos };
  });
  porPalabra = new Map(); porLlano = new Map(); porCons = new Map(); porAson = new Map(); porEsqueleto = new Map();
  for (const e of entradas) {
    porPalabra.has(e.w) || porPalabra.set(e.w, e);
    if (e.r) porPalabra.has(e.r) || porPalabra.set(e.r, e);
    porLlano.has(llano(e.w)) || porLlano.set(llano(e.w), e);
    (porCons.get(e.cons) || porCons.set(e.cons, []).get(e.cons)).push(e);
    (porAson.get(e.ason) || porAson.set(e.ason, []).get(e.ason)).push(e);
    if (mod.sonidos && mod.imperfectas !== false) { const k = esqueleto(e.cons); (porEsqueleto.get(k) || porEsqueleto.set(k, []).get(k)).push(e); }
  }
}

function pintar(ul, lista, desde = 0) {
  ul.insertAdjacentHTML('beforeend', lista.slice(desde, desde + TOPE).map((e) =>
    `<li class="${e.pos > entradas.length * RARO ? 'raro' : ''} ${e.tonica ? 't' + e.tonica : ''}" data-w="${e.w}" data-s="${e.sil}" style="--u:${(Math.log10(e.pos + 1) / Math.log10(entradas.length)).toFixed(2)}">${mod.etiqueta ? mod.etiqueta(e) : e.w}</li>`).join(' '));
  ul.parentElement.querySelector('.mas')?.remove();
  if (lista.length > desde + TOPE) {
    const b = document.createElement('button');
    b.className = 'mas';
    b.textContent = `+${lista.length - desde - TOPE}`;
    b.onclick = () => pintar(ul, lista, desde + TOPE);
    ul.parentElement.append(b);
  }
}

function buscar() {
  const q = input.value.trim().toLowerCase().normalize('NFC');
  for (const ul of document.querySelectorAll('main ul')) ul.innerHTML = '';
  document.querySelectorAll('.mas').forEach((b) => b.remove());
  $('#silabas').innerHTML = '';
  if (!q) { $('#analisis').textContent = ''; return; }
  history.replaceState(null, '', `#${idioma}:${q}`);
  const u = q.split(/\s+/).pop(); // «quieres ir» rima por su última palabra
  const e = entrada(u);
  if (!e) { $('#analisis').textContent = { es: 'no conozco esa palabra', ca: 'no conec aquesta paraula', en: 'unknown word', fr: 'mot inconnu', ja: 'その言葉は知りません' }[idioma]; return; }
  $('#analisis').innerHTML = mod.describir(e);
  // el aviso de rima fácil se añade más abajo, cuando se sabe cuántas consonantes hay
  const mismas = (x) => x.w === u || x.w === e.w || x.r === u;
  let cons = (porCons.get(e.cons) || []).filter((x) => !mismas(x));
  let ason = (porAson.get(e.ason) || []).filter((x) => !mismas(x) && x.cons !== e.cons);
  let ricas = [], homofonas = [], imperfectas = [], multi = [];
  const facil = cons.length > 300 ? ` · <span class="aviso">${mod.etiquetas?.facil || 'rima fácil'}: ${cons.length}</span>` : '';
  // Donde el idioma da la pronunciación entera (todos menos los desconocidos): orden por parecido de sonidos hacia
  // atrás con toda la frase («quieres ir» suena más a «decir» que a «salir»); las homófonas suenan igual; las ricas
  // coinciden en más sonidos de los que pide la rima (la consonante de apoyo; en francés, 3 sonidos); las que no
  // llegan al mínimo (francés: rima pobre, solo la vocal) bajan con las asonantes. Entre iguales, por uso.
  if (mod.sonidos) {
    const fq = sonidosFrase(q);
    const fe = mod.sonidos(e) || [];
    const vq = fq.map(mod.vocal).filter(Boolean);
    const comun = (a, b) => { let n = 0; while (n < a.length && n < b.length && a.at(-1 - n) === b.at(-1 - n)) n++; return n; };
    const fon = new Map([...cons, ...ason].map((x) => [x, mod.sonidos(x) || []]));
    const nota = new Map(cons.map((x) => [x, Math.round(parecido(fq, fon.get(x), mod.sim))]));
    cons.sort((x, y) => nota.get(y) - nota.get(x));
    const minRica = mod.umbrales?.rica ?? tokens(e.cons).length + 1;
    const minSuficiente = mod.umbrales?.suficiente ?? 0;
    homofonas = cons.filter((x) => fon.get(x).join(' ') === fe.join(' '));
    ricas = cons.filter((x) => !homofonas.includes(x) && comun(fq, fon.get(x)) >= minRica);
    const pobres = cons.filter((x) => !homofonas.includes(x) && !ricas.includes(x) && comun(fq, fon.get(x)) < minSuficiente);
    cons = cons.filter((x) => !homofonas.includes(x) && !ricas.includes(x) && !pobres.includes(x));
    ason = [...pobres, ...ason];
    const vocales = (x) => fon.get(x).map(mod.vocal).filter(Boolean);
    const notaV = new Map(ason.map((x) => [x, Math.round(parecido(vq, vocales(x), mod.sim))]));
    ason.sort((x, y) => notaV.get(y) - notaV.get(x));
    // multisilábicas: calcan las vocales de más sílabas de las que pide la asonancia («quieres ir» → «interferí», i-e-e-i)
    const minMulti = tokens(e.ason).length + 1;
    multi = ason.filter((x) => comun(vq, vocales(x)) >= minMulti);
    ason = ason.filter((x) => !multi.includes(x));
    if (mod.imperfectas !== false) {
      imperfectas = (porEsqueleto.get(esqueleto(e.cons)) || []).filter((x) => x.cons !== e.cons && !mismas(x));
      const notaI = new Map(imperfectas.map((x) => [x, Math.round(parecido(fq, mod.sonidos(x) || [], mod.sim))]));
      imperfectas.sort((x, y) => notaI.get(y) - notaI.get(x));
    }
  }
  // Los botones solo ofrecen lo que hay: la rima fija la tónica (todo lo que rima con «hola» es llano), así que un
  // filtro sin resultados posibles no sale; y si un filtro guardado ya no tiene sentido, se quita.
  const todas = [...homofonas, ...ricas, ...cons, ...multi, ...ason, ...imperfectas];
  const silabasHay = new Set(todas.map((x) => Math.min(x.sil, 5)));
  const tonicasHay = new Set(todas.map((x) => x.tonica).filter(Boolean));
  if (filtro && !silabasHay.has(filtro)) filtro = 0;
  if (filtroT && !tonicasHay.has(filtroT)) filtroT = 0;
  const conFiltro = (lista) => lista.filter((x) => (!filtro || (filtro === 5 ? x.sil >= 5 : x.sil === filtro)) && (!filtroT || x.tonica === filtroT));
  $('#silabas').innerHTML = (silabasHay.size > 1 ? [0, ...[1, 2, 3, 4, 5].filter((n) => silabasHay.has(n))].map((n) =>
    `<button data-n="${n}" aria-pressed="${n === filtro}">${n === 0 ? '∗' : n === 5 ? '5+' : n}</button>`).join('') : '')
    + (mod.tonicas && tonicasHay.size > 1 ? '<span class="sep"></span>' + mod.tonicas.map((t, i) => (tonicasHay.has(i + 1)
      ? `<button data-t="${i + 1}" class="t${i + 1}" aria-pressed="${i + 1 === filtroT}">${t}</button>` : '')).join('') : '');
  pintar($('#homofonas ul'), conFiltro(homofonas));
  pintar($('#ricas ul'), conFiltro(ricas));
  pintar($('#consonantes ul'), conFiltro(cons));
  $('#analisis').insertAdjacentHTML('beforeend', facil);
  pintar($('#multisilabicas ul'), conFiltro(multi));
  pintar($('#asonantes ul'), conFiltro(ason));
  pintar($('#imperfectas ul'), conFiltro(imperfectas));
}

async function desdeHash() {
  const [, l, q = ''] = location.hash.match(/^#(es|ca|en|fr|ja):?(.*)$/) || [, 'es', location.hash.slice(1)];
  await cargar(l);
  input.value = decodeURIComponent(q);
  buscar();
}

$('#buscar').onsubmit = (e) => { e.preventDefault(); buscar(); };
input.oninput = buscar;
$('#silabas').onclick = (e) => {
  if (e.target.dataset.n) { filtro = +e.target.dataset.n; buscar(); }
  if (e.target.dataset.t) { filtroT = filtroT === +e.target.dataset.t ? 0 : +e.target.dataset.t; buscar(); }
};
$('#idiomas').onclick = async (e) => { if (e.target.dataset.l) { await cargar(e.target.dataset.l); buscar(); input.focus(); } };
document.querySelector('main').onclick = (e) => { const li = e.target.closest('li'); if (li) { input.value = li.dataset.w; buscar(); scrollTo(0, 0); } };
// claro/oscuro: el del sistema, salvo que se toque el interruptor (se guarda)
$('#tema').onclick = () => {
  const oscuro = matchMedia('(prefers-color-scheme: dark)').matches;
  const actual = document.documentElement.dataset.theme || (oscuro ? 'dark' : 'light');
  const nuevo = actual === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nuevo;
  try { localStorage.setItem('tema', nuevo); } catch {}
};
window.onhashchange = desdeHash;
desdeHash();
