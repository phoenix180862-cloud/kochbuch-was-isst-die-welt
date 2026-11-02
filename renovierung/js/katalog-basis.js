/* TW Renovierungs-App – Katalog-Grundlagen: Bereiche, Baumarkt-Abteilungen, Werkzeug, Hilfsfunktionen.
   Die einzelnen Arbeiten stehen in katalog-waende.js, katalog-boden-sanitaer.js, katalog-haus.js, katalog-innen2.js und katalog-haus2.js.
   Fliesenarbeiten sind bewusst nicht enthalten – dafür kommt eine eigene App. */
(function (root) {
  'use strict';
  const R = root.TW_RECHNER;

  /* Bereiche mit Kategorie-Farbe (Rot bleibt dem Logo und dem Fachbetrieb-Schild vorbehalten) */
  const BEREICHE = [
    { id: 'waende', name: 'Wände & Decken', farbe: '#C9A46A', kurz: 'Tapezieren, Streichen, Spachteln, Lackieren, Dämmen' },
    { id: 'boden', name: 'Boden', farbe: '#B07A47', kurz: 'Laminat, Vinyl, Leisten, Parkett, Teppich, Dielen' },
    { id: 'sanitaer', name: 'Sanitär', farbe: '#4DA6FF', kurz: 'Silikon, Armaturen, Abfluss, WC, Dusche, Filter' },
    { id: 'tueren', name: 'Türen & Fenster', farbe: '#3FB5A3', kurz: 'Einstellen, Dichtungen, Rollladen, Schloss' },
    { id: 'heizung', name: 'Heizung', farbe: '#E67E22', kurz: 'Entlüften, Druck, Thermostat, Ventile, Öl-Check' },
    { id: 'elektro', name: 'Elektro & Sicherheit', farbe: '#E2B93B', kurz: 'FI-Test, Rauch-, CO- und Wassermelder, Feuerlöscher' },
    { id: 'aussen', name: 'Außen & Garten', farbe: '#5FAE6E', kurz: 'Dachrinne, Terrasse, Pflaster, Zaun, Gartenhaus' },
    { id: 'checks', name: 'Haus-Checks', farbe: '#9C8BD6', kurz: 'Rundgang, Herbst, Frühjahr, Keller' }
  ];

  /* Baumarkt-Abteilungen in der Reihenfolge eines typischen Rundgangs */
  const ABT = {
    farbe: 'Farben, Lacke & Tapeten', boden: 'Bodenbeläge & Leisten', bau: 'Baustoffe', holz: 'Holz & Zuschnitt',
    eisen: 'Eisenwaren & Befestigung', sanitaer: 'Sanitär', heizung: 'Heizung & Installation', elektro: 'Elektro & Sicherheit',
    werkzeug: 'Werkzeug', schutz: 'Arbeitsschutz', garten: 'Garten & Außen', reinigung: 'Reinigung & Haushalt',
    sonstiges: 'Sonstiges (Apotheke, Drogerie)', miete: 'Mietservice / Leihen'
  };
  const ABT_REIHE = ['farbe', 'boden', 'bau', 'holz', 'eisen', 'sanitaer', 'heizung', 'elektro', 'werkzeug', 'schutz', 'garten', 'reinigung', 'sonstiges', 'miete'];

  /* Werkzeug-Verzeichnis (eine Wahrheit für „Meine Werkzeugkiste“). basis = in fast jedem Haushalt vorhanden → Vorgabe „Habe ich“ */
  const W = {
    zollstock: { n: 'Zollstock oder Maßband (5 m)', basis: true },
    wasserwaage: { n: 'Wasserwaage (60–100 cm)' },
    lot: { n: 'Senklot oder Kreuzlinienlaser', hinweis: 'für die erste Bahn' },
    bleistift: { n: 'Bleistift (Zimmermannsbleistift)', basis: true },
    cutter: { n: 'Cuttermesser mit Abbrechklingen (+ Ersatzklingen)', basis: true },
    schere: { n: 'Tapezierschere', basis: true },
    tapeziertisch: { n: 'Tapeziertisch', leihbar: true },
    quast: { n: 'Kleisterbürste (Quast) oder Kleisterrolle' },
    eimer: { n: 'Eimer (10–15 l)', basis: true },
    ruehrer: { n: 'Rührstab (Holzlatte) oder Rührquirl' },
    tapezierbuerste: { n: 'Tapezierbürste oder Andrückspachtel aus Kunststoff' },
    nahtroller: { n: 'Nahtroller' },
    tapezierspachtel: { n: 'Tapezierspachtel / Schneidlineal (breit)' },
    schwamm: { n: 'Schwamm und sauberes Tuch', basis: true },
    leiter: { n: 'Stehleiter (stabil, mit Ablage)', basis: true },
    anlegeleiter: { n: 'Anlegeleiter mit Leiterhaken bzw. Holmverlängerung', leihbar: true },
    stachelwalze: { n: 'Tapetenperforierer (Stachelwalze / Igel)' },
    spachtel: { n: 'Spachtel-Satz (Japanspachtel, Flächenspachtel)' },
    dampf: { n: 'Tapetenablöser mit Dampf (Dampfgerät)', leihbar: true },
    spruehflasche: { n: 'Drucksprüher oder Blumenspritze' },
    farbrolle: { n: 'Farbroller (25 cm, Polyamid 12–14 mm) mit Bügel' },
    teleskop: { n: 'Teleskopstange für den Roller' },
    abstreifgitter: { n: 'Abstreifgitter' },
    pinsel: { n: 'Pinsel-Set (Flachpinsel 50 mm, Eckenpinsel)' },
    eckroller: { n: 'Kleiner Roller (10 cm) für Ecken' },
    schleifklotz: { n: 'Schleifklotz / Schleifgitter (Körnung 120–180)' },
    akkuschrauber: { n: 'Akkuschrauber mit Bit-Satz' },
    bohrmaschine: { n: 'Schlagbohrmaschine oder Bohrhammer', leihbar: true },
    leitungssucher: { n: 'Leitungssucher (Ortungsgerät)' },
    kappsaege: { n: 'Kapp- und Gehrungssäge', leihbar: true },
    handsaege: { n: 'Feinsäge mit Gehrungslade' },
    stichsaege: { n: 'Stichsäge' },
    hammer: { n: 'Hammer', basis: true },
    gummihammer: { n: 'Gummihammer (weiße Gummiauflage)' },
    schlagklotz: { n: 'Schlagklotz und Zugeisen (Verlegeset)' },
    abstandskeile: { n: 'Abstandskeile (Verlegeset)' },
    winkel: { n: 'Anschlagwinkel' },
    kartuschenpistole: { n: 'Kartuschenpresse (Kartuschenpistole)' },
    fugenglaetter: { n: 'Fugenglätter / Fugenabzieher (Kunststoff)' },
    silikonentferner: { n: 'Fugenkratzer / Silikon-Entfernungswerkzeug' },
    zange: { n: 'Wasserpumpenzange', basis: true },
    schraubendreher: { n: 'Schraubendreher-Satz (Schlitz, Kreuz, Torx)', basis: true },
    inbus: { n: 'Innensechskant-Schlüssel (Inbus) 4 mm und Torx-Satz' },
    gabel: { n: 'Maulschlüssel-Satz' },
    perlatorschluessel: { n: 'Perlatorschlüssel (für verdeckte Strahlregler)' },
    poempel: { n: 'Saugglocke (Pömpel)' },
    spirale: { n: 'Rohrreinigungsspirale (5–10 m)', leihbar: true },
    schuessel: { n: 'Flache Schüssel oder Eimer zum Unterstellen' },
    lampe: { n: 'Taschenlampe oder Stirnlampe', basis: true },
    entlueftungsschluessel: { n: 'Entlüftungsschlüssel für Heizkörper (Vierkant)' },
    becher: { n: 'Becher und Lappen', basis: true },
    fuellschlauch: { n: 'Füllschlauch mit Systemtrenner (Heizungs-Nachfüllset)' },
    pinzette: { n: 'Spitzzange' },
    pruefgeraet: { n: 'Steckdosentester (Prüfstecker) oder Leuchte/Radio zum Prüfen' },
    etiketten: { n: 'Beschriftungsgerät oder wetterfester Folienstift' },
    handfeger: { n: 'Handfeger, Kehrblech, Müllsäcke', basis: true },
    gartenschlauch: { n: 'Gartenschlauch mit Spritzdüse', basis: true },
    rinnenschaufel: { n: 'Dachrinnen-Schaufel (Kunststoff)' },
    hochdruck: { n: 'Hochdruckreiniger mit Flächenreiniger', leihbar: true },
    schrubber: { n: 'Schrubber (harte Borsten) / Terrassenbürste' },
    terrassenpinsel: { n: 'Breiter Flachpinsel oder Terrassen-Ölwischer' },
    fugenbuerste: { n: 'Fugenbürste (Drahtbürste) bzw. Fugenkratzer mit Stiel' },
    besen: { n: 'Besen (weich) und Gummischieber', basis: true },
    hygrometer: { n: 'Hygrometer (Luftfeuchte-Messgerät)' },
    rauchmeldertester: { n: 'Lange Stange oder Leiter für den Testknopf' },
    daemmmesser: { n: 'Dämmstoffmesser (Wellenschliff, lange Klinge)' },
    tacker: { n: 'Handtacker mit Klammern' },
    bodenschaber: { n: 'Bodenschaber / Stielspachtel' },
    einscheibe: { n: 'Einscheibenmaschine mit Polierpad', leihbar: true },
    handkreissaege: { n: 'Handkreissäge mit Führungsschiene (feines Blatt)', leihbar: true },
    boecke: { n: 'Zwei Arbeitsböcke' },
    heizkoerperbuerste: { n: 'Heizkörperbürste (lang, schmal)' },
    fernglas: { n: 'Fernglas' },
    lackrolle: { n: 'Lackrolle 10 cm (Schaumstoff oder Velours) mit kleiner Wanne' },
    flachstreicher: { n: 'Flachstreicher bzw. Bodenöl-Roller (kurzflorig)' },
    staubsauger: { n: 'Staubsauger mit Fugendüse', basis: true },
    akkusauger: { n: 'Staubsauger (Bau- oder Haushaltssauger)' },
  };

  /* Schutz-Ausrüstung, die als Material auf die Liste kommt */
  const SCHUTZ = {
    brille: ['Schutzbrille', 'schutz'], handschuhe: ['Schutzhandschuhe (Nitril)', 'schutz'], arbeitshandschuhe: ['Arbeitshandschuhe', 'schutz'],
    ffp2: ['Atemschutzmaske FFP2', 'schutz'], gehoer: ['Gehörschutz', 'schutz'], knie: ['Knieschoner', 'schutz']
  };

  /* Ein Materialposten */
  function P(name, abt, menge, einheit, x) {
    return Object.assign({ name, abt, menge, einheit, detail: '', rechnung: [], optional: false }, x || {});
  }
  function schutz(...ids) { return ids.map(id => P(SCHUTZ[id][0], SCHUTZ[id][1], 1, /handschuhe|knie/.test(id) ? 'Paar' : 'Stk.', { schutz: true, hinweis: 'abwählen, wenn vorhanden' })); }

  /* Malerkrepp-Rollen (50 m) */
  function krepp(meter, wofuer) {
    const m = meter * 1.1; const n = Math.max(1, Math.ceil(m / 50));
    return P('Malerkrepp / Abklebeband (50 m)', 'farbe', n, 'Rolle', { rechnung: [`${wofuer}: ${R.zahl(meter, 1)} m`, `+ 10 % für Ansätze = ${R.zahl(m, 1)} m`, `÷ 50 m je Rolle → ${n} Rolle(n)`] });
  }
  function abdeckung(flaeche) {
    const n = Math.max(1, Math.ceil(flaeche * 1.15 / 20));
    return P('Abdeckfolie oder Malervlies (Pack ca. 20 m²)', 'farbe', n, 'Pack.', { rechnung: [`Bodenfläche ${R.zahl(flaeche)} m² + 15 % Überlappung = ${R.zahl(flaeche * 1.15)} m²`, `÷ 20 m² je Pack → ${n}`] });
  }
  function tiefgrund(flaeche, lProM2 = 0.125, wofuer = 'Fläche') {
    const bedarf = flaeche * lProM2; const g = R.gebinde(bedarf, [1, 2.5, 5, 10], 'l');
    return P('Tiefgrund (lösemittelfrei, LF)', 'farbe', g.stueck, 'Gebinde', { detail: g.text, rechnung: [`${wofuer} ${R.zahl(flaeche)} m² × ${R.zahl(lProM2, 3)} l/m² (ca. 8 m² je Liter) = ${R.zahl(bedarf)} l`, `Gebinde: ${g.text}`] });
  }

  /* Zusätzliche Kontrollen für „Mein Haus“ (ohne eigene Anleitung, nur Erinnerung mit Kurzhinweis) */
  const KONTROLLEN = [
    { id: 'k-hauptwasser', titel: 'Hauptabsperrhahn einmal zu- und aufdrehen', monate: 12, monat: 3, text: 'Damit er im Notfall nicht festsitzt. Langsam drehen; tropft er an der Spindel oder sitzt er fest: Sanitärfachbetrieb. Ort in „Mein Haus“ notieren.' },
    { id: 'k-wasserzaehler', titel: 'Wasserzähler-Lecktest', monate: 6, text: 'Abends Zählerstand notieren, nachts kein Wasser zapfen, morgens vergleichen. Dreht sich das Rädchen ohne Verbrauch, gibt es ein Leck (oft WC-Spülkasten).' },
    { id: 'k-rueckstau', titel: 'Rückstausicherung: Sicht- und Funktionskontrolle', monate: 6, text: 'Notverschluss nach Anleitung des Herstellers betätigen und wieder öffnen. Die vorgeschriebene Wartung (meist halbjährlich) übernimmt ein Fachkundiger.' }
  ];

  root.TW_KATALOG = { KONTROLLEN, BEREICHE, ABT, ABT_REIHE, W, SCHUTZ, P, schutz, krepp, abdeckung, tiefgrund, arbeiten: [] };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.TW_KATALOG;
})(typeof window !== 'undefined' ? window : globalThis);
