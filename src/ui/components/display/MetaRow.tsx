import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../theme';

export interface MetaRowProps {
  icon: any;
  label: string;
  subdued?: boolean;
  rightValue?: string;
  rightColor?: string;
}

/**
 * 📊 MetaRow - Строка с метаданными
 * 
 * Компонент для отображения метаинформации в виде строки с иконкой,
 * текстом и опциональным значением справа.
 * 
 * @example
 * ```tsx
 * <MetaRow 
 *   icon="calendar" 
 *   label="Дата начала" 
 *   rightValue="20.10.2025"
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <MetaRow 
 *   icon="clock" 
 *   label="Продолжительность" 
 *   rightValue="8 часов"
 *   rightColor={tokens.colors.success.main}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <MetaRow 
 *   icon="account" 
 *   label="Неактивный пользователь" 
 *   subdued
 * />
 * ```
 */
export const MetaRow: React.FC<MetaRowProps> = React.memo(
  ({ icon, label, subdued, rightValue, rightColor }) => (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8, 
        flexShrink: 1 
      }}>
        <MaterialCommunityIcons 
          name={icon} 
          size={16} 
          color={subdued ? tokens.colors.text.muted : tokens.colors.text.secondary} 
        />
        <Text style={{ 
          color: subdued ? tokens.colors.text.muted : tokens.colors.text.secondary 
        }}>
          {label}
        </Text>
      </View>
      {rightValue ? (
        <Text style={{ 
          color: rightColor ?? tokens.colors.text.primary, 
          fontWeight: '600', 
          marginLeft: 12 
        }}>
          {rightValue}
        </Text>
      ) : null}
    </View>
  )
);

MetaRow.displayName = 'MetaRow';

/**
 * 🔧 Вспомогательная функция для безопасной работы с датами
 */
export function safeDate(value?: string) {
  try {
    const d = new Date(value ?? '');
    if (isNaN(d.getTime())) return value ?? '';
    return d.toLocaleDateString();
  } catch {
    return value ?? '';
  }
}

