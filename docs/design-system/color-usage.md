# 🎨 Гайд по использованию цветов

> **Обновлено:** 2025-11-01  
> **Оптимизация:** 29 → 22 цвета (сокращение 24%)

## 📋 Содержание

1. [Обзор палитры](#обзор-палитры)
2. [Primary - Основной цвет бренда](#primary---основной-цвет-бренда)
3. [Gray - Нейтральная шкала](#gray---нейтральная-шкала)
4. [Status Colors - Статусные цвета](#status-colors---статусные-цвета)
5. [Semantic - Семантические цвета](#semantic---семантические-цвета)
6. [Text - Иерархия текста](#text---иерархия-текста)
7. [Примеры использования](#примеры-использования)
8. [Что удалено](#что-удалено)

---

## Обзор палитры

**Всего: 22 цвета** (все используются в приложении)

| Категория | Количество | Назначение                               |
| --------- | ---------- | ---------------------------------------- |
| Primary   | 3          | Основной бренд, акценты, кнопки          |
| Gray      | 6          | Фоны, границы, текст                     |
| Success   | 5          | Успешные действия, положительные статусы |
| Warning   | 3          | Предупреждения, внимание                 |
| Error     | 4          | Ошибки, критические действия             |
| Info      | 3          | Информационные элементы                  |
| Semantic  | 4          | Специальные семантические цвета          |
| Text      | 4          | Иерархия текстового контента             |

---

## Primary - Основной цвет бренда

### `tokens.colors.primary`

**3 оттенка:** light, main, dark

```tsx
import { tokens } from '../ui';

// Light (#EDE9FE) - светлый фиолетовый
tokens.colors.primary.light;
```

**Когда использовать:**

- ✅ Фон при hover на кнопках/карточках
- ✅ Светлый фон для активных состояний
- ✅ Подсветка выбранных элементов
- ✅ Фон бейджей с primary цветом

**Примеры:**

```tsx
// Активная вкладка
<View style={{ backgroundColor: tokens.colors.primary.light }}>
  <Text>Активная</Text>
</View>

// Hover эффект
onPress={() => {}}
style={[
  { backgroundColor: isHovered ? tokens.colors.primary.light : 'transparent' }
]}
```

---

```tsx
// Main (#4F46E5) - основной фиолетовый
tokens.colors.primary.main;
```

**Когда использовать:**

- ✅ Primary кнопки (contained mode)
- ✅ Акцентные элементы
- ✅ Активные иконки
- ✅ Ссылки
- ✅ Прогресс-бары
- ✅ Переключатели (active state)

**Примеры:**

```tsx
// Primary кнопка
<Button mode="contained" buttonColor={tokens.colors.primary.main}>
  Сохранить
</Button>

// Иконка акцента
<MaterialCommunityIcons
  name="check-circle"
  size={24}
  color={tokens.colors.primary.main}
/>

// Активный статус
<View style={{
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: tokens.colors.primary.main
}} />
```

---

```tsx
// Dark (#1E40AF) - тёмный синий
tokens.colors.primary.dark;
```

**Когда использовать:**

- ✅ Тёмные состояния кнопок (pressed)
- ✅ Тени и обводки primary элементов
- ✅ Текст на светлом primary фоне

**Примеры:**

```tsx
// Pressed состояние
<Pressable
  style={({ pressed }) => ({
    backgroundColor: pressed
      ? tokens.colors.primary.dark
      : tokens.colors.primary.main
  })}
>
  <Text>Нажми</Text>
</Pressable>

// Граница primary карточки
<View style={{
  borderWidth: 2,
  borderColor: tokens.colors.primary.dark
}}>
```

---

## Gray - Нейтральная шкала

### `tokens.colors.gray[50-500]`

**6 оттенков:** от самого светлого (50) до тёмного (500)

```tsx
// Gray 50 (#F9FAFB) - самый светлый
tokens.colors.gray[50];
```

**Когда использовать:**

- ✅ Фон экранов (`screenBackground`)
- ✅ Фон input полей
- ✅ Светлые разделители

```tsx
<View style={{ flex: 1, backgroundColor: tokens.colors.gray[50] }}>{/* Контент экрана */}</View>
```

---

```tsx
// Gray 100 (#F3F4F6) - очень светлый
tokens.colors.gray[100];
```

**Когда использовать:**

- ✅ Фон секций на экране
- ✅ Разделители между элементами
- ✅ Disabled фоны

```tsx
<View
  style={{
    backgroundColor: tokens.colors.gray[100],
    padding: 12,
    borderRadius: 8,
  }}
>
  <Text>Секция</Text>
</View>
```

---

```tsx
// Gray 200 (#E5E7EB) - светлый
tokens.colors.gray[200];
```

**Когда использовать:**

- ✅ Границы карточек, input полей
- ✅ Разделители (Divider)
- ✅ Обводка кнопок (outlined mode)

```tsx
<View style={{
  borderWidth: 1,
  borderColor: tokens.colors.gray[200]
}}>
```

---

```tsx
// Gray 300 (#D1D5DB) - средний светлый
tokens.colors.gray[300];
```

**Когда использовать:**

- ✅ Disabled элементы (границы, иконки)
- ✅ Неактивные разделители

```tsx
<TextInput editable={false} style={{ borderColor: tokens.colors.gray[300] }} />
```

---

```tsx
// Gray 400 (#9CA3AF) - средний
tokens.colors.gray[400];
```

**Когда использовать:**

- ✅ Placeholder текст
- ✅ Приглушённые иконки
- ✅ Второстепенная информация (muted)

```tsx
<TextInput
  placeholder="Введите текст"
  placeholderTextColor={tokens.colors.gray[400]}
/>

<MaterialCommunityIcons
  name="information"
  color={tokens.colors.gray[400]}
/>
```

---

```tsx
// Gray 500 (#6B7280) - тёмный серый
tokens.colors.gray[500];
```

**Когда использовать:**

- ✅ Вторичный текст (описания, метаданные)
- ✅ Лейблы полей
- ✅ Время, даты

```tsx
<Text style={{ color: tokens.colors.gray[500], fontSize: 13 }}>Обновлено 5 минут назад</Text>
```

---

## Status Colors - Статусные цвета

### Success - Успех

```tsx
tokens.colors.success.lighter; // #D1FAE5 - самый светлый фон
tokens.colors.success.light; // #DCFCE7 - светлый фон
tokens.colors.success.main; // #10B981 - основной зелёный
tokens.colors.success.dark; // #059669 - тёмный текст
tokens.colors.success.darker; // #065F46 - самый тёмный
```

**Когда использовать:**

- ✅ Статус "На смене"
- ✅ Одобренные запросы
- ✅ Успешные действия
- ✅ Положительные показатели

**Примеры:**

```tsx
// Бейдж "На смене"
<View style={{
  backgroundColor: tokens.colors.success.light,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6
}}>
  <Text style={{ color: tokens.colors.success.dark }}>
    На смене
  </Text>
</View>

// Success кнопка
<Button
  mode="contained"
  buttonColor={tokens.colors.success.main}
  onPress={approve}
>
  Одобрить
</Button>
```

---

### Warning - Предупреждение

```tsx
tokens.colors.warning.lighter; // #FEF3C7 - самый светлый фон
tokens.colors.warning.light; // #FEF9E7 - светлый бежевый фон
tokens.colors.warning.main; // #F59E0B - основной оранжевый
```

**Когда использовать:**

- ✅ Предупреждения
- ✅ Опоздания
- ✅ Ожидающие действия
- ✅ Важная информация

**Примеры:**

```tsx
// Алерт о длинном перерыве
<View
  style={{
    backgroundColor: tokens.colors.warning.light,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: tokens.colors.warning.main,
  }}
>
  <Text style={{ color: tokens.colors.warning.main }}>Перерыв более 15 минут</Text>
</View>
```

---

### Error - Ошибка

```tsx
tokens.colors.error.light; // #FEE2E2 - светлый красный фон
tokens.colors.error.main; // #DC2626 - основной красный
tokens.colors.error.dark; // #991B1B - тёмный текст
tokens.colors.error.darker; // #7F1D1D - самый тёмный
```

**Когда использовать:**

- ✅ Ошибки
- ✅ Отклонённые запросы
- ✅ Удаление
- ✅ Критические действия
- ✅ Валидация форм

**Примеры:**

```tsx
// Кнопка удаления
<Button
  mode="contained"
  buttonColor={tokens.colors.error.main}
  onPress={deleteItem}
>
  Удалить
</Button>

// Сообщение об ошибке
<Text style={{ color: tokens.colors.error.main, fontSize: 12 }}>
  Поле обязательно для заполнения
</Text>
```

---

### Info - Информация

```tsx
tokens.colors.info.light; // #DBEAFE - светлый синий фон
tokens.colors.info.main; // #3B82F6 - основной синий
tokens.colors.info.dark; // #1E40AF - тёмный текст
```

**Когда использовать:**

- ✅ Информационные сообщения
- ✅ Подсказки
- ✅ Нейтральные уведомления

**Примеры:**

```tsx
// Информационный блок
<View
  style={{
    backgroundColor: tokens.colors.info.light,
    padding: 12,
    borderRadius: 8,
  }}
>
  <MaterialCommunityIcons name="information" color={tokens.colors.info.main} size={20} />
  <Text style={{ color: tokens.colors.info.dark }}>Смена начинается в 09:00</Text>
</View>
```

---

## Semantic - Семантические цвета

### `tokens.colors.background`

```tsx
tokens.colors.background; // #FBFCFE - фон приложения
```

**Когда использовать:**

- ✅ Общий фон приложения (редко используется напрямую)

---

### `tokens.colors.screenBackground`

```tsx
tokens.colors.screenBackground; // #F9FAFB - фон экранов
```

**Когда использовать:**

- ✅ Основной контейнер экрана (flex: 1)
- ✅ Все экраны должны использовать этот цвет

```tsx
<View style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}>{/* Контент */}</View>
```

---

### `tokens.colors.surface`

```tsx
tokens.colors.surface; // #FFFFFF - белый
```

**Когда использовать:**

- ✅ Фон карточек
- ✅ Фон модалов, диалогов
- ✅ Фон Paper компонентов

```tsx
<Card style={{ backgroundColor: tokens.colors.surface }}>{/* Контент карточки */}</Card>
```

---

### `tokens.colors.border`

```tsx
tokens.colors.border; // #E5E7EB - граница
```

**Когда использовать:**

- ✅ Границы карточек, контейнеров
- ✅ Обводка input полей
- ✅ Разделители

```tsx
<View style={{
  borderWidth: 1,
  borderColor: tokens.colors.border
}}>
```

---

## Text - Иерархия текста

### `tokens.colors.text`

```tsx
// Primary (#111827) - основной текст
tokens.colors.text.primary;
```

**Когда использовать:**

- ✅ Заголовки
- ✅ Основной текст
- ✅ Важная информация

```tsx
<Text style={{ color: tokens.colors.text.primary, fontSize: 16 }}>Заголовок секции</Text>
```

---

```tsx
// Secondary (#6B7280) - вторичный текст
tokens.colors.text.secondary;
```

**Когда использовать:**

- ✅ Описания
- ✅ Метаданные (время, дата)
- ✅ Вспомогательная информация

```tsx
<Text style={{ color: tokens.colors.text.secondary, fontSize: 13 }}>Обновлено 5 минут назад</Text>
```

---

```tsx
// Muted (#9CA3AF) - приглушённый текст
tokens.colors.text.muted;
```

**Когда использовать:**

- ✅ Placeholder
- ✅ Очень второстепенная информация
- ✅ Подписи к иконкам

```tsx
<TextInput placeholder="Поиск..." placeholderTextColor={tokens.colors.text.muted} />
```

---

```tsx
// Disabled (#D1D5DB) - отключённый текст
tokens.colors.text.disabled;
```

**Когда использовать:**

- ✅ Неактивные элементы
- ✅ Disabled input поля

```tsx
<Text style={{ color: tokens.colors.text.disabled }}>Недоступно</Text>
```

---

## Примеры использования

### Карточка сотрудника

```tsx
<Card
  style={{
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 12,
  }}
>
  <View style={{ padding: 12 }}>
    {/* Имя */}
    <Text
      style={{
        fontSize: 16,
        fontWeight: '600',
        color: tokens.colors.text.primary,
      }}
    >
      Иванов Иван
    </Text>

    {/* Должность */}
    <Text
      style={{
        fontSize: 13,
        color: tokens.colors.text.secondary,
        marginTop: 4,
      }}
    >
      Оператор ПВЗ
    </Text>

    {/* Статус */}
    <View
      style={{
        backgroundColor: tokens.colors.success.light,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 8,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: tokens.colors.success.dark,
        }}
      >
        На смене
      </Text>
    </View>
  </View>
</Card>
```

### Поле ввода с ошибкой

```tsx
const [error, setError] = useState('Поле обязательно');

<View>
  <TextInput
    placeholder="Email"
    placeholderTextColor={tokens.colors.text.muted}
    style={{
      height: 48,
      borderWidth: 1,
      borderColor: error ? tokens.colors.error.main : tokens.colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: tokens.colors.surface,
      color: tokens.colors.text.primary,
    }}
  />
  {error && (
    <Text
      style={{
        color: tokens.colors.error.main,
        fontSize: 12,
        marginTop: 4,
      }}
    >
      {error}
    </Text>
  )}
</View>;
```

### Алерт

```tsx
<View
  style={{
    backgroundColor: tokens.colors.warning.light,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: tokens.colors.warning.main,
    flexDirection: 'row',
    gap: 8,
  }}
>
  <MaterialCommunityIcons name="alert" size={20} color={tokens.colors.warning.main} />
  <View style={{ flex: 1 }}>
    <Text
      style={{
        color: tokens.colors.warning.main,
        fontWeight: '600',
        fontSize: 14,
      }}
    >
      Внимание
    </Text>
    <Text
      style={{
        color: tokens.colors.text.secondary,
        fontSize: 13,
        marginTop: 4,
      }}
    >
      Перерыв превысил 15 минут
    </Text>
  </View>
</View>
```

---

## Что удалено

### Удалённые токены (2025-11-01)

| Токен            | Замена                             |
| ---------------- | ---------------------------------- |
| `primary.darker` | → `primary.dark`                   |
| `gray[700]`      | → `gray[500]` или `text.primary`   |
| `gray[900]`      | → `text.primary`                   |
| `warning.dark`   | → `warning.main`                   |
| `overlay`        | → `'rgba(0, 0, 0, 0.5)'` напрямую  |
| `backdrop`       | → `'rgba(0, 0, 0, 0.25)'` напрямую |
| `divider`        | → `gray[100]`                      |

**Причина удаления:** Неиспользуемые токены (0-1 использование в кодовой базе)

---

## Чек-лист перед использованием цвета

- [ ] Проверил, есть ли подходящий токен для моего случая
- [ ] Использую `tokens.colors.*` вместо hardcoded значений
- [ ] Выбрал правильный оттенок (light/main/dark)
- [ ] Обеспечил достаточный контраст для текста
- [ ] Использую семантические цвета для статусов (success/warning/error)

---

## Полезные ссылки

- [UI Guidelines](UI_GUIDELINES.md) - общие правила UI
- [Typography Guide](TYPOGRAPHY_GUIDE.md) - типографика
- [Design System](DESIGN_SYSTEM.md) - полная дизайн-система
- [Quick Reference](DESIGN_QUICK_REF.md) - быстрая справка
