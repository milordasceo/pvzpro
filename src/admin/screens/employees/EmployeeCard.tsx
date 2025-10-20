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

  const getStatusBgColor = () => {
    if (!employee.isActive) return tokens.colors.gray[100];
    if (employee.isOnShift) return tokens.colors.success.lighter;
    return tokens.colors.gray[50];
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
        borderRadius: tokens.radius.lg,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
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
            color={tokens.colors.primary.main}
            style={{ backgroundColor: tokens.colors.primary.light }}
          />
        )}

        {/* Информация */}
        <View style={{ flex: 1 }}>
          {/* Имя */}
          <Text variant="titleMedium" style={{ marginBottom: 4 }}>
            {employee.name}
          </Text>

          {/* Статус и контакты */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Chip
              compact
              mode="flat"
              style={{
                height: 24,
                backgroundColor: getStatusBgColor(),
              }}
              textStyle={{
                fontSize: 11,
                color: getStatusColor(),
                fontWeight: '600',
              }}
            >
              {getStatusText()}
            </Chip>
            {employee.stats.pendingRequests > 0 && (
              <Chip
                compact
                mode="flat"
                icon="alert-circle"
                style={{
                  height: 24,
                  backgroundColor: tokens.colors.warning.light,
                }}
                textStyle={{
                  fontSize: 11,
                  color: tokens.colors.warning.dark,
                  fontWeight: '600',
                }}
              >
                {`${employee.stats.pendingRequests} запрос${employee.stats.pendingRequests > 1 ? 'а' : ''}`}
              </Chip>
            )}
          </View>

          {/* ПВЗ и телефон */}
          <View style={{ gap: 2 }}>
            {employee.pvzName && (
              <Text variant="bodySmall" style={{ color: tokens.colors.text.secondary }} numberOfLines={1}>
                📍 {employee.pvzName}
              </Text>
            )}
            <Text variant="bodySmall" style={{ color: tokens.colors.text.secondary }}>
              📱 {employee.phone}
            </Text>
          </View>

          {/* Статистика */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <Text variant="bodySmall" style={{ color: tokens.colors.text.muted }}>
              {`${employee.stats.currentMonthShifts} смен`}
            </Text>
            <Text variant="bodySmall" style={{ color: tokens.colors.text.muted }}>
              {`${Math.round(employee.stats.totalHours)}ч`}
            </Text>
          </View>
        </View>
      </View>

      {/* Заработок */}
      <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
        <Text variant="headlineSmall" style={{ color: tokens.colors.primary.main, fontWeight: '600' }}>
          {`${employee.salary.total.toLocaleString('ru-RU')} ₽`}
        </Text>
        <Text variant="bodySmall" style={{ color: tokens.colors.text.muted, marginTop: 2 }}>
          {`за месяц`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

