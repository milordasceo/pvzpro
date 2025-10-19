# 🎨 UI Design Tokens

**Дата создания:** 20 октября 2025  
**Статус:** ✅ Готово

---

## 📚 Что такое Design Tokens?

Design Tokens - это единая система значений для дизайна (цвета, отступы, размеры шрифтов и т.д.), которая обеспечивает консистентность UI во всём приложении.

---

## 📁 Структура

```
src/ui/theme/
├── colors.ts       # Палитра цветов
├── spacing.ts      # Отступы, радиусы, elevation
├── typography.ts   # Размеры шрифтов, весы, варианты
├── tokens.ts       # Объединение всех tokens
└── index.ts        # Экспорт
```

---

## 🎨 Использование

### Импорт

```tsx
// Вариант 1: Импорт всех tokens
import { tokens } from '../ui';

// Вариант 2: Импорт конкретных частей
import { colors, spacing, radius } from '../ui/theme';

// Вариант 3: Через theme.ts (для совместимости)
import { uiTokens } from '../theme';
```

### Примеры использования

```tsx
import { StyleSheet } from 'react-native';
import { tokens } from '../ui';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.background,
  },
  
  card: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    backgroundColor: tokens.colors.surface,
    gap: tokens.spacing.sm,
  },
  
  title: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.text.primary,
  },
  
  subtitle: {
    fontSize: tokens.fontSize.sm,
    color: tokens.colors.text.secondary,
  },
});
```

---

## 🎨 Цвета (colors)

### Primary (Основной цвет)

```tsx
tokens.colors.primary.main     // '#4F46E5' - основной
tokens.colors.primary[50]      // '#F5F3FF' - самый светлый
tokens.colors.primary[900]     // '#4C1D95' - самый тёмный
```

### Gray (Нейтральные)

```tsx
tokens.colors.gray[50]         // '#F9FAFB' - почти белый
tokens.colors.gray[500]        // '#6B7280' - средний серый
tokens.colors.gray[900]        // '#111827' - почти чёрный
```

### Status (Статусные цвета)

```tsx
tokens.colors.success.main     // '#10B981' - зелёный
tokens.colors.warning.main     // '#F59E0B' - жёлтый
tokens.colors.error.main       // '#DC2626' - красный
tokens.colors.info.main        // '#0891B2' - синий
```

### Semantic (Семантические)

```tsx
tokens.colors.background       // '#FBFCFE' - фон приложения
tokens.colors.surface          // '#FFFFFF' - фон карточек
tokens.colors.border           // '#E5E7EB' - границы
tokens.colors.divider          // '#F3F4F6' - разделители
```

### Text (Текст)

```tsx
tokens.colors.text.primary     // '#111827' - основной текст
tokens.colors.text.secondary   // '#6B7280' - второстепенный текст
tokens.colors.text.muted       // '#9CA3AF' - приглушённый текст
tokens.colors.text.disabled    // '#D1D5DB' - отключённый текст
tokens.colors.text.white       // '#FFFFFF' - белый текст
```

### Badge (Бейджи)

```tsx
tokens.colors.badge.success    // Зелёный
tokens.colors.badge.warning    // Жёлтый
tokens.colors.badge.error      // Красный
tokens.colors.badge.info       // Синий
tokens.colors.badge.neutral    // Серый
```

---

## 📏 Отступы (spacing)

### Базовые отступы

```tsx
tokens.spacing.xs              // 4
tokens.spacing.sm              // 8
tokens.spacing.md              // 12
tokens.spacing.lg              // 16
tokens.spacing.xl              // 24
tokens.spacing.xxl             // 32
tokens.spacing.xxxl            // 48
```

### Специальные отступы

```tsx
tokens.spacing.screenPadding   // 16 - горизонтальный padding экрана
tokens.spacing.cardGap         // 12 - между карточками
tokens.spacing.sectionGap      // 16 - между секциями
tokens.spacing.elementGap      // 8  - между элементами
```

### Высоты элементов

```tsx
tokens.spacing.controlHeight   // 48 - высота контролов
tokens.spacing.buttonHeight    // 44 - высота кнопок
tokens.spacing.inputHeight     // 48 - высота input
tokens.spacing.tabBarHeight    // 44 - высота таб бара
tokens.spacing.headerHeight    // 56 - высота хедера
```

---

## 🔲 Радиусы скругления (radius)

```tsx
tokens.radius.none             // 0
tokens.radius.xs               // 4
tokens.radius.sm               // 6
tokens.radius.md               // 8  - стандарт
tokens.radius.lg               // 12 - карточки
tokens.radius.xl               // 16
tokens.radius.xxl              // 24
tokens.radius.full             // 9999 - круг
```

---

## 🔳 Elevation (Тени)

```tsx
tokens.elevation.none          // 0
tokens.elevation.sm            // 1
tokens.elevation.md            // 2
tokens.elevation.lg            // 3
tokens.elevation.xl            // 4
```

Используется с Paper компонентами:

```tsx
<Surface elevation={tokens.elevation.md}>
  <Text>Контент с тенью</Text>
</Surface>
```

---

## ✏️ Типографика (typography)

### Размеры шрифтов

```tsx
tokens.fontSize.xs             // 12
tokens.fontSize.sm             // 14
tokens.fontSize.md             // 16
tokens.fontSize.lg             // 18
tokens.fontSize.xl             // 20
tokens.fontSize.xxl            // 24
tokens.fontSize.xxxl           // 32
tokens.fontSize.huge           // 40
```

### Веса шрифтов

```tsx
tokens.fontWeight.regular      // '400'
tokens.fontWeight.medium       // '500'
tokens.fontWeight.semibold     // '600'
tokens.fontWeight.bold         // '700'
```

### Line Height

```tsx
tokens.lineHeight.tight        // 1.2
tokens.lineHeight.normal       // 1.5
tokens.lineHeight.relaxed      // 1.75
```

### Paper Typography Variants

**ВАЖНО:** Всегда используй `Text` из `react-native-paper` с вариантами!

```tsx
import { Text } from 'react-native-paper';

// Display (Hero text)
<Text variant="displayLarge">Hero Text</Text>
<Text variant="displayMedium">Large Display</Text>
<Text variant="displaySmall">Display</Text>

// Headings
<Text variant="headlineLarge">H1</Text>
<Text variant="headlineMedium">H2</Text>
<Text variant="headlineSmall">H3</Text>

// Titles
<Text variant="titleLarge">Title Large</Text>
<Text variant="titleMedium">Title</Text>
<Text variant="titleSmall">Title Small</Text>

// Body (основной текст)
<Text variant="bodyLarge">Body Large</Text>
<Text variant="bodyMedium">Body</Text>  {/* Основной текст */}
<Text variant="bodySmall">Small Text</Text>

// Labels
<Text variant="labelLarge">Label Large</Text>
<Text variant="labelMedium">Label</Text>
<Text variant="labelSmall">Label Small</Text>
```

Доступ к вариантам через tokens:

```tsx
tokens.paperVariants.hero       // 'displayLarge'
tokens.paperVariants.h1         // 'headlineLarge'
tokens.paperVariants.title      // 'titleMedium'
tokens.paperVariants.body       // 'bodyMedium'
tokens.paperVariants.label      // 'labelMedium'
```

---

## 🔄 Миграция со старого API

### Было (старый API):

```tsx
import { UI_TOKENS } from '../ui/themeTokens';

const styles = StyleSheet.create({
  container: {
    height: UI_TOKENS.controlHeight,
    borderRadius: UI_TOKENS.radius,
    gap: UI_TOKENS.gap,
  },
});
```

### Стало (новый API):

```tsx
import { tokens } from '../ui';

const styles = StyleSheet.create({
  container: {
    height: tokens.spacing.controlHeight,
    borderRadius: tokens.radius.md,
    gap: tokens.spacing.cardGap,
  },
});
```

### Совместимость

Старый `UI_TOKENS` всё ещё работает для обратной совместимости:

```tsx
import { UI_TOKENS } from '../ui/theme/tokens';

// Эти значения работают, но deprecated
UI_TOKENS.controlHeight  // -> tokens.spacing.controlHeight
UI_TOKENS.buttonHeight   // -> tokens.spacing.buttonHeight
UI_TOKENS.radius         // -> tokens.radius.md
UI_TOKENS.gap            // -> tokens.spacing.cardGap
```

---

## 🎯 Best Practices

### ✅ Правильно:

```tsx
import { tokens } from '../ui';

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
  },
  
  title: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.text.primary,
  },
});
```

### ❌ Неправильно:

```tsx
// НЕ используй хардкод значений!
const styles = StyleSheet.create({
  container: {
    padding: 16,                    // ❌ Используй tokens.spacing.lg
    backgroundColor: '#FFFFFF',     // ❌ Используй tokens.colors.surface
    borderRadius: 12,               // ❌ Используй tokens.radius.lg
  },
  
  title: {
    fontSize: 18,                   // ❌ Используй tokens.fontSize.lg
    fontWeight: '600',              // ❌ Используй tokens.fontWeight.semibold
    color: '#111827',               // ❌ Используй tokens.colors.text.primary
  },
});
```

### 🎨 Paper Text вместо React Native Text:

```tsx
// ✅ Правильно
import { Text } from 'react-native-paper';

<Text variant="bodyMedium">Текст</Text>

// ❌ Неправильно
import { Text } from 'react-native';

<Text style={{ fontSize: 14 }}>Текст</Text>
```

---

## 📊 Полный пример экрана

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { tokens } from '../ui';

export const ExampleScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text variant="titleLarge" style={styles.title}>
          Заголовок карточки
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Описание карточки с использованием единой системы UI tokens
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.spacing.screenPadding,
    backgroundColor: tokens.colors.background,
  },
  
  card: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    gap: tokens.spacing.sm,
  },
  
  title: {
    color: tokens.colors.text.primary,
  },
  
  description: {
    color: tokens.colors.text.secondary,
  },
});
```

---

## 🔗 Связанные документы

- [`UI_GUIDELINES.md`](./UI_GUIDELINES.md) - Правила использования UI компонентов
- [`UI_SYSTEM_PLAN.md`](./UI_SYSTEM_PLAN.md) - План создания UI системы
- [`UNIFIED_COMPONENTS.md`](./UNIFIED_COMPONENTS.md) - Каталог компонентов

---

**Следующий шаг:** Создание базовых UI компонентов (SearchInput, Badge, Avatar и др.)

