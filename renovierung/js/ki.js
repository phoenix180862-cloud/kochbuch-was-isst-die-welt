/* TW Renovierungs-App – KI (freiwillig).
   Weg A: „Mit Ihrer KI öffnen“ – fertige Anfrage in die Zwischenablage (kostet nichts, keine Daten an uns).
   Weg F: eigener Anthropic-Schlüssel des Nutzers – bleibt nur in diesem Browser; Fotos und Text gehen dann direkt an Anthropic.
   Ohne KI funktioniert die App vollständig. */
(function (root) {
  'use strict';
  /* Stufen statt Modellnamen – Modell nur hier ändern */
  const MODELLE = { schnell: 'claude-haiku-5-5', standard: 'claude-sonnet-5-5', gruendlich: 'claude-opus-5-5' };
  const FACHBETRIEB = 'Fachbetrieb-Hinweis: Thomas Willwacher Fliesenlegermeister e.K.';

  /* Fertige Anfrage für die eigene KI des Nutzers */
  function anfrage(v, a, m, o, material, R) {
    const z = R.zahl; const zeilen = [];
    zeilen.push(`Ich plane als Hauseigentümer folgende Arbeit selbst: „${a.titel}“${v.raumName ? ` (${v.raumName})` : ''}.`);
    if (m.R) {
      const r = m.R;
      zeilen.push(`Raum: ${z(r.l)} m × ${z(r.b)} m${r.h ? `, Höhe ${z(r.h)} m` : ''}; ${r.fenster.length} Fenster, ${r.tueren.length} Tür(en).`);
      zeilen.push(`Berechnet: Wandfläche netto ${z(r.wandNetto)} m², Bodenfläche ${z(r.boden)} m², Umfang ${z(r.umfang)} m.`);
    } else {
      (a.aufnahme.felder || []).forEach(f => { if (m[f.id] !== undefined && m[f.id] !== '') zeilen.push(`${f.label}: ${z(m[f.id])} ${f.einheit}`); });
    }
    const opt = (a.optionen || []).map(x => {
      const w = o[x.id]; if (w === undefined || w === '' || w === false) return null;
      if (x.typ === 'wahl') { const e = x.werte.find(y => y[0] === w); return `${x.label} ${e ? e[1] : w}`; }
      if (x.typ === 'ja') return x.label; return `${x.label}: ${w}`;
    }).filter(Boolean);
    if (opt.length) zeilen.push('Angaben: ' + opt.join('; ') + '.');
    if (v.baujahr) zeilen.push(`Baujahr des Hauses: ${v.baujahr}.`);
    if (v.notiz) zeilen.push(`Meine Notiz: ${v.notiz}`);
    if (material && material.length) {
      zeilen.push('', 'Meine App hat folgendes Material berechnet:');
      material.forEach(p => zeilen.push(`- ${z(p.menge)} ${p.einheit} ${p.name}${p.detail ? ` (${p.detail})` : ''}`));
    }
    zeilen.push('', 'Bitte prüfen Sie den Plan und die Mengen, nennen Sie mir typische Fehler bei genau dieser Situation und sagen Sie mir klar, wenn etwas davon in die Hände eines Fachbetriebs gehört (Strom, Gas, Statik, Asbest, Abdichtung).');
    zeilen.push('Wenn ich ein Foto anhänge: Beschreiben Sie bitte, was Sie darauf zum Zustand erkennen.');
    zeilen.push('', `Erstellt mit der kostenlosen TW Renovierungs-App. ${FACHBETRIEB}`);
    return zeilen.join('\n');
  }

  /* Eigener Schlüssel: Foto + Vorhaben an Anthropic, Antwort als JSON */
  async function fotoAuswerten({ schluessel, stufe, bildBlob, arbeiten, text }) {
    if (!schluessel) throw new Error('Kein KI-Schlüssel eingetragen.');
    const b64 = await new Promise(ok => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.readAsDataURL(bildBlob); });
    const liste = arbeiten.map(a => `${a.id}: ${a.titel}`).join('\n');
    const frage = `Du hilfst einem Hauseigentümer, eine Renovierungsarbeit zu planen. Er hat ein Foto gemacht${text ? ` und dazu gesagt: „${text}“` : ''}.
Ordne das Vorhaben einer dieser Arbeiten zu (nur die ID):
${liste}
Schätze, falls ein Raum zu sehen ist, grob Länge, Breite und Höhe in Metern sowie die Anzahl sichtbarer Fenster und Türen. Beschreibe kurz den Zustand und nenne Auffälligkeiten (z. B. Feuchte, Risse, alte Beläge mit Asbestverdacht, Elektro). Wenn du etwas nicht erkennen kannst, gib null an.
Antworte NUR mit JSON in genau dieser Form:
{"arbeit":"<id oder null>","raum":{"laenge":<zahl|null>,"breite":<zahl|null>,"hoehe":<zahl|null>,"fenster":<zahl|null>,"tueren":<zahl|null>},"zustand":"<kurzer Satz>","hinweise":["<kurz>"]}`;
    let antwort;
    try {
      antwort = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': schluessel, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: MODELLE[stufe] || MODELLE.standard, max_tokens: 800, messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64 } }, { type: 'text', text: frage }] }] })
      });
    } catch (e) { throw new Error('Die KI ist gerade nicht erreichbar (keine Internetverbindung?). Die App funktioniert ohne KI weiter.'); }
    if (antwort.status === 401) throw new Error('Der KI-Schlüssel wurde abgelehnt. Bitte in den Einstellungen prüfen.');
    if (antwort.status === 429) throw new Error('Das Kontingent Ihres KI-Schlüssels ist gerade ausgeschöpft. Bitte später noch einmal versuchen.');
    if (!antwort.ok) throw new Error(`Die KI hat mit einem Fehler geantwortet (${antwort.status}). Die App funktioniert ohne KI weiter.`);
    const j = await antwort.json();
    const t = (j.content || []).map(c => c.text || '').join('');
    const m = t.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Die Antwort der KI war nicht lesbar.');
    return JSON.parse(m[0]);
  }

  root.TW_KI = { MODELLE, FACHBETRIEB, anfrage, fotoAuswerten };
})(window);
