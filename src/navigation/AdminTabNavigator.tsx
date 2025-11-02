import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Appbar, Menu } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../ui';
import { placeholderColor } from '../theme';
import { AdminTabParamList, RoleType } from '../types/navigation';
import { AdminDashboardScreen } from '../admin/screens/AdminDashboardScreen';
import { ScheduleScreen } from '../admin/screens/ScheduleScreen';
import { EmployeesScreen, EmployeeDetailsScreen, EmployeeFormScreen } from '../admin/screens/employees';
import { useAuthStore } from '../store/auth.store';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminTabParamList>();

/**
 * Стек навигатор для модуля сотрудников
 */
const EmployeesStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Сотрудники" component={EmployeesScreen} />
      <Stack.Screen 
        name="EmployeeDetails" 
        component={EmployeeDetailsScreen}
        options={{ 
          headerShown: true,
          title: 'Детали сотрудника',
          headerBackTitle: 'Назад',
        }}
      />
      <Stack.Screen 
        name="EmployeeForm" 
        component={EmployeeFormScreen}
        options={{ 
          headerShown: true,
          title: 'Сотрудник',
          headerBackTitle: 'Назад',
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Таб навигатор для администраторов
 * 5 табов: Обзор, ПВЗ, Сотрудники, График, Чат
 */
export const AdminTabNavigator: React.FC = () => {
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
    <View style={{ flex: 1 }}>
      {/* Хедер с переключателем ролей */}
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="WB ПВЗ (Админ)" subtitle={subtitle} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="account-switch"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item onPress={() => handleRoleChange('employee')} title="👷 Сотрудник" />
          <Menu.Item onPress={() => handleRoleChange('admin')} title="👔 Администратор" />
          <Menu.Item onPress={() => handleRoleChange('owner')} title="👑 Владелец" />
        </Menu>
      </Appbar.Header>

      {/* Табы */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: tokens.colors.primary.main,
          tabBarInactiveTintColor: placeholderColor,
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 11,
          },
        }}
      >
      {/* 1. Обзор (Dashboard) */}
      <Tab.Screen
        name="Обзор"
        component={AdminDashboardScreen}
        options={{
          title: 'Обзор',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2. ПВЗ */}
      <Tab.Screen
        name="ПВЗ"
        component={PlaceholderScreen}
        options={{
          title: 'ПВЗ',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="store-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Сотрудники */}
      <Tab.Screen
        name="Сотрудники"
        component={EmployeesStack}
        options={{
          title: 'Сотрудники',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Сбрасываем стек сотрудников к начальному экрану
            (navigation as any).navigate('Сотрудники', {
              screen: 'Сотрудники',
            });
          },
        })}
      />

      {/* 4. График */}
      <Tab.Screen
        name="График"
        component={ScheduleScreen}
        options={{
          title: 'График',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 5. Чат */}
      <Tab.Screen
        name="Чат"
        component={PlaceholderScreen}
        options={{
          title: 'Чат',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat-processing-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    </View>
  );
};

/**
 * Заглушка для экранов администратора
 * Мемоизирована для предотвращения лишних re-renders
 */
const PlaceholderScreen: React.FC<{ route?: any }> = React.memo(({ route }) => {
  const screenName = route?.name || 'Админ панель';

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name="wrench-outline" 
        size={64} 
        color={placeholderColor} 
        style={styles.icon}
      />
      <Text variant="headlineSmall" style={styles.title}>
        {screenName}
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Экран находится в разработке
      </Text>
    </View>
  );
});

// Стили вынесены для оптимизации (создаются один раз)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: placeholderColor,
    textAlign: 'center',
  },
});
