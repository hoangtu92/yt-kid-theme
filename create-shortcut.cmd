@echo off

set DIR=%~dp0
set TARGET=%DIR%start.cmd
set ICON=%DIR%youtube-kids.ico
set SHORTCUT=%DIR%\YouTube Kids.lnk

powershell -Command ^
$WshShell = New-Object -comObject WScript.Shell; ^
$Shortcut = $WshShell.CreateShortcut('%SHORTCUT%'); ^
$Shortcut.TargetPath = '%TARGET%'; ^
$Shortcut.WorkingDirectory = '%DIR%'; ^
$Shortcut.IconLocation = '%ICON%'; ^
$Shortcut.Save()

echo Shortcut created on Desktop
pause
