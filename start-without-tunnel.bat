@echo off
echo ================================
echo Starting Expo without tunnel
echo ================================
echo.

REM Check if ADB is available
where adb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: ADB not found!
    echo.
    echo Please install Android Studio or add platform-tools to PATH
    echo Download: https://developer.android.com/studio/releases/platform-tools
    echo.
    pause
    exit /b 1
)

echo Checking ADB devices...
adb devices
echo.

echo Setting up port forwarding...
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8097 tcp:8097
echo.

echo Starting Metro Bundler...
call npm start

pause

