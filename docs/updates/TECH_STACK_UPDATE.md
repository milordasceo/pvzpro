# Обновление технологического стека

## Дата обновления
Декабрь 2025

**Актуализация:** 04-11-13-17

## Обновленные основные зависимости

### Core
- **React**: 19.1.0 (оставлено в рамках SDK 54)
- **React Native**: 0.81.x (оставлено для совместимости SDK 54)
- **Expo SDK**: 54.0.22 ✅ (патч-обновление)
- **TypeScript**: 5.9.3 ✅

### React Navigation
- **@react-navigation/bottom-tabs**: 7.4.5 → 7.7.3 ✅
- **@react-navigation/material-top-tabs**: 7.3.5 → 7.4.2 ✅
- **@react-navigation/native**: 7.1.17 → 7.1.19 ✅
- **@react-navigation/native-stack**: 7.3.24 → 7.6.2 ✅

### UI & Gestures
- **@expo/vector-icons**: 15.0.2 → 15.0.3 ✅
- **expo-image**: 3.0.9 → 3.0.10 ✅
- **react-native-gesture-handler**: 2.28.0 (без изменений)
- **react-native-maps**: 1.20.1 (без изменений)
- **react-native-safe-area-context**: 5.6.2 ✅
- **react-native-screens**: 4.16.0 (без изменений)

### Dev Dependencies
- **@babel/core**: 7.25.2 → 7.28.5 ✅
- **@types/react**: 19.1.10 → 19.2.2 ✅
- **@typescript-eslint/eslint-plugin**: 8.44.1 → 8.46.2 ✅
- **@typescript-eslint/parser**: 8.44.1 → 8.46.2 ✅
- **eslint**: 8.57.1 → 9.39.1 ✅ (major update!)
- **eslint-plugin-react-hooks**: 5.2.0 → 7.0.1 ✅

## Важные изменения

### ESLint 9 Migration
- **Старый формат**: `.eslintrc.cjs` (удален)
- **Новый формат**: `eslint.config.js` (flat config)
- Добавлен `@eslint/js` и `typescript-eslint` пакеты
- Обновлена конфигурация для совместимости с ESLint 9

### Package.json
- Добавлено `"type": "module"` для поддержки ES модулей в конфигурационных файлах

### EAS CLI
- Минимальная версия обновлена: 12.0.0 → 16.26.0 ✅

### Android
- Gradle версия: 8.13 (уже актуальная)
- Включена новая архитектура React Native (newArchEnabled=true)
- Включен Hermes JS engine

## Несовместимости

### @react-native-community/eslint-config
Этот пакет не поддерживает ESLint 9. Зависимости:
- eslint-plugin-ft-flow требует ESLint ^8.1.0
- eslint-plugin-jest требует ESLint ^6.0.0 || ^7.0.0 || ^8.0.0
- eslint-plugin-react-hooks требует ESLint ^3.0.0-^8.0.0
- eslint-plugin-react-native требует ESLint ^3.17.0-^8

**Решение**: Создан собственный `eslint.config.js` с поддержкой ESLint 9, который заменяет @react-native-community/eslint-config.

## Команды для проверки

```bash
# Проверка зависимостей
npm outdated

# Установка зависимостей
npm install

# Проверка линтера
npm run lint

# Проверка форматирования
npm run format

# Проверка типов
npm run typecheck

# Запуск приложения
npm start
```

## Следующие шаги

1. ✅ Все основные зависимости обновлены до последних версий
2. ✅ ESLint мигрирован на версию 9 с flat config
3. ⚠️ Есть существующие ошибки типов TypeScript (не связаны с обновлением)
4. ⚠️ Есть предупреждения форматирования Prettier (не связаны с обновлением)

## Рекомендации

### Краткосрочные
- Исправить ошибки TypeScript, связанные с react-native-paper компонентами
- Запустить `prettier --write ./src` для автоматического форматирования кода

### Среднесрочные
- Рассмотреть замену @react-native-community/eslint-config на собственную конфигурацию
- Обновлять зависимости регулярно (раз в месяц)

### Долгосрочные
- Следить за обновлениями Expo SDK (обычно выходят каждые 3-4 месяца)
- Мониторить breaking changes в React Native и React
