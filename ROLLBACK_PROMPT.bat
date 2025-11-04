@echo off
setlocal
git rev-parse HEAD >nul 2>&1 || (
  echo Репозиторий git не обнаружен.
  exit /b 1
)
echo Введите хэш коммита для отката (например, 987b5e0):
set /p HASH=
if "%HASH%"=="" (
  echo Хэш не указан.
  exit /b 1
)
set BRANCH=rollback-%HASH%
git checkout -b %BRANCH% %HASH%
if errorlevel 1 (
  echo Не удалось перейти на указанный коммит. Проверьте хэш.
  exit /b 1
)
echo Создана ветка %BRANCH% на коммите %HASH%. Проверьте состояние, затем создайте PR или вернитесь: git checkout main
exit /b 0

