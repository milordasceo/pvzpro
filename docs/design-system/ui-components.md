# 🧩 UI Components - Каталог компонентов

**Дата создания:** 20 октября 2025  
**Статус:** ✅ Базовые компоненты готовы

---

## 📋 Обзор

Единая система UI компонентов для всего приложения. Все компоненты оптимизированы, мемоизированы и полностью типизированы.

### Где находятся:

- **Новые компоненты:** `src/ui/components/`
- **Существующие компоненты:** `src/components/`
- **Theme tokens:** `src/ui/theme/`

### Как использовать:

```tsx
import { tokens, SearchInput, StatusBadge, EmptyState } from '../ui';
```

---

## 🎨 Визуальный каталог

**UI Catalog Screen** - интерактивный каталог всех компонентов и токенов:

- 📍 Расположение: `src/admin/screens/UICatalogScreen.tsx`
- 🔗 Доступ: Админ панель → Таб "UI" (иконка палитры)
- 📊 Содержит: Цвета, Отступы, Типографика, Компоненты

---

## 📦 Компоненты (src/ui/components/)

### Layout (layout/)

#### Card

Унифицированная карточка с предустановленными стилями.

```tsx
import { Card } from '../ui';

<Card title="Заголовок" subtitle="Подзаголовок">
  <Text>Содержимое карточки</Text>
</Card>;
```

**Props:**

- `title` - заголовок карточки
- `subtitle` - подзаголовок
- `mode` - 'outlined' | 'elevated' | 'contained'
- `onPress` - обработчик нажатия
- `right` - элемент справа от заголовка

#### ScrollView

Унифицированный скролл с предустановками.

```tsx
import { ScrollView } from '../ui';

<ScrollView padding={16} gap={12}>
  <Card>...</Card>
  <Card>...</Card>
</ScrollView>;
```

**Props:**

- `padding` - отступы (default: 16)
- `gap` - расстояние между элементами (default: tokens.spacing.cardGap)
- `hideScrollIndicator` - скрыть индикатор (default: true)

---

### Buttons (buttons/)

#### Button

Унифицированная кнопка.

```tsx
import { Button } from '../ui';

<Button mode="contained" onPress={handleSubmit} loading={isLoading}>
  Сохранить
</Button>;
```

**Props:**

- `mode` - 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'
- `icon` - иконка Material Community
- `loading` - показать индикатор загрузки
- `disabled` - деактивировать кнопку
- `compact` - компактный размер

#### IconButton

Квадратная кнопка с иконкой.

```tsx
import { IconButton } from '../ui';

<IconButton icon="pencil" onPress={handleEdit} bg={tokens.colors.primary.main} />;
```

**Props:**

- `icon` - имя иконки Material Community
- `size` - размер кнопки (default: 44)
- `bg` - цвет фона
- `color` - цвет иконки

---

### Overlays (overlays/)

#### Dialog

Унифицированный диалог с Portal.

```tsx
import { Dialog, Button } from '../ui';

<Dialog
  visible={isVisible}
  onDismiss={handleClose}
  title="Подтверждение"
  actions={
    <>
      <Button mode="text" onPress={handleClose}>
        Отмена
      </Button>
      <Button mode="contained" onPress={handleConfirm}>
        OK
      </Button>
    </>
  }
>
  <Text>Вы уверены?</Text>
</Dialog>;
```

**Props:**

- `visible` - видимость диалога
- `onDismiss` - обработчик закрытия
- `title` - заголовок
- `actions` - кнопки действий
- `usePortal` - использовать Portal (default: true)

---

### Display (display/)

#### MetaRow

Строка с метаданными (иконка + текст + значение).

```tsx
import { MetaRow } from '../ui';

<MetaRow
  icon="calendar"
  label="Дата начала"
  rightValue="20.10.2025"
  rightColor={tokens.colors.success.main}
/>;
```

**Props:**

- `icon` - иконка Material Community
- `label` - текст метки
- `rightValue` - значение справа
- `rightColor` - цвет значения
- `subdued` - приглушенный стиль

---

### Inputs (inputs/)

#### SearchInput

Производительный компонент поиска, замена медленного `Searchbar` из Paper.

```tsx
import { SearchInput } from '../ui';

<SearchInput
  value={query}
  onChangeText={setQuery}
  placeholder="Поиск сотрудников..."
  autoFocus={false}
/>;
```

**Преимущества:**

- ⚡ В 3-5 раз быстрее, чем Searchbar из Paper
- 🎯 Нативный TextInput - мгновенный отклик
- 🎨 Встроенная кнопка очистки
- 📱 Поддержка Enter (returnKeyType="search")

**Props:**

- `value: string` - значение поиска
- `onChangeText: (text: string) => void` - callback изменения
- `placeholder?: string` - placeholder текст
- `autoFocus?: boolean` - автофокус при монтировании
- `style?: ViewStyle` - стили контейнера
- `inputStyle?: TextStyle` - стили input
- `onSubmitEditing?: () => void` - callback при Enter

#### SelectModal

Модал выбора элемента из списка с поиском.

```tsx
import { SelectModal } from '../ui';

<SelectModal
  visible={isVisible}
  title="Выберите сотрудника"
  options={employees.map((emp) => ({
    id: emp.id,
    label: emp.name,
    hint: emp.position,
  }))}
  onSelect={handleSelect}
  onClose={handleClose}
/>;
```

**Props:**

- `visible` - видимость модала
- `title` - заголовок
- `options` - массив опций (id, label, hint)
- `onSelect` - обработчик выбора
- `onClose` - обработчик закрытия

---

### Navigation (navigation/)

#### TabBar

Анимированная панель вкладок с плавным индикатором.

```tsx
import { TabBar } from '../ui';

<TabBar
  tabs={[
    { key: 'tab1', label: 'Вкладка 1' },
    { key: 'tab2', label: 'Вкладка 2', badge: <Badge>5</Badge> },
  ]}
  activeIndex={activeTab}
  onTabPress={setActiveTab}
/>;
```

**Props:**

- `tabs` - массив вкладок (key, label, badge?)
- `activeIndex` - индекс активной вкладки
- `onTabPress` - обработчик переключения

**Примечание:** Экспортируется также как `AnimatedTabBar` для обратной совместимости.

---

### Feedback (feedback/)

#### StatusBadge

Компонент для отображения статусов с предустановленными цветами.

```tsx
import { StatusBadge } from '../ui';

<StatusBadge status="success">На смене</StatusBadge>
<StatusBadge status="warning">Опоздание</StatusBadge>
<StatusBadge status="error">Неактивен</StatusBadge>
<StatusBadge status="info">В пути</StatusBadge>
<StatusBadge status="neutral">Нейтральный</StatusBadge>
```

**Размеры:**

```tsx
<StatusBadge status="success" size="small">Small</StatusBadge>
<StatusBadge status="success" size="medium">Medium</StatusBadge>
<StatusBadge status="success" size="large">Large</StatusBadge>
```

**Props:**

- `status: 'success' | 'warning' | 'error' | 'info' | 'neutral'` - тип статуса
- `children: string` - текст бейджа
- `size?: 'small' | 'medium' | 'large'` - размер (по умолчанию medium)
- `style?: ViewStyle` - дополнительные стили

---

### 3. EmptyState (states/)

Компонент для отображения пустых состояний.

```tsx
import { EmptyState } from '../ui';

<EmptyState
  icon="account-off"
  title="Нет сотрудников"
  description="Добавьте первого сотрудника для начала работы"
  action={{
    label: 'Добавить сотрудника',
    onPress: handleAdd,
    icon: 'plus',
  }}
/>;
```

**Без действия:**

```tsx
<EmptyState
  icon="magnify"
  title="Ничего не найдено"
  description="Попробуйте изменить параметры поиска"
/>
```

**Props:**

- `icon: string` - имя иконки MaterialCommunityIcons
- `title: string` - заголовок
- `description?: string` - описание (опционально)
- `action?: { label, onPress, icon? }` - действие (опционально)
- `style?: ViewStyle` - дополнительные стили

---

### 4. LoadingState (states/)

Компонент для состояния загрузки.

```tsx
import { LoadingState } from '../ui';

// С текстом
<LoadingState text="Загрузка данных..." />

// Без текста
<LoadingState />

// Маленький размер
<LoadingState size="small" text="Загрузка..." />
```

**Props:**

- `text?: string` - текст загрузки (по умолчанию "Загрузка...")
- `size?: 'small' | 'large'` - размер индикатора (по умолчанию large)
- `style?: ViewStyle` - дополнительные стили

---

### 5. ErrorState (states/)

Компонент для состояния ошибки.

```tsx
import { ErrorState } from '../ui';

<ErrorState
  title="Ошибка загрузки"
  message="Не удалось загрузить данные. Проверьте подключение к интернету."
  onRetry={handleRetry}
  retryLabel="Повторить попытку"
/>;
```

**Без кнопки повтора:**

```tsx
<ErrorState message="Данные недоступны" />
```

**Props:**

- `title?: string` - заголовок (по умолчанию "Что-то пошло не так")
- `message: string` - сообщение об ошибке
- `onRetry?: () => void` - callback для повтора (опционально)
- `retryLabel?: string` - текст кнопки (по умолчанию "Повторить")
- `style?: ViewStyle` - дополнительные стили

---

### States (states/)

#### EmptyState

Компонент для отображения пустых состояний.

```tsx
import { EmptyState } from '../ui';

<EmptyState
  icon="account-off"
  title="Нет сотрудников"
  description="Добавьте первого сотрудника для начала работы"
  action={{
    label: 'Добавить сотрудника',
    onPress: handleAdd,
    icon: 'plus',
  }}
/>;
```

**Props:**

- `icon` - имя иконки MaterialCommunityIcons
- `title` - заголовок
- `description` - описание (опционально)
- `action` - действие (опционально)

#### LoadingState

Компонент для состояния загрузки.

```tsx
import { LoadingState } from '../ui';

<LoadingState message="Загрузка данных..." />;
```

**Props:**

- `message` - текст сообщения (опционально)

#### ErrorState

Компонент для состояния ошибки.

```tsx
import { ErrorState } from '../ui';

<ErrorState title="Ошибка загрузки" message="Не удалось загрузить данные." onRetry={handleRetry} />;
```

**Props:**

- `title` - заголовок (опционально)
- `message` - сообщение об ошибке
- `onRetry` - callback для повтора (опционально)
- `retryLabel` - текст кнопки (опционально)

---

### Dev (dev/)

#### UICatalogFAB

Dev-инструмент для быстрого доступа к UI каталогу.

```tsx
import { UICatalogFAB } from '../ui';

// В AppProvider
<UICatalogFAB />;
```

**Особенности:**

- ⚡ Показывается только в `__DEV__` режиме
- 👆 Тройной тап для открытия каталога
- 🎯 Можно перетаскивать по экрану
- 🎨 Полупрозрачная, не мешает работе

**Props:**

- `visible` - показывать FAB (default: `__DEV__`)

**Примечание:** Экспортируется также как `DevUICatalogFAB` для обратной совместимости.

---

## ⚠️ Обратная совместимость

Файл `src/components/index.ts` обеспечивает обратную совместимость со старыми именами:

### Старые импорты (работают, но deprecated):

```tsx
import { StyledCard } from '../components/StyledCard';

<StyledDialog
  visible={visible}
  title="Подтверждение"
  message="Вы уверены, что хотите удалить?"
  onDismiss={onClose}
  actions={[
    { label: 'Отмена', onPress: onClose },
    { label: 'Удалить', onPress: onDelete, mode: 'danger' },
  ]}
/>;
```

---

### SelectModal

Модальное окно выбора из списка.

```tsx
import { SelectModal } from '../components/SelectModal';

<SelectModal
  visible={visible}
  title="Выберите ПВЗ"
  options={[
    { value: 'pvz-001', label: 'ПВЗ · Тамбовская 41' },
    { value: 'pvz-002', label: 'ПВЗ · Кропоткина 130/7' },
  ]}
  selectedValue={selectedPvz}
  onSelect={handleSelect}
  onDismiss={onClose}
/>;
```

---

### AnimatedTabBar

Анимированные табы для фильтров.

```tsx
import { AnimatedTabBar } from '../components/AnimatedTabBar';

const tabs = [
  { key: 'all', label: 'Все (10)' },
  { key: 'active', label: 'Активные (5)' },
  { key: 'inactive', label: 'Неактивные (5)' },
];

<AnimatedTabBar tabs={tabs} activeIndex={currentIndex} onTabPress={handleTabPress} />;
```

---

### SquareIconButton

Квадратные кнопки с иконками.

```tsx
import { SquareIconButton } from '../components/SquareIconButton';

<SquareIconButton
  icon="plus"
  onPress={handleAdd}
  variant="primary"
/>

<SquareIconButton
  icon="pencil"
  onPress={handleEdit}
  variant="secondary"
/>

<SquareIconButton
  icon="delete"
  onPress={handleDelete}
  variant="danger"
/>
```

---

### StyledScrollView

ScrollView с кастомными возможностями.

```tsx
import { StyledScrollView } from '../components/StyledScrollView';

<StyledScrollView>
  <View>Содержимое</View>
</StyledScrollView>;
```

---

### MetaRow

Строка с метаданными (иконка + текст).

```tsx
import { MetaRow } from '../components/MetaRow';

<MetaRow icon="clock" text="10:00 - 18:00" />
<MetaRow icon="map-marker" text="ПВЗ · Тамбовская 41" />
```

---

## 📚 Paper компоненты (используем напрямую)

Эти компоненты из `react-native-paper` используются БЕЗ обёрток:

```tsx
import { Text, Badge, Chip, Avatar, ActivityIndicator, Divider, Surface, List } from 'react-native-paper';

// Text с вариантами
<Text variant="headlineMedium">Заголовок</Text>
<Text variant="bodyMedium">Основной текст</Text>

// Badge
<Badge size={20}>5</Badge>

// Chip
<Chip icon="information" onPress={() => {}}>Тег</Chip>

// Avatar
<Avatar.Text size={40} label="АБ" />
<Avatar.Image size={40} source={{ uri: '...' }} />

// ActivityIndicator
<ActivityIndicator size="large" color="#4F46E5" />

// Divider
<Divider />

// Surface (с тенью)
<Surface elevation={2}>
  <Text>Контент</Text>
</Surface>
```

---

## 🎯 Когда что использовать

### Поиск:

- ✅ **SearchInput** - всегда (быстрый!)
- ❌ Paper Searchbar - НЕ используй (медленный)

### Статусы:

- ✅ **StatusBadge** - для статусных бейджей
- ✅ **Paper Badge** - для числовых бейджей
- ✅ **Paper Chip** - для тегов

### Пустые состояния:

- ✅ **EmptyState** - для пустых списков
- ✅ **LoadingState** - для загрузки
- ✅ **ErrorState** - для ошибок

### Фильтры/Табы:

- ✅ **AnimatedTabBar** - всегда

### Кнопки:

- ✅ **StyledButton** - основные кнопки
- ✅ **SquareIconButton** - иконочные кнопки
- ✅ **Paper IconButton** - простые иконки

### Текст:

- ✅ **Paper Text** с variant - ВСЕГДА
- ❌ React Native Text - НЕ используй

---

## 📖 Примеры использования

### Экран со списком и поиском

```tsx
import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { tokens, SearchInput, EmptyState, LoadingState } from '../ui';
import { StyledCard } from '../components/StyledCard';

export const EmployeesScreen = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  const filtered = useMemo(() => {
    return employees.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
  }, [employees, query]);

  if (loading) {
    return <LoadingState text="Загрузка сотрудников..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Поиск сотрудников..." />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StyledCard>
            <Text variant="titleMedium">{item.name}</Text>
          </StyledCard>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={query ? 'magnify' : 'account-off'}
            title={query ? 'Ничего не найдено' : 'Нет сотрудников'}
            description={query ? 'Попробуйте изменить запрос' : 'Добавьте первого сотрудника'}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  searchContainer: {
    padding: tokens.spacing.lg,
  },
});
```

---

## 🔄 Следующие шаги

### Планируемые компоненты:

- [ ] **FilterBar** - обёртка над AnimatedTabBar для фильтров
- [ ] **ListItem** - универсальный элемент списка
- [ ] **SectionHeader** - заголовки секций
- [ ] **ActionSheet** - bottom sheet
- [ ] **Toast** - уведомления
- [ ] **Skeleton** - skeleton loading

---

## 🔗 Связанные документы

- [`UI_TOKENS.md`](./UI_TOKENS.md) - Документация по Design Tokens
- [`UI_GUIDELINES.md`](./UI_GUIDELINES.md) - Правила использования UI
- [`UI_SYSTEM_PLAN.md`](./UI_SYSTEM_PLAN.md) - План UI системы
- [`UNIFIED_COMPONENTS.md`](./UNIFIED_COMPONENTS.md) - Общий обзор компонентов

---

**Статус:** ✅ Базовые компоненты готовы  
**Следующий этап:** Миграция существующих экранов на новую UI систему
