/**
 * 🎨 Единая система Design Tokens
 * 
 * Централизованный экспорт всех design tokens
 */

import { colors } from './colors';
import { spacing, radius, elevation } from './spacing';
import { fontSize, fontWeight, lineHeight, paperVariants } from './typography';

/**
 * Все design tokens в одном объекте
 */
export const tokens = {
  colors,
  spacing,
  radius,
  elevation,
  fontSize,
  fontWeight,
  lineHeight,
  paperVariants,
} as const;

export type Tokens = typeof tokens;

// Re-export типов
export type { Colors } from './colors';
export type { Spacing, Radius, Elevation } from './spacing';
export type { FontSize, FontWeight, PaperVariant } from './typography';

