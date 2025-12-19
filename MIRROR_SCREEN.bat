@echo off
cd /d "%~dp0"

echo [INFO] Очистка портов и подготовка окружения...

:: 1. Убиваем процесс на порту 8081 (и 8084 на всякий случай)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8081" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8084" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

:: 2. Запускаем scrcpy в отдельном окне
echo [INFO] Запуск трансляции экрана...
start "Android Mirror" cmd /c "if exist scrcpy\scrcpy.exe (scrcpy\scrcpy.exe --max-size 1024 --video-bit-rate 4M --stay-awake --window-x 0 --window-y 0) else (echo [ERROR] scrcpy not found & pause)"

timeout /t 2 >nul

:: 3. Запускаем Expo (Только Android + Server)
:: Убрали --web, чтобы не открывался Chrome. 
:: Веб-версию можно открыть вручную в IDE через Open Preview (http://localhost:8081)
echo [INFO] Запуск сервера Expo (Port 8081)...
npx expo start --android --port 8081
