import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../../ui';
import { AdminEmployee } from '../../../types/admin';

interface EmployeeCardProps {
  employee: AdminEmployee;
  onPress: () => void;
}

export const EmployeeCard = ({ employee, onPress }: EmployeeCardProps) => {
  // Генерация цвета аватара на основе имени
  const getAvatarColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
    ];
    const index = employee.name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = () => {
    const names = employee.name.split(' ');
    return names.length >= 2 
      ? `${names[0][0]}${names[1][0]}`
      : names[0].substring(0, 2);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={styles.card} elevation={0}>
        <View style={styles.cardContent}>
          {/* Основная строка */}
          <View style={styles.mainRow}>
            {/* Аватар */}
            <View style={styles.avatarContainer}>
              {employee.avatar ? (
                <Avatar.Image size={56} source={{ uri: employee.avatar }} />
              ) : (
                <Avatar.Text
                  size={56}
                  label={getInitials()}
                  style={{ backgroundColor: getAvatarColor() }}
                  labelStyle={{ fontSize: 20, fontWeight: '700', color: '#FFF' }}
                />
              )}
              {/* Индикатор "на смене" */}
              {employee.isOnShift && (
                <View style={styles.statusDot}>
                  <View style={[styles.dotInner, { backgroundColor: tokens.colors.success.main }]} />
                </View>
              )}
            </View>

            {/* Информация */}
            <View style={styles.infoContainer}>
              {/* Имя */}
              <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
                {employee.name}
              </Text>

              {/* Вторая строка: ПВЗ или статус */}
              <View style={styles.secondRow}>
                {employee.pvzName ? (
                  <View style={styles.locationRow}>
                    <MaterialCommunityIcons 
                      name="map-marker" 
                      size={14} 
                      color={tokens.colors.text.secondary} 
                    />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {employee.pvzName}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.statusText}>
                    {employee.isOnShift ? 'На смене' : employee.isActive ? 'Активен' : 'Неактивен'}
                  </Text>
                )}

                {/* Алерт */}
                {employee.stats.pendingRequests > 0 && (
                  <View style={styles.alertBadge}>
                    <MaterialCommunityIcons 
                      name="alert-circle" 
                      size={14} 
                      color={tokens.colors.warning.dark} 
                    />
                    <Text style={styles.alertText}>
                      {employee.stats.pendingRequests}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Зарплата */}
            <View style={styles.salaryContainer}>
              <Text style={styles.salaryAmount}>
                {employee.salary.total.toLocaleString('ru-RU')}
              </Text>
              <Text style={styles.salaryCurrency}>₽</Text>
            </View>
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.colors.gray[200],
  },
  cardContent: {
    padding: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: tokens.colors.surface,
    borderRadius: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: tokens.colors.surface,
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
    minWidth: 0, // Для корректного ellipsis
  },
  name: {
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  locationText: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    flex: 1,
  },
  statusText: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: tokens.colors.warning.lighter,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.warning.dark,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  salaryAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.primary.main,
  },
  salaryCurrency: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.primary.main,
  },
});

