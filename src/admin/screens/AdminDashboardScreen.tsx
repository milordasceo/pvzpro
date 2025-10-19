import React, { Suspense, lazy } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
const LoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4F46E5" />
        </View>
);

/**
 * Главный экран администратора - Dashboard с вкладками
 * 
 * Вкладки:
 * - Контроль: панель управления - что требует внимания и что в норме
 * - На смене: список сотрудников на смене с группировкой по ПВЗ
 */
export const AdminDashboardScreen = React.memo(() => {
  const { data, loading, refresh } = useDashboardData();

  if (!data) {
  return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: '#6B7280',
          tabBarIndicatorStyle: {
            backgroundColor: '#4F46E5',
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
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
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
});

AdminDashboardScreen.displayName = 'AdminDashboardScreen';
