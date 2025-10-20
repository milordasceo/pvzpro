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
    <Surface style={styles.card} elevation={0}>
      <TouchableOpacity onPress={onPress} style={styles.cardContent}>
        {/* Шапка карточки */}
        <View style={styles.header}>
          {/* Аватар с инициалами */}
          <View style={styles.avatarContainer}>
            {employee.avatar ? (
              <Avatar.Image size={64} source={{ uri: employee.avatar }} />
            ) : (
              <Avatar.Text
                size={64}
                label={getInitials()}
                style={{ backgroundColor: getAvatarColor() }}
                labelStyle={{ fontSize: 22, fontWeight: '700', color: '#FFF' }}
              />
            )}
            {/* Индикатор статуса */}
            {employee.isOnShift && (
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: tokens.colors.success.main }]} />
              </View>
            )}
          </View>

          {/* Имя и статус */}
          <View style={styles.nameSection}>
            <Text variant="titleLarge" style={styles.name}>
              {employee.name}
            </Text>
            <View style={styles.statusRow}>
              {employee.isOnShift ? (
                <View style={[styles.statusBadge, { backgroundColor: tokens.colors.success.lighter }]}>
                  <MaterialCommunityIcons name="clock-check" size={14} color={tokens.colors.success.dark} />
                  <Text style={[styles.statusText, { color: tokens.colors.success.dark }]}>
                    На смене
                  </Text>
                </View>
              ) : employee.isActive ? (
                <View style={[styles.statusBadge, { backgroundColor: tokens.colors.gray[100] }]}>
                  <MaterialCommunityIcons name="check-circle" size={14} color={tokens.colors.gray[500]} />
                  <Text style={[styles.statusText, { color: tokens.colors.gray[700] }]}>
                    Активен
                  </Text>
                </View>
              ) : (
                <View style={[styles.statusBadge, { backgroundColor: tokens.colors.gray[100] }]}>
                  <MaterialCommunityIcons name="cancel" size={14} color={tokens.colors.text.disabled} />
                  <Text style={[styles.statusText, { color: tokens.colors.text.disabled }]}>
                    Неактивен
                  </Text>
                </View>
              )}

              {/* Алерт с запросами */}
              {employee.stats.pendingRequests > 0 && (
                <View style={[styles.alertBadge, { backgroundColor: tokens.colors.warning.lighter }]}>
                  <MaterialCommunityIcons name="alert" size={14} color={tokens.colors.warning.dark} />
                  <Text style={[styles.alertText, { color: tokens.colors.warning.dark }]}>
                    {employee.stats.pendingRequests}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Разделитель */}
        <View style={styles.divider} />

        {/* Информация */}
        <View style={styles.infoSection}>
          {/* ПВЗ */}
          {employee.pvzName && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color={tokens.colors.text.secondary} />
              <Text style={styles.infoText} numberOfLines={1}>
                {employee.pvzName}
              </Text>
            </View>
          )}

          {/* Телефон */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={16} color={tokens.colors.text.secondary} />
            <Text style={styles.infoText}>{employee.phone}</Text>
          </View>
        </View>

        {/* Статистика и зарплата */}
        <View style={styles.footer}>
          {/* Статистика */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{employee.stats.currentMonthShifts}</Text>
              <Text style={styles.statLabel}>смен</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(employee.stats.totalHours)}</Text>
              <Text style={styles.statLabel}>часов</Text>
            </View>
          </View>

          {/* Зарплата */}
          <View style={styles.salaryContainer}>
            <Text style={styles.salaryAmount}>
              {employee.salary.total.toLocaleString('ru-RU')} ₽
            </Text>
            <Text style={styles.salaryLabel}>за месяц</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.colors.gray[200],
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: tokens.colors.surface,
    borderRadius: 10,
    padding: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  nameSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  name: {
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.gray[200],
    marginBottom: 12,
  },
  infoSection: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gray[100],
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: tokens.colors.text.muted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: tokens.colors.gray[200],
  },
  salaryContainer: {
    alignItems: 'flex-end',
  },
  salaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.primary.main,
  },
  salaryLabel: {
    fontSize: 11,
    color: tokens.colors.text.muted,
    marginTop: 2,
  },
});

