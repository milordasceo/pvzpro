# 🧩 Стратегия работы с компонентами

**Дата создания:** 20 октября 2025  
**Статус:** 📋 План действий

---

## 🎯 Цель

Определить чёткую стратегию: какие компоненты брать из React Native Paper, какие создавать самим, и как организовать миграцию.

---

## 📊 Текущая ситуация

### Что уже есть:

#### 1. **Старые компоненты** (`src/components/`):
- `StyledButton.tsx` - обёртка над Paper Button
- `StyledCard.tsx` - обёртка над Paper Card
- `StyledDialog.tsx` - обёртка над Paper Dialog
- `StyledScrollView.tsx` - ScrollView с отступами
- `SelectModal.tsx` - модал выбора
- `AnimatedTabBar.tsx` - анимированные табы
- `MetaRow.tsx` - строка с метаданными
- `SquareIconButton.tsx` - квадратная кнопка
- `DevUICatalogFAB.tsx` - dev FAB для UI каталога

#### 2. **Новые компоненты** (`src/ui/components/`):
```
buttons/
  - Button.tsx
  - IconButton.tsx
layout/
  - Card.tsx
  - ScrollView.tsx
overlays/
  - Dialog.tsx
inputs/
  - SearchInput.tsx ⚡ (производительный!)
  - SelectModal.tsx
display/
  - MetaRow.tsx
navigation/
  - TabBar.tsx
feedback/
  - StatusBadge.tsx
states/
  - EmptyState.tsx
  - LoadingState.tsx
  - ErrorState.tsx
dev/
  - UICatalogFAB.tsx
```

#### 3. **React Native Paper** используется в 45 файлах:
Большинство экранов импортируют компоненты напрямую из Paper.

---

## 🤔 Принцип решения: "Брать из Paper или делать свой?"

### ✅ **Берём из Paper БЕЗ обёртки:**

#### Текст и типографика:
- ✅ **Text** - ВСЕГДА используем Paper Text с variant
- ✅ **Appbar** - готовый, хороший компонент
- ✅ **List** - для простых списков

```tsx
import { Text } from 'react-native-paper';

<Text variant="headlineMedium">Заголовок</Text>
<Text variant="bodyMedium">Текст</Text>
<Text variant="labelSmall">Метка</Text>
```

**Почему Paper?**
- Готовые размеры и веса
- Консистентная типографика
- MD3 стандарт

#### Визуальные элементы:
- ✅ **Badge** - числовые бейджи
- ✅ **Chip** - теги и фильтры
- ✅ **Avatar** - аватары (Text/Image/Icon)
- ✅ **Divider** - разделители
- ✅ **Surface** - поверхности с тенью
- ✅ **ActivityIndicator** - индикатор загрузки

```tsx
import { Badge, Chip, Avatar, Divider } from 'react-native-paper';

<Badge>5</Badge>
<Chip icon="star">Избранное</Chip>
<Avatar.Text size={40} label="АБ" />
<Divider />
```

**Почему Paper?**
- Хорошо работают
- MD3 дизайн
- Не тормозят

#### Формы:
- ✅ **TextInput** - инпуты (НО! Для поиска используем свой SearchInput)
- ✅ **Switch** - переключатели
- ✅ **Checkbox** - чекбоксы
- ✅ **RadioButton** - радио кнопки

```tsx
import { TextInput, Switch, Checkbox } from 'react-native-paper';

<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  mode="outlined"
/>
<Switch value={enabled} onValueChange={setEnabled} />
<Checkbox status={checked ? 'checked' : 'unchecked'} />
```

**Почему Paper?**
- Красивые, работают
- Валидация встроена
- MD3 стиль

---

### 🔧 **Делаем свои обёртки:**

#### 1. **Button** → `src/ui/components/buttons/Button.tsx`

**Почему свой?**
- ❌ Paper Button требует много пропсов для простых случаев
- ✅ Наш Button предустановлены стили
- ✅ Удобный API для loading состояния
- ✅ Консистентный внешний вид

```tsx
// ❌ Paper (многословно)
import { Button } from 'react-native-paper';
<Button 
  mode="contained" 
  buttonColor={theme.colors.primary}
  textColor="#FFFFFF"
  style={{ borderRadius: 8 }}
>
  Сохранить
</Button>

// ✅ Наш (просто)
import { Button } from '../ui';
<Button mode="contained" loading={isSaving}>
  Сохранить
</Button>
```

#### 2. **Card** → `src/ui/components/layout/Card.tsx`

**Почему свой?**
- ✅ Предустановленные отступы
- ✅ Консистентные тени
- ✅ Упрощённый API
- ✅ Готовые варианты (outlined/elevated)

```tsx
// ✅ Наш Card
import { Card } from '../ui';
<Card title="Заголовок" subtitle="Подзаголовок">
  <Text>Контент</Text>
</Card>
```

#### 3. **Dialog** → `src/ui/components/overlays/Dialog.tsx`

**Почему свой?**
- ✅ Portal встроен
- ✅ Удобный API для actions
- ✅ Предустановленные стили

```tsx
// ✅ Наш Dialog
import { Dialog, Button } from '../ui';
<Dialog
  visible={visible}
  onDismiss={onClose}
  title="Подтверждение"
  actions={
    <>
      <Button mode="text" onPress={onClose}>Отмена</Button>
      <Button mode="contained" onPress={onConfirm}>OK</Button>
    </>
  }
>
  <Text>Вы уверены?</Text>
</Dialog>
```

#### 4. **ScrollView** → `src/ui/components/layout/ScrollView.tsx`

**Почему свой?**
- ✅ Предустановленные отступы
- ✅ Gap между элементами
- ✅ RefreshControl встроен

```tsx
// ✅ Наш ScrollView
import { ScrollView } from '../ui';
<ScrollView padding={16} gap={12}>
  <Card>...</Card>
  <Card>...</Card>
</ScrollView>
```

#### 5. **IconButton** → `src/ui/components/buttons/IconButton.tsx`

**Почему свой?**
- ✅ Квадратная форма
- ✅ Кастомные цвета фона
- ✅ Консистентный размер

```tsx
// ✅ Наш IconButton
import { IconButton } from '../ui';
<IconButton 
  icon="pencil" 
  onPress={handleEdit}
  bg={tokens.colors.primary.main}
/>
```

---

### 🆕 **Делаем полностью свои:**

#### 1. **SearchInput** ⚡ → `src/ui/components/inputs/SearchInput.tsx`

**Почему свой?**
- ❌ Paper Searchbar **ОЧЕНЬ МЕДЛЕННЫЙ** (3-5x тормозит)
- ✅ Наш SearchInput использует нативный TextInput
- ✅ Мгновенный отклик при вводе
- ✅ Встроенная кнопка очистки

```tsx
// ❌ НЕ ИСПОЛЬЗУЙ Paper Searchbar (медленный!)
import { Searchbar } from 'react-native-paper';

// ✅ ИСПОЛЬЗУЙ наш SearchInput
import { SearchInput } from '../ui';
<SearchInput
  value={query}
  onChangeText={setQuery}
  placeholder="Поиск..."
/>
```

**Результат:** В 3-5 раз быстрее!

#### 2. **StatusBadge** → `src/ui/components/feedback/StatusBadge.tsx`

**Почему свой?**
- ❌ Paper Chip не подходит для статусов
- ✅ Предустановленные цвета статусов
- ✅ Размеры (small/medium/large)
- ✅ Semantic API

```tsx
import { StatusBadge } from '../ui';
<StatusBadge status="success">Активен</StatusBadge>
<StatusBadge status="warning">Опоздание</StatusBadge>
<StatusBadge status="error">Неактивен</StatusBadge>
```

#### 3. **EmptyState** → `src/ui/components/states/EmptyState.tsx`

**Почему свой?**
- ❌ В Paper нет компонента пустого состояния
- ✅ Консистентный дизайн
- ✅ Иконка + текст + действие

```tsx
import { EmptyState } from '../ui';
<EmptyState
  icon="account-off"
  title="Нет сотрудников"
  description="Добавьте первого сотрудника"
  action={{
    label: 'Добавить',
    onPress: handleAdd,
  }}
/>
```

#### 4. **LoadingState** → `src/ui/components/states/LoadingState.tsx`

**Почему свой?**
- ❌ Paper ActivityIndicator нужно оборачивать
- ✅ Готовый компонент с текстом
- ✅ Центрирование встроено

```tsx
import { LoadingState } from '../ui';
<LoadingState text="Загрузка данных..." />
```

#### 5. **ErrorState** → `src/ui/components/states/ErrorState.tsx`

**Почему свой?**
- ❌ В Paper нет
- ✅ Ошибка + кнопка повтора
- ✅ Консистентный дизайн

```tsx
import { ErrorState } from '../ui';
<ErrorState
  message="Не удалось загрузить данные"
  onRetry={handleRetry}
/>
```

#### 6. **TabBar** (AnimatedTabBar) → `src/ui/components/navigation/TabBar.tsx`

**Почему свой?**
- ❌ Paper TabBar не анимированный
- ✅ Плавная анимация индикатора
- ✅ Красивый дизайн

```tsx
import { TabBar } from '../ui';
<TabBar
  tabs={[
    { key: 'all', label: 'Все' },
    { key: 'active', label: 'Активные' },
  ]}
  activeIndex={index}
  onTabPress={setIndex}
/>
```

#### 7. **MetaRow** → `src/ui/components/display/MetaRow.tsx`

**Почему свой?**
- ❌ В Paper нет
- ✅ Иконка + текст + значение
- ✅ Универсальный компонент

```tsx
import { MetaRow } from '../ui';
<MetaRow 
  icon="calendar" 
  label="Дата" 
  rightValue="20.10.2025"
/>
```

#### 8. **SelectModal** → `src/ui/components/inputs/SelectModal.tsx`

**Почему свой?**
- ❌ Paper Menu не подходит для длинных списков
- ✅ Модал с поиском
- ✅ Производительный

```tsx
import { SelectModal } from '../ui';
<SelectModal
  visible={visible}
  title="Выберите сотрудника"
  options={employees.map(e => ({
    id: e.id,
    label: e.name,
  }))}
  onSelect={handleSelect}
  onClose={onClose}
/>
```

---

## 📋 Итоговая таблица решений

| Компонент | Paper? | Свой? | Обёртка? | Причина |
|-----------|--------|-------|----------|---------|
| **Text** | ✅ | - | - | Отличная типографика MD3 |
| **Button** | - | - | ✅ | Упрощённый API, предустановки |
| **IconButton** | - | - | ✅ | Квадратная форма, цвета |
| **Card** | - | - | ✅ | Предустановленные стили |
| **Dialog** | - | - | ✅ | Portal, упрощённый API |
| **ScrollView** | - | - | ✅ | Отступы, gap |
| **Searchbar** | ❌ | ✅ | - | **МЕДЛЕННЫЙ! Используй SearchInput** |
| **SearchInput** | - | ✅ | - | **В 3-5x быстрее!** |
| **Badge** | ✅ | - | - | Хорошо работает |
| **Chip** | ✅ | - | - | Отлично для тегов |
| **StatusBadge** | - | ✅ | - | Semantic статусы |
| **Avatar** | ✅ | - | - | Универсальный |
| **Divider** | ✅ | - | - | Простой |
| **Switch** | ✅ | - | - | Работает отлично |
| **Checkbox** | ✅ | - | - | MD3 дизайн |
| **RadioButton** | ✅ | - | - | MD3 дизайн |
| **TextInput** | ✅ | - | - | Хороший (кроме поиска!) |
| **ActivityIndicator** | ✅ | - | - | Стандартный |
| **Surface** | ✅ | - | - | Тени встроены |
| **List** | ✅ | - | - | Простые списки |
| **Appbar** | ✅ | - | - | Готовый хороший |
| **TabBar** | - | ✅ | - | Анимация |
| **EmptyState** | - | ✅ | - | Нет в Paper |
| **LoadingState** | - | ✅ | - | Обёртка ActivityIndicator |
| **ErrorState** | - | ✅ | - | Нет в Paper |
| **MetaRow** | - | ✅ | - | Кастомный дизайн |
| **SelectModal** | - | ✅ | - | Поиск + производительность |

---

## 🎯 Стратегия импортов

### ✅ **Правильно:**

```typescript
// Наши компоненты из ui/
import { 
  Button, 
  IconButton, 
  Card, 
  Dialog, 
  ScrollView,
  SearchInput,  // ⚡ ВАЖНО!
  StatusBadge,
  EmptyState,
  LoadingState,
  ErrorState,
  TabBar,
  MetaRow,
  SelectModal,
  tokens,
} from '../ui';

// Paper компоненты напрямую
import { 
  Text, 
  Badge, 
  Chip, 
  Avatar, 
  Divider,
  TextInput,
  Switch,
  Checkbox,
  ActivityIndicator,
  Surface,
  List,
  Appbar,
} from 'react-native-paper';
```

### ❌ **Неправильно:**

```typescript
// ❌ НЕ импортируй Searchbar из Paper
import { Searchbar } from 'react-native-paper'; // МЕДЛЕННЫЙ!

// ❌ НЕ импортируй старые компоненты напрямую
import { StyledButton } from '../components/StyledButton';

// ❌ НЕ используй React Native Text
import { Text } from 'react-native'; // Используй Paper Text!
```

---

## 📊 План миграции

### Этап 1: Критичные компоненты (СРОЧНО!)

**Цель:** Убрать узкие места производительности

1. **Заменить все Searchbar → SearchInput** 🔥
   - Файлы: `PvzListScreen.tsx`, `EmployeeListScreen.tsx`, и др.
   - Результат: 3-5x ускорение поиска

### Этап 2: Унификация Button/Card/Dialog

**Цель:** Консистентный дизайн

2. **Мигрировать на новые Button/Card/Dialog**
   - Заменить `StyledButton` → `Button`
   - Заменить `StyledCard` → `Card`
   - Заменить `StyledDialog` → `Dialog`

### Этап 3: Состояния

**Цель:** Улучшить UX

3. **Добавить Empty/Loading/Error states**
   - Заменить условные рендеры на `EmptyState`
   - Обернуть загрузку в `LoadingState`
   - Добавить `ErrorState` для ошибок

### Этап 4: Очистка

4. **Удалить старые компоненты** из `src/components/`
   - Оставить только index.ts для обратной совместимости
   - Перенести всё в `src/ui/`

---

## 🔄 Миграционные паттерны

### Паттерн 1: Searchbar → SearchInput

```tsx
// ❌ БЫЛО (медленно)
import { Searchbar } from 'react-native-paper';

const [searchQuery, setSearchQuery] = useState('');

<Searchbar
  placeholder="Поиск"
  onChangeText={setSearchQuery}
  value={searchQuery}
/>

// ✅ СТАЛО (быстро)
import { SearchInput } from '../ui';

const [searchQuery, setSearchQuery] = useState('');

<SearchInput
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Поиск"
/>
```

### Паттерн 2: StyledButton → Button

```tsx
// ❌ БЫЛО
import { StyledButton } from '../components/StyledButton';

<StyledButton mode="contained" onPress={handleSave}>
  Сохранить
</StyledButton>

// ✅ СТАЛО
import { Button } from '../ui';

<Button mode="contained" onPress={handleSave} loading={isSaving}>
  Сохранить
</Button>
```

### Паттерн 3: Условный рендер → EmptyState

```tsx
// ❌ БЫЛО
{employees.length === 0 ? (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <MaterialCommunityIcons name="account-off" size={64} color="#9CA3AF" />
    <Text style={{ marginTop: 16, color: '#6B7280' }}>
      Нет сотрудников
    </Text>
  </View>
) : (
  <FlatList data={employees} ... />
)}

// ✅ СТАЛО
import { EmptyState } from '../ui';

<FlatList
  data={employees}
  ...
  ListEmptyComponent={
    <EmptyState
      icon="account-off"
      title="Нет сотрудников"
      description="Добавьте первого сотрудника"
    />
  }
/>
```

---

## 🎯 Приоритеты

### 🔥 Высокий приоритет:

1. **SearchInput** - заменить ВСЕ Searchbar (производительность!)
2. **EmptyState** - улучшить UX пустых списков
3. **LoadingState** - унифицировать загрузку

### 📋 Средний приоритет:

4. **Button** - унифицировать кнопки
5. **Card** - унифицировать карточки
6. **Dialog** - унифицировать диалоги

### 📌 Низкий приоритет:

7. Очистка старых компонентов
8. Удаление `src/components/`

---

## 📚 Следующие шаги

1. ✅ Создать этот документ
2. 📋 Найти все использования Searchbar
3. 🔄 Заменить Searchbar → SearchInput
4. 🎨 Мигрировать Button/Card/Dialog
5. ✨ Добавить Empty/Loading/Error states
6. 🧹 Очистка

---

## 📖 Связанные документы

- [`UI_COMPONENTS.md`](./UI_COMPONENTS.md) - Каталог компонентов
- [`UI_TOKENS.md`](./UI_TOKENS.md) - Design Tokens
- [`UI_GUIDELINES.md`](./UI_GUIDELINES.md) - Правила использования

---

**Дата:** 20 октября 2025  
**Автор:** AI Assistant  
**Статус:** 📋 Готов к выполнению

