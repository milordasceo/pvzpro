import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/auth.store';
import { MainNavigator } from './MainNavigator';
import { AuthNavigator } from './AuthNavigator';
import { FinanceHistoryScreen } from '../employee/FinanceHistoryScreen';
import { FinanceBreakdownScreen } from '../employee/FinanceBreakdownScreen';
import { RootStackParamList } from '../types/navigation';
import PvzSettingsScreen from '../screens/admin/PvzSettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Главный навигатор приложения
 * Определяет корневую навигацию в зависимости от статуса аутентификации
 */
export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Пока приложение загружается, показываем loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={(isAuthenticated ? 'Main' : 'Auth') as any}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name={'Main' as any} component={MainNavigator} />
          <Stack.Screen
            name={'FinanceHistory' as any}
            component={FinanceHistoryScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name={'FinanceBreakdown' as any}
            component={FinanceBreakdownScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name={'PvzSettings' as any} component={PvzSettingsScreen} />
        </>
      ) : (
        <Stack.Screen name={'Auth' as any} component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

/**
 * Экран загрузки
 * Показывается пока приложение инициализируется
 */
const LoadingScreen: React.FC = () => {
  // Здесь можно добавить красивый loading экран
  return null; // Пока просто возвращаем null
};
