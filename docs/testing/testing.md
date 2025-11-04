# 🧪 Руководство по тестированию

> Полное руководство по написанию и запуску тестов для проекта WB ПВЗ

**Дата**: 3 ноября 2025

---

## 📋 Содержание

- [Стратегия тестирования](#стратегия-тестирования)
- [Настройка окружения](#настройка-окружения)
- [Типы тестов](#типы-тестов)
- [Запуск тестов](#запуск-тестов)
- [Написание тестов](#написание-тестов)
- [Best Practices](#best-practices)
- [Покрытие кода](#покрытие-кода)

---

## Стратегия тестирования

### Пирамида тестов

```
        /\
       /  \
      / E2E \          ← Мало, критичные user flows
     /--------\
    /          \
   / Integration \     ← Средне, взаимодействие модулей
  /--------------\
 /                \
/   Unit Tests     \   ← Много, функции и компоненты
--------------------
```

### Целевые метрики покрытия

- **Unit тесты**: ≥80% для нового кода
- **Integration тесты**: ≥60% для критичных потоков
- **E2E тесты**: 100% для happy path критичных функций

### Приоритеты тестирования

**Высокий приоритет** (обязательно тестировать):

1. Бизнес-логика (утилиты, хелперы, валидаторы)
2. Custom hooks
3. Store логика (Zustand stores)
4. API сервисы
5. Критичные компоненты (Login, Dashboard)

**Средний приоритет** (желательно тестировать):

1. UI компоненты (презентационные)
2. Навигация
3. Форматеры и парсеры

**Низкий приоритет** (опционально):

1. Простые компоненты-обёртки
2. Типы и интерфейсы
3. Конфигурационные файлы

---

## Настройка окружения

### Установка зависимостей

> **Примечание**: Тесты пока не настроены в проекте. Этот раздел содержит план настройки.

```bash
# Jest и React Native Testing Library
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Дополнительные утилиты
npm install --save-dev @testing-library/react-hooks
npm install --save-dev jest-expo

# Моки для React Native модулей
npm install --save-dev react-native-testing-mocks
```

### Конфигурация Jest

Создайте `jest.config.js` в корне проекта:

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
  ],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
};
```

### package.json скрипты

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

---

## Типы тестов

### 1. Unit тесты

**Назначение**: Тестирование изолированных функций и компонентов

**Что тестируем**:

- Утилиты (formatters, validators)
- Чистые функции
- Custom hooks (изолированно)
- Простые компоненты

**Инструменты**: Jest

**Пример**:

```typescript
// src/utils/__tests__/formatDate.test.ts
import { formatDate } from '../formatDate';

describe('formatDate', () => {
  it('should format date to DD.MM.YYYY', () => {
    const date = new Date('2025-11-03T10:00:00Z');
    expect(formatDate(date)).toBe('03.11.2025');
  });

  it('should handle invalid date', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('should handle edge case: leap year', () => {
    const date = new Date('2024-02-29T10:00:00Z');
    expect(formatDate(date)).toBe('29.02.2024');
  });
});
```

---

### 2. Component тесты

**Назначение**: Тестирование React компонентов

**Что тестируем**:

- Рендеринг компонента
- Props обработка
- User interactions (нажатия, ввод)
- Условный рендеринг
- Состояния (loading, error, empty)

**Инструменты**: Jest + React Native Testing Library

**Пример**:

```typescript
// src/components/__tests__/EmployeeCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmployeeCard } from '../EmployeeCard';

describe('EmployeeCard', () => {
  const mockEmployee = {
    id: '1',
    name: 'Иван Иванов',
    position: 'Сотрудник ПВЗ',
    status: 'active',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('should render employee information', () => {
    const { getByText } = render(<EmployeeCard employee={mockEmployee} />);

    expect(getByText('Иван Иванов')).toBeTruthy();
    expect(getByText('Сотрудник ПВЗ')).toBeTruthy();
  });

  it('should call onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <EmployeeCard employee={mockEmployee} onPress={onPress} />
    );

    fireEvent.press(getByTestId('employee-card'));
    expect(onPress).toHaveBeenCalledWith(mockEmployee);
  });

  it('should render active status badge', () => {
    const { getByText } = render(<EmployeeCard employee={mockEmployee} />);
    expect(getByText('Активен')).toBeTruthy();
  });

  it('should render inactive status badge', () => {
    const inactiveEmployee = { ...mockEmployee, status: 'inactive' };
    const { getByText } = render(<EmployeeCard employee={inactiveEmployee} />);
    expect(getByText('Неактивен')).toBeTruthy();
  });
});
```

---

### 3. Hook тесты

**Назначение**: Тестирование custom React hooks

**Что тестируем**:

- Начальное состояние
- Обновление состояния
- Эффекты
- Взаимодействие со store

**Инструменты**: Jest + @testing-library/react-hooks

**Пример**:

```typescript
// src/hooks/__tests__/useEmployees.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useEmployees } from '../useEmployees';
import { employeeStore } from '../../store/employeeStore';

jest.mock('../../store/employeeStore');

describe('useEmployees', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch employees on mount', async () => {
    const mockFetchEmployees = jest.fn().mockResolvedValue([]);
    (employeeStore.fetchEmployees as jest.Mock) = mockFetchEmployees;

    renderHook(() => useEmployees());

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockFetchEmployees).toHaveBeenCalledTimes(1);
  });

  it('should return employees and loading state', () => {
    const mockEmployees = [
      { id: '1', name: 'Иван' },
      { id: '2', name: 'Петр' },
    ];
    (employeeStore.employees as any) = mockEmployees;
    (employeeStore.loading as any) = false;

    const { result } = renderHook(() => useEmployees());

    expect(result.current.employees).toEqual(mockEmployees);
    expect(result.current.loading).toBe(false);
  });
});
```

---

### 4. Integration тесты

**Назначение**: Тестирование взаимодействия между модулями

**Что тестируем**:

- Взаимодействие Store + API
- Взаимодействие Hook + Store
- Навигация между экранами
- Полные user flows

**Инструменты**: Jest + React Native Testing Library

**Пример**:

```typescript
// src/__tests__/integration/employee-flow.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { EmployeesScreen } from '../../screens/admin/EmployeesScreen';
import { employeeStore } from '../../store/employeeStore';

describe('Employee Flow', () => {
  it('should load and display employees', async () => {
    const mockEmployees = [
      { id: '1', name: 'Иван Иванов', position: 'Сотрудник' },
      { id: '2', name: 'Петр Петров', position: 'Менеджер' },
    ];

    jest.spyOn(employeeStore, 'fetchEmployees').mockResolvedValue(mockEmployees);

    const { getByText, queryByTestId } = render(
      <NavigationContainer>
        <EmployeesScreen />
      </NavigationContainer>
    );

    // Проверяем loading state
    expect(queryByTestId('loading-indicator')).toBeTruthy();

    // Ждём загрузки данных
    await waitFor(() => {
      expect(getByText('Иван Иванов')).toBeTruthy();
    });

    // Проверяем что все сотрудники отображаются
    expect(getByText('Иван Иванов')).toBeTruthy();
    expect(getByText('Петр Петров')).toBeTruthy();
  });

  it('should filter employees by search query', async () => {
    const mockEmployees = [
      { id: '1', name: 'Иван Иванов', position: 'Сотрудник' },
      { id: '2', name: 'Петр Петров', position: 'Менеджер' },
    ];

    jest.spyOn(employeeStore, 'fetchEmployees').mockResolvedValue(mockEmployees);

    const { getByPlaceholderText, getByText, queryByText } = render(
      <NavigationContainer>
        <EmployeesScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Иван Иванов')).toBeTruthy();
    });

    // Вводим поисковый запрос
    const searchInput = getByPlaceholderText('Поиск сотрудников...');
    fireEvent.changeText(searchInput, 'Иван');

    // Проверяем фильтрацию
    expect(getByText('Иван Иванов')).toBeTruthy();
    expect(queryByText('Петр Петров')).toBeNull();
  });
});
```

---

### 5. E2E тесты

**Назначение**: Тестирование полных пользовательских сценариев

**Что тестируем**:

- Критичные user flows (login → dashboard → action)
- Навигация между экранами
- Взаимодействие с API
- Реальное поведение на устройстве

**Инструменты**: Detox (планируется)

**Пример** (концептуальный):

```typescript
// e2e/admin-dashboard.e2e.ts
describe('Admin Dashboard Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login as admin and see dashboard', async () => {
    // Шаг 1: Логин
    await element(by.id('email-input')).typeText('admin@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Шаг 2: Проверка загрузки dashboard
    await waitFor(element(by.id('dashboard-screen')))
      .toBeVisible()
      .withTimeout(5000);

    // Шаг 3: Проверка метрик
    await expect(element(by.id('metric-employees'))).toBeVisible();
    await expect(element(by.id('metric-orders'))).toBeVisible();

    // Шаг 4: Навигация к сотрудникам
    await element(by.id('tab-employees')).tap();
    await expect(element(by.id('employees-screen'))).toBeVisible();
  });
});
```

---

## Запуск тестов

### Локальная разработка

```bash
# Запуск всех тестов
npm test

# Watch mode (перезапуск при изменении)
npm run test:watch

# Запуск конкретного файла
npm test src/utils/__tests__/formatDate.test.ts

# Запуск по паттерну
npm test -- --testPathPattern=employee
```

### Генерация отчёта о покрытии

```bash
# Генерация coverage отчёта
npm run test:coverage

# Просмотр HTML отчёта
open coverage/lcov-report/index.html
```

### CI/CD

```bash
# Запуск тестов в CI (без watch, с coverage)
npm run test:ci
```

---

## Написание тестов

### Структура тестового файла

```typescript
// 1. Импорты
import { render } from '@testing-library/react-native';
import { MyComponent } from '../MyComponent';

// 2. Моки (если нужны)
jest.mock('../../services/api');

// 3. Describe блок
describe('MyComponent', () => {
  // 4. Setup/Teardown (если нужен)
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 5. Тесты
  it('should render correctly', () => {
    // Arrange
    const props = { title: 'Test' };

    // Act
    const { getByText } = render(<MyComponent {...props} />);

    // Assert
    expect(getByText('Test')).toBeTruthy();
  });

  // 6. Группировка связанных тестов
  describe('when user is authenticated', () => {
    it('should show logout button', () => {
      // ...
    });
  });
});
```

### Паттерн Arrange-Act-Assert (AAA)

```typescript
it('should calculate total price', () => {
  // Arrange (подготовка)
  const items = [
    { id: 1, price: 100, quantity: 2 },
    { id: 2, price: 50, quantity: 1 },
  ];

  // Act (действие)
  const total = calculateTotalPrice(items);

  // Assert (проверка)
  expect(total).toBe(250);
});
```

### Именование тестов

**✅ Хорошо:**

```typescript
it('should return formatted date in DD.MM.YYYY format', () => {});
it('should throw error when date is invalid', () => {});
it('should handle empty employee list', () => {});
```

**❌ Плохо:**

```typescript
it('works', () => {});
it('test 1', () => {});
it('formatDate', () => {});
```

### Моки и Stubs

**Мокирование модулей:**

```typescript
// Мокирование всего модуля
jest.mock('../../services/api', () => ({
  fetchEmployees: jest.fn(),
}));

// Мокирование конкретной функции
import * as api from '../../services/api';
jest.spyOn(api, 'fetchEmployees').mockResolvedValue([]);
```

**Мокирование компонентов:**

```typescript
// Мокирование сложного компонента
jest.mock('react-native-paper', () => ({
  Button: 'Button',
  Card: 'Card',
  Text: 'Text',
}));
```

---

## Best Practices

### ✅ DO

1. **Пиши понятные и описательные названия тестов**

   ```typescript
   it('should display error message when login fails with invalid credentials', () => {});
   ```

2. **Тестируй поведение, а не implementation details**

   ```typescript
   // ✅ Хорошо: тестируем что пользователь видит
   expect(getByText('Иван Иванов')).toBeTruthy();

   // ❌ Плохо: тестируем внутреннюю структуру
   expect(wrapper.find('.employee-name').at(0).text()).toBe('Иван Иванов');
   ```

3. **Изолируй тесты (каждый тест независим)**

   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
     // Сброс состояния store
   });
   ```

4. **Используй data-testid для сложных селекторов**

   ```tsx
   <View testID="employee-card">
     <Text>{employee.name}</Text>
   </View>
   ```

5. **Покрывай edge cases**

   ```typescript
   it('should handle empty list', () => {});
   it('should handle null values', () => {});
   it('should handle very long names', () => {});
   ```

6. **Используй async/await для асинхронных тестов**
   ```typescript
   it('should load data', async () => {
     await waitFor(() => {
       expect(getByText('Loaded')).toBeTruthy();
     });
   });
   ```

### ❌ DON'T

1. **Не тестируй библиотеки**

   ```typescript
   // ❌ Плохо: тестируем React, а не свой код
   it('useState should work', () => {});
   ```

2. **Не делай тесты зависимыми друг от друга**

   ```typescript
   // ❌ Плохо: тест 2 зависит от теста 1
   let sharedState;
   it('test 1', () => {
     sharedState = 'value';
   });
   it('test 2', () => {
     expect(sharedState).toBe('value');
   });
   ```

3. **Не используй реальные API вызовы в unit/integration тестах**

   ```typescript
   // ❌ Плохо
   it('should fetch employees', async () => {
     const data = await fetch('https://api.example.com/employees');
   });

   // ✅ Хорошо
   it('should fetch employees', async () => {
     jest.spyOn(api, 'fetchEmployees').mockResolvedValue(mockData);
   });
   ```

4. **Не пиши слишком длинные тесты**

   ```typescript
   // ❌ Плохо: тестируем всё сразу
   it('should do everything', () => {
     // 100 строк теста
   });

   // ✅ Хорошо: разбиваем на несколько тестов
   it('should render correctly', () => {});
   it('should handle click', () => {});
   it('should validate input', () => {});
   ```

---

## Покрытие кода

### Требования

- **Новый код**: ≥80% coverage
- **Критичный функционал**: 100% coverage
- **Legacy код**: постепенное увеличение до 60%

### Просмотр покрытия

```bash
# Генерация отчёта
npm run test:coverage

# Открыть HTML отчёт
open coverage/lcov-report/index.html
```

### Интерпретация метрик

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   85.5  |   78.2   |   92.1  |   85.1  |
 src/utils                |   95.2  |   88.9   |   100   |   95.0  |
  formatDate.ts           |   100   |   100    |   100   |   100   |
  validators.ts           |   90.5  |   77.8   |   100   |   90.0  |
 src/components           |   80.3  |   72.5   |   85.7  |   79.8  |
  EmployeeCard.tsx        |   88.9  |   80.0   |   100   |   88.5  |
--------------------------|---------|----------|---------|---------|
```

- **% Stmts** - покрытие строк кода
- **% Branch** - покрытие условных операторов (if/else)
- **% Funcs** - покрытие функций
- **% Lines** - покрытие логических строк

### Игнорирование некоторых файлов

В `jest.config.js`:

```javascript
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.d.ts',           // Файлы типов
  '!src/**/*.stories.tsx',    // Storybook stories
  '!src/**/index.ts',         // Barrel exports
  '!src/types/**',            // Папка с типами
],
```

---

## Отладка тестов

### VS Code Debug Configuration

Создайте `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest: Current File",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["${file}", "--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug в терминале

```bash
# Запуск с Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Открыть chrome://inspect в Chrome
```

---

## Дополнительные ресурсы

### Документация

- [Jest](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Jest Expo Preset](https://docs.expo.dev/develop/unit-testing/)

### Примеры тестов в проекте

- `src/utils/__tests__/` - примеры unit тестов
- `src/components/__tests__/` - примеры component тестов
- `src/hooks/__tests__/` - примеры hook тестов

### Следующие шаги

1. **Настроить Jest** - добавить конфигурацию и зависимости
2. **Написать первые тесты** - начать с утилит и простых компонентов
3. **Интегрировать в CI** - автоматический запуск тестов при PR
4. **Добавить E2E тесты** - настроить Detox для e2e тестирования

---

**Последнее обновление**: 3 ноября 2025  
**Статус**: 📝 План (тесты пока не настроены)
