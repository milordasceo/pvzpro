@echo off
setlocal
git rev-parse --is-inside-work-tree >nul 2>&1 || (
  echo Репозиторий git не найден.
  exit /b 1
)
for /f "usebackq delims=" %%b in (`git rev-parse --abbrev-ref HEAD`) do set BR=%%b
git push origin %BR%
if errorlevel 1 (
  echo Ошибка push. Проверьте подключение к удалённому репозиторию.
  exit /b 1
)
echo Выполнен push текущей ветки %BR%.
exit /b 0

