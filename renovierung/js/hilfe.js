/* TW Renovierungs-App – Hilfe: Erklärvideos (Bildschirmaufnahmen der App) mit Untertiteln und Sprecherstimme.
   Die Sprecherstimme kommt aus der Sprachausgabe des Geräts (Web Speech API, deutsche Stimme) und folgt den Untertitel-Zeiten.
   Ist eine Ansage länger als ihr Abschnitt, wartet das Video kurz auf die Stimme. Ein/Aus-Schalter und Lautstärkeregler im Videofenster. */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const PREF = 'twreno.hilfe.v1';
  const lies = () => { try { return Object.assign({ stimme: true, laut: 0.9 }, JSON.parse(localStorage.getItem(PREF) || '{}')); } catch (e) { return { stimme: true, laut: 0.9 }; } };
  const merke = p => { try { localStorage.setItem(PREF, JSON.stringify(p)); } catch (e) { /* egal */ } };

  const ANLEITUNG = [
    ['Schnellstart', 'Tippen Sie auf „Schnellstart“. Machen Sie ein Foto vom Raum oder vom Schaden (freiwillig) und tippen oder sagen Sie ein Wort, z. B. „tapezieren“, „Silikonfuge“ oder „Klo läuft“. Die App zeigt die passende Arbeit – mit „Los geht’s“ wird Ihr Vorhaben angelegt.'],
    ['Aufnahme', 'Messen Sie Länge, Breite und Höhe in Metern. Fenster und Türen tragen Sie mit Breite × Höhe ein. Rechts sehen Sie sofort die Flächen und eine Skizze. Rote Hinweise zeigen fehlende oder unplausible Werte (z. B. 450 statt 4,50).'],
    ['Plan', 'Der Zeitplan verteilt die Arbeit auf Tage und Uhrzeiten – mit Trocken- und Wartezeiten. Den Beginn können Sie ändern, den ganzen Plan als Kalenderdatei exportieren.'],
    ['Material', 'Alle Mengen mit Verschnitt und auf handelsübliche Gebinde aufgerundet. Unter „Rechenweg“ steht jede Zahl. Haken entfernen, wenn Sie etwas schon haben.'],
    ['Werkzeug', 'Für jedes Werkzeug: „Habe ich“, „Brauche ich“ oder „Leihen“. Was Sie haben, merkt sich die App für alle weiteren Vorhaben.'],
    ['Einkauf', 'Die Baumarkt-Liste ist nach Abteilungen sortiert. Im Laden abhaken, per WhatsApp, SMS oder Mail teilen, kopieren oder drucken. Unter „Einkauf“ oben finden Sie alle Vorhaben in einer Liste.'],
    ['Ausführen', 'Schritt für Schritt mit Profi-Kniff, typischem Fehler und Sicherheitshinweis. „Erledigt“ antippen, Wartezeiten mit dem Kurzzeitwecker messen, Vorher- und Nachher-Fotos machen.'],
    ['Mein Haus', 'Der Wartungsplan erinnert an Kontrollen wie Rauchmelder, FI-Schalter oder Dachrinne. „Erledigt“ antippen – die nächste Fälligkeit rechnet die App aus. Mit „In den Kalender“ landen die Termine in Ihrem Handy-Kalender.'],
    ['Rotes Schild', 'Wo Strom (230 V), Gas, Statik oder Asbestverdacht im Spiel sind, zeigt die App ein rotes Schild „Fachbetrieb beauftragen“ statt einer Anleitung.'],
    ['Ihre Daten', 'Alles bleibt auf Ihrem Gerät. Unter Einstellungen → Sicherung speichern Sie alles als Datei, z. B. vor einem Gerätewechsel.']
  ];

  function stimmeWaehlen() {
    const v = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    const de = v.filter(x => /^de(-|_|$)/i.test(x.lang));
    return de.find(x => /natural|online|neural/i.test(x.name)) || de.find(x => /google/i.test(x.name)) || de.find(x => /anna|petra|helena|katja|markus|yannick|marlene|vicki/i.test(x.name)) || de[0] || null;
  }

  function oeffnen(start) {
    const VIDS = window.TW_VIDEOS || [];
    const A = window.TW_APP;
    const p = lies();
    const kannSprechen = 'speechSynthesis' in window;
    const d = A.dialog('Hilfe', `
      ${VIDS.length ? `<div class="video-rahmen"><video id="h-video" controls playsinline preload="none" crossorigin="anonymous"></video></div>
      <div class="untertitel-zeile" id="h-text" aria-live="polite"></div>
      <div class="video-steuer">
        ${kannSprechen ? `<label class="haken"><input type="checkbox" id="h-stimme" ${p.stimme ? 'checked' : ''}>${A.I.lautsprecher.replace('<svg', '<svg style="width:20px;height:20px"')} Sprecherstimme</label>
        <label class="haken">Lautstärke <input type="range" id="h-laut" min="0" max="1" step="0.05" value="${p.laut}" aria-label="Lautstärke der Sprecherstimme"></label>` : '<span class="klein">Ihr Browser hat keine Sprachausgabe – die Untertitel erklären alles.</span>'}
      </div>
      <div class="video-liste">${VIDS.map((v, i) => `<button type="button" data-video="${i}"><span style="font-family:var(--kopf);font-size:20px;color:var(--text-3)">${i + 1}</span><span>${esc(v.titel)}<small>${Math.round(v.dauer)} s</small></span></button>`).join('')}</div>
      <p class="klein" style="margin-top:8px">Die Videos werden erst beim Ansehen geladen. Die Stimme kommt aus der Sprachausgabe Ihres Geräts – sie klingt je nach Gerät unterschiedlich.</p>` : ''}
      <h2 style="margin-top:18px">Kurzanleitung</h2>
      <ol class="prosa" style="padding-left:20px">${ANLEITUNG.map(([t, x]) => `<li style="margin-bottom:8px"><b>${esc(t)}:</b> ${esc(x)}</li>`).join('')}</ol>
      <p class="klein">Fragen und Anregungen gern per E-Mail an <a href="mailto:info@thomas-willwacher.de">info@thomas-willwacher.de</a>.</p>`);
    if (!VIDS.length) return;
    const video = $('#h-video', d), text = $('#h-text', d);
    let aktuell = -1, wartet = null, autoPause = false, spricht = false;
    const sprich = t => {
      if (!kannSprechen || !p.stimme || !t) return;
      const u = new SpeechSynthesisUtterance(t); const s = stimmeWaehlen(); if (s) u.voice = s; u.lang = 'de-DE'; u.rate = 1.0; u.volume = p.laut;
      spricht = true;
      u.onend = u.onerror = () => { spricht = false; if (wartet) { const n = wartet; wartet = null; sprich(n); } if (!spricht && autoPause) { autoPause = false; video.play().catch(() => {}); } };
      speechSynthesis.speak(u);
    };
    const laden = i => {
      if (kannSprechen) speechSynthesis.cancel(); wartet = null; autoPause = false; spricht = false;
      aktuell = i; const v = VIDS[i];
      [...d.querySelectorAll('[data-video]')].forEach(b => b.classList.toggle('an', +b.dataset.video === i));
      video.innerHTML = `<source src="${esc(v.datei)}" type="video/mp4"><track kind="subtitles" srclang="de" label="Deutsch" src="${esc(v.untertitel)}" default>`;
      video.load(); text.textContent = v.titel;
      video.addEventListener('loadedmetadata', () => {
        const tr = video.textTracks[0]; if (!tr) return; tr.mode = 'hidden';
        tr.oncuechange = () => {
          const c = tr.activeCues && tr.activeCues[0]; if (!c) return;
          text.textContent = c.text;
          if (!p.stimme || !kannSprechen || video.paused) return;
          if (spricht) { wartet = c.text; autoPause = true; video.pause(); } else sprich(c.text);
        };
      }, { once: true });
      video.play().catch(() => {});
    };
    video.addEventListener('pause', () => { if (!autoPause && kannSprechen) { speechSynthesis.cancel(); wartet = null; } });
    video.addEventListener('seeking', () => { if (kannSprechen) speechSynthesis.cancel(); wartet = null; autoPause = false; });
    video.addEventListener('ended', () => { if (aktuell < VIDS.length - 1) { /* nicht automatisch weiter – Nutzer entscheidet */ } });
    d.addEventListener('click', e => { const b = e.target.closest('[data-video]'); if (b) laden(+b.dataset.video); });
    const st = $('#h-stimme', d); if (st) st.onchange = () => { p.stimme = st.checked; merke(p); if (!p.stimme) speechSynthesis.cancel(); };
    const la = $('#h-laut', d); if (la) la.oninput = () => { p.laut = +la.value; merke(p); };
    d.addEventListener('close', () => { if (kannSprechen) speechSynthesis.cancel(); video.pause(); });
    if (kannSprechen && speechSynthesis.getVoices().length === 0) speechSynthesis.onvoiceschanged = () => {};
    if (typeof start === 'number') laden(start);
  }
  window.TW_HILFE = { oeffnen, ANLEITUNG };
})();
