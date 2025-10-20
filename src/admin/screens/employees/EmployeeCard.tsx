import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Avatar, Badge, Chip, Text } from 'react-native-paper';
import { tokens } from '../../../ui';
import { AdminEmployee } from '../../../types/admin';

interface EmployeeCardProps {
  employee: AdminEmployee;
  onPress: () => void;
}

export const EmployeeCard = ({ employee, onPress }: EmployeeCardProps) => {
  const getStatusColor = () => {
    if (!employee.isActive) return tokens.colors.text.disabled;
    if (employee.isOnShift) return tokens.colors.success.main;
    return tokens.colors.text.secondary;
  };

  const getStatusText = () => {
    if (!employee.isActive) return 'Неактивен';
    if (employee.isOnShift) return 'На смене';
    return 'Активен';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: tokens.colors.surface,
        borderRadius: tokens.radius.md,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        elevation: 1,
      }}
    >
      {/* Аватар */}
      {employee.avatar ? (
        <Avatar.Image
          size={56}
          source={{ uri: employee.avatar }}
          style={{ backgroundColor: tokens.colors.primary.light }}
        />
      ) : (
        <Avatar.Icon
          size={56}
          icon="account"
          style={{ backgroundColor: tokens.colors.primary.light }}
        />
      )}

      {/* Информация */}
      <View style={{ flex: 1 }}>
        {/* Имя и статус */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Text variant="titleMedium" style={{ flex: 1 }}>
            {employee.name}
          </Text>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: getStatusColor(),
            }}
          />
        </View>

        {/* ПВЗ */}
        {employee.pvzName && (
          <Text variant="bodySmall" style={{ color: tokens.colors.text.secondary }} numberOfLines={1}>
            {employee.pvzName}
          </Text>
        )}

        {/* Телефон */}
        <Text variant="bodySmall" style={{ marginTop: 2, color: tokens.colors.text.secondary }}>
          {employee.phone}
        </Text>

        {/* Статистика */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <Chip
            compact
            mode="outlined"
            style={{ height: 24, borderColor: tokens.colors.border }}
            textStyle={{ fontSize: 11, marginVertical: 0 }}
          >
            {`Смен: ${employee.stats.currentMonthShifts}`}
          </Chip>
          <Chip
            compact
            mode="outlined"
            style={{ height: 24, borderColor: tokens.colors.border }}
            textStyle={{ fontSize: 11, marginVertical: 0 }}
          >
            {`${Math.round(employee.stats.totalHours)}ч`}
          </Chip>
          {employee.stats.pendingRequests > 0 && (
            <Badge
              size={20}
              style={{
                backgroundColor: tokens.colors.warning.main,
              }}
            >
              {employee.stats.pendingRequests}
            </Badge>
          )}
        </View>
      </View>

      {/* Заработок */}
      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="titleMedium" style={{ color: tokens.colors.primary.main }}>
          {`${employee.salary.total.toLocaleString('ru-RU')} ₽`}
        </Text>
        <Text variant="bodySmall" style={{ color: tokens.colors.text.secondary }}>
          {getStatusText()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

