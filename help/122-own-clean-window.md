# Skynet in its own clean window

On Windows, Skynet Brewer opens the panel in **a window of its own** (Skynet Rule 2.36). It has **no address bar, no bookmarks bar and no tabs**, so the whole screen is the panel.

## How it works

- Double-click **Skynet Brewer** on the Desktop. The black Command Prompt window starts the panel, and a few seconds later the panel opens in its clean window, filling the screen.
- The window is **Microsoft Edge** (or **Google Chrome** if the computer has no Edge) in "app" mode.
- No Edge or Chrome on the computer: your normal browser opens the panel, as before.
- It works whatever .bat you start the panel with, your own .bat in C:\Brewing too.

## The beer mug on the taskbar

The clean window shows the **Skynet Brewer beer mug** (the same mug as the Desktop shortcut) on the Windows taskbar, so when Skynet is minimized you click the beer mug to bring it back. The mug is also in the window's title bar, on the Sign in page and on the Help window.

If the taskbar still shows the Edge or Chrome icon the first time, close the clean window and double-click **Skynet Brewer** again: the window picks up the mug when the panel page loads.

## Your normal browser is not changed

The clean window uses **its own small browser profile**, kept in `%LOCALAPPDATA%\SkynetBrewer\AppWindow`. Nothing in your normal Edge or Chrome is touched: its bookmarks bar, settings, tabs and sign-ins look exactly as before, while Skynet runs and after it closes.

Because it has its own profile, **sign in once** in the clean window the first time. It remembers you after that. If you let it save your password, it is kept only in the clean window: the window never syncs with your Microsoft or Google account, and the installer's **Start Fresh** deletes it.

## Closing

- **☰ Menu > ⏻ Close Skynet Brewer** stops the panel, closes the black window and closes the clean window too (see [Closing Skynet Brewer](95-closing-skynet-brewer)).
- Closing the black window with its **X** also closes the clean window.
- Closing the **clean window** with its X does **not** stop the panel (a brew must never stop because a window was closed). To open it again, double-click **Skynet Brewer** again: the panel is still running, so it just opens its window.

## Other computers and phones

Phones, tablets and other computers open the panel in their own browser, as before (for example over Tailscale on an iPhone).
