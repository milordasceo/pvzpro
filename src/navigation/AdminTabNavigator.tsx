import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { placeholderColor } from '../theme';
import { AdminTabParamList } from '../types/navigation';
import { StyledScrollView } from '../components';

const Tab = createBottomTabNavigator<AdminTabParamList>();

/**
 * Таб навигатор для администраторов
 * Содержит экраны для управления точками выдачи
 */
export const AdminTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: placeholderColor,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Главная"
        component={PlaceholderScreen}
        options={{
          title: 'Главная администратора',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Сотрудники"
        component={PlaceholderScreen}
        options={{
          title: 'Управление сотрудниками',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Чат"
        component={PlaceholderScreen}
        options={{
          title: 'Чат администратора',
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
 */
const PlaceholderScreen: React.FC<{ route?: any }> = ({ route }) => {
  const title = route?.params?.title || 'Админ панель';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleLarge">{title}</Text>
      <Text style={{ color: placeholderColor, marginTop: 8 }}>
        Этот экран находится в разработке
      </Text>
    </View>
  );
};
