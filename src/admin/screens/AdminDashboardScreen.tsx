import React, { Suspense, lazy } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { tokens, LoadingState, ErrorState } from '../../ui';
import { useDashboardData } from '../hooks/useDashboardData';

// Lazy load вкладок для оптимизации (Code Splitting)
const StatisticsTab = lazy(() => 
  import('./dashboard/StatisticsTab').then(m => ({ default: m.StatisticsTab }))
);

const OnShiftTab = lazy(() => 
  import('./dashboard/OnShiftTab').then(m => ({ default: m.OnShiftTab }))
);

const Tab = createMaterialTopTabNavigator();

// Fallback компонент для Suspense
const LoadingFallback = () => <LoadingState text="Загрузка данных..." />;

/**
 * Главный экран администратора - Dashboard с вкладками
 * 
 * Вкладки:
 * - Контроль: панель управления - что требует внимания и что в норме
 * - На смене: список сотрудников на смене с группировкой по ПВЗ
 */
export const AdminDashboardScreen = React.memo(() => {
  const { data, loading, error, refresh } = useDashboardData();

  if (error) {
    return (
      <ErrorState
        title="Ошибка загрузки"
        message={error}
        onRetry={refresh}
      />
    );
  }

  if (!data) {
    return <LoadingState text="Загрузка дашборда..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: tokens.colors.primary.main,
          tabBarInactiveTintColor: tokens.colors.text.secondary,
          tabBarIndicatorStyle: {
            backgroundColor: tokens.colors.primary.main,
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: tokens.colors.surface,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: tokens.colors.border,
          },
          tabBarLabelStyle: {
            textTransform: 'none',
          },
        }}
      >
        <Tab.Screen 
          name="Контроль"
          options={{ title: 'Контроль' }}
        >
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <StatisticsTab 
                data={data}
                loading={loading}
                onRefresh={refresh}
              />
            </Suspense>
          )}
        </Tab.Screen>

        <Tab.Screen 
          name="На смене"
          options={{ title: 'На смене' }}
        >
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <OnShiftTab 
                employees={data.employeesOnShift}
                onShiftCount={data.onShiftCount}
                loading={loading}
                onRefresh={refresh}
              />
            </Suspense>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.gray[100],
  },
});

AdminDashboardScreen.displayName = 'AdminDashboardScreen';
