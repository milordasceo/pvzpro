import React from 'react';
import { ScrollView as RNScrollView, ScrollViewProps as RNScrollViewProps } from 'react-native';
import { tokens } from '../../theme';

export interface ScrollViewProps extends RNScrollViewProps {
  children: React.ReactNode;
  padding?: number;
  gap?: number;
  hideScrollIndicator?: boolean;
}

/**
 * 📜 ScrollView - Унифицированный скролл
 * 
 * Обёртка над React Native ScrollView с предустановленными настройками
 * для единообразия во всём приложении.
 * 
 * @example
 * ```tsx
 * <ScrollView padding={16} gap={12}>
 *   <Card>...</Card>
 *   <Card>...</Card>
 * </ScrollView>
 * ```
 * 
 * @example
 * ```tsx
 * <ScrollView hideScrollIndicator={false}>
 *   <LongContent />
 * </ScrollView>
 * ```
 */
export const ScrollView = React.memo(
  React.forwardRef<RNScrollView, ScrollViewProps>(
    (
      {
        children,
        padding = 16,
        gap = tokens.spacing.cardGap,
        hideScrollIndicator = true,
        contentContainerStyle,
        ...props
      },
      ref,
    ) => {
      const defaultContentStyle = [{ padding, gap }, contentContainerStyle as any];

      return (
        <RNScrollView
          ref={ref}
          showsVerticalScrollIndicator={!hideScrollIndicator}
          contentContainerStyle={defaultContentStyle as any}
          {...props}
        >
          {children}
        </RNScrollView>
      );
    },
  ),
);

ScrollView.displayName = 'ScrollView';

