import { colors } from './colors';
import { layout } from './layout';
import { typography, spacing, borderRadius, shadows } from './tokens';

export const theme = {
  colors,
  layout,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type AppTheme = typeof theme;
