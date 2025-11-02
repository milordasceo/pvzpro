# Руководство по миграции на обновленный стек

## Что изменилось?

### ESLint 9 (Breaking Changes!)
Самое значительное изменение - миграция с ESLint 8 на ESLint 9 с новым форматом конфигурации.

#### Старая конфигурация (удалена)
```javascript
// .eslintrc.cjs
module.exports = {
  extends: [...],
  rules: {...}
}
```

#### Новая конфигурация (flat config)
```javascript
// eslint.config.js
export default [
  { ignores: [...] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { rules: {...} }
]
```

### Package.json
Добавлено поле `"type": "module"` для поддержки ES-модулей.

## Что нужно сделать после обновления?

### 1. Установить зависимости
```bash
npm install
```

### 2. Удалить старые кэши (опционально)
```bash
# Очистить кэш npm
npm cache clean --force

# Очистить кэш Metro bundler
npm start -- --clear

# Очистить кэш Gradle (Android)
cd android && ./gradlew clean && cd ..
```

### 3. Проверить линтер
```bash
npm run lint
```

Если появляются новые ошибки, которых раньше не было:
- Проверьте настройки в `eslint.config.js`
- ESLint 9 более строгий в некоторых случаях

### 4. Проверить типы
```bash
npm run typecheck
```

Существующие ошибки TypeScript (не связанные с обновлением):
- Неправильное использование props в react-native-paper компонентах
- Отсутствие некоторых свойств в типах (например, `color`, `size`)

### 5. Форматирование кода
```bash
# Проверить форматирование
npm run format

# Автоматически исправить форматирование
npx prettier --write ./src
```

## Особенности работы с ESLint 9

### Новые пакеты
- `@eslint/js` - базовая конфигурация ESLint
- `typescript-eslint` - единый пакет для TypeScript поддержки

### Устаревшие пакеты (все еще установлены для совместимости)
- `@react-native-community/eslint-config` - не поддерживает ESLint 9

### Конфигурация игнорирования
В ESLint 9 файл `.eslintignore` не используется. Вместо этого:
```javascript
export default [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'android/**',
      'ios/**',
    ]
  },
  // ... остальная конфигурация
]
```

## Возможные проблемы и решения

### Проблема: ESLint показывает ошибки модулей
**Решение**: Убедитесь, что в `package.json` есть `"type": "module"`

### Проблема: Конфликты peer dependencies
**Решение**: Это нормально для переходного периода. @react-native-community/eslint-config требует ESLint 8, но мы используем ESLint 9. Warnings можно игнорировать.

### Проблема: Старая конфигурация не работает
**Решение**: Используйте новый `eslint.config.js` вместо `.eslintrc.cjs`

### Проблема: TypeScript ошибки в компонентах
**Решение**: Эти ошибки существовали и раньше. Нужно исправить использование props в react-native-paper компонентах:
```typescript
// Неправильно
<Text.Body color="gray">...</Text.Body>

// Правильно
<Text.Body style={{ color: 'gray' }}>...</Text.Body>
```

## Проверка после миграции

Контрольный список:
- [ ] `npm install` выполнен успешно
- [ ] `npm run lint` работает без критических ошибок
- [ ] `npm run typecheck` выполняется (даже с существующими ошибками)
- [ ] `npm run format` работает
- [ ] `npm start` запускает dev server
- [ ] Приложение запускается на эмуляторе/устройстве

## Дальнейшие шаги

1. Исправить существующие ошибки TypeScript
2. Запустить автоформатирование: `npx prettier --write ./src`
3. Протестировать приложение на всех платформах
4. Обновить CI/CD pipeline, если необходимо

## Откат изменений (если нужно)

Если возникли критические проблемы:
```bash
git checkout HEAD -- package.json package-lock.json
git checkout HEAD -- eslint.config.js
git checkout HEAD -- .eslintrc.cjs
npm install
```

## Поддержка

При возникновении проблем:
1. Проверьте `TECH_STACK_UPDATE.md` для деталей обновления
2. Проверьте логи: `npm run lint` и `npm run typecheck`
3. Создайте issue с описанием проблемы
