#!/usr/bin/env node
/*
 * Öffentliche Fassung: Namen echter Köche aus den Rezeptdaten entfernen (Freigabe Thomas, 02.11.2026).
 * Aufruf:  node werkzeug/namen_frei.js daten
 * Muss nach jedem Verpacken (frei_paket.py) erneut laufen – gehört dort als letzter Schritt hinein.
 * Idempotent: ein zweiter Lauf ändert nichts mehr.
 *
 * Was passiert:
 *  - Rezepttitel: „… nach Art von <Name>“ fällt weg. Gibt es den Titel dann schon, kommt „– Sterneküchen-Fassung“ dazu.
 *  - Originaltitel, Kurztext, Hintergrund, Schritte, Profitipps, Varianten, Beilagen, Zutaten-Hinweise:
 *    Wendungen wie „nach Art von <Name>“, „<Name>s Empfehlung“, „<Name> empfiehlt“ werden neutral umformuliert,
 *    übrige Sätze mit Namen echter Köche entfallen.
 *  - Koch-Angaben und Quellen zu Köchen entfallen; Schlagworte mit Namen entfallen.
 *  - Die 13 Bühnen-Köche werden auf ihre frei erfundenen Figuren umgestellt („Der Sternekoch aus Bayern“ …),
 *    damit die Bühne weiter ihre Spezialrezepte findet. Alle anderen Köche verschwinden aus der Köche-Liste.
 */
const fs = require('fs'), path = require('path');
const D = process.argv[2] || 'daten';

const FIGUR = { // id -> [Figur-Titel, Herkunft]  (identisch mit OEFF in js/app.js)
  'paul-bocuse': ['Der Meisterkoch Frankreichs', 'Frankreich'], 'jiro-ono': ['Der Sternekoch Japans', 'Japan'],
  'thomas-keller': ['Der Sternekoch der USA', 'USA'], 'alfons-schuhbeck': ['Der Sternekoch aus Bayern', 'Bayern'],
  'harald-wohlfahrt': ['Der Sternekoch aus dem Schwarzwald', 'Schwarzwald'], 'johann-lafer': ['Der Sternekoch aus dem Rheinland', 'Rheinland'],
  'massimo-bottura': ['Der Sternekoch Italiens', 'Italien'], 'ferran-adria': ['Der Sternekoch Spaniens', 'Spanien'],
  'eckart-witzigmann': ['Der Sternekoch aus Österreich', 'Österreich'], 'gordon-ramsay': ['Der Sternekoch Englands', 'England'],
  'yotam-ottolenghi': ['Der Sternekoch des Orients', 'Orient'], 'marcus-samuelsson': ['Der Sternekoch Afrikas', 'Afrika'],
  'curtis-stone': ['Der Sternekoch Ozeaniens', 'Ozeanien']
};
const FIGUR_NAMEN = new Set(Object.values(FIGUR).map(f => f[0]));
// Nachnamen, die auch normale Wörter oder Gerichte/Lokale sind – nur als vollständiger Name erkennen
const MEHRDEUTIG = new Set(['Brown', 'Wolf', 'Meyer', 'Chang', 'Smith', 'Point', 'Pepe', 'Prinz', 'Garten', 'Oliver', 'Lee', 'Müller',
  'Hollywood', 'Gordon', 'Blanc', 'Stein', 'Thomas', 'Wiener', 'Keller', 'Tan', 'Low', 'Yan', 'Shah', 'Bronze', 'Gundel', 'Dobos',
  'Hawelka', 'Prato', 'Diat', 'Fai', 'Lichter', 'Child', 'Rach', 'Perry', 'Nguyen', 'Herrmann', 'Walli', 'Stone', 'Eden',
  'Nathan', 'Hercules', 'Kennedy', 'Taylor', 'Kim', 'Chen', 'Wong', 'Huang', 'Phan', 'Singh', 'Musa', 'García', 'Martínez', 'Rodriguez',
  'Rivera', 'Maier', 'Berry', 'Parks', 'Neal', 'Thompson', 'Hughes', 'Rhodes', 'Moran', 'Kalla', 'Beard', 'Bryant', 'Crawford', 'Lawson',
  'Granger', 'Roca', 'Favre', 'Andrés', 'Espinosa', 'Morales', 'Picard', 'Brazier', 'Kwan', 'Kwong', 'Moju', 'Fiso', 'Musa', 'Zada']);
const ZUSATZ = ['Francis Mallmann', 'Neil Perry']; // in Texten genannte Köche, die nicht in der Köche-Liste stehen

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ladeK = f => { const s = fs.readFileSync(path.join(D, f), 'utf8'); return { kopf: s.slice(0, s.indexOf(',') + 1), j: JSON.parse(s.slice(s.indexOf(',') + 1, s.lastIndexOf(')'))), fuss: s.slice(s.lastIndexOf(')')) }; };
const idxZeilen = fs.readFileSync(path.join(D, 'index.js'), 'utf8').split('\n');
const iI = idxZeilen.findIndex(l => l.startsWith('KB.INDEX=')), iK = idxZeilen.findIndex(l => l.startsWith('KB.KOECHE='));
const INDEX = JSON.parse(idxZeilen[iI].slice(9).replace(/;\s*$/, ''));
const KOECHE = JSON.parse(idxZeilen[iK].slice(10).replace(/;\s*$/, ''));
const dateien = fs.readdirSync(D).filter(f => /^k-.*\.js$/.test(f)).sort();
const daten = dateien.map(f => [f, ladeK(f)]);

// --- Namensliste ---
const namen = new Set(ZUSATZ);
KOECHE.forEach(k => { if (!FIGUR_NAMEN.has(k.name)) namen.add(k.name); });
daten.forEach(([, d]) => d.j.forEach(r => (r.koeche || []).forEach(k => k.name && !FIGUR_NAMEN.has(k.name) && namen.add(k.name))));
['József C. Dobos'].forEach(n => namen.delete(n)); // Erfinder der Dobostorte (1885) – Herkunftsgeschichte bleibt
const nachnamen = new Set();
for (const n of namen) { const t = n.split(' ').pop(); if (t.length >= 4 && !MEHRDEUTIG.has(t)) nachnamen.add(t); }
const alle = [...namen].sort((a, b) => b.length - a.length).map(esc);
const NAME = `(?:${alle.join('|')})(?:s|’s|'s)?`;
const NACH = [...nachnamen].sort((a, b) => b.length - a.length).map(esc);
const IRGEND = new RegExp(`(?:${alle.join('|')})|(?<![\\p{L}])(?:${NACH.join('|')})(?:s|’s|'s)?(?![\\p{L}])`, 'u');
const ART = new RegExp(`\\s*(?:nach Art|im Stil|à la|in der Art|nach) (?:von |des |der )?(?:Brüder )?(?:${alle.join('|')}|${NACH.join('|')})(?:s)?`, 'g');
const KLAMMER = new RegExp(`\\s*\\((?:[^()]*?)(?:${alle.join('|')}|${NACH.join('|')})(?:[^()]*?)\\)`, 'g');
const EXTRA = /\s*\((?:Paolo Bini|Takahiko Kondo|Nonna Ancella)\)|Clafoutis de Monsieur Paul – /g; // Personen ohne Eintrag in der Köche-Liste
const titelSauber = t => t.replace(ART, '').replace(EXTRA, '').replace(KLAMMER, '').replace(/\s*[–-]\s*$/, '').replace(/\s{2,}/g, ' ').trim();

let stat = { titel: 0, saetze: 0, eintraege: 0, quellen: 0, koeche: 0 };
function umformulieren(s) {
  return s.replace(ART, '')
    .replace(new RegExp(`\\(?${NAME} Empfehlung\\)?`, 'g'), m => m.startsWith('(') ? '(Profi-Empfehlung)' : 'Profi-Empfehlung')
    .replace(new RegExp(`(^|[.!?]\\s+)${NAME} (empfiehlt|rät|schwört)`, 'g'), '$1Ein Profi $2')
    .replace(/\s{2,}/g, ' ').replace(/\s+([,.;:!?)])/g, '$1');
}
const RUECKBEZUG = /^(?:Sein|Seine|Seinen|Seinem|Seiner|Seines|Er|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres|Sie (?:hat|hatte|gilt|nennt|empfiehlt|macht)|Dies ist eine|Diese Fassung|Diese Version|Bei ihm|Bei ihr|Dort|Dieses Rezept|Diese Anleitung|Historisch gesichert|Gesichert ist|Belegt ist|Ob das stimmt|Ob die Geschichte)\b/;
const META = /kenne ich|meinen Quellen|aus dem Buch|im Buch|nach Art von|Grundlage der Mengen|in eigenen Worten|kein Abdruck|unter seinem Namen|unter ihrem Namen|konnte ich|habe ich|in der Recherche|nicht sein Originalrezept|nicht ihr Originalrezept|im Stil seiner|im Stil ihrer|Originalrezept/;
const DOMAIN = new RegExp(`\\b(?:${NACH.map(n => n.toLowerCase()).join('|')})\\.(?:de|com|at|ch|it|fr|co\\.uk|es)\\b`, 'i');
function saetzeOhneNamen(s) {
  if (!IRGEND.test(s) && !DOMAIN.test(s) && !META.test(s)) return s;
  s = s.replace(/\b([A-ZÄÖÜ]|\d{1,2})\. (?=[A-ZÄÖÜ])/g, '$1.\u00a0'); // Initialen nicht als Satzende werten
  s = s.replace(/„[^“]*“/g, z => z.replace(/[.!?]/g, c => ({ '.': '\u2024', '!': '\u01c3', '?': '\u2e2e' })[c]));
  const teile = s.split(/(?<=[.!?]) +(?=[A-ZÄÖÜ„"(])/);
  let vorigeRaus = false;
  const rest = teile.filter(t => {
    const raus = IRGEND.test(t) || DOMAIN.test(t) || META.test(t) || (vorigeRaus && RUECKBEZUG.test(t));
    vorigeRaus = raus; if (raus) stat.saetze++; return !raus;
  });
  return rest.join(' ').replace(/\u00a0/g, ' ').replace(/\u2024/g, '.').replace(/\u01c3/g, '!').replace(/\u2e2e/g, '?').trim();
}
const text = s => (typeof s === 'string' ? saetzeOhneNamen(umformulieren(s)) : s);
const liste = a => (a || []).map(x => (typeof x === 'string' ? text(x) : tief(x))).filter(x => { const ok = !(typeof x === 'string' && (!x.trim() || IRGEND.test(x))); if (!ok) stat.eintraege++; return ok; });
function tief(o) {
  if (Array.isArray(o)) return liste(o);
  if (o && typeof o === 'object') { const n = {}; for (const [k, v] of Object.entries(o)) n[k] = typeof v === 'string' ? (['name', 'einheit', 'aktion'].includes(k) ? umformulieren(v) : text(v)) : tief(v); return n; }
  return o;
}

// --- Titel zuerst (Kollisionen prüfen) ---
const vorher = new Map(); daten.forEach(([, d]) => d.j.forEach(r => vorher.set(r.id, r.name)));
const neuTitel = new Map();
for (const [id, t] of vorher) { const n = titelSauber(t); if (n !== t) neuTitel.set(id, n); }
const belegt = new Set([...vorher].filter(([id]) => !neuTitel.has(id)).map(([, t]) => t));
for (const [id, n] of neuTitel) { let t = n; if (belegt.has(t)) t = n + ' – Sterneküchen-Fassung'; belegt.add(t); neuTitel.set(id, t); stat.titel++; }

// --- Rezepte ---
const kochIdVonName = n => (KOECHE.find(k => k.name === n) || {}).id;
const figurVon = new Map(); // Rezept-id -> Figur-Titel (für Index ko)
for (const [, d] of daten) {
  d.j = d.j.map(r => {
    const figuren = (r.koeche || []).map(k => FIGUR[kochIdVonName(k.name)]).filter(Boolean).map(f => f[0]);
    if (FIGUR_NAMEN.size && (r.koeche || []).some(k => FIGUR_NAMEN.has(k.name))) (r.koeche || []).forEach(k => FIGUR_NAMEN.has(k.name) && figuren.push(k.name));
    if (figuren.length) figurVon.set(r.id, [...new Set(figuren)]);
    const n = { ...r };
    if (neuTitel.has(r.id)) n.name = neuTitel.get(r.id);
    if (n.originalname && IRGEND.test(n.originalname)) n.originalname = '';
    if ((r.koeche || []).length) stat.koeche += r.koeche.length;
    n.koeche = [];
    const q = r.quellen || [];
    n.quellen = q.filter(x => { const raus = IRGEND.test((x.titel || '') + ' ' + (x.url || '')) || [...nachnamen].some(t => (x.url || '').toLowerCase().includes(t.toLowerCase())); if (raus) stat.quellen++; return !raus; });
    if (typeof n.region === 'string' && IRGEND.test(n.region)) n.region = n.region.replace(KLAMMER, '').trim();
    for (const f of ['kurz', 'hintergrund', 'getraenk']) if (typeof n[f] === 'string') n[f] = text(n[f]);
    for (const f of ['schritte', 'profitipps', 'varianten', 'beilagen', 'zutaten']) if (n[f]) n[f] = tief(n[f]);
    if (n.schlagworte) n.schlagworte = n.schlagworte.filter(t => !IRGEND.test(t) && t !== 'im Stil von');
    if (!n.kurz) n.kurz = r.kurz && !IRGEND.test(r.kurz) ? r.kurz : n.name;
    if (!n.hintergrund) n.hintergrund = n.kurz;
    return n;
  });
}

// --- Index und Köche-Liste ---
const rez = new Map(); daten.forEach(([, d]) => d.j.forEach(r => rez.set(r.id, r)));
INDEX.forEach(e => {
  const r = rez.get(e.id); if (!r) return;
  e.n = r.name; e.o = r.originalname || ''; e.r = r.region; e.ku = r.kurz; e.t = r.schlagworte || [];
  e.ko = figurVon.get(e.id) || (e.ko || []).filter(n => FIGUR_NAMEN.has(n));
});
const KNEU = KOECHE.filter(k => FIGUR[k.id] || FIGUR_NAMEN.has(k.name)).map(k => {
  const f = FIGUR[k.id] || [k.name, k.land];
  return { id: k.id, name: f[0], land: f[1], kueche: k.kueche, kurzbio: '', stil: 'Frei erfundene Koch-Figur', bekannt_fuer: [], buecher: [], web: '' };
});

// --- Schreiben ---
for (const [f, d] of daten) fs.writeFileSync(path.join(D, f), d.kopf + JSON.stringify(d.j) + d.fuss);
idxZeilen[iI] = 'KB.INDEX=' + JSON.stringify(INDEX) + ';';
idxZeilen[iK] = 'KB.KOECHE=' + JSON.stringify(KNEU) + ';';
fs.writeFileSync(path.join(D, 'index.js'), idxZeilen.join('\n'));

// --- Prüfung ---
let rest = [];
daten.forEach(([, d]) => d.j.forEach(r => { const s = JSON.stringify(r); const m = s.match(IRGEND); if (m) rest.push(r.id + " [" + m[0] + "]: " + s.slice(Math.max(0, m.index - 60), m.index + 60)); }));
const ix = fs.readFileSync(path.join(D, 'index.js'), 'utf8'); const mi = ix.match(new RegExp(IRGEND.source, 'gu')) || [];
console.log(JSON.stringify({ ...stat, namen: namen.size, restInRezepten: rest.length, restImIndex: mi.length, imIndex: [...new Set(mi)] }));
rest.slice(0, 30).forEach(x => console.log('  REST ' + x));
