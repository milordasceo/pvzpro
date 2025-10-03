import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTasksCounter } from '../employee/tasks/TasksCounterContext';
import { placeholderColor } from '../theme';
import { AnimatedTabBar, AnimatedTab } from '../components';
import { EmployeeHomeScreen } from '../employee/EmployeeHomeScreen';
import { ScheduleScreen } from '../employee/ScheduleScreen';
import { FinanceCurrentPeriodScreen } from '../employee/TestFinanceScreen';
import { FinanceHistoryScreen } from '../employee/FinanceHistoryScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ChatListScreen } from '../chat/ChatListScreen';
import { ChatScreen } from '../chat/ChatScreen';
import { EmployeeTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<EmployeeTabParamList>();
const Stack = createNativeStackNavigator();
const FinanceTopTabs = createMaterialTopTabNavigator();

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
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: placeholderColor,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Моя смена"
        component={EmployeeHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIconWithBadge
              icon="calendar-clock"
              color={color}
              size={size}
              badge={badgeValue}
            />
          ),
        }}
      />

      <Tab.Screen
        name="График"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-month" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Финансы"
        component={FinanceTabs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Чат"
        component={ChatStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat-processing-outline" size={size} color={color} />
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
        <FinanceTopTabs.Screen name="Текущий период" component={FinanceCurrentPeriodScreen} />
        <FinanceTopTabs.Screen name="История" component={FinanceHistoryScreen as any} />
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
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <MaterialCommunityIcons name={icon} size={size} color={color} />
      {badge && (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -6,
            backgroundColor: '#EF4444',
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: '600',
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
