// The Pump dialog is the model (OakBarn Brewery, 2026-11-10, Rule 18.34): Label Hover Help, Title Case, Label Attributes
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const tc = app.slice(app.indexOf('const TITLE_SMALL'), app.indexOf('const TITLED'));
const titleCase = new Function(tc + '; return titleCase;')();
assert.equal(titleCase('Fore color'), 'Fore Color');
assert.equal(titleCase('Label attributes'), 'Label Attributes');
assert.equal(titleCase('Database and .API'), 'Database and .API');
assert.equal(titleCase('Width (pixels)'), 'Width (pixels)');
assert.equal(titleCase('pH meter'), 'pH Meter');
assert.equal(titleCase('Clone: put a copy of this thing next to it'), 'Clone: put a copy of this thing next to it', 'a sentence is left alone');
assert.doesNotMatch(app, /Default \(Centered\)/, 'no Default (Centered) choice');
assert.match(app, /const ALIGN_LCR = \[\['MiddleLeft', 'Left'\], \['', 'Centered', 'MiddleCenter'\], \['MiddleRight', 'Right'\]\]/);
assert.match(app, /title: 'Label Attributes'/);
assert.match(app, /nm\.style\.textAlign = \(nal \|\| 'Center'\)/, 'a Label is really Centered when nothing is set');
assert.match(app, /How do you refer to this Pump\? Brewing Pump, Mash Pump, HLT Pump \.\.\.\? Use your name for the Pump as the Label\. OakBarn Brewery Sample Schema has several Pumps and they are Color Coded with a Cover\./, 'the Red Pump text word for word');
assert.match(app, /⟪img:help_pictures\/Label_Visible_Switch\.png⟫/, 'with its pictures');
assert.match(app, /⟪img:help_pictures\/Red_Pump_Label\.png⟫/);
for (const f of ['Label_Visible_Switch.png', 'Red_Pump_Label.png']) assert.ok(fs.existsSync(new URL('../media/help_pictures/' + f, import.meta.url)), f);
assert.match(app, /\['label', n\(\) \+ 'Label', 'text', null, false, false, \{ tip: T\.label, \.\.\.\(dd \? \{ up: 2, attr: LABEL_POP \}/, 'the ⬆ in the Add box');
assert.match(app, /\['hideName', 'Label Visible', 'show', null, false, false, \{ tip: isPumpDev\(e\) \? LABEL_VISIBLE_PUMP_TIP/, 'Label Visible stays in the Add box');
assert.match(app, /Suggested Name Format: INTERFACEid_Port_Type_Label_TABid/);
assert.match(app, /with: \['channel', 'Available Ports', 'pinsel', 'digital', false, false, \{ tip: (T\.port|portTip\(it\)) \}\]/, 'Available Ports has its own balloon');
assert.match(app, /const portTip = e => isPumpDev\(e\) \? DEVICE_TIPS\.port \+ '\\n\\nBM_⟦15⟧_DO@Pump_Red~Pump_BH/, 'the Port balloon: the Suggested Name example (2026-11-12)');
assert.match(fs.readFileSync(new URL('../help/115-pump-device-properties.md', import.meta.url), 'utf8'), /## The Label/);
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^18\.34 \*\*The Pump dialog is the model/m);
// the second part of the Add box (2026-11-11)
assert.match(app, /\['User', 'User Add'\]\]/, 'User Add');
assert.match(app, /async function pickCoverColor\(obj\)/, 'its Color Picker');
assert.match(app, /cancelText: '◀ Back'/, 'Back sets None');
// the Color Picker (Rule 2.48): Pickr in every color box, the Cover Color field just below the Cover
assert.match(app, /import \{ openColorPicker, hexToRgb, rgbText, rgbNums, parseRgb \} from '\.\/colorpick\.js'/, 'the Color Picker');
assert.match(app, /\['coverColor', 'Color \(RGB\)', 'rgb'/, 'the Color (RGB) field waits below the Cover');
assert.match(app, /txt\.addEventListener\('dblclick'/, 'double-click brings up the Color Picker again');
// the Pump dialog to OakBarn Brewery's drawing (2026-11-11): KISS names, Use greyed, X Y Width Height on one line, PWM pumps only,
// known values greyed out, the electrical warning in the Power Hover Help
assert.doesNotMatch(app, /`From the drawing \(/, 'no From the drawing (...)');
assert.match(app, /const pumpUseText = it => useOf\(it\) === 'cold' \? 'Cold \(glycol, ice water\)' : 'Hot & Cool'/);
assert.match(app, /const PUMP_XYWH = /);
assert.match(app, /showIf: pumpPwmShown/);
assert.match(app, /pumpPower: '⚠ Electricity can kill\./);
assert.doesNotMatch(app, /\['_pwarn'/, 'no warning line in the dialog');
assert.match(app, /live\.value = 'None'; live\.dispatchEvent/);
assert.match(app, /The Skynet Picture is set by Skynet and cannot be changed\./);
assert.match(app, /for \(const i of \[dv, ps\]\) if \(i && !i\.disabled\) \{ i\.disabled = true; i\.removeAttribute\('title'\); \}/, 'the Interface line greyed out once Confirmed (the ⛔ says it, Rule 18.44)');
// the Review step and the Interface / Port Hover Help (OakBarn Brewery, 2026-11-12, Rule 18.35)
assert.match(app, /const REVIEW_IFACE_PORT = 'You MUST Confirm the Interface and Port Number\. Once Confirmed, they cannot be changed\.\\nIf a Change is needed now, Click the Back Button\.'/);
assert.match(app, /function reviewWire\(iface, port, portName = 'Available Ports'\)/);
assert.match(app, /'◀ Back'/); assert.match(app, /'✔ Confirm'/);
assert.match(app, /const conf = !dd \|\| \(!!wireKey\(w\) && confirmed === wireKey\(w\)\)/, 'not greyed out before Confirm');
// OakBarn Brewery, 2026-11-24 ("Confirm Why????"): the line had landed in the Supply Manifold's box, where CONFIRM_WHY is not defined
assert.doesNotMatch(app, /if \(missing === CONFIRM_WHY\)/, 'no Review step in the Supply Manifold box');
assert.match(app, /'⚠ Electricity can kill\. OakBarn Brewery and Skynet are not electricians and can give no electrical advice\. Consult a Licensed Electrician\.\\nBrain -> Arduino IO \(Port\)/, 'the red warning in the Interface balloon');
assert.match(app, /tip: ifaceTip\(e\)/); assert.match(app, /tip: IFACE_PUMP_TIP/);
assert.match(app, /if \(why\) b\.dataset\.help = same \? why \+ '\\n\\n' \+ same : why;/, 'Add Device: the missing line, a blank line, then that box\'s balloon');
// Dialog 1 #2 (2026-11-12): the Pump's Tab and Device Type balloons, in the Add box and in Pump Device Properties (Dialog 2)
assert.match(app, /const TAB_PUMP_TIP = \['The Tab this Device \(or a new Widget\) goes to when the Move to Tab Button is clicked/);
assert.match(app, /const DEVTYPE_PUMP_TIP = \['Its Device Type: DO@Pump, a Pump \(Pump\) on a Digital Out, On\/Off \(DO\) port\./);
assert.match(app, /\['workspace', '3\. Tab', 'ws', 'addnewid', false, false, \{ tip: tabTip\(it\) \}\]/, 'Dialog 2 Tab');
assert.match(app, /pumpDeviceFields\(it, item\), \['typeCode', 'Device Type', 'ro', shownType\(it\), false, false, \{ tip: devTypeTip\(it\) \}\]/, 'Dialog 2 Device Type');
assert.doesNotMatch(app, /BruControl you could only select/i, 'the Importer note stays in the Sandbox');
// the Default Interface and Default Tab (Rule 4.6)
assert.match(app, /\['buildIface', 'Default Interface', 'sel'/); assert.match(app, /\['buildTab', 'Default Tab', 'sel'/);
assert.match(app, /function buildGoesTo\(name\)/); assert.match(app, /saveBuildDefs\(\{ buildTab: nt\.id \}\)/, 'Add new Tab sets the Default Tab');
assert.match(fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8'), /id="buildDefIface"/);
assert.doesNotMatch(app, /BM_6_/, 'Port 15 in the examples');
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^18\.35 \*\*Review the Interface and Port/m);
assert.match(app, /select\.orientSel'\) \|\| body\.querySelector\('\.afterStep select, \.afterStep input'\)\)\?\.focus\(\)/, 'focus to Orientation');
assert.match(app, /\['cover', 'coverColor', 'pumpIn', 'pumpOut', 'pumpLink', 'ipTypeIn', 'ipTypeOut', \.\.\.PUMP_TYPE_KEYS\]/, 'the picked color is kept');
// Dialog 2 (2026-11-12): Dual Action (Rule 2.50), the Toggle, Graphic and Name balloons, no Path box on a Skynet pump drawing, Rule 3.2 words
assert.match(app, /\['hold', 'Push Button'\]/); assert.match(app, /\['dual', 'Dual Action'\]/);
assert.match(app, /const DUAL_HOLD_MS = 500/);
assert.match(app, /const PUMP_TOGGLE_TIP = \['This is what action is taken when the Pump Image is clicked on the Tab\./);
assert.match(app, /const PUMP_GRAPHIC_TIP = PUMP_8_IPS_PIC \+ 'The Skynet picture of this Device as it will show on the Tab/);
assert.match(app, /\.\.\.\(pumpModelOf\(it\) \? \[\] : \[\['imageOff', 'Path', 'gpick'/, 'a Skynet pump drawing has no Path box');
assert.match(app, /const nameTip = e => isPumpDev\(e\) \? NAME_PUMP_TIP : (isMbvDev\(e\) \? NAME_VALVE_TIP : )?DEVICE_TIPS\.name;/);
assert.match(app, /Type: BM_15_⟦DO@Pump⟧_Red~Pump_BH/);
assert.doesNotMatch(app, /only an Admin can change it|It is exactly 2 letters/, 'Rule 3.2 (2026-11-15): a saved ID never changes, not even by an Admin');
assert.match(app, /Tab IDs follow Rule 3\.2\. Our example Tab is: BH/);
assert.match(fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8'), /el\.tap === 'hold' \|\| el\.tap === 'dual'/);
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^2\.50 \*\*Dual Action click\*\*/m);
// 🏷 Suggested Names (Rule 3.18): convert all names at once
assert.match(app, /function convertAllNames\(\)/); assert.match(app, /const canSuggest = e => hasSuggestion\(e\) && !isInstance\(e\) && !!e\.workspace;/); assert.match(app, /function sugOf\(e\)/);
assert.match(app, /if \(!sug \|\| sug === r\.e\.name \|\| nameCheck\(sug, r\.e\)\) continue;/, 'each checked, one at a time');
assert.match(fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8'), /id="sugAllNames" class="admin-only"/);
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^3\.18 \*\*🏷 Suggested Names/m);
// A frozen top on every dialog (Rule 2.51): the bottom row is gone from #dlg, and paired rows are frozen at the top
assert.match(app, /function freezeDialogTop\(d\)/); assert.match(app, /try \{ freezeDialogTop\(this\); \}/);
assert.match(fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8'), /dialog#dlg:has\(#dlgBody \[data-k="pumpModel"\]\) \.dlgBottomBar, dialog#dlg:has\(#dlgBody \[data-k="ipTypeFrom"\]\) \.dlgBottomBar(, [^{]*)? \{ display: none; \}/, 'the Pump dialog (the model) and each dialog updated since (Rule 2.51: the Pipe and Hose Properties) lose their bottom row');
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^2\.51 \*\*A frozen top on the model dialog\*\*/m);
console.log('pump model tests passed');
// Blichmann RipTide Dialog 1 focus order (OakBarn Brewery, 2026-11-15, Rule 18.38): Enter only between the Label and the Port, the Tab key
// cycles the box's own fields, Interface and Tab are never jumped to
assert.match(app, /const pumpFocus = dd && \(isPumpDev\(e\)( \|\| mbv)?\);/, 'the Pump Add box (and the Motorized Ball Valve, Rule 18.41)');
assert.match(app, /if \(t === lab\) \{ if \(labOk && ps && !ps\.disabled\) ps\.focus\(\); return true; \}/, 'Enter: Label to Port, a blank Label stays');
assert.match(app, /if \(pumpFocus && !confirmed && body\.contains\(t\)\) return pumpEnter\(t\);/, 'until Confirmed');
assert.match(app, /&& \(!pumpFocus \|\| confirmed \|\| ev\.target\.dataset\?\.k === 'device'\)\)/, 'only a new Interface goes on by itself');
assert.match(app, /if \(!pumpFocus && tab && !tab\.value && tab\.offsetParent !== null\)/, 'the Tab is never jumped to');
assert.match(app, /if \(pumpFocus\) dlgEl\.addEventListener\('keydown', pumpTabKey, true\);/, 'the Tab key cycle');
console.log('RipTide Dialog 1 focus order ok');
// Blichmann RipTide Dialog 2 #3 (OakBarn Brewery, 2026-11-16, Rule 18.40)
assert.match(app, /pumpModel: 'The Pump Model you choose from Available Common Brewery Pumps\. Its Properties can be displayed with the ⬢\.'/, 'Model Hover Help in OakBarn Brewery\'s words');
assert.match(app, /const PUMP_FACTS_POP = \{ title: 'Pump facts', view: pumpFactsView/, 'the Model ⬢ is to look at only');
assert.match(app, /'◀ Back'\)\);\s*\n\s*if \(view\)/, 'its one button is Back');
assert.match(app, /\['_power', 'Power', 'ro'/, 'Power is in the Pump facts');
assert.doesNotMatch(app, /\['power', 'Power', 'sel', PUMP_POWER_CHOICES/, 'Power is no longer on the dialog');
assert.match(app, /const PORTS_TIP = 'Match YOUR Pump fittings/, 'Ports Hover Help starts Match YOUR Pump fittings');
assert.match(app, /\.\.\.\['in', 'out'\]\.map\(side => \(pf => \[\.\.\.pf\.slice\(0, 6\), \{ \.\.\.pf\[6\], \.\.\.x \}\]\)\(pumpFitField\(it, factsOf\(it\), side\)\)\)/, 'Inlet IP Fitting and Outlet IP Fitting where Power was (they replaced Ports, 2026-11-17)');
assert.doesNotMatch(app, /it is not changed here/, 'Use: no "not changed here"');
// Rule 18.46 (2026-11-18): the greyed Interface and Port have no Hover Help any more, only the ⛔
assert.ok(!app.includes('SET_WIRE_TIP') && !app.includes('CONFIRMED_WIRE_TIP') && !app.includes('setWireTips'), 'no greyed Interface balloon');
assert.match(app, /⟪img:help_pictures\/Pump_Cover\.png⟫/); assert.match(app, /⟪img:help_pictures\/Pump_Overlays\.png⟫/);
for (const f of ['Pump_Cover.png', 'Pump_Overlays.png']) assert.ok(fs.existsSync(new URL('../media/help_pictures/' + f, import.meta.url)), f);
assert.match(app, /const DB_TIPS = \{/); assert.match(app, /pairLbl dbPopLbl tipLbl', 'data-help': DB_TIPS\.line/, 'Database and .API has its own Hover Help');
assert.match(app, /const profileChoices = kind => \[\.\.\.\(\['pump', 'valve'\]\.includes\(kind\) && \(S\[kind \+ 'Profiles'\] \|\| \[\]\)\.length \? \[\] : \[\['', '\(none\)'\]\]\)/, 'no (none) Pump Profile (nor Valve Profile, Rule 18.41)');
assert.match(app, /if \(\(ovl \|\| \(lit && isPumpDev\(e\)\)\) && img === pic\)/, 'a pump On with Overlay None shows its picture');
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^18\.40 \*\*Blichmann RipTide Dialog 2 #3\*\*/m);
console.log('Dialog 2 #3 tests passed');

// Self Priming and the cavitation caveat (OakBarn Brewery, 2026-11-16: "a Prperty of Self Priming   for a Riotide it is no"; "Boiling
// Liquids are not recomened to be Pumps because of Cavitation"; the priming note on the dialog, Rule 11.8 item 2 exception)
{
  const { selfPrimeOf, factLines } = await import('../public/pumps.js');
  assert.equal(selfPrimeOf({ pumpModel: 'riptide' }), false, 'the RipTide is not self priming');
  assert.equal(selfPrimeOf({ pumpModel: 'topsflo_td5' }), null, 'not stated: not known');
  for (const m of ['chugger', 'kegland_mkii']) assert.equal(selfPrimeOf({ pumpModel: m }), false, m + ': not self priming (the maker says so)');
  for (const m of ['march_809', 'march_809_dc', 'march_815']) assert.equal(selfPrimeOf({ pumpModel: m }), false, m + ': no March pump is self priming');
  assert.equal(selfPrimeOf({ pumpModel: 'other', pumpSelfPrime: true }), true, 'a User Defined pump: its own answer');
  assert.ok(factLines({ pumpModel: 'riptide' }).includes('Self Priming: No'));
  assert.ok(app.includes("['pumpSelfPrime', 'selfPrime', 'Self Priming',") && app.includes("'pumpHottest', 'pumpSelfPrime', 'pumpPorts'"), 'a Pump fact, saved');
  assert.ok(app.includes('Boiling liquids are not recommended to be pumped because of cavitation'), 'the cavitation caveat');
  assert.ok(app.includes("...(selfPrimeOf(o) === false ? [['_primeNote', PRIME_NOTE, 'note'"), 'the priming note under a greyed No');
  assert.ok(!/riptide'[^\n]*hottest: '\d/.test(fs.readFileSync(new URL('../public/pumps.js', import.meta.url), 'utf8')), 'no RipTide Hottest number without Blichmann\'s own');
  console.log('self priming tests passed');
}

// Inlet IP Fitting and Outlet IP Fitting (OakBarn Brewery, 2026-11-17, all Pump dialogs: "Ports could be confused with Arduino Ports so use
// Inlet Fitting"; "Separate Outlet Fitting"; "every IP gets it own type End fitting"): two rows, the End Fittings of the In and Out IPs
{
  const { factLines } = await import('../public/pumps.js');
  const fn = app.slice(app.indexOf('function PUMP_TYPE_FIELDS'), app.indexOf('const PUMP_XYWH'));
  assert.ok(fn.includes("['in', 'out'].map(side =>") && fn.includes('pumpFitField('), 'both rows in every Pump dialog (Add box and Properties)');
  assert.ok(!fn.includes("'IP Type In'") && !fn.includes('pumpPortField'), 'one pair of rows, not two: no Ports row, no IP Type In / Out row');
  assert.ok(fn.includes("it.ipTypeIn ||= pumpIpType(it.pumpPorts, S.config.brewDefaults || {}); it.ipTypeOut ||= it.ipTypeIn;"), 'a pump saved with Ports starts from it, in the Add box too');
  const fit = app.slice(app.indexOf('function pumpFitField'), app.indexOf("// The Model's ⬢ Pump facts"));
  assert.ok(fit.includes("side === 'in' ? 'ipTypeIn' : 'ipTypeOut', label = side === 'in' ? 'Inlet IP Fitting' : 'Outlet IP Fitting'"), 'his labels, word for word, on the IP End Fittings');
  assert.ok(fit.includes('ipChoices(o[key], ...PUMP_PORTS)'), 'every size of the old Ports list still offered');
  assert.ok(!/\['pumpPorts', 'Ports', 'sel'/.test(app), 'no Ports dropdown');
  assert.ok(app.includes("['ipTypeIn', 'Inlet IP Fitting', 'sel', [['', '(from the pump)']") && app.includes("['ipTypeOut', 'Outlet IP Fitting', 'sel'"), 'the Pump Profile says the same');
  assert.ok(!/inside the port|outside of the port|FPT1 ports/.test(app), 'Port is a board Port only (Rule 2.57)');
  const el = { type: 'digitalOut', subtype: 'pump', pumpModel: 'march_815' };
  assert.ok(factLines(el).some(l => l.startsWith('Fittings: 3/4" NPT in')), 'the model\'s fittings on the hover');
  const own = factLines({ ...el, ipTypeIn: 'TC1.5', ipTypeOut: 'FPT1/2' });
  assert.ok(own.includes('Inlet IP Fitting: TC1.5') && own.includes('Outlet IP Fitting: FPT1/2') && !own.some(l => /^Ports:/.test(l)), 'its own End Fittings, never "Ports"');
  // an adapter in the connection: a note in the IP's Properties, information only (OakBarn Brewery, 2026-11-17, Rule 2.57)
  const ad = app.slice(app.indexOf('function ipAdapterNote'), app.indexOf('function ipAdapterNote') + 1200);
  const ipFits = (await import('../public/iptype.js')).ipFits;
  assert.ok(ad.includes('!ipFits(ends[i], ends[j], { sameSize: false })') && ad.includes('Adapter: ${pairs.join') && ad.includes('keep: true'), 'the adapter note');
  assert.ok(!ipFits('TC1.5', 'MPT1/2', { sameSize: false }) && ipFits('TC1.5', 'TC2', { sameSize: false }), 'TC to NPT needs an adapter; two sizes of one type meet at a reducer');
  assert.ok(app.includes(': [...ipAdapterNote(it), ...F.ipPoint]'), 'in the IP\'s Properties');
  console.log('inlet and outlet fitting tests passed');
}
