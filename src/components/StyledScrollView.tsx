import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { UI_TOKENS } from '../ui/themeTokens';

export interface StyledScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  padding?: number;
  gap?: number;
  hideScrollIndicator?: boolean;
}

/**
 * Унифицированный ScrollView с предустановленными стилями
 * Заменяет повторяющиеся ScrollView компоненты с одинаковыми настройками
 */
export const StyledScrollView = React.memo(
  React.forwardRef<ScrollView, StyledScrollViewProps>(
    (
      {
        children,
        padding = 16,
        gap = UI_TOKENS.gap,
        hideScrollIndicator = true,
        contentContainerStyle,
        ...props
      },
      ref,
    ) => {
      const defaultContentStyle = [{ padding, gap }, contentContainerStyle as any];

      return (
        <ScrollView
          ref={ref}
          showsVerticalScrollIndicator={!hideScrollIndicator}
          contentContainerStyle={defaultContentStyle as any}
          {...props}
        >
          {children}
        </ScrollView>
      );
    },
  ),
);
