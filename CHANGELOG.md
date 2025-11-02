# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed - Tech Stack Update (December 2025)

#### Major Updates 🚀
- **React** upgraded from 19.1.0 to 19.2.0
- **React Native** upgraded from 0.81.4 to 0.82.1
- **Expo SDK** upgraded from 54.0.13 to 54.0.21
- **ESLint** major upgrade from 8.57.1 to 9.39.0 with flat config migration
- **TypeScript** upgraded from 5.9.2 to 5.9.3

#### Navigation Updates 🧭
- **@react-navigation/bottom-tabs** upgraded from 7.4.5 to 7.7.3
- **@react-navigation/material-top-tabs** upgraded from 7.3.5 to 7.4.2
- **@react-navigation/native** upgraded from 7.1.17 to 7.1.19
- **@react-navigation/native-stack** upgraded from 7.3.24 to 7.6.2

#### UI & Interaction Updates 🎨
- **@expo/vector-icons** upgraded from 15.0.2 to 15.0.3
- **expo-image** upgraded from 3.0.9 to 3.0.10
- **react-native-gesture-handler** upgraded from 2.28.0 to 2.29.0
- **react-native-maps** upgraded from 1.20.1 to 1.26.18 (significant update)
- **react-native-safe-area-context** upgraded from 5.6.0 to 5.6.2
- **react-native-screens** upgraded from 4.16.0 to 4.18.0

#### Developer Tools Updates 🛠️
- **@babel/core** upgraded from 7.25.2 to 7.28.5
- **@types/react** upgraded from 19.1.10 to 19.2.2
- **@typescript-eslint/eslint-plugin** upgraded from 8.44.1 to 8.46.2
- **@typescript-eslint/parser** upgraded from 8.44.1 to 8.46.2
- **eslint-plugin-react-hooks** upgraded from 5.2.0 to 7.0.1 (major update)

#### Configuration Updates ⚙️
- **EAS CLI** minimum version updated from 12.0.0 to 16.26.0
- Added `"type": "module"` to package.json for ES modules support
- Migrated from `.eslintrc.cjs` to `eslint.config.js` (ESLint 9 flat config)

### Added
- 📄 `TECH_STACK_UPDATE.md` - Comprehensive tech stack update documentation
- 📄 `MIGRATION_GUIDE.md` - Developer migration guide for ESLint 9
- 📄 `CHANGELOG.md` - Project changelog
- 🔧 `eslint.config.js` - New ESLint 9 flat config format
- 📦 New packages: `@eslint/js`, `typescript-eslint`

### Removed
- 🗑️ `.eslintrc.cjs` - Replaced by `eslint.config.js`

### Migration Notes
- **Breaking**: ESLint 9 requires flat config format. See `MIGRATION_GUIDE.md` for details.
- **Warning**: Some peer dependency warnings are expected due to @react-native-community/eslint-config not supporting ESLint 9 yet.
- **Action Required**: Run `npm install` after pulling these changes.

## [1.0.0] - 2025-10-30

### Initial Stable Release
- ✅ UI System with Design tokens and 20+ components
- ✅ Admin Dashboard with Control and On-Shift tabs
- ✅ Employee MVP with basic functionality
- ✅ Complete navigation system
- ✅ Full documentation

---

## Version Status

### Current Version
**1.0.0-stable** (October 30, 2025) with Tech Stack Update (December 2025)

### Tech Stack Versions
- React: 19.2.0
- React Native: 0.82.1
- Expo SDK: 54.0.21
- TypeScript: 5.9.3
- ESLint: 9.39.0
- Node: 18+ (recommended)
- npm: 9+ (recommended)

### Browser/Platform Support
- Android: 6.0+ (API 23+)
- iOS: 13.0+
- Web: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)

---

For more details about the tech stack update, see:
- [`TECH_STACK_UPDATE.md`](TECH_STACK_UPDATE.md) - Full update details
- [`MIGRATION_GUIDE.md`](MIGRATION_GUIDE.md) - Migration instructions
- [`README.md`](README.md) - Project overview
