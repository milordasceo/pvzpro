@echo off
setlocal
set CHANGED=
for /f "usebackq delims=" %%s in (`git status --porcelain`) do set CHANGED=1
if "%CHANGED%"=="1" (
  powershell -NoProfile -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('Есть несохранённые изменения. Запустите COMMIT.bat','WB App — Версии')"
  exit /b 0
)
echo Изменений нет.
exit /b 0

