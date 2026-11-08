// Code Value Widget (OakBarn Brewery, 2026-11-08, Rule 1.27, Help 161): a Value Widget with a Format and a Code attribute.
// It shows its Value in the chosen Format (Number, Time or DateTime), and each time a person sets the Value (a tap and Set on
// its Tab, or the .API) the Brain runs the Process code in its Code attribute once. In the code, {value} stands for the
// Value of the Widget, for example:  MB_25_HE_Brew~Kettle_BR.target = {value} (a Heating Element's Setpoint)
// Shared by the Brain (lib/engine.js, lib/store.js) and the panel (public/app.js).

export const CODE_VALUE_TYPE = 'codeValueWidget';
export const isCodeValue = el => !!el && el.type === CODE_VALUE_TYPE;

// the Formats it can show, and the data type each one keeps
export const CV_FORMATS = [['value', 'Number'], ['time', 'Time (hh:mm:ss)'], ['datetime', 'DateTime (mm/dd/yyyy hh:mm:ss)']];
export const cvDataType = el => (CV_FORMATS.some(([k]) => k === el?.format) ? el.format : 'value');

// {value} (any case, spaces allowed inside the braces) outside "quoted text" becomes what it stands for: the Widget's
// Name.value when it runs, so the Process sees the Value as it is now, with its own type (a number, a time ...)
const VALUE_WORD = /\{\s*value\s*\}/gi;
export function codeWithValue(code, stand) {
  return String(code ?? '').split(/("(?:[^"\\]|\\.)*")/).map((part, i) => (i % 2 ? part : part.replace(VALUE_WORD, stand))).join('');
}
export const widgetCodeText = el => codeWithValue(el?.code, `${el?.name}.value`);
export const hasCode = el => isCodeValue(el) && String(el.code ?? '').trim() !== '';
