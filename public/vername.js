// Version names (Fritz, 2026-10-30): YYMMDD_HH_MM_n, for example 261030_11_58_1. The time makes a version unique, so n is
// 1 unless another version was made in the same minute (then 2, 3 ...). No imports, so node can load it too.
export const VERSION_RE = /^\d{6}_\d{2}_\d{2}_\d+$/;
const two = n => String(n).padStart(2, '0');
export function versionName(prev = '', when = new Date()) {
  const stamp = `${two(when.getFullYear() % 100)}${two(when.getMonth() + 1)}${two(when.getDate())}_${two(when.getHours())}_${two(when.getMinutes())}`;
  const m = /^(\d{6}_\d{2}_\d{2})_(\d+)$/.exec(prev || '');
  return `${stamp}_${m && m[1] === stamp ? +m[2] + 1 : 1}`;
}
