@echo off
cls
echo ================================
echo Starting Expo with ADB
echo ================================
echo.

REM Check if ADB is available
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

REM Get local IP address
echo [1/5] Getting local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :got_ip
)
:got_ip
set IP=%IP:~1%
echo [OK] Local IP: %IP%
echo.

echo [2/5] Checking ADB devices...
adb devices
echo.

echo [3/5] Setting up port forwarding...
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8097 tcp:8097
if %ERRORLEVEL% EQU 0 (
    echo [OK] Port forwarding configured
) else (
    echo [WARNING] Port forwarding failed - make sure USB debugging is enabled
)
echo.

echo [4/5] Preparing environment...
taskkill /F /IM node.exe >nul 2>nul
adb shell am force-stop host.exp.exponent
echo [OK] Ready
echo.

echo [5/5] Starting Metro and launching app...
echo.
echo ================================
echo App will open on device!
echo ================================
echo.

REM Start Metro
start /B npm run dev

echo.
echo ================================
echo Metro is starting...
echo App will open automatically!
echo ================================
echo.

echo.
echo ================================
echo Press any key to stop Metro...
echo ================================
pause >nul

REM Clean exit
echo.
echo Stopping Metro...
taskkill /F /IM node.exe >nul 2>nul
echo Goodbye!
