# Унифицированные компоненты (на 2025-09-26T07:45:13.2363989+07:00)

## Обзор
Система унифицированных Paper-компонентов обеспечивает единый стиль и снижает дублирование. Все базовые элементы UI (кнопки, карточки, диалоги, скроллы) обёрнуты в собственные компоненты с токенами (`src/components`).

## Структура
```
src/components/
├── StyledButton.tsx       # Paper Button с токенами
├── StyledCard.tsx         # Card с заголовком/подзаголовком
├── StyledDialog.tsx       # Dialog с actions
├── StyledScrollView.tsx   # ScrollView с padding/gap
├── SquareIconButton.tsx   # Квадратная иконка-кнопка
├── MetaRow.tsx            # Строка с иконкой/текстом
├── SelectModal.tsx        # Модальное окно выбора
├── AnimatedTabBar.tsx     # Анимированная таб-панель
└── index.ts               # Реэкспорт
```
Поддерживающие части:
- `src/ui/themeTokens.ts`: числовые константы (radius, gap, controlHeight)
- `src/theme.ts`: Paper MD3 тема с кастомными цветами и roundness

## StyledButton
- Обёртка Paper Button
- Поддерживает `mode`, `icon`, `loading`, `compact`
- По умолчанию: `borderRadius = 8`, `contentStyle.height = 44`

```tsx
<StyledButton mode="contained" onPress={handleSave}>
  Сохранить
</StyledButton>
```

## StyledCard
- Card с заголовком/подзаголовком и `gap`
- Поддерживает `mode="outlined" | "elevated"`

```tsx
<StyledCard title="Информация" subtitle="Сегодня">
  <MetaRow icon="calendar" label="26 сентября" />
</StyledCard>
```

## StyledDialog
- Используется для подтверждений/информационных окон
- Принимает `actions` (сеттер кнопок)

```tsx
<StyledDialog
  visible={visible}
  onDismiss={hide}
  title="Удалить запись?"
  actions={
    <>
      <StyledButton onPress={hide}>Отмена</StyledButton>
      <StyledButton mode="contained" onPress={handleDelete}>Удалить</StyledButton>
    </>
  }
>
  <Text>Действие необратимо</Text>
</StyledDialog>
```

## StyledScrollView
- Управляет `padding`, `gap`, `showsVerticalScrollIndicator={false}`

```tsx
<StyledScrollView padding={20}>
  {/* Контент */}
</StyledScrollView>
```

## SquareIconButton
- Квадратная иконка (например, действия в карточках)

```tsx
<SquareIconButton icon="plus" onPress={handleAdd} />
```

## MetaRow
- Стандартная строка «иконка + текст» (используется в карточках)

```tsx
<MetaRow icon="clock-outline" label="10:00 – 22:00" />
```

## Хуки/утилиты
- `useConfirmDialog`, `useForm` — в `src/hooks`
- `createCardStyle`, `createButtonStyle` и т.п. — в `src/utils/styles`

## AnimatedTabBar

Анимированная таб-панель с плавным индикатором.

**Особенности:**
- Плавная spring-анимация индикатора
- Поддержка любого количества табов
- Синхронизация с React Navigation
- Поддержка свайпов и кликов

**Пример:**
```tsx
import { AnimatedTabBar, AnimatedTab } from '../components';

const tabs: AnimatedTab[] = [
  { key: 'current', label: 'Текущий период' },
  { key: 'history', label: 'История' },
];

<AnimatedTabBar
  tabs={tabs}
  activeIndex={0}
  onTabPress={(index) => console.log(index)}
/>
```

**Документация:** См. `src/components/AnimatedTabBar.README.md`

**Использование в проекте:**
- Финансы: Текущий период | История
- (Можно использовать в "Моя смена": Обзор | Задачи)

## Правила
- Не использовать Paper-компоненты напрямую; применять Styled-обёртки
- Придерживаться токенов (`UI_TOKENS`) для высот/радиусов
- Цвета брать из темы (`theme.colors`) и `placeholderColor`
- Для таб-навигации использовать `AnimatedTabBar` вместо стандартного Material Top Tabs

## План
- Добавить унифицированный `StyledTextInput`, `StyledSnackbar`
- Вынести типографику в токены (размеры/веса)
- Подготовить каталог компонентов (Storybook/Docs) при необходимости
- Заменить стандартные табы на AnimatedTabBar в модуле "Моя смена"

---

*Документ обновляется по мере появления новых унифицированных компонент и правил UI.*
