/**
 * 🎨 App Theme
 * 
 * Тема для React Native Paper
 * Использует новую систему UI tokens из src/ui/
 */

import { MD3LightTheme as PaperMD3LightTheme } from 'react-native-paper';
import { tokens, colors } from './ui';

/**
 * @deprecated Используй tokens.colors.text.secondary напрямую
 */
export const placeholderColor = colors.text.secondary;

/**
 * Тема приложения для React Native Paper
 */
export const AppTheme = {
  ...PaperMD3LightTheme,
  roundness: tokens.radius.md,
  colors: {
    ...PaperMD3LightTheme.colors,
    primary: colors.primary.main,
    secondary: colors.primary.dark,     // используем dark вместо [600]
    background: colors.background,
    surface: colors.surface,
    onSurfaceVariant: colors.text.secondary,
    outline: colors.border,
    error: colors.error.main,
    success: colors.success.main,
    warning: colors.warning.main,
    // info удалён из палитры - используем primary
  },
} as const;

/**
 * Удобный экспорт tokens для использования в компонентах
 * 
 * @example
 * import { uiTokens } from '../theme';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     padding: uiTokens.spacing.md,
 *   }
 * });
 */
export const uiTokens = tokens;
