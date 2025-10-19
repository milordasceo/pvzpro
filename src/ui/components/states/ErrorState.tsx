/**
 * ❌ ErrorState - Компонент для состояния ошибки
 * 
 * Отображает сообщение об ошибке с кнопкой повтора
 * 
 * @example
 * <ErrorState
 *   title="Ошибка загрузки"
 *   message="Не удалось загрузить данные"
 *   onRetry={handleRetry}
 * />
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../theme';
import { StyledButton } from '../../../components/StyledButton';

export interface ErrorStateProps {
  /** Заголовок ошибки */
  title?: string;
  /** Сообщение об ошибке */
  message: string;
  /** Callback для повторной попытки */
  onRetry?: () => void;
  /** Текст кнопки повтора */
  retryLabel?: string;
  /** Дополнительные стили */
  style?: ViewStyle;
}

export const ErrorState = React.memo<ErrorStateProps>(({
  title = 'Что-то пошло не так',
  message,
  onRetry,
  retryLabel = 'Повторить',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={64}
        color={tokens.colors.error.main}
        style={styles.icon}
      />
      
      <Text variant="titleLarge" style={styles.title}>
        {title}
      </Text>
      
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
      
      {onRetry && (
        <StyledButton
          mode="contained"
          onPress={onRetry}
          icon="refresh"
          style={styles.button}
        >
          {retryLabel}
        </StyledButton>
      )}
    </View>
  );
});

ErrorState.displayName = 'ErrorState';

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
  
  message: {
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: tokens.spacing.xl,
  },
  
  button: {
    marginTop: tokens.spacing.md,
  },
});

