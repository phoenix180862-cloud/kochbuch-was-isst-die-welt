/* TW Weltkochbuch – Fliesenmuster je Küche (SVG, viewBox 0 0 100 100)
   Jede Funktion bekommt g = Glasur, l = Zeichnung, a = Akzent und gibt den Fliesen-Inhalt zurück. */
(function () {
  const rot = (n, s, cx = 50, cy = 50) => Array.from({ length: n }, (_, i) =>
    `<g transform="rotate(${(360 / n) * i} ${cx} ${cy})">${s}</g>`).join('');
  const ecken = s => [[0, 0], [100, 0], [100, 100], [0, 100]].map(([x, y], i) =>
    `<g transform="translate(${x} ${y}) rotate(${i * 90})">${s}</g>`).join('');
  const sternPfad = (cx, cy, r1, r2, n) => {
    let p = '';
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? r2 : r1, w = Math.PI * i / n - Math.PI / 2;
      p += (i ? 'L' : 'M') + (cx + r * Math.cos(w)).toFixed(2) + ' ' + (cy + r * Math.sin(w)).toFixed(2);
    }
    return p + 'Z';
  };

  const M = {
    raute: (g, l, a) => `
      <path d="M50 4 96 50 50 96 4 50Z" fill="none" stroke="${l}" stroke-width="2.4"/>
      <path d="M50 20 80 50 50 80 20 50Z" fill="${a}" opacity=".9"/>
      <path d="M50 34 66 50 50 66 34 50Z" fill="${g}"/>
      <circle cx="50" cy="50" r="4" fill="${l}"/>
      ${ecken(`<path d="M0 0 14 0 0 14Z" fill="${l}"/>`)}`,

    gmunden: (g, l, a) => `
      ${[18, 38, 58, 78].map(y => `<path d="M0 ${y} Q12.5 ${y - 9} 25 ${y} T50 ${y} T75 ${y} T100 ${y}" fill="none" stroke="${l}" stroke-width="3.2" stroke-linecap="round"/>`).join('')}
      ${[28, 68].map(y => [12, 37, 62, 87].map(x => `<circle cx="${x}" cy="${y}" r="3" fill="${a}"/>`).join('')).join('')}`,

    kreuz: (g, l, a) => `
      <rect x="8" y="8" width="84" height="84" rx="6" fill="none" stroke="${a}" stroke-width="1.6" opacity=".6"/>
      <path d="M42 22h16v20h20v16H58v20H42V58H22V42h20Z" fill="${l}"/>
      ${ecken(`<circle cx="12" cy="12" r="3.5" fill="${a}" opacity=".7"/>`)}`,

    majolika: (g, l, a) => `
      <circle cx="50" cy="50" r="40" fill="none" stroke="${l}" stroke-width="2.2"/>
      ${rot(8, `<path d="M50 14 C58 26 58 36 50 44 C42 36 42 26 50 14Z" fill="${l}"/>`)}
      ${rot(8, `<circle cx="50" cy="22" r="3.4" fill="${a}"/>`).replace(/rotate\((\d+)/g, (m, d) => `rotate(${+d + 22.5}`)}
      <circle cx="50" cy="50" r="7" fill="${a}"/>
      ${ecken(`<path d="M0 0h16a16 16 0 0 1-16 16Z" fill="${a}"/>`)}`,

    lilie: (g, l, a) => `
      <rect x="6" y="6" width="88" height="88" fill="none" stroke="${a}" stroke-width="1.8"/>
      <path d="M50 18c7 9 7 20 0 30-7-10-7-21 0-30Z" fill="${l}"/>
      <path d="M48 50c-9-8-22-6-24 4 9-3 16 0 20 6Z M52 50c9-8 22-6 24 4-9-3-16 0-20 6Z" fill="${l}"/>
      <rect x="36" y="56" width="28" height="5" rx="2" fill="${a}"/>
      <path d="M46 61h8l-4 18Z" fill="${l}"/>`,

    sevilla: (g, l, a) => `
      <path d="${sternPfad(50, 50, 40, 22, 8)}" fill="${a}"/>
      <path d="${sternPfad(50, 50, 26, 15, 8)}" fill="${l}"/>
      <circle cx="50" cy="50" r="7" fill="${g}"/>
      ${ecken(`<path d="M0 0h22L0 22Z" fill="${l}"/>`)}`,

    azulejo: (g, l, a) => `
      ${ecken(`<path d="M0 0h34a34 34 0 0 1-34 34Z" fill="none" stroke="${l}" stroke-width="3"/><path d="M0 0h20a20 20 0 0 1-20 20Z" fill="${l}"/>`)}
      ${rot(4, `<path d="M50 24 C57 34 57 40 50 46 C43 40 43 34 50 24Z" fill="${l}"/>`)}
      ${rot(4, `<path d="M50 26 C54 33 54 37 50 41 C46 37 46 33 50 26Z" fill="${g}" opacity=".9"/>`, 50, 50).replace(/rotate\((\d+)/g, (m, d) => `rotate(${+d + 45}`)}
      <circle cx="50" cy="50" r="6" fill="${l}"/><circle cx="50" cy="50" r="2.5" fill="${g}"/>`,

    maeander: (g, l, a) => `
      <rect x="4" y="4" width="92" height="92" fill="none" stroke="${l}" stroke-width="2"/>
      <path d="M14 86V14h72v72H26V26h48v48H38V38h24v24H50" fill="none" stroke="${l}" stroke-width="5" stroke-linejoin="miter"/>`,

    delft: (g, l, a) => `
      ${ecken(`<path d="M2 12c4-2 6-6 6-10M12 2c-2 4-6 6-10 6" stroke="${l}" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="7" cy="7" r="2" fill="${l}"/>`)}
      <circle cx="50" cy="50" r="30" fill="none" stroke="${l}" stroke-width="1.4" opacity=".5"/>
      <path d="M34 62c6-6 10-6 16-4l20-2-6 6c-10 2-22 4-30 0Z" fill="${l}"/>
      <path d="M50 58V30" stroke="${l}" stroke-width="2"/><path d="M50 30l14 12H50Z M48 34l-10 10h10Z" fill="${l}" opacity=".85"/>
      <path d="M30 70q10-4 20 0t20 0" stroke="${l}" stroke-width="1.8" fill="none"/>`,

    iznik: (g, l, a) => `
      <path d="M50 92V40" stroke="${l}" stroke-width="3"/>
      <path d="M50 70C36 64 28 52 30 40c8 8 16 14 20 30Z M50 62C64 56 72 44 70 32c-8 8-16 14-20 30Z" fill="${l}"/>
      <path d="M50 10c-8 6-12 16-10 26 3-3 6-4 10-4s7 1 10 4c2-10-2-20-10-26Z" fill="${a}"/>
      <path d="M38 22c-4 4-4 12 2 16M62 22c4 4 4 12-2 16" stroke="${a}" stroke-width="3" fill="none"/>
      ${ecken(`<path d="M0 0c10 0 14 4 14 14C4 14 0 10 0 0Z" fill="${l}" opacity=".85"/>`)}`,

    victoria: (g, l, a) => `
      <path d="M50 0 100 50 50 100 0 50Z" fill="${l}"/>
      <path d="M50 18 82 50 50 82 18 50Z" fill="${g}"/>
      ${rot(4, `<path d="M50 30c6 4 6 10 0 14-6-4-6-10 0-14Z" fill="${a}"/>`)}
      <circle cx="50" cy="50" r="5" fill="${l}"/>`,

    nordisch: (g, l, a) => `
      ${rot(6, `<path d="M50 50V12M50 24l-8-8M50 24l8-8M50 36l-6-6M50 36l6-6" stroke="${l}" stroke-width="3" stroke-linecap="round" fill="none"/>`)}
      <circle cx="50" cy="50" r="6" fill="${a}"/>
      ${ecken(`<circle cx="0" cy="0" r="9" fill="${a}" opacity=".85"/>`)}`,

    volkskunst: (g, l, a) => `
      <path d="M50 88V48" stroke="${l}" stroke-width="3"/>
      <path d="M50 74c-14 0-22-8-24-18 10 0 20 6 24 18ZM50 66c14 0 22-8 24-18-10 0-20 6-24 18Z" fill="${l}"/>
      ${rot(8, `<ellipse cx="50" cy="20" rx="5" ry="10" fill="${a}"/>`, 50, 34).replace(/translate/g, 'translate')}
      <circle cx="50" cy="34" r="6" fill="${l}"/><circle cx="50" cy="34" r="2.5" fill="${g}"/>`,

    stickerei: (g, l, a) => `
      ${rot(4, `<path d="M50 50C46 38 46 28 50 16 54 28 54 38 50 50Z" fill="${l}"/><circle cx="50" cy="12" r="4" fill="${a}"/>`)}
      ${rot(4, `<path d="M50 50C47 41 47 34 50 26 53 34 53 41 50 50Z" fill="${a}"/>`).replace(/rotate\((\d+)/g, (m, d) => `rotate(${+d + 45}`)}
      <circle cx="50" cy="50" r="6" fill="${g}" stroke="${l}" stroke-width="3"/>
      ${ecken(`<path d="M0 0h10v10H0Z" fill="${l}"/>`)}`,

    gitter: (g, l, a) => `
      <rect x="8" y="8" width="84" height="84" fill="none" stroke="${l}" stroke-width="4"/>
      <path d="M8 30h22V8M70 8v22h22M92 70H70v22M30 92V70H8M30 30h40v40H30Z M30 50h12M58 50h12M50 30v12M50 58v12" fill="none" stroke="${l}" stroke-width="4"/>
      <circle cx="50" cy="50" r="6" fill="${a}"/>`,

    seigaiha: (g, l, a) => {
      let s = '';
      for (let row = 0; row < 6; row++) for (let col = -1; col < 5; col++) {
        const x = col * 25 + (row % 2 ? 12.5 : 0), y = row * 14 + 14;
        s += `<g>${[22, 16, 10, 4].map((r, i) => `<circle cx="${x}" cy="${y}" r="${r / 1.6}" fill="${i % 2 ? g : l}"/>`).join('')}</g>`;
      }
      return s + `<circle cx="78" cy="22" r="9" fill="${a}"/>`;
    },

    lotus: (g, l, a) => `
      ${rot(8, `<path d="M50 50C42 36 44 22 50 10 56 22 58 36 50 50Z" fill="${l}"/>`)}
      ${rot(8, `<path d="M50 50C45 41 46 32 50 24 54 32 55 41 50 50Z" fill="${a}"/>`).replace(/rotate\((\d+)/g, (m, d) => `rotate(${+d + 22.5}`)}
      <circle cx="50" cy="50" r="7" fill="${g}" stroke="${a}" stroke-width="3"/>`,

    bambus: (g, l, a) => `
      ${[24, 50, 76].map((x, i) => `<rect x="${x - 5}" y="0" width="10" height="100" rx="3" fill="${l}" opacity="${0.75 + i * 0.1}"/>
        ${[22 + i * 9, 58 + i * 7].map(y => `<rect x="${x - 6}" y="${y}" width="12" height="3" fill="${g}"/>`).join('')}`).join('')}
      <path d="M50 40c12-8 24-8 34-2-12 6-22 6-34 2ZM24 70c-10-6-18-6-24-2 8 6 16 6 24 2Z" fill="${a}"/>`,

    dancheong: (g, l, a) => `
      ${rot(4, `<path d="M50 50 L50 8" stroke="${l}" stroke-width="6"/><circle cx="50" cy="16" r="7" fill="${a}"/><circle cx="50" cy="16" r="3" fill="${g}"/>`)}
      <circle cx="50" cy="50" r="16" fill="${l}"/>
      ${rot(8, `<path d="M50 50C47 44 47 39 50 34 53 39 53 44 50 50Z" fill="${a}"/>`)}
      <circle cx="50" cy="50" r="4" fill="${g}"/>`,

    mandala: (g, l, a) => `
      <circle cx="50" cy="50" r="42" fill="none" stroke="${l}" stroke-width="2"/>
      ${rot(12, `<path d="M50 8C54 16 54 22 50 28 46 22 46 16 50 8Z" fill="${l}"/>`)}
      ${rot(8, `<path d="M50 50C44 42 44 34 50 26 56 34 56 42 50 50Z" fill="${a}"/>`)}
      <circle cx="50" cy="50" r="8" fill="${l}"/><circle cx="50" cy="50" r="3.5" fill="${a}"/>`,

    batik: (g, l, a) => `
      ${[0, 1, 2, 3].map(i => [0, 1, 2, 3].map(j => {
        const x = 12.5 + i * 25, y = 12.5 + j * 25;
        return `<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="${l}" stroke-width="2.4"/>
          <path d="M${x - 7} ${y}a7 7 0 0 1 14 0 7 7 0 0 1-14 0Z" fill="${(i + j) % 2 ? a : l}"/>`;
      }).join('')).join('')}`,

    arabeske: (g, l, a) => `
      ${rot(4, `<path d="M50 50C50 34 62 26 76 24 70 36 62 44 50 50Z" fill="${l}"/><path d="M50 50C50 40 44 30 34 26 36 38 42 46 50 50Z" fill="${a}"/>`)}
      <path d="${sternPfad(50, 50, 12, 6, 8)}" fill="${g}" stroke="${l}" stroke-width="2"/>`,

    girih: (g, l, a) => `
      <path d="${sternPfad(50, 50, 44, 30, 10)}" fill="${l}"/>
      <path d="${sternPfad(50, 50, 30, 20, 10)}" fill="${g}"/>
      <path d="${sternPfad(50, 50, 18, 10, 5)}" fill="${a}"/>
      ${ecken(`<path d="M0 0 18 0 0 18Z" fill="${a}"/>`)}`,

    zellige: (g, l, a) => `
      <path d="${sternPfad(50, 50, 46, 34, 8)}" fill="${l}"/>
      <path d="${sternPfad(50, 50, 32, 24, 8)}" fill="${g}"/>
      <path d="M50 30 70 50 50 70 30 50Z" fill="${a}"/>
      <path d="M50 38 62 50 50 62 38 50Z" fill="${g}"/>
      ${ecken(`<path d="M0 0h14L0 14Z" fill="${a}"/>`)}`,

    kente: (g, l, a) => `
      ${[0, 1, 2, 3].map(i => `<rect x="0" y="${i * 25}" width="100" height="12" fill="${i % 2 ? a : l}"/>`).join('')}
      ${[0, 1, 2, 3].map(i => `<rect x="${i * 25 + 6}" y="0" width="12" height="100" fill="${i % 2 ? l : a}" opacity=".85"/>`).join('')}
      ${[12, 37, 62, 87].map(x => [12, 37, 62, 87].map(y => `<rect x="${x - 3}" y="${y - 3}" width="6" height="6" fill="${g}"/>`).join('')).join('')}`,

    quilt: (g, l, a) => `
      <path d="M0 0h50L0 50Z M100 100H50l50-50Z" fill="${l}"/>
      <path d="M100 0v50L50 0Z M0 100V50l50 50Z" fill="${a}"/>
      <path d="${sternPfad(50, 50, 22, 9, 5)}" fill="${g}" stroke="${l}" stroke-width="2"/>`,

    talavera: (g, l, a) => `
      <circle cx="50" cy="50" r="30" fill="${l}"/>
      ${rot(8, `<path d="M50 8C57 14 57 22 50 28 43 22 43 14 50 8Z" fill="${a}"/>`)}
      ${rot(8, `<circle cx="50" cy="30" r="5" fill="${a}"/>`).replace(/rotate\((\d+)/g, (m, d) => `rotate(${+d + 22.5}`)}
      <circle cx="50" cy="50" r="12" fill="${g}"/><circle cx="50" cy="50" r="5" fill="${a}"/>
      ${ecken(`<path d="M0 0h12a12 12 0 0 1-12 12Z" fill="${l}"/>`)}`,

    anden: (g, l, a) => `
      <path d="M0 50h10V40h10V30h10V20h10V10h20v10h10v10h10v10h10v10h10" fill="none" stroke="${l}" stroke-width="5"/>
      <path d="M0 100V80h20V70h20V60h20v10h20v10h20v20Z" fill="${a}"/>
      <rect x="44" y="22" width="12" height="12" fill="${a}"/>
      <path d="M0 60h100" stroke="${l}" stroke-width="2"/>`,

    tropen: (g, l, a) => `
      <path d="M50 96V46" stroke="${l}" stroke-width="4"/>
      ${[[-1, 0], [1, 0], [-1, 1], [1, 1]].map(([d, k]) =>
        `<path d="M50 46c${d * 14} ${-12 + k * 10} ${d * 30} ${-12 + k * 10} ${d * 42} ${k * 10}c${-d * 16} ${-4} ${-d * 30} ${-6} ${-d * 42} ${-k * 10 + 0}Z" fill="${l}"/>`).join('')}
      <circle cx="80" cy="20" r="11" fill="${a}"/>
      <path d="M50 46c0-16-6-28-14-36 12 4 16 18 14 36Z" fill="${l}"/>`
  };

  /* Komplette Fliese mit Glasur-Glanz; id muss je Seite eindeutig sein */
  window.KB = window.KB || {};
  KB.fliese = function (muster, f, id) {
    const [g, l, a] = f;
    const inhalt = (M[muster] || M.raute)(g, l, a);
    const gid = 'gl' + (id || Math.random().toString(36).slice(2, 8));
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><radialGradient id="${gid}" cx="30%" cy="22%" r="85%">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".10"/></radialGradient></defs>
      <rect width="100" height="100" fill="${g}"/>${inhalt}
      <rect width="100" height="100" fill="url(#${gid})"/></svg>`;
  };
  KB.MUSTER = Object.keys(M);
})();
