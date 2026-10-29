import { analizar } from './rima.js';

const TOPE = 400; // asonantes que se pintan de golpe; el resto, con «más»
const RARO = 40000; // a partir de esta posición por uso, la palabra sale en gris

// índice: clave → lista de palabras por orden de uso
const porConsonante = new Map();
const porAsonante = new Map();
const silabasDe = new Map();
for (const w of window.PALABRAS.split('\n')) {
  const r = analizar(w);
  if (!r) continue;
  silabasDe.set(w, r.silabas);
  (porConsonante.get(r.consonante) || porConsonante.set(r.consonante, []).get(r.consonante)).push(w);
  (porAsonante.get(r.asonante) || porAsonante.set(r.asonante, []).get(r.asonante)).push(w);
}
const posicion = new Map([...silabasDe.keys()].map((w, i) => [w, i]));

const $ = (s) => document.querySelector(s);
const input = $('#palabra');
let filtro = 0; // 0 = todas las sílabas

function pintar(ul, palabras, desde = 0) {
  const trozo = palabras.slice(desde, desde + TOPE);
  ul.insertAdjacentHTML('beforeend', trozo.map((w) => `<li${posicion.get(w) > RARO ? ' class="raro"' : ''}>${w}</li>`).join(''));
  ul.parentElement.querySelector('.mas')?.remove();
  if (palabras.length > desde + TOPE) {
    const b = document.createElement('button');
    b.className = 'mas';
    b.textContent = `más (${palabras.length - desde - TOPE})`;
    b.onclick = () => pintar(ul, palabras, desde + TOPE);
    ul.parentElement.append(b);
  }
}

function buscar() {
  const q = input.value.trim().toLowerCase();
  const r = q && analizar(q);
  $('#consonantes ul').innerHTML = $('#asonantes ul').innerHTML = '';
  document.querySelectorAll('.mas').forEach((b) => b.remove());
  if (!r) { $('#analisis').textContent = ''; $('#silabas').innerHTML = ''; return; }
  location.hash === `#${q}` || history.replaceState(null, '', `#${q}`);
  const tipo = ['aguda', 'llana', 'esdrújula'][r.tonica - 1] || 'sobresdrújula';
  const sil = r.silabas === 1 ? '1 sílaba' : `${r.silabas} sílabas`;
  $('#analisis').innerHTML = `${sil}, ${tipo} · consonante <b>-${r.consonante.replace(/C/g, 'ch').replace(/R/g, 'rr')}</b> · asonante <b>${[...r.asonante].join('-')}</b>`;
  const cons = (porConsonante.get(r.consonante) || []).filter((w) => w !== q);
  const ason = (porAsonante.get(r.asonante) || []).filter((w) => w !== q && !porConsonante.get(r.consonante)?.includes(w));
  const conFiltro = (lista) => (filtro ? lista.filter((w) => (filtro === 5 ? silabasDe.get(w) >= 5 : silabasDe.get(w) === filtro)) : lista);
  $('#silabas').innerHTML = [0, 1, 2, 3, 4, 5].map((n) =>
    `<button data-n="${n}" aria-pressed="${n === filtro}">${n === 0 ? 'todas' : n === 5 ? '5+' : n}</button>`).join('');
  pintar($('#consonantes ul'), conFiltro(cons));
  pintar($('#asonantes ul'), conFiltro(ason));
}

$('#buscar').onsubmit = (e) => { e.preventDefault(); buscar(); };
input.oninput = buscar;
$('#silabas').onclick = (e) => { if (e.target.dataset.n) { filtro = +e.target.dataset.n; buscar(); } };
document.querySelector('main').onclick = (e) => { if (e.target.tagName === 'LI') { input.value = e.target.textContent; buscar(); scrollTo(0, 0); } };
window.onhashchange = () => { input.value = decodeURIComponent(location.hash.slice(1)); buscar(); };
if (location.hash) window.onhashchange();
