/* TW Renovierungs-App – Oberfläche (Router, Ansichten, Bedienung).
   Ein Geschenk von Thomas Willwacher Fliesenlegermeister e.K. – kostenlos und ohne Gewähr. */
(function () {
  'use strict';
  const R = window.TW_RECHNER, K = window.TW_KATALOG, SP = window.TW_SPEICHER, KI = window.TW_KI;
  const S = SP.laden();
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const z = R.zahl;
  const RECHT = { impressum: 'https://www.thomas-willwacher.de/impressum.html', datenschutz: 'https://www.thomas-willwacher.de/datenschutz.html', web: 'https://www.thomas-willwacher.de/', mail: 'info@thomas-willwacher.de' };
  const FIRMA = 'Thomas Willwacher Fliesenlegermeister e.K.';

  /* ---------- Symbole (Bedienelemente) ---------- */
  const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    kamera: sv('<path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>'),
    mikro: sv('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
    haus: sv('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    liste: sv('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>'),
    wagen: sv('<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.6L21 8H6"/>'),
    werkzeug: sv('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'),
    kalender: sv('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    haken: sv('<path d="m5 12 5 5 9-10"/>'),
    hilfe: sv('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17.5v.01"/>'),
    zahnrad: sv('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    zurueck: sv('<path d="m15 18-6-6 6-6"/>'), weiter: sv('<path d="m9 18 6-6-6-6"/>'),
    uhr: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    warn: sv('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17v.01"/>'),
    schild: sv('<path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z"/><path d="M12 8v5M12 16v.01"/>'),
    teilen: sv('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>'),
    kopie: sv('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'),
    drucken: sv('<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>'),
    plus: sv('<path d="M12 5v14M5 12h14"/>'), weg: sv('<path d="M6 6l12 12M18 6 6 18"/>'),
    ki: sv('<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/>'),
    runter: sv('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>'), hoch: sv('<path d="M12 21V9M7 14l5-5 5 5"/><path d="M4 3h16"/>'),
    gluehbirne: sv('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>'),
    stop: sv('<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>'),
    play: sv('<path d="M7 4v16l13-8z"/>'), pause: sv('<path d="M8 5v14M16 5v14"/>'),
    lautsprecher: sv('<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'),
    info: sv('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>'),
    stern: sv('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>')
  };

  /* ---------- Hilfen ---------- */
  const arbeit = id => K.arbeiten.find(a => a.id === id);
  const bereich = id => K.BEREICHE.find(b => b.id === id) || { farbe: '#556', name: '' };
  const katStil = a => `--kat:${bereich(a.bereich).farbe}`;
  const vorhaben = id => S.vorhaben.find(v => v.id === id);
  const toastEl = () => $('#toast');
  let toastT; function toast(t) { const e = toastEl(); e.textContent = t; e.classList.add('an'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('an'), 2600); }
  const heute = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const datumText = d => d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
  const kurzDatum = d => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const uhrzeit = d => d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const stufeHTML = n => `<span class="stufe" title="Schwierigkeit ${['', 'leicht', 'mittel', 'anspruchsvoll'][n]}">${[1, 2, 3].map(i => `<i class="${i <= n ? 'an' : ''}"></i>`).join('')}</span> ${['', 'leicht', 'mittel', 'anspruchsvoll'][n]}`;
  const wert = (x, d) => (typeof x === 'function' ? x(...d) : x);

  /* Foto (echt, falls im Bildnachweis eingetragen; sonst ruhige fotografische Fläche) */
  const bildUrl = d => d.split('/').map(encodeURIComponent).join('/');
  const bildVermerk = b => b.ki ? 'KI-generiert (fotorealistisch)' : [b.urheber, b.lizenz].filter(Boolean).join(' · ');
  function fotoHTML(a, klein) {
    const b = (window.TW_BILDER || {})[a.id];
    if (b && b.datei) return `<div class="foto" style="${katStil(a)}"><img src="${esc(bildUrl(b.datei))}" alt="${esc(b.titel || a.titel)}" loading="lazy"><span class="foto-nachweis">${esc(bildVermerk(b))}</span>${klein ? `<div class="foto-titel foto-titel-bild"><small>${esc(bereich(a.bereich).name)}</small>${esc(a.titel)}</div>` : ''}</div>`;
    return `<div class="foto platzhalter" style="${katStil(a)}" role="img" aria-label="${esc(a.titel)}"><div class="foto-titel"><small>${esc(bereich(a.bereich).name)}</small>${esc(a.titel)}</div></div>`;
  }
  function schrittFotoHTML(a, s) {
    const nr = a.schritte.indexOf(s) + 1; const b = (window.TW_BILDER || {})[`${a.id}#${nr}`];
    if (!b || !b.datei) return '';
    return `<figure class="schritt-foto"><img src="${esc(bildUrl(b.datei))}" alt="${esc(b.titel || s.t)}" loading="lazy"><figcaption>${esc(bildVermerk(b))}</figcaption></figure>`;
  }
  async function vorhabenFotoHTML(v, a) {
    if (v.fotos && v.fotos.start) { const u = await SP.fotoUrl(v.fotos.start); if (u) return `<div class="foto" style="${katStil(a)}"><img src="${u}" alt="Ihr Foto: ${esc(a.titel)}"></div>`; }
    return fotoHTML(a, true);
  }

  /* ---------- Vorhaben: Daten auswerten ---------- */
  function optionenStd(a) { const o = {}; (a.optionen || []).forEach(x => { o[x.id] = x.std; }); return o; }
  function neuesVorhaben(aid, extra) {
    const a = arbeit(aid);
    const v = Object.assign({ id: SP.id(), arbeit: aid, erstellt: new Date().toISOString(), raumName: '', o: optionenStd(a), m: {}, raum: { l: '', b: '', h: '', fenster: [], tueren: [], abzug: '', zuschlag: '' },
      werkzeug: {}, auswahl: {}, liste: {}, schritte: {}, fotos: { vorher: [], nachher: [] }, notiz: '', baujahr: S.haus.baujahr || '', start: '' }, extra || {});
    if (a.aufnahme.art === 'raum') {
      if (a.aufnahme.oeffnungen === true && !v.raum.fenster.length) v.raum.fenster = [{ b: '1,20', h: '1,35' }];
      if (a.aufnahme.oeffnungen && !v.raum.tueren.length) v.raum.tueren = [{ b: '0,885', h: '2,01' }];
    }
    if (a.aufnahme.art === 'werte') (a.aufnahme.felder || []).forEach(f => { if (v.m[f.id] === undefined) v.m[f.id] = String(f.std).replace('.', ','); });
    S.vorhaben.unshift(v); SP.speichern(); return v;
  }
  function messwerte(v) {
    const a = arbeit(v.arbeit);
    if (a.aufnahme.art === 'raum') {
      const r = v.raum, n = x => R.lies(x);
      const roh = { l: n(r.l), b: n(r.b), h: a.aufnahme.hoehe ? n(r.h) : undefined, fenster: (r.fenster || []).map(o => ({ b: n(o.b), h: n(o.h) })), tueren: (r.tueren || []).map(o => ({ b: n(o.b), h: n(o.h) })), abzug: n(r.abzug) || 0, zuschlag: n(r.zuschlag) || 0 };
      const R1 = R.raum({ ...roh, h: roh.h || 0 });
      return { m: { R: R1, roh }, pruef: R.pruefeRaum(roh) };
    }
    const m = {}; const pruef = [];
    (a.aufnahme.felder || []).forEach(f => { const x = R.lies(v.m[f.id]); m[f.id] = isNaN(x) ? (f.pflicht === false ? 0 : NaN) : x; pruef.push(...R.pruefeWert(f, isNaN(x) ? (f.pflicht === false ? 0 : NaN) : x)); });
    return { m, pruef };
  }
  const bereit = v => !messwerte(v).pruef.some(p => p.stufe === 'fehler');
  function rotText(v) { const a = arbeit(v.arbeit); if (!a.rot || !bereit(v)) return ''; try { return a.rot(messwerte(v).m, v.o) || ''; } catch (e) { return ''; } }
  const asbestStufe = v => { const a = arbeit(v.arbeit); if (!a.asbest) return ''; const bj = parseInt(v.baujahr || S.haus.baujahr, 10); return !bj ? 'unbekannt' : bj < 1993 ? 'rot' : ''; };

  function materialListe(v) {
    if (!bereit(v)) return [];
    const a = arbeit(v.arbeit); const { m } = messwerte(v);
    let l = []; try { l = a.material(m, v.o) || []; } catch (e) { console.warn(e); }
    return l.map((p, i) => { const key = 'm:' + p.name; const an = v.auswahl[key] !== undefined ? v.auswahl[key] : !p.optional; return Object.assign({}, p, { key, an: an && p.menge > 0 }); });
  }
  function werkzeugListe(v) {
    const a = arbeit(v.arbeit); const ids = wert(a.werkzeug, [v.o]) || [];
    return [...new Set(ids)].map(id => { const w = K.W[id]; const st = v.werkzeug[id] || ((S.werkzeugkiste[id] || w.basis) ? 'habe' : (w.leihbar ? 'leihe' : 'brauche')); return { id, n: w.n, hinweis: w.hinweis, leihbar: !!w.leihbar, st }; });
  }
  function einkaufListe(v) {
    const posten = materialListe(v).filter(p => p.an).map(p => ({ key: p.key, abt: p.abt, menge: p.menge, einheit: p.einheit, name: p.name, detail: p.detail || p.hinweis || '' }));
    werkzeugListe(v).forEach(w => { if (w.st === 'brauche') posten.push({ key: 'w:' + w.id, abt: 'werkzeug', menge: 1, einheit: 'Stk.', name: w.n, detail: '' }); if (w.st === 'leihe') posten.push({ key: 'w:' + w.id, abt: 'miete', menge: 1, einheit: '×', name: w.n, detail: 'leihen / mieten' }); });
    return posten;
  }
  function schritteListe(v) {
    const a = arbeit(v.arbeit); const { m } = messwerte(v);
    return a.schritte.filter(s => !s.wenn || s.wenn(m, v.o));
  }
  function phasen(v) {
    const { m } = messwerte(v); const n = einkaufListe(v).length;
    const ph = [{ t: 'Einkauf im Baumarkt (Liste in der App)', min: Math.min(120, 30 + n * 3), art: 'einkauf', hinweis: 'Liste unter „Einkauf“ – Material mit Lieferzeit vorher bestellen.' }];
    schritteListe(v).forEach(s => ph.push({ t: s.t, min: Math.max(0, Math.round(wert(s.min, [m, v.o]) || 0)), warten: wert(s.warten, [m, v.o]) || 0, wartenText: s.wartenText, tagNeu: wert(s.tagNeu, [m, v.o]), parallel: s.parallel, nachParallel: s.nachParallel, vorWarten: s.vorWarten, vorWartenText: s.vorWartenText }));
    return ph;
  }
  function startDatum(v) {
    if (v.start) { const d = new Date(v.start); if (!isNaN(d)) return d; }
    const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(S.einst.von, 0, 0, 0); return d;
  }
  function fortschritt(v) { const s = schritteListe(v); if (!s.length || !bereit(v)) return 0; return Math.round(100 * s.filter(x => v.schritte[x.t]).length / s.length); }

  /* ---------- Wartung (Mein Haus) ---------- */
  function wartungsPunkte() {
    const l = K.arbeiten.filter(a => a.wartung).map(a => ({ id: a.id, titel: a.wartung.text, monate: a.wartung.monate, monat: a.wartung.monat, arbeit: a.id, bereich: a.bereich, std: a.wartung.std !== false && !['oelheizung', 'schimmel', 'holzterrasse'].includes(a.id) }));
    K.KONTROLLEN.forEach(k => l.push({ id: k.id, titel: k.titel, monate: k.monate, monat: k.monat, text: k.text, std: true }));
    (S.haus.eigene || []).forEach(k => l.push({ id: k.id, titel: k.titel, monate: k.monate, eigen: true, std: true }));
    return l.map(p => { const w = S.haus.wartung[p.id] || {}; const aktiv = w.aktiv !== undefined ? w.aktiv : p.std; return Object.assign(p, { aktiv, zuletzt: w.zuletzt || '', naechst: naechsteFaellig(p, w.zuletzt) }); });
  }
  function naechsteFaellig(p, zuletzt) {
    const h = heute();
    if (zuletzt) { const d = new Date(zuletzt); d.setMonth(d.getMonth() + p.monate); return d; }
    if (p.monat) { const d = new Date(h.getFullYear(), p.monat - 1, 1); if (d < h && !(d.getMonth() === h.getMonth())) d.setFullYear(d.getFullYear() + 1); return d < h ? h : d; }
    const d = new Date(h); d.setDate(d.getDate() + 14); return d; /* noch nie erledigt: in zwei Wochen erstmals */
  }
  const ampel = d => { const t = (d - heute()) / 86400000; return t <= 0 ? 'faellig' : t <= 30 ? 'bald' : ''; };
  const faelligZahl = () => wartungsPunkte().filter(p => p.aktiv && ampel(p.naechst) === 'faellig').length;

  /* ---------- Gerüst ---------- */
  function geruest() {
    document.body.innerHTML = `
<a class="versteckt" href="#inhalt">Zum Inhalt</a>
<header class="kopf"><div class="kopf-innen">
  <a class="marke" href="#/" aria-label="Startseite"><img class="marke-symbol" src="icon-192.png" alt=""><span class="marke-text">Renovierung<small>Planen · Einkaufen · Ausführen</small></span></a>
  <nav class="nav" aria-label="Hauptnavigation">
    <a href="#/" data-nav="start">${I.haus}Start</a>
    <a href="#/schnell" data-nav="schnell">${I.kamera}Schnellstart</a>
    <a href="#/liste" data-nav="liste">${I.wagen}Einkauf</a>
    <a href="#/haus" data-nav="haus">${I.kalender}Mein Haus<span class="punkt" data-faellig hidden></span></a>
    <button type="button" data-act="hilfe">${I.hilfe}Hilfe</button>
    <a href="#/einstellungen" data-nav="einstellungen" aria-label="Einstellungen">${I.zahnrad}</a>
  </nav>
  <a class="logo-platte" href="#/ueber" title="Über diese App – ein Geschenk von ${FIRMA}"><img src="bilder/tw-logo.jpg" alt="${FIRMA}" width="639" height="188"></a>
</div></header>
<main id="inhalt" tabindex="-1"></main>
<footer class="fuss">
  <div class="geschenk"><span class="logo-platte"><img src="bilder/tw-logo.jpg" alt="${FIRMA}" width="639" height="188"></span><span>Ein Geschenk von ${FIRMA}<br>Kostenlos und ohne Gewähr · Planungshilfe, ersetzt keine Fachberatung</span></div>
  <div class="knopf-reihe"><a href="#/ueber">Über diese App</a><a href="${RECHT.impressum}" target="_blank" rel="noopener">Impressum</a><a href="${RECHT.datenschutz}" target="_blank" rel="noopener">Datenschutz</a><a href="#/ueber#bildnachweis">Bildnachweis &amp; Lizenzen</a><button type="button" data-act="hilfe">Hilfe</button><button type="button" data-act="installieren" hidden>Als App installieren</button></div>
</footer>
<nav class="unten" aria-label="Navigation">
  <a href="#/" data-nav="start">${I.haus}Start</a>
  <a href="#/schnell" data-nav="schnell">${I.kamera}Schnell</a>
  <a href="#/liste" data-nav="liste">${I.wagen}Einkauf</a>
  <a href="#/haus" data-nav="haus">${I.kalender}Haus<span class="punkt" data-faellig hidden></span></a>
  <button type="button" data-act="hilfe">${I.hilfe}Hilfe</button>
</nav>
<div id="toast" class="toast" role="status" aria-live="polite"></div>`;
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-act="hilfe"]'); if (b) { e.preventDefault(); window.TW_HILFE && window.TW_HILFE.oeffnen(); }
      const i = e.target.closest('[data-act="installieren"]'); if (i) installieren();
    });
  }
  function navMarkieren(n) {
    $$('[data-nav]').forEach(a => a.classList.toggle('aktiv', a.dataset.nav === n));
    const f = faelligZahl(); $$('[data-faellig]').forEach(p => { p.hidden = !f; p.textContent = f; });
  }

  /* ---------- Router ---------- */
  const main = () => $('#inhalt');
  async function route() {
    const h = location.hash.replace(/^#\/?/, '').split('#')[0];
    const [teil, a1, a2] = h.split('/');
    stoppeUhren();
    let nav = 'start';
    try {
      if (!teil) await seiteStart();
      else if (teil === 'schnell') { nav = 'schnell'; await seiteSchnell(); }
      else if (teil === 'arbeit' && arbeit(a1)) await seiteArbeit(arbeit(a1));
      else if (teil === 'v' && vorhaben(a1)) await seiteVorhaben(vorhaben(a1), a2 || 'aufnahme');
      else if (teil === 'liste') { nav = 'liste'; seiteGesamtliste(); }
      else if (teil === 'haus') { nav = 'haus'; seiteHaus(); }
      else if (teil === 'einstellungen') { nav = 'einstellungen'; seiteEinstellungen(); }
      else if (teil === 'ueber') { nav = ''; seiteUeber(); }
      else { location.hash = '#/'; return; }
    } catch (e) { console.error(e); main().innerHTML = `<div class="karte"><h2>Da ist etwas schiefgegangen</h2><p>${esc(e.message)}</p><a class="knopf" href="#/">Zur Startseite</a></div>`; }
    navMarkieren(nav);
    const anker = location.hash.split('#')[2];
    if (anker && document.getElementById(anker)) document.getElementById(anker).scrollIntoView(); else if (!route.gleich) window.scrollTo(0, 0);
    route.gleich = false;
  }

  /* ---------- Start ---------- */
  async function seiteStart() {
    const aktiv = S.vorhaben;
    const filter = sessionStorage.getItem('twreno.bereich') || '';
    const kacheln = K.arbeiten.filter(a => !filter || a.bereich === filter).map(a => {
      const sch = a.schritte.length; return `<a class="arbeit-kachel" href="#/arbeit/${a.id}" style="${katStil(a)}">${fotoHTML(a, true)}
      <div class="arbeit-kachel-text"><p>${esc(a.kurz)}</p><div class="meta"><span>${stufeHTML(a.schwierigkeit)}</span><span>${I.liste}${sch} Schritte</span>${a.wartung ? `<span>${I.kalender}Wartungsplan</span>` : ''}</div></div></a>`;
    }).join('');
    const vh = await Promise.all(aktiv.slice(0, 6).map(async v => { const a = arbeit(v.arbeit); const p = fortschritt(v);
      return `<a class="vorhaben-zeile" href="#/v/${v.id}/${bereit(v) ? (p ? 'ausfuehren' : 'plan') : 'aufnahme'}" style="${katStil(a)}">${await vorhabenFotoHTML(v, a)}<div><h3>${esc(a.titel)}</h3><div class="klein">${esc(v.raumName || bereich(a.bereich).name)} · angelegt ${kurzDatum(new Date(v.erstellt))}</div></div><div class="ring" style="--p:${p}" aria-label="${p} Prozent erledigt">${p}%</div></a>`; }));
    const wp = wartungsPunkte().filter(p => p.aktiv).sort((a, b) => a.naechst - b.naechst).slice(0, 3);
    main().innerHTML = `
<section class="held">
  <div class="held-text">
    <h1>Ihr Haus. <span>Ihr Plan.</span></h1>
    <p>Foto machen, ein Wort sagen – die App stellt den kompletten Ablauf zusammen: Aufnahme der Maße, Zeitplan mit Trockenzeiten, Material auf das Gebinde genau, Werkzeug, Baumarkt-Liste nach Abteilungen und eine Anleitung Schritt für Schritt.</p>
    <div class="knopf-reihe"><a class="knopf haupt" href="#/schnell">${I.kamera}Schnellstart</a><a class="knopf" href="#/haus">${I.kalender}Mein Haus</a><button class="knopf leise" data-act="hilfe">${I.hilfe}So geht's</button></div>
    <p class="klein" style="margin-top:14px">${K.arbeiten.length} Arbeiten · ${K.arbeiten.reduce((s, a) => s + a.schritte.length, 0)} Arbeitsschritte · alles bleibt auf Ihrem Gerät · funktioniert ohne Internet</p>
  </div>
  ${schnellKarteHTML()}
</section>
${aktiv.length ? `<section class="abschnitt"><div class="abschnitt-kopf"><h2>Meine Vorhaben</h2><span class="klein">${aktiv.length} angelegt</span></div>${vh.join('')}${aktiv.length > 6 ? `<p class="klein" style="margin-top:10px">Ältere Vorhaben: Einkauf → alle Vorhaben.</p>` : ''}</section>` : ''}
${wp.length ? `<section class="abschnitt"><div class="abschnitt-kopf"><h2>Als Nächstes fällig</h2><a href="#/haus">Wartungsplan</a></div><div class="karte">${wp.map(p => `<div class="wartung"><span class="ampel ${ampel(p.naechst)}"></span><div><h3>${esc(p.titel)}</h3><p>fällig ${kurzDatum(p.naechst)}</p></div><a class="knopf klein" href="#/haus">Ansehen</a></div>`).join('')}</div></section>` : ''}
<section class="abschnitt" id="katalog"><div class="abschnitt-kopf"><h2>Alle Arbeiten</h2><span class="klein">Antippen für Überblick und Start</span></div>
  <div class="bereich-leiste" role="tablist"><button class="chip ${!filter ? 'aktiv' : ''}" data-bereich="">Alle</button>${K.BEREICHE.map(b => `<button class="chip ${filter === b.id ? 'aktiv' : ''}" data-bereich="${b.id}" style="--kat:${b.farbe}"><span class="farbpunkt"></span>${esc(b.name)}</button>`).join('')}</div>
  <div class="raster vier" style="margin-top:14px">${kacheln}</div>
</section>`;
    $$('[data-bereich]').forEach(b => b.onclick = () => { sessionStorage.setItem('twreno.bereich', b.dataset.bereich); route.gleich = true; seiteStart().then(() => $('#katalog').scrollIntoView()); });
    bindeSchnell();
  }

  /* ---------- Schnellstart ---------- */
  let schnellFoto = null; // Blob
  function schnellKarteHTML() {
    return `<div class="schnell" id="schnellstart">
      <h2><span class="nr">1</span>Foto machen <span class="klein" style="text-transform:none;font-family:var(--ui)">(freiwillig)</span></h2>
      <label class="foto-feld" id="sf-feld">${I.kamera}<span>Raum oder Schaden fotografieren</span><input type="file" accept="image/*" capture="environment" class="versteckt" id="sf-datei"></label>
      <h2 style="margin-top:16px"><span class="nr">2</span>Ein Wort sagen oder tippen</h2>
      <form class="wort" id="sf-form" autocomplete="off"><label class="versteckt" for="sf-wort">Was haben Sie vor?</label><input id="sf-wort" enterkeyhint="go" placeholder="z. B. tapezieren"><button type="button" class="mikro" id="sf-mikro" aria-label="Spracheingabe">${I.mikro}</button></form>
      <div class="vorschlaege" id="sf-vorschlag">${['tapezieren', 'streichen', 'Silikonfuge', 'Heizung entlüften', 'Laminat', 'Klo läuft', 'Rauchmelder'].map(w => `<button class="chip" type="button" data-wort="${esc(w)}">${esc(w)}</button>`).join('')}</div>
      <div id="sf-treffer"></div>
    </div>`;
  }
  async function zeigeSchnellFoto() {
    const f = $('#sf-feld'); if (!f) return;
    $$('img,.weg', f).forEach(x => x.remove());
    if (schnellFoto) { const u = URL.createObjectURL(schnellFoto); f.insertAdjacentHTML('beforeend', `<img src="${u}" alt="Ihr Foto"><button type="button" class="icon-knopf weg" aria-label="Foto entfernen">${I.weg}</button>`); $('.weg', f).onclick = e => { e.preventDefault(); schnellFoto = null; zeigeSchnellFoto(); }; }
  }
  function bindeSchnell() {
    const inp = $('#sf-wort'); if (!inp) return;
    zeigeSchnellFoto();
    $('#sf-datei').onchange = async e => { const d = e.target.files[0]; if (!d) return; try { schnellFoto = await SP.verkleinern(d); zeigeSchnellFoto(); inp.focus(); } catch (err) { toast(err.message); } };
    const suche = () => zeigeTreffer(inp.value);
    inp.oninput = suche;
    $('#sf-form').onsubmit = e => { e.preventDefault(); if (R.istFliesenWort(inp.value)) { zeigeTreffer(inp.value); return; } const t = R.erkenne(inp.value, K.arbeiten); if (t[0]) starte(t[0].id); };
    $$('[data-wort]').forEach(b => b.onclick = () => { inp.value = b.dataset.wort; suche(); });
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const mk = $('#sf-mikro');
    if (!SR) { mk.title = 'Spracheingabe wird von diesem Browser nicht unterstützt – bitte tippen.'; mk.onclick = () => toast('Spracheingabe wird von diesem Browser nicht unterstützt – bitte tippen.'); }
    else mk.onclick = () => {
      const r = new SR(); r.lang = 'de-DE'; r.interimResults = true; r.maxAlternatives = 1;
      mk.classList.add('hoert'); toast('Ich höre zu …');
      r.onresult = ev => { inp.value = [...ev.results].map(x => x[0].transcript).join(' '); suche(); };
      r.onerror = ev => { toast(ev.error === 'not-allowed' ? 'Mikrofon nicht freigegeben – bitte im Browser erlauben.' : 'Spracheingabe hat nicht geklappt – bitte tippen.'); };
      r.onend = () => { mk.classList.remove('hoert'); const t = R.erkenne(inp.value, K.arbeiten); if (t[0] && t[0].punkte >= 20) zeigeTreffer(inp.value); };
      r.start();
    };
    if (inp.value) suche();
  }
  function zeigeTreffer(text) {
    const box = $('#sf-treffer'); if (!box) return;
    if (!text.trim()) { box.innerHTML = ''; return; }
    if (R.istFliesenWort(text)) { box.innerHTML = `<div class="treffer"><div class="meldung info">${I.info}<span><b>Für Fliesenarbeiten kommt eine eigene App.</b> Diese App behandelt Fliesen bewusst nicht. Silikonfugen an Wanne und Dusche finden Sie hier unter „Silikonfugen erneuern“.</span></div><div class="vorschlaege"><button class="chip" type="button" data-start="silikon">Silikonfugen erneuern</button></div></div>`; $$('[data-start]', box).forEach(b => b.onclick = () => starte(b.dataset.start)); return; }
    const t = R.erkenne(text, K.arbeiten);
    if (!t.length) { box.innerHTML = `<div class="treffer"><p>Dazu habe ich noch keine Anleitung. Versuchen Sie ein anderes Wort oder wählen Sie unten aus allen Arbeiten.</p><a class="knopf klein" href="#/#katalog" data-act="katalog">Alle Arbeiten ansehen</a></div>`; return; }
    const a = arbeit(t[0].id); const weitere = t.slice(1, 4).filter(x => x.punkte >= t[0].punkte * 0.35);
    box.innerHTML = `<div class="treffer" style="${katStil(a)}"><div class="treffer-haupt">${fotoHTML(a, true)}<div><div class="klein">Erkannt:</div><h3 style="margin:2px 0 6px">${esc(a.titel)}</h3><button class="knopf haupt" type="button" data-start="${a.id}">${I.weiter}Los geht's</button></div></div>
      ${weitere.length ? `<div class="vorschlaege"><span class="klein" style="align-self:center">Oder meinten Sie:</span>${weitere.map(w => { const b = arbeit(w.id); return `<button class="chip" type="button" data-start="${b.id}" style="${katStil(b)}"><span class="farbpunkt"></span>${esc(b.titel)}</button>`; }).join('')}</div>` : ''}</div>`;
    $$('[data-start]', box).forEach(b => b.onclick = () => starte(b.dataset.start));
  }
  async function starte(aid, extra) {
    const v = neuesVorhaben(aid, extra);
    if (schnellFoto) { try { v.fotos.start = await SP.fotoSpeichern(schnellFoto); v.fotos.vorher.push(v.fotos.start); SP.speichern(); } catch (e) { toast('Foto konnte nicht gespeichert werden.'); } schnellFoto = null; }
    const a = arbeit(aid);
    location.hash = `#/v/${v.id}/${a.aufnahme.art === 'keine' ? 'plan' : 'aufnahme'}`;
  }
  async function seiteSchnell() {
    main().innerHTML = `<a class="zurueck" href="#/">${I.zurueck}Start</a><div style="max-width:640px;margin:0 auto">${schnellKarteHTML()}<p class="klein" style="margin-top:14px">Tipp: Sagen Sie einfach, was Sie vorhaben – „Bad Silikon erneuern“, „Klo läuft“, „Dachrinne“. Die Erkennung läuft auf Ihrem Gerät, ohne KI und ohne Internet.</p></div>`;
    bindeSchnell(); $('#sf-wort').focus();
  }

  /* ---------- Arbeit (Überblick vor dem Start) ---------- */
  async function seiteArbeit(a) {
    const b = bereich(a.bereich);
    const offen = S.vorhaben.filter(v => v.arbeit === a.id);
    main().innerHTML = `<a class="zurueck" href="#/#katalog">${I.zurueck}Alle Arbeiten</a>
<div class="vh-kopf" style="${katStil(a)}">${fotoHTML(a)}<div><div class="klein">${esc(b.name)}</div><h1>${esc(a.titel)}</h1><p style="color:var(--text-2)">${esc(a.kurz)}</p><div class="meta" style="font-size:15px"><span>${stufeHTML(a.schwierigkeit)}</span><span>${I.liste}${a.schritte.length} Schritte</span></div></div></div>
<div class="knopf-reihe" style="margin:18px 0"><button class="knopf haupt" data-neu>${I.plus}Vorhaben anlegen</button>${offen.map(v => `<a class="knopf" href="#/v/${v.id}/plan">Weiter: ${esc(v.raumName || kurzDatum(new Date(v.erstellt)))}</a>`).join('')}</div>
<div class="raster zwei">
  <div class="karte"><h2>So läuft es ab</h2><ol>${a.schritte.map(s => `<li>${esc(s.t)}</li>`).join('')}</ol>${a.vorlauf ? `<div class="meldung info">${I.info}<div><b>Vorher besorgen:</b> ${esc(a.vorlauf)}</div></div>` : ''}</div>
  <div>${grenzenHTML(a)}${a.asbest ? `<div class="meldung warnung" style="margin-top:14px">${I.warn}<div><b>Häuser vor 1993:</b> ${esc(a.asbest)}</div></div>` : ''}
  <div class="karte" style="margin-top:14px"><h3>Sicherheit</h3><ul>${a.sicherheit.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div></div>
</div>`;
    $('[data-neu]').onclick = () => starte(a.id);
  }
  function grenzenHTML(a) {
    return `<div class="grenzen"><h3>${I.schild}Fachbetrieb beauftragen, wenn …</h3><ul>${a.grenzen.map(g => `<li>${esc(g)}</li>`).join('')}</ul></div>`;
  }

  /* ---------- Vorhaben ---------- */
  const REITER = [['aufnahme', 'Aufnahme'], ['plan', 'Plan'], ['material', 'Material'], ['werkzeug', 'Werkzeug'], ['einkauf', 'Einkauf'], ['ausfuehren', 'Ausführen']];
  async function seiteVorhaben(v, tab) {
    const a = arbeit(v.arbeit);
    if (!REITER.some(r => r[0] === tab)) tab = 'aufnahme';
    const ok = bereit(v);
    if (!ok && tab !== 'aufnahme' && a.aufnahme.art !== 'keine') { tab = 'aufnahme'; }
    const fertig = { aufnahme: ok, plan: ok && !!v.planGesehen, material: ok && !!v.materialGesehen, werkzeug: ok && !!v.werkzeugGesehen, einkauf: ok && einkaufListe(v).length > 0 && einkaufListe(v).every(p => v.liste[p.key]), ausfuehren: fortschritt(v) === 100 };
    const reiter = REITER.filter(r => !(r[0] === 'aufnahme' && a.aufnahme.art === 'keine' && !(a.optionen || []).length));
    main().innerHTML = `<a class="zurueck" href="#/">${I.zurueck}Start</a>
<div class="vh-kopf" style="${katStil(a)}">${await vorhabenFotoHTML(v, a)}<div><div class="klein">${esc(bereich(a.bereich).name)}${v.raumName ? ' · ' + esc(v.raumName) : ''}</div><h1>${esc(a.titel)}</h1>
  <div class="knopf-reihe"><button class="knopf klein" data-act="ki-anfrage">${I.ki}Mit Ihrer KI öffnen</button><a class="knopf klein leise" href="#/arbeit/${a.id}">${I.info}Überblick</a><button class="knopf klein leise" data-act="loeschen">${I.weg}Löschen</button></div></div></div>
<nav class="reiter" aria-label="Ablauf">${reiter.map((r, i) => `<a href="#/v/${v.id}/${r[0]}" class="${r[0] === tab ? 'aktiv' : ''} ${fertig[r[0]] ? 'fertig' : ''}"><span class="n">${fertig[r[0]] ? '✓' : i + 1}</span>${r[1]}</a>`).join('')}</nav>
<div id="tab"></div>`;
    $('[data-act="ki-anfrage"]').onclick = () => kiAnfrage(v);
    $('[data-act="loeschen"]').onclick = () => vorhabenLoeschen(v);
    const el = $('#tab');
    const rot = rotText(v);
    const rotHTML = rot ? `<div class="schild" role="alert">${I.schild}<div><strong>Fachbetrieb beauftragen</strong><p>${esc(rot)}</p></div></div>` : '';
    const asbS = asbestStufe(v); const asb = asbS === 'rot' ? `<div class="schild">${I.warn}<div><strong>Haus vor 1993: Asbestverdacht beachten</strong><p>${esc(a.asbest)}</p></div></div>` : asbS === 'unbekannt' ? `<div class="meldung warnung">${I.warn}<div><b>Baujahr unbekannt:</b> ${esc(a.asbest)} <a href="#/v/${v.id}/aufnahme">Baujahr eintragen</a></div></div>` : '';
    if (tab === 'aufnahme') tabAufnahme(el, v, a);
    else if (tab === 'plan') { v.planGesehen = true; SP.speichern(); tabPlan(el, v, a, rotHTML + asb); }
    else if (tab === 'material') { v.materialGesehen = true; SP.speichern(); tabMaterial(el, v, a, rotHTML); }
    else if (tab === 'werkzeug') { v.werkzeugGesehen = true; SP.speichern(); tabWerkzeug(el, v, a); }
    else if (tab === 'einkauf') tabEinkauf(el, [v], rotHTML);
    else if (tab === 'ausfuehren') await tabAusfuehren(el, v, a, rotHTML + asb);
    const idx = reiter.findIndex(r => r[0] === tab);
    el.insertAdjacentHTML('beforeend', `<div class="weiter-leiste nicht-drucken">${idx > 0 ? `<a class="knopf" href="#/v/${v.id}/${reiter[idx - 1][0]}">${I.zurueck}${reiter[idx - 1][1]}</a>` : '<span></span>'}${idx < reiter.length - 1 ? `<a class="knopf haupt" data-weiter href="#/v/${v.id}/${reiter[idx + 1][0]}">Weiter: ${reiter[idx + 1][1]}${I.weiter}</a>` : ''}</div>`);
    const w = $('[data-weiter]'); if (w && tab === 'aufnahme') w.onclick = e => { if (!bereit(v)) { e.preventDefault(); toast('Bitte zuerst die rot markierten Angaben ergänzen.'); const f = $('.eingabe.fehler input'); if (f) f.focus(); } };
  }
  function vorhabenLoeschen(v) {
    if (!confirm('Dieses Vorhaben mit allen Angaben und Fotos löschen?')) return;
    const f = v.fotos || {}; [f.start, ...(f.vorher || []), ...(f.nachher || [])].filter(Boolean).forEach(id => SP.fotoLoeschen(id));
    S.vorhaben.splice(S.vorhaben.indexOf(v), 1); SP.speichern(true); location.hash = '#/';
  }

  /* ----- Reiter Aufnahme ----- */
  function zahlFeld(id, label, wertV, einheit, x = {}) {
    return `<div class="feld"><label for="f-${id}">${esc(label)}</label><div class="eingabe" data-feld="${id}"><input id="f-${id}" data-k="${id}" inputmode="decimal" value="${esc(wertV)}" placeholder="${esc(x.ph || '')}" autocomplete="off"><span class="einheit">${esc(einheit)}</span></div>${x.hilfe ? `<span class="hilfe">${esc(x.hilfe)}</span>` : ''}</div>`;
  }
  function optionenHTML(a, v) {
    return (a.optionen || []).map(x => {
      if (x.typ === 'wahl') return `<div class="feld"><span class="lbl">${esc(x.label)}</span><div class="wahl" role="radiogroup">${x.werte.map(w => `<label><input type="radio" name="o-${x.id}" data-o="${x.id}" value="${esc(w[0])}" ${String(v.o[x.id]) === String(w[0]) ? 'checked' : ''}>${esc(w[1])}</label>`).join('')}</div>${x.hilfe ? `<span class="hilfe">${esc(x.hilfe)}</span>` : ''}</div>`;
      if (x.typ === 'ja') return `<label class="haken"><input type="checkbox" data-o="${x.id}" ${v.o[x.id] ? 'checked' : ''}>${esc(x.label)}</label>`;
      return `<div class="feld"><label for="o-${x.id}">${esc(x.label)}</label><div class="eingabe"><input id="o-${x.id}" data-o="${x.id}" data-zahl inputmode="decimal" value="${esc(String(v.o[x.id] ?? '').replace('.', ','))}"></div>${x.hilfe ? `<span class="hilfe">${esc(x.hilfe)}</span>` : ''}</div>`;
    }).join('');
  }
  function tabAufnahme(el, v, a) {
    const art = a.aufnahme.art;
    let felder = '';
    if (art === 'raum') {
      const r = v.raum;
      felder = `<div class="karte"><h2>1 · Raum messen</h2>${a.aufnahme.hinweis ? `<p class="klein">${esc(a.aufnahme.hinweis)}</p>` : ''}
        <div class="feld" style="margin-bottom:14px"><label for="f-name">Raum (Name, freiwillig)</label><input class="voll" id="f-name" value="${esc(v.raumName)}" placeholder="z. B. Wohnzimmer"></div>
        <div class="feldgruppe">${zahlFeld('l', 'Länge', r.l, 'm', { ph: '4,50' })}${zahlFeld('b', 'Breite', r.b, 'm', { ph: '3,50' })}${a.aufnahme.hoehe ? zahlFeld('h', 'Raumhöhe', r.h, 'm', { ph: '2,50' }) : ''}</div></div>
      ${a.aufnahme.oeffnungen ? `<div class="karte"><h2>2 · Fenster und Türen</h2><p class="klein">Breite × Höhe in Metern, mit Rahmen gemessen. Typisch: Innentür 0,885 × 2,01 m.</p>
        ${a.aufnahme.oeffnungen === true ? `<h3>Fenster</h3><div id="l-fenster">${(r.fenster || []).map((o, i) => oeffnungHTML('fenster', i, o)).join('')}</div><button class="knopf klein" data-plus="fenster" style="margin-top:8px">${I.plus}Fenster</button>` : ''}
        <h3 style="margin-top:16px">Türen</h3><div id="l-tueren">${(r.tueren || []).map((o, i) => oeffnungHTML('tueren', i, o)).join('')}</div><button class="knopf klein" data-plus="tueren" style="margin-top:8px">${I.plus}Tür</button></div>` : ''}
      ${a.aufnahme.hoehe && a.aufnahme.oeffnungen === true ? `<div class="karte"><h2>3 · Besonderheiten</h2><div class="feldgruppe">${zahlFeld('abzug', 'Fläche abziehen (Einbauschrank, Fliesenspiegel)', r.abzug, 'm²', { ph: '0' })}${zahlFeld('zuschlag', 'Fläche dazu (Nischen, Vorsprünge)', r.zuschlag, 'm²', { ph: '0' })}</div></div>` : ''}`;
    } else if (art === 'werte') {
      felder = `<div class="karte"><h2>1 · Aufnehmen</h2><div class="feld" style="margin-bottom:14px"><label for="f-name">Ort (freiwillig)</label><input class="voll" id="f-name" value="${esc(v.raumName)}" placeholder="z. B. Bad oben"></div><div class="feldgruppe">${a.aufnahme.felder.map(f => zahlFeld(f.id, f.label, v.m[f.id], f.einheit, { hilfe: f.hilfe })).join('')}</div></div>`;
    } else {
      felder = `<div class="karte"><h2>1 · Ort</h2><div class="feld"><label for="f-name">Ort (freiwillig)</label><input class="voll" id="f-name" value="${esc(v.raumName)}" placeholder="z. B. Gäste-WC"></div></div>`;
    }
    const opt = (a.optionen || []).length ? `<div class="karte"><h2>${art === 'raum' ? (a.aufnahme.oeffnungen ? '4' : '2') : '2'} · Angaben zur Arbeit</h2><div class="raster" style="gap:16px">${optionenHTML(a, v)}</div></div>` : '';
    const haus = `<div class="karte"><h2>Haus</h2><div class="feldgruppe"><div class="feld"><label for="f-baujahr">Baujahr des Hauses (bzw. letzte Renovierung)</label><div class="eingabe"><input id="f-baujahr" inputmode="numeric" value="${esc(v.baujahr)}" placeholder="z. B. 1978"></div><span class="hilfe">Wichtig für den Asbest-Hinweis (vor 1993).</span></div></div>
      <div class="feld" style="margin-top:12px"><label for="f-notiz">Notiz (freiwillig)</label><textarea class="voll" id="f-notiz" rows="2" placeholder="z. B. Farbe: Alpinaweiß, Tapete Nr. …">${esc(v.notiz)}</textarea></div>
      ${kiFotoKnopfHTML(v)}</div>`;
    el.innerHTML = `<div class="aufnahme"><div class="raster" style="gap:16px">${felder}${opt}${haus}</div><aside class="aufnahme-seite" id="auswertung"></aside></div>`;
    const neu = () => { auswertungZeigen(v, a); };
    el.oninput = e => {
      const t = e.target;
      if (t.id === 'f-name') v.raumName = t.value;
      else if (t.id === 'f-notiz') v.notiz = t.value;
      else if (t.id === 'f-baujahr') v.baujahr = t.value.replace(/\D/g, '').slice(0, 4);
      else if (t.dataset.k) { if (art === 'raum') v.raum[t.dataset.k] = t.value; else v.m[t.dataset.k] = t.value; }
      else if (t.dataset.oe) { const [liste, i, k] = t.dataset.oe.split(':'); v.raum[liste][+i][k] = t.value; }
      else if (t.dataset.o && t.dataset.zahl) { const x = R.lies(t.value); v.o[t.dataset.o] = isNaN(x) ? '' : x; }
      SP.speichern(); neu();
    };
    el.onchange = e => {
      const t = e.target;
      if (t.dataset.o && t.type === 'radio') v.o[t.dataset.o] = t.value;
      else if (t.dataset.o && t.type === 'checkbox') v.o[t.dataset.o] = t.checked;
      else if (t.id === 'f-baujahr' && v.baujahr && !S.haus.baujahr) S.haus.baujahr = v.baujahr;
      SP.speichern(); neu();
    };
    el.onclick = e => {
      const p = e.target.closest('[data-plus]'); if (p) { const l = p.dataset.plus; v.raum[l].push(l === 'fenster' ? { b: '1,20', h: '1,35' } : { b: '0,885', h: '2,01' }); SP.speichern(); neuZeichnen(); }
      const w = e.target.closest('[data-weg]'); if (w) { const [l, i] = w.dataset.weg.split(':'); v.raum[l].splice(+i, 1); SP.speichern(); neuZeichnen(); }
      const k = e.target.closest('[data-act="ki-foto"]'); if (k) kiFotoAuswerten(v, a, el);
    };
    neu();
  }
  async function neuZeichnen() { const y = window.scrollY; route.gleich = true; await route(); window.scrollTo(0, y); }
  function oeffnungHTML(liste, i, o) {
    return `<div class="oeffnung"><span class="nr">${i + 1}</span><div class="eingabe"><label class="versteckt" for="oe-${liste}-${i}-b">Breite</label><input id="oe-${liste}-${i}-b" data-oe="${liste}:${i}:b" inputmode="decimal" value="${esc(o.b)}"><span class="einheit">B m</span></div><div class="eingabe"><label class="versteckt" for="oe-${liste}-${i}-h">Höhe</label><input id="oe-${liste}-${i}-h" data-oe="${liste}:${i}:h" inputmode="decimal" value="${esc(o.h)}"><span class="einheit">H m</span></div><button class="icon-knopf" data-weg="${liste}:${i}" aria-label="Entfernen">${I.weg}</button></div>`;
  }
  function grundrissSVG(R1, a) {
    if (!(R1.l > 0 && R1.b > 0) || R1.l > 100 || R1.b > 100) return '';
    const W = 300, H = 200, pad = 34; const s = Math.min((W - 2 * pad) / R1.l, (H - 2 * pad) / R1.b);
    const w = R1.l * s, h = R1.b * s, x = (W - w) / 2, y = (H - h) / 2;
    return `<svg class="grundriss" viewBox="0 0 ${W} ${H}" style="${katStil(a)}" role="img" aria-label="Grundriss ${z(R1.l)} mal ${z(R1.b)} Meter"><rect class="flaeche" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>
      <text x="${W / 2}" y="${y - 10}" text-anchor="middle">${z(R1.l)} m</text><text x="${x + w + 8}" y="${H / 2 + 4}">${z(R1.b)} m</text>
      <text x="${W / 2}" y="${H / 2 + 5}" text-anchor="middle" style="font-size:15px;fill:var(--text)">${z(R1.boden)} m²</text></svg>`;
  }
  function auswertungZeigen(v, a) {
    const box = $('#auswertung'); if (!box) return;
    const { m, pruef } = messwerte(v);
    let werte = '';
    if (a.aufnahme.art === 'raum') {
      const R1 = m.R;
      werte = `${grundrissSVG(R1, a)}<dl class="werte">${R1.umfang ? `<dt>Umfang</dt><dd>${z(R1.umfang)} m</dd>` : ''}${R1.boden ? `<dt>Bodenfläche</dt><dd>${z(R1.boden)} m²</dd>` : ''}${a.aufnahme.hoehe && R1.h ? `<dt>Wandfläche brutto</dt><dd>${z(R1.wandBrutto)} m²</dd><dt>− Fenster/Türen</dt><dd>${z(R1.oeffFenster + R1.oeffTueren)} m²</dd><dt>Wandfläche netto</dt><dd>${z(R1.wandNetto)} m²</dd>` : ''}${a.aufnahme.oeffnungen && R1.sockel ? `<dt>Sockellänge</dt><dd>${z(R1.sockel)} m</dd>` : ''}</dl>`;
    } else if (a.aufnahme.art === 'werte') {
      werte = `<dl class="werte">${a.aufnahme.felder.map(f => `<dt>${esc(f.label)}</dt><dd>${isNaN(m[f.id]) ? '–' : z(m[f.id])} ${esc(f.einheit)}</dd>`).join('')}</dl>`;
    }
    const fehler = pruef.filter(p => p.stufe === 'fehler');
    const icon = { fehler: I.warn, warnung: I.warn, hinweis: I.info };
    box.innerHTML = `<div class="karte"><h2>Auswertung</h2>${werte}<div class="meldungen">${pruef.map(p => `<div class="meldung ${p.stufe}">${icon[p.stufe]}<span>${esc(p.text)}</span></div>`).join('')}${!fehler.length ? `<div class="meldung gut">${I.haken}<span>Angaben vollständig – Plan, Material und Einkaufsliste sind berechnet.</span></div>` : ''}</div></div>
      ${rotText(v) ? `<div class="schild" style="margin-top:14px">${I.schild}<div><strong>Fachbetrieb beauftragen</strong><p>${esc(rotText(v))}</p></div></div>` : ''}`;
    $$('.eingabe[data-feld]').forEach(e => { const f = e.dataset.feld; e.classList.toggle('fehler', pruef.some(p => p.feld === f && p.stufe === 'fehler')); e.classList.toggle('warnung', pruef.some(p => p.feld === f && p.stufe === 'warnung')); });
  }

  /* ----- KI ----- */
  function kiFotoKnopfHTML(v) {
    const k = SP.kiLesen(); if (!k || !k.schluessel) return `<p class="klein" style="margin-top:10px">${I.ki.replace('<svg', '<svg style="width:16px;height:16px;vertical-align:-3px"')} Mit eigenem KI-Schlüssel (Einstellungen) kann die KI aus Ihrem Foto Maße und Zustand schätzen – freiwillig.</p>`;
    return `<div style="margin-top:12px"><button class="knopf" data-act="ki-foto" ${v.fotos && v.fotos.start ? '' : 'disabled title="Erst im Schnellstart oder unter Ausführen ein Foto aufnehmen"'}>${I.ki}Foto mit KI auswerten</button> <span class="ki-zeichen">KI</span><div id="ki-ergebnis"></div></div>`;
  }
  async function kiFotoAuswerten(v, a, el) {
    const k = SP.kiLesen(); const box = $('#ki-ergebnis'); box.innerHTML = '<p class="klein">Die KI sieht sich das Foto an …</p>';
    try {
      const blob = await SP.fotoLesen(v.fotos.start);
      const r = await KI.fotoAuswerten({ schluessel: k.schluessel, stufe: k.stufe, bildBlob: blob, arbeiten: K.arbeiten, text: arbeit(v.arbeit).titel });
      const rm = r.raum || {};
      box.innerHTML = `<div class="meldung info" style="margin-top:10px">${I.ki}<div><span class="ki-zeichen">KI-generiert – bitte nachmessen</span><p style="margin:6px 0">${esc(r.zustand || '')}</p>${(r.hinweise || []).length ? `<ul>${r.hinweise.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}${rm.laenge ? `<p>Geschätzt: ${z(rm.laenge)} × ${z(rm.breite)}${rm.hoehe ? ` × ${z(rm.hoehe)}` : ''} m, ${rm.fenster ?? '?'} Fenster, ${rm.tueren ?? '?'} Türen.</p>${a.aufnahme.art === 'raum' ? '<button class="knopf klein" data-ki-uebernehmen>Schätzung übernehmen</button>' : ''}` : ''}</div></div>`;
      const ub = $('[data-ki-uebernehmen]'); if (ub) ub.onclick = () => { const f = n => n ? String(n).replace('.', ',') : ''; v.raum.l = f(rm.laenge); v.raum.b = f(rm.breite); if (rm.hoehe) v.raum.h = f(rm.hoehe);
        if (rm.fenster !== null && rm.fenster !== undefined && a.aufnahme.oeffnungen === true) v.raum.fenster = Array.from({ length: rm.fenster }, () => ({ b: '1,20', h: '1,35' }));
        if (rm.tueren !== null && rm.tueren !== undefined && a.aufnahme.oeffnungen) v.raum.tueren = Array.from({ length: rm.tueren }, () => ({ b: '0,885', h: '2,01' }));
        SP.speichern(); neuZeichnen(); toast('Schätzung übernommen – bitte nachmessen.'); };
    } catch (e) { box.innerHTML = `<div class="meldung warnung" style="margin-top:10px">${I.warn}<span>${esc(e.message)}</span></div>`; }
  }
  function kiAnfrage(v) {
    const a = arbeit(v.arbeit); const ok = bereit(v);
    const text = KI.anfrage(v, a, ok ? messwerte(v).m : {}, v.o, ok ? materialListe(v).filter(p => p.an) : [], R);
    const d = dialog('Mit Ihrer KI öffnen', `<p>Diese Anfrage enthält Ihr Vorhaben, die Maße und das berechnete Material. Kopieren Sie sie und fügen Sie sie in die KI Ihrer Wahl ein (z. B. Claude). Ihr Foto hängen Sie dort selbst an. Die App sendet dabei nichts.</p>
      <textarea class="voll" rows="12" readonly id="ki-text">${esc(text)}</textarea>
      <div class="knopf-reihe" style="margin-top:12px"><button class="knopf haupt" data-kopie>${I.kopie}In die Zwischenablage</button>${navigator.share ? `<button class="knopf" data-teilen>${I.teilen}Teilen</button>` : ''}<a class="knopf" href="https://claude.ai/new" target="_blank" rel="noopener">Claude öffnen</a></div>
      <p class="klein" style="margin-top:12px">Antworten einer KI sind KI-generiert, können Fehler enthalten und ersetzen keine Fachberatung.</p>`);
    $('[data-kopie]', d).onclick = () => kopieren(text, 'Anfrage kopiert – jetzt in Ihre KI einfügen.');
    const t = $('[data-teilen]', d); if (t) t.onclick = () => navigator.share({ title: a.titel, text }).catch(() => {});
  }
  async function kopieren(text, meldung) {
    try { await navigator.clipboard.writeText(text); toast(meldung || 'Kopiert.'); }
    catch (e) { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); toast(meldung || 'Kopiert.'); } catch (x) { toast('Kopieren nicht möglich – bitte markieren und kopieren.'); } t.remove(); }
  }
  function dialog(titel, inhalt) {
    const d = document.createElement('dialog');
    d.innerHTML = `<div class="dlg-kopf"><h2>${esc(titel)}</h2><button class="icon-knopf" data-zu aria-label="Schließen">${I.weg}</button></div><div class="dlg-inhalt">${inhalt}</div>`;
    document.body.appendChild(d);
    const zu = () => { d.close(); d.remove(); };
    $('[data-zu]', d).onclick = zu; d.addEventListener('click', e => { if (e.target === d) zu(); }); d.addEventListener('cancel', () => setTimeout(() => d.remove(), 0));
    d.showModal(); d.zu = zu; return d;
  }

  /* ----- Reiter Plan (Zeitplan) ----- */
  function tabPlan(el, v, a, warnHTML) {
    const st = startDatum(v);
    const zp = R.zeitplan(phasen(v), st, { von: S.einst.von, bis: S.einst.bis, sonntagFrei: S.einst.sonntag });
    const tage = []; const tagIdx = new Map();
    const tagVon = d => { const k = d.toDateString(); if (!tagIdx.has(k)) { tagIdx.set(k, tage.length); tage.push({ d: new Date(d), e: [] }); } return tage[tagIdx.get(k)]; };
    zp.eintraege.forEach(e => {
      if (e.art === 'warten') { tagVon(e.von).e.push({ von: e.von, bis: e.bis, t: e.t, art: 'warten', min: e.min, parallel: e.parallel }); return; }
      e.stuecke.forEach((s, i) => tagVon(s.von).e.push({ von: s.von, bis: s.bis, t: e.t + (e.stuecke.length > 1 ? ` (Teil ${i + 1}/${e.stuecke.length})` : ''), art: e.art, min: Math.round((s.bis - s.von) / 60000), hinweis: e.hinweis }));
    });
    const startWert = `${st.getFullYear()}-${String(st.getMonth() + 1).padStart(2, '0')}-${String(st.getDate()).padStart(2, '0')}T${String(st.getHours()).padStart(2, '0')}:${String(st.getMinutes()).padStart(2, '0')}`;
    el.innerHTML = `${warnHTML}
<div class="karte" style="margin-top:${warnHTML ? 14 : 0}px"><div class="abschnitt-kopf"><h2>Zeitplan</h2><div class="knopf-reihe"><label class="klein" for="p-start">Beginn</label><input type="datetime-local" class="voll" style="width:auto;min-height:44px" id="p-start" value="${startWert}"><button class="knopf klein" data-act="ics-plan">${I.kalender}In den Kalender</button></div></div>
  <div class="plan-summe"><div class="kennzahl"><b>${zp.arbeitstage}</b><span>Arbeitstag${zp.arbeitstage === 1 ? '' : 'e'}</span></div><div class="kennzahl"><b>${R.dauerText(zp.arbeitMin)}</b><span>reine Arbeitszeit</span></div><div class="kennzahl"><b>${R.dauerText(zp.wartenMin)}</b><span>Trocken- und Wartezeit</span></div><div class="kennzahl"><b>${kurzDatum(zp.ende)}</b><span>fertig ca. ${uhrzeit(zp.ende)} Uhr</span></div></div>
  <p class="klein" style="margin-top:10px">Arbeitszeit ${S.einst.von}–${S.einst.bis} Uhr${S.einst.sonntag ? ', sonntags frei' : ''} (änderbar in den Einstellungen). Zeiten sind Richtwerte für geübte Heimwerker – planen Sie ruhig etwas Puffer ein.</p>
  ${a.vorlauf ? `<div class="meldung info">${I.info}<div><b>Rechtzeitig besorgen:</b> ${esc(a.vorlauf)}</div></div>` : ''}
  ${tage.map((t, i) => `<div class="tag"><div class="tag-kopf"><b>Tag ${i + 1}</b>${datumText(t.d)}</div>${t.e.map(e => `<div class="zeile-plan" style="${katStil(a)}"><div class="zeit">${uhrzeit(e.von)}${e.art !== 'warten' ? `–${uhrzeit(e.bis)}` : ''}</div><div class="balken ${e.art}"><span class="dauer">${e.art === 'warten' ? `bis ${e.bis.toDateString() !== e.von.toDateString() ? kurzDatum(e.bis) + ' ' : ''}${uhrzeit(e.bis)}` : R.dauerText(e.min)}</span>${e.art === 'warten' ? I.uhr.replace('<svg', '<svg style="width:16px;height:16px;vertical-align:-3px"') + ' ' : ''}<b>${esc(e.t)}</b>${e.parallel ? ' <span class="klein">(läuft nebenher)</span>' : ''}${e.hinweis ? `<div class="klein">${esc(e.hinweis)}</div>` : ''}</div></div>`).join('')}</div>`).join('')}
</div>
<div class="karte"><h2>Was ist zu tun?</h2><ol>${schritteListe(v).map(s => `<li><b>${esc(s.t)}</b> – ${R.dauerText(Math.round(wert(s.min, [messwerte(v).m, v.o]) || 0))}${s.warten ? `, danach ${esc(s.wartenText || 'warten')}` : ''}</li>`).join('')}</ol></div>
${grenzenHTML(a)}`;
    $('#p-start').onchange = e => { v.start = e.target.value; SP.speichern(); neuZeichnen(); };
    $('[data-act="ics-plan"]').onclick = () => {
      const termine = zp.eintraege.filter(e => e.art !== 'warten').map((e, i) => ({ id: v.id + '-' + i, titel: `${a.titel}: ${e.t}`, datum: e.von, text: 'Aus der TW Renovierungs-App' }));
      const tage2 = new Map(); termine.forEach(t => { const k = t.datum.toDateString(); if (!tage2.has(k)) tage2.set(k, { id: v.id + '-' + tage2.size, titel: `${a.titel} – Tag ${tage2.size + 1}`, datum: t.datum, text: '' }); tage2.get(k).text += `• ${t.titel.replace(a.titel + ': ', '')}\n`; });
      herunterladen(new Blob([R.ics([...tage2.values()])], { type: 'text/calendar' }), `${dateiname(a.titel)}-zeitplan.ics`);
    };
  }
  const dateiname = t => R.normal(t).replace(/ /g, '-').slice(0, 40);
  function herunterladen(blob, name) { const u = URL.createObjectURL(blob); const l = document.createElement('a'); l.href = u; l.download = name; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); }

  /* ----- Reiter Material ----- */
  function tabMaterial(el, v, a, warnHTML) {
    const l = materialListe(v);
    const gruppen = K.ABT_REIHE.filter(k => l.some(p => p.abt === k));
    el.innerHTML = `${warnHTML}<div class="karte" style="margin-top:${warnHTML ? 14 : 0}px"><div class="abschnitt-kopf"><h2>Material</h2><span class="klein">Haken = kommt auf die Einkaufsliste</span></div>
      <p class="klein">Mengen mit fachüblichem Verschnitt, aufgerundet auf handelsübliche Gebinde. Unter „Rechenweg“ sehen Sie jede Zahl. Die Angaben auf der Packung des gekauften Produkts haben Vorrang.</p>
      ${gruppen.map(g => `<div class="abt-kopf">${esc(K.ABT[g])}</div>${l.filter(p => p.abt === g).map(p => `<div class="posten ${p.an ? '' : 'aus'}"><input type="checkbox" data-key="${esc(p.key)}" ${p.an ? 'checked' : ''} ${p.menge > 0 ? '' : 'disabled'} aria-label="${esc(p.name)} auf die Liste" style="width:24px;height:24px;accent-color:var(--rot);margin-top:4px"><div><div class="name">${esc(p.name)}</div>${p.detail || p.hinweis ? `<div class="detail">${esc([p.detail, p.hinweis].filter(Boolean).join(' · '))}</div>` : ''}${p.optional && !p.an ? '<div class="detail">empfohlen, bei Bedarf anhaken</div>' : ''}</div><div class="menge">${p.menge > 0 ? z(p.menge) : '–'}<small>${esc(p.einheit)}</small></div>${p.rechnung && p.rechnung.length ? `<details><summary>Rechenweg</summary><ol class="rechenweg">${p.rechnung.map(r => `<li>${esc(r)}</li>`).join('')}</ol></details>` : ''}</div>`).join('')}`).join('')}
    </div>`;
    el.addEventListener('change', e => { const k = e.target.dataset.key; if (!k) return; v.auswahl[k] = e.target.checked; e.target.closest('.posten').classList.toggle('aus', !e.target.checked); SP.speichern(); });
  }

  /* ----- Reiter Werkzeug ----- */
  function tabWerkzeug(el, v, a) {
    const l = werkzeugListe(v);
    const zeile = w => `<div class="wz" data-id="${w.id}"><div class="wz-name">${esc(w.n)}${w.hinweis ? `<small>${esc(w.hinweis)}</small>` : ''}${w.leihbar ? '<small>Kann man im Baumarkt oder bei Werkzeugverleihern mieten</small>' : ''}</div><div class="segment" role="group" aria-label="${esc(w.n)}">${['habe', 'brauche', 'leihe'].map(s => `<button type="button" data-w="${s}" class="${w.st === s ? 'an' : ''}" aria-pressed="${w.st === s}">${{ habe: 'Habe ich', brauche: 'Brauche ich', leihe: 'Leihen' }[s]}</button>`).join('')}</div></div>`;
    const n = { habe: l.filter(w => w.st === 'habe').length, brauche: l.filter(w => w.st === 'brauche').length, leihe: l.filter(w => w.st === 'leihe').length };
    el.innerHTML = `<div class="karte"><div class="abschnitt-kopf"><h2>Werkzeug</h2><span class="klein">${n.habe} vorhanden · ${n.brauche} kaufen · ${n.leihe} leihen</span></div>
      <p class="klein">Bitte einmal durchgehen: Übliches Haushaltswerkzeug steht schon auf „Habe ich“. Nur „Brauche ich“ und „Leihen“ kommen auf die Einkaufsliste. „Habe ich“ merkt sich die App für alle weiteren Vorhaben (Ihre Werkzeugkiste).</p>${l.map(zeile).join('')}</div>`;
    el.onclick = e => { const b = e.target.closest('[data-w]'); if (!b) return; const id = b.closest('.wz').dataset.id; v.werkzeug[id] = b.dataset.w; if (b.dataset.w === 'habe') S.werkzeugkiste[id] = true; else delete S.werkzeugkiste[id]; SP.speichern(); neuZeichnen(); };
  }

  /* ----- Reiter Einkauf (auch Gesamtliste) ----- */
  function listeText(vs) {
    const z1 = [`Baumarkt-Liste${vs.length === 1 ? ' – ' + arbeit(vs[0].arbeit).titel + (vs[0].raumName ? ' (' + vs[0].raumName + ')' : '') : ''}`, ''];
    const alle = vs.flatMap(v => einkaufListe(v).map(p => Object.assign({ v }, p)));
    K.ABT_REIHE.forEach(g => { const l = alle.filter(p => p.abt === g); if (!l.length) return; z1.push(`▸ ${K.ABT[g]}`); l.forEach(p => z1.push(`${p.v.liste[p.key] ? '☑' : '☐'} ${z(p.menge)} ${p.einheit} ${p.name}${p.detail ? ' – ' + p.detail : ''}${vs.length > 1 ? ' [' + arbeit(p.v.arbeit).titel + ']' : ''}`)); z1.push(''); });
    z1.push('Erstellt mit der TW Renovierungs-App · Thomas Willwacher Fliesenlegermeister e.K.');
    return z1.join('\n');
  }
  function tabEinkauf(el, vs, warnHTML) {
    const alle = vs.flatMap(v => einkaufListe(v).map(p => Object.assign({ v }, p)));
    const erledigt = alle.filter(p => p.v.liste[p.key]).length;
    const gruppen = K.ABT_REIHE.filter(g => alle.some(p => p.abt === g));
    el.innerHTML = `${warnHTML || ''}<div class="karte" style="margin-top:${warnHTML ? 14 : 0}px"><div class="abschnitt-kopf"><h2>Baumarkt-Liste</h2><span class="klein">${erledigt} von ${alle.length} im Wagen</span></div>
      <div class="fortschritt" aria-hidden="true"><i style="width:${alle.length ? Math.round(100 * erledigt / alle.length) : 0}%"></i></div>
      <div class="knopf-reihe nicht-drucken" style="margin:14px 0 6px">${navigator.share ? `<button class="knopf" data-act="teilen">${I.teilen}Teilen (WhatsApp, SMS, Mail)</button>` : ''}<button class="knopf" data-act="kopie">${I.kopie}Kopieren</button><button class="knopf" data-act="drucken">${I.drucken}Drucken</button>${erledigt ? `<button class="knopf leise" data-act="zuruecksetzen">Haken entfernen</button>` : ''}</div>
      ${alle.length ? gruppen.map(g => `<div class="abt-kopf">${esc(K.ABT[g])}</div>${alle.filter(p => p.abt === g).map(p => `<label class="einkauf-zeile ${p.v.liste[p.key] ? 'erledigt' : ''}"><input type="checkbox" data-v="${p.v.id}" data-key="${esc(p.key)}" ${p.v.liste[p.key] ? 'checked' : ''}><span class="m">${z(p.menge)} ${esc(p.einheit)}</span><span class="t">${esc(p.name)}${p.detail || vs.length > 1 ? `<small>${esc([p.detail, vs.length > 1 ? arbeit(p.v.arbeit).titel + (p.v.raumName ? ' · ' + p.v.raumName : '') : ''].filter(Boolean).join(' · '))}</small>` : ''}</span></label>`).join('')}`).join('') : '<p class="leer">Die Liste ist leer. Material und Werkzeug wählen Sie in den Reitern davor.</p>'}
      <p class="klein" style="margin-top:14px">Ohne Markenempfehlung – greifen Sie zu Produkten, deren Eignung auf der Packung steht. Erstellt mit der TW Renovierungs-App.</p></div>`;
    el.onchange = e => { const t = e.target; if (!t.dataset.key) return; const v = vorhaben(t.dataset.v); v.liste[t.dataset.key] = t.checked; t.closest('.einkauf-zeile').classList.toggle('erledigt', t.checked); SP.speichern(); const n = alle.filter(p => p.v.liste[p.key]).length; $('.fortschritt i', el).style.width = Math.round(100 * n / alle.length) + '%'; $('.abschnitt-kopf .klein', el).textContent = `${n} von ${alle.length} im Wagen`; if (n === alle.length) toast('Alles im Wagen – viel Erfolg!'); };
    el.onclick = e => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const text = listeText(vs);
      if (b.dataset.act === 'teilen') navigator.share({ title: 'Baumarkt-Liste', text }).catch(() => {});
      if (b.dataset.act === 'kopie') kopieren(text, 'Liste kopiert.');
      if (b.dataset.act === 'drucken') window.print();
      if (b.dataset.act === 'zuruecksetzen') { vs.forEach(v => { v.liste = {}; }); SP.speichern(); neuZeichnen(); }
    };
  }
  function seiteGesamtliste() {
    const vs = S.vorhaben.filter(bereit);
    main().innerHTML = `<h1>Einkauf</h1><p style="color:var(--text-2)">Alle Vorhaben in einer Liste, sortiert nach Baumarkt-Abteilungen.</p><div id="tab"></div>
      ${S.vorhaben.length ? `<div class="karte"><h2>Alle Vorhaben</h2>${S.vorhaben.map(v => { const a = arbeit(v.arbeit); return `<a class="vorhaben-zeile" style="${katStil(a)};box-shadow:none" href="#/v/${v.id}/einkauf"><div><h3>${esc(a.titel)}</h3><div class="klein">${esc(v.raumName || '')} ${bereit(v) ? '' : '· Aufnahme unvollständig'}</div></div><div class="ring" style="--p:${fortschritt(v)}">${fortschritt(v)}%</div></a>`; }).join('')}</div>` : ''}`;
    if (!vs.length) $('#tab').innerHTML = `<div class="karte leer"><p>Noch keine Vorhaben mit vollständiger Aufnahme.</p><a class="knopf haupt" href="#/schnell">${I.kamera}Schnellstart</a></div>`;
    else tabEinkauf($('#tab'), vs);
  }

  /* ----- Reiter Ausführen ----- */
  const uhren = new Set();
  function stoppeUhren() { uhren.forEach(u => clearInterval(u)); uhren.clear(); }
  function piep() { try { const c = new (window.AudioContext || window.webkitAudioContext)(); [0, 0.35, 0.7].forEach(t => { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; o.connect(g); g.connect(c.destination); g.gain.setValueAtTime(0.25, c.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + 0.3); o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.3); }); } catch (e) { /* ohne Ton */ } if (navigator.vibrate) navigator.vibrate([200, 100, 200]); }
  async function tabAusfuehren(el, v, a, warnHTML) {
    const sl = schritteListe(v); const { m } = messwerte(v); const p = fortschritt(v);
    const fotos = async liste => (await Promise.all((liste || []).map(async id => { const u = await SP.fotoUrl(id); return u ? `<figure><img src="${u}" alt="Ihr Foto"><button class="icon-knopf weg" data-foto-weg="${id}" aria-label="Foto entfernen">${I.weg}</button></figure>` : ''; }))).join('');
    const rot = rotText(v);
    el.innerHTML = `${warnHTML}
<div class="karte" style="margin-top:${warnHTML ? 14 : 0}px"><div class="abschnitt-kopf"><h2>Schritt für Schritt</h2><span class="klein">${sl.filter(s => v.schritte[s.t]).length} von ${sl.length} erledigt</span></div><div class="fortschritt"><i style="width:${p}%"></i></div>
  ${a.sicherheit.length ? `<div class="meldung warnung" style="margin-top:12px">${I.warn}<div><b>Vorher lesen:</b><ul style="margin:4px 0 0;padding-left:18px">${a.sicherheit.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div></div>` : ''}</div>
${rot ? '' : sl.map((s, i) => { const dauer = Math.round(wert(s.min, [m, v.o]) || 0); const w = wert(s.warten, [m, v.o]) || 0; const erl = !!v.schritte[s.t];
  return `<article class="schritt ${erl ? 'erledigt' : ''}" style="${katStil(a)}" id="s${i + 1}"><div class="schritt-nr">${erl ? '✓' : i + 1}</div><div><h3>${esc(s.t)}</h3><div class="dauer">${I.uhr.replace('<svg', '<svg style="width:15px;height:15px;vertical-align:-2px"')} ca. ${R.dauerText(dauer)}${w ? ` · danach ${esc(s.wartenText || 'warten')} (${R.dauerText(w)})` : ''}</div><p>${esc(s.x)}</p>${schrittFotoHTML(a, s)}
    ${s.kniff ? `<div class="tipp kniff">${I.gluehbirne}<div><b>Profi-Kniff</b>${esc(s.kniff)}</div></div>` : ''}${s.fehler ? `<div class="tipp fehler">${I.warn}<div><b>Typischer Fehler</b>${esc(s.fehler)}</div></div>` : ''}${s.sicher ? `<div class="tipp sicher">${I.schild}<div><b>Sicherheit</b>${esc(s.sicher)}</div></div>` : ''}
    <div class="schritt-aktion"><button class="knopf ${erl ? '' : 'haupt'}" data-schritt="${esc(s.t)}">${erl ? 'Wieder öffnen' : I.haken + 'Erledigt'}</button>${s.timer ? `<button class="knopf" data-uhr="${s.timer}">${I.uhr}<span class="uhr">${s.timer}:00</span></button>` : ''}</div></div></article>`; }).join('')}
${rot ? '' : grenzenHTML(a)}
<div class="karte" style="margin-top:14px"><h2>Vorher / Nachher</h2><p class="klein">Ihre Fotos bleiben auf diesem Gerät.</p>
  <h3>Vorher</h3><div class="fotos-reihe">${await fotos(v.fotos.vorher)}<label class="foto-neu">${I.kamera}Foto<input type="file" accept="image/*" capture="environment" class="versteckt" data-foto="vorher"></label></div>
  <h3 style="margin-top:16px">Nachher</h3><div class="fotos-reihe">${await fotos(v.fotos.nachher)}<label class="foto-neu">${I.kamera}Foto<input type="file" accept="image/*" capture="environment" class="versteckt" data-foto="nachher"></label></div></div>`;
    el.onclick = async e => {
      const b = e.target.closest('[data-schritt]');
      if (b) { const t = b.dataset.schritt; v.schritte[t] = !v.schritte[t]; SP.speichern(); await neuZeichnen(); if (fortschritt(v) === 100) toast('Geschafft! Machen Sie ein Nachher-Foto.'); return; }
      const u = e.target.closest('[data-uhr]');
      if (u) { if (u.dataset.laeuft) { clearInterval(+u.dataset.laeuft); uhren.delete(+u.dataset.laeuft); delete u.dataset.laeuft; $('.uhr', u).textContent = `${u.dataset.uhr}:00`; return; }
        let rest = +u.dataset.uhr * 60; const anz = $('.uhr', u);
        const id = setInterval(() => { rest--; anz.textContent = `${Math.floor(rest / 60)}:${String(rest % 60).padStart(2, '0')}`; if (rest <= 0) { clearInterval(id); uhren.delete(id); delete u.dataset.laeuft; anz.textContent = 'fertig'; piep(); toast('Die Zeit ist um.'); } }, 1000);
        uhren.add(id); u.dataset.laeuft = id; return; }
      const fw = e.target.closest('[data-foto-weg]');
      if (fw) { e.preventDefault(); const id = fw.dataset.fotoWeg; ['vorher', 'nachher'].forEach(k => { v.fotos[k] = v.fotos[k].filter(x => x !== id); }); if (v.fotos.start === id) v.fotos.start = v.fotos.vorher[0] || ''; SP.speichern(); SP.fotoLoeschen(id); await neuZeichnen(); }
    };
    el.onchange = async e => { const t = e.target; if (!t.dataset.foto || !t.files[0]) return; try { const b = await SP.verkleinern(t.files[0]); const id = await SP.fotoSpeichern(b); v.fotos[t.dataset.foto].push(id); if (!v.fotos.start) v.fotos.start = id; SP.speichern(); await neuZeichnen(); toast('Foto gespeichert.'); } catch (err) { toast(err.message); } };
  }

  /* ---------- Mein Haus ---------- */
  function seiteHaus() {
    const h = S.haus; const pkt = wartungsPunkte().sort((a, b) => (b.aktiv - a.aktiv) || (a.naechst - b.naechst));
    const notiz = (k, l, ph) => `<div class="feld"><label for="h-${k}">${esc(l)}</label><input class="voll" id="h-${k}" data-notiz="${k}" value="${esc(h.notizen[k] || '')}" placeholder="${esc(ph)}"></div>`;
    main().innerHTML = `<h1>Mein Haus</h1><p style="color:var(--text-2)">Ihr Wartungs- und Kontrollplan mit Erinnerungen. Erledigt antippen – die nächste Fälligkeit rechnet die App selbst aus.</p>
<div class="raster zwei" style="align-items:start">
  <div class="karte"><div class="abschnitt-kopf"><h2>Wartungsplan</h2><button class="knopf klein" data-act="ics-alle">${I.kalender}Alle in den Kalender</button></div>
    ${pkt.map(p => `<div class="wartung" data-id="${p.id}"><span class="ampel ${p.aktiv ? ampel(p.naechst) : 'aus'}" title="${p.aktiv ? ({ faellig: 'fällig', bald: 'bald fällig' }[ampel(p.naechst)] || 'in Ordnung') : 'abgeschaltet'}"></span><div><h3>${esc(p.titel)}</h3><p>${p.aktiv ? `${ampel(p.naechst) === 'faellig' ? '<b style="color:var(--rot-hell)">fällig</b>' : 'nächste: ' + kurzDatum(p.naechst)} · alle ${p.monate === 1 ? 'Monat' : p.monate + ' Monate'}${p.zuletzt ? ' · zuletzt ' + kurzDatum(new Date(p.zuletzt)) : ''}` : 'abgeschaltet'}</p>${p.text ? `<details><summary class="klein" style="cursor:pointer">Worauf achten?</summary><p class="klein">${esc(p.text)}</p></details>` : ''}</div>
      <div class="knopf-reihe">${p.aktiv ? `<button class="knopf klein" data-erledigt="${p.id}">${I.haken}Erledigt</button>` : ''}${p.arbeit ? `<a class="knopf klein leise" href="#/arbeit/${p.arbeit}">Anleitung</a>` : ''}<button class="knopf klein leise" data-ics="${p.id}" aria-label="In den Kalender">${I.kalender}</button><label class="haken" title="Im Plan"><input type="checkbox" data-aktiv="${p.id}" ${p.aktiv ? 'checked' : ''}><span class="versteckt">aktiv</span></label>${p.eigen ? `<button class="icon-knopf" data-eigen-weg="${p.id}" aria-label="Entfernen">${I.weg}</button>` : ''}</div></div>`).join('')}
    <form class="feldgruppe" id="eigen" style="margin-top:16px;align-items:end"><div class="feld"><label for="e-titel">Eigene Kontrolle</label><input class="voll" id="e-titel" placeholder="z. B. Garagentor schmieren" required></div><div class="feld"><label for="e-monate">alle … Monate</label><input class="voll" id="e-monate" inputmode="numeric" value="12"></div><button class="knopf">${I.plus}Hinzufügen</button></form>
  </div>
  <div><div class="karte"><h2>Wichtige Orte im Haus</h2><p class="klein">Im Notfall zählt jede Minute – tragen Sie ein, wo was ist.</p><div class="raster" style="gap:12px">
    <div class="feld"><label for="h-baujahr">Baujahr bzw. letzte große Renovierung</label><input class="voll" id="h-baujahr" inputmode="numeric" value="${esc(h.baujahr)}" placeholder="z. B. 1978"></div>
    ${notiz('wasser', 'Hauptwasserhahn', 'z. B. Keller, Hausanschlussraum links')}${notiz('strom', 'Sicherungskasten / Hauptschalter', 'z. B. Flur EG, hinter der Tür')}${notiz('gas', 'Gas-Absperrhahn bzw. Heizöltank', 'z. B. Heizraum')}${notiz('heizung', 'Heizung (Art, Solldruck, Wartungsfirma)', 'z. B. Öl-Brennwert, 1,5 bar')}${notiz('notruf', 'Notrufnummern (Gasversorger, Wasserwerk)', 'Nummern vom Versorger')}</div></div>
    <div class="meldung info" style="margin-top:14px">${I.info}<span>Bei Gasgeruch: keine Schalter betätigen, Fenster öffnen, Haus verlassen und von draußen den Notruf des Gasversorgers bzw. 112 wählen.</span></div></div>
</div>`;
    const el = main();
    el.oninput = e => { const t = e.target; if (t.dataset.notiz) { h.notizen[t.dataset.notiz] = t.value; SP.speichern(); } if (t.id === 'h-baujahr') { h.baujahr = t.value.replace(/\D/g, '').slice(0, 4); SP.speichern(); } };
    el.onchange = e => { const t = e.target; if (t.dataset.aktiv) { h.wartung[t.dataset.aktiv] = Object.assign(h.wartung[t.dataset.aktiv] || {}, { aktiv: t.checked }); SP.speichern(); seiteHaus(); navMarkieren('haus'); } };
    el.onclick = e => {
      const b = e.target.closest('[data-erledigt]'); if (b) { h.wartung[b.dataset.erledigt] = Object.assign(h.wartung[b.dataset.erledigt] || {}, { zuletzt: heute().toISOString() }); SP.speichern(); seiteHaus(); navMarkieren('haus'); toast('Eingetragen – nächste Fälligkeit berechnet.'); return; }
      const ic = e.target.closest('[data-ics]'); if (ic) { const p = wartungsPunkte().find(x => x.id === ic.dataset.ics); herunterladen(new Blob([R.ics([{ id: p.id, titel: p.titel, datum: p.naechst, monate: p.monate, text: (p.text || '') + '\nAus der TW Renovierungs-App' }])], { type: 'text/calendar' }), `${dateiname(p.titel)}.ics`); return; }
      if (e.target.closest('[data-act="ics-alle"]')) { const l = wartungsPunkte().filter(p => p.aktiv).map(p => ({ id: p.id, titel: p.titel, datum: p.naechst, monate: p.monate, text: (p.text || '') + '\nAus der TW Renovierungs-App' })); herunterladen(new Blob([R.ics(l)], { type: 'text/calendar' }), 'mein-haus-wartungsplan.ics'); toast(`${l.length} Erinnerungen exportiert – Datei mit dem Kalender öffnen.`); return; }
      const ew = e.target.closest('[data-eigen-weg]'); if (ew) { h.eigene = h.eigene.filter(x => x.id !== ew.dataset.eigenWeg); SP.speichern(); seiteHaus(); }
    };
    $('#eigen').onsubmit = e => { e.preventDefault(); const t = $('#e-titel').value.trim(); const mo = Math.max(1, Math.min(120, parseInt($('#e-monate').value, 10) || 12)); if (!t) return; h.eigene.push({ id: 'e' + SP.id(), titel: t, monate: mo }); SP.speichern(); seiteHaus(); };
  }

  /* ---------- Einstellungen ---------- */
  function seiteEinstellungen() {
    const k = SP.kiLesen() || {}; const e = S.einst;
    main().innerHTML = `<h1>Einstellungen</h1><div class="raster zwei" style="align-items:start">
  <div class="karte"><h2>Arbeitszeit für den Zeitplan</h2><div class="feldgruppe"><div class="feld"><label for="e-von">Beginn (Uhr)</label><input class="voll" id="e-von" type="number" min="5" max="12" value="${e.von}"></div><div class="feld"><label for="e-bis">Ende (Uhr)</label><input class="voll" id="e-bis" type="number" min="12" max="23" value="${e.bis}"></div></div>
    <label class="haken"><input type="checkbox" id="e-sonntag" ${e.sonntag ? 'checked' : ''}>Sonntags nicht arbeiten (Sonn- und Feiertagsruhe)</label>
    <h2 style="margin-top:18px">Darstellung</h2><div class="wahl">${[['auto', 'Wie das Gerät'], ['dunkel', 'Dunkel'], ['hell', 'Hell']].map(t => `<label><input type="radio" name="thema" value="${t[0]}" ${e.thema === t[0] ? 'checked' : ''}>${t[1]}</label>`).join('')}</div></div>
  <div class="karte"><h2>Eigener KI-Schlüssel <span class="ki-zeichen">freiwillig</span></h2>
    <p>Ohne Schlüssel funktioniert alles. Mit einem eigenen Schlüssel von Anthropic kann die KI aus Ihrem Foto Maße und Zustand schätzen. Kosten trägt der Inhaber des Schlüssels.</p>
    <div class="meldung warnung">${I.warn}<span><b>Datenschutz:</b> Wenn Sie die KI-Auswertung nutzen, werden Ihr Foto und der Text direkt von Ihrem Browser an Anthropic (USA) gesendet. Der Schlüssel bleibt nur in diesem Browser gespeichert und wird nicht in Sicherungen exportiert.</span></div>
    <div class="feld" style="margin-top:12px"><label for="e-key">Anthropic-API-Schlüssel</label><input class="voll" id="e-key" type="password" autocomplete="off" value="${esc(k.schluessel || '')}" placeholder="sk-ant-…"></div>
    <div class="feld" style="margin-top:10px"><label for="e-stufe">Gründlichkeit</label><select class="voll" id="e-stufe">${[['schnell', 'Schnell (günstig)'], ['standard', 'Standard'], ['gruendlich', 'Gründlich']].map(s => `<option value="${s[0]}" ${(k.stufe || 'standard') === s[0] ? 'selected' : ''}>${s[1]}</option>`).join('')}</select></div>
    <div class="knopf-reihe" style="margin-top:12px"><button class="knopf" id="e-key-speichern">Speichern</button><button class="knopf leise" id="e-key-weg">Schlüssel entfernen</button></div>
    <p class="klein" style="margin-top:10px">KI-Ergebnisse sind als „KI-generiert“ gekennzeichnet (KI-Verordnung Art. 50), können Fehler enthalten und ersetzen keine Fachberatung.</p></div>
  <div class="karte"><h2>Sicherung</h2><p>Alle Vorhaben, Mein Haus und Fotos als eine Datei sichern – z. B. vor dem Gerätewechsel.</p><div class="knopf-reihe"><button class="knopf" id="e-export">${I.runter}Sicherung speichern</button><label class="knopf">${I.hoch}Sicherung laden<input type="file" accept="application/json,.json" class="versteckt" id="e-import"></label></div></div>
  <div class="karte"><h2>Meine Werkzeugkiste</h2>${Object.keys(S.werkzeugkiste).length ? `<ul>${Object.keys(S.werkzeugkiste).filter(id => K.W[id]).map(id => `<li>${esc(K.W[id].n)}</li>`).join('')}</ul><button class="knopf leise klein" id="e-wz-leer">Liste leeren</button>` : '<p class="klein">Noch leer – im Reiter „Werkzeug“ auf „Habe ich“ tippen.</p>'}</div>
</div>`;
    const sp = () => { e.von = Math.max(5, Math.min(12, +$('#e-von').value || 8)); e.bis = Math.max(e.von + 2, Math.min(23, +$('#e-bis').value || 18)); e.sonntag = $('#e-sonntag').checked; SP.speichern(); };
    ['#e-von', '#e-bis', '#e-sonntag'].forEach(s => $(s).onchange = sp);
    $$('[name="thema"]').forEach(r => r.onchange = () => { e.thema = r.value; SP.speichern(); themaSetzen(); });
    $('#e-key-speichern').onclick = () => { const s = $('#e-key').value.trim(); SP.kiSchreiben(s ? { schluessel: s, stufe: $('#e-stufe').value } : null); toast(s ? 'Schlüssel gespeichert (nur in diesem Browser).' : 'Kein Schlüssel gespeichert.'); };
    $('#e-key-weg').onclick = () => { SP.kiSchreiben(null); $('#e-key').value = ''; toast('Schlüssel entfernt.'); };
    $('#e-export').onclick = async () => { const b = await SP.exportieren(); herunterladen(b, `tw-renovierung-sicherung-${new Date().toISOString().slice(0, 10)}.json`); };
    $('#e-import').onchange = async ev => { const f = ev.target.files[0]; if (!f) return; try { await SP.importieren(f); toast('Sicherung geladen.'); setTimeout(() => location.reload(), 600); } catch (err) { toast(err.message); } };
    const wl = $('#e-wz-leer'); if (wl) wl.onclick = () => { S.werkzeugkiste = {}; SP.speichern(); seiteEinstellungen(); };
  }
  function themaSetzen() { document.documentElement.dataset.thema = S.einst.thema || 'dunkel'; }

  /* ---------- Über diese App ---------- */
  function seiteUeber() {
    const ST = window.TW_STAND || {};
    const proBereich = K.BEREICHE.map(b => [b.name, K.arbeiten.filter(a => a.bereich === b.id).length]);
    const schritte = K.arbeiten.reduce((s, a) => s + a.schritte.length, 0);
    const kniffe = K.arbeiten.reduce((s, a) => s + a.schritte.filter(x => x.kniff).length, 0);
    const fehler = K.arbeiten.reduce((s, a) => s + a.schritte.filter(x => x.fehler).length, 0);
    const kontrollen = K.arbeiten.filter(a => a.wartung).length + K.KONTROLLEN.length;
    const fotos = Object.keys(window.TW_BILDER || {}).length;
    const videos = (window.TW_VIDEOS || []).length;
    const bilder = Object.entries(window.TW_BILDER || {});
    main().innerHTML = `<div class="prosa">
<div class="logo-platte" style="padding:12px 16px;margin-bottom:18px"><a href="${RECHT.web}" target="_blank" rel="noopener"><img src="bilder/tw-logo.jpg" alt="${FIRMA}" style="height:40px"></a></div>
<h1>Über diese App</h1>
<p><b>Die TW Renovierungs-App</b> ist eine kostenlose Planungshilfe für Hauseigentümerinnen und Hauseigentümer, die Reparaturen und Renovierungen im eigenen Haus selbst organisieren, einkaufen und ausführen. Sie ist ein Geschenk von ${FIRMA}.</p>
<h2>Was die App kann</h2><ul>
<li><b>Schnellstart:</b> Foto machen und ein Wort tippen oder sagen („tapezieren“, „Klo läuft“) – die App erkennt das Vorhaben über Schlagwörter, auch mit Tippfehlern.</li>
<li><b>Aufnahme:</b> Raum-Assistent für Länge, Breite, Höhe, Fenster und Türen mit Plausibilitätsprüfung (erkennt z. B. Zentimeter statt Meter) und Grundriss-Skizze.</li>
<li><b>Plan:</b> echter Zeitplan nach Tagen und Uhrzeiten mit Trocken- und Wartezeiten, Arbeitszeit einstellbar, Export in den Kalender.</li>
<li><b>Material:</b> Mengen mit fachüblichem Verschnitt, umgerechnet auf handelsübliche Gebinde – jede Zahl mit aufklappbarem Rechenweg.</li>
<li><b>Werkzeug:</b> „Habe ich“, „Brauche ich“, „Leihen“ – nur Fehlendes kommt auf die Liste; Ihre Werkzeugkiste merkt sich die App.</li>
<li><b>Baumarkt-Liste:</b> sortiert nach Abteilungen, abhaken im Laden, teilen per WhatsApp, SMS oder Mail, kopieren, drucken – auch für alle Vorhaben zusammen.</li>
<li><b>Ausführen:</b> Schritt für Schritt mit Profi-Kniff, typischem Fehler und Sicherheitshinweis, Kurzzeitwecker für Einwirk- und Wartezeiten, Fortschritt, Vorher-/Nachher-Fotos.</li>
<li><b>Mein Haus:</b> Wartungs- und Kontrollplan mit Ampel, Erledigt-Knopf und Kalender-Erinnerungen (.ics), dazu wichtige Orte im Haus.</li>
<li><b>KI freiwillig:</b> „Mit Ihrer KI öffnen“ legt eine fertige Anfrage in die Zwischenablage; mit eigenem KI-Schlüssel schätzt die KI aus dem Foto Maße und Zustand. Ohne KI funktioniert alles.</li></ul>
<h2>Umfang in Zahlen</h2><table class="zahlen-tabelle"><tbody>
${proBereich.map(([n, c]) => `<tr><td>Arbeiten ${esc(n)}</td><td>${c}</td></tr>`).join('')}
<tr><th>Arbeiten gesamt (je mit eigenem Materialrechner)</th><th>${K.arbeiten.length}</th></tr>
<tr><td>Arbeitsschritte gesamt</td><td>${schritte}</td></tr><tr><td>Profi-Kniffe</td><td>${kniffe}</td></tr><tr><td>Typische Fehler</td><td>${fehler}</td></tr>
<tr><td>Kontrollen im Wartungsplan</td><td>${kontrollen}</td></tr><tr><td>Werkzeuge im Verzeichnis</td><td>${Object.keys(K.W).length}</td></tr>
<tr><td>Fotos (davon KI-generiert)</td><td>${fotos} (${Object.values(window.TW_BILDER || {}).filter(b => b.ki).length})</td></tr><tr><td>Erklärvideos</td><td>${videos}</td></tr>
${ST.mb ? `<tr><td>Speicherbedarf der App (ohne Videos / mit Videos)</td><td>${z(ST.mbOhneVideos, 1)} MB / ${z(ST.mb, 1)} MB</td></tr>` : ''}
</tbody></table>
<h2>Was die App bewusst nicht macht</h2><p>Fliesenarbeiten sind bewusst nicht enthalten – dafür kommt eine eigene App. Arbeiten an 230 V, an Gasleitungen, an der Brennereinstellung, an der Statik und an Materialien mit Asbestverdacht (z. B. alte Kleber, Spachtelmassen, Floor-Flex-Platten in Häusern vor 1993) bekommen ein rotes Schild „Fachbetrieb beauftragen“ statt einer Anleitung. Bei Heizung und Elektrik beschreibt die App nur Eigenkontrollen, die Laien erlaubt sind.</p>
<h2>Kostenlos und ohne Gewähr</h2><p>Die App ist eine Planungshilfe und ersetzt keine Fachberatung. Alle Angaben sind sorgfältig zusammengestellt, aber ohne Gewähr. Die Angaben auf den Verpackungen der verwendeten Produkte und die Anleitungen der Hersteller haben Vorrang. Die Firma ${FIRMA} arbeitet ausschließlich im Objektbereich – diese App ist ein Geschenk und kein Angebot für Privataufträge.</p>
<h2 id="datenschutz">Datenschutz</h2><p>Die App setzt keine Cookies und lädt nichts von fremden Servern. Ihre Vorhaben, Notizen und Fotos werden ausschließlich auf Ihrem Gerät gespeichert (Browser-Speicher). Eine Sicherung als Datei erstellen Sie selbst. Die Spracheingabe nutzt – nur wenn Sie sie selbst starten – die Spracherkennung Ihres Browsers; bei Chrome und Edge läuft diese über Server von Google bzw. Microsoft. Nur wenn Sie freiwillig einen eigenen KI-Schlüssel eintragen und die KI-Auswertung starten, werden Foto und Text an den gewählten KI-Anbieter (Anthropic) gesendet. Ausführlich: <a href="${RECHT.datenschutz}" target="_blank" rel="noopener">Datenschutzerklärung</a>.</p>
<h2>Geräte und Installation</h2><p>Die App läuft im Browser auf PC, Tablet und Handy (aktuelle Versionen von Chrome, Edge, Safari, Firefox, Samsung Internet). Nach dem ersten Öffnen funktioniert sie auch ohne Internet. Installieren: am PC und unter Android über „Als App installieren“ bzw. das Browser-Menü; am iPhone/iPad in Safari über „Teilen“ → „Zum Home-Bildschirm“.</p>
<h2>Kontakt und Impressum</h2><p>Kontakt nur schriftlich per E-Mail: <a href="mailto:${RECHT.mail}">${RECHT.mail}</a> · <a href="${RECHT.impressum}" target="_blank" rel="noopener">Impressum</a> · <a href="${RECHT.web}" target="_blank" rel="noopener">www.thomas-willwacher.de</a></p>
<h2 id="bildnachweis">Bildnachweis</h2>${bilder.length ? `<ul>${bilder.map(([k, b]) => `<li>${esc(k)}: ${esc(b.titel || '')}${b.ki ? '' : ` – ${esc(b.urheber)}, ${esc(b.lizenz)}`}${b.quelle ? ` (<a href="${esc(b.quelle)}" target="_blank" rel="noopener">Quelle</a>)` : ''}${b.ki ? ' – KI-generiert (fotorealistisch), erstellt im Auftrag von Thomas Willwacher Fliesenlegermeister e.K.' : ''}</li>`).join('')}</ul>` : '<p>In dieser Fassung sind noch keine Fotos eingebunden. Die Titelflächen der Arbeiten sind ruhige Farbflächen in der Farbe des jeweiligen Bereichs – keine Fotos, keine Zeichnungen. Die Erklärvideos sind Bildschirmaufnahmen dieser App.</p>'}
<h2>Lizenzen</h2><ul><li>Schriften „Oswald“ und „Source Sans 3“ – SIL Open Font License 1.1 (lokal eingebunden, siehe LIZENZEN.txt)</li><li>Programmcode der App: © ${FIRMA}. Keine Fremdbibliotheken.</li><li>Firmenlogo: © ${FIRMA}, alle Rechte vorbehalten.</li></ul>
<p class="klein">Version ${esc(window.TW_VERSION || '')}</p>
</div>`;
  }

  /* ---------- Installation ---------- */
  let installEvent = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvent = e; $$('[data-act="installieren"]').forEach(b => b.hidden = false); });
  function installieren() { if (installEvent) { installEvent.prompt(); installEvent.userChoice.finally(() => { installEvent = null; $$('[data-act="installieren"]').forEach(b => b.hidden = true); }); } }

  /* ---------- Start ---------- */
  themaSetzen(); geruest();
  window.addEventListener('hashchange', route);
  window.addEventListener('tw-speicher-voll', () => toast('Der Speicher des Browsers ist voll – bitte eine Sicherung speichern und alte Fotos löschen.'));
  route();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
  window.TW_APP = { dialog, toast, I, esc };
})();
