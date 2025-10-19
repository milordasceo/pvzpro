import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyledScrollView } from '../../../components';

interface Employee {
  id: string;
  name: string;
  photo?: string;
  pvzId: string;
  pvzName: string;
  pvzWorkingHours: string;
  status: 'on_time' | 'late';
  arrivalTime: string;
  lateMinutes?: number;
  shiftStartTime: Date;
  pvzPlannedEmployees?: number;
  pvzActiveEmployees?: number;
  employmentType: 'full_time' | 'part_time';
  position: 'trainee' | 'employee';
}

interface OnShiftTabProps {
  employees: Employee[];
  onShiftCount: number;
  loading: boolean;
  onRefresh: () => void;
}

/**
 * Карточка сотрудника
 */
const EmployeeCard = React.memo<{
  employee: Employee;
}>(({ employee }) => {
  const handleAction = useCallback((action: string) => {
    console.log(`Action: ${action} for employee ${employee.id}`);
    // TODO: Implement actions
  }, [employee.id]);

  // Получаем текст для бейджей
  const positionText = employee.position === 'trainee' ? 'Стажёр' : 'Сотрудник ПВЗ';
  const employmentText = employee.employmentType === 'full_time' ? 'Полный день' : 'Неполный день';

  return (
    <View
      style={{
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
      }}
    >
      {/* Информация о сотруднике */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <Avatar.Image
          size={48}
          source={{ uri: employee.photo || 'https://via.placeholder.com/48' }}
        />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '400', color: '#111827' }}>
            {employee.name}
          </Text>
          
          {/* Бейджи: Должность и тип занятости */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <View style={{ 
              backgroundColor: '#EEF2FF', 
              paddingHorizontal: 8, 
              paddingVertical: 3, 
              borderRadius: 6 
            }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#4F46E5' }}>
                {positionText}
              </Text>
            </View>
            
            <View style={{ 
              backgroundColor: '#F3F4F6', 
              paddingHorizontal: 8, 
              paddingVertical: 3, 
              borderRadius: 6 
            }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#6B7280' }}>
                {employmentText}
              </Text>
            </View>
          </View>

          {/* Статус прихода */}
          {employee.status === 'on_time' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialCommunityIcons name="check-circle" size={14} color="#10B981" />
              <Text style={{ fontSize: 13, color: '#10B981' }}>
                Пришёл в {employee.arrivalTime}
              </Text>
            </View>
          )}

          {employee.status === 'late' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialCommunityIcons name="clock-alert-outline" size={14} color="#F59E0B" />
              <Text style={{ fontSize: 13, color: '#F59E0B' }}>
                Опоздал на {employee.lateMinutes} мин
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Разделитель */}
      <View style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 12 }} />

      {/* Кнопки действий */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity 
          onPress={() => handleAction('chat')}
          style={{ 
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            paddingVertical: 10,
            gap: 6,
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}
        >
          <MaterialCommunityIcons name="chat-outline" size={18} color="#4F46E5" />
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#4F46E5' }}>
            Чат
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleAction('task')}
          style={{ 
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            paddingVertical: 10,
            gap: 6,
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}
        >
          <MaterialCommunityIcons name="plus-circle-outline" size={18} color="#4F46E5" />
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#4F46E5' }}>
            Задача
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

EmployeeCard.displayName = 'EmployeeCard';

/**
 * Группа ПВЗ с сотрудниками
 */
const PvzGroup = React.memo<{
  pvzId: string;
  employees: Employee[];
}>(({ pvzId, employees }) => {
  const firstEmployee = employees[0];
  const planned = firstEmployee.pvzPlannedEmployees || 1;
  const active = firstEmployee.pvzActiveEmployees || employees.length;
  const hasShortage = active < planned;

  return (
    <View 
      style={{ 
        marginBottom: 12,
        borderWidth: 1,
        borderColor: hasShortage ? '#FCA5A5' : '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: hasShortage ? '#FEF2F2' : '#FFFFFF',
      }}
    >
      {/* Заголовок ПВЗ */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="store" size={16} color="#4F46E5" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
              {firstEmployee.pvzName}
            </Text>
          </View>
          <Text style={{ 
            fontSize: 13, 
            fontWeight: '600', 
            color: hasShortage ? '#DC2626' : '#10B981' 
          }}>
            ({active}/{planned})
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 22 }}>
          {firstEmployee.pvzWorkingHours}
        </Text>
        
        {/* Предупреждение о нехватке персонала */}
        {hasShortage && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 6, 
            marginTop: 8,
            backgroundColor: '#FEE2E2',
            padding: 8,
            borderRadius: 8,
          }}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#DC2626" />
            <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '500' }}>
              Нехватка {planned - active} {planned - active === 1 ? 'сотрудника' : 'сотрудников'}
            </Text>
          </View>
        )}
      </View>

      {/* Список сотрудников */}
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </View>
  );
});

PvzGroup.displayName = 'PvzGroup';

/**
 * Вкладка "На смене" Dashboard
 * Показывает сотрудников на смене с группировкой по ПВЗ
 */
export const OnShiftTab = React.memo<OnShiftTabProps>(({ employees, onShiftCount, loading, onRefresh }) => {
  // Группировка сотрудников по ПВЗ
  const employeesByPvz = useMemo(() => {
    const grouped: Record<string, Employee[]> = {};
    employees.forEach(employee => {
      if (!grouped[employee.pvzId]) {
        grouped[employee.pvzId] = [];
      }
      grouped[employee.pvzId].push(employee);
    });
    return grouped;
  }, [employees]);

  // Подсчёт общего количества запланированных сотрудников
  const totalPlanned = useMemo(() => {
    if (employees.length === 0) return 0;
    const pvzIds = new Set(employees.map(e => e.pvzId));
    let total = 0;
    pvzIds.forEach(pvzId => {
      const emp = employees.find(e => e.pvzId === pvzId);
      total += emp?.pvzPlannedEmployees || 1;
    });
    return total;
  }, [employees]);

  return (
    <StyledScrollView
      style={{ backgroundColor: '#F3F4F6' }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {/* Шапка вкладки */}
      <View style={{ 
        backgroundColor: '#FFFFFF', 
        padding: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: '#E5E7EB',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
            На смене
          </Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="tune" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          Сейчас работает: {onShiftCount} из {totalPlanned}
        </Text>
      </View>

      {/* Контент */}
      <View style={{ paddingTop: 12 }}>
        {Object.entries(employeesByPvz).map(([pvzId, pvzEmployees]) => (
          <PvzGroup key={pvzId} pvzId={pvzId} employees={pvzEmployees} />
        ))}
      </View>
    </StyledScrollView>
  );
});

OnShiftTab.displayName = 'OnShiftTab';
