:: MIT License Granted
:: Copyright (c) OakBarn Brewery 2026
:: Skynet Panel: opens the panel window on this computer (Rule 6.32). The Brain runs in the Background; if it is not running yet,
:: it is started first. Closing the panel window never stops the Brain.
@echo off
title Skynet Panel
set "PANEL=C:\Brewing\BrewPanel"
if exist "%~dp0server.js" set "PANEL=%~dp0."
if not exist "%PANEL%\server.js" if exist "%~dp0BrewPanel\server.js" set "PANEL=%~dp0BrewPanel"
if not exist "%PANEL%\server.js" goto nopanel
cd /d "%PANEL%"
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node >nul 2>nul
if errorlevel 1 goto nonode
echo  Opening the Skynet Panel...
node --no-warnings lib\startbrain.js "%PANEL%" panel
if not errorlevel 1 exit 0
echo.
echo  The Brain did not start. The lines above say why.
pause
exit /b 1

:nonode
echo.
echo  Skynet needs Node.js. Double-click  Skynet Brewer  once (it installs Node.js), then try again.
echo.
pause
exit /b 1

:nopanel
echo.
echo  Skynet is not in %PANEL%. Run the Skynet Setup .exe first, or change the PANEL line in this file.
echo.
pause
exit /b 1
