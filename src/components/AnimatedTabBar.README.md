# AnimatedTabBar

Переиспользуемый компонент анимированной таб-панели с плавным индикатором.

## Особенности

- ✅ Плавная spring-анимация индикатора
- ✅ Работает с любым количеством табов
- ✅ Автоматическое распределение ширины
- ✅ Синхронизация с React Navigation
- ✅ Поддержка свайпов и кликов

## Использование

### Вариант 1: С React Navigation (рекомендуется)

```tsx
import { AnimatedTabBar, AnimatedTab } from '../components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const TopTabs = createMaterialTopTabNavigator();

// Определяем табы
const tabs: AnimatedTab[] = [
  { key: 'overview', label: 'Обзор' },
  { key: 'tasks', label: 'Задачи' },
];

// Кастомный таб-бар
const CustomTabBar: React.FC<{ navigation: any; state: any }> = ({ navigation, state }) => {
  const handleTabPress = (index: number) => {
    navigation.navigate(tabs[index].label);
  };

  return (
    <AnimatedTabBar
      tabs={tabs}
      activeIndex={state.index}
      onTabPress={handleTabPress}
    />
  );
};

// Использование в компоненте
export const MyScreen: React.FC = () => {
  return (
    <TopTabs.Navigator
      screenOptions={{ swipeEnabled: true, lazy: true }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <TopTabs.Screen name="Обзор" component={OverviewTab} />
      <TopTabs.Screen name="Задачи" component={TasksTab} />
    </TopTabs.Navigator>
  );
};
```

### Вариант 2: Standalone (без Navigator)

```tsx
import React, { useState } from 'react';
import { AnimatedTabBar, AnimatedTab } from '../components';

const tabs: AnimatedTab[] = [
  { key: 'current', label: 'Текущий период' },
  { key: 'history', label: 'История' },
];

export const MyScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <AnimatedTabBar
        tabs={tabs}
        activeIndex={activeTab}
        onTabPress={setActiveTab}
      />
      
      {activeTab === 0 ? <CurrentPeriodContent /> : <HistoryContent />}
    </View>
  );
};
```

## API

### Props

| Prop | Type | Описание |
|------|------|----------|
| `tabs` | `AnimatedTab[]` | Массив табов для отображения |
| `activeIndex` | `number` | Индекс активного таба (0-based) |
| `onTabPress` | `(index: number) => void` | Callback при нажатии на таб |

### AnimatedTab

```typescript
interface AnimatedTab {
  key: string;    // Уникальный ключ таба
  label: string;  // Текст таба
}
```

## Примеры в проекте

- `src/navigation/EmployeeTabNavigator.tsx` - Финансы (Текущий период | История)
- `src/employee/EmployeeHomeScreen.tsx` - Моя смена (Обзор | Задачи) [TODO]

## Стилизация

По умолчанию использует дизайн-токены проекта:
- Цвет индикатора: `#111827`
- Цвет активного таба: `#111827`
- Цвет неактивного таба: `placeholderColor`
- Высота индикатора: `2px`

Для кастомизации стилей отредактируйте `src/components/AnimatedTabBar.tsx`.

## Анимация

Использует `Animated.spring` с параметрами:
- `tension: 68` - упругость пружины
- `friction: 12` - сила трения
- `useNativeDriver: true` - нативная анимация (60fps)

Для изменения параметров анимации отредактируйте `useEffect` в компоненте.

