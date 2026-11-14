// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The black window keeps its own name (Rule 2.36, OakBarn Brewery 2026-11-14: "Windows PowerShell remains open after Skynet
// Panel is closed"). Skynet runs small PowerShell helpers in the Background (shrink the black window to the task bar, keep the
// computer awake while brewing, close the clean window, list programs). They share the black window, and PowerShell renames it
// "Windows PowerShell" and never gives the name back, so the panel's own window looked like a stray PowerShell window.
// Windows only: the window's name is put back every few seconds. Nothing else about the window or Windows is changed.
export const PANEL_TITLE = 'Skynet Brewery Panel - keep open while brewing';
export const IMPORTER_TITLE = 'Skynet BruControl Importer - keep open while importing';
export const TITLE_MS = 3000;

// Returns a stop function. setTitle and every are there for the tests.
export function keepConsoleTitle(title, { platform = process.platform, setTitle = t => { process.title = t; }, every = TITLE_MS } = {}) {
  if (platform !== 'win32') return () => {};
  const put = () => { try { setTitle(title); } catch { /* no window: nothing to name */ } };
  put();
  const timer = setInterval(put, every);
  timer.unref?.();
  return () => clearInterval(timer);
}
