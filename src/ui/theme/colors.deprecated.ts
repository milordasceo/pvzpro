/**
 * ⚠️ DEPRECATED COLORS
 * 
 * Эти цвета сохранены для обратной совместимости,
 * но НЕ рекомендуются к использованию в новом коде.
 * 
 * Используйте вместо них colors из './colors.ts'
 * 
 * @deprecated Будут удалены в следующей мажорной версии
 */

/**
 * @deprecated Используйте colors.primary.main, .light, .dark
 * Сохранено для обратной совместимости
 */
export const deprecatedPrimaryShades = {
  50: '#F5F3FF',
  100: '#EDE9FE',   // → используйте primary.light
  200: '#DDD6FE',
  300: '#C4B5FD',
  400: '#A78BFA',
  500: '#8B5CF6',
  600: '#7C3AED',   // → используйте primary.dark
  700: '#6D28D9',
  800: '#5B21B6',
  900: '#4C1D95',
} as const;

/**
 * @deprecated Используйте colors.gray[50-900]
 * Gray оставлен полностью, эти дополнительные не нужны
 */
export const deprecatedGrayShades = {
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
} as const;

/**
 * @deprecated Используйте colors.success.main, .light
 */
export const deprecatedSuccessShades = {
  lighter: '#ECFDF5',
  600: '#16A34A',
  dark: '#059669',
} as const;

/**
 * @deprecated Используйте colors.warning.main, .light
 */
export const deprecatedWarningShades = {
  900: '#92400E',
  dark: '#D97706',
} as const;

/**
 * @deprecated Используйте colors.error.main, .light
 */
export const deprecatedErrorShades = {
  lighter: '#FEF2F2',
  500: '#EF4444',
  800: '#991B1B',
  dark: '#B91C1C',
} as const;

/**
 * @deprecated Info цвет редко используется
 * Рекомендуется использовать primary для информационных элементов
 */
export const deprecatedInfoColors = {
  lighter: '#EFF6FF',
  200: '#BFDBFE',
  light: '#CFFAFE',
  main: '#0891B2',
  800: '#1E40AF',
  dark: '#0E7490',
} as const;

/**
 * @deprecated Используйте прямо colors.success.main, etc.
 * Badge предустановки избыточны
 */
export const deprecatedBadgeColors = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#0891B2',
  neutral: '#6B7280',
} as const;

/**
 * Миграция:
 * 
 * БЫЛО:
 * tokens.colors.primary[100]     → tokens.colors.primary.light
 * tokens.colors.primary[600]     → tokens.colors.primary.dark
 * tokens.colors.success.lighter  → tokens.colors.success.light
 * tokens.colors.success[600]     → tokens.colors.success.main
 * tokens.colors.error[500]       → tokens.colors.error.main
 * tokens.colors.info.main        → tokens.colors.primary.main
 * tokens.colors.badge.success    → tokens.colors.success.main
 */

