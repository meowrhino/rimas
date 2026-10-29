// japonés: romaji → hiragana, hiragana → moras en romaji, y las claves de rima por moras.
// Sirve en el navegador y en node (build/ja.mjs, build/test-ja.mjs).
export const nombre = '日本語';
// Rima por moras, como en el rap: lo que cuenta es la vocal de cada mora (母音韻); las consonantes parecidas ayudan (Kawahara 2007).
export const etiquetas = { homofonas: '同音 · homófonas', ricas: '3モーラ以上 · tres moras o más', consonantes: '2モーラ · dos moras', asonantes: '母音韻 · vocales', imperfectas: '' };
export const imperfectas = false;
export const umbrales = { rica: 3 };                      // tres moras iguales o más (la clave son dos)
export const sonidos = (e) => (e.r ? moras(e.r) : null);
// Parecido entre dos moras: iguales 3; misma vocal 2 (+0,5 si la consonante es de la misma familia); misma consonante 1.
const FAMILIA = { k: 1, g: 1, s: 2, z: 2, sh: 2, j: 2, t: 3, d: 3, ch: 3, ts: 3, n: 4, m: 4, h: 5, b: 5, p: 5, f: 5, r: 6, y: 7, w: 7, '': 7 };
export function sim(a, b) {
  if (a === b) return 3;
  const [ca, va] = [a.replace(/[aiueo]$/, ''), a.match(/[aiueo]$/)?.[0]];
  const [cb, vb] = [b.replace(/[aiueo]$/, ''), b.match(/[aiueo]$/)?.[0]];
  if (!va || !vb) return 0;                                  // ん y っ solo se parecen a sí mismos
  if (va === vb) return 2 + (ca === cb || FAMILIA[ca] === FAMILIA[cb] ? 0.5 : 0);
  return ca === cb ? 1 : 0;
}

// Hepburn → hiragana; con las variantes de teclado (si, ti, tu, hu, zi, sya, jya…) a la misma kana.
const TABLA = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ', sa: 'さ', shi: 'し', si: 'し', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', chi: 'ち', ti: 'ち', tsu: 'つ', tu: 'つ', te: 'て', to: 'と', na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', hu: 'ふ', he: 'へ', ho: 'ほ', ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ', ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ', wa: 'わ', wo: 'を',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご', za: 'ざ', ji: 'じ', zi: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', de: 'で', do: 'ど', ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ', pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ', sha: 'しゃ', shu: 'しゅ', sho: 'しょ', sya: 'しゃ', syu: 'しゅ', syo: 'しょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ', nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ', mya: 'みゃ', myu: 'みゅ', myo: 'みょ', rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ', ja: 'じゃ', ju: 'じゅ', jo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ', zya: 'じゃ', zyu: 'じゅ', zyo: 'じょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ', pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  // préstamos
  fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ', di: 'でぃ', du: 'どぅ', she: 'しぇ', che: 'ちぇ', je: 'じぇ',
  wi: 'うぃ', we: 'うぇ', va: 'ゔぁ', vi: 'ゔぃ', vu: 'ゔ', ve: 'ゔぇ', vo: 'ゔぉ', tsa: 'つぁ', tse: 'つぇ', tso: 'つぉ',
};
// hiragana → romaji (Hepburn): la primera forma de cada kana en TABLA
const ROMAJI = {};
for (const [r, k] of Object.entries(TABLA)) ROMAJI[k] ??= r;
Object.assign(ROMAJI, { ぢ: 'ji', づ: 'zu', てぃ: 'ti' });
const MACRON = { ā: 'aa', ī: 'ii', ū: 'uu', ē: 'ei', ō: 'ou', â: 'aa', î: 'ii', û: 'uu', ê: 'ei', ô: 'ou' };

export function kana(texto) {
  let t = texto.trim().toLowerCase()
    .replace(/[āīūēōâîûêô]/g, (c) => MACRON[c])
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60)); // katakana → hiragana
  let out = '';
  while (t) {
    if (/^(nn|n')/.test(t)) { out += 'ん'; t = t.slice(2); continue; }
    if (/^n(?![aiueoy])/.test(t)) { out += 'ん'; t = t.slice(1); continue; }
    if (/^([bcdfghjkmprstvwz])\1/.test(t) || /^tch/.test(t)) { out += 'っ'; t = t.slice(1); continue; }
    const m = [3, 2, 1].map((n) => t.slice(0, n)).find((s) => TABLA[s]);
    if (m) { out += TABLA[m]; t = t.slice(m.length); } else { out += t[0]; t = t.slice(1); }
  }
  return out;
}

const esKana = (h) => /^[ぁ-ゖー]+$/.test(h);

// Lista de moras en romaji: きゃ = "kya", ん = "N", っ = "Q", ー = la vocal anterior repetida.
export function moras(h) {
  const ms = [];
  for (let i = 0; i < h.length; i++) {
    const c = h[i];
    if (c === 'ん') { ms.push('N'); continue; }
    if (c === 'っ') { ms.push('Q'); continue; }
    if (c === 'ー') { ms.push(vocal(ms[ms.length - 1] || 'a')); continue; }
    const dos = h[i + 1] && 'ゃゅょぁぃぅぇぉ'.includes(h[i + 1]) ? c + h[i + 1] : '';
    if (dos && ROMAJI[dos]) { ms.push(ROMAJI[dos]); i++; continue; }
    if (dos) { ms.push(ROMAJI[c].slice(0, -1) + vocal(ROMAJI[dos[1]])); i++; continue; }
    ms.push(ROMAJI[c] || c);
  }
  return ms;
}
export const vocal = (m) => (/[aiueo]$/.test(m) ? m.slice(-1) : m); // N y Q no tienen vocal: valen como tales

export function analizar(texto) {
  const h = kana(texto);
  if (!esKana(h)) return null;
  const ms = moras(h);
  const ultimas = ms.slice(-2);
  return { w: texto.trim(), r: h, cons: ultimas.join(''), ason: ultimas.map(vocal).join(''), sil: ms.length };
}

// Romaji legible de una lectura: ん = n, っ dobla la consonante que sigue.
export function romaji(h) {
  const ms = moras(h);
  return ms.map((m, i) => (m === 'N' ? 'n' : m === 'Q' ? (ms[i + 1] || '')[0] || '' : m)).join('');
}

// Cómo sale cada palabra en la lista: kanji, kana y romaji, para buscar con cualquiera.
export function etiqueta(e) {
  return `${e.w}<small>${e.r !== e.w ? e.r + ' ' : ''}${romaji(e.r)}</small>`;
}

export function describir(e) {
  return `${e.sil} モーラ · 脚韻 <b>-${e.cons}</b> · 母音 <b>${[...e.ason].join('-')}</b>`;
}
