/* TW Weltkochbuch – eigene Illustrationen
   KB.titelbild(rezept, hintergrund)  → Gericht-Illustration (240×180)
   KB.schrittbild(aktion, farben)     → Arbeitsschritt-Illustration (240×160) */
(function () {
  window.KB = window.KB || {};
  const INK = '#2a2622';

  /* ---------- Farbwerkzeuge ---------- */
  const hex2 = h => { h = (h || '#888888').replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const rgb2 = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const x = hex2(a), y = hex2(b); return rgb2(x.map((v, i) => v + (y[i] - v) * t)); };
  const dk = (c, t = .25) => mix(c, '#1a120c', t);
  const lt = (c, t = .35) => mix(c, '#ffffff', t);

  /* ---------- Zufall mit festem Startwert (gleiches Rezept = gleiches Bild) ---------- */
  function rng(str) {
    let h = 1779033703;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    return function () {
      h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  /* ---------- Bausteine Titelbild ---------- */
  const teller = (cx = 120, cy = 92, r = 74) => `
    <ellipse cx="${cx + 4}" cy="${cy + 7}" rx="${r}" ry="${r * .92}" fill="#000" opacity=".12"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbfaf7" stroke="#d9d3c8" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r * .74}" fill="#f4f1ea"/>`;
  const schale = (cx, cy, r, innen) => `
    <ellipse cx="${cx + 4}" cy="${cy + 7}" rx="${r}" ry="${r * .9}" fill="#000" opacity=".14"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#f8f5ef" stroke="#cfc6b8" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r * .86}" fill="${innen}"/>`;
  const kraeuter = (R, cx, cy, sp, n, farbe = '#4f7d32') => Array.from({ length: n }, () => {
    const x = cx + (R() - .5) * sp, y = cy + (R() - .5) * sp, w = R() * 360;
    return `<path d="M${x} ${y}c2-4 6-5 9-3-2 3-6 5-9 3Z" fill="${farbe}" transform="rotate(${w} ${x} ${y})"/>`;
  }).join('');
  const punkte = (R, cx, cy, sp, n, farbe, r = 1.8) => Array.from({ length: n }, () =>
    `<circle cx="${(cx + (R() - .5) * sp).toFixed(1)}" cy="${(cy + (R() - .5) * sp).toFixed(1)}" r="${(r * (.6 + R() * .8)).toFixed(1)}" fill="${farbe}"/>`).join('');
  const klecks = (R, cx, cy, r, farbe, n = 9) => {
    let p = '';
    for (let i = 0; i <= n; i++) {
      const w = i / n * Math.PI * 2, rr = r * (.82 + R() * .3);
      p += (i ? 'L' : 'M') + (cx + Math.cos(w) * rr).toFixed(1) + ' ' + (cy + Math.sin(w) * rr * .9).toFixed(1);
    }
    return `<path d="${p}Z" fill="${farbe}" stroke-linejoin="round" stroke="${farbe}" stroke-width="${r * .3}"/>`;
  };
  const zitrone = (x, y, r = 11) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f2d24b" stroke="#d9b22a" stroke-width="2"/>
    ${[0, 60, 120].map(w => `<path d="M${x} ${y - r + 3}V${y + r - 3}" stroke="#fff6c8" stroke-width="1.4" transform="rotate(${w} ${x} ${y})"/>`).join('')}`;

  const H = {
    teller(c, R) {
      return teller() + klecks(R, 104, 92, 30, c[0]) + klecks(R, 104, 88, 18, lt(c[0], .2)) +
        klecks(R, 145, 78, 16, c[1]) + klecks(R, 146, 110, 13, c[2]) + kraeuter(R, 120, 92, 70, 6);
    },
    'braten-scheiben'(c, R) {
      let s = teller() + klecks(R, 112, 104, 40, dk(c[2], .1)) ;
      for (let i = 0; i < 4; i++) {
        const x = 88 + i * 15, y = 82 + i * 4;
        s += `<ellipse cx="${x}" cy="${y}" rx="22" ry="17" fill="${dk(c[0], .2)}"/><ellipse cx="${x}" cy="${y}" rx="18" ry="13.5" fill="${c[1]}"/>
          <path d="M${x - 10} ${y - 3}q10-4 20 0" stroke="${lt(c[1], .3)}" stroke-width="1.4" fill="none"/>`;
      }
      return s + `<circle cx="150" cy="118" r="11" fill="#efe1c0" stroke="#d8c59a"/><circle cx="160" cy="98" r="10" fill="#efe1c0" stroke="#d8c59a"/>` + kraeuter(R, 120, 70, 50, 4);
    },
    schnitzel(c, R) {
      return teller() + klecks(R, 108, 90, 42, dk(c[0], .15), 12) + klecks(R, 108, 90, 38, c[0], 12) +
        punkte(R, 108, 90, 60, 40, dk(c[0], .25), 1.4) + zitrone(150, 72) + klecks(R, 150, 112, 15, c[1]) + kraeuter(R, 156, 70, 12, 3);
    },
    steak(c, R) {
      let s = teller() + `<path d="M74 78c6-22 52-28 70-10 12 12 6 38-14 44-24 8-62 2-56-34Z" fill="${dk(c[0], .2)}"/>
        <path d="M80 80c6-17 46-22 60-8 10 10 4 30-12 35-20 6-53 1-48-27Z" fill="${c[0]}"/>`;
      for (let i = 0; i < 4; i++) s += `<path d="M${88 + i * 13} 70l14 38" stroke="${dk(c[0], .5)}" stroke-width="4" stroke-linecap="round" opacity=".8"/>`;
      for (let i = 0; i < 7; i++) s += `<rect x="${146 + R() * 20}" y="${96 + R() * 30}" width="5" height="22" rx="2" fill="${c[1]}" transform="rotate(${R() * 80 - 40} 160 110)"/>`;
      return s + klecks(R, 108, 92, 5, c[2]) + kraeuter(R, 100, 90, 30, 3);
    },
    haehnchen(c, R) {
      return teller() + `<path d="M84 104c-10-26 10-50 36-48 26 2 40 22 32 42-8 22-58 30-68 6Z" fill="${dk(c[0], .12)}"/>
        <path d="M88 100c-7-21 9-40 31-38 22 2 33 18 26 34-7 18-50 23-57 4Z" fill="${c[0]}"/>
        <path d="M146 92l14 10c6 4 4 12-2 10l-16-8" fill="${c[0]}" stroke="${dk(c[0], .15)}" stroke-width="2"/>
        <circle cx="162" cy="108" r="5" fill="#f6efe2"/>` + punkte(R, 116, 84, 40, 14, dk(c[0], .35), 1.2) + klecks(R, 112, 128, 13, c[1]) + kraeuter(R, 116, 84, 40, 4);
    },
    wurst(c, R) {
      return teller() + `<path d="M70 80c20-14 70-14 92 2" stroke="${dk(c[0], .2)}" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M70 80c20-14 70-14 92 2" stroke="${c[0]}" stroke-width="15" stroke-linecap="round" fill="none"/>
        <path d="M74 104c20-12 66-12 88 2" stroke="${dk(c[0], .2)}" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M74 104c20-12 66-12 88 2" stroke="${c[0]}" stroke-width="15" stroke-linecap="round" fill="none"/>
        <path d="M80 76q8-4 16 0M100 72q8-4 16 0M120 72q8-4 16 0" stroke="${c[2]}" stroke-width="3" fill="none"/>` +
        klecks(R, 118, 130, 16, c[1]) + punkte(R, 116, 90, 70, 10, c[2], 1.5);
    },
    spiess(c, R) {
      let s = `<rect x="34" y="40" width="172" height="104" rx="10" fill="#c9a77c"/><rect x="40" y="46" width="160" height="92" rx="6" fill="#d8bb91"/>`;
      [64, 92, 120].forEach((y, j) => {
        s += `<path d="M48 ${y + 6}L196 ${y - 6}" stroke="#8a6a44" stroke-width="3"/>`;
        for (let i = 0; i < 6; i++) {
          const x = 66 + i * 22, yy = y + 4 - i * 1.6, f = c[(i + j) % 3];
          s += `<rect x="${x - 9}" y="${yy - 9}" width="18" height="18" rx="5" fill="${f}" stroke="${dk(f, .2)}" stroke-width="1.5"/>`;
        }
      });
      return s + kraeuter(R, 120, 92, 140, 6);
    },
    eintopf(c, R) {
      return `<ellipse cx="124" cy="100" rx="78" ry="70" fill="#000" opacity=".13"/>
        <circle cx="120" cy="92" r="74" fill="${INK}"/><circle cx="120" cy="92" r="66" fill="${c[0]}"/>
        <rect x="186" y="84" width="34" height="14" rx="6" fill="${INK}"/><rect x="20" y="84" width="34" height="14" rx="6" fill="${INK}"/>` +
        Array.from({ length: 16 }, () => klecks(R, 70 + R() * 100, 50 + R() * 84, 6 + R() * 6, [c[1], c[2], lt(c[0], .3)][Math.floor(R() * 3)], 7)).join('') + kraeuter(R, 120, 92, 90, 7);
    },
    suppe(c, R) {
      return schale(120, 92, 70, c[0]) + `<path d="M96 86c10-14 34-14 46 0s-12 22-24 10" stroke="${c[2]}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>` +
        punkte(R, 120, 92, 80, 12, lt(c[1], .1), 3) + kraeuter(R, 120, 92, 60, 6) +
        `<path d="M176 128l34 30" stroke="#b9b0a2" stroke-width="7" stroke-linecap="round"/><ellipse cx="170" cy="122" rx="12" ry="8" fill="#cfc7ba" transform="rotate(40 170 122)"/>`;
    },
    nudeln(c, R) {
      let s = teller();
      for (let i = 0; i < 26; i++) {
        const r = 8 + R() * 34, w = R() * 6.28;
        s += `<path d="M${120 + Math.cos(w) * r} ${92 + Math.sin(w) * r}a${r} ${r * .8} 0 0 1 ${(R() - .5) * 40} ${(R() - .5) * 30}" stroke="${i % 3 ? c[0] : dk(c[0], .12)}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      }
      return s + klecks(R, 120, 88, 20, c[1]) + punkte(R, 120, 88, 30, 12, dk(c[1], .2), 2.2) + punkte(R, 120, 90, 60, 18, c[2], 1.6) + kraeuter(R, 126, 80, 20, 3, '#3f7f2a');
    },
    lasagne(c, R) {
      return `<rect x="38" y="36" width="164" height="118" rx="14" fill="#000" opacity=".12"/>
        <rect x="32" y="30" width="164" height="118" rx="14" fill="#f6f3ee" stroke="#c9c1b4" stroke-width="2"/>
        <rect x="44" y="42" width="140" height="94" rx="6" fill="${c[1]}"/>` +
        Array.from({ length: 22 }, () => klecks(R, 52 + R() * 124, 50 + R() * 78, 6 + R() * 8, R() > .5 ? c[0] : lt(c[0], .25), 7)).join('') +
        punkte(R, 114, 89, 130, 20, dk(c[0], .35), 1.6) + kraeuter(R, 114, 89, 90, 5);
    },
    reis(c, R) {
      let s = schale(120, 92, 68, '#f7f5ef');
      for (let i = 0; i < 70; i++) { const w = R() * 6.28, r = R() * 54; s += `<ellipse cx="${120 + Math.cos(w) * r}" cy="${92 + Math.sin(w) * r}" rx="3.2" ry="1.4" fill="#e7e2d6" transform="rotate(${R() * 180} ${120 + Math.cos(w) * r} ${92 + Math.sin(w) * r})"/>`; }
      return s + klecks(R, 100, 80, 18, c[0]) + klecks(R, 140, 84, 15, c[1]) + klecks(R, 122, 112, 14, c[2]) + kraeuter(R, 120, 92, 50, 5);
    },
    curry(c, R) {
      return schale(110, 96, 64, c[0]) + Array.from({ length: 10 }, () => klecks(R, 80 + R() * 60, 70 + R() * 54, 6 + R() * 5, c[1], 7)).join('') +
        `<path d="M86 86c14-10 34-8 46 2" stroke="${lt(c[0], .45)}" stroke-width="4" fill="none" opacity=".7"/>` + kraeuter(R, 110, 96, 60, 6) +
        `<ellipse cx="190" cy="48" rx="34" ry="26" fill="#f5f3ec" stroke="#d8d0c2" stroke-width="2"/>` + punkte(R, 190, 48, 40, 20, '#e6e0d2', 2.5) +
        `<path d="M176 132c10-6 30-6 40 4l-14 18c-10 2-22-2-26-22Z" fill="${c[2]}" opacity=".9"/>`;
    },
    ramen(c, R) {
      let s = schale(120, 92, 72, c[0]);
      for (let i = 0; i < 8; i++) s += `<path d="M78 ${74 + i * 5}q20-8 40 0t40 0" stroke="#f1d98c" stroke-width="3" fill="none"/>`;
      return s + `<rect x="138" y="44" width="30" height="44" fill="#1f2a1f" transform="rotate(18 153 66)"/>
        <ellipse cx="96" cy="110" rx="15" ry="11" fill="#fff"/><circle cx="96" cy="111" r="7" fill="#f0a225"/>
        <ellipse cx="120" cy="120" rx="15" ry="11" fill="#fff"/><circle cx="120" cy="121" r="7" fill="#f0a225"/>
        <circle cx="142" cy="108" r="14" fill="${c[1]}" stroke="${dk(c[1], .2)}" stroke-width="2"/><circle cx="142" cy="108" r="6" fill="${lt(c[1], .3)}"/>` +
        punkte(R, 112, 76, 40, 16, '#7bb24a', 2.4) + punkte(R, 132, 90, 50, 8, c[2], 2);
    },
    pizza(c, R) {
      let s = `<circle cx="124" cy="98" r="78" fill="#000" opacity=".12"/><circle cx="120" cy="92" r="76" fill="#c69a5a"/>
        <circle cx="120" cy="92" r="70" fill="#d9a865"/><circle cx="120" cy="92" r="62" fill="${c[0]}"/>`;
      s += Array.from({ length: 11 }, () => { const w = R() * 6.28, r = R() * 44; return klecks(R, 120 + Math.cos(w) * r, 92 + Math.sin(w) * r, 9 + R() * 5, '#f6ecd0', 7); }).join('');
      s += Array.from({ length: 8 }, () => { const w = R() * 6.28, r = R() * 46; return `<circle cx="${120 + Math.cos(w) * r}" cy="${92 + Math.sin(w) * r}" r="6" fill="${c[1]}"/>`; }).join('');
      s += `<path d="M120 92L120 16M120 92l66 38M120 92l-66 38" stroke="#b98a4c" stroke-width="1.5" opacity=".6"/>`;
      return s + kraeuter(R, 120, 92, 90, 7, '#3f8a2a') + punkte(R, 120, 92, 100, 18, dk(c[2], .2), 1.3);
    },
    burger(c, R) {
      return `<rect x="30" y="140" width="180" height="14" rx="7" fill="#b98a5c"/>
        <path d="M66 140h108c4 0 6-4 4-8l-4-6H66l-4 6c-2 4 0 8 4 8Z" fill="#d9a35c"/>
        <path d="M60 124c20 6 100 6 120 0l-6-8H66Z" fill="#5f8f3a"/>
        <rect x="62" y="104" width="116" height="18" rx="9" fill="${c[0]}" stroke="${dk(c[0], .25)}" stroke-width="2"/>
        <path d="M60 104l12 10 10-10 12 10 10-10 12 10 10-10 12 10 10-10 12 10 10-10" fill="#f2c13a"/>
        <rect x="70" y="96" width="100" height="8" rx="4" fill="${c[2]}"/>
        <path d="M60 96c0-34 26-46 60-46s60 12 60 46Z" fill="#dca457" stroke="#bb8239" stroke-width="2"/>` +
        punkte(R, 120, 66, 70, 14, '#fbf2dc', 1.6).replace(/circle/g, 'circle') ;
    },
    sandwich(c, R) {
      const halb = (x, y, w) => `<g transform="rotate(${w} ${x} ${y})">
        <path d="M${x - 46} ${y + 26}L${x} ${y - 30}L${x + 46} ${y + 26}Z" fill="#e8c88c" stroke="#c99f58" stroke-width="3"/>
        <path d="M${x - 38} ${y + 20}L${x} ${y - 22}L${x + 38} ${y + 20}Z" fill="${c[0]}"/>
        <path d="M${x - 30} ${y + 14}L${x} ${y - 14}L${x + 30} ${y + 14}Z" fill="${c[1]}"/>
        <path d="M${x - 22} ${y + 9}L${x} ${y - 6}L${x + 22} ${y + 9}Z" fill="${c[2]}"/></g>`;
      return teller() + halb(98, 96, -12) + halb(146, 88, 16);
    },
    taco(c, R) {
      const t = x => `<path d="M${x - 30} 118c0-34 60-34 60 0" fill="#e9c062" stroke="#c99a32" stroke-width="3"/>
        ${klecks(R, x, 98, 16, c[0], 8)}${punkte(R, x, 94, 26, 8, c[1], 3)}${punkte(R, x, 92, 26, 6, c[2], 2.4)}${kraeuter(R, x, 92, 24, 3, '#3f8a2a')}
        <path d="M${x - 30} 118c0-34 60-34 60 0" fill="none" stroke="#c99a32" stroke-width="3"/>`;
      return `<rect x="22" y="56" width="196" height="84" rx="12" fill="#f5f2ea" stroke="#d6cdbf" stroke-width="2"/>` + t(66) + t(120) + t(174) + zitrone(206, 142, 9);
    },
    wrap(c, R) {
      const r = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="24" fill="#ecd8a8" stroke="#cfb57c" stroke-width="3"/>
        <ellipse cx="${x}" cy="${y}" rx="27" ry="18" fill="${c[0]}"/>${punkte(R, x, y, 34, 10, c[1], 3)}${punkte(R, x, y, 34, 8, c[2], 2.5)}${kraeuter(R, x, y, 30, 3)}`;
      return teller() + r(96, 84) + r(146, 104);
    },
    salat(c, R) {
      let s = schale(120, 92, 72, '#e9f0dc');
      for (let i = 0; i < 18; i++) { const x = 70 + R() * 100, y = 50 + R() * 84; s += `<path d="M${x} ${y}c8-12 22-12 26 0-6 8-18 10-26 0Z" fill="${i % 2 ? '#6aa33f' : '#4e8a30'}" transform="rotate(${R() * 360} ${x + 13} ${y})"/>`; }
      return s + Array.from({ length: 7 }, () => klecks(R, 80 + R() * 80, 60 + R() * 64, 7, c[0], 7)).join('') +
        Array.from({ length: 6 }, () => klecks(R, 80 + R() * 80, 60 + R() * 64, 6, c[1], 7)).join('') + punkte(R, 120, 92, 90, 10, c[2], 3);
    },
    dumplings(c, R) {
      let s = `<circle cx="124" cy="98" r="78" fill="#000" opacity=".13"/><circle cx="120" cy="92" r="76" fill="#c49a5c"/><circle cx="120" cy="92" r="68" fill="#e7d3a8"/>`;
      for (let i = 0; i < 6; i++) s += `<path d="M52 ${50 + i * 14}h136" stroke="#c9ad78" stroke-width="2" opacity=".5"/>`;
      [[94, 70], [146, 70], [80, 108], [120, 104], [160, 108], [120, 140]].forEach(([x, y]) => {
        s += `<path d="M${x - 20} ${y + 4}c0-18 40-18 40 0 0 8-40 8-40 0Z" fill="${c[0]}" stroke="${dk(c[0], .15)}" stroke-width="2"/>
          ${[-10, -4, 2, 8].map(d => `<path d="M${x + d} ${y - 8}l2 6" stroke="${dk(c[0], .2)}" stroke-width="1.5"/>`).join('')}`;
      });
      return s;
    },
    knoedel(c, R) {
      return teller() + klecks(R, 120, 104, 46, c[1], 12) +
        [[100, 86], [140, 86], [120, 116]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="${dk(c[0], .1)}"/><circle cx="${x - 2}" cy="${y - 2}" r="18" fill="${c[0]}"/><circle cx="${x - 8}" cy="${y - 8}" r="5" fill="${lt(c[0], .5)}" opacity=".7"/>`).join('') +
        punkte(R, 120, 96, 70, 10, c[2], 2.2) + kraeuter(R, 120, 96, 60, 4);
    },
    sushi(c, R) {
      let s = `<rect x="22" y="58" width="196" height="76" rx="6" fill="#b88a55"/><rect x="22" y="58" width="196" height="8" fill="#a0733f"/>`;
      [52, 84].forEach(x => s += `<ellipse cx="${x}" cy="104" rx="14" ry="20" fill="#f6f3ea"/><path d="M${x - 16} 96c0-14 32-14 32 0v20c0 12-32 12-32 0Z" fill="${c[0]}"/>
        <path d="M${x - 10} 94l20 6M${x - 10} 104l20 6" stroke="${lt(c[0], .4)}" stroke-width="2"/>`);
      [124, 156, 188].forEach(x => s += `<circle cx="${x}" cy="98" r="15" fill="#1f2a1f"/><circle cx="${x}" cy="98" r="12" fill="#f6f3ea"/><circle cx="${x}" cy="98" r="5" fill="${c[1]}"/>`);
      return s + `<path d="M170 132c8-4 22-4 28 4" fill="#9cc56a" stroke="#7aa648"/>` + klecks(R, 196, 128, 6, '#7fb64a') + punkte(R, 150, 124, 10, 4, c[2], 2);
    },
    fisch(c, R) {
      return `<ellipse cx="124" cy="100" rx="96" ry="54" fill="#000" opacity=".12"/><ellipse cx="120" cy="92" rx="96" ry="54" fill="#fbfaf7" stroke="#d9d3c8" stroke-width="1.5"/>
        <path d="M48 92c22-30 86-34 118 0-32 34-96 30-118 0Z" fill="${c[0]}" stroke="${dk(c[0], .25)}" stroke-width="2.5"/>
        <path d="M166 92l26-22v44Z" fill="${dk(c[0], .1)}" stroke="${dk(c[0], .25)}" stroke-width="2.5"/>
        <circle cx="66" cy="88" r="4" fill="${INK}"/><path d="M80 76c4 8 4 24 0 32" stroke="${dk(c[0], .3)}" stroke-width="2" fill="none"/>
        ${[96, 112, 128, 144].map(x => `<path d="M${x} 74l8 8M${x} 102l8-8" stroke="${dk(c[0], .35)}" stroke-width="2.5"/>`).join('')}` +
        zitrone(100, 132, 9) + zitrone(124, 136, 9) + kraeuter(R, 112, 92, 60, 5) + punkte(R, 112, 92, 80, 8, c[2], 1.6);
    },
    meeresfruechte(c, R) {
      let s = `<circle cx="124" cy="98" r="78" fill="#000" opacity=".13"/><circle cx="120" cy="92" r="74" fill="#3a3a3a"/><circle cx="120" cy="92" r="66" fill="${c[1]}"/>
        <rect x="190" y="84" width="40" height="12" rx="6" fill="#3a3a3a"/>`;
      for (let i = 0; i < 6; i++) { const x = 80 + R() * 80, y = 60 + R() * 64, w = R() * 360; s += `<path d="M${x} ${y}c0-12 18-16 24-6" stroke="${c[0]}" stroke-width="7" fill="none" stroke-linecap="round" transform="rotate(${w} ${x} ${y})"/>`; }
      for (let i = 0; i < 5; i++) { const x = 76 + R() * 88, y = 58 + R() * 68, w = R() * 360; s += `<g transform="rotate(${w} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="11" ry="6" fill="#20232e"/><ellipse cx="${x}" cy="${y}" rx="7" ry="3.5" fill="#f0a35a"/></g>`; }
      return s + zitrone(150, 70, 9) + kraeuter(R, 120, 92, 90, 8);
    },
    auflauf(c, R) {
      return `<ellipse cx="126" cy="102" rx="92" ry="64" fill="#000" opacity=".12"/>
        <rect x="26" y="36" width="188" height="116" rx="40" fill="${dk(c[2], .1)}"/><rect x="40" y="46" width="160" height="96" rx="30" fill="${c[0]}"/>` +
        Array.from({ length: 26 }, () => klecks(R, 56 + R() * 128, 56 + R() * 76, 5 + R() * 6, R() > .5 ? dk(c[0], .2) : lt(c[0], .2), 7)).join('') +
        punkte(R, 120, 94, 120, 12, c[1], 2.5) + kraeuter(R, 120, 94, 90, 5);
    },
    pfanne(c, R) {
      let s = `<circle cx="112" cy="98" r="72" fill="#000" opacity=".13"/><rect x="170" y="86" width="64" height="14" rx="7" fill="#3a3a3a"/>
        <circle cx="108" cy="92" r="70" fill="#2f2f2f"/><circle cx="108" cy="92" r="62" fill="${dk(c[0], .1)}"/>`;
      s += Array.from({ length: 18 }, () => klecks(R, 66 + R() * 84, 52 + R() * 80, 6 + R() * 6, [c[0], c[1], c[2]][Math.floor(R() * 3)], 7)).join('');
      return s + kraeuter(R, 108, 92, 80, 7);
    },
    eier(c, R) {
      return `<circle cx="112" cy="98" r="72" fill="#000" opacity=".13"/><rect x="170" y="86" width="64" height="14" rx="7" fill="#3a3a3a"/>
        <circle cx="108" cy="92" r="70" fill="#2f2f2f"/><circle cx="108" cy="92" r="62" fill="${c[0]}"/>` +
        Array.from({ length: 10 }, () => klecks(R, 66 + R() * 84, 52 + R() * 80, 6, c[1], 7)).join('') +
        [[90, 76], [130, 82], [104, 116]].map(([x, y]) => klecks(R, x, y, 16, '#fbf8f0', 9) + `<circle cx="${x}" cy="${y}" r="7.5" fill="#f2a922"/>`).join('') + kraeuter(R, 108, 92, 80, 7);
    },
    pfannkuchen(c, R) {
      let s = teller(120, 110, 70);
      for (let i = 0; i < 5; i++) s += `<ellipse cx="120" cy="${112 - i * 9}" rx="52" ry="15" fill="${dk(c[0], .15)}"/><ellipse cx="120" cy="${109 - i * 9}" rx="50" ry="13" fill="${c[0]}"/>`;
      return s + `<path d="M84 66c10 10 62 10 72 0 4 10-2 22-10 16 0 10-10 12-12 4-4 10-14 8-14 0-6 8-18 6-16-4-10 4-20-6-20-16Z" fill="${c[2]}" opacity=".85"/>
        <rect x="108" y="54" width="24" height="10" rx="2" fill="#fbe7a1"/>` + punkte(R, 120, 72, 50, 6, c[1], 4);
    },
    kuchen(c, R) {
      return teller(120, 100, 70) + `<path d="M64 120L176 98V70L64 92Z" fill="${c[0]}"/>
        <path d="M64 92L176 70 168 62 56 84Z" fill="${lt(c[2], .2)}"/><path d="M64 92v28l-8-8V84Z" fill="${dk(c[0], .1)}"/>
        <path d="M64 101L176 79M64 110L176 88" stroke="${c[1]}" stroke-width="4"/>` +
        punkte(R, 116, 74, 70, 6, c[1], 3) + `<path d="M190 120c10 4 14 14 8 20" stroke="#9aa3a6" stroke-width="3" fill="none"/>`;
    },
    torte(c, R) {
      let s = `<ellipse cx="120" cy="146" rx="92" ry="16" fill="#e9e3d8"/><ellipse cx="120" cy="140" rx="78" ry="14" fill="#fbfaf7" stroke="#d9d3c8"/>
        <path d="M54 72v62c0 10 132 10 132 0V72Z" fill="${c[0]}"/><path d="M54 96c0 8 132 8 132 0M54 116c0 8 132 8 132 0" stroke="${c[1]}" stroke-width="5" fill="none"/>
        <ellipse cx="120" cy="72" rx="66" ry="14" fill="${lt(c[2], .4)}"/>`;
      for (let i = 0; i < 8; i++) { const x = 66 + i * 15.5; s += `<path d="M${x} 72c-6-2-6-10 0-12 6 2 6 10 0 12Z" fill="#fffaf1" stroke="#e8dfcf"/><circle cx="${x}" cy="58" r="4.5" fill="${c[1]}"/>`; }
      return s + punkte(R, 120, 72, 60, 16, dk(c[0], .35), 1.4);
    },
    dessert(c, R) {
      return `<ellipse cx="120" cy="150" rx="46" ry="8" fill="#000" opacity=".12"/>
        <path d="M78 40h84l-8 100c-1 8-68 8-68 0Z" fill="#eef3f5" stroke="#b9c5ca" stroke-width="2"/>
        <path d="M82 66h76l-2 26H84Z" fill="${c[0]}"/><path d="M84 92h72l-2 22H86Z" fill="${c[1]}"/><path d="M86 114h68l-2 22c-1 6-62 6-64 0Z" fill="${dk(c[0], .1)}"/>
        <path d="M82 66c10-12 66-12 76 0" fill="${lt(c[2], .5)}"/>` + punkte(R, 120, 58, 40, 8, c[2], 3) +
        `<path d="M136 46c8-14 22-14 26-8-6 4-14 8-26 8Z" fill="#5f9a3a"/><path d="M78 40h84" stroke="#fff" stroke-width="3" opacity=".7"/>`;
    },
    gebaeck(c, R) {
      let s = `<rect x="20" y="40" width="200" height="110" rx="10" fill="#c9a77c"/><rect x="26" y="46" width="188" height="98" rx="6" fill="#dcc29a"/>`;
      [[70, 80], [130, 76], [180, 96], [96, 122], [154, 124]].forEach(([x, y], i) => {
        s += `<path d="M${x - 26} ${y + 6}c4-22 48-22 52 0-8 10-44 10-52 0Z" fill="${dk(c[0], .1)}"/><path d="M${x - 22} ${y + 4}c4-18 40-18 44 0-6 7-38 7-44 0Z" fill="${c[0]}"/>
          <path d="M${x - 12} ${y - 6}q12 6 24 0" stroke="${c[1]}" stroke-width="3" fill="none"/>`;
      });
      return s + punkte(R, 120, 96, 160, 30, '#fffaf0', 1.4);
    },
    brot(c, R) {
      let s = `<rect x="24" y="50" width="196" height="100" rx="12" fill="#b88a55"/><rect x="24" y="50" width="196" height="8" rx="4" fill="#a0733f"/>
        <path d="M44 112c0-40 30-56 64-56s64 16 64 56c0 12-128 12-128 0Z" fill="${dk(c[0], .1)}"/>
        <path d="M50 110c0-34 26-48 58-48s58 14 58 48c0 10-116 10-116 0Z" fill="${c[0]}"/>`;
      [76, 100, 124, 148].forEach(x => s += `<path d="M${x - 8} 78q8 14 16 0" stroke="${lt(c[1], .2)}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
      return s + `<ellipse cx="190" cy="118" rx="16" ry="22" fill="${dk(c[0], .2)}"/><ellipse cx="190" cy="118" rx="12" ry="18" fill="${lt(c[2], .2)}"/>` + punkte(R, 190, 118, 16, 8, dk(c[2], .2), 1);
    },
    dip(c, R) {
      let s = schale(110, 92, 52, c[0]);
      s += `<path d="M86 92c8-14 40-14 48 0-8 12-40 12-48 0Z" fill="none" stroke="${lt(c[0], .4)}" stroke-width="4"/>` + klecks(R, 110, 92, 8, c[2]) + punkte(R, 110, 92, 30, 8, dk(c[1], .1), 2);
      for (let i = 0; i < 9; i++) {
        const w = i * 0.7 + .3, x = 116 + Math.cos(w) * 74, y = 92 + Math.sin(w) * 62;
        s += `<path d="M${x} ${y}l-14 22h28Z" fill="#e7c98a" stroke="#c9a35a" stroke-width="1.5" transform="rotate(${w * 57 + 90} ${x} ${y})"/>`;
      }
      return s + kraeuter(R, 110, 92, 40, 4);
    }
  };

  KB.titelbild = function (r, hintergrund) {
    const c = (r.farben && r.farben.length === 3) ? r.farben : ['#c9874a', '#7a9a4a', '#d9b26a'];
    const R = rng(r.id || r.name || 'x');
    const typ = H[r.bild] ? r.bild : 'teller';
    const bg = hintergrund || '#efe9df';
    const muster = Array.from({ length: 13 }, (_, i) => `<path d="M${i * 20} 0V180" stroke="${dk(bg, .06)}" stroke-width="7" opacity=".55"/>`).join('');
    return `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration ${(r.name || '').replace(/"/g, '')}">
      <rect width="240" height="180" fill="${bg}"/>${muster}${H[typ](c, R)}</svg>`;
  };

  /* ---------- Schritt-Illustrationen (Seitenansicht, 240×160) ---------- */
  const herd = `<rect x="0" y="138" width="240" height="22" fill="#d8d2c8"/><rect x="0" y="136" width="240" height="4" fill="#bdb5a8"/>`;
  const flamme = (x, s = 1, n = 5) => Array.from({ length: n }, (_, i) => {
    const xx = x + (i - (n - 1) / 2) * 10 * s;
    return `<path class="flamme" style="animation-delay:${i * .13}s" d="M${xx} 136c-5-6-4-12 0-${16 * s} 4 ${4 * s} 6 10 0 ${16 * s}Z" fill="#f08a24"/><path class="flamme" style="animation-delay:${i * .13}s" d="M${xx} 136c-2-3-2-6 0-${9 * s} 2 3 3 6 0 ${9 * s}Z" fill="#ffd34d"/>`;
  }).join('');
  const dampf = (x, y, n = 3) => Array.from({ length: n }, (_, i) =>
    `<path class="dampf" style="animation-delay:${i * .7}s" d="M${x + i * 16} ${y}c-8-8 8-14 0-22s8-14 0-22" stroke="#9aa6ad" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
  const topf = (x, y, w, h, inhalt) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#8e98a0"/>
    <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 10}" rx="4" fill="#a9b2b9"/>
    <rect x="${x - 14}" y="${y + 8}" width="16" height="8" rx="4" fill="#5a6168"/><rect x="${x + w - 2}" y="${y + 8}" width="16" height="8" rx="4" fill="#5a6168"/>
    <ellipse cx="${x + w / 2}" cy="${y + 2}" rx="${w / 2 - 2}" ry="6" fill="${inhalt}"/>`;
  const pfanneS = (x, y, w, inhalt) => `<path d="M${x} ${y}h${w}l-8 18H${x + 8}Z" fill="#3b3b3b"/><rect x="${x + w - 4}" y="${y + 2}" width="56" height="9" rx="4.5" fill="#3b3b3b" transform="rotate(-6 ${x + w} ${y})"/>${inhalt || ''}`;
  const brett = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="12" rx="4" fill="#c79c66"/><rect x="${x}" y="${y + 10}" width="${w}" height="4" rx="2" fill="#a77d4b"/>`;
  const messer = (x, y, w = 0) => `<g transform="rotate(${w} ${x} ${y})"><path d="M${x} ${y}h70c4 0 6 8-2 10H${x}Z" fill="#dfe4e7" stroke="#9aa3a8" stroke-width="1.5"/><rect x="${x - 34}" y="${y}" width="36" height="11" rx="4" fill="#2f2a26"/></g>`;
  const schuessel = (x, y, w, inhalt) => `<path d="M${x} ${y}h${w}c0 34-14 46-${w / 2} 46S${x} ${y + 34} ${x} ${y}Z" fill="#e9e4dc" stroke="#bdb3a5" stroke-width="2"/><ellipse cx="${x + w / 2}" cy="${y + 1}" rx="${w / 2 - 3}" ry="6" fill="${inhalt}"/>`;
  const uhr = (x, y, r = 18) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="3"/><path class="zeiger" style="transform-origin:${x}px ${y}px" d="M${x} ${y}V${y - r + 5}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${y}h${r * .5}" stroke="#c41e1e" stroke-width="3" stroke-linecap="round"/>`;
  const stuecke = (R, x, y, w, h, n, farben) => Array.from({ length: n }, () => {
    const xx = x + R() * w, yy = y + R() * h;
    return `<rect x="${xx}" y="${yy}" width="${8 + R() * 6}" height="${7 + R() * 5}" rx="2.5" fill="${farben[Math.floor(R() * farben.length)]}" transform="rotate(${R() * 40 - 20} ${xx} ${yy})"/>`;
  }).join('');
  const blasen = (x, y, w) => Array.from({ length: 5 }, (_, i) => `<circle class="blase" style="animation-delay:${i * .35}s" cx="${x + 8 + i * (w - 16) / 4}" cy="${y}" r="${3 + (i % 2) * 2}" fill="#fff" opacity=".8"/>`).join('');

  const S = {
    vorbereiten: (c, R) => brett(20, 108, 200) + schuessel(26, 70, 44, c[0]) + schuessel(84, 74, 36, c[1]) + schuessel(132, 78, 30, c[2]) +
      `<circle cx="196" cy="92" r="14" fill="${c[1]}"/><path d="M196 78c2-6 8-8 12-6" stroke="#4f7d32" stroke-width="3" fill="none"/>`,
    schneiden: (c, R) => brett(20, 112, 200) + `<path d="M40 112c0-22 40-26 60-14v14Z" fill="${c[0]}"/>` +
      [110, 124, 138, 152].map((x, i) => `<rect x="${x}" y="${94 + i}" width="10" height="${18 - i}" rx="2" fill="${c[0]}" stroke="${dk(c[0], .2)}"/>`).join('') +
      `<g class="schneide">${messer(110, 74, -8)}</g>`,
    hacken: (c, R) => brett(20, 112, 200) + punkte(R, 120, 104, 90, 40, '#4f8a30', 3).replace(/cy="(\d+\.?\d*)"/g, (m, y) => `cy="${Math.min(+y, 110)}"`) +
      `<g class="wiege">${messer(96, 72, 0)}</g>`,
    marinieren: (c, R) => schuessel(50, 66, 140, mix(c[2], '#7a3d1d', .3)) + `<ellipse cx="110" cy="70" rx="34" ry="10" fill="${c[0]}"/><ellipse cx="144" cy="72" rx="24" ry="8" fill="${dk(c[0], .1)}"/>` +
      punkte(R, 120, 68, 90, 12, '#4f7d32', 2.5) + `<path d="M196 30c0 16-10 26-10 34" stroke="#4f7d32" stroke-width="3"/><path d="M190 44c-8-2-12 2-14 8 8 2 12-2 14-8Z" fill="#4f7d32"/>`,
    mischen: (c, R) => schuessel(50, 72, 140, c[0]) + `<path d="M84 72c20 6 52 6 72 0" stroke="${c[1]}" stroke-width="4" fill="none"/>
      <g class="ruehre"><rect x="120" y="14" width="10" height="70" rx="5" fill="#b78a5a" transform="rotate(20 125 80)"/></g>`,
    aufschlagen: (c, R) => schuessel(50, 76, 140, lt(c[0], .4)) + `<g class="ruehre"><path d="M132 10l-14 62" stroke="#6a6f73" stroke-width="5" stroke-linecap="round"/>
      <path d="M116 66c-14 6-12 24 0 22s16-18 6-22c-10 4-12 20-4 22" stroke="#9aa3a8" stroke-width="2.5" fill="none"/></g>` + punkte(R, 120, 74, 80, 10, '#fff', 3),
    kneten: (c, R) => brett(20, 120, 200) + `<path d="M64 120c0-30 30-42 56-42s56 12 56 42Z" fill="${lt(c[0], .55)}" stroke="${dk(lt(c[0], .55), .15)}" stroke-width="2"/>
      <path d="M90 104c10-10 26-10 34-2M118 112c10-8 22-8 30 0" stroke="${dk(lt(c[0], .55), .15)}" stroke-width="2" fill="none"/>
      <g class="druecke"><path d="M90 70c-6-10 4-22 18-20l30 6c10 2 10 14 0 16l-36 4c-6 0-10-2-12-6Z" fill="#e6b896" stroke="#b98a68" stroke-width="2"/></g>` + punkte(R, 120, 128, 160, 12, '#f5efe2', 1.5),
    gehen: (c, R) => schuessel(40, 70, 130, lt(c[0], .5)) + `<path class="atme" d="M50 70c0-34 110-34 110 0Z" fill="${lt(c[0], .55)}" stroke="${dk(lt(c[0], .55), .1)}" stroke-width="2"/>
      <path d="M44 66h122" stroke="#d9d0c2" stroke-width="4"/>` + uhr(198, 48),
    ausrollen: (c, R) => brett(10, 120, 220) + `<ellipse cx="120" cy="118" rx="88" ry="6" fill="${lt(c[0], .5)}"/>
      <g class="rolle"><rect x="70" y="92" width="100" height="22" rx="11" fill="#d8b07a" stroke="#a87d48" stroke-width="2"/><rect x="40" y="98" width="32" height="10" rx="5" fill="#b8884e"/><rect x="168" y="98" width="32" height="10" rx="5" fill="#b8884e"/></g>`,
    formen: (c, R) => brett(10, 120, 220) + [40, 80, 120, 160, 200].map((x, i) => `<ellipse cx="${x}" cy="${110}" rx="15" ry="${i === 4 ? 8 : 10}" fill="${c[0]}" stroke="${dk(c[0], .2)}" stroke-width="2"/>`).join('') +
      `<g class="druecke"><path d="M182 64c-6-10 4-22 18-20l24 6c10 2 10 14 0 16l-30 4c-6 0-10-2-12-6Z" fill="#e6b896" stroke="#b98a68" stroke-width="2"/></g>`,
    fuellen: (c, R) => brett(10, 122, 220) + `<ellipse cx="96" cy="116" rx="44" ry="10" fill="${lt(c[0], .6)}" stroke="${dk(lt(c[0], .6), .1)}"/>` + klecks(R, 96, 112, 13, c[1]) +
      `<path d="M150 116c0-20 50-20 50 0Z" fill="${lt(c[0], .6)}" stroke="${dk(lt(c[0], .6), .15)}" stroke-width="2"/>${[160, 170, 180, 190].map(x => `<path d="M${x} 102l3 6" stroke="${dk(lt(c[0], .6), .2)}" stroke-width="2"/>`).join('')}
      <g class="tauche"><path d="M120 40l-18 56" stroke="#9aa3a8" stroke-width="5" stroke-linecap="round"/><ellipse cx="100" cy="98" rx="10" ry="6" fill="#b9c1c6"/></g>`,
    panieren: (c, R) => [['#f3eee4', '#e8e0d2'], ['#f6d36a', '#f0c24a'], ['#d9a75a', '#c7913f']].map(([a, b], i) =>
      `<ellipse cx="${46 + i * 74}" cy="112" rx="34" ry="12" fill="#e9e4dc" stroke="#bdb3a5" stroke-width="2"/><ellipse cx="${46 + i * 74}" cy="110" rx="26" ry="7" fill="${a}"/>` + punkte(R, 46 + i * 74, 110, 30, 8, b, 2)).join('') +
      `<g class="tauche"><ellipse cx="120" cy="80" rx="26" ry="10" fill="${c[0]}" stroke="${dk(c[0], .2)}" stroke-width="2"/></g><path d="M78 90q20-16 40-10M150 82q20-6 34 10" stroke="#9aa6ad" stroke-width="2" fill="none" stroke-dasharray="4 5"/>`,
    anbraten: (c, R) => herd + flamme(110, 1.25, 7) + pfanneS(46, 100, 130, `<ellipse cx="110" cy="98" rx="38" ry="10" fill="${dk(c[0], .3)}"/><ellipse cx="110" cy="95" rx="34" ry="8" fill="${c[0]}"/>`) +
      `<g class="zisch">${[70, 96, 122, 148].map(x => `<path d="M${x} 80l-4-10M${x + 6} 80l4-12" stroke="#c9a46a" stroke-width="2.5" stroke-linecap="round"/>`).join('')}</g>`,
    braten: (c, R) => herd + flamme(110, 1, 5) + pfanneS(46, 100, 130, `<ellipse cx="96" cy="96" rx="24" ry="8" fill="${c[0]}" stroke="${dk(c[0], .3)}" stroke-width="2"/><ellipse cx="136" cy="96" rx="20" ry="7" fill="${c[1]}" stroke="${dk(c[1], .3)}" stroke-width="2"/>`) +
      `<g class="wende"><path d="M190 30l-36 54" stroke="#3b3b3b" stroke-width="5" stroke-linecap="round"/><rect x="138" y="82" width="26" height="8" rx="2" fill="#6a6f73" transform="rotate(-30 151 86)"/></g>`,
    wok: (c, R) => herd + flamme(120, 1.5, 7) + `<path d="M50 92c10 30 130 30 140 0Z" fill="#2f2f2f"/><rect x="186" y="84" width="46" height="9" rx="4.5" fill="#5a3e2a" transform="rotate(-14 186 88)"/>` +
      `<g class="wirble">${stuecke(R, 70, 40, 100, 40, 14, c)}</g>` + stuecke(R, 80, 86, 80, 8, 8, c),
    schmoren: (c, R) => herd + flamme(120, .8, 4) + `<rect x="54" y="66" width="132" height="70" rx="12" fill="${mix(c[2], '#8a2d24', .5)}"/><rect x="40" y="80" width="18" height="12" rx="6" fill="${dk(mix(c[2], '#8a2d24', .5), .3)}"/><rect x="182" y="80" width="18" height="12" rx="6" fill="${dk(mix(c[2], '#8a2d24', .5), .3)}"/>
      <path d="M50 66c0-16 140-16 140 0Z" fill="${dk(mix(c[2], '#8a2d24', .5), .15)}"/><rect x="110" y="44" width="20" height="8" rx="4" fill="#3b3b3b"/>` + dampf(150, 52, 2) + uhr(30, 40, 15),
    kochen: (c, R) => herd + flamme(120, 1.2, 6) + topf(66, 62, 108, 74, '#cfe3ec') + blasen(70, 62, 100) + dampf(96, 50, 3) + stuecke(R, 86, 54, 60, 6, 5, [c[0], c[1]]),
    koecheln: (c, R) => herd + flamme(120, .7, 4) + topf(66, 62, 108, 74, c[0]) + `<circle class="blase" cx="104" cy="62" r="3" fill="${lt(c[0], .5)}"/><circle class="blase" style="animation-delay:1s" cx="136" cy="63" r="2.5" fill="${lt(c[0], .5)}"/>` + dampf(110, 50, 2) +
      `<path d="M150 20l-30 46" stroke="#b78a5a" stroke-width="6" stroke-linecap="round"/>`,
    blanchieren: (c, R) => herd + flamme(70, 1, 4) + topf(26, 66, 90, 70, '#cfe3ec') + blasen(30, 66, 82) + dampf(46, 54, 2) +
      schuessel(142, 88, 86, '#d7eef7') + `<rect x="160" y="80" width="12" height="12" rx="2" fill="#eaf7fc" stroke="#a9d6e6"/><rect x="190" y="82" width="12" height="12" rx="2" fill="#eaf7fc" stroke="#a9d6e6"/>
      <path d="M118 60c12-12 24-12 36 4" stroke="${INK}" stroke-width="2.5" fill="none" stroke-dasharray="5 4" marker-end=""/><path d="M150 58l6 8-9 1" fill="none" stroke="${INK}" stroke-width="2.5"/>` + stuecke(R, 166, 86, 34, 6, 4, [c[0], c[1]]),
    daempfen: (c, R) => herd + flamme(120, .9, 4) + topf(70, 108, 100, 28, '#cfe3ec') +
      `<rect x="72" y="76" width="96" height="32" rx="6" fill="#d9b77e" stroke="#b08a4e" stroke-width="2"/><path d="M72 88h96M72 98h96" stroke="#b08a4e" stroke-width="1.5"/>
      <path d="M68 76c0-20 104-20 104 0Z" fill="#e3c590" stroke="#b08a4e" stroke-width="2"/>` + dampf(96, 54, 3),
    frittieren: (c, R) => herd + flamme(110, 1, 5) + topf(50, 60, 120, 76, '#e9b949') + blasen(54, 62, 112) + blasen(54, 70, 112) +
      `<rect x="80" y="54" width="60" height="30" rx="4" fill="none" stroke="#5a6168" stroke-width="3"/><path d="M90 54v30M100 54v30M110 54v30M120 54v30M130 54v30" stroke="#5a6168" stroke-width="1.2"/>
      <path d="M140 60l44-34" stroke="#3b3b3b" stroke-width="6" stroke-linecap="round"/>` + stuecke(R, 88, 66, 44, 10, 5, [c[0]]) +
      `<rect x="184" y="44" width="8" height="70" rx="4" fill="#fff" stroke="${INK}" stroke-width="2"/><rect x="186" y="74" width="4" height="38" fill="#c41e1e"/><circle cx="188" cy="116" r="7" fill="#c41e1e" stroke="${INK}" stroke-width="2"/>`,
    grillen: (c, R) => `<rect x="30" y="112" width="180" height="40" rx="8" fill="#2f2f2f"/>` + flamme(120, 1.1, 9).replace(/136/g, '108') +
      `<path d="M30 96h180" stroke="#5a5a5a" stroke-width="4"/>${[50, 70, 90, 110, 130, 150, 170, 190].map(x => `<path d="M${x} 92v8" stroke="#5a5a5a" stroke-width="3"/>`).join('')}
      <rect x="60" y="78" width="54" height="16" rx="7" fill="${c[0]}" stroke="${dk(c[0], .3)}" stroke-width="2"/><rect x="126" y="78" width="54" height="16" rx="7" fill="${c[1]}" stroke="${dk(c[1], .3)}" stroke-width="2"/>
      ${[70, 84, 98, 136, 150, 164].map(x => `<path d="M${x} 80l6 12" stroke="${INK}" stroke-width="2.5" opacity=".7"/>`).join('')}` + dampf(90, 70, 3),
    backen: (c, R) => `<rect x="34" y="16" width="172" height="136" rx="10" fill="#4a4f55"/><rect x="34" y="16" width="172" height="22" rx="10" fill="#3a3e43"/>
      ${[60, 84, 156, 180].map(x => `<circle cx="${x}" cy="27" r="5" fill="#c9cdd1"/>`).join('')}
      <rect x="50" y="48" width="140" height="92" rx="8" fill="#2c2420"/><rect class="glut" x="56" y="54" width="128" height="80" rx="6" fill="#f2a13a" opacity=".55"/>
      <path d="M62 110h116" stroke="#8a8f93" stroke-width="3"/><path d="M84 110c0-22 72-22 72 0Z" fill="${c[0]}" stroke="${dk(c[0], .25)}" stroke-width="2"/>
      <rect x="100" y="142" width="40" height="6" rx="3" fill="#c9cdd1"/><text x="120" y="33" text-anchor="middle" font-size="9" font-family="sans-serif" fill="#ffd34d">°C</text>`,
    ueberbacken: (c, R) => `<rect x="20" y="16" width="200" height="14" rx="4" fill="#4a4f55"/><path class="glut" d="M34 36h172" stroke="#ff6a2a" stroke-width="5" stroke-dasharray="14 6"/>` +
      `<rect x="50" y="78" width="140" height="56" rx="16" fill="${dk(c[2], .1)}"/><rect x="60" y="84" width="120" height="30" rx="10" fill="${c[0]}"/>` +
      Array.from({ length: 12 }, () => klecks(R, 66 + R() * 108, 88 + R() * 20, 4 + R() * 4, dk(c[0], .25), 6)).join('') +
      `<path class="dampf" d="M90 70c-6-6 6-10 0-16M150 70c-6-6 6-10 0-16" stroke="#f2a13a" stroke-width="2.5" fill="none"/>`,
    reduzieren: (c, R) => herd + flamme(120, 1, 5) + topf(70, 70, 100, 66, c[0]) + dampf(100, 58, 3) +
      `<path d="M190 74v40" stroke="${INK}" stroke-width="3"/><path d="M182 104l8 12 8-12" fill="none" stroke="${INK}" stroke-width="3"/><path d="M76 92h88" stroke="${lt(c[0], .5)}" stroke-width="2" stroke-dasharray="6 4"/>`,
    binden: (c, R) => herd + flamme(110, .8, 4) + pfanneS(50, 100, 120, `<ellipse cx="110" cy="98" rx="52" ry="7" fill="${c[0]}"/>`) +
      `<g class="ruehre"><path d="M140 20l-26 74" stroke="#6a6f73" stroke-width="5" stroke-linecap="round"/><path d="M106 88c-12 4-10 16 2 14s12-14 4-16" stroke="#9aa3a8" stroke-width="2.5" fill="none"/></g>
      <path d="M58 46l20 40" stroke="#9aa3a8" stroke-width="5" stroke-linecap="round"/><ellipse cx="80" cy="90" rx="9" ry="5" fill="#cfd5d8"/><path d="M80 94c0 6 2 10 0 16" stroke="${lt(c[0], .3)}" stroke-width="4" stroke-linecap="round"/>`,
    puerieren: (c, R) => topf(66, 66, 108, 74, c[0]) + `<g class="ruettel"><rect x="112" y="8" width="18" height="62" rx="7" fill="#e9edf0" stroke="#8e98a0" stroke-width="2"/><rect x="116" y="68" width="10" height="30" fill="#c9d0d4"/><path d="M110 98h22l-4 8h-14Z" fill="#8e98a0"/><circle cx="121" cy="24" r="4" fill="#c41e1e"/></g>` +
      `<path d="M96 68c10-6 20 6 30-2s20 6 30 0" stroke="${lt(c[0], .5)}" stroke-width="3" fill="none"/>`,
    abseihen: (c, R) => `<rect x="0" y="140" width="240" height="20" fill="#d8d2c8"/><path d="M60 104h120l-8 36H68Z" fill="#c8ced2"/>` +
      `<path d="M58 60h124c0 30-24 48-62 48S58 90 58 60Z" fill="#dfe4e7" stroke="#8e98a0" stroke-width="2.5"/>${[80, 96, 112, 128, 144, 160].map(x => `<circle cx="${x}" cy="84" r="2.5" fill="#8e98a0"/>`).join('')}
      ${stuecke(R, 76, 52, 88, 10, 10, [c[0], c[1]])}${[96, 112, 128, 144].map((x, i) => `<path class="tropfen" style="animation-delay:${i * .25}s" d="M${x} 110v8" stroke="#7fb8d6" stroke-width="3" stroke-linecap="round"/>`).join('')}` + dampf(100, 44, 3),
    abschmecken: (c, R) => topf(30, 80, 100, 60, c[0]) + `<g class="tauche"><path d="M160 20l-34 70" stroke="#b78a5a" stroke-width="6" stroke-linecap="round"/><ellipse cx="124" cy="94" rx="10" ry="7" fill="#c9a06c"/></g>` +
      `<rect x="168" y="96" width="26" height="44" rx="8" fill="#f4f1ea" stroke="#9aa3a8" stroke-width="2"/><rect x="170" y="88" width="22" height="12" rx="4" fill="#9aa3a8"/>${[175, 181, 187].map(x => `<circle cx="${x}" cy="93" r="1.4" fill="#4a4f55"/>`).join('')}
      <rect x="202" y="100" width="22" height="40" rx="7" fill="#3a3a3a"/><rect x="204" y="92" width="18" height="12" rx="4" fill="#9aa3a8"/>`,
    ruhen: (c, R) => brett(20, 116, 200) + `<path d="M50 116c0-30 30-40 60-40s60 10 60 40Z" fill="${c[0]}" stroke="${dk(c[0], .3)}" stroke-width="2"/>
      <path d="M44 104c20-34 112-34 132 0" fill="none" stroke="#c9cdd1" stroke-width="3" stroke-dasharray="3 4"/>` + uhr(200, 48, 20),
    kuehlen: (c, R) => `<rect x="58" y="8" width="124" height="146" rx="10" fill="#eef3f6" stroke="#9aa6ad" stroke-width="3"/><path d="M58 56h124" stroke="#9aa6ad" stroke-width="3"/>
      <rect x="164" y="22" width="6" height="22" rx="3" fill="#9aa6ad"/><rect x="164" y="68" width="6" height="30" rx="3" fill="#9aa6ad"/>` +
      `<g transform="translate(120 32)">${[0, 60, 120].map(w => `<path d="M0 -16V16M-5 -11 0 -6 5 -11M-5 11 0 6 5 11" stroke="#5aa0c8" stroke-width="3" fill="none" stroke-linecap="round" transform="rotate(${w})"/>`).join('')}</g>` +
      `<path d="M80 120c0-18 80-18 80 0Z" fill="${c[0]}"/><path d="M76 120h88" stroke="#9aa6ad" stroke-width="3"/>`,
    einlegen: (c, R) => `<path d="M76 40h88v100c0 8-88 8-88 0Z" fill="#e6f1ee" stroke="#8fb0a8" stroke-width="3" opacity=".95"/><rect x="72" y="28" width="96" height="16" rx="4" fill="${c[2]}"/>
      <path d="M80 60h80v78c0 6-80 6-80 0Z" fill="${lt(c[1], .55)}" opacity=".7"/>` + stuecke(R, 86, 66, 64, 64, 14, [c[0], c[1]]) + punkte(R, 120, 100, 60, 8, '#3a3a3a', 1.8),
    raeuchern: (c, R) => `<rect x="50" y="56" width="140" height="84" rx="8" fill="#3b3b3b"/><path d="M44 56c0-20 152-20 152 0Z" fill="#2b2b2b"/><rect x="140" y="20" width="16" height="26" fill="#2b2b2b"/>
      <rect x="66" y="78" width="108" height="40" rx="4" fill="#1f1f1f"/><rect x="76" y="90" width="40" height="18" rx="6" fill="${c[0]}"/><rect x="124" y="90" width="40" height="18" rx="6" fill="${c[1]}"/>` +
      Array.from({ length: 3 }, (_, i) => `<path class="dampf" style="animation-delay:${i * .8}s" d="M${142 + i * 6} 18c-10-6 10-10 0-18" stroke="#8a8f93" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`).join(''),
    flambieren: (c, R) => herd + pfanneS(46, 104, 130, `<ellipse cx="110" cy="102" rx="44" ry="8" fill="${c[0]}"/>`) +
      `<g class="lodern"><path d="M70 100c-10-30 10-50 20-74 4 22 14 30 20 6 14 20 22 44 10 68 14-8 22-26 20-44 16 22 16 44 0 46Z" fill="#f08a24" opacity=".9"/><path d="M84 100c-4-16 6-28 12-40 4 14 8 18 12 4 8 12 12 26 4 36Z" fill="#ffd34d"/></g>`,
    schichten: (c, R) => `<rect x="40" y="36" width="160" height="108" rx="8" fill="#f2efe8" stroke="#bdb3a5" stroke-width="3"/>` +
      [c[0], c[1], c[2], c[0], c[1]].map((f, i) => `<rect x="46" y="${118 - i * 18}" width="148" height="${16}" fill="${f}"/>`).join('') +
      `<g class="tauche"><path d="M176 10l-22 30" stroke="#9aa3a8" stroke-width="5" stroke-linecap="round"/><ellipse cx="150" cy="44" rx="12" ry="6" fill="#b9c1c6"/></g>`,
    rollen: (c, R) => `<rect x="20" y="112" width="200" height="12" fill="#c8b07a"/>${Array.from({ length: 20 }, (_, i) => `<path d="M${22 + i * 10} 112v12" stroke="#a88e58" stroke-width="2"/>`).join('')}` +
      `<rect x="40" y="104" width="90" height="8" fill="${lt(c[0], .3)}"/><g class="rolle"><circle cx="160" cy="88" r="24" fill="#1f2a1f"/><circle cx="160" cy="88" r="20" fill="#f6f3ea"/>
      <path d="M160 88m-12 0a12 12 0 1 0 24 0 8 8 0 1 0-16 0 4 4 0 1 0 8 0" stroke="${c[0]}" stroke-width="3" fill="none"/></g>`,
    anrichten: (c, R) => `<ellipse cx="120" cy="128" rx="96" ry="22" fill="#e9e3d8"/><ellipse cx="120" cy="122" rx="90" ry="20" fill="#fbfaf7" stroke="#d9d3c8" stroke-width="2"/>
      <ellipse cx="120" cy="120" rx="64" ry="13" fill="#f4f1ea"/>` + klecks(R, 100, 116, 18, c[0]).replace(/fill/, 'transform="scale(1 .5) translate(0 116)" fill') +
      `<path d="M88 116c0-16 30-20 40-8v8Z" fill="${c[0]}"/><path d="M128 116c4-12 22-12 26 0Z" fill="${c[1]}"/>
      <g class="tauche"><path d="M200 30l-40 60" stroke="#9aa3a8" stroke-width="5" stroke-linecap="round"/><ellipse cx="156" cy="94" rx="12" ry="6" fill="#b9c1c6"/></g>`,
    garnieren: (c, R) => `<ellipse cx="120" cy="128" rx="96" ry="22" fill="#e9e3d8"/><ellipse cx="120" cy="122" rx="90" ry="20" fill="#fbfaf7" stroke="#d9d3c8" stroke-width="2"/>
      <path d="M78 118c0-22 84-22 84 0Z" fill="${c[0]}"/>` +
      Array.from({ length: 7 }, (_, i) => `<path class="fallen" style="animation-delay:${i * .3}s" d="M${96 + i * 8} ${40 + (i % 3) * 14}c2-4 6-5 9-3-2 3-6 5-9 3Z" fill="#4f8a30"/>`).join('') +
      `<path d="M150 24c-10 6-14 14-12 22" stroke="#4f8a30" stroke-width="3" fill="none"/><path d="M140 36c-8-4-14-2-16 4 6 2 12 2 16-4Z" fill="#4f8a30"/>`
  };

  KB.schrittbild = function (aktion, farben, schluessel) {
    const c = (farben && farben.length === 3) ? farben : ['#c9874a', '#7a9a4a', '#d9b26a'];
    const R = rng((schluessel || '') + aktion);
    const f = S[aktion] || S.vorbereiten;
    return `<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${f(c, R)}</svg>`;
  };
  KB.AKTIONEN = Object.keys(S);
  KB.BILDTYPEN = Object.keys(H);
})();
