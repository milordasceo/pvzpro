# Готовность к разработке модуля "Персонал"

**Дата:** 20 октября 2025  
**Статус:** ✅ ГОТОВ К РАЗРАБОТКЕ

---

## 🎯 Цель модуля

Создать полнофункциональный модуль управления сотрудниками для администраторов и владельцев ПВЗ.

---

## 📋 Базовая функциональность

### 1. Просмотр списка сотрудников

- Карточки с основной информацией (фото, имя, должность, ПВЗ)
- Индикаторы статуса (активен, на больничном, в отпуске)
- Группировка по ПВЗ (опционально)
- Pull-to-refresh для обновления

### 2. Фильтрация и поиск

- Поиск по имени
- Фильтр по ПВЗ
- Фильтр по должности
- Фильтр по статусу
- Фильтр по типу занятости

### 3. Профиль сотрудника

- Полная информация
- История смен
- Статистика (опоздания, отработанные часы)
- Контактные данные
- Документы

### 4. Управление сотрудниками

- Добавление нового сотрудника
- Редактирование данных
- Изменение статуса
- Назначение на ПВЗ
- Удаление (с подтверждением)

---

## 🛠️ Готовая инфраструктура

### UI Компоненты

Все необходимые компоненты готовы в `src/ui/components/`:

#### Базовые компоненты

```typescript
import {
  Card, // Для карточек сотрудников
  Button, // Для действий
  IconButton, // Для иконок действий
  Badge, // Для статусов и меток
  Chip, // Для тегов
} from '../ui';
```

#### Компоненты ввода

```typescript
import {
  TextInput, // Для форм
  SelectModal, // Для выбора из списков
} from '../ui';
```

#### Компоненты состояния

```typescript
import {
  EmptyState, // Для пустых списков
  ErrorState, // Для ошибок
  LoadingState, // Для загрузки
} from '../ui';
```

#### React Native Paper

```typescript
import {
  Avatar, // Для фото сотрудников
  Searchbar, // Для поиска
  Menu, // Для контекстных меню
  Portal, // Для модальных окон
  Modal, // Для диалогов
} from 'react-native-paper';
```

### Design Tokens

```typescript
import { tokens } from '../ui';

// Цвета
tokens.colors.primary.main; // Основной цвет
tokens.colors.success.main; // Статус "активен"
tokens.colors.warning.main; // Статус "на проверке"
tokens.colors.error.main; // Статус "уволен"
tokens.colors.gray[100]; // Фон

// Типографика
tokens.typography.h1; // Заголовки
tokens.typography.body1; // Основной текст
tokens.typography.caption; // Мелкий текст

// Отступы
tokens.spacing.xs; // 4px
tokens.spacing.sm; // 8px
tokens.spacing.md; // 16px
tokens.spacing.lg; // 24px
tokens.spacing.xl; // 32px
```

---

## 📁 Рекомендуемая структура

```
src/admin/screens/employees/
├── EmployeesScreen.tsx              # Главный экран со списком
├── EmployeeDetailsScreen.tsx        # Детальная информация
├── EmployeeFormScreen.tsx           # Форма добавления/редактирования
│
├── components/
│   ├── EmployeeCard.tsx             # Карточка в списке
│   ├── EmployeeFilters.tsx          # Панель фильтров
│   ├── EmployeeSearchBar.tsx        # Поиск
│   ├── EmployeeStats.tsx            # Статистика сотрудника
│   ├── EmployeeActions.tsx          # Меню действий
│   └── EmployeeStatusBadge.tsx      # Бейдж статуса
│
├── hooks/
│   ├── useEmployees.ts              # Получение списка
│   ├── useEmployeeDetails.ts        # Получение деталей
│   ├── useEmployeeForm.ts           # Форма (валидация, сабмит)
│   └── useEmployeeFilters.ts        # Логика фильтрации
│
└── types/
    └── employee.types.ts            # TypeScript типы
```

---

## 🔤 TypeScript типы

### Основные типы

```typescript
// src/admin/screens/employees/types/employee.types.ts

export type EmployeeStatus = 'active' | 'inactive' | 'vacation' | 'sick' | 'fired';
export type EmployeePosition = 'trainee' | 'employee' | 'senior' | 'manager';
export type EmploymentType = 'full_time' | 'part_time' | 'contractor';

export interface Employee {
  id: string;
  name: string;
  photo?: string;
  phone: string;
  email?: string;

  // Должность
  position: EmployeePosition;
  employmentType: EmploymentType;

  // ПВЗ
  pvzId: string;
  pvzName: string;

  // Статус
  status: EmployeeStatus;

  // Даты
  hireDate: Date;
  birthDate?: Date;

  // Финансы
  salary?: number;

  // Статистика
  stats?: EmployeeStats;
}

export interface EmployeeStats {
  totalShifts: number;
  hoursWorked: number;
  lateCount: number;
  perfectDays: number;
}

export interface EmployeeFilters {
  search?: string;
  pvzId?: string;
  status?: EmployeeStatus;
  position?: EmployeePosition;
  employmentType?: EmploymentType;
}
```

---

## 📝 Примеры кода

### 1. Список сотрудников

```typescript
// src/admin/screens/employees/EmployeesScreen.tsx

import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { tokens, EmptyState, ErrorState } from '../../../ui';
import { EmployeeCard } from './components/EmployeeCard';
import { EmployeeFilters } from './components/EmployeeFilters';
import { useEmployees } from './hooks/useEmployees';

export const EmployeesScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<EmployeeFilters>({});

  const { employees, loading, error, refetch } = useEmployees({ search, ...filters });

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.gray[100] }}>
      {/* Поиск */}
      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Поиск сотрудников..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Фильтры */}
      <EmployeeFilters
        filters={filters}
        onChange={setFilters}
      />

      {/* Список */}
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EmployeeCard employee={item} />}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="account-off-outline"
            title="Нет сотрудников"
            description="Добавьте первого сотрудника"
          />
        }
      />
    </View>
  );
};
```

### 2. Карточка сотрудника

```typescript
// src/admin/screens/employees/components/EmployeeCard.tsx

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, Badge } from '../../../../ui';
import { Employee } from '../types/employee.types';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';

interface EmployeeCardProps {
  employee: Employee;
  onPress?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onPress }) => {
  const positionText = {
    trainee: 'Стажёр',
    employee: 'Сотрудник',
    senior: 'Старший сотрудник',
    manager: 'Менеджер',
  }[employee.position];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        backgroundColor: tokens.colors.surface,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
      }}
    >
      {/* Аватар */}
      <Avatar.Image
        size={56}
        source={{ uri: employee.photo || 'https://via.placeholder.com/56' }}
      />

      {/* Информация */}
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: tokens.colors.text.primary }}>
            {employee.name}
          </Text>
          <EmployeeStatusBadge status={employee.status} />
        </View>

        {/* Должность */}
        <Text style={{ fontSize: 14, color: tokens.colors.text.secondary }}>
          {positionText}
        </Text>

        {/* ПВЗ */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <MaterialCommunityIcons
            name="store"
            size={14}
            color={tokens.colors.text.muted}
          />
          <Text style={{ fontSize: 12, color: tokens.colors.text.muted }}>
            {employee.pvzName}
          </Text>
        </View>
      </View>

      {/* Стрелка */}
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={tokens.colors.text.muted}
      />
    </TouchableOpacity>
  );
};
```

### 3. Бейдж статуса

```typescript
// src/admin/screens/employees/components/EmployeeStatusBadge.tsx

import React from 'react';
import { Badge } from '../../../../ui';
import { EmployeeStatus } from '../types/employee.types';

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
}

export const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status }) => {
  const config = {
    active: { text: 'Активен', variant: 'success' as const },
    inactive: { text: 'Неактивен', variant: 'neutral' as const },
    vacation: { text: 'В отпуске', variant: 'info' as const },
    sick: { text: 'Больничный', variant: 'warning' as const },
    fired: { text: 'Уволен', variant: 'error' as const },
  }[status];

  return <Badge text={config.text} variant={config.variant} />;
};
```

---

## 🔌 API интеграция

### Хук для получения данных

```typescript
// src/admin/screens/employees/hooks/useEmployees.ts

import { useState, useEffect } from 'react';
import { Employee, EmployeeFilters } from '../types/employee.types';
import { api } from '../../../services/api';

export const useEmployees = (filters: EmployeeFilters) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.get('/employees', { params: filters });
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
  };
};
```

---

## 🎨 Дизайн рекомендации

### Цветовая схема статусов

```typescript
const statusColors = {
  active: tokens.colors.success.main, // Зелёный
  inactive: tokens.colors.gray[400], // Серый
  vacation: tokens.colors.info.main, // Синий
  sick: tokens.colors.warning.main, // Оранжевый
  fired: tokens.colors.error.main, // Красный
};
```

### Иконки

```typescript
const positionIcons = {
  trainee: 'school-outline',
  employee: 'account-outline',
  senior: 'account-star-outline',
  manager: 'account-tie',
};
```

### Отступы

- Между карточками: `8px`
- Внутри карточки: `16px`
- От краёв экрана: `16px`
- Между элементами в карточке: `4px`

---

## ✅ Чеклист разработки

### Этап 1: Базовый функционал

- [ ] Создать структуру файлов
- [ ] Определить TypeScript типы
- [ ] Создать моковые данные для разработки
- [ ] Реализовать `EmployeesScreen` со списком
- [ ] Реализовать `EmployeeCard`
- [ ] Добавить pull-to-refresh

### Этап 2: Поиск и фильтрация

- [ ] Реализовать `Searchbar`
- [ ] Реализовать `EmployeeFilters`
- [ ] Добавить логику фильтрации в хук
- [ ] Добавить сброс фильтров

### Этап 3: Детали и действия

- [ ] Создать `EmployeeDetailsScreen`
- [ ] Добавить навигацию к деталям
- [ ] Реализовать действия (редактировать, удалить)
- [ ] Добавить подтверждение удаления

### Этап 4: Добавление/Редактирование

- [ ] Создать `EmployeeFormScreen`
- [ ] Добавить валидацию формы
- [ ] Реализовать загрузку фото
- [ ] Добавить выбор ПВЗ через `SelectModal`

### Этап 5: Интеграция с API

- [ ] Подключить реальные API эндпоинты
- [ ] Обработать ошибки
- [ ] Добавить оптимистичные обновления
- [ ] Кэширование данных

### Этап 6: Полировка

- [ ] Добавить анимации
- [ ] Оптимизировать производительность
- [ ] Добавить скелетоны загрузки
- [ ] Тестирование на устройстве

---

## 🚀 Готово к старту!

Вся инфраструктура готова, примеры кода предоставлены, типы определены.

**Можно начинать разработку прямо сейчас!** 🎉
