import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, Button } from '../../../../ui';

interface ShiftItem {
  id: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  duration: number;
  status: 'planned' | 'active' | 'finished' | 'cancelled';
}

interface EmployeeShiftHistoryProps {
  employeeId: string;
}

export const EmployeeShiftHistory: React.FC<EmployeeShiftHistoryProps> = ({ employeeId }) => {
  // Моковые данные для истории смен
  const shifts: ShiftItem[] = [
    {
      id: '1',
      date: new Date(2025, 10, 1),
      startTime: new Date(2025, 10, 1, 9, 0),
      endTime: new Date(2025, 10, 1, 18, 0),
      duration: 540,
      status: 'finished',
    },
    {
      id: '2',
      date: new Date(2025, 10, 2),
      startTime: new Date(2025, 10, 2, 9, 0),
      endTime: new Date(2025, 10, 2, 18, 15),
      duration: 555,
      status: 'finished',
    },
    {
      id: '3',
      date: new Date(2025, 10, 3),
      startTime: new Date(2025, 10, 3, 9, 0),
      endTime: new Date(2025, 10, 3, 18, 0),
      duration: 540,
      status: 'finished',
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };

  const getStatusConfig = (status: ShiftItem['status']) => {
    switch (status) {
      case 'finished':
        return { 
          label: 'Завершена', 
          color: tokens.colors.success.main,
          icon: 'check-circle',
        };
      case 'active':
        return { 
          label: 'Активна', 
          color: tokens.colors.info.main,
          icon: 'clock-outline',
        };
      case 'cancelled':
        return { 
          label: 'Отменена', 
          color: tokens.colors.error.main,
          icon: 'close-circle',
        };
      default:
        return { 
          label: 'Запланирована', 
          color: tokens.colors.warning.main,
          icon: 'calendar',
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>История смен</Text>
        <Text style={styles.subtitle}>Последние {shifts.length} смен</Text>
      </View>

      <View style={styles.shiftsContainer}>
        {shifts.map((shift) => {
          const statusConfig = getStatusConfig(shift.status);
          
          return (
            <View key={shift.id} style={styles.shiftItem}>
              {/* Дата */}
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{formatDate(shift.date)}</Text>
              </View>

              {/* Детали */}
              <View style={styles.detailsContainer}>
                {/* Время */}
                <View style={styles.timeRow}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color={tokens.colors.text.muted}
                  />
                  <Text style={styles.timeText}>
                    {formatTime(shift.startTime)} - {shift.endTime ? formatTime(shift.endTime) : '...'}
                  </Text>
                </View>

                {/* Длительность */}
                <View style={styles.durationRow}>
                  <MaterialCommunityIcons
                    name="timer-outline"
                    size={16}
                    color={tokens.colors.text.muted}
                  />
                  <Text style={styles.durationText}>
                    {formatDuration(shift.duration)}
                  </Text>
                </View>
              </View>

              {/* Статус */}
              <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
                <MaterialCommunityIcons
                  name={statusConfig.icon as any}
                  size={14}
                  color={statusConfig.color}
                />
                <Text style={[styles.statusText, { color: statusConfig.color }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Кнопка "Показать всё" */}
      <Button
        mode="outlined"
        onPress={() => console.log('Show all shifts for employee:', employeeId)}
        style={styles.showAllButton}
      >
        Показать все смены
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginTop: 4,
  },
  shiftsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  shiftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: tokens.colors.screenBackground,
    borderRadius: 8,
    gap: 12,
  },
  dateContainer: {
    width: 60,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  detailsContainer: {
    flex: 1,
    gap: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  showAllButton: {
    marginTop: 8,
  },
});
