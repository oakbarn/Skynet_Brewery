:: MIT License Granted
:: Copyright (c) OakBarn Brewery 2026
:: Starts the Skynet BruControl Importer in its own clean window (Rule 15.4), running in the Background (Rule 6.32). It reads your BruControl config file and
:: never changes BruControl or its files. Put on the same computer as BruControl. Needs Node.js (Skynet Brewer installs it).
@echo off
title Skynet BruControl Importer
set "PANEL=C:\Brewing\BrewPanel"
if exist "%~dp0importer.js" set "PANEL=%~dp0."
if not exist "%PANEL%\importer.js" if exist "%~dp0BrewPanel\importer.js" set "PANEL=%~dp0BrewPanel"
if not exist "%PANEL%\importer.js" goto nopanel
cd /d "%PANEL%"
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node >nul 2>nul
if errorlevel 1 goto nonode
echo  Starting the Importer in the Background. Use  Close Importer  in its window to stop it.
echo.
:: The Importer runs with no black window (Rule 6.32, lib\startbrain.js). This window closes once the Importer answers.
node --no-warnings lib\startbrain.js "%PANEL%" importer
if not errorlevel 1 exit 0
echo.
echo  The Importer did not start. The lines above say why.
pause
exit /b 1

:nonode
echo.
echo  The Importer needs Node.js. Double-click  Skynet Brewer  once (it installs Node.js), then try again.
echo.
pause
exit /b 1

:nopanel
echo.
echo  Skynet is not in %PANEL%. Run the Skynet Setup .exe first, or change the PANEL line in this file.
echo.
pause
exit /b 1
