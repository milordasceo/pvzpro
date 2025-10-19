/**
 * 🏷️ StatusBadge - Компонент для отображения статусов
 * 
 * Использует предустановленные стили для разных типов статусов
 * 
 * @example
 * <StatusBadge status="success">На смене</StatusBadge>
 * <StatusBadge status="warning">Опоздание</StatusBadge>
 * <StatusBadge status="error">Неактивен</StatusBadge>
 * <StatusBadge status="info">В пути</StatusBadge>
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { tokens } from '../../theme';

export type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusBadgeProps {
  /** Тип статуса (определяет цвет) */
  status: BadgeStatus;
  /** Текст бейджа */
  children: string;
  /** Дополнительные стили */
  style?: ViewStyle;
  /** Размер бейджа */
  size?: 'small' | 'medium' | 'large';
}

const STATUS_COLORS: Record<BadgeStatus, { bg: string; text: string }> = {
  success: {
    bg: tokens.colors.success.light,
    text: tokens.colors.success.main,  // используем main для текста
  },
  warning: {
    bg: tokens.colors.warning.light,
    text: tokens.colors.warning.main,  // используем main для текста
  },
  error: {
    bg: tokens.colors.error.light,
    text: tokens.colors.error.main,    // используем main для текста
  },
  info: {
    bg: tokens.colors.primary.light,   // используем primary вместо info
    text: tokens.colors.primary.main,
  },
  neutral: {
    bg: tokens.colors.gray[100],
    text: tokens.colors.gray[500],     // используем 500 вместо 700
  },
};

const SIZE_STYLES = {
  small: {
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.sm,
    fontSize: tokens.fontSize.xs,
  },
  medium: {
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.md,
    fontSize: tokens.fontSize.sm,
  },
  large: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    fontSize: tokens.fontSize.md,
  },
};

export const StatusBadge = React.memo<StatusBadgeProps>(({
  status,
  children,
  style,
  size = 'medium',
}) => {
  const colors = STATUS_COLORS[status];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        style,
      ]}
    >
      <Text 
        variant="labelMedium"
        style={[
          styles.text,
          { 
            color: colors.text,
            fontSize: sizeStyle.fontSize,
          }
        ]}
      >
        {children}
      </Text>
    </View>
  );
});

StatusBadge.displayName = 'StatusBadge';

const styles = StyleSheet.create({
  container: {
    borderRadius: tokens.radius.full,
    alignSelf: 'flex-start',
  },
  
  text: {
    fontWeight: tokens.fontWeight.medium,
  },
});

