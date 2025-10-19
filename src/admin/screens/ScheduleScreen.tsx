import React, { Suspense, lazy, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDashboardData } from '../hooks/useDashboardData';

// Lazy load вкладок для оптимизации (Code Splitting)
const CalendarTab = lazy(() => 
  import('./schedule/CalendarTab').then(m => ({ default: m.CalendarTab }))
);

const RequestsTab = lazy(() => 
  import('./schedule/RequestsTab').then(m => ({ default: m.RequestsTab }))
);

const Tab = createMaterialTopTabNavigator();

// Fallback компонент для Suspense
const LoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4F46E5" />
  </View>
);

/**
 * Экран "График" с вкладками
 * 
 * Вкладки:
 * - Календарь: календарь смен (в разработке)
 * - Запросы: запросы от сотрудников на изменение графика
 */
export const ScheduleScreen = React.memo(() => {
  const { data, loading, refresh } = useDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

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
          name="Календарь"
          options={{ title: 'Календарь' }}
        >
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <CalendarTab 
                loading={isRefreshing}
                onRefresh={handleRefresh}
              />
            </Suspense>
          )}
        </Tab.Screen>

        <Tab.Screen 
          name="Запросы"
          options={{ 
            title: data.requests.length > 0 
              ? `Запросы (${data.requests.length})` 
              : 'Запросы',
          }}
        >
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <RequestsTab 
                requests={data.requests}
                loading={isRefreshing}
                onRefresh={handleRefresh}
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

ScheduleScreen.displayName = 'ScheduleScreen';

