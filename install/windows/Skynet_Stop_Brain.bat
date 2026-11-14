:: MIT License Granted
:: Copyright (c) OakBarn Brewery 2026
:: Stops the Skynet Brain running in the Background on this computer (Rule 6.32), the normal way: every output Off first (Rule 6.31).
:: The BruControl Importer is closed too if it is open. Start menu > Skynet Brewer > Stop the Skynet Brain.
@echo off
title Stop the Skynet Brain
set "PANEL=C:\Brewing\BrewPanel"
if exist "%~dp0server.js" set "PANEL=%~dp0."
if not exist "%PANEL%\server.js" if exist "%~dp0BrewPanel\server.js" set "PANEL=%~dp0BrewPanel"
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
node --no-warnings "%PANEL%\lib\stoppanel.js" "%PANEL%"
if errorlevel 1 goto still
echo  The Skynet Brain is stopped.
timeout /t 3 >nul
exit 0

:still
echo.
echo  The Skynet Brain did not stop. Use  Menu ^> Close Skynet Panel and the Brain  in the panel on this computer.
pause
exit /b 1
