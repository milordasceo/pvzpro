import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { Text, Appbar, Menu } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { placeholderColor } from '../theme';
import { OwnerTabParamList, RoleType } from '../types/navigation';
import { StyledScrollView } from '../components';
import { useAuthStore } from '../store/auth.store';

const Tab = createBottomTabNavigator<OwnerTabParamList>();

/**
 * Таб навигатор для владельцев
 * Содержит экраны для управления всей сетью ПВЗ
 */
export const OwnerTabNavigator: React.FC = () => {
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
        <Appbar.Content title="WB ПВЗ (Владелец)" subtitle={subtitle} />
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
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: placeholderColor,
          headerShown: false,
        }}
      >
      <Tab.Screen
        name="Дашборд"
        component={PlaceholderScreen}
        options={{
          title: 'Дашборд владельца',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-box-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ПВЗ"
        component={PlaceholderScreen}
        options={{
          title: 'Управление ПВЗ',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="store-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Правила"
        component={PlaceholderScreen}
        options={{
          title: 'Настройки правил',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    </View>
  );
};

/**
 * Заглушка для экранов владельца
 */
const PlaceholderScreen: React.FC<{ route?: any }> = ({ route }) => {
  const title = route?.params?.title || 'Владелец';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleLarge">{title}</Text>
      <Text style={{ color: placeholderColor, marginTop: 8 }}>
        Этот экран находится в разработке
      </Text>
    </View>
  );
};
