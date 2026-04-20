@ECHO OFF
git pull
start "" "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" ^
  --user-data-dir="C:\chrome-kiosk" ^
  --profile-directory="Profile 2" ^
  --kiosk ^
  --no-first-run ^
  --disable-infobars ^
  --disable-session-crashed-bubble ^
  --app-id=jmdmbgfgbffefjkplbimedofoeeojcii
