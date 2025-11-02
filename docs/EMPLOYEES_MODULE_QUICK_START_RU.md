# ⚡ Быстрый старт: Модуль "Сотрудники"

**Дата:** 2 ноября 2025  
**Для:** Разработчиков

---

## 🎯 Что нужно сделать?

Реализовать полнофункциональный модуль управления сотрудниками для администраторов ПВЗ.

---

## 📋 Текущее состояние

✅ **Готово:**
- Список сотрудников с поиском и фильтрами
- Карточки сотрудников
- Хук для загрузки данных
- Типы данных (`AdminEmployee`)

❌ **Нужно сделать:**
- Экран деталей сотрудника
- Форма добавления/редактирования
- Интеграция с API
- Дополнительные компоненты

---

## 🚀 План действий (6 этапов)

### Этап 1: Типы и навигация (1-2 часа)
```bash
# Файлы для создания/изменения:
1. src/admin/screens/employees/types/employee.types.ts  # создать
2. src/types/navigation.ts                              # изменить
```

**Задачи:**
- [ ] Создать типы `EmployeeFormData`, `EmployeeFormErrors`
- [ ] Добавить роуты `EmployeeDetails` и `EmployeeForm` в навигацию

### Этап 2: Экран деталей (2-3 часа)
```bash
# Файлы для создания:
1. src/admin/screens/employees/EmployeeDetailsScreen.tsx
2. src/admin/screens/employees/components/EmployeeHeader.tsx
3. src/admin/screens/employees/components/EmployeeStats.tsx
4. src/admin/screens/employees/components/EmployeeInfoSection.tsx
5. src/admin/screens/employees/components/EmployeeShiftHistory.tsx
6. src/admin/screens/employees/hooks/useEmployeeDetails.ts
7. src/admin/screens/employees/hooks/useEmployeeActions.ts
```

**Задачи:**
- [ ] Создать экран с деталями сотрудника
- [ ] Создать компоненты для отображения информации
- [ ] Создать хуки для загрузки данных и действий
- [ ] Подключить навигацию из списка к деталям

### Этап 3: Форма (3-4 часа)
```bash
# Файлы для создания:
1. src/admin/screens/employees/EmployeeFormScreen.tsx
2. src/admin/screens/employees/hooks/useEmployeeForm.ts
```

**Задачи:**
- [ ] Создать форму с всеми полями
- [ ] Реализовать валидацию
- [ ] Добавить загрузку фото
- [ ] Реализовать сохранение данных

### Этап 4: Навигация (1 час)
```bash
# Файлы для изменения:
1. src/navigation/AdminNavigator.tsx  # или аналогичный
2. src/admin/screens/employees/EmployeesScreen.tsx
```

**Задачи:**
- [ ] Подключить новые экраны к навигатору
- [ ] Настроить переходы между экранами
- [ ] Добавить кнопку "Добавить сотрудника"

### Этап 5: API (2-3 часа)
```bash
# Файлы для создания:
1. src/admin/services/employeeService.ts
```

**Задачи:**
- [ ] Создать сервис для работы с API
- [ ] Заменить моковые данные на реальные запросы
- [ ] Добавить обработку ошибок

### Этап 6: Полировка (1-2 часа)
**Задачи:**
- [ ] Добавить анимации
- [ ] Добавить скелетоны загрузки
- [ ] Оптимизировать производительность
- [ ] Протестировать на устройстве

---

## 📝 Пошаговая инструкция

### Шаг 1: Создаём типы

```typescript
// src/admin/screens/employees/types/employee.types.ts

export interface EmployeeFormData {
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  position: 'trainee' | 'employee' | 'senior' | 'manager';
  employmentStatus: 'working' | 'day_off' | 'sick_leave' | 'vacation' | 'fired';
  isActive: boolean;
  pvzId: string;
  hiredAt: Date;
  baseSalary?: number;
}

export interface EmployeeFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  pvzId?: string;
  [key: string]: string | undefined;
}
```

### Шаг 2: Добавляем роуты

```typescript
// src/types/navigation.ts

export type AdminStackParamList = {
  // ... существующие роуты
  Employees: undefined;
  EmployeeDetails: { employeeId: string };
  EmployeeForm: { employeeId?: string };
};
```

### Шаг 3: Создаём экран деталей

Используйте примеры кода из документа:
📄 `EMPLOYEES_MODULE_IMPLEMENTATION_PLAN_RU.md` → Этап 2

### Шаг 4: Создаём форму

Используйте примеры кода из документа:
📄 `EMPLOYEES_MODULE_IMPLEMENTATION_PLAN_RU.md` → Этап 3

### Шаг 5: Создаём API сервис

```typescript
// src/admin/services/employeeService.ts

import { api } from '../../services/api';
import { AdminEmployee } from '../../types/admin';

export const employeeService = {
  async getAll(filters?: any): Promise<AdminEmployee[]> {
    const response = await api.get('/employees', { params: filters });
    return response.data;
  },

  async getById(id: string): Promise<AdminEmployee> {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  async create(data: any): Promise<AdminEmployee> {
    const response = await api.post('/employees', data);
    return response.data;
  },

  async update(id: string, data: any): Promise<AdminEmployee> {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/employees/${id}`);
  },
};
```

---

## 🎨 Готовые компоненты для использования

Все эти компоненты уже есть в проекте:

```typescript
// Импорты из UI системы
import {
  tokens,           // Токены дизайна (цвета, отступы, радиусы)
  Button,           // Кнопка
  IconButton,       // Кнопка с иконкой
  SearchInput,      // Поле поиска
  SelectModal,      // Модальное окно выбора
  EmptyState,       // Пустое состояние
  ErrorState,       // Состояние ошибки
  LoadingState,     // Состояние загрузки
  Title,            // Заголовок
  Label,            // Метка
} from '../../../ui';

// Импорты из React Native Paper
import {
  Avatar,           // Аватар
  Text,             // Текст
  Surface,          // Поверхность (карточка)
} from 'react-native-paper';

// Иконки
import { MaterialCommunityIcons } from '@expo/vector-icons';
```

---

## 🎯 Полезные советы

### 1. Используйте tokens для стилей
```typescript
// ✅ ПРАВИЛЬНО
style={{
  padding: tokens.spacing.md,
  backgroundColor: tokens.colors.surface,
  borderRadius: tokens.radius.lg,
}}

// ❌ НЕПРАВИЛЬНО
style={{
  padding: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
}}
```

### 2. Все комментарии на русском
```typescript
/**
 * Компонент карточки сотрудника
 * Отображает основную информацию и кнопки действий
 */
export const EmployeeCard: React.FC<EmployeeCardProps> = ({ ... }) => {
  // Получаем цвет аватара на основе имени
  const getAvatarColor = () => { ... };
  
  return ...;
};
```

### 3. Типизируйте всё
```typescript
// ✅ ПРАВИЛЬНО
interface EmployeeCardProps {
  employee: AdminEmployee;
  onPress: () => void;
  onChat?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ ... }) => {
  ...
};

// ❌ НЕПРАВИЛЬНО
export const EmployeeCard = ({ employee, onPress, onChat }) => {
  ...
};
```

### 4. Используйте хуки для бизнес-логики
```typescript
// ✅ ПРАВИЛЬНО - логика в хуке
const useEmployees = (filters) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchEmployees = async () => { ... };
  
  return { employees, loading, refresh: fetchEmployees };
};

// В компоненте
const { employees, loading, refresh } = useEmployees(filters);

// ❌ НЕПРАВИЛЬНО - логика в компоненте
const EmployeesScreen = () => {
  const [employees, setEmployees] = useState([]);
  
  const fetchEmployees = async () => {
    // много кода...
  };
  
  useEffect(() => { fetchEmployees(); }, []);
  ...
};
```

### 5. Сначала моки, потом API
```typescript
// Этап 1: Используем моковые данные
const MOCK_EMPLOYEE: AdminEmployee = {
  id: '1',
  name: 'Иван Иванов',
  ...
};

// Этап 2: Заменяем на API
const employee = await employeeService.getById(id);
```

---

## 📚 Документация

Полная документация по модулю:

1. **📋 План реализации**  
   `EMPLOYEES_MODULE_IMPLEMENTATION_PLAN_RU.md`  
   Детальный план всех этапов с примерами кода

2. **🏗️ Архитектура**  
   `EMPLOYEES_MODULE_ARCHITECTURE_RU.md`  
   Структура модуля, потоки данных, API endpoints

3. **⚡ Быстрый старт** (этот файл)  
   `EMPLOYEES_MODULE_QUICK_START_RU.md`  
   Краткая инструкция для быстрого старта

4. **🚀 Готовность модуля**  
   `EMPLOYEES_MODULE_READY.md`  
   Готовые компоненты и инфраструктура

---

## ⏱️ Оценка времени

| Этап | Время |
|------|-------|
| 1. Типы и навигация | 1-2 часа |
| 2. Экран деталей | 2-3 часа |
| 3. Форма | 3-4 часа |
| 4. Навигация | 1 час |
| 5. API | 2-3 часа |
| 6. Полировка | 1-2 часа |
| **ИТОГО** | **10-15 часов** |

---

## 🎯 Критерии готовности

### Модуль считается готовым, когда:
- [x] ✅ Список сотрудников работает (ГОТОВО)
- [ ] ⏳ Можно просмотреть детали сотрудника
- [ ] ⏳ Можно добавить нового сотрудника
- [ ] ⏳ Можно редактировать данные сотрудника
- [ ] ⏳ Можно удалить сотрудника
- [ ] ⏳ Все данные загружаются с API
- [ ] ⏳ Есть обработка ошибок
- [ ] ⏳ Всё работает на реальном устройстве

---

## 🚀 Начинаем!

1. **Прочитайте** план реализации и архитектуру
2. **Создайте** новую ветку `feature/employees-module`
3. **Начните** с Этапа 1 (типы и навигация)
4. **Следуйте** плану поэтапно
5. **Тестируйте** после каждого этапа
6. **Коммитьте** часто с понятными сообщениями

**Удачи в разработке!** 💪

---

## 📞 Вопросы?

Если что-то непонятно, посмотрите:
- 📄 Детальный план: `EMPLOYEES_MODULE_IMPLEMENTATION_PLAN_RU.md`
- 🏗️ Архитектуру: `EMPLOYEES_MODULE_ARCHITECTURE_RU.md`
- 🚀 Готовые компоненты: `EMPLOYEES_MODULE_READY.md`
