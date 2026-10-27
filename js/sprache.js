/* TW Weltkochbuch – Vorlesen & Sprachsteuerung für den Kochmodus
   Sprecher: liest Satz für Satz vor (umgeht den Chrome-Fehler, der lange Texte nach ~15 s abschneidet),
             Pause setzt am Satzanfang wieder ein.
   Hörer:    hört dauerhaft auf kurze Kommandos (Web Speech API, Chrome/Edge/Android) und startet sich selbst neu.
   Kopfhörer: Pause/Weiter/Vor/Zurück über die Media-Tasten (MediaSession). */
(function () {
  window.KB = window.KB || {};

  /* ---------- Kommandos erkennen ---------- */
  const KOMMANDOS = [
    // Reihenfolge = Vorrang (längere, eindeutige Formen zuerst)
    ['naechster', /\b(n[aä]chste[rn]? schritt|n[aä]chster|n[aä]chste|vorw[aä]rts|springe? weiter)\b/],
    ['zurueck', /\b(zur[uü]ck|vorherige[rn]? schritt|letzte[rn]? schritt|schritt zur[uü]ck)\b/],
    ['nochmal', /\b(noch ?mal|noch einmal|wiederhol\w*|wiederhole|repeat|bitte nochmal)\b/],
    ['stopp', /\b(stopp?|halt|pause|warte|moment|ruhe|anhalten|sei still|stop)\b/],
    ['weiter', /\b(weiter|mach weiter|weiterlesen|fortfahren|weitermachen|los|okay weiter|ok weiter)\b/],
    ['zutaten', /\b(zutaten|was brauche ich|einkauf)\b/],
    ['timer', /\b(timer|wecker|uhr starten|zeit starten)\b/],
    ['lauter', /\blauter\b/],
    ['leiser', /\bleiser\b/],
    ['beenden', /\b(kochmodus beenden|beenden|ende)\b/]
  ];
  KB.erkenneKommando = function (text) {
    const t = String(text || '').toLowerCase().replace(/[.,!?;:„“"']/g, ' ').replace(/\s+/g, ' ').trim();
    if (!t) return null;
    const woerter = t.split(' ').length;
    if (woerter > 5) return null; // lange Sätze = Echo aus dem Lautsprecher oder Gespräch, keine Kommandos
    for (const [name, re] of KOMMANDOS) if (re.test(t)) return name;
    return null;
  };

  /* ---------- Sprecher ---------- */
  const teileSaetze = text => String(text || '').replace(/\s+/g, ' ').trim()
    .split(/(?<=[.!?…])\s+(?=[A-ZÄÖÜ0-9„"(])/).reduce((acc, s) => {
      if (acc.length && (acc[acc.length - 1].length < 40)) acc[acc.length - 1] += ' ' + s; else acc.push(s);
      return acc;
    }, []).filter(Boolean);

  function deutscheStimme() {
    if (!('speechSynthesis' in window)) return null;
    const st = speechSynthesis.getVoices().filter(v => /^de/i.test(v.lang));
    return st.find(v => /Natural|Online/i.test(v.name)) || st.find(v => /Google/i.test(v.name)) || st[0] || null;
  }
  if ('speechSynthesis' in window) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }

  const sprecher = {
    saetze: [], i: 0, zustand: 'aus', token: 0, onFertig: null, onZustand: null,
    lautstaerke: () => 0.8,
    verfuegbar: () => 'speechSynthesis' in window,
    setzZustand(z) { this.zustand = z; if (this.onZustand) this.onZustand(z); },
    sprich(text, onFertig) {
      if (!this.verfuegbar()) return;
      this.token++; speechSynthesis.cancel();
      this.saetze = teileSaetze(text); this.i = 0; this.onFertig = onFertig || null;
      this._naechster();
    },
    _naechster() {
      const tok = ++this.token;
      if (this.i >= this.saetze.length) { this.setzZustand('fertig'); const f = this.onFertig; if (f) f(); return; }
      this.setzZustand('spricht');
      const u = new SpeechSynthesisUtterance(this.saetze[this.i]);
      u.lang = 'de-DE'; u.rate = 0.95; u.volume = this.lautstaerke();
      const v = deutscheStimme(); if (v) u.voice = v;
      u.onend = () => { if (tok !== this.token) return; this.i++; this._naechster(); };
      u.onerror = e => { if (tok !== this.token) return; if (e.error === 'interrupted' || e.error === 'canceled') return; this.i++; this._naechster(); };
      try { speechSynthesis.resume(); } catch (e) {}
      speechSynthesis.speak(u);
    },
    pause() { if (this.zustand !== 'spricht') return false; this.token++; speechSynthesis.cancel(); this.setzZustand('pause'); return true; },
    fortsetzen() { if (this.zustand !== 'pause') return false; this._naechster(); return true; },
    nochmal() { if (!this.saetze.length) return; this.token++; speechSynthesis.cancel(); this.i = 0; this._naechster(); },
    stopp() { this.token++; if (this.verfuegbar()) speechSynthesis.cancel(); this.setzZustand('aus'); },
    kurz(text) { // kurze Rückmeldung, ohne den Schritt-Text zu verlieren
      if (!this.verfuegbar()) return;
      const u = new SpeechSynthesisUtterance(text); u.lang = 'de-DE'; u.volume = this.lautstaerke();
      const v = deutscheStimme(); if (v) u.voice = v; speechSynthesis.speak(u);
    }
  };
  KB.sprecher = sprecher;

  /* ---------- Hörer (Spracherkennung) ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hoerer = {
    an: false, rec: null, erledigt: new Set(), sitzung: 0, onKommando: null, onStatus: null, onText: null,
    verfuegbar: () => !!SR,
    start(onKommando) {
      if (!SR) return false;
      this.onKommando = onKommando; this.an = true; this._starte(); return true;
    },
    _starte() {
      if (!this.an) return;
      const rec = new SR();
      this.rec = rec; this.sitzung++; this.erledigt = new Set();
      const sitzung = this.sitzung;
      rec.lang = 'de-DE'; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 3;
      rec.onstart = () => { if (this.onStatus) this.onStatus('hoert'); };
      rec.onresult = e => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (this.erledigt.has(i)) continue;
          const res = e.results[i];
          const texte = Array.from(res).map(a => a.transcript);
          if (this.onText) this.onText(texte[0], res.isFinal);
          let kmd = null;
          for (const t of texte) { kmd = KB.erkenneKommando(t); if (kmd) break; }
          // „Stopp“ sofort (schon beim Zwischenergebnis), alles andere erst, wenn das Wort fertig erkannt ist
          if (kmd && (res.isFinal || kmd === 'stopp')) { this.erledigt.add(i); if (this.onKommando) this.onKommando(kmd, texte[0]); }
          else if (res.isFinal) this.erledigt.add(i);
        }
      };
      rec.onerror = e => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') {
          this.an = false; if (this.onStatus) this.onStatus('verweigert', e.error);
        }
      };
      rec.onend = () => {
        if (sitzung !== this.sitzung) return;
        if (this.an) setTimeout(() => { if (this.an && sitzung === this.sitzung) this._starte(); }, 300);
        else if (this.onStatus) this.onStatus('aus');
      };
      try { rec.start(); } catch (e) { setTimeout(() => this._starte(), 800); }
    },
    stop() { this.an = false; this.sitzung++; try { this.rec && this.rec.abort(); } catch (e) {} this.rec = null; if (this.onStatus) this.onStatus('aus'); }
  };
  KB.hoerer = hoerer;

  /* ---------- Kopfhörer-Tasten (MediaSession) ----------
     Damit Ohrhörer-Tasten bei der App ankommen, muss eine Audiospur aktiv sein: eine fast lautlose Endlosschleife. */
  let stilleAudio = null;
  function stilleWav() {
    const sr = 8000, n = sr * 2, buf = new ArrayBuffer(44 + n * 2), d = new DataView(buf);
    const s = (o, t) => { for (let i = 0; i < t.length; i++) d.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); d.setUint32(4, 36 + n * 2, true); s(8, 'WAVEfmt '); d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, 1, true);
    d.setUint32(24, sr, true); d.setUint32(28, sr * 2, true); d.setUint16(32, 2, true); d.setUint16(34, 16, true); s(36, 'data'); d.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) d.setInt16(44 + i * 2, Math.round(Math.sin(i / 3) * 2), true); // praktisch unhörbar
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }
  KB.medientasten = {
    an(titel, handler) {
      if (!('mediaSession' in navigator)) return;
      try {
        if (!stilleAudio) { stilleAudio = new Audio(stilleWav()); stilleAudio.loop = true; stilleAudio.volume = 0.02; }
        stilleAudio.play().catch(() => {});
        navigator.mediaSession.metadata = new MediaMetadata({ title: titel, artist: 'Weltkochbuch – Kochmodus' });
        navigator.mediaSession.playbackState = 'playing';
        const set = (a, f) => { try { navigator.mediaSession.setActionHandler(a, f); } catch (e) {} };
        set('play', () => handler('weiter')); set('pause', () => handler('stopp'));
        set('nexttrack', () => handler('naechster')); set('previoustrack', () => handler('nochmal'));
        set('stop', () => handler('stopp'));
      } catch (e) {}
    },
    status(spielt) { try { if ('mediaSession' in navigator) navigator.mediaSession.playbackState = spielt ? 'playing' : 'paused'; } catch (e) {} },
    aus() {
      if (stilleAudio) { stilleAudio.pause(); }
      if ('mediaSession' in navigator) ['play', 'pause', 'nexttrack', 'previoustrack', 'stop'].forEach(a => { try { navigator.mediaSession.setActionHandler(a, null); } catch (e) {} });
    }
  };
})();
