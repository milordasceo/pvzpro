#!/bin/bash
# Поиск хардкод цветов в проекте

echo ""
echo "🔍 Поиск хардкод hex цветов в проекте..."
echo "=========================================="
echo ""

# Общее количество
TOTAL=$(grep -r "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" --include="*.ts" \
  --exclude-dir="node_modules" \
  -h | grep -v "tokens.colors" | grep -v "@deprecated" | wc -l)

echo "📊 Всего найдено: $TOTAL хардкод цветов"
echo ""

# Топ файлов
echo "🔝 Топ-10 файлов с хардкодом:"
echo "─────────────────────────────"
grep -r "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" --include="*.ts" \
  --exclude-dir="node_modules" \
  -n | grep -v "tokens.colors" | grep -v "@deprecated" | \
  cut -d: -f1 | sort | uniq -c | sort -rn | head -10 | \
  awk '{printf "%3d   %s\n", $1, $2}'

echo ""

# Уникальные цвета
echo "🎨 Уникальные hex цвета (топ-20):"
echo "──────────────────────────────"
grep -r "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" --include="*.ts" \
  --exclude-dir="node_modules" \
  -oh | grep -v "tokens.colors" | tr '[:lower:]' '[:upper:]' | \
  sort | uniq -c | sort -rn | head -20 | \
  awk '{printf "%3d   %s\n", $1, $2}'

echo ""
echo "✅ Готово! Начинайте миграцию с файлов из топа."
echo ""

