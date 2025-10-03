import { UI_TOKENS } from '../ui/themeTokens';

/**
 * Утилиты для создания унифицированных стилей
 * Заменяют повторяющиеся паттерны создания стилей
 */

export const createCardStyle = (overrides?: any) => ({
  borderRadius: UI_TOKENS.radius,
  backgroundColor: '#FFFFFF',
  ...overrides,
});

export const createButtonStyle = (overrides?: any) => ({
  borderRadius: UI_TOKENS.radius,
  ...overrides,
});

export const createDialogStyle = (overrides?: any) => ({
  borderRadius: UI_TOKENS.radius,
  ...overrides,
});

export const createScrollViewContentStyle = (padding = 16, overrides?: any) => ({
  padding,
  gap: UI_TOKENS.gap,
  ...overrides,
});

export const createInputStyle = (overrides?: any) => ({
  height: UI_TOKENS.controlHeight,
  borderRadius: UI_TOKENS.radius,
  ...overrides,
});

export const createTextStyle = (size: 'small' | 'medium' | 'large' = 'medium', overrides?: any) => {
  const sizes = {
    small: { fontSize: 12 },
    medium: { fontSize: 14 },
    large: { fontSize: 16 },
  };

  return {
    ...sizes[size],
    color: '#111827',
    ...overrides,
  };
};
