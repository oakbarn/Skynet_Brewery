// Two-part paths (OakBarn Brewery, 2026-11-13, ReadMe markup "Skynet Brew Panel 1 a" page 17, Rule 7.23):
// "All Paths will have two fields .path and .file. The path has two defaults (SkyNet and User). Skynet cannot be changed and is where
// Skynet Pictures reside, User is where the User puts his. There needs be audio and graphics separation as well so 2 Skynet default
// (1 Audio, 1 Graphic and same for User). When selecting a file the Path and file are combined so Generally the DDLBs will only contain
// the File Name. The path on a property dialog can be edited on a User Audio or Graphic but normally the default would be used.
// A Process command like UserAlarmBackground = "File Name.svg" would construct the real path using the Default path.
// A different command UserAlarmBackground.path = "Full Path" would require a Full Path."
// Used by the panel (public/app.js) and the Brain (lib/store.js), so both read a path the same way.

// The four default folders (inside the panel's media folder). The two Skynet ones can never be changed; the two User ones start here
// and can be changed in Settings > Media folders (config.mediaDefaults).
export const MEDIA_DEFAULTS = Object.freeze({ skynetGraphic: 'Images/Skynet', skynetAudio: 'sounds/Skynet', userGraphic: 'Images', userAudio: 'sounds' });
export const DEFAULT_WORDS = { skynetGraphic: 'Skynet Graphic', skynetAudio: 'Skynet Audio', userGraphic: 'User Graphic', userAudio: 'User Audio' };
export const PICTURE_FILE = /\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i;
export const SOUND_FILE = /\.(wav|mp3|ogg|m4a)$/i;
export const isLink = p => /^https?:\/\//i.test(String(p ?? '').trim());

// The User folders a Schema uses: its own (Settings) or the starting ones. A folder is kept with / and no / at either end.
export const cleanFolder = f => String(f ?? '').trim().replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\.\//, '').replace(/\/+$/, '');
export function mediaDefaults(cfg) {
  const own = cfg?.mediaDefaults ?? {};
  return { ...MEDIA_DEFAULTS, userGraphic: cleanFolder(own.userGraphic) || MEDIA_DEFAULTS.userGraphic, userAudio: cleanFolder(own.userAudio) || MEDIA_DEFAULTS.userAudio };
}
// A User folder may be any folder inside the media folders, but never the Skynet ones (they are read only, Rule 7.2)
export function userFolderError(f) {
  const c = cleanFolder(f);
  if (!c) return '';
  if (/(^|\/)\.\.(\/|$)/.test(c)) return 'A folder can\'t go up with ..';
  if (/^(images|sounds)\/skynet(\/|$)/i.test(c)) return 'That is a Skynet folder: Skynet pictures and sounds live there and it can\'t be used for your own';
  return '';
}

// "Images/Skynet/Pumps/Pump_Red_Rip_Off.svg" -> { path: "Images/Skynet/Pumps", file: "Pump_Red_Rip_Off.svg" }
// (the two fields of every path; a web link has no folder of its own: it is all .path, and its .file is the last part)
export function splitPath(p) {
  const s = String(p ?? '').trim();
  if (!s) return { path: '', file: '' };
  if (isLink(s)) return { path: '', file: decodeURIComponent(s.split(/[?#]/)[0].split('/').pop() || '') };
  const n = s.replace(/\\/g, '/'), i = n.lastIndexOf('/');
  return i < 0 ? { path: '', file: n } : { path: n.slice(0, i), file: n.slice(i + 1) };
}
export const fileOf = p => splitPath(p).file;
export const folderOf = p => splitPath(p).path;
export const joinPath = (folder, file) => { const f = cleanFolder(folder), n = String(file ?? '').trim(); return !n ? '' : f ? `${f}/${n}` : n; };
// A Skynet picture or sound (its folder can't be changed)
export const isSkynetMedia = p => /^(\.?\/)?(media\/)?(images|sounds)\/skynet\//i.test(String(p ?? '').replace(/\\/g, '/'));
// Only a file name ("Bell.svg"): no folder in it, and it ends in a picture or sound file ending
export const isBareFile = (v, sound) => { const s = String(v ?? '').trim(); return !!s && !/[\\/]/.test(s) && !isLink(s) && (sound ? SOUND_FILE : PICTURE_FILE).test(s); };
// A Skynet Picture ID number: 17 or "17" or "#17"
export const isPicNumber = v => typeof v === 'number' ? Number.isInteger(v) && v > 0 : /^#?\d{1,6}$/.test(String(v ?? '').trim());

// The Process attributes that hold a picture or a sound (the ones with .path and .file), by the store's runtime name.
// A Graphic gGlobal's value and a Sound Player's .path are paths too (lib/store.js).
export const PICTURE_PROPS = ['image', 'backpath', 'backpath_2', 'backpath_3', 'imageon', 'imageoff', 'imageoverlay', 'setgraphic'];
export const SOUND_PROPS = ['sound', 'path'];
export const PATH_PARTS = ['path', 'file'];

// What a picture list shows (Rule 7.22, 7.23): only the file name, and a Skynet picture's ID number in front: "17 · led_green.svg"
export const pickLabel = (p, id) => { const f = fileOf(p) || String(p ?? ''); return id ? `${id} · ${f}` : f; };
