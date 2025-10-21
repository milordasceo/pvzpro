import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Switch, Text, Chip } from 'react-native-paper';
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
  const statusOptions = [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'inactive', label: 'Неактивные' },
  ] as const;

  return (
    <View style={styles.container}>
      {/* Статус - чипы вместо сегментов */}
      <View style={styles.section}>
        <Text variant="labelSmall" style={styles.label}>
          Статус
        </Text>
        <View style={styles.chipsRow}>
          {statusOptions.map((option) => (
            <Chip
              key={option.value}
              selected={filters.status === option.value}
              onPress={() =>
                onFiltersChange({
                  ...filters,
                  status: option.value,
                })
              }
              style={[
                styles.chip,
                filters.status === option.value && styles.chipSelected,
              ]}
              textStyle={[
                styles.chipText,
                filters.status === option.value && styles.chipTextSelected,
              ]}
              mode="outlined"
            >
              {option.label}
            </Chip>
          ))}
        </View>
      </View>

      {/* Только на смене - компактнее */}
      <View style={styles.switchRow}>
        <Text variant="labelSmall" style={styles.label}>
          Только на смене
        </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  section: {
    gap: 8,
  },
  label: {
    color: tokens.colors.text.secondary,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.gray[300],
  },
  chipSelected: {
    backgroundColor: tokens.colors.primary.light,
    borderColor: tokens.colors.primary.main,
  },
  chipText: {
    color: tokens.colors.text.secondary,
    fontSize: 13,
  },
  chipTextSelected: {
    color: tokens.colors.primary.main,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});

