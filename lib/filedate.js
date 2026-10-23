// Dates in file and folder names follow ISO 8601 (Fritz, 2026-10-23), on the Brain's own clock (local time):
//   a day alone          2026-10-23        (extended form, the one people read most easily)
//   a day and a time     20261023T113005   (basic form: ISO 8601 has no colons-free extended form, and Windows forbids : in names)
//   a day and minutes    20261023T1130
// The two forms are never mixed inside one date, which ISO 8601 does not allow. Old files with the older names
// (2026-10-23-11-30-05, 20261023_11_30, ...) are still listed and restored: lists sort by the file's time, not its name.
const two = n => String(n).padStart(2, '0');
export const fileDay = (d = new Date()) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
export const fileMinute = (d = new Date()) => `${d.getFullYear()}${two(d.getMonth() + 1)}${two(d.getDate())}T${two(d.getHours())}${two(d.getMinutes())}`;
export const fileStamp = (d = new Date()) => `${fileMinute(d)}${two(d.getSeconds())}`;
// the same, for a time already shifted to the wanted zone and read with the UTC getters
export const fileMinuteUTC = d => `${d.getUTCFullYear()}${two(d.getUTCMonth() + 1)}${two(d.getUTCDate())}T${two(d.getUTCHours())}${two(d.getUTCMinutes())}`;
// a stamp at the end of a file name, new form or old: used to find the name in front of it
export const STAMP_TAIL = /(?:\d{8}T\d{4,6}|\d{4}-\d\d-\d\d-\d\d-\d\d-\d\d)(?:-\d+)?$/;
