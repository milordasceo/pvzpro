@echo off
setlocal
git fetch --all --prune

REM Убедимся, что main существует локально
git show-ref --verify --quiet refs/heads/main || git checkout -B main origin/main
if not errorlevel 1 git checkout main

REM Настраиваем dev с проверкой наличия удалённой ветки по выводу
set hasRemoteDev=
for /f "usebackq delims=" %%R in (`git ls-remote --heads origin dev`) do set hasRemoteDev=1
if defined hasRemoteDev (
  git checkout -B dev origin/dev
) else (
  git rev-parse --verify dev >nul 2>&1 || git branch dev
  git checkout dev
  git push -u origin dev
)

git checkout main
echo Ветки main и dev готовы, tracking настроен.
exit /b 0
