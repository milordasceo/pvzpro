# Скрипт замены хардкод цветов на tokens в ProcessTab.tsx

$file = "src/employee/tabs/ProcessTab.tsx"
$content = Get-Content $file -Raw

# Карта замены цветов
$replacements = @{
    # Text colors
    "'#111827'" = "tokens.colors.text.primary"
    "'#6B7280'" = "tokens.colors.text.secondary"
    "'#9CA3AF'" = "tokens.colors.text.muted"
    "'#374151'" = "tokens.colors.gray[700]"
    
    # Gray colors
    "'#F9FAFB'" = "tokens.colors.gray[50]"
    "'#F3F4F6'" = "tokens.colors.gray[100]"
    "'#E5E7EB'" = "tokens.colors.border"
    "'#D1D5DB'" = "tokens.colors.gray[300]"
    "'#FFFFFF'" = "tokens.colors.surface"
    
    # Primary colors
    "'#4F46E5'" = "tokens.colors.primary.main"
    
    # Success colors
    "'#10B981'" = "tokens.colors.success.main"
    "'#059669'" = "tokens.colors.success.dark"
    "'#065F46'" = "tokens.colors.success.darker"
    "'#DCFCE7'" = "tokens.colors.success.light"
    "'#D1FAE5'" = "tokens.colors.success.lighter"
    
    # Warning colors
    "'#F59E0B'" = "tokens.colors.warning.main"
    "'#92400E'" = "tokens.colors.warning.dark"
    "'#FEF3C7'" = "tokens.colors.warning.light"
    "'#FDE68A'" = "tokens.colors.warning.lighter"
    
    # Error colors
    "'#DC2626'" = "tokens.colors.error.main"
    "'#EF4444'" = "tokens.colors.error.main"
    "'#991B1B'" = "tokens.colors.error.dark"
    "'#7F1D1D'" = "tokens.colors.error.darker"
    "'#FEE2E2'" = "tokens.colors.error.light"
    
    # Info/Blue colors
    "'#DBEAFE'" = "tokens.colors.primary.light"
    "'#1E40AF'" = "tokens.colors.primary.dark"
    "'#3B82F6'" = "tokens.colors.info.main"
    "'#1E3A8A'" = "tokens.colors.primary.darker"
}

# Замены в обратных кавычках
foreach ($old in $replacements.Keys) {
    $new = $replacements[$old]
    $oldBacktick = $old -replace "'", '"'
    $content = $content -replace [regex]::Escape($old), $new
    $content = $content -replace [regex]::Escape($oldBacktick), $new
}

# Сохранить файл
$content | Set-Content $file -NoNewline

Write-Host "✅ Замена цветов завершена в $file"
Write-Host "📊 Проверьте файл и запустите: npm run typecheck"

