# 🧹 План очистки проекта

**Дата:** 20 октября 2025  
**Цель:** Удалить устаревшие и ненужные файлы

---

## 🗑️ Файлы для удаления

### 📁 **Корневая директория**

#### Устаревшие файлы:
- ❌ `et --hard HEAD` - мусор от git команды
- ❌ `tash` - мусор от git команды
- ❌ `tatus --short` - мусор от git команды
- ❌ `git-status.html` - временный файл
- ❌ `test-qr-simple.html` - тестовый файл
- ❌ `test-qr.html` - тестовый файл
- ❌ `pvzqr_web.zip` - архив
- ❌ `wb_app_restore_2025-09-26T18-40-43.tar.gz` - старый бэкап

#### Устаревшие документы:
- ❌ `CLEANUP_SUMMARY.md` - устарел
- ❌ `STABLE_VERSION_REPORT.md` - устарел
- ❌ `STABLE_VERSIONS.md` - устарел
- ❌ `READY_TO_DEVELOP.md` - устарел
- ❌ `START_NEXT_SESSION.md` - устарел

---

### 📁 **docs/** - Много дубликатов миграций

#### Устаревшие документы по миграции цветов:
- ❌ `COLOR_MIGRATION_PROGRESS.md` - заменён на COMPONENTS_MIGRATION_COMPLETE.md
- ❌ `MIGRATION_PLAN.md` - устарел
- ❌ `MIGRATION_100_PERCENT_COMPLETE.md` - дубликат
- ❌ `MIGRATION_COMPLETE_REPORT.md` - дубликат
- ❌ `MIGRATION_FINAL_STATUS.md` - дубликат

#### Устаревшие summaries:
- ❌ `SESSION_SUMMARY_2025-10-20_color_migration.md` - заменён на final
- ❌ `SESSION_SUMMARY_2025-10-20_color_migration_final.md` - заменён на final
- ❌ `SESSION_SUMMARY_2025-10-20_components_migration.md` - заменён на final
- ❌ `SESSION_SUMMARY_2025-10-20_ui_system.md` - заменён на final

#### Устаревшие/дублирующие:
- ❌ `COMPONENTS_MIGRATION.md` - дубликат с COMPONENTS_MIGRATION_COMPLETE.md
- ❌ `UI_SYSTEM_PLAN.md` - устарел (есть COMPONENTS_STRATEGY.md)
- ❌ `COLOR_OPTIMIZATION_REPORT.md` - устарел
- ❌ `DOCS_CLEANUP_REPORT.md` - устарел
- ❌ `NEXT_SESSION.md` - заменён на NEXT_STEPS.md

#### Возможно объединить:
- ⚠️ `COLOR_AUDIT.md` + `COLOR_MAP.md` + `COLOR_PALETTE.md` → один файл?
- ⚠️ `DESIGN_SYSTEM.md` vs `UI_GUIDELINES.md` - похожи

---

### 📁 **scripts/** - Устаревшие скрипты миграции

- ❌ `find-hardcoded-colors.sh` - миграция завершена
- ❌ `migrate-colors.sh` - миграция завершена
- ❌ `replace-colors-processtab.ps1` - миграция завершена
- ❌ `start-without-tunnel.bat` - удалён из git status

#### Оставить:
- ✅ `generate-qr.mjs` - может пригодиться
- ✅ `scrcpy_start.bat` - полезный
- ✅ `START.bat` - используется

---

## ✅ Что оставить

### Корень:
- ✅ `README.md` - главный README
- ✅ `START_GUIDE.md` - руководство по запуску
- ✅ `START.bat` - скрипт запуска
- ✅ `ЗАПУСК.txt` - инструкция на русском
- ✅ `РЕШЕНИЕ_ПРОБЛЕМЫ.md` - troubleshooting

### docs/:
- ✅ `README.md` - оглавление документации
- ✅ `PROJECT.md` - описание проекта
- ✅ `CURSOR_CONTEXT.md` - контекст для AI

#### По компонентам (актуальные):
- ✅ `COMPONENTS_STRATEGY.md` - **главная стратегия**
- ✅ `COMPONENTS_AUDIT.md` - аудит
- ✅ `COMPONENTS_MIGRATION_COMPLETE.md` - отчёт о миграции
- ✅ `UI_COMPONENTS.md` - каталог
- ✅ `UI_GUIDELINES.md` - правила
- ✅ `UI_TOKENS.md` - токены

#### По цветам (минимум):
- ✅ `COLOR_PALETTE.md` - палитра (если актуальна)
- ✅ `DESIGN_SYSTEM.md` - дизайн-система

#### Планирование:
- ✅ `NEXT_STEPS.md` - **главный roadmap**
- ✅ `TASKS.md` - текущие задачи
- ✅ `SESSION_RULES.md` - правила работы

#### История:
- ✅ `SESSION_SUMMARY_2025-10-20_final.md` - **финальный summary**
- ✅ `archive/` - архив старых документов

#### Админка:
- ✅ `ADMIN_FUNCTIONALITY.md` - функционал админки

#### Тесты:
- ✅ `test-specs/` - спецификации тестов

#### Оптимизация:
- ✅ `OPTIMIZATION.md` - если актуален
- ✅ `DEV_TOOLS.md` - dev инструменты

---

## 📊 Итого

| Категория | Удалить | Оставить |
|-----------|---------|----------|
| **Корень** | 13 | 5 |
| **docs/** | 14 | 17 |
| **scripts/** | 4 | 2 |
| **ИТОГО** | **31** | **24** |

---

## 🎯 Структура после очистки

```
wb_app/
  ├── README.md
  ├── START_GUIDE.md
  ├── START.bat
  ├── ЗАПУСК.txt
  ├── РЕШЕНИЕ_ПРОБЛЕМЫ.md
  │
  ├── docs/
  │   ├── README.md
  │   ├── PROJECT.md
  │   ├── CURSOR_CONTEXT.md
  │   │
  │   ├── # Компоненты
  │   ├── COMPONENTS_STRATEGY.md         ← главный
  │   ├── COMPONENTS_AUDIT.md
  │   ├── COMPONENTS_MIGRATION_COMPLETE.md
  │   ├── UI_COMPONENTS.md
  │   ├── UI_GUIDELINES.md
  │   ├── UI_TOKENS.md
  │   │
  │   ├── # Дизайн
  │   ├── DESIGN_SYSTEM.md
  │   ├── COLOR_PALETTE.md
  │   │
  │   ├── # Планирование
  │   ├── NEXT_STEPS.md                  ← главный roadmap
  │   ├── TASKS.md
  │   ├── SESSION_RULES.md
  │   │
  │   ├── # История
  │   ├── SESSION_SUMMARY_2025-10-20_final.md
  │   ├── archive/
  │   │
  │   ├── # Админка
  │   ├── ADMIN_FUNCTIONALITY.md
  │   │
  │   ├── # Тесты
  │   ├── test-specs/
  │   │
  │   └── # Dev
  │       ├── OPTIMIZATION.md
  │       └── DEV_TOOLS.md
  │
  └── scripts/
      ├── generate-qr.mjs
      └── scrcpy_start.bat
```

---

## ✅ Следующий шаг

Выполнить удаление файлов?

