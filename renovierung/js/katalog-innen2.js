/* TW Renovierungs-App – Katalog-Erweiterung (Freigabe Thomas 02.11.2026), Teil 1:
   Wände & Decken (3), Boden (3), Sanitär (6). Schrittreihenfolge = Schlüssel der Schrittfotos in BILDER-PROMPTS.md. */
(function (root) {
  'use strict';
  const K = root.TW_KATALOG, R = root.TW_RECHNER, { P, schutz, krepp, abdeckung } = K;
  const z = R.zahl;
  const fugeMm2 = b => b * b * 0.7 * 1.25; /* Dreiecks-/Hohlkehlfuge + 25 % Verlust */

  K.arbeiten.push(
  /* ======================================================================= */
  {
    id: 'dachboden-daemmen', bereich: 'waende', titel: 'Dachboden (oberste Geschossdecke) dämmen', schwierigkeit: 2,
    kurz: 'Die Decke zum unbeheizten Dachboden in zwei Lagen dämmen – mit Dampfbremse, Laufsteg und Rollen-Rechnung.',
    schlagworte: ['dachboden', 'dachboden daemmen', 'speicher daemmen', 'geschossdecke', 'oberste geschossdecke', 'daemmung', 'daemmen', 'mineralwolle', 'glaswolle', 'steinwolle', 'dachbodendaemmung', 'speicher', 'heizkosten sparen', 'waermedaemmung'],
    aufnahme: { art: 'werte', felder: [
      { id: 'flaeche', label: 'Fläche des Dachbodens (zu dämmen)', einheit: 'm²', std: 60, max: 400, min: 2 },
      { id: 'umfang', label: 'Umfang der Fläche (für Randstreifen)', einheit: 'm', std: 32, max: 200, min: 4, pflicht: false },
      { id: 'steg', label: 'Länge Laufsteg (z. B. Luke → Schornstein)', einheit: 'm', std: 6, max: 60, pflicht: false }
    ] },
    optionen: [
      { id: 'art', label: 'Welcher Dachboden?', typ: 'wahl', std: 'kalt', werte: [['kalt', 'Unbeheizter Dachboden, Decke darunter massiv oder Holzbalken mit Bretterboden'], ['schraege', 'Ausgebautes / bewohntes Dachgeschoss (Dämmung in den Dachschrägen)']] },
      { id: 'dicke', label: 'Dämmdicke gesamt', typ: 'wahl', std: '240', werte: [['200', '200 mm (2 × 100 mm)'], ['240', '240 mm (2 × 120 mm) – empfohlen'], ['280', '280 mm (2 × 140 mm)']] },
      { id: 'rolle', label: 'Inhalt einer Dämmrolle in m² (steht auf der Packung, je Dicke verschieden)', typ: 'zahl', std: 4.5 },
      { id: 'alt', label: 'Es liegt schon alte Dämmung (Mineralwolle aus der Zeit vor 1996) bzw. alte Platten', typ: 'ja', std: false }
    ],
    vorlauf: 'Dämmrollen sind sperrig: Lieferung nach Hause bestellen und den Weg bis zur Luke vorher freiräumen.',
    material(m, o) {
      const l = [], A = m.flaeche, lage = (+o.dicke || 240) / 2, rolle = +o.rolle > 0 ? +o.rolle : 4.5;
      const proLage = Math.ceil(R.rund(A * 1.05 / rolle, 6));
      l.push(P(`Dämmrollen Mineralwolle WLS 035, ${lage} mm (Klemmfilz bzw. Rollen)`, 'bau', proLage * 2, 'Rolle', { detail: `je ${z(rolle)} m², 2 Lagen`, rechnung: [`Fläche ${z(A)} m² + 5 % Verschnitt = ${z(A * 1.05)} m²`, `÷ ${z(rolle)} m² je Rolle = ${z(A * 1.05 / rolle)} → ${proLage} Rollen je Lage`, `× 2 Lagen à ${lage} mm (versetzt, kreuzweise) = ${proLage * 2} Rollen`, 'Hinweis: Statt Mineralwolle sind auch begehbare Dämmplatten möglich – dann entfällt der Laufsteg.'] }));
      const db = A * 1.15, dbr = Math.ceil(R.rund(db / 40, 6));
      l.push(P('Dampfbremsfolie (Rolle 40 m², z. B. 2 × 20 m)', 'bau', dbr, 'Rolle', { rechnung: [`${z(A)} m² + 15 % (10 cm Überlappung, an den Rändern hochziehen) = ${z(db)} m² ÷ 40 m² → ${dbr}`, 'Die Folie liegt immer auf der warmen Seite – also unter der Dämmung.'] }));
      const kb = (A / 1.5 + (m.umfang || 4 * Math.sqrt(A))) * 1.1, kbr = Math.max(1, Math.ceil(kb / 25));
      l.push(P('Klebeband für Dampfbremsen (Rolle 25 m)', 'bau', kbr, 'Rolle', { rechnung: [`Stöße: ${z(A)} m² ÷ 1,5 m Bahnbreite = ${z(A / 1.5)} m`, `+ Randanschluss ${z(m.umfang || 4 * Math.sqrt(A))} m, + 10 % = ${z(kb)} m ÷ 25 m → ${kbr}`] }));
      l.push(P('Dichtkleber für Folienanschluss an Wand und Schornstein (Kartusche)', 'bau', Math.max(1, Math.ceil((m.umfang || 4 * Math.sqrt(A)) / 12)), 'Kartusche', { rechnung: [`Randanschluss ${z(m.umfang || 4 * Math.sqrt(A))} m, ca. 12 m je Kartusche`] }));
      if (m.steg > 0) {
        const pl = Math.ceil(R.rund(m.steg / 2.05, 6)), kh = Math.ceil(R.rund(m.steg * 2 * 1.1 / 2.5, 6));
        l.push(P('OSB-Platten 22 mm, Nut und Feder (2,05 × 0,625 m) für den Laufsteg', 'holz', pl, 'Stk.', { rechnung: [`Laufsteg ${z(m.steg)} m ÷ 2,05 m je Platte → ${pl} Platten (Stegbreite 62,5 cm)`] }));
        l.push(P(`Kanthölzer, Höhe = Dämmdicke (${o.dicke || 240} mm), 2,50 m`, 'holz', kh, 'Stk.', { rechnung: [`Zwei Stränge unter dem Steg: ${z(m.steg)} m × 2 + 10 % = ${z(m.steg * 2.2)} m ÷ 2,50 m → ${kh}`, 'Die Kanthölzer stehen auf der Decke bzw. den Balken, nicht auf der Dämmung.'] }));
        l.push(P('Holzbauschrauben 5 × 50 mm (Pack 100)', 'eisen', 1, 'Pack.'));
      }
      l.push(P('Dämmplatte bzw. Dämmmatte für die Bodenluke (Deckel)', 'bau', 1, 'Stk.', { optional: true, rechnung: ['Die Luke ist sonst die größte Wärmebrücke – Deckel von oben dämmen, Dichtung rundum.'] }));
      l.push(...schutz('ffp2', 'brille', 'handschuhe', 'knie'));
      l.push(P('Einweg-Schutzanzug (langärmelig)', 'schutz', 1, 'Stk.', { rechnung: ['Mineralwollfasern jucken auf der Haut.'] }));
      return l;
    },
    werkzeug: ['zollstock', 'daemmmesser', 'cutter', 'tacker', 'kartuschenpistole', 'akkuschrauber', 'handsaege', 'lampe', 'leiter'],
    schritte: [
      { t: 'Dachboden prüfen', min: 30,
        x: 'Ist der Dachboden unbeheizt und wird er nicht bewohnt? Ist die Decke trocken, ohne Wasserflecken? Ist das Dach dicht (bei Regen mit der Taschenlampe nachsehen)? Wo verlaufen Leitungen, Lüftungsrohre und der Schornstein? Laufwege und Stellen für Abstellflächen festlegen.',
        kniff: 'Seit 2016 ist die Dämmung der obersten Geschossdecke für die meisten Häuser Pflicht (Gebäudeenergiegesetz), es gibt aber Ausnahmen. Fragen Sie Ihren Energieberater – oft gibt es Förderung.',
        fehler: 'Auf ein undichtes Dach gedämmt: Nasse Dämmung dämmt nicht und schimmelt.' },
      { t: 'Altmaterial und Asbest prüfen', min: 20,
        x: 'Liegt alte Dämmung oder liegen alte Platten auf dem Boden? Alte Mineralwolle (eingebaut vor 1996) gilt als möglicherweise krebserzeugend – nicht bewegen, nicht herausreißen. Faserzementplatten, alte Leichtbauplatten oder Wellplatten können Asbest enthalten.',
        kniff: 'Neue Mineralwolle trägt das RAL-Gütezeichen bzw. den Hinweis „frei von Krebsverdacht“. Steht nichts darauf und ist sie alt, wie Altmaterial behandeln.',
        fehler: 'Alte Wolle zusammengerafft und in Säcken die Treppe hinuntergetragen – die Fasern verteilen sich im ganzen Haus.',
        sicher: 'Bei alter Mineralwolle oder Asbestverdacht: Fachbetrieb mit Sachkunde (TRGS 521 bzw. 519).' },
      { t: 'Dampfbremse verlegen', min: m => 20 + m.flaeche * 1.2,
        x: 'Boden fegen. Die Dampfbremsfolie auf der ganzen Fläche auslegen, Bahnen 10 cm überlappen und die Stöße mit Dampfbremsband luftdicht verkleben. Am Rand (Wand, Schornstein, Rohre) die Folie hochziehen und mit Dichtkleber anschließen.',
        kniff: 'Auf einer Massivdecke aus Beton kann die Dampfbremse in der Regel entfallen, weil Beton selbst dicht ist – bei Holzbalkendecken ist sie wichtig.',
        fehler: 'Folie unter die Dämmung vergessen bzw. über die Dämmung gelegt: Feuchte aus dem Wohnraum kondensiert in der Dämmung.' },
      { t: 'Dämmung verlegen – 1. Lage', min: m => 20 + m.flaeche * 1.5,
        x: 'Rollen am Ort öffnen (sie springen auf), mit dem Dämmstoffmesser auf Länge schneiden und dicht gestoßen auslegen. Bei Holzbalken die Felder zwischen den Balken mit 1–2 cm Übermaß klemmend füllen.',
        kniff: 'Auf einer alten Tür oder Platte schneiden – das Messer bleibt scharf, der Boden heil.',
        fehler: 'Lücken zwischen den Bahnen: Durch jeden Spalt geht Wärme verloren (Wärmebrücke).',
        sicher: 'Nur auf Balken oder tragfähigem Boden treten – nie auf Gipskarton oder Putz dazwischen (Durchbruchgefahr).' },
      { t: 'Dämmung verlegen – 2. Lage kreuzweise', min: m => 15 + m.flaeche * 1.2,
        x: 'Die zweite Lage quer zur ersten auslegen, sodass die Stöße nicht übereinanderliegen. Um Schornstein und Rohre eng anschneiden.',
        kniff: 'Bei Schornsteinen den vom Schornsteinfeger bzw. Hersteller geforderten Abstand und nicht brennbare Dämmung beachten.',
        fehler: 'Dämmung gestaucht oder festgetreten: Sie verliert stark an Wirkung.' },
      { t: 'Laufsteg bauen', min: m => (m.steg > 0 ? 30 + m.steg * 12 : 10),
        x: 'Für Wege, die Sie begehen müssen (z. B. zum Schornstein für den Schornsteinfeger), Kanthölzer in Höhe der Dämmung auf die Decke bzw. die Balken stellen und OSB-Platten daraufschrauben. Die Dämmung läuft zwischen den Kanthölzern durch.',
        kniff: 'Laufsteg vor der zweiten Lage abmessen – dann wissen Sie genau, wo die Kanthölzer stehen.',
        fehler: 'Bretter direkt auf die Dämmung gelegt: Sie wird zusammengedrückt und der Steg wackelt.' },
      { t: 'Luke dämmen und abschließen', min: 30,
        x: 'Deckel der Bodenluke von oben mit einer Dämmplatte belegen und rundum eine Dichtung anbringen. Verpackungen und Reste einsammeln.',
        kniff: 'Ein Foto der fertigen Fläche mit Datum in „Mein Haus“ ablegen – das hilft bei Förderung und Hausverkauf.',
        fehler: 'Luke vergessen: Sie bleibt das größte Loch in der Dämmung.' }
    ],
    sicherheit: ['Nur auf Balken oder tragfähigem Boden treten.', 'FFP2-Maske, Schutzbrille, Handschuhe und langärmelige Kleidung.', 'Gute Beleuchtung; Leiter und Luke sichern.'],
    grenzen: ['Ausgebautes Dachgeschoss bzw. Dämmung in Dachschrägen – Tauwasser- und Luftdichtheitsplanung durch Fachbetrieb oder Energieberater.', 'Alte Mineralwolle (vor 1996) oder Platten mit Asbestverdacht entfernen – Fachbetrieb mit Sachkunde.', 'Decke hängt durch, Balken morsch oder Tragfähigkeit unklar – Statik prüfen lassen.'],
    rot: (m, o) => o.art === 'schraege' ? 'Die Dämmung in Dachschrägen eines bewohnten Dachgeschosses braucht eine fachgerechte Planung von Luftdichtheit und Tauwasserschutz. Falsch ausgeführt, entstehen Feuchteschäden im Dach. Bitte Fachbetrieb bzw. Energieberater beauftragen.' : (o.alt ? 'Alte Mineralwolle (vor 1996) und alte Platten können gesundheitsgefährdend sein (Fasern, Asbest). Bitte nicht selbst entfernen – Fachbetrieb mit Sachkunde beauftragen. Darüber dämmen ist oft möglich, vorher fachlich klären.' : ''),
    asbest: 'Alte Platten auf dem Dachboden (Faserzement, Leichtbauplatten) in Häusern vor 1993 können Asbest enthalten – nicht anbohren, nicht brechen, Materialprobe bzw. Fachbetrieb.'
  },
  /* ======================================================================= */
  {
    id: 'holz-lackieren', bereich: 'waende', titel: 'Holz innen lackieren (Zarge, Fensterbank, Treppe)', schwierigkeit: 2,
    kurz: 'Türzargen, Holzfensterbänke oder Geländer neu lackieren – mit Schliff, Vorlack und Lackmenge nach Fläche.',
    schlagworte: ['lackieren', 'lack', 'tuerzarge', 'zarge streichen', 'holz streichen', 'holz lackieren', 'fensterbank holz', 'treppengelaender', 'lasur innen', 'weisslack', 'vorlack', 'heizkoerper lackieren'],
    aufnahme: { art: 'werte', felder: [
      { id: 'flaeche', label: 'Zu lackierende Fläche', einheit: 'm²', std: 3, max: 60, min: 0.2, hilfe: 'Richtwert: eine Türzarge mit Bekleidungen beidseitig ca. 1,5 m², eine Fensterbank 0,5 m².' }
    ] },
    optionen: [
      { id: 'zustand', label: 'Zustand', typ: 'wahl', std: 'lack', werte: [['lack', 'Bisher lackiert, Lack fest (nur anschleifen)'], ['roh', 'Rohes oder abgeschliffenes Holz'], ['schadhaft', 'Lack blättert großflächig ab']] },
      { id: 'lack', label: 'Lack', typ: 'wahl', std: 'acryl', werte: [['acryl', 'Acryllack, wasserverdünnbar (geruchsarm, empfohlen innen)'], ['alkyd', 'Alkydharzlack (lösemittelhaltig, sehr hart)']] }
    ],
    material(m, o) {
      const l = [], A = m.flaeche;
      const lb = A * 0.1 * 2 * 1.15, g = R.gebinde(lb, [0.375, 0.75, 2.5], 'l');
      l.push(P(`${o.lack === 'alkyd' ? 'Alkydharz' : 'Acryl'}-Weißlack seidenmatt bzw. im gewünschten Farbton`, 'farbe', g.stueck, 'Dose', { detail: g.text, rechnung: [`${z(A)} m² × 0,10 l/m² (ca. 10 m² je Liter) × 2 Schichten = ${z(A * 0.2)} l`, `+ 15 % (Rolle, Pinsel, Kanten) = ${z(lb)} l`, `Gebinde: ${g.text}`] }));
      if (o.zustand !== 'lack') { const vb = A * 0.1 * 1.15, gv = R.gebinde(vb, [0.375, 0.75, 2.5], 'l'); l.push(P('Vorlack / Haftgrund für Holz (zum Lack passend)', 'farbe', gv.stueck, 'Dose', { detail: gv.text, rechnung: [`${z(A)} m² × 0,10 l/m² + 15 % = ${z(vb)} l → ${gv.text}`] })); }
      l.push(P('Schleifpapier Körnung 180 und 240 (bzw. Schleifschwamm)', 'farbe', 1, 'Pack.'));
      l.push(P('Staubbindetuch (Staubtuch für Lackierarbeiten)', 'farbe', 1, 'Stk.'));
      if (o.zustand === 'schadhaft') l.push(P('Holzspachtel / Lackspachtel', 'farbe', 1, 'Tube', { rechnung: ['Für Macken und Kanten nach dem Abschleifen.'] }));
      l.push(krepp(A * 4, 'Wandanschluss und Boden abkleben (ca. 4 m je m² Lackfläche)'));
      l.push(abdeckung(Math.max(2, A)));
      l.push(...schutz('ffp2', 'handschuhe'));
      return l;
    },
    werkzeug: ['schleifklotz', 'lackrolle', 'pinsel', 'spachtel', 'cutter', 'staubsauger', 'leiter'],
    schritte: [
      { t: 'Abkleben und abdecken', min: m => 15 + m.flaeche * 6,
        x: 'Wand rund um die Zarge bzw. Fensterbank mit Malerkrepp abkleben, Boden abdecken. Türdrücker und Rosetten abschrauben, Bänder abkleben.',
        kniff: 'Türdrücker in einen beschrifteten Beutel mit den Schrauben – dann fehlt beim Zusammenbau nichts.',
        fehler: 'Bänder und Schlösser mitlackiert: Sie gehen schwer, Lack platzt beim Öffnen ab.' },
      { t: 'Anschleifen', min: (m, o) => 10 + m.flaeche * (o.zustand === 'schadhaft' ? 25 : 8),
        x: 'Den alten Lack mit Körnung 180 gleichmäßig anschleifen, bis die Fläche matt ist – der neue Lack braucht diese Rauigkeit zum Haften. Lose Lackstellen mit dem Spachtel abstoßen und die Ränder glatt schleifen, Macken spachteln.',
        kniff: 'Wasserprobe: Perlen Tropfen ab, ist noch Fett oder Glanz da – nachschleifen bzw. mit Anlauger reinigen.',
        fehler: 'Auf glänzenden Altlack lackiert: Der neue Lack lässt sich später mit dem Fingernagel abziehen.',
        sicher: 'Alte Anstriche aus der Zeit vor etwa 1970 können Blei enthalten: nicht trocken schleifen, nass schleifen bzw. Fachbetrieb.' },
      { t: 'Entstauben und vorlackieren', min: m => 10 + m.flaeche * 6, warten: (m, o) => o.zustand === 'lack' ? 0 : 720, wartenText: 'Vorlack trocknen lassen (über Nacht)',
        x: 'Staub absaugen und mit dem Staubbindetuch abnehmen. Rohes oder blankes Holz mit Vorlack grundieren.',
        kniff: 'Die Fläche im Streiflicht ansehen – jede Staubfaser wird später im Lack sichtbar.',
        fehler: 'Mit feuchtem Lappen entstaubt: Rohes Holz quillt auf, die Fasern stellen sich auf.' },
      { t: '1. Lackschicht', tagNeu: (m, o) => o.zustand !== 'lack', min: m => 15 + m.flaeche * 10, warten: (m, o) => o.lack === 'alkyd' ? 1440 : 360, wartenText: 'Lack trocknen lassen',
        x: 'Lack gut aufrühren. Kanten und Profile mit dem Pinsel vorlegen, Flächen mit der Lackrolle dünn auftragen und in einem Zug in Längsrichtung abrollen.',
        kniff: 'Lieber zwei dünne Schichten als eine dicke – dicke Schichten laufen als „Nasen“ herunter.',
        fehler: 'Lack zu dick an senkrechten Flächen: Läufer, die man erst nach dem Trocknen sieht.' },
      { t: 'Zwischenschliff', min: m => 10 + m.flaeche * 4,
        x: 'Nach dem Trocknen mit Körnung 240 bzw. Schleifschwamm ganz leicht überschleifen und gründlich entstauben.',
        kniff: 'Nur so viel schleifen, dass sich die Fläche glatt anfühlt – nicht durchschleifen.',
        fehler: 'Zwischenschliff weggelassen: Staubkörner der ersten Schicht bleiben als Pickel stehen.' },
      { t: '2. Lackschicht', min: m => 15 + m.flaeche * 9, warten: (m, o) => o.lack === 'alkyd' ? 1440 : 720, wartenText: 'Durchtrocknen (Tür erst dann wieder ganz schließen)',
        x: 'Zweite Schicht genauso auftragen. Raum staubarm halten, nicht fegen.',
        kniff: 'Die Tür bis zum Durchtrocknen mit einem Keil leicht offen halten – sonst klebt sie an der Dichtung fest.',
        fehler: 'Tür noch am selben Tag geschlossen: Die Dichtung reißt Lack ab.' },
      { t: 'Kreppband ab und montieren', min: 20,
        x: 'Kreppband abziehen, solange die letzte Schicht noch nicht ganz durchgehärtet ist – im spitzen Winkel. Beschläge wieder anschrauben.',
        kniff: 'Bleibt der Lack am Band hängen: mit dem Cutter am Bandrand entlang ritzen.',
        fehler: 'Krepp nach Tagen abgezogen: Lack reißt in Schollen mit ab.' }
    ],
    sicherheit: ['Gut lüften – vor allem bei lösemittelhaltigen Lacken.', 'Staubmaske beim Schleifen.', 'Mit Lack getränkte Lappen offen ausgebreitet trocknen lassen oder luftdicht entsorgen (Selbstentzündung bei Alkydlack).'],
    grenzen: ['Alte Anstriche mit Bleiverdacht (Häuser vor etwa 1970) großflächig abschleifen – Fachbetrieb.', 'Brandschutztüren oder -zargen (Schild im Falz) – Beschichtung nur nach Herstellerzulassung.']
  },
  /* ======================================================================= */
  {
    id: 'anschlussfugen-fenster', bereich: 'waende', titel: 'Acrylfugen am Fenster innen erneuern', schwierigkeit: 1,
    kurz: 'Rissige Anschlussfugen zwischen Fensterrahmen und Putz innen sauber neu machen – mit Kartuschen-Rechnung.',
    schlagworte: ['acryl', 'acrylfuge', 'fuge fenster', 'fensterfuge', 'anschlussfuge', 'fuge innen', 'riss am fenster', 'fensterrahmen fuge', 'laibung riss', 'fuge zwischen fenster und wand'],
    aufnahme: { art: 'werte', felder: [
      { id: 'anzahl', label: 'Anzahl Fenster', einheit: 'Stück', std: 4, max: 60, ganz: true },
      { id: 'b', label: 'Fensterbreite (typisch)', einheit: 'm', std: 1.2, max: 5, min: 0.3 },
      { id: 'h', label: 'Fensterhöhe (typisch)', einheit: 'm', std: 1.35, max: 3, min: 0.3 },
      { id: 'breite', label: 'Fugenbreite', einheit: 'mm', std: 6, max: 20, min: 3 }
    ] },
    optionen: [{ id: 'zug', label: 'Es zieht spürbar oder Wasser kommt innen an (nicht nur ein Haarriss)', typ: 'ja', std: false }],
    material(m, o) {
      const l = [], lfm = m.anzahl * (m.b + 2 * m.h) * 1.0, q = fugeMm2(m.breite), ml = lfm * q, n = Math.max(1, Math.ceil(R.rund(ml / 310, 6)));
      l.push(P('Maler-Acryl weiß, überstreichbar (Kartusche 310 ml)', 'farbe', n, 'Kartusche', { rechnung: [`Je Fenster oben und an beiden Seiten: ${z(m.b)} + 2 × ${z(m.h)} = ${z(m.b + 2 * m.h)} m`, `× ${m.anzahl} Fenster = ${z(lfm)} m Fuge`, `Querschnitt ${z(m.breite)} × ${z(m.breite)} × 0,7 + 25 % = ${z(q, 0)} mm² → ${z(ml, 0)} ml`, `÷ 310 ml → ${n} Kartusche(n)`, 'Fensterbank-Anschluss innen zählt extra, falls er auch erneuert wird.'] }));
      l.push(krepp(lfm * 2, 'Beidseitig der Fuge abkleben'));
      l.push(P('Rundschnur (Hinterfüllschnur) Ø 8–10 mm – nur bei tiefen Fugen', 'farbe', Math.ceil(lfm), 'm', { optional: true }));
      l.push(P('Wandfarbe zum Überstreichen (Rest der vorhandenen Farbe)', 'farbe', 0, '', { optional: true, rechnung: ['Meist reicht der Rest aus dem Keller.'] }));
      return l.filter(p => p.menge > 0 || !p.optional || p.name.startsWith('Rundschnur'));
    },
    werkzeug: ['cutter', 'kartuschenpistole', 'fugenglaetter', 'schwamm', 'spruehflasche', 'pinsel', 'leiter'],
    schritte: [
      { t: 'Fuge beurteilen', min: m => 5 + m.anzahl * 2,
        x: 'Haarrisse in der Acrylfuge sind normal – der Rahmen bewegt sich mit Wärme und Kälte. Zieht es aber spürbar, ist die Wand am Rahmen nass oder schimmelt es, liegt das Problem tiefer in der Anschlussabdichtung.',
        kniff: 'Mit einer Kerze oder einem Räucherstäbchen an der Fuge entlangfahren – flackert die Flamme, zieht es.',
        fehler: 'Undichten Fensteranschluss einfach mit Acryl zugeschmiert: Feuchte bleibt in der Wand.' },
      { t: 'Alte Fuge herausschneiden', min: m => 5 + m.anzahl * 8,
        x: 'Mit dem Cutter an Rahmen und Putz entlang schneiden und die alte Fuge herausziehen. Den Rahmen dabei nicht anritzen.',
        kniff: 'Klinge flach am Rahmen führen und Kunststoffrahmen mit einem Kunststoffschaber schützen.',
        fehler: 'Neue Fuge auf alte gesetzt: Sie reißt an derselben Stelle wieder.' },
      { t: 'Reinigen und abkleben', min: m => 5 + m.anzahl * 6,
        x: 'Staub abpinseln. Beidseitig Kreppband im Abstand der Fugenbreite kleben. Tiefe Fugen mit Rundschnur hinterfüllen. Die Fugenflanken leicht anfeuchten.',
        kniff: 'Acryl haftet besser auf leicht feuchtem Putz – Sprühflasche genügt.',
        fehler: 'Fuge zu tief gefüllt: Sie haftet an drei Seiten und reißt.' },
      { t: 'Acryl einspritzen und glätten', min: m => 5 + m.anzahl * 8,
        x: 'Kartusche schräg auf Fugenbreite anschneiden, Acryl gleichmäßig einspritzen und mit nassem Fugenglätter in einem Zug abziehen.',
        kniff: 'Im Gegensatz zu Silikon lässt sich Acryl mit nassem Finger nacharbeiten – nur nicht zu lange.',
        fehler: 'Silikon statt Acryl verwendet: Silikon lässt sich nicht überstreichen.' },
      { t: 'Kreppband abziehen', min: m => 3 + m.anzahl * 2, warten: 1440, wartenText: 'Acryl aushärten (vor dem Überstreichen meist 24 h, Etikett)',
        x: 'Kreppband sofort abziehen, solange das Acryl noch nass ist.',
        kniff: 'Band von der Fuge weg ziehen – dann bleibt die Kante sauber.',
        fehler: 'Band nach dem Antrocknen abgezogen: Ausgefranste Kante.' },
      { t: 'Überstreichen', min: m => 5 + m.anzahl * 4,
        x: 'Nach dem Durchtrocknen die Fuge mit der Wandfarbe überstreichen, damit sie nicht anders aussieht als die Wand.',
        kniff: 'Schmaler Pinsel, Farbe nur auf Fuge und Putz – nicht auf den Rahmen.',
        fehler: 'Frische, noch weiche Fuge überstrichen: Die Farbe reißt.' }
    ],
    sicherheit: ['Cutter vom Körper weg führen.', 'Leiter standsicher, nicht aus dem offenen Fenster lehnen.'],
    grenzen: ['Es zieht deutlich, Wasser kommt am Rahmen innen an oder die Laibung ist feucht bzw. schimmelt – Anschlussabdichtung vom Fensterbauer prüfen lassen.'],
    rot: (m, o) => o.zug ? 'Zieht es deutlich oder kommt Wasser innen an, ist die Anschlussabdichtung des Fensters (innen luftdicht, außen schlagregendicht) betroffen. Eine Acrylfuge behebt das nicht – bitte Fensterbauer bzw. Fachbetrieb beauftragen.' : ''
  },
  /* ======================================================================= */
  {
    id: 'teppich-entfernen', bereich: 'boden', titel: 'Teppich entfernen und Untergrund vorbereiten', schwierigkeit: 2,
    kurz: 'Alten Teppichboden herausholen, Kleber und Schaum entfernen, Estrich prüfen und bei Bedarf ausgleichen.',
    schlagworte: ['teppich', 'teppich entfernen', 'teppich raus', 'teppichboden', 'auslegware', 'teppich rausreissen', 'teppichkleber', 'untergrund vorbereiten', 'ausgleichsmasse', 'estrich ausgleichen', 'boden ausgleichen'],
    aufnahme: { art: 'raum', hoehe: false, oeffnungen: false, hinweis: 'Innenmaße des Raums.' },
    optionen: [
      { id: 'befestigung', label: 'Wie ist der Teppich befestigt?', typ: 'wahl', std: 'geklebt', werte: [['lose', 'Lose bzw. mit Klebeband (lässt sich leicht anheben)'], ['geklebt', 'Vollflächig geklebt (Schaumrücken bleibt am Boden)'], ['nagel', 'Gespannt auf Nagelleisten']] },
      { id: 'ausgleich', label: 'Untergrund danach ausgleichen (für Vinyl, Laminat, Parkett)', typ: 'ja', std: false },
      { id: 'dicke', label: 'Schichtdicke der Ausgleichsmasse in mm', typ: 'zahl', std: 3 },
      { id: 'alt', label: 'Unter dem Teppich kommen kleine Platten (25×25/30×30 cm) oder schwarzer Kleber zum Vorschein', typ: 'ja', std: false }
    ],
    material(m, o) {
      const l = [], A = m.R.boden;
      const kg = A * 2.5, saecke = Math.max(2, Math.ceil(A / 8));
      l.push(P('Reißfeste Müllsäcke bzw. Bauschuttsäcke (für Schaum- und Kleberreste)', 'reinigung', saecke, 'Stk.', { rechnung: [`${z(A)} m², Reste ca. 1 Sack je 8 m² → ${saecke}`, `Der Teppich selbst wiegt ca. 2,5 kg/m² = ${z(kg, 0)} kg – aufgerollt zum Wertstoffhof bzw. Sperrmüll (Gemeinde fragen).`] }));
      l.push(P('Paketband bzw. Klebeband zum Verschnüren der Teppichrollen', 'reinigung', 1, 'Rolle'));
      l.push(P('Abbrechklingen 18 mm (10er-Pack)', 'werkzeug', 1, 'Pack.', { rechnung: ['Teppichrücken macht Klingen schnell stumpf.'] }));
      if (o.ausgleich) {
        const d = +o.dicke > 0 ? +o.dicke : 3, akg = A * d * 1.6 * 1.1, g = R.gebinde(akg, [25], 'kg');
        l.push(P('Bodenausgleichsmasse / Nivelliermasse (Sack 25 kg)', 'bau', g.stueck, 'Sack', { detail: g.text, rechnung: [`${z(A)} m² × ${z(d)} mm × 1,6 kg/(m²·mm) = ${z(A * d * 1.6)} kg`, `+ 10 % = ${z(akg)} kg → ${g.text}`, 'Verbrauch laut Sack hat Vorrang (meist 1,5–1,7 kg je m² und mm).'] }));
        const gr = A * 0.15, gg = R.gebinde(gr, [1, 5, 10], 'kg');
        l.push(P('Grundierung für Ausgleichsmasse (Haftgrund, saugend/nicht saugend laut Hersteller)', 'bau', gg.stueck, 'Gebinde', { detail: gg.text, rechnung: [`${z(A)} m² × ca. 0,15 kg/m² = ${z(gr)} kg → ${gg.text}`] }));
        l.push(P('Randdämmstreifen 8 mm (Rolle 25 m)', 'bau', Math.max(1, Math.ceil(m.R.umfang / 25)), 'Rolle', { rechnung: [`Umfang ${z(m.R.umfang)} m ÷ 25 m`] }));
      }
      l.push(...schutz('ffp2', 'arbeitshandschuhe', 'knie', 'brille'));
      return l;
    },
    werkzeug: o => ['cutter', 'bodenschaber', 'spachtel', 'zange', 'hammer', 'akkusauger', 'wasserwaage', 'eimer', ...(o && o.ausgleich ? ['ruehrer', 'farbrolle'] : [])],
    schritte: [
      { t: 'Asbest-Prüfung an einer Ecke', min: 15,
        x: 'An einer unauffälligen Ecke den Teppich anheben und nachsehen, was darunter liegt. Kommen kleine Kunststoffplatten (Floor-Flex), Cushion-Vinyl mit grauer Pappe oder schwarzer Kleber zum Vorschein und ist das Haus vor 1993 gebaut bzw. renoviert: sofort aufhören.',
        kniff: 'Ein Foto der Ecke mit Zollstock daneben hilft dem Fachbetrieb bei der Einschätzung.',
        fehler: 'Einfach weitergerissen: Asbestfasern werden freigesetzt und verteilen sich im Haus.',
        sicher: 'Bei Asbestverdacht: nicht weiterarbeiten, Raum schließen, Materialprobe bzw. Fachbetrieb (TRGS 519).' },
      { t: 'Raum leer räumen, Leisten ab', min: m => 30 + m.R.umfang * 2,
        x: 'Möbel hinaus, Sockelleisten vorsichtig abnehmen (falls sie wieder verwendet werden: nummerieren). Türschwellen- und Übergangsprofile abschrauben.',
        kniff: 'Leisten mit einem breiten Spachtel als Hebel lösen, Holzklotz dahinter schützt die Wand.',
        fehler: 'Leisten mit dem Kuhfuß abgerissen: Putz bricht aus.' },
      { t: 'Teppich in Streifen schneiden und aufrollen', min: m => 15 + m.R.boden * 2,
        x: 'Den Teppich mit dem Cutter in etwa 50–80 cm breite Streifen schneiden, Streifen aufrollen und verschnüren. Bei Nagelleisten den Teppich von den Nägeln abheben, danach die Leisten mit Zange bzw. Spachtel lösen.',
        kniff: 'Von der Rückseite schneiden, wenn der Teppich schon lose ist – das geht leichter und schont die Klinge.',
        fehler: 'Ganze Raumbreite am Stück aufgerollt: viel zu schwer, passt durch keine Tür.',
        sicher: 'Nagelleisten haben spitze Nägel nach oben – Handschuhe, nicht barfuß.' },
      { t: 'Schaum- und Kleberreste entfernen', min: (m, o) => o.befestigung === 'geklebt' ? 20 + m.R.boden * 6 : 10 + m.R.boden * 1,
        x: 'Schaumrücken- und Kleberreste mit dem Bodenschaber flach abstoßen. Hartnäckige Reste leicht anfeuchten und nach kurzer Einwirkzeit abschaben. Anschließend gründlich saugen.',
        kniff: 'Den Bodenschaber flach und mit kurzen Stößen führen – das Körpergewicht arbeitet mit.',
        fehler: 'Kleberreste liegen gelassen: Ausgleichsmasse und neuer Belag haften darauf nicht.' },
      { t: 'Untergrund prüfen', min: 30,
        x: 'Estrich auf Risse, lose Stellen und Ebenheit prüfen: Lange Wasserwaage oder Richtlatte in verschiedenen Richtungen auflegen. Für Klickböden sind meist höchstens 2–3 mm Abweichung auf 1 m zulässig (Hersteller). Kratzprobe mit einem Nagel: Der Estrich darf nicht sanden.',
        kniff: 'Stellen mit Lücke unter der Wasserwaage mit Kreide umranden – so sehen Sie, wo ausgeglichen werden muss.',
        fehler: 'Neuer Belag auf welligen Estrich: Klickverbindungen brechen, Vinyl zeichnet jede Delle ab.' },
      { t: 'Ausgleichen', wenn: (m, o) => !!o.ausgleich, tagNeu: true, min: m => 30 + m.R.boden * 3, warten: 1440, wartenText: 'Ausgleichsmasse trocknen lassen (begehbar nach ca. 3–4 h, belegreif laut Sack, oft 24 h je 3 mm)',
        x: 'Untergrund grundieren und trocknen lassen. Randdämmstreifen an die Wände kleben. Ausgleichsmasse genau nach Wassermenge auf dem Sack mit dem Rührquirl anmischen, ausgießen und mit Rakel bzw. Stachelwalze verteilen.',
        kniff: 'Zu zweit arbeiten: Einer mischt, einer verteilt – die Masse läuft nur kurze Zeit gut.',
        fehler: 'Zu viel Wasser zugegeben: Die Masse wird weich, reißt und sandet.' },
      { t: 'Entsorgen und aufräumen', min: 40,
        x: 'Teppichrollen und Säcke entsorgen (Wertstoffhof, Sperrmüll oder Container – bei der Gemeinde nachfragen). Raum besenrein machen.',
        kniff: 'Teppich zählt meist nicht zum Bauschutt – getrennt halten spart Gebühren.',
        fehler: 'Alles in einen Bauschuttcontainer: teure Nachsortierung.' }
    ],
    sicherheit: ['Asbest-Prüfung zuerst.', 'Schutzhandschuhe (Nagelleisten, Klingen), Knieschoner, Staubmaske beim Abschaben.', 'Schwere Rollen zu zweit tragen.'],
    grenzen: ['Floor-Flex-Platten, Cushion-Vinyl mit grauer Rückseite oder schwarzer Kleber in Häusern vor 1993 – Asbestverdacht, Fachbetrieb.', 'Estrich bricht, ist großflächig hohl oder feucht – Fachbetrieb.'],
    rot: (m, o) => o.alt ? 'Kleine Kunststoffplatten (Floor-Flex) und schwarzer Kleber stehen in älteren Häusern unter Asbestverdacht. Bitte nicht weiter entfernen – Materialprobe bzw. Fachbetrieb mit Sachkunde nach TRGS 519.' : '',
    asbest: 'In Häusern vor 1993 können unter Teppichen Floor-Flex-Platten, Cushion-Vinyl oder schwarze Bitumenkleber mit Asbest liegen. Nicht herausreißen, nicht abschleifen – Materialprobe bzw. Fachbetrieb.'
  },
  /* ======================================================================= */
  {
    id: 'parkett-oelen', bereich: 'boden', titel: 'Parkett oder Dielen ölen und auffrischen', schwierigkeit: 2,
    kurz: 'Geölte Holzböden reinigen, leicht anschleifen und neu ölen – mit Ölmenge nach Fläche, ohne Maschinenschliff.',
    schlagworte: ['parkett', 'parkett oelen', 'dielen oelen', 'holzboden', 'holzboden oelen', 'hartwachsoel', 'parkett auffrischen', 'parkett pflegen', 'dielenboden', 'boden oelen'],
    aufnahme: { art: 'raum', hoehe: false, oeffnungen: false },
    optionen: [
      { id: 'oberflaeche', label: 'Oberfläche', typ: 'wahl', std: 'geoelt', werte: [['geoelt', 'Geölt bzw. geölt-gewachst (matt, offenporig)'], ['lackiert', 'Lackiert / versiegelt (glänzt, Wasser perlt ab)']] },
      { id: 'erst', label: 'Holz ist stark ausgetrocknet oder frisch geschliffen (2 Ölaufträge)', typ: 'ja', std: false }
    ],
    vorlauf: 'Ein Wochenende einplanen: Der Raum ist bis zum nächsten Tag nicht begehbar, Möbel erst nach dem Aushärten (oft 2–3 Tage) zurück.',
    material(m, o) {
      const l = [], A = m.R.boden;
      if (o.oberflaeche === 'lackiert') { l.push(P('Pflegemittel für versiegeltes Parkett (Flasche 1 l)', 'boden', 1, 'Fl.', { rechnung: ['Lackierte Böden werden nicht geölt – nur gepflegt. Neu lackieren nach Maschinenschliff: Fachbetrieb.'] })); return l; }
      const n = o.erst ? 2 : 1, bed = A * 0.05 * n * 1.1, g = R.gebinde(bed, [0.75, 2.5], 'l');
      l.push(P('Hartwachsöl bzw. Parkettöl (für Holzböden)', 'boden', g.stueck, 'Dose', { detail: g.text, rechnung: [`${z(A)} m² × 0,05 l/m² (ca. 20 m² je Liter) × ${n} Auftrag/Aufträge = ${z(A * 0.05 * n)} l`, `+ 10 % = ${z(bed)} l → ${g.text}`, 'Ergiebigkeit laut Dose hat Vorrang; Ölsorte passend zum bisherigen Öl wählen.'] }));
      l.push(P('Holzbodenseife / Grundreiniger für geölte Böden (1 l)', 'boden', 1, 'Fl.'));
      l.push(P('Schleifgitter bzw. Schleifpads Körnung 120–150 für Handschleifer bzw. Einscheibenmaschine', 'boden', 1, 'Pack.'));
      l.push(P('Polierpads weiß (für Einscheibenmaschine) bzw. Baumwolltücher', 'boden', 1, 'Pack.'));
      l.push(P('Fusselfreie Baumwolllappen', 'reinigung', 1, 'Pack.'));
      l.push(P('Blechdose mit Deckel bzw. Eimer Wasser für ölige Lappen', 'sonstiges', 1, 'Stk.', { rechnung: ['Ölgetränkte Lappen können sich selbst entzünden!'] }));
      l.push(P('Filzgleiter für Möbel', 'eisen', 1, 'Pack.', { optional: true }));
      l.push(...schutz('handschuhe', 'knie'));
      return l;
    },
    werkzeug: ['staubsauger', 'eimer', 'schleifklotz', 'einscheibe', 'flachstreicher', 'pinsel'],
    schritte: [
      { t: 'Raum leer räumen', min: m => 20 + m.R.boden * 1.5,
        x: 'Alle Möbel hinaus, Teppiche weg, Fenster öffnen. Raumtemperatur 15–25 °C.',
        kniff: 'Testen, ob geölt oder lackiert: Ein Tropfen Wasser zieht bei geöltem Holz nach einigen Minuten dunkel ein, auf Lack perlt er.',
        fehler: 'Öl auf lackiertes Parkett: Es zieht nicht ein, bleibt klebrig und wird fleckig.' },
      { t: 'Gründlich reinigen', min: m => 15 + m.R.boden * 2, warten: 120, wartenText: 'Boden vollständig trocknen lassen',
        x: 'Boden saugen, dann mit Holzbodenseife bzw. Grundreiniger nebelfeucht wischen. Grauschleier und Flecken mit dem Reiniger nacharbeiten.',
        kniff: 'Zwei Eimer: einer mit Reinigungslösung, einer zum Auswringen – so bleibt das Wasser sauber.',
        fehler: 'Nass gewischt: Holz quillt, Fugen gehen auf.' },
      { t: 'Leicht anschleifen', min: m => 15 + m.R.boden * 2,
        x: 'Die Oberfläche mit Schleifgitter (Hand) bzw. mit der Einscheibenmaschine und Schleifpad ganz leicht anrauen, damit das neue Öl gleichmäßig aufgenommen wird. Danach sehr gründlich saugen.',
        kniff: 'Immer in Faserrichtung von Hand nacharbeiten – Ecken und Ränder zuerst.',
        fehler: 'Mit grober Körnung an einer Stelle zu lange geschliffen: helle Flecken, die das Öl nicht ausgleicht.',
        sicher: 'Schleifstaub: Staubmaske. Mit dem Schleifgerät keine Kabel überfahren.' },
      { t: 'Öl auftragen', min: m => 15 + m.R.boden * 2,
        x: 'Öl gut aufrühren und dünn mit dem Flachstreicher bzw. Roller in Faserrichtung auftragen, immer einige Dielen auf ganzer Länge. Vom Fenster zur Tür arbeiten, damit Sie nicht in die Ecke geraten.',
        kniff: 'Lieber zu dünn als zu dick – überschüssiges Öl klebt und wird stumpf.',
        fehler: 'Auf sich selbst zu gearbeitet: Ausweg nur über das frische Öl.',
        sicher: 'Gut lüften, keine offenen Flammen.' },
      { t: 'Einpolieren, Überschuss abnehmen', min: m => 15 + m.R.boden * 2, warten: 1440, wartenText: 'Trocknen (begehbar nach ca. 24 h, voll belastbar laut Dose)',
        x: 'Nach der Einwirkzeit laut Dose (meist 15–30 Minuten) das Öl mit dem weißen Pad bzw. Baumwolltüchern einpolieren und alles, was nicht eingezogen ist, vollständig abnehmen.',
        kniff: 'Mit der Hand über den Boden streichen: Fühlt er sich ölig an, nachpolieren.',
        fehler: 'Überschuss liegen gelassen: Klebrige, glänzende Flecken.' },
      { t: '2. Auftrag und ölige Lappen sicher entsorgen', min: (m, o) => o.erst ? 20 + m.R.boden * 3 : 10, tagNeu: (m, o) => !!o.erst,
        x: 'Bei ausgetrocknetem oder frisch geschliffenem Holz einen zweiten, dünneren Auftrag wie oben. Alle öligen Lappen und Pads in Wasser legen oder luftdicht in einer Blechdose aufbewahren und so entsorgen.',
        kniff: 'Möbel frühestens nach 2–3 Tagen zurück, Teppiche nach etwa einer Woche – Filzgleiter unter die Möbel.',
        fehler: 'Ölige Lappen zusammengeknüllt im Müll: Sie können sich selbst entzünden.',
        sicher: 'Selbstentzündungsgefahr ölgetränkter Lappen!' }
    ],
    sicherheit: ['Ölgetränkte Lappen und Pads: Selbstentzündungsgefahr – in Wasser legen oder luftdicht in Blechdose.', 'Gut lüften, keine offenen Flammen.'],
    grenzen: ['Maschinenschliff bis aufs rohe Holz und Neuversiegelung – Fachbetrieb (Parkettleger).', 'Dielen sind lose, federn stark oder sind morsch – Unterkonstruktion prüfen lassen.'],
    wartung: { monate: 12, monat: 3, text: 'Geölten Holzboden pflegen (Pflegeöl dünn auffrischen)', std: false }
  },
  /* ======================================================================= */
  {
    id: 'dielen-knarren', bereich: 'boden', titel: 'Knarrende Holzdielen befestigen', schwierigkeit: 2,
    kurz: 'Knarrende Dielen finden und von oben unsichtbar an den Balken verschrauben.',
    schlagworte: ['knarren', 'dielen knarren', 'boden knarrt', 'holzboden knarrt', 'dielen quietschen', 'dielen befestigen', 'holzdielen', 'dielenboden', 'boden quietscht'],
    aufnahme: { art: 'werte', felder: [{ id: 'stellen', label: 'Anzahl knarrender Stellen', einheit: 'Stellen', std: 6, max: 80, ganz: true }] },
    optionen: [
      { id: 'oberflaeche', label: 'Oberfläche', typ: 'wahl', std: 'geoelt', werte: [['geoelt', 'Geölt bzw. gestrichen'], ['lackiert', 'Lackiert/versiegelt']] },
      { id: 'federn', label: 'Dielen geben stark nach, hängen durch oder sind morsch', typ: 'ja', std: false }
    ],
    material(m, o) {
      const l = [], n = Math.ceil(m.stellen * 2 * 1.2), g = R.gebinde(n, [25, 50, 100], 'Stk.');
      l.push(P('Holzschrauben mit Senkkopf und Teilgewinde 4 × 60 mm (bzw. Dielenstärke + 35 mm)', 'eisen', g.stueck, 'Pack.', { detail: g.text, rechnung: [`Je Knarrstelle 2 Schrauben in den Balken: ${m.stellen} × 2 = ${m.stellen * 2}`, `+ 20 % Reserve = ${n} → ${g.text}`, 'Teilgewinde zieht die Diele fest an den Balken.'] }));
      l.push(P('Holzkitt bzw. Holzdübel (Stopfen) im Holzton', 'holz', 1, 'Tube', { rechnung: ['Zum Verschließen der Schraubenköpfe.'] }));
      l.push(P('Grafitpulver bzw. Talkum (für knarrende Fugen zwischen Dielen)', 'eisen', 1, 'Pack.', { optional: true }));
      l.push(P(o.oberflaeche === 'lackiert' ? 'Reparaturlack für Parkett (klein)' : 'Holzöl (Rest bzw. kleine Dose)', 'boden', 1, 'Stk.', { optional: true }));
      l.push(...schutz('brille', 'knie'));
      return l;
    },
    werkzeug: ['leitungssucher', 'akkuschrauber', 'zollstock', 'bleistift', 'spachtel', 'schleifklotz', 'hammer'],
    schritte: [
      { t: 'Knarrstellen finden und markieren', min: m => 10 + m.stellen * 2,
        x: 'Langsam über den Boden gehen und jede knarrende Stelle mit Kreppband markieren. Zu zweit geht es leichter: Einer tritt, der andere hört genau hin.',
        kniff: 'Knarrt es zwischen zwei Dielen (Reibung in der Fuge), hilft oft schon Grafitpulver oder Talkum in die Fuge.',
        fehler: 'Wahllos geschraubt: Die Ursache liegt oft nicht da, wo es am lautesten ist.' },
      { t: 'Leitungen und Fußbodenheizung prüfen', min: 15,
        x: 'Mit dem Leitungssucher die Stellen absuchen. Unter Dielen können Strom-, Wasser- oder Heizleitungen liegen. Bei Fußbodenheizung nicht schrauben.',
        kniff: 'Leitungen laufen meist parallel zu den Balken, oft von Steckdosen und Heizkörpern aus.',
        fehler: 'Eine Wasserleitung angebohrt – der Schaden unter dem Boden bleibt lange unbemerkt.',
        sicher: 'Bei Fußbodenheizung oder unklaren Leitungen nicht bohren.' },
      { t: 'Balken orten', min: m => 10 + m.stellen * 2,
        x: 'Die Balken liegen unter den Nagelreihen der Dielen – meist im Abstand von 60–90 cm. Balkenmitte an jeder Knarrstelle mit Bleistift auf dem Kreppband markieren.',
        kniff: 'Mit dem Leitungssucher im Holzmodus oder einem Magneten (findet die alten Nägel) die Balken sicher bestimmen.',
        fehler: 'Neben den Balken geschraubt: Die Schraube greift ins Leere, die Diele knarrt weiter.' },
      { t: 'Vorbohren und versenken', min: m => 5 + m.stellen * 3,
        x: 'Je Stelle zwei Löcher leicht schräg zueinander vorbohren (in der Diele etwas größer als der Schraubendurchmesser) und für den Schraubenkopf versenken.',
        kniff: 'Ein Klebeband-Fähnchen am Bohrer markiert die Tiefe.',
        fehler: 'Ohne Vorbohren in alte, trockene Dielen geschraubt: Die Diele reißt.' },
      { t: 'Verschrauben', min: m => 5 + m.stellen * 3,
        x: 'Diele mit dem Körpergewicht belasten und die Schrauben eindrehen, bis die Diele fest auf dem Balken sitzt. Kopf knapp unter die Oberfläche versenken. Probe laufen.',
        kniff: 'Bei Teilgewindeschrauben zieht sich die Diele von selbst an den Balken – nicht überdrehen.',
        fehler: 'Schraube zu tief gezogen: Der Kopf reißt durch das Holz.' },
      { t: 'Löcher verschließen', min: m => 10 + m.stellen * 3, warten: 120, wartenText: 'Kitt trocknen lassen',
        x: 'Schraubenlöcher mit Holzkitt oder Holzstopfen schließen, nach dem Trocknen bündig schleifen und mit Öl bzw. Lack ausbessern.',
        kniff: 'Kitt eine Spur dunkler wählen als das Holz – helle Punkte fallen mehr auf als dunkle.',
        fehler: 'Kitt nass überstrichen: Er schrumpft und fällt heraus.' }
    ],
    sicherheit: ['Leitungssucher vor jedem Bohren.', 'Bei Fußbodenheizung nicht schrauben.'],
    grenzen: ['Dielen geben stark nach, hängen durch oder sind morsch bzw. riechen modrig – Balkenlage (Statik, Feuchte, Holzschädlinge) vom Fachbetrieb prüfen lassen.', 'Fußbodenheizung unter dem Holzboden.'],
    rot: (m, o) => o.federn ? 'Wenn Dielen stark nachgeben, durchhängen oder morsch sind, kann die Balkenlage geschädigt sein (Feuchte, Holzschädlinge, Statik). Bitte von einem Fachbetrieb bzw. Zimmerer prüfen lassen, bevor Sie schrauben.' : ''
  },
  /* ======================================================================= */
  {
    id: 'duschabtrennung', bereich: 'sanitaer', titel: 'Duschabtrennung abdichten', schwierigkeit: 1,
    kurz: 'Tropfende Duschtür? Dichtprofile tauschen und die Außenfuge erneuern – mit Profil- und Kartuschen-Rechnung.',
    schlagworte: ['duschabtrennung', 'duschtuer', 'dusche tropft', 'duschwand', 'dichtprofil', 'duschdichtung', 'dusche undicht', 'dusche laeuft aus', 'duschkabine', 'wasser vor der dusche'],
    aufnahme: { art: 'werte', felder: [
      { id: 'kanten', label: 'Anzahl Glaskanten mit Dichtprofil (senkrecht und unten)', einheit: 'Stück', std: 4, max: 12, ganz: true, hilfe: 'Typisch: Pendeltür 2 senkrecht + 1 unten, Eckeinstieg 4.' },
      { id: 'hoehe', label: 'Höhe der Glasscheiben', einheit: 'm', std: 1.95, max: 2.5, min: 0.5 },
      { id: 'fuge', label: 'Länge der Silikonfuge außen (Profil an Wand und Wanne)', einheit: 'm', std: 4, max: 20, pflicht: false }
    ] },
    optionen: [{ id: 'dahinter', label: 'Wasser läuft schon hinter die Fliesen oder in Nachbarräume (Flecken, Geruch)', typ: 'ja', std: false }],
    vorlauf: 'Glasdicke (meist 6 oder 8 mm) und Profilform vorher bestimmen: ein Stück des alten Profils mitnehmen oder fotografieren.',
    material(m, o) {
      const l = [], n = m.kanten * Math.ceil(R.rund(m.hoehe / 2.0, 6));
      l.push(P('Dichtprofile für Duschtüren (passend zu Glasdicke und Form, 2,00 m)', 'sanitaer', n, 'Stk.', { rechnung: [`Je Kante ein Profil in ganzer Länge: ${m.kanten} Kanten × ${Math.ceil(m.hoehe / 2.0)} Stück à 2,00 m (Höhe ${z(m.hoehe)} m) = ${n}`, 'Profile werden auf Länge geschnitten – nicht stückeln.'] }));
      if (m.fuge > 0) { const ml = m.fuge * fugeMm2(5), k = Math.max(1, Math.ceil(R.rund(ml / 300, 6))); l.push(P('Sanitär-Silikon transparent bzw. weiß (Kartusche 300 ml)', 'sanitaer', k, 'Kartusche', { rechnung: [`${z(m.fuge)} m × ${z(fugeMm2(5), 0)} mm² (5-mm-Fuge) = ${z(ml, 0)} ml → ${k}`, 'Silikon nur außen an Wand- und Wannenprofil, nie innen (dort soll Wasser zurück in die Wanne laufen).'] })); }
      l.push(P('Kalklöser bzw. Glasreiniger und Isopropanol zum Entfetten', 'reinigung', 1, 'Fl.'));
      l.push(P('Silikonentferner (Gel)', 'sanitaer', 1, 'Tube', { optional: true }));
      l.push(krepp(Math.max(2, (m.fuge || 0) * 2), 'Silikonfuge außen abkleben'));
      return l;
    },
    werkzeug: ['cutter', 'silikonentferner', 'kartuschenpistole', 'fugenglaetter', 'schwamm', 'zollstock'],
    schritte: [
      { t: 'Undichte Stelle finden', min: 15,
        x: 'Mit der Handbrause gezielt nacheinander auf jede Kante und jede Fuge spritzen, während Sie außen beobachten. Ist das Wasser vor der Dusche aus einer Fuge unten, aus dem Türspalt oder aus der Wandfuge?',
        kniff: 'Ein trockenes Küchentuch außen auf den Boden legen – nasse Stellen zeigen genau, wo es herauskommt.',
        fehler: 'Gleich alles neu gemacht, dabei war nur das untere Abtropfprofil verrutscht.' },
      { t: 'Alte Dichtprofile abziehen', min: m => 5 + m.kanten * 3,
        x: 'Profile von unten nach oben von der Glaskante ziehen. Länge notieren bzw. altes Profil als Muster aufheben.',
        kniff: 'Das alte Profil fotografieren, bevor es weggeworfen wird – Form und Lippenrichtung sind wichtig.',
        fehler: 'Altes Profil sofort weggeworfen: Die richtige Form ist schwer zu finden.' },
      { t: 'Glas reinigen und entkalken', min: m => 10 + m.kanten * 3,
        x: 'Glaskanten mit Kalklöser reinigen, abspülen, trocknen und mit Isopropanol entfetten. Alte Silikonreste an Wand- und Wannenprofil entfernen.',
        kniff: 'Ein Kunststoffschaber schont Glas und Beschichtung.',
        fehler: 'Neue Profile auf verkalkte Kanten: Sie rutschen und dichten nicht.' },
      { t: 'Neue Profile aufsetzen', min: m => 5 + m.kanten * 5,
        x: 'Profil auf Glaslänge abschneiden (unten 2–3 mm kürzer, damit die Tür nicht schleift) und auf die Kante stecken. Die Dichtlippe zeigt zur Duschinnenseite bzw. zum Gegenprofil.',
        kniff: 'Profil vor dem Aufstecken mit Spülwasser benetzen – dann gleitet es leicht.',
        fehler: 'Profil verkehrt herum: Die Lippe leitet das Wasser nach außen.' },
      { t: 'Silikonfuge außen erneuern', wenn: m => m.fuge > 0, min: m => 15 + (m.fuge || 0) * 4, warten: 1440, wartenText: 'Silikon aushärten (24 h nicht duschen)',
        x: 'Wand- und Wannenprofil nur außen mit Silikon abdichten: abkleben, Silikon einspritzen, glätten, Krepp sofort abziehen (siehe „Silikonfugen erneuern“). Innen bleibt offen.',
        kniff: 'Unten am Wannenrand innen zwei bis drei Zentimeter offen lassen – dort kann Wasser zurück in die Wanne laufen.',
        fehler: 'Innen dicht gesilikont: Wasser staut sich im Profil und läuft nach außen über.' },
      { t: 'Testen', min: 10,
        x: 'Nach dem Aushärten mit der Handbrause alle Kanten abbrausen und außen kontrollieren.',
        kniff: 'Den Duschstrahl beim Duschen nicht direkt auf die Türfuge richten – kein Profil ist gegen einen harten Strahl völlig dicht.',
        fehler: 'Gleich nach dem Silikonieren geduscht.' }
    ],
    sicherheit: ['Glas mit Vorsicht behandeln – beschädigte Kanten können brechen.', 'Lüften beim Silikonieren.'],
    grenzen: ['Wasser läuft schon hinter die Fliesen, in die Wand oder Nachbarräume – Abdichtung prüfen lassen.', 'Glasscheibe beschädigt oder Beschläge gebrochen – Glaserei bzw. Fachbetrieb.'],
    rot: (m, o) => o.dahinter ? 'Läuft Wasser schon hinter die Fliesen oder in Nachbarräume, ist die Abdichtung unter den Fliesen betroffen. Neue Profile helfen dann nicht – bitte Fachbetrieb beauftragen, bevor Folgeschäden entstehen.' : '',
    wartung: { monate: 12, text: 'Dichtprofile der Duschabtrennung auf Kalk und Risse prüfen' }
  },
  /* ======================================================================= */
  {
    id: 'wc-sitz', bereich: 'sanitaer', titel: 'WC-Sitz wechseln', schwierigkeit: 1,
    kurz: 'Alten Toilettensitz ab, neuen drauf – mit den richtigen Maßen und festsitzender Befestigung.',
    schlagworte: ['wc sitz', 'klodeckel', 'toilettendeckel', 'wc deckel', 'klobrille', 'toilettensitz', 'wc brille', 'sitz wackelt', 'klo deckel wackelt'],
    aufnahme: { art: 'werte', felder: [
      { id: 'abstand', label: 'Abstand der Befestigungslöcher (Mitte–Mitte)', einheit: 'cm', std: 15.5, max: 25, min: 10, hilfe: 'Meist 15,5 cm.' },
      { id: 'laenge', label: 'Länge der Keramik (Lochmitte bis Vorderkante)', einheit: 'cm', std: 44, max: 55, min: 30 }
    ] },
    optionen: [{ id: 'befestigung', label: 'Befestigung', typ: 'wahl', std: 'unten', werte: [['unten', 'Von unten verschraubt (Muttern unter der Keramik)'], ['oben', 'Von oben (Sacklochbefestigung, z. B. Wand-WC ohne Zugang unten)']] }],
    material(m, o) {
      return [
        P(`WC-Sitz mit Deckel, Lochabstand ${z(m.abstand, 1)} cm, Länge ca. ${z(m.laenge, 0)} cm${o.befestigung === 'oben' ? ', mit Befestigung von oben (Spreizdübel)' : ''}`, 'sanitaer', 1, 'Stk.', { rechnung: [`Lochabstand ${z(m.abstand, 1)} cm und Länge ${z(m.laenge, 0)} cm mit den Angaben auf der Verpackung vergleichen.`, 'Form beachten: oval, D-Form oder rund – Umriss der Keramik fotografieren.'] }),
        P('Universal-Befestigungsset für WC-Sitze (falls dem Sitz nicht beiliegend)', 'sanitaer', 1, 'Set', { optional: true }),
        P('Badreiniger und Schwamm', 'reinigung', 1, 'Stk.', { optional: true })
      ];
    },
    werkzeug: ['schraubendreher', 'zange', 'zollstock', 'lampe'],
    schritte: [
      { t: 'Maße nehmen', min: 5,
        x: 'Lochabstand Mitte–Mitte, Länge der Keramik von Lochmitte bis Vorderkante und größte Breite messen. Form der Keramik fotografieren.',
        kniff: 'Das Foto von oben mit Zollstock im Bild zeigt im Laden sofort, welche Form passt.',
        fehler: 'Nur nach Optik gekauft: Der Sitz steht vorne über oder ist zu kurz.' },
      { t: 'Alten Sitz abschrauben', min: 10,
        x: 'Muttern unter der Keramik mit der Hand oder der Zange lösen, bei Befestigung von oben die Abdeckkappen öffnen und die Schrauben herausdrehen. Festgerostete Schrauben mit etwas Kriechöl lösen.',
        kniff: 'Rostige Metallschrauben lassen sich oft nur noch durchsägen – dafür ein Stück Pappe zum Schutz unter die Säge auf die Keramik legen.',
        fehler: 'Mit Gewalt gehebelt: Die Keramik kann an den Löchern ausbrechen.' },
      { t: 'Reinigen', min: 5,
        x: 'Den Bereich um die Befestigungslöcher gründlich reinigen – dort sammelt sich unter dem alten Sitz Schmutz.',
        kniff: 'Gummihandschuhe und ein alter Zahnbürstenkopf erreichen die Lochränder.',
        fehler: 'Neuen Sitz auf verschmutzte Keramik: unhygienisch und er rutscht.' },
      { t: 'Neuen Sitz montieren', min: 10,
        x: 'Befestigungsschrauben laut Anleitung in die Scharniere setzen, Sitz auflegen und die Schrauben durch die Löcher führen. Gummischeiben zwischen Keramik und Mutter nicht vergessen.',
        kniff: 'Muttern erst nur handfest anziehen – ausgerichtet wird im nächsten Schritt.',
        fehler: 'Gummischeiben weggelassen: Die Keramik kann beim Festziehen springen.' },
      { t: 'Ausrichten und festziehen', min: 5,
        x: 'Sitz mittig ausrichten, sodass er vorne bündig mit der Keramik abschließt, dann die Muttern fest, aber mit Gefühl anziehen. Mehrfach öffnen und schließen.',
        kniff: 'Bei Absenkautomatik prüfen, ob Deckel und Sitz langsam schließen – sonst laut Anleitung nachjustieren.',
        fehler: 'Mit der Zange angeknallt: Kunststoffgewinde reißt oder Keramik bricht.' }
    ],
    sicherheit: ['Keramik nicht mit Gewalt belasten, Muttern nur mit Gefühl anziehen.', 'Handschuhe tragen (Hygiene).'],
    grenzen: ['Keramik gesprungen oder WC wackelt an der Wand bzw. am Boden – Sanitärfachbetrieb.']
  },
  /* ======================================================================= */
  {
    id: 'eckventil-pruefen', bereich: 'sanitaer', titel: 'Eckventile und Anschlussschläuche prüfen', schwierigkeit: 1,
    kurz: 'Sichtprüfung unter Waschbecken, Spüle und am WC: Tropfen, Rost, Knicke – damit kein Wasserschaden entsteht.',
    schlagworte: ['eckventil', 'eckventile', 'anschlussschlauch', 'flexschlauch', 'wasseranschluss', 'unter der spuele nass', 'ventil tropft', 'schlauch tropft', 'unter dem waschbecken nass', 'wasserschaden vorbeugen'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl Eckventile im Haus', einheit: 'Stück', std: 8, max: 60, ganz: true, hilfe: 'Je Waschbecken meist 2, je WC 1, Küchenspüle 2, Geschirrspüler 1.' }] },
    optionen: [{ id: 'befund', label: 'Ein Ventil oder Schlauch tropft bereits bzw. ist feucht', typ: 'ja', std: false }],
    material(m, o) {
      return [
        P('Küchenrolle (trockenes Tuch zur Tropfkontrolle)', 'reinigung', 1, 'Rolle'),
        P('Tropfschale bzw. flache Auffangwanne (für Verdachtsstellen)', 'reinigung', 1, 'Stk.', { optional: true }),
        P('Wassermelder (warnt bei Leck) – siehe „CO- und Wassermelder“', 'elektro', 0, 'Stk.', { optional: true })
      ].filter(p => p.menge > 0 || !p.name.startsWith('Wassermelder'));
    },
    werkzeug: ['lampe', 'zollstock'],
    schritte: [
      { t: 'Alle Ventile finden', min: m => 5 + m.anzahl * 1,
        x: 'Unter jedem Waschbecken, unter der Küchenspüle, hinter dem WC und an Geschirrspüler bzw. Waschmaschine die Eckventile und Anschlussschläuche suchen. Eine Liste in „Mein Haus“ anlegen.',
        kniff: 'Schrankinhalt unter der Spüle einmal komplett ausräumen – meist sieht man dabei mehr als erwartet.',
        fehler: 'Nur die sichtbaren Ventile geprüft – die hinter dem Geschirrspüler vergessen.' },
      { t: 'Sichtprüfung mit Tuch', min: m => 5 + m.anzahl * 2,
        x: 'Mit Taschenlampe ansehen: grüne oder weiße Ablagerungen (Kalk, Grünspan), Rost, Tropfen, Wasserränder im Schrank? Ein trockenes Tuch unter jedes Ventil halten und kurz an die Verbindungen tupfen.',
        kniff: 'Ein Blatt Küchenpapier über Nacht unter die Verbindung legen – am Morgen sieht man auch winzige Tropfen.',
        fehler: 'Aufgequollener Schrankboden ignoriert: Er zeigt ein langsames Leck an.' },
      { t: 'Gängigkeit vorsichtig prüfen', min: m => 5 + m.anzahl * 1,
        x: 'Jedes Ventil vorsichtig ein Stück zu- und wieder aufdrehen. Es soll sich von Hand bewegen lassen. Sitzt es fest: nicht mit Gewalt – notieren.',
        kniff: 'Ventile, die im Notfall nicht schließen, sind wertlos – deshalb einmal im Jahr bewegen.',
        fehler: 'Festsitzendes Ventil mit der Zange gedreht: Es bricht ab, Wasser läuft unkontrolliert.',
        sicher: 'Vorher wissen, wo der Hauptwasserhahn ist (Mein Haus).' },
      { t: 'Anschlussschläuche prüfen', min: m => 5 + m.anzahl * 1,
        x: 'Flexschläuche dürfen nicht geknickt, verdreht, rostig oder aufgebläht sein. Die Ummantelung (Edelstahlgeflecht) darf keine abstehenden Drähte haben.',
        kniff: 'Viele Hersteller empfehlen, Flexschläuche nach einer bestimmten Zeit vorsorglich zu tauschen – Datum notieren.',
        fehler: 'Geknickten Schlauch „noch gelassen“ – Knicke sind eine häufige Ursache für Wasserschäden.' },
      { t: 'Ergebnis notieren', min: 5,
        x: 'Jedes Ventil mit Ort, Zustand und Datum in „Mein Haus“ notieren. Tropfende Ventile oder schadhafte Schläuche vom Sanitärfachbetrieb tauschen lassen.',
        kniff: 'Fotos von jedem Ventil helfen beim nächsten Mal zum Vergleich.',
        fehler: 'Befund nicht notiert – nach einem Jahr weiß niemand mehr, was auffiel.' }
    ],
    sicherheit: ['Nur prüfen und vorsichtig bewegen – nichts lösen oder abschrauben.', 'Hauptwasserhahn kennen.'],
    grenzen: ['Ventil tropft, sitzt fest oder Schlauch ist beschädigt – Tausch durch Sanitärfachbetrieb.'],
    rot: (m, o) => o.befund ? 'Ein tropfendes Eckventil oder ein beschädigter Anschlussschlauch kann jederzeit nachgeben. Bitte Ventil zudrehen (falls gefahrlos möglich), Tropfschale unterstellen und den Tausch einem Sanitärfachbetrieb überlassen.' : '',
    wartung: { monate: 12, monat: 2, text: 'Eckventile bewegen, Anschlussschläuche ansehen' }
  },
  /* ======================================================================= */
  {
    id: 'wasserfilter', bereich: 'sanitaer', titel: 'Hauswasserfilter rückspülen', schwierigkeit: 1,
    kurz: 'Den rückspülbaren Filter hinter dem Wasserzähler regelmäßig spülen – Pflicht für hygienisches Trinkwasser.',
    schlagworte: ['wasserfilter', 'hauswasserfilter', 'filter rueckspuelen', 'rueckspuelfilter', 'trinkwasserfilter', 'feinfilter', 'filter keller', 'wasserdruck schwach'],
    aufnahme: { art: 'keine' },
    optionen: [{ id: 'typ', label: 'Filtertyp', typ: 'wahl', std: 'rueck', werte: [['rueck', 'Rückspülfilter (mit Drehgriff/Ventil unten)'], ['patrone', 'Filter mit Wechselpatrone (nicht rückspülbar)']] }],
    material(m, o) {
      return o.typ === 'patrone'
        ? [P('Ersatz-Filterpatrone (Typ laut Filtergehäuse, Foto mitnehmen)', 'sanitaer', 1, 'Stk.', { rechnung: ['Nicht rückspülbare Filter: Patrone nach Herstellerangabe tauschen, spätestens alle 6 Monate (DIN EN 806-5).'] }), P('Eimer und Lappen', 'reinigung', 1, 'Stk.', { optional: true })]
        : [P('Eimer (10 l) und Lappen', 'reinigung', 1, 'Stk.', { optional: true, hinweis: 'abwählen, wenn vorhanden' }), P('Etikett für das Rückspüldatum', 'sonstiges', 1, 'Stk.', { optional: true })];
    },
    werkzeug: ['eimer', 'lampe'],
    schritte: [
      { t: 'Filter finden und Typ bestimmen', min: 5,
        x: 'Der Hauswasserfilter sitzt direkt hinter dem Wasserzähler im Keller bzw. Hausanschlussraum. Rückspülbare Filter haben unten einen Drehgriff oder ein Spülventil mit Ablauf.',
        kniff: 'Die Bedienungsanleitung des Filters hängt oft in einer Hülle daneben – sonst Typ fotografieren und beim Hersteller nachsehen.',
        fehler: 'Patronenfilter „rückgespült“ – der braucht eine neue Patrone.' },
      { t: 'Druck und Zustand ablesen', min: 5,
        x: 'Hat der Filter Manometer vor und nach dem Filter, beide ablesen: Ein großer Unterschied zeigt einen verschmutzten Filter. Das Sieb im Klarsichtgehäuse ansehen: braun verfärbt oder mit Sand belegt?',
        kniff: 'Datum der letzten Rückspülung auf ein Etikett am Filter schreiben.',
        fehler: 'Filter jahrelang nicht gespült: Keime können sich im Sieb vermehren, der Druck sinkt.' },
      { t: 'Rückspülen', wenn: (m, o) => o.typ !== 'patrone', min: 10,
        x: 'Eimer unter den Ablauf stellen (falls kein Abwasseranschluss). Den Drehgriff bzw. das Spülventil laut Anleitung öffnen – das Wasser strömt rückwärts durch das Sieb und spült den Schmutz aus. Nach wenigen Sekunden, wenn das Wasser klar kommt, wieder schließen.',
        kniff: 'Bei automatischen Filtern genügt meist der Druck auf die Spültaste.',
        fehler: 'Ventil zu lange offen: Unnötig viel Wasser, ohne Nutzen.' },
      { t: 'Patrone wechseln', wenn: (m, o) => o.typ === 'patrone', min: 20,
        x: 'Absperrventile vor und nach dem Filter schließen, Druck über einen Wasserhahn ablassen, Filterglocke mit dem Schlüssel abschrauben, Patrone tauschen, Glocke und Dichtring reinigen, festschrauben, Ventile langsam öffnen.',
        kniff: 'Dichtring vor dem Zusammenbau mit etwas Silikonfett für Trinkwasser einreiben.',
        fehler: 'Glocke schräg aufgeschraubt: Sie wird undicht.' },
      { t: 'Prüfen und notieren', min: 5,
        x: 'Auf Dichtheit prüfen, Druck ablesen und das Datum in „Mein Haus“ notieren. Die Norm DIN EN 806-5 nennt ein Intervall von höchstens 6 Monaten.',
        kniff: 'Kalender-Erinnerung aus „Mein Haus“ exportieren.',
        fehler: 'Nicht notiert – das Intervall wird schnell vergessen.' }
    ],
    sicherheit: ['Nur nach Herstelleranleitung bedienen.'],
    grenzen: ['Filter undicht, Gehäuse gerissen oder Druckminderer verstellt – Sanitärfachbetrieb.'],
    wartung: { monate: 6, text: 'Hauswasserfilter rückspülen bzw. Patrone tauschen (DIN EN 806-5)', std: false }
  },
  /* ======================================================================= */
  {
    id: 'waschmaschine', bereich: 'sanitaer', titel: 'Waschmaschine: Flusensieb reinigen, entkalken', schwierigkeit: 1,
    kurz: 'Flusensieb, Einspülkasten und Türdichtung reinigen und die Maschine pflegen – gegen Geruch und Störungen.',
    schlagworte: ['waschmaschine', 'flusensieb', 'waschmaschine pumpt nicht ab', 'waschmaschine stinkt', 'waschmaschine entkalken', 'waschmaschine reinigen', 'einspuelkasten', 'tuerdichtung waschmaschine', 'laugenpumpe'],
    aufnahme: { art: 'keine' },
    optionen: [{ id: 'hart', label: 'Hartes Wasser (Härtebereich „hart“, über 14 °dH)', typ: 'ja', std: false }],
    material(m, o) {
      return [
        P(o.hart ? 'Waschmaschinen-Entkalker bzw. Zitronensäure (Pulver)' : 'Waschmaschinen-Reiniger bzw. Zitronensäure (Pulver)', 'reinigung', 1, 'Pack.', { rechnung: ['Für einen Leerwaschgang laut Packung; bei hartem Wasser alle 2–3 Monate, sonst 2× im Jahr.'] }),
        P('Flache Schale bzw. Auflaufblech und alte Handtücher', 'reinigung', 1, 'Stk.', { optional: true }),
        P('Alte Zahnbürste und Mikrofasertuch', 'reinigung', 1, 'Stk.', { optional: true })
      ];
    },
    werkzeug: ['schraubendreher', 'lampe'],
    schritte: [
      { t: 'Strom aus, Wasserhahn zu', min: 5,
        x: 'Maschine ausschalten und den Netzstecker ziehen. Wasserhahn am Zulauf schließen.',
        kniff: 'Gleich den Zulaufschlauch ansehen: Knicke, Risse, feuchte Stellen?',
        fehler: 'Bei eingestecktem Gerät gearbeitet – Wasser und Strom.',
        sicher: 'Netzstecker ziehen. Nach einem heißen Waschgang das Restwasser abkühlen lassen.' },
      { t: 'Restwasser ablassen', min: 15,
        x: 'Klappe unten vorn öffnen. Schale und Handtücher unterlegen. Den kleinen Notentleerungsschlauch herausziehen, öffnen und das Restwasser ablaufen lassen – das können mehrere Liter sein.',
        kniff: 'Ein Backblech passt oft genau unter die Klappe.',
        fehler: 'Flusensieb sofort aufgedreht: Das ganze Restwasser läuft auf den Boden.' },
      { t: 'Flusensieb reinigen', min: 10,
        x: 'Flusensieb langsam gegen den Uhrzeigersinn herausdrehen. Flusen, Haare, Münzen und Knöpfe entfernen und das Sieb unter fließendem Wasser reinigen. Prüfen, ob sich das Flügelrad der Pumpe dahinter frei dreht. Sieb fest einschrauben.',
        kniff: 'Ein Foto vom Sieb vor dem Reinigen zeigt, wie viel sich angesammelt hat – danach richtet sich das Intervall.',
        fehler: 'Sieb nicht ganz eingeschraubt: Beim nächsten Waschgang läuft Wasser aus.' },
      { t: 'Einspülkasten reinigen', min: 10,
        x: 'Einspülkasten ganz herausziehen (meist Lasche drücken), mit warmem Wasser und Zahnbürste reinigen. Den Schacht dahinter ebenfalls auswischen.',
        kniff: 'Schwarze Beläge im Schacht sind oft Schimmel – mit Reiniger behandeln und den Kasten nach dem Waschen offen lassen.',
        fehler: 'Nur den Kasten gespült, den Schacht vergessen.' },
      { t: 'Türdichtung auswischen', min: 10,
        x: 'Die Falten der Gummimanschette auseinanderziehen und mit einem feuchten Tuch Flusen, Haare und Beläge herauswischen. Trocken nachwischen.',
        kniff: 'Tür nach jedem Waschen einen Spalt offen lassen – so trocknet die Dichtung und riecht nicht.',
        fehler: 'Mit scharfen Gegenständen in der Dichtung gekratzt: Riss, die Maschine wird undicht.' },
      { t: 'Pflegewaschgang', min: 10, warten: 120, wartenText: 'Leerwaschgang 60–90 °C läuft',
        x: 'Wasserhahn öffnen, Stecker einstecken. Reiniger bzw. Entkalker laut Packung einfüllen und einen Leerwaschgang mit hoher Temperatur starten. Zum Schluss Datum notieren.',
        kniff: 'Gelegentlich bei 60 °C waschen statt immer kalt – das hält Maschine und Schläuche sauber.',
        fehler: 'Essigessenz in großen Mengen: Gummidichtungen werden spröde.' }
    ],
    sicherheit: ['Netzstecker ziehen, Wasserhahn schließen.', 'Restwasser kann heiß sein.'],
    grenzen: ['Gehäuse öffnen, Pumpe tauschen, Elektrik – Kundendienst bzw. Fachbetrieb (230 V).', 'Maschine läuft aus, obwohl Sieb und Dichtung in Ordnung sind – Kundendienst.'],
    wartung: { monate: 3, text: 'Waschmaschine: Flusensieb und Einspülkasten reinigen' }
  },
  /* ======================================================================= */
  {
    id: 'duschkopf', bereich: 'sanitaer', titel: 'Duschkopf und Duschschlauch tauschen', schwierigkeit: 1,
    kurz: 'Verkalkte Handbrause oder undichten Brauseschlauch in zehn Minuten wechseln – Gewinde ½ Zoll, mit neuen Dichtungen.',
    schlagworte: ['duschkopf', 'handbrause', 'brauseschlauch', 'duschschlauch', 'duschschlauch undicht', 'duschkopf tauschen', 'brause wechseln', 'dusche tropft am schlauch', 'sparduschkopf'],
    aufnahme: { art: 'werte', felder: [{ id: 'laenge', label: 'Länge des Brauseschlauchs (alt messen)', einheit: 'm', std: 1.6, max: 2.5, min: 1 }] },
    optionen: [{ id: 'kopf', label: 'Duschkopf auch tauschen (nicht nur Schlauch)', typ: 'ja', std: true }],
    material(m, o) {
      const l = [], L = [1.25, 1.6, 1.75, 2.0].find(x => x >= m.laenge - 0.01) || 2.0;
      l.push(P(`Brauseschlauch ½" × ${z(L)} m (Anschluss konisch/zylindrisch passend zur Armatur)`, 'sanitaer', 1, 'Stk.', { rechnung: [`Altes Maß ${z(m.laenge)} m → nächste handelsübliche Länge ${z(L)} m (1,25 / 1,60 / 1,75 / 2,00 m)`, 'Konisches Ende kommt an die Handbrause, Sechskant an die Armatur.'] }));
      if (o.kopf) l.push(P('Handbrause mit Anschluss ½" (Wassersparbrause, z. B. ≤ 9 l/min)', 'sanitaer', 1, 'Stk.'));
      l.push(P('Flachdichtungen ½" (Set)', 'sanitaer', 1, 'Set'));
      l.push(P('Rückflussverhinderer (falls der alte Schlauch einen hatte)', 'sanitaer', 1, 'Stk.', { optional: true }));
      return l;
    },
    werkzeug: ['zange', 'schwamm'],
    schritte: [
      { t: 'Alten Duschkopf und Schlauch abschrauben', min: 5,
        x: 'Wasser abdrehen. Duschkopf vom Schlauch drehen, dann den Schlauch an der Armatur abschrauben. Sitzt er fest: Tuch darum und vorsichtig mit der Zange.',
        kniff: 'Abfluss mit Stöpsel oder Tuch verschließen – kleine Dichtungen fallen sonst hinein.',
        fehler: 'Zange ohne Tuch: zerkratzter Chrom.' },
      { t: 'Gewinde reinigen', min: 5,
        x: 'Gewinde an der Armatur von Kalk und alten Dichtungsresten befreien. Prüfen, ob im Armaturausgang ein Rückflussverhinderer sitzt.',
        kniff: 'Kalk mit etwas Zitronensäurelösung auf einem Tuch einweichen.',
        fehler: 'Alte Dichtung im Gewinde vergessen: Die neue sitzt schief, es tropft.' },
      { t: 'Neue Dichtungen und Schlauch montieren', min: 5,
        x: 'Neue Flachdichtungen einlegen. Den Schlauch mit dem Sechskant-Ende handfest an die Armatur schrauben.',
        kniff: 'Handfest genügt – die Dichtung dichtet, nicht die Kraft.',
        fehler: 'Ohne Dichtung angeschraubt: Es spritzt am Gewinde.' },
      { t: 'Duschkopf anschrauben', min: 3,
        x: 'Duschkopf mit Dichtung auf das konische Ende des Schlauchs schrauben.',
        kniff: 'Bei Wassersparbrausen kurz testen, ob der Durchfluss für den Durchlauferhitzer reicht (zündet er sicher?).',
        fehler: 'Spar-Brause an einem hydraulischen Durchlauferhitzer: Er schaltet nicht ein – dann eine Brause mit mehr Durchfluss wählen.' },
      { t: 'Testen', min: 3,
        x: 'Wasser langsam aufdrehen, alle Verbindungen auf Tropfen prüfen.',
        kniff: 'Einmal heiß und einmal kalt testen – Dichtungen reagieren auf Wärme.',
        fehler: 'Nur kurz kalt getestet.' }
    ],
    sicherheit: ['Keine Zange ohne Schutztuch.'],
    grenzen: ['Armatur selbst tropft oder ist undicht in der Wand – Sanitärfachbetrieb.']
  }
  );
})(typeof window !== 'undefined' ? window : globalThis);
