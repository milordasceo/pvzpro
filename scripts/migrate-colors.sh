#!/bin/bash
# Автоматическая миграция хардкод цветов на tokens

FILE=$1

if [ -z "$FILE" ]; then
  echo "❌ Usage: ./scripts/migrate-colors.sh <file>"
  echo "Example: ./scripts/migrate-colors.sh src/employee/ScheduleScreen.tsx"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "❌ Файл не найден: $FILE"
  exit 1
fi

echo ""
echo "🔄 Миграция цветов в: $FILE"
echo "=========================================="
echo ""

# Backup
BACKUP="$FILE.backup"
cp "$FILE" "$BACKUP"
echo "✅ Backup создан: $BACKUP"

# Подсчёт до миграции
BEFORE=$(grep -o "#[0-9A-Fa-f]\{6\}" "$FILE" | wc -l)
echo "📊 Найдено хардкод цветов: $BEFORE"
echo ""

# Проверка наличия import tokens
if ! grep -q "import.*tokens.*from.*ui" "$FILE"; then
  echo "⚠️  Добавьте import вручную:"
  echo "   import { tokens } from '../ui';"
  echo ""
fi

echo "🔧 Выполняю замены..."
echo ""

# Основные замены (ВАЖНО: используем одинарные кавычки для sed!)
sed -i "s/'#4F46E5'/tokens.colors.primary.main/g" "$FILE"
sed -i "s/'#111827'/tokens.colors.text.primary/g" "$FILE"
sed -i "s/'#6B7280'/tokens.colors.text.secondary/g" "$FILE"
sed -i "s/'#F9FAFB'/tokens.colors.gray[50]/g" "$FILE"
sed -i "s/'#F3F4F6'/tokens.colors.gray[100]/g" "$FILE"
sed -i "s/'#E5E7EB'/tokens.colors.border/g" "$FILE"
sed -i "s/'#FFFFFF'/tokens.colors.surface/g" "$FILE"
sed -i "s/'#10B981'/tokens.colors.success.main/g" "$FILE"
sed -i "s/'#F59E0B'/tokens.colors.warning.main/g" "$FILE"
sed -i "s/'#DC2626'/tokens.colors.error.main/g" "$FILE"
sed -i "s/'#9CA3AF'/tokens.colors.text.muted/g" "$FILE"
sed -i "s/'#D1D5DB'/tokens.colors.gray[300]/g" "$FILE"
sed -i "s/'#D1FAE5'/tokens.colors.success.light/g" "$FILE"
sed -i "s/'#FEE2E2'/tokens.colors.error.light/g" "$FILE"
sed -i "s/'#FEF3C7'/tokens.colors.warning.light/g" "$FILE"

# Подсчёт после миграции
AFTER=$(grep -o "#[0-9A-Fa-f]\{6\}" "$FILE" | wc -l)
MIGRATED=$((BEFORE - AFTER))

echo ""
echo "📊 Результаты:"
echo "   Было: $BEFORE"
echo "   Осталось: $AFTER"
echo "   Мигрировано: $MIGRATED"
echo ""

if [ $AFTER -gt 0 ]; then
  echo "⚠️  Остались хардкод цвета (требуют ручной проверки):"
  grep -n "#[0-9A-Fa-f]\{6\}" "$FILE" | head -5
  echo ""
fi

echo "✅ Миграция завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "   1. Проверьте изменения: git diff $FILE"
echo "   2. Добавьте import tokens если нужно"
echo "   3. Запустите: npm run typecheck"
echo "   4. Визуально проверьте UI"
echo "   5. Удалите backup: rm $BACKUP"
echo ""

