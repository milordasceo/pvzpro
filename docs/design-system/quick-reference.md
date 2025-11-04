# 🎯 Дизайн-система - Быстрая справка

> Шпаргалка на 1 страницу

---

## 🎨 Цвета (22 цвета)

```tsx
import { tokens } from '../ui';

// Primary
tokens.colors.primary.main; // #4F46E5 - кнопки, акценты
tokens.colors.primary.light; // #EDE9FE - hover, фон
tokens.colors.primary.dark; // #1E40AF - pressed

// Text
tokens.colors.text.primary; // #111827 - заголовки
tokens.colors.text.secondary; // #6B7280 - описания
tokens.colors.text.muted; // #9CA3AF - placeholder
tokens.colors.text.disabled; // #D1D5DB - disabled

// Status
tokens.colors.success.main; // #10B981 - успех
tokens.colors.warning.main; // #F59E0B - предупреждение
tokens.colors.error.main; // #DC2626 - ошибка
tokens.colors.info.main; // #3B82F6 - информация

// Фоны
tokens.colors.screenBackground; // #F9FAFB - фон экранов
tokens.colors.surface; // #FFFFFF - карточки
tokens.colors.border; // #E5E7EB - границы

// Gray
tokens.colors.gray[50 - 500]; // 6 оттенков серого
```

---

## ✏️ Типографика

```tsx
import { Heading, Title, Body, Label, Caption } from '../ui';

<Heading level={1}>Главный заголовок</Heading>      // 32px
<Heading level={2}>Подзаголовок</Heading>           // 28px
<Heading level={3}>Секция</Heading>                 // 24px

<Title size="large">Заголовок секции</Title>        // 22px
<Title size="medium">Заголовок карточки</Title>     // 16px
<Title size="small">Подзаголовок</Title>            // 14px

<Body>Основной текст</Body>                         // 14px
<Body size="large">Крупный текст</Body>             // 16px
<Body size="small">Мелкий текст</Body>              // 12px

<Label>Метка</Label>                                // 12px
<Caption>Вторичная информация</Caption>             // 12px secondary
```

---

## 📐 Spacing

```tsx
import { tokens } from '../ui';

tokens.spacing.xs; // 4px
tokens.spacing.sm; // 8px   - между элементами
tokens.spacing.md; // 12px  - между карточками
tokens.spacing.lg; // 16px  - padding экрана/секции
tokens.spacing.xl; // 24px  - большие отступы

tokens.spacing.screenPadding; // 16px  - горизонтальный padding экрана
tokens.spacing.cardGap; // 12px  - расстояние между карточками
tokens.spacing.sectionGap; // 16px  - расстояние между секциями
tokens.spacing.elementGap; // 8px   - расстояние между элементами
```

**Правило:** Все отступы кратны 4px

---

## 🧩 Компоненты

```tsx
import {
  Button,
  IconButton,
  Card,
  ScrollView,
  SearchInput,
  SelectModal,
  Dialog,
  TabBar,
  Tab,
  StatusBadge,
  EmptyState,
  ErrorState,
  LoadingState,
  Heading,
  Title,
  Body,
  Label,
  Caption,
  MetaRow,
  screenContainer,
  horizontalStack,
  verticalStack,
} from '../ui';
```

### Paper компоненты (используем напрямую)

```tsx
import { Text, Badge, Chip, Avatar, ActivityIndicator, Divider } from 'react-native-paper';
```

---

## 📏 Layout утилиты

```tsx
import { screenContainer, horizontalStack, verticalStack } from '../ui';

<View style={screenContainer}>
  // flex: 1, backgroundColor: screenBackground
</View>

<View style={horizontalStack()}>
  // flexDirection: 'row', gap: 8
</View>

<View style={horizontalStack(12)}>
  // flexDirection: 'row', gap: 12
</View>

<View style={verticalStack()}>
  // gap: 8
</View>

<View style={verticalStack(12)}>
  // gap: 12
</View>
```

---

## 📦 Радиусы

```tsx
tokens.radius.xs; // 4px
tokens.radius.sm; // 6px
tokens.radius.md; // 8px   - кнопки, мелкие элементы
tokens.radius.lg; // 12px  - карточки, input
tokens.radius.xl; // 16px  - большие элементы
```

---

## 🎯 Частые паттерны

### Экран

```tsx
<View style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}>
  <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
    <Heading level={1}>Заголовок</Heading>
    <Caption>Описание экрана</Caption>
    <Card>{/* ... */}</Card>
    <Card>{/* ... */}</Card>
  </ScrollView>
</View>
```

### Карточка

```tsx
<Card style={{ padding: 16 }}>
  <Title size="medium">Заголовок</Title>
  <Caption>Описание</Caption>
  <Body size="small" style={{ marginTop: 8 }}>
    Контент
  </Body>
</Card>
```

### Форма

```tsx
<View style={{ gap: 12 }}>
  <View>
    <Label style={{ marginBottom: 4 }}>Email</Label>
    <TextInput placeholder="email@example.com" />
  </View>

  <View style={{ flexDirection: 'row', gap: 8 }}>
    <Button mode="text" style={{ flex: 1 }}>
      Отмена
    </Button>
    <Button mode="contained" style={{ flex: 1 }}>
      OK
    </Button>
  </View>
</View>
```

### Бейдж статуса

```tsx
<View
  style={{
    backgroundColor: tokens.colors.success.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  }}
>
  <Label style={{ color: tokens.colors.success.dark }}>На смене</Label>
</View>
```

---

## ⚠️ НЕ делать

❌ Hardcoded цвета: `color: '#111827'`  
✅ Используй токены: `color: tokens.colors.text.primary`

❌ Инлайн fontSize/fontWeight  
✅ Используй компоненты: `<Title>`, `<Body>`

❌ React Native Text напрямую  
✅ Используй Paper Text или типографические компоненты

❌ Searchbar из Paper (медленный!)  
✅ Используй нативный TextInput + SearchInput компонент

❌ Отступы не кратные 4  
✅ Используй tokens.spacing.\*

---

## 📚 Подробная документация

- [COLOR_USAGE_GUIDE.md](COLOR_USAGE_GUIDE.md) - цвета
- [TYPOGRAPHY_GUIDE.md](TYPOGRAPHY_GUIDE.md) - типографика
- [LAYOUT_GUIDE.md](LAYOUT_GUIDE.md) - layout
- [UI_GUIDELINES.md](UI_GUIDELINES.md) - правила UI
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - полная система
