/* TW Renovierungs-App – Katalog-Erweiterung (Freigabe Thomas 02.11.2026), Teil 2:
   Türen & Fenster (4), Heizung (2), Elektro & Sicherheit (2), Außen & Garten (2), Haus-Checks (4).
   Schrittreihenfolge = Schlüssel der Schrittfotos in BILDER-PROMPTS.md. */
(function (root) {
  'use strict';
  const K = root.TW_KATALOG, R = root.TW_RECHNER, { P, schutz, krepp } = K;
  const z = R.zahl;
  const fugeMm2 = b => b * b * 0.7 * 1.25;

  K.arbeiten.push(
  /* ======================================================================= */
  {
    id: 'rollladengurt', bereich: 'tueren', titel: 'Rollladengurt wechseln', schwierigkeit: 2,
    kurz: 'Ausgefranster oder gerissener Gurt? Neuen Gurt an Welle und Gurtwickler montieren – mit Längenrechnung.',
    schlagworte: ['rollladen', 'rolladen', 'rollladengurt', 'rolladengurt', 'gurt gerissen', 'gurtwickler', 'rollladen klemmt', 'rollladen gurt wechseln', 'jalousie gurt', 'rollo gurt'],
    aufnahme: { art: 'werte', felder: [
      { id: 'anzahl', label: 'Anzahl Rollläden', einheit: 'Stück', std: 1, max: 30, ganz: true },
      { id: 'h', label: 'Fensterhöhe (lichte Höhe)', einheit: 'm', std: 1.35, max: 3, min: 0.4 }
    ] },
    optionen: [
      { id: 'breite', label: 'Gurtbreite', typ: 'wahl', std: '23', werte: [['23', '23 mm (Standard)'], ['14', '14 mm (Mini)']] },
      { id: 'wickler', label: 'Gurtwickler auch tauschen (Feder lahm, Gehäuse gebrochen)', typ: 'ja', std: false },
      { id: 'elektrisch', label: 'Der Rollladen hat einen Elektromotor', typ: 'ja', std: false }
    ],
    vorlauf: 'Gurtbreite am alten Gurt messen. Für Unterputz-Gurtwickler den Lochabstand der Abdeckplatte notieren.',
    material(m, o) {
      const l = [], g = R.gurtLaenge(m.h);
      l.push(P(`Rollladengurt ${o.breite || 23} mm, ${z(g.L || 12)} m`, 'eisen', m.anzahl, 'Stk.', { rechnung: [`Gurtbedarf je Rollladen: 2 × (Fensterhöhe ${z(m.h)} m + Kasten 0,30 m) + 0,50 m Reserve = ${z(g.bedarf)} m`, `→ handelsübliche Länge ${z(g.L || 12)} m (5 / 6 / 8 / 12 m), je Rollladen ein Gurt`, 'Der Gurtwickler muss diese Länge aufnehmen können (Angabe auf dem Wickler).'] }));
      if (o.wickler) l.push(P(`Unterputz-Gurtwickler für ${o.breite || 23}-mm-Gurt (Lochabstand wie alt)`, 'eisen', m.anzahl, 'Stk.'));
      l.push(P('Gurtklammer bzw. Ersatz-Schrauben für die Gurtscheibe', 'eisen', 1, 'Pack.', { optional: true }));
      l.push(P('Klebeband (Paketband)', 'eisen', 1, 'Rolle', { optional: true, rechnung: ['Zum Fixieren des Gurts, damit er nicht zurückschnellt.'] }));
      return l;
    },
    werkzeug: ['schraubendreher', 'leiter', 'schere', 'zange', 'lampe'],
    schritte: [
      { t: 'Rollladen herunterlassen und sichern', min: m => 5 + m.anzahl * 3,
        x: 'Rollladen ganz herunterlassen, damit die Welle entlastet ist. Ist der Gurt schon gerissen: Rollladen von Hand vorsichtig herunterschieben.',
        kniff: 'Den Rollladen unten mit einem Holzkeil oder Klebeband sichern, damit er nicht hochgezogen wird.',
        fehler: 'Bei hochgezogenem Rollladen gearbeitet: Der Panzer fällt beim Lösen des Gurts herunter.',
        sicher: 'Nicht unter einen ungesicherten Rollladen greifen.' },
      { t: 'Rollladenkasten öffnen', min: m => 5 + m.anzahl * 8,
        x: 'Revisionsdeckel des Rollladenkastens (innen über dem Fenster) abschrauben bzw. aushängen. Mit Taschenlampe Gurtscheibe und Gurtbefestigung an der Welle suchen.',
        kniff: 'Schrauben in einen Becher – bei alten Kästen sind sie oft unterschiedlich lang.',
        fehler: 'Deckel aufgehebelt: Bei alten Kästen bricht die Kante ab.' },
      { t: 'Gurtwickler abschrauben, alten Gurt entfernen', min: m => 5 + m.anzahl * 10,
        x: 'Abdeckplatte des Gurtwicklers abschrauben, Wickler herausziehen. Gurt mit einer Hand festhalten, ein paar Zentimeter herausziehen und mit einer Klammer sichern, damit die Feder nicht zurückschnellt. Alten Gurt an Welle und Wickler lösen.',
        kniff: 'Den Gurt nie loslassen, solange die Feder gespannt ist – sie schnellt mit großer Kraft zurück.',
        fehler: 'Feder entspannt sich unkontrolliert: Finger eingeklemmt, Wickler kaputt.',
        sicher: 'Die Feder im Gurtwickler steht unter Spannung – Gurt immer festhalten bzw. sichern.' },
      { t: 'Neuen Gurt an der Welle befestigen', min: m => 5 + m.anzahl * 8,
        x: 'Neuen Gurt durch die Gurtführung von unten nach oben führen und wie der alte an der Gurtscheibe befestigen (einhaken, Schlaufe oder Schraube). Den Gurt zwei- bis dreimal auf die Gurtscheibe wickeln.',
        kniff: 'Das Gurtende mit einem Feuerzeug kurz verschmelzen – dann franst es nicht aus.',
        fehler: 'Gurt verdreht eingeführt: Er läuft schief und scheuert.' },
      { t: 'Gurtwickler spannen und einfädeln', min: m => 5 + m.anzahl * 10,
        x: 'Gurtwickler je nach Bauart vorspannen (meist einige Umdrehungen gegen die Federrichtung), neuen Gurt einfädeln und befestigen. Wickler einsetzen und Abdeckplatte festschrauben.',
        kniff: 'So viel Vorspannung, dass der Gurt bei heruntergelassenem Rollladen straff, aber nicht stramm ist.',
        fehler: 'Zu wenig Vorspannung: Der Gurt hängt durch, wenn der Rollladen oben ist.' },
      { t: 'Testen und Kasten schließen', min: m => 5 + m.anzahl * 5,
        x: 'Rollladen mehrmals ganz hoch- und herunterlassen. Läuft der Gurt mittig auf der Scheibe und wickelt der Wickler sauber? Dann Revisionsdeckel schließen, ggf. Dichtband erneuern.',
        kniff: 'Bei der Gelegenheit den Kasten innen absaugen und die Dämmung im Kasten prüfen.',
        fehler: 'Deckel ohne Dichtung geschlossen: Es zieht kalt aus dem Kasten.' }
    ],
    sicherheit: ['Federspannung im Gurtwickler beachten – Gurt immer sichern.', 'Leiter standsicher, nicht aus dem Fenster lehnen.'],
    grenzen: ['Elektrisch betriebene Rollläden (Motor, Schalter, 230 V) – Elektro- bzw. Rollladenfachbetrieb.', 'Welle, Lager oder Panzer beschädigt, Rollladen hängt schief – Rollladenfachbetrieb.'],
    rot: (m, o) => o.elektrisch ? 'Rollläden mit Elektromotor werden über 230 V betrieben. Arbeiten an Motor, Schalter oder Endlagen bitte einem Elektro- bzw. Rollladenfachbetrieb überlassen.' : ''
  },
  /* ======================================================================= */
  {
    id: 'tuer-kuerzen', bereich: 'tueren', titel: 'Zimmertür kürzen (nach neuem Bodenbelag)', schwierigkeit: 3,
    kurz: 'Nach Laminat oder Teppich schleift die Tür? Kürzmaß berechnen, Tür sauber und splitterfrei kürzen.',
    schlagworte: ['tuer kuerzen', 'tuer schleift am boden', 'tuer zu lang', 'tuer absaegen', 'zimmertuer kuerzen', 'tuer unten kuerzen', 'tuer haengt am laminat', 'tuerblatt kuerzen'],
    aufnahme: { art: 'werte', felder: [
      { id: 'aufbau', label: 'Höhe neuer Belag inkl. Dämmung', einheit: 'mm', std: 10, max: 40, min: 1, hilfe: 'Z. B. Laminat 8 mm + Dämmung 2 mm = 10 mm.' },
      { id: 'luftAlt', label: 'Heutiger Spalt unter der Tür (über altem Boden)', einheit: 'mm', std: 7, max: 40, min: 0, pflicht: false },
      { id: 'luftNeu', label: 'Gewünschter Spalt (Luftzirkulation)', einheit: 'mm', std: 8, max: 20, min: 3 },
      { id: 'anzahl', label: 'Anzahl Türen', einheit: 'Stück', std: 1, max: 20, ganz: true }
    ] },
    optionen: [
      { id: 'tuerart', label: 'Türblatt', typ: 'wahl', std: 'roehre', werte: [['roehre', 'Röhrenspan bzw. Wabe (leicht, Standard)'], ['massiv', 'Massiv- oder Vollspantür (schwer)'], ['glas', 'Ganzglastür']] },
      { id: 'brandschutz', label: 'Brandschutz- oder Rauchschutztür (Schild im Falz)', typ: 'ja', std: false }
    ],
    material(m, o) {
      const k = R.tuerKuerzen(m.aufbau, m.luftAlt || 0, m.luftNeu), l = [];
      l.push(P('Malerkrepp (Splitterschutz an der Schnittlinie)', 'farbe', 1, 'Rolle', { rechnung: [`Kürzmaß = neuer Aufbau ${z(m.aufbau)} mm − heutiger Spalt ${z(m.luftAlt || 0)} mm + gewünschter Spalt ${z(m.luftNeu)} mm = ${z(k)} mm`, k > 20 ? 'Über 20 mm: bei Röhrenspantüren wird der untere Rahmen angeschnitten – siehe Hinweis.' : 'Bis ca. 20 mm bleibt der untere Rahmen einer Röhrenspantür meist ausreichend erhalten.'] }));
      l.push(P('Kantenschutz: farbloser Lack bzw. Kantenversiegelung (klein)', 'farbe', 1, 'Dose', { rechnung: ['Schnittkante versiegeln, damit sie keine Feuchte aufnimmt (Wischwasser).'] }));
      l.push(P('Schleifpapier Körnung 120', 'farbe', 1, 'Pack.'));
      l.push(...schutz('brille', 'gehoer', 'ffp2'));
      return l;
    },
    werkzeug: ['zollstock', 'bleistift', 'boecke', 'handkreissaege', 'schleifklotz', 'cutter', 'winkel'],
    schritte: [
      { t: 'Kürzmaß ermitteln', min: m => 5 + m.anzahl * 5,
        x: 'Ein Reststück des neuen Belags mit Dämmung unter die geschlossene Tür legen und den Spalt messen – oder mit dem Rechner der App. Das Kürzmaß an mehreren Stellen prüfen, der Boden ist selten ganz gerade.',
        kniff: 'Lieber 1–2 mm zu wenig kürzen und nachschleifen als zu viel – absägen lässt sich nicht rückgängig machen.',
        fehler: 'Nur an einer Stelle gemessen: Die Tür schleift auf der anderen Seite weiter.' },
      { t: 'Tür aushängen', min: m => 5 + m.anzahl * 5,
        x: 'Tür ganz öffnen und senkrecht nach oben aus den Bändern heben (zu zweit). Auf zwei Arbeitsböcke mit Decke legen. Türdrücker abschrauben.',
        kniff: 'Ein Keil unter dem Türblatt hilft als Hebel beim Aushängen.',
        fehler: 'Tür flach auf den Boden gelegt und dort gesägt – krumme Schnitte, zerkratzte Oberfläche.',
        sicher: 'Türblätter sind schwer – zu zweit, Füße weg.' },
      { t: 'Schnittlinie anzeichnen und abkleben', min: m => 5 + m.anzahl * 8,
        x: 'Kreppband entlang der Unterkante kleben und das Kürzmaß an beiden Enden anzeichnen, Linie durchziehen. Die Führungsschiene genau an die Linie legen. Das Klebeband verhindert Ausrisse der Oberfläche.',
        kniff: 'Die Oberfläche zusätzlich entlang der Linie mit dem Cutter anritzen – dann splittert die Beschichtung garantiert nicht.',
        fehler: 'Ohne Krepp und Anritzen gesägt: Die Dekorfolie reißt sichtbar aus.' },
      { t: 'Sägen', min: m => 5 + m.anzahl * 10,
        x: 'Mit der Handkreissäge an der Führungsschiene in einem gleichmäßigen Zug sägen, Sägeblatt mit feiner Zahnung. Gute Seite nach unten (die Säge reißt oben aus).',
        kniff: 'Zum Schluss nicht stoppen, sondern ruhig durchziehen – sonst bricht das Ende aus.',
        fehler: 'Ohne Führungsschiene „freihändig“ gesägt: schiefe Kante, sichtbarer Spalt.',
        sicher: 'Schutzbrille, Gehörschutz, Staubmaske. Werkstück fest auflegen, Kabel hinter der Säge führen.' },
      { t: 'Kante schleifen und versiegeln', min: m => 5 + m.anzahl * 8, warten: 120, wartenText: 'Versiegelung trocknen lassen',
        x: 'Schnittkante leicht entgraten und mit Kantenschutz bzw. farblosem Lack versiegeln. Bei Röhrenspantüren prüfen, ob der untere Rahmen noch geschlossen ist.',
        kniff: 'Ist der Rahmen angeschnitten, kann ein Holzstreifen eingeleimt werden – siehe Fachbetrieb-Hinweis.',
        fehler: 'Kante offen gelassen: Wischwasser zieht ein, die Tür quillt auf.' },
      { t: 'Wieder einhängen und prüfen', min: m => 5 + m.anzahl * 5,
        x: 'Tür einhängen, Drücker montieren, Spalt rundum prüfen. Die Tür soll ohne Schleifen schließen.',
        kniff: 'Siehe auch „Zimmertür einstellen“, falls sie jetzt oben oder seitlich streift.',
        fehler: 'Tür vor dem Trocknen der Versiegelung eingehängt und gleich geschlossen.' }
    ],
    sicherheit: ['Handkreissäge nur mit Führungsschiene und Schutzausrüstung.', 'Türen zu zweit aushängen.'],
    grenzen: ['Brandschutz- und Rauchschutztüren – die Zulassung erlischt beim Kürzen; nur Fachbetrieb.', 'Kürzmaß über ca. 20 mm bei Röhrenspantüren bzw. Ganzglastüren – Tischler bzw. Glaserei.'],
    rot: (m, o) => o.brandschutz ? 'Brand- und Rauchschutztüren dürfen nicht selbst gekürzt werden – die Zulassung erlischt. Bitte einen Fachbetrieb beauftragen.' : o.tuerart === 'glas' ? 'Ganzglastüren lassen sich nicht nachträglich kürzen – hier hilft nur eine Glaserei (neue Scheibe bzw. andere Beschläge).' : (R.tuerKuerzen(m.aufbau, m.luftAlt || 0, m.luftNeu) > 20 && o.tuerart === 'roehre' ? 'Beim Kürzen um mehr als 20 mm wird der untere Rahmen einer Röhrenspantür meist durchtrennt. Bitte einen Tischler beauftragen (Rahmenholz einsetzen) oder ein neues Türblatt verwenden.' : '')
  },
  /* ======================================================================= */
  {
    id: 'fensterbank-aussen', bereich: 'tueren', titel: 'Fensterbank und Fugen außen prüfen und erneuern', schwierigkeit: 2,
    kurz: 'Gerissene Fugen an der Außenfensterbank neu machen, bevor Regen in die Wand läuft – mit Dichtstoff-Rechnung.',
    schlagworte: ['fensterbank aussen', 'aussenfensterbank', 'fensterbank', 'fuge aussen', 'fensterbank undicht', 'regen am fenster', 'fensterbank riss', 'fassade fuge', 'laibung aussen'],
    aufnahme: { art: 'werte', felder: [
      { id: 'anzahl', label: 'Anzahl Fensterbänke', einheit: 'Stück', std: 4, max: 60, ganz: true },
      { id: 'tiefe', label: 'Ausladung der Fensterbank (Tiefe)', einheit: 'm', std: 0.2, max: 0.6, min: 0.05 },
      { id: 'hoehe', label: 'Höhe über dem Boden (höchste Fensterbank)', einheit: 'm', std: 1, max: 12, min: 0 }
    ] },
    optionen: [{ id: 'innen', label: 'Innen unter dem Fenster ist es feucht, fleckig oder schimmelt', typ: 'ja', std: false }, { id: 'material', label: 'Fensterbank', typ: 'wahl', std: 'alu', werte: [['alu', 'Aluminium mit seitlichen Endstücken'], ['stein', 'Naturstein, Klinker oder Beton']] }],
    material(m, o) {
      const l = [], lfm = m.anzahl * 2 * m.tiefe * 1.1, ml = lfm * fugeMm2(8), n = Math.max(1, Math.ceil(R.rund(ml / 310, 6)));
      l.push(P(o.material === 'stein' ? 'Naturstein- bzw. Fassaden-Dichtstoff (neutral vernetzend, überstreichbar, Kartusche 310 ml)' : 'Fassaden-Dichtstoff (Hybrid/MS-Polymer, haftet auf Alu und Putz, Kartusche 310 ml)', 'bau', n, 'Kartusche', { rechnung: [`Je Fensterbank zwei seitliche Anschlussfugen: ${m.anzahl} × 2 × ${z(m.tiefe)} m + 10 % = ${z(lfm)} m`, `× ${z(fugeMm2(8), 0)} mm² (8-mm-Fuge) = ${z(ml, 0)} ml → ${n} Kartusche(n)`] }));
      l.push(P('Primer für Dichtstoffe (laut Hersteller, saugende Untergründe)', 'bau', 1, 'Fl.', { optional: true }));
      l.push(krepp(lfm * 2, 'Fugenränder abkleben'));
      l.push(P('Rundschnur (Hinterfüllschnur) Ø 10 mm', 'bau', Math.ceil(lfm), 'm', { optional: true }));
      l.push(P('Isopropanol zum Entfetten', 'sonstiges', 1, 'Fl.'));
      return l;
    },
    werkzeug: ['cutter', 'kartuschenpistole', 'fugenglaetter', 'wasserwaage', 'spachtel', 'leiter', 'pinsel'],
    schritte: [
      { t: 'Sichtprüfung', min: m => 5 + m.anzahl * 3,
        x: 'Jede Fensterbank von außen ansehen: Risse in den seitlichen Fugen, Lücken zwischen Endstück und Putz, Abplatzungen am Putz darunter, Moos oder Verfärbungen?',
        kniff: 'Bei Regen hinsehen: Läuft das Wasser vorn über die Tropfkante ab oder seitlich in die Fassade?',
        fehler: 'Nur von innen geschaut – die Schäden entstehen außen.' },
      { t: 'Gefälle und Halt prüfen', min: m => 5 + m.anzahl * 2,
        x: 'Wasserwaage auflegen: Die Fensterbank braucht Gefälle nach außen (mindestens etwa 5 %). Klopfen: Sitzt sie fest oder klingt sie hohl und wackelt?',
        kniff: 'Ein Glas Wasser langsam auf die Fensterbank gießen – es muss zügig nach vorn ablaufen.',
        fehler: 'Lose Fensterbank neu verfugt: Die Fuge reißt bei der ersten Belastung wieder.' },
      { t: 'Alte Fugen herausschneiden', min: m => 5 + m.anzahl * 6,
        x: 'Alte, rissige Fugen mit dem Cutter vollständig herausschneiden, Reste abschaben.',
        kniff: 'Bei Alu-Fensterbänken mit Kunststoffschaber arbeiten – Kratzer im Alu korrodieren.',
        fehler: 'Neuer Dichtstoff auf alte Reste: Er haftet nicht.' },
      { t: 'Reinigen und abkleben', min: m => 5 + m.anzahl * 5, warten: 30, wartenText: 'Primer ablüften lassen (falls verwendet)',
        x: 'Fugenflanken entstauben und entfetten, bei saugendem Putz Primer auftragen. Tiefe Fugen mit Rundschnur hinterfüllen, Ränder abkleben. Nur bei trockenem Wetter über 5 °C arbeiten.',
        kniff: 'Die Fuge muss völlig trocken sein – am besten nach zwei trockenen Tagen.',
        fehler: 'Bei feuchtem Untergrund verfugt: Die Fuge löst sich im Winter ab.' },
      { t: 'Neu verfugen', min: m => 5 + m.anzahl * 6,
        x: 'Dichtstoff gleichmäßig einspritzen, mit dem Fugenglätter abziehen, Kreppband sofort abziehen.',
        kniff: 'Glättmittel laut Hersteller verwenden – Spülmittelwasser kann bei Fassadendichtstoffen Flecken hinterlassen.',
        fehler: 'Fuge so tief wie breit gefüllt und an drei Seiten haftend: Sie reißt.',
        sicher: 'Über Erdgeschosshöhe nur von sicherem Stand aus (nicht aus dem offenen Fenster hinauslehnen).' },
      { t: 'Tropfkante und Ablauf prüfen', min: m => 5 + m.anzahl * 2,
        x: 'Die Tropfkante vorn muss frei sein und mindestens etwa 3 cm vor der Fassade enden, sonst läuft das Wasser die Wand herunter. Ergebnis mit Foto in „Mein Haus“ notieren.',
        kniff: 'Dunkle Streifen unter der Fensterbank zeigen, dass die Tropfkante zu kurz ist.',
        fehler: 'Verschmutzte Tropfkante übersehen.' }
    ],
    sicherheit: ['Über dem Erdgeschoss nicht aus dem Fenster lehnen – Gerüst bzw. Fachbetrieb.', 'Leiter standsicher.'],
    grenzen: ['Innen unter dem Fenster ist es feucht oder schimmelt – Anschlussabdichtung vom Fachbetrieb prüfen lassen.', 'Fensterbank lose, ohne Gefälle oder gebrochen – Fachbetrieb.', 'Fensterbänke über dem Erdgeschoss – nur mit Gerüst bzw. Fachbetrieb.'],
    rot: (m, o) => o.innen ? 'Feuchte oder Schimmel innen unter dem Fenster deuten auf eine undichte Anschlussabdichtung unter der Fensterbank hin. Neue Fugen außen reichen dann nicht – bitte Fachbetrieb beauftragen.' : (m.hoehe > 3 ? `Die Fensterbank liegt ${z(m.hoehe, 1)} m hoch. Ohne Gerüst ist das zu gefährlich – bitte Fachbetrieb beauftragen.` : ''),
    wartung: { monate: 12, monat: 4, text: 'Außenfensterbänke und Fugen ansehen (nach dem Winter)' }
  },
  /* ======================================================================= */
  {
    id: 'schliesszylinder', bereich: 'tueren', titel: 'Schließzylinder tauschen', schwierigkeit: 1,
    kurz: 'Profilzylinder richtig messen und tauschen – zum Beispiel nach Schlüsselverlust oder beim Einzug.',
    schlagworte: ['schliesszylinder', 'zylinder', 'tuerschloss', 'schloss tauschen', 'schluessel verloren', 'profilzylinder', 'haustuer schloss', 'zylinder wechseln', 'schloss wechseln', 'neues schloss'],
    aufnahme: { art: 'werte', felder: [
      { id: 'a', label: 'Maß außen (Mitte Stulpschraube → Außenkante Beschlag)', einheit: 'mm', std: 32, max: 80, min: 25 },
      { id: 'b', label: 'Maß innen (Mitte Stulpschraube → Innenkante Beschlag)', einheit: 'mm', std: 41, max: 80, min: 25 },
      { id: 'anzahl', label: 'Anzahl Türen mit gleichem Schlüssel', einheit: 'Stück', std: 1, max: 10, ganz: true }
    ] },
    optionen: [{ id: 'aussen', label: 'Außentür (Haustür, Kellertür)', typ: 'ja', std: true }],
    material(m, o) {
      const a = R.zylinderSeite(m.a), b = R.zylinderSeite(m.b), l = [];
      l.push(P(`Profil-Doppelzylinder ${a}/${b} mm${o.aussen ? ' mit Not- und Gefahrenfunktion, Bohr- und Ziehschutz' : ''}`, 'eisen', m.anzahl, 'Stk.', { detail: m.anzahl > 1 ? 'gleichschließend bestellen' : '', rechnung: [`Außen gemessen ${z(m.a)} mm → nächste Größe ${a} mm`, `Innen gemessen ${z(m.b)} mm → nächste Größe ${b} mm`, 'Handelsübliche Längen in 5-mm-Schritten ab 30 mm. Außen darf der Zylinder höchstens ca. 3 mm über den Schutzbeschlag stehen (Einbruchschutz).', ...(m.anzahl > 1 ? [`${m.anzahl} Zylinder gleichschließend (ein Schlüssel für alle) – meist nur auf Bestellung.`] : [])] }));
      l.push(P('Stulpschraube M5 in passender Länge (meist beiliegend)', 'eisen', 1, 'Stk.', { optional: true }));
      return l;
    },
    werkzeug: ['zollstock', 'schraubendreher'],
    schritte: [
      { t: 'Zylinder messen', min: 5,
        x: 'Tür öffnen. An der Stirnseite der Tür (Stulp) sitzt die Stulpschraube auf Höhe des Zylinders. Von deren Mitte bis zur Außenkante des Beschlags außen messen, dann bis zur Innenkante innen.',
        kniff: 'Gemessen wird immer bis Außenkante Beschlag, nicht bis Zylinderende.',
        fehler: 'Maß von Türkante statt von Schraubenmitte genommen: Zylinder passt nicht.' },
      { t: 'Stulpschraube lösen', min: 5,
        x: 'Die lange Stulpschraube in der Stirnseite der Tür herausdrehen.',
        kniff: 'Die Schraube steckt bis zu 8 cm tief – ganz herausdrehen.',
        fehler: 'Schraube nur gelockert: Der Zylinder lässt sich nicht ziehen.' },
      { t: 'Zylinder herausziehen', min: 5,
        x: 'Schlüssel einstecken und etwa 30° drehen, bis die Schließnase in der Zylinderflucht steht. Am Schlüssel den Zylinder herausziehen.',
        kniff: 'Wenn er hakt: Schlüssel minimal hin- und herdrehen, bis die Nase genau mittig steht.',
        fehler: 'Mit Gewalt gezogen: Die Schließnase verhakt sich im Schloss.' },
      { t: 'Neuen Zylinder einsetzen', min: 5,
        x: 'Neuen Zylinder mit Schlüssel (Nase in Flucht) einschieben, die Bohrung muss vor der Stulpschraube liegen. Stulpschraube eindrehen – nur handfest.',
        kniff: 'Seiten nicht verwechseln: die längere Seite dorthin, wo das größere Maß gemessen wurde.',
        fehler: 'Stulpschraube zu fest angezogen: Der Zylinder verspannt und schließt schwer.' },
      { t: 'Testen', min: 5,
        x: 'Bei offener Tür schließen und öffnen – von beiden Seiten. Erst dann die Tür schließen. Schlüssel zählen und Ersatzschlüssel sicher aufbewahren.',
        kniff: 'Die Sicherungskarte des Zylinders gut verwahren – nur damit gibt es Nachschlüssel.',
        fehler: 'Gleich die Tür zugezogen: Klemmt der Zylinder, stehen Sie draußen.' }
    ],
    sicherheit: ['Immer bei geöffneter Tür testen.'],
    grenzen: ['Elektronische Schlösser, Mehrfachverriegelung defekt oder Einbruchschaden – Schlüsseldienst bzw. Fachbetrieb.', 'Sicherheitsberatung zum Einbruchschutz: Polizeiliche Beratungsstelle (kostenlos).']
  },
  /* ======================================================================= */
  {
    id: 'heizkoerper-reinigen', bereich: 'heizung', titel: 'Heizkörper reinigen', schwierigkeit: 1,
    kurz: 'Staub zwischen den Lamellen mindert die Heizleistung und wirbelt beim Heizen auf – vor der Heizperiode reinigen.',
    schlagworte: ['heizkoerper reinigen', 'heizkoerper staub', 'heizung reinigen', 'heizkoerper putzen', 'lamellen reinigen', 'konvektor reinigen', 'heizkoerper sauber machen'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl Heizkörper', einheit: 'Stück', std: 8, max: 60, ganz: true }] },
    optionen: [],
    material(m, o) {
      return [
        P('Heizkörperbürste bzw. Heizkörper-Reinigungsset', 'reinigung', 1, 'Stk.'),
        P('Mikrofasertücher', 'reinigung', 1, 'Pack.'),
        P('Altes Handtuch bzw. feuchtes Tuch zum Unterlegen', 'reinigung', 1, 'Stk.', { optional: true })
      ];
    },
    werkzeug: ['heizkoerperbuerste', 'staubsauger', 'eimer', 'schwamm'],
    schritte: [
      { t: 'Heizung abdrehen und abkühlen lassen', min: 5, warten: 30, wartenText: 'Heizkörper abkühlen lassen',
        x: 'Thermostat auf „*“ (Frostschutz) bzw. 0 stellen und warten, bis der Heizkörper kalt ist.',
        kniff: 'Im Spätsommer reinigen – dann ist der Heizkörper ohnehin kalt.',
        fehler: 'Am warmen Heizkörper gearbeitet: Der Staub brennt an und riecht.' },
      { t: 'Abdeckgitter abnehmen', min: m => 3 + m.anzahl * 2,
        x: 'Viele Plattenheizkörper haben oben ein Abdeckgitter und seitliche Blenden, die sich nach oben abziehen lassen.',
        kniff: 'Vorsichtig an beiden Enden gleichzeitig hochziehen.',
        fehler: 'Gitter an einer Seite gehebelt: Es verbiegt.' },
      { t: 'Lamellen ausbürsten', min: m => 5 + m.anzahl * 6,
        x: 'Feuchtes Tuch unter den Heizkörper legen. Mit der langen Heizkörperbürste von oben zwischen die Platten und Lamellen fahren und den Staub nach unten schieben; den Staubsauger mit Fugendüse unten und oben dranhalten.',
        kniff: 'Ein Föhn auf kalter Stufe bläst den Staub von oben nach unten auf das feuchte Tuch.',
        fehler: 'Nur außen abgewischt: Der meiste Staub sitzt innen.' },
      { t: 'Feucht nachwischen', min: m => 3 + m.anzahl * 3,
        x: 'Außenflächen, Abdeckung und die Wand hinter dem Heizkörper feucht abwischen.',
        kniff: 'Graue Streifen an der Wand über dem Heizkörper entstehen durch Staub in der warmen Luft – nach der Reinigung werden sie weniger.',
        fehler: 'Scheuermittel auf dem Lack: Er wird stumpf und rostet später.' },
      { t: 'Abdeckung aufsetzen, Heizung an', min: m => 3 + m.anzahl * 2,
        x: 'Abdeckgitter aufsetzen, Thermostat auf die gewohnte Stufe stellen. Möbel und Vorhänge nicht direkt vor den Heizkörper stellen.',
        kniff: 'Bei dieser Gelegenheit gleich entlüften (siehe „Heizkörper entlüften“).',
        fehler: 'Sofa direkt vor dem Heizkörper: Die Wärme staut sich.' }
    ],
    sicherheit: ['Nur am kalten Heizkörper arbeiten.'],
    grenzen: ['Heizkörper rostet, tropft oder bleibt trotz Entlüften kalt – Heizungsfachbetrieb.'],
    wartung: { monate: 12, monat: 9, text: 'Heizkörper vor der Heizperiode reinigen' }
  },
  /* ======================================================================= */
  {
    id: 'heizkoerperventil', bereich: 'heizung', titel: 'Heizkörperventil gängig machen', schwierigkeit: 1,
    kurz: 'Heizkörper bleibt nach dem Sommer kalt? Meist klemmt der Ventilstift – in wenigen Minuten wieder frei.',
    schlagworte: ['heizkoerper kalt', 'heizkoerper wird nicht warm', 'ventil klemmt', 'ventilstift', 'thermostatventil klemmt', 'heizung bleibt kalt', 'heizkoerper bleibt kalt', 'heizung geht nicht'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl betroffener Heizkörper', einheit: 'Stück', std: 1, max: 30, ganz: true }] },
    optionen: [],
    material(m, o) {
      return [P('Kriechöl bzw. Silikonspray (nur ein Hauch am Stift)', 'eisen', 1, 'Dose', { optional: true }), P('Stück Stoff zum Schutz der Zangenbacken', 'reinigung', 1, 'Stk.', { optional: true })];
    },
    werkzeug: ['zange', 'schraubendreher', 'lampe'],
    schritte: [
      { t: 'Thermostatkopf abnehmen', min: m => 3 + m.anzahl * 3,
        x: 'Thermostat auf Maximum drehen und den Kopf abschrauben (Überwurfmutter) bzw. bei Klemmanschluss lösen. Es tritt kein Wasser aus.',
        kniff: 'Siehe auch „Thermostatkopf wechseln“ – gleiche Handgriffe.',
        fehler: 'Am Ventilkörper statt an der Mutter gedreht.' },
      { t: 'Ventilstift prüfen', min: m => 2 + m.anzahl * 2,
        x: 'Der Stift in der Mitte muss mit leichtem Fingerdruck etwa 2–3 mm einsinken und von selbst wieder herauskommen. Bleibt er unten oder bewegt sich nicht, klemmt das Ventil.',
        kniff: 'Vergleich mit einem funktionierenden Heizkörper: So fühlt sich ein gängiger Stift an.',
        fehler: 'Stift gezogen: Er gehört nicht heraus.' },
      { t: 'Stift vorsichtig gängig machen', min: m => 3 + m.anzahl * 4,
        x: 'Stift mit der Zange (Stoff dazwischen) vorsichtig greifen und mehrmals leicht hineindrücken und wieder herausziehen bzw. mit einem kleinen Hammerschlag auf den Schraubendrehergriff ganz leicht antippen. Nur wenig Kraft – er bewegt sich meist nach einigen Versuchen.',
        kniff: 'Ein Hauch Silikonspray am Stift (nicht in das Ventil sprühen) hilft.',
        fehler: 'Mit Gewalt gezogen: Das Ventil wird undicht und tropft.' },
      { t: 'Kopf wieder aufsetzen', min: m => 2 + m.anzahl * 2,
        x: 'Thermostatkopf auf Maximum stellen, aufsetzen und handfest anschrauben.',
        kniff: 'Danach gleich entlüften, falls es gluckert.',
        fehler: 'Kopf auf 0 aufgeschraubt: Er drückt den Stift sofort wieder fest.' },
      { t: 'Warm testen', min: 5, warten: 30, wartenText: 'Heizung laufen lassen',
        x: 'Heizung laufen lassen und nach 30 Minuten fühlen: Wird der Heizkörper oben warm? Wenn nicht: entlüften, Druck prüfen.',
        kniff: 'Ventile jedes Jahr im September einmal durchbewegen – dann klemmen sie nicht.',
        fehler: 'Gleich den Heizungsbauer gerufen, obwohl nur Luft im Heizkörper war.' }
    ],
    sicherheit: ['Ventil nicht ausbauen – dann läuft Heizungswasser aus.'],
    grenzen: ['Ventil tropft am Stift oder lässt sich nicht befreien – Heizungsfachbetrieb (Ventiloberteil tauschen).']
  },
  /* ======================================================================= */
  {
    id: 'co-wassermelder', bereich: 'elektro', titel: 'CO-Melder und Wassermelder installieren', schwierigkeit: 1,
    kurz: 'Batteriebetriebene Kohlenmonoxid-Melder an Feuerstätten und Wassermelder an Leckstellen – richtige Plätze, richtige Anzahl.',
    schlagworte: ['co melder', 'kohlenmonoxid', 'kohlenmonoxidmelder', 'gasmelder', 'wassermelder', 'wasseralarm', 'leckmelder', 'kamin melder', 'heizraum melder', 'wasserschaden melder'],
    aufnahme: { art: 'werte', felder: [
      { id: 'feuer', label: 'Räume mit Feuerstätte (Kaminofen, Gas-/Ölheizung, Gastherme)', einheit: 'Räume', std: 2, max: 10, ganz: true, pflicht: false },
      { id: 'schlaf', label: 'Schlafräume (für zusätzliche CO-Melder bei Kaminofen in der Nähe)', einheit: 'Räume', std: 0, max: 10, ganz: true, pflicht: false },
      { id: 'wasser', label: 'Wasser-Leckstellen (Waschmaschine, Geschirrspüler, Heizraum, Filter)', einheit: 'Stellen', std: 3, max: 20, ganz: true, pflicht: false }
    ] },
    optionen: [],
    material(m, o) {
      const l = [], co = (m.feuer || 0) + (m.schlaf || 0);
      if (co > 0) l.push(P('CO-Melder (Kohlenmonoxid) mit Batterie, nach DIN EN 50291', 'elektro', co, 'Stk.', { rechnung: [`Je Raum mit Feuerstätte einer: ${m.feuer || 0}`, `+ Schlafräume in der Nähe eines Kaminofens: ${m.schlaf || 0}`, `= ${co} Melder`] }));
      if ((m.wasser || 0) > 0) l.push(P('Wassermelder mit Batterie (akustischer Alarm)', 'elektro', m.wasser, 'Stk.', { rechnung: [`Je Leckstelle einer: ${m.wasser}`] }));
      l.push(P('Schrauben und Dübel bzw. Klebepads für die Montage', 'eisen', 1, 'Pack.', { optional: true }));
      return l;
    },
    werkzeug: ['zollstock', 'bleistift', 'leitungssucher', 'akkuschrauber', 'schraubendreher'],
    schritte: [
      { t: 'Standorte festlegen', min: 15,
        x: 'CO-Melder in jedem Raum mit Feuerstätte (Kaminofen, Gastherme, Heizkessel), dazu bei Kaminöfen in nahe Schlafräume. Wassermelder an jede Stelle, an der Wasser auslaufen kann: Waschmaschine, Geschirrspüler, Heizraum, Hauswasserfilter, Keller mit Rückstaurisiko.',
        kniff: 'CO-Melder nicht direkt über die Feuerstätte, sondern 1–3 m entfernt – Herstellerangabe beachten.',
        fehler: 'CO-Melder an die Decke wie einen Rauchmelder: CO verteilt sich anders – Herstellerangabe zur Höhe beachten (oft Atem- bzw. Kopfhöhe).' },
      { t: 'CO-Melder montieren', min: m => 5 + ((m.feuer || 0) + (m.schlaf || 0)) * 10,
        x: 'Melder laut Anleitung aktivieren (Batterie bzw. Schalter), Halterung anschrauben oder kleben, Melder einsetzen. Nicht hinter Vorhänge, nicht in Ecken ohne Luftbewegung, nicht direkt neben Fenster oder Abzugshaube.',
        kniff: 'Datum der Inbetriebnahme auf die Rückseite schreiben – CO-Melder haben eine begrenzte Lebensdauer (oft 7–10 Jahre).',
        fehler: 'Melder im Heizraum hinter dem Kessel versteckt: Den Alarm hört niemand.',
        sicher: 'Vor dem Bohren Leitungssucher verwenden.' },
      { t: 'Wassermelder legen', min: m => 3 + (m.wasser || 0) * 3,
        x: 'Wassermelder flach auf den Boden an die tiefste Stelle neben bzw. unter die Leckquelle legen, Kontakte nach unten. Sie dürfen nicht verdeckt oder im Weg sein.',
        kniff: 'Unter der Spüle direkt unter den Eckventilen platzieren.',
        fehler: 'Melder auf das Regal gestellt: Er meldet erst, wenn der Keller schon voll ist.' },
      { t: 'Testen', min: 10,
        x: 'Testtaste jedes Melders drücken. Wassermelder mit einem feuchten Finger an den Kontakten auslösen.',
        kniff: 'Allen im Haus den Alarmton vorspielen – damit jeder weiß, was er bedeutet.',
        fehler: 'Melder nicht getestet: Batterien waren schon im Laden leer.' },
      { t: 'Notieren und Verhalten bei Alarm', min: 5,
        x: 'Standorte und Datum in „Mein Haus“ eintragen. Bei CO-Alarm: Fenster und Türen öffnen, Feuerstätte aus (falls gefahrlos), alle Personen ins Freie, Notruf 112 bzw. Heizungsfachbetrieb und Schornsteinfeger.',
        kniff: 'Den Ablauf bei Alarm auf einen Zettel neben dem Melder schreiben.',
        fehler: 'Alarm als Fehlalarm abgetan: CO ist geruchlos und tödlich.' }
    ],
    sicherheit: ['Bei CO-Alarm: lüften, Haus verlassen, Notruf 112.', 'Melder ersetzen nicht die Wartung der Feuerstätte durch Fachbetrieb und Schornsteinfeger.'],
    grenzen: ['Fest angeschlossene (230 V) oder vernetzte Melder, Einbindung in Alarmanlagen – Elektrofachbetrieb.', 'Gasgeruch: keine Schalter betätigen, Fenster öffnen, Haus verlassen, Notruf des Gasversorgers bzw. 112.'],
    wartung: { monate: 12, text: 'CO- und Wassermelder testen, Batterien und Austauschdatum prüfen', std: false }
  },
  /* ======================================================================= */
  {
    id: 'feuerloescher', bereich: 'elektro', titel: 'Feuerlöscher und Löschdecke: Platz und Prüfdatum', schwierigkeit: 1,
    kurz: 'Den richtigen Löscher an den richtigen Platz – Prüfplakette ablesen und eine Löschdecke für die Küche.',
    schlagworte: ['feuerloescher', 'loeschdecke', 'brandschutz', 'feuer', 'loescher pruefen', 'pruefplakette', 'fettbrand', 'brandschutz zuhause'],
    aufnahme: { art: 'werte', felder: [{ id: 'etagen', label: 'Geschosse (inkl. Keller)', einheit: 'Geschosse', std: 3, max: 6, ganz: true }, { id: 'vorhanden', label: 'Vorhandene Feuerlöscher', einheit: 'Stück', std: 1, max: 10, ganz: true, pflicht: false }] },
    optionen: [{ id: 'decke', label: 'Löschdecke in der Küche vorhanden', typ: 'ja', std: false }],
    material(m, o) {
      const l = [], fehlt = Math.max(0, m.etagen - (m.vorhanden || 0));
      if (fehlt > 0) l.push(P('Feuerlöscher (Schaum, 6 l, Brandklassen A und B) mit Wandhalterung', 'elektro', fehlt, 'Stk.', { rechnung: [`Empfehlung: ein Löscher je Geschoss: ${m.etagen} − vorhanden ${m.vorhanden || 0} = ${fehlt}`, 'Schaumlöscher hinterlassen weniger Schaden als Pulver.'] }));
      if (!o.decke) l.push(P('Löschdecke (DIN EN 1869) mit Wandhalterung für die Küche', 'elektro', 1, 'Stk.'));
      l.push(P('Fettbrandlöscher (Brandklasse F) für die Küche', 'elektro', 1, 'Stk.', { optional: true }));
      if (!l.length) l.push(P('Etikett für Prüfdatum', 'sonstiges', 1, 'Stk.', { optional: true }));
      return l;
    },
    werkzeug: ['akkuschrauber', 'leitungssucher', 'zollstock', 'lampe'],
    schritte: [
      { t: 'Bestand aufnehmen', min: 10,
        x: 'Alle Feuerlöscher, Löschsprays und Löschdecken im Haus zusammensuchen und notieren: Art (Schaum, Pulver, CO₂, Fettbrand), Größe, Ort.',
        kniff: 'Auch das Auto und die Garage mitzählen.',
        fehler: 'Löscher irgendwo im Keller vergessen – im Ernstfall findet ihn niemand.' },
      { t: 'Prüfplakette ablesen', min: m => 3 + (m.vorhanden || 1) * 3,
        x: 'Prüfplakette ablesen: Die Prüfung durch einen Sachkundigen wird in der Regel alle zwei Jahre empfohlen. Sicherungsstift und Plombe vorhanden? Bei Dauerdrucklöschern zeigt das Manometer im grünen Bereich?',
        kniff: 'Das nächste Prüfdatum in „Mein Haus“ als Erinnerung eintragen.',
        fehler: 'Abgelaufenen Löscher behalten „weil er noch voll ist“ – Dichtungen und Treibmittel altern.' },
      { t: 'Richtigen Platz wählen', min: m => 5 + m.etagen * 5,
        x: 'Je Geschoss ein Löscher, gut sichtbar und schnell erreichbar an einem Fluchtweg (Flur, Treppe), Griff in etwa 80–120 cm Höhe. Nicht in der Küche hinter dem Herd – dorthin kommt man im Brandfall nicht.',
        kniff: 'Der beste Platz ist der, an dem man auf dem Weg nach draußen vorbeikommt.',
        fehler: 'Löscher im Schrank: Im Rauch findet ihn niemand.',
        sicher: 'Vor dem Bohren Leitungssucher.' },
      { t: 'Löschdecke in die Küche', min: 10,
        x: 'Löschdecke neben dem Ausgang der Küche aufhängen, nicht direkt über dem Herd. Bei Fettbrand niemals Wasser! Deckel drauf, Löschdecke oder Fettbrandlöscher.',
        kniff: 'Die Laschen der Löschdecke zeigen nach unten – im Ernstfall genügt ein Ruck.',
        fehler: 'Wasser auf brennendes Fett: Explosionsartige Stichflamme.' },
      { t: 'Notieren und üben', min: 10,
        x: 'Standorte und Prüfdaten in „Mein Haus“ eintragen. Allen im Haus zeigen, wo die Löscher hängen und wie man sie benutzt (Sicherung ziehen, Schlauch auf den Brand, Hebel drücken).',
        kniff: 'Eigene Sicherheit geht vor: Brennt mehr als ein Papierkorb, sofort raus und 112.',
        fehler: 'Selbst gegen einen großen Brand angekämpft – Rauch ist tödlich.' }
    ],
    sicherheit: ['Brennt mehr als ein Entstehungsbrand: Haus verlassen, Türen schließen, Notruf 112.', 'Bei Fettbrand nie Wasser.'],
    grenzen: ['Prüfung und Instandhaltung von Feuerlöschern – Sachkundiger (Prüfplakette).'],
    wartung: { monate: 12, text: 'Feuerlöscher: Prüfplakette, Plombe und Platz kontrollieren' }
  },
  /* ======================================================================= */
  {
    id: 'zaun-streichen', bereich: 'aussen', titel: 'Holzzaun oder Gartenhaus streichen', schwierigkeit: 1,
    kurz: 'Holz im Garten reinigen, anschleifen und mit Lasur schützen – mit Flächen- und Lasurrechnung.',
    schlagworte: ['zaun', 'zaun streichen', 'holzzaun', 'gartenzaun', 'gartenhaus streichen', 'lasur', 'holzlasur', 'holzschutz', 'carport streichen', 'sichtschutz streichen', 'zaun lasieren'],
    aufnahme: { art: 'werte', felder: [
      { id: 'laenge', label: 'Zaunlänge bzw. Wandlänge (Gartenhaus: Umfang)', einheit: 'm', std: 20, max: 300, min: 1 },
      { id: 'hoehe', label: 'Höhe', einheit: 'm', std: 1.2, max: 3, min: 0.3 }
    ] },
    optionen: [
      { id: 'art', label: 'Art', typ: 'wahl', std: 'latten', werte: [['latten', 'Lattenzaun (mit Zwischenräumen)'], ['dicht', 'Sichtschutz / Gartenhauswand (geschlossen)']] },
      { id: 'seiten', label: 'Beide Seiten streichen', typ: 'ja', std: true },
      { id: 'erst', label: 'Erstanstrich oder stark verwittert (Grundierung + 2 Anstriche)', typ: 'ja', std: false }
    ],
    vorlauf: 'Trockenes Wetter mit 10–25 °C abpassen, keine pralle Sonne, kein Regen für 24 Stunden.',
    material(m, o) {
      const l = [], anteil = o.art === 'latten' ? 0.6 : 1.0, s = o.seiten ? 2 : 1;
      const A = m.laenge * m.hoehe * anteil * s * 1.1;
      const bed = A * 0.1 * 2 * 1.1, g = R.gebinde(bed, [0.75, 2.5, 5], 'l');
      l.push(P('Holzlasur für außen (Dünn- oder Dickschicht, im gewünschten Farbton)', 'farbe', g.stueck, 'Gebinde', { detail: g.text, rechnung: [`Fläche: ${z(m.laenge)} m × ${z(m.hoehe)} m${o.art === 'latten' ? ' × 0,6 (Lattenanteil)' : ''}${s === 2 ? ' × 2 Seiten' : ''} + 10 % Kanten = ${z(A)} m²`, `× 0,10 l/m² × 2 Anstriche = ${z(A * 0.2)} l + 10 % = ${z(bed)} l`, `Gebinde: ${g.text}`, 'Verbrauch laut Etikett hat Vorrang; raues, sägeraues Holz braucht mehr.'] }));
      if (o.erst) { const gr = A * 0.1 * 1.1, gg = R.gebinde(gr, [0.75, 2.5, 5], 'l'); l.push(P('Holzschutzgrund (bläueschützend) für außen', 'farbe', gg.stueck, 'Gebinde', { detail: gg.text, rechnung: [`${z(A)} m² × 0,10 l/m² + 10 % = ${z(gr)} l → ${gg.text}`, 'Nur bei Nadelholz ohne Kesseldruckimprägnierung nötig (Etikett).'] })); }
      l.push(P('Schleifpapier Körnung 80–120', 'farbe', 1, 'Pack.'));
      l.push(P('Abdeckfolie bzw. Pappe für Pflanzen und Boden', 'farbe', 1, 'Pack.'));
      l.push(...schutz('handschuhe', 'brille'));
      return l;
    },
    werkzeug: ['schrubber', 'fugenbuerste', 'gartenschlauch', 'schleifklotz', 'pinsel', 'eimer'],
    schritte: [
      { t: 'Wetter und Holz prüfen', min: 10,
        x: 'Holz muss trocken sein (nach Regen mindestens 2 Tage). Morsche Stellen mit dem Schraubendreher prüfen: Lässt er sich leicht ins Holz drücken, ist es faul.',
        kniff: 'Mit dem Daumennagel testen: Eindrücke in trockenem Holz sind ein Warnzeichen.',
        fehler: 'Auf feuchtes Holz gestrichen: Die Lasur blättert, Feuchte bleibt drin.' },
      { t: 'Reinigen', min: m => 15 + m.laenge * 2, warten: 1440, wartenText: 'Holz trocknen lassen (mind. 24 h)',
        x: 'Moos, Algen, Spinnweben und loses Material mit Bürste und Wasser entfernen. Grünbelag gründlich abbürsten.',
        kniff: 'Hochdruckreiniger nur mit großem Abstand – sonst raut das Holz auf.',
        fehler: 'Mit der Punktstrahldüse gereinigt: Faseriges, pelziges Holz, das viel mehr Lasur schluckt.' },
      { t: 'Anschleifen', tagNeu: true, min: m => 15 + m.laenge * 2,
        x: 'Lose Lasur und vergraute Fasern mit Schleifpapier entfernen, in Faserrichtung schleifen, entstauben.',
        kniff: 'Bei alter Dickschichtlasur alles Lose entfernen – feste Stellen nur anrauen.',
        fehler: 'Neue Dünnschicht- auf alte Dickschichtlasur: Sie zieht nicht ein.',
        sicher: 'Staubmaske bei alten Anstrichen.' },
      { t: '1. Anstrich', min: m => 15 + m.laenge * 4, warten: 720, wartenText: 'Zwischentrocknung (12–24 h)',
        x: 'Pflanzen abdecken. Lasur gut aufrühren und mit dem Pinsel in Faserrichtung dünn auftragen, Hirnholz und Kanten satt. Von oben nach unten arbeiten.',
        kniff: 'Immer ganze Bretter durchstreichen – Ansätze mitten im Brett bleiben sichtbar.',
        fehler: 'In praller Sonne gestrichen: Die Lasur trocknet zu schnell und wird fleckig.' },
      { t: '2. Anstrich', min: m => 15 + m.laenge * 3.5, warten: 720, wartenText: 'Durchtrocknen',
        x: 'Zweiten Anstrich wie den ersten auftragen.',
        kniff: 'Wetterseite (meist Westen) bekommt bei Bedarf einen dritten Anstrich.',
        fehler: 'Nur einen Anstrich: Der Schutz hält nur kurz.' },
      { t: 'Aufräumen', min: 20,
        x: 'Pinsel auswaschen (wasserverdünnbar) bzw. mit Verdünnung reinigen. Reste nicht in den Gully, Gebinde zum Wertstoffhof.',
        kniff: 'Ein beschriftetes Restgebinde für Ausbesserungen aufheben.',
        fehler: 'Lasurreste in den Abfluss: verboten und schädlich.' }
    ],
    sicherheit: ['Handschuhe und Schutzbrille.', 'Lasurreste nicht in die Kanalisation.'],
    grenzen: ['Morsche Pfosten oder Bretter, wackelnder Zaun bzw. tragende Teile des Gartenhauses – Fachbetrieb bzw. Austausch.'],
    wartung: { monate: 24, monat: 5, text: 'Holzzaun bzw. Gartenhaus nachstreichen (je nach Wetterseite)', std: false }
  },
  /* ======================================================================= */
  {
    id: 'gartenhaus-dach', bereich: 'aussen', titel: 'Gartenhaus-Dach mit Dachpappe erneuern', schwierigkeit: 2,
    kurz: 'Undichtes Gartenhausdach neu eindecken – mit Bitumenbahnen, Überlappung und Stiften auf das Stück genau.',
    schlagworte: ['gartenhaus', 'gartenhaus dach', 'dachpappe', 'bitumenbahn', 'gartenhaus undicht', 'schuppen dach', 'geraetehaus dach', 'dachpappe erneuern', 'carport dach'],
    aufnahme: { art: 'werte', felder: [
      { id: 'breite', label: 'Dachbreite (Traufe, inkl. Überstand)', einheit: 'm', std: 3, max: 10, min: 0.5 },
      { id: 'tiefe', label: 'Dachtiefe (Traufe bis First bzw. Pultdach ganz)', einheit: 'm', std: 2.5, max: 10, min: 0.5 },
      { id: 'flaechen', label: 'Anzahl Dachflächen (Pultdach 1, Satteldach 2)', einheit: 'Stück', std: 1, max: 2, ganz: true }
    ] },
    optionen: [{ id: 'alt', label: 'Altes Dach aus grauen Well- oder Faserzementplatten', typ: 'ja', std: false }, { id: 'hoehe', label: 'Dach höher als ca. 3 m oder sehr steil', typ: 'ja', std: false }],
    material(m, o) {
      const l = [], A = m.breite * m.tiefe * m.flaechen, Ab = A * 1.15, rollen = Math.ceil(R.rund(Ab / 10, 6));
      l.push(P('Bitumen-Dachbahn besandet bzw. beschiefert (Rolle 10 × 1 m)', 'bau', rollen, 'Rolle', { rechnung: [`Dachfläche ${z(m.breite)} × ${z(m.tiefe)} m × ${m.flaechen} = ${z(A)} m²`, `+ 15 % (8–10 cm Überlappung, Umschlag an Traufe und Ortgang${m.flaechen === 2 ? ', First' : ''}) = ${z(Ab)} m²`, `÷ 10 m² je Rolle → ${rollen} Rollen`] }));
      const st = Ab * 25, g = R.gebinde(st, [250, 1000], 'Stk.');
      l.push(P('Dachpappstifte verzinkt 2,8 × 20 mm', 'eisen', g.stueck, 'Pack.', { detail: g.text, rechnung: [`Ca. 25 Stifte je m² (Überlappung alle 5–10 cm, Ränder): ${z(Ab)} m² × 25 = ${z(st, 0)} → ${g.text}`] }));
      const kl = Math.max(1, Math.ceil((m.breite * m.flaechen * Math.ceil(m.tiefe) + m.tiefe * 2 * m.flaechen) / 10));
      l.push(P('Bitumen-Kaltkleber (Kartusche) für Überlappungen', 'bau', kl, 'Kartusche', { rechnung: ['Überlappungen zusätzlich verkleben, ca. 10 m Naht je Kartusche.'] }));
      l.push(P('Traufblech bzw. Dachrandprofil (falls verrottet)', 'bau', 0, 'Stk.', { optional: true }));
      l.push(P('Ersatzbretter für Schalung (Nut und Feder) bei morschen Stellen', 'holz', 0, 'Stk.', { optional: true }));
      l.push(...schutz('arbeitshandschuhe', 'brille'));
      return l;
    },
    werkzeug: ['cutter', 'hammer', 'zollstock', 'anlegeleiter', 'spachtel', 'kartuschenpistole', 'akkuschrauber'],
    schritte: [
      { t: 'Dach prüfen: Material, Schalung, Höhe', min: 20,
        x: 'Was liegt jetzt drauf? Graue Well- oder Ebenplatten aus Faserzement (vor 1993) können Asbest enthalten – nicht anfassen. Schalung von innen ansehen: dunkle, weiche Stellen sind morsch. Kann man das Dach von einer sicheren Leiter aus erreichen, ohne es zu betreten?',
        kniff: 'Kleine Dächer lassen sich oft von zwei Leitern an den Giebelseiten aus eindecken.',
        fehler: 'Auf eine morsche Schalung gestiegen: Durchbruchgefahr.',
        sicher: 'Nie auf Wellplatten oder Lichtplatten treten – sie brechen durch.' },
      { t: 'Alte Dachpappe entfernen', min: m => 20 + m.breite * m.tiefe * m.flaechen * 3,
        x: 'Alte Dachpappe mit dem Spachtel lösen und abziehen, Stifte herausziehen oder einschlagen. Reste in Säcke (Bitumen gehört zum Wertstoffhof, nicht in den Hausmüll).',
        kniff: 'An einem kühlen Morgen arbeiten – kalte Pappe bricht leichter ab, warme klebt.',
        fehler: 'Alte Pappe als Untergrund gelassen, obwohl sie Blasen wirft.' },
      { t: 'Schalung prüfen und ausbessern', min: 30,
        x: 'Morsche Bretter ersetzen, hervorstehende Nägel einschlagen, die Fläche fegen. Die Schalung muss trocken sein.',
        kniff: 'Ein neues Brett etwas dicker? Die Kante abschrägen, sonst zeichnet sie sich ab.',
        fehler: 'Auf nasse Schalung eingedeckt: Sie fault darunter weiter.' },
      { t: 'Bahnen verlegen', min: m => 20 + m.breite * m.tiefe * m.flaechen * 4,
        x: 'Rollen einige Stunden vorher ausrollen und entspannen lassen. Bahnen parallel zur Traufe verlegen, an der Traufe beginnen, jede weitere Bahn überlappt die untere um 8–10 cm (wie Dachziegel – Wasser läuft über die Naht, nicht hinein).',
        kniff: 'Bahnen in der Sonne vorwärmen – sie werden geschmeidig und legen sich glatt.',
        fehler: 'Von oben nach unten verlegt: Die Überlappung leitet Wasser unter die Bahn.' },
      { t: 'Nageln und Nähte verkleben', min: m => 15 + m.breite * m.tiefe * m.flaechen * 2,
        x: 'In der Überlappung alle 5–10 cm nageln, sodass die nächste Bahn die Nägel überdeckt. Die Naht zusätzlich mit Bitumen-Kaltkleber verkleben.',
        kniff: 'Nägel nur in die Überlappung – nie mitten in die Fläche, dort wären sie Löcher.',
        fehler: 'Stifte sichtbar mitten in der Bahn: Jede Stelle wird undicht.' },
      { t: 'Traufe, Ortgang und First abschließen', min: 40,
        x: 'An Traufe und Ortgang die Bahn etwa 5 cm über die Kante umschlagen und seitlich nageln bzw. mit Dachrandprofil abdecken. Beim Satteldach einen Firststreifen über beide Seiten legen.',
        kniff: 'Die Ecken diagonal einschneiden und überlappend falten – wie beim Geschenkpapier.',
        fehler: 'Ränder offen: Der Wind hebt die Bahn beim ersten Sturm ab.' }
    ],
    sicherheit: ['Dach nicht betreten, wenn es nicht sicher tragfähig ist; nie auf Well- oder Lichtplatten treten.', 'Leiter standsicher, zweite Person sichert.', 'Nicht bei Nässe, Frost oder Wind.'],
    grenzen: ['Alte Well- oder Faserzementplatten (Asbestverdacht vor 1993) – Fachbetrieb mit Sachkunde.', 'Dachhöhe über ca. 3 m, steiles Dach oder Arbeiten nur vom Dach aus – Dachdecker.', 'Tragkonstruktion morsch – Zimmerer.'],
    rot: (m, o) => o.alt ? 'Graue Well- oder Faserzementplatten auf älteren Gartenhäusern enthalten häufig Asbest. Bitte nicht brechen, nicht bohren, nicht selbst abbauen – Fachbetrieb mit Sachkunde nach TRGS 519 beauftragen.' : (o.hoehe ? 'Höher als ca. 3 m oder steil: Absturzgefahr. Bitte einen Dachdecker beauftragen.' : ''),
    asbest: 'Well- und Ebenplatten aus Faserzement auf Gartenhäusern und Garagen (vor 1993) enthalten oft Asbest – nicht brechen, nicht bohren, nicht reinigen mit Hochdruck.',
    wartung: { monate: 12, monat: 4, text: 'Gartenhausdach ansehen (Blasen, Risse, lose Ränder)', std: false }
  },
  /* ======================================================================= */
  {
    id: 'kontrollrundgang', bereich: 'checks', titel: 'Kontrollrundgang durchs Haus', schwierigkeit: 1,
    kurz: 'Zweimal im Jahr alles Wichtige mit einem Blick: Wasser, Heizung, Strom, Keller, Außen – mit Checkliste.',
    schlagworte: ['kontrollrundgang', 'rundgang', 'haus pruefen', 'haus checkliste', 'hauscheck', 'kontrolle haus', 'haus kontrollieren', 'checkliste haus', 'hausbegehung'],
    aufnahme: { art: 'keine' },
    optionen: [{ id: 'oel', label: 'Haus hat Heizöltank', typ: 'ja', std: false }, { id: 'rueckstau', label: 'Haus hat Rückstausicherung bzw. Hebeanlage', typ: 'ja', std: true }],
    material(m, o) {
      return [P('Taschenlampe bzw. Stirnlampe', 'werkzeug', 1, 'Stk.', { optional: true, hinweis: 'abwählen, wenn vorhanden' }), P('Klebeetiketten und wasserfester Stift (Absperrhähne beschriften)', 'sonstiges', 1, 'Pack.'), P('Ersatzbatterien für Rauchmelder (falls wechselbar)', 'elektro', 1, 'Pack.', { optional: true })];
    },
    werkzeug: ['lampe', 'fernglas', 'zollstock'],
    schritte: [
      { t: 'Rundgang vorbereiten', min: 10,
        x: 'Lampe, Handy für Fotos und diese Checkliste mitnehmen. Mit dem Keller beginnen, dann Wohngeschosse, zum Schluss außen.',
        kniff: 'Immer die gleiche Reihenfolge – dann vergisst man nichts.',
        fehler: 'Nebenbei „mal kurz geschaut“ – ohne Liste bleibt die Hälfte liegen.' },
      { t: 'Wasser: Hauptabsperrhahn und Wasserzähler', min: 15,
        x: 'Hauptabsperrhahn finden, beschriften, einmal zu- und aufdrehen. Wasserzähler bei geschlossenen Zapfstellen ansehen: Dreht sich das kleine Rädchen, gibt es ein Leck. Hauswasserfilter: Datum der letzten Rückspülung?',
        kniff: 'Ein Foto vom Zählerstand mit Datum ist der einfachste Lecktest – nach einigen Stunden ohne Verbrauch vergleichen.',
        fehler: 'Hauptabsperrhahn nie bewegt: Im Notfall sitzt er fest.' },
      { t: 'Heizung und Öltank', min: o => 10,
        x: 'Heizungsdruck am Manometer ablesen, Störungsanzeigen ansehen, Heizraum frei von brennbaren Dingen? Bei Öltank: Sichtkontrolle auf Öl, Füllstand (siehe „Ölheizung durchchecken“).',
        kniff: 'Druckwert und Datum auf einen Zettel am Kessel schreiben.',
        fehler: 'Feuchte Stellen unter Heizungsrohren übersehen.' },
      { t: 'Elektro und Melder', min: 15,
        x: 'FI-Schalter mit der Prüftaste testen (halbjährlich), Sicherungskasten auf Wärme, Geruch, Brandspuren ansehen (nicht öffnen), Rauchmelder-Testknopf drücken, CO- und Wassermelder testen.',
        kniff: 'Die Melder-Tests mit dem FI-Test zusammenlegen – zweimal im Jahr.',
        fehler: 'Piependen Rauchmelder abgenommen und „später“ wieder aufgehängt.',
        sicher: 'Keine Abdeckungen am Sicherungskasten öffnen.' },
      { t: 'Keller, Lichtschächte, Rückstau', min: 20,
        x: 'Kellerwände auf neue Feuchteflecken und Ausblühungen ansehen. Lichtschächte und Kellerabläufe von Laub befreien. Rückstausicherung: Notverschluss laut Anleitung betätigen und wieder öffnen.',
        kniff: 'Ein Foto je Kellerwand – beim nächsten Rundgang vergleichen, ob ein Fleck gewachsen ist.',
        fehler: 'Verstopfter Lichtschacht bei Starkregen: Wasser läuft ins Kellerfenster.' },
      { t: 'Außen: Dach, Rinne, Fassade', min: 20,
        x: 'Vom Boden aus mit Fernglas: verrutschte Ziegel, lose Bleche, Moos, Risse in der Fassade, Dachrinne voll? Außenwasserhahn je nach Jahreszeit auf- bzw. zudrehen.',
        kniff: 'Nach jedem Sturm einmal ums Haus gehen.',
        fehler: 'Auf das Dach gestiegen – das ist Sache des Dachdeckers.',
        sicher: 'Nicht auf das Dach steigen.' },
      { t: 'Ergebnisse notieren', min: 10,
        x: 'In „Mein Haus“ „Erledigt“ antippen und Auffälligkeiten notieren. Für jeden Befund die passende Arbeit in der App öffnen oder einen Fachbetrieb beauftragen.',
        kniff: 'Lieber kleine Mängel sofort beheben – aus Kleinigkeiten werden teure Schäden.',
        fehler: 'Befund notiert, aber nichts unternommen.' }
    ],
    sicherheit: ['Nur ansehen und Prüftasten bedienen – nichts öffnen.', 'Nicht auf Dach oder Leitern über 3 m.'],
    grenzen: ['Alle Befunde an Strom, Gas, Heizung (Brenner), Dach und Tragwerk – Fachbetrieb.'],
    wartung: { monate: 6, monat: 4, text: 'Kontrollrundgang durchs Haus (Checkliste)' }
  },
  /* ======================================================================= */
  {
    id: 'herbst-check', bereich: 'checks', titel: 'Herbst-Check fürs Haus', schwierigkeit: 1,
    kurz: 'Das Haus winterfest machen: Rinne, Außenwasser, Fenster, Heizung, Garten – an einem Samstag erledigt.',
    schlagworte: ['herbst', 'herbstcheck', 'winterfest', 'haus winterfest', 'vor dem winter', 'herbst haus', 'winter vorbereiten', 'haus winterfest machen'],
    aufnahme: { art: 'keine' },
    optionen: [],
    material(m, o) {
      return [P('Gartenabfallsäcke', 'garten', 3, 'Stk.'), P('Beschlagöl und Dichtungspflegestift (Fenster)', 'eisen', 1, 'Stk.', { optional: true }), P('Abdeckhauben für Gartenmöbel bzw. Planen', 'garten', 1, 'Stk.', { optional: true }), P('Streusalz-Alternative (Splitt) für den Winter', 'garten', 1, 'Sack', { optional: true })];
    },
    werkzeug: ['anlegeleiter', 'rinnenschaufel', 'eimer', 'entlueftungsschluessel', 'lampe'],
    schritte: [
      { t: 'Plan für den Tag', min: 10,
        x: 'Einen trockenen Tag im Oktober oder November wählen, nach dem Laubfall. Die Arbeiten in dieser Reihenfolge: Rinne, Außenwasser, Fenster, Heizung, Garten.',
        kniff: 'Die Einzelanleitungen in der App öffnen: „Dachrinne reinigen“, „Außenwasserhahn winterfest machen“, „Fenster einstellen“, „Heizkörper entlüften“.',
        fehler: 'Bis zum ersten Frost gewartet.' },
      { t: 'Dachrinnen und Fallrohre', min: 60,
        x: 'Laub aus Rinnen und Fallrohreinläufen entfernen, Rinne spülen (siehe „Dachrinne reinigen“, Höhengrenze 3 m beachten).',
        kniff: 'Laubschutzgitter sparen die Arbeit im nächsten Jahr.',
        fehler: 'Verstopftes Fallrohr im Winter: Es friert und platzt.',
        sicher: 'Leiter sichern, nicht aufs Dach.' },
      { t: 'Außenwasserhahn absperren', min: 20,
        x: 'Innenventil schließen, Schlauch abnehmen, Leitung entleeren, Außenhahn offen lassen (siehe eigene Anleitung).',
        kniff: 'Gartenschlauch aufrollen und frostfrei lagern.',
        fehler: 'Schlauch am Hahn gelassen: Leitung platzt im Frost.' },
      { t: 'Fenster und Türen', min: 40,
        x: 'Beschläge ölen, Dichtungen pflegen, Papiertest auf Zugluft (siehe „Fenster einstellen“). Haustür- und Terrassentürdichtung prüfen.',
        kniff: 'Anpressdruck der Fenster im Winter auf „fest“ stellen.',
        fehler: 'Dichtungen nie gepflegt: Sie werden hart und rissig.' },
      { t: 'Heizung startklar', min: 40,
        x: 'Thermostatventile durchbewegen, Heizkörper reinigen und entlüften, Heizungsdruck prüfen, Wartungstermin des Heizungsfachbetriebs bestätigt?',
        kniff: 'Zuerst entlüften, dann Druck prüfen und ggf. nachfüllen.',
        fehler: 'Heizung erst beim ersten Frost angeschaltet – und dann Störung.' },
      { t: 'Garten und Terrasse winterfest', min: 60,
        x: 'Gartenmöbel einräumen bzw. abdecken, empfindliche Kübelpflanzen ins Haus, Regentonne leeren, Lichtschächte vom Laub befreien, Splitt für Wege bereitstellen.',
        kniff: 'Regentonnen nicht voll stehen lassen – das Eis sprengt sie.',
        fehler: 'Volle Regentonne über den Winter.' },
      { t: 'Notieren', min: 5,
        x: 'In „Mein Haus“ „Erledigt“ antippen; Auffälligkeiten notieren.',
        kniff: 'Fotos von Dach und Fassade im Herbst und Frühjahr zeigen Veränderungen.',
        fehler: 'Nichts notiert – im nächsten Jahr fängt man von vorne an.' }
    ],
    sicherheit: ['Leiterarbeiten nur bis ca. 3 m mit Sicherung durch zweite Person.', 'Nicht auf das Dach steigen.'],
    grenzen: ['Schäden an Dach, Fassade, Heizung (Brenner) – Fachbetrieb.'],
    wartung: { monate: 12, monat: 10, text: 'Herbst-Check: Haus winterfest machen' }
  },
  /* ======================================================================= */
  {
    id: 'fruehjahrs-check', bereich: 'checks', titel: 'Frühjahrs-Check fürs Haus', schwierigkeit: 1,
    kurz: 'Nach dem Winter nachsehen, was Frost und Sturm angerichtet haben – und den Garten wieder anschließen.',
    schlagworte: ['fruehjahr', 'fruehjahrscheck', 'nach dem winter', 'fruehling haus', 'winterschaeden', 'fruehjahrsputz haus', 'sturmschaden pruefen'],
    aufnahme: { art: 'keine' },
    optionen: [],
    material(m, o) {
      return [P('Gartenabfallsäcke', 'garten', 2, 'Stk.'), P('Dichtungen ½" und ¾" für Gartenschlauch-Kupplungen', 'garten', 1, 'Set', { optional: true })];
    },
    werkzeug: ['fernglas', 'lampe', 'hygrometer', 'gartenschlauch'],
    schritte: [
      { t: 'Dach und Fassade vom Boden aus', min: 20,
        x: 'Mit dem Fernglas rund ums Haus: verrutschte oder gebrochene Ziegel, lose Bleche am Schornstein, Moos, Risse oder Abplatzungen an der Fassade, Frostschäden an Treppen und Sockel.',
        kniff: 'Mit dem Handy durchs Fernglas fotografieren – so lässt sich ein Schaden dem Dachdecker zeigen.',
        fehler: 'Selbst aufs Dach gestiegen.',
        sicher: 'Nicht auf das Dach steigen.' },
      { t: 'Außenwasserhahn öffnen', min: 15,
        x: 'Nach den letzten Frösten (meist Mitte Mai): Entleerung innen schließen, Ventil langsam öffnen, Außenhahn auf Dichtheit prüfen – innen und außen. Schlauch anschließen.',
        kniff: 'Tropft es innen an der Wand: Die Leitung kann im Winter Frost abbekommen haben – Sanitärfachbetrieb.',
        fehler: 'Entleerung innen offen gelassen: Wasser läuft in den Keller.' },
      { t: 'Terrasse und Balkon', min: 30,
        x: 'Abläufe frei? Fugen und Beläge nach dem Frost intakt? Holzterrasse auf Schäden ansehen, Geländer auf festen Sitz prüfen.',
        kniff: 'Holzterrasse jetzt reinigen und ölen (siehe eigene Anleitung).',
        fehler: 'Verstopfter Balkonablauf: Wasser staut sich an der Hauswand.' },
      { t: 'Dachrinne nachsehen', min: 30,
        x: 'Hat sich im Winter Laub oder Moos gesammelt? Rinnenhalter verbogen (Schneelast)? Bei Bedarf reinigen.',
        kniff: 'Bei Regen beobachten: Läuft die Rinne irgendwo über?',
        fehler: 'Verbogene Rinnenhalter ignoriert: Die Rinne verliert Gefälle.' },
      { t: 'Keller lüften und Feuchte prüfen', min: 20,
        x: 'Hygrometer in den Keller stellen. Im Frühjahr und Sommer nur lüften, wenn die Luft draußen kühler bzw. trockener ist (morgens früh) – sonst schlägt sich warme Feuchte an den kalten Wänden nieder.',
        kniff: 'Faustregel: Ist es draußen wärmer als im Keller, Fenster lieber zu lassen.',
        fehler: 'An warmen Sommertagen den Keller gelüftet: Die Wände werden nass.' },
      { t: 'Notieren', min: 5,
        x: 'In „Mein Haus“ „Erledigt“ antippen, Schäden fotografieren und notieren, Fachbetrieb beauftragen, wo nötig.',
        kniff: 'Sturmschäden zeitnah der Gebäudeversicherung melden – mit Fotos.',
        fehler: 'Schaden zu spät gemeldet.' }
    ],
    sicherheit: ['Nicht auf das Dach steigen.', 'Leiterarbeiten nur bis ca. 3 m mit Sicherung.'],
    grenzen: ['Schäden an Dach, Schornstein, Fassade oder Geländer – Fachbetrieb.'],
    wartung: { monate: 12, monat: 4, text: 'Frühjahrs-Check: Winterschäden am Haus prüfen' }
  },
  /* ======================================================================= */
  {
    id: 'kellerwand-feuchte', bereich: 'checks', titel: 'Feuchte Kellerwand einschätzen', schwierigkeit: 1,
    kurz: 'Kondenswasser oder Feuchte von außen? Mit Hygrometer, Folientest und Blick nach draußen die Ursache eingrenzen.',
    schlagworte: ['feuchter keller', 'kellerwand feucht', 'keller feucht', 'nasse kellerwand', 'salpeter', 'ausbluehungen', 'keller muffig', 'keller nass', 'kondenswasser keller', 'feuchte wand keller'],
    aufnahme: { art: 'werte', felder: [{ id: 'flaeche', label: 'Größe der feuchten Fläche (geschätzt)', einheit: 'm²', std: 1, max: 100, min: 0.05 }] },
    optionen: [{ id: 'wasser', label: 'Wasser steht auf dem Boden oder läuft an der Wand herunter', typ: 'ja', std: false }],
    material(m, o) {
      return [
        P('Hygrometer mit Thermometer (digital, mit Min/Max-Speicher)', 'elektro', 1, 'Stk.', { rechnung: ['Zum Vergleich innen/außen und über mehrere Tage.'] }),
        P('Durchsichtige PE-Folie (ca. 50 × 50 cm) und Klebeband', 'bau', 1, 'Stk.', { rechnung: ['Für den Folientest.'] }),
        P('Zollstock und Kreide bzw. Bleistift zum Markieren', 'werkzeug', 1, 'Stk.', { optional: true, hinweis: 'abwählen, wenn vorhanden' })
      ];
    },
    werkzeug: ['hygrometer', 'lampe', 'zollstock', 'bleistift'],
    schritte: [
      { t: 'Erscheinungsbild dokumentieren', min: 15,
        x: 'Die feuchte Stelle fotografieren, Rand mit Bleistift und Datum markieren. Wo liegt sie: unten am Boden (aufsteigend), an der ganzen Wand (Kondensat), an einer Stelle (Leck, Fallrohr)? Weiße Krusten (Salze) zeigen Feuchte, die durch die Wand kommt.',
        kniff: 'Den markierten Rand in einigen Wochen vergleichen – wächst die Fläche?',
        fehler: 'Feuchte Wand sofort überstrichen: Man sieht nichts mehr, das Problem bleibt.' },
      { t: 'Luftfeuchte und Temperatur messen', min: 10, warten: 4320, wartenText: 'Hygrometer 3 Tage beobachten (Min/Max notieren)',
        x: 'Hygrometer in den Keller stellen und drei Tage beobachten, gleichzeitig die Werte draußen notieren (Wetter-App). Über 70 % relative Feuchte im Keller begünstigen Schimmel.',
        kniff: 'Steigt die Kellerfeuchte immer nach dem Lüften an warmen Tagen, ist es Kondensat.',
        fehler: 'Nur einmal gemessen – ein Wert sagt wenig.' },
      { t: 'Folientest', min: 10, warten: 2880, wartenText: 'Folie 24–48 h an der Wand lassen',
        x: 'Ein Stück durchsichtige Folie (ca. 50 × 50 cm) ringsum dicht mit Klebeband an die feuchte Stelle kleben. Nach 24–48 Stunden ansehen: Tropfen auf der Raumseite der Folie = Kondensat aus der Raumluft. Feuchte bzw. Tropfen zwischen Folie und Wand = Feuchte kommt aus der Wand.',
        kniff: 'Die Folie an einer kühlen Stelle ohne direkte Sonne bzw. Heizung anbringen.',
        fehler: 'Folie nicht dicht verklebt: Das Ergebnis ist nicht aussagekräftig.' },
      { t: 'Außen nachsehen', min: 20,
        x: 'An der Außenseite der feuchten Wand: Endet das Fallrohr direkt am Sockel? Fällt das Gelände bzw. Pflaster zur Hauswand hin? Spritzwasser, Beete direkt an der Wand, undichte Lichtschächte, Risse im Sockel?',
        kniff: 'Bei Regen hinsehen, wohin das Wasser läuft.',
        fehler: 'Nur innen gesucht – die Ursache liegt oft außen.' },
      { t: 'Richtig lüften und heizen', min: 10,
        x: 'Bei Kondensat: im Sommer nur lüften, wenn es draußen kühler ist (früh morgens), im Winter kurz stoßlüften. Keller leicht temperieren, Wäsche nicht im Keller trocknen, Möbel von der Wand abrücken. Ein Luftentfeuchter kann helfen.',
        kniff: 'Taupunkt-Faustregel: Warme Sommerluft im kühlen Keller gibt Wasser an die Wände ab.',
        fehler: 'Kellerfenster im Sommer dauernd gekippt.' },
      { t: 'Auswerten', min: 10,
        x: 'Kondensat: Lüften und Temperieren anpassen und weiter beobachten. Feuchte aus der Wand, wachsende Flecken, Salze oder Wasser am Boden: Ursache und Abdichtung vom Fachbetrieb beurteilen lassen.',
        kniff: 'Alle Messwerte und Fotos sammeln – das spart beim Fachbetrieb Zeit und Geld.',
        fehler: 'Teure „Wundermittel“ gekauft, ohne die Ursache zu kennen.' }
    ],
    sicherheit: ['Bei Wasser auf dem Boden: Steckdosen und Geräte im Keller nicht berühren, Sicherung für den Keller ausschalten (falls gefahrlos).', 'Schimmel nicht trocken abbürsten.'],
    grenzen: ['Feuchte kommt aus der Wand, Fläche wächst, Salzausblühungen oder Wasser auf dem Boden – Abdichtung vom Fachbetrieb beurteilen lassen.', 'Schimmel über 0,5 m².'],
    rot: (m, o) => o.wasser ? 'Wasser steht auf dem Boden oder läuft an der Wand: Das ist ein akuter Schaden. Strom im Keller ausschalten (falls gefahrlos), Wasser entfernen und sofort einen Fachbetrieb beauftragen.' : (m.flaeche > 5 ? 'Eine feuchte Fläche über 5 m² deutet auf ein Abdichtungsproblem hin. Bitte von einem Fachbetrieb bzw. Sachverständigen beurteilen lassen.' : ''),
    wartung: { monate: 1, text: 'Feuchte Kellerwand: Markierung und Hygrometer kontrollieren', std: false }
  }
  );
})(typeof window !== 'undefined' ? window : globalThis);
