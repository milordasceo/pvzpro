# 📋 План реализации модуля "Сотрудники"

**Дата:** 2 ноября 2025  
**Статус:** 📝 В РАЗРАБОТКЕ  
**Версия:** 1.0

---

## 🎯 Общая информация

### Цель модуля
Создать полнофункциональный модуль управления сотрудниками для администраторов ПВЗ Wildberries с возможностью просмотра, добавления, редактирования и управления персоналом.

### Текущее состояние
- ✅ Базовый экран списка сотрудников (`EmployeesScreen.tsx`)
- ✅ Карточка сотрудника (`EmployeeCard.tsx`)
- ✅ Фильтры для списка (`EmployeeFilters.tsx`)
- ✅ Типы данных (`AdminEmployee` в `types/admin.ts`)
- ✅ Хук для получения данных (`useEmployees`)
- ⚠️ Навигация к деталям - заглушки (TODO)
- ❌ Экран деталей сотрудника - отсутствует
- ❌ Форма добавления/редактирования - отсутствует
- ❌ Полный функционал управления - отсутствует

---

## 📁 Структура модуля

```
src/admin/screens/employees/
├── index.ts                              # Экспорт всех компонентов
├── EmployeesScreen.tsx                   # ✅ Список сотрудников (готов)
├── EmployeeDetailsScreen.tsx             # ❌ Детальная информация (создать)
├── EmployeeFormScreen.tsx                # ❌ Форма добавления/редактирования (создать)
│
├── components/
│   ├── EmployeeCard.tsx                  # ✅ Карточка в списке (готова)
│   ├── EmployeeFilters.tsx               # ✅ Панель фильтров (готова)
│   ├── EmployeeHeader.tsx                # ❌ Шапка профиля с фото (создать)
│   ├── EmployeeStats.tsx                 # ❌ Статистика сотрудника (создать)
│   ├── EmployeeInfoSection.tsx           # ❌ Блок информации (создать)
│   ├── EmployeeShiftHistory.tsx          # ❌ История смен (создать)
│   ├── EmployeeActions.tsx               # ❌ Меню действий (создать)
│   └── EmployeeStatusBadge.tsx           # ❌ Бейдж статуса (создать)
│
├── hooks/
│   ├── useEmployees.ts                   # ✅ Получение списка (готов)
│   ├── useEmployeeDetails.ts             # ❌ Получение деталей (создать)
│   ├── useEmployeeForm.ts                # ❌ Форма (валидация, сабмит) (создать)
│   ├── useEmployeeActions.ts             # ❌ Действия над сотрудником (создать)
│   └── useEmployeeStats.ts               # ❌ Получение статистики (создать)
│
└── types/
    └── employee.types.ts                 # ❌ Дополнительные типы для форм (создать)
```

---

## 🎨 Дизайн и UX

### Цветовая схема статусов

```typescript
// Статусы занятости
const employmentStatusColors = {
  working: tokens.colors.success.main,      // 🟢 На смене (зелёный)
  day_off: tokens.colors.text.secondary,    // ⚪ Выходной (серый)
  sick_leave: tokens.colors.warning.main,   // 🟡 Больничный (оранжевый)
  vacation: tokens.colors.info.dark,        // 🔵 Отпуск (синий)
  fired: tokens.colors.error.main,          // 🔴 Уволен (красный)
};

// Статусы активности
const activeStatusColors = {
  active: tokens.colors.success.main,       // Активен
  inactive: tokens.colors.gray[400],        // Неактивен
};

// Должности
const positionColors = {
  trainee: tokens.colors.info.main,         // Стажёр (синий)
  employee: tokens.colors.primary.main,     // Сотрудник (фиолетовый)
  senior: tokens.colors.warning.main,       // Старший сотрудник (оранжевый)
  manager: tokens.colors.success.main,      // Менеджер (зелёный)
};
```

### Иконки Material Community Icons

```typescript
// Статусы занятости
const employmentStatusIcons = {
  working: 'clock-check',           // На смене
  day_off: 'home',                  // Выходной
  sick_leave: 'medical-bag',        // Больничный
  vacation: 'beach',                // Отпуск
  fired: 'account-off',             // Уволен
};

// Должности
const positionIcons = {
  trainee: 'school-outline',        // Стажёр
  employee: 'account-outline',      // Сотрудник
  senior: 'account-star-outline',   // Старший сотрудник
  manager: 'account-tie',           // Менеджер
};

// Действия
const actionIcons = {
  edit: 'pencil',                   // Редактировать
  delete: 'delete',                 // Удалить
  chat: 'chat',                     // Чат
  phone: 'phone',                   // Позвонить
  email: 'email',                   // Email
  history: 'history',               // История
  stats: 'chart-line',              // Статистика
  schedule: 'calendar',             // График
  addTask: 'plus-circle',           // Добавить задачу
};
```

### Отступы и размеры

```typescript
// Отступы
const spacing = {
  screenPadding: 16,        // Отступ от краёв экрана
  cardPadding: 16,          // Внутри карточки
  cardGap: 12,              // Между карточками
  sectionGap: 24,           // Между секциями
  elementGap: 8,            // Между элементами
};

// Размеры аватаров
const avatarSizes = {
  list: 60,                 // В списке
  details: 80,              // На экране деталей
  form: 100,                // В форме редактирования
};

// Радиусы скругления
const radius = {
  card: 12,                 // Карточки
  button: 8,                // Кнопки
  badge: 4,                 // Бейджи
  avatar: 999,              // Аватары (полный круг)
};
```

---

## 📝 Детальный план этапов

### 🔹 ЭТАП 1: Навигация и типы (1-2 часа)

#### Задачи:
1. **Добавить роуты в навигацию**
   - `EmployeeDetails` - экран деталей сотрудника
   - `EmployeeForm` - форма добавления/редактирования
   
2. **Создать дополнительные типы**
   - `EmployeeFormData` - данные формы
   - `EmployeeFormErrors` - ошибки валидации
   - `EmployeeAction` - типы действий над сотрудником

#### Файлы для изменения:
- `/src/types/navigation.ts` - добавить новые роуты
- `/src/admin/screens/employees/types/employee.types.ts` - создать новый файл с типами

#### Код для типов:

```typescript
// src/admin/screens/employees/types/employee.types.ts

/**
 * Данные формы сотрудника
 */
export interface EmployeeFormData {
  // Основная информация
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  
  // Должность и статус
  position: 'trainee' | 'employee' | 'senior' | 'manager';
  employmentStatus: 'working' | 'day_off' | 'sick_leave' | 'vacation' | 'fired';
  isActive: boolean;
  
  // ПВЗ
  pvzId: string;
  
  // Даты
  hiredAt: Date;
  
  // Финансы
  baseSalary?: number;
}

/**
 * Ошибки валидации формы
 */
export interface EmployeeFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  pvzId?: string;
  position?: string;
  [key: string]: string | undefined;
}

/**
 * Тип действия над сотрудником
 */
export type EmployeeActionType =
  | 'edit'           // Редактировать
  | 'delete'         // Удалить
  | 'chat'           // Открыть чат
  | 'call'           // Позвонить
  | 'email'          // Написать email
  | 'viewHistory'    // Посмотреть историю
  | 'viewStats'      // Посмотреть статистику
  | 'changeStatus'   // Изменить статус
  | 'assignTask';    // Назначить задачу

/**
 * Действие над сотрудником
 */
export interface EmployeeAction {
  type: EmployeeActionType;
  label: string;
  icon: string;
  color?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}
```

---

### 🔹 ЭТАП 2: Экран деталей сотрудника (2-3 часа)

#### Цель:
Создать экран с полной информацией о сотруднике, его статистикой и историей смен.

#### Структура экрана:
1. **Шапка профиля** (`EmployeeHeader`)
   - Большой аватар
   - Имя и должность
   - Статус (на смене / выходной / отпуск и т.д.)
   - Кнопки быстрых действий (чат, звонок)

2. **Статистика** (`EmployeeStats`)
   - Всего смен
   - Отработано часов
   - Средний рейтинг
   - Выполнено задач

3. **Блоки информации** (`EmployeeInfoSection`)
   - Контактная информация (телефон, email)
   - Информация о работе (дата найма, ПВЗ)
   - Финансы (зарплата, премии, штрафы)

4. **История смен** (`EmployeeShiftHistory`)
   - Последние 10 смен
   - Дата, время, длительность
   - Кнопка "Показать всё"

5. **Нижняя панель действий**
   - Редактировать
   - Удалить
   - Дополнительные действия (меню)

#### Файлы для создания:

**1. EmployeeDetailsScreen.tsx**
```typescript
// src/admin/screens/employees/EmployeeDetailsScreen.tsx

import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { tokens, LoadingState, ErrorState, Button } from '../../../ui';
import { EmployeeHeader } from './components/EmployeeHeader';
import { EmployeeStats } from './components/EmployeeStats';
import { EmployeeInfoSection } from './components/EmployeeInfoSection';
import { EmployeeShiftHistory } from './components/EmployeeShiftHistory';
import { useEmployeeDetails } from './hooks/useEmployeeDetails';
import { useEmployeeActions } from './hooks/useEmployeeActions';

export const EmployeeDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { employeeId } = route.params as { employeeId: string };
  
  const { employee, loading, error, refresh } = useEmployeeDetails(employeeId);
  const { deleteEmployee, changeStatus } = useEmployeeActions();

  const handleEdit = () => {
    navigation.navigate('EmployeeForm', { employeeId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить сотрудника?',
      `Вы уверены, что хотите удалить ${employee?.name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await deleteEmployee(employeeId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleChat = () => {
    // TODO: Открыть чат
    console.log('Open chat with employee:', employeeId);
  };

  const handleCall = () => {
    // TODO: Позвонить
    console.log('Call employee:', employee?.phone);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !employee) {
    return <ErrorState message={error || 'Сотрудник не найден'} onRetry={refresh} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}>
      <ScrollView>
        {/* Шапка профиля */}
        <EmployeeHeader
          employee={employee}
          onChat={handleChat}
          onCall={handleCall}
        />

        {/* Статистика */}
        <EmployeeStats stats={employee.stats} />

        {/* Информация */}
        <EmployeeInfoSection
          title="Контакты"
          items={[
            { label: 'Телефон', value: employee.phone, icon: 'phone' },
            { label: 'Email', value: employee.email || '—', icon: 'email' },
          ]}
        />

        <EmployeeInfoSection
          title="Работа"
          items={[
            { label: 'Должность', value: getPositionLabel(employee.position), icon: 'badge-account' },
            { label: 'ПВЗ', value: employee.pvzName || '—', icon: 'map-marker' },
            { label: 'Дата найма', value: formatDate(employee.hiredAt), icon: 'calendar' },
          ]}
        />

        <EmployeeInfoSection
          title="Финансы"
          items={[
            { label: 'Заработано', value: `${employee.salary.earned} ₽`, icon: 'cash' },
            { label: 'Премии', value: `+${employee.salary.bonuses} ₽`, icon: 'gift' },
            { label: 'Штрафы', value: `-${employee.salary.penalties} ₽`, icon: 'alert' },
            { label: 'Итого', value: `${employee.salary.total} ₽`, icon: 'wallet', highlight: true },
          ]}
        />

        {/* История смен */}
        <EmployeeShiftHistory employeeId={employeeId} />
      </ScrollView>

      {/* Нижняя панель действий */}
      <View 
        style={{ 
          padding: 16, 
          backgroundColor: tokens.colors.surface,
          borderTopWidth: 1,
          borderTopColor: tokens.colors.gray[200],
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <Button
          label="Редактировать"
          onPress={handleEdit}
          variant="primary"
          style={{ flex: 1 }}
        />
        <Button
          label="Удалить"
          onPress={handleDelete}
          variant="danger"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

// Вспомогательные функции
const getPositionLabel = (position: string) => {
  const labels: Record<string, string> = {
    trainee: 'Стажёр',
    employee: 'Сотрудник',
    senior: 'Старший сотрудник',
    manager: 'Менеджер',
  };
  return labels[position] || position;
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
```

**2. EmployeeHeader.tsx** (компонент)
```typescript
// src/admin/screens/employees/components/EmployeeHeader.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, IconButton } from '../../../../ui';
import { AdminEmployee } from '../../../../types/admin';

interface EmployeeHeaderProps {
  employee: AdminEmployee;
  onChat: () => void;
  onCall: () => void;
}

export const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  employee,
  onChat,
  onCall,
}) => {
  // Генерация цвета аватара на основе имени
  const getAvatarColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
    ];
    const index = employee.name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = () => {
    const names = employee.name.split(' ');
    return names.length >= 2 
      ? `${names[0][0]}${names[1][0]}`
      : names[0].substring(0, 2);
  };

  const getPositionLabel = () => {
    const labels: Record<string, string> = {
      trainee: 'Стажёр',
      employee: 'Сотрудник ПВЗ',
      senior: 'Старший сотрудник',
      manager: 'Менеджер ПВЗ',
    };
    return labels[employee.position || 'employee'];
  };

  const getStatusInfo = () => {
    if (!employee.isActive) {
      return { text: 'Уволен', color: tokens.colors.error.main };
    }
    
    switch (employee.employmentStatus) {
      case 'working':
        return { text: 'На смене', color: tokens.colors.success.main };
      case 'sick_leave':
        return { text: 'Больничный', color: tokens.colors.warning.main };
      case 'vacation':
        return { text: 'В отпуске', color: tokens.colors.info.dark };
      case 'day_off':
      default:
        return { text: 'Выходной', color: tokens.colors.text.secondary };
    }
  };

  const status = getStatusInfo();

  return (
    <View style={styles.container}>
      {/* Аватар */}
      <View style={styles.avatarContainer}>
        {employee.avatar ? (
          <Avatar.Image size={80} source={{ uri: employee.avatar }} />
        ) : (
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={{ backgroundColor: getAvatarColor() }}
          />
        )}
        
        {/* Индикатор статуса */}
        {employee.isActive && employee.isOnShift && (
          <View style={styles.statusDot}>
            <View style={[styles.dotInner, { backgroundColor: tokens.colors.success.main }]} />
          </View>
        )}
      </View>

      {/* Информация */}
      <View style={styles.infoContainer}>
        <Text variant="headlineSmall" style={styles.name}>
          {employee.name}
        </Text>
        
        <Text variant="bodyMedium" style={styles.position}>
          {getPositionLabel()}
        </Text>
        
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.text}
          </Text>
        </View>
      </View>

      {/* Быстрые действия */}
      <View style={styles.actions}>
        <IconButton
          icon="chat"
          size={48}
          onPress={onChat}
          bg={tokens.colors.primary.light}
          color={tokens.colors.primary.main}
        />
        <IconButton
          icon="phone"
          size={48}
          onPress={onCall}
          bg={tokens.colors.success.lighter}
          color={tokens.colors.success.dark}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gray[200],
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 3,
    borderWidth: 3,
    borderColor: tokens.colors.surface,
  },
  dotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: 4,
  },
  position: {
    color: tokens.colors.text.secondary,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: tokens.colors.gray[100],
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
```

**3. EmployeeStats.tsx** (компонент)
```typescript
// src/admin/screens/employees/components/EmployeeStats.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../../../ui';
import { AdminEmployee } from '../../../../types/admin';

interface EmployeeStatsProps {
  stats: AdminEmployee['stats'];
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color = tokens.colors.primary.main }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={icon as any} size={24} color={color} />
    </View>
    <Text variant="bodySmall" style={styles.statLabel}>
      {label}
    </Text>
    <Text variant="titleLarge" style={styles.statValue}>
      {value}
    </Text>
  </View>
);

export const EmployeeStats: React.FC<EmployeeStatsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Статистика
      </Text>
      
      <View style={styles.grid}>
        <StatCard
          icon="calendar-check"
          label="Смен"
          value={stats.totalShifts}
          color={tokens.colors.primary.main}
        />
        <StatCard
          icon="clock-outline"
          label="Часов"
          value={stats.totalHours}
          color={tokens.colors.info.main}
        />
        <StatCard
          icon="star"
          label="Рейтинг"
          value={stats.averageRating.toFixed(1)}
          color={tokens.colors.warning.main}
        />
        <StatCard
          icon="check-circle"
          label="Задач"
          value={stats.completedTasks}
          color={tokens.colors.success.main}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    marginTop: 8,
  },
  title: {
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: tokens.colors.screenBackground,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: tokens.colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
});
```

**4. EmployeeInfoSection.tsx** (компонент)
```typescript
// src/admin/screens/employees/components/EmployeeInfoSection.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../../../ui';

interface InfoItem {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}

interface EmployeeInfoSectionProps {
  title: string;
  items: InfoItem[];
}

export const EmployeeInfoSection: React.FC<EmployeeInfoSectionProps> = ({ title, items }) => {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemLeft}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={20}
                color={tokens.colors.text.secondary}
              />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text 
              style={[
                styles.value,
                item.highlight && styles.valueHighlight,
              ]}
              numberOfLines={1}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    marginTop: 8,
  },
  title: {
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: 12,
  },
  itemsContainer: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    maxWidth: '50%',
  },
  valueHighlight: {
    color: tokens.colors.primary.main,
    fontSize: 16,
  },
});
```

**5. EmployeeShiftHistory.tsx** (компонент)
```typescript
// src/admin/screens/employees/components/EmployeeShiftHistory.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, Button } from '../../../../ui';

interface EmployeeShiftHistoryProps {
  employeeId: string;
}

// Временная заглушка с моковыми данными
const MOCK_SHIFTS = [
  { id: '1', date: '01.11.2025', duration: '8 ч 30 мин', status: 'finished' },
  { id: '2', date: '30.10.2025', duration: '9 ч 15 мин', status: 'finished' },
  { id: '3', date: '28.10.2025', duration: '8 ч 00 мин', status: 'finished' },
];

export const EmployeeShiftHistory: React.FC<EmployeeShiftHistoryProps> = ({ employeeId }) => {
  const handleShowAll = () => {
    console.log('Show all shifts for:', employeeId);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        История смен
      </Text>
      
      <View style={styles.shiftsContainer}>
        {MOCK_SHIFTS.map((shift) => (
          <View key={shift.id} style={styles.shiftItem}>
            <View style={styles.shiftLeft}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={20}
                color={tokens.colors.success.main}
              />
              <Text style={styles.shiftDate}>{shift.date}</Text>
            </View>
            <Text style={styles.shiftDuration}>{shift.duration}</Text>
          </View>
        ))}
      </View>
      
      <Button
        label="Показать всё"
        onPress={handleShowAll}
        variant="text"
        style={{ marginTop: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    marginTop: 8,
  },
  title: {
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: 12,
  },
  shiftsContainer: {
    gap: 12,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gray[200],
  },
  shiftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shiftDate: {
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  shiftDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
});
```

**6. useEmployeeDetails.ts** (хук)
```typescript
// src/admin/screens/employees/hooks/useEmployeeDetails.ts

import { useState, useEffect } from 'react';
import { AdminEmployee } from '../../../../types/admin';

/**
 * Хук для получения детальной информации о сотруднике
 */
export const useEmployeeDetails = (employeeId: string) => {
  const [employee, setEmployee] = useState<AdminEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Заменить на реальный API запрос
      // const response = await api.get(`/employees/${employeeId}`);
      // setEmployee(response.data);
      
      // Пока используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Здесь должен быть реальный запрос к API
      setEmployee(null);
      setError('API не подключен (моковые данные)');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  return {
    employee,
    loading,
    error,
    refresh: fetchEmployee,
  };
};
```

**7. useEmployeeActions.ts** (хук)
```typescript
// src/admin/screens/employees/hooks/useEmployeeActions.ts

import { useState } from 'react';

/**
 * Хук для действий над сотрудником
 */
export const useEmployeeActions = () => {
  const [loading, setLoading] = useState(false);

  const deleteEmployee = async (employeeId: string) => {
    try {
      setLoading(true);
      
      // TODO: Заменить на реальный API запрос
      // await api.delete(`/employees/${employeeId}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Employee deleted:', employeeId);
      
    } catch (err) {
      console.error('Error deleting employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (employeeId: string, status: string) => {
    try {
      setLoading(true);
      
      // TODO: Заменить на реальный API запрос
      // await api.patch(`/employees/${employeeId}`, { status });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Employee status changed:', employeeId, status);
      
    } catch (err) {
      console.error('Error changing status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteEmployee,
    changeStatus,
    loading,
  };
};
```

---

### 🔹 ЭТАП 3: Форма добавления/редактирования (3-4 часа)

#### Цель:
Создать универсальную форму для добавления нового сотрудника и редактирования существующего.

#### Структура формы:
1. **Шапка** - "Новый сотрудник" или "Редактирование"
2. **Блоки полей:**
   - Фото профиля (загрузка/изменение)
   - Основная информация (ФИО, телефон, email)
   - Должность и статус
   - Привязка к ПВЗ
   - Дата найма
   - Зарплата (опционально)
3. **Валидация** - проверка всех полей перед отправкой
4. **Кнопки** - "Сохранить" и "Отмена"

#### Файлы для создания:

**1. EmployeeFormScreen.tsx**
```typescript
// src/admin/screens/employees/EmployeeFormScreen.tsx

import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { tokens, Button, LoadingState } from '../../../ui';
import { useEmployeeForm } from './hooks/useEmployeeForm';

// Здесь будет полная реализация формы с:
// - Загрузкой фото
// - Полями ввода
// - Валидацией
// - Отправкой данных
```

**2. useEmployeeForm.ts** (хук)
```typescript
// src/admin/screens/employees/hooks/useEmployeeForm.ts

import { useState, useEffect } from 'react';
import { EmployeeFormData, EmployeeFormErrors } from '../types/employee.types';

/**
 * Хук для управления формой сотрудника
 */
export const useEmployeeForm = (employeeId?: string) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    phone: '',
    email: '',
    position: 'employee',
    employmentStatus: 'day_off',
    isActive: true,
    pvzId: '',
    hiredAt: new Date(),
  });

  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [loading, setLoading] = useState(false);

  // Валидация формы
  const validate = (): boolean => {
    const newErrors: EmployeeFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя сотрудника';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.pvzId) {
      newErrors.pvzId = 'Выберите ПВЗ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Отправка формы
  const submit = async () => {
    if (!validate()) {
      return false;
    }

    try {
      setLoading(true);
      
      // TODO: Реальный API запрос
      if (employeeId) {
        // await api.put(`/employees/${employeeId}`, formData);
      } else {
        // await api.post('/employees', formData);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
      
    } catch (err) {
      console.error('Error submitting form:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    loading,
    validate,
    submit,
  };
};
```

---

### 🔹 ЭТАП 4: Интеграция с навигацией (1 час)

#### Задачи:
1. Подключить новые экраны к навигации
2. Настроить передачу параметров между экранами
3. Настроить заголовки и кнопки в AppBar

#### Файлы для изменения:
- `/src/navigation/AdminNavigator.tsx` (или аналогичный)

---

### 🔹 ЭТАП 5: API интеграция (2-3 часа)

#### Задачи:
1. Создать API сервис для работы с сотрудниками
2. Заменить моковые данные на реальные запросы
3. Добавить обработку ошибок
4. Добавить кэширование данных (опционально)

#### Файлы для создания:
- `/src/admin/services/employeeService.ts`

```typescript
// src/admin/services/employeeService.ts

import { api } from '../../services/api';
import { AdminEmployee } from '../../types/admin';
import { EmployeeFormData } from '../screens/employees/types/employee.types';

/**
 * Сервис для работы с сотрудниками
 */
export const employeeService = {
  /**
   * Получить список всех сотрудников
   */
  async getAll(filters?: any): Promise<AdminEmployee[]> {
    const response = await api.get('/employees', { params: filters });
    return response.data;
  },

  /**
   * Получить сотрудника по ID
   */
  async getById(id: string): Promise<AdminEmployee> {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  /**
   * Создать нового сотрудника
   */
  async create(data: EmployeeFormData): Promise<AdminEmployee> {
    const response = await api.post('/employees', data);
    return response.data;
  },

  /**
   * Обновить данные сотрудника
   */
  async update(id: string, data: Partial<EmployeeFormData>): Promise<AdminEmployee> {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  /**
   * Удалить сотрудника
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/employees/${id}`);
  },

  /**
   * Изменить статус сотрудника
   */
  async changeStatus(id: string, status: string): Promise<AdminEmployee> {
    const response = await api.patch(`/employees/${id}/status`, { status });
    return response.data;
  },
};
```

---

### 🔹 ЭТАП 6: Полировка и оптимизация (1-2 часа)

#### Задачи:
1. Добавить анимации переходов
2. Добавить скелетоны загрузки
3. Оптимизировать производительность списка (мемоизация)
4. Добавить индикаторы загрузки
5. Протестировать на реальном устройстве

---

## ✅ Чеклист реализации

### Этап 1: Навигация и типы
- [ ] Добавить роуты в навигацию (`EmployeeDetails`, `EmployeeForm`)
- [ ] Создать файл с типами (`employee.types.ts`)
- [ ] Определить `EmployeeFormData`, `EmployeeFormErrors`, `EmployeeAction`

### Этап 2: Экран деталей
- [ ] Создать `EmployeeDetailsScreen.tsx`
- [ ] Создать компонент `EmployeeHeader.tsx`
- [ ] Создать компонент `EmployeeStats.tsx`
- [ ] Создать компонент `EmployeeInfoSection.tsx`
- [ ] Создать компонент `EmployeeShiftHistory.tsx`
- [ ] Создать хук `useEmployeeDetails.ts`
- [ ] Создать хук `useEmployeeActions.ts`
- [ ] Добавить навигацию к экрану деталей из списка
- [ ] Протестировать экран с моковыми данными

### Этап 3: Форма добавления/редактирования
- [ ] Создать `EmployeeFormScreen.tsx`
- [ ] Добавить поля ввода для всех данных
- [ ] Реализовать загрузку фото профиля
- [ ] Создать хук `useEmployeeForm.ts` с валидацией
- [ ] Добавить обработку ошибок валидации
- [ ] Добавить кнопки "Сохранить" и "Отмена"
- [ ] Протестировать форму создания
- [ ] Протестировать форму редактирования

### Этап 4: Интеграция с навигацией
- [ ] Подключить `EmployeeDetailsScreen` к навигации
- [ ] Подключить `EmployeeFormScreen` к навигации
- [ ] Настроить передачу параметров между экранами
- [ ] Настроить заголовки экранов
- [ ] Добавить кнопку "Добавить" на экране списка

### Этап 5: API интеграция
- [ ] Создать сервис `employeeService.ts`
- [ ] Заменить моковые данные в `useEmployees`
- [ ] Заменить моковые данные в `useEmployeeDetails`
- [ ] Подключить API к форме создания
- [ ] Подключить API к форме редактирования
- [ ] Добавить обработку ошибок API
- [ ] Добавить индикаторы загрузки

### Этап 6: Полировка
- [ ] Добавить анимации переходов
- [ ] Добавить скелетоны загрузки
- [ ] Оптимизировать список (мемоизация)
- [ ] Добавить pull-to-refresh на всех экранах
- [ ] Протестировать на реальном устройстве
- [ ] Исправить найденные баги
- [ ] Проверить адаптивность под разные размеры экрана

---

## 🎯 Приоритеты

### Критическая функциональность (Must Have):
1. ✅ Просмотр списка сотрудников - **ГОТОВО**
2. ✅ Поиск и фильтрация - **ГОТОВО**
3. ❌ Просмотр деталей сотрудника - **TODO**
4. ❌ Добавление нового сотрудника - **TODO**
5. ❌ Редактирование данных сотрудника - **TODO**

### Важная функциональность (Should Have):
6. ❌ Удаление сотрудника - **TODO**
7. ❌ Изменение статуса - **TODO**
8. ❌ Просмотр истории смен - **TODO**
9. ❌ Просмотр статистики - **TODO**

### Дополнительная функциональность (Nice to Have):
10. ❌ Экспорт данных сотрудников
11. ❌ Массовые операции
12. ❌ Уведомления о событиях
13. ❌ Интеграция с чатом
14. ❌ Интеграция с графиком

---

## 📊 Оценка времени

| Этап | Описание | Время |
|------|----------|-------|
| 1 | Навигация и типы | 1-2 часа |
| 2 | Экран деталей сотрудника | 2-3 часа |
| 3 | Форма добавления/редактирования | 3-4 часа |
| 4 | Интеграция с навигацией | 1 час |
| 5 | API интеграция | 2-3 часа |
| 6 | Полировка и оптимизация | 1-2 часа |
| **ИТОГО** | | **10-15 часов** |

---

## 🚀 Следующие шаги

1. **Начать с Этапа 1** - создать типы и настроить навигацию
2. **Перейти к Этапу 2** - реализовать экран деталей сотрудника
3. **Реализовать Этап 3** - создать форму добавления/редактирования
4. **Интегрировать с API** - подключить реальные данные
5. **Протестировать** - проверить все функции на устройстве
6. **Отполировать** - улучшить UX и производительность

---

## 📝 Примечания

### Используемые технологии:
- **React Native** - основа приложения
- **React Navigation** - навигация между экранами
- **React Native Paper** - Material Design компоненты
- **Zustand** - управление состоянием (если потребуется)
- **TypeScript** - типизация кода

### Стиль кода:
- Все пояснения и комментарии на **русском языке**
- Использовать **функциональные компоненты** с хуками
- Следовать **паттерну Feature-Sliced Design**
- Типизировать все props и state
- Использовать **tokens** для всех стилей

### Работа с данными:
- Сначала реализовать с **моковыми данными**
- Затем заменить на **реальные API запросы**
- Добавить обработку ошибок и загрузки
- Использовать **оптимистичные обновления** где возможно

---

## 🎉 Готово к реализации!

Этот план содержит:
- ✅ Подробное описание всех этапов
- ✅ Примеры кода для каждого компонента
- ✅ Чеклист для отслеживания прогресса
- ✅ Оценку времени на реализацию
- ✅ Приоритеты функциональности

**Можно начинать разработку прямо сейчас!** 🚀
