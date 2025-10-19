import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconButton } from 'react-native-paper';
import { useAuthStore } from '../store/auth.store';
import { MainNavigator } from './MainNavigator';
import { AuthNavigator } from './AuthNavigator';
import { FinanceHistoryScreen } from '../employee/FinanceHistoryScreen';
import { RootStackParamList } from '../types/navigation';
import PvzSettingsScreen from '../admin/screens/PvzSettingsScreen';
// import { AdminHeader } from '../admin/components/AdminHeader'; // Удалён

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Главный навигатор приложения
 * Определяет корневую навигацию в зависимости от статуса аутентификации
 */
export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // Пока приложение загружается, показываем loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animation: 'none',
      }}
      initialRouteName={(isAuthenticated ? 'Main' : 'Auth') as any}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name={'Main' as any} 
            component={MainNavigator}
            options={{
              headerShown: false, // AdminHeader удалён
            }}
          />
          <Stack.Screen
            name={'FinanceHistory' as any}
            component={FinanceHistoryScreen}
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
