/**
 * 🗂️ EmptyState - Компонент для пустых состояний
 * 
 * Отображает иконку, заголовок, описание и опциональную кнопку действия
 * 
 * @example
 * <EmptyState
 *   icon="account-off"
 *   title="Нет сотрудников"
 *   description="Добавьте первого сотрудника для начала работы"
 *   action={{
 *     label: 'Добавить сотрудника',
 *     onPress: handleAdd,
 *   }}
 * />
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../theme';
import { Button } from '../buttons/Button';

export interface EmptyStateProps {
  /** Имя иконки из MaterialCommunityIcons */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Заголовок */
  title: string;
  /** Описание (опционально) */
  description?: string;
  /** Действие (опционально) */
  action?: {
    label: string;
    onPress: () => void;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  };
  /** Дополнительные стили */
  style?: ViewStyle;
}

export const EmptyState = React.memo<EmptyStateProps>(({
  icon,
  title,
  description,
  action,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        name={icon}
        size={64}
        color={tokens.colors.text.disabled}
        style={styles.icon}
      />
      
      <Text variant="titleLarge" style={styles.title}>
        {title}
      </Text>
      
      {description && (
        <Text variant="bodyMedium" style={styles.description}>
          {description}
        </Text>
      )}
      
      {action && (
        <Button
          mode="contained"
          onPress={action.onPress}
          icon={action.icon}
          style={styles.button}
        >
          {action.label}
        </Button>
      )}
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xl,
  },
  
  icon: {
    marginBottom: tokens.spacing.lg,
  },
  
  title: {
    color: tokens.colors.text.primary,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  
  description: {
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: tokens.spacing.xl,
  },
  
  button: {
    marginTop: tokens.spacing.md,
  },
});

