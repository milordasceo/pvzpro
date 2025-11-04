# 📐 UI Guidelines - Единообразие интерфейса

> **Важно:** Всегда используй существующие компоненты вместо создания новых!

---

## 📚 Базовая библиотека: React Native Paper

Мы используем **React Native Paper** как основу UI:

- https://callstack.github.io/react-native-paper/

### Компоненты Paper (используем напрямую):

```tsx
import {
  Text,
  Button,
  Card,
  Dialog,
  Portal,
  Modal,
  Badge,
  Chip,
  Avatar,
  ActivityIndicator,
  Divider,
  List,
  Surface,
} from 'react-native-paper';
```

### Когда использовать Paper напрямую:

- ✅ `Text` (с variant) - всегда
- ✅ `Badge` - для бейджей с числами
- ✅ `Chip` - для тегов и чипсов
- ✅ `Avatar.Text`, `Avatar.Image` - для аватаров
- ✅ `ActivityIndicator` - для загрузки
- ✅ `Divider` - для разделителей
- ✅ `Surface` - для поверхностей с elevation

### Когда использовать наши обёртки:

- ✅ `StyledCard` вместо `Card` (есть доп. функции)
- ✅ `StyledButton` вместо `Button` (есть варианты)
- ✅ `StyledDialog` вместо `Dialog` (упрощённый API)

---

## 🎨 Наши кастомные компоненты

### 1. **Фильтры / Табы**

✅ **Правильно:** Используй `AnimatedTabBar`

```tsx
import { AnimatedTabBar } from '../../../components/AnimatedTabBar';

const tabs = [
  { key: 'all', label: 'Все (10)' },
  { key: 'active', label: 'Активные (5)' },
];

<AnimatedTabBar tabs={tabs} activeIndex={currentIndex} onTabPress={handleTabPress} />;
```

❌ **Неправильно:** Создавать кастомные `FilterButton`, `TabButton` и т.д.

---

### 2. **Поиск**

✅ **Правильно:** Нативный `TextInput` с иконками

```tsx
import { TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

<View style={styles.searchContainer}>
  <MaterialCommunityIcons name="magnify" size={20} color={placeholderColor} />
  <TextInput
    style={styles.searchInput}
    placeholder="Поиск..."
    value={query}
    onChangeText={setQuery}
  />
  {query.length > 0 && <MaterialCommunityIcons name="close-circle" onPress={() => setQuery('')} />}
</View>;
```

❌ **Неправильно:** `Searchbar` из Paper (медленный и тяжёлый!)

**Почему не Searchbar:**

- Медленный рендеринг при каждом изменении
- Много лишних анимаций
- Больше ресурсов
- Нативный TextInput в 3-5 раз быстрее

---

### 3. **Кнопки**

✅ **Правильно:** Используй `StyledButton`

```tsx
import { StyledButton } from '../../../components/StyledButton';

<StyledButton mode="contained" onPress={handlePress}>
  Сохранить
</StyledButton>;
```

---

### 4. **Карточки**

✅ **Правильно:** Используй `StyledCard`

```tsx
import { StyledCard } from '../../../components/StyledCard';

<StyledCard onPress={handlePress}>
  <Text>Содержимое</Text>
</StyledCard>;
```

---

### 5. **Диалоги / Модалы**

✅ **Правильно:** Используй `StyledDialog`

```tsx
import { StyledDialog } from '../../../components/StyledDialog';

<StyledDialog
  visible={visible}
  title="Подтверждение"
  message="Вы уверены?"
  onDismiss={onClose}
  actions={[
    { label: 'Отмена', onPress: onClose },
    { label: 'Удалить', onPress: onDelete, mode: 'danger' },
  ]}
/>;
```

---

### 6. **Выбор из списка**

✅ **Правильно:** Используй `SelectModal`

```tsx
import { SelectModal } from '../../../components/SelectModal';

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

### 7. **Кнопки с иконками**

✅ **Правильно:** Используй `SquareIconButton`

```tsx
import { SquareIconButton } from '../../../components/SquareIconButton';

<SquareIconButton icon="plus" onPress={handleAdd} variant="primary" />;
```

---

### 8. **ScrollView**

✅ **Правильно:** Используй `StyledScrollView`

```tsx
import { StyledScrollView } from '../../../components/StyledScrollView';

<StyledScrollView>
  <View>Содержимое</View>
</StyledScrollView>;
```

---

### 9. **Paper компоненты напрямую**

✅ **Используй Paper без обёрток:**

```tsx
import { Text, Badge, Chip, Avatar, ActivityIndicator, Divider } from 'react-native-paper';

// Текст с вариантами
<Text variant="headlineMedium">Заголовок</Text>
<Text variant="bodyMedium">Текст</Text>

// Бейдж
<Badge size={20}>5</Badge>

// Чип
<Chip icon="information" onPress={() => {}}>Тег</Chip>

// Аватар
<Avatar.Text size={40} label="АБ" />
<Avatar.Image size={40} source={{ uri: '...' }} />

// Загрузка
<ActivityIndicator size="large" color="#4F46E5" />

// Разделитель
<Divider />
```

---

## 🎨 Цвета и стили

### Основные цвета:

```tsx
import { placeholderColor } from '../../../theme';

// Основные
'#4F46E5' - Primary (фиолетовый)
'#111827' - Text (чёрный)
'#6B7280' - Muted (серый)
placeholderColor - Placeholder

// Фоны
'#F9FAFB' - Background
'#FFFFFF' - Card background

// Статусы
'#10B981' - Success (зелёный)
'#F59E0B' - Warning (жёлтый)
'#DC2626' - Danger (красный)
'#0891B2' - Info (синий)
```

---

## 📱 Размеры

### Отступы:

```tsx
paddingHorizontal: 16; // Стандарт для экрана
gap: 8; // Между элементами
gap: 12; // Между карточками
marginBottom: 16; // Между секциями
```

### Скругления:

```tsx
borderRadius: 8; // Маленькие элементы (кнопки, бейджи)
borderRadius: 12; // Средние элементы (карточки, input)
borderRadius: 16; // Большие элементы
```

### Размеры текста (Paper Typography):

```tsx
// ВСЕГДА используй Text из react-native-paper с вариантами:
import { Text } from 'react-native-paper';

<Text variant="displayLarge">Hero Text</Text>
<Text variant="displayMedium">Large Display</Text>
<Text variant="displaySmall">Display</Text>

<Text variant="headlineLarge">H1</Text>
<Text variant="headlineMedium">H2</Text>
<Text variant="headlineSmall">H3</Text>

<Text variant="titleLarge">Title Large</Text>
<Text variant="titleMedium">Title</Text>
<Text variant="titleSmall">Title Small</Text>

<Text variant="bodyLarge">Body Large</Text>
<Text variant="bodyMedium">Body</Text>  {/* Основной текст */}
<Text variant="bodySmall">Small Text</Text>

<Text variant="labelLarge">Label Large</Text>
<Text variant="labelMedium">Label</Text>
<Text variant="labelSmall">Label Small</Text>
```

---

## ⚡ Производительность

### Всегда используй:

```tsx
// 1. React.memo для компонентов
export const MyComponent = React.memo(() => {
  // ...
});

// 2. useMemo для вычислений
const filtered = useMemo(() => {
  return data.filter((item) => item.active);
}, [data]);

// 3. useCallback для функций
const handlePress = useCallback(() => {
  // ...
}, []);

// 4. StyleSheet.create для стилей
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

---

## 🚫 Чего НЕ делать

❌ **НЕ создавай новые компоненты для:**

- Фильтров (используй `AnimatedTabBar`)
- Поиска (используй нативный `TextInput`)
- Кнопок (используй `StyledButton`)
- Карточек (используй `StyledCard`)
- Диалогов (используй `StyledDialog`)

❌ **НЕ используй:**

- `Searchbar` из Paper (медленный! используй нативный TextInput)
- `ProgressBar` из Paper для всего (для простой загрузки - ActivityIndicator)
- Инлайн-стили (используй `StyleSheet.create`)
- Хардкод цветов (используй константы из `theme.ts`)
- React Native `Text` напрямую (используй Paper `Text` с вариантами)

❌ **НЕ забывай:**

- Мемоизацию (`React.memo`, `useMemo`, `useCallback`)
- Оптимизацию `FlatList` (removeClippedSubviews, windowSize и т.д.)
- Pull-to-refresh везде где есть списки

---

## ✅ Чеклист перед коммитом

- [ ] Используются Paper компоненты где возможно
- [ ] Используются существующие кастомные компоненты
- [ ] Нет кастомных кнопок/фильтров/поиска
- [ ] `Text` из Paper (не из React Native)
- [ ] Все компоненты мемоизированы
- [ ] Стили через `StyleSheet.create`
- [ ] Цвета из констант
- [ ] Pull-to-refresh добавлен
- [ ] Empty states обработаны
- [ ] TypeScript без ошибок

### Paper компоненты:

- [ ] `Text` с variant вместо голого Text
- [ ] `Badge`, `Chip`, `Avatar` напрямую из Paper
- [ ] `ActivityIndicator` для загрузки
- [ ] `Divider` для разделителей
- [ ] НЕ `Searchbar` (используй TextInput)

---

## 🎨 Фон экранов

### Единый токен для фона

Все экраны должны использовать единый цвет фона через токен:

```tsx
// ✅ Правильно
<View style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}>
  {/* Контент экрана */}
</View>;

// ❌ Неправильно
backgroundColor: tokens.colors.gray[50];
backgroundColor: '#F9FAFB';
backgroundColor: tokens.colors.background;
```

**Токен:** `tokens.colors.screenBackground` (#F9FAFB)

**Где применяется:**

- Основной контейнер экрана (flex: 1)
- Поля ввода на сером фоне
- Карточки на сером фоне

**Преимущества:**

- ✅ Единообразие - один цвет фона везде
- ✅ Централизация - легко изменить глобально
- ✅ Масштабируемость - легко добавить темную тему

**Цветовая схема:**

```
┌─────────────────────────────────────┐
│ screenBackground (#F9FAFB)          │ ← Фон экрана
│  ┌───────────────────────────────┐  │
│  │ surface (#FFFFFF)             │  │ ← Белые карточки
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Статус:** ✅ Все экраны обновлены (2025-10-21)

---

**Помни: Единообразие > Креативность в дизайне!** 🎯
