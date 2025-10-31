# 📐 Гайд по размещению элементов (Layout)

> **Обновлено:** 2025-11-01  
> **Базовая сетка:** 4px

## 📋 Содержание

1. [Spacing система](#spacing-система)
2. [Grid система (4px)](#grid-система-4px)
3. [Композиция экранов](#композиция-экранов)
4. [Карточки и контейнеры](#карточки-и-контейнеры)
5. [Responsive правила](#responsive-правила)
6. [Layout утилиты](#layout-утилиты)
7. [Примеры композиций](#примеры-композиций)

---

## Spacing система

### Базовые токены

```tsx
import { tokens } from '../ui';

tokens.spacing.xs     // 4px
tokens.spacing.sm     // 8px
tokens.spacing.md     // 12px
tokens.spacing.lg     // 16px
tokens.spacing.xl     // 24px
tokens.spacing.xxl    // 32px
tokens.spacing.xxxl   // 48px
```

### Специальные токены

```tsx
tokens.spacing.screenPadding  // 16px - горизонтальный padding экрана
tokens.spacing.cardGap        // 12px - расстояние между карточками
tokens.spacing.sectionGap     // 16px - расстояние между секциями
tokens.spacing.elementGap     // 8px  - расстояние между элементами
```

### Когда использовать

| Токен | Использование |
|-------|---------------|
| `xs` (4px) | Минимальные отступы, внутренние padding |
| `sm` (8px) | Расстояние между элементами в группе |
| `md` (12px) | Стандартные отступы, gap между карточками |
| `lg` (16px) | Padding экранов, секций |
| `xl` (24px) | Большие отступы между секциями |
| `xxl` (32px) | Очень большие отступы |
| `xxxl` (48px) | Максимальные отступы |

---

## Grid система (4px)

Все отступы и размеры должны быть кратны **4px** (базовая единица).

### Правила

```tsx
// ✅ Правильно - кратно 4
padding: 12        // 4 * 3
margin: 16         // 4 * 4
gap: 8             // 4 * 2
height: 48         // 4 * 12

// ❌ Неправильно - не кратно 4
padding: 10
margin: 15
gap: 7
```

### Исключения

Некоторые размеры могут быть не кратны 4 для точной типографики:
- Размеры шрифтов (13px, 15px и т.д.)
- Некоторые высоты элементов (44px для кнопок)

---

## Композиция экранов

### Базовая структура экрана

```tsx
<View style={{ 
  flex: 1, 
  backgroundColor: tokens.colors.screenBackground 
}}>
  <ScrollView 
    contentContainerStyle={{
      padding: tokens.spacing.screenPadding,
      gap: tokens.spacing.sectionGap
    }}
  >
    {/* Контент */}
  </ScrollView>
</View>
```

### Паттерн: Header → Content → Actions

```tsx
<View style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}>
  {/* Header */}
  <View style={{ 
    paddingHorizontal: tokens.spacing.screenPadding,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border
  }}>
    <Heading level={1}>Заголовок</Heading>
  </View>
  
  {/* Content */}
  <ScrollView 
    contentContainerStyle={{ 
      padding: tokens.spacing.screenPadding,
      gap: tokens.spacing.cardGap
    }}
  >
    <Card>{/* ... */}</Card>
    <Card>{/* ... */}</Card>
  </ScrollView>
  
  {/* Actions (FAB или нижняя панель) */}
  <View style={{ 
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border
  }}>
    <Button mode="contained">Сохранить</Button>
  </View>
</View>
```

### Вертикальные отступы

```tsx
// Между секциями
marginBottom: tokens.spacing.sectionGap    // 16px

// Между карточками
marginBottom: tokens.spacing.cardGap       // 12px

// Между элементами в группе
marginBottom: tokens.spacing.elementGap    // 8px
```

### Горизонтальные отступы

```tsx
// Стандартный padding экрана
paddingHorizontal: tokens.spacing.screenPadding  // 16px

// Внутри карточки
paddingHorizontal: tokens.spacing.lg             // 16px
```

---

## Карточки и контейнеры

### Card - основной контейнер

```tsx
import { Card } from '../ui';

<Card 
  style={{ 
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.cardGap
  }}
>
  <Title size="medium">Заголовок</Title>
  <Body size="small">Контент</Body>
</Card>
```

**Стандартные padding для Card:**
- Внутренний padding: `16px` (tokens.spacing.lg)
- Между карточками: `12px` (tokens.spacing.cardGap)

### Surface - простой контейнер

```tsx
<Surface 
  style={{ 
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg
  }}
>
  {/* Контент */}
</Surface>
```

### Вложенность контейнеров

```tsx
// ✅ Правильно
<Card>  {/* Внешний контейнер */}
  <View style={{ gap: tokens.spacing.sm }}>  {/* Группа элементов */}
    <Title>Заголовок</Title>
    <Body>Текст</Body>
  </View>
</Card>

// ❌ Неправильно - избыточная вложенность
<Card>
  <Card>  {/* Не вкладывайте карточки друг в друга */}
    <Text>Текст</Text>
  </Card>
</Card>
```

---

## Responsive правила

### Минимальные размеры элементов

```tsx
// Минимальная высота для touch-элементов
const MIN_TOUCH_HEIGHT = 44;  // tokens.spacing.buttonHeight

// Кнопки
<Button style={{ height: tokens.spacing.buttonHeight }}>
  Кнопка
</Button>

// Input поля
<TextInput style={{ height: tokens.spacing.controlHeight }}>
  {/* 48px */}
</TextInput>
```

### Адаптация для разных экранов

```tsx
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Для маленьких экранов (<360px) уменьшаем padding
const screenPadding = width < 360 
  ? tokens.spacing.md   // 12px
  : tokens.spacing.lg;  // 16px

<View style={{ paddingHorizontal: screenPadding }}>
  {/* Контент */}
</View>
```

---

## Layout утилиты

### screenContainer - контейнер экрана

```tsx
import { screenContainer } from '../ui/utils/layout';

<View style={screenContainer}>
  {/* Контент экрана */}
</View>

// Эквивалентно:
<View style={{ 
  flex: 1, 
  backgroundColor: tokens.colors.screenBackground 
}}>
```

### sectionContainer - контейнер секции

```tsx
import { sectionContainer } from '../ui/utils/layout';

<View style={sectionContainer}>
  {/* Контент секции */}
</View>

// Эквивалентно:
<View style={{ 
  padding: tokens.spacing.screenPadding,
  gap: tokens.spacing.sectionGap
}}>
```

### cardInner - внутренний padding карточки

```tsx
import { cardInner } from '../ui/utils/layout';

<Card>
  <View style={cardInner}>
    {/* Контент с правильными отступами */}
  </View>
</Card>

// Эквивалентно:
<View style={{ 
  padding: tokens.spacing.lg 
}}>
```

### horizontalStack - горизонтальное размещение

```tsx
import { horizontalStack } from '../ui/utils/layout';

<View style={horizontalStack()}>
  <Button>Отмена</Button>
  <Button>OK</Button>
</View>

// С кастомным gap
<View style={horizontalStack(tokens.spacing.md)}>
  <Button>Отмена</Button>
  <Button>OK</Button>
</View>

// Эквивалентно:
<View style={{ 
  flexDirection: 'row', 
  gap: tokens.spacing.sm 
}}>
```

### verticalStack - вертикальное размещение

```tsx
import { verticalStack } from '../ui/utils/layout';

<View style={verticalStack()}>
  <Card>...</Card>
  <Card>...</Card>
</View>

// С кастомным gap
<View style={verticalStack(tokens.spacing.cardGap)}>
  <Card>...</Card>
  <Card>...</Card>
</View>

// Эквивалентно:
<View style={{ 
  gap: tokens.spacing.sm 
}}>
```

---

## Примеры композиций

### Экран списка

```tsx
<View style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}>
  <ScrollView 
    contentContainerStyle={{ 
      padding: tokens.spacing.screenPadding,
      gap: tokens.spacing.cardGap
    }}
  >
    {/* Заголовок */}
    <View style={{ marginBottom: tokens.spacing.md }}>
      <Heading level={1} style={{ marginBottom: tokens.spacing.xs }}>
        Сотрудники
      </Heading>
      <Caption>10 активных сотрудников</Caption>
    </View>
    
    {/* Список карточек */}
    {employees.map(emp => (
      <Card key={emp.id} style={{ padding: tokens.spacing.lg }}>
        <Title size="medium">{emp.name}</Title>
        <Caption>{emp.position}</Caption>
      </Card>
    ))}
  </ScrollView>
</View>
```

### Форма с секциями

```tsx
<ScrollView 
  style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}
  contentContainerStyle={{ 
    padding: tokens.spacing.screenPadding,
    gap: tokens.spacing.sectionGap
  }}
>
  {/* Секция 1 */}
  <View>
    <Title size="large" style={{ marginBottom: tokens.spacing.md }}>
      Личные данные
    </Title>
    
    <View style={{ gap: tokens.spacing.md }}>
      <View>
        <Label style={{ marginBottom: tokens.spacing.xs }}>Имя</Label>
        <TextInput placeholder="Введите имя" />
      </View>
      
      <View>
        <Label style={{ marginBottom: tokens.spacing.xs }}>Email</Label>
        <TextInput placeholder="Введите email" />
      </View>
    </View>
  </View>
  
  {/* Секция 2 */}
  <View>
    <Title size="large" style={{ marginBottom: tokens.spacing.md }}>
      Должность
    </Title>
    
    <View style={{ gap: tokens.spacing.md }}>
      <View>
        <Label style={{ marginBottom: tokens.spacing.xs }}>Роль</Label>
        <TextInput placeholder="Оператор ПВЗ" />
      </View>
    </View>
  </View>
  
  {/* Кнопки */}
  <View style={{ 
    flexDirection: 'row', 
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md
  }}>
    <Button mode="text" style={{ flex: 1 }}>Отмена</Button>
    <Button mode="contained" style={{ flex: 1 }}>Сохранить</Button>
  </View>
</ScrollView>
```

### Dashboard с grid карточек

```tsx
<ScrollView 
  style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}
  contentContainerStyle={{ 
    padding: tokens.spacing.screenPadding,
    gap: tokens.spacing.sectionGap
  }}
>
  {/* Заголовок */}
  <Heading level={1}>Обзор</Heading>
  
  {/* Grid 2 колонки */}
  <View style={{ 
    flexDirection: 'row', 
    gap: tokens.spacing.md,
    flexWrap: 'wrap'
  }}>
    <Card style={{ 
      flex: 1, 
      minWidth: '45%',
      padding: tokens.spacing.lg
    }}>
      <Label size="small">Задачи</Label>
      <Heading level={2}>45</Heading>
      <Caption>+12 за сегодня</Caption>
    </Card>
    
    <Card style={{ 
      flex: 1, 
      minWidth: '45%',
      padding: tokens.spacing.lg
    }}>
      <Label size="small">Смены</Label>
      <Heading level={2}>8</Heading>
      <Caption>На этой неделе</Caption>
    </Card>
  </View>
  
  {/* Полноширинная карточка */}
  <Card style={{ padding: tokens.spacing.lg }}>
    <Title size="medium" style={{ marginBottom: tokens.spacing.md }}>
      На смене сейчас
    </Title>
    
    <View style={{ gap: tokens.spacing.sm }}>
      {/* Список сотрудников */}
    </View>
  </Card>
</ScrollView>
```

### Модальное окно

```tsx
<Dialog visible={visible} onDismiss={onClose}>
  {/* Header */}
  <View style={{ 
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border
  }}>
    <Heading level={3}>Подтверждение</Heading>
  </View>
  
  {/* Content */}
  <View style={{ 
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md
  }}>
    <Body>
      Вы уверены, что хотите удалить этот элемент?
    </Body>
    
    <Caption>
      Это действие нельзя отменить
    </Caption>
  </View>
  
  {/* Actions */}
  <View style={{ 
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border
  }}>
    <Button mode="text" onPress={onClose} style={{ flex: 1 }}>
      Отмена
    </Button>
    <Button 
      mode="contained" 
      buttonColor={tokens.colors.error.main}
      onPress={onDelete}
      style={{ flex: 1 }}
    >
      Удалить
    </Button>
  </View>
</Dialog>
```

---

## Чек-лист Layout

- [ ] Все отступы кратны 4px (используются токены)
- [ ] Использован `screenBackground` для фона экрана
- [ ] Padding экрана = `tokens.spacing.screenPadding` (16px)
- [ ] Gap между карточками = `tokens.spacing.cardGap` (12px)
- [ ] Gap между секциями = `tokens.spacing.sectionGap` (16px)
- [ ] Минимальная высота touch-элементов = 44px
- [ ] Использованы layout утилиты где возможно
- [ ] Избегается избыточная вложенность контейнеров

---

## Полезные ссылки

- [Color Usage Guide](COLOR_USAGE_GUIDE.md) - цвета
- [Typography Guide](TYPOGRAPHY_GUIDE.md) - типографика
- [Design System](DESIGN_SYSTEM.md) - полная дизайн-система
- [Quick Reference](DESIGN_QUICK_REF.md) - быстрая справка
