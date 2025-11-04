@echo off
setlocal
node scripts\git-sync.mjs
if exist git-status.html (
  start "" "git-status.html"
  echo Отчёт git-status.html открыт.
  exit /b 0
)
echo Не удалось найти git-status.html. Проверьте, что скрипт синхронизации выполнился.
exit /b 1

