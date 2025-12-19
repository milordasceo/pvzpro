import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmployeeTabNavigator } from '../tabs/EmployeeTabNavigator';

const Stack = createNativeStackNavigator();

export const EmployeeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeeTabs" component={EmployeeTabNavigator} />
    </Stack.Navigator>
  );
};
