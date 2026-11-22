// The Skynet Brew Timers' names and how they show (Rule 2.68; lib/brewtimers.js runs them on the Brain). Node and the browser load it.
export const BREW_TIMERS = [
  ['skn_Boil_Timer', 'Boil Timer', 'the boil: the Recipe\'s boil time'],
  ['skn_Mash_Timer', 'Mash Timer', 'the mash: the Recipe\'s mash steps\' times added up'],
  ['skn_Whirlpool_Timer', 'Whirlpool / Chilling Timer', 'the Whirlpool and chilling: the Recipe\'s Whirlpool Minutes'],
];
const KEY = new Map(BREW_TIMERS.map(([n]) => [n.toLowerCase(), n]));
export const isBrewTimer = name => KEY.has(String(name ?? '').replace(/^"|"$/g, '').toLowerCase());
export const brewTimerName = name => KEY.get(String(name ?? '').replace(/^"|"$/g, '').toLowerCase());
export const brewTimerDefaultLabel = name => BREW_TIMERS.find(t => t[0] === brewTimerName(name))?.[1] ?? '';

// what a Brew Timer shows (Fritz: "Format hh:mm until 5 minutes left then hh:mm:ss")
export function brewTimerText(sec) {
  const s = Math.max(0, Math.ceil(Number(sec) || 0)), p = n => String(n).padStart(2, '0');
  const hh = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60;
  if (s > 300) { const m = Math.ceil(s / 60); return `${p(Math.floor(m / 60))}:${p(m % 60)}`; }
  return `${p(hh)}:${p(mm)}:${p(ss)}`;
}

