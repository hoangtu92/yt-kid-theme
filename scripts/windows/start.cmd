@echo off
setlocal

git pull origin probuild

call npm run win:build

REM ===== config =====
set VERSION=147.0.7727.57

REM ===== paths =====
set "DIR=%~dp0"
REM remove trailing slash
set "DIR=%DIR:~0,-1%"

REM go up from scripts\windows → scripts → ROOT
for %%i in ("%DIR%\..\..") do set "ROOT=%%~fi"

set "CFT_DIR=%ROOT%\runtime\chrome-for-testing"
set "ZIP=%CFT_DIR%\chrome.zip"

REM ===== detect 32/64 =====
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set PLATFORM=win64
    set EXE=chrome-win64\chrome.exe
) else (
    set PLATFORM=win32
    set EXE=chrome-win32\chrome.exe
)

set "APP=%CFT_DIR%\%EXE%"

echo Platform: %PLATFORM%

REM ===== create dir =====
if not exist "%CFT_DIR%" mkdir "%CFT_DIR%"

REM ===== download if missing =====
if not exist "%APP%" (
    echo Downloading Chrome for Testing...


    powershell -Command "Invoke-WebRequest -Uri https://storage.googleapis.com/chrome-for-testing-public/%VERSION%/%PLATFORM%/chrome-%PLATFORM%.zip -OutFile '%ZIP%'"

    powershell -Command "Expand-Archive -Path '%ZIP%' -DestinationPath '%CFT_DIR%' -Force"

    del "%ZIP%"

    echo Done.
)

REM ===== kill old =====
taskkill /IM chrome.exe /F >nul 2>&1

REM ===== kiosk loop =====
:loop

echo Starting Chrome for Testing...


"%APP%" ^
  --kiosk ^
  --user-data-dir="%ROOT%\runtime\profile" ^
  --load-extension="%ROOT%\dist" ^
  --disable-extensions-except="%ROOT%\dist" ^
  --use-angle=d3d11 ^
  --enable-gpu ^
  --ignore-gpu-blocklist ^
  --enable-gpu-rasterization ^
  --enable-zero-copy ^
  --disable-background-networking ^
  --disable-background-timer-throttling ^
  --disable-renderer-backgrounding ^
  --disable-sync ^
  --metrics-recording-only ^
  --disable-component-update ^
  --no-first-run ^
  --disable-infobars ^
  --no-default-browser-check ^
  --disable-session-crashed-bubble ^
  --disable-features=SessionRestore ^
  --autoplay-policy=no-user-gesture-required ^
  --start-maximized ^
  --app="https://www.youtubekids.com"
