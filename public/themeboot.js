// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Puts the last picked Look (theme, Rule 2.39) on the page before anything shows, so the page never flashes the wrong colors.
// The Panel saves the Look's colors in this browser each time it loads (public/themes.js, rememberTheme). A plain script on
// purpose (not a module), so it runs at once in the page's <head>.
(function () {
  try {
    var v = JSON.parse(localStorage.getItem('skynet.look') || 'null');
    if (!v || !v.vars) return;
    var root = document.documentElement;
    for (var k in v.vars) if (/^--[a-z-]+$/.test(k) && /^#[0-9a-f]{6}$/i.test(v.vars[k])) root.style.setProperty(k, v.vars[k]);
    root.setAttribute('data-theme', v.light ? 'light' : 'dark');
    root.style.colorScheme = v.light ? 'light' : 'dark';
  } catch (e) { }
})();
