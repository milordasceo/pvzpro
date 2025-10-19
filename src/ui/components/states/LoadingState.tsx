/**
 * ⏳ LoadingState - Компонент для состояния загрузки
 * 
 * Отображает индикатор загрузки с опциональным текстом
 * 
 * @example
 * <LoadingState />
 * <LoadingState text="Загрузка данных..." />
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { tokens } from '../../theme';

export interface LoadingStateProps {
  /** Текст загрузки (опционально) */
  text?: string;
  /** Размер индикатора */
  size?: 'small' | 'large';
  /** Дополнительные стили */
  style?: ViewStyle;
}

export const LoadingState = React.memo<LoadingStateProps>(({
  text = 'Загрузка...',
  size = 'large',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator 
        size={size} 
        color={tokens.colors.primary.main}
        style={styles.indicator}
      />
      
      {text && (
        <Text variant="bodyMedium" style={styles.text}>
          {text}
        </Text>
      )}
    </View>
  );
});

LoadingState.displayName = 'LoadingState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xl,
  },
  
  indicator: {
    marginBottom: tokens.spacing.md,
  },
  
  text: {
    color: tokens.colors.text.secondary,
    textAlign: 'center',
  },
});

