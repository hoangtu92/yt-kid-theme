@echo off

set DIR=%~dp0

for %%i in ("%DIR%\..\..") do set "ROOT=%%~fi"

set TARGET=%DIR%start.cmd
set ICON=%ROOT%\assets\icons\youtube-kids.ico
set SHORTCUT=%USERPROFILE%\Desktop\YouTube Kids.lnk

powershell -Command ^
$WshShell = New-Object -comObject WScript.Shell; ^
$Shortcut = $WshShell.CreateShortcut('%SHORTCUT%'); ^
$Shortcut.TargetPath = '%TARGET%'; ^
$Shortcut.WorkingDirectory = '%DIR%'; ^
$Shortcut.IconLocation = '%ICON%'; ^
$Shortcut.Save()

echo Shortcut created on Desktop

