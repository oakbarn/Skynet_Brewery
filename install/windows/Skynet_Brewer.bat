:: MIT License Granted
:: Copyright (c) OakBarn Brewery 2026
:: Starts the Skynet Brew Panel and opens it in your browser.
:: If Node.js is missing or too old, it installs it first (Windows asks for permission).
:: If the USB board support is missing, it gets it (needs the internet once).
:: Change the PANEL line if your panel is not in C:\Brewing\BrewPanel.
@echo off
title Skynet Brewery Panel
set "PANEL=C:\Brewing\BrewPanel"

:: Started from inside the panel folder (the installer puts this file there)? Then use that folder.
if exist "%~dp0server.js" set "PANEL=%~dp0."
if not exist "%PANEL%\server.js" if exist "%~dp0BrewPanel\server.js" set "PANEL=%~dp0BrewPanel"
if not exist "%PANEL%\server.js" goto nopanel
cd /d "%PANEL%"

:: 1. Node.js, version 22.13 or newer. Installed for you when it is missing.
call :checknode
if defined NODEOK goto haveusb
echo.
echo  ==========================================================
echo   Skynet Brewery needs Node.js (free). %NODEWHY%
echo   Installing it now. This needs the internet and can take
echo   a few minutes. If Windows asks "Do you want to allow this
echo   app to make changes to your device?", click  Yes.
echo  ==========================================================
echo.

:: First try winget, the app installer built into Windows 10 and 11
where winget >nul 2>nul
if errorlevel 1 goto msi
echo  Installing Node.js with winget...
winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
call :checknode
if defined NODEOK goto installed

:msi
:: No winget, or it did not work: download the Node.js installer from nodejs.org and run it
echo  Downloading Node.js from nodejs.org...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $all=Invoke-RestMethod 'https://nodejs.org/dist/index.json'; $v=($all | Where-Object { $_.lts } | Select-Object -First 1).version; $n='node-'+$v+'-x64.msi'; $f=Join-Path $env:PUBLIC $n; Invoke-WebRequest ('https://nodejs.org/dist/'+$v+'/'+$n) -OutFile $f -UseBasicParsing; $s=(Invoke-WebRequest ('https://nodejs.org/dist/'+$v+'/SHASUMS256.txt') -UseBasicParsing).Content; $h=(Get-FileHash $f -Algorithm SHA256).Hash.ToLower(); if (-not $s.Contains($h+'  '+$n)) { Remove-Item $f; throw 'The download was damaged.' }; Write-Host (' Installing Node.js '+$v+'...'); $p=Start-Process msiexec.exe -ArgumentList ('/i '+$f+' /passive /norestart') -Wait -PassThru; Remove-Item $f; exit $p.ExitCode"
call :checknode
if not defined NODEOK goto nonode

:installed
for /f "delims=" %%v in ('node -v') do echo  Node.js %%v is installed.
echo.

:haveusb
:: 2. USB board support (the serialport package), if it is not there yet. The panel runs without it, on the simulator.
if exist "node_modules\serialport" goto start
echo  Getting the USB board support. This needs the internet and can take a minute...
call npm install --no-audit --no-fund
if not exist "node_modules\serialport" echo  Could not get the USB board support. The panel still works with the simulator. It tries again next start.
echo.

:start
:: 3. Opens the browser after 4 seconds, so the panel has time to start
echo  KEEP THIS WINDOW OPEN while you brew. Closing it stops the panel. It goes down to the task bar once the panel is up.
echo  To stop the panel and close this window, use  Menu ^> Close Skynet Brewer  in the panel.
echo.
start "" /min cmd /c "timeout /t 4 /nobreak >nul & start "" http://localhost:8080"
:: After the browser opens, the panel puts this window down on the task bar (click it there to see it again)
set "SKYNET_MINIMIZE=1"
call npm start
:: Closed from the panel (Menu > Close Skynet Brewer): this window closes too. Stopped by an error: it stays open so you can read why.
if not errorlevel 1 exit /b 0
echo.
echo  The panel stopped because of an error. The lines above say why.
pause
exit /b 1

:: Sets NODEOK when Node.js 22.13 or newer is here, else says why in NODEWHY
:checknode
set "NODEOK="
set "NODEWHY=It is not on this computer yet."
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node >nul 2>nul
if errorlevel 1 exit /b 0
set "NODEWHY=The one on this computer is too old."
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)"
if not errorlevel 1 set "NODEOK=1"
exit /b 0

:nonode
echo.
echo  Node.js could not be installed by itself. The Node.js download page is
echo  opening now: download the LTS version for Windows, install it, then
echo  double-click Skynet Brewer again.
start "" https://nodejs.org/en/download
echo.
pause
exit /b 1

:nopanel
echo.
echo  The panel is not in %PANEL%
echo.
echo  Unzip Skynet_BrewPanel_(date).zip into C:\Brewing so you get the folder
echo  C:\Brewing\BrewPanel with server.js inside it. If you keep the panel
echo  somewhere else, open this file in Notepad and change the PANEL line.
echo.
pause
exit /b 1
