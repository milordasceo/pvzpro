import React from 'react';
import { View } from 'react-native';
import { SegmentedButtons, Switch, Text } from 'react-native-paper';
import { tokens } from '../../../ui';

interface EmployeeFiltersProps {
  filters: {
    status: 'all' | 'active' | 'inactive';
    pvzId: string;
    onShift: boolean | undefined;
  };
  onFiltersChange: (filters: EmployeeFiltersProps['filters']) => void;
}

export const EmployeeFilters = ({ filters, onFiltersChange }: EmployeeFiltersProps) => {
  return (
    <View
      style={{
        backgroundColor: tokens.colors.surface,
        padding: 16,
        gap: 16,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.border,
      }}
    >
      {/* Статус */}
      <View>
        <Text variant="labelMedium" style={{ marginBottom: 8 }}>
          Статус
        </Text>
        <SegmentedButtons
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value as 'all' | 'active' | 'inactive',
            })
          }
          buttons={[
            { value: 'all', label: 'Все' },
            { value: 'active', label: 'Активные' },
            { value: 'inactive', label: 'Неактивные' },
          ]}
          style={{ backgroundColor: tokens.colors.background }}
        />
      </View>

      {/* Только на смене */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="labelMedium">Только на смене</Text>
        <Switch
          value={filters.onShift === true}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              onShift: value ? true : undefined,
            })
          }
        />
      </View>

      {/* TODO: Фильтр по ПВЗ (если у админа несколько ПВЗ) */}
    </View>
  );
};

