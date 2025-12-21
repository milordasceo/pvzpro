import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Briefcase, Calendar, Wallet, MessageCircle, CheckSquare } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShiftScreen } from '../../features/employee/screens/ShiftScreen';
import { ScheduleScreen } from '../../features/employee/screens/ScheduleScreen';
import { FinanceScreen } from '../../features/employee/screens/FinanceScreen';
import { ChatScreen } from '../../features/employee/screens/ChatScreen';
import { TasksScreen } from '../../features/employee/screens/TasksScreen';
import { theme } from '../../shared/theme';
import { marketplaceThemes } from '../../shared/theme/colors';
import { useTasksStore } from '../../features/employee/model/tasks.store';
import { useShiftStore } from '../../features/employee/model/shift.store';

const Tab = createBottomTabNavigator();

export const EmployeeTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { isShiftOpen, pvz } = useShiftStore();
  const pendingTasksCount = useTasksStore(state => 
    state.tasks.filter(t => t.status === 'pending').length
  );

  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;
  const badgeCount = isShiftOpen ? pendingTasksCount : 0;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontSize: theme.layout.header.titleFontSize,
          fontWeight: 'bold',
          color: theme.colors.header.text,
        },
        headerStyle: {
          backgroundColor: theme.colors.header.background,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.header.border,
        },
        tabBarActiveTintColor: currentTheme.primary,
        tabBarInactiveTintColor: theme.colors.tabBar.inactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.tabBar.border,
          paddingTop: theme.layout.tabBar.paddingTop,
          height: theme.layout.tabBar.height + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : theme.layout.tabBar.paddingBottom,
          backgroundColor: theme.colors.white,
        },
      }}
    >
      <Tab.Screen
        name="Shift"
        component={ShiftScreen}
        options={{
          headerShown: false,
          title: 'Моя смена',
          tabBarLabel: 'Смена',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: currentTheme.primary,
            color: pvz.marketplace === 'yandex' ? '#000000' : '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
          }
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          headerShown: false,
          title: 'Задачи',
          tabBarLabel: 'Задачи',
          tabBarIcon: ({ color, size }) => <CheckSquare color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'График работы',
          tabBarLabel: 'График',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{
          title: 'Финансы',
          tabBarLabel: 'Финансы',
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Сообщения',
          tabBarLabel: 'Чат',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
