import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { placeholderColor } from '../theme';
import { AdminTabParamList } from '../types/navigation';
import { AdminDashboardScreen } from '../admin/screens/AdminDashboardScreen';
import { ScheduleScreen } from '../admin/screens/ScheduleScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();
// const Stack = createNativeStackNavigator<AdminTabParamList>(); // Временно не используется

/**
 * Stack навигатор для модуля ПВЗ
 * ВРЕМЕННО ОТКЛЮЧЕНО для отладки
 */
// const PvzStack: React.FC = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen name="ПВЗ" component={PvzListScreen} />
//       <Stack.Screen 
//         name="PvzDetails" 
//         component={PvzDetailsScreen}
//         options={{
//           headerShown: true,
//           title: 'Детали ПВЗ',
//         }}
//       />
//       <Stack.Screen 
//         name="PvzSettings" 
//         component={PvzSettingsScreen}
//         options={{
//           headerShown: true,
//           title: 'Настройки ПВЗ',
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

/**
 * Таб навигатор для администраторов
 * 5 табов: Обзор, ПВЗ, Сотрудники, График, Чат
 */
export const AdminTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5',
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

      {/* 2. ПВЗ (Список точек + настройки) - ВРЕМЕННО ОТКЛЮЧЕНО */}
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
        component={PlaceholderScreen}
        options={{
          title: 'Сотрудники',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
          ),
        }}
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
