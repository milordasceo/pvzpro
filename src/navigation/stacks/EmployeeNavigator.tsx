import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmployeeHomeScreen } from '../../features/employee/screens/EmployeeHomeScreen';

const Stack = createNativeStackNavigator();

export const EmployeeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeeHome" component={EmployeeHomeScreen} />
    </Stack.Navigator>
  );
};
