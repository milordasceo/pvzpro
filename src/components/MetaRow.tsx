import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function safeDate(value?: string) {
  try {
    const d = new Date(value ?? '');
    if (isNaN(d.getTime())) return value ?? '';
    return d.toLocaleDateString();
  } catch {
    return value ?? '';
  }
}

export const MetaRow: React.FC<{
  icon: any;
  label: string;
  subdued?: boolean;
  rightValue?: string;
  rightColor?: string;
}> = ({ icon, label, subdued, rightValue, rightColor }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
      <MaterialCommunityIcons name={icon} size={16} color={subdued ? '#9CA3AF' : '#6B7280'} />
      <Text style={{ color: subdued ? '#9CA3AF' : '#6B7280' }}>{label}</Text>
    </View>
    {rightValue ? (
      <Text style={{ color: rightColor ?? '#111827', fontWeight: '600', marginLeft: 12 }}>
        {rightValue}
      </Text>
    ) : null}
  </View>
);
