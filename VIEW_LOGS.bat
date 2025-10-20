@echo off
title Android Logs - WB Biz App
cls

echo ================================================
echo       Android Device Logs (logcat)
echo ================================================
echo.
echo Showing full error stack traces and logs...
echo Press Ctrl+C to stop
echo.
echo ================================================
echo.

REM Show logs with full stack traces
adb logcat -v time ReactNative:V ReactNativeJS:V *:S

pause

