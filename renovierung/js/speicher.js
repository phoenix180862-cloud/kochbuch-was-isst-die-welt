/* TW Renovierungs-App – Speicher: alles bleibt im Gerät.
   Daten (Vorhaben, Mein Haus, Einstellungen) in localStorage, Fotos als Blob in IndexedDB. */
(function (root) {
  'use strict';
  const SCHLUESSEL = 'twreno.daten.v1';
  const KI_SCHLUESSEL = 'twreno.ki.v1';
  const LEER = () => ({ version: 1, vorhaben: [], haus: { baujahr: '', notizen: {}, wartung: {}, eigene: [] }, werkzeugkiste: {}, einst: { von: 8, bis: 18, sonntag: true, thema: 'dunkel' } });

  let daten = LEER();
  function laden() {
    try { const s = localStorage.getItem(SCHLUESSEL); if (s) daten = Object.assign(LEER(), JSON.parse(s)); } catch (e) { daten = LEER(); }
    daten.haus = Object.assign(LEER().haus, daten.haus || {});
    daten.einst = Object.assign(LEER().einst, daten.einst || {});
    return daten;
  }
  let timer = null;
  function speichern(sofort) {
    const tu = () => { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(daten)); } catch (e) { root.dispatchEvent(new CustomEvent('tw-speicher-voll')); } };
    clearTimeout(timer); if (sofort) tu(); else timer = setTimeout(tu, 150);
  }
  const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------- KI-Schlüssel (getrennt, nie im Export) ---------- */
  function kiLesen() { try { return JSON.parse(localStorage.getItem(KI_SCHLUESSEL) || 'null'); } catch (e) { return null; } }
  function kiSchreiben(v) { try { if (v) localStorage.setItem(KI_SCHLUESSEL, JSON.stringify(v)); else localStorage.removeItem(KI_SCHLUESSEL); } catch (e) { /* egal */ } }

  /* ---------- Fotos in IndexedDB ---------- */
  let dbP = null;
  function db() {
    if (dbP) return dbP;
    dbP = new Promise((ok, nein) => {
      if (!('indexedDB' in root)) { nein(new Error('Kein IndexedDB')); return; }
      const r = indexedDB.open('twreno-fotos', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('fotos');
      r.onsuccess = () => ok(r.result); r.onerror = () => nein(r.error);
    });
    return dbP;
  }
  async function fotoSpeichern(blob, fid) {
    fid = fid || 'f' + id();
    const d = await db();
    await new Promise((ok, nein) => { const tx = d.transaction('fotos', 'readwrite'); tx.objectStore('fotos').put(blob, fid); tx.oncomplete = ok; tx.onerror = () => nein(tx.error); });
    return fid;
  }
  async function fotoLesen(fid) {
    const d = await db();
    return new Promise((ok, nein) => { const r = d.transaction('fotos').objectStore('fotos').get(fid); r.onsuccess = () => ok(r.result || null); r.onerror = () => nein(r.error); });
  }
  async function fotoLoeschen(fid) {
    const d = await db();
    return new Promise(ok => { const tx = d.transaction('fotos', 'readwrite'); tx.objectStore('fotos').delete(fid); tx.oncomplete = ok; tx.onerror = ok; });
  }
  const urlCache = new Map();
  async function fotoUrl(fid) {
    if (urlCache.has(fid)) return urlCache.get(fid);
    const b = await fotoLesen(fid).catch(() => null); if (!b) return '';
    const u = URL.createObjectURL(b); urlCache.set(fid, u); return u;
  }
  /* Bild verkleinern (max. Kante) → JPEG-Blob */
  function verkleinern(datei, max = 1600, q = 0.85) {
    return new Promise((ok, nein) => {
      const img = new Image(); const u = URL.createObjectURL(datei);
      img.onload = () => {
        const f = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * f); c.height = Math.round(img.naturalHeight * f);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
        c.toBlob(b => b ? ok(b) : nein(new Error('Bild konnte nicht umgewandelt werden')), 'image/jpeg', q);
      };
      img.onerror = () => { URL.revokeObjectURL(u); nein(new Error('Bild konnte nicht gelesen werden')); };
      img.src = u;
    });
  }
  const blobZuDataUrl = b => new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(b); });
  const dataUrlZuBlob = async u => (await fetch(u)).blob();

  /* ---------- Sicherung als Datei ---------- */
  function alleFotoIds() {
    const ids = new Set();
    daten.vorhaben.forEach(v => { const f = v.fotos || {}; [f.start, ...(f.vorher || []), ...(f.nachher || [])].filter(Boolean).forEach(x => ids.add(x)); });
    (daten.haus.fotos || []).forEach(x => ids.add(x));
    return [...ids];
  }
  async function exportieren() {
    const fotos = {};
    for (const fid of alleFotoIds()) { const b = await fotoLesen(fid).catch(() => null); if (b) fotos[fid] = await blobZuDataUrl(b); }
    return new Blob([JSON.stringify({ app: 'TW Renovierungs-App', stand: new Date().toISOString(), daten, fotos })], { type: 'application/json' });
  }
  async function importieren(datei) {
    const j = JSON.parse(await datei.text());
    if (!j || j.app !== 'TW Renovierungs-App' || !j.daten) throw new Error('Diese Datei ist keine Sicherung der TW Renovierungs-App.');
    for (const [fid, u] of Object.entries(j.fotos || {})) await fotoSpeichern(await dataUrlZuBlob(u), fid);
    daten = Object.assign(LEER(), j.daten); speichern(true); return daten;
  }

  root.TW_SPEICHER = { laden, speichern, get daten() { return daten; }, id, kiLesen, kiSchreiben, fotoSpeichern, fotoLesen, fotoLoeschen, fotoUrl, verkleinern, blobZuDataUrl, exportieren, importieren };
})(window);
