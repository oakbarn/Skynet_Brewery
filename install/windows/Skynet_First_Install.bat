:: MIT License Granted
:: Copyright (c) OakBarn Brewery 2026
::
:: Skynet Brewery - FIRST TIME INSTALL for Windows.
:: Run it once, after you have unzipped the panel into C:\Brewing\BrewPanel.
:: It installs Node.js if it is missing or too old, gets the USB board support, puts "Skynet Brewer" on your Desktop and starts the panel.
:: After this, start the panel every day with "Skynet Brewer" on the Desktop.
@echo off
title Skynet Brewery - First Time Install
set "PANEL=C:\Brewing\BrewPanel"
echo.
echo  ==========================================
echo   Skynet Brewery - first time install
echo  ==========================================
echo.

:: 1. Is the panel where it should be?
if not exist "%PANEL%\server.js" goto nopanel
cd /d "%PANEL%"
echo [1/5] Found the panel in %PANEL%

:: Already had the panel here? Its work is in config, data, media and scripts (a new zip has none of them).
set "OLD="
for %%d in (config data media scripts) do if exist "%PANEL%\%%d" set "OLD=1"
if not defined OLD goto nodestep
echo.
color 4F
echo  ========================================================================
echo   WARNING: THIS PC ALREADY HAS A SKYNET PANEL WITH YOUR WORK IN IT
echo  ========================================================================
echo.
echo  Starting over gives you a brand-new panel, as if it had never been installed.
echo  ALL OF THE WORK DONE SO FAR WILL BE OVERWRITTEN:
echo    - your Tabs, layout, Devices, pipes and settings    (config)
echo    - your Processes                                    (scripts)
echo    - your pictures and sounds                          (media)
echo    - your brew log, users, passwords and recovery code (data)
echo  As a safety net the old folders are moved to C:\Brewing\Old_Panel_(date),
echo  not deleted. Nothing from them is used by the new panel.
echo.
echo    Type  YES   to start over and overwrite all of it.
echo    Type  KEEP  to keep all your work and only finish the install.
echo    Press Enter to stop without changing anything.
echo.
set "ANSWER="
set /p "ANSWER=Your answer: "
color 07
if "%ANSWER%"=="YES" goto startover
if /i "%ANSWER%"=="KEEP" goto keepwork
echo.
echo  Stopped. Nothing was changed.
pause
exit /b 1

:startover
netstat -ano | findstr /r /c:":8080 .*LISTENING" >nul
if not errorlevel 1 goto stillrunning
for /f "delims=" %%t in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HHmmss"') do set "STAMP=%%t"
set "KEEPDIR=C:\Brewing\Old_Panel_%STAMP%"
mkdir "%KEEPDIR%"
for %%d in (config data media scripts) do if exist "%PANEL%\%%d" move "%PANEL%\%%d" "%KEEPDIR%\" >nul
for %%d in (config data media scripts) do if exist "%PANEL%\%%d" goto movefailed
echo  Started over. The old work was moved to %KEEPDIR%
goto nodestep

:keepwork
echo  Keeping all your work.

:nodestep

:: 2. Is Node.js installed, and new enough?
call :checknode
if defined NODEOK goto nodeok
echo [2/5] Node.js: %NODEWHY% Installing it now. This needs the internet and can take
echo       a few minutes. If Windows asks "Do you want to allow this app to make changes
echo       to your device?", click  Yes.
where winget >nul 2>nul
if errorlevel 1 goto nodemsi
winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
call :checknode
if defined NODEOK goto nodeok
:nodemsi
echo       Downloading Node.js from nodejs.org...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $all=Invoke-RestMethod 'https://nodejs.org/dist/index.json'; $v=($all | Where-Object { $_.lts } | Select-Object -First 1).version; $n='node-'+$v+'-x64.msi'; $f=Join-Path $env:PUBLIC $n; Invoke-WebRequest ('https://nodejs.org/dist/'+$v+'/'+$n) -OutFile $f -UseBasicParsing; $s=(Invoke-WebRequest ('https://nodejs.org/dist/'+$v+'/SHASUMS256.txt') -UseBasicParsing).Content; $h=(Get-FileHash $f -Algorithm SHA256).Hash.ToLower(); if (-not $s.Contains($h+'  '+$n)) { Remove-Item $f; throw 'The download was damaged.' }; Write-Host (' Installing Node.js '+$v+'...'); $p=Start-Process msiexec.exe -ArgumentList ('/i '+$f+' /passive /norestart') -Wait -PassThru; Remove-Item $f; exit $p.ExitCode"
call :checknode
if not defined NODEOK goto nonode
:nodeok
for /f "delims=" %%v in ('node -v') do echo [2/5] Node.js %%v is installed. Good.

:: 3. USB board support (the serialport package). Needs the internet.
echo [3/5] Getting the USB board support. This needs the internet and can take a minute...
call npm install --no-audit --no-fund
node -e "import('serialport').catch(()=>process.exit(1))"
if errorlevel 1 (
  echo.
  echo       Could not get the USB board support. The panel still works with the simulator.
  echo       Check the internet, then run this file again to get it.
  echo.
)

:: 4. The everyday start file and the Desktop shortcut
copy /y "%PANEL%\install\windows\Skynet_Brewer.bat" "C:\Brewing\Skynet_Brewer.bat" >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop')+'\Skynet Brewer.lnk'); $s.TargetPath='C:\Brewing\Skynet_Brewer.bat'; $s.WorkingDirectory='C:\Brewing\BrewPanel'; $s.IconLocation='C:\Brewing\BrewPanel\install\windows\skynet.ico'; $s.Save()"
if errorlevel 1 (
  echo [4/5] Could not make the Desktop shortcut. Make it by hand: see step 9 of ReadMe_Windows.txt
) else (
  echo [4/5] Put "Skynet Brewer" on your Desktop.
)

:: 5. Start the panel and open the browser
echo [5/5] Starting the panel. Your browser opens it in a few seconds.
echo.
echo  If Windows asks "Allow Node.js on your networks?": tick Private networks and click Allow.
echo  KEEP THIS WINDOW OPEN while you brew. Closing it stops the panel.
echo.
start "" /min cmd /c "timeout /t 5 /nobreak >nul & start "" http://localhost:8080"
call npm start
echo.
echo The panel has stopped.
pause
exit /b 0

:stillrunning
echo.
echo  The panel is still running. Close its black window first, then run this file
echo  again. Nothing was changed.
pause
exit /b 1

:movefailed
echo.
echo  Could not move all the old folders (a file is in use). Close every window that
echo  uses the panel's files, then run this file again. What did move is in %KEEPDIR%
pause
exit /b 1

:nopanel
echo  The panel is not in %PANEL%
echo.
echo  Unzip Skynet_BrewPanel_(date).zip into C:\Brewing so you get the folder
echo  C:\Brewing\BrewPanel with server.js inside it. See step 6 of ReadMe_Windows.txt
echo.
pause
exit /b 1

:nonode
echo.
echo  Node.js could not be installed by itself. The panel cannot run without it.
echo  The Node.js download page is opening now. Install the LTS version (step 3 of
echo  ReadMe_Windows.txt), then run this file again.
start "" https://nodejs.org/en/download
echo.
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
