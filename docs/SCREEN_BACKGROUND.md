# 🎨 Централизованный фон экранов

## Проблема
В разных частях приложения использовались разные цвета фона:
- `tokens.colors.gray[50]` - #F9FAFB
- `tokens.colors.gray[200]` - #E5E7EB  
- `tokens.colors.background` - #FBFCFE
- Хардкод `#FFF`

Это создавало визуальную несогласованность.

## Решение

Добавлен **единый токен** для фона всех экранов:

```typescript
// src/ui/theme/colors.ts
export const colors = {
  // ...
  screenBackground: '#F9FAFB', // Единый фон для ВСЕХ экранов
  // ...
}
```

## Использование

### ✅ Правильно
```tsx
<View style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}>
  {/* Контент экрана */}
</View>
```

### ❌ Неправильно
```tsx
// Не используйте напрямую:
backgroundColor: tokens.colors.gray[50]
backgroundColor: '#F9FAFB'
backgroundColor: tokens.colors.background
```

## Где применяется

1. **Основной контейнер экрана** (flex: 1):
   - `EmployeesScreen.tsx`
   - `OnShiftTab.tsx`
   - `ChatScreen.tsx`
   - `AuthNavigator.tsx`
   - И т.д.

2. **Поля ввода на сером фоне**:
   - `SearchInput` в `EmployeesScreen`

3. **Карточки на сером фоне**:
   - Employee cards в списках
   - Shift cards в табах

## Преимущества

✅ **Единообразие** - один цвет фона везде  
✅ **Централизация** - легко изменить глобально  
✅ **Читаемость** - `screenBackground` понятнее, чем `gray[50]`  
✅ **Масштабируемость** - легко добавить темную тему

## Цветовая схема

```
┌─────────────────────────────────────┐
│ screenBackground (#F9FAFB)          │ ← Фон экрана
│  ┌───────────────────────────────┐  │
│  │ surface (#FFFFFF)             │  │ ← Белые карточки
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Миграция

Все экраны были обновлены:
- [x] `EmployeesScreen.tsx`
- [x] `OnShiftTab.tsx`
- [x] `ChatScreen.tsx`
- [x] `AuthNavigator.tsx`

**Статус:** ✅ Завершено (2025-10-21)

