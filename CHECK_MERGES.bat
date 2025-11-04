@echo off
setlocal
node scripts\git-bidir-sync.mjs --check-merges
if errorlevel 1 (
  echo [ERROR] Не удалось получить последние мерджи. Проверьте GITHUB_TOKEN и доступ к GitHub.
  exit /b 1
)
echo [OK] Проверка мерджей завершена. Откройте git-status.html для просмотра.
exit /b 0
