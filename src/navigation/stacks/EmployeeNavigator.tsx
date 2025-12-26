import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmployeeTabNavigator } from '../tabs/EmployeeTabNavigator';
import { ProfileScreen } from '../../features/employee/screens/ProfileScreen';
import { SettingsScreen } from '../../features/employee/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export const EmployeeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeeTabs" component={EmployeeTabNavigator} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
