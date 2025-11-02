/**
 * 🎨 UI System - Единая система компонентов
 * 
 * Централизованный экспорт всех UI компонентов и утилит
 */

// Theme system
export * from './theme';

// Компоненты
export * from './components/feedback';
export * from './components/inputs';
export * from './components/states';
export * from './components/layout';
export * from './components/buttons';
export * from './components/overlays';
export * from './components/navigation';
export * from './components/display';
export * from './components/typography';

// Утилиты
export * from './utils';

// Hooks (будут добавлены позже)
// export * from './hooks';

/**
 * Удобный доступ к tokens
 * 
 * @example
 * import { tokens } from '../ui';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     padding: tokens.spacing.md,
 *     borderRadius: tokens.radius.lg,
 *     backgroundColor: tokens.colors.surface,
 *   }
 * });
 */
export { tokens } from './theme';

