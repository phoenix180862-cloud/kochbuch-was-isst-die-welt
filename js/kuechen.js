/* „Was isst die Welt?“ – Kontinente, Länderbücher, Sonderbände, Kategorien */
window.KB = window.KB || {};

KB.TITEL = 'Was isst die Welt?';

KB.GRUPPEN = [
  { id: 'europa', name: 'Europa', satz: 'Vom Sonntagsbraten bei Oma bis zur Paella am Meer', kurzsatz: 'Vom Sonntagsbraten bis zur Paella', glanz: '77,166,255' },
  { id: 'asien', name: 'Asien', satz: 'Wok, Curry und Dampfkorb – Aromen, die wach machen', kurzsatz: 'Wok, Curry und Dampfkorb', glanz: '230,53,53' },
  { id: 'orient', name: 'Orient', satz: 'Gewürzbasare, Safran und orientalische Gastfreundschaft', kurzsatz: 'Gewürzbasare und Safran', glanz: '243,156,18' },
  { id: 'afrika', name: 'Afrika', satz: 'Feuer, Erdnuss, Berbere und Braai', kurzsatz: 'Feuer, Erdnuss und Braai', glanz: '63,191,138' },
  { id: 'amerika', name: 'Amerika', satz: 'Von Kanadas Wäldern bis nach Feuerland', kurzsatz: 'Von Kanada bis Feuerland', glanz: '63,191,138' },
  { id: 'ozeanien', name: 'Ozeanien', satz: 'Barbecue, Muscheln und Südseeträume', kurzsatz: 'Barbecue und Südseeträume', glanz: '77,166,255' }
];

/* Länderbücher. kurz = Buchtitel, unter = Untertitel auf dem Einband, bg/ak = Einbandfarbe/Akzent,
   muster/f = Fliesenmuster für Bänder und Bild-Hintergründe, intro = erste Buchseite */
KB.KUECHEN = [
  { id: 'deutsch', name: 'Deutsche Küche', kurz: 'Deutschland', unter: 'Hausmannskost & Sterneküche', gruppe: 'europa', bg: '#1c1c1c', ak: '#d9a441', muster: 'raute', f: ['#f3efe4', '#2b2b2b', '#c41e1e'],
    intro: 'Von Omas Rinderrouladen über den Westerwälder Eintopf bis zur Sterneküche: Deutschland kocht deftig, regional und mit viel Liebe zum Detail. Hier stehen die Klassiker so erklärt, dass sie wie bei Mutter schmecken.' },
  { id: 'oesterreich', name: 'Österreichische Küche', kurz: 'Österreich', unter: 'Wiener Küche & Mehlspeisen', gruppe: 'europa', bg: '#8e1b1f', ak: '#f2ede3', muster: 'gmunden', f: ['#fbf7ee', '#2f6b3a', '#c8372d'],
    intro: 'Schnitzel, Tafelspitz und eine Mehlspeisen-Tradition, um die die ganze Welt Österreich beneidet. Wiener Kaffeehaus trifft Alpenhütte.' },
  { id: 'schweiz', name: 'Schweizer Küche', kurz: 'Schweiz', unter: 'Käse, Rösti & Alpenküche', gruppe: 'europa', bg: '#b3262b', ak: '#ffffff', muster: 'kreuz', f: ['#b3262b', '#f6f1ea', '#f6f1ea'],
    intro: 'Bergkäse, Rösti und Zürcher Geschnetzeltes: ehrliche Alpenküche, die nach Wanderung und Hüttenabend schmeckt.' },
  { id: 'italien', name: 'Italienische Küche', kurz: 'Italien', unter: 'Pasta, Pizza & Dolci', gruppe: 'europa', bg: '#1f4d36', ak: '#e8644f', muster: 'majolika', f: ['#fbf5e6', '#1f5aa6', '#e8b318'],
    intro: 'Wenige, aber beste Zutaten – das ist das Geheimnis Italiens. Von der Carbonara aus Rom bis zum Tiramisù aus Venetien, so wie es die Nonna macht.' },
  { id: 'frankreich', name: 'Französische Küche', kurz: 'Frankreich', unter: 'Bistro & Haute Cuisine', gruppe: 'europa', bg: '#1f2f5c', ak: '#d9b38c', muster: 'lilie', f: ['#f2f4f7', '#24407a', '#b8973f'],
    intro: 'Die Mutter aller Kochschulen: Saucen, Schmorgerichte und Patisserie. Bistro-Klassiker und große Küche, Schritt für Schritt entzaubert.' },
  { id: 'spanien', name: 'Spanische Küche', kurz: 'Spanien', unter: 'Tapas & Paella', gruppe: 'europa', bg: '#a32a1d', ak: '#f2b632', muster: 'sevilla', f: ['#fbf1dc', '#1d4e8f', '#e0901c'],
    intro: 'Tapas zum Teilen, Paella aus der großen Pfanne und Meeresfrüchte, wie man sie am Hafen isst. Spanien kocht für Gesellschaft.' },
  { id: 'portugal', name: 'Portugiesische Küche', kurz: 'Portugal', unter: 'Bacalhau & Pastéis', gruppe: 'europa', bg: '#1d4e8f', ak: '#f2ede3', muster: 'azulejo', f: ['#f7f9fc', '#1e4fa0', '#1e4fa0'],
    intro: 'Stockfisch auf hundert Arten, gegrillte Sardinen und die berühmten Pastéis de Nata – Portugal ist Atlantik pur.' },
  { id: 'griechenland', name: 'Griechische Küche', kurz: 'Griechenland', unter: 'Meze & Taverne', gruppe: 'europa', bg: '#19588f', ak: '#f5f2e8', muster: 'maeander', f: ['#f4f8fb', '#1b5f9e', '#1b5f9e'],
    intro: 'Olivenöl, Zitrone, Oregano und das Meer: Taverne zum Nachkochen, von Moussaka bis Oktopus vom Grill.' },
  { id: 'tuerkei', name: 'Türkische Küche', kurz: 'Türkei', unter: 'Kebap, Meze & Baklava', gruppe: 'europa', bg: '#8e1f2a', ak: '#4fd1c5', muster: 'iznik', f: ['#f8f6f0', '#1c5f8c', '#c4312b'],
    intro: 'Zwischen Europa und Asien: Meze-Tafeln, Kebap vom Holzkohlegrill und Süßes aus hauchdünnem Teig.' },
  { id: 'britisch-irisch', name: 'Britische & Irische Küche', kurz: 'Großbritannien & Irland', unter: 'Pub & Sunday Roast', gruppe: 'europa', bg: '#22402f', ak: '#d9b23a', muster: 'victoria', f: ['#efe9dc', '#2f4f3f', '#8d2b2b'],
    intro: 'Sunday Roast, Fish & Chips und Puddings, die besser sind als ihr Ruf. Gemütliche Pub-Küche von London bis Dublin.' },
  { id: 'benelux', name: 'Niederlande, Belgien & Luxemburg', kurz: 'Benelux', unter: 'Waffeln & Brotkultur', gruppe: 'europa', bg: '#c75a1c', ak: '#1d2d4f', muster: 'delft', f: ['#f6f8fb', '#23468c', '#23468c'],
    intro: 'Moules-frites, Stamppot und belgische Waffeln: bodenständig, gesellig und überraschend raffiniert.' },
  { id: 'skandinavien', name: 'Skandinavische Küche', kurz: 'Skandinavien', unter: 'Nordische Küche', gruppe: 'europa', bg: '#2c4a5e', ak: '#e9e4d8', muster: 'nordisch', f: ['#eef2f3', '#2e4e66', '#c0473a'],
    intro: 'Hering, Lachs, Zimtschnecken und Smørrebrød: klare nordische Küche mit viel Fisch und noch mehr Gemütlichkeit.' },
  { id: 'polen', name: 'Polnische Küche', kurz: 'Polen', unter: 'Pierogi, Bigos & Żurek', gruppe: 'europa', bg: '#a51e2d', ak: '#f5f0e6', muster: 'volkskunst', f: ['#f6f0e3', '#1f4a8a', '#c2302c'],
    intro: 'Teigtaschen, Sauerkraut und herzhafte Suppen: Polen kocht großzügig, deftig und mit viel Familiensinn.' },
  { id: 'tschechien-slowakei', name: 'Tschechische & Slowakische Küche', kurz: 'Tschechien & Slowakei', unter: 'Knödel, Braten & Kolatschen', gruppe: 'europa', bg: '#1d3f73', ak: '#e8c547', muster: 'stickerei', f: ['#f6efe6', '#1d3f73', '#c2302c'],
    intro: 'Böhmische Knödel, Schweinebraten mit Kraut und süße Kolatschen – Küche, die nach Wirtshaus und Großmutter schmeckt.' },
  { id: 'ukraine', name: 'Ukrainische Küche', kurz: 'Ukraine', unter: 'Borschtsch & Varenyky', gruppe: 'europa', bg: '#1f4e9c', ak: '#f5c518', muster: 'volkskunst', f: ['#f6f0e3', '#1f4e9c', '#f5c518'],
    intro: 'Der echte Borschtsch, gefüllte Varenyky und Festtagsbrote: die Küche der Kornkammer Europas.' },
  { id: 'ungarn-balkan', name: 'Ungarn & Balkan', kurz: 'Ungarn & Balkan', unter: 'Paprika & Grill', gruppe: 'europa', bg: '#8f2612', ak: '#f2d3a0', muster: 'stickerei', f: ['#f6efe6', '#b02a30', '#2f6b3a'],
    intro: 'Gulasch aus dem Kessel, Ćevapčići vom Rost und Paprika in allen Farben – feurig und gesellig.' },

  { id: 'indien', name: 'Indische Küche', kurz: 'Indien', unter: 'Curry, Tandoor & Masala', gruppe: 'asien', bg: '#a14d16', ak: '#f4dcb0', muster: 'mandala', f: ['#fbf3e3', '#a33b1c', '#e39b17'],
    intro: 'Gewürze rösten, Masala mahlen, Curry ziehen lassen: Indien ist ein ganzer Kontinent an Geschmack – hier Schritt für Schritt erklärt.' },
  { id: 'china', name: 'Chinesische Küche', kurz: 'China', unter: 'Wok & Dim Sum', gruppe: 'asien', bg: '#9c1a17', ak: '#e2b13c', muster: 'gitter', f: ['#f5ecdf', '#a8221d', '#c9a227'],
    intro: 'Feuer im Wok, Dampf im Bambuskorb: von Kanton bis Sichuan die großen Klassiker der chinesischen Küche.' },
  { id: 'japan', name: 'Japanische Küche', kurz: 'Japan', unter: 'Sushi, Ramen & Umami', gruppe: 'asien', bg: '#1e2b4a', ak: '#e8644f', muster: 'seigaiha', f: ['#eef2f6', '#22385e', '#c8402f'],
    intro: 'Präzision, Jahreszeit und Umami: Sushi, Ramen, Tempura – und das Handwerk dahinter.' },
  { id: 'thailand', name: 'Thailändische Küche', kurz: 'Thailand', unter: 'Scharf, süß, sauer, salzig', gruppe: 'asien', bg: '#13513e', ak: '#e8b33a', muster: 'lotus', f: ['#f4f0e6', '#2c6b4f', '#d79a1e'],
    intro: 'Das Spiel von scharf, süß, sauer und salzig: Currys, Wok und Salate, die nach Garküche in Bangkok schmecken.' },
  { id: 'vietnam', name: 'Vietnamesische Küche', kurz: 'Vietnam', unter: 'Phở & frische Kräuter', gruppe: 'asien', bg: '#2f5a2c', ak: '#e8c547', muster: 'bambus', f: ['#eef3ec', '#356b3c', '#d6a520'],
    intro: 'Leicht, frisch und voller Kräuter: Phở, Sommerrollen und Bánh mì aus den Straßen von Hanoi und Saigon.' },
  { id: 'korea', name: 'Koreanische Küche', kurz: 'Korea', unter: 'Kimchi & Grill', gruppe: 'asien', bg: '#1b5a63', ak: '#ff8a6b', muster: 'dancheong', f: ['#f2f2ee', '#2a6f78', '#c8462f'],
    intro: 'Kimchi, Bulgogi und brodelnde Eintöpfe: Korea kocht würzig, fermentiert und mit Grill direkt am Tisch.' },
  { id: 'indonesien-malaysia', name: 'Indonesische & Malaysische Küche', kurz: 'Indonesien & Malaysia', unter: 'Rendang, Satay & Nasi Goreng', gruppe: 'asien', bg: '#4a2a17', ak: '#d9a45b', muster: 'batik', f: ['#f4ead9', '#5a3820', '#b5702c'],
    intro: 'Sambal, Kokos und Gewürzpasten: die Garküchen von Java, Penang und Singapur.' },
  { id: 'philippinen', name: 'Philippinische Küche', kurz: 'Philippinen', unter: 'Adobo, Lechon & Halo-Halo', gruppe: 'asien', bg: '#0d3b7a', ak: '#f2c14e', muster: 'tropen', f: ['#eef6f1', '#0d3b7a', '#f2c14e'],
    intro: 'Sauer, salzig, süß und immer gesellig: Adobo, knuspriges Schwein und bunte Desserts von 7000 Inseln.' },
  { id: 'nepal-tibet', name: 'Küche aus Nepal & Tibet', kurz: 'Nepal & Tibet', unter: 'Momos, Dal Bhat & Thukpa', gruppe: 'asien', bg: '#7a1f2b', ak: '#f2b632', muster: 'mandala', f: ['#fbf3e3', '#7a1f2b', '#f2b632'],
    intro: 'Hochlandküche vom Dach der Welt: gedämpfte Momos, wärmende Nudelsuppen und Dal Bhat, das Nepal jeden Tag isst.' },
  { id: 'zentralasien', name: 'Küche Zentralasiens', kurz: 'Zentralasien', unter: 'Plov, Manti & Schaschlik', gruppe: 'asien', bg: '#1c6f8c', ak: '#f2d16b', muster: 'girih', f: ['#eef5f6', '#1c6f8c', '#c99a2e'],
    intro: 'Entlang der Seidenstraße: Plov aus dem Kasan, Teigtaschen, Brot aus dem Lehmofen und Spieße über Glut.' },

  { id: 'levante', name: 'Levante-Küche', kurz: 'Libanon & Levante', unter: 'Mezze & Ofenbrot', gruppe: 'orient', bg: '#3e4f2a', ak: '#e5cfa0', muster: 'arabeske', f: ['#f3efe6', '#215e5a', '#b8862e'],
    intro: 'Hummus, Tabouleh und Fladenbrot aus dem Ofen: die Mezze-Tafel des östlichen Mittelmeers.' },
  { id: 'persien', name: 'Persische Küche', kurz: 'Persien', unter: 'Safran, Reis & Kebab', gruppe: 'orient', bg: '#145a6e', ak: '#e2b13c', muster: 'girih', f: ['#eef5f6', '#17607a', '#c99a2e'],
    intro: 'Safranreis mit goldener Kruste, Kräuter-Schmorgerichte und Kebab: eine der feinsten Küchen der Welt.' },
  { id: 'arabien', name: 'Küche der Arabischen Halbinsel', kurz: 'Arabische Halbinsel', unter: 'Kabsa, Mandi & Datteln', gruppe: 'orient', bg: '#7a4a1e', ak: '#f2d16b', muster: 'arabeske', f: ['#f3efe6', '#7a4a1e', '#c99a2e'],
    intro: 'Gewürzreis mit Lamm, Fisch vom Golf und Datteln zum Kaffee: Gastfreundschaft von Oman bis Saudi-Arabien.' },
  { id: 'kaukasus', name: 'Kaukasische Küche', kurz: 'Kaukasus', unter: 'Chatschapuri & Khinkali', gruppe: 'orient', bg: '#5a1f33', ak: '#e9c46a', muster: 'girih', f: ['#f6efe6', '#5a1f33', '#e9c46a'],
    intro: 'Georgien, Armenien und Aserbaidschan: Käsebrot, Teigtaschen, Walnüsse und Granatapfel – eine Entdeckung.' },

  { id: 'nordafrika', name: 'Nordafrikanische Küche', kurz: 'Marokko & Nordafrika', unter: 'Tajine & Couscous', gruppe: 'afrika', bg: '#8f3d1e', ak: '#7fd1c0', muster: 'zellige', f: ['#f5f1e8', '#1d6a5c', '#b0412b'],
    intro: 'Tajine aus dem Lehmtopf, Couscous mit sieben Gemüsen und Gewürzmischungen aus dem Souk.' },
  { id: 'westafrika', name: 'Westafrikanische Küche', kurz: 'Westafrika', unter: 'Jollof, Suya & Thieboudienne', gruppe: 'afrika', bg: '#1f5c3a', ak: '#f2b632', muster: 'kente', f: ['#f5ecd7', '#1f5c3a', '#d0961d'],
    intro: 'Jollof-Reis, Erdnusseintopf und Fisch vom Holzkohlegrill: kräftige, fröhliche Küche von Senegal bis Kamerun.' },
  { id: 'ostafrika', name: 'Küche Äthiopiens & Ostafrikas', kurz: 'Äthiopien & Ostafrika', unter: 'Injera, Wat & Sansibar-Pilau', gruppe: 'afrika', bg: '#5c2a12', ak: '#f2c14e', muster: 'kente', f: ['#f5ecd7', '#5c2a12', '#f2c14e'],
    intro: 'Injera mit würzigen Wats, Gewürzreis von Sansibar und Grillfleisch aus Kenia.' },
  { id: 'suedafrika', name: 'Südafrikanische Küche', kurz: 'Südafrika', unter: 'Braai, Bobotie & Bunny Chow', gruppe: 'afrika', bg: '#14533b', ak: '#f2b632', muster: 'kente', f: ['#f5ecd7', '#14533b', '#f2b632'],
    intro: 'Braai am Feuer, Kapmalaien-Currys und süße Koeksisters: die Regenbogenküche vom Kap.' },

  { id: 'usa', name: 'US-amerikanische Küche', kurz: 'USA', unter: 'Burger, BBQ & Diner', gruppe: 'amerika', bg: '#1f2d4f', ak: '#ff7a6b', muster: 'quilt', f: ['#f3f1ec', '#23395e', '#b22d2d'],
    intro: 'Diner-Klassiker, Barbecue aus dem Smoker und Südstaatenküche: Amerika ist mehr als Burger.' },
  { id: 'kanada', name: 'Kanadische Küche', kurz: 'Kanada', unter: 'Poutine, Ahornsirup & Hummer', gruppe: 'amerika', bg: '#a3161f', ak: '#ffffff', muster: 'quilt', f: ['#f3f1ec', '#a3161f', '#23395e'],
    intro: 'Poutine aus Québec, Hummer aus Nova Scotia und Ahornsirup auf allem, was süß sein darf.' },
  { id: 'mexiko', name: 'Mexikanische Küche', kurz: 'Mexiko', unter: 'Tacos, Mole & Salsa', gruppe: 'amerika', bg: '#9c1748', ak: '#f2c14e', muster: 'talavera', f: ['#fbf6ea', '#1b4f9c', '#e3a019'],
    intro: 'Mais, Chili und Limette: Tacos, Mole und Salsas – die echte mexikanische Küche, nicht die vom Fast-Food-Laden.' },
  { id: 'karibik', name: 'Karibische Küche', kurz: 'Karibik', unter: 'Jerk, Kokos & Sonne', gruppe: 'amerika', bg: '#0f6464', ak: '#f2b632', muster: 'tropen', f: ['#eef6f1', '#1d7a5a', '#e39b1a'],
    intro: 'Jerk-Würze, Kokosmilch und tropische Früchte: Inselküche von Jamaika bis Kuba.' },
  { id: 'peru', name: 'Peruanische Küche', kurz: 'Peru', unter: 'Ceviche, Lomo Saltado & Ají', gruppe: 'amerika', bg: '#b81d2c', ak: '#ffffff', muster: 'anden', f: ['#f6eee2', '#b81d2c', '#2f7a6a'],
    intro: 'Ceviche, Kartoffeln aus den Anden und Chinesisch-Peruanisches aus dem Wok: eine der aufregendsten Küchen der Welt.' },
  { id: 'brasilien', name: 'Brasilianische Küche', kurz: 'Brasilien', unter: 'Feijoada, Churrasco & Brigadeiros', gruppe: 'amerika', bg: '#1b6b35', ak: '#f2d22e', muster: 'tropen', f: ['#eef6f1', '#1b6b35', '#f2d22e'],
    intro: 'Bohnentopf, Churrasco vom Spieß und Kokos-Garnelen aus Bahia: Brasilien kocht laut und fröhlich.' },
  { id: 'argentinien', name: 'Argentinische & Uruguayische Küche', kurz: 'Argentinien & Uruguay', unter: 'Asado, Empanadas & Dulce de Leche', gruppe: 'amerika', bg: '#3b7fc4', ak: '#ffffff', muster: 'anden', f: ['#f6eee2', '#3b7fc4', '#8a2d24'],
    intro: 'Asado über Glut, Empanadas und Dulce de Leche: die Feuerküche vom Río de la Plata.' },
  { id: 'suedamerika', name: 'Küche Südamerikas', kurz: 'Südamerika', unter: 'Kolumbien, Venezuela & Chile', gruppe: 'amerika', bg: '#145c4a', ak: '#f2a65a', muster: 'anden', f: ['#f6eee2', '#8a2d24', '#2f7a6a'],
    intro: 'Arepas, Sancocho und Empanadas: die Küchen von Kolumbien, Venezuela, Chile, Ecuador, Bolivien und Paraguay.' },

  { id: 'australien', name: 'Australische Küche', kurz: 'Australien', unter: 'Meat Pie, Pavlova & Barbie', gruppe: 'ozeanien', bg: '#0f3d6e', ak: '#f2b632', muster: 'tropen', f: ['#eef6f1', '#0f3d6e', '#f2b632'],
    intro: 'Barbecue am Strand, Meat Pies und Pavlova: lässige Küche mit bestem Fisch und Meeresfrüchten.' },
  { id: 'neuseeland', name: 'Neuseeländische Küche', kurz: 'Neuseeland', unter: 'Lamm, Muscheln & Hāngī', gruppe: 'ozeanien', bg: '#161616', ak: '#e8f1ea', muster: 'nordisch', f: ['#eef2f3', '#161616', '#e8f1ea'],
    intro: 'Lamm von grünen Weiden, Grünlippmuscheln und das Hāngī der Māori aus dem Erdofen.' },
  { id: 'suedsee', name: 'Küche der Südsee', kurz: 'Südsee', unter: 'Poke, Kokos & Hawaii', gruppe: 'ozeanien', bg: '#0f7a8a', ak: '#ffd166', muster: 'tropen', f: ['#eef6f1', '#0f7a8a', '#ffd166'],
    intro: 'Poke aus Hawaii, Fisch in Kokosmilch von Tahiti bis Fidschi und Schweinebraten aus dem Erdofen.' }
];
KB.KUECHE = {};
KB.KUECHEN.forEach(k => KB.KUECHE[k.id] = k);

/* Regalreihen für breite Bildschirme (PC, Tablet quer) mit Köchen; schmale Bildschirme nutzen wischbare Reihen */
KB.REGAL = {
  sonder: [[['suppen', 'backbuch', 'desserts'], 'globus', 330], [['fruehstueck', 'abendbrot', 'schnell'], 'segler', 330], [['grill', 'streetfood', 'fest'], 'ferien', 380]],
  europa: [[['deutsch', 'oesterreich', 'schweiz'], 'bayer', 372], [['italien', 'spanien', 'portugal'], 'nonna', 360],
    [['frankreich', 'benelux', 'britisch-irisch', 'griechenland', 'tuerkei'], 'kletter-frank'], [['skandinavien', 'polen', 'tschechien-slowakei'], 'eskimo', 330], [['ukraine', 'ungarn-balkan'], 'ungarn', 350]],
  asien: [[['indien', 'japan', 'thailand', 'vietnam', 'korea'], 'kletter-asien'], [['china', 'nepal-tibet', 'zentralasien'], 'duerr', 372], [['indonesien-malaysia', 'philippinen'], 'sushi', 320]],
  orient: [[['levante', 'persien', 'arabien', 'kaukasus'], 'orient', 276]],
  afrika: [[['nordafrika', 'westafrika', 'ostafrika', 'suedafrika'], 'wok', 236]],
  amerika: [[['usa', 'kanada'], 'kanada', 350], [['mexiko', 'karibik', 'peru'], 'mexiko', 330], [['brasilien', 'argentinien', 'suedamerika'], 'gaucho', 330]],
  ozeanien: [[['australien', 'neuseeland', 'suedsee'], 'aussie', 340]]
};
KB.KOCHBILD = {
  bayer: { v: 520 / 400, alt: 'Dicker bayerischer Koch in Lederhose mit Maß Bier jagt mit dem Messer ein Schwein' },
  nonna: { v: 380 / 392, alt: 'Italienische Nonna mit Nudelholz und Spaghetti' },
  eskimo: { v: 440 / 350, alt: 'Eskimo-Koch mit Pelzmütze brät Fisch vor dem Iglu' },
  duerr: { v: 520 / 410, alt: 'Dürrer chinesischer Koch in roter Jacke jagt mit dem Hackebeil ein Huhn' },
  sushi: { v: 460 / 356, alt: 'Sushi-Meister mit Riesenthunfisch' },
  wok: { v: 1, alt: 'Afrikanischer Koch schwenkt die Pfanne am Herd' },
  kanada: { v: 480 / 380, alt: 'Kanadischer Holzfäller-Koch mit Ahornsirup, Pfannkuchen und Elch' },
  mexiko: { v: 370 / 385, alt: 'Kleiner dicker mexikanischer Koch mit Sombrero und Tacos' },
  aussie: { v: 400 / 395, alt: 'Australischer Koch der Aborigines spielt Didgeridoo am Barbecue' },
  ungarn: { v: 1, alt: 'Ungarischer Koch mit Paprikakette rührt Gulasch im Kessel über dem Feuer' },
  gaucho: { v: 480 / 400, alt: 'Argentinischer Asado-Koch mit Steak, Mate und Fleisch am Kreuz über der Glut' },
  orient: { v: 460 / 400, rand: -40, alt: 'Bärtiger Schawarma-Meister schneidet mit dem langen Messer am Drehspieß, auf dem Teller gerollte Fladenbrote' },
  'kletter-frank': { v: 240 / 420, kletter: true, alt: 'Kleiner Koch mit Baguette zwischen den Zähnen klettert schwitzend auf das Kochbuch' },
  'kletter-asien': { v: 240 / 420, kletter: true, alt: 'Kleiner Koch mit Nudelschüssel auf der Mütze zieht sich an der Buchkante hoch' },
  globus: { v: 380 / 420, alt: 'Klassischer Tischglobus' },
  segler: { v: 400 / 420, alt: 'Weltkugel mit großem Segelboot' },
  ferien: { v: 430 / 590, alt: 'Urlaubs-Weltkugel mit Sonne, Palme, fröhlichen Figuren und Essen' }
};
KB.KOECHE_HANDY = { sonder: ['segler', 'ferien'], europa: ['bayer', 'nonna', 'eskimo', 'ungarn'], asien: ['duerr', 'sushi'], orient: ['orient'], afrika: ['wok'], amerika: ['mexiko', 'kanada', 'gaucho'], ozeanien: ['aussie'] };

/* Sonderbände – quer durch alle Küchen */
KB.SONDER = [
  { id: 'suppen', kurz: 'Suppen & Eintöpfe', unter: 'Aus einem Topf – wärmt Leib und Seele', test: r => r.g === 'suppe' || r.g === 'eintopf', kapitel: 'gang',
    cb: { bild: 'eintopf', farben: ['#a0522d', '#e0a24a', '#3a7d44'] }, intro: 'Klare Brühen, cremige Suppen und sättigende Eintöpfe aus aller Welt – vom Westerwälder Kartoffeleintopf bis zum Gumbo aus New Orleans.' },
  { id: 'backbuch', kurz: 'Backbuch', unter: 'Kuchen, Torten, Plätzchen & Brot', test: r => ['kuchen', 'gebaeck', 'brot'].includes(r.g), kapitel: 'gang',
    cb: { bild: 'torte', farben: ['#f3e2c4', '#b8273a', '#f7f1e6'] }, intro: 'Blechkuchen, Torten, Plätzchen und Brot aus dem eigenen Ofen – mit Teigtemperatur, Gehzeiten und Stäbchenprobe genau erklärt.' },
  { id: 'desserts', kurz: 'Desserts', unter: 'Cremes, Mehlspeisen & Eis', test: r => r.g === 'dessert', kapitel: 'gruppe',
    cb: { bild: 'dessert', farben: ['#f7f1e6', '#b8273a', '#e8b33a'] }, intro: 'Der krönende Abschluss: Cremes, Mehlspeisen, Puddings und Eis aus allen Küchen der Welt.' },
  { id: 'fruehstueck', kurz: 'Frühstück der Welt', unter: 'Vom Sonntagsfrühstück bis Kahvaltı', test: r => r.g === 'fruehstueck', kapitel: 'gruppe',
    cb: { bild: 'eier', farben: ['#c97a3a', '#d9472b', '#e8c27a'] }, intro: 'Vom deutschen Sonntagsfrühstück über das türkische Kahvaltı bis zum japanischen Morgenreis.' },
  { id: 'abendbrot', kurz: 'Abendbrot & Brotzeit', unter: 'Brettl, Aufstriche & Salate', test: r => r.g === 'abendbrot', kapitel: 'gruppe',
    cb: { bild: 'brot', farben: ['#a8682e', '#7a4a22', '#e7cf9f'] }, intro: 'Was traditionell abends auf den Tisch kommt: Brotzeit, Aufstriche, Salate und kleine warme Gerichte.' },
  { id: 'schnell', kurz: 'Schnelle Küche', unter: 'In 30 Minuten auf dem Tisch', test: r => r.z <= 30 && !['sauce'].includes(r.g), kapitel: 'gang',
    cb: { bild: 'pfanne', farben: ['#d9a050', '#5f8f3a', '#c43d2b'] }, intro: 'Alles, was in höchstens 30 Minuten fertig auf dem Tisch steht – für Feierabend und Hunger.' },
  { id: 'grill', kurz: 'Grillen & BBQ', unter: 'Von Brisket bis Braai', test: r => (r.th || []).includes('grill'), kapitel: 'hauptkategorie',
    cb: { bild: 'spiess', farben: ['#7a3e1d', '#c0392b', '#f2b632'] }, intro: 'Glut, Rauch und Geduld: Grillgerichte aus aller Welt – direkte und indirekte Hitze, Kerntemperaturen und Marinaden erklärt.' },
  { id: 'streetfood', kurz: 'Street Food', unter: 'Von Bánh mì bis Bunny Chow', test: r => (r.th || []).includes('streetfood'), kapitel: 'gruppe',
    cb: { bild: 'sandwich', farben: ['#d9a441', '#c0392b', '#3a7d44'] }, intro: 'Was an den Garküchen und Imbissbuden der Welt über den Tresen geht – zum Nachmachen zu Hause.' },
  { id: 'fest', kurz: 'Festtagsküche', unter: 'Weihnachten, Ostern & Feste der Welt', test: r => (r.th || []).includes('fest'), kapitel: 'gruppe',
    cb: { bild: 'braten-scheiben', farben: ['#7a3e1d', '#c0392b', '#f2c14e'] }, intro: 'Weihnachten, Ostern, Ramadan, Chinesisches Neujahr und Hochzeiten: was die Welt an ihren Festtagen kocht.' }
];
KB.SONDER_ID = {}; KB.SONDER.forEach(s => { s.bg = '#223448'; s.ak = '#f39c12'; s.sonder = true; KB.SONDER_ID[s.id] = s; });

KB.HAUPT = [
  { id: 'fleisch', name: 'Fleisch', farbe: '#e0614f' },
  { id: 'fisch', name: 'Fisch & Meeresfrüchte', farbe: '#4da6ff' },
  { id: 'vegetarisch', name: 'Vegetarisch', farbe: '#7fbf5a' },
  { id: 'vegan', name: 'Vegan', farbe: '#3fbf8a' },
  { id: 'suess', name: 'Süßes & Gebäck', farbe: '#e48ac0' }
];
KB.HAUPT_NAME = {}; KB.HAUPT.forEach(h => KB.HAUPT_NAME[h.id] = h.name);

KB.FLEISCH = {
  rind: 'Rind', kalb: 'Kalb', schwein: 'Schwein', lamm: 'Lamm', ziege: 'Ziege',
  huhn: 'Huhn', pute: 'Pute', ente: 'Ente', gans: 'Gans', wild: 'Wild',
  kaninchen: 'Kaninchen', hackfleisch: 'Hackfleisch', innereien: 'Innereien', gemischt: 'Gemischt'
};
KB.FISCH = { fisch: 'Fisch', meeresfruechte: 'Meeresfrüchte', gemischt: 'Fisch & Meeresfrüchte' };

KB.GANG = {
  fruehstueck: 'Frühstück', vorspeise: 'Vorspeise', salat: 'Salat', snack: 'Snack & Streetfood', suppe: 'Suppe', eintopf: 'Eintopf',
  hauptgericht: 'Hauptgericht', beilage: 'Beilage', sauce: 'Saucen & Dips', abendbrot: 'Abendbrot & Brotzeit', brot: 'Brot',
  dessert: 'Dessert', kuchen: 'Kuchen & Torten', gebaeck: 'Gebäck'
};
/* Kapitel eines Länderbuchs (Reihenfolge wie im gedruckten Kochbuch) */
KB.KAPITEL = [
  { id: 'fruehstueck', name: 'Frühstück', test: r => r.g === 'fruehstueck' },
  { id: 'vorspeisen', name: 'Vorspeisen, Salate & Snacks', test: r => ['vorspeise', 'salat', 'snack'].includes(r.g) },
  { id: 'suppen', name: 'Suppen', test: r => r.g === 'suppe' },
  { id: 'eintoepfe', name: 'Eintöpfe', test: r => r.g === 'eintopf' },
  { id: 'fleisch', name: 'Hauptgerichte mit Fleisch', test: r => r.g === 'hauptgericht' && r.h === 'fleisch' },
  { id: 'fisch', name: 'Fisch & Meeresfrüchte', test: r => r.g === 'hauptgericht' && r.h === 'fisch' },
  { id: 'veggie', name: 'Vegetarisch & vegan', test: r => r.g === 'hauptgericht' && (r.h === 'vegetarisch' || r.h === 'vegan') },
  { id: 'beilagen', name: 'Beilagen & Saucen', test: r => ['beilage', 'sauce'].includes(r.g) },
  { id: 'brot', name: 'Brot & Abendbrot', test: r => ['brot', 'abendbrot'].includes(r.g) },
  { id: 'suess', name: 'Desserts, Kuchen & Gebäck', test: r => ['dessert', 'kuchen', 'gebaeck'].includes(r.g) || (r.g === 'hauptgericht' && r.h === 'suess') }
];
KB.SCHWIERIG = { 1: 'einfach', 2: 'mittel', 3: 'anspruchsvoll' };

KB.BEKANNT = function (b) {
  if (b >= 95) return 'Weltbekannt';
  if (b >= 85) return 'Sehr bekannt';
  if (b >= 70) return 'Klassiker';
  if (b >= 50) return 'Für Kenner';
  return 'Geheimtipp';
};
