@echo off

set "DIR=%~dp0"
set "DIR=%DIR:~0,-1%"
set CHROMIUM_DIR=%DIR%\chromium
set ZIP=%CHROMIUM_DIR%\chromium.zip
set APP=%CHROMIUM_DIR%\chrome-win\chrome.exe

if not exist "%CHROMIUM_DIR%" mkdir "%CHROMIUM_DIR%"

if not exist "%APP%" (
    echo Downloading Chromium...

    powershell -Command "Invoke-WebRequest -Uri https://download-chromium.appspot.com/dl/Win?type=snapshots -OutFile '%ZIP%'"

    powershell -Command "Expand-Archive -Path '%ZIP%' -DestinationPath '%CHROMIUM_DIR%' -Force"

    del "%ZIP%"

    echo Done.
)

taskkill /IM chrome.exe /F >nul 2>&1

"%APP%" ^
  --kiosk ^
  --user-data-dir="%DIR%\profile" ^
  --load-extension="%DIR%" ^
  --disable-extensions-except="%DIR%" ^
  --enable-gpu-rasterization ^
  --enable-zero-copy ^
  --ignore-gpu-blocklist ^
  --disable-background-networking ^
  --disable-background-timer-throttling ^
  --disable-renderer-backgrounding ^
  --disable-sync ^
  --metrics-recording-only ^
  --disable-component-update ^
  --no-first-run ^
  --no-default-browser-check ^
  --disable-session-crashed-bubble ^
  --autoplay-policy=no-user-gesture-required ^
  --start-maximized ^
  --new-window ^
  "https://www.youtubekids.com"