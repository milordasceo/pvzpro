@echo off
cd /d "%~dp0"

echo [INFO] Проверка порта 8081...

:: Проверяем и убиваем процесс на порту 8081, если занят
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8081" ^| find "LISTENING"') do (
    echo [INFO] Порт 8081 занят. Освобождаем...
    taskkill /f /pid %%a >nul 2>&1
)

:: Запускаем scrcpy
echo [INFO] Запуск scrcpy...
if exist scrcpy\scrcpy.exe (
    scrcpy\scrcpy.exe --max-size 1024 --video-bit-rate 4M --stay-awake --window-x 0 --window-y 0
) else (
    echo [ERROR] scrcpy.exe не найден в папке scrcpy\
    pause
)
