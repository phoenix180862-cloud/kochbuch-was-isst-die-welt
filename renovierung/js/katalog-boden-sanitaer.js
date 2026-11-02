/* TW Renovierungs-App – Katalog: Boden und Sanitär (Fliesenarbeiten bewusst nicht enthalten – dafür kommt eine eigene App) */
(function (root) {
  'use strict';
  const K = root.TW_KATALOG, R = root.TW_RECHNER, { P, schutz, krepp, abdeckung } = K;
  const z = R.zahl;

  const ASBEST_BODEN = 'In Häusern, die vor 1993 gebaut oder renoviert wurden, können alte Vinyl-Bodenplatten (Floor-Flex, meist 25 × 25 oder 30 × 30 cm), Cushion-Vinyl mit grauer Pappe auf der Rückseite, schwarze Bitumenkleber sowie alte Fliesenkleber und Spachtelmassen Asbest enthalten. Diese Beläge nicht herausreißen, nicht abschleifen und nicht abkratzen. Bei Verdacht Materialprobe untersuchen lassen bzw. Fachbetrieb mit Sachkunde nach TRGS 519 beauftragen. Darüber verlegen (ohne zu beschädigen) ist häufig möglich – vorher fachlich klären.';

  /* Silikon-Querschnitt in mm² je Fugenbreite (Erfahrungswert Dreiecks-/Hohlkehlfuge + 25 % Verlust) */
  const silikonMm2 = b => b * b * 0.7 * 1.25;

  /* Leisten je Wand stückeln: Wände L, B, L, B; Türbreiten werden der Reihe nach von den Wänden abgezogen */
  function leistenStueck(R1, leiste) {
    const waende = [R1.l, R1.b, R1.l, R1.b];
    const tueren = (R1.tueren || []).map(t => t.b);
    tueren.forEach((tb, i) => { const w = i % 4; waende[w] = Math.max(0, waende[w] - tb); });
    let stueck = 0; const zeilen = [];
    waende.forEach((w, i) => { const n = w > 0 ? Math.ceil(R.rund(w / leiste, 6)) : 0; stueck += n; zeilen.push(`Wand ${i + 1}: ${z(w)} m → ${n} Leiste(n)`); });
    return { stueck, zeilen };
  }

  K.arbeiten.push(
  /* ======================================================================= */
  {
    id: 'laminat', bereich: 'boden', titel: 'Laminat oder Klick-Vinyl verlegen', schwierigkeit: 2,
    kurz: 'Schwimmend verlegter Klickboden mit Dämmung, Dehnfugen und sauberen Türübergängen.',
    schlagworte: ['laminat', 'klickvinyl', 'klick vinyl', 'vinylboden', 'vinyl', 'designboden', 'boden verlegen', 'laminat verlegen', 'fussboden', 'parkett', 'klickparkett', 'neuer boden', 'boden legen'],
    aufnahme: { art: 'raum', hoehe: false, oeffnungen: 'tueren', hinweis: 'Innenmaße von Wand zu Wand. Türen für Übergangsprofile und Leisten.' },
    optionen: [
      { id: 'belag', label: 'Belag', typ: 'wahl', std: 'laminat', werte: [['laminat', 'Laminat'], ['vinyl', 'Klick-Vinyl ohne Dämmung'], ['vinyl-d', 'Klick-Vinyl mit integrierter Dämmung'], ['parkett', 'Klick-Parkett']] },
      { id: 'paket', label: 'Inhalt eines Pakets in m² (steht auf dem Paket)', typ: 'zahl', std: 2.22 },
      { id: 'verlegung', label: 'Verlegeart', typ: 'wahl', std: 'gerade', werte: [['gerade', 'Gerade (parallel zur Wand)'], ['diagonal', 'Diagonal / Fischgrät']] },
      { id: 'untergrund', label: 'Untergrund', typ: 'wahl', std: 'estrich', werte: [['estrich', 'Zementestrich, Anhydrit oder Beton (mineralisch)'], ['fliesen', 'Alte Fliesen'], ['holz', 'Holzdielen / Spanplatten']] },
      { id: 'fbh', label: 'Fußbodenheizung vorhanden', typ: 'ja', std: false },
      { id: 'alt', label: 'Alter Belag', typ: 'wahl', std: 'keiner', werte: [['keiner', 'Keiner bzw. bleibt (Fliesen)'], ['teppich', 'Teppich (wird entfernt)'], ['pvc', 'PVC-/Linoleum-Bahnen (werden entfernt)'], ['flex', 'Kleine Kunststoffplatten 25×25/30×30 cm (Floor-Flex) oder schwarzer Kleber']] }
    ],
    vorlauf: 'Pakete 48 Stunden vor dem Verlegen ungeöffnet und flach im Raum lagern (Laminat/Parkett), Vinyl laut Hersteller ebenfalls 24–48 h. Alle Pakete aus derselben Charge kaufen.',
    material(m, o) {
      const R1 = m.R, A = R1.boden, l = [];
      const vs = o.verlegung === 'diagonal' ? 0.15 : (A < 10 ? 0.10 : 0.07);
      const paket = +o.paket > 0 ? +o.paket : 2.22; const bed = A * (1 + vs); const n = Math.ceil(R.rund(bed / paket, 6));
      const name = { laminat: 'Laminat', vinyl: 'Klick-Vinyl', 'vinyl-d': 'Klick-Vinyl mit Dämmung', parkett: 'Klick-Parkett' }[o.belag] || 'Belag';
      l.push(P(name, 'boden', n, 'Paket', { detail: `je ${z(paket)} m²`, rechnung: [`Bodenfläche ${z(R1.l)} × ${z(R1.b)} m = ${z(A)} m²`, `+ ${z(vs * 100, 0)} % Verschnitt (${o.verlegung === 'diagonal' ? 'diagonal' : A < 10 ? 'kleiner Raum, viele Anschnitte' : 'gerade Verlegung'}) = ${z(bed)} m²`, `÷ ${z(paket)} m² je Paket = ${z(bed / paket)} → ${n} Pakete`] }));
      if (o.belag !== 'vinyl-d') {
        const dm = A * 1.05; const r = Math.ceil(dm / 10);
        l.push(P(o.belag === 'laminat' || o.belag === 'parkett' ? 'Trittschalldämmung (Rolle/Pack 10 m²)' : 'Vinyl-Trittschalldämmung, druckfest (Rolle/Pack 10 m²) – nur laut Hersteller', 'boden', r, 'Rolle', { rechnung: [`${z(A)} m² + 5 % = ${z(dm)} m² ÷ 10 m² → ${r}`, ...(o.fbh ? ['Bei Fußbodenheizung nur Dämmung mit niedrigem Wärmedurchlasswiderstand (für Fußbodenheizung geeignet).'] : [])] }));
      }
      if (o.untergrund === 'estrich') {
        const f = A * 1.15; const r = Math.ceil(f / 20);
        l.push(P('PE-Folie 0,2 mm als Dampfbremse (Rolle ca. 20 m²)', 'boden', r, 'Rolle', { optional: o.belag === 'vinyl-d', rechnung: [`Auf mineralischem Untergrund Pflicht (außer Dämmung hat Dampfbremse): ${z(A)} m² + 15 % (20 cm Überlappung, an der Wand hochziehen) = ${z(f)} m² ÷ 20 m² → ${r}`] }));
        l.push(P('Alu- oder PE-Klebeband für die Folienstöße', 'boden', 1, 'Rolle'));
      }
      const tue = (R1.tueren || []).length;
      if (tue) l.push(P('Übergangs- bzw. Abschlussprofil (ca. 0,90–1,00 m)', 'boden', tue, 'Stk.', { rechnung: [`Je Tür ein Profil: ${tue}`] }));
      if (o.untergrund === 'holz' || o.untergrund === 'fliesen') l.push(P('Ausgleichsmasse / Bodenspachtel (für Unebenheiten)', 'bau', 1, 'Sack', { optional: true, rechnung: ['Nur wenn Unebenheiten über 2–3 mm auf 1 m Länge gemessen werden (Herstellerangabe beachten).'] }));
      l.push(P('Rohrmanschetten / Heizkörperrosetten', 'boden', 0, 'Stk.', { optional: true, rechnung: ['Je Heizungsrohr eine Rosette – Anzahl im Raum zählen.'] }));
      l.push(P('Sockelleisten – siehe Arbeit „Sockelleisten montieren“', 'boden', 0, '', { optional: true }));
      l.push(...schutz('knie', 'gehoer', 'brille'));
      return l;
    },
    werkzeug: o => ['zollstock', 'bleistift', 'winkel', 'cutter', 'stichsaege', 'kappsaege', 'handsaege', 'schlagklotz', 'abstandskeile', 'gummihammer', 'wasserwaage', 'akkusauger', ...(o && (o.alt === 'teppich' || o.alt === 'pvc') ? ['spachtel'] : [])],
    schritte: [
      { t: 'Pakete akklimatisieren', min: 15, warten: 2880, wartenText: 'Pakete 48 h im Raum lagern – in der Zeit Raum vorbereiten', parallel: true,
        x: 'Pakete flach, ungeöffnet und mit Abstand zur Wand im Raum lagern. Raumtemperatur mindestens 18 °C, Luftfeuchte 40–60 %.',
        kniff: 'Pakete kreuzweise stapeln, damit Luft an alle Seiten kommt.',
        fehler: 'Aus der kalten Garage direkt verlegt: Der Boden dehnt sich später und wölbt sich.' },
      { t: 'Raum ausräumen, alten Belag entfernen', min: (m, o) => 30 + (o.alt === 'teppich' || o.alt === 'pvc' ? m.R.boden * 4 : 0),
        x: 'Raum leer räumen, alte Sockelleisten abnehmen. Teppich oder PVC-Bahnen in Streifen schneiden und aufrollen, Klebereste abstoßen. Untergrund gründlich saugen.',
        kniff: 'Teppich in 50 cm breite Streifen schneiden – so lassen sich die Rollen tragen und entsorgen.',
        fehler: 'Kleberreste und Krümel liegen gelassen: Sie drücken sich durch und knacken beim Gehen.',
        sicher: 'Kleine Kunststoffplatten (Floor-Flex) oder schwarzen Kleber nicht selbst entfernen – Asbestverdacht.' },
      { t: 'Untergrund prüfen', min: 30,
        x: 'Ebenheit mit 2-m-Richtlatte oder langer Wasserwaage prüfen: Mehr als 2–3 mm Lücke auf 1 m (Herstellerangabe) müssen ausgeglichen werden. Untergrund muss trocken, fest und sauber sein. Bei Fußbodenheizung: Freigabe des Belags für Fußbodenheizung prüfen.',
        kniff: 'Neue Estriche brauchen Wochen bis Monate zum Austrocknen – die Restfeuchte misst der Fachbetrieb mit dem CM-Gerät.',
        fehler: 'Klickboden auf welligen Untergrund: Die Verbindungen brechen, es knackt und federt.' },
      { t: 'Türzargen kürzen', min: m => 15 + (m.R.tueren.length || 0) * 20,
        x: 'Ein Reststück Paneel mit Dämmung als Lehre an die Zarge legen und die Zarge mit der Feinsäge flach darüber untersägen. So gleitet der Belag unter die Zarge, ohne anzustoßen.',
        kniff: 'Ein Malerspachtel unter die Säge legen, dann bleibt ein Hauch Luft.',
        fehler: 'Belag an die Zarge gestoßen und mit Silikon verfugt: Er kann sich nicht bewegen.' },
      { t: 'Folie und Dämmung auslegen', nachParallel: true, min: m => 15 + m.R.boden * 1.2,
        x: 'Auf mineralischem Untergrund PE-Folie 20 cm überlappend auslegen, Stöße abkleben, an den Wänden 3–5 cm hochziehen. Darauf die Trittschalldämmung stoßend (nicht überlappend) verlegen – nur so viel, wie Sie gleich belegen.',
        kniff: 'Die Dämmung quer zur Verlegerichtung der Paneele auslegen – dann liegen die Stöße nie übereinander.',
        fehler: 'Doppelte Dämmung unter Vinyl mit integrierter Dämmung: Der Boden wird zu weich, die Verbindungen brechen.' },
      { t: 'Erste Reihe verlegen', min: 40,
        x: 'Verlegerichtung: längs zum Lichteinfall. Erste Reihe mit der Federseite zur Wand – die Feder dort absägen. Abstandskeile setzen: Laminat und Parkett 8–10 mm, Vinyl nach Hersteller (meist 5 mm). Die erste Reihe schnurgerade ausrichten.',
        kniff: 'Wand vorher auf Geradheit prüfen. Krumme Wand? Die erste Reihe an einer Schnur ausrichten und die Paneele zur Wand hin anzeichnen und anpassen.',
        fehler: 'Erste Reihe nicht gerade: Ab der dritten Reihe klaffen Fugen.' },
      { t: 'Fläche verlegen', min: m => m.R.boden * 5,
        x: 'Reststück der ersten Reihe (mind. 30 cm, Herstellerangabe) beginnt die zweite. Längsseite im Winkel einklicken, Stirnseite mit Schlagklotz bzw. Klickmechanismus schließen. Stoßversatz von Reihe zu Reihe mindestens 30 cm. Um Heizungsrohre: Loch mit Rohrdurchmesser plus 2 × Dehnfuge bohren, Passstück ausschneiden und mit Leim wieder einsetzen.',
        kniff: 'Aus drei bis vier Paketen gleichzeitig mischen – so verteilen sich Farbunterschiede natürlich.',
        fehler: 'Direkt mit dem Hammer auf die Paneelkante geschlagen: Die Feder bricht, die Fuge bleibt offen.',
        sicher: 'Beim Sägen Schutzbrille und Gehörschutz; Knieschoner für die Knie.' },
      { t: 'Letzte Reihe und Türbereiche', min: m => 45 + (m.R.tueren.length || 0) * 15,
        x: 'Restbreite an mehreren Stellen messen, Dehnfuge abziehen, Paneele längs zuschneiden und mit dem Zugeisen einziehen. An Türen Übergangsprofile setzen – der Belag endet unter dem Türblatt mit Dehnfuge.',
        kniff: 'Die letzte Reihe auf die vorletzte legen, ein Reststück an die Wand halten und den Verlauf der Wand direkt übertragen.',
        fehler: 'Raumübergreifend ohne Dehnfuge im Türbereich durchverlegt: Die Fläche wird zu groß und wölbt sich.' },
      { t: 'Keile entfernen, Leisten montieren', min: 20,
        x: 'Abstandskeile herausnehmen. Die Dehnfuge bleibt frei – sie wird von der Sockelleiste verdeckt, die nur an der Wand befestigt wird (siehe „Sockelleisten montieren“).',
        kniff: 'Ein Reststück Paneel mit Datum und Produktnamen beschriften und aufbewahren.',
        fehler: 'Sockelleiste auf den Boden geschraubt oder geklebt: Der Boden kann nicht mehr „schwimmen“.' }
    ],
    sicherheit: ['Sägen: Schutzbrille und Gehörschutz, Paneele fest einspannen.', 'Knieschoner bei längerer Arbeit am Boden.'],
    grenzen: ['Alte Floor-Flex-Platten, Cushion-Vinyl mit grauer Rückseite oder schwarzer Bitumenkleber (Häuser vor 1993) – Asbestverdacht.', 'Feuchter oder neuer Estrich (Restfeuchte unklar) – CM-Messung durch Fachbetrieb.', 'Verlegen über Bewegungsfugen im Estrich oder in Räumen mit Bodenabläufen.'],
    rot: (m, o) => o.alt === 'flex' ? 'Kleine Kunststoffplatten (Floor-Flex) und schwarze Kleber in älteren Häusern stehen unter Asbestverdacht. Bitte nicht selbst entfernen – Materialprobe bzw. Fachbetrieb mit Sachkunde nach TRGS 519.' : '',
    asbest: ASBEST_BODEN
  },
  /* ======================================================================= */
  {
    id: 'sockelleisten', bereich: 'boden', titel: 'Sockelleisten montieren', schwierigkeit: 1,
    kurz: 'Sockelleisten mit sauberen Gehrungen – mit Stücklisten je Wand und Clip-Rechnung.',
    schlagworte: ['sockelleiste', 'sockelleisten', 'fussleiste', 'fussleisten', 'leisten', 'scheuerleiste', 'bodenleiste', 'leisten montieren', 'abschlussleiste'],
    aufnahme: { art: 'raum', hoehe: false, oeffnungen: 'tueren' },
    optionen: [
      { id: 'laenge', label: 'Leistenlänge', typ: 'wahl', std: '2.4', werte: [['2.4', '2,40 m'], ['2.5', '2,50 m'], ['2', '2,00 m']] },
      { id: 'befestigung', label: 'Befestigung', typ: 'wahl', std: 'clips', werte: [['clips', 'Montageclips (Leiste abnehmbar)'], ['kleber', 'Montagekleber'], ['schrauben', 'Schrauben und Dübel']] },
      { id: 'ecken', label: 'Ecken', typ: 'wahl', std: 'gehrung', werte: [['gehrung', 'Auf Gehrung sägen'], ['formteile', 'Eck- und Endstücke (Formteile)']] },
      { id: 'acryl', label: 'Fuge zur Wand mit Acryl schließen (weiße/lackierte Leisten)', typ: 'ja', std: false }
    ],
    material(m, o) {
      const R1 = m.R, l = []; const len = +o.laenge || 2.4;
      const s = leistenStueck(R1, len); const lm = R1.sockel;
      const stk = Math.max(s.stueck, Math.ceil(lm * 1.08 / len));
      l.push(P('Sockelleisten', 'boden', stk, 'Stk.', { detail: `à ${z(len)} m`, rechnung: [`Umfang ${z(R1.umfang)} m − Türbreiten ${z(R1.tuerBreiten)} m = ${z(lm)} m`, ...s.zeilen, `Jede Wand wird für sich gestückelt (Gehrung braucht ganze Längen): ${s.stueck} Leisten`, `Gegenprobe nach Länge + 8 %: ${Math.ceil(lm * 1.08 / len)} Leisten → ${stk}`] }));
      if (o.befestigung === 'clips') { const c = Math.ceil(lm / 0.5) + stk; const g = R.gebinde(c, [20, 50, 100], 'Stk.'); l.push(P('Montageclips mit Schrauben und Dübeln (zur Leiste passend)', 'boden', g.stueck, 'Pack.', { detail: g.text, rechnung: [`Alle 50 cm ein Clip: ${z(lm)} m ÷ 0,5 = ${Math.ceil(lm / 0.5)}`, `+ 1 je Leistenende: ${stk} → ${c} Clips`, `Packungen: ${g.text}`] })); }
      if (o.befestigung === 'kleber') { const k = Math.max(1, Math.ceil(lm / 10)); l.push(P('Montagekleber (Kartusche 290–310 ml)', 'eisen', k, 'Kartusche', { rechnung: [`Raupe ca. 6 mm, eine Kartusche reicht für etwa 10 m Leiste: ${z(lm)} m ÷ 10 → ${k}`] })); }
      if (o.befestigung === 'schrauben') { const n = Math.ceil(lm / 0.5) + stk; const g = R.gebinde(n, [25, 50, 100], 'Stk.'); l.push(P('Schrauben 4 × 50 mm mit Dübeln 6 mm', 'eisen', g.stueck, 'Pack.', { detail: g.text, rechnung: [`Alle 50 cm + je Leistenende 1: ${n} Stück → ${g.text}`] })); }
      if (o.ecken === 'formteile') {
        const tue = R1.tueren.length;
        l.push(P('Innenecken (Formteile)', 'boden', 4, 'Stk.', { rechnung: ['Rechteckiger Raum: 4 Innenecken'] }));
        if (tue) l.push(P('Endkappen links/rechts', 'boden', tue * 2, 'Stk.', { rechnung: [`Je Tür 2 Endkappen: ${tue * 2}`] }));
      }
      if (o.acryl) { const k = Math.max(1, Math.ceil(lm / 15)); l.push(P('Maleracryl weiß (Kartusche)', 'farbe', k, 'Kartusche', { rechnung: [`Feine Fuge zur Wand, ca. 15 m je Kartusche: ${z(lm)} m → ${k}`] })); }
      l.push(...schutz('brille', 'knie'));
      return l;
    },
    werkzeug: o => ['zollstock', 'bleistift', 'kappsaege', 'handsaege', 'leitungssucher', ...(o && o.befestigung === 'kleber' ? ['kartuschenpistole'] : ['bohrmaschine', 'akkuschrauber']), ...(o && o.acryl ? ['kartuschenpistole', 'fugenglaetter'] : [])],
    schritte: [
      { t: 'Leisten akklimatisieren und sortieren', min: 15, warten: 1440, wartenText: 'Leisten 24 h im Raum lagern', parallel: true,
        x: 'Leisten im Raum lagern. Gerade Stücke für lange, gut sichtbare Wände reservieren, leicht verzogene für kurze Stücke.',
        kniff: 'Leisten vorher kurz an die Wand halten und die passende Länge mit Bleistift auf der Rückseite notieren.',
        fehler: 'Krumme Leiste für die längste Wand verwendet: Sie steht später überall ab.' },
      { t: 'Leitungen prüfen und Befestigungspunkte anzeichnen', nachParallel: true, min: m => 10 + m.R.sockel * 0.8,
        x: 'Mit dem Leitungssucher die unteren 20 cm der Wand absuchen – dort liegen oft Kabel zu Steckdosen. Bei Clips: alle 50 cm und 5 cm vor jedem Leistenende eine Markierung, bei Schrauben ebenso.',
        kniff: 'Bei Steckdosen knapp über dem Boden nie senkrecht darunter bohren.',
        fehler: 'Clips zu weit auseinander: Die Leiste liegt in Wellen an der Wand.',
        sicher: 'Nicht in der Nähe von Leitungen bohren.' },
      { t: 'Gehrungen sägen', min: m => 20 + 4 * 8 + (m.R.tueren.length || 0) * 5,
        x: 'Innenecken: Leisten auf 45° gegengleich sägen. Außenecken ebenso, nur andersherum. Längenmaß immer an der Wandseite der Leiste nehmen. Lange Wände: Stoß ebenfalls auf 45° überlappend sägen.',
        kniff: 'Zwei kurze Probestücke mit Gehrung sägen und an die Ecke halten – Wände haben selten genau 90°.',
        fehler: 'Gehrung falsch herum gesägt – Leisten vor dem Sägen immer in Einbaulage auf die Säge legen.',
        sicher: 'Kappsäge: Hände mindestens 15 cm vom Sägeblatt, Werkstück festhalten bzw. einspannen.' },
      { t: 'Leisten befestigen', min: (m, o) => m.R.sockel * (o.befestigung === 'kleber' ? 2.5 : 4),
        x: 'Clips montieren und die Leisten aufdrücken bzw. Kleber in Schlangenlinie auf die Rückseite und andrücken bzw. verschrauben. Die Leiste wird nur an der Wand befestigt, nie am Boden. Unten bleibt ein Hauch Luft zum Belag.',
        kniff: 'Bei Kleber Malerkrepp als Halteband nutzen, bis der Kleber angezogen hat.',
        fehler: 'Leiste fest auf schwimmenden Boden gedrückt und verklebt: Der Boden knackt und wölbt sich.' },
      { t: 'Fugen schließen und Enden', min: (m, o) => o.acryl ? 20 + m.R.sockel * 1 : 15, warten: 0,
        x: 'Endkappen an Türen setzen. Bei weißen Leisten die Fuge zur Wand mit Acryl schließen und glätten.',
        kniff: 'Acryl mit nassem Finger oder Fugenglätter in einem Zug abziehen, Überschuss sofort mit feuchtem Tuch nehmen.',
        fehler: 'Holz- oder Dekorleisten mit Acryl verfugt – das sieht man. Acryl nur bei überstreichbaren, weißen Leisten.' }
    ],
    sicherheit: ['Kappsäge: Schutzbrille, Werkstück sicher halten.', 'Leitungssucher vor jedem Bohren in Bodennähe.'],
    grenzen: ['Leitungen oder Dosen im Sockelbereich versetzen – Arbeit an 230 V.']
  },
  /* ======================================================================= */
  {
    id: 'silikon', bereich: 'sanitaer', titel: 'Silikonfugen erneuern', schwierigkeit: 2,
    kurz: 'Schimmelige oder undichte Silikonfugen an Wanne, Dusche und Waschbecken sauber und dauerhaft neu machen.',
    schlagworte: ['silikon', 'silikonfuge', 'silikonfugen', 'fuge dusche', 'fuge badewanne', 'wanne abdichten', 'dusche abdichten', 'fuge schimmel', 'schwarze fuge', 'acryl', 'dichtfuge', 'fuge erneuern', 'silikon erneuern', 'silikon wechseln'],
    aufnahme: { art: 'werte', felder: [
      { id: 'laenge', label: 'Länge aller Fugen zusammen', einheit: 'm', std: 6, max: 60, min: 0.3, hilfe: 'Beispiel Badewanne 170 × 75 cm an zwei Wänden: 1,70 + 0,75 = 2,45 m, plus Ecken senkrecht.' },
      { id: 'breite', label: 'Fugenbreite', einheit: 'mm', std: 7, max: 20, min: 3 }
    ] },
    optionen: [
      { id: 'ort', label: 'Wo?', typ: 'wahl', std: 'wanne', werte: [['wanne', 'Badewanne'], ['dusche', 'Dusche / Duschtasse'], ['becken', 'Waschbecken / WC'], ['kueche', 'Küchenarbeitsplatte'], ['boden', 'Boden–Wand-Anschluss']] },
      { id: 'stein', label: 'Naturstein (Marmor, Granit, Kalkstein)', typ: 'ja', std: false },
      { id: 'tief', label: 'Fuge tiefer als 10 mm (Hinterfüllschnur nötig)', typ: 'ja', std: false }
    ],
    material(m, o) {
      const l = []; const q = silikonMm2(m.breite); const ml = m.laenge * q; const n = Math.max(1, Math.ceil(R.rund(ml / 300, 6)));
      l.push(P(o.stein ? 'Naturstein-Silikon (neutral vernetzend, Kartusche 300 ml)' : 'Sanitär-Silikon mit Fungizid (Kartusche 300 ml) in Fugenfarbe', 'sanitaer', n, 'Kartusche', { rechnung: [`Querschnitt bei ${z(m.breite)} mm Breite ca. ${z(m.breite)} × ${z(m.breite)} × 0,7 + 25 % Verlust = ${z(q, 0)} mm²`, `${z(m.laenge)} m × ${z(q, 0)} mm² = ${z(ml, 0)} ml`, `÷ 300 ml je Kartusche → ${n} Kartusche(n) (reicht für ca. ${z(300 / q, 1)} m)`] }));
      l.push(P('Silikonentferner (Gel, ca. 80–100 ml)', 'sanitaer', 1, 'Tube', { rechnung: ['Löst Silikonreste nach dem Herausschneiden – Einwirkzeit laut Tube.'] }));
      l.push(P('Isopropanol oder Spiritus zum Entfetten', 'sonstiges', 1, 'Fl.'));
      l.push(P('Glättmittel für Silikon (oder Wasser mit einem Tropfen Spülmittel)', 'sanitaer', 1, 'Fl.', { optional: true }));
      l.push(krepp(m.laenge * 2, 'Beidseitig abkleben'));
      if (o.tief) { const r = Math.ceil(m.laenge * 1.1); l.push(P('Hinterfüllschnur (Rundschnur PE, Ø etwas größer als die Fuge)', 'sanitaer', r, 'm', { rechnung: [`Fugenlänge ${z(m.laenge)} m + 10 % = ${z(m.laenge * 1.1)} m`] })); }
      l.push(P('Ersatz-Kartuschenspitzen', 'sanitaer', 1, 'Pack.', { optional: true }));
      l.push(...schutz('handschuhe'));
      return l;
    },
    werkzeug: ['silikonentferner', 'cutter', 'kartuschenpistole', 'fugenglaetter', 'schwamm', 'spruehflasche', 'akkusauger'],
    schritte: [
      { t: 'Alte Fuge herausschneiden', min: m => 10 + m.laenge * 5,
        x: 'Mit dem Cutter die alte Fuge an beiden Flanken (Fliese und Wanne) entlang einschneiden und als Strang herausziehen. Reste mit dem Silikon-Entfernungswerkzeug abschaben.',
        kniff: 'Kunststoffschaber statt Metall auf Acrylwannen und Duschtassen – die Oberfläche verkratzt sonst.',
        fehler: 'Neues Silikon auf alte Reste: Es haftet nicht, unter der Fuge wächst der Schimmel weiter.',
        sicher: 'Klinge immer vom Körper weg führen. Emaillierte Wannen nicht mit der Klinge anritzen.' },
      { t: 'Reste lösen und entfetten', min: m => 10 + m.laenge * 2, warten: 60, wartenText: 'Silikonentferner einwirken lassen, dann vollständig trocknen', timer: 30,
        x: 'Silikonentferner auf hartnäckige Reste auftragen, nach Einwirkzeit abschaben. Fugenflanken gründlich mit Isopropanol oder Spiritus entfetten. Schimmel im Fugengrund mit Ethanol 70 % behandeln. Die Fuge muss vollständig trocken sein.',
        kniff: 'Mit dem Föhn auf kleiner Stufe nachtrocknen – Feuchtigkeit im Fugengrund ist der häufigste Grund für schlechte Haftung.',
        fehler: 'Auf feuchte Flanken gespritzt: Die Fuge löst sich nach Wochen ab.' },
      { t: 'Wanne belasten und abkleben', min: m => 10 + m.laenge * 3,
        x: 'Badewanne oder Duschtasse vor dem Verfugen mit Wasser füllen bzw. beschweren – so senkt sie sich wie im Gebrauch und die Fuge wird nicht später gedehnt. Beidseitig Kreppband im Abstand der gewünschten Fugenbreite kleben.',
        kniff: 'Bei Duschtassen einen Eimer Wasser hineinstellen und selbst hineinsetzen, während der Partner verfugt.',
        fehler: 'Leere Wanne verfugt: Beim ersten Bad reißt die Fuge an der Wanne ab.' },
      { t: 'Hinterfüllschnur einlegen', wenn: (m, o) => !!o.tief, min: m => 5 + m.laenge * 1,
        x: 'Bei tiefen Fugen die Rundschnur gleichmäßig eindrücken, sodass die Fuge nur noch etwa so tief wie breit ist. Silikon haftet dann nur an den zwei Flanken – so kann die Fuge sich dehnen.',
        kniff: 'Die Schnur mit einem stumpfen Holzspatel eindrücken, nicht mit dem Cutter – sie darf nicht verletzt werden.',
        fehler: 'Fuge mit Silikon „vollgestopft“: Sie haftet an drei Seiten und reißt.' },
      { t: 'Silikon einspritzen und glätten', min: m => 10 + m.laenge * 3,
        x: 'Kartuschenspitze schräg auf Fugenbreite abschneiden. Silikon in einem Zug mit gleichmäßigem Druck einspritzen, die Spitze leicht geneigt in die Fuge drücken. Sofort mit Glättmittel einsprühen und mit dem Fugenglätter in einem Zug abziehen. Überschuss vom Glätter abwischen.',
        kniff: 'Die Kartuschenpistole ziehen, nicht schieben – dann füllt das Silikon die Fuge von hinten satt.',
        fehler: 'Mehrmals über die Fuge gestrichen: Sie wird unruhig und Hautbildung reißt auf.',
        sicher: 'Gut lüften – Sanitärsilikon riecht beim Aushärten nach Essig.' },
      { t: 'Kreppband abziehen', min: 5, warten: 1440, wartenText: 'Aushärten: 24 h nicht nass machen (ca. 2 mm pro Tag)',
        x: 'Kreppband sofort nach dem Glätten abziehen, solange das Silikon noch keine Haut hat – im spitzen Winkel von der Fuge weg. Wasser in der Wanne erst nach dem Aushärten ablassen.',
        kniff: 'Band zu einer Rolle aufwickeln, damit die Silikonseite nirgends ankommt.',
        fehler: 'Krepp nach Hautbildung abgezogen: Die Kante reißt aus.' }
    ],
    sicherheit: ['Cuttermesser vom Körper weg führen.', 'Lüften beim Verarbeiten und Aushärten.', 'Bei Schimmel Handschuhe tragen, Reste in Beutel und Restmüll.'],
    grenzen: ['Wasser ist bereits hinter die Fuge gelaufen (Flecken, aufgequollene Wände, Geruch in Nachbarräumen) – Abdichtung prüfen lassen.', 'Fuge an bodengleicher Dusche mit Dichtband: Die Abdichtungsebene darunter nicht beschädigen.'],
    wartung: { monate: 12, text: 'Silikonfugen in Bad und Küche prüfen (Risse, Ablösung, Schimmel)' }
  },
  /* ======================================================================= */
  {
    id: 'perlator', bereich: 'sanitaer', titel: 'Wasserhahn entkalken / Perlator wechseln', schwierigkeit: 1,
    kurz: 'Spritzender, schwacher Wasserstrahl? Strahlregler entkalken oder tauschen – in zehn Minuten erledigt.',
    schlagworte: ['perlator', 'strahlregler', 'wasserhahn', 'wasserhahn spritzt', 'wasserhahn kalk', 'entkalken', 'kalk', 'armatur', 'mischbatterie', 'luftsprudler', 'duschkopf entkalken', 'brause'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl Wasserhähne', einheit: 'Stück', std: 3, max: 20, ganz: true }, { id: 'brausen', label: 'Duschköpfe / Handbrausen mit entkalken', einheit: 'Stück', std: 1, max: 10, ganz: true, pflicht: false }] },
    optionen: [
      { id: 'gewinde', label: 'Gewinde am Hahnende', typ: 'wahl', std: 'unbekannt', werte: [['aussen', 'Außengewinde am Perlator – M24 × 1 (häufig)'], ['innen', 'Innengewinde am Perlator – M22 × 1'], ['cache', 'Verdeckt (Cache), nur mit Schlüssel'], ['unbekannt', 'Weiß ich nicht – alten Perlator mitnehmen']] },
      { id: 'tauschen', label: 'Perlatoren gleich tauschen', typ: 'ja', std: true }
    ],
    material(m, o) {
      const l = [];
      const name = { aussen: 'Strahlregler M24 × 1 (Außengewinde)', innen: 'Strahlregler M22 × 1 (Innengewinde)', cache: 'Cache-Strahlregler (gleicher Typ/Größe wie alter)', unbekannt: 'Strahlregler (alten zum Vergleich mitnehmen)' }[o.gewinde];
      if (o.tauschen) l.push(P(name, 'sanitaer', m.anzahl, 'Stk.', { rechnung: ['Je Wasserhahn einer. Durchflussklasse beachten: Spar-Perlatoren (z. B. 5–6 l/min) am Waschbecken, Standard an der Küchenspüle.'] }));
      l.push(P('Zitronensäure (Pulver) oder Entkalker ohne Salzsäure', 'reinigung', 1, 'Pack.', { rechnung: ['2–3 Esslöffel auf 0,5 l kaltes bis lauwarmes Wasser. Nicht heiß ansetzen – sonst bildet sich schwer lösliches Kalziumcitrat.'] }));
      l.push(P('Gummidichtungen für Strahlregler (Ersatz)', 'sanitaer', 1, 'Pack.', { optional: true }));
      l.push(P('Mikrofasertuch', 'reinigung', 1, 'Stk.', { optional: true }));
      return l;
    },
    werkzeug: o => ['zange', 'schwamm', 'eimer', ...(o && o.gewinde === 'cache' ? ['perlatorschluessel'] : [])],
    schritte: [
      { t: 'Strahlregler abschrauben', min: m => 3 + (m.anzahl || 1) * 3,
        x: 'Perlator von Hand gegen den Uhrzeigersinn (von unten gesehen) abdrehen. Sitzt er fest: Tuch darumwickeln und vorsichtig mit der Wasserpumpenzange lösen. Verdeckte Cache-Regler nur mit passendem Schlüssel.',
        kniff: 'Den Abfluss vorher mit einem Stöpsel oder Tuch verschließen – kleine Siebe und Dichtungen fallen gern hinein.',
        fehler: 'Zange ohne Tuch angesetzt: Die Chromoberfläche ist dauerhaft zerkratzt.' },
      { t: 'In Entkalker einlegen', min: 5, warten: 45, wartenText: 'Einwirken lassen (30–60 min)', timer: 45,
        x: 'Strahlregler, Siebe und Duschkopf (abgeschraubt) in die Zitronensäurelösung legen. Feststehende Duschköpfe: Gefrierbeutel mit Lösung darüberstülpen und mit Gummiband befestigen.',
        kniff: 'Die Einzelteile des Perlators in der Reihenfolge auf ein Tuch legen, wie sie herauskommen – dann klappt der Zusammenbau sicher.',
        fehler: 'Essigessenz pur und heiß: Gummidichtungen werden spröde, vergoldete oder Messing-Oberflächen fleckig.' },
      { t: 'Ausspülen und Armatur reinigen', min: m => 5 + (m.anzahl || 1) * 3,
        x: 'Teile mit klarem Wasser abspülen, Reste mit alter Zahnbürste lösen. Armatur außen mit einem in Lösung getränkten Tuch abwischen und nachspülen.',
        kniff: 'Die Gumminoppen am Duschkopf mit dem Daumen „durchrubbeln“ – so platzt der Kalk ab.',
        fehler: 'Scheuermilch oder Stahlwolle: Kratzer, in denen sich Kalk noch schneller festsetzt.' },
      { t: 'Einsetzen oder tauschen und testen', min: m => 3 + (m.anzahl || 1) * 2,
        x: 'Dichtung prüfen, Strahlregler bzw. neuen Perlator handfest aufschrauben. Wasser aufdrehen: Der Strahl muss gleichmäßig und ohne Seitenspritzer laufen; am Gewinde darf nichts tropfen.',
        kniff: 'Beim Kauf auf die Wassermenge achten: Spar-Perlatoren sparen am Waschbecken spürbar Wasser und Energie.',
        fehler: 'Mit der Zange festgezogen: Die Dichtung quetscht sich, der Perlator lässt sich nächstes Mal kaum lösen.' }
    ],
    sicherheit: ['Entkalker nicht mit chlorhaltigen Reinigern mischen.', 'Bei Spritzern in die Augen sofort gründlich mit Wasser ausspülen.'],
    grenzen: ['Armatur tropft am Hebel oder unter dem Becken (Kartusche oder Anschlussschläuche defekt) – Sanitärfachbetrieb, wenn Sie nicht sicher sind.'],
    wartung: { monate: 3, text: 'Perlatoren und Duschköpfe entkalken' }
  },
  /* ======================================================================= */
  {
    id: 'abfluss', bereich: 'sanitaer', titel: 'Abfluss frei machen / Siphon reinigen', schwierigkeit: 1,
    kurz: 'Verstopftes Waschbecken, langsame Dusche? Ohne scharfe Chemie wieder frei – mit Pömpel, Siphon und Spirale.',
    schlagworte: ['abfluss', 'abfluss verstopft', 'verstopft', 'siphon', 'geruchsverschluss', 'waschbecken verstopft', 'dusche laeuft nicht ab', 'abfluss stinkt', 'rohr verstopft', 'abfluss frei', 'spuele verstopft', 'abfluss langsam'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl betroffener Abläufe', einheit: 'Stück', std: 1, max: 6, ganz: true }] },
    optionen: [
      { id: 'ort', label: 'Wo?', typ: 'wahl', std: 'waschbecken', werte: [['waschbecken', 'Waschbecken'], ['kueche', 'Küchenspüle'], ['dusche', 'Dusche'], ['wanne', 'Badewanne']] },
      { id: 'mehrere', label: 'Mehrere Abläufe gleichzeitig betroffen, WC gluckert oder Wasser steigt im Keller', typ: 'ja', std: false },
      { id: 'chemie', label: 'Es wurde schon chemischer Rohrreiniger hineingekippt', typ: 'ja', std: false }
    ],
    material(m, o) {
      const l = [];
      l.push(P('Siphon-Dichtungssatz (Ersatz-Dichtungen 32 mm bzw. 40 mm)', 'sanitaer', m.anzahl, 'Satz', { optional: true, rechnung: ['Alte Dichtungen sind oft spröde – beim Öffnen gleich tauschen. Größe: Waschbecken meist 1 1/4" (32 mm), Spüle 1 1/2" (40 mm).'] }));
      l.push(P('Haarsieb / Abflusssieb', 'sanitaer', m.anzahl, 'Stk.', { optional: true, rechnung: ['Verhindert die nächste Verstopfung durch Haare.'] }));
      l.push(P('Gummihandschuhe (lang)', 'schutz', 1, 'Paar'));
      if (o.chemie) l.push(P('Schutzbrille', 'schutz', 1, 'Stk.', { rechnung: ['Chemischer Rohrreiniger ist stark ätzend – Spritzer beim Öffnen!'] }));
      return l;
    },
    werkzeug: o => ['poempel', 'schuessel', 'zange', 'lampe', ...(o && (o.ort === 'dusche' || o.ort === 'wanne') ? ['spirale'] : ['spirale'])],
    schritte: [
      { t: 'Pömpel einsetzen', min: 10,
        x: 'Etwas Wasser im Becken stehen lassen. Überlauföffnung mit einem nassen Lappen fest zuhalten. Saugglocke auf den Ablauf setzen und kräftig 10–15 Mal pumpen, dann ruckartig abziehen.',
        kniff: 'Den Rand der Saugglocke mit etwas Vaseline oder Wasser abdichten – dann wirkt der Unterdruck besser.',
        fehler: 'Überlauf offen gelassen: Die ganze Kraft entweicht dort, im Rohr passiert nichts.',
        sicher: 'Wurde vorher chemischer Rohrreiniger verwendet: nicht pümpeln – ätzende Spritzer! Erst viel Wasser nachlaufen lassen bzw. gar nicht selbst öffnen.' },
      { t: 'Siphon abschrauben und reinigen', wenn: (m, o) => o.ort === 'waschbecken' || o.ort === 'kueche', min: m => 15 + (m.anzahl || 1) * 10,
        x: 'Schüssel unter den Siphon stellen. Überwurfmuttern von Hand lösen (notfalls Tuch und Zange), Siphon abnehmen und auskippen. Siphon und Tauchrohr mit Bürste und heißem Wasser reinigen. Dichtungen prüfen.',
        kniff: 'Vorher ein Foto vom Siphon machen – so wissen Sie beim Zusammenbau, wie alles saß.',
        fehler: 'Muttern mit der Zange fest angeknallt: Kunststoffgewinde reißt, der Siphon tropft.' },
      { t: 'Duschablauf reinigen', wenn: (m, o) => o.ort === 'dusche' || o.ort === 'wanne', min: m => 15 + (m.anzahl || 1) * 10,
        x: 'Abdeckung des Duschablaufs abnehmen, Geruchsverschluss (Einsatz) herausziehen bzw. herausdrehen und Haare und Seifenreste entfernen. Bei Wannen den Stöpsel bzw. die Ablaufgarnitur herausnehmen.',
        kniff: 'Ein billiger Kunststoff-Haarentferner mit Widerhaken („Abflussreiniger-Stab“) holt Haarknäuel aus dem Ablauf.',
        fehler: 'Geruchsverschluss nicht wieder eingesetzt: Kanalgeruch im Bad.' },
      { t: 'Rohr mit der Spirale frei machen', min: 20,
        x: 'Sitzt die Verstopfung weiter hinten: Spirale ins Rohr einführen, unter Drehen vorschieben, bis Widerstand kommt, und mit Drehbewegung durch die Verstopfung arbeiten. Zurückziehen und reinigen.',
        kniff: 'Die Spirale beim Zurückziehen weiter drehen – so bleibt der Haarknäuel am Kopf hängen.',
        fehler: 'Spirale mit Gewalt gegen Rohrbögen gedrückt: Bei dünnen Kunststoffrohren können Muffen auseinandergehen.' },
      { t: 'Zusammenbauen und Dichtheit prüfen', min: 10,
        x: 'Siphon mit Dichtungen wieder montieren, Muttern handfest anziehen. Becken voll laufen lassen, Stöpsel ziehen und mit einem Küchentuch unter allen Verbindungen prüfen, ob es tropft. Heißes Wasser nachspülen.',
        kniff: 'Haarsieb einlegen – der beste Schutz vor der nächsten Verstopfung.',
        fehler: 'Nur mit wenig Wasser getestet: Undichtigkeiten zeigen sich erst bei vollem Durchfluss.' }
    ],
    sicherheit: ['Keine verschiedenen Rohrreiniger mischen und keine Chemie mit dem Pömpel kombinieren.', 'Chemischer Rohrreiniger ist ätzend: Schutzbrille und Handschuhe.', 'Abwasser enthält Keime – Handschuhe tragen, danach Hände waschen.'],
    grenzen: ['Mehrere Abläufe gleichzeitig verstopft, WC gluckert oder Wasser steigt im Keller hoch: Die Verstopfung sitzt in der Grund- oder Fallleitung – Rohrreinigungsfachbetrieb.', 'Abfluss stinkt dauerhaft trotz sauberem Siphon (Entlüftung, Rückstauverschluss) – Sanitärfachbetrieb.'],
    rot: (m, o) => o.mehrere ? 'Sind mehrere Abläufe gleichzeitig betroffen, sitzt die Verstopfung in der Fall- oder Grundleitung. Das ist ein Fall für einen Rohrreinigungsfachbetrieb – bitte nicht weiter pümpeln (Rückstau).' : '',
    wartung: { monate: 6, text: 'Siphons und Duschabläufe reinigen (Haare, Fett)' }
  },
  /* ======================================================================= */
  {
    id: 'spuelkasten', bereich: 'sanitaer', titel: 'WC-Spülkasten läuft nach', schwierigkeit: 2,
    kurz: 'Ständig rinnendes Wasser in der Toilette kostet viel Geld – Fehler finden und Dichtung oder Füllventil richten.',
    schlagworte: ['spuelkasten', 'wc laeuft', 'toilette laeuft', 'klo laeuft', 'wc spuelung', 'spuelung laeuft nach', 'wasser laeuft nach', 'toilette rinnt', 'wc dichtung', 'fuellventil', 'spuelkasten undicht', 'klo spuelung'],
    aufnahme: { art: 'keine' },
    optionen: [
      { id: 'bauart', label: 'Bauart', typ: 'wahl', std: 'unterputz', werte: [['unterputz', 'Unterputz (in der Wand, Drückerplatte)'], ['aufputz', 'Aufputz (sichtbarer Kasten über dem WC)']] },
      { id: 'fehler', label: 'Was passiert?', typ: 'wahl', std: 'rinnt', werte: [['rinnt', 'Wasser rinnt ständig in die Schüssel'], ['fuellt', 'Kasten füllt dauernd nach (zischt)'], ['aussen', 'Wasser tropft außen / läuft in die Wand']] }
    ],
    material(m, o) {
      const l = [];
      l.push(P('Dichtung für das Ablaufventil (Typ des Spülkastens – Foto mitnehmen)', 'sanitaer', 1, 'Stk.', { rechnung: ['Hersteller und Typ stehen meist auf dem Ventil oder hinter der Drückerplatte. Foto vom Ventil mitnehmen.'] }));
      l.push(P('Füllventil (Universal oder Original-Ersatzteil)', 'sanitaer', 1, 'Stk.', { optional: o.fehler !== 'fuellt' }));
      l.push(P('Zitronensäure oder Entkalker', 'reinigung', 1, 'Pack.', { optional: true }));
      l.push(P('Lebensmittelfarbe (für den Dichtheitstest)', 'sonstiges', 1, 'Stk.', { optional: true, rechnung: ['Alternative: trockenes Toilettenpapier an die Rückwand der Schüssel halten.'] }));
      l.push(P('Gummihandschuhe', 'schutz', 1, 'Paar'));
      return l;
    },
    werkzeug: ['schraubendreher', 'lampe', 'schwamm', 'eimer'],
    schritte: [
      { t: 'Test: Läuft wirklich Wasser nach?', min: 10, warten: 30, wartenText: 'Farbtest einwirken lassen (30 min, nicht spülen)', timer: 30,
        x: 'Bei Aufputz-Kästen ein paar Tropfen Lebensmittelfarbe in den Kasten geben, bei Unterputz trockenes Toilettenpapier an die Rückwand der Schüssel halten. Färbt sich die Schüssel bzw. wird das Papier nass, läuft Wasser nach.',
        kniff: 'Wasserzähler-Test: Abends ablesen, nachts nichts zapfen, morgens wieder ablesen – jeder Liter mehr ist ein Leck.',
        fehler: 'Nachlaufen ignoriert: Ein rinnender Spülkasten kann viele Kubikmeter Wasser im Jahr verbrauchen.' },
      { t: 'Wasser abstellen und öffnen', min: 15,
        x: 'Eckventil des Spülkastens zudrehen (bei Unterputz hinter der Drückerplatte: Platte nach oben schieben oder abhebeln, Revisionsrahmen abschrauben). Einmal spülen, damit der Kasten leer ist.',
        kniff: 'Eckventile, die jahrelang nicht bewegt wurden, sitzen fest. Nicht mit Gewalt drehen – sonst lieber den Hauptwasserhahn schließen.',
        fehler: 'Eckventil mit der Zange zugewürgt: Es bricht ab, das Wasser lässt sich nicht mehr stoppen.',
        sicher: 'Wissen Sie vorher, wo der Hauptabsperrhahn sitzt – siehe „Mein Haus“.' },
      { t: 'Wasserstand prüfen', min: 10,
        x: 'Eckventil kurz öffnen und zusehen, wie der Kasten füllt. Läuft das Wasser über den Rand des Überlaufrohrs, schließt das Füllventil zu spät: Schwimmer bzw. Einstellschraube tiefer stellen. Steht der Wasserstand unter dem Überlauf und es rinnt trotzdem, ist die Dichtung am Ablaufventil undicht.',
        kniff: 'Mit dem Handy ein Video vom Füllvorgang machen – so sehen Sie in Ruhe, wo das Wasser hinläuft.',
        fehler: 'Gleich das Ablaufventil getauscht, obwohl das Füllventil überläuft.' },
      { t: 'Ablaufventil reinigen bzw. Dichtung tauschen', wenn: (m, o) => o.fehler === 'rinnt', min: 25,
        x: 'Ablaufventil (Glocke) nach Herstelleranleitung herausnehmen (meist drehen und nach oben ziehen). Dichtung unten am Ventil und den Sitz im Kasten von Kalk und Belag befreien. Ist die Dichtung hart, rissig oder verformt: tauschen.',
        kniff: 'Die Dichtung in Zitronensäurelösung legen und mit dem Daumen sauber reiben – oft ist sie danach wieder dicht.',
        fehler: 'Den Dichtsitz im Kasten vergessen: Neue Dichtung auf kalkigem Sitz ist sofort wieder undicht.' },
      { t: 'Füllventil einstellen oder tauschen', wenn: (m, o) => o.fehler === 'fuellt', min: 25,
        x: 'Füllventil an der Einstellschraube bzw. am Schwimmer so einstellen, dass das Wasser etwa 2 cm unter dem Überlaufrand stoppt. Schließt es nicht mehr dicht (zischt dauernd), das Sieb am Ventileingang reinigen bzw. das Füllventil tauschen.',
        kniff: 'Ein verschmutztes Eingangssieb ist oft die Ursache – erst reinigen, dann tauschen.',
        fehler: 'Füllventil zu hoch eingestellt: Wasser läuft ständig über den Überlauf ab.' },
      { t: 'Zusammenbauen und testen', min: 15,
        x: 'Alles einbauen, Eckventil öffnen, mehrfach spülen und den Test aus Schritt 1 wiederholen.',
        kniff: 'Spar- und Volltaste bei Unterputz-Kästen nach Anleitung einstellen (z. B. 3 l / 6 l).',
        fehler: 'Drückerplatte nicht richtig eingerastet: Die Stößel drücken dauerhaft und die Spülung läuft.' }
    ],
    sicherheit: ['Vor dem Arbeiten das Eckventil bzw. den Hauptwasserhahn schließen.', 'Keramik ist zerbrechlich – Kastendeckel sicher ablegen.'],
    grenzen: ['Wasser tritt außen aus oder läuft in die Wand bzw. Vorwand (feuchte Wand, Flecken unten) – Sanitärfachbetrieb, sonst drohen Folgeschäden.', 'Eckventil lässt sich nicht schließen oder tropft am Ventil.'],
    rot: (m, o) => o.fehler === 'aussen' ? 'Tritt Wasser außen aus oder läuft es in die Wand, drohen Feuchteschäden im Mauerwerk. Bitte Wasser abstellen und einen Sanitärfachbetrieb beauftragen.' : ''
  }
  );
})(typeof window !== 'undefined' ? window : globalThis);
