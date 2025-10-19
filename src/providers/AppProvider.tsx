import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { AppTheme } from '../theme';
import { TasksCounterProvider } from '../employee/tasks/TasksCounterContext';
import { DevUICatalogFAB } from '../components/DevUICatalogFAB';

/**
 * Объединяет все провайдеры приложения в одном месте
 * Гарантирует правильный порядок инициализации
 */
export const AppProvider: React.FC<{
  children: React.ReactNode;
  navigationRef?: React.RefObject<NavigationContainerRef<any>>;
  onReady?: () => void;
  onStateChange?: () => void;
}> = ({ children, navigationRef, onReady, onStateChange }) => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={AppTheme}>
        <TasksCounterProvider>
          <NavigationContainer
            ref={navigationRef as any}
            onReady={onReady}
            onStateChange={onStateChange}
          >
            {children}
            {/* FAB для быстрого доступа к UI Catalog (только в DEV) */}
            <DevUICatalogFAB />
          </NavigationContainer>
        </TasksCounterProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};
