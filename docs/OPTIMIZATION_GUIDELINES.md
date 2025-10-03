# Руководство по оптимизации — Best Practices

> Правила и рекомендации для написания оптимизированного кода с первого раза  
> Создано: 2025-10-03 20:43:29

---

## 🎯 Цель документа

Этот документ описывает **обязательные практики** для написания производительного кода в проекте WB ПВЗ. Следуя этим правилам с самого начала, мы избегаем необходимости в последующей оптимизации.

---

## ⚡ Основные принципы

### 1. Мемоизация — ВСЕГДА
### 2. Оптимизированные изображения — С ПЕРВОГО РАЗА
### 3. Code Splitting — ДЛЯ ТЯЖЁЛЫХ ЭКРАНОВ
### 4. Анимации на GPU — ОБЯЗАТЕЛЬНО
### 5. Минимум re-renders — ПО УМОЛЧАНИЮ

---

## 📋 Чеклист для каждого компонента

### ✅ Перед созданием компонента:

- [ ] Будет ли компонент переиспользоваться? → Вынести в `components/`
- [ ] Компонент большой (>200 строк)? → Разбить на подкомпоненты
- [ ] Будет ли частый re-render? → Мемоизация обязательна
- [ ] Есть вычисления? → `useMemo`
- [ ] Есть функции-обработчики? → `useCallback`
- [ ] Есть изображения? → `expo-image`
- [ ] Есть анимации? → `useNativeDriver: true`

---

## 1️⃣ Мемоизация компонентов

### Когда использовать `React.memo`:

**ВСЕГДА для:**
- ✅ Переиспользуемых UI компонентов
- ✅ Элементов списков (FlatList items)
- ✅ Компонентов с редко меняющимися props
- ✅ Компонентов внутри часто re-render родителя

**Примеры:**

```typescript
// ❌ ПЛОХО: без мемоизации
export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  return (
    <StyledCard>
      <Text>{task.title}</Text>
      <StyledButton onPress={() => onComplete(task.id)}>
        Завершить
      </StyledButton>
    </StyledCard>
  );
};

// ✅ ХОРОШО: с мемоизацией
export const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, onComplete }) => {
  return (
    <StyledCard>
      <Text>{task.title}</Text>
      <StyledButton onPress={() => onComplete(task.id)}>
        Завершить
      </StyledButton>
    </StyledCard>
  );
});
```

---

## 2️⃣ Мемоизация вычислений (`useMemo`)

### Когда использовать:

**ВСЕГДА для:**
- ✅ Фильтрации массивов
- ✅ Сортировки данных
- ✅ Математических вычислений
- ✅ Форматирования данных
- ✅ Создания объектов/массивов в render

**Примеры:**

```typescript
// ❌ ПЛОХО: вычисления на каждом render
const MyComponent = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Пересчитывается КАЖДЫЙ раз!
  const completedTasks = tasks.filter(t => t.completed);
  const totalProgress = (completedTasks.length / tasks.length) * 100;
  
  return <Text>{totalProgress}%</Text>;
};

// ✅ ХОРОШО: мемоизация вычислений
const MyComponent = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Пересчитывается только при изменении tasks
  const completedTasks = useMemo(
    () => tasks.filter(t => t.completed),
    [tasks]
  );
  
  const totalProgress = useMemo(
    () => (completedTasks.length / tasks.length) * 100,
    [completedTasks.length, tasks.length]
  );
  
  return <Text>{totalProgress}%</Text>;
};
```

**Правило:** Если вычисление используется в JSX или передаётся как prop — мемоизируй!

---

## 3️⃣ Мемоизация функций (`useCallback`)

### Когда использовать:

**ВСЕГДА для:**
- ✅ Функций, передаваемых как props
- ✅ Обработчиков событий (onPress, onChange и т.д.)
- ✅ Функций внутри useEffect dependencies
- ✅ Функций, используемых в дочерних мемоизированных компонентах

**Примеры:**

```typescript
// ❌ ПЛОХО: новая функция на каждом render
const MyScreen = () => {
  const [count, setCount] = useState(0);
  
  // Создаётся заново КАЖДЫЙ раз!
  const handleIncrement = () => setCount(c => c + 1);
  
  return <StyledButton onPress={handleIncrement}>+1</StyledButton>;
};

// ✅ ХОРОШО: мемоизированная функция
const MyScreen = () => {
  const [count, setCount] = useState(0);
  
  // Создаётся ОДИН раз
  const handleIncrement = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <StyledButton onPress={handleIncrement}>+1</StyledButton>;
};
```

**Правило:** Если функция передаётся как prop — оберни в `useCallback`!

---

## 4️⃣ Оптимизация изображений

### ОБЯЗАТЕЛЬНО использовать `expo-image`

**Почему:**
- ✅ Кэширование на диске (мгновенная повторная загрузка)
- ✅ Плавные transitions
- ✅ Красивые placeholders (blurhash)
- ✅ Автоматическое управление памятью

**Примеры:**

```typescript
// ❌ ПЛОХО: стандартный Image
import { Image } from 'react-native';

<Image 
  source={{ uri: photoUri }} 
  style={{ width: 100, height: 100 }} 
/>

// ✅ ХОРОШО: expo-image
import { Image } from 'expo-image';

<Image
  source={{ uri: photoUri }}
  style={{ width: 100, height: 100 }}
  contentFit="cover"
  transition={200}
  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
/>
```

### Качество фото: 0.3 (не выше!)

```typescript
// ❌ ПЛОХО: качество 0.7-1.0
const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

// ✅ ХОРОШО: качество 0.3
const result = await ImagePicker.launchCameraAsync({ quality: 0.3 });
```

**Правило:** Всегда используй `expo-image` + качество 0.3 для превью!

---

## 5️⃣ Code Splitting для тяжёлых экранов

### Когда использовать `React.lazy`:

**ОБЯЗАТЕЛЬНО для:**
- ✅ Экранов с большим количеством кода (>400 строк)
- ✅ Экранов с графиками/календарями
- ✅ Экранов, которые открываются редко
- ✅ Неактивных табов

**Примеры:**

```typescript
// ❌ ПЛОХО: прямой импорт тяжёлого экрана
import { ScheduleScreen } from '../employee/ScheduleScreen';

<Tab.Screen name="График" component={ScheduleScreen} />

// ✅ ХОРОШО: ленивая загрузка
import React, { Suspense, lazy } from 'react';

const ScheduleScreen = lazy(() => 
  import('../employee/ScheduleScreen').then(m => ({ default: m.ScheduleScreen }))
);

<Tab.Screen name="График">
  {() => (
    <Suspense fallback={<LoadingFallback />}>
      <ScheduleScreen />
    </Suspense>
  )}
</Tab.Screen>
```

**Правило:** Экран >400 строк или с тяжёлыми библиотеками → `React.lazy`!

---

## 6️⃣ Анимации на GPU

### ВСЕГДА используй `useNativeDriver: true`

```typescript
// ❌ ПЛОХО: анимация на JS thread
Animated.timing(animValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: false, // или не указан
}).start();

// ✅ ХОРОШО: анимация на GPU
Animated.timing(animValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // ✅ ОБЯЗАТЕЛЬНО
}).start();
```

**Ограничения `useNativeDriver: true`:**
- Нельзя анимировать: `height`, `width`, `flex`, `padding`, `margin`
- Можно анимировать: `opacity`, `transform` (translateX/Y, scale, rotate)

**Правило:** Всегда используй `useNativeDriver: true`, если возможно!

---

## 7️⃣ Оптимизация списков

### ОБЯЗАТЕЛЬНО использовать `FlatList` для динамических данных

**НО!** FlatList требует аккуратности с layout:

```typescript
// ❌ ПЛОХО: gap в contentContainerStyle
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  contentContainerStyle={{ gap: 12 }} // ⚠️ Ломает layout!
/>

// ✅ ХОРОШО: ItemSeparatorComponent
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
/>
```

**Обязательные оптимизации для FlatList:**
- ✅ `keyExtractor` — уникальный ключ для каждого элемента
- ✅ `getItemLayout` — если элементы одинаковой высоты
- ✅ `removeClippedSubviews` — удаление элементов вне экрана
- ✅ Мемоизированный `renderItem`

```typescript
const renderItem = useCallback(({ item }: { item: Task }) => (
  <TaskCard task={item} onComplete={handleComplete} />
), [handleComplete]);

<FlatList
  data={tasks}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

**Правило:** Для >10 элементов → `FlatList`, для <10 → `ScrollView` + `.map()`

---

## 8️⃣ Оптимизация State Management (Zustand)

### Используй `partialize` для persist

**Сохраняй ТОЛЬКО необходимое:**

```typescript
// ❌ ПЛОХО: сохраняется весь store
export const useShiftStore = create<ShiftState>()(
  persist(
    (set, get) => ({
      currentShift: null,
      shifts: [],
      isLoading: false, // ❌ Не нужно в persist!
      error: null,      // ❌ Не нужно в persist!
      // ...
    }),
    {
      name: 'shift-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // ❌ Сохраняется ВСЁ
    }
  )
);

// ✅ ХОРОШО: только нужные данные
export const useShiftStore = create<ShiftState>()(
  persist(
    (set, get) => ({
      currentShift: null,
      shifts: [],
      isLoading: false,
      error: null,
      // ...
    }),
    {
      name: 'shift-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentShift: state.currentShift,
        shifts: state.shifts,
        // isLoading и error НЕ сохраняются
      }),
    }
  )
);
```

**Правило:** Не сохраняй `isLoading`, `error`, временные флаги!

---

## 9️⃣ Структура компонентов

### Избегай больших компонентов (>300 строк)

**Декомпозиция:**

```typescript
// ❌ ПЛОХО: один огромный компонент
const EmployeeScreen = () => {
  // 700 строк кода
  return (
    <ScrollView>
      {/* 200 строк hero section */}
      {/* 300 строк checklist */}
      {/* 200 строк assignments */}
    </ScrollView>
  );
};

// ✅ ХОРОШО: разбито на подкомпоненты
const HeroSection = React.memo(({ progress }: { progress: number }) => {
  // 50 строк
});

const ChecklistSection = React.memo(({ items }: { items: ChecklistItem[] }) => {
  // 100 строк
});

const AssignmentsSection = React.memo(({ tasks }: { tasks: Task[] }) => {
  // 100 строк
});

const EmployeeScreen = () => {
  return (
    <ScrollView>
      <HeroSection progress={totalProgress} />
      <ChecklistSection items={checklists} />
      <AssignmentsSection tasks={assignments} />
    </ScrollView>
  );
};
```

**Правило:** Компонент >300 строк → разбить на подкомпоненты + мемоизация!

---

## 🔟 Избегай частых re-renders

### Используй селекторы в Zustand

```typescript
// ❌ ПЛОХО: подписка на весь store
const MyComponent = () => {
  const store = useShiftStore(); // ⚠️ Re-render при любом изменении!
  return <Text>{store.currentShift?.id}</Text>;
};

// ✅ ХОРОШО: селектор конкретного поля
const MyComponent = () => {
  const currentShiftId = useShiftStore((state) => state.currentShift?.id);
  return <Text>{currentShiftId}</Text>;
};
```

### Избегай инлайн-объектов и функций

```typescript
// ❌ ПЛОХО: новый объект на каждом render
<MyComponent style={{ marginTop: 10 }} />
<MyButton onPress={() => console.log('hi')} />

// ✅ ХОРОШО: вынести в константу или useCallback
const buttonStyle = { marginTop: 10 }; // Вне компонента
const handlePress = useCallback(() => console.log('hi'), []);

<MyComponent style={buttonStyle} />
<MyButton onPress={handlePress} />
```

---

## 📋 Чеклист перед PR/коммитом

### Обязательно проверь:

- [ ] Все компоненты в `components/` обёрнуты в `React.memo`
- [ ] Все вычисления обёрнуты в `useMemo`
- [ ] Все функции-handlers обёрнуты в `useCallback`
- [ ] Используется `expo-image` вместо `Image`
- [ ] Качество фото 0.3 (не выше)
- [ ] Анимации используют `useNativeDriver: true`
- [ ] Большие экраны (>400 строк) используют `React.lazy`
- [ ] FlatList для списков >10 элементов
- [ ] Zustand persist использует `partialize`
- [ ] Нет компонентов >300 строк (разбить!)
- [ ] Нет инлайн-объектов/функций в props

---

## 🚨 Антипаттерны (НИКОГДА не делай так)

### 1. Создание функций/объектов внутри render

```typescript
// ❌ ПЛОХО
return items.map(item => (
  <Card 
    key={item.id}
    onPress={() => handlePress(item.id)} // ⚠️ Новая функция каждый раз!
    style={{ padding: 10 }}               // ⚠️ Новый объект каждый раз!
  />
));
```

### 2. Использование индекса массива как key

```typescript
// ❌ ПЛОХО
{items.map((item, index) => (
  <Card key={index} />  // ⚠️ Проблемы при изменении порядка!
))}

// ✅ ХОРОШО
{items.map((item) => (
  <Card key={item.id} />
))}
```

### 3. Тяжёлые вычисления без мемоизации

```typescript
// ❌ ПЛОХО
const sortedItems = items.sort((a, b) => a.date - b.date); // ⚠️ Каждый render!
```

### 4. Большие изображения без оптимизации

```typescript
// ❌ ПЛОХО
<Image source={{ uri: fullSizePhoto }} /> // ⚠️ 5MB фото!
```

---

## 📊 Метрики производительности

### Целевые показатели:

| Метрика | Цель | Критично |
|---------|------|----------|
| **FPS** | 55-60 | >45 |
| **Первый запуск** | <3 сек | <5 сек |
| **Переход между экранами** | <300ms | <500ms |
| **Re-renders в секунду** | <5 | <10 |
| **Размер bundle** | <10MB | <15MB |

### Как измерить:

```bash
# FPS в React Native
# Включить Performance Monitor в dev меню (CMD+D)

# Профилирование
npx react-devtools
# Performance tab → Record → Analyze
```

---

## 🎓 Дополнительные ресурсы

### Документация:
- [React.memo](https://react.dev/reference/react/memo)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
- [React Native Performance](https://reactnative.dev/docs/performance)

### Внутренние документы:
- [PERFORMANCE.md](PERFORMANCE.md) — подробное руководство по оптимизации
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — компоненты и паттерны
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) — архитектура проекта

---

## ✅ Итоговое правило

> **"Оптимизируй сразу, не откладывай на потом"**

Следуя этим правилам с первого дня, мы получаем:
- ✅ Стабильные 60 FPS
- ✅ Быстрый запуск приложения
- ✅ Плавные переходы
- ✅ Счастливых пользователей
- ✅ Не нужна последующая оптимизация

---

**Документ создан:** 2025-10-03 20:43:29  
**Версия:** 1.0  
**Статус:** Обязателен к применению ✅

