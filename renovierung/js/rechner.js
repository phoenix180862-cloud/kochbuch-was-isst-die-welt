/* TW Renovierungs-App – Rechenkern (ohne KI, ohne Netz)
   Reine Funktionen: Geometrie, Gebinde, Zeitplan, Zahlenformat.
   Läuft im Browser (window.TW_RECHNER) und in Node (module.exports) für die Tests. */
(function (root) {
  'use strict';

  /* ---------- Zahlen ---------- */
  const rund = (x, st = 2) => { const f = Math.pow(10, st); return Math.round((x + Number.EPSILON) * f) / f; };
  const auf = (x, schritt = 1) => Math.ceil(rund(x / schritt, 6)) * schritt;
  function zahl(x, st = 2) {
    if (x === null || x === undefined || isNaN(x)) return '–';
    return rund(x, st).toLocaleString('de-DE', { maximumFractionDigits: st, minimumFractionDigits: 0 });
  }
  /* Eingabe „4,5“, „4.5“, „450 cm“ → Zahl in der gewünschten Einheit */
  function lies(wert) {
    if (typeof wert === 'number') return wert;
    if (wert === null || wert === undefined) return NaN;
    const s = String(wert).trim().replace(/\s+/g, '').replace(',', '.');
    if (!s) return NaN;
    return parseFloat(s);
  }

  /* ---------- Raum-Geometrie ---------- */
  /* r = { l, b, h, fenster:[{b,h}], tueren:[{b,h}], abzug, zuschlag } (Meter, m²) */
  function raum(r) {
    const l = +r.l || 0, b = +r.b || 0, h = +r.h || 0;
    const fenster = (r.fenster || []).filter(o => o && o.b > 0 && o.h > 0);
    const tueren = (r.tueren || []).filter(o => o && o.b > 0 && o.h > 0);
    const umfang = 2 * (l + b);
    const wandBrutto = umfang * h;
    const oeffFenster = fenster.reduce((s, o) => s + o.b * o.h, 0);
    const oeffTueren = tueren.reduce((s, o) => s + o.b * o.h, 0);
    const abzug = +r.abzug || 0, zuschlag = +r.zuschlag || 0;
    const wandNetto = Math.max(0, wandBrutto - oeffFenster - oeffTueren - abzug + zuschlag);
    const boden = l * b;
    const tuerBreiten = tueren.reduce((s, o) => s + o.b, 0);
    return {
      l, b, h, umfang, wandBrutto, oeffFenster, oeffTueren, wandNetto, boden, decke: boden,
      tuerBreiten, sockel: Math.max(0, umfang - tuerBreiten), fenster, tueren,
      /* Kantenlänge Fenster/Türen zum Abkleben */
      oeffKanten: fenster.reduce((s, o) => s + 2 * (o.b + o.h), 0) + tueren.reduce((s, o) => s + o.b + 2 * o.h, 0)
    };
  }

  /* Plausibilität: liefert Liste { stufe: 'fehler'|'warnung', feld, text } */
  function pruefeRaum(r) {
    const p = [];
    const chk = (feld, name, v, min, max, typ) => {
      if (!(v > 0)) { p.push({ stufe: 'fehler', feld, text: `${name} fehlt.` }); return; }
      if (v >= 100) p.push({ stufe: 'fehler', feld, text: `${name}: ${zahl(v)} m? Das sieht nach Zentimetern aus – bitte in Metern eingeben (z. B. ${zahl(v / 100)}).` });
      else if (v < min) p.push({ stufe: 'warnung', feld, text: `${name} ist mit ${zahl(v)} m sehr klein – bitte nachmessen.` });
      else if (v > max) p.push({ stufe: typ || 'warnung', feld, text: `${name} ist mit ${zahl(v)} m ungewöhnlich groß – bitte nachmessen.` });
    };
    chk('l', 'Länge', +r.l, 0.6, 15);
    chk('b', 'Breite', +r.b, 0.6, 15);
    if (r.h !== undefined) {
      chk('h', 'Raumhöhe', +r.h, 1.8, 4.5);
      if (+r.h > 3.2 && +r.h < 4.5) p.push({ stufe: 'hinweis', feld: 'h', text: 'Raumhöhe über 3,20 m (Altbau?): Gerüst oder stabiles Podest einplanen, Leiter allein reicht dann nicht.' });
    }
    const R = raum(r);
    (r.fenster || []).forEach((o, i) => {
      if (o.b >= 10 || o.h >= 10) p.push({ stufe: 'fehler', feld: 'fenster', text: `Fenster ${i + 1}: Maße bitte in Metern (z. B. 1,20 statt 120).` });
      else if (r.h && o.h > r.h) p.push({ stufe: 'fehler', feld: 'fenster', text: `Fenster ${i + 1} ist höher als der Raum.` });
      else if (o.b > Math.max(r.l, r.b)) p.push({ stufe: 'fehler', feld: 'fenster', text: `Fenster ${i + 1} ist breiter als die längste Wand.` });
    });
    (r.tueren || []).forEach((o, i) => {
      if (o.b >= 10 || o.h >= 10) p.push({ stufe: 'fehler', feld: 'tueren', text: `Tür ${i + 1}: Maße bitte in Metern (z. B. 0,885 statt 88,5).` });
      else if (r.h && o.h > r.h) p.push({ stufe: 'fehler', feld: 'tueren', text: `Tür ${i + 1} ist höher als der Raum.` });
      else if (o.b > 2.6) p.push({ stufe: 'warnung', feld: 'tueren', text: `Tür ${i + 1} ist über 2,60 m breit – Schiebe- oder Doppeltür? Maß bitte prüfen.` });
    });
    if (R.wandBrutto > 0 && (R.oeffFenster + R.oeffTueren) > 0.6 * R.wandBrutto)
      p.push({ stufe: 'warnung', feld: 'fenster', text: 'Fenster und Türen ergeben mehr als 60 % der Wandfläche – bitte Maße prüfen.' });
    if (r.l > 0 && r.b > 0 && Math.max(r.l, r.b) / Math.min(r.l, r.b) > 8)
      p.push({ stufe: 'warnung', feld: 'l', text: 'Der Raum ist mehr als achtmal so lang wie breit (Flur?). Bitte Länge und Breite prüfen.' });
    return p;
  }

  /* Einfache Mengen-Prüfung für Fläche/Länge/Anzahl */
  function pruefeWert(feld, v) {
    const p = [];
    if (feld.pflicht !== false && !(v > 0) && v !== 0) p.push({ stufe: 'fehler', feld: feld.id, text: `${feld.label} fehlt.` });
    else if (v < 0) p.push({ stufe: 'fehler', feld: feld.id, text: `${feld.label} darf nicht negativ sein.` });
    else if (feld.max && v > feld.max) p.push({ stufe: 'warnung', feld: feld.id, text: `${feld.label}: ${zahl(v)} ${feld.einheit || ''} ist ungewöhnlich viel – bitte prüfen.` });
    else if (feld.min && v > 0 && v < feld.min) p.push({ stufe: 'warnung', feld: feld.id, text: `${feld.label}: ${zahl(v)} ${feld.einheit || ''} ist sehr wenig – bitte prüfen.` });
    return p;
  }

  /* ---------- Gebinde: günstigste Kombination handelsüblicher Größen ----------
     Ziel: möglichst wenig Rest bei möglichst wenigen Gebinden (Wertung siehe unten).
     groessen z. B. [2.5, 5, 10] (Liter). Liefert { anzahl:{5:1,10:1}, summe, rest, text } */
  function gebinde(bedarf, groessen, einheit = '', wort = '') {
    const g = [...groessen].sort((a, b) => b - a);
    if (!(bedarf > 0)) return { anzahl: {}, summe: 0, rest: 0, stueck: 0, text: '–' };
    let best = null; const klein = g[g.length - 1];
    const max = g.map(x => Math.ceil(bedarf / x) + 1);
    const pruefe = (komb) => {
      const summe = komb.reduce((s, n, i) => s + n * g[i], 0);
      if (summe + 1e-9 < bedarf) return;
      const stueck = komb.reduce((s, n) => s + n, 0);
      const rest = summe - bedarf;
      /* Wertung: wenig Rest, aber jedes weitere Gebinde „kostet“ eine halbe kleinste Größe (sonst 6 kleine Dosen statt eines Eimers) */
      const wert = rest + 0.5 * klein * (stueck - 1);
      if (!best || wert < best.wert - 1e-9 || (Math.abs(wert - best.wert) < 1e-9 && stueck < best.stueck)) best = { komb: [...komb], summe, rest, stueck, wert };
    };
    const rek = (i, komb) => {
      if (i === g.length) { pruefe(komb); return; }
      const grenze = Math.min(max[i], i === g.length - 1 ? max[i] : 40);
      for (let n = 0; n <= grenze; n++) { komb[i] = n; rek(i + 1, komb); }
    };
    if (g.length <= 4) rek(0, []);
    else { const n = Math.ceil(bedarf / g[0]); best = { komb: [n, ...g.slice(1).map(() => 0)], summe: n * g[0], rest: n * g[0] - bedarf, stueck: n }; }
    const anzahl = {}; best.komb.forEach((n, i) => { if (n) anzahl[g[i]] = n; });
    const text = Object.keys(anzahl).map(Number).sort((a, b) => b - a).map(gr => `${anzahl[gr]} × ${zahl(gr)} ${einheit}${wort ? ' ' + wort : ''}`.trim()).join(' + ');
    return { anzahl, summe: best.summe, rest: best.rest, stueck: best.stueck, text };
  }

  /* Fugenmörtel-Bedarf in kg/m² (Standardformel der Hersteller)
     ((A + B) / (A × B)) × Fugenbreite × Fugentiefe × Dichte; A,B,Fuge in mm, Dichte kg/dm³ */
  function fugenKgProM2(aMm, bMm, fugeMm, tiefeMm, dichte = 1.6) {
    return ((aMm + bMm) / (aMm * bMm)) * fugeMm * tiefeMm * dichte;
  }

  /* Tapeten-Rechnung nach Bahnen (wie Profis rechnen, nicht nur nach Fläche) */
  function tapete(R, o) {
    const rolleL = o.rollenLaenge || 10.05, rolleB = o.rollenBreite || 0.53;
    const rapport = (o.rapport || 0) / 100; // cm → m
    const zugabe = 0.10; // je 5 cm oben und unten
    let bahnL = R.h + zugabe;
    let rapportZusatz = 0;
    if (rapport > 0) {
      const mitR = Math.ceil(rund(bahnL / rapport, 6)) * rapport;
      rapportZusatz = mitR - bahnL + (o.versetzt ? rapport / 2 : 0);
      bahnL = mitR + (o.versetzt ? rapport / 2 : 0);
    }
    const proRolle = Math.floor(rund(rolleL / bahnL, 6));
    const bahnenUmfang = Math.ceil(rund(R.umfang / rolleB, 6));
    const oeff = [...R.fenster, ...R.tueren];
    const gespart = oeff.reduce((s, x) => s + Math.floor(rund(x.b / rolleB, 6)), 0);
    const vollbahnen = Math.max(0, bahnenUmfang - gespart);
    /* Kurzstücke über Türen bzw. über/unter Fenstern */
    const kurz = [];
    R.fenster.forEach(x => { const n = Math.ceil(rund(x.b / rolleB, 6)); const len = Math.max(0, R.h - x.h) + zugabe; for (let i = 0; i < n; i++) kurz.push(len); });
    R.tueren.forEach(x => { const n = Math.ceil(rund(x.b / rolleB, 6)); const len = Math.max(0, R.h - x.h) + zugabe; for (let i = 0; i < n; i++) kurz.push(len); });
    if (proRolle < 1) return { fehler: 'Raum höher als eine Tapetenrolle lang ist – bitte Sonderrollen verwenden.' };
    let rollen = Math.ceil(vollbahnen / proRolle);
    /* Reststücke: jede Rolle hat einen Rest, freie Vollbahnen zählen als Reststück voller Länge */
    const reste = [];
    for (let i = 0; i < rollen; i++) reste.push(rund(rolleL - proRolle * bahnL, 3));
    const freieBahnen = rollen * proRolle - vollbahnen;
    for (let i = 0; i < freieBahnen; i++) reste.push(bahnL);
    const offen = [];
    kurz.sort((a, b) => b - a).forEach(k => {
      const i = reste.findIndex(r => r + 1e-9 >= k);
      if (i >= 0) reste[i] = rund(reste[i] - k, 3); else offen.push(k);
    });
    let zusatzRollen = 0;
    if (offen.length) {
      let rest = 0;
      offen.forEach(k => { if (rest + 1e-9 < k) { zusatzRollen++; rest = rolleL; } rest -= k; });
    }
    rollen += zusatzRollen;
    return { rolleL, rolleB, bahnL, rapportZusatz, proRolle, bahnenUmfang, gespart, vollbahnen, kurz, zusatzRollen, rollen };
  }

  /* ---------- Zeitplan ----------
     phasen: [{ t, min, warten, nachtWarten, art:'arbeit'|'einkauf', tagNeu }]
     arbeitszeit: { von: 8, bis: 18, pause: true }
     Arbeit wird über Tage verteilt, Wartezeit läuft auch nachts. */
  function zeitplan(phasen, start, az) {
    az = Object.assign({ von: 8, bis: 18, sonntagFrei: true }, az || {});
    const MS = 60000;
    let t = new Date(start.getTime());
    const tagesStart = d => { const x = new Date(d); x.setHours(az.von, 0, 0, 0); return x; };
    const tagesEnde = d => { const x = new Date(d); x.setHours(az.bis, 0, 0, 0); return x; };
    const naechsterTag = d => { const x = new Date(d); x.setDate(x.getDate() + 1); x.setHours(az.von, 0, 0, 0); if (az.sonntagFrei && x.getDay() === 0) x.setDate(x.getDate() + 1); return x; };
    const normalisiere = d => {
      if (az.sonntagFrei && d.getDay() === 0) { const x = new Date(d); x.setDate(x.getDate() + 1); x.setHours(az.von, 0, 0, 0); return x; }
      if (d < tagesStart(d)) return tagesStart(d);
      if (d >= tagesEnde(d)) return naechsterTag(d);
      return d;
    };
    const eintraege = [];
    t = normalisiere(t);
    let arbeitMin = 0, wartenMin = 0, sperreBis = null;
    for (const p of phasen) {
      if (p.vorWarten > 0) {
        wartenMin += p.vorWarten;
        const von = new Date(t); t = new Date(t.getTime() + p.vorWarten * MS);
        eintraege.push({ art: 'warten', t: p.vorWartenText || 'Zwischentrocknung', von, bis: new Date(t), min: p.vorWarten });
      }
      if (p.nachParallel && sperreBis && sperreBis > t) {
        const von = new Date(t); t = new Date(sperreBis);
        eintraege.push({ art: 'warten', t: 'Warten, bis die Vorbereitung abgeschlossen ist', von, bis: new Date(t), min: Math.round((t - von) / MS) });
      }
      if (p.tagNeu && t > tagesStart(t)) t = naechsterTag(t);
      t = normalisiere(t);
      let rest = Math.max(0, Math.round(p.min || 0));
      arbeitMin += rest;
      const stuecke = [];
      if (rest === 0) stuecke.push({ von: new Date(t), bis: new Date(t) });
      while (rest > 0) {
        t = normalisiere(t);
        const frei = Math.round((tagesEnde(t) - t) / MS);
        /* kleine Restarbeit (≤ 20 min) nicht auf den nächsten Tag schieben */
        const jetzt = (rest <= frei || rest - frei <= 20) ? rest : frei;
        const von = new Date(t); t = new Date(t.getTime() + jetzt * MS);
        stuecke.push({ von, bis: new Date(t) }); rest -= jetzt;
      }
      eintraege.push({ art: p.art || 'arbeit', t: p.t, hinweis: p.hinweis || '', stuecke, von: stuecke[0].von, bis: stuecke[stuecke.length - 1].bis });
      const w = Math.round(p.warten || 0);
      if (w > 0 && p.parallel) {
        sperreBis = new Date(t.getTime() + w * MS);
        eintraege.push({ art: 'warten', parallel: true, t: p.wartenText || 'Läuft nebenher', von: new Date(t), bis: new Date(sperreBis), min: w });
      } else if (w > 0) {
        wartenMin += w;
        const von = new Date(t); t = new Date(t.getTime() + w * MS);
        eintraege.push({ art: 'warten', t: p.wartenText || 'Trocknen / Warten', von, bis: new Date(t), min: w });
      }
    }
    const ende = eintraege.reduce((mx, e) => (e.bis > mx ? e.bis : mx), new Date(t));
    /* Tage zählen */
    const tage = new Set();
    eintraege.forEach(e => { if (e.art !== 'warten') e.stuecke.forEach(s => tage.add(s.von.toDateString())); });
    return { eintraege, ende, arbeitMin, wartenMin, arbeitstage: tage.size };
  }

  function dauerText(min) {
    min = Math.round(min);
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60), m = min % 60;
    if (min >= 48 * 60 && m === 0 && h % 24 === 0) return `${h / 24} Tage`;
    return m ? `${h} h ${m} min` : `${h} h`;
  }

  /* ---------- Kalender (.ics) ---------- */
  function icsDatum(d) { const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`; }
  function icsText(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
  function icsFalten(z) { const out = []; let s = z; while (s.length > 74) { out.push(s.slice(0, 74)); s = ' ' + s.slice(74); } out.push(s); return out.join('\r\n'); }
  function ics(termine, jetzt) {
    jetzt = jetzt || new Date();
    const stamp = jetzt.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const z = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thomas Willwacher Fliesenlegermeister e.K.//TW Renovierungs-App//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    termine.forEach((t, i) => {
      const tag = t.datum; const folge = new Date(tag); folge.setDate(folge.getDate() + 1);
      z.push('BEGIN:VEVENT', `UID:tw-reno-${t.id || i}-${icsDatum(tag)}@renovierung.app`, `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${icsDatum(tag)}`, `DTEND;VALUE=DATE:${icsDatum(folge)}`, icsFalten(`SUMMARY:${icsText(t.titel)}`));
      if (t.text) z.push(icsFalten(`DESCRIPTION:${icsText(t.text)}`));
      if (t.monate) z.push(`RRULE:FREQ=MONTHLY;INTERVAL=${t.monate}`);
      z.push('BEGIN:VALARM', 'ACTION:DISPLAY', icsFalten(`DESCRIPTION:${icsText(t.titel)}`), 'TRIGGER:-PT15H', 'END:VALARM', 'END:VEVENT');
    });
    z.push('END:VCALENDAR');
    return z.join('\r\n') + '\r\n';
  }

  /* ---------- Schlagwort-Erkennung ---------- */
  function normal(s) {
    return String(s || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function abstand(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let v = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const w = [i];
      for (let j = 1; j <= n; j++) w[j] = Math.min(v[j] + 1, w[j - 1] + 1, v[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      v = w;
    }
    return v[n];
  }
  /* katalog: [{ id, titel, schlagworte:[...] }] → sortierte Treffer [{ id, punkte }] */
  function erkenne(text, katalog) {
    const q = normal(text); if (!q) return [];
    const woerter = q.split(' ').filter(w => w.length > 1);
    const STOPP = new Set(['der', 'die', 'das', 'ein', 'eine', 'und', 'im', 'in', 'am', 'an', 'zu', 'ich', 'will', 'moechte', 'muss', 'neu', 'mein', 'meine', 'den', 'dem', 'von', 'mit', 'auf', 'bitte', 'mal', 'ist', 'sind']);
    const kern = woerter.filter(w => !STOPP.has(w));
    const erg = katalog.map(a => {
      let punkte = 0;
      const sw = [a.titel, ...(a.schlagworte || [])].map(normal);
      sw.forEach(s => {
        if (!s) return;
        if (q === s) punkte += 100;
        else if (s.includes(' ') && q.includes(s)) punkte += 40 + s.length;
        else if (q.includes(s) && s.length >= 4) punkte += 25 + s.length;
        s.split(' ').forEach(t => {
          if (t.length < 3) return;
          kern.forEach(w => {
            if (w === t) punkte += 12 + t.length;
            else if (w.length >= 5 && t.length >= 5 && (w.startsWith(t.slice(0, 5)) || t.startsWith(w.slice(0, 5)))) punkte += 6;
            else if (w.length >= 6 && t.length >= 6 && abstand(w, t) <= (t.length > 8 ? 2 : 1)) punkte += 8;
          });
        });
      });
      return { id: a.id, punkte };
    }).filter(x => x.punkte > 0).sort((a, b) => b.punkte - a.punkte);
    return erg;
  }

  /* Profilzylinder: nächste handelsübliche Seitenlänge (30, 35, 40 … 80 mm) zum gemessenen Maß */
  function zylinderSeite(mm) { for (let x = 30; x <= 80; x += 5) if (x + 1e-9 >= mm) return x; return null; }
  /* Rollladengurt je Fenster: 2 × (Fensterhöhe + Kasten 0,3 m) + 0,5 m Reserve → handelsübliche Länge */
  function gurtLaenge(fensterH) { const bedarf = 2 * (fensterH + 0.3) + 0.5; const L = [5, 6, 8, 12].find(x => x + 1e-9 >= bedarf) || null; return { bedarf, L }; }
  /* Tür kürzen: neuer Aufbau (Belag + Dämmung) minus vorhandene Luft plus gewünschte Luft */
  function tuerKuerzen(aufbauMm, luftAltMm, luftNeuMm) { return Math.max(0, aufbauMm - luftAltMm + luftNeuMm); }

  /* Fliesen-Wörter: Für Fliesenarbeiten kommt eine eigene App – diese Wörter treffen keine Arbeit */
  function istFliesenWort(text) {
    const q = normal(text);
    if (/silikon|acryl|pflaster|fenster|dusche abdicht|duschabtrennung/.test(q)) return false;
    return /\b(fliese\w*|kachel\w*|fliesenfug\w*|verfliesen|fliesenspiegel|fliesenleger|fliesenkleber|fugenmoertel|verfugen|neu verfugen|fugen erneuern|fugen ausbessern|fugen broeseln)\b/.test(q);
  }

  const api = { istFliesenWort, zylinderSeite, gurtLaenge, tuerKuerzen, rund, auf, zahl, lies, raum, pruefeRaum, pruefeWert, gebinde, fugenKgProM2, tapete, zeitplan, dauerText, ics, icsDatum, normal, abstand, erkenne };
  root.TW_RECHNER = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
