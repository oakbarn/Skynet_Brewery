// Picture groups (Fritz, 2026-10-22): media/Images has a folder for each kind of picture.
//   media/Images/<group>/          your own pictures. The eleven groups are made on every start and the folders can't be deleted,
//                                  renamed or moved; any other folder you make in Images is a group of your own.
//   media/Images/Skynet/<group>/   the pictures that come with Skynet, read only: nothing in Skynet can be added, changed,
//                                  renamed, moved or deleted from the panel. Only a Skynet update puts pictures there.
// The Skynet pictures used to sit loose in Images/ and Images/samples/: on start they are moved into Skynet/<group> once
// (with the SVG copy traced from each), and an old path still finds the picture (Store.findMedia looks in every group).
import fs from 'node:fs';
import path from 'node:path';

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
    'Vessel_Kettle_BottomDrain_Side.svg', 'Vessel_Kettle_BottomDrain_Side_SteamSlayer.svg', 'Vessel_Kettle_Tall.svg', 'Skynet_BasicElectricBrewKettle.svg', 'Skynet_Generic_Brew_Vessel_Widget.svg', 'Skynet_Vessel_Widget.svg', 'Skynet_Brew_Vessel_Low_TC_Output_Widget.svg', 'Skynet_Brew_Vessel_TC_Temperature_Widget.svg', 'Skynet_Brew_Vessel_TC_Temperature_Tangential_Widget.svg',
    'Skynet_Brew_Vessel_TC_Thermowell_Tangential_Element_Port_Widget.svg', 'Skynet_Brew_Vessel_Big_Mac_Widget.svg', 'Skynet_Brew_Vessel_Low_NPT_Output_Widget.svg', 'Skynet_Brew_Vessel_NPT_Temperature_Widget.svg',
    'boil_kettle.svg', 'brewzilla.svg', 'digiboil.svg', 'hlt.svg', 'kettle.svg', 'mash_tun.svg', 'vessel_gray.svg'],
  // the Riptide-style Pump_<color>_Rip pictures were taken out (OakBarn Brewery, 2026-11-17: a maker's photo, copyright; Rule 9.12)
  Pumps: ['Pump_Sump_Off.svg', 'Pump_Sump_On.svg',
    'Pump_March_809_Poly_90_Inlet.svg', 'Pump_March_809_Poly_Center_Inlet.svg', 'Pump_March_809_SS_Center_Inlet.svg', 'Pump_March_815_Poly_90_Inlet.svg', 'Pump_March_815_Poly_Center_Inlet.svg', 'Pump_March_815_SS_Center_Inlet.svg', 'Pump_Chugger_SS_90_Inlet.svg', 'Pump_Chugger_SS_Center_Inlet.svg', 'Pump_Riptide_SS_Center_Inlet.svg', 'Pump_Topsflo_TD5_Poly_Center_Inlet.svg', 'Pump_KegLand_MKII_Poly_Center_Inlet.svg', 'Pump_KegLand_MKII_SS_Center_Inlet.svg',
    'Pump_March_809_Poly_90_Inlet_Motor.svg', 'Pump_March_809_SS_90_Inlet_Motor.svg', 'Pump_March_815_Poly_90_Inlet_Motor.svg', 'Pump_March_815_SS_90_Inlet_Motor.svg', 'Pump_Chugger_SS_90_Inlet_Motor.svg', 'Pump_Chugger_Poly_90_Inlet_Motor.svg'],
  // Fritz, 2026-11-05: no Open valve pictures (an Overlay shows open); the old BruControl ball valves are renamed Motorized_TC15_...
  Valves: ['Motorized_TC15_Ball_Valve_Horizontal.svg', 'Motorized_TC15_Ball_Valve_Vertical.svg', 'Motorized_TC15_Ball_Valve_Vertical_Left.svg',
    ...['ClosedH', 'ClosedV_L', 'ClosedV_R'].flatMap(s => [`Valve_Gas_Solenoid_${s}.svg`, `Valve_Manual_Butterfly_${s}.svg`]), 'Valve_Manual_ClosedH.svg',
    'Valve_Motor_Ball_ClosedFront.svg', 'Valve_Check.svg',
    // Fritz's drawings (2026-11-02): the motorized butterfly valve and the Manual Ball Valve pictures of the Manual Valve Widget
    ...['H', 'V_L', 'Front', 'Front_Elbow'].map(s => `Valve_Motor_Butterfly_Closed${s}.svg`),      // V_R retired 2026-11-18: Vertical Right flips V_L
    ...['Side', 'Front', 'Front_Elbow'].map(s => `Manual_Ball_Valve_${s}_Closed.svg`),
    'Tap_Water_Valve_Hose_Bib.svg'],      // the Tap Water Valve, a Manual Valve Widget picture (Fritz, 2026-11-06, Rule 5.33)
  Chillers: ['Chiller_Counterflow.svg', 'Chiller_Counterflow_Small.svg', 'Chiller_Copper_Counterflow.svg', 'chill_coil.svg', 'plate_chiller.svg'],
  Motors: [],
  Lights_LEDs: ['led_green.svg', 'led_off.svg', 'led_red.svg', 'bolt_on.svg', 'bolt_off.svg'],
  Hop_Infusion: ['Filter_Hop_Inline.svg'],
  Other_Equipment: ['BigMacRElementOff.svg', 'BigMacRElementOn.svg',
    // Fermentor heaters, Off and On (OakBarn Brewery, 2026-11-10: "Make those Heat Graphics"): a heat mat, a heat wrap and a ceramic heat emitter
    'Heat_Mat_Off.svg', 'Heat_Mat_On.svg', 'Heat_Wrap_Off.svg', 'Heat_Wrap_On.svg', 'Ceramic_Heat_Emitter_Off.svg', 'Ceramic_Heat_Emitter_On.svg',
    'Burner No Flame.svg', 'Burner_Jet_Flame.svg', 'Equipment_RIMS.svg', 'herms_coil.svg', 'trub_filter.svg',
    'Fitting_Elbow45.svg', 'Fitting_Elbow90.svg', 'Fitting_Reducer.svg', 'Fitting_Tee.svg', 'Fitting_U.svg', 'Fitting_End_Cap.svg', 'Fitting_Flow_Meter.svg', 'Fitting_Flow_Meter_Temp.svg',
    'Skynet_TC15_90.svg', 'Skynet_TC15_45.svg', 'Skynet_TC15_EqualTee.svg', 'Skynet_TC15_EndCap.svg', 'Skynet_TC15_Thermowell_Short.svg', 'Skynet_TC15_Thermowell_Medium.svg', 'Skynet_TC15_Thermowell_Long.svg', 'Skynet_TC15_Thermowell_Front.svg', 'Skynet_TC1_2_Rims_Device.svg',
    // Fritz's pipe fitting drawings (2026-11-02), and the tees with a Temperature Probe (Temperature Devices)
    'Skynet_TC15_Elbow_90.svg', 'Skynet_TC15_Elbow_45.svg', 'Skynet_TC15_Cross.svg', 'Skynet_TC15_Long_Tee.svg', 'Skynet_TC15_Instrument_Tee.svg', 'Skynet_TC15_Elbow_Front.svg',
    'Skynet_TC2_1_Reducer_Concentric.svg', 'Skynet_TC2_1_Reducer_Eccentric.svg', 'Skynet_TC2_1_Reducer_Front.svg',
    ...['Instrument_Tee', 'Long_Tee'].flatMap(t => [`Skynet_TC15_${t}_Probe_Branch.svg`, `Skynet_TC15_${t}_Probe_Run.svg`]),
    // the Valve Tee and the Supply Manifolds (Fritz, 2026-11-06, Rule 5.35): Long Tees joined end to end; the panel draws the valves
    'Skynet_TC15_Valve_Tee.svg', 'Skynet_TC15_Supply_Manifold_2.svg', 'Skynet_TC15_Supply_Manifold_3.svg'],
  // Skynet's own small pictures (OakBarn Brewery, 2026-11-14: "we have to come up with our own 11", picked "Set B"): the BruControl Import
  // offers these only as a backup for BruControl's stock pictures: it steers the brewer to a Skynet Device or Widget first ("Keep as Backups")
  Miscellaneous: ['Skynet_Brewery_Main.svg', ...['Valve', 'Pump', 'Kettle', 'On_Off', 'Liquid_Temp', 'Clock', 'Fan', 'Gauge', 'Liquid_Level', 'PID', 'PWM'].map(n => `Skynet_Icon_${n}.svg`),
    // the Skynet Audio folder drawings (Panel Update 9, Rule 7.27)
    ...['Songs', 'Text_to_voice', 'Fanfare', 'Beep', 'Nature', 'Go_to_work'].map(f => `Skynet_Audio_${f}.svg`)],
  On_Off: ['Overlay_Bolt_Corner.svg', 'Overlay_Bolt_Center.svg', 'Overlay_Glow_Ring.svg', 'Overlay_Manual_Valve_Open.svg', 'Overlay_Bolt_Flash.svg', 'Overlay_Bolt.svg'],
};
export const SKYNET_PICTURES = new Map(Object.entries(SORT).flatMap(([g, names]) => names.map(n => [n.toLowerCase(), g])));
// The group of a Skynet picture (it lives in Images/Skynet/<group>/), or null for any other picture.
export const skynetGroupOf = file => SKYNET_PICTURES.get(path.basename(String(file).replace(/\\/g, '/')).toLowerCase()) ?? null;

const findCase = (dir, name) => { try { return fs.readdirSync(dir).find(n => n.toLowerCase() === name.toLowerCase()) ?? null; } catch { return null; } };

// Makes the eleven groups in imagesDir and in imagesDir/Skynet. Returns { made: [group] }.
export function setupPictureGroups(imagesDir) {
  const made = [];
  if (!imagesDir) return { made };
  fs.mkdirSync(imagesDir, { recursive: true });
  const skynet = path.join(imagesDir, findCase(imagesDir, SKYNET_DIR) ?? SKYNET_DIR);
  for (const [dir, pre] of [[imagesDir, ''], [skynet, SKYNET_DIR + '/']]) {
    fs.mkdirSync(dir, { recursive: true });
    for (const g of PICTURE_GROUPS) if (!findCase(dir, g)) { fs.mkdirSync(path.join(dir, g)); made.push(pre + g); }
  }
  return { made };
}

// The groups in imagesDir: the eleven standard ones first, then the user's own folders (Skynet is not a group).
export function listGroups(imagesDir) {
  let dirs = []; try { dirs = fs.readdirSync(imagesDir, { withFileTypes: true }).filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name); } catch { }
  const user = dirs.filter(d => !isSkynetGroup(d) && d.toLowerCase() !== SKYNET_DIR.toLowerCase()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  return [...PICTURE_GROUPS.map(g => ({ name: dirs.find(d => d.toLowerCase() === g.toLowerCase()) ?? g, label: groupLabel(g), standard: true })),
    ...user.map(d => ({ name: d, label: d, standard: false }))];
}

// The Skynet Audio folders (OakBarn Brewery, 2026-11-21, Panel Update 9, item 1; Rule 7.27): sounds/Skynet gets Songs, Text_to_voice,
// Fanfare, Beep, Nature and Go_to_work, and sounds/Skynet/Patron the same six. Every Skynet sound lives in Songs for now ("Put all
// Skynet audio files in the Songs subfolder. I will sort at a later date"): one left loose in sounds/Skynet by an older version is
// moved there (or dropped when Songs has it already). Only Skynet's own folder is touched, never the user's sounds.
export function setupAudioFolders(soundsDir, folders) {
  if (!soundsDir) return 0;
  const sky = path.join(soundsDir, SKYNET_DIR);
  let n = 0;
  try {
    for (const f of folders) { fs.mkdirSync(path.join(sky, f), { recursive: true }); fs.mkdirSync(path.join(sky, 'Patron', f), { recursive: true }); }
    const songs = path.join(sky, folders[0]);
    for (const e of fs.readdirSync(sky, { withFileTypes: true })) {
      if (!e.isFile() || !/\.(wav|mp3|ogg|m4a)$/i.test(e.name)) continue;
      const from = path.join(sky, e.name), to = path.join(songs, e.name);
      if (fs.existsSync(to)) fs.rmSync(from); else fs.renameSync(from, to);
      n++;
    }
  } catch { /* a read only media folder: the panel still runs */ }
  return n;
}
