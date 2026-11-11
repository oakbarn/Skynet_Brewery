// Pump types and pump facts (Fritz, 2026-11-08, docs/DC_Brewing_Pumps.md, Rule 18.32, Help 163): "any of the Pumps can be controlled
// (On/Off or PWM if it can) and the voltage, Lift, GPM etc are all good info to have at your fingertips."
// Used by the Panel (Pump Properties, the pump's hover facts) and the Brain (a PWM pump's pin). Facts are what the maker or a big
// store says (see the document's Sources); they are a guide, not a promise.

// Power: what the pump runs on. Only a DC pump can have its speed set with PWM (a switch module, MOSFET, on a PWM pin).
export const PUMP_POWERS = [['', 'Not set'], ['ac120', 'AC 120 V (house power)'], ['ac240', 'AC 240 V (house power)'], ['dc12', 'DC 12 V'], ['dc24', 'DC 24 V']];
export const PUMP_USES = [['', 'Hot (wort, water)'], ['cold', 'Cold (glycol, ice water)']];
export const PUMP_SPEEDS = [['', 'On/Off only'], ['pwm', 'PWM speed (Speed %)']];
// Pump Ports (OakBarn Brewery, 2026-11-11: "This should be DDLB TC1.5 TC2 TC3/4 TC1/2 FPT1/2 FPT 3/4 FPT1 MPT1/2 MPT3/4 MPT1 Differnt BSP
// up to 1 Metrc"): Tri-Clamp, Female and Male Pipe Thread (NPT), British pipe thread (BSP) up to 1", and metric pipe (DN, the
// metric sizes that match 1/4" to 1"). A pump's port can be changed by adding a fitting (FPT1/2 + a TC1.5 fitting = TC1.5).
export const PUMP_PORTS = ['TC1.5', 'TC2', 'TC3/4', 'TC1/2', 'FPT1/2', 'FPT3/4', 'FPT1', 'MPT1/2', 'MPT3/4', 'MPT1',
  'BSP1/4', 'BSP3/8', 'BSP1/2', 'BSP3/4', 'BSP1', 'DN8', 'DN10', 'DN15', 'DN20', 'DN25'];
export const isTcPort = p => /^TC/i.test(String(p || '').trim());
export const isDcPower = p => /^dc/.test(String(p || ''));
export const powerText = p => PUMP_POWERS.find(([k]) => k === p)?.[1] ?? '';

// speed: 'pwm' = can be slowed with PWM; 'try' = brushless with its own driver, PWM may work (test it slowly first); 'no' = AC, On/Off only.
// pic = the Skynet pump drawing it goes with (Images/Skynet/Pumps/<pic>.svg), when there is one.
export const PUMP_FACTS = [
  { key: 'topsflo_td5', name: 'Topsflo TD5 (also Steelhead, Wort Hog)', power: 'dc24', speed: 'try', flow: '5 GPM (store: 6.4)', lift: '14 ft (store: 19)', hottest: '230 °F', ports: '1/2" NPT', body: 'Stainless', pics: ['Pump_Topsflo_TD5_Poly_Center_Inlet'], note: 'Power level can be set on the pump (5, 10, 15 or 25 W). Runs on 6 to 24 V.' },
  { key: 'march_809_dc', name: 'March 809-PL-HS DC', power: 'dc24', speed: 'pwm', flow: '7 GPM', lift: '12 ft', hottest: '250 °F', ports: '3/4" NPT in, 1/2" NPT out', body: 'PPS plastic', note: 'Also made for 12 V and 36 V.' },
  { key: 'ddmeter_mp20', name: 'DDMETER HB-MP20', power: 'dc12', speed: 'try', flow: '9 L/min (2.4 GPM)', lift: '5 m (16 ft)', hottest: '212 °F', ports: 'Stainless fittings', body: 'Stainless and plastic', note: '18 W, 1.5 A. No power brick.' },
  { key: 'brewtaurus_24', name: 'BrewTaurus Mini pump DC 24V (JT-1000B-24)', power: 'dc24', speed: 'try', flow: '33 L/min (8.8 GPM)', lift: '5 m (16 ft)', hottest: '212 °F', ports: '20 mm and 1/2" thread', body: 'Not stated', note: 'Can sit in the liquid. 24 V power brick included.' },
  { key: 'bayite_7a006', name: 'bayite BYT-7A006', power: 'dc12', speed: 'try', flow: '2.1 GPM', lift: '9.8 ft', hottest: '212 °F', ports: '1/2" male thread', body: 'Not stated', note: '0.7 A. Does not prime itself. No power brick.' },
  { key: 'solar_12v', name: 'Solar hot-water style 12 V pump (Seaflo, ZAOJIAO, LD Carlson ...)', power: 'dc12', speed: 'try', flow: 'Varies', lift: 'Varies', hottest: 'About 212 °F', ports: 'Barb or 1/2" thread', body: 'Plastic', note: 'Cheap; fine for small batches and transfers.' },
  { key: 'penguin_glycol', name: 'Penguin Chillers glycol pump', power: 'dc12', speed: 'try', use: 'cold', flow: '3.5 GPM', lift: '16 ft', hottest: 'Cold use', ports: '3/8" barb', body: 'Not stated', note: '19 W. Made to cycle on and off.' },
  { key: 'penguin_glycol_xl', name: 'Penguin Chillers glycol pump XL', power: 'dc24', speed: 'try', use: 'cold', flow: '6.3 GPM', lift: '32 ft', hottest: 'Cold use', ports: '3/8" and 1/2" barbs', body: 'Not stated', note: '60 W. Made to cycle on and off.' },
  { key: 'grainfather_gf30', name: 'Grainfather GF30 cooling pump', power: 'dc12', speed: 'try', use: 'cold', flow: 'Not stated', lift: 'Not stated', hottest: 'Cold use', ports: 'Grainfather fittings', body: 'Not stated', note: 'Cools the Grainfather GF30 fermenter.' },
  { key: 'submersible_dc', name: 'Small 12 V or 24 V submersible pump (aquarium, fountain)', power: 'dc12', speed: 'try', use: 'cold', flow: 'Varies', lift: 'Low', hottest: 'Check the box', ports: 'Barb', body: 'Plastic', note: 'Often dropped in a bucket of ice water to cool a fermenter.' },
  { key: 'march_809', name: 'March 809-PL-HS (AC)', power: 'ac120', speed: 'no', flow: '6 GPM', lift: '12.1 ft', hottest: '250 °F', ports: '1/2" NPT in and out', body: 'Polysulfone or stainless head', pics: ['Pump_March_809_Poly_90_Inlet', 'Pump_March_809_Poly_Center_Inlet', 'Pump_March_809_SS_Center_Inlet'] },
  { key: 'march_815', name: 'March 815-PL-C (AC)', power: 'ac120', speed: 'no', flow: '8 GPM', lift: '18.6 ft', hottest: '250 °F', ports: '3/4" NPT in (center), 1/2" NPT out', body: 'Polysulfone or stainless head', pics: ['Pump_March_815_Poly_90_Inlet', 'Pump_March_815_Poly_Center_Inlet', 'Pump_March_815_SS_Center_Inlet'] },
  { key: 'chugger', name: 'Chugger (AC)', power: 'ac120', speed: 'no', flow: '7 GPM', lift: '18.6 ft', hottest: '250 °F', ports: '1/2" NPT in and out (inline head)', body: 'Stainless', note: '1.4 A.', pics: ['Pump_Chugger_SS_90_Inlet', 'Pump_Chugger_SS_Center_Inlet'] },
  { key: 'riptide', name: 'Blichmann RipTide (AC)', power: 'ac120', speed: 'no', flow: '7 GPM', lift: '21 ft', hottest: '', ports: '1/2" NPT in and out (also made with Tri-Clamp)', body: 'Stainless', pics: ['Pump_Riptide_SS_Center_Inlet'] },
  { key: 'kegland_mkii', name: 'KegLand MKII 25 W (AC)', power: 'ac240', speed: 'no', flow: '19 L/min (5 GPM)', lift: '3.4 m (11 ft)', hottest: '248 °F (120 °C head)', ports: '1/2" BSP', body: 'Polysulfone or stainless', pics: ['Pump_KegLand_MKII_Poly_Center_Inlet', 'Pump_KegLand_MKII_SS_Center_Inlet'], note: '25 W. 110 V and 240 V models are sold.' },
  { key: 'brewzilla_g4', name: 'BrewZilla Gen 4 built-in pump (AC)', power: 'ac240', speed: 'no', flow: '', lift: '', hottest: '', ports: 'BrewZilla fittings', body: 'Plastic', note: '6 W.' },
];
export const pumpFacts = key => PUMP_FACTS.find(f => f.key === key) ?? null;
// the pump's facts: the model picked in its Properties, or the one its Skynet drawing goes with
export const factsOf = el => pumpFacts(el?.pumpModel) ?? (el?.pumpModel === 'other' ? null : PUMP_FACTS.find(f => f.pics?.some(p => String(el?.imageOff || '').includes(`/${p}.`))) ?? null);
// what it runs on: its own Power setting, or its model's
export const powerOf = el => el?.power || factsOf(el)?.power || '';
export const useOf = el => el?.pumpUse || factsOf(el)?.use || '';

// Speed % (0-100, empty = 100): how fast a PWM pump runs while it is On
export const pumpSpeed = v => { const n = v === undefined || v === null || v === '' ? 100 : Number(v); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 100; };
export const isPwmPump = el => el?.type === 'digitalOut' && el.subtype === 'pump' && !!el.pwm;

// the facts as short lines (hover on a Pump, the Properties pop-up). Empty facts are left out.
export function factLines(el) {
  const f = factsOf(el), out = [];
  if (f) out.push(f.name);
  const pw = powerText(powerOf(el)); if (pw) out.push('Power: ' + pw);
  out.push('Use: ' + (useOf(el) === 'cold' ? 'Cold (glycol, ice water)' : 'Hot & Cool'));
  if (isPwmPump(el)) out.push(`Speed control: PWM, Speed ${pumpSpeed(el.speed)} %`);
  const own = { flow: el?.pumpFlow, lift: el?.pumpLift, hottest: el?.pumpHottest, ports: el?.pumpPorts };
  for (const [k, t] of [['flow', 'Flow'], ['lift', 'Lift'], ['hottest', 'Hottest'], ['ports', 'Ports']]) { const v = own[k] || f?.[k]; if (v) out.push(`${t}: ${v}`); }
  if (f?.body) out.push('Body: ' + f.body);
  if (f?.note) out.push(f.note);
  return out;
}
