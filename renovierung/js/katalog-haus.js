/* TW Renovierungs-App – Katalog: Türen & Fenster (2), Heizung (4), Elektro & Sicherheit (2), Außen & Garten (4) */
(function (root) {
  'use strict';
  const K = root.TW_KATALOG, R = root.TW_RECHNER, { P, schutz } = K;
  const z = R.zahl;

  K.arbeiten.push(
  /* ======================================================================= */
  {
    id: 'zimmertuer', bereich: 'tueren', titel: 'Zimmertür einstellen', schwierigkeit: 1,
    kurz: 'Tür schleift, fällt nicht ins Schloss oder klappert? Bänder, Falle und Schließblech richtig einstellen.',
    schlagworte: ['tuer', 'zimmertuer', 'tuer schleift', 'tuer klemmt', 'tuer schliesst nicht', 'tuer haengt', 'tuer quietscht', 'tuer einstellen', 'tuerband', 'scharnier', 'schliessblech', 'tuer klappert', 'innentuer'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl Türen', einheit: 'Stück', std: 1, max: 20, ganz: true }] },
    optionen: [
      { id: 'problem', label: 'Was ist los?', typ: 'wahl', std: 'schleift', werte: [['schleift', 'Tür schleift oben oder unten'], ['schloss', 'Falle rastet nicht ein / Tür fällt nicht ins Schloss'], ['klappert', 'Tür klappert im geschlossenen Zustand'], ['quietscht', 'Tür quietscht']] },
      { id: 'band', label: 'Art der Bänder', typ: 'wahl', std: 'einbohr', werte: [['einbohr', 'Einbohrbänder (Zapfen, Standard)'], ['3d', 'Verstellbare 3D-Bänder (Abdeckkappe mit Schrauben)'], ['verdeckt', 'Verdeckt liegende Bänder']] }
    ],
    material(m, o) {
      const l = [];
      if (o.problem === 'schleift' && o.band === 'einbohr') l.push(P('Bandringe / Tür-Distanzringe (passend zum Zapfen-Ø, meist 13 oder 15 mm)', 'eisen', 1, 'Pack.', { rechnung: ['Ein bis zwei Ringe je Band heben das Türblatt um je ca. 1–2 mm an.'] }));
      if (o.problem === 'quietscht' || o.problem === 'schleift') l.push(P('Bänderfett bzw. säurefreies Fett oder Graphitpulver', 'eisen', 1, 'Tube'));
      if (o.problem === 'schloss' || o.problem === 'klappert') l.push(P('Ersatz-Schließblech bzw. Schließblech mit verstellbarer Lasche (Maß abnehmen)', 'eisen', 1, 'Stk.', { optional: true }));
      l.push(P('Spray für Schloss und Falle (Teflon- oder Silikonspray, kein Öl)', 'eisen', 1, 'Dose', { optional: true }));
      return l;
    },
    werkzeug: o => ['schraubendreher', 'inbus', 'zollstock', 'bleistift', ...(o && o.band === 'einbohr' ? ['hammer'] : [])],
    schritte: [
      { t: 'Fehler einkreisen', min: 10,
        x: 'Tür langsam schließen und beobachten: Wo schleift sie (Farbabrieb an Zarge oder Boden)? Steht der Spalt oben gleichmäßig breit? Trifft die Falle das Schließblech mittig?',
        kniff: 'Ein Blatt Papier rundum in den Spalt halten und die Tür schließen: Wo es klemmt, ist zu wenig Luft.',
        fehler: 'Gleich die Tür abgehobelt, obwohl nur das Türblatt abgesackt ist.' },
      { t: 'Türblatt anheben (Einbohrbänder)', wenn: (m, o) => o.band === 'einbohr' && o.problem === 'schleift', min: m => 10 + (m.anzahl || 1) * 15,
        x: 'Tür ganz öffnen und senkrecht nach oben aushängen (zu zweit!). Bandringe auf die Zapfen der Zarge stecken, Zapfen fetten, Tür wieder einhängen. Schleift sie oben, statt unten: Spalt prüfen – das obere Band zieht sich evtl. aus der Zarge.',
        kniff: 'Einen Keil unter das geöffnete Türblatt schieben und als Hebel nutzen – so heben Sie die Tür ohne Kraft aus.',
        fehler: 'Zu viele Ringe: Die Tür schleift dann oben an der Zarge.',
        sicher: 'Türblätter sind schwer (15–40 kg) – zu zweit aushängen, Füße aus dem Weg.' },
      { t: '3D-Bänder verstellen', wenn: (m, o) => o.band !== 'einbohr', min: m => 10 + (m.anzahl || 1) * 15,
        x: 'Abdeckkappen abnehmen. An den Stellschrauben (meist Innensechskant 4 mm) kann die Tür in Höhe, Seite und Andruck verstellt werden. Immer beide bzw. alle Bänder gleichmäßig verstellen – nur kleine Schritte (Vierteldrehung) und zwischendurch prüfen.',
        kniff: 'Die Ausgangsstellung jeder Schraube mit Bleistiftstrich markieren – so finden Sie immer zurück.',
        fehler: 'Nur ein Band verstellt: Die Tür verkantet und schleift woanders.' },
      { t: 'Schließblech anpassen', wenn: (m, o) => o.problem === 'schloss' || o.problem === 'klappert', min: m => 15 + (m.anzahl || 1) * 15,
        x: 'Falle mit Lippenstift oder Kreide einfärben, Tür schließen: Der Abdruck zeigt, wo die Falle das Schließblech trifft. Schließblech lösen und um wenige Millimeter versetzen bzw. die Lasche leicht nach innen biegen (gegen Klappern) oder die Einstell-Lasche verstellen.',
        kniff: 'Bei Klappern genügt oft, die Lasche des Schließblechs mit einem Schraubendreher eine Spur nach innen zu biegen.',
        fehler: 'Neue Schraublöcher direkt neben die alten gebohrt: Die Schrauben halten nicht. Alte Löcher mit Holzdübel und Leim füllen.' },
      { t: 'Schmieren und prüfen', min: 10,
        x: 'Bänder mit etwas Fett, die Falle mit Spray behandeln (kein Öl – es verharzt und zieht Staub an). Tür mehrfach öffnen und schließen.',
        kniff: 'Fett sparsam: Ein Tropfen auf den Zapfen genügt, Überschuss abwischen.',
        fehler: 'Kriechöl verwendet: Es zieht nach kurzer Zeit Staub an und die Tür quietscht wieder.' }
    ],
    sicherheit: ['Türen zu zweit aushängen.', 'Finger aus dem Bandbereich, wenn die Tür bewegt wird.'],
    grenzen: ['Tür schleift, weil sich die Zarge oder die Wand bewegt hat (Risse, Durchbiegung) – Statik prüfen lassen.', 'Brandschutz- oder Rauchschutztüren (Schild im Falz) – nur Fachbetrieb, Zulassung erlischt sonst.'],
    wartung: { monate: 12, text: 'Türbänder und Schlösser pflegen' }
  },
  /* ======================================================================= */
  {
    id: 'fenster', bereich: 'tueren', titel: 'Fenster einstellen und Dichtungen erneuern', schwierigkeit: 2,
    kurz: 'Zieht es am Fenster oder schließt es schwer? Beschläge justieren, pflegen und Dichtungen tauschen.',
    schlagworte: ['fenster', 'fenster zieht', 'fenster undicht', 'fensterdichtung', 'dichtung', 'fenster einstellen', 'fenster schliesst schwer', 'fenster klemmt', 'zugluft', 'fensterbeschlag', 'fenster pflege', 'fenster justieren'],
    aufnahme: { art: 'werte', felder: [
      { id: 'anzahl', label: 'Anzahl Fensterflügel', einheit: 'Stück', std: 4, max: 60, ganz: true },
      { id: 'b', label: 'Flügelbreite (typisch)', einheit: 'm', std: 0.9, max: 3, min: 0.3 },
      { id: 'h', label: 'Flügelhöhe (typisch)', einheit: 'm', std: 1.3, max: 3, min: 0.3 }
    ] },
    optionen: [
      { id: 'dichtung', label: 'Dichtungen tauschen', typ: 'ja', std: true },
      { id: 'material', label: 'Fensterrahmen', typ: 'wahl', std: 'kunststoff', werte: [['kunststoff', 'Kunststoff'], ['holz', 'Holz'], ['alu', 'Aluminium']] }
    ],
    vorlauf: 'Dichtungsprofil vorher bestimmen: Ein kleines Stück an einer unauffälligen Ecke herausziehen und mitnehmen bzw. das Profil fotografieren und mit dem Profilkatalog im Handel vergleichen.',
    material(m, o) {
      const l = []; const u = 2 * (m.b + m.h); const ges = u * m.anzahl * 1.05;
      if (o.dichtung) l.push(P('Fensterdichtung passend zum Profil (Meterware)', 'eisen', Math.ceil(ges), 'm', { rechnung: [`Umfang je Flügel: 2 × (${z(m.b)} + ${z(m.h)}) = ${z(u)} m`, `× ${m.anzahl} Flügel = ${z(u * m.anzahl)} m + 5 % = ${z(ges)} m`, 'Hinweis: Bei vielen Fenstern liegen Dichtungen im Flügel UND im Rahmen – dann Menge verdoppeln.'] }));
      l.push(P('Beschlag-Pflegeöl bzw. Beschlagfett (harz- und säurefrei)', 'eisen', 1, 'Stk.'));
      l.push(P('Dichtungspflegestift (Silikon/Glycerin)', 'eisen', 1, 'Stk.', { rechnung: ['Hält Dichtungen elastisch – einmal im Jahr.'] }));
      if (o.material === 'holz') l.push(P('Dichtungskleber bzw. Klammern für Holzfenster', 'eisen', 1, 'Stk.', { optional: true }));
      return l;
    },
    werkzeug: ['inbus', 'schraubendreher', 'cutter', 'schere', 'zollstock', 'lampe'],
    schritte: [
      { t: 'Papiertest: Wo ist es undicht?', min: m => 5 + m.anzahl * 2,
        x: 'Ein Blatt Papier zwischen Flügel und Rahmen klemmen, Fenster schließen und ziehen. Lässt sich das Papier leicht herausziehen, liegt die Dichtung dort nicht an. Rundum an mehreren Stellen prüfen.',
        kniff: 'Abends mit einer Taschenlampe von innen leuchten, während jemand draußen schaut – Lichtspalte zeigen undichte Stellen.',
        fehler: 'Dichtungen getauscht, obwohl nur der Beschlag nachgestellt werden musste.' },
      { t: 'Beschläge reinigen und schmieren', min: m => 5 + m.anzahl * 5,
        x: 'Alle beweglichen Beschlagteile (Pilzkopfzapfen, Schließstücke, Getriebe, Scheren) von Staub befreien und mit einem Tropfen Beschlagöl schmieren. Fenster mehrmals öffnen und schließen.',
        kniff: 'Die Bewegung der Schließzapfen zeigt sich beim Drehen des Griffs – genau dort ölen, wo Metall auf Metall reibt.',
        fehler: 'Fett auf die Dichtungen: Sie quellen auf und werden klebrig.' },
      { t: 'Anpressdruck einstellen', min: m => 5 + m.anzahl * 8,
        x: 'Die Pilzkopf- bzw. Exzenterzapfen am Flügel lassen sich mit Inbus 4 mm oder Zange drehen: Markierung zur Rauminnenseite = mehr Anpressdruck (Winter), nach außen = weniger (Sommer). Alle Zapfen eines Flügels gleich einstellen.',
        kniff: 'Auf die Markierung (Strich oder Punkt) am Zapfen achten – vorher Ausgangsstellung fotografieren.',
        fehler: 'Anpressdruck maximal gestellt: Der Griff geht schwer, Beschlag und Dichtung verschleißen schnell.' },
      { t: 'Flügel nachstellen (wenn er schleift)', min: m => 5 + m.anzahl * 8,
        x: 'Schleift der Flügel unten am Rahmen, hängt er ab: Am unteren Ecklager (Abdeckkappe abnehmen) mit Inbus die Höhe bzw. Seite verstellen, am oberen Scherenlager die Seite. Immer nur kleine Schritte.',
        kniff: 'Mit dem Zollstock den Spalt zum Rahmen rundum messen – ideal ist er überall gleich (meist ca. 12 mm Falzluft).',
        fehler: 'Viel auf einmal gedreht: Der Flügel verkantet, der Griff lässt sich nicht mehr drehen.' },
      { t: 'Dichtungen tauschen', wenn: (m, o) => !!o.dichtung, min: m => 10 + m.anzahl * 15,
        x: 'Alte Dichtung an einer Ecke anheben und aus der Nut ziehen. Nut reinigen. Neue Dichtung an der Oberseite mittig beginnend ohne Zug eindrücken, in den Ecken nicht schneiden, sondern um die Ecke führen; Stoß oben mittig sauber auf Länge schneiden.',
        kniff: 'Neue Dichtung nie ziehen oder dehnen – sie schrumpft später zurück und es entstehen Lücken in den Ecken.',
        fehler: 'Dichtung in den Ecken geschnitten und gestoßen: Dort zieht es wieder.' },
      { t: 'Dichtungen pflegen und prüfen', min: m => 5 + m.anzahl * 2,
        x: 'Dichtungen mit Pflegestift einreiben. Papiertest wiederholen.',
        kniff: 'Jedes Jahr im Herbst wiederholen – dann halten Dichtungen viele Jahre.',
        fehler: 'Dichtungen mit Lösemitteln gereinigt – sie werden hart.' }
    ],
    sicherheit: ['Fensterflügel nie aushängen, ohne die Sicherheitsschere zu kennen – Flügel können herausfallen.', 'Bei Arbeiten in oberen Geschossen nicht hinauslehnen.'],
    grenzen: ['Beschädigte Isolierglasscheibe (beschlägt innen zwischen den Scheiben) – Glaserei.', 'Flügel aushängen bei schweren oder großen Elementen, Beschlag gebrochen – Fachbetrieb.', 'Feuchte Laibung, Schimmel am Anschluss oder Wasser unter der Fensterbank – Anschluss/Abdichtung vom Fachbetrieb prüfen.'],
    wartung: { monate: 12, monat: 10, text: 'Fensterbeschläge ölen, Dichtungen pflegen (vor dem Winter)' }
  },
  /* ======================================================================= */
  {
    id: 'heizkoerper-entlueften', bereich: 'heizung', titel: 'Heizkörper entlüften', schwierigkeit: 1,
    kurz: 'Gluckern und kalte Heizkörper oben? Luft ablassen – und danach den Anlagendruck prüfen.',
    schlagworte: ['entlueften', 'heizung entlueften', 'heizkoerper entlueften', 'heizkoerper gluckert', 'heizung gluckert', 'heizkoerper kalt', 'luft in der heizung', 'heizkoerper oben kalt', 'heizung rauscht', 'entlueftungsschluessel'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl Heizkörper', einheit: 'Stück', std: 8, max: 60, ganz: true }, { id: 'etagen', label: 'Anzahl Etagen', einheit: 'Etagen', std: 2, max: 6, ganz: true }] },
    optionen: [{ id: 'nachfuellen', label: 'Nachfüllset vorhanden (Schlauch mit Systemtrenner)', typ: 'ja', std: false }],
    material(m, o) {
      return [
        P('Küchenrolle bzw. alte Lappen', 'reinigung', 1, 'Rolle', { optional: true }),
        P('Heizungs-Nachfüllset mit Systemtrenner (siehe „Heizungsdruck prüfen“)', 'heizung', o.nachfuellen ? 0 : 1, 'Stk.', { optional: true, rechnung: ['Nur nötig, wenn der Druck nach dem Entlüften unter den Sollwert fällt.'] })
      ].filter(p => p.menge > 0);
    },
    werkzeug: ['entlueftungsschluessel', 'becher', 'lampe'],
    schritte: [
      { t: 'Heizung warm machen, Pumpe aus', min: 10, warten: 60, wartenText: 'Pumpe aus, Luft sammelt sich oben (ca. 1 h)', timer: 60,
        x: 'Alle Thermostatventile ganz aufdrehen (Stufe 5), Heizung laufen lassen, bis alle Heizkörper warm sind. Dann die Umwälzpumpe bzw. die Heizung abschalten (am Regler auf „Aus“ oder „Standby“) und etwa eine Stunde warten – so steigt die Luft nach oben und das Wasser beruhigt sich.',
        kniff: 'Anlagendruck am Manometer der Heizung vorher ablesen und notieren.',
        fehler: 'Bei laufender Pumpe entlüftet: Es wird ständig neue Luft angesaugt bzw. Wasser spritzt.',
        sicher: 'Nur Ein/Aus am Bedienteil – Gehäuse der Heizung nicht öffnen, keine Brennereinstellungen.' },
      { t: 'Entlüften – unten anfangen', min: m => 5 + (m.anzahl || 1) * 4,
        x: 'Im untersten Geschoss beginnen, Etage für Etage nach oben. Lappen und Becher unter das Entlüftungsventil halten, Schlüssel aufstecken und langsam eine halbe Umdrehung gegen den Uhrzeigersinn öffnen. Es zischt (Luft). Sobald Wasser ohne Blasen kommt, sofort schließen.',
        kniff: 'Den Schlüssel nie ganz herausdrehen – eine halbe Umdrehung reicht.',
        fehler: 'Ventil ganz aufgedreht: Der Ventilstift fällt heraus, heißes Wasser läuft.',
        sicher: 'Das Wasser kann heiß sein (bis 70 °C) – Handschuhe oder Lappen um die Finger.' },
      { t: 'Heizung wieder einschalten', min: 5, warten: 30, wartenText: 'Heizung laufen lassen',
        x: 'Heizung wieder einschalten, Thermostate auf die gewohnte Stufe stellen. Nach etwa 30 Minuten prüfen, ob alle Heizkörper gleichmäßig warm sind.',
        kniff: 'Gluckert es noch: Den Vorgang nach einem Tag wiederholen.',
        fehler: 'Thermostate auf 5 gelassen – unnötiger Verbrauch.' },
      { t: 'Druck prüfen', min: 5,
        x: 'Manometer ablesen. Ist der Druck unter den Sollwert gefallen (bei Einfamilienhäusern meist 1,0–2,0 bar, Markierung am Manometer bzw. Anleitung der Heizung), Wasser nachfüllen – siehe Arbeit „Heizungsdruck prüfen und nachfüllen“.',
        kniff: 'Den Sollwert mit einem kleinen Klebepunkt am Manometer markieren.',
        fehler: 'Nach dem Entlüften nicht nachgefüllt: Die Heizung geht wegen Wassermangel auf Störung.' }
    ],
    sicherheit: ['Heißes Wasser: vorsichtig öffnen, Lappen bereithalten.', 'Keine Eingriffe in Brenner, Gasleitungen oder Steuerung der Heizung.'],
    grenzen: ['Heizung muss sehr oft entlüftet werden (mehrmals pro Saison) – Ursache (Undichtigkeit, Ausdehnungsgefäß, Pumpe) vom Heizungsfachbetrieb klären lassen.', 'Gasgeruch: Fenster auf, keine Schalter betätigen, Haus verlassen, Notruf des Gasversorgers.'],
    wartung: { monate: 12, monat: 10, text: 'Heizkörper vor der Heizperiode entlüften' }
  },
  /* ======================================================================= */
  {
    id: 'heizungsdruck', bereich: 'heizung', titel: 'Heizungsdruck prüfen und nachfüllen', schwierigkeit: 2,
    kurz: 'Manometer ablesen und – mit vorgeschriebenem Systemtrenner – richtig Wasser nachfüllen.',
    schlagworte: ['heizungsdruck', 'druck heizung', 'heizung druck', 'heizung nachfuellen', 'wasser nachfuellen heizung', 'manometer', 'druck zu niedrig', 'heizung stoerung druck', 'bar heizung', 'heizungswasser'],
    aufnahme: { art: 'werte', felder: [{ id: 'ist', label: 'Abgelesener Druck (kalt)', einheit: 'bar', std: 0.8, max: 4, min: 0, schritt: 0.1, pflicht: false }, { id: 'soll', label: 'Solldruck laut Anleitung/Markierung', einheit: 'bar', std: 1.5, max: 3, min: 0.5, schritt: 0.1 }] },
    optionen: [{ id: 'set', label: 'Nachfüllset mit Systemtrenner vorhanden', typ: 'ja', std: false }, { id: 'oft', label: 'Druck fällt öfter als einmal im Jahr deutlich ab', typ: 'ja', std: false }],
    material(m, o) {
      const l = [];
      if (!o.set) l.push(P('Heizungs-Nachfüllset mit Systemtrenner (Typ BA bzw. CA nach DIN EN 1717)', 'heizung', 1, 'Stk.', { rechnung: ['Heizungswasser darf nicht ins Trinkwasser zurückfließen – ein Systemtrenner ist vorgeschrieben. Ein einfacher Gartenschlauch ist nicht zulässig.'] }));
      l.push(P('Eimer und Lappen', 'reinigung', 1, 'Stk.', { optional: true }));
      return l;
    },
    werkzeug: ['fuellschlauch', 'eimer', 'lampe', 'gabel'],
    schritte: [
      { t: 'Druck ablesen', min: 5,
        x: 'Am Manometer der Heizung (Zeiger- oder Digitalanzeige) den Druck bei kalter Anlage ablesen. Sollwert steht in der Anleitung bzw. ist mit grüner Markierung angegeben. Häufig: 1,0–2,0 bar im Einfamilienhaus.',
        kniff: 'Im Warmzustand steigt der Druck um einige Zehntel bar – das ist normal. Vergleichen Sie immer kalt mit kalt.',
        fehler: 'Bei heißer Anlage auf hohen Wert nachgefüllt: Später öffnet das Sicherheitsventil (meist bei 2,5 oder 3 bar).' },
      { t: 'Nachfüllschlauch vorbereiten', wenn: m => !(m.ist >= m.soll), min: 10,
        x: 'Schlauch mit Systemtrenner an einen Wasserhahn (Waschmaschinen- oder Kellerhahn) anschließen und das andere Ende zum Füll- und Entleerhahn (KFE-Hahn) der Heizung führen. Schlauch zuerst mit Wasser füllen, bis keine Luft mehr kommt – erst dann an den KFE-Hahn schrauben.',
        kniff: 'Luft im Schlauch gelangt sonst in die Heizung – und Sie müssen gleich wieder entlüften.',
        fehler: 'Gartenschlauch ohne Systemtrenner: Heizungswasser kann ins Trinkwasser zurückgedrückt werden (verboten).' },
      { t: 'Langsam nachfüllen', wenn: m => !(m.ist >= m.soll), min: 10,
        x: 'Zuerst den Wasserhahn, dann den KFE-Hahn langsam öffnen und das Manometer beobachten. Beim Sollwert zuerst den KFE-Hahn, dann den Wasserhahn schließen. Schlauch abnehmen (Eimer drunter), Kappe auf den KFE-Hahn.',
        kniff: 'Lieber 0,2 bar zu wenig als zu viel – nach dem Entlüften fällt der Druck ohnehin etwas.',
        fehler: 'Zu schnell gefüllt: Der Druck schießt über den Sollwert, das Sicherheitsventil öffnet.' },
      { t: 'Entlüften und nachkontrollieren', min: 10,
        x: 'Nach dem Nachfüllen die Heizkörper entlüften (siehe eigene Arbeit) und den Druck am nächsten Tag noch einmal prüfen. Datum und Menge in „Mein Haus“ notieren.',
        kniff: 'Notieren Sie jedes Nachfüllen – so erkennt der Fachbetrieb schnell, ob ein Leck oder das Ausdehnungsgefäß schuld ist.',
        fehler: 'Ständig stillschweigend nachgefüllt: Frischwasser bringt Sauerstoff und Kalk in die Anlage.' }
    ],
    sicherheit: ['Nur Nachfüllset mit Systemtrenner verwenden (DIN EN 1717).', 'Keine Eingriffe am Sicherheitsventil, Ausdehnungsgefäß, Brenner oder an Gasleitungen.', 'Bei Anlagen mit vorgeschriebener Wasseraufbereitung (VDI 2035) nur aufbereitetes Wasser verwenden – Anleitung bzw. Fachbetrieb fragen.'],
    grenzen: ['Druck fällt öfter als einmal im Jahr deutlich ab, Sicherheitsventil tropft oder Druck steigt beim Aufheizen stark – Heizungsfachbetrieb (Leck, Ausdehnungsgefäß).', 'Gasgeruch: Fenster auf, keine Schalter betätigen, Haus verlassen, Notruf des Gasversorgers.'],
    rot: (m, o) => o.oft ? 'Fällt der Druck regelmäßig ab, verliert die Anlage Wasser oder das Ausdehnungsgefäß ist defekt. Ständiges Nachfüllen schadet der Heizung – bitte Heizungsfachbetrieb beauftragen.' : '',
    wartung: { monate: 1, monat: 10, text: 'Heizungsdruck am Manometer ablesen (Heizperiode)' }
  },
  /* ======================================================================= */
  {
    id: 'oelheizung', bereich: 'heizung', titel: 'Ölheizung durchchecken (Eigenkontrolle)', schwierigkeit: 1,
    kurz: 'Sichtkontrolle von Tank, Leitungen, Heizraum und Anzeigen – was Sie als Eigentümer selbst prüfen dürfen und sollten.',
    schlagworte: ['oelheizung', 'oeltank', 'heizoel', 'oelheizung pruefen', 'tank pruefen', 'heizung check', 'heizraum', 'brenner stoerung', 'oelfilter', 'oelstand', 'heizoeltank', 'kesselraum'],
    aufnahme: { art: 'werte', felder: [{ id: 'tankL', label: 'Tankinhalt (Fassungsvermögen)', einheit: 'Liter', std: 5000, max: 100000, min: 500, ganz: true }] },
    optionen: [{ id: 'tankart', label: 'Tankart', typ: 'wahl', std: 'batterie', werte: [['batterie', 'Kunststoff-Batterietanks im Keller'], ['stahl', 'Stahltank im Keller'], ['erd', 'Erdtank (unterirdisch)']] }, { id: 'stoerung', label: 'Brenner steht auf Störung', typ: 'ja', std: false }],
    material(m, o) {
      return [
        P('Ölbindemittel (Sack, für den Notfall bereitstellen)', 'heizung', 1, 'Sack', { rechnung: ['Für kleine Tropfmengen am Filter oder an Leitungen. Bei größeren Mengen: Fachbetrieb und ggf. Behörde.'] }),
        P('Ölfeste Handschuhe', 'schutz', 1, 'Paar', { optional: true })
      ];
    },
    werkzeug: ['lampe'],
    schritte: [
      { t: 'Heizraum und Zuluft prüfen', min: 10,
        x: 'Im Heizraum dürfen keine brennbaren Dinge lagern (Kartons, Holz, Kanister). Die Zuluftöffnung (Lüftungsgitter) muss frei sein – der Brenner braucht Verbrennungsluft. Tür zum Heizraum schließt?',
        kniff: 'Ein Klebeband-Rahmen am Boden „hier nichts abstellen“ hilft der ganzen Familie.',
        fehler: 'Zuluftöffnung im Winter zugestopft: Unvollständige Verbrennung, Ruß und Kohlenmonoxid-Gefahr.' },
      { t: 'Tank und Auffangraum ansehen', min: 15,
        x: 'Mit der Taschenlampe rund um die Tanks schauen: Ölflecken, Tropfen, nasse Stellen, Ölgeruch? Ist die Auffangwanne bzw. der Auffangraum trocken und sauber? Kunststofftanks auf Verfärbungen, Ausbeulungen oder Risse prüfen. Grenzwertgeber und Füllstandsanzeige ablesen.',
        kniff: 'Ein Blatt weißes Küchenpapier an Verbindungen halten – Öl zeigt sich sofort als gelber Fleck.',
        fehler: 'Ölgeruch ignoriert: Schon kleine Leckagen können teure Boden- oder Gewässerschäden verursachen.',
        sicher: 'Bei Ölaustritt: Kein offenes Feuer, nicht rauchen. Ölbindemittel für kleine Mengen; bei größeren Mengen Fachbetrieb und die zuständige Behörde (Untere Wasserbehörde) bzw. Feuerwehr verständigen.' },
      { t: 'Leitungen und Filter ansehen', min: 10,
        x: 'Ölleitung vom Tank zum Brenner sowie den Ölfilter (durchsichtige Tasse) ansehen: Ist der Filter dunkel verschlammt oder steht Wasser unten in der Tasse? Tropft es? Nur ansehen – der Filterwechsel gehört zur Wartung.',
        kniff: 'Ein Handyfoto vom Filter bei jeder Kontrolle zeigt dem Fachbetrieb, wie schnell er verschmutzt.',
        fehler: 'Filter selbst geöffnet: Luft im System, der Brenner geht auf Störung.' },
      { t: 'Anzeigen am Kessel ablesen', min: 10,
        x: 'Störungsanzeige, Kesseltemperatur und – bei Anlagen mit Wasser – den Anlagendruck ablesen. Schornsteinfeger-Protokoll und Wartungsdatum ansehen: Die Wartung durch den Fachbetrieb sollte jährlich erfolgen.',
        kniff: 'Wartungsfälligkeit direkt in „Mein Haus“ eintragen.',
        fehler: 'Ruß, Brandgeruch oder ungewöhnliche Geräusche als „normal“ abgetan.' },
      { t: 'Bei Störung: höchstens einmal entstören', min: 5, wenn: (m, o) => !!o.stoerung,
        x: 'Steht der Brenner auf Störung (rote Lampe), dürfen Sie die Entstörtaste EINMAL drücken. Läuft der Brenner danach nicht sauber an oder geht wieder auf Störung: nicht wiederholen, Heizungsfachbetrieb rufen.',
        kniff: 'Vorher prüfen, ob Öl im Tank ist und der Ölhahn offen steht – häufigste Ursache.',
        fehler: 'Mehrfach entstört: Unverbranntes Öl sammelt sich im Brennraum – Verpuffungsgefahr!',
        sicher: 'Keine Einstellungen am Brenner, keine Abdeckungen öffnen.' },
      { t: 'Prüfpflichten klären', min: 10,
        x: 'Für Heizöltanks gelten je nach Größe, Lage (z. B. Wasserschutzgebiet) und Bundesland Prüfpflichten durch Sachverständige (AwSV). Ihr Tankfachbetrieb oder die Untere Wasserbehörde sagt Ihnen, ob und wann Ihr Tank geprüft werden muss.',
        kniff: 'Prüfbericht und Datum der letzten Prüfung fotografieren und in „Mein Haus“ ablegen.',
        fehler: 'Prüffrist verpasst – im Schadensfall kann das Ärger mit der Versicherung geben.' }
    ],
    sicherheit: ['Nur Sichtkontrollen – keine Eingriffe an Brenner, Ölpumpe, Filter, Leitungen oder Abgasweg.', 'Bei Ölaustritt kein Feuer, nicht rauchen, Fachbetrieb rufen.', 'Höchstens einmal entstören.'],
    grenzen: ['Brennereinstellung, Düsen- und Filterwechsel, Abgasmessung und Wartung – Heizungsfachbetrieb bzw. Schornsteinfeger.', 'Ölaustritt, Ölgeruch, Risse oder Verformungen am Tank – Tankfachbetrieb, ggf. Behörde.', 'Brenner geht nach einmaligem Entstören wieder auf Störung.'],
    wartung: { monate: 3, text: 'Sichtkontrolle Öltank, Leitungen, Filter und Heizraum' }
  },
  /* ======================================================================= */
  {
    id: 'thermostat', bereich: 'heizung', titel: 'Thermostatkopf wechseln', schwierigkeit: 1,
    kurz: 'Alten Heizkörper-Thermostat gegen einen neuen oder einen programmierbaren tauschen – ohne Wasser abzulassen.',
    schlagworte: ['thermostat', 'thermostatkopf', 'heizkoerperthermostat', 'thermostat wechseln', 'thermostat tauschen', 'smart thermostat', 'thermostatventil', 'heizung regler', 'thermostat kaputt', 'ventil klemmt', 'heizkoerper wird nicht warm'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl Thermostatköpfe', einheit: 'Stück', std: 3, max: 40, ganz: true }] },
    optionen: [
      { id: 'anschluss', label: 'Anschluss am Ventil', typ: 'wahl', std: 'm30', werte: [['m30', 'Gewinde M30 × 1,5 (am häufigsten)'], ['danfoss', 'Danfoss-Klemmanschluss (RA, RAV, RAVL)'], ['andere', 'Anderer / weiß ich nicht']] },
      { id: 'typ', label: 'Neuer Kopf', typ: 'wahl', std: 'standard', werte: [['standard', 'Standard-Thermostatkopf'], ['programm', 'Programmierbarer Kopf (mit Batterie)']] }
    ],
    vorlauf: 'Vorher ein Foto vom Ventil ohne Kopf machen (Hersteller-Schriftzug auf dem Ventilkörper) – so findet man im Handel den richtigen Adapter.',
    material(m, o) {
      const l = [];
      l.push(P(o.typ === 'programm' ? 'Programmierbarer Heizkörperthermostat' : 'Thermostatkopf (Anschluss M30 × 1,5)', 'heizung', m.anzahl, 'Stk.'));
      if (o.anschluss !== 'm30') l.push(P(o.anschluss === 'danfoss' ? 'Adapter Danfoss (RA/RAV/RAVL) auf M30 × 1,5' : 'Adapter passend zum Ventil (Foto mitnehmen)', 'heizung', m.anzahl, 'Stk.', { rechnung: ['Viele Köpfe liegen Adapter bei – vor dem Kauf prüfen.'] }));
      if (o.typ === 'programm') l.push(P('Batterien laut Hersteller (meist AA)', 'elektro', m.anzahl * 2, 'Stk.'));
      return l;
    },
    werkzeug: ['zange', 'schraubendreher', 'pinzette'],
    schritte: [
      { t: 'Alten Kopf auf Maximum stellen', min: 3,
        x: 'Den alten Thermostatkopf ganz auf „5“ bzw. Maximum drehen. Dadurch drückt er nicht mehr auf den Ventilstift und lässt sich leicht abnehmen.',
        kniff: 'Im Sommer wechseln: Dann stört es nicht, wenn das Ventil kurz offen steht.',
        fehler: 'Kopf auf „0“ abgeschraubt: Er sitzt unter Spannung und lässt sich schwer lösen.' },
      { t: 'Kopf abschrauben', min: m => 2 + (m.anzahl || 1) * 3,
        x: 'Überwurfmutter (M30) gegen den Uhrzeigersinn lösen bzw. beim Danfoss-Klemmanschluss die Schraube lösen und den Kopf abziehen. Es tritt kein Wasser aus – das Ventil bleibt dicht.',
        kniff: 'Sitzt die Mutter fest: Lappen darum und vorsichtig mit der Wasserpumpenzange lösen.',
        fehler: 'Am Ventilkörper gedreht statt an der Mutter – dabei kann das Ventil undicht werden.' },
      { t: 'Ventilstift prüfen', min: m => 2 + (m.anzahl || 1) * 2,
        x: 'Der kleine Metallstift in der Mitte muss sich mit dem Finger eindrücken lassen und von selbst wieder herauskommen. Klemmt er: mit der Zange vorsichtig ein paarmal hin- und herbewegen bzw. leicht drücken – nicht herausziehen.',
        kniff: 'Ein klemmender Stift ist oft der Grund, warum ein Heizkörper nach dem Sommer kalt bleibt.',
        fehler: 'Mit dem Hammer auf den Stift geschlagen – das Ventil wird undicht.' },
      { t: 'Neuen Kopf montieren', min: m => 3 + (m.anzahl || 1) * 4,
        x: 'Neuen Kopf ebenfalls auf Maximum stellen, ggf. Adapter aufsetzen, Kopf aufstecken und Überwurfmutter handfest anziehen. Programmierbare Köpfe: Batterien einlegen, Adaption nach Anleitung starten.',
        kniff: 'Die Zahl „3“ entspricht bei den meisten Köpfen etwa 20 °C – jede Stufe mehr etwa 4 °C.',
        fehler: 'Mutter mit der Zange angeknallt: Kunststoffgewinde des Kopfes bricht.' }
    ],
    sicherheit: ['Das Ventil selbst nicht ausbauen – dann läuft Heizungswasser aus.'],
    grenzen: ['Ventil tropft am Stift oder muss getauscht werden – Heizungsfachbetrieb (Anlage entleeren).', 'Hydraulischer Abgleich – Heizungsfachbetrieb.'],
    wartung: { monate: 12, monat: 9, text: 'Thermostatventile vor der Heizperiode durchbewegen (Stift gängig?)' }
  },
  /* ======================================================================= */
  {
    id: 'fi-test', bereich: 'elektro', titel: 'FI-Schutzschalter testen, Sicherungskasten beschriften', schwierigkeit: 1,
    kurz: 'Die Prüftaste drücken, Stromkreise zuordnen und den Kasten verständlich beschriften – ohne eine Abdeckung zu öffnen.',
    schlagworte: ['fi', 'fi schalter', 'fi testen', 'rcd', 'fehlerstromschutzschalter', 'sicherungskasten', 'sicherungen', 'sicherung beschriften', 'unterverteilung', 'sicherung fliegt raus', 'sicherungskasten beschriften', 'pruef taste', 'elektro'],
    aufnahme: { art: 'werte', felder: [{ id: 'kreise', label: 'Anzahl Sicherungen (Leitungsschutzschalter)', einheit: 'Stück', std: 12, max: 80, ganz: true }, { id: 'fi', label: 'Anzahl FI-Schalter (mit Taste „T“)', einheit: 'Stück', std: 1, max: 10, ganz: true }] },
    optionen: [{ id: 'kein', label: 'Es gibt keinen FI-Schalter oder alte Schraubsicherungen', typ: 'ja', std: false }, { id: 'loest', label: 'FI oder Sicherungen lösen häufig ohne erkennbaren Grund aus', typ: 'ja', std: false }],
    material(m, o) {
      return [
        P('Beschriftungsetiketten oder Beschriftungsgerät-Band', 'elektro', 1, 'Pack.', { rechnung: [`${m.kreise} Sicherungen + ${m.fi} FI – je ein Etikett, dazu ein Plan im Kasten`] }),
        P('Steckdosentester (Prüfstecker mit Anzeige)', 'elektro', 1, 'Stk.', { optional: true, rechnung: ['Nur zum Einstecken in Steckdosen – zeigt, ob Strom da ist. Kein Spannungsprüfer zum Messen an offenen Teilen.'] }),
        P('Klarsichthülle für den Sicherungsplan', 'sonstiges', 1, 'Stk.', { optional: true })
      ];
    },
    werkzeug: ['etiketten', 'pruefgeraet', 'lampe'],
    schritte: [
      { t: 'Vorbereiten', min: 10,
        x: 'Alle im Haus vorwarnen. Computer herunterfahren, laufende Waschmaschine abwarten. Taschenlampe bereitlegen. Kühl- und Gefrierschrank vertragen eine kurze Unterbrechung.',
        kniff: 'Uhrzeiten an Backofen und Mikrowelle danach neu stellen – Zettel bereitlegen.',
        fehler: 'Während jemand am PC arbeitet, den FI getestet – Daten weg.' },
      { t: 'FI-Schalter testen', min: m => 3 + (m.fi || 1) * 3,
        x: 'Die Prüftaste „T“ am FI-Schalter kräftig drücken. Der Schalter muss sofort auslösen (Hebel springt nach unten), die angeschlossenen Stromkreise sind stromlos. Hebel wieder nach oben drücken.',
        kniff: 'Die Hersteller empfehlen den Test regelmäßig (oft halbjährlich) – in „Mein Haus“ als Erinnerung eintragen.',
        fehler: 'Gar nicht getestet: FI-Schalter können verkleben und lösen im Ernstfall nicht aus.',
        sicher: 'Löst der FI beim Drücken der Taste NICHT aus: nichts weiter versuchen, sofort Elektrofachbetrieb – Lebensgefahr bei einem Fehler.' },
      { t: 'Stromkreise zuordnen', min: m => 10 + (m.kreise || 1) * 5,
        x: 'Eine Sicherung nach der anderen ausschalten (Hebel nach unten) und durchs Haus gehen: Welche Lampen und Steckdosen sind ohne Strom? Mit dem Steckdosentester geht es schneller. Alles notieren, dann die Sicherung wieder einschalten.',
        kniff: 'Ein Radio auf volle Lautstärke an der Steckdose – wenn es verstummt, hören Sie es im ganzen Haus.',
        fehler: 'Mehrere Sicherungen gleichzeitig aus: Die Zuordnung wird ungenau.',
        sicher: 'Nur die Hebel bedienen. Keine Abdeckungen, Blenden oder Schrauben am Sicherungskasten öffnen.' },
      { t: 'Beschriften und Plan anlegen', min: m => 10 + (m.kreise || 1) * 2,
        x: 'Jede Sicherung mit klaren Worten beschriften („Küche Steckdosen Arbeitsplatte“, „Bad Licht + Spiegel“). Zusätzlich einen Plan mit allen Kreisen in die Klarsichthülle in den Kasten legen und ein Foto davon in „Mein Haus“ speichern.',
        kniff: 'Schreiben Sie auch auf, welcher FI welche Sicherungen schützt.',
        fehler: 'Abkürzungen, die später niemand versteht („SZ2 li“).' }
    ],
    sicherheit: ['Nur die Prüftaste und die Schalthebel bedienen – nie Abdeckungen öffnen.', 'Löst eine Sicherung sofort wieder aus: nicht erneut einschalten, Ursache vom Elektrofachbetrieb suchen lassen.', 'Brandgeruch, Wärme oder Knistern am Kasten: Hauptschalter aus (falls gefahrlos), Elektrofachbetrieb.'],
    grenzen: ['Kein FI-Schalter vorhanden, alte Schraubsicherungen oder Stoffleitungen – Anlage von einer Elektrofachkraft prüfen lassen.', 'FI löst beim Testen nicht aus oder löst häufig ohne Grund aus.', 'Jede Arbeit an Leitungen, Dosen, Schaltern, Leuchten oder im Sicherungskasten (230 V).'],
    rot: (m, o) => o.kein ? 'Ohne FI-Schutzschalter fehlt ein lebenswichtiger Schutz gegen Stromschlag. Bitte die Elektroanlage von einem Elektrofachbetrieb prüfen und nachrüsten lassen.' : (o.loest ? 'Häufiges Auslösen ist ein Warnsignal (Isolationsfehler, defektes Gerät, Feuchte). Bitte nicht immer wieder einschalten, sondern einen Elektrofachbetrieb die Ursache suchen lassen.' : ''),
    wartung: { monate: 6, text: 'FI-Schutzschalter mit der Prüftaste „T“ testen' }
  },
  /* ======================================================================= */
  {
    id: 'rauchmelder', bereich: 'elektro', titel: 'Rauchmelder prüfen', schwierigkeit: 1,
    kurz: 'Jährliche Prüfung nach DIN 14676 für das eigene Haus: Testknopf, Raucheindringöffnungen, Batterie, Austauschdatum.',
    schlagworte: ['rauchmelder', 'brandmelder', 'feuermelder', 'rauchmelder piept', 'rauchmelder testen', 'rauchmelder batterie', 'rauchmelder pruefen', 'piepen', 'heimrauchmelder'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl Rauchmelder', einheit: 'Stück', std: 6, max: 40, ganz: true }, { id: 'fehlen', label: 'Davon fehlen noch (Räume ohne Melder)', einheit: 'Stück', std: 0, max: 20, ganz: true, pflicht: false }] },
    optionen: [{ id: 'batterie', label: 'Melder mit wechselbarer Batterie (nicht 10-Jahres-Melder)', typ: 'ja', std: false }],
    material(m, o) {
      const l = [];
      if (m.fehlen > 0) l.push(P('Rauchmelder mit 10-Jahres-Batterie (DIN EN 14604, Q-Label)', 'elektro', m.fehlen, 'Stk.', { rechnung: ['Pflicht in allen Bundesländern: mindestens Schlafräume, Kinderzimmer und Flure, die als Rettungsweg dienen (Landesbauordnung).'] }));
      if (o.batterie) l.push(P('Ersatzbatterien laut Melder (meist 9-V-Block)', 'elektro', m.anzahl, 'Stk.'));
      l.push(P('Weicher Pinsel zum Reinigen der Raucheindringöffnungen', 'farbe', 1, 'Stk.', { optional: true, hinweis: 'abwählen, wenn vorhanden' }));
      l.push(P('Klebepads bzw. Magnetbefestigung (falls nicht bohren)', 'elektro', Math.max(0, m.fehlen), 'Stk.', { optional: true }));
      return l.filter(p => p.menge > 0);
    },
    werkzeug: ['leiter', 'rauchmeldertester', 'akkusauger'],
    schritte: [
      { t: 'Austauschdatum prüfen', min: m => 3 + (m.anzahl || 1) * 1,
        x: 'Auf jedem Melder steht ein Herstell- oder Austauschdatum. Rauchmelder werden spätestens nach 10 Jahren getauscht – der Sensor altert.',
        kniff: 'Datum mit Folienstift auf die Rückseite des Montagesockels schreiben, wenn es schwer lesbar ist.',
        fehler: 'Uralte Melder hängen lassen, weil der Testknopf noch piept – der Rauchsensor ist dann oft trotzdem zu unempfindlich.' },
      { t: 'Sichtprüfung und Reinigung', min: m => 3 + (m.anzahl || 1) * 3,
        x: 'Raucheindringöffnungen frei von Staub, Farbe und Spinnweben? Nicht abgedeckt, nicht überstrichen? Im Umkreis von 50 cm keine Hindernisse (Lampen, Balken)? Staub vorsichtig absaugen.',
        kniff: 'Staubsaugerdüse nur nah heranhalten, nicht aufsetzen.',
        fehler: 'Melder beim Streichen mit Farbe überrollt: Die Öffnungen sind verklebt, der Melder ist blind.' },
      { t: 'Testknopf drücken', min: m => 3 + (m.anzahl || 1) * 2,
        x: 'Testknopf einige Sekunden drücken – der Melder muss laut alarmieren. Bei vernetzten Meldern müssen alle mitpiepen.',
        kniff: 'Gehörschutz oder Finger ins freie Ohr – der Alarm ist sehr laut (85 dB).',
        fehler: 'Melder mit Feuerzeug „getestet“ – das kann ihn beschädigen und ist gefährlich.',
        sicher: 'Sicher auf der Leiter stehen; oder eine Stange zum Drücken verwenden.' },
      { t: 'Batterien und fehlende Melder', min: m => 5 + (m.fehlen || 0) * 15,
        x: 'Wechselbare Batterien tauschen, wenn der Melder piept (kurzer Ton alle 30–60 s) oder spätestens nach Herstellerangabe. Fehlende Melder in Schlafräumen, Kinderzimmern und Fluren mittig an die Decke setzen, mindestens 50 cm von Wänden und Lampen.',
        kniff: 'Nicht direkt in der Küche oder im Bad montieren – Dampf löst Fehlalarme aus.',
        fehler: 'Melder an die Wand statt an die Decke: Rauch steigt nach oben, der Melder schlägt zu spät an.',
        sicher: 'Beim Bohren in die Decke Leitungssucher verwenden.' },
      { t: 'Prüfung notieren', min: 5,
        x: 'Datum der Prüfung und Ergebnis in „Mein Haus“ eintragen. Die Norm DIN 14676 sieht eine Prüfung mindestens alle 12 Monate vor.',
        kniff: 'Gleich den nächsten Termin als Kalender-Erinnerung exportieren.',
        fehler: 'Prüfung nicht dokumentiert – im Mietverhältnis oder bei der Versicherung fehlt dann der Nachweis.' }
    ],
    sicherheit: ['Leiter sicher aufstellen.', 'Melder nie ausbauen, „weil er nervt“ – Ursache klären.'],
    grenzen: ['Fest an 230 V angeschlossene oder in eine Brandmeldeanlage eingebundene Melder – Elektrofachbetrieb.'],
    wartung: { monate: 12, text: 'Rauchmelder prüfen (DIN 14676): Datum, Sicht, Testknopf' }
  },
  /* ======================================================================= */
  {
    id: 'dachrinne', bereich: 'aussen', titel: 'Dachrinne reinigen', schwierigkeit: 2,
    kurz: 'Laub und Schlamm raus, Fallrohr frei – damit kein Wasser an der Fassade herunterläuft. Mit klaren Grenzen für die Leiter.',
    schlagworte: ['dachrinne', 'regenrinne', 'rinne', 'dachrinne reinigen', 'laub', 'fallrohr', 'fallrohr verstopft', 'dachrinne laeuft ueber', 'regenrinne sauber', 'laubschutz'],
    aufnahme: { art: 'werte', felder: [{ id: 'laenge', label: 'Länge der Dachrinnen gesamt', einheit: 'm', std: 24, max: 200, min: 1 }, { id: 'hoehe', label: 'Höhe der Traufe (Rinne) über Boden', einheit: 'm', std: 3, max: 15, min: 1.5, schritt: 0.5 }, { id: 'fallrohre', label: 'Anzahl Fallrohre', einheit: 'Stück', std: 2, max: 20, ganz: true }] },
    optionen: [{ id: 'schutz', label: 'Laubschutz-Gitter anbringen', typ: 'ja', std: false }],
    material(m, o) {
      const l = [];
      l.push(P('Gartenabfallsäcke bzw. Eimer mit Haken', 'garten', Math.max(1, Math.ceil(m.laenge / 15)), 'Stk.', { rechnung: [`Erfahrungswert ca. 1 Sack je 15 m Rinne: ${z(m.laenge)} m → ${Math.max(1, Math.ceil(m.laenge / 15))}`] }));
      if (o.schutz) { const n = Math.ceil(m.laenge * 1.05 / 2); l.push(P('Laubschutzgitter für Dachrinnen (2-m-Stücke, Rinnengröße beachten)', 'garten', n, 'Stk.', { rechnung: [`${z(m.laenge)} m + 5 % ÷ 2 m → ${n} Stück`] })); l.push(P('Laubfangkorb für Fallrohr-Einlauf', 'garten', m.fallrohre, 'Stk.')); }
      l.push(P('Arbeitshandschuhe (wasserfest)', 'schutz', 1, 'Paar'));
      l.push(P('Schutzbrille', 'schutz', 1, 'Stk.', { optional: true }));
      return l;
    },
    werkzeug: ['anlegeleiter', 'rinnenschaufel', 'eimer', 'gartenschlauch', 'spirale'],
    schritte: [
      { t: 'Höhe und Leiter prüfen', min: 15,
        x: 'Geeignet für Eigenleistung ist eine Rinne, die Sie von einer sicher stehenden Anlegeleiter erreichen (Erdgeschoss bzw. niedrige Traufe). Die Leiter muss 1 m über die Auflage hinausragen, im Winkel von 65–75° stehen und auf festem, ebenem Grund mit Fußsicherung stehen. Nicht auf das Dach steigen.',
        kniff: 'Ellbogen-Probe: Stellen Sie sich mit den Fußspitzen an die Leiterfüße und strecken Sie die Arme aus – erreichen die Hände gerade die Sprosse, stimmt der Winkel.',
        fehler: 'Leiter an die Rinne gelehnt: Die Rinne verbiegt sich, die Leiter rutscht.',
        sicher: 'Nie allein arbeiten – eine zweite Person sichert die Leiter. Nicht bei Nässe, Frost oder Wind.' },
      { t: 'Laub und Schlamm entfernen', min: m => 10 + m.laenge * 2.5,
        x: 'Abschnittsweise von der Leiter aus mit der Kunststoffschaufel Laub und Schlamm in den Eimer schöpfen, der am Leiterhaken hängt. Leiter lieber oft umsetzen, als sich weit seitlich hinauszulehnen.',
        kniff: 'Die Gürtelschnalle bleibt immer zwischen den Leiterholmen – dann lehnen Sie sich nie zu weit hinaus.',
        fehler: 'Weit zur Seite gelehnt, um ein Stück mehr zu schaffen – die häufigste Ursache von Leiterstürzen.',
        sicher: 'Immer drei Kontaktpunkte: zwei Füße und eine Hand an der Leiter.' },
      { t: 'Rinne spülen, Fallrohr prüfen', min: m => 10 + (m.fallrohre || 1) * 8,
        x: 'Rinne mit dem Gartenschlauch von der höchsten Stelle zum Fallrohr hin spülen. Läuft das Wasser im Fallrohr nicht ab: Laubfang am Einlauf reinigen, unten den Reinigungsdeckel (Regenrohrklappe) öffnen bzw. mit der Spirale von unten frei machen.',
        kniff: 'Beim Spülen beobachten, ob Wasser in der Rinne stehen bleibt – dann hat die Rinne kein Gefälle mehr (Rinnenhalter).',
        fehler: 'Laub in das Fallrohr hinuntergespült: Es verstopft weiter unten im Bogen.' },
      { t: 'Laubschutz anbringen', wenn: (m, o) => !!o.schutz, min: m => 10 + m.laenge * 1.5,
        x: 'Laubschutzgitter in die Rinne einlegen bzw. einklemmen, Laubfangkörbe in die Fallrohreinläufe setzen.',
        kniff: 'Auch mit Gitter einmal im Jahr kontrollieren – feiner Schmutz und Samen kommen trotzdem durch.',
        fehler: 'Gitter nur aufgelegt: Der nächste Sturm weht es in den Garten.' },
      { t: 'Schäden notieren', min: 10,
        x: 'Beim Reinigen auf undichte Stoßstellen, lose Rinnenhalter, Rost und Risse achten. Fotos machen und in „Mein Haus“ ablegen.',
        kniff: 'Bei Regen beobachten: Tropft es an Verbindungen oder läuft die Rinne über?',
        fehler: 'Kleine Undichtigkeit ignoriert: Dauernasse Fassade, Frostschäden.' }
    ],
    sicherheit: ['Leiter: fester Stand, 65–75°, 1 m Überstand, zweite Person sichert.', 'Nicht auf das Dach steigen. Nicht bei Nässe, Frost oder Wind.', 'In der Nähe von Freileitungen oder Dachständern (Strom) nicht arbeiten.'],
    grenzen: ['Rinne höher als etwa 3 m bzw. über dem Erdgeschoss, Arbeiten vom Dach aus – Dachdecker oder Hubarbeitsbühne mit Fachkraft.', 'Rinnenhalter erneuern, Gefälle einstellen, Rinnen auswechseln – Dachdecker/Klempner.'],
    rot: (m, o) => m.hoehe > 3 ? `Die Rinne liegt ${z(m.hoehe, 1)} m hoch. Ab etwa 3 m wird die Arbeit von der Anlegeleiter gefährlich – Stürze sind die häufigste schwere Heimwerker-Verletzung. Bitte einen Dachdecker oder eine Hubarbeitsbühne mit Fachkraft beauftragen.` : '',
    wartung: { monate: 6, monat: 11, text: 'Dachrinnen und Fallrohre reinigen (nach dem Laubfall, im Frühjahr)' }
  },
  /* ======================================================================= */
  {
    id: 'aussenwasserhahn', bereich: 'aussen', titel: 'Außenwasserhahn winterfest machen', schwierigkeit: 1,
    kurz: 'Vor dem ersten Frost absperren und entleeren – sonst platzt die Leitung in der Wand.',
    schlagworte: ['aussenwasserhahn', 'gartenwasserhahn', 'wasserhahn aussen', 'frost', 'winterfest', 'frostsicher', 'gartenleitung', 'aussenzapfstelle', 'wasser abstellen winter', 'garten wasser'],
    aufnahme: { art: 'werte', felder: [{ id: 'anzahl', label: 'Anzahl Außenwasserhähne', einheit: 'Stück', std: 1, max: 10, ganz: true }] },
    optionen: [{ id: 'art', label: 'Art des Hahns', typ: 'wahl', std: 'normal', werte: [['normal', 'Normaler Hahn mit Absperrventil innen'], ['frostsicher', 'Frostsichere Außenarmatur (langer Körper durch die Wand)'], ['unbekannt', 'Weiß ich nicht']] }],
    material(m, o) {
      return [
        P('Isoliermanschette bzw. Frostschutzhaube für den Außenhahn', 'garten', m.anzahl, 'Stk.', { optional: true }),
        P('Etikett „Außenwasser – im Winter zu“ für das Absperrventil', 'sonstiges', m.anzahl, 'Stk.', { optional: true })
      ];
    },
    werkzeug: ['eimer', 'lampe', 'gabel'],
    schritte: [
      { t: 'Absperrventil innen finden', min: 10,
        x: 'Im Keller bzw. Hausanschlussraum hinter der Wand des Außenhahns sitzt ein Absperrventil, oft mit kleiner Entleerungsschraube oder -kappe. Bei frostsicheren Armaturen liegt das Ventil im langen Körper in der Wand – dann genügt meist Schritt 3.',
        kniff: 'Ventil mit einem Etikett „Außenwasser“ markieren – im Frühjahr finden Sie es sofort.',
        fehler: 'Hauptwasserhahn zugedreht statt des Außenventils.' },
      { t: 'Zudrehen und Schlauch abnehmen', min: m => 3 + (m.anzahl || 1) * 3,
        x: 'Absperrventil innen schließen. Draußen Gartenschlauch und Kupplungsstücke abnehmen – im Schlauchstück bleibt sonst Wasser stehen, es gefriert und sprengt den Hahn.',
        kniff: 'Schlauch entleeren und frostfrei lagern – UV und Frost machen ihn spröde.',
        fehler: 'Schlauch am Hahn gelassen: Das Wasser im Schlauch verhindert, dass die Leitung leerläuft.' },
      { t: 'Leitung entleeren', min: m => 5 + (m.anzahl || 1) * 5,
        x: 'Außenhahn öffnen und offen lassen. Innen Eimer unter das Ventil stellen und die Entleerungsschraube bzw. -kappe öffnen, bis kein Wasser mehr kommt (Luft strömt von außen nach). Entleerung danach wieder schließen, Außenhahn bleibt den Winter über offen.',
        kniff: 'Ein Stück Stoff um die Entleerungsschraube wickeln – sie ist winzig und fällt gern in den Eimer.',
        fehler: 'Außenhahn wieder zugedreht: Restwasser kann nicht ablaufen und gefriert.' },
      { t: 'Isolieren und notieren', min: 5,
        x: 'Optional Frostschutzhaube über den Außenhahn. Datum in „Mein Haus“ eintragen – im Frühjahr (nach den Eisheiligen) Entleerung zu, Ventil langsam öffnen und Hahn auf Dichtheit prüfen.',
        kniff: 'Beim Öffnen im Frühjahr das Ventil langsam aufdrehen – Druckschläge vermeiden.',
        fehler: 'Im Frühjahr vergessen, die Entleerung zu schließen: Wasser läuft im Keller aus.' }
    ],
    sicherheit: ['Nur am Absperrventil der Außenleitung arbeiten.'],
    grenzen: ['Kein eigenes Absperrventil für die Außenleitung vorhanden oder Ventil tropft – Sanitärfachbetrieb (Ventil nachrüsten).', 'Leitung ist bereits gefroren oder geplatzt: Hauptwasserhahn schließen, Sanitärfachbetrieb.'],
    wartung: { monate: 12, monat: 10, text: 'Außenwasserhahn absperren und entleeren (vor dem ersten Frost)' }
  },
  /* ======================================================================= */
  {
    id: 'holzterrasse', bereich: 'aussen', titel: 'Holzterrasse reinigen und ölen', schwierigkeit: 1,
    kurz: 'Vergrautes Holz reinigen, entgrauen und mit Terrassenöl schützen – mit Ölmenge nach Fläche und Holzart.',
    schlagworte: ['holzterrasse', 'terrasse', 'terrasse oelen', 'terrassenoel', 'holz oelen', 'terrassendielen', 'bangkirai', 'douglasie', 'holz vergraut', 'terrasse reinigen', 'entgrauer', 'deck', 'holzdeck'],
    aufnahme: { art: 'werte', felder: [{ id: 'flaeche', label: 'Terrassenfläche', einheit: 'm²', std: 20, max: 300, min: 1 }] },
    optionen: [
      { id: 'holz', label: 'Holzart', typ: 'wahl', std: 'hart', werte: [['hart', 'Hartholz (Bangkirai, Garapa, Ipé)'], ['weich', 'Nadelholz (Douglasie, Lärche, Kiefer kdi)'], ['wpc', 'WPC/BPC (Holz-Kunststoff) – nicht ölen']] },
      { id: 'grau', label: 'Holz ist stark vergraut', typ: 'ja', std: true },
      { id: 'erst', label: 'Erstbehandlung oder lange nicht geölt (2 Anstriche)', typ: 'ja', std: false }
    ],
    vorlauf: 'Ein trockenes Wetterfenster abpassen: 2–3 Tage ohne Regen, 10–25 °C, keine pralle Mittagssonne.',
    material(m, o) {
      const l = [];
      if (o.holz === 'wpc') { l.push(P('WPC-Reiniger (laut Hersteller der Dielen)', 'garten', 1, 'Fl.')); return l; }
      if (o.grau) { const bed = m.flaeche / 25; const g = R.gebinde(bed, [1, 2.5, 5], 'l'); l.push(P('Holz-Entgrauer bzw. Terrassenreiniger (Konzentrat)', 'garten', g.stueck, 'Gebinde', { detail: g.text, rechnung: [`${z(m.flaeche)} m² ÷ ca. 25 m² je Liter Konzentrat = ${z(bed)} l (je nach Verschmutzung)`, `Gebinde: ${g.text}`] })); }
      const v = o.holz === 'weich' ? 0.10 : 0.07; const n = o.erst ? 2 : 1;
      const bed = m.flaeche * v * n * 1.1; const g = R.gebinde(bed, [0.75, 2.5, 5], 'l');
      l.push(P(`Terrassenöl für ${o.holz === 'weich' ? 'Nadelholz (z. B. Douglasie/Lärche)' : 'Hartholz (z. B. Bangkirai)'}`, 'farbe', g.stueck, 'Gebinde', { detail: g.text, rechnung: [`${z(m.flaeche)} m² × ${z(v)} l/m² (${o.holz === 'weich' ? 'Nadelholz saugt mehr' : 'Hartholz'}) × ${n} Anstrich(e) = ${z(m.flaeche * v * n)} l`, `+ 10 % = ${z(bed)} l`, `Gebinde: ${g.text}`, 'Verbrauch laut Etikett hat Vorrang – Holz saugt sehr unterschiedlich.'] }));
      l.push(P('Baumwolllappen (fusselfrei)', 'reinigung', 1, 'Pack.'));
      l.push(P('Blechdose mit Deckel bzw. Eimer Wasser für ölige Lappen', 'sonstiges', 1, 'Stk.', { rechnung: ['Ölgetränkte Lappen können sich selbst entzünden!'] }));
      l.push(...schutz('handschuhe', 'brille', 'knie'));
      return l;
    },
    werkzeug: o => ['besen', 'schrubber', 'eimer', 'gartenschlauch', 'terrassenpinsel', 'fugenbuerste', ...(o && o.holz !== 'wpc' ? ['hochdruck'] : [])],
    schritte: [
      { t: 'Terrasse freiräumen und kehren', min: m => 15 + m.flaeche * 0.5,
        x: 'Möbel und Töpfe herunter, Fläche kehren. Schmutz aus den Fugen zwischen den Dielen mit Fugenkratzer oder Spachtel holen – dort staut sich sonst Nässe.',
        kniff: 'Blumentöpfe auf Füße stellen – unter Töpfen bleibt das Holz sonst dauerhaft nass und fleckig.',
        fehler: 'Fugen nicht gereinigt: Wasser kann nicht ablaufen, die Dielen faulen an den Kanten.' },
      { t: 'Reinigen und entgrauen', min: m => 20 + m.flaeche * 2.5, warten: 2880, wartenText: 'Holz durchtrocknen lassen (2–3 Tage ohne Regen)',
        x: 'Entgrauer nach Etikett verdünnen, auftragen, einwirken lassen und mit dem Schrubber in Faserrichtung bürsten. Mit viel Wasser nachspülen. Hochdruckreiniger höchstens mit Flächenreiniger und großem Abstand – sonst raut das Holz auf.',
        kniff: 'Pflanzen am Rand vorher mit Wasser benetzen und mit Folie schützen – Entgrauer verträgt nicht jede Pflanze.',
        fehler: 'Mit der Punktstrahldüse gereinigt: Die weichen Holzfasern werden herausgerissen, die Oberfläche wird pelzig.',
        sicher: 'Entgrauer enthält oft Säure oder Lauge: Handschuhe und Schutzbrille.' },
      { t: 'Ölen – 1. Anstrich', tagNeu: true, min: m => 15 + m.flaeche * 2,
        x: 'Öl gut aufrühren. Dünn und gleichmäßig in Faserrichtung auftragen, immer zwei bis drei Dielen auf ganzer Länge. Nach 15–20 Minuten überschüssiges Öl, das nicht eingezogen ist, mit dem Lappen abnehmen.',
        kniff: 'Auch die Stirnseiten (Hirnholz) der Dielen satt ölen – dort zieht am meisten Wasser ein.',
        fehler: 'Zu dick aufgetragen: Das Öl zieht nicht ein, bleibt klebrig und wird fleckig.',
        sicher: 'Ölgetränkte Lappen können sich selbst entzünden: in Wasser legen oder luftdicht in einer Blechdose aufbewahren, nie zusammengeknüllt in den Müll.' },
      { t: 'Ölen – 2. Anstrich', wenn: (m, o) => !!o.erst, vorWarten: 720, vorWartenText: 'Zwischentrocknung (12–24 h)', min: m => 15 + m.flaeche * 1.5,
        x: 'Nach der Zwischentrocknung zweiten, dünnen Anstrich auftragen und Überschuss abnehmen.',
        kniff: 'Der zweite Anstrich braucht meist nur etwa die halbe Menge.',
        fehler: 'Auf noch klebrigen ersten Anstrich gestrichen.' },
      { t: 'Trocknen lassen', min: 10, warten: 1440, wartenText: 'Begehbar nach ca. 24 h, Möbel nach 2–3 Tagen',
        x: 'Fläche absperren. Möbel und Töpfe erst nach dem vollständigen Trocknen (Etikett, meist 2–3 Tage) zurückstellen.',
        kniff: 'Filzgleiter unter die Gartenmöbel – sie verkratzen sonst die frische Ölschicht.',
        fehler: 'Sofort Möbel zurückgestellt: Abdrücke und Flecken.' }
    ],
    sicherheit: ['Ölige Lappen: Selbstentzündungsgefahr – in Wasser oder luftdichte Blechdose.', 'Reiniger: Handschuhe und Schutzbrille.', 'Nasse Holzterrassen sind rutschig.'],
    grenzen: ['Morsche, weiche oder gebrochene Dielen bzw. Unterkonstruktion (Hochterrasse, Balkon) – Tragfähigkeit vom Fachbetrieb prüfen lassen.'],
    wartung: { monate: 12, monat: 5, text: 'Holzterrasse reinigen und ölen (Frühjahr)' }
  },
  /* ======================================================================= */
  {
    id: 'pflasterfugen', bereich: 'aussen', titel: 'Unkraut in Pflasterfugen entfernen und neu verfugen', schwierigkeit: 2,
    kurz: 'Fugen ohne verbotene Mittel frei machen und mit Sand oder Fugenmörtel neu füllen – mit Mengenrechnung nach Steinformat.',
    schlagworte: ['pflaster', 'pflasterfugen', 'unkraut', 'unkraut fugen', 'fugen pflaster', 'fugensand', 'pflaster verfugen', 'pflasterfugenmoertel', 'einfahrt', 'hof', 'gehweg', 'terrasse pflaster', 'moos pflaster', 'unkraut entfernen'],
    aufnahme: { art: 'werte', felder: [
      { id: 'flaeche', label: 'Pflasterfläche', einheit: 'm²', std: 30, max: 1000, min: 1 },
      { id: 'a', label: 'Steinlänge', einheit: 'cm', std: 20, max: 100, min: 5 },
      { id: 'b', label: 'Steinbreite', einheit: 'cm', std: 10, max: 100, min: 5 },
      { id: 'fuge', label: 'Fugenbreite', einheit: 'mm', std: 5, max: 30, min: 2 },
      { id: 'tiefe', label: 'Fugentiefe neu füllen', einheit: 'mm', std: 30, max: 100, min: 10 }
    ] },
    optionen: [{ id: 'fuellung', label: 'Neue Fugenfüllung', typ: 'wahl', std: 'sand', werte: [['sand', 'Fugensand / Brechsand 0–2 mm (wasserdurchlässig)'], ['moertel', 'Pflasterfugenmörtel (kunstharzgebunden, wasserdurchlässig)']] }, { id: 'befahren', label: 'Fläche wird mit Auto befahren', typ: 'ja', std: false }],
    material(m, o) {
      const l = [];
      const fm = m.flaeche * ((m.a + m.b) / ((m.a / 100) * (m.b / 100))) / 100; // Fugenmeter
      if (o.fuellung === 'sand') {
        const kgm2 = R.fugenKgProM2(m.a * 10, m.b * 10, m.fuge, m.tiefe, 1.5); const kg = kgm2 * m.flaeche * 1.2; const g = R.gebinde(kg, [25], 'kg');
        l.push(P('Fugensand bzw. Brechsand 0–2 mm (Sack 25 kg)', 'garten', g.stueck, 'Sack', { detail: g.text, rechnung: [`Formel: (A + B) ÷ (A × B) × Fuge × Tiefe × Schüttdichte 1,5`, `(${m.a * 10} + ${m.b * 10}) ÷ (${m.a * 10} × ${m.b * 10}) × ${z(m.fuge)} × ${z(m.tiefe)} × 1,5 = ${z(kgm2, 2)} kg/m²`, `× ${z(m.flaeche)} m² + 20 % (Einschlämmen, Nachsacken) = ${z(kg)} kg`, `→ ${g.text}`] }));
      } else {
        const kgm2 = R.fugenKgProM2(m.a * 10, m.b * 10, m.fuge, m.tiefe, 1.6); const kg = kgm2 * m.flaeche * 1.1; const g = R.gebinde(kg, [12.5, 25], 'kg');
        l.push(P(`Pflasterfugenmörtel, wasserdurchlässig${o.befahren ? ', befahrbar (Pkw)' : ''}`, 'garten', g.stueck, 'Eimer', { detail: g.text, rechnung: [`(${m.a * 10} + ${m.b * 10}) ÷ (${m.a * 10} × ${m.b * 10}) × ${z(m.fuge)} × ${z(m.tiefe)} × 1,6 = ${z(kgm2, 2)} kg/m²`, `× ${z(m.flaeche)} m² + 10 % = ${z(kg)} kg`, `→ ${g.text}`, 'Kunstharzmörtel braucht laut Hersteller meist mind. 3–5 mm Fugenbreite und 30 mm Tiefe.'] }));
      }
      l.push(P('Gartenabfallsäcke', 'garten', Math.max(1, Math.ceil(m.flaeche / 25)), 'Stk.', { rechnung: [`Fugenlänge ca. ${z(fm, 0)} m – ausgekratztes Material ca. 1 Sack je 25 m²`] }));
      l.push(...schutz('arbeitshandschuhe', 'knie', 'brille'));
      return l;
    },
    werkzeug: o => ['fugenbuerste', 'besen', 'eimer', 'gartenschlauch', 'hochdruck', ...(o && o.fuellung === 'moertel' ? ['schrubber'] : [])],
    schritte: [
      { t: 'Was erlaubt ist – und was nicht', min: 5,
        x: 'Auf Pflaster, Wegen und Einfahrten dürfen keine Unkrautvernichter (Herbizide) ausgebracht werden – das Pflanzenschutzgesetz verbietet die Anwendung auf befestigten Flächen, auch „Hausmittel“ wie Salz oder Essig. Erlaubt und wirksam: mechanisch auskratzen, abbürsten, abflämmen oder heißes Wasser.',
        kniff: 'Kochendes Nudel- oder Kartoffelwasser (ohne Salz) direkt in die Fugen gießen – wirkt gegen junges Unkraut.',
        fehler: 'Salz oder Essig gestreut: verboten, schadet Boden und Grundwasser und kann ein Bußgeld kosten.' },
      { t: 'Fugen auskratzen', min: m => { const fm = m.flaeche * ((m.a + m.b) / ((m.a / 100) * (m.b / 100))) / 100; return 15 + fm * 0.25; },
        x: 'Unkraut, Moos und alten Sand mit Fugenkratzer bzw. Fugenbürste auf die gewünschte Tiefe herausholen. Pflanzen mit Wurzel ziehen. Material zusammenkehren und entsorgen.',
        kniff: 'Bei feuchtem Wetter arbeiten – die Wurzeln kommen dann leichter mit heraus.',
        fehler: 'Nur oben abgekratzt: Das Unkraut wächst aus der Wurzel sofort wieder nach.',
        sicher: 'Abflammgeräte: Brandgefahr! Nicht bei Trockenheit, nicht neben Hecken, Holz, Kunststoff oder Kunstrasen.' },
      { t: 'Fläche reinigen', min: m => 15 + m.flaeche * 0.8,
        x: 'Fläche mit Wasser oder Hochdruckreiniger mit Flächenreiniger abspülen. Für Fugenmörtel muss das Pflaster danach mindestens 24 Stunden trocknen bzw. laut Hersteller vorgenässt werden.',
        kniff: 'Hochdruck schräg und mit Abstand führen – sonst spült er den Sand aus dem Bettungsbereich.',
        fehler: 'Mit der Punktstrahldüse auf Betonpflaster: Die Oberfläche wird ausgewaschen und rau.' },
      { t: 'Neu verfugen mit Sand', wenn: (m, o) => o.fuellung === 'sand', min: m => 15 + m.flaeche * 1.5,
        x: 'Trockenen Fugensand auf die Fläche schütten und mit dem Besen diagonal in die Fugen kehren. Leicht einschlämmen (Wasser) und nach dem Abtrocknen nachkehren, bis die Fugen voll sind. Überschuss abkehren.',
        kniff: 'Brechsand verkeilt sich besser als runder Spielsand und wird nicht so schnell ausgespült.',
        fehler: 'Fugen nur halb gefüllt: Steine bekommen Spiel, wackeln und brechen an den Kanten.' },
      { t: 'Neu verfugen mit Fugenmörtel', wenn: (m, o) => o.fuellung === 'moertel', min: m => 20 + m.flaeche * 2.5, warten: 1440, wartenText: 'Aushärten (begehbar nach ca. 24 h, befahrbar laut Hersteller)',
        x: 'Pflaster nach Herstellerangabe vornässen. Mörtel aus dem Eimer auf die Fläche gießen und mit dem Gummischieber diagonal in die Fugen einarbeiten. Reste mit dem weichen Besen schräg zu den Fugen abkehren, bevor der Mörtel anzieht. Nicht bei Regen, Frost oder unter 5 °C.',
        kniff: 'Nur so viel Fläche auf einmal, wie Sie in der Verarbeitungszeit schaffen (Etikett, oft 20–30 Minuten).',
        fehler: 'Mörtelfilm auf den Steinen antrocknen lassen – er bleibt als glänzender Schleier dauerhaft.' }
    ],
    sicherheit: ['Keine Herbizide, kein Salz, kein Essig auf befestigten Flächen (Pflanzenschutzgesetz).', 'Abflammen: Brandgefahr, nie bei Trockenheit oder in der Nähe brennbarer Dinge.', 'Knieschoner und Handschuhe.'],
    grenzen: ['Abgesackte oder wackelnde Pflasterflächen, Spurrinnen in der Einfahrt – Unterbau prüfen lassen (Garten- und Landschaftsbau).'],
    wartung: { monate: 12, monat: 4, text: 'Pflasterfugen kontrollieren, Unkraut entfernen, Sand nachkehren' }
  }
  );
})(typeof window !== 'undefined' ? window : globalThis);
