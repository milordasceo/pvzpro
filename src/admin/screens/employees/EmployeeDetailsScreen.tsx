import React from 'react';
import { View, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { tokens, LoadingState, ErrorState, Button, ScrollView } from '../../../ui';
import { AdminTabParamList } from '../../../types/navigation';
import { EmployeeHeader } from './components/EmployeeHeader';
import { EmployeeStats } from './components/EmployeeStats';
import { EmployeeInfoSection } from './components/EmployeeInfoSection';
import { EmployeeShiftHistory } from './components/EmployeeShiftHistory';
import { useEmployeeDetails } from './hooks/useEmployeeDetails';
import { useEmployeeActions } from './hooks/useEmployeeActions';

type EmployeeDetailsScreenRouteProp = RouteProp<AdminTabParamList, 'EmployeeDetails'>;
type EmployeeDetailsScreenNavigationProp = NativeStackNavigationProp<AdminTabParamList, 'EmployeeDetails'>;

export const EmployeeDetailsScreen = () => {
  const route = useRoute<EmployeeDetailsScreenRouteProp>();
  const navigation = useNavigation<EmployeeDetailsScreenNavigationProp>();
  const { employeeId } = route.params;
  
  const { employee, loading, error, refresh } = useEmployeeDetails(employeeId);
  const { deleteEmployee } = useEmployeeActions();

  const handleEdit = () => {
    navigation.navigate('EmployeeForm', { employeeId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить сотрудника?',
      `Вы уверены, что хотите удалить ${employee?.name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEmployee(employeeId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Ошибка', 'Не удалось удалить сотрудника');
            }
          },
        },
      ]
    );
  };

  const handleChat = () => {
    // TODO: Открыть чат с сотрудником
    console.log('Open chat with employee:', employeeId);
  };

  const handleCall = () => {
    // TODO: Позвонить сотруднику
    if (employee?.phone) {
      console.log('Call employee:', employee.phone);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !employee) {
    return <ErrorState message={error || 'Сотрудник не найден'} onRetry={refresh} />;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      trainee: 'Стажёр',
      employee: 'Сотрудник',
      senior: 'Старший сотрудник',
      manager: 'Менеджер',
    };
    return labels[position] || position;
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.screenBackground }}>
      <ScrollView>
        {/* Шапка профиля */}
        <EmployeeHeader
          employee={employee}
          onChat={handleChat}
          onCall={handleCall}
        />

        {/* Статистика */}
        <EmployeeStats stats={employee.stats} />

        {/* Контакты */}
        <EmployeeInfoSection
          title="Контакты"
          items={[
            { label: 'Телефон', value: employee.phone, icon: 'phone' },
            { label: 'Email', value: employee.email || '—', icon: 'email' },
          ]}
        />

        {/* Работа */}
        <EmployeeInfoSection
          title="Работа"
          items={[
            { label: 'Должность', value: getPositionLabel(employee.position || 'employee'), icon: 'badge-account' },
            { label: 'ПВЗ', value: employee.pvzName || '—', icon: 'map-marker' },
            { label: 'Дата найма', value: formatDate(employee.hiredAt), icon: 'calendar' },
          ]}
        />

        {/* Финансы */}
        <EmployeeInfoSection
          title="Финансы (текущий месяц)"
          items={[
            { label: 'Заработано', value: `${employee.salary.earned} ₽`, icon: 'cash' },
            { label: 'Премии', value: `+${employee.salary.bonuses} ₽`, icon: 'gift' },
            { label: 'Штрафы', value: `-${employee.salary.penalties} ₽`, icon: 'alert' },
            { label: 'Итого', value: `${employee.salary.total} ₽`, icon: 'wallet', highlight: true },
          ]}
        />

        {/* История смен */}
        <EmployeeShiftHistory employeeId={employeeId} />
      </ScrollView>

      {/* Нижняя панель действий */}
      <View 
        style={{ 
          padding: 16, 
          backgroundColor: tokens.colors.surface,
          borderTopWidth: 1,
          borderTopColor: tokens.colors.gray[200],
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <Button
          mode="contained"
          onPress={handleEdit}
          buttonColor={tokens.colors.primary.main}
          style={{ flex: 1 }}
        >
          Редактировать
        </Button>
        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor={tokens.colors.error.main}
          style={{ flex: 1 }}
        >
          Удалить
        </Button>
      </View>
    </View>
  );
};
