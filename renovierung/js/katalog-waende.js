/* TW Renovierungs-App – Katalog: Wände & Decken (7 Arbeiten) */
(function (root) {
  'use strict';
  const K = root.TW_KATALOG, R = root.TW_RECHNER, { P, schutz, krepp, abdeckung, tiefgrund } = K;
  const z = R.zahl;

  const ASBEST_WAND = 'In Häusern, die vor 1993 gebaut oder renoviert wurden, können alte Spachtelmassen, Fliesen- und Tapetenkleber sowie Putze Asbest enthalten. Solche Altschichten nicht abschleifen, nicht abfräsen und nicht trocken abkratzen. Bei Verdacht zuerst eine Materialprobe untersuchen lassen bzw. einen Fachbetrieb mit Sachkunde nach TRGS 519 beauftragen.';

  /* Farbverbrauch je Anstrich in l/m² nach Untergrund */
  const VERBRAUCH = { glatt: 0.13, raufaser: 0.18, struktur: 0.20, neu: 0.15 };

  K.arbeiten.push(
  /* ======================================================================= */
  {
    id: 'tapezieren', bereich: 'waende', titel: 'Zimmer tapezieren', schwierigkeit: 2,
    kurz: 'Vlies-, Papier- oder Raufasertapete sauber und lotrecht an die Wand bringen – mit Bahnen-Rechnung wie vom Profi.',
    schlagworte: ['tapezieren', 'tapete', 'tapeten', 'neu tapezieren', 'raufaser', 'vliestapete', 'papiertapete', 'tapete kleben', 'wand tapezieren', 'zimmer tapezieren', 'wohnzimmer tapezieren', 'schlafzimmer tapezieren', 'mustertapete', 'fototapete'],
    aufnahme: { art: 'raum', hoehe: true, oeffnungen: true, hinweis: 'Innenmaße am Boden messen, Höhe vom Boden bis zur Decke. Fenster und Türen mit Rahmen messen.' },
    optionen: [
      { id: 'art', label: 'Welche Tapete?', typ: 'wahl', std: 'vlies', werte: [['vlies', 'Vliestapete (Wand wird eingekleistert)'], ['papier', 'Papiertapete (Bahn wird eingekleistert)'], ['raufaser', 'Raufaser (zum Überstreichen)']] },
      { id: 'rolle', label: 'Rollengröße', typ: 'wahl', std: 'std', werte: [['std', '10,05 × 0,53 m (Standardrolle)'], ['breit', '10,05 × 1,06 m (Breitbahn-Vlies)'], ['gross', '25,00 × 0,53 m (Großrolle Raufaser/Vlies)']] },
      { id: 'rapport', label: 'Musteransatz (Rapport) in cm', typ: 'zahl', std: 0, hilfe: 'Steht auf dem Etikett (Symbol mit Pfeil und Zahl). 0 = ansatzfrei, z. B. Raufaser oder Uni.' },
      { id: 'versetzt', label: 'Versetzter Ansatz (Symbol mit versetzten Pfeilen)', typ: 'ja', std: false },
      { id: 'untergrund', label: 'Zustand der Wand', typ: 'wahl', std: 'gut', werte: [['gut', 'Fest, glatt, schon einmal tapeziert/gestrichen'], ['saugend', 'Stark saugend oder sandend (Wischtest färbt ab)'], ['neu', 'Neuer Putz oder Gipskarton']] },
      { id: 'streichen', label: 'Danach überstreichen (z. B. Raufaser)', typ: 'ja', std: false }
    ],
    vorlauf: 'Tapete mit gleicher Anfertigungs- bzw. Chargennummer kaufen (steht auf dem Etikett) – Nachkauf passt sonst farblich oft nicht. Musterrollen und Sonderfarben zwei Wochen vorher bestellen.',
    material(m, o) {
      const R1 = m.R; const groesse = { std: [10.05, 0.53], breit: [10.05, 1.06], gross: [25, 0.53] }[o.rolle || 'std'];
      const t = R.tapete(R1, { rollenLaenge: groesse[0], rollenBreite: groesse[1], rapport: +o.rapport || 0, versetzt: !!o.versetzt });
      const liste = [];
      if (t.fehler) return [P('Sonderrollen (Raum zu hoch)', 'farbe', 0, 'Rolle', { rechnung: [t.fehler] })];
      const name = { vlies: 'Vliestapete', papier: 'Papiertapete', raufaser: 'Raufasertapete' }[o.art] || 'Tapete';
      const r = [
        `Umfang ${z(R1.umfang)} m ÷ Bahnbreite ${z(t.rolleB)} m = ${z(R1.umfang / t.rolleB)} → ${t.bahnenUmfang} Bahnen`,
        `Volle Bahnen, die Fenster/Türen sparen: − ${t.gespart} → ${t.vollbahnen} volle Bahnen`,
        `Bahnlänge: Raumhöhe ${z(R1.h)} m + 10 cm Zugabe${t.rapportZusatz ? ` + ${z(t.rapportZusatz * 100, 0)} cm Rapport` : ''} = ${z(t.bahnL)} m`,
        `Aus einer Rolle (${z(t.rolleL)} m) passen ${t.proRolle} Bahnen`,
        `${t.vollbahnen} Bahnen ÷ ${t.proRolle} = ${z(t.vollbahnen / t.proRolle)} → ${t.rollen - t.zusatzRollen} Rollen`,
        `${t.kurz.length} kurze Stücke über Türen und über/unter Fenstern kommen aus den Resten${t.zusatzRollen ? ` – dafür ${t.zusatzRollen} Rolle(n) zusätzlich` : ''}`,
        `Ergebnis: ${t.rollen} Rollen (Fläche zum Vergleich: ${z(R1.wandNetto)} m² netto)`
      ];
      liste.push(P(name, 'farbe', t.rollen, 'Rolle', { detail: `${z(t.rolleL)} × ${z(t.rolleB)} m`, rechnung: r, hinweis: 'alle Rollen mit derselben Anfertigungsnummer' }));
      liste.push(P(`${name} – Reserverolle`, 'farbe', 1, 'Rolle', { optional: true, rechnung: ['Fachübliche Reserve für Fehlschnitte und spätere Ausbesserungen (gleiche Anfertigungsnummer).'] }));
      const kl = o.art === 'vlies'
        ? { n: 'Spezial-Vlieskleister (Packung für ca. 20 m²)', proPack: 20 }
        : { n: o.art === 'raufaser' ? 'Raufaser- bzw. Normalkleister (Packung für ca. 15 m²)' : 'Tapetenkleister für Papiertapeten (Packung für ca. 15 m²)', proPack: 15 };
      const flaeche = t.rollen * t.rolleL * t.rolleB;
      const nk = Math.max(1, Math.ceil(R1.wandNetto * 1.1 / kl.proPack));
      liste.push(P(kl.n, 'farbe', nk, 'Pack.', { rechnung: [`Wandfläche netto ${z(R1.wandNetto)} m² + 10 % = ${z(R1.wandNetto * 1.1)} m²`, `÷ ${kl.proPack} m² je Packung → ${nk} Packung(en)`, 'Ergiebigkeit schwankt je Hersteller – Angabe auf der Packung gilt.'] }));
      if (o.untergrund !== 'gut') liste.push(tiefgrund(R1.wandNetto, 0.125, 'Wandfläche'));
      if (o.untergrund === 'neu') liste.push(P('Tapeziergrund / Tapetenwechselgrund (weiß)', 'farbe', R.gebinde(R1.wandNetto * 0.15, [2.5, 5, 10], 'l').stueck, 'Gebinde', { detail: R.gebinde(R1.wandNetto * 0.15, [2.5, 5, 10], 'l').text, rechnung: [`${z(R1.wandNetto)} m² × 0,15 l/m² = ${z(R1.wandNetto * 0.15)} l`, 'Macht spätere Renovierung leichter: Tapete lässt sich dann trocken abziehen, Gipskarton bleibt heil.'] }));
      liste.push(P('Fertigspachtel innen (Tube oder Dose, für Dübellöcher)', 'farbe', 1, 'Stk.', { rechnung: ['Kleinmenge für Löcher und Kanten vor dem Tapezieren.'] }));
      liste.push(P('Abbrechklingen 18 mm (10er-Pack)', 'werkzeug', 1, 'Pack.', { rechnung: ['Nach etwa jeder zweiten Bahn eine frische Klinge – stumpfe Klingen reißen nasse Tapete.'] }));
      liste.push(abdeckung(R1.boden));
      if (o.streichen || o.art === 'raufaser') {
        const anstr = 2, v = VERBRAUCH.raufaser;
        const bed = R1.wandNetto * v * anstr * 1.1; const g = R.gebinde(bed, [2.5, 5, 10], 'l');
        liste.push(P('Wandfarbe weiß, Deckkraft Klasse 2 oder besser', 'farbe', g.stueck, 'Eimer', { detail: g.text, optional: !o.streichen, rechnung: [`${z(R1.wandNetto)} m² × ${z(v)} l/m² (Raufaser) × ${anstr} Anstriche + 10 % = ${z(bed)} l`, `Gebinde: ${g.text}`] }));
        liste.push(krepp(R1.umfang * 2 + R1.oeffKanten, 'Decken- und Sockelkante, Fenster und Türen'));
      }
      liste.push(...schutz('knie'));
      return liste;
    },
    werkzeug: ['zollstock', 'lot', 'bleistift', 'cutter', 'schere', 'tapeziertisch', 'quast', 'eimer', 'ruehrer', 'tapezierbuerste', 'nahtroller', 'tapezierspachtel', 'schwamm', 'leiter', 'spachtel'],
    schritte: [
      { t: 'Raum ausräumen und abdecken', min: m => 45 + m.R.boden * 1.5,
        x: 'Möbel in die Raummitte oder hinaus, Bilder und Nägel entfernen, Boden mit Folie bzw. Vlies abdecken und am Sockel abkleben. Heizkörper-Thermostat auf „0“, damit die Wand nicht zu schnell trocknet.',
        kniff: 'Dübel und Nagellöcher sofort mit Zahnstochern markieren, die Sie stecken lassen – so finden Sie Bilderhaken nach dem Tapezieren wieder.',
        fehler: 'Abdeckfolie nicht festgeklebt: Man rutscht auf ihr und Kleister läuft darunter.',
        sicher: 'Abdeckrahmen von Steckdosen und Schaltern nicht abschrauben – die Tapete wird bündig am Rahmen geschnitten. Sollen Rahmen ab, ist das Arbeit an 230 V: Elektrofachbetrieb.' },
      { t: 'Untergrund prüfen und Löcher spachteln', min: m => 30 + m.R.wandNetto * 0.6, warten: 120, wartenText: 'Spachtel trocknen lassen',
        x: 'Drei Proben: Wischtest (Hand färbt ab → grundieren), Klebebandtest (Band abreißen, Putz bleibt dran → grundieren/festigen), Kratzprobe (Putz bröselt → festigen). Alte Tapeten müssen vollständig ab. Löcher und Risse mit Fertigspachtel füllen und glatt abziehen.',
        kniff: 'Gegen das Licht mit der Taschenlampe flach über die Wand leuchten – so sehen Sie jede Delle, die später durch die Tapete zeichnet.',
        fehler: 'Neue Tapete auf alte Tapete: Die nasse Bahn löst die alte ab, es entstehen Blasen.' },
      { t: 'Schleifen und grundieren', wenn: (m, o) => o.untergrund !== 'gut', min: m => 20 + m.R.wandNetto * 0.8, warten: 720, wartenText: 'Grundierung trocknen lassen (über Nacht)',
        x: 'Gespachtelte Stellen glatt schleifen, Staub abfegen. Tiefgrund mit der Rolle oder dem Quast gleichmäßig auftragen – nicht so viel, dass ein glänzender Film entsteht. Bei neuem Putz oder Gipskarton danach Tapeziergrund.',
        kniff: 'Tiefgrund in eine Wanne gießen, nie in den Originaleimer tauchen – so bleibt der Rest sauber.',
        fehler: 'Auf noch feuchte Grundierung tapezieren: Der Kleister haftet nicht, Bahnen lösen sich an den Nähten.',
        sicher: 'Lüften, Schutzbrille beim Arbeiten über Kopf.' },
      { t: 'Erste Bahn anzeichnen (Lotlinie)', min: 20, tagNeu: (m, o) => o.untergrund !== 'gut',
        x: 'Am Fenster beginnen und vom Licht weg arbeiten. Eine Bahnbreite minus 1 cm von der Ecke messen und mit Lot oder Laser eine senkrechte Linie über die ganze Höhe ziehen. Die erste Bahn liegt an dieser Linie – nicht an der Ecke, denn Ecken sind fast nie gerade.',
        kniff: 'Die Lotlinie mit Bleistift, nie mit Kugelschreiber oder Filzstift ziehen – die schlagen durch helle Tapeten durch.',
        fehler: 'Erste Bahn an der Zimmerecke ausgerichtet: Alle weiteren Bahnen laufen schief, Muster kippen.' },
      { t: 'Kleister anrühren', min: 10, warten: 20, wartenText: 'Kleister quellen lassen', timer: 20,
        x: 'Kaltes, sauberes Wasser in den Eimer, Kleisterpulver unter ständigem Rühren einstreuen (nicht umgekehrt), 20 Minuten quellen lassen und noch einmal durchrühren. Mischungsverhältnis nach Packung – für Vlies dickflüssiger als für Papier.',
        kniff: 'Mit einem Holzstab kreisförmig rühren und dabei langsam einstreuen – so gibt es keine Klümpchen.',
        fehler: 'Pulver auf einmal ins Wasser gekippt: Klümpchen, die später als Beulen unter der Tapete sitzen.' },
      { t: 'Bahnen zuschneiden und kleben', min: (m, o) => { const t = R.tapete(m.R, { rapport: +o.rapport || 0, versetzt: !!o.versetzt }); return (t.vollbahnen || 0) * (o.art === 'vlies' ? 10 : 14) + (t.kurz ? t.kurz.length * 8 : 0); },
        x: 'Bahnen auf Raumhöhe plus 10 cm zuschneiden, bei Mustertapeten den Rapport an der vorherigen Bahn ausrichten und die Bahnen nummerieren. Vlies: Kleister mit der Rolle auf die Wand für ein bis zwei Bahnbreiten auftragen, trockene Bahn ansetzen. Papier/Raufaser: Bahn auf dem Tisch einkleistern, von beiden Enden zur Mitte einschlagen und die Weichzeit laut Etikett abwarten (meist 5–10 Minuten), immer gleich lange. Bahn oben mit Überstand an die Lotlinie setzen, mit Bürste oder Spachtel von der Mitte nach außen andrücken. Nächste Bahn genau auf Stoß – nicht überlappen.',
        kniff: 'Mehrere Papierbahnen nacheinander einkleistern („Weichzeit-Takt“): Während eine weicht, kleben Sie die vorige. Uhr stellen.',
        fehler: 'Unterschiedlich lange Weichzeit: Die Bahnen dehnen sich verschieden, es entstehen Fugen und Blasen.',
        sicher: 'Nie auf dem Tapeziertisch oder auf Stühlen stehen – nur auf einer standsicheren Leiter.' },
      { t: 'Ecken, Fenster, Türen und Steckdosen', min: m => 4 * 10 + (m.R.fenster.length + m.R.tueren.length) * 20,
        x: 'Innenecke: Bahn nur 1 cm um die Ecke führen, abschneiden, Reststück an einer neuen Lotlinie weiterkleben. Fenster und Türen: Bahn überlappen lassen, am Rahmen diagonal einschneiden, andrücken und mit Spachtel und Cutter sauber abschneiden. Steckdosen: Kreuz einschneiden, Lappen am Rahmen abschneiden.',
        kniff: 'Beim Schneiden die Klinge am Spachtel entlangführen und den Spachtel stehen lassen, bis der Schnitt fertig ist – so verrutscht nichts.',
        fehler: 'Eine Bahn über eine ganze Innenecke geklebt: Sie zieht sich beim Trocknen zusammen und reißt oder steht hohl.',
        sicher: 'Mit dem nassen Cutter nur am Abdeckrahmen schneiden, nie in die Dose hinein.' },
      { t: 'Überstände schneiden, Nähte rollen, Kleisterreste abnehmen', min: m => 15 + m.R.umfang * 2,
        x: 'Oben an der Decke und unten am Sockel die Bahn mit dem Spachtel in die Kante drücken und mit frischer Klinge abschneiden. Nähte mit dem Nahtroller leicht andrücken (nicht bei Prägetapeten). Kleister auf der Vorderseite sofort mit feuchtem Schwamm abtupfen.',
        kniff: 'Nahtroller nur leicht führen – zu viel Druck quetscht Kleister heraus und hinterlässt glänzende Streifen.',
        fehler: 'Mit stumpfer Klinge geschnitten: Die nasse Tapete reißt aus. Lieber eine Klinge zu viel abbrechen.' },
      { t: 'Aufräumen und Werkzeug reinigen', min: 45,
        x: 'Folie einrollen, Werkzeug sofort mit warmem Wasser auswaschen, Kleisterreste nicht in den Ausguss kippen (verstopft), sondern antrocknen lassen und in den Restmüll. Möbel erst nach dem Trocknen wieder an die Wand stellen.',
        kniff: 'Ein beschriftetes Reststück Tapete in die Abstellkammer legen – für spätere Ausbesserungen.',
        fehler: 'Schrank direkt an die frische Tapete geschoben: Feuchte staut sich, Schimmelgefahr.' },
      { t: 'Trocknen lassen', min: 10, warten: 1440, wartenText: 'Tapete trocknen lassen (24–48 h)',
        x: 'Fenster und Türen geschlossen halten, keine Zugluft, Heizung nur mäßig. Die Tapete muss langsam und gleichmäßig trocknen. Kleine Blasen ziehen sich in den ersten Stunden meist von selbst glatt.',
        kniff: 'Bleiben Blasen nach 24 Stunden: mit einer Kanüle Kleister einspritzen und andrücken – wie beim Profi.',
        fehler: 'Fenster auf Kipp zum „schnellen Trocknen“: Die Nähte gehen auf.' },
      { t: 'Überstreichen – 1. Anstrich', wenn: (m, o) => !!o.streichen, tagNeu: true, min: m => 40 + m.R.wandNetto * 1.2, warten: 300, wartenText: 'Zwischentrocknung (4–6 h)',
        x: 'Decken-, Fenster- und Sockelkanten abkleben, Ecken und Kanten mit dem Pinsel vorstreichen, dann die Fläche mit der Rolle nass in nass von oben nach unten streichen, Bahn für Bahn vom Fenster weg.',
        kniff: 'Die Rolle in kurzen Kreuzgängen verteilen und zum Schluss senkrecht von oben nach unten ausrollen – so gibt es keine Streifen.',
        fehler: 'Vorgestrichene Kanten sind schon trocken, wenn die Rolle kommt: Es bleiben sichtbare Ränder („Ansätze“).' },
      { t: 'Überstreichen – 2. Anstrich und Kreppband ab', wenn: (m, o) => !!o.streichen, min: m => 30 + m.R.wandNetto * 1.0, warten: 240, wartenText: 'Farbe trocknen lassen',
        x: 'Zweiten Anstrich genauso ausführen. Kreppband abziehen, solange die Farbe noch feucht ist – flach, im spitzen Winkel.',
        kniff: 'Kreppband nie über Nacht kleben lassen – es reißt sonst Farbe mit ab.',
        fehler: 'Zu wenig Farbe aufgenommen, „trocken“ gerollt: Die Raufaser wird fleckig.' }
    ],
    sicherheit: ['Nur auf einer standsicheren Leiter arbeiten, nie auf der obersten Stufe stehen.', 'Cuttermesser immer vom Körper weg führen, Klinge nach Gebrauch einfahren.', 'Steckdosen und Schalter: nicht hineinschneiden, keine Nässe in die Dosen.'],
    grenzen: ['Abdeckrahmen von Steckdosen/Schaltern abschrauben, Leuchten abhängen oder Leitungen verlegen – Arbeit an 230 V.', 'Feuchte oder schimmelige Wandflächen über 0,5 m² – erst die Ursache klären lassen.'],
    asbest: ASBEST_WAND
  },
  /* ======================================================================= */
  {
    id: 'tapete-entfernen', bereich: 'waende', titel: 'Alte Tapete entfernen', schwierigkeit: 1,
    kurz: 'Alte Tapete restlos und schonend von der Wand – trocken, nass oder mit Dampf, je nach Tapete.',
    schlagworte: ['tapete entfernen', 'tapete ab', 'tapete abmachen', 'tapete abziehen', 'tapete abloesen', 'alte tapete', 'tapete runter', 'raufaser entfernen', 'tapetenabloeser', 'tapete abkratzen'],
    aufnahme: { art: 'raum', hoehe: true, oeffnungen: true, hinweis: 'Gerechnet wird die Wandfläche, von der die Tapete ab soll.' },
    optionen: [
      { id: 'alt', label: 'Was hängt an der Wand?', typ: 'wahl', std: 'papier', werte: [['vlies', 'Vliestapete (lässt sich trocken abziehen)'], ['papier', 'Papier- oder Raufasertapete, nicht gestrichen'], ['gestrichen', 'Gestrichene Raufaser / mehrere Schichten'], ['vinyl', 'Abwaschbare Vinyl- oder Prägetapete']] }
    ],
    material(m, o) {
      const R1 = m.R, A = R1.wandNetto, l = [];
      if (o.alt !== 'vlies') {
        const flaschen = Math.max(1, Math.ceil(A / 50));
        l.push(P('Tapetenablöser-Konzentrat (Flasche 500 ml, für ca. 50 m²)', 'farbe', flaschen, 'Fl.', { rechnung: [`Wandfläche ${z(A)} m² ÷ 50 m² je Flasche → ${flaschen}`, 'Mit warmem Wasser nach Etikett verdünnen. Ein Spritzer Spülmittel im Wasser hilft notfalls auch.'] }));
      }
      const saecke = Math.max(2, Math.ceil(A / 12));
      l.push(P('Müllsäcke 120 l (reißfest)', 'reinigung', saecke, 'Stk.', { rechnung: [`${z(A)} m² Tapete, nass etwa 12 m² je Sack → ${saecke} Säcke`, 'Tapetenreste gehören in den Restmüll bzw. Wertstoffhof, nicht ins Altpapier.'] }));
      l.push(abdeckung(R1.boden));
      l.push(krepp(R1.umfang, 'Folie am Sockel festkleben'));
      l.push(P('Fertigspachtel innen (für Ausbrüche nach dem Ablösen)', 'farbe', 1, 'Stk.', { optional: true }));
      l.push(...schutz('brille', 'handschuhe'));
      return l;
    },
    werkzeug: o => ['spachtel', 'stachelwalze', 'spruehflasche', 'eimer', 'schwamm', 'leiter', 'handfeger', ...((o && (o.alt === 'gestrichen' || o.alt === 'vinyl')) ? ['dampf'] : [])],
    schritte: [
      { t: 'Raum vorbereiten und Strom sichern', min: m => 30 + m.R.boden,
        x: 'Möbel hinaus oder in die Mitte, Boden abdecken und Folie am Sockel festkleben. Für die Nassarbeit die Sicherung des Raums im Sicherungskasten ausschalten und Steckdosen sowie Schalter mit Krepp abkleben, damit kein Wasser hineinläuft.',
        kniff: 'Eine Akku-Baustellenlampe oder Stirnlampe bereitlegen, solange die Sicherung aus ist.',
        fehler: 'Wasser läuft hinter Schalterrahmen – Kurzschlussgefahr und Feuchte in der Dose.',
        sicher: 'Steckdosen und Schalter nicht öffnen. Funkt es oder riecht es verschmort: Finger weg, Elektrofachbetrieb.' },
      { t: 'Test: Wie geht die Tapete ab?', min: 10,
        x: 'An einer Ecke unten mit dem Spachtel anheben und ziehen. Vlies kommt oft trocken in ganzen Bahnen ab. Bleibt eine dünne Papierschicht an der Wand, ist das die Trägerschicht – sie wird eingeweicht. Bei abwaschbaren Tapeten erst die obere Kunststoffschicht trocken abziehen.',
        kniff: 'Bei Vlies-auf-Wechselgrund zuerst trocken ziehen – das spart die halbe Arbeit.',
        fehler: 'Gleich mit Wasser angefangen, obwohl die Tapete trocken abgeht: unnötige Nässe und Dreck.' },
      { t: 'Perforieren', wenn: (m, o) => o.alt !== 'vlies', min: m => m.R.wandNetto * 0.4,
        x: 'Mit der Stachelwalze mit leichtem Druck kreuz und quer über die Tapete rollen. Die kleinen Löcher lassen das Wasser hinter die Tapete.',
        kniff: 'Leichter Druck reicht – auf Gipskarton besonders vorsichtig, sonst wird die Kartonschicht verletzt.',
        fehler: 'Mit Gewalt perforiert: Löcher im Putz, die nachher alle gespachtelt werden müssen.' },
      { t: 'Einweichen', wenn: (m, o) => o.alt !== 'vlies', min: m => 10 + m.R.wandNetto * 0.3, warten: 20, wartenText: 'Einwirken lassen (15–20 min)', timer: 20,
        x: 'Warmes Wasser mit Tapetenablöser mit Sprüher, Quast oder Schwamm satt auftragen, abschnittsweise etwa 3–4 m² auf einmal. 15–20 Minuten einwirken lassen, bei Bedarf nachnässen. Gestrichene und mehrlagige Tapeten: Dampfgerät abschnittsweise ansetzen, bis sich die Tapete wellt.',
        kniff: 'Immer nur so viel einweichen, wie Sie in 20 Minuten abziehen können – angetrocknete Tapete muss sonst neu genässt werden.',
        fehler: 'Zu wenig Wasser: Nur die Oberfläche wird feucht, die Tapete reißt in kleinen Fetzen.',
        sicher: 'Dampfgerät: heißer Dampf und Kondenswasser – Handschuhe tragen, nicht über Kopf ohne Schutzbrille arbeiten.' },
      { t: 'Abziehen und abstoßen', min: (m, o) => m.R.wandNetto * ({ vlies: 0.8, papier: 2.2, gestrichen: 3.5, vinyl: 2.8 }[o.alt] || 2.2),
        x: 'Die Tapete mit dem breiten Spachtel flach von unten nach oben abstoßen. Den Spachtel flach halten, damit der Putz nicht verletzt wird. Reste direkt in den Müllsack.',
        kniff: 'Spachtel mit abgerundeten Ecken verwenden – scharfe Ecken reißen Riefen in den Putz.',
        fehler: 'Spachtel steil gehalten: tiefe Kratzer im Putz, die später durch die neue Tapete zeichnen.' },
      { t: 'Reste abwaschen und Wand prüfen', min: m => 20 + m.R.wandNetto * 0.5, warten: 1440, wartenText: 'Wand gründlich trocknen lassen (mind. 24 h)',
        x: 'Kleister- und Papierreste mit Schwamm und warmem Wasser abwaschen. Wand trocknen lassen. Danach Wischtest und Klebebandtest wie beim Tapezieren. Ausbrüche spachteln.',
        kniff: 'Mit der flachen Hand über die trockene Wand fahren: Wo es klebt, sind noch Kleisterreste – die nachwaschen.',
        fehler: 'Auf noch feuchter Wand neu tapeziert oder gestrichen: Blasen und Flecken.' },
      { t: 'Sicherung wieder einschalten und aufräumen', min: 30,
        x: 'Erst wenn alles trocken ist, Krepp von den Steckdosen nehmen und die Sicherung einschalten. Müllsäcke zubinden, Folie einrollen.',
        kniff: 'Ist eine Dose doch nass geworden: Sicherung aus lassen, bis sie sicher trocken ist – im Zweifel Elektrofachbetrieb.',
        fehler: 'Sicherung bei nasser Wand eingeschaltet.' }
    ],
    sicherheit: ['Bei Nassarbeit die Sicherung des Raums ausschalten und Steckdosen abkleben.', 'Dampfgerät: Verbrühungsgefahr, Gerät nie unbeaufsichtigt lassen.', 'Schutzbrille beim Arbeiten über Kopf.'],
    grenzen: ['Steckdosen, Schalter oder Leuchten öffnen bzw. abschrauben – Arbeit an 230 V.', 'Unter der Tapete kommen schwarze Flecken, Feuchte oder Schimmel über 0,5 m² zum Vorschein.'],
    asbest: ASBEST_WAND
  },
  /* ======================================================================= */
  {
    id: 'waende-streichen', bereich: 'waende', titel: 'Wände streichen', schwierigkeit: 1,
    kurz: 'Gleichmäßig deckend streichen ohne Streifen und Ansätze – mit Farbmenge auf den Liter genau.',
    schlagworte: ['streichen', 'wand streichen', 'waende streichen', 'anstreichen', 'malern', 'malen', 'farbe', 'wandfarbe', 'zimmer streichen', 'neu streichen', 'weissen', 'wand malen', 'anstrich'],
    aufnahme: { art: 'raum', hoehe: true, oeffnungen: true },
    optionen: [
      { id: 'untergrund', label: 'Untergrund', typ: 'wahl', std: 'raufaser', werte: [['glatt', 'Glatter Putz, Vlies oder Glattvlies'], ['raufaser', 'Raufaser'], ['struktur', 'Strukturputz / grobe Struktur'], ['neu', 'Neuer Putz oder Gipskarton (wird grundiert)']] },
      { id: 'wechsel', label: 'Farbwechsel', typ: 'wahl', std: 'gleich', werte: [['gleich', 'Gleicher oder ähnlicher heller Ton'], ['stark', 'Starker Wechsel (dunkel → hell oder kräftige Farbe)']] },
      { id: 'decke', label: 'Decke bekommt eine andere Farbe (Deckenkante abkleben)', typ: 'ja', std: true }
    ],
    vorlauf: 'Abgetönte Farbe in einer Mischung für den ganzen Raum anmischen lassen – Nachmischungen weichen oft leicht ab.',
    material(m, o) {
      const R1 = m.R, A = R1.wandNetto, l = [];
      const v = VERBRAUCH[o.untergrund] || 0.15, n = o.wechsel === 'stark' ? 3 : 2;
      const bed = A * v * n * 1.1; const g = R.gebinde(bed, [2.5, 5, 10], 'l');
      l.push(P('Wandfarbe (Dispersion, Deckkraft Klasse 1–2, Nassabrieb Klasse 2–3)', 'farbe', g.stueck, 'Eimer', { detail: g.text, rechnung: [
        `Wandfläche: Umfang ${z(R1.umfang)} m × Höhe ${z(R1.h)} m = ${z(R1.wandBrutto)} m²`,
        `− Fenster ${z(R1.oeffFenster)} m² − Türen ${z(R1.oeffTueren)} m² = ${z(A)} m²`,
        `× ${z(v)} l/m² je Anstrich (${({ glatt: 'glatt', raufaser: 'Raufaser', struktur: 'Struktur', neu: 'neuer Putz' })[o.untergrund]}) × ${n} Anstriche = ${z(A * v * n)} l`,
        `+ 10 % Verlust (Rolle, Eimer, Wanne) = ${z(bed)} l`, `Gebinde: ${g.text}`] }));
      if (o.untergrund === 'neu') l.push(tiefgrund(A, 0.125, 'Wandfläche'));
      l.push(krepp(R1.umfang * (o.decke ? 2 : 1) + R1.oeffKanten, `${o.decke ? 'Decken- und ' : ''}Sockelkante, Fenster und Türen`));
      l.push(abdeckung(R1.boden));
      l.push(P('Abdeckpapier / Abdeckband mit Folie (für Fenster und Heizkörper)', 'farbe', 1, 'Rolle', { optional: true }));
      l.push(P('Maleracryl weiß (für Risse in Ecken und Anschlussfugen)', 'farbe', 1, 'Kartusche', { optional: true, rechnung: ['Für Haarrisse in Raumecken und an Fensterbänken – vor dem Streichen einbringen, überstreichbar.'] }));
      l.push(P('Fertigspachtel innen', 'farbe', 1, 'Stk.', { optional: true }));
      l.push(...schutz('brille'));
      return l;
    },
    werkzeug: o => ['farbrolle', 'teleskop', 'abstreifgitter', 'pinsel', 'eckroller', 'eimer', 'leiter', 'spachtel', 'schleifklotz', 'cutter', 'kartuschenpistole'],
    schritte: [
      { t: 'Raum vorbereiten', min: m => 30 + m.R.boden * 1.5,
        x: 'Möbel in die Mitte, Boden abdecken, Folie am Sockel festkleben. Bilder, Nägel und Dübel heraus, Löcher spachteln, Risse in Ecken mit Maleracryl schließen.',
        kniff: 'Heizkörper vorher einmal warm laufen lassen und dann abdrehen – warme Wände trocknen Farbe zu schnell und erzeugen Ansätze.',
        fehler: 'Gips in Raumecken gespachtelt: Er reißt wieder auf. In Ecken gehört elastisches Acryl.',
        sicher: 'Abdeckrahmen an Steckdosen nicht abschrauben – abkleben (230 V nur durch Elektrofachbetrieb).' },
      { t: 'Abkleben', min: (m, o) => (m.R.umfang * (o.decke ? 2 : 1) + m.R.oeffKanten) * 0.6,
        x: 'Deckenkante, Sockelleisten, Fenster- und Türrahmen, Steckdosen und Schalter mit Malerkrepp abkleben. Kreppband mit dem Fingernagel oder Spachtel fest an die Kante streichen.',
        kniff: 'Bei Raufaser die Kante nach dem Kleben mit der Grundfarbe (alte Wandfarbe) einmal überstreichen – dann läuft die neue Farbe nicht unter das Band.',
        fehler: 'Band nur locker aufgelegt: Die Farbe kriecht darunter, die Kante wird unsauber.' },
      { t: 'Grundieren', wenn: (m, o) => o.untergrund === 'neu', min: m => 20 + m.R.wandNetto * 0.6, warten: 720, wartenText: 'Grundierung trocknen (über Nacht)',
        x: 'Neuen Putz oder Gipskarton mit Tiefgrund gleichmäßig grundieren, damit die Farbe nicht fleckig wegschlägt.',
        kniff: 'Gipskarton-Spachtelstellen saugen anders als der Karton – ohne Grundierung sieht man jede Fuge.',
        fehler: 'Zu viel Tiefgrund: Glänzender Film, auf dem die Farbe schlecht haftet.' },
      { t: 'Kanten und Ecken vorstreichen', tagNeu: false, min: m => (m.R.umfang * 2 + 4 * m.R.h) * 0.5,
        x: 'Farbe gut aufrühren. Mit Pinsel oder kleinem Roller einen etwa 5–8 cm breiten Streifen an Decke, Ecken, Sockel und um Fenster/Türen vorlegen – immer nur für die Wand, die Sie gleich rollen.',
        kniff: 'Wand für Wand arbeiten: Kanten einer Wand streichen, sofort die Fläche rollen. So bleibt alles nass in nass.',
        fehler: 'Alle Kanten im ganzen Raum zuerst gestrichen: Sie sind trocken, bis die Rolle kommt – sichtbare Ränder.' },
      { t: '1. Anstrich rollen', min: m => 20 + m.R.wandNetto * 1.1, warten: 300, wartenText: 'Zwischentrocknung (4–6 h, Etikett beachten)',
        x: 'Rolle im Abstreifgitter gut, aber nicht tropfend sättigen. Bahn für Bahn vom Fenster weg arbeiten: Farbe im Kreuzgang verteilen, dann senkrecht von oben nach unten ohne Druck ausrollen. Jede Bahn überlappt die vorige nass.',
        kniff: 'Die Rolle vorher anfeuchten und gut ausschleudern bzw. mit Kreppband „entflusen“ – dann gibt es keine Fusseln in der Wand.',
        fehler: 'Zu fest gedrückt oder trocken nachgerollt: Streifen und Schatten, die erst bei Streiflicht auffallen.',
        sicher: 'Teleskopstange statt Leiter: weniger Steigen, gleichmäßigerer Druck.' },
      { t: '2. Anstrich rollen', min: m => 20 + m.R.wandNetto * 1.0, warten: 0,
        x: 'Zweiten Anstrich genauso, Kanten erneut vorstreichen. Bei starkem Farbwechsel ist ein dritter Anstrich normal.',
        kniff: 'Mit einer Taschenlampe flach über die Wand leuchten – so sehen Sie Fehlstellen, solange die Farbe noch nass ist.',
        fehler: 'Zweiten Anstrich zu früh aufgebracht: Der erste löst sich an, die Fläche wird wolkig.' },
      { t: '3. Anstrich (bei starkem Farbwechsel)', wenn: (m, o) => o.wechsel === 'stark', min: m => 20 + m.R.wandNetto * 1.0, vorWarten: 300,
        x: 'Nach erneuter Zwischentrocknung den dritten Anstrich aufbringen.',
        kniff: 'Bei kräftigen Farben vorher grau oder im Ton vorgetönten Haftgrund verwenden – spart einen Anstrich.',
        fehler: 'Rot oder Gelb mit zu wenig Anstrichen: wolkiges, ungleichmäßiges Bild.' },
      { t: 'Kreppband ab und aufräumen', min: 40, warten: 720, wartenText: 'Durchtrocknen (Möbel erst am nächsten Tag an die Wand)',
        x: 'Kreppband abziehen, solange die letzte Schicht noch feucht ist – flach und im spitzen Winkel. Rolle und Pinsel sofort auswaschen, Farbreste nicht in den Ausguss (eingetrocknet in den Restmüll, flüssige Reste zum Schadstoffmobil bzw. Wertstoffhof).',
        kniff: 'Rolle über Nacht in eine Plastiktüte einwickeln, statt sie auszuwaschen – so bleibt sie für den nächsten Tag weich.',
        fehler: 'Krepp erst Tage später abgezogen: Die Farbe reißt mit ab.' }
    ],
    sicherheit: ['Gut lüften, aber Zugluft beim Trocknen vermeiden.', 'Schutzbrille beim Streichen über Kopf.', 'Leiter standsicher, nie auf die oberste Stufe.'],
    grenzen: ['Abdeckrahmen von Steckdosen/Schaltern abschrauben oder Leuchten abhängen – Arbeit an 230 V.', 'Wiederkehrende Risse, die breiter als 2 mm sind oder treppenförmig verlaufen – Statik prüfen lassen.'],
    asbest: ASBEST_WAND
  },
  /* ======================================================================= */
  {
    id: 'decke-streichen', bereich: 'waende', titel: 'Decke streichen', schwierigkeit: 2,
    kurz: 'Eine gleichmäßig weiße Decke ohne Streifen – mit der richtigen Rollrichtung zum Licht.',
    schlagworte: ['decke streichen', 'decke', 'zimmerdecke', 'decke weissen', 'decke malen', 'deckenfarbe', 'decke anstreichen'],
    aufnahme: { art: 'raum', hoehe: true, oeffnungen: false, hinweis: 'Die Höhe wird für Leiter und Teleskopstange gebraucht.' },
    optionen: [
      { id: 'untergrund', label: 'Deckenoberfläche', typ: 'wahl', std: 'raufaser', werte: [['glatt', 'Glatt (Putz, Gipskarton, Glattvlies)'], ['raufaser', 'Raufaser'], ['struktur', 'Strukturputz'], ['leimfarbe', 'Alte Leimfarbe (färbt beim Reiben stark ab)']] },
      { id: 'kante', label: 'Wände haben eine andere Farbe (Kante abkleben)', typ: 'ja', std: true }
    ],
    material(m, o) {
      const R1 = m.R, A = R1.decke, l = [];
      const v = o.untergrund === 'glatt' ? 0.13 : o.untergrund === 'struktur' ? 0.20 : 0.16;
      const bed = A * v * 2 * 1.1; const g = R.gebinde(bed, [2.5, 5, 10], 'l');
      l.push(P('Deckenfarbe (matt, spritzarm, Deckkraft Klasse 1–2)', 'farbe', g.stueck, 'Eimer', { detail: g.text, rechnung: [`Deckenfläche ${z(R1.l)} × ${z(R1.b)} m = ${z(A)} m²`, `× ${z(v)} l/m² × 2 Anstriche = ${z(A * v * 2)} l`, `+ 10 % Verlust = ${z(bed)} l`, `Gebinde: ${g.text}`] }));
      if (o.untergrund === 'leimfarbe') {
        l.push(P('Spezialgrund für Leimfarben bzw. Haftgrund', 'farbe', R.gebinde(A * 0.15, [2.5, 5, 10], 'l').stueck, 'Gebinde', { detail: R.gebinde(A * 0.15, [2.5, 5, 10], 'l').text, rechnung: [`Erst abwaschen, dann ${z(A)} m² × 0,15 l/m² = ${z(A * 0.15)} l`] }));
      }
      if (o.kante) l.push(krepp(R1.umfang, 'Wand-Decken-Kante'));
      l.push(abdeckung(R1.boden));
      l.push(...schutz('brille'));
      return l;
    },
    werkzeug: ['farbrolle', 'teleskop', 'abstreifgitter', 'pinsel', 'eckroller', 'eimer', 'leiter', 'schwamm'],
    schritte: [
      { t: 'Raum vorbereiten, Leuchte sichern', min: m => 30 + m.R.boden * 1.5,
        x: 'Raum möglichst leer räumen, Boden und verbleibende Möbel vollständig abdecken. Die Deckenleuchte bleibt hängen und wird mit Folie und Krepp großzügig eingepackt.',
        kniff: 'Eine Lampenfassung kann zum Schutz in eine Plastiktüte gesteckt werden – Leuchte vorher ausschalten.',
        fehler: 'Möbel nur halb abgedeckt: Deckenfarbe spritzt auch bei „spritzarmer“ Farbe.',
        sicher: 'Leuchte nicht selbst abnehmen – Arbeit an 230 V. Dafür eine Elektrofachkraft.' },
      { t: 'Alte Leimfarbe abwaschen', wenn: (m, o) => o.untergrund === 'leimfarbe', min: m => 20 + m.R.decke * 3, warten: 1440, wartenText: 'Trocknen lassen und grundieren',
        x: 'Leimfarbe (wischt sich mit dem Finger stark ab) mit viel warmem Wasser und Schwamm vollständig abwaschen. Nach dem Trocknen mit Spezialgrund grundieren.',
        kniff: 'Wassertest: Ein nasser Schwamm löst Leimfarbe sofort milchig an – Dispersionsfarbe nicht.',
        fehler: 'Neue Farbe auf Leimfarbe: Sie blättert in Schollen ab.' },
      { t: 'Kante abkleben', wenn: (m, o) => !!o.kante, min: m => m.R.umfang * 0.8,
        x: 'Malerkrepp an der Wand, direkt unter der Deckenkante, sauber andrücken.',
        kniff: 'Krepp auf Raufaser vorher mit der Wandfarbe versiegeln – dann bleibt die Kante scharf.',
        fehler: 'Krepp an die Decke geklebt statt an die Wand: Die Kante liegt falsch.' },
      { t: 'Ränder vorstreichen und 1. Anstrich', min: m => 25 + m.R.decke * 1.6, warten: 300, wartenText: 'Zwischentrocknung (4–6 h)',
        x: 'Rand rundum 5–8 cm breit mit Pinsel oder Eckroller vorstreichen. Dann die Fläche mit Teleskopstange rollen, zügig nass in nass. Beim ersten Anstrich quer zum Fenster rollen.',
        kniff: 'Stellen Sie sich so, dass das Licht seitlich auf die frisch gerollte Fläche fällt – nasse Fehlstellen glänzen dann sichtbar.',
        fehler: 'Pausen mitten in der Fläche: Die Ränder trocknen an, es bleiben Ansätze.',
        sicher: 'Schutzbrille! Farbspritzer im Auge sofort mit viel Wasser ausspülen.' },
      { t: '2. Anstrich – zum Licht hin', min: m => 25 + m.R.decke * 1.4, warten: 360, wartenText: 'Trocknen lassen',
        x: 'Den zweiten Anstrich in Richtung des einfallenden Lichts rollen (vom Fenster in den Raum). Die letzten Rollbahnen verlaufen so parallel zum Licht und zeichnen sich nicht ab.',
        kniff: 'Rolle zum Schluss ohne neue Farbe in einem Zug über die ganze Länge führen („Abrollen“).',
        fehler: 'Letzter Anstrich quer zum Licht: Jede Rollbahn ist als Streifen sichtbar.' },
      { t: 'Krepp ab und aufräumen', min: 30,
        x: 'Kreppband abziehen, solange die Farbe frisch ist. Werkzeug auswaschen, Folie vorsichtig einrollen (Farbspritzer nach innen).',
        kniff: 'Rolle in Tüte einpacken, wenn am nächsten Tag Wände folgen.',
        fehler: 'Folie mit nassen Spritzern zusammengeknüllt und über den Boden gezogen.' }
    ],
    sicherheit: ['Arbeiten über Kopf: Schutzbrille, Nacken entlasten (Teleskopstange).', 'Leiter oder Podest standsicher, nicht seitlich hinauslehnen.'],
    grenzen: ['Deckenleuchten abnehmen oder anschließen – Arbeit an 230 V.', 'Risse in der Decke mit Durchbiegung, abplatzender Putz in Altbauten (Schilfrohrdecke) – Statik bzw. Fachbetrieb.'],
    asbest: 'In Häusern vor 1993 können alte Deckenplatten, Spritzputze und Spachtelmassen Asbest enthalten. Nicht abschleifen oder abkratzen – bei Verdacht Materialprobe bzw. Fachbetrieb mit Sachkunde nach TRGS 519.'
  },
  /* ======================================================================= */
  {
    id: 'holzdecke', bereich: 'waende', titel: 'Holzdecke (Paneele) montieren', schwierigkeit: 3,
    kurz: 'Paneele auf einer Lattung an die Decke bringen – mit Lattenplan, Krallen- und Dübelrechnung.',
    schlagworte: ['holzdecke', 'paneele', 'deckenpaneele', 'paneel', 'profilholz', 'nut und feder', 'decke verkleiden', 'deckenverkleidung', 'holz decke', 'decke abhaengen', 'lattung'],
    aufnahme: { art: 'raum', hoehe: true, oeffnungen: false, hinweis: 'Die Paneele laufen entlang der Länge, die Latten quer dazu.' },
    optionen: [
      { id: 'paket', label: 'Inhalt eines Pakets in m² (steht auf dem Paket)', typ: 'zahl', std: 2.5 },
      { id: 'deckbreite', label: 'Deckbreite eines Paneels in cm', typ: 'zahl', std: 12.5, hilfe: 'Sichtbare Breite ohne Feder.' },
      { id: 'abstand', label: 'Lattenabstand in cm (laut Hersteller)', typ: 'zahl', std: 40, hilfe: 'Für dünne Paneele meist 30–40 cm, für Profilholz bis 60 cm.' },
      { id: 'decke', label: 'Woraus besteht die Decke?', typ: 'wahl', std: 'beton', werte: [['beton', 'Beton oder Mauerwerk'], ['holz', 'Holzbalken (verputzt/verkleidet)'], ['gips', 'Gipskarton / unbekannt']] }
    ],
    vorlauf: 'Paneele mindestens 48 Stunden vor der Montage im Raum lagern (ausgepackt bzw. Folie geöffnet), damit sie sich an Temperatur und Luftfeuchte anpassen.',
    material(m, o) {
      const R1 = m.R, A = R1.decke, l = [];
      const paket = +o.paket > 0 ? +o.paket : 2.5, deck = (+o.deckbreite > 0 ? +o.deckbreite : 12.5) / 100, ab = (+o.abstand > 0 ? +o.abstand : 40) / 100;
      const bedarf = A * 1.10; const pakete = Math.ceil(R.rund(bedarf / paket, 6));
      l.push(P('Deckenpaneele', 'holz', pakete, 'Paket', { detail: `je ${z(paket)} m²`, rechnung: [`Deckenfläche ${z(R1.l)} × ${z(R1.b)} m = ${z(A)} m²`, `+ 10 % Verschnitt (gerade Verlegung) = ${z(bedarf)} m²`, `÷ ${z(paket)} m² je Paket = ${z(bedarf / paket)} → ${pakete} Pakete`] }));
      const nLatten = Math.ceil(R.rund(R1.l / ab, 6)) + 1; const lm = nLatten * R1.b; const lmV = lm * 1.1; const stk = Math.ceil(lmV / 2.5);
      l.push(P('Dachlatten / Konterlatten 24 × 48 mm, gehobelt, trocken (2,50 m)', 'holz', stk, 'Stk.', { rechnung: [`Länge ${z(R1.l)} m ÷ Abstand ${z(ab)} m = ${z(R1.l / ab)} → ${nLatten - 1} Felder + 1 = ${nLatten} Latten`, `${nLatten} Latten × ${z(R1.b)} m Raumbreite = ${z(lm)} lfm`, `+ 10 % Verschnitt = ${z(lmV)} lfm ÷ 2,50 m = ${stk} Latten`, 'Latten quer zu den Paneelen, äußere Latten 5 cm von der Wand.'] }));
      const proLatte = Math.ceil(R.rund(R1.b / 0.5, 6)) + 1; const duebel = nLatten * proLatte; const dg = R.gebinde(duebel * 1.05, [25, 50, 100], 'Stk.');
      const dname = o.decke === 'holz' ? 'Holzbauschrauben 5 × 80 mm (in die Balken)' : o.decke === 'gips' ? 'Befestigung nach Prüfung der Decke (siehe Hinweis)' : 'Nageldübel / Schlagschrauben 6 × 60 mm';
      l.push(P(dname, 'eisen', dg.stueck, 'Pack.', { detail: dg.text, rechnung: [`Je Latte alle 50 cm ein Befestigungspunkt: ${z(R1.b)} m ÷ 0,5 + 1 = ${proLatte}`, `${nLatten} Latten × ${proLatte} = ${duebel} Stück + 5 % = Packungen: ${dg.text}`] }));
      const reihen = Math.ceil(R.rund(R1.b / deck, 6)); const krallen = Math.ceil(reihen * nLatten * 1.05); const kg = R.gebinde(krallen, [100, 250], 'Stk.');
      l.push(P('Profilholzkrallen / Paneelclips mit Nägeln oder Klammern', 'eisen', kg.stueck, 'Pack.', { detail: kg.text, rechnung: [`Paneelreihen: Breite ${z(R1.b)} m ÷ Deckbreite ${z(deck)} m = ${reihen}`, `${reihen} Reihen × ${nLatten} Latten = ${reihen * nLatten} Kreuzungen + 5 % = ${krallen} Krallen`, `Packungen: ${kg.text}`] }));
      const leiste = R1.umfang * 1.1; const ls = Math.ceil(leiste / 2.4);
      l.push(P('Abschlussleiste / Deckenleiste (2,40 m)', 'holz', ls, 'Stk.', { rechnung: [`Umfang ${z(R1.umfang)} m + 10 % Gehrungen = ${z(leiste)} m ÷ 2,40 m → ${ls} Leisten`] }));
      l.push(P('Leistenstifte bzw. Montagekleber für die Abschlussleiste', 'eisen', 1, 'Pack.'));
      l.push(P('Ausgleichsplättchen / Unterlegkeile (zum Ausrichten der Lattung)', 'eisen', 1, 'Pack.'));
      l.push(...schutz('brille', 'gehoer', 'ffp2'));
      return l;
    },
    werkzeug: ['zollstock', 'wasserwaage', 'bleistift', 'leitungssucher', 'bohrmaschine', 'akkuschrauber', 'kappsaege', 'handsaege', 'stichsaege', 'hammer', 'winkel', 'leiter'],
    schritte: [
      { t: 'Paneele akklimatisieren', min: 20, warten: 2880, wartenText: 'Paneele 48 h im Raum lagern – in der Zeit die Lattung montieren', parallel: true,
        x: 'Pakete flach im Raum lagern und öffnen. Holz arbeitet: Ohne Anpassung entstehen später Fugen oder die Paneele wölben sich.',
        kniff: 'Pakete auf Latten legen, nicht direkt auf kalten Estrich.',
        fehler: 'Paneele aus der kalten Garage sofort verlegt.' },
      { t: 'Decke prüfen und Leitungen orten', min: 30,
        x: 'Mit dem Leitungssucher die Decke absuchen (Strom- und Wasserleitungen, Fußbodenheizung darüber). Untergrund feststellen: Beton, Holzbalken oder Gipskarton. Höhenrisslinie für die Lattung mit Wasserwaage oder Laser bestimmen.',
        kniff: 'Leitungen zu Deckenleuchten laufen meist gerade von der Wand zur Leuchte – diesen Streifen beim Bohren meiden und markieren.',
        fehler: 'Ins Blaue gebohrt: Ein angebohrtes Kabel oder Rohr wird zum teuren Schaden.',
        sicher: 'Im Bereich von Leitungen nicht bohren. Die Leuchte wird von einer Elektrofachkraft abgeklemmt und später wieder angeschlossen.' },
      { t: 'Lattung anbringen und ausrichten', min: (m, o) => { const n = Math.ceil(m.R.l / ((+o.abstand || 40) / 100)) + 1; return 30 + n * 18; },
        x: 'Latten quer zur späteren Paneelrichtung im berechneten Abstand anzeichnen, die äußeren 5 cm von der Wand. Alle 50 cm befestigen. Mit der langen Wasserwaage prüfen und Unebenheiten mit Ausgleichsplättchen unterfüttern.',
        kniff: 'Erst die zwei äußeren Latten exakt ausrichten, dann eine Schnur dazwischen spannen – alle mittleren Latten an der Schnur ausrichten.',
        fehler: 'Lattung nicht ausgerichtet: Jede Delle der Rohdecke zeichnet sich in der Paneeldecke ab.',
        sicher: 'Gehörschutz, Schutzbrille und Staubmaske beim Bohren über Kopf.' },
      { t: 'Erste Paneelreihe setzen', nachParallel: true, min: 40,
        x: 'Die erste Reihe mit der Feder zur Wand und 10–15 mm Abstand zur Wand (Dehnfuge) ansetzen und exakt gerade ausrichten – sie bestimmt alles Weitere. An jeder Latte mit einer Kralle befestigen, an der Wandseite verdeckt durch die spätere Abschlussleiste.',
        kniff: 'Die Wand ist fast nie gerade: Die erste Reihe an einer Schnur ausrichten, nicht an der Wand.',
        fehler: 'Ohne Dehnfuge an die Wand gestoßen: Im Sommer wölbt sich die Decke.' },
      { t: 'Fläche verlegen', min: (m, o) => m.R.decke * 22,
        x: 'Reihe für Reihe einschieben, Nut über Feder, und an jeder Latte mit Krallen befestigen. Stöße der Paneele immer auf einer Latte und versetzt anordnen.',
        kniff: 'Ein Reststück Paneel als Schlagholz nutzen – nie direkt auf die Feder schlagen.',
        fehler: 'Stöße zwischen den Latten: Die Enden hängen durch und klappern.' },
      { t: 'Letzte Reihe zuschneiden', min: 40,
        x: 'Restbreite an mehreren Stellen messen (minus Dehnfuge), Paneel längs zuschneiden und mit einem Nagel bzw. einer Schraube verdeckt an der Wandseite befestigen.',
        kniff: 'Mit der Stichsäge von der Rückseite sägen – so splittert die Sichtseite nicht.',
        fehler: 'Letzte Reihe eingeklemmt: Sie drückt die ganze Fläche aus der Flucht.' },
      { t: 'Abschlussleisten montieren', min: m => 20 + m.R.umfang * 4,
        x: 'Leisten auf Gehrung schneiden und an der Lattung bzw. Wand befestigen – sie verdecken die Dehnfuge. Danach die Leuchte durch die Elektrofachkraft anschließen lassen.',
        kniff: 'Außenecken zuerst schneiden, dann die Innenecken anpassen.',
        fehler: 'Leiste an die Paneele genagelt: Die Paneele können sich nicht mehr bewegen.' }
    ],
    sicherheit: ['Bohren über Kopf: Schutzbrille, Gehörschutz, Staubmaske FFP2.', 'Leitungssucher verwenden, nie im Bereich von Leitungen bohren.', 'Nur auf standsicherem Podest oder Leiter arbeiten; lange Paneele zu zweit montieren.'],
    grenzen: ['Deckenleuchten abklemmen, versetzen oder neue Einbauspots einbauen – Arbeit an 230 V.', 'Dachschräge oder Decke unter einem kalten Dachboden: Dampfbremse und Dämmung dürfen nicht verletzt werden – Fachbetrieb.', 'Gipskarton- oder alte Putzdecken mit unklarer Tragfähigkeit (Schilfrohr, Lehmwickel) – Befestigung und Statik vom Fachbetrieb prüfen lassen.'],
    asbest: 'Alte Deckenplatten (z. B. Faserzement oder Leichtbauplatten) in Häusern vor 1993 nicht anbohren oder entfernen, bevor geklärt ist, dass sie asbestfrei sind.'
  },
  /* ======================================================================= */
  {
    id: 'spachteln', bereich: 'waende', titel: 'Löcher und Risse spachteln', schwierigkeit: 1,
    kurz: 'Dübellöcher, Ausbrüche und Haarrisse unsichtbar schließen – bereit zum Streichen oder Tapezieren.',
    schlagworte: ['spachteln', 'loch', 'loecher', 'riss', 'risse', 'duebelloch', 'loch in der wand', 'wand ausbessern', 'putz ausbessern', 'gips', 'zuspachteln', 'haarriss'],
    aufnahme: { art: 'werte', felder: [
      { id: 'klein', label: 'Kleine Löcher (Dübel, Nägel)', einheit: 'Stück', std: 10, max: 300, ganz: true },
      { id: 'gross', label: 'Größere Ausbrüche (bis ca. 5 cm)', einheit: 'Stück', std: 2, max: 50, ganz: true, pflicht: false },
      { id: 'riss', label: 'Risse – Gesamtlänge', einheit: 'm', std: 2, max: 50, pflicht: false }
    ] },
    optionen: [
      { id: 'rissart', label: 'Wie sehen die Risse aus?', typ: 'wahl', std: 'haar', werte: [['haar', 'Haarrisse unter 1 mm, im Putz'], ['putz', 'Putzrisse bis 2 mm'], ['gross', 'Breiter als 2 mm, treppenförmig oder wiederkehrend']] },
      { id: 'ecke', label: 'Risse in Raumecken oder an Anschlüssen (Fenster, Decke)', typ: 'ja', std: false }
    ],
    material(m, o) {
      const l = [];
      const vKlein = (m.klein || 0) * 0.004, vGross = (m.gross || 0) * 0.08, vRiss = (m.riss || 0) * 0.125;
      const vol = vKlein + vGross + vRiss; // Liter
      const r = [`Kleine Löcher: ${m.klein || 0} × ca. 4 cm³ = ${z(vKlein, 3)} l`, `Ausbrüche: ${m.gross || 0} × ca. 80 cm³ = ${z(vGross, 3)} l`, `Risse: ${z(m.riss || 0)} m × ca. 125 cm³/m (aufweiten + Überzug) = ${z(vRiss, 3)} l`, `Summe ${z(vol, 3)} l`];
      if (vol <= 0.25) l.push(P('Fertigspachtel innen (Dose ca. 400–500 g)', 'farbe', 1, 'Dose', { rechnung: [...r, 'Kleinmenge → eine Dose Fertigspachtel genügt (bleibt verschlossen lange haltbar).'] }));
      else { const kg = vol * 1.1 * 1.15; const g = R.gebinde(kg, [1, 5], 'kg'); l.push(P('Gipsspachtel / Füllspachtel (Pulver)', 'farbe', g.stueck, 'Sack', { detail: g.text, rechnung: [...r, `× 1,1 kg Pulver je Liter + 15 % Verlust = ${z(kg)} kg`, `Gebinde: ${g.text}`] })); }
      if ((m.riss || 0) > 0 && o.rissart !== 'gross') {
        const n = Math.max(1, Math.ceil((m.riss * 1.1) / 20));
        l.push(P('Gewebe-Rissband selbstklebend (50 mm × 20 m)', 'farbe', n, 'Rolle', { rechnung: [`${z(m.riss)} m Riss + 10 % = ${z(m.riss * 1.1)} m ÷ 20 m → ${n}`] }));
      }
      if (o.ecke) l.push(P('Maleracryl weiß (für Ecken und Anschlussfugen)', 'farbe', Math.max(1, Math.ceil((m.riss || 1) / 12)), 'Kartusche', { rechnung: ['Bewegliche Fugen (Ecken, Fensteranschluss) nicht mit Gips, sondern mit Acryl schließen. Eine Kartusche reicht für ca. 12 m Fuge.'] }));
      l.push(P('Schleifgitter / Schleifpapier Körnung 120 und 180', 'farbe', 1, 'Pack.'));
      l.push(P('Tiefgrund (kleines Gebinde 1 l)', 'farbe', 1, 'Fl.', { optional: true, rechnung: ['Für sandende Ausbruchstellen und vor dem Streichen über großen Spachtelflächen.'] }));
      l.push(...schutz('ffp2', 'brille'));
      return l;
    },
    werkzeug: ['spachtel', 'cutter', 'schleifklotz', 'eimer', 'schwamm', 'kartuschenpistole', 'pinsel', 'leiter'],
    schritte: [
      { t: 'Risse beurteilen', min: 10,
        x: 'Rissbreite mit einer Münze oder einem Rissmaßstab prüfen. Haarrisse im Putz sind harmlos. Treppenförmige Risse im Mauerwerk, Risse breiter als 2 mm oder Risse, die nach dem Spachteln wiederkommen, deuten auf Bewegungen im Bauwerk hin.',
        kniff: 'Bei Verdacht ein Stück Gips-„Siegel“ über den Riss streichen und Datum dazuschreiben. Reißt es in ein paar Wochen, arbeitet der Riss noch.',
        fehler: 'Bewegungsrisse einfach zugespachtelt – sie kommen wieder, die eigentliche Ursache bleibt.' },
      { t: 'Löcher und Risse vorbereiten', min: m => 10 + (m.klein || 0) * 0.5 + (m.gross || 0) * 4 + (m.riss || 0) * 4,
        x: 'Dübel herausziehen (Schraube halb eindrehen und mit der Zange ziehen). Lose Putzteile entfernen. Risse mit dem Cutter oder Spachtel leicht V-förmig aufweiten, damit die Masse hält. Staub abpinseln, die Stellen leicht anfeuchten.',
        kniff: 'Bei sandendem Putz vorher etwas Tiefgrund in die Löcher pinseln – sonst „verdurstet“ die Spachtelmasse und reißt.',
        fehler: 'Spachtel auf staubigen Untergrund: Die Masse fällt nach dem Trocknen wieder heraus.',
        sicher: 'Vor dem Aufbohren größerer Löcher: Leitungssucher. Oberhalb und unterhalb von Steckdosen und Schaltern verlaufen meist Leitungen senkrecht.' },
      { t: 'Füllen (1. Schicht)', min: m => 10 + (m.klein || 0) * 1 + (m.gross || 0) * 5 + (m.riss || 0) * 3, warten: m => (m.gross || 0) > 0 ? 180 : 60, wartenText: 'Trocknen lassen',
        x: 'Spachtelmasse nach Packung klumpenfrei anrühren und nur so viel, wie Sie in 20–30 Minuten verarbeiten. Löcher satt füllen, über Kreuz abziehen. Tiefe Ausbrüche in mehreren dünnen Schichten füllen.',
        kniff: 'Gipsspachtel immer in einen sauberen Becher anmischen – alte Reste lassen die neue Masse sofort abbinden.',
        fehler: 'Tiefe Löcher in einem Zug gefüllt: Die Masse schrumpft und reißt beim Trocknen.' },
      { t: 'Rissband und zweite Schicht', wenn: m => (m.riss || 0) > 0 || (m.gross || 0) > 0, min: m => 10 + (m.riss || 0) * 4 + (m.gross || 0) * 3, warten: 180, wartenText: 'Durchtrocknen',
        x: 'Über Risse das Gewebeband mittig aufkleben und dünn überspachteln, Ränder breit und flach auslaufen lassen. Zweite Schicht auf die Ausbrüche, wo die erste eingesunken ist.',
        kniff: 'Spachtelränder sehr dünn „auf Null“ ausziehen – dann muss kaum geschliffen werden.',
        fehler: 'Rissband dick überspachtelt: Es entsteht ein sichtbarer Wulst unter der Farbe.' },
      { t: 'Ecken mit Acryl schließen', wenn: (m, o) => !!o.ecke, min: m => 10 + (m.riss || 1) * 3, warten: 60, wartenText: 'Acryl antrocknen (überstreichbar nach Etikett)',
        x: 'Risse in Raumecken, an der Decke und an Fensterbänken mit Maleracryl ausspritzen und mit nassem Finger oder Fugenglätter glätten.',
        kniff: 'Spitze der Kartusche schräg und eher zu klein abschneiden – lieber zweimal nachschneiden.',
        fehler: 'Silikon statt Acryl in Wandecken: Silikon lässt sich nicht überstreichen.' },
      { t: 'Schleifen und grundieren', min: m => 10 + (m.klein || 0) * 0.5 + (m.gross || 0) * 2 + (m.riss || 0) * 2, warten: 240, wartenText: 'Grundierung trocknen, dann streichen oder tapezieren',
        x: 'Trockene Stellen mit Schleifgitter (120, dann 180) plan schleifen, Staub abwischen. Größere Spachtelflächen vor dem Streichen grundieren, damit sie nicht matter wirken als die Wand.',
        kniff: 'Mit der Taschenlampe streifend über die Stelle leuchten – so sehen Sie jede Kante.',
        fehler: 'Ohne Grundierung überstrichen: Die gespachtelten Stellen „scheinen“ als Flecken durch.',
        sicher: 'Beim Schleifen FFP2-Maske und Schutzbrille.' }
    ],
    sicherheit: ['Leitungssucher, bevor ein Loch aufgebohrt oder ausgestemmt wird.', 'Staubmaske und Schutzbrille beim Schleifen.'],
    grenzen: ['Risse breiter als 2 mm, treppenförmig im Mauerwerk, durchgehend durch die Wand oder immer wiederkehrend: Statik vom Fachbetrieb bzw. Tragwerksplaner beurteilen lassen.', 'Feuchte oder salzige Ausblühungen am Riss – Ursache (Feuchte) klären lassen.'],
    rot: (m, o) => o.rissart === 'gross' ? 'Diese Risse deuten auf Bewegungen im Bauwerk hin. Bitte nicht zuspachteln, sondern vom Fachbetrieb bzw. Tragwerksplaner beurteilen lassen.' : '',
    asbest: ASBEST_WAND
  },
  /* ======================================================================= */
  {
    id: 'schimmel', bereich: 'waende', titel: 'Kleinen Schimmelfleck behandeln', schwierigkeit: 1,
    kurz: 'Kleine, oberflächliche Schimmelflecken (unter 0,5 m²) sicher entfernen – und die Ursache finden.',
    schlagworte: ['schimmel', 'schimmelfleck', 'schimmel entfernen', 'stockflecken', 'schwarze flecken', 'schimmel wand', 'schimmel ecke', 'feuchte wand', 'moder', 'muffig'],
    aufnahme: { art: 'werte', felder: [
      { id: 'flaeche', label: 'Befallene Fläche gesamt', einheit: 'm²', std: 0.1, max: 0.5, schritt: 0.05, hilfe: 'Alle Flecken im Raum zusammengerechnet. Ein DIN-A4-Blatt sind 0,06 m².' }
    ] },
    optionen: [
      { id: 'untergrund', label: 'Wo sitzt der Schimmel?', typ: 'wahl', std: 'putz', werte: [['putz', 'Auf gestrichenem Putz'], ['tapete', 'Auf Tapete'], ['silikon', 'In einer Silikonfuge (Bad/Küche)']] },
      { id: 'gesundheit', label: 'Im Haushalt leben Menschen mit Allergie, Asthma, geschwächter Abwehr oder Säuglinge', typ: 'ja', std: false }
    ],
    material(m, o) {
      const l = [];
      l.push(P('Ethanol 70–80 % (Apotheke/Drogerie) – alternativ Isopropanol 70 %', 'sonstiges', 1, 'Fl. (1 l)', { rechnung: [`${z(m.flaeche)} m² Befall – 1 Liter reicht für mehrere Behandlungen.`, 'Nach Leitfaden des Umweltbundesamts für kleine Flächen geeignet. Kein Chlor, keine Essig- oder Hausmittel-Mischungen.'] }));
      l.push(P('Einweg-Wischtücher / Küchenrolle', 'reinigung', 1, 'Pack.'));
      l.push(P('Müllbeutel (dicht verschließbar)', 'reinigung', 1, 'Rolle'));
      l.push(P('Hygrometer (digital)', 'elektro', 1, 'Stk.', { rechnung: ['Zum Finden der Ursache: Luftfeuchte im Raum dauerhaft unter 60 %, besser 40–55 %.'] }));
      if (o.untergrund === 'putz') l.push(P('Mineralische Innenfarbe (Silikat- oder Kalkfarbe), kleines Gebinde', 'farbe', 1, 'Eimer', { optional: true, rechnung: ['Nach dem Austrocknen zum Überstreichen der Stelle. Mineralische Farben sind alkalisch und schimmelhemmend ohne Biozide.'] }));
      if (o.untergrund === 'silikon') l.push(P('Sanitär-Silikon (Kartusche 300 ml) – siehe Arbeit „Silikonfugen erneuern“', 'sanitaer', 1, 'Kartusche', { rechnung: ['Schimmel in Silikon sitzt im Material – die Fuge muss raus und neu gemacht werden.'] }));
      l.push(...schutz('ffp2', 'handschuhe', 'brille'));
      return l;
    },
    werkzeug: ['spruehflasche', 'spachtel', 'hygrometer'],
    schritte: [
      { t: 'Größe und Lage einschätzen', min: 10,
        x: 'Fläche abschätzen: Bis etwa 0,5 m² oberflächlicher Befall dürfen Sie selbst entfernen. Größer, tief im Putz, hinter Möbeln großflächig oder immer wiederkehrend: Ursache und Sanierung vom Fachbetrieb.',
        kniff: 'Schwarze, grünliche oder pelzige Flecken mit muffigem Geruch sind fast immer Schimmel. Fotografieren Sie die Stelle mit einem Zollstock daneben – so sehen Sie später, ob sie wächst.',
        fehler: 'Schimmel einfach überstrichen: Er wächst durch die Farbe wieder durch.' },
      { t: 'Schützen und Fläche befeuchten', min: 10,
        x: 'FFP2-Maske, Handschuhe und Schutzbrille aufsetzen. Fenster öffnen, Tür zum Rest der Wohnung schließen. Befallene Stelle leicht mit Wasser besprühen, damit beim Abwischen keine Sporen aufwirbeln.',
        kniff: 'Einen Müllbeutel direkt unter der Stelle offen bereithalten – alles kommt sofort hinein.',
        fehler: 'Trocken abgebürstet oder abgesaugt (ohne Spezialfilter): Die Sporen verteilen sich im ganzen Raum.',
        sicher: 'Ethanol ist leicht entzündlich: nicht rauchen, keine offene Flamme, keine heißen Heizlüfter in der Nähe, gut lüften.' },
      { t: 'Befallene Tapete entfernen', wenn: (m, o) => o.untergrund === 'tapete', min: 15,
        x: 'Die befeuchtete Tapete im befallenen Bereich großzügig (ca. 20 cm über den sichtbaren Rand hinaus) abziehen, direkt in den Beutel geben und diesen verschließen.',
        kniff: 'Mit der Sprühflasche nachfeuchten, bevor Sie weiterziehen.',
        fehler: 'Befallene Tapete in der Wohnung herumgetragen und erst später entsorgt.' },
      { t: 'Mit Alkohol behandeln', min: m => 10 + m.flaeche * 30, warten: 30, wartenText: 'Einwirken lassen',
        x: 'Ethanol (70–80 %) mit Tuch oder Sprühflasche satt auftragen, einwirken lassen und mit Einwegtüchern abwischen. Tuch nach jedem Wisch wechseln. Vorgang einmal wiederholen.',
        kniff: 'Immer von außen nach innen wischen – so tragen Sie nichts in saubere Bereiche.',
        fehler: 'Mit demselben Tuch mehrfach über die Fläche gewischt.',
        sicher: 'Behandlung von Silikonfugen: Schimmel sitzt im Silikon, Abwischen hilft nur kurz – Fuge erneuern.' },
      { t: 'Abfall entsorgen und lüften', min: 10, warten: 1440, wartenText: 'Stelle austrocknen lassen',
        x: 'Tücher, Handschuhe und Maske in den Beutel, dicht verschließen und in den Restmüll. Raum gut stoßlüften.',
        kniff: 'Heizung im Raum leicht aufdrehen, damit die Stelle schneller trocknet.',
        fehler: 'Den Beutel offen im Haus stehen lassen.' },
      { t: 'Ursache finden und abstellen', min: 20,
        x: 'Hygrometer in den Raum stellen und eine Woche beobachten. Ideal sind 40–55 % Luftfeuchte. Drei- bis viermal am Tag 5–10 Minuten stoßlüften (Fenster ganz auf, nicht gekippt), Räume nicht unter 16 °C auskühlen lassen, Möbel 5–10 cm von Außenwänden abrücken. Nach Duschen und Kochen sofort lüften.',
        kniff: 'Kommt der Fleck immer an derselben Stelle der Außenwand (Ecke, Fensterlaibung) wieder, ist es meist eine Wärmebrücke oder Feuchte von außen – das gehört in Fachhände.',
        fehler: 'Fenster dauerhaft gekippt: Die Laibung kühlt aus, dort entsteht neuer Schimmel.' },
      { t: 'Nach dem Austrocknen streichen', min: 30, tagNeu: true, wenn: (m, o) => o.untergrund !== 'silikon',
        x: 'Wenn die Stelle nach zwei bis vier Wochen schimmelfrei bleibt, mit mineralischer Farbe (Silikat- oder Kalkfarbe) überstreichen bzw. neu tapezieren.',
        kniff: 'Mit Bleistift ein Datum neben die Stelle schreiben und in „Mein Haus“ eine Erinnerung setzen.',
        fehler: 'Zu früh überstrichen – ob die Ursache behoben ist, sieht man erst nach Wochen.' }
    ],
    sicherheit: ['FFP2-Maske, Schutzhandschuhe und Schutzbrille tragen.', 'Ethanol ist entzündlich: Rauchen und offene Flammen verboten, gut lüften.', 'Keine Chlorreiniger mit anderen Reinigern mischen (giftige Gase).'],
    grenzen: ['Befall größer als 0,5 m², tief im Putz oder hinter Verkleidungen.', 'Schimmel kommt trotz richtigem Lüften immer wieder (Wärmebrücke, Wasserschaden, aufsteigende Feuchte).', 'Im Haushalt leben Menschen mit Allergien, Asthma, geschwächter Abwehr oder Säuglinge – dann gar nicht selbst entfernen.'],
    rot: (m, o) => (m.flaeche > 0.5 ? 'Die Fläche ist größer als 0,5 m². Nach dem Leitfaden des Umweltbundesamts gehört das in die Hände eines Fachbetriebs – Ursache klären und fachgerecht sanieren.' : '') || (o.gesundheit ? 'Bei Allergien, Asthma, geschwächter Abwehr oder Säuglingen im Haushalt bitte gar nicht selbst entfernen – Fachbetrieb beauftragen.' : ''),
    wartung: { monate: 1, text: 'Behandelte Schimmelstelle kontrollieren, Luftfeuchte ablesen' }
  }
  );
})(typeof window !== 'undefined' ? window : globalThis);
