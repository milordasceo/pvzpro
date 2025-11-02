import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../../../ui';

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, color }) => (
  <View style={styles.statItem}>
    <View style={[styles.iconContainer, { backgroundColor: color || tokens.colors.primary.light }]}>
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={color || tokens.colors.primary.main}
      />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface EmployeeStatsProps {
  stats: {
    totalShifts: number;
    currentMonthShifts: number;
    totalHours: number;
    averageRating: number;
    completedTasks: number;
    pendingRequests: number;
  };
}

export const EmployeeStats: React.FC<EmployeeStatsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Статистика</Text>
      
      <View style={styles.statsGrid}>
        <StatItem
          icon="calendar-check"
          label="Всего смен"
          value={stats.totalShifts}
          color={tokens.colors.primary.main}
        />
        <StatItem
          icon="calendar-month"
          label="Смен в месяце"
          value={stats.currentMonthShifts}
          color={tokens.colors.info.main}
        />
        <StatItem
          icon="clock-outline"
          label="Часов отработано"
          value={stats.totalHours}
          color={tokens.colors.success.main}
        />
        <StatItem
          icon="star"
          label="Средний рейтинг"
          value={stats.averageRating.toFixed(1)}
          color={tokens.colors.warning.main}
        />
        <StatItem
          icon="check-circle"
          label="Задач выполнено"
          value={stats.completedTasks}
          color={tokens.colors.success.dark}
        />
        <StatItem
          icon="clock-alert"
          label="Запросов"
          value={stats.pendingRequests}
          color={tokens.colors.error.main}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: tokens.colors.screenBackground,
    borderRadius: 12,
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
  },
});
