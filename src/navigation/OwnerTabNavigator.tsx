import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { placeholderColor } from '../theme';
import { OwnerTabParamList } from '../types/navigation';
import { StyledScrollView } from '../components';

const Tab = createBottomTabNavigator<OwnerTabParamList>();

/**
 * Таб навигатор для владельцев
 * Содержит экраны для управления всей сетью ПВЗ
 */
export const OwnerTabNavigator: React.FC = () => {
  return (
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
