@echo off
setlocal enabledelayedexpansion
cls

title WB Biz App - Debug Mode

echo ================================================
echo       WB Biz App - Debug Mode
echo       With Component Stack Traces
echo ================================================
echo.

REM ============================================
REM Check ADB
REM ============================================
where adb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ADB not found!
    pause
    exit /b 1
)

REM ============================================
REM Clean ports
REM ============================================
echo [1/6] Cleaning ports...

netstat -ano | findstr :8081 | findstr LISTENING >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>nul
    )
)

netstat -ano | findstr :8097 | findstr LISTENING >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8097 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>nul
    )
)

adb shell am force-stop host.exp.exponent >nul 2>nul
echo [OK] Ports cleaned
echo.

REM ============================================
REM Start scrcpy
REM ============================================
echo [2/6] Starting scrcpy...

set SCRCPY_PATH=C:\Users\%USERNAME%\AppData\Local\Microsoft\WinGet\Packages\Genymobile.scrcpy_Microsoft.Winget.Source_8wekyb3d8bbwe\scrcpy-win64-v3.3\scrcpy.exe

if not exist "%SCRCPY_PATH%" (
    where scrcpy >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        set SCRCPY_DISABLED=1
    ) else (
        set SCRCPY_PATH=scrcpy
    )
)

if not defined SCRCPY_DISABLED (
    start "scrcpy - WB Biz App" "%SCRCPY_PATH%" ^
        --window-title "WB Biz App" ^
        --stay-awake ^
        --window-x 0 ^
        --window-y 0
    timeout /t 2 /nobreak >nul
    echo [OK] scrcpy started
) else (
    echo [SKIPPED] scrcpy not available
)
echo.

REM ============================================
REM Setup ADB
REM ============================================
echo [3/6] Starting ADB...
adb start-server >nul 2>nul
timeout /t 1 /nobreak >nul
adb devices
echo.

echo [4/6] Port forwarding...
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8097 tcp:8097
echo.

REM ============================================
REM Clear cache and start Metro
REM ============================================
echo [5/6] Starting Metro with verbose logging...
echo.
echo Metro will show DETAILED ERROR INFORMATION below:
echo ================================================
echo.

REM Start Metro in foreground with verbose logging
npx expo start --localhost --clear

pause

