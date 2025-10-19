# PowerShell script to fix Windows Firewall for React Native development
# Run as Administrator: Right-click → "Run with PowerShell"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "React Native Firewall Fix" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click on this file and select 'Run with PowerShell as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Find Node.js path
Write-Host "Finding Node.js installation..." -ForegroundColor Yellow
try {
    $nodePath = (Get-Command node -ErrorAction Stop).Source
    Write-Host "✓ Found Node.js at: $nodePath" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js first: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if rule already exists
Write-Host "Checking existing firewall rules..." -ForegroundColor Yellow
$existingRule = Get-NetFirewallRule -DisplayName "Node.js Development" -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "⚠ Rule 'Node.js Development' already exists" -ForegroundColor Yellow
    $remove = Read-Host "Remove and recreate? (y/n)"
    if ($remove -eq 'y' -or $remove -eq 'Y') {
        Remove-NetFirewallRule -DisplayName "Node.js Development"
        Write-Host "✓ Old rule removed" -ForegroundColor Green
    } else {
        Write-Host "Keeping existing rule" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 0
    }
}

Write-Host ""

# Create firewall rule
Write-Host "Creating firewall rule..." -ForegroundColor Yellow
try {
    New-NetFirewallRule `
        -DisplayName "Node.js Development" `
        -Direction Inbound `
        -Program $nodePath `
        -Action Allow `
        -Profile Private,Domain `
        -Description "Allow Node.js for React Native / Expo development" `
        -ErrorAction Stop | Out-Null
    
    Write-Host "✓ Firewall rule created successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to create firewall rule!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Verify rule
Write-Host "Verifying rule..." -ForegroundColor Yellow
$rule = Get-NetFirewallRule -DisplayName "Node.js Development"
if ($rule) {
    Write-Host "✓ Rule verified:" -ForegroundColor Green
    Write-Host "  Name: $($rule.DisplayName)" -ForegroundColor Gray
    Write-Host "  Status: $($rule.Enabled)" -ForegroundColor Gray
    Write-Host "  Action: $($rule.Action)" -ForegroundColor Gray
} else {
    Write-Host "⚠ Warning: Could not verify rule" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "SUCCESS! Setup complete" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Close Metro bundler if it's running (Ctrl+C)" -ForegroundColor White
Write-Host "2. Run: npm run start:local" -ForegroundColor White
Write-Host "3. Scan QR code on your phone" -ForegroundColor White
Write-Host ""
Write-Host "If it still doesn't work, check:" -ForegroundColor Yellow
Write-Host "- Both devices are on the same Wi-Fi network" -ForegroundColor White
Write-Host "- Antivirus settings (add node.exe to exceptions)" -ForegroundColor White
Write-Host "- Read FIX_TUNNEL_ISSUE.md for more solutions" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"

