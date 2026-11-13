// Skynet Picture ID numbers (OakBarn Brewery, 2026-11-13, ReadMe markup "Skynet Brew Panel 1 a" page 16, Rule 7.22):
// "for all Skynet Pictures, a Leading ID Number will be created and remains Unique and not changeable ever. That Number besides
// the Name will be in all DDLBs for these types of Graphics. A Printable list will also be available."
// The numbers are kept in lib/skynetpicids.json, one row for each picture in media/Images/Skynet: { id, file } (file is the path
// inside Images/Skynet). Design Rule #2 (a Meaningless Key): a number never changes and is never given to another picture, even when
// a picture is renamed (its row keeps its number and gets the new name) or retired (its row stays, marked retired).
// A new Skynet picture gets the next number with: node tools/skynet-picture-ids.js (it also writes docs/Skynet_Picture_IDs.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const IDS_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'skynetpicids.json');
export const SKYNET_IMAGES = 'Images/Skynet/';

let rows = null, byId = null, byFile = null, byName = null;
function load() {
  if (rows) return;
  try { rows = JSON.parse(fs.readFileSync(IDS_FILE, 'utf8')).pictures ?? []; } catch { rows = []; }
  byId = new Map(); byFile = new Map(); byName = new Map();
  for (const r of rows) {
    byId.set(r.id, r);
    if (r.retired) continue;
    byFile.set(r.file.toLowerCase(), r);
    byName.set(r.file.split('/').pop().toLowerCase(), r);
  }
}
// every row, in number order (the printable list)
export function skynetPicRows() { load(); return rows.slice().sort((a, b) => a.id - b.id); }
// "Images/Skynet/Pumps/Pump_Red_Rip_Off.svg" (any letter case, \ or /) -> its number, or null
export function skynetPicId(p) {
  load();
  const s = String(p ?? '').replace(/\\/g, '/').replace(/^\.?\/+/, '').replace(/^media\//i, '');
  if (!/^images\/skynet\//i.test(s)) return null;
  return byFile.get(s.slice(SKYNET_IMAGES.length).toLowerCase())?.id ?? null;
}
// 17 (or "17") -> "Images/Skynet/..." of that picture, or null (no such number, or a retired picture)
export function skynetPicPath(id) {
  load();
  const n = Number(String(id ?? '').trim().replace(/^#/, ''));
  const r = Number.isInteger(n) ? byId.get(n) : null;
  return r && !r.retired ? SKYNET_IMAGES + r.file : null;
}
// a Skynet picture by its file name alone ("Pump_Red_Rip_Off.svg"): its path, or null. Skynet file names are never used twice.
export function skynetPicByName(name) { load(); const r = byName.get(String(name ?? '').trim().toLowerCase()); return r ? SKYNET_IMAGES + r.file : null; }
// { "Images/Skynet/...": id } for the panel's picture lists
export function skynetPicIdMap() { load(); return Object.fromEntries(rows.filter(r => !r.retired).map(r => [SKYNET_IMAGES + r.file, r.id])); }
export function forgetSkynetPicIds() { rows = null; }

// Adds a row for each Skynet picture that has no number yet, in folder then name order, and marks rows whose picture is gone as
// retired (their number is kept forever). Returns { added, retired }. Used by tools/skynet-picture-ids.js (and its test).
export function updateSkynetPicIds(imagesSkynetDir, file = IDS_FILE, isPicture = f => /\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i.test(f)) {
  let data = { pictures: [] }; try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { }
  const list = data.pictures ?? (data.pictures = []);
  const found = [];
  const walk = (dir, rel) => {
    let ents = []; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (e.name.startsWith('.')) continue;
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(path.join(dir, e.name), r); else if (e.isFile() && isPicture(e.name)) found.push(r);
    }
  };
  walk(imagesSkynetDir, '');
  const sort = (a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
  const have = new Set(found.map(f => f.toLowerCase()));
  const known = new Set(list.filter(r => !r.retired).map(r => r.file.toLowerCase()));
  const retired = [];
  for (const r of list) if (!r.retired && !have.has(r.file.toLowerCase())) { r.retired = true; retired.push(r); }
  let next = list.reduce((m, r) => Math.max(m, r.id), 0) + 1;
  const added = [];
  for (const f of found.sort(sort)) if (!known.has(f.toLowerCase())) { const r = { id: next++, file: f }; list.push(r); added.push(r); }
  fs.writeFileSync(file, JSON.stringify(data, null, 1).replace(/\{\n\s+"id": (\d+),\n\s+"file": ("[^"]*")(,\n\s+"retired": true)?\n\s+\}/g, (m, id, f, ret) => `{ "id": ${id}, "file": ${f}${ret ? ', "retired": true' : ''} }`) + '\n');
  if (file === IDS_FILE) forgetSkynetPicIds();
  return { added, retired };
}
