import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, Text, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../../ui';
import { AdminEmployee } from '../../../types/admin';

interface EmployeeCardProps {
  employee: AdminEmployee;
  onPress: () => void;
  onChat?: () => void;
  onAddTask?: () => void;
}

export const EmployeeCard = ({ employee, onPress, onChat, onAddTask }: EmployeeCardProps) => {
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

  // Определяем должность
  const getPosition = () => {
    switch (employee.position) {
      case 'trainee':
        return 'Стажёр';
      case 'manager':
        return 'Менеджер ПВЗ';
      case 'employee':
      default:
        return 'Сотрудник ПВЗ';
    }
  };

  // Определяем статус сотрудника
  const getEmployeeStatus = () => {
    // Используем employmentStatus если есть, иначе определяем по isActive/isOnShift
    const status = employee.employmentStatus;

    if (status === 'fired' || !employee.isActive) {
      return { text: 'Уволен', color: tokens.colors.text.secondary, icon: 'account-off' };
    }

    if (status === 'sick_leave') {
      return { text: 'Больничный', color: tokens.colors.warning.dark, icon: 'medical-bag' };
    }

    if (status === 'vacation') {
      return { text: 'Отпуск', color: tokens.colors.info.dark, icon: 'beach' };
    }
    
    if (status === 'working' || employee.isOnShift) {
      return { text: 'На смене', color: tokens.colors.success.dark, icon: 'clock-check' };
    }

    // day_off или по умолчанию
    return { text: 'Выходной', color: tokens.colors.text.secondary, icon: 'home' };
  };

  const status = getEmployeeStatus();
  const isFired = !employee.isActive; // Уволен?

  const handleChatPress = (e: any) => {
    e.stopPropagation();
    onChat?.();
  };

  const handleTaskPress = (e: any) => {
    e.stopPropagation();
    onAddTask?.();
  };

  return (
    <Surface style={styles.card} elevation={0}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.cardContent, isFired && { opacity: 0.6 }]}>
          {/* Основная информация */}
          <View style={styles.mainRow}>
            {/* Аватар с индикатором */}
            <View style={styles.avatarContainer}>
              {employee.avatar ? (
                <Avatar.Image size={60} source={{ uri: employee.avatar }} />
              ) : (
                <Avatar.Text
                  size={60}
                  label={getInitials()}
                  style={{ backgroundColor: getAvatarColor() }}
                  labelStyle={{ fontSize: 22, fontWeight: '700', color: '#FFF' }}
                />
              )}
              {/* Зелёная точка - только если на смене */}
              {employee.isActive && employee.isOnShift && (
                <View style={styles.statusDot}>
                  <View style={[styles.dotInner, { backgroundColor: tokens.colors.success.main }]} />
                </View>
              )}
            </View>

            {/* Информация */}
            <View style={styles.infoContainer}>
              {/* Имя и Фамилия */}
              <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
                {employee.name}
              </Text>

              {/* ПВЗ */}
              {employee.pvzName && (
                <View style={styles.row}>
                  <MaterialCommunityIcons 
                    name="map-marker" 
                    size={14} 
                    color={tokens.colors.text.secondary} 
                  />
                  <Text style={styles.secondaryText} numberOfLines={1}>
                    {employee.pvzName}
                  </Text>
                </View>
              )}

              {/* Должность */}
              <View style={styles.row}>
                <MaterialCommunityIcons 
                  name="badge-account" 
                  size={14} 
                  color={tokens.colors.text.secondary} 
                />
                <Text style={styles.secondaryText}>
                  {getPosition()}
                </Text>
              </View>

              {/* Статус */}
              <View style={styles.row}>
                <MaterialCommunityIcons 
                  name={status.icon as any}
                  size={14} 
                  color={status.color} 
                />
                <Text style={[styles.secondaryText, { color: status.color, fontWeight: '600' }]}>
                  {status.text}
                </Text>
              </View>
            </View>
          </View>

          {/* Кнопки действий - НЕ показываем для уволенных */}
          {!isFired && (
            <View style={styles.actionsRow}>
              {/* Кнопка "Чат" - всегда показываем */}
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleChatPress}
              >
                <MaterialCommunityIcons 
                  name="chat" 
                  size={18} 
                  color={tokens.colors.primary.main} 
                />
                <Text style={styles.actionButtonText}>Чат</Text>
              </TouchableOpacity>

              {/* Кнопка "+Задача" - только если на смене */}
              {employee.isOnShift && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.taskButton]}
                  onPress={handleTaskPress}
                >
                  <MaterialCommunityIcons 
                    name="plus-circle" 
                    size={18} 
                    color={tokens.colors.success.dark} 
                  />
                  <Text style={[styles.actionButtonText, { color: tokens.colors.success.dark }]}>
                    Задача
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.colors.gray[200],
  },
  cardContent: {
    padding: 14,
  },
  mainRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: tokens.colors.surface,
    borderRadius: 8,
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
    gap: 6,
    minWidth: 0,
  },
  name: {
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secondaryText: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gray[200],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: tokens.colors.primary.light,
    borderWidth: 1,
    borderColor: tokens.colors.primary.main,
  },
  taskButton: {
    backgroundColor: tokens.colors.success.lighter,
    borderColor: tokens.colors.success.dark,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.primary.main,
  },
});

