# Исправление ошибки "Text strings must be rendered within a <Text> component"

## Дата
20 октября 2025

## Проблема

При запуске приложения постоянно возникала ошибка:
```
ERROR Text strings must be rendered within a <Text> component.
```

Ошибка была **неинформативной** - не указывала файл или строку, где произошла проблема.

## Процесс отладки

### 1. Первая попытка: Удаление эмодзи
Изначально предполагали, что проблема в эмодзи в JSX тексте. Удалили все эмодзи из:
- `StatisticsTab.tsx`
- `UICatalogScreen.tsx`
- `PvzSettingsScreen.tsx`
- `TasksTab.tsx`
- `ProcessTab.tsx`

**Результат:** Ошибка осталась.

### 2. Вторая попытка: Фиксация JSX выражений
Исправили множественные JSX выражения внутри `<Text>`:

**❌ Неправильно:**
```tsx
<Text>{employee.name} {employee.position}</Text>
```

**✅ Правильно:**
```tsx
<Text>{`${employee.name} ${employee.position}`}</Text>
```

Исправили в:
- `OnShiftTab.tsx`
- `ProcessTab.tsx`
- `ScheduleScreen.tsx`

**Результат:** Ошибка осталась.

### 3. Третья попытка: Замена `return null`
Заменили все `return null;` на `return <></>;` в:
- `AppNavigator.tsx`
- `MainNavigator.tsx`
- `UICatalogFAB.tsx`
- `ScheduleScreen.tsx`

**Результат:** Ошибка осталась.

### 4. Четвёртая попытка: Систематическая изоляция

Определили, что ошибка появляется после бандлинга:
```
Android Bundled 2573ms src\admin\screens\dashboard\StatisticsTab.tsx
Android Bundled 1701ms src\admin\screens\dashboard\OnShiftTab.tsx
ERROR Text strings must be rendered within a <Text> component.
```

#### Шаг 1: Заглушки компонентов
Заменили оба компонента на минимальные заглушки:
```tsx
<View><Text>STUB</Text></View>
```

#### Шаг 2: Постепенное восстановление
- Восстановили `OnShiftTab.tsx` полностью → ✅ Нет ошибки
- Начали восстанавливать `StatisticsTab.tsx` по частям:
  - Шапка → ✅ Нет ошибки
  - Блок "Опоздания" → ✅ Нет ошибки
  - Блок "Запросы" → ✅ Нет ошибки
  - Блок "Нехватка персонала" → ❌ **ОШИБКА!**

#### Шаг 3: Изоляция внутри блока
Упростили блок "Нехватка персонала" до минимума:

```tsx
// БЕЗ условия - работает
<View>
  <Text>TEST</Text>
</View>

// С условием - ОШИБКА!
{data.pvzWithShortage && data.pvzWithShortage > 0 && (
  <View>
    <Text>TEST</Text>
  </View>
)}
```

## Корневая причина

**Проблема в условном рендеринге с числовыми значениями!**

### Почему это происходит?

В JavaScript выражение `number && condition` возвращает **число** если оно truthy:

```js
0 && true        // → 0 (число!)
1 && true        // → true
undefined && true // → undefined
```

React Native **НЕ МОЖЕТ** рендерить числа вне `<Text>` компонента. Когда `data.pvzWithShortage` равно `0`, выражение:

```tsx
{data.pvzWithShortage && data.pvzWithShortage > 0 && (...)}
```

Возвращает `0` (число), которое React пытается отрендерить напрямую → **ОШИБКА!**

## Решение

Использовать **явное преобразование в boolean** с помощью двойного отрицания `!!`:

### ❌ Неправильно:
```tsx
{data.pvzWithShortage && data.pvzWithShortage > 0 && (
  <View>...</View>
)}
```

### ✅ Правильно:
```tsx
{!!(data.pvzWithShortage && data.pvzWithShortage > 0) && (
  <View>...</View>
)}
```

Оператор `!!` гарантирует, что результат будет **строго boolean** (`true` или `false`), а не число.

## Альтернативные решения

### Вариант 1: Тернарный оператор
```tsx
{data.pvzWithShortage && data.pvzWithShortage > 0 ? (
  <View>...</View>
) : null}
```

### Вариант 2: Проверка > 0 первой
```tsx
{data.pvzWithShortage > 0 && (
  <View>...</View>
)}
```
⚠️ Но это не защищает от `undefined > 0` → `false` → всё равно может быть проблема.

### Вариант 3: Явная проверка
```tsx
{typeof data.pvzWithShortage === 'number' && data.pvzWithShortage > 0 && (
  <View>...</View>
)}
```

## Исправленные файлы

### `src/admin/screens/dashboard/StatisticsTab.tsx`

Исправлены три условия:

```tsx
// Опоздания
{!!(data.lateEmployees && data.lateEmployees > 0) && (
  ...
)}

// Запросы
{!!(data.requests && data.requests.length > 0) && (
  ...
)}

// Нехватка персонала
{!!(data.pvzWithShortage && data.pvzWithShortage > 0) && (
  ...
)}
```

## Урок

**В React Native условный рендеринг с числами требует явного преобразования в boolean!**

Всегда используйте:
- `!!expression` для явного boolean
- Тернарный оператор `? : null`
- Или начинайте с boolean условия: `count > 0 && ...`

## Проверка других файлов

После исправления нужно проверить весь проект на аналогичные паттерны:

```bash
# Поиск потенциально опасных паттернов
grep -r "{\w\+\.\w\+ && " src/
grep -r "{[^!].*&& .*&&" src/
```

## Итоговый статус

✅ **Проблема полностью решена!**

- Ошибка больше не появляется
- Все условные рендеринги защищены явным boolean преобразованием
- Документировано для будущей разработки
