:: MIT License Granted
:: Copyright (c) OakBarn Brewery 2026
:: Starts the Skynet Brew Panel and opens it in your browser.
:: Change the cd line if your panel is not in C:\Brewing\BrewPanel.
@echo off
title Skynet Brewery Panel
cd /d C:\Brewing\BrewPanel
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node >nul 2>nul || (echo Node.js is not installed. Get it from https://nodejs.org and try again. & pause & exit /b)
:: Opens the browser after 4 seconds, so the panel has time to start
start "" /min cmd /c "timeout /t 4 /nobreak >nul & start "" http://localhost:8080"
npm start
pause
