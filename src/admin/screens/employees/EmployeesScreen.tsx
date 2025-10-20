import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, FlatList, RefreshControl, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { tokens, ScrollView, EmptyState, ErrorState, SearchInput, IconButton } from '../../../ui';
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

  // Анимация для панели фильтров
  const filterHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(filterHeight, {
      toValue: showFilters ? 1 : 0,
      duration: 200, // Быстрее и одинаково в обе стороны
      useNativeDriver: false,
    }).start();
  }, [showFilters]);

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: tokens.colors.gray[50] }}>
        {/* Поиск - тень исчезает когда открыты фильтры */}
        <View 
          style={{ 
            padding: 16, 
            backgroundColor: tokens.colors.surface, 
            flexDirection: 'row', 
            gap: 8, 
            alignItems: 'center',
            // Тень панели поиска (исчезает при showFilters)
            shadowColor: showFilters ? 'transparent' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: showFilters ? 0 : 0.08,
            shadowRadius: 4,
            elevation: showFilters ? 0 : 3,
          }}
        >
          <View style={{ flex: 1 }}>
            <SearchInput
              placeholder="Поиск по имени, телефону, ПВЗ..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ 
                backgroundColor: tokens.colors.surface, 
                borderColor: tokens.colors.gray[200],
                // Внутренняя тень (всегда)
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>
          <IconButton
            icon={showFilters ? 'filter-off' : 'filter'}
            size={48}
            onPress={() => setShowFilters(!showFilters)}
            bg={showFilters ? tokens.colors.primary.light : tokens.colors.surface}
            color={showFilters ? tokens.colors.primary.main : tokens.colors.text.secondary}
            borderColor={showFilters ? tokens.colors.primary.main : tokens.colors.gray[300]}
            borderWidth={1}
          />
        </View>

      {/* Фильтры с анимацией и тенью */}
      {showFilters && (
        <View
          style={{
            // Тень панели фильтров (на внешнем контейнере)
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Animated.View
            style={{
              maxHeight: filterHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200], // Максимальная высота панели фильтров
              }),
              opacity: filterHeight,
              overflow: 'hidden',
            }}
          >
            <EmployeeFilters 
              filters={filters} 
              onFiltersChange={setFilters}
            />
          </Animated.View>
        </View>
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
    </TouchableWithoutFeedback>
  );
};

