import React, { useMemo } from 'react';
import { View, RefreshControl, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, Title, Body, Label, Caption } from '../../../ui';
import { AdminEmployee } from '../../../types/admin';
import { EmployeeCard } from '../employees/EmployeeCard';

interface OnShiftTabProps {
  employees: AdminEmployee[];
  onShiftCount: number;
  loading: boolean;
  onRefresh: () => void;
}

/**
 * Группа ПВЗ с сотрудниками
 */
const PvzGroup = React.memo<{
  pvzId: string;
  employees: AdminEmployee[];
}>(({ pvzId, employees }) => {
  const firstEmployee = employees[0];
  const pvzName = firstEmployee?.pvzName || 'Неизвестный ПВЗ';
  const planned = pvzName.includes('Тамбовская') ? 1 : 
                  pvzName.includes('Кропоткина') ? 2 : 1;
  const active = employees.length;
  const hasShortage = active < planned;

  const handleChat = () => {
    console.log('Chat with employees:', employees.map(e => e.name).join(', '));
  };

  const handleAddTask = () => {
    console.log('Add task for employees:', employees.map(e => e.name).join(', '));
  };

  return (
    <View 
      style={{ 
        marginBottom: 12,
        borderWidth: 1,
        borderColor: hasShortage ? tokens.colors.error.light : tokens.colors.border,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: hasShortage ? tokens.colors.error.light : tokens.colors.surface,
      }}
    >
      {/* Заголовок ПВЗ */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="store" size={16} color={tokens.colors.primary.main} />
            <Body style={{ fontWeight: '600' }}>
              {pvzName}
            </Body>
          </View>
          <Label size="medium" style={{ 
            color: hasShortage ? tokens.colors.error.main : tokens.colors.success.main 
          }}>
            {`(${active}/${planned})`}
          </Label>
        </View>
        
        {/* Предупреждение о нехватке персонала */}
        {hasShortage && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 6, 
            marginTop: 8,
            backgroundColor: tokens.colors.error.light,
            padding: 8,
            borderRadius: 8,
          }}>
            <MaterialCommunityIcons name="alert-circle" size={16} color={tokens.colors.error.main} />
            <Caption style={{ color: tokens.colors.error.main, fontWeight: '500' }}>
              {`Нехватка ${planned - active} ${planned - active === 1 ? 'сотрудника' : 'сотрудников'}`}
            </Caption>
          </View>
        )}
      </View>

      {/* Список сотрудников */}
      {employees.map((employee) => (
        <EmployeeCard 
          key={employee.id} 
          employee={employee} 
          onPress={() => console.log('Employee pressed:', employee.name)}
          onChat={handleChat}
          onAddTask={handleAddTask}
        />
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
    const grouped: Record<string, AdminEmployee[]> = {};
    employees.forEach(employee => {
      if (!grouped[employee.pvzId]) {
        grouped[employee.pvzId] = [];
      }
      grouped[employee.pvzId].push(employee);
    });
    return grouped;
  }, [employees]);

  return (
    <ScrollView
      style={{ backgroundColor: tokens.colors.gray[100] }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {employees.length === 0 ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Body color="secondary">Нет сотрудников на смене</Body>
        </View>
      ) : (
        Object.entries(employeesByPvz).map(([pvzId, pvzEmployees]) => (
          <PvzGroup key={pvzId} pvzId={pvzId} employees={pvzEmployees} />
        ))
      )}
    </ScrollView>
  );
});

OnShiftTab.displayName = 'OnShiftTab';
