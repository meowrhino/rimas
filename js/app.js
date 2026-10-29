// app.js — carga el idioma, indexa su lista y pinta las rimas. Lo que sabe de cada idioma está en js/lang/<idioma>.js.
const IDIOMAS = { es: 'castellano', ca: 'català', en: 'english', fr: 'français', ja: '日本語' };
const TOPE = 400;   // palabras que se pintan de golpe; el resto, con «más»
const RARO = 0.4;   // a partir de esta fracción de la lista (por uso), la palabra sale en gris

const $ = (s) => document.querySelector(s);
const input = $('#palabra');
let idioma = '';
let mod;            // el módulo del idioma: analizar (opcional) y describir
let entradas = [];  // [{ w, r, cons, ason, sil }] por orden de uso
let porPalabra, porLlano, porCons, porAson;
const llano = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').replace(/œ/g, 'oe').replace(/æ/g, 'ae'); // sin acentos, para buscar «cancion» o «ete»
let filtro = 0;     // sílabas; 0 = todas

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
  entradas = window.PALABRAS.split('\n').map((linea, pos) => {
    const [w, r, cons, ason, sil] = linea.split('\t');
    return { w, r, cons, ason, sil: +sil, pos };
  });
  porPalabra = new Map(); porLlano = new Map(); porCons = new Map(); porAson = new Map();
  for (const e of entradas) {
    porPalabra.has(e.w) || porPalabra.set(e.w, e);
    if (e.r) porPalabra.has(e.r) || porPalabra.set(e.r, e);
    porLlano.has(llano(e.w)) || porLlano.set(llano(e.w), e);
    (porCons.get(e.cons) || porCons.set(e.cons, []).get(e.cons)).push(e);
    (porAson.get(e.ason) || porAson.set(e.ason, []).get(e.ason)).push(e);
  }
}

function pintar(ul, lista, desde = 0) {
  ul.insertAdjacentHTML('beforeend', lista.slice(desde, desde + TOPE).map((e) =>
    `<li${e.pos > entradas.length * RARO ? ' class="raro"' : ''} data-w="${e.w}" data-s="${e.sil}" style="--u:${(Math.log10(e.pos + 1) / Math.log10(entradas.length)).toFixed(2)}">${mod.etiqueta ? mod.etiqueta(e) : e.w}</li>`).join(' '));
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
  $('#consonantes ul').innerHTML = $('#asonantes ul').innerHTML = '';
  document.querySelectorAll('.mas').forEach((b) => b.remove());
  $('#silabas').innerHTML = '';
  if (!q) { $('#analisis').textContent = ''; return; }
  history.replaceState(null, '', `#${idioma}:${q}`);
  const u = q.split(/\s+/).pop(); // «quieres ir» rima por su última palabra
  const e = porPalabra.get(u) || porLlano.get(llano(u)) || mod.analizar?.(u);
  if (!e) { $('#analisis').textContent = { es: 'no conozco esa palabra', ca: 'no conec aquesta paraula', en: 'unknown word', fr: 'mot inconnu', ja: 'その言葉は知りません' }[idioma]; return; }
  $('#analisis').innerHTML = mod.describir(e);
  const mismas = (x) => x.w === u || x.w === e.w || x.r === u;
  const cons = (porCons.get(e.cons) || []).filter((x) => !mismas(x));
  const ason = (porAson.get(e.ason) || []).filter((x) => !mismas(x) && x.cons !== e.cons);
  // rima rica: primero las que coinciden en más sonidos hacia atrás con toda la frase («quieres ir» → …eres ir);
  // entre iguales, por uso. Solo donde hay fonética por reglas (es, ca).
  if (mod.fonetica) {
    const fq = llano(mod.fonetica(q.replace(/\s+/g, '')));
    const vq = fq.replace(/[^aeiouEO@]/g, '');
    const comun = (a, b) => { let n = 0; while (n < a.length && n < b.length && a.at(-1 - n) === b.at(-1 - n)) n++; return n; };
    const rica = new Map(cons.map((x) => [x, comun(fq, llano(mod.fonetica(x.w)))]));
    cons.sort((x, y) => rica.get(y) - rica.get(x));
    const vocal = new Map(ason.map((x) => [x, comun(vq, llano(mod.fonetica(x.w)).replace(/[^aeiouEO@]/g, ''))]));
    ason.sort((x, y) => vocal.get(y) - vocal.get(x));
  }
  const conFiltro = (lista) => (filtro ? lista.filter((x) => (filtro === 5 ? x.sil >= 5 : x.sil === filtro)) : lista);
  $('#silabas').innerHTML = [0, 1, 2, 3, 4, 5].map((n) =>
    `<button data-n="${n}" aria-pressed="${n === filtro}">${n === 0 ? '∗' : n === 5 ? '5+' : n}</button>`).join('');
  pintar($('#consonantes ul'), conFiltro(cons));
  pintar($('#asonantes ul'), conFiltro(ason));
}

async function desdeHash() {
  const [, l, q = ''] = location.hash.match(/^#(es|ca|en|fr|ja):?(.*)$/) || [, 'es', location.hash.slice(1)];
  await cargar(l);
  input.value = decodeURIComponent(q);
  buscar();
}

$('#buscar').onsubmit = (e) => { e.preventDefault(); buscar(); };
input.oninput = buscar;
$('#silabas').onclick = (e) => { if (e.target.dataset.n) { filtro = +e.target.dataset.n; buscar(); } };
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
