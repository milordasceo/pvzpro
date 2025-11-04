@echo off
setlocal
echo Запуск двусторонней синхронизации (watch, ~5 сек интервал)...
node scripts\git-bidir-sync.mjs --watch
if errorlevel 1 (
  echo [ERROR] Синхронизатор завершился с ошибкой.
  exit /b 1
)
exit /b 0
