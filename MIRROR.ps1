# Проверяем наличие scrcpy в системе
Write-Host "Searching for scrcpy..." -ForegroundColor Cyan

$possiblePaths = @(
    "scrcpy.exe",
    "$env:ProgramData\chocolatey\bin\scrcpy.exe",
    "$env:USERPROFILE\scoop\shims\scrcpy.exe",
    "C:\scrcpy\scrcpy.exe",
    "$env:USERPROFILE\scrcpy\scrcpy.exe"
)

$scrcpyPath = $null

foreach ($path in $possiblePaths) {
    if (Get-Command $path -ErrorAction SilentlyContinue) {
        $scrcpyPath = $path
        break
    }
    if (Test-Path $path) {
        $scrcpyPath = $path
        break
    }
}

if ($scrcpyPath) {
    Write-Host "Found scrcpy at: $scrcpyPath" -ForegroundColor Green
    Write-Host "Starting mirror (Bitrate: 4M, Max-Size: 1024)..." -ForegroundColor Green
    
    # Запускаем scrcpy
    & $scrcpyPath --max-size 1024 --bit-rate 4M --stay-awake
} else {
    Write-Host "ERROR: scrcpy not found!" -ForegroundColor Red
    Write-Host "Please ensure scrcpy is installed and added to PATH."
    Write-Host "Download: https://github.com/Genymobile/scrcpy/releases"
    
    $userInput = Read-Host "If you have scrcpy installed, paste the full path to scrcpy.exe here (or press Enter to exit)"
    if ($userInput -and (Test-Path $userInput)) {
        & $userInput --max-size 1024 --bit-rate 4M --stay-awake
    }
}

Pause
