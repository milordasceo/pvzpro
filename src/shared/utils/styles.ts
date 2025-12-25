import { typography, spacing, borderRadius } from '../theme/tokens';
import { colors } from '../theme/colors';

// Create a tokens object for backward compatibility
const tokens = {
  colors: {
    surface: colors.white,
    text: { primary: colors.text.primary },
  },
  radius: borderRadius,
  spacing: {
    cardGap: spacing.md,
    controlHeight: 48,
  },
  fontSize: typography.size,
};

/**
 * Утилиты для создания унифицированных стилей
 * Заменяют повторяющиеся паттерны создания стилей
 */

export const createCardStyle = (overrides?: any) => ({
  borderRadius: tokens.radius.lg,
  backgroundColor: tokens.colors.surface,
  ...overrides,
});

export const createButtonStyle = (overrides?: any) => ({
  borderRadius: tokens.radius.md,
  ...overrides,
});

export const createDialogStyle = (overrides?: any) => ({
  borderRadius: tokens.radius.lg,
  ...overrides,
});

export const createScrollViewContentStyle = (padding = 16, overrides?: any) => ({
  padding,
  gap: tokens.spacing.cardGap,
  ...overrides,
});

export const createInputStyle = (overrides?: any) => ({
  height: tokens.spacing.controlHeight,
  borderRadius: tokens.radius.lg,
  ...overrides,
});

export const createTextStyle = (size: 'small' | 'medium' | 'large' = 'medium', overrides?: any) => {
  const sizes = {
    small: { fontSize: tokens.fontSize.xs },
    medium: { fontSize: tokens.fontSize.sm },
    large: { fontSize: tokens.fontSize.base },
  };

  return {
    ...sizes[size],
    color: tokens.colors.text.primary,
    ...overrides,
  };
};
