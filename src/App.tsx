import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AppProvider } from './providers/AppProvider';
import { AppNavigator } from './navigation/AppNavigator';
import { useAuthStore } from './store/auth.store';
import { APP_CONFIG } from './config/app';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { RoleType } from './types/navigation';
import {
  initializeNotifications,
  scheduleNextShiftReminderTwoOnTwo,
  registerNotificationTapNavigator,
} from './services/notifications';

/**
 * Основной компонент приложения
 * Использует новую архитектуру с stores и providers
 */
const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Инициализация приложения
  useEffect(() => {
    console.log('App initialized with config:', APP_CONFIG.VERSION);
    LogBox.ignoreLogs([
      'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
    ]);
    // TODO: вернуть инициализацию уведомлений после перехода на development build или продезапуск.
    // (async () => {
    //   const ok = await initializeNotifications();
    //   if (ok) {
    //     await scheduleNextShiftReminderTwoOnTwo(10);
    //   }
    // })();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <AppNavigator />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
};

/**
 * Главный экспортируемый компонент приложения
 */
const App: React.FC = () => {
  const navRef = useRef<any>(null);
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(undefined);
  const isChatContext = useMemo(
    () => (currentRoute ?? '').toLowerCase().includes('chat'),
    [currentRoute],
  );
  const { user, updateUser } = useAuthStore();
  const [menuVisible, setMenuVisible] = useState(false);
  const subtitle = useMemo(() => {
    const role = user?.role as RoleType | undefined;
    return role === 'owner'
      ? 'Роль: Владелец'
      : role === 'admin'
        ? 'Роль: Администратор'
        : 'Роль: Сотрудник';
  }, [user?.role]);
  const handleRoleChange = (role: RoleType) => {
    if (user) updateUser({ role });
    setMenuVisible(false);
  };
  return (
    <AppProvider
      navigationRef={navRef as any}
      onReady={() => {
        try {
          setCurrentRoute(navRef.current?.getCurrentRoute()?.name);
          // TODO: вернуть обработчик уведомлений после включения expo-notifications вне Expo Go
          // registerNotificationTapNavigator(({ route, tab, subtab }) => {
          //   try {
          //     if (route) {
          //       if (navRef.current?.getRootState()?.routeNames?.includes(route)) {
          //         navRef.current?.navigate(route as any);
          //       } else {
          //         navRef.current?.navigate('Main' as any);
          //       }
          //     }
          //     navRef.current?.navigate('Моя смена' as any);
          //     if (subtab === 'Обзор') {
          //       navRef.current?.navigate('Моя смена' as any, { screen: 'Обзор' });
          //     }
          //   } catch (e) {
          //     console.warn('nav from notif error', e);
          //   }
          // });
        } catch {}
      }}
      onStateChange={() => {
        try {
          setCurrentRoute(navRef.current?.getCurrentRoute()?.name);
        } catch {}
      }}
    >
      <GestureHandlerRootView style={styles.container}>
        {!isChatContext && user?.role !== 'admin' && (
          <Appbar.Header mode="center-aligned">
            <Appbar.Content title="WB ПВЗ" subtitle={subtitle} />
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Appbar.Action
                  icon="account-switch"
                  accessibilityLabel="Сменить роль"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item onPress={() => handleRoleChange('employee')} title="Сотрудник" />
              <Menu.Item onPress={() => handleRoleChange('admin')} title="Администратор" />
              <Menu.Item onPress={() => handleRoleChange('owner')} title="Владелец" />
            </Menu>
          </Appbar.Header>
        )}
        <AppContent />
      </GestureHandlerRootView>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
