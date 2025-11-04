@echo off
setlocal
git rev-parse --is-inside-work-tree >nul 2>&1 || (
  echo Репозиторий git не найден. Инициализируйте его и добавьте remote.
  exit /b 1
)
echo Введите сообщение коммита:
set /p MSG=Message: 
if "%MSG%"=="" set MSG=chore: update
git add -A
git commit -m "%MSG%"
if errorlevel 1 (
  echo Нет изменений или ошибка коммита. Проверьте git status.
  exit /b 1
)
for /f "usebackq delims=" %%b in (`git rev-parse --abbrev-ref HEAD`) do set BR=%%b
git push -u origin %BR%
echo Коммит и push выполнены для ветки %BR%.
exit /b 0

