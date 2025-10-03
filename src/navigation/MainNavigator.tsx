import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth.store';
import { EmployeeTabNavigator } from './EmployeeTabNavigator';
import { AdminTabNavigator } from './AdminTabNavigator';
import { OwnerTabNavigator } from './OwnerTabNavigator';
import { EmployeeTabParamList, AdminTabParamList, OwnerTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator();

/**
 * Основной навигатор для авторизованных пользователей
 * Выбирает соответствующий таб навигатор в зависимости от роли пользователя
 */
export const MainNavigator: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null; // Это не должно случиться, но на всякий случай
  }

  switch (user.role) {
    case 'employee':
      return <EmployeeTabNavigator />;
    case 'admin':
      return <AdminTabNavigator />;
    case 'owner':
      return <OwnerTabNavigator />;
    default:
      return <EmployeeTabNavigator />; // fallback
  }
};
