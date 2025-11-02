import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, IconButton } from '../../../../ui';
import { AdminEmployee } from '../../../../types/admin';

interface EmployeeHeaderProps {
  employee: AdminEmployee;
  onChat: () => void;
  onCall: () => void;
}

export const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  employee,
  onChat,
  onCall,
}) => {
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

  const getPositionLabel = () => {
    const labels: Record<string, string> = {
      trainee: 'Стажёр',
      employee: 'Сотрудник ПВЗ',
      senior: 'Старший сотрудник',
      manager: 'Менеджер ПВЗ',
    };
    return labels[employee.position || 'employee'];
  };

  const getStatusInfo = () => {
    if (!employee.isActive) {
      return { text: 'Уволен', color: tokens.colors.error.main };
    }
    
    switch (employee.employmentStatus) {
      case 'working':
        return { text: 'На смене', color: tokens.colors.success.main };
      case 'sick_leave':
        return { text: 'Больничный', color: tokens.colors.warning.main };
      case 'vacation':
        return { text: 'В отпуске', color: tokens.colors.info.dark };
      case 'day_off':
      default:
        return { text: 'Выходной', color: tokens.colors.text.secondary };
    }
  };

  const status = getStatusInfo();

  return (
    <View style={styles.container}>
      {/* Аватар */}
      <View style={styles.avatarContainer}>
        {employee.avatar ? (
          <Avatar.Image
            size={80}
            source={{ uri: employee.avatar }}
          />
        ) : (
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={{ backgroundColor: getAvatarColor() }}
          />
        )}
      </View>

      {/* Информация */}
      <View style={styles.infoContainer}>
        {/* Имя */}
        <Text style={styles.name}>{employee.name}</Text>
        
        {/* Должность */}
        <Text style={styles.position}>{getPositionLabel()}</Text>
        
        {/* Статус */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.text}
          </Text>
        </View>

        {/* ПВЗ */}
        {employee.pvzName && (
          <View style={styles.pvzContainer}>
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color={tokens.colors.text.muted}
            />
            <Text style={styles.pvzText}>{employee.pvzName}</Text>
          </View>
        )}
      </View>

      {/* Кнопки быстрых действий */}
      <View style={styles.actionsContainer}>
        <IconButton
          icon="chat"
          size={40}
          onPress={onChat}
          bg={tokens.colors.primary.light}
          color={tokens.colors.primary.main}
        />
        <IconButton
          icon="phone"
          size={40}
          onPress={onCall}
          bg={tokens.colors.success.light}
          color={tokens.colors.success.main}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gray[200],
  },
  avatarContainer: {
    marginBottom: 16,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  position: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pvzContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  pvzText: {
    fontSize: 14,
    color: tokens.colors.text.muted,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});
