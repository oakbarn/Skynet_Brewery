// Picture groups (Fritz, 2026-10-22): media/Images has a folder for each kind of picture.
//   media/Images/<group>/          your own pictures. The eleven groups are made on every start and the folders can't be deleted,
//                                  renamed or moved; any other folder you make in Images is a group of your own.
//   media/Images/Skynet/<group>/   the pictures that come with Skynet, read only: nothing in Skynet can be added, changed,
//                                  renamed, moved or deleted from the panel. Only a Skynet update puts pictures there.
// The Skynet pictures used to sit loose in Images/ and Images/samples/: on start they are moved into Skynet/<group> once
// (with the SVG copy traced from each), and an old path still finds the picture (Store.findMedia looks in every group).
import fs from 'node:fs';
import path from 'node:path';
import { tracedFrom } from './vectorize.js';

// Folder names: no "/" or spaces, so a Process can use the path as it is. Shown with spaces in the panel.
export const SKYNET_DIR = 'Skynet';
export const PICTURE_GROUPS = ['Alarms', 'Vessels', 'Pumps', 'Valves', 'Chillers', 'Motors', 'Lights_LEDs', 'Hop_Infusion', 'Other_Equipment', 'Miscellaneous', 'On_Off'];
export const groupLabel = g => g === 'Lights_LEDs' ? 'Lights / LEDs' : String(g).replace(/_/g, ' ');
export const isSkynetGroup = name => PICTURE_GROUPS.some(g => g.toLowerCase() === String(name).toLowerCase());
export const GROUP_MSG = 'is one of the eleven standard picture groups, so the folder can\'t be deleted, renamed or moved (the pictures in it can). Make a folder of your own in Images for a group of your own.';
export const SKYNET_MSG = 'Images/Skynet holds the pictures that come with Skynet. Nothing in it can be added, changed, renamed, moved or deleted here; a Skynet update adds new ones. Put your own pictures in the groups in Images.';
// True for media/Images/Skynet and anything in it (a path inside the panel's own media folder, any letter case).
export const inSkynet = rel => /^images\/skynet(\/|$)/i.test(String(rel ?? '').replace(/\\/g, '/').replace(/^\.?\/+/, '').replace(/\/+$/, ''));

// Where each Skynet picture belongs (the file name, any letter case).
const SORT = {
  Alarms: ['AlarmBitter.png'],
  Vessels: ['Vessel_DigiBoil.svg', 'Vessel_Brewzilla.svg', 'Vessel_Grainfather.svg', 'Vessel_Foundry.svg', 'Vessel_Kettle_Basic.svg', 'Vessel_Kettle_BigFatty.svg', 'Vessel_Kettle_BigFatty_TwoDrains.svg', 'Vessel_Kettle_BottomDrain.svg',
    'Vessel_Kettle_BottomDrain_Side.svg', 'Vessel_Kettle_BottomDrain_Side_SteamSlayer.svg', 'Vessel_Kettle_Tall.svg', 'Skynet_BasicElectricBrewKettle.svg', 'Skynet_Generic_Brew_Vessel_Widget.svg', 'Skynet_Brew_Vessel_Low_TC_Output_Widget.svg',
    'boil_kettle.svg', 'brewzilla.svg', 'digiboil.svg', 'hlt.svg', 'kettle.svg', 'mash_tun.svg', 'vessel_gray.svg'],
  Pumps: ['Pump_Blue_Rip_Off.png', 'Pump_Blue_Rip_On.png', 'Pump_Green_Rip_Off.png', 'Pump_Green_Rip_On.png', 'Pump_Red_Rip_Off.png', 'Pump_Red_Rip_On.png',
    'Pump_White_Rip_Off.png', 'Pump_Whute_Rip_On.png', 'Pump_Yellow_Rip_Off.png', 'Pump_Yellow_Rip_On.png', 'Pump_Sump_Off.svg', 'Pump_Sump_On.svg',
    'Pump_NoCover_Rip_Off.svg', 'Pump_Black_Rip_Off.svg', 'Pump_Purple_Rip_Off.svg'],
  Valves: ['Valve_Ball_ClosedH_1.png', 'Valve_Ball_ClosedV-1x1.png', 'Valve_Ball_OpenH_1.png', 'Valve_Ball_OpenV-1x1.png',
    ...['ClosedH', 'ClosedV_L', 'ClosedV_R', 'OpenH', 'OpenV_L', 'OpenV_R'].flatMap(s => [`Valve_Gas_Solenoid_${s}.svg`, `Valve_Manual_Butterfly_${s}.svg`, `Valve_Manual_${s}.svg`]),
    ...['ClosedH', 'ClosedV_LC', 'ClosedV_RC', 'OpenH', 'OpenV_LC', 'OpenV_RC'].map(s => `Valve_Motor_Ball_${s}.svg`), 'Valve_Check.svg'],
  Chillers: ['Chiller_Counterflow.svg', 'Chiller_Counterflow_Small.svg', 'chill_coil.svg', 'plate_chiller.svg'],
  Motors: [],
  Lights_LEDs: ['led_green.svg', 'led_off.svg', 'led_red.svg', 'bolt_on.svg', 'bolt_off.svg'],
  Hop_Infusion: ['Filter_Hop_Inline.svg'],
  Other_Equipment: ['BigMacRElementOff.png', 'BigMacRElementOn.png', 'Burner No Flame.png', 'BurnerFlame.png', 'Equipment_RIMS.svg', 'herms_coil.svg', 'trub_filter.svg',
    'Fitting_Elbow45.svg', 'Fitting_Elbow90.svg', 'Fitting_Reducer.svg', 'Fitting_Tee.svg', 'Fitting_U.svg', 'Fitting_End_Cap.svg', 'Fitting_Flow_Meter.svg', 'Fitting_Flow_Meter_Temp.svg', 'pipe_cross.svg', 'pipe_elbow45.svg', 'pipe_elbow90.svg', 'pipe_tee.svg',
    'Skynet_TC15_90.svg', 'Skynet_TC15_45.svg', 'Skynet_TC15_EqualTee.svg', 'Skynet_TC15_InstrumentTee.svg', 'Skynet_TC15_EndCap.svg', 'Skynet_TC15_Thermowell_Short.svg', 'Skynet_TC15_Thermowell_Medium.svg', 'Skynet_TC15_Thermowell_Long.svg', 'Skynet_TC1_2_Rims_Device.svg'],
  Miscellaneous: ['brewery_main.png'],
  On_Off: ['Overlay_Bolt_Corner.svg', 'Overlay_Bolt_Center.svg', 'Overlay_Glow_Ring.svg'],
};
export const SKYNET_PICTURES = new Map(Object.entries(SORT).flatMap(([g, names]) => names.map(n => [n.toLowerCase(), g])));
// The group of a Skynet picture (it lives in Images/Skynet/<group>/), or null for any other picture.
export const skynetGroupOf = file => SKYNET_PICTURES.get(path.basename(String(file).replace(/\\/g, '/')).toLowerCase()) ?? null;

const sameFile = (a, b) => { try { return fs.readFileSync(a).equals(fs.readFileSync(b)); } catch { return false; } };
const findCase = (dir, name) => { try { return fs.readdirSync(dir).find(n => n.toLowerCase() === name.toLowerCase()) ?? null; } catch { return null; } };

// Makes the eleven groups in imagesDir and in imagesDir/Skynet, and moves the Skynet pictures out of Images/, Images/samples/
// and Images/<group>/ (where the first try of picture groups put them) into Skynet/<group>.
// A picture already in its group (a newer release put it there) only removes the old copy when the two are the same file,
// so a picture someone changed is never lost. choices: the svgChoices object of the config (keys follow the move).
// Returns { made: [group], moved: ['old -> new'] }.
export function setupPictureGroups(imagesDir, choices) {
  const made = [], moved = [];
  if (!imagesDir) return { made, moved };
  fs.mkdirSync(imagesDir, { recursive: true });
  const skynet = path.join(imagesDir, findCase(imagesDir, SKYNET_DIR) ?? SKYNET_DIR);
  for (const [dir, pre] of [[imagesDir, ''], [skynet, SKYNET_DIR + '/']]) {
    fs.mkdirSync(dir, { recursive: true });
    for (const g of PICTURE_GROUPS) if (!findCase(dir, g)) { fs.mkdirSync(path.join(dir, g)); made.push(pre + g); }
  }
  const rel = f => 'Images/' + path.relative(imagesDir, f).split(path.sep).join('/');
  const move = (from, to) => {
    if (fs.existsSync(to)) { if (!sameFile(from, to)) return false; fs.rmSync(from); }
    else fs.renameSync(from, to);
    if (choices && rel(from) in choices) { choices[rel(to)] ??= choices[rel(from)]; delete choices[rel(from)]; }
    return true;
  };
  for (const sub of ['', 'samples', ...PICTURE_GROUPS]) {
    const dir = sub ? path.join(imagesDir, findCase(imagesDir, sub) ?? sub) : imagesDir;
    let names = []; try { names = fs.readdirSync(dir); } catch { continue; }
    for (const n of names) {
      const g = SKYNET_PICTURES.get(n.toLowerCase()), from = path.join(dir, n);
      if (!g || !fs.statSync(from).isFile()) continue;
      const gdir = path.join(skynet, findCase(skynet, g) ?? g), to = path.join(gdir, n);
      // its SVG copy (Settings > Pictures) goes along, so the picture keeps looking the same
      const svgs = /\.svg$/i.test(n) ? [] : [from.replace(/\.[^.]+$/, '.svg'), from + '.svg'].filter(s => fs.existsSync(s) && tracedFrom(s) === n);
      if (!move(from, to)) continue;
      moved.push(`${rel(from)} -> ${rel(to)}`);
      // a hand-drawn Skynet SVG already waiting in the group replaces the old traced copy
      for (const s of svgs) { const to = path.join(gdir, path.basename(s)); if (fs.existsSync(to) && !tracedFrom(to)) fs.rmSync(s); else move(s, to); }
    }
    if (sub === 'samples') { try { if (!fs.readdirSync(dir).length) fs.rmdirSync(dir); } catch { } }
  }
  return { made, moved };
}

// The groups in imagesDir: the eleven standard ones first, then the user's own folders (Skynet is not a group).
export function listGroups(imagesDir) {
  let dirs = []; try { dirs = fs.readdirSync(imagesDir, { withFileTypes: true }).filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name); } catch { }
  const user = dirs.filter(d => !isSkynetGroup(d) && d.toLowerCase() !== SKYNET_DIR.toLowerCase()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  return [...PICTURE_GROUPS.map(g => ({ name: dirs.find(d => d.toLowerCase() === g.toLowerCase()) ?? g, label: groupLabel(g), standard: true })),
    ...user.map(d => ({ name: d, label: d, standard: false }))];
}
