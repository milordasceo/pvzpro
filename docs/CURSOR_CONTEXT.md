# 🎯 Контекст проекта для AI

> Краткая сводка для быстрого старта  
> Обновлено: 2025-10-30

---

## Проект

**WB ПВЗ** — мобильное приложение для управления персоналом пунктов выдачи Wildberries

**Платформа:** React Native (Expo SDK 54) + React Native Paper 5  
**Статус:** Employee MVP готов (100%), Admin MVP в разработке (30% - ПВЗ и Dashboard готовы)

---

## 🚀 Запуск

### Самый быстрый способ (USB + ADB):
```bash
START.bat  # Открывается за 5-7 секунд
```

### Альтернативы:
```bash
npm start              # Обычный
npm run dev            # С очисткой кэша
npm run typecheck      # Проверка типов
```

---

## 📊 Текущий статус (2025-10-30)

### ✅ Готово
- Employee MVP: Смены, Задачи, График, Финансы, Чат (100%)
- UI Система: Design Tokens (20 цветов), SearchInput, StatusBadge, States
- Admin MVP: ПВЗ (список + детали), Dashboard, Сотрудники (список + детали)
- Оптимизация: React.memo, useMemo, useCallback, expo-image, Code Splitting
- Документация: 10+ docs, UI Catalog Screen, DevUICatalogFAB

### 🔜 Следующие шаги (выбери один)
1. **Миграция хардкод цветов** (~509 вхождений) — РЕКОМЕНДУЕТСЯ
2. **Admin: Финансы** (зарплаты, премии, штрафы)
3. **Admin: График** (календарь, назначение смен)

---

## 📁 Структура проекта

```
src/
├── employee/         # ✅ Сотрудник (готов)
├── admin/            # 🔜 Администратор (40%)
│   ├── screens/      # Dashboard, ПВЗ, Сотрудники
│   ├── components/   # PvzCard, EmployeeCard
│   ├── services/     # mockData.ts
│   └── store/        # pvz.store.ts
├── ui/               # ✅ UI Система (новая!)
│   ├── theme/        # colors, spacing, typography
│   ├── components/   # SearchInput, StatusBadge, States
│   └── index.ts      # tokens export
├── components/       # Общие (StyledButton, StyledCard...)
├── services/         # API, QR, Geo, Notifications
├── store/            # Zustand stores (auth, shift)
└── navigation/       # Навигаторы по ролям
```

---

## 🎨 UI Система (создана 20.10)

### Design Tokens
- **Цвета:** 20 (было 60+, оптимизировано -67%)
- **Spacing:** 8 уровней (xs → xxxl)
- **Typography:** 12 вариантов
- **Radius:** 7 уровней

### Компоненты
```typescript
import { tokens, SearchInput, StatusBadge, EmptyState } from '../ui';

// Цвета
tokens.colors.primary.main
tokens.colors.success.light
tokens.colors.text.secondary

// Spacing
tokens.spacing.md
tokens.radius.lg
```

### UI Catalog
- **Доступ:** Тройной тап на FAB (палитра в углу) или Админ → UI
- **Содержит:** Все цвета, spacing, typography, компоненты с примерами

---

## 🔧 Технологии

| Технология | Версия | Назначение |
|-----------|--------|------------|
| React Native | 0.81.4 | Framework |
| Expo | SDK 54 | Platform |
| React | 19.1 | UI Library |
| Paper | 5 | Material Design 3 |
| Navigation | 7.x | Навигация |
| Zustand | 5 | State Management |
| TypeScript | Strict | Типизация |

---

## 📋 Правила разработки

### 1. Компоненты
```typescript
// ✅ ВСЕГДА
export const MyComponent = React.memo(({ prop }) => {
  const value = useMemo(() => compute(), [deps]);
  const handler = useCallback(() => {}, [deps]);
  return <View>...</View>;
});
```

### 2. UI Tokens
```typescript
// ✅ Используй tokens
backgroundColor: tokens.colors.surface,
padding: tokens.spacing.md,

// ❌ НЕ хардкодь
backgroundColor: '#FFFFFF',  // ❌
padding: 16,                  // ❌
```

### 3. Изображения
```typescript
// ✅ expo-image + quality 0.3
import { Image } from 'expo-image';

<Image
  source={{ uri }}
  contentFit="cover"
  transition={200}
/>
```

### 4. Анимации
```typescript
// ✅ useNativeDriver: true
Animated.timing(value, {
  toValue: 1,
  useNativeDriver: true,
}).start();
```

---

## 📚 Документация

### Главные документы
- [README.md](README.md) — точка входа
- [PROJECT.md](PROJECT.md) — полное описание
- [ADMIN_FUNCTIONALITY.md](ADMIN_FUNCTIONALITY.md) — план Admin MVP
- [NEXT_SESSION.md](NEXT_SESSION.md) — следующая сессия

### UI Система
- [UI_GUIDELINES.md](UI_GUIDELINES.md) — правила
- [UI_TOKENS.md](UI_TOKENS.md) — токены
- [UI_COMPONENTS.md](UI_COMPONENTS.md) — каталог
- [COLOR_PALETTE.md](COLOR_PALETTE.md) — палитра

### Остальное
- [OPTIMIZATION.md](OPTIMIZATION.md) — оптимизация
- [MIGRATION_PLAN.md](MIGRATION_PLAN.md) — миграция цветов
- [DEV_TOOLS.md](DEV_TOOLS.md) — инструменты

---

## 🎯 Приоритеты

### ⚡ Срочно (блокирует разработку)
**Миграция хардкод цветов:** ~509 вхождений

**Почему важно:**
- Блокирует унификацию UI
- Невозможно централизованно менять палитру
- Нет типизации цветов

**План:**
1. `ScheduleScreen.tsx` — 100+ хардкодов 🔴
2. `Dashboard/` — 120+ хардкодов 🔴
3. Остальные файлы — 289 хардкодов 🟡

**Инструменты готовы:**
- `scripts/find-hardcoded-colors.sh`
- `scripts/migrate-colors.sh`
- `MIGRATION_PLAN.md` — детальный план

### 🏗️ Разработка
**Admin MVP** — продолжить с Финансов или График

---

## ✅ Чеклист быстрого старта

- [ ] Читай docs/README.md
- [ ] Запускай START.bat
- [ ] Выбери задачу (миграция OR admin)
- [ ] Следуй OPTIMIZATION.md
- [ ] Используй UI tokens

---

**Последнее обновление:** 2025-10-30  
**Версия:** 6.0  
**Статус:** ✅ Готов к разработке модуля "Сотрудники"
