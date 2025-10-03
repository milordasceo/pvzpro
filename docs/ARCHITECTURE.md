# Архитектура проекта WB ПВЗ (на 2025-09-26T07:45:13.2363989+07:00)

## Обзор
Приложение построено на **Expo Managed Workflow** с EAS Build/Submit и разделением логики на слои: презентация, бизнес-логика, инфраструктура. Код написан на TypeScript.

## Структура проекта
```
src/
├── attendance/           # QR, геолокация (утилиты и экраны)
├── chat/                 # Список диалогов и экран переписки
├── components/           # Унифицированные Paper-компоненты (Styled*)
├── config/               # Конфигурация приложения (app.ts, env)
├── employee/             # Экраны сотрудника (ProcessTab, TasksTab, Finance и т.д.)
├── hooks/                # Переиспользуемые хуки (useConfirmDialog, useForm, ...)
├── navigation/           # Навигаторы (AppNavigator, табы по ролям)
├── providers/            # Корневые провайдеры (AppProvider)
├── screens/              # Экраны владельца/админа (DevicePair, PvzSettings)
├── services/             # API и бизнес-логика (qr, finance, notifications и т.д.)
├── store/                # Zustand сторы (auth, shift, requests)
├── theme.ts              # Глобальная тема Paper (MD3)
├── ui/                   # Токены темы (radius, размеры)
├── utils/                # Утилиты (qr, geo, styles, validation, storage)
├── types/                # Типы доменных сущностей
└── App.tsx               # Входная точка приложения (Expo)
```
Дополнительно:
```
app.config.ts            # Expo-конфиг (версионирование, bundle/package id)
eas.json                 # Профили сборки (development/preview/production)
assets/                  # Иконки, Splash, медиа
scripts/                 # Служебные скрипты (generate-qr и т.п.)
```

## Основные принципы
1. **Separation of Concerns** — UI, бизнес-логика и инфраструктура разнесены.
2. **Consistency** — единые компоненты, токены, цвета, ESLint/Prettier.
3. **Scalability** — фича-папки (employee/chat/attendance) с локальной логикой.
4. **Maintainability** — строгая типизация, persist сторы, централизованные сервисы.

## Слои
- **Презентация:** `components`, `employee`, `screens`, `navigation`, `theme.ts`.
- **Бизнес-логика:** `services/qr`, `services/finance`, `store/`, `utils/qr`, `utils/geo`.
- **Инфраструктура:** `config/app.ts`, `app.config.ts`, `types`, `providers`, интеграция с AsyncStorage/EAS.

## Управление состоянием
Используется **Zustand 5** + persist (AsyncStorage). Структура стора пример:
```ts
interface ShiftState {
  currentShift: Shift | null;
  shifts: Shift[];
  isLoading: boolean;
  error: string | null;
  startShift(...): Promise<void>;
  endShift(): Promise<void>;
  ...
}
```
Persist настроен через `createJSONStorage(() => AsyncStorage)` наступных сторах: `auth`, `shift`, `requests` (частичное сохранение: только важные поля).

## Конфигурация
- **`app.config.ts`**: управляет `version`, `bundleIdentifier`, `package`, разрешениями, `extra` (`apiUrl`, `environment`). Читает `.env` (через `dotenv/config`).
- **`eas.json`**: профили `development` (internal), `preview` (apk), `production` (store, autoIncrement). Используется EAS Build/Submit (`npm run build:*`, `npm run submit:*`).

## QR/Гео инфраструктура
- `src/utils/qr.ts`: парсинг, HMAC-SHA256 (`crypto-js`), проверка подписи, TTL.
- `src/utils/geo.ts`: Haversine-дистанция, нормализация координат.
- `attendance/qr.ts`, `services/qr.service.ts`, `ProcessTab` используют единую реализацию.

## Унифицированные компоненты
- `StyledButton`, `StyledCard`, `StyledDialog`, `StyledScrollView`, `SquareIconButton` — обёртки над Paper с токенами.
- `MetaRow`: стандартная строка с иконкой/текстом.
- Токены (`src/ui/themeTokens.ts`): radius=8, controlHeight=48, buttonHeight=44, gap=12.

## Навигация
```
AppNavigator (Stack)
├── AuthNavigator (Stack)  # пока заглушка
└── MainNavigator (role switch)
     ├── EmployeeTabNavigator (График/Финансы/Чат/Моя смена)
     ├── AdminTabNavigator   (Список/График/Расчёт)
     └── OwnerTabNavigator   (Плейсхолдеры)
```
Главный `App.tsx` оборачивает приложение в `AppProvider` (SafeArea, PaperProvider, NavigationContainer, TasksCounterProvider).

## Сервисы
- `services/api.ts`: fetch + таймаут/AbortController.
- `services/qr.service.ts`: генерация/валидация QR, гео-вёрка, интеграция с API.
- `services/finance.service.ts`: моковые данные по платежам/сменам.
- `services/notifications.ts`: инициализация, напоминания.

## Документация
- **`docs/`**: обзор, задачи, архитектура, дизайн-система, модули, правила сессий, унифицированные компоненты.
- `STATUS_CHECK.md`: оперативные статусы (например, восстановление вкладок).

## Технический стек & DevOps
- Управление зависимостями: npm (`package-lock.json`).
- ESLint + Prettier (`npm run lint`, `npm run format`).
- TypeScript `--noEmit` (`npm run typecheck`).
- EAS Build/Submit (`npm run build:android`, `npm run submit:android`, аналогично для iOS).
- Git-репозиторий в состоянии индексирования новых модулей (`git-status.html` хранит снимок).

## Будущие направления
- Supabase интеграция (auth, график, заявки, чат) + миграции/RLS.
- Auth/удостоверение, уведомления, PvzSettings с картой.
- CI/CD (Husky, GitHub Actions) и документация релизов.
- Storybook для компонентов (по необходимости).

---

*Документ обновляется по мере развития архитектуры и инфраструктуры проекта.*
