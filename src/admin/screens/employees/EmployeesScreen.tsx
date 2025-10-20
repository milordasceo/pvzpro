import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { tokens, ScrollView, EmptyState, ErrorState } from '../../../ui';
import { AdminEmployee } from '../../../types/admin';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeFilters } from './EmployeeFilters';
import { useEmployees } from '../../hooks/useEmployees';

export const EmployeesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'active' | 'inactive',
    pvzId: 'all' as string,
    onShift: undefined as boolean | undefined,
  });

  const { employees, loading, error, refresh } = useEmployees(filters);

  // Фильтрация по поиску
  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.phone.includes(query) ||
      employee.email?.toLowerCase().includes(query) ||
      employee.pvzName?.toLowerCase().includes(query)
    );
  });

  const handleEmployeePress = useCallback((employee: AdminEmployee) => {
    // TODO: Навигация к деталям сотрудника
    console.log('Employee pressed:', employee.id);
  }, []);

  const handleChatPress = useCallback((employee: AdminEmployee) => {
    // TODO: Открыть чат с сотрудником
    console.log('Open chat with:', employee.name);
  }, []);

  const handleAddTaskPress = useCallback((employee: AdminEmployee) => {
    // TODO: Создать задачу для сотрудника
    console.log('Add task for:', employee.name);
  }, []);

  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.gray[50] }}>
      {/* Поиск */}
      <View style={{ padding: 16, backgroundColor: tokens.colors.surface }}>
        <Searchbar
          placeholder="Поиск по имени, телефону, ПВЗ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ elevation: 0, backgroundColor: tokens.colors.gray[100] }}
        />
      </View>

      {/* Фильтры */}
      {showFilters && (
        <EmployeeFilters filters={filters} onFiltersChange={setFilters} />
      )}

      {/* Список сотрудников */}
      {filteredEmployees.length === 0 ? (
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
        >
          <EmptyState
            icon="account-off"
            title="Сотрудников не найдено"
            description={
              searchQuery
                ? 'Попробуйте изменить параметры поиска'
                : 'Добавьте первого сотрудника'
            }
          />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EmployeeCard 
              employee={item} 
              onPress={() => handleEmployeePress(item)}
              onChat={() => handleChatPress(item)}
              onAddTask={() => handleAddTaskPress(item)}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
        />
      )}
    </View>
  );
};

