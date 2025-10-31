import React, { Suspense, lazy } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { tokens, AnimatedTabBar, AnimatedTab, LoadingState } from '../ui';
import { useTasksCounter } from '../employee/tasks/TasksCounterContext';
import { placeholderColor } from '../theme';
import { EmployeeHomeScreen } from '../employee/EmployeeHomeScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ChatListScreen } from '../chat/ChatListScreen';
import { ChatScreen } from '../chat/ChatScreen';
import { EmployeeTabParamList } from '../types/navigation';

// Ленивая загрузка тяжёлых экранов (Code Splitting)
const ScheduleScreen = lazy(() => import('../employee/ScheduleScreen').then(m => ({ default: m.ScheduleScreen })));
const FinanceCurrentPeriodScreen = lazy(() => import('../employee/FinanceCurrentPeriodScreen').then(m => ({ default: m.FinanceCurrentPeriodScreen })));
const FinanceHistoryScreen = lazy(() => import('../employee/FinanceHistoryScreen').then(m => ({ default: m.FinanceHistoryScreen })));

const Tab = createBottomTabNavigator<EmployeeTabParamList>();
const Stack = createNativeStackNavigator();
const FinanceTopTabs = createMaterialTopTabNavigator();

// Компонент загрузки для Suspense
const LoadingFallback: React.FC = () => <LoadingState text="Загрузка..." />;

/**
 * Стек навигатор для чата
 */
const ChatStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

/**
 * Главный таб навигатор для сотрудников
 * Содержит все основные экраны доступные сотруднику
 *
 * ✅ ВОССТАНОВЛЕНО: Вкладка "Финансы" возвращена к нормальному состоянию
 * Время обновления: 2025-08-29T13:20:00+07:00
 */
export const EmployeeTabNavigator: React.FC = () => {
  const { pendingCount } = useTasksCounter();
  const badgeValue = pendingCount > 99 ? '99+' : pendingCount ? String(pendingCount) : undefined;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: tokens.colors.primary.main,
        tabBarInactiveTintColor: tokens.colors.text.muted,
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: tokens.colors.surface,
          borderTopWidth: 1,
          borderTopColor: tokens.colors.border,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Моя смена"
        component={EmployeeHomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIconWithBadge
              icon="calendar-clock"
              color={color}
              size={focused ? 28 : 26}
              badge={badgeValue}
            />
          ),
        }}
      />

      <Tab.Screen
        name="График"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="calendar-month" 
              size={focused ? 28 : 26} 
              color={color} 
            />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <ScheduleScreen />
          </Suspense>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Финансы"
        component={FinanceTabs}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="cash-multiple" 
              size={focused ? 28 : 26} 
              color={color} 
            />
          ),
        }}
      />

      <Tab.Screen
        name="Чат"
        component={ChatStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIconWithBadge
              icon="chat-processing-outline"
              color={color}
              size={focused ? 28 : 26}
              badge="2"
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Сбрасываем стек чата к начальному экрану (ChatList)
            // Это гарантирует, что при клике на таб "Чат" всегда открывается список чатов
            (navigation as any).navigate('Чат', {
              screen: 'ChatList',
            });
          },
        })}
      />
    </Tab.Navigator>
  );
};
// Табы для финансов
const financeTabs: AnimatedTab[] = [
  { key: 'current', label: 'Текущий период' },
  { key: 'history', label: 'История' },
];

// Кастомный таб-бар для финансов
const CustomFinanceTabBar: React.FC<{ navigation: any; state: any }> = ({ navigation, state }) => {
  const handleTabPress = (index: number) => {
    if (index === 0) {
      navigation.navigate('Текущий период');
    } else {
      navigation.navigate('История');
    }
  };

  return (
    <AnimatedTabBar
      tabs={financeTabs}
      activeIndex={state.index}
      onTabPress={handleTabPress}
    />
  );
};

// Кастомные табы финансов (без багов индикатора)
const FinanceTabs: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <FinanceTopTabs.Navigator
        screenOptions={{
          swipeEnabled: true,
          lazy: true,
        }}
        tabBar={(props) => <CustomFinanceTabBar {...props} />}
      >
        <FinanceTopTabs.Screen name="Текущий период">
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <FinanceCurrentPeriodScreen />
            </Suspense>
          )}
        </FinanceTopTabs.Screen>
        <FinanceTopTabs.Screen name="История">
          {() => (
            <Suspense fallback={<LoadingFallback />}>
              <FinanceHistoryScreen />
            </Suspense>
          )}
        </FinanceTopTabs.Screen>
      </FinanceTopTabs.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({});

/**
 * Компонент иконки таба с бэйджем
 */
const TabBarIconWithBadge: React.FC<{
  icon: any;
  color: string;
  size: number;
  badge?: string;
}> = ({ icon, color, size, badge }) => {
  return (
    <View style={{ width: size + 8, height: size + 8, alignItems: 'center', justifyContent: 'center' }}>
      <MaterialCommunityIcons name={icon} size={size} color={color} />
      {badge && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            backgroundColor: tokens.colors.error.main,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 5,
            borderWidth: 2,
            borderColor: tokens.colors.surface,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Text
            style={{
              color: tokens.colors.surface,
              fontSize: 11,
              fontWeight: '700',
              lineHeight: 14,
            }}
          >
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
};

/**
 * Заглушка для экранов, которые еще не реализованы
 */
const PlaceholderScreen: React.FC<{ route?: any }> = ({ route }) => {
  const title = route?.params?.title || 'Заглушка';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleLarge">{title}</Text>
      <Text style={{ color: placeholderColor, marginTop: 8 }}>
        Этот экран находится в разработке
      </Text>
    </View>
  );
};

//
