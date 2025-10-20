@echo off
setlocal enabledelayedexpansion
cls

title WB Biz App Launcher

echo ================================================
echo       WB Biz App - Full Start
echo       Metro + App + scrcpy
echo ================================================
echo.

REM ============================================
REM Check ADB
REM ============================================
where adb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ADB not found!
    echo.
    echo Please add Android SDK platform-tools to PATH
    echo Location: C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools
    echo.
    pause
    exit /b 1
)

REM ============================================
REM Clean ports (only port processes, not all Node!)
REM ============================================
echo [1/6] Cleaning ports...

REM Kill port 8081 if occupied
netstat -ano | findstr :8081 | findstr LISTENING >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>nul
    )
)

REM Kill port 8097 if occupied
netstat -ano | findstr :8097 | findstr LISTENING >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8097 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>nul
    )
)

REM Stop old Expo app
adb shell am force-stop host.exp.exponent >nul 2>nul

echo [OK] Ports cleaned
echo.

REM ============================================
REM Start scrcpy
REM ============================================
echo [2/6] Starting scrcpy (screen mirroring)...

set SCRCPY_PATH=C:\Users\%USERNAME%\AppData\Local\Microsoft\WinGet\Packages\Genymobile.scrcpy_Microsoft.Winget.Source_8wekyb3d8bbwe\scrcpy-win64-v3.3\scrcpy.exe

if not exist "%SCRCPY_PATH%" (
    where scrcpy >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] scrcpy not found - install: winget install scrcpy
        echo Continuing without screen mirroring...
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
echo [3/6] Starting ADB and checking devices...
adb start-server >nul 2>nul
timeout /t 1 /nobreak >nul
adb devices
echo.

echo [4/6] Setting up port forwarding...
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8097 tcp:8097
if %ERRORLEVEL% EQU 0 (
    echo [OK] Port forwarding configured
) else (
    echo [WARNING] Port forwarding failed - check USB debugging
)
echo.

REM ============================================
REM Start Metro
REM ============================================
echo [5/6] Starting Metro Bundler...
start /B npx expo start --localhost

echo Waiting for Metro to initialize...
timeout /t 7 /nobreak >nul
echo.

REM ============================================
REM Open App
REM ============================================
echo [6/6] Opening app on Android device...
adb shell am start -a android.intent.action.VIEW -d "exp://localhost:8081"
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo All Started Successfully!
echo ================================================
echo.
echo - scrcpy: Screen mirroring active
echo - Metro: Running on localhost:8081
echo - App: Opening on device
echo.
echo Press 'r' in Metro to reload
echo Press Ctrl+C to stop
echo.
echo Metro logs:
echo ------------------------------------------------
echo.

REM Keep console open for Metro logs
:wait_loop
timeout /t 300 /nobreak >nul
goto wait_loop
