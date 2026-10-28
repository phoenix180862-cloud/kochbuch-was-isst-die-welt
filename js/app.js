/* „Was isst die Welt?“ – App */
(function () {
  'use strict';
  const KB = window.KB;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
  const speicher = {
    hol(k, std) { try { const v = localStorage.getItem('kb_' + k); return v == null ? std : JSON.parse(v); } catch (e) { return std; } },
    setz(k, v) { try { localStorage.setItem('kb_' + k, JSON.stringify(v)); } catch (e) {} }
  };
  const VERSION = window.KB_VERSION || '1';

  /* ---------- Symbole ---------- */
  const I = {
    suche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    uhr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    stufe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20v-4M10 20v-8M16 20V8M22 20V4"/></svg>',
    herz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z"/></svg>',
    herzVoll: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z"/></svg>',
    korb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h18l-2 11H5Z"/><path d="m8 9 4-6 4 6"/></svg>',
    koch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 14a4 4 0 1 1 1-7.9 4.5 4.5 0 0 1 8 0A4 4 0 1 1 17 14v6H7Z"/><path d="M7 17h10"/></svg>',
    start: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>',
    ki: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4Z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z"/></svg>',
    pfeilL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 5 8 12l7 7"/></svg>',
    pfeilR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m9 5 7 7-7 7"/></svg>',
    zu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8Z"/></svg>',
    lautsprecher: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9h4l5-4v14l-5-4H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
    liste: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    druck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><rect x="6" y="14" width="12" height="7"/></svg>',
    mikro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
    nochmal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.6"/><path d="M4 3v5.6h5.6"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
    wuerfel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/></svg>',
    haus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
    buch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 19V5M8 7h7"/></svg>'
  };

  /* ---------- Daten laden ---------- */
  KB.REZ = {};
  KB.KOECHE = KB.KOECHE || [];
  const geladen = {};
  function skript(src) {
    return new Promise((ok, fehler) => {
      const s = document.createElement('script');
      s.src = src + '?v=' + VERSION; s.onload = ok; s.onerror = () => fehler(new Error('Datei fehlt: ' + src));
      document.head.appendChild(s);
    });
  }
  KB.lade = function (kueche, liste) { liste.forEach(r => KB.REZ[r.id] = r); geladen[kueche] = true; };
  function ladeKueche(k) { return geladen[k] ? Promise.resolve() : skript('daten/k-' + k + '.js'); }
  const IDX = {};
  const kochNorm = s => norm(String(s || '').replace(/\(.*?\)/g, '')).replace(/\s+/g, ' ').trim();
  function vorbereiten() {
    KB.INDEX.forEach(r => { IDX[r.id] = r; r._s = norm([r.n, r.o, r.r, r.ku, (r.ko || []).join(' '), (r.zu || []).join(' '), (r.t || []).join(' '), KB.KUECHE[r.k] && KB.KUECHE[r.k].name].join(' ')); });
    KB.KOCH = {};
    KB.KOECHE.forEach(k => { KB.KOCH[k.id] = k; k._rez = KB.INDEX.filter(r => (r.ko || []).some(n => kochNorm(n) === kochNorm(k.name))); });
  }
  const kochIdVonName = name => { const k = KB.KOECHE.find(x => kochNorm(x.name) === kochNorm(name)); return k ? k.id : null; };

  /* ---------- Hilfsfunktionen ---------- */
  function zeitText(min) {
    if (!min) return '–';
    if (min < 60) return min + ' Min.';
    if (min < 60 * 24) { const h = Math.floor(min / 60), m = min % 60; return h + ' Std.' + (m ? ' ' + m + ' Min.' : ''); }
    const t = Math.round(min / 60 / 24 * 2) / 2; return (t + '').replace('.', ',') + (t === 1 ? ' Tag' : ' Tage');
  }
  const BRUCH = [[.125, '⅛'], [.25, '¼'], [.333, '⅓'], [.5, '½'], [.667, '⅔'], [.75, '¾']];
  function mengeText(m, einheit) {
    if (m == null || m === '') return '';
    if (['g', 'ml'].includes(einheit)) {
      if (m >= 1000 && einheit === 'g') return (Math.round(m / 100) / 10 + '').replace('.', ',') + ' kg';
      if (m >= 1000 && einheit === 'ml') return (Math.round(m / 100) / 10 + '').replace('.', ',') + ' l';
      return (m >= 50 ? Math.round(m / 5) * 5 : Math.round(m * 10) / 10).toString().replace('.', ',') + ' ' + einheit;
    }
    const ganz = Math.floor(m), rest = m - ganz;
    let txt = ganz ? String(ganz) : '';
    if (rest > .06) {
      const b = BRUCH.reduce((a, x) => Math.abs(x[0] - rest) < Math.abs(a[0] - rest) ? x : a);
      if (Math.abs(b[0] - rest) < .07) txt += (ganz ? ' ' : '') + b[1];
      else txt = (Math.round(m * 10) / 10 + '').replace('.', ',');
    }
    if (!txt) txt = '0';
    return txt + (einheit ? ' ' + einheit : '');
  }
  const gesamtZeit = r => (r.zeit.vorbereitung || 0) + (r.zeit.garen || 0) + (r.zeit.ruhen || 0);
  const kuecheVon = id => KB.KUECHE[id] || { name: id, kurz: id, muster: 'raute', f: ['#eee', '#333', '#c41e1e'] };
  const monogramm = name => esc(String(name).split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase());
  function meldung(text) {
    const m = document.createElement('div'); m.className = 'meldung'; m.setAttribute('role', 'status'); m.textContent = text;
    document.body.appendChild(m); setTimeout(() => m.remove(), 2600);
  }
  /* ---------- Favoriten & Einkauf ---------- */
  const fav = {
    liste() { return speicher.hol('favoriten', []); },
    hat(id) { return fav.liste().includes(id); },
    umschalten(id) { const l = fav.liste(); const i = l.indexOf(id); i >= 0 ? l.splice(i, 1) : l.unshift(id); speicher.setz('favoriten', l); kopfZahlen(); return i < 0; }
  };
  const einkauf = {
    alle() { return speicher.hol('einkauf', []); },
    setz(l) { speicher.setz('einkauf', l); kopfZahlen(); },
    hinzu(r, portionen) {
      const l = einkauf.alle().filter(e => e.id !== r.id);
      const f = portionen / r.portionen;
      const posten = [];
      r.zutaten.forEach(g => g.liste.forEach(z => posten.push({ t: [z.menge != null ? mengeText(z.menge * f, z.einheit) : '', z.name].filter(Boolean).join(' '), ok: false })));
      l.unshift({ id: r.id, n: r.name, p: portionen, posten });
      einkauf.setz(l);
    }
  };
  function kopfZahlen() {
    const f = fav.liste().length, e = einkauf.alle().reduce((s, x) => s + x.posten.filter(p => !p.ok).length, 0);
    const zf = $('#zahl-fav'), ze = $('#zahl-einkauf');
    [zf, $('#zahl-fav2')].forEach(z => { if (z) { z.textContent = f; z.hidden = !f; } });
    [ze, $('#zahl-einkauf2')].forEach(z => { if (z) { z.textContent = e; z.hidden = !e; } });
  }

  /* ---------- Titel-Schriftzug und Logo ---------- */
  /* Private Ansicht (Thomas' Geräte mit Gemini-Schlüssel): echte Köche als Karikaturen + KI-Menü.
     Öffentliche Ansicht (alle anderen): frei erfundene Koch-Figuren, kein KI-Menü. Umschalten: #/ansicht/oeffentlich bzw. #/ansicht/privat */
  /* Öffentliche Fassung (Geschenk auf der Firmen-Webseite): frei-config.js setzt window.TW_FREI = true → immer öffentliche Ansicht */
  const PRIVAT = (() => { try { return !window.TW_FREI && !!(localStorage.getItem('gemini_api_key') || '').trim() && localStorage.getItem('ansicht') !== 'oeffentlich'; } catch (e) { return false; } })();
  document.documentElement.classList.toggle('oeffentlich', !PRIVAT);
  /* Impressum und Datenschutz der Firmen-Webseite – Adressen hier eintragen, dann erscheinen die Links unten auf der Startseite */
  const RECHTLICHES = { impressum: 'https://www.thomas-willwacher.de/impressum.html', datenschutz: 'https://www.thomas-willwacher.de/datenschutz.html' };
  const TITEL_HTML = '<span class="q">„</span>Was i<span class="s2">s</span>st die Welt?<span class="q">“</span>';
  function logo(klein) {
    return `<div class="logo-container${klein ? ' logo-klein' : ''}" aria-label="Thomas Willwacher">
      <div class="logo-thomas-row"><span class="logo-thomas-text">Thomas</span></div>
      <div class="logo-word-row"><span class="logo-w">w</span><span class="logo-i-wrap"><span class="logo-i-char">ı</span><span class="logo-i-dot"></span></span><span class="logo-LL">LL</span><span class="logo-wacher">wacher</span></div></div>`;
  }

  /* ---------- Buchtitel mit echter Schrift vermessen: ganze Wörter, nur saubere Silbentrennung ---------- */
  const TRENN = { 'Großbritannien': ['Groß', 'britannien'], 'Deutschland': ['Deutsch', 'land'], 'Skandinavien': ['Skandi', 'navien'], 'Griechenland': ['Griechen', 'land'],
    'Frankreich': ['Frank', 'reich'], 'Österreich': ['Öster', 'reich'], 'Nordafrika': ['Nord', 'afrika'], 'Südamerika': ['Süd', 'amerika'], 'Frühstück': ['Früh', 'stück'],
    'Eintöpfe': ['Ein', 'töpfe'], 'Abendbrot': ['Abend', 'brot'], 'Thailand': ['Thai', 'land'], 'Portugal': ['Portu', 'gal'], 'Backbuch': ['Back', 'buch'], 'Brotzeit': ['Brot', 'zeit'],
    'Marokko': ['Ma', 'rokko'], 'Halbinsel': ['Halb', 'insel'], 'Arabische': ['Arabi', 'sche'], 'Zentralasien': ['Zentral', 'asien'], 'Philippinen': ['Philip', 'pinen'],
    'Tschechien': ['Tsche', 'chien'], 'Argentinien': ['Argen', 'tinien'], 'Äthiopien': ['Äthio', 'pien'], 'Ostafrika': ['Ost', 'afrika'], 'Westafrika': ['West', 'afrika'],
    'Südafrika': ['Süd', 'afrika'], 'Neuseeland': ['Neu', 'seeland'], 'Australien': ['Austra', 'lien'], 'Indonesien': ['Indo', 'nesien'], 'Festtagsküche': ['Festtags', 'küche'],
    'Brasilien': ['Brasi', 'lien'], 'Slowakei': ['Slowa', 'kei'], 'Malaysia': ['Malay', 'sia'], 'Kaukasus': ['Kau', 'kasus'], 'Südostasien': ['Südost', 'asien'] };
  const fitCache = {};
  let messCtx = null;
  function titelFit(titel, breite = 140, maxGr = 26, minGanz = 19, minGr = 15) {
    const key = titel + '|' + breite;
    if (fitCache[key]) return fitCache[key];
    messCtx = messCtx || document.createElement('canvas').getContext('2d');
    const W = (s, gr) => { messCtx.font = `600 ${gr}px Oswald, 'Arial Narrow', sans-serif`; const u = s.toUpperCase(); return messCtx.measureText(u).width + u.length * 0.4; };
    const tokens = titel.replace(/ & /g, ' & ').split(' ');
    const bau = (gr, trennen) => {
      const z = [];
      for (const tok of tokens) {
        const last = z.length ? z[z.length - 1] : null;
        if (last !== null && W(last + ' ' + tok, gr) <= breite) { z[z.length - 1] = last + ' ' + tok; continue; }
        if (W(tok, gr) <= breite) { z.push(tok); continue; }
        const tr = trennen && TRENN[tok];
        if (!tr || W(tr[0] + '-', gr) > breite || W(tr[1], gr) > breite) return null;
        z.push(tr[0] + '-'); z.push(tr[1]);
      }
      return z.length <= 3 ? z : null;
    };
    let res = null;
    for (let gr = maxGr; gr >= minGanz && !res; gr--) { const z = bau(gr, false); if (z) res = { gr, zeilen: z }; }
    for (let gr = maxGr; gr >= minGr && !res; gr--) { const z = bau(gr, true); if (z) res = { gr, zeilen: z }; }
    res = res || { gr: minGr, zeilen: [titel] };
    fitCache[key] = res;
    return res;
  }

  /* ---------- Bücher (Länderbücher und Sonderbände) ---------- */
  const buchVon = id => KB.KUECHE[id] || KB.SONDER_ID[id] || null;
  const buchLink = b => b.sonder ? '#/band/' + b.id : '#/buch/' + b.id;
  const rezepteIm = b => b.sonder ? KB.INDEX.filter(b.test) : KB.INDEX.filter(r => r.k === b.id);
  const gruppeVonKueche = k => (KB.KUECHE[k] || {}).gruppe;
  function buchBildRezept(b) {
    if (b.cb) return { id: 'cover-' + b.id, name: b.kurz, bild: b.cb.bild, farben: b.cb.farben };
    const top = KB.INDEX.find(r => r.k === b.id);
    return top ? { id: top.id, name: top.n, bild: top.bi, farben: top.fa } : { id: b.id, name: b.kurz, bild: 'teller' };
  }
  function buchHTML(b) {
    const fit = titelFit(b.kurz);
    const n = rezepteIm(b).length;
    return `<a class="buch" href="${buchLink(b)}" style="background:${b.bg}" aria-label="${esc(b.kurz)} – ${n} Rezepte">
      <span class="b-reihe" style="color:${b.ak}">„Was isst die Welt?“</span>
      <span class="b-titel" style="font-size:${fit.gr}px">${fit.zeilen.map(esc).join('\n')}</span>
      <span class="b-strich" style="background:${b.ak}"></span>
      <span class="b-bild">${KB.titelbild(buchBildRezept(b), b.bg)}</span>
      <span class="b-unter">${esc(b.unter)}</span>
      <span class="b-marke"><i></i>wiLLwacher</span></a>`;
  }
  const kochImg = (k, h, extra = '') => `<img class="koch-bild" src="bilder/koch-${k}.svg" alt="${esc(KB.KOCHBILD[k].alt)}" loading="lazy" style="height:${h}px;width:${Math.round(h * KB.KOCHBILD[k].v)}px${extra}">`;

  /* Buchseiten: Kapitel und Seitenzahlen wie in einem gedruckten Kochbuch (Seite 1–2 = Titel und Inhalt) */
  const seitenCache = {};
  /* Herkunftsland eines Rezepts – für Bücher mit mehreren Ländern und für die Sonderbände */
  const LAENDER_IN = {
    benelux: [['Belgien', /Belgien|Lüttich|Flandern|Gent|Brüssel|Antwerpen/], ['Niederlande', /Niederlande|Holland|Gouda|Leiden|Amsterdam/], ['Luxemburg', /Luxemburg/]],
    skandinavien: [['Schweden', /Schweden|Göteborg|Stockholm/], ['Dänemark', /Dänemark|Kopenhagen/], ['Norwegen', /Norwegen|Lofoten|Bergen/], ['Finnland', /Finnland/], ['Island', /Island/]],
    'britisch-irisch': [['England', /England|Cornwall|Devon|Lancashire|Sussex|Großbritannien|Anglo|London|Yorkshire/], ['Schottland', /Schottland|Arbroath|Moray/], ['Irland', /Irland|Dublin/], ['Wales', /Wales/]],
    'ungarn-balkan': [['Ungarn', /Ungarn|Budapest|Szeged|Balaton/], ['Bosnien und Herzegowina', /Bosnien/], ['Rumänien', /Rumänien/], ['Serbien', /Serbien/], ['Kroatien', /Kroatien/], ['Bulgarien', /Bulgarien/], ['Slowenien', /Slowenien/], ['Albanien', /Albanien/], ['Nordmazedonien', /Mazedonien/]],
    'indonesien-malaysia': [['Indonesien', /Indonesien|[Jj]ava|Sumatra|Bandung|Bali|Jakarta|Surabaya/], ['Malaysia', /Malaysia|Penang|Melaka|Johor|Kuala/], ['Singapur', /Singapur/]],
    nordafrika: [['Marokko', /Marokko/], ['Ägypten', /Ägypten/], ['Tunesien', /Tunesien/], ['Algerien', /Algerien/], ['Libyen', /Libyen/]],
    westafrika: [['Nigeria', /Nigeria/], ['Senegal', /Senegal/], ['Ghana', /Ghana/], ['Elfenbeinküste', /Elfenbeinküste/], ['Kamerun', /Kamerun/], ['Benin', /Benin/], ['Togo', /Togo/], ['Mali', /Mali/]],
    ostafrika: [['Äthiopien', /Äthiopien/], ['Eritrea', /Eritrea/], ['Tansania', /Tansania|Sansibar/], ['Kenia', /Kenia/], ['Uganda', /Uganda/], ['Ruanda', /Ruanda/]],
    suedafrika: [['Südafrika', /Südafrika|Kap|Transvaal|Afrikaans|Freistaat/], ['Mosambik', /Mosambik/], ['Namibia', /Namibia/], ['Simbabwe', /Simbabwe/]],
    levante: [['Libanon', /Libanon|Beirut/], ['Syrien', /Syrien|Aleppo/], ['Palästina', /Palästina|Nablus|Westjordanland/], ['Israel', /Israel/], ['Jordanien', /Jordanien/]],
    karibik: [['Jamaika', /Jamaika/], ['Kuba', /Kuba/], ['Puerto Rico', /Puerto Rico/], ['Trinidad und Tobago', /Trinidad/], ['Haiti', /Haiti/], ['Guyana', /Guyana/], ['Dominikanische Republik', /Dominikan/], ['Barbados', /Barbados/]],
    suedamerika: [['Kolumbien', /Kolumbien/], ['Venezuela', /Venezuela/], ['Bolivien', /Bolivien/], ['Ecuador', /Ecuador/], ['Chile', /Chile/], ['Paraguay', /Paraguay/]],
    suedsee: [['Hawaii', /Hawaii/], ['Tahiti', /Tahiti|Polynesien/], ['Fidschi', /Fidschi/], ['Samoa & Tonga', /Samoa|Tonga/], ['Cookinseln', /Cookinseln/]],
    kaukasus: [['Georgien', /Georgien/], ['Armenien', /Armenien/], ['Aserbaidschan', /Aserbaidschan/]],
    zentralasien: [['Usbekistan', /Usbekistan/], ['Kasachstan', /Kasachstan/], ['Kirgisistan', /Kirgisistan/], ['Tadschikistan', /Tadschikistan/], ['Mongolei', /Mongolei/], ['Turkmenistan', /Turkmenistan/]],
    'nepal-tibet': [['Nepal', /Nepal|Kathmandu|Terai|Pokhara|Newar/], ['Tibet', /Tibet/]],
    'tschechien-slowakei': [['Tschechien', /Tschechien|Böhmen|Mähren/], ['Slowakei', /Slowakei|Skalica/]],
    arabien: [['Saudi-Arabien', /Saudi|Hidschas/], ['Jemen', /Jemen|Hadramaut/], ['Vereinigte Arabische Emirate', /Emirate|VAE/], ['Oman', /Oman/], ['Bahrain', /Bahrain/], ['Kuwait', /Kuwait/], ['Katar', /Katar/], ['Golfstaaten', /Golf/]],
    argentinien: [['Argentinien', /Argentinien|Buenos Aires|Pampa|Patagonien/], ['Uruguay', /Uruguay/]]
  };
  const RESTLAND = { levante: 'Levante (länderübergreifend)', arabien: 'Arabische Halbinsel (länderübergreifend)', nordafrika: 'Nordafrika (länderübergreifend)', westafrika: 'Westafrika (länderübergreifend)' };
  const kuechenReihe = {}; KB.KUECHEN.forEach((k, i) => kuechenReihe[k.id] = i);
  function landVon(r) {
    const liste = LAENDER_IN[r.k], buch = KB.KUECHE[r.k];
    if (!liste) return { name: buch ? buch.kurz : '', ord: (kuechenReihe[r.k] ?? 999) * 100 };
    let best = null;
    liste.forEach(([name, re], i) => { const m = re.exec(r.r || ''); if (m && (!best || m.index < best.pos)) best = { name, pos: m.index, i }; });
    if (best) return { name: best.name, ord: (kuechenReihe[r.k] ?? 999) * 100 + best.i };
    const rest = r.k === 'levante' ? (/London/.test(r.r || '') ? 'Moderne Levante-Küche (London)' : 'Ganze Levante') : RESTLAND[r.k];
    return { name: rest || (buch ? buch.kurz : ''), ord: (kuechenReihe[r.k] ?? 999) * 100 + 99 };
  }
  const buchMitLaendern = b => b.sonder || !!LAENDER_IN[b.id];
  function buchSeiten(b) {
    if (seitenCache[b.id]) return seitenCache[b.id];
    const alle = rezepteIm(b).slice().sort((x, y) => y.b - x.b);
    let kapitel;
    if (!b.sonder) kapitel = KB.KAPITEL.map(k => ({ name: k.name, rezepte: alle.filter(k.test) }));
    else if (b.kapitel === 'gang') kapitel = Object.keys(KB.GANG).map(g => ({ name: KB.GANG[g], rezepte: alle.filter(r => r.g === g) }));
    else if (b.kapitel === 'hauptkategorie') kapitel = KB.HAUPT.map(h => ({ name: h.name, rezepte: alle.filter(r => r.h === h.id) }));
    else kapitel = KB.GRUPPEN.map(g => ({ name: g.name, rezepte: alle.filter(r => gruppeVonKueche(r.k) === g.id) }));
    kapitel = kapitel.filter(k => k.rezepte.length);
    const verteilt = new Set();
    kapitel.forEach(k => { k.rezepte = k.rezepte.filter(r => !verteilt.has(r.id) && verteilt.add(r.id)); });
    const rest = alle.filter(r => !verteilt.has(r.id));
    if (rest.length) kapitel.push({ name: 'Weitere Rezepte', rezepte: rest });
    if (buchMitLaendern(b)) kapitel.forEach(k => {
      const lv = new Map(k.rezepte.map(r => [r.id, landVon(r)]));
      k.rezepte.sort((x, y) => lv.get(x.id).ord - lv.get(y.id).ord || lv.get(x.id).name.localeCompare(lv.get(y.id).name, 'de') || y.b - x.b);
      k.land = lv;
    });
    let s = 3;
    const seite = {};
    kapitel.forEach(k => { k.rezepte = k.rezepte.map(r => { seite[r.id] = s; return { r, seite: s++, land: k.land ? k.land.get(r.id).name : '' }; }); });
    return (seitenCache[b.id] = { kapitel: kapitel.filter(k => k.rezepte.length), seite, anzahl: alle.length });
  }
  /* Fundstelle eines Rezepts im Länderbuch: „Buch Mexiko · Vorspeisen … · S. 5“ */
  function fundstelle(r) {
    const b = KB.KUECHE[r.k]; if (!b) return null;
    const s = buchSeiten(b);
    const kap = s.kapitel.find(k => k.rezepte.some(x => x.r.id === r.id));
    return { buch: b, kapitel: kap ? kap.name : '', seite: s.seite[r.id] };
  }
  const fundstelleText = r => { const f = fundstelle(r); return f ? `Buch ${f.buch.kurz} · ${f.kapitel} · S. ${f.seite}` : ''; };

  /* ---------- Startseite: Bücherregal ---------- */
  function regalReiheHTML(ids, koch, h) {
    if (koch && KB.KOCHBILD[koch].kletter) {
      /* Kletter-Koch: hängt an der Kante des letzten Buchs, Klicks gehen durch ihn hindurch aufs Buch */
      const vorne = ids.slice(0, -1).map(id => buchHTML(buchVon(id))).join('');
      const letzt = `<div class="kletter-platz">${buchHTML(buchVon(ids[ids.length - 1]))}<img class="kletterer" src="bilder/koch-${koch}.svg" alt="${esc(KB.KOCHBILD[koch].alt)}" loading="lazy"></div>`;
      return `<div class="reihe mit-kletterer"><div class="regal">${vorne}${letzt}</div><div class="brett"></div></div>`;
    }
    return `<div class="reihe"><div class="regal">${ids.map(id => buchHTML(buchVon(id))).join('')}${koch ? kochImg(koch, h, ';margin-left:auto' + (KB.KOCHBILD[koch].rand ? `;margin-right:${KB.KOCHBILD[koch].rand}px` : '')) : ''}</div><div class="brett"></div></div>`;
  }
  function kontinentHTML(id, name, satz, kurzsatz, glanz, reihen, alleIds) {
    const bu = BUEHNEN[id] || {};
    const breit = reihen.map((r, i) => r + (bu[i] ? buehneHTML(bu[i]) : '')).join('');
    const schmal = Object.keys(bu).map(i => buehneHTML(bu[i])).join('');
    return `<section class="kont" style="--glanz:${glanz}" aria-labelledby="k-${id}">
      <div class="kont-kopf"><h2 id="k-${id}" class="kont-name">${esc(name)}</h2><span class="kont-satz breit">${esc(satz)}</span><span class="kont-satz schmal">${esc(kurzsatz)}</span></div>
      <div class="reihen-breit">${breit}</div>
      <div class="reihe-schmal"><div class="leiste">${alleIds.map(i => buchHTML(buchVon(i))).join('')}</div><div class="brett"></div>${alleIds.length > 2 ? `<div class="wisch-hinweis" aria-hidden="true">‹ wischen – ${alleIds.length} Bücher ›</div>` : ''}
        <div class="koeche-schmal">${(KB.KOECHE_HANDY[id] || []).map((k, i) => kochImg(k, 165, ';align-self:' + (i % 2 ? 'flex-start' : 'flex-end'))).join('')}</div>${schmal}</div>
    </section>`;
  }
  function tagesgericht() {
    const pool = KB.INDEX.filter(r => r.g === 'hauptgericht' && r.b >= 70);
    const tag = Math.floor(Date.now() / 864e5);
    return pool.length ? pool[(tag * 7919) % pool.length] : KB.INDEX[0];
  }
  /* Sterneköche: jede Figur ist ein großer Knopf zu ihren Spezialrezepten.
     Bocuse steht ganz oben, alle anderen stehen auf eigenen „Sterne-Bühnen“ zwischen den Regalen – über die ganze Seite verteilt. */
  const STERNE = {
    'paul-bocuse': ['bocuse', 'Paul Bocuse, Koch des Jahrhunderts'],
    'jiro-ono': ['jiro', 'Jiro Ono, Sushi-Legende aus Tokio'],
    'thomas-keller': ['keller', 'Thomas Keller, zweimal drei Sterne in den USA'],
    'alfons-schuhbeck': ['schuhbeck', 'Alfons Schuhbeck, Gewürz-Meister aus Bayern'],
    'harald-wohlfahrt': ['wohlfahrt', 'Harald Wohlfahrt, drei Sterne im Schwarzwald'],
    'johann-lafer': ['lafer', 'Johann Lafer, Sternekoch von der Stromburg'],
    'joel-robuchon': ['robuchon', 'Joël Robuchon, Rekord-Sternekoch aus Paris'],
    'alain-ducasse': ['ducasse', 'Alain Ducasse, Sternekoch aus Monte-Carlo und Paris'],
    'gordon-ramsay': ['ramsay', 'Gordon Ramsay mit Beef Wellington, London'],
    'ferran-adria': ['adria', 'Ferran Adrià, elBulli, Katalonien'],
    'massimo-bottura': ['bottura', 'Massimo Bottura, Osteria Francescana, Modena'],
    'eckart-witzigmann': ['witzigmann', 'Eckart Witzigmann, Jahrhundertkoch aus München'],
    'yotam-ottolenghi': ['ottolenghi', 'Yotam Ottolenghi mit Granatapfel-Salat, Levante-Küche aus London'],
    'marcus-samuelsson': ['samuelsson', 'Marcus Samuelsson mit Doro Wat, Red Rooster in Harlem'],
    'curtis-stone': ['stone', 'Curtis Stone mit Grill-Garnele, Melbourne und Los Angeles']
  };
  /* Öffentliche Fassung: frei erfundene Figuren je Land (keine Ähnlichkeit zu echten Personen) */
  const OEFF = {
    'paul-bocuse': ['fr', 'Der Meisterkoch Frankreichs', 'Frankreich'], 'jiro-ono': ['jp', 'Der Sternekoch Japans', 'Japan'],
    'thomas-keller': ['us', 'Der Sternekoch der USA', 'den USA'], 'alfons-schuhbeck': ['by', 'Der Sternekoch aus Bayern', 'Bayern'],
    'harald-wohlfahrt': ['sw', 'Der Sternekoch aus dem Schwarzwald', 'dem Schwarzwald'], 'johann-lafer': ['rh', 'Der Sternekoch aus dem Rheinland', 'dem Rheinland'],
    'massimo-bottura': ['it', 'Der Sternekoch Italiens', 'Italien'], 'ferran-adria': ['es', 'Der Sternekoch Spaniens', 'Spanien'],
    'eckart-witzigmann': ['at', 'Der Sternekoch aus Österreich', 'Österreich'], 'gordon-ramsay': ['gb', 'Der Sternekoch Englands', 'England'],
    'yotam-ottolenghi': ['or', 'Der Sternekoch des Orients', 'dem Orient'], 'marcus-samuelsson': ['af', 'Der Sternekoch Afrikas', 'Afrika'],
    'curtis-stone': ['oz', 'Der Sternekoch Ozeaniens', 'Ozeanien']
  };
  const LANDNAME = { 'dem Schwarzwald': 'Schwarzwald', 'dem Rheinland': 'Rheinland', 'dem Orient': 'Orient', 'den USA': 'USA' };
  const stern2 = id => PRIVAT ? (STERNE[id] ? { bild: 'koch-' + STERNE[id][0], alt: STERNE[id][1] } : null)
    : (OEFF[id] ? { bild: 'meister-' + OEFF[id][0], alt: 'Frei erfundene Koch-Figur: ' + OEFF[id][1], titel: OEFF[id][1], aus: OEFF[id][2], land: LANDNAME[OEFF[id][2]] || OEFF[id][2] } : null);
  /* Bühne nach Regalreihe Nr. … des Kontinents */
  const BUEHNEN = {
    europa: { 0: { titel: 'Deutschlands Sterneköche', koeche: ['alfons-schuhbeck', 'harald-wohlfahrt', 'johann-lafer'] },
      1: { titel: 'Sterneküche aus Italien, Spanien & Österreich', koeche: ['massimo-bottura', 'ferran-adria', 'eckart-witzigmann'] },
      2: { titel: 'Englands Sterne-Star', koeche: ['gordon-ramsay'],
        text: 'Drei Michelin-Sterne in London und der lauteste Koch im Fernsehen. Sein Beef Wellington ist weltberühmt – hier stehen seine Klassiker für zu Hause.',
        oeff: 'Britische Sterneküche mit Temperament – vom cremigen Rührei über Hummer-Ravioli bis zum festlichen Lammrücken.' } },
    asien: { 0: { titel: 'Die Sushi-Legende aus Tokio', koeche: ['jiro-ono'],
      text: 'Über 70 Jahre am Sushi-Tresen, drei Michelin-Sterne, Obama nannte es das beste Sushi seines Lebens. Hier stehen seine Techniken für zu Hause – vom körperwarmen Reis bis zum fetten Thunfisch.',
      oeff: 'Sushi nach Art der großen Meister Tokios – vom körperwarmen Reis über marinierten Glanzfisch bis zum fetten Thunfisch.' } },
    orient: { 0: { titel: 'Der Star der Orient-Küche', koeche: ['yotam-ottolenghi'],
      text: 'In Jerusalem geboren, in London berühmt geworden: Granatapfel, Za’atar, Tahini und Kräuter in rauen Mengen – die Lieblingsgerichte aus seinen Bestsellern „Jerusalem“ und „Plenty“.',
      oeff: 'Granatapfel, Za’atar, Tahini und Kräuter in rauen Mengen – die moderne Küche der Levante für zu Hause.' } },
    afrika: { 0: { titel: 'Afrikas Star-Koch', koeche: ['marcus-samuelsson'],
      text: 'In Äthiopien geboren, in Schweden aufgewachsen, in Harlem zu Hause: Er bringt die Küche Afrikas auf die Weltbühne – von Doro Wat über Berbere bis zum Peri-Peri-Huhn.',
      oeff: 'Die Küche Afrikas auf der Weltbühne – von Tibs und Shiro über Berbere-Butter bis zum Doro Wat.' } },
    amerika: { 0: { titel: 'Amerikas Sterne-König', koeche: ['thomas-keller'],
      text: 'Zwei Restaurants mit je drei Michelin-Sternen – The French Laundry und Per Se. Vom berühmten Brathähnchen über das Ratatouille aus dem Pixar-Film bis zu Oysters and Pearls.',
      oeff: 'Amerikanische Sterneküche für zu Hause – vom perfekten Brathähnchen über geschmorte Short Ribs bis zu Austern mit Kaviar.' } },
    ozeanien: { 0: { titel: 'Ozeaniens Grill-Star', koeche: ['curtis-stone'],
      text: 'Von Melbourne bis Los Angeles: Der Australier steht für Grill, Meeresfrüchte und frische Küche – von Garnelen auf der Barbie über Barramundi bis zur Pavlova.',
      oeff: 'Grill, Meeresfrüchte und frische Küche – vom Hummer vom Grill bis zum Lammrack mit Chimichurri.' } }
  };
  const anzahlRez = id => (KB.KOCH[id] && KB.KOCH[id]._rez.length) || 0;
  function sternKoch(id, lage = '') {
    const st = stern2(id), n = anzahlRez(id);
    if (!st) return '';
    return `<a class="legende ${lage}" href="#/koch/${id}" aria-label="${esc(st.alt)} – ${n ? n + ' Spezialrezepte öffnen' : 'Rezepte folgen'}">
      <img src="bilder/${st.bild}.svg" alt="${esc(st.alt)}" loading="lazy">
      <span class="legende-knopf">${I.buch}<span>${n ? `${n} ${n === 1 ? 'Rezept' : 'Rezepte'}` : 'Rezepte folgen'}</span><b aria-hidden="true">›</b></span></a>`;
  }
  function buehneHTML(b) {
    const stern = '<span class="b-stern" aria-hidden="true">★</span>';
    if (b.koeche.length === 1) {
      const id = b.koeche[0], k = KB.KOCH[id], st = stern2(id);
      const titel = PRIVAT ? b.titel : 'Sternekoch · ' + (st ? st.land : ''), name = PRIVAT ? (k ? k.name : '') : (st ? st.titel : '');
      return `<div class="buehne einzel"><div class="buehne-innen">${sternKoch(id, 'solo')}
        <div class="buehne-tafel"><div class="buehne-titel">${stern} ${esc(titel)} ${stern}</div><h3>${esc(name)}</h3><p>${esc(PRIVAT ? b.text : (b.oeff || b.text))}</p>
        <a class="knopf-spezial" href="#/koch/${id}">${I.buch} ${anzahlRez(id)} Spezialrezepte ansehen</a></div></div><div class="brett"></div></div>`;
    }
    return `<div class="buehne"><div class="buehne-titel">${stern} ${esc(b.titel)} ${stern}</div>
      <div class="buehne-reihe">${b.koeche.map(id => sternKoch(id)).join('')}</div><div class="brett"></div></div>`;
  }
  function legendenHTML() {
    return `<div class="legenden">${sternKoch('paul-bocuse', 'mitte')}</div>
      <p class="legenden-hinweis"><span class="tipp-hand" aria-hidden="true">👆</span> ${PRIVAT ? 'Koch' : 'Meisterkoch'} antippen – seine Rezepte öffnen sich. Weiter unten hat jeder Kontinent seinen ${PRIVAT ? 'Star-Koch' : 'Sternekoch'}.</p>`;
  }
  function fussHTML() {
    const l = [RECHTLICHES.impressum && `<a href="${RECHTLICHES.impressum}" target="_blank" rel="noopener">Impressum</a>`, RECHTLICHES.datenschutz && `<a href="${RECHTLICHES.datenschutz}" target="_blank" rel="noopener">Datenschutz</a>`].filter(Boolean);
    return `<footer class="fuss"><p>${l.join(' · ')}${l.length ? ' · ' : ''}<button type="button" class="fuss-hinweise" id="hinweise-auf">Hinweise zu den Rezepten</button>${installierbar() ? ' · <button type="button" class="fuss-hinweise" id="app-installieren">Als App installieren</button>' : ''}</p><p class="fuss-werbung">Ein kostenloses Programm von Thomas Willwacher Fliesenlegermeister e.K. · <a href="https://www.thomas-willwacher.de/" target="_blank" rel="noopener">www.thomas-willwacher.de</a> · wird laufend weiterentwickelt, Updates kommen automatisch</p></footer>`;
  }
  /* ---------- Als App installieren (PC/Android: Browser-Dialog, iPhone/iPad: Anleitung) ---------- */
  let installEvent = null;
  const istIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const istInstalliert = () => { try { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } };
  function installierbar() { return !istInstalliert() && (!!installEvent || istIOS()); }
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); installEvent = e;
    const zeile = $('.fuss p');
    if (zeile && !$('#app-installieren')) { zeile.insertAdjacentHTML('beforeend', ' · <button type="button" class="fuss-hinweise" id="app-installieren">Als App installieren</button>'); $('#app-installieren').onclick = installieren; }
  });
  window.addEventListener('appinstalled', () => { installEvent = null; const b = $('#app-installieren'); if (b) b.remove(); });
  function installieren() {
    if (installEvent) { installEvent.prompt(); installEvent.userChoice.finally(() => { installEvent = null; }); return; }
    const d = document.createElement('dialog'); d.className = 'infobox';
    d.innerHTML = `<div class="ib-kopf"><h2>Auf den Home-Bildschirm</h2><button class="zu-rot" aria-label="Schließen">${I.zu}</button></div>
      <p>Auf iPhone und iPad geht das mit zwei Fingertipps: In Safari unten auf das Teilen-Symbol tippen, dann „Zum Home-Bildschirm“. Danach liegt „Was isst die Welt?“ wie eine App auf deinem Bildschirm – und funktioniert auch ohne Internet.</p>`;
    document.body.appendChild(d); d.querySelector('.zu-rot').onclick = () => { d.close(); d.remove(); }; d.showModal();
  }
  function hinweise() {
    const d = document.createElement('dialog'); d.className = 'infobox';
    d.innerHTML = `<div class="ib-kopf"><h2>Hinweise</h2><button class="zu-rot" aria-label="Schließen">${I.zu}</button></div>
      <h3>Die Rezepte</h3><p>Alle Rezepte sind eigene, für die Heimküche geschriebene Fassungen. Wo ein Gericht auf die Küche eines bekannten Kochs zurückgeht, steht das beim Rezept mit Quelle – es handelt sich nicht um dessen Originalrezept.</p>
      <h3>Die Koch-Figuren</h3><p>${PRIVAT ? 'Private Ansicht mit Karikaturen.' : 'Alle Koch-Figuren sind frei erfundene Zeichnungen und stellen keine echten Personen dar.'}</p>
      <h3>Ohne Gewähr</h3><p>Mengen, Zeiten und Temperaturen sind sorgfältig zusammengestellt, aber ohne Gewähr. Bitte auf Allergien und Unverträglichkeiten achten; rohen Fisch, rohes Fleisch und rohe Eier nur in einwandfreier Frische und nach den Hinweisen im Rezept verwenden.</p>
      <h3>Als App installieren und Updates</h3><p>Unten auf der Startseite steht „Als App installieren“ (Chrome und Edge am PC, Android). Auf iPhone und iPad: in Safari auf das Teilen-Symbol, dann „Zum Home-Bildschirm“. Das Kochbuch läuft danach auch ohne Internet. Es wird laufend weiterentwickelt; neue Rezepte und Verbesserungen kommen beim nächsten Öffnen mit Internet automatisch dazu.</p>
      <h3>Datenschutz</h3><p>Das Kochbuch setzt keine Cookies und lädt keine Inhalte von fremden Servern. Favoriten und Einkaufsliste werden nur in diesem Browser auf diesem Gerät gespeichert. Links „Quelle ansehen“ führen auf fremde Webseiten. Die Sprachsteuerung beim Kochen nutzt – nur wenn du sie selbst einschaltest – die Spracherkennung deines Browsers; bei Chrome und Edge läuft diese über Server von Google bzw. Microsoft.</p>`;
    document.body.appendChild(d);
    const zu = () => { d.close(); d.remove(); };
    d.querySelector('.zu-rot').onclick = zu; d.addEventListener('click', e => { if (e.target === d) zu(); });
    d.addEventListener('cancel', () => setTimeout(() => d.remove(), 0)); d.showModal();
  }
  function seiteStart(main) {
    main.dataset.titel = '';
    document.body.classList.add('ist-start');
    const sonderIds = KB.SONDER.map(s => s.id);
    const sonder = kontinentHTML('sonder', 'Sonderbände', 'Quer durch alle Küchen – Suppen, Backen, Desserts, Grillen, Street Food und Feste', 'Suppen, Backen, Grillen, Feste & mehr', '243,156,18',
      KB.REGAL.sonder.map(([ids, koch, h]) => regalReiheHTML(ids, koch, h)), sonderIds);
    const welt = KB.GRUPPEN.map(g => kontinentHTML(g.id, g.name, g.satz, g.kurzsatz, g.glanz,
      (KB.REGAL[g.id] || []).map(([ids, koch, h]) => regalReiheHTML(ids, koch, h)),
      KB.KUECHEN.filter(k => k.gruppe === g.id).map(k => k.id))).join('');
    main.innerHTML = `
${legendenHTML()}
      <h1 class="tt tt-gross" aria-label="Was isst die Welt?">${TITEL_HTML}</h1>
      <header class="start-kopf2">
        <form class="start-suche" id="startsuche" role="search">
          <label class="versteckt" for="start-q">Suchen</label>
          <div class="feld">${I.suche}<input id="start-q" type="search" placeholder="Gericht, Zutat, Koch" autocomplete="off"></div>
          <button class="knopf-o">Suchen</button>
          <a class="knopf-b nur-privat" href="#/ki">${I.ki}KI-Menü</a>
          <a class="knopf-g" href="#/baukasten">${I.liste}Menü-Baukasten</a>
          <a class="knopf-r" id="heute-knopf" href="#/heute">${I.wuerfel}Was kochen wir heute?</a>
        </form>
        <div class="loeffel-rahmen"><div class="loeffel"><img src="bilder/loeffel.svg" alt="">${logo().replace('logo-container', 'logo-container lg')}</div></div>
        <nav class="start-nav" aria-label="Werkzeuge">
          <button class="knopf-n" id="info-auf" type="button">${I.info}Über das Buch</button>
          <a class="knopf-n" href="#/koeche">${I.koch}Köche</a>
          <a class="knopf-n" href="#/favoriten">${I.herz}Favoriten<span class="zahl" id="zahl-fav2" hidden></span></a>
          <a class="knopf-n" href="#/einkauf">${I.korb}Einkaufsliste<span class="zahl" id="zahl-einkauf2" hidden></span></a>
        </nav>
      </header>
      ${sonder}${welt}
      ${fussHTML()}`;
    $('#hinweise-auf').onclick = hinweise;
    if ($('#app-installieren')) $('#app-installieren').onclick = installieren;
    $('#startsuche').onsubmit = e => { e.preventDefault(); const q = $('#start-q').value.trim(); location.hash = q ? '#/suche/' + encodeURIComponent(q) : '#/suche/'; };
    $('#info-auf').onclick = infobox;
    kopfZahlen();
  }

  /* ---------- Seite „Was kochen wir heute?“ ---------- */
  function seiteHeute(main) {
    main.dataset.titel = 'Was kochen wir heute?';
    const tag = Math.floor(Date.now() / 864e5);
    const ziehe = (pool, n, salz) => { const l = pool.slice(), out = []; let x = (tag * 7919 + salz * 104729) >>> 0; while (l.length && out.length < n) { x = (x * 1103515245 + 12345) >>> 0; out.push(l.splice(x % l.length, 1)[0]); } return out; };
    const haupt = KB.INDEX.filter(r => r.g === 'hauptgericht');
    const tg = tagesgericht(), tk = kuecheVon(tg.k);
    const ideen = [
      ['Schnell auf dem Tisch', 'In höchstens 30 Minuten fertig', ziehe(haupt.filter(r => r.z <= 30 && r.b >= 40), 4, 1)],
      ['Etwas Leichtes', 'Fisch, Gemüse und Salate', ziehe(KB.INDEX.filter(r => (r.h === 'fisch' || r.h === 'vegetarisch' || r.h === 'vegan') && ['hauptgericht', 'salat', 'suppe'].includes(r.g) && r.b >= 50), 4, 2)],
      ['Etwas Deftiges', 'Schmorgerichte, Braten und Eintöpfe', ziehe(KB.INDEX.filter(r => r.h === 'fleisch' && ['hauptgericht', 'eintopf'].includes(r.g) && r.b >= 55), 4, 3)],
      ['Einmal um die Welt', 'Klassiker aus fernen Küchen', ziehe(haupt.filter(r => !['europa'].includes(gruppeVonKueche(r.k)) && r.b >= 70), 4, 4)],
      ['Zum Nachtisch', 'Süßes aus aller Welt', ziehe(KB.INDEX.filter(r => ['dessert', 'kuchen'].includes(r.g) && r.b >= 55), 4, 5)]
    ];
    main.innerHTML = `<a class="zurueck no-print" href="#/">${I.pfeilL} Zum Bücherregal</a>
      <section class="heute">
        <div class="heute-text">
          <h1>Was kochen wir heute?</h1>
          <p>Keine Idee? Lass dir ein Gericht vorschlagen oder stell dir ein ganzes Menü zusammen – jedes Gericht Schritt für Schritt erklärt, mit den Kniffen großer Köche.</p>
          <div class="heute-knoepfe">
            <button class="knopf-o" id="ueberrasch" type="button">${I.wuerfel}Überrasch mich</button>
            <a class="knopf-g" href="#/baukasten">${I.liste}Menü-Baukasten</a>
            <a class="knopf-b nur-privat" href="#/ki">${I.ki}Menü mit KI planen</a>
          </div>
        </div>
        <a class="heute-karte" href="#/rezept/${tg.id}">
          <span class="bild">${KB.titelbild({ id: tg.id, name: tg.n, bild: tg.bi, farben: tg.fa }, tk.bg || tk.f[0])}</span>
          <span class="heute-schild"><small>Heute auf dem Herd</small><b>${esc(tg.n)}</b><span>${esc(fundstelleText(tg))}</span></span>
        </a>
      </section>
      <p class="heute-wechsel">Die Vorschläge wechseln jeden Tag.</p>
      <div class="heute-ideen">${ideen.filter(([, , l]) => l.length).map(([t, u, l]) => `<section class="heute-idee"><h2>${esc(t)}</h2><p>${esc(u)}</p><div class="heute-liste">${l.map(karteKlein).join('')}</div></section>`).join('')}</div>`;
    $('#ueberrasch').onclick = () => { const pool = KB.INDEX.filter(r => r.b >= 60 && r.g !== 'sauce'); location.hash = '#/rezept/' + pool[Math.floor(Math.random() * pool.length)].id; };
  }

  /* ---------- Infobox „Über das Buch“ ---------- */
  function infobox() {
    const zaehl = f => KB.INDEX.filter(f).length;
    const d = document.createElement('dialog');
    d.className = 'infobox';
    d.innerHTML = `<div class="ib-kopf"><h2>Über das Buch</h2><button class="zu-rot" aria-label="Schließen">${I.zu}</button></div>
      <p>„Was isst die Welt?“ – jedes Rezept Schritt für Schritt erklärt, mit eigener Illustration je Arbeitsschritt, Kochmodus, Sprachkochen und Menü-Baukasten${PRIVAT ? ' sowie KI-Menüplaner' : ''}.</p>
      <h3>Inhalt</h3>
      <div class="ib-zeile"><span>Rezepte</span><b>${KB.INDEX.length}</b></div>
      <div class="ib-zeile"><span>Länderbücher in ${KB.GRUPPEN.length} Kontinenten</span><b>${KB.KUECHEN.length}</b></div>
      <div class="ib-zeile"><span>Köche im Register</span><b>${KB.KOECHE.length}</b></div>
      <h3>Sonderbände</h3>
      ${KB.SONDER.map(s => `<div class="ib-zeile"><span>${esc(s.kurz)}</span><b>${zaehl(s.test)}</b></div>`).join('')}
      <h3>Kategorien</h3>
      <div class="ib-chips">${KB.HAUPT.map(h => `<span>${esc(h.name)} ${zaehl(r => r.h === h.id)}</span>`).join('')}</div>`;
    document.body.appendChild(d);
    const zu = () => { d.close(); d.remove(); };
    d.querySelector('.zu-rot').onclick = zu;
    d.addEventListener('click', e => { if (e.target === d) zu(); });
    d.addEventListener('cancel', () => setTimeout(() => d.remove(), 0));
    d.showModal();
  }

  /* ---------- Aufgeschlagenes Buch: erste Seite + Inhaltsverzeichnis ---------- */
  /* Inhaltsverzeichnis-Zeilen, bei mehreren Ländern unter kleinen Länder-Überschriften */
  function ivzGruppen(liste) {
    const zeile = ({ r, seite }) => `<a class="ivz" href="#/rezept/${r.id}" data-h="${r.h}"><span class="ivz-name">${esc(r.n)}</span><span class="ivz-punkte"></span><span class="ivz-zeit">${zeitText(r.z)}</span><span class="ivz-seite">${seite}</span></a>`;
    if (!liste.length || !liste[0].land) return liste.map(zeile).join('');
    const gruppen = [];
    liste.forEach(e => { const g = gruppen[gruppen.length - 1]; if (g && g.land === e.land) g.e.push(e); else gruppen.push({ land: e.land, e: [e] }); });
    return gruppen.map(g => `<div class="land-gruppe"><h4 class="ivz-land">${esc(g.land)}</h4>${g.e.map(zeile).join('')}</div>`).join('');
  }
  function seiteBuch(main, id) {
    const b = buchVon(id);
    if (!b) return seiteStart(main);
    main.dataset.titel = b.kurz;
    const s = buchSeiten(b);
    const alle = rezepteIm(b).slice().sort((x, y) => y.b - x.b);
    const top = alle.find(r => r.g === 'hauptgericht') || alle[0];
    const koeche = b.sonder ? [] : KB.KOECHE.filter(k => (k.kueche || []).includes(b.id)).sort((x, y) => y._rez.length - x._rez.length).slice(0, 6);
    const hz = {}; alle.forEach(r => hz[r.h] = (hz[r.h] || 0) + 1);
    main.innerHTML = `<a class="zurueck no-print" href="#/">${I.pfeilL} Zum Bücherregal</a>
      <div class="buch-offen" style="--einband:${b.bg};--akzent:${b.ak}">
        <div class="seiten">
          <article class="seite links">
            <div class="seite-kopf"><span class="tt-klein">${TITEL_HTML}</span><span class="marke-klein"><i></i>wiLLwacher</span></div>
            <h1>${esc(b.kurz)}</h1>
            <span class="unter">${esc(b.unter)}</span><span class="strich"></span>
            <div class="buch-bild">${KB.titelbild(buchBildRezept(b), b.bg)}</div>
            <p class="intro">${esc(b.intro || '')}</p>
            <p class="fakten">${s.anzahl} Rezepte in ${s.kapitel.length} Kapiteln${koeche.length ? ` · ${koeche.length} Köche` : ''}</p>
            ${koeche.length ? `<div class="buch-koeche">${koeche.map(k => `<a href="#/koch/${k.id}"><span class="monogramm" aria-hidden="true">${monogramm(k.name)}</span>${esc(k.name)}</a>`).join('')}</div>` : ''}
            ${top ? `<a class="einstieg" href="#/rezept/${top.id}"><small>Zum Einstieg</small><b>${esc(top.n)}</b><span>${esc(top.ku)}</span><em>Seite ${s.seite[top.id]} · ${zeitText(top.z)}</em></a>` : ''}
            <div class="seitenzahl">1</div>
          </article>
          <article class="seite rechts">
            <h2>Inhalt</h2>
            <div class="inhalt-filter" role="group" aria-label="Kategorie">
              <button class="chip an" data-h="">Alle <i>${alle.length}</i></button>
              ${KB.HAUPT.filter(h => hz[h.id]).map(h => `<button class="chip" data-h="${h.id}"><span class="punkt" style="background:${h.farbe}"></span>${esc(h.name)} <i>${hz[h.id]}</i></button>`).join('')}
            </div>
            ${s.kapitel.map(k => `<section class="kapitel"><h3>${esc(k.name)}</h3>
              ${ivzGruppen(k.rezepte)}
            </section>`).join('')}
            <a class="alle-liste no-print" href="${b.sonder ? '#/mahlzeit/' + b.id : '#/kueche/' + b.id}">Alle Rezepte als Liste mit Filtern und Sortierung ${I.pfeilR}</a>
            <div class="seitenzahl">2</div>
          </article>
        </div>
      </div>`;
    $$('.inhalt-filter .chip', main).forEach(c => c.onclick = () => {
      $$('.inhalt-filter .chip', main).forEach(x => x.classList.toggle('an', x === c));
      const h = c.dataset.h;
      $$('.ivz', main).forEach(a => a.hidden = !!h && a.dataset.h !== h);
      $$('.land-gruppe', main).forEach(g => g.hidden = !$$('.ivz', g).some(a => !a.hidden));
      $$('.kapitel', main).forEach(k => k.hidden = !$$('.ivz', k).some(a => !a.hidden));
    });
  }

  /* ---------- Menü: gemeinsame Bausteine für Menü-Baukasten und KI ---------- */
  const ABTEILUNG = [
    ['Fisch & Meeresfrüchte', /fisch|lachs|thunfisch|kabeljau|dorsch|forelle|zander|karpfen|hering|matjes|sardine|sardelle|anchovi|garnele|shrimp|gambas|scampi|muschel|tintenfisch|kalmar|calamar|oktopus|krake|krabbe|hummer|languste|makrele|scholle|dorade|wolfsbarsch|seelachs|heilbutt|tilapia|barramundi|snapper|stockfisch|bacalhau|baccal|aal/],
    ['Asia- & Spezialladen', /miso|gochujang|gochugaru|nori|dashi|mirin|sake|tamarind|galgant|zitronengras|kaffir|harissa|berbere|teff|maniok|yuca|kochbanane|plantain|ají|aji amarillo|palmöl|egusi|sumach|za'atar|zatar|fischsauce|austernsauce|hoisin|sambal|kecap|pandan|kokosmilch|reispapier|reisnudel|glasnudel|tofu|kimchi|wasabi|panko|shaoxing|sichuan|garam masala|asafoetida|bockshorn|ghee|paneer|curryblätter/],
    ['Fleisch & Wurst', /fleisch|rind|schwein|kalb|lamm|hammel|ziege|hähnchen|hühnchen|huhn|hühner|pute|truthahn|ente|gans|speck|schinken|pancetta|guanciale|chorizo|salami|wurst|würst|hack|kotelett|schnitzel|bauch|keule|haxe|leber|niere|knochen|ochsenschwanz|wild|reh|hirsch|kaninchen|bacon|spam/],
    ['Milch, Käse & Eier', /milch|sahne|butter|käse|quark|joghurt|jogurt|schmand|crème|creme fraîche|ei\b|eier|eigelb|eiweiß|mascarpone|ricotta|mozzarella|parmesan|pecorino|feta|halloumi|buttermilch|kefir|smetana|bryndza/],
    ['Brot & Backwaren', /brot|brötchen|toast|baguette|tortilla|fladen|pita|wrap|semmel|zwieback|blätterteig|filoteig|yufka/],
    ['Obst & Gemüse', /zwiebel|schalotte|knoblauch|karotte|möhre|kartoffel|tomate(?!nmark)|paprikaschote|paprika(?!pulver)|lauch|porree|sellerie|kohl|wirsing|spinat|mangold|salat|rucola|gurke|zucchini|aubergine|pilz|champignon|steinpilz|zitrone|limette|apfel|äpfel|birne|beere|banane|mango|ananas|ingwer|petersilie|koriandergrün|frischer koriander|basilikum|minze|dill|schnittlauch|kerbel|estragon|frühlingszwiebel|lauchzwiebel|avocado|kürbis|rübe|rote bete|radieschen|rettich|bohnen, grün|grüne bohnen|zuckerschote|erbsen|maiskolben|orange|granatapfel|rhabarber|kirsch|pflaume|zwetschge|feige|pfirsich|aprikose|melone|trauben|kiwi|passionsfrucht|chilischote|frische chili|jalapeño|okra|spargel|fenchel|artischocke|süßkartoffel|batate|kumara|blumenkohl|brokkoli|rosenkohl|pastinake|topinambur|kohlrabi/],
    ['Trockenwaren & Backzutaten', /mehl|zucker|reis|nudel|pasta|spaghetti|penne|linguine|lasagne|grieß|hefe|backpulver|natron|haferflocken|linsen|getrocknete bohnen|weiße bohnen|kidneybohnen|kichererbse|couscous|bulgur|polenta|maisgrieß|stärke|vanille|schokolade|kuvertüre|kakao|nüss|nuss|mandel|pistazie|pinienkern|rosine|sultanine|puderzucker|honig|sirup|melasse|gelatine|marzipan|kokosraspel|datteln|trockenobst|graupen|hirse|quinoa|sesam(?!öl)/],
    ['Gewürze, Öle & Saucen', /salz|pfeffer|pulver|kreuzkümmel|kümmel|zimt|muskat|curry|öl\b|olivenöl|sesamöl|rapsöl|essig|senf|sojasauce|sojasoße|ketchup|brühe|fond|tomatenmark|lorbeer|nelke|kardamom|kurkuma|safran|gewürz|chiliflocken|oregano|thymian|rosmarin|majoran|piment|wacholder|sternanis|fenchelsamen|koriandersamen|vanilleschote|worcester|tabasco|mayonnaise|chutney|paste/],
    ['Konserven & Feinkost', /dose|passiert|gehackte tomaten|oliven|kapern|eingelegt|sardellen|cornichon|sauerkraut|gewürzgurke/],
    ['Wein, Bier & Spirituosen', /wein|bier|rum|brandy|cognac|weinbrand|likör|sherry|portwein|madeira|marsala|wodka|gin|whisky|calvados|kirschwasser|grappa|amaretto|cidre/]
  ];
  const abteilungVon = name => { const n = name.toLowerCase(); const t = ABTEILUNG.find(([, re]) => re.test(n)); return t ? t[0] : 'Sonstiges'; };
  const ABT_REIHE = ['Obst & Gemüse', 'Fleisch & Wurst', 'Fisch & Meeresfrüchte', 'Milch, Käse & Eier', 'Brot & Backwaren', 'Trockenwaren & Backzutaten', 'Gewürze, Öle & Saucen', 'Konserven & Feinkost', 'Asia- & Spezialladen', 'Wein, Bier & Spirituosen', 'Sonstiges'];

  async function ladeRezepte(ids) {
    await Promise.all([...new Set(ids.map(id => IDX[id] && IDX[id].k).filter(Boolean))].map(ladeKueche));
    return ids.map(id => KB.REZ[id]).filter(Boolean);
  }
  /* Zutaten mehrerer Rezepte zusammenrechnen und nach Supermarkt-Abteilung sortieren */
  function sammelZutaten(rezepte, personen) {
    const m = new Map();
    rezepte.forEach(r => {
      const f = personen / (r.portionen || 4);
      r.zutaten.forEach(g => g.liste.forEach(z => {
        const basis = String(z.name || '').replace(/\(.*?\)/g, '').split(',')[0].trim();
        if (!basis || /^(kaltes |warmes |heißes |lauwarmes )?wasser$/i.test(basis)) return;
        const key = basis.toLowerCase() + '|' + (z.einheit || '');
        const e = m.get(key) || { name: basis, einheit: z.einheit || '', menge: 0, offen: false, fuer: new Set() };
        if (z.menge == null) e.offen = true; else e.menge += z.menge * f;
        e.fuer.add(r.name);
        m.set(key, e);
      }));
    });
    return [...m.values()].map(e => ({
      t: (e.menge ? mengeText(e.menge, e.einheit) + ' ' : '') + e.name + (e.offen && e.menge ? ' (plus nach Geschmack)' : (e.offen ? ' (nach Bedarf)' : '')),
      abt: abteilungVon(e.name), fuer: [...e.fuer].join(', '), ok: false, _n: e.name
    })).sort((a, b) => ABT_REIHE.indexOf(a.abt) - ABT_REIHE.indexOf(b.abt) || a._n.localeCompare(b._n, 'de'))
      .map(({ _n, ...rest }) => rest);
  }
  async function menueAufEinkaufsliste(titel, ids, personen) {
    const rezepte = await ladeRezepte(ids);
    const posten = sammelZutaten(rezepte, personen);
    const l = einkauf.alle();
    l.unshift({ id: 'menue-' + Date.now(), n: titel, p: personen, menue: true, rezepte: rezepte.map(r => ({ id: r.id, n: r.name })), posten });
    einkauf.setz(l);
    meldung(posten.length + ' Posten für ' + personen + ' Personen auf der Einkaufsliste');
  }
  /* Ablaufplan aus den Zeiten der Rezepte: was am Vortag, was wann vor dem Essen */
  const GANG_VERSATZ = { vorspeise: 0, suppe: 20, salat: 10, zwischengang: 20, hauptgang: 45, beilage: 45, dessert: 90 };
  function ablaufplan(rezepte, arten) {
    const zeilen = rezepte.map((r, i) => {
      const z = r.zeit || {}, art = arten[i] || 'hauptgang';
      const aktiv = (z.vorbereitung || 0) + (z.garen || 0), ruhen = z.ruhen || 0;
      const vorlauf = aktiv + ruhen - (GANG_VERSATZ[art] || 0);
      return { r, art, aktiv, ruhen, vorlauf, vortag: ruhen >= 360 || aktiv + ruhen >= 600 };
    }).sort((a, b) => b.vorlauf - a.vorlauf);
    const runde = m => Math.ceil(m / 15) * 15;
    return zeilen.map(x => {
      const wann = x.vortag ? 'Am Vortag' : (x.vorlauf > 0 ? zeitText(runde(x.vorlauf)) + ' vor dem Essen' : 'Während der vorigen Gänge');
      return `<li><b>${wann}:</b> ${esc(GANGNAME[x.art] || x.art)} – <a href="#/rezept/${x.r.id}">${esc(x.r.name)}</a> beginnen
        <span class="ablauf-detail">(aktiv ${zeitText(x.aktiv)}${x.ruhen ? ', Ruhe-/Kühlzeit ' + zeitText(x.ruhen) : ''})</span></li>`;
    }).join('');
  }
  const GANGNAME = { vorspeise: 'Vorspeise', suppe: 'Suppe', salat: 'Salat', zwischengang: 'Zwischengang', hauptgang: 'Hauptgang', beilage: 'Beilage', dessert: 'Dessert' };
  function gangKarte(r, art, warum, extra = '') {
    const f = fundstelle(r);
    return `<div class="menue-gang">
      <div class="menue-gang-kopf"><span class="gang-name">${esc(GANGNAME[art] || art)}</span>${extra}</div>
      ${zeile(r, null, true)}
      ${f ? `<a class="fundstelle" href="${buchLink(f.buch)}">${I.buch}Buch <b>${esc(f.buch.kurz)}</b> · ${esc(f.kapitel)} · <b>Seite ${f.seite}</b></a>` : ''}
      ${warum ? `<p class="warum">${esc(warum)}</p>` : ''}</div>`;
  }

  /* ---------- Menü-Baukasten (ohne KI, funktioniert überall und offline) ---------- */
  const BK_ARTEN = {
    vorspeise: { name: 'Vorspeise', test: r => ['vorspeise', 'salat', 'snack'].includes(r.g) },
    suppe: { name: 'Suppe', test: r => r.g === 'suppe' },
    zwischengang: { name: 'Zwischengang', test: r => ['salat', 'vorspeise', 'suppe'].includes(r.g) && r.z <= 60 },
    hauptgang: { name: 'Hauptgang', test: r => r.g === 'hauptgericht' || r.g === 'eintopf' },
    beilage: { name: 'Beilage', test: r => r.g === 'beilage' },
    dessert: { name: 'Dessert', test: r => r.g === 'dessert' || (r.h === 'suess' && ['kuchen', 'gebaeck'].includes(r.g)) }
  };
  const bkStd = () => ({ personen: 4, gaenge: [{ art: 'vorspeise', land: '', kat: '' }, { art: 'hauptgang', land: '', kat: '' }, { art: 'dessert', land: '', kat: '' }], wahl: [], fest: [] });
  const bkHol = () => { const s = speicher.hol('baukasten', null); return s && s.gaenge ? s : bkStd(); };
  const bkSetz = s => speicher.setz('baukasten', s);
  const SCHWER = r => r.g === 'eintopf' || r.z >= 150 || ['schwein', 'gans', 'ente', 'lamm', 'innereien'].includes(r.fs);

  function bkKandidaten(g) {
    const art = BK_ARTEN[g.art] || BK_ARTEN.hauptgang;
    const passt = (r, land, kat) => art.test(r) && (!land || r.k === land) && (!kat || r.h === kat || (kat === 'vegetarisch' && r.h === 'vegan'));
    let pool = KB.INDEX.filter(r => passt(r, g.land, g.kat)), hinweis = '';
    if (!pool.length && g.kat) { pool = KB.INDEX.filter(r => passt(r, g.land, '')); hinweis = `Im Buch ${g.land ? kuecheVon(g.land).kurz : ''} gibt es dafür nichts ${KB.HAUPT_NAME[g.kat] || ''} – hier die beste Alternative.`; }
    if (!pool.length && g.land) { pool = KB.INDEX.filter(r => passt(r, '', g.kat)); hinweis = `Im Buch ${kuecheVon(g.land).kurz} gibt es noch keine ${art.name} – hier ein passender Vorschlag aus einem anderen Buch.`; }
    return { pool, hinweis };
  }
  /* Harmonie: kräftiger Hauptgang → leichte Vorspeise und leichtes Dessert, keine Fleischsorte doppelt, Abwechslung bei Bildtyp/Garmethode */
  function bkBewerte(r, g, gewaehlt) {
    let s = r.b / 100 + Math.random() * 0.55;
    const haupt = gewaehlt.find(x => x && x.art === 'hauptgang');
    const andere = gewaehlt.filter(x => x && x.r.id !== r.id).map(x => x.r);
    if (andere.some(x => x.id === r.id)) s -= 5;
    if (andere.some(x => x.h === 'fleisch' && r.h === 'fleisch' && x.fs === r.fs)) s -= 0.8;
    if (andere.some(x => x.bi === r.bi)) s -= 0.35;
    if (andere.some(x => x.h === 'fisch') && r.h === 'fisch') s -= 0.3;
    if (haupt && g.art !== 'hauptgang') {
      const hs = SCHWER(haupt.r);
      if (hs && SCHWER(r)) s -= 0.6;
      if (g.art === 'vorspeise' && haupt.r.h === 'fleisch' && ['fisch', 'vegetarisch', 'vegan'].includes(r.h)) s += 0.25;
      if (g.art === 'dessert' && hs && r.g === 'dessert' && r.z <= 90) s += 0.2;
      if (r.k === haupt.r.k && !g.land) s += 0.15;
    }
    if (g.art !== 'hauptgang' && r.z > 240 && !(g.art === 'dessert')) s -= 0.3;
    return s;
  }
  function bkWuerfeln(st, nurIndex) {
    const reihenfolge = st.gaenge.map((g, i) => i).sort((a, b) => (st.gaenge[b].art === 'hauptgang') - (st.gaenge[a].art === 'hauptgang'));
    const gewaehlt = st.gaenge.map((g, i) => st.wahl[i] && IDX[st.wahl[i]] ? { art: g.art, r: IDX[st.wahl[i]] } : null);
    st.hinweise = st.hinweise || [];
    reihenfolge.forEach(i => {
      if (nurIndex != null && i !== nurIndex) return;
      if (nurIndex == null && st.fest[i] && gewaehlt[i]) return;
      const g = st.gaenge[i];
      const { pool, hinweis } = bkKandidaten(g);
      st.hinweise[i] = hinweis;
      if (!pool.length) { gewaehlt[i] = null; st.wahl[i] = ''; return; }
      const alt = st.wahl[i];
      const bewertet = pool.map(r => ({ r, s: bkBewerte(r, g, gewaehlt) - (r.id === alt ? 2 : 0) })).sort((a, b) => b.s - a.s);
      const top = bewertet.slice(0, Math.min(5, bewertet.length));
      const pick = top[Math.floor(Math.random() * top.length)].r;
      gewaehlt[i] = { art: g.art, r: pick }; st.wahl[i] = pick.id;
    });
    return st;
  }
  function harmonieText(st) {
    const rs = st.wahl.map(id => IDX[id]).filter(Boolean);
    if (rs.length < 2) return '';
    const laender = [...new Set(rs.map(r => kuecheVon(r.k).kurz))];
    const haupt = st.gaenge.findIndex(g => g.art === 'hauptgang');
    const h = haupt >= 0 ? IDX[st.wahl[haupt]] : null;
    const teile = [];
    teile.push(laender.length > 1 ? `Eine Reise durch ${laender.slice(0, -1).join(', ')} und ${laender.slice(-1)}.` : `Ein Menü ganz aus dem Buch ${laender[0]}.`);
    if (h) teile.push(SCHWER(h) ? `Der Hauptgang ${h.n} ist kräftig – deshalb sind Vorspeise und Dessert bewusst leichter gewählt.` : `Mit ${h.n} als Hauptgang bleibt das Menü insgesamt leicht.`);
    const fleisch = rs.filter(r => r.h === 'fleisch').length;
    if (fleisch <= 1) teile.push('Fleisch kommt höchstens einmal vor, so bleibt Platz für Abwechslung.');
    const gesamt = rs.reduce((s, r) => s + r.z, 0);
    teile.push(`Zusammen etwa ${zeitText(gesamt)} Arbeits- und Wartezeit – der Ablaufplan unten verteilt das sinnvoll.`);
    return teile.join(' ');
  }

  function seiteBaukasten(main) {
    main.dataset.titel = 'Menü-Baukasten';
    const st = bkHol();
    const landOpt = sel => `<option value="">Alle Länder</option>${KB.GRUPPEN.map(g => `<optgroup label="${esc(g.name)}">${KB.KUECHEN.filter(k => k.gruppe === g.id).map(k => `<option value="${k.id}"${sel === k.id ? ' selected' : ''}>${esc(k.kurz)}</option>`).join('')}</optgroup>`).join('')}`;
    const katOpt = sel => `<option value="">Egal</option>${KB.HAUPT.filter(h => h.id !== 'suess').map(h => `<option value="${h.id}"${sel === h.id ? ' selected' : ''}>${esc(h.name)}</option>`).join('')}`;
    const artOpt = sel => Object.entries(BK_ARTEN).map(([id, a]) => `<option value="${id}"${sel === id ? ' selected' : ''}>${a.name}</option>`).join('');
    const zeichne = () => {
      const hatWahl = st.wahl.some(Boolean);
      main.innerHTML = `<a class="zurueck no-print" href="#/">${I.pfeilL} Zum Bücherregal</a>
        <div class="band"><div class="band-text"><h1>Menü-Baukasten</h1>
          <p>Stell dir dein Menü selbst zusammen: Gang für Gang das Land und die Richtung wählen – das Buch sucht die passenden Rezepte aus, stimmt sie aufeinander ab und sagt dir, in welchem Kochbuch auf welcher Seite sie stehen. Funktioniert überall, auch ohne Internet und ohne KI.</p></div></div>
        <section class="kachel abschnitt bk-form">
          <div class="bk-personen"><span>Für</span><div class="portionen"><button id="bk-minus" aria-label="Eine Person weniger">−</button><span id="bk-p">${st.personen} Personen</span><button id="bk-plus" aria-label="Eine Person mehr">+</button></div></div>
          ${st.gaenge.map((g, i) => `<div class="bk-zeile">
            <span class="bk-nr">${i + 1}</span>
            <label><span>Gang</span><select data-i="${i}" data-f="art">${artOpt(g.art)}</select></label>
            <label><span>Aus welchem Buch?</span><select data-i="${i}" data-f="land">${landOpt(g.land)}</select></label>
            ${g.art === 'dessert' ? '<label class="leer"></label>' : `<label><span>Richtung</span><select data-i="${i}" data-f="kat">${katOpt(g.kat)}</select></label>`}
            <button class="rund-klein" data-weg="${i}" aria-label="Gang ${i + 1} entfernen"${st.gaenge.length < 2 ? ' disabled' : ''}>${I.zu}</button>
          </div>`).join('')}
          <div class="bk-knoepfe">
            <button class="knopf" id="bk-plus-gang" ${st.gaenge.length >= 7 ? 'disabled' : ''}>${I.plus} Gang hinzufügen</button>
            <button class="knopf haupt" id="bk-los">${I.wuerfel} Menü zusammenstellen</button>
            ${hatWahl ? `<button class="knopf" id="bk-neu">Alles neu</button>` : ''}
          </div>
        </section>
        <div id="bk-ergebnis" aria-live="polite"></div>`;
      $$('select[data-i]', main).forEach(s => s.onchange = () => { st.gaenge[+s.dataset.i][s.dataset.f] = s.value; st.fest[+s.dataset.i] = false; bkSetz(st); if (s.dataset.f === 'art') zeichne(); });
      $$('[data-weg]', main).forEach(b => b.onclick = () => { const i = +b.dataset.weg; st.gaenge.splice(i, 1); st.wahl.splice(i, 1); st.fest.splice(i, 1); bkSetz(st); zeichne(); });
      $('#bk-plus-gang').onclick = () => { st.gaenge.splice(Math.max(0, st.gaenge.length - 1), 0, { art: 'suppe', land: '', kat: '' }); st.wahl.splice(Math.max(0, st.gaenge.length - 2), 0, ''); st.fest.splice(Math.max(0, st.gaenge.length - 2), 0, false); bkSetz(st); zeichne(); };
      $('#bk-minus').onclick = () => { if (st.personen > 1) { st.personen--; bkSetz(st); $('#bk-p').textContent = st.personen + (st.personen === 1 ? ' Person' : ' Personen'); } };
      $('#bk-plus').onclick = () => { if (st.personen < 40) { st.personen++; bkSetz(st); $('#bk-p').textContent = st.personen + ' Personen'; } };
      $('#bk-los').onclick = () => { bkWuerfeln(st); bkSetz(st); zeichne(); $('#bk-ergebnis').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      const neu = $('#bk-neu'); if (neu) neu.onclick = () => { st.fest = []; st.wahl = []; bkWuerfeln(st); bkSetz(st); zeichne(); };
      if (hatWahl) ergebnis();
    };
    const ergebnis = async () => {
      const box = $('#bk-ergebnis');
      const ids = st.wahl.filter(Boolean);
      box.innerHTML = `<section class="kachel abschnitt menue-kopf"><h2>Dein Menü</h2><p>${esc(harmonieText(st))}</p></section>
        ${st.gaenge.map((g, i) => {
          const r = IDX[st.wahl[i]];
          if (!r) return `<div class="leer-hinweis">${esc(BK_ARTEN[g.art].name)}: Dazu gibt es im Buch noch kein passendes Rezept.</div>`;
          const knoepfe = `<span class="gang-knoepfe"><button class="chip" data-anders="${i}">${I.wuerfel} Anderes Gericht</button><button class="chip${st.fest[i] ? ' an' : ''}" data-fest="${i}">${st.fest[i] ? 'Festgehalten' : 'Festhalten'}</button></span>`;
          return gangKarte(r, g.art, st.hinweise && st.hinweise[i], knoepfe);
        }).join('')}
        <div class="knoepfe menue-knoepfe"><button class="knopf haupt" id="bk-einkauf">${I.korb} Einkaufsliste fürs ganze Menü</button></div>
        <section class="kachel abschnitt"><h2>Ablaufplan für die Küche</h2><ol class="ablauf" id="bk-ablauf"><li>Wird berechnet …</li></ol></section>`;
      $$('[data-anders]', box).forEach(b => b.onclick = () => { bkWuerfeln(st, +b.dataset.anders); bkSetz(st); ergebnis(); });
      $$('[data-fest]', box).forEach(b => b.onclick = () => { const i = +b.dataset.fest; st.fest[i] = !st.fest[i]; bkSetz(st); ergebnis(); });
      $('#bk-einkauf').onclick = () => menueAufEinkaufsliste('Menü: ' + ids.map(id => IDX[id].n).join(' · '), ids, st.personen);
      try {
        const rezepte = await ladeRezepte(st.wahl.map(id => id || '__'));
        const arten = st.gaenge.filter((g, i) => IDX[st.wahl[i]]).map(g => g.art);
        const ab = $('#bk-ablauf'); if (ab) ab.innerHTML = ablaufplan(rezepte, arten);
      } catch (e) { const ab = $('#bk-ablauf'); if (ab) ab.innerHTML = '<li>Der Ablaufplan braucht die Rezeptdaten – bitte einmal mit Internet öffnen.</li>'; }
    };
    zeichne();
  }

  /* ---------- Rahmen ---------- */
  function rahmen() {
    document.body.innerHTML = `
      <a class="versteckt" href="#inhalt">Zum Inhalt springen</a>
      <header class="kopf"><div class="kopf-innen">
        <a class="marke" href="#/" aria-label="Zur Startseite – Bücherregal"><span class="tt tt-kopf">${TITEL_HTML}</span>${logo(true)}</a>
        <form class="suche-feld" role="search" id="suchform">
          ${I.suche}<label class="versteckt" for="suche">Suchen</label>
          <input id="suche" type="search" placeholder="Gericht, Zutat, Land oder Koch suchen" autocomplete="off">
        </form>
        <nav class="nav" aria-label="Hauptnavigation">
          <a href="#/" title="Startseite – Bücherregal" data-nav="start">${I.haus}<span class="txt">Start</span></a>
          <a href="#/baukasten" title="Baukasten" data-nav="baukasten">${I.liste}<span class="txt">Baukasten</span></a>
          <a class="nur-privat" href="#/ki" title="KI-Menü" data-nav="ki">${I.ki}<span class="txt">KI-Menü</span></a>
          <a href="#/koeche" title="Köche" data-nav="koeche">${I.koch}<span class="txt">Köche</span></a>
          <a href="#/favoriten" title="Favoriten" data-nav="favoriten">${I.herz}<span class="txt">Favoriten</span><span class="zahl" id="zahl-fav" hidden></span></a>
          <a href="#/einkauf" title="Einkauf" data-nav="einkauf">${I.korb}<span class="txt">Einkauf</span><span class="zahl" id="zahl-einkauf" hidden></span></a>
        </nav>
      </div></header>
      <main id="inhalt" tabindex="-1"></main>
      <div class="timerleiste" id="timerleiste" aria-live="polite"></div>`;
    let warte;
    $('#suche').addEventListener('input', e => {
      clearTimeout(warte);
      const q = e.target.value.trim();
      warte = setTimeout(() => { location.hash = q ? '#/suche/' + encodeURIComponent(q) : '#/'; }, 250);
    });
    $('#suchform').addEventListener('submit', e => { e.preventDefault(); const q = $('#suche').value.trim(); if (q) location.hash = '#/suche/' + encodeURIComponent(q); });
    kopfZahlen();
  }

  /* ---------- Router ---------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const [pfad, abfrage] = h.split('?');
    const teile = pfad.split('/').map(decodeURIComponent);
    const q = new URLSearchParams(abfrage || '');
    const main = $('#inhalt');
    $$('.nav a').forEach(a => a.classList.toggle('aktiv', a.dataset.nav === (teile[0] || 'start')));
    if (teile[0] !== 'suche' && document.activeElement !== $('#suche')) $('#suche').value = '';
    stopVorlesen();
    document.body.classList.remove('ist-start');
    const ziel = teile[0] || '';
    let p;
    if (!ziel) p = seiteStart(main);
    else if (ziel === 'buch' || ziel === 'band') p = seiteBuch(main, teile[1]);
    else if (ziel === 'baukasten') p = seiteBaukasten(main);
    else if (ziel === 'heute') p = seiteHeute(main);
    else if (ziel === 'kueche') p = seiteListe(main, { art: 'kueche', id: teile[1] }, q);
    else if (ziel === 'gruppe') p = seiteListe(main, { art: 'gruppe', id: teile[1] }, q);
    else if (ziel === 'mahlzeit') p = seiteListe(main, { art: 'mahlzeit', id: teile[1] }, q);
    else if (ziel === 'suche') p = seiteListe(main, { art: 'suche', id: teile.slice(1).join('/') }, q);
    else if (ziel === 'rezept') p = seiteRezept(main, teile[1]);
    else if (ziel === 'koeche') p = seiteKoeche(main);
    else if (ziel === 'koch') p = seiteKoch(main, teile[1]);
    else if (ziel === 'favoriten') p = seiteListe(main, { art: 'favoriten' }, q);
    else if (ziel === 'einkauf') p = seiteEinkauf(main);
    else if (ziel === 'ki') p = PRIVAT ? seiteKI(main) : seiteBaukasten(main);
    else if (ziel === 'ansicht') { try { if (teile[1] === 'oeffentlich') localStorage.setItem('ansicht', 'oeffentlich'); else localStorage.removeItem('ansicht'); } catch (e) {} location.replace(location.pathname + '#/'); location.reload(); return; }
    else if (ziel === 'rundgang') { p = seiteStart(main); setTimeout(() => rundgang(0), 700); }
    else p = seiteStart(main);
    Promise.resolve(p).then(() => {
      if (KB._scrollZiel != null) { const y = KB._scrollZiel; KB._scrollZiel = null; setTimeout(() => window.scrollTo(0, y), 60); setTimeout(() => window.scrollTo(0, y), 600); }
      else if (!KB._scrollMerken) window.scrollTo(0, 0);
      KB._scrollMerken = false;
      merker.setz({ hash: location.hash || '#/', y: 0 });
      rundgangKnopf(!ziel || ziel === 'rundgang');
      document.title = (main.dataset.titel ? main.dataset.titel + ' – ' : '') + 'Was isst die Welt?';
    });
  }

  /* ---------- Rundgang: dezenter Begleiter für Besucher (z. B. über den Link auf der Firmen-Webseite) ---------- */
  const RUNDGANG = [
    ['.legenden', 'Willkommen!', PRIVAT ? 'Das ist „Was isst die Welt?“ – das Weltkochbuch von Thomas Willwacher. Ganz oben steht Paul Bocuse, der Koch des Jahrhunderts. Tipp ihn an, dann öffnen sich seine Spezialrezepte.' : 'Das ist „Was isst die Welt?“ – das Weltkochbuch von Thomas Willwacher. Ganz oben steht der Meisterkoch Frankreichs. Tipp ihn an, dann öffnen sich seine Spezialrezepte.'],
    ['.start-kopf2', 'Suchen & planen', 'Hier findest du jedes Gericht nach Name, Zutat, Land oder Koch. Der Menü-Baukasten stellt dir ein ganzes Menü zusammen – mit Seitenangaben und fertiger Einkaufsliste.'],
    ['section[aria-labelledby="k-sonder"]', 'Die Sonderbände', 'Quer durch alle Küchen: Suppen & Eintöpfe, Backbuch, Desserts, Frühstück, Grillen, Street Food und Festtagsküche.'],
    ['section[aria-labelledby="k-europa"] .leiste, section[aria-labelledby="k-europa"] .reihen-breit .reihe', 'Jedes Land ein eigenes Buch', 'Alle Länder der Welt stehen nach Kontinenten im Regal. Tipp ein Buch an – es schlägt sich auf, mit Inhaltsverzeichnis, Kapiteln und Seitenzahlen.'],
    ['.buehne', 'Die Sterneköche jedes Kontinents', PRIVAT ? 'Bei jedem Kontinent wartet sein Star-Koch. Ein Tipp auf die Figur oder den gelben Knopf zeigt alle seine Spezialrezepte, schön nach Gängen sortiert.' : 'Bei jedem Kontinent wartet ein Sternekoch. Die Figuren sind frei erfunden – echte Personen zeigen wir aus rechtlichen Gründen nicht. Dahinter stecken Spezialrezepte nach Art weltberühmter Sterneköche, für die Heimküche nachgekocht. Bei jedem Rezept steht, wessen Küche das Vorbild ist.'],
    ['#heute-knopf', 'Was kochen wir heute?', 'Keine Idee? Hier gibt es jeden Tag neue Vorschläge – schnell, leicht, deftig oder einmal um die Welt. Jedes Rezept erklärt dir jeden Handgriff, mit Kochmodus, Zeitmessern und auf Wunsch sogar mit Sprachsteuerung. Guten Appetit!'],
  ];
  const sichtbar = sel => $$(sel).find(e => e.offsetParent !== null && e.getBoundingClientRect().height > 0);
  function rundgangEnde() { $$('.rg-blase, .rg-fokus').forEach(e => e.remove()); try { localStorage.setItem('rundgang_gesehen', '1'); } catch (e) {} }
  function rundgang(i) {
    $$('.rg-blase, .rg-fokus, .rg-tipp').forEach(e => e.remove());
    if (i >= RUNDGANG.length) return rundgangEnde();
    const [sel, titel, text] = RUNDGANG[i], ziel = sichtbar(sel);
    if (!ziel) return rundgang(i + 1);
    ziel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const fokus = document.createElement('div'); fokus.className = 'rg-fokus'; document.body.appendChild(fokus);
    const b = document.createElement('div'); b.className = 'rg-blase'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Rundgang');
    b.innerHTML = `<div class="rg-kopf"><b>${esc(titel)}</b><span>${i + 1} / ${RUNDGANG.length}</span></div><p>${esc(text)}</p>
      <div class="rg-knoepfe"><button class="rg-aus" type="button">Beenden</button>${i ? '<button class="rg-zurueck" type="button">Zurück</button>' : ''}<button class="rg-weiter" type="button">${i === RUNDGANG.length - 1 ? 'Los geht’s!' : 'Weiter ›'}</button></div>`;
    document.body.appendChild(b);
    const setze = () => { const r = ziel.getBoundingClientRect(); Object.assign(fokus.style, { top: r.top + scrollY - 8 + 'px', left: r.left + scrollX - 8 + 'px', width: r.width + 16 + 'px', height: r.height + 16 + 'px' }); };
    setze(); setTimeout(setze, 600);
    $('.rg-weiter', b).onclick = () => rundgang(i + 1);
    $('.rg-aus', b).onclick = rundgangEnde;
    const z = $('.rg-zurueck', b); if (z) z.onclick = () => rundgang(i - 1);
    $('.rg-weiter', b).focus({ preventScroll: true });
  }
  function rundgangKnopf(an) {
    $$('.rg-knopf, .rg-tipp').forEach(e => e.remove());
    if (!an) { $$('.rg-blase, .rg-fokus').forEach(e => e.remove()); return; }
    const k = document.createElement('button'); k.className = 'rg-knopf'; k.type = 'button'; k.title = 'Kleiner Rundgang durchs Kochbuch';
    k.setAttribute('aria-label', 'Kleiner Rundgang durchs Kochbuch'); k.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>';
    k.onclick = () => rundgang(0); document.body.appendChild(k);
    let gesehen = false; try { gesehen = !!localStorage.getItem('rundgang_gesehen'); } catch (e) {}
    if (!gesehen && !location.hash.includes('rundgang')) setTimeout(() => {
      if (!document.body.classList.contains('ist-start') || $('.rg-blase')) return;
      const t = document.createElement('button'); t.className = 'rg-tipp'; t.type = 'button'; t.textContent = 'Neu hier? Kleiner Rundgang ›';
      t.onclick = () => rundgang(0); document.body.appendChild(t);
      setTimeout(() => t.classList.add('weg'), 9000); setTimeout(() => t.remove(), 9800);
    }, 2500);
  }

  function karteKlein(r) {
    const k = kuecheVon(r.k);
    return `<a class="karte-klein" href="#/rezept/${r.id}"><span class="bild">${KB.titelbild({ id: r.id, name: r.n, bild: r.bi, farben: r.fa }, k.f[0])}</span>
      <span><b>${esc(r.n)}</b><span>${esc(k.kurz)} · ${zeitText(r.z)}</span></span></a>`;
  }

  /* ---------- Listen ---------- */
  function seiteListe(main, kontext, q) {
    let titel, text = '', muster = null, f = null, basis;
    if (kontext.art === 'kueche') {
      const k = kuecheVon(kontext.id); titel = k.name; muster = k.muster; f = k.f;
      basis = KB.INDEX.filter(r => r.k === kontext.id);
      const ko = new Set(); basis.forEach(r => (r.ko || []).forEach(n => ko.add(n)));
      text = `${basis.length} Gerichte, sortiert von den bekanntesten zu den Geheimtipps.` + (ko.size ? ` Mit Bezügen zu ${ko.size} Köchen.` : '');
    } else if (kontext.art === 'gruppe') {
      const g = KB.GRUPPEN.find(x => x.id === kontext.id) || KB.GRUPPEN[0];
      titel = 'Alle Gerichte aus ' + g.name;
      const ids = KB.KUECHEN.filter(k => k.gruppe === g.id).map(k => k.id);
      basis = KB.INDEX.filter(r => ids.includes(r.k));
      text = basis.length + ' Gerichte aus ' + ids.length + ' Landesküchen.';
      const k1 = KB.KUECHEN.find(k => k.gruppe === g.id); muster = k1.muster; f = k1.f;
    } else if (kontext.art === 'mahlzeit') {
      const m = KB.SONDER_ID[kontext.id] || KB.SONDER_ID.desserts;
      titel = m.kurz; text = m.intro; basis = KB.INDEX.filter(m.test);
    } else if (kontext.art === 'suche') {
      const w = norm(kontext.id).split(/\s+/).filter(Boolean);
      basis = w.length ? KB.INDEX.filter(r => w.every(x => r._s.includes(x))) : KB.INDEX.slice();
      titel = w.length ? `Suche: „${kontext.id}“` : 'Alle Rezepte';
      text = w.length ? 'Gefunden in Namen, Zutaten, Regionen und Köchen.' : '';
      if (document.activeElement !== $('#suche')) $('#suche').value = kontext.id;
    } else if (kontext.art === 'favoriten') {
      titel = 'Deine Favoriten'; const l = fav.liste(); basis = l.map(id => IDX[id]).filter(Boolean);
      text = basis.length ? 'Gemerkt mit dem Herz auf der Rezeptseite.' : '';
    }
    main.dataset.titel = titel;

    const hk = q.get('hk') || '', fs = q.get('fs') || '', fi = q.get('fi') || '', g = q.get('g') || '', kq = q.get('k') || '';
    const sort = q.get('s') || (kontext.art === 'favoriten' ? 'eigen' : 'beliebt');
    const filter = basis.filter(r => (!hk || r.h === hk) && (!fs || r.fs === fs) && (!fi || r.fi === fi) && (!g || r.g === g) && (!kq || r.k === kq));
    const sortiert = filter.slice();
    if (sort === 'beliebt') sortiert.sort((a, b) => b.b - a.b || a.n.localeCompare(b.n, 'de'));
    else if (sort === 'zeit') sortiert.sort((a, b) => a.z - b.z);
    else if (sort === 'leicht') sortiert.sort((a, b) => a.sw - b.sw || b.b - a.b);
    else if (sort === 'az') sortiert.sort((a, b) => a.n.localeCompare(b.n, 'de'));

    const zaehl = (feld, menge) => { const c = {}; menge.forEach(r => { if (r[feld]) c[r[feld]] = (c[r[feld]] || 0) + 1; }); return c; };
    const link = aend => {
      const p = new URLSearchParams(q.toString());
      Object.entries(aend).forEach(([k, v]) => v ? p.set(k, v) : p.delete(k));
      const s = p.toString(); return '#' + location.hash.replace(/^#/, '').split('?')[0] + (s ? '?' + s : '');
    };
    const hkZ = zaehl('h', basis);
    const nachHk = basis.filter(r => !hk || r.h === hk);
    const fsZ = zaehl('fs', nachHk), fiZ = zaehl('fi', nachHk);
    const gZ = zaehl('g', nachHk.filter(r => (!fs || r.fs === fs) && (!fi || r.fi === fi)));
    const kZ = zaehl('k', basis);
    const chip = (an, href, txt, n, farbe) => `<a class="chip${an ? ' an' : ''}" href="${href}" ${an ? 'aria-current="true"' : ''}>${farbe ? `<span class="punkt" style="background:${farbe}"></span>` : ''}${txt}${n != null ? ` <i>${n}</i>` : ''}</a>`;

    const zeigeKueche = kontext.art !== 'kueche' && Object.keys(kZ).length > 1;
    let filterHtml = `<div class="filter no-print">
      <div class="filter-zeile" role="group" aria-label="Kategorie"><span class="titel">Kategorie</span>
        ${chip(!hk, link({ hk: '', fs: '', fi: '', g: '' }), 'Alle', basis.length)}
        ${KB.HAUPT.filter(h => hkZ[h.id]).map(h => chip(hk === h.id, link({ hk: hk === h.id ? '' : h.id, fs: '', fi: '', g: '' }), h.name, hkZ[h.id], h.farbe)).join('')}
      </div>`;
    if (hk === 'fleisch' && Object.keys(fsZ).length) filterHtml += `<div class="filter-zeile" role="group" aria-label="Fleischsorte"><span class="titel">Fleischsorte</span>
        ${chip(!fs, link({ fs: '' }), 'Alle Sorten')}${Object.keys(KB.FLEISCH).filter(x => fsZ[x]).map(x => chip(fs === x, link({ fs: fs === x ? '' : x }), KB.FLEISCH[x], fsZ[x])).join('')}</div>`;
    if (hk === 'fisch' && Object.keys(fiZ).length) filterHtml += `<div class="filter-zeile" role="group" aria-label="Fischart"><span class="titel">Art</span>
        ${chip(!fi, link({ fi: '' }), 'Alle')}${Object.keys(KB.FISCH).filter(x => fiZ[x]).map(x => chip(fi === x, link({ fi: fi === x ? '' : x }), KB.FISCH[x], fiZ[x])).join('')}</div>`;
    if (Object.keys(gZ).length > 1) filterHtml += `<div class="filter-zeile" role="group" aria-label="Gang"><span class="titel">Gang</span>
        ${chip(!g, link({ g: '' }), 'Alle')}${Object.keys(KB.GANG).filter(x => gZ[x]).map(x => chip(g === x, link({ g: g === x ? '' : x }), KB.GANG[x], gZ[x])).join('')}</div>`;
    if (zeigeKueche) filterHtml += `<div class="filter-zeile" role="group" aria-label="Landesküche"><span class="titel">Landesküche</span>
        ${chip(!kq, link({ k: '' }), 'Alle')}${KB.KUECHEN.filter(k => kZ[k.id]).map(k => chip(kq === k.id, link({ k: kq === k.id ? '' : k.id }), k.kurz, kZ[k.id], k.f[1])).join('')}</div>`;
    filterHtml += `<div class="filter-zeile"><label class="sortierung">Sortieren nach
        <select id="sortwahl">
          ${kontext.art === 'favoriten' ? `<option value="eigen"${sort === 'eigen' ? ' selected' : ''}>zuletzt gemerkt</option>` : ''}
          <option value="beliebt"${sort === 'beliebt' ? ' selected' : ''}>Bekanntheit</option>
          <option value="zeit"${sort === 'zeit' ? ' selected' : ''}>Gesamtzeit</option>
          <option value="leicht"${sort === 'leicht' ? ' selected' : ''}>Schwierigkeit</option>
          <option value="az"${sort === 'az' ? ' selected' : ''}>Name A–Z</option>
        </select></label></div></div>`;

    const band = muster
      ? `<div class="band"><div class="band-muster" aria-hidden="true">${Array.from({ length: 16 }, (_, i) => KB.fliese(muster, f, 'b' + i)).join('')}</div>
          <div class="band-text"><h1>${esc(titel)}</h1>${text ? `<p>${esc(text)}</p>` : ''}</div></div>`
      : `<div class="band"><div class="band-text"><h1>${esc(titel)}</h1>${text ? `<p>${esc(text)}</p>` : ''}</div></div>`;

    const leer = kontext.art === 'favoriten' && !basis.length
      ? `<div class="leer-hinweis">Noch keine Favoriten. Öffne ein Rezept und tippe auf <b>Merken</b> – dann steht es hier.</div>`
      : `<div class="leer-hinweis">Keine Rezepte zu dieser Auswahl. Nimm einen Filter heraus oder versuch einen anderen Suchbegriff.</div>`;

    main.innerHTML = `<a class="zurueck no-print" href="#/">${I.pfeilL} Startseite</a>${band}${basis.length ? filterHtml : ''}
      ${sortiert.length ? `<p class="treffer-info">${sortiert.length} ${sortiert.length === 1 ? 'Rezept' : 'Rezepte'}</p>
      <div class="liste">${sortiert.map((r, i) => zeile(r, sort === 'beliebt' ? i + 1 : null, kontext.art !== 'kueche')).join('')}</div>` : leer}`;
    const sw = $('#sortwahl');
    if (sw) sw.addEventListener('change', e => { location.hash = link({ s: e.target.value === 'beliebt' && kontext.art !== 'favoriten' ? '' : e.target.value }); });
  }

  function zeile(r, rang, mitKueche) {
    const k = kuecheVon(r.k);
    const kat = KB.HAUPT.find(h => h.id === r.h) || { name: r.h, farbe: '#888' };
    const sorte = r.fs ? KB.FLEISCH[r.fs] : (r.fi ? KB.FISCH[r.fi] : '');
    return `<a class="zeile" href="#/rezept/${r.id}">
      <span class="rang" aria-hidden="true">${rang || ''}</span>
      <span class="bild">${KB.titelbild({ id: r.id, name: r.n, bild: r.bi, farben: r.fa }, k.f[0])}</span>
      <span>
        <h3>${esc(r.n)}${r.o && r.o !== r.n ? ` <span class="orig">${esc(r.o)}</span>` : ''}</h3>
        <span class="kurz">${esc(r.ku)}</span>
        <span class="merkmale">
          <span class="marke-kat" style="--f:${kat.farbe}">${esc(kat.name)}${sorte && r.h !== 'fisch' ? ': ' + esc(sorte) : (sorte && r.fi !== 'gemischt' ? ': ' + esc(sorte) : '')}</span>
          <span>${esc(KB.GANG[r.g] || r.g)}</span>
          ${mitKueche ? `<span>${esc(k.kurz)}${r.r ? ', ' + esc(r.r) : ''}</span>` : (r.r ? `<span>${esc(r.r)}</span>` : '')}
          <span>${I.uhr}${zeitText(r.z)}</span>
          <span>${I.stufe}${KB.SCHWIERIG[r.sw]}</span>
          ${(r.ko || []).length ? `<span class="koch-marke">${I.koch}${esc(r.ko.slice(0, 2).join(', '))}${r.ko.length > 2 ? ' …' : ''}</span>` : ''}
        </span>
      </span>
      <span class="beliebt"><b>${KB.BEKANNT(r.b)}</b><span class="balken" title="Bekanntheit ${r.b} von 100"><span style="width:${r.b}%"></span></span></span>
    </a>`;
  }

  /* ---------- Rezept ---------- */
  async function seiteRezept(main, id) {
    const ix = IDX[id];
    if (!ix) { main.innerHTML = `<div class="leer-hinweis">Dieses Rezept gibt es nicht (mehr). <a href="#/">Zur Startseite</a></div>`; return; }
    main.innerHTML = `<div class="leer-hinweis">Rezept wird geladen …</div>`;
    try { await ladeKueche(ix.k); } catch (e) { main.innerHTML = `<div class="leer-hinweis">${esc(e.message)}</div>`; return; }
    const r = KB.REZ[id];
    if (!r) { main.innerHTML = `<div class="leer-hinweis">Rezeptdaten fehlen.</div>`; return; }
    main.dataset.titel = r.name;
    const k = kuecheVon(r.kueche);
    const kat = KB.HAUPT.find(h => h.id === r.hauptkategorie) || { name: '' };
    const sorte = r.fleischsorte ? KB.FLEISCH[r.fleischsorte] : (r.fischsorte ? KB.FISCH[r.fischsorte] : '');
    let portionen = speicher.hol('portionen_' + id, r.portionen);
    const z = r.zeit || {};

    const koeche = (r.koeche || []).map(kc => {
      const kid = kochIdVonName(kc.name);
      return `<div class="koch-eintrag"><span class="monogramm" aria-hidden="true">${monogramm(kc.name)}</span>
        <div><b>${kid ? `<a href="#/koch/${kid}">${esc(kc.name)}</a>` : esc(kc.name)}</b><p>${esc(kc.bezug)}</p>
        ${kc.quelle ? `<a class="quellen" href="${esc(kc.quelle)}" target="_blank" rel="noopener">Quelle ansehen</a>` : ''}</div></div>`;
    }).join('');

    main.innerHTML = `
      <a class="zurueck no-print" href="#/buch/${r.kueche}">${I.pfeilL} Buch ${esc(k.kurz)}</a>
      <article class="rezept">
        <aside class="rezept-seite">
          <div class="rezept-bild">${KB.titelbild(r, k.f[0])}</div>
          <div class="kachel eckdaten">
            <div><b>${zeitText(gesamtZeit(r))}</b><span>gesamt</span></div>
            <div><b>${zeitText((z.vorbereitung || 0) + (z.garen || 0))}</b><span>aktiv &amp; garen</span></div>
            <div><b>${KB.SCHWIERIG[r.schwierigkeit]}</b><span>Schwierigkeit</span></div>
          </div>
          <div class="knoepfe">
            <button class="knopf haupt" id="km-start">${I.play} Kochmodus starten</button>
            <button class="knopf sprachkochen" id="km-sprachstart">${I.mikro} Mit Sprache kochen</button>
            <button class="knopf fav${fav.hat(id) ? ' an' : ''}" id="fav">${fav.hat(id) ? I.herzVoll : I.herz} <span>${fav.hat(id) ? 'Gemerkt' : 'Merken'}</span></button>
            <button class="knopf" id="einkauf">${I.korb} Einkaufsliste</button>
          </div>
          <section class="kachel zutaten" aria-labelledby="h-zut">
            <div class="zutaten-kopf"><h2 id="h-zut">Zutaten</h2>
              <div class="portionen" aria-label="Portionen"><button id="p-minus" aria-label="Eine Portion weniger">−</button><span id="p-zahl" aria-live="polite"></span><button id="p-plus" aria-label="Eine Portion mehr">+</button></div>
            </div>
            <div id="zutatenliste"></div>
          </section>
          <button class="knopf no-print" id="drucken">${I.druck} Rezept drucken</button>
        </aside>
        <div class="rezept-haupt">
          <header class="kachel rezept-titel">
            ${IDX[id] ? `<a class="fundstelle oben" href="#/buch/${r.kueche}">${I.buch}${esc(fundstelleText(IDX[id]))}</a>` : ''}
            <div class="ort"><a href="#/buch/${r.kueche}">${esc(k.name)}</a>${(() => { const ln = LAENDER_IN[r.kueche] ? landVon({ k: r.kueche, r: r.region }).name : ''; return (ln ? `<b class="ort-land">${esc(ln)}</b>` : '') + (r.region && r.region !== ln ? `<span>${esc(r.region)}</span>` : ''); })()}
              <span>${esc(kat.name)}${sorte ? ': ' + esc(sorte) : ''}</span>${r.vegetarisch_moeglich && ['fleisch', 'fisch'].includes(r.hauptkategorie) ? '<span style="color:var(--gruen);font-weight:600">auch vegetarisch möglich</span>' : ''}<span>${esc(KB.GANG[r.gang] || '')}</span><span>${KB.BEKANNT(r.beliebtheit)}</span></div>
            <h1>${esc(r.name)}</h1>${r.originalname && r.originalname !== r.name ? `<div class="orig">${esc(r.originalname)}</div>` : ''}
            <p class="kurz">${esc(r.kurz)}</p>
          </header>
          <section class="kachel abschnitt"><h2>Herkunft &amp; Hintergrund</h2><p>${esc(r.hintergrund)}</p>
            ${koeche ? `<div class="koch-box">${koeche}</div>` : ''}
            ${(r.ausruestung || []).length ? `<h2 style="margin-top:18px;font-size:18px">Das brauchst du</h2><div class="ausruestung">${r.ausruestung.map(a => `<span>${esc(a)}</span>`).join('')}</div>` : ''}
          </section>
          <section class="kachel abschnitt" aria-labelledby="h-sch"><h2 id="h-sch">Zubereitung in ${r.schritte.length} Schritten</h2>
            <ol class="schritte" style="list-style:none;padding:0;margin:0">${r.schritte.map((s, i) => `
              <li class="schritt" id="schritt-${i + 1}">
                <div class="schritt-bild">${KB.schrittbild(s.aktion, r.farben, r.id + i)}</div>
                <div><div class="schritt-kopf"><span class="schritt-nr">${i + 1}</span><h3>${esc(s.titel)}</h3></div>
                  <p class="lesetext">${esc(s.text)}</p>
                  ${s.tipp ? `<div class="tipp"><b>Kniff:</b> ${esc(s.tipp)}</div>` : ''}
                  ${s.dauer ? `<button class="timer-knopf" data-dauer="${s.dauer}" data-was="${esc(s.titel)}">${I.uhr} Timer ${zeitText(s.dauer)}</button>` : ''}
                </div></li>`).join('')}</ol>
          </section>
          ${(r.profitipps || []).length ? `<section class="kachel abschnitt"><h2>Tipps der Profis</h2><ul class="aufzaehlung">${r.profitipps.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}
          <div class="zweispaltig">
            ${(r.varianten || []).length ? `<section class="kachel abschnitt"><h2>Varianten</h2><ul class="aufzaehlung">${r.varianten.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}
            ${((r.beilagen || []).length || r.getraenk) ? `<section class="kachel abschnitt"><h2>Dazu passt</h2>
              ${(r.beilagen || []).length ? `<ul class="aufzaehlung">${r.beilagen.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
              ${r.getraenk ? `<p><b>Im Glas:</b> ${esc(r.getraenk)}</p>` : ''}</section>` : ''}
          </div>
          ${(r.quellen || []).length ? `<section class="kachel abschnitt quellen"><h2 style="font-size:18px">Recherche-Quellen</h2>
            <ul class="aufzaehlung" style="font-family:var(--ui);font-size:14.5px">${r.quellen.map(q => `<li><a href="${esc(q.url)}" target="_blank" rel="noopener">${esc(q.titel || q.url)}</a></li>`).join('')}</ul>
            <p class="quellen-hinweis">Die Anleitung ist eigenständig für dieses Kochbuch geschrieben; die Quellen zeigen, wo die Hintergründe und Techniken recherchiert wurden.</p></section>` : ''}
        </div>
      </article>`;

    const zeichneZutaten = () => {
      const f = portionen / r.portionen;
      $('#p-zahl').textContent = portionen + (portionen === 1 ? ' Portion' : ' Portionen');
      const erledigt = speicher.hol('haken_' + id, []);
      $('#zutatenliste').innerHTML = r.zutaten.map((g, gi) => `<div class="zgruppe">${g.gruppe ? `<h3>${esc(g.gruppe)}</h3>` : ''}
        ${g.liste.map((zt, zi) => { const key = gi + '-' + zi, an = erledigt.includes(key); return `<label class="zut${an ? ' erledigt' : ''}"><input type="checkbox" data-k="${key}"${an ? ' checked' : ''}>
          <span class="menge">${zt.menge != null ? mengeText(zt.menge * f, zt.einheit) : ''}</span>
          <span class="name">${esc(zt.name)}${zt.hinweis ? `<span class="hinweis">${esc(zt.hinweis)}</span>` : ''}</span></label>`; }).join('')}</div>`).join('');
    };
    zeichneZutaten();
    $('#zutatenliste').addEventListener('change', e => {
      const k = e.target.dataset.k; if (!k) return;
      let l = speicher.hol('haken_' + id, []); l = e.target.checked ? [...l, k] : l.filter(x => x !== k);
      speicher.setz('haken_' + id, l); e.target.closest('.zut').classList.toggle('erledigt', e.target.checked);
    });
    $('#p-minus').onclick = () => { if (portionen > 1) { portionen--; speicher.setz('portionen_' + id, portionen); zeichneZutaten(); } };
    $('#p-plus').onclick = () => { if (portionen < 60) { portionen++; speicher.setz('portionen_' + id, portionen); zeichneZutaten(); } };
    $('#fav').onclick = () => { const an = fav.umschalten(id); const b = $('#fav'); b.classList.toggle('an', an); b.innerHTML = (an ? I.herzVoll : I.herz) + ` <span>${an ? 'Gemerkt' : 'Merken'}</span>`; };
    $('#einkauf').onclick = () => { einkauf.hinzu(r, portionen); meldung('Zutaten für ' + portionen + ' Portionen auf der Einkaufsliste'); };
    $('#drucken').onclick = () => window.print();
    $('#km-start').onclick = () => kochmodus(r, () => portionen, false);
    if (KB._kmWieder && KB._kmWieder.id === r.id) { const st = KB._kmWieder.schritt; KB._kmWieder = null; setTimeout(() => kochmodus(r, () => portionen, false, st), 300); }
    $('#km-sprachstart').onclick = () => kochmodus(r, () => portionen, true);
    $$('.timer-knopf', main).forEach(b => b.onclick = () => timer.start(+b.dataset.dauer * 60, r.name + ': ' + b.dataset.was));
  }

  /* ---------- Lautstärke & Vorlesen ---------- */
  const ton = {
    lautstaerke() { return speicher.hol('lautstaerke', 0.8); },
    setz(v) { speicher.setz('lautstaerke', Math.max(0.1, Math.min(1, v))); }
  };
  KB.sprecher.lautstaerke = () => ton.lautstaerke();
  function stopVorlesen() { KB.sprecher.stopp(); }

  /* ---------- Kochmodus (Lesen) und Sprachkochen (Vorlesen + Sprachbefehle) ---------- */
  let wachHalten = null;
  const KOMMANDO_TEXT = { stopp: 'Stopp', weiter: 'Weiter', naechster: 'Nächster Schritt', zurueck: 'Zurück', nochmal: 'Nochmal', zutaten: 'Zutaten', timer: 'Timer', lauter: 'Lauter', leiser: 'Leiser', beenden: 'Beenden' };
  async function kochmodus(r, portionenFn, mitSprache, startSchritt = 0) {
    let i = Math.max(0, Math.min(startSchritt, r.schritte.length - 1)), sprache = false, letztesSprechEnde = 0, ersterHinweis = true;
    const n = r.schritte.length;
    const f = portionenFn() / r.portionen;
    const el = document.createElement('div');
    el.className = 'kochmodus'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Kochmodus ' + r.name);
    el.innerHTML = `
      <div><div class="km-kopf">
        <button class="rund" id="km-zu" aria-label="Kochmodus beenden">${I.zu}</button>
        <div class="titel">${esc(r.name)}</div>
        <button class="knopf km-sprachknopf" id="km-sprache" aria-pressed="false">${I.mikro} <span>Mit Sprache kochen</span></button>
        <button class="knopf" id="km-zut">${I.liste} <span class="txt-z">Zutaten</span></button>
      </div><div class="km-fortschritt"><span id="km-fs"></span></div>
      <div class="km-sprachleiste" id="km-sl" hidden>
        <span class="km-ohr" id="km-ohr" aria-hidden="true"></span>
        <span id="km-status" aria-live="polite">Sprachmodus startet …</span>
        <span class="km-befehle">Sag: <b>Stopp</b> · <b>Weiter</b> · <b>Nochmal</b> · <b>Nächster Schritt</b> · <b>Zurück</b> · <b>Zutaten</b> · <b>Timer</b> · <b>Lauter</b> · <b>Leiser</b></span>
      </div></div>
      <div class="km-inhalt" id="km-inhalt"></div>
      <div class="km-fuss">
        <button class="knopf" id="km-zurueck">${I.pfeilL} <span>Zurück</span></button>
        <div class="ton" id="km-ton" hidden role="group" aria-label="Vorlesen steuern">
          <button class="knopf" id="km-pause">${I.pause} <span>Stopp</span></button>
          <button class="knopf" id="km-nochmal">${I.nochmal} <span>Nochmal</span></button>
          <button class="rund" id="km-leiser" aria-label="Leiser">${I.minus}</button>
          <input type="range" id="km-laut" min="10" max="100" step="5" value="${Math.round(ton.lautstaerke() * 100)}" aria-label="Lautstärke">
          <button class="rund" id="km-lauter" aria-label="Lauter">${I.plus}</button>
        </div>
        <button class="knopf weiter" id="km-weiter">Weiter ${I.pfeilR}</button>
      </div>
      <aside class="km-zutaten" id="km-zl" aria-label="Zutaten"></aside>`;
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    try { if ('wakeLock' in navigator) wachHalten = await navigator.wakeLock.request('screen'); } catch (e) {}
    const q = s => el.querySelector(s);

    const zutatenListe = () => r.zutaten.flatMap(g => g.liste);
    q('#km-zl').innerHTML = `<div class="zutaten-kopf"><h2>Zutaten für ${portionenFn()} Portionen</h2><button class="rund" id="km-zl-zu" aria-label="Zutaten schließen">${I.zu}</button></div>` +
      r.zutaten.map(g => `<div class="zgruppe">${g.gruppe ? `<h3>${esc(g.gruppe)}</h3>` : ''}${g.liste.map(zt => `<div class="zut" style="grid-template-columns:92px 1fr"><span class="menge">${zt.menge != null ? mengeText(zt.menge * f, zt.einheit) : ''}</span><span>${esc(zt.name)}</span></div>`).join('')}</div>`).join('');

    const status = t => { const s = q('#km-status'); if (s) s.textContent = t; };
    const schrittText = k => { const s = r.schritte[k]; return `Schritt ${k + 1} von ${n}. ${s.titel}. ${s.text}${s.tipp ? ' Kniff: ' + s.tipp : ''}`; };
    const sprechbar = t => t.replace(/(\d+)\s*°C/g, '$1 Grad').replace(/(\d+)\s*-\s*(\d+)/g, '$1 bis $2').replace(/\bca\.\s/g, 'circa ').replace(/\bz\. ?B\./g, 'zum Beispiel').replace(/\bEL\b/g, 'Esslöffel').replace(/\bTL\b/g, 'Teelöffel').replace(/\bMin\./g, 'Minuten').replace(/\bStd\./g, 'Stunden').replace(/½/g, 'ein halb').replace(/¼/g, 'ein viertel').replace(/¾/g, 'drei viertel');
    function lies(k) {
      KB.sprecher.sprich(sprechbar(schrittText(k)), () => {
        letztesSprechEnde = Date.now();
        if (ersterHinweis) { ersterHinweis = false; KB.sprecher.kurz('Sag Weiter, wenn du so weit bist.'); }
        status(k < n - 1 ? 'Fertig vorgelesen – sag „Weiter“ für den nächsten Schritt oder „Nochmal“.' : 'Das war der letzte Schritt – guten Appetit!');
      });
    }
    KB.sprecher.onZustand = z => {
      const b = q('#km-pause'); if (!b) return;
      b.innerHTML = z === 'pause' ? `${I.play} <span>Weiter</span>` : `${I.pause} <span>Stopp</span>`;
      if (z === 'spricht') status('Ich lese vor … sag „Stopp“, um anzuhalten.');
      if (z === 'pause') status('Angehalten – sag „Weiter“ oder „Nochmal“.');
      KB.medientasten.status(z === 'spricht');
    };

    function zeige(vorlesen = true) {
      const s = r.schritte[i];
      merker.setz({ km: { id: r.id, schritt: i } });
      q('#km-fs').style.width = ((i + 1) / n * 100) + '%';
      q('#km-inhalt').innerHTML = `<div class="km-schritt">
        <div class="km-bild">${KB.schrittbild(s.aktion, r.farben, r.id + i)}</div>
        <div><div class="km-zahl">Schritt ${i + 1} von ${n}</div><h2>${esc(s.titel)}</h2>
          <p class="km-text">${esc(s.text)}</p>
          ${s.tipp ? `<div class="tipp"><b>Kniff:</b> ${esc(s.tipp)}</div>` : ''}
          ${s.dauer ? `<button class="timer-knopf" id="km-timer">${I.uhr} Timer ${zeitText(s.dauer)} starten</button>` : ''}
        </div></div>`;
      q('#km-inhalt').scrollTop = 0;
      q('#km-zurueck').style.visibility = i ? 'visible' : 'hidden';
      q('#km-weiter').innerHTML = i < n - 1 ? `Weiter ${I.pfeilR}` : 'Fertig – Guten Appetit';
      const t = q('#km-timer'); if (t) t.onclick = () => timerStarten();
      if (sprache && vorlesen) lies(i);
    }
    function timerStarten() {
      const s = r.schritte[i];
      if (!s.dauer) { if (sprache) KB.sprecher.kurz('Für diesen Schritt gibt es keinen Timer.'); return; }
      timer.start(s.dauer * 60, r.name + ': ' + s.titel);
      if (sprache) KB.sprecher.kurz('Timer für ' + zeitText(s.dauer).replace('Min.', 'Minuten').replace('Std.', 'Stunden') + ' läuft.');
    }
    function schliessen() {
      merker.setz({ km: null });
      spracheAus(); el.remove(); document.body.style.overflow = '';
      document.removeEventListener('keydown', taste);
      KB.sprecher.onZustand = null; KB._timerHinweis = null;
      if (wachHalten) { wachHalten.release().catch(() => {}); wachHalten = null; }
    }
    const weiter = () => { if (i < n - 1) { i++; zeige(); } else { if (sprache) KB.sprecher.kurz('Guten Appetit!'); setTimeout(schliessen, sprache ? 1500 : 0); } };
    const zurueck = () => { if (i > 0) { i--; zeige(); } else if (sprache) lies(i); };

    /* Sprachbefehle (auch Kopfhörer-Tasten) */
    function kommando(k, gehoert) {
      // Echo-Schutz: kurz nach dem Vorlesen und Satzteile aus dem eigenen Text ignorieren
      if (gehoert && k !== 'stopp') {
        const g = norm(gehoert).trim();
        if (Date.now() - letztesSprechEnde < 1200 && KB.sprecher.zustand === 'fertig' && g.split(' ').length > 1) return;
        if (g.split(' ').length > 1 && norm(schrittText(i)).includes(g)) return;
      }
      if (KB.sprecher.zustand === 'spricht' && k === 'weiter') return; // läuft ja schon
      status('Verstanden: „' + KOMMANDO_TEXT[k] + '“');
      const o = q('#km-ohr'); if (o) { o.classList.remove('blink'); void o.offsetWidth; o.classList.add('blink'); }
      if (k === 'stopp') { if (!KB.sprecher.pause()) KB.sprecher.stopp(); }
      else if (k === 'weiter') { if (!KB.sprecher.fortsetzen()) weiter(); }
      else if (k === 'naechster') weiter();
      else if (k === 'zurueck') zurueck();
      else if (k === 'nochmal') lies(i);
      else if (k === 'zutaten') {
        q('#km-zl').classList.add('offen');
        KB.sprecher.sprich('Du brauchst: ' + sprechbar(zutatenListe().map(z => (z.menge != null ? mengeText(z.menge * f, z.einheit) + ' ' : '') + z.name).join(', ')) + '.', () => { letztesSprechEnde = Date.now(); status('Zutaten vorgelesen – sag „Nochmal“ für den Schritt oder „Weiter“.'); });
      }
      else if (k === 'timer') timerStarten();
      else if (k === 'lauter' || k === 'leiser') { setzLaut(+q('#km-laut').value + (k === 'lauter' ? 20 : -20)); KB.sprecher.kurz(k === 'lauter' ? 'Lauter' : 'Leiser'); }
      else if (k === 'beenden') schliessen();
    }

    function spracheAn() {
      if (!KB.sprecher.verfuegbar()) { meldung('Dieser Browser kann nicht vorlesen.'); return; }
      sprache = true;
      const b = q('#km-sprache'); b.classList.add('an'); b.setAttribute('aria-pressed', 'true'); b.querySelector('span').textContent = 'Sprache aus';
      q('#km-sl').hidden = false; q('#km-ton').hidden = false;
      KB.medientasten.an(r.name, k => kommando(k));
      KB._timerHinweis = was => KB.sprecher.kurz('Achtung, der Timer ist abgelaufen: ' + was);
      if (KB.hoerer.verfuegbar()) {
        KB.hoerer.onStatus = (st, fehler) => {
          const o = q('#km-ohr'); if (o) o.classList.toggle('hoert', st === 'hoert');
          if (st === 'verweigert') { status(fehler === 'audio-capture' ? 'Kein Mikrofon gefunden – Steuerung über die Knöpfe unten oder die Kopfhörertaste.' : 'Mikrofon nicht freigegeben – bitte im Browser erlauben (Schloss-Symbol neben der Adresse).'); }
        };
        KB.hoerer.onText = (t, fertig) => { const o = q('#km-gehoert'); if (o) o.textContent = t; };
        KB.hoerer.start(kommando);
      } else {
        status('Dieser Browser versteht keine Sprachbefehle (am besten Chrome oder Edge). Vorlesen und Kopfhörertaste funktionieren trotzdem.');
      }
      lies(i);
    }
    function spracheAus() {
      sprache = false; KB.hoerer.stop(); KB.sprecher.stopp(); KB.medientasten.aus(); KB._timerHinweis = null;
      const b = q('#km-sprache'); if (b) { b.classList.remove('an'); b.setAttribute('aria-pressed', 'false'); b.querySelector('span').textContent = 'Mit Sprache kochen'; }
      const sl = q('#km-sl'); if (sl) sl.hidden = true; const tn = q('#km-ton'); if (tn) tn.hidden = true;
    }

    function taste(e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); weiter(); }
      else if (e.key === 'ArrowLeft') zurueck();
      else if (e.key === ' ' && sprache) { e.preventDefault(); kommando(KB.sprecher.zustand === 'spricht' ? 'stopp' : 'weiter'); }
      else if (e.key === ' ') { e.preventDefault(); weiter(); }
      else if (e.key === 'Escape') schliessen();
    }
    document.addEventListener('keydown', taste);
    q('#km-zu').onclick = schliessen;
    q('#km-weiter').onclick = weiter;
    q('#km-zurueck').onclick = zurueck;
    q('#km-zut').onclick = () => q('#km-zl').classList.add('offen');
    q('#km-zl-zu').onclick = () => q('#km-zl').classList.remove('offen');
    q('#km-sprache').onclick = () => sprache ? spracheAus() : spracheAn();
    q('#km-pause').onclick = () => kommando(KB.sprecher.zustand === 'spricht' ? 'stopp' : (KB.sprecher.zustand === 'pause' ? 'weiter' : 'nochmal'));
    q('#km-nochmal').onclick = () => kommando('nochmal');
    const laut = q('#km-laut');
    const setzLaut = v => { ton.setz(v / 100); laut.value = Math.round(ton.lautstaerke() * 100); };
    laut.oninput = () => setzLaut(+laut.value);
    q('#km-leiser').onclick = () => setzLaut(+laut.value - 10);
    q('#km-lauter').onclick = () => setzLaut(+laut.value + 10);
    let tx = null;
    q('#km-inhalt').addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    q('#km-inhalt').addEventListener('touchend', e => { if (tx == null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 70) (d < 0 ? weiter : zurueck)(); tx = null; });
    zeige(false);
    if (mitSprache) spracheAn();
  }

  /* ---------- Timer ---------- */
  const timer = {
    liste: [],
    start(sek, was) {
      const t = { ende: Date.now() + sek * 1000, was, id: Math.random().toString(36).slice(2) };
      timer.liste.push(t); timer.zeichne();
      if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission().catch(() => {});
      if (!timer.lauf) timer.lauf = setInterval(timer.tick, 500);
      meldung('Timer gestartet: ' + zeitText(Math.round(sek / 60)));
    },
    tick() {
      const jetzt = Date.now();
      timer.liste.forEach(t => { if (!t.klingelt && t.ende <= jetzt) { t.klingelt = true; timer.alarm(t); } });
      timer.zeichne();
      if (!timer.liste.length) { clearInterval(timer.lauf); timer.lauf = null; }
    },
    alarm(t) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [0, .5, 1, 1.5, 2].forEach(s => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 880; g.gain.value = .25 * ton.lautstaerke() + .05; o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + s); o.stop(ctx.currentTime + s + .3); });
      } catch (e) {}
      if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400]);
      if (KB._timerHinweis) setTimeout(() => KB._timerHinweis(t.was), 2600);
      if ('Notification' in window && Notification.permission === 'granted') { try { new Notification('Timer abgelaufen', { body: t.was }); } catch (e) {} }
    },
    zeichne() {
      const box = $('#timerleiste'); if (!box) return;
      box.innerHTML = timer.liste.map(t => {
        const rest = Math.max(0, Math.round((t.ende - Date.now()) / 1000));
        const h = Math.floor(rest / 3600), m = Math.floor(rest % 3600 / 60), s = rest % 60;
        return `<div class="timer${t.klingelt ? ' klingelt' : ''}"><span class="zeit">${t.klingelt ? 'Fertig!' : (h ? h + ':' : '') + String(m).padStart(h ? 2 : 1, '0') + ':' + String(s).padStart(2, '0')}</span>
          <span class="was">${esc(t.was)}</span><button data-weg="${t.id}" aria-label="Timer beenden">${I.zu}</button></div>`;
      }).join('');
      $$('[data-weg]', box).forEach(b => b.onclick = () => { timer.liste = timer.liste.filter(t => t.id !== b.dataset.weg); timer.zeichne(); });
    }
  };

  /* ---------- Köche ---------- */
  function seiteKoeche(main) {
    main.dataset.titel = 'Köche';
    const liste = KB.KOECHE.slice().sort((a, b) => (b._rez.length - a._rez.length) || a.name.localeCompare(b.name, 'de'));
    const deutsch = liste.filter(k => (k.kueche || []).some(x => ['deutsch', 'oesterreich', 'schweiz'].includes(x)));
    const welt = liste.filter(k => !deutsch.includes(k));
    const karte = k => `<a class="koch-karte" href="#/koch/${k.id}"><span class="monogramm" aria-hidden="true">${monogramm(k.name)}</span>
      <span><b>${esc(k.name)}</b><span class="land">${esc(k.land || '')}</span><p>${esc(k.stil || k.kurzbio)}</p>
      ${k._rez.length ? `<div class="anzahl">${k._rez.length} ${k._rez.length === 1 ? 'Rezept' : 'Rezepte'} mit Bezug</div>` : ''}</span></a>`;
    main.innerHTML = `<a class="zurueck" href="#/">${I.pfeilL} Startseite</a>
      <div class="band"><div class="band-text"><h1>Die Köche</h1><p>Sterneköche, Fernsehköche und Kochbuchautoren, die die Gerichte in diesem Buch geprägt haben – mit ihren Rezeptbezügen.</p></div></div>
      <section class="gruppe"><div class="gruppe-kopf"><h2>Deutschland, Österreich &amp; Schweiz</h2></div><div class="koeche-raster">${deutsch.map(karte).join('')}</div></section>
      <section class="gruppe"><div class="gruppe-kopf"><h2>Internationale Köche</h2></div><div class="koeche-raster">${welt.map(karte).join('')}</div></section>`;
  }
  /* Spezialrezepte eines Kochs nach Gängen geordnet, innerhalb nach Bekanntheit */
  const GANG_REIHE = [['Vorspeisen, Salate & Snacks', ['vorspeise', 'salat', 'snack', 'fruehstueck', 'abendbrot']], ['Suppen & Eintöpfe', ['suppe', 'eintopf']],
    ['Hauptgerichte', ['hauptgericht']], ['Beilagen, Saucen & Brot', ['beilage', 'sauce', 'brot']], ['Desserts, Kuchen & Gebäck', ['dessert', 'kuchen', 'gebaeck']]];
  function kochGruppen(rez) {
    if (rez.length < 6) return `<div class="liste">${rez.map(r => zeile(r, null, true)).join('')}</div>`;
    const rest = rez.filter(r => !GANG_REIHE.some(([, g]) => g.includes(r.g)));
    return GANG_REIHE.map(([titel, g]) => [titel, rez.filter(r => g.includes(r.g))]).concat(rest.length ? [['Weitere Gerichte', rest]] : [])
      .filter(([, l]) => l.length).map(([titel, l]) => `<h3 class="koch-gang">${esc(titel)} <span>${l.length}</span></h3><div class="liste">${l.map(r => zeile(r, null, true)).join('')}</div>`).join('');
  }
  function seiteKoch(main, id) {
    const k = KB.KOCH[id];
    if (!k) { main.innerHTML = `<div class="leer-hinweis">Koch nicht gefunden. <a href="#/koeche">Alle Köche</a></div>`; return; }
    main.dataset.titel = k.name;
    const st = stern2(id), leg = st ? [id, st.bild, st.alt] : null, oeff = !PRIVAT && st;
    if (oeff) main.dataset.titel = st.titel;
    const einmal = arr => { const g = new Set(); return (arr || []).filter(x => { const t = String(x).toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim(); if (g.has(t)) return false; g.add(t); return true; }); };
    const bekannt = einmal(k.bekannt_fuer), buecher = einmal(k.buecher);
    const rez = k._rez.slice().sort((a, b) => b.b - a.b);
    main.innerHTML = `<a class="zurueck" href="${leg ? '#/' : '#/koeche'}">${I.pfeilL} ${leg ? 'Startseite' : 'Alle Köche'}</a>
      <div class="kachel abschnitt koch-kopf${leg ? ' mit-bild' : ''}">
        ${leg ? `<img class="koch-portrait" src="bilder/${leg[1]}.svg" alt="${esc(leg[2])}">` : `<span class="monogramm" style="width:96px;height:96px;font-size:34px" aria-hidden="true">${monogramm(k.name)}</span>`}
        <div><h1 style="font-family:var(--lese);font-size:34px;margin:0;line-height:1.15">${esc(oeff ? st.titel : k.name)}</h1>
          ${oeff ? `<p>Spezialrezepte nach Art eines der berühmtesten Köche aus ${esc(st.aus)} – als eigene Heimküchen-Fassungen nachgekocht und Schritt für Schritt erklärt. Bei jedem Rezept steht, wessen Küche das Vorbild ist, mit Quelle. Die Figur ist frei erfunden.</p>`
          : `<div style="color:var(--tinte-3)">${esc(k.land || '')}${k.stil ? ' · ' + esc(k.stil) : ''}</div>
          <p>${esc(k.kurzbio)}</p>`}
          ${rez.length ? `<a class="knopf-spezial" href="#koch-rezepte">${I.buch} ${rez.length} ${rez.length === 1 ? 'Spezialrezept' : 'Spezialrezepte'} ansehen</a>` : ''}
          ${!oeff && (bekannt.length || buecher.length || k.web) ? `<details class="koch-mehr"><summary>Mehr über ${esc(k.name)}</summary>
            ${bekannt.length ? `<p><b>Bekannt für:</b> ${bekannt.map(esc).join(', ')}</p>` : ''}
            ${buecher.length ? `<p><b>Bücher:</b> ${buecher.map(esc).join(' · ')}</p>` : ''}
            ${k.web ? `<p><a href="${esc(k.web)}" target="_blank" rel="noopener">Zur Webseite</a></p>` : ''}</details>` : ''}
        </div></div>
      ${rez.length ? `<h2 id="koch-rezepte" style="font-family:var(--lese);font-weight:600">${oeff ? 'Spezialrezepte' : `${leg ? 'Spezialrezepte von' : 'Rezepte mit Bezug zu'} ${esc(k.name)}`} <span style="color:var(--tinte-3);font-size:.7em">(${rez.length})</span></h2>${kochGruppen(rez)}`
        : `<div class="leer-hinweis">Zu diesem Koch steht noch kein Rezept im Buch.</div>`}`;
    const sp = $('.knopf-spezial', main);
    if (sp) sp.onclick = e => { e.preventDefault(); $('#koch-rezepte').scrollIntoView({ behavior: 'smooth' }); };
  }

  /* ---------- Einkaufsliste ---------- */
  function seiteEinkauf(main) {
    main.dataset.titel = 'Einkaufsliste';
    const l = einkauf.alle();
    main.innerHTML = `<a class="zurueck no-print" href="#/">${I.pfeilL} Startseite</a>
      <div class="band"><div class="band-text"><h1>Einkaufsliste</h1><p>${l.length ? 'Abhaken beim Einkaufen – die Liste bleibt auf diesem Gerät gespeichert.' : ''}</p></div></div>
      ${l.length ? `<div class="knoepfe no-print" style="grid-template-columns:repeat(3,max-content);margin-bottom:14px">
          <button class="knopf" id="ek-druck">${I.druck} Drucken</button><button class="knopf" id="ek-erledigt">Abgehakte entfernen</button><button class="knopf" id="ek-leer">Liste leeren</button></div>
        <div class="einkauf">${l.map((e, ei) => `<section class="kachel einkauf-gruppe"><h2>${e.menue ? esc(e.n) : `<a href="#/rezept/${e.id}">${esc(e.n)}</a>`}<span style="font-size:14px;color:var(--tinte-3);font-family:var(--ui)">${e.p} Portionen · <button class="chip" data-weg="${ei}">Entfernen</button></span></h2>
          ${e.menue ? `<p class="menue-rezepte">${e.rezepte.map(x => `<a href="#/rezept/${x.id}">${esc(x.n)}</a>`).join(' · ')}</p>` : ''}
          ${e.posten.map((p, pi) => `${p.abt && (pi === 0 || e.posten[pi - 1].abt !== p.abt) ? `<h3 class="abteilung">${esc(p.abt)}</h3>` : ''}<label class="zut${p.ok ? ' erledigt' : ''}" style="grid-template-columns:22px 1fr"><input type="checkbox" data-e="${ei}" data-p="${pi}"${p.ok ? ' checked' : ''}><span class="name">${esc(p.t)}${p.fuer ? `<span class="hinweis">für ${esc(p.fuer)}</span>` : ''}</span></label>`).join('')}</section>`).join('')}</div>`
        : `<div class="leer-hinweis">Die Einkaufsliste ist leer. Auf jeder Rezeptseite legt <b>Einkaufsliste</b> alle Zutaten für die gewählte Portionenzahl hier ab.</div>`}`;
    if (!l.length) return;
    main.addEventListener('change', e => {
      const t = e.target; if (t.dataset.e == null) return;
      const liste = einkauf.alle(); liste[t.dataset.e].posten[t.dataset.p].ok = t.checked; einkauf.setz(liste);
      t.closest('.zut').classList.toggle('erledigt', t.checked);
    });
    $$('[data-weg]', main).forEach(b => b.onclick = () => { const li = einkauf.alle(); li.splice(+b.dataset.weg, 1); einkauf.setz(li); route(); });
    $('#ek-druck').onclick = () => window.print();
    $('#ek-erledigt').onclick = () => { einkauf.setz(einkauf.alle().map(e => ({ ...e, posten: e.posten.filter(p => !p.ok) })).filter(e => e.posten.length)); route(); };
    $('#ek-leer').onclick = () => { if (confirm('Die ganze Einkaufsliste leeren?')) { einkauf.setz([]); route(); } };
  }

  /* ---------- KI-Menüplaner ---------- */
  const kiVerlauf = [];
  let kiLetzte = null;
  function seiteKI(main) {
    main.dataset.titel = 'KI-Menüplaner';
    const beispiele = ['Festliches Menü für 6 Personen, Hauptgang Rind, Dessert mit Schokolade',
      'Etwas Schnelles unter 30 Minuten mit Hähnchen', 'Italienischer Abend für 4, alles am Vortag vorzubereiten',
      'Eine Woche Abendessen, abwechslungsreich, zweimal vegetarisch', 'Sonntagsfrühstück für Gäste, gern international',
      'Thai-Menü, nicht zu scharf, für 2'];
    main.innerHTML = `<a class="zurueck" href="#/">${I.pfeilL} Startseite</a>
      <div class="band"><div class="band-text"><h1>KI-Menüplaner</h1>
        <p>Sag in ein, zwei Sätzen, was du vorhast – Anlass, Personen, Vorlieben, Zeit. Die KI stellt daraus ein Menü aus den ${KB.INDEX.length} Rezepten im Buch zusammen, mit Zeitplan für die Küche.</p></div></div>
      ${KB.ki.bereit() ? '' : `<div class="kachel abschnitt" id="ki-ohne" style="margin-bottom:14px;border-left:4px solid var(--safran)">
        <h2 style="font-size:19px">Google-KI noch nicht verbunden</h2>
        <p style="font-family:var(--ui);font-size:16px">Die KI läuft über dein Google-Konto mit dem Schlüssel aus der Master-App. Öffne die Master-App einmal in diesem Browser – danach ist der KI-Menüplaner automatisch verbunden. Du kannst den Gemini-Schlüssel auch hier eintragen (<a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Schlüssel bei Google AI Studio</a>).</p>
        <form id="ki-key" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><label class="versteckt" for="ki-key-feld">Gemini-Schlüssel</label>
          <input id="ki-key-feld" type="password" placeholder="Gemini-Schlüssel einfügen" style="flex:1;min-width:220px;height:44px;border:1px solid var(--linie);border-radius:22px;padding:0 16px;background:var(--kachel-2)">
          <button class="knopf">Speichern</button></form></div>`}
      <form class="kachel abschnitt" id="ki-form" style="margin-bottom:14px">
        <label for="ki-text" style="font-weight:600">Dein Wunsch</label>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:flex-start">
          <textarea id="ki-text" rows="3" style="flex:1;border:1px solid var(--linie);border-radius:8px;padding:12px 14px;background:var(--kachel-2);font:inherit;resize:vertical" placeholder="z. B. Geburtstagsessen für 8 Personen, ein Gast isst kein Schwein, Dessert gern mit Beeren"></textarea>
          <button type="button" class="rund" id="ki-mikro" aria-label="Wunsch einsprechen" title="Einsprechen" style="width:52px;height:52px">${I.mikro}</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">${beispiele.map(b => `<button type="button" class="chip" data-bsp="${esc(b)}">${esc(b)}</button>`).join('')}</div>
        <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap"><button class="knopf haupt" style="grid-column:auto;min-width:240px">${I.ki} Menü zusammenstellen</button>
          ${kiVerlauf.length ? '<button type="button" class="knopf" id="ki-neu">Neu beginnen</button>' : ''}</div>
      </form>
      <div id="ki-ergebnis" aria-live="polite"></div>`;
    if (kiLetzte) zeigeKI(kiLetzte);
    const kf = $('#ki-key');
    if (kf) kf.onsubmit = e => { e.preventDefault(); const v = $('#ki-key-feld').value.trim(); if (v.length > 20) { KB.ki.setzeSchluessel(v); meldung('Schlüssel gespeichert'); route(); } };
    $$('[data-bsp]', main).forEach(b => b.onclick = () => { $('#ki-text').value = b.dataset.bsp; $('#ki-text').focus(); });
    const neu = $('#ki-neu'); if (neu) neu.onclick = () => { kiVerlauf.length = 0; kiLetzte = null; route(); };
    $('#ki-form').onsubmit = async e => {
      e.preventDefault();
      const text = $('#ki-text').value.trim(); if (!text) { $('#ki-text').focus(); return; }
      const box = $('#ki-ergebnis');
      box.innerHTML = `<div class="leer-hinweis">Die KI blättert durch ${KB.INDEX.length} Rezepte …</div>`;
      kiVerlauf.push({ rolle: 'ich', text });
      try {
        const { text: antwort } = await KB.ki.frage({ system: KB.ki.systemText(), verlauf: kiVerlauf });
        kiVerlauf.push({ rolle: 'ki', text: antwort });
        let d; try { d = JSON.parse(antwort.replace(/^```json\s*|```\s*$/g, '')); } catch (x) { d = { titel: 'Vorschlag', einleitung: antwort, gaenge: [] }; }
        kiLetzte = d; $('#ki-text').value = ''; zeigeKI(d);
      } catch (err) {
        kiVerlauf.pop();
        box.innerHTML = `<div class="leer-hinweis">${err.ohneSchluessel ? 'Noch kein Google-Schlüssel da. Öffne einmal die Master-App in diesem Browser oder trag den Schlüssel oben ein.'
          : err.falscherSchluessel ? 'Google lehnt den Schlüssel ab. Bitte in der Master-App den Gemini-Schlüssel prüfen.' : esc(err.message)}</div>`;
      }
    };
    const mik = $('#ki-mikro');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) mik.hidden = true;
    else mik.onclick = () => {
      const s = new SR(); s.lang = 'de-DE'; s.interimResults = true;
      mik.style.background = 'var(--safran-hell)';
      s.onresult = ev => { $('#ki-text').value = Array.from(ev.results).map(x => x[0].transcript).join(' '); };
      s.onend = () => { mik.style.background = ''; };
      s.start();
    };
  }
  const kiArt = t => { t = String(t || '').toLowerCase(); return /vorspeise|starter|antipast|meze|mezze/.test(t) ? 'vorspeise' : /suppe/.test(t) ? 'suppe' : /salat/.test(t) ? 'salat' : /dessert|nachtisch|nachspeise|süß/.test(t) ? 'dessert' : /beilage/.test(t) ? 'beilage' : /zwischen/.test(t) ? 'zwischengang' : 'hauptgang'; };
  function zeigeKI(d) {
    const box = $('#ki-ergebnis'); if (!box) return;
    const gaenge = (d.gaenge || []).filter(g => IDX[g.id]);
    const alt = (d.alternativen || []).filter(g => IDX[g.id]);
    box.innerHTML = `<section class="kachel abschnitt menue-kopf">
        <h2>${esc(d.titel || 'Dein Menü')}</h2>
        ${d.einleitung ? `<p>${esc(d.einleitung)}</p>` : ''}
        ${d.rueckfrage ? `<div class="tipp" style="margin-top:12px"><b>Rückfrage:</b> ${esc(d.rueckfrage)} <br><small>Antworte einfach oben im Feld – die KI kennt den bisherigen Verlauf.</small></div>` : ''}
      </section>
      ${gaenge.map(g => gangKarte(IDX[g.id], g.gang || 'Gang', g.warum)).join('')}
      ${gaenge.length ? `<div class="knoepfe menue-knoepfe"><button class="knopf haupt" id="ki-einkauf">${I.korb} Einkaufsliste fürs ganze Menü</button></div>
        <section class="kachel abschnitt"><h2>Ablaufplan für die Küche</h2>${d.ablauf ? `<p>${esc(d.ablauf)}</p>` : ''}<ol class="ablauf" id="ki-ablauf"><li>Wird berechnet …</li></ol></section>` : ''}
      ${d.getraenke ? `<section class="kachel abschnitt"><h2>Getränke</h2><p>${esc(d.getraenke)}</p></section>` : ''}
      ${alt.length ? `<h2 class="zwischen">Alternativen</h2>${alt.map(g => gangKarte(IDX[g.id], 'Alternative', g.warum)).join('')}` : ''}`;
    const ek = $('#ki-einkauf');
    if (ek) ek.onclick = () => {
      const p = d.personen || parseInt(prompt('Für wie viele Personen einkaufen?', '4'), 10); if (!p) return;
      menueAufEinkaufsliste('Menü: ' + (d.titel || gaenge.map(g => IDX[g.id].n).join(' · ')), gaenge.map(g => g.id), p);
    };
    if (gaenge.length) ladeRezepte(gaenge.map(g => g.id)).then(rs => {
      const ab = $('#ki-ablauf'); if (ab) ab.innerHTML = ablaufplan(rs, gaenge.map(g => kiArt(g.gang)));
    }).catch(() => { const ab = $('#ki-ablauf'); if (ab) ab.innerHTML = ''; });
  }

  /* ---------- Merker: letzte Seite, Scrollstelle und Kochmodus-Schritt überleben das Schließen der App ---------- */
  const merker = {
    hol() { try { return JSON.parse(localStorage.getItem('zuletzt') || '{}'); } catch (e) { return {}; } },
    setz(teil) { try { localStorage.setItem('zuletzt', JSON.stringify({ ...this.hol(), ...teil, zeit: Date.now() })); } catch (e) {} }
  };
  let scrollWarte;
  const merkeScroll = () => merker.setz({ hash: location.hash || '#/', y: Math.round(scrollY) });
  addEventListener('scroll', () => { clearTimeout(scrollWarte); scrollWarte = setTimeout(merkeScroll, 300); }, { passive: true });
  addEventListener('pagehide', merkeScroll);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') merkeScroll(); });
  function wiederherstellen() {
    let neueSitzung = true;
    try { neueSitzung = !sessionStorage.getItem('sitzung'); sessionStorage.setItem('sitzung', '1'); } catch (e) {}
    const z = merker.hol(), h = location.hash.replace(/^#\/?/, '');
    if (!neueSitzung || h || !z.hash || z.hash === '#/' || z.hash === '#' || /^#\/(ansicht|rundgang)/.test(z.hash)) return false;
    if (z.km && z.km.id && z.hash === '#/rezept/' + z.km.id) KB._kmWieder = z.km;
    KB._scrollZiel = z.y || 0;
    history.replaceState(null, '', z.hash);
    setTimeout(() => meldung(z.km ? 'Weiter, wo du aufgehört hast – Kochmodus Schritt ' + (z.km.schritt + 1) : 'Weiter, wo du aufgehört hast'), 900);
    return true;
  }

  /* ---------- Start ---------- */
  function los() {
    rahmen();
    if (!KB.INDEX || !KB.INDEX.length) { $('#inhalt').innerHTML = '<div class="leer-hinweis">Das Rezeptregister konnte nicht geladen werden.</div>'; return; }
    vorbereiten();
    wiederherstellen();
    window.addEventListener('hashchange', route);
    route();
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', los); else los();
})();
