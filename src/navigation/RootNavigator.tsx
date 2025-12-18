import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../features/auth/model/auth.store';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { EmployeeNavigator } from './stacks/EmployeeNavigator';
import { ManagerNavigator } from './stacks/ManagerNavigator';
import { OwnerNavigator } from './stacks/OwnerNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const role = useAuthStore((state) => state.role);

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: 'white' } 
      }}
    >
      {!role ? (
        <Stack.Screen name="Auth" component={LoginScreen} />
      ) : role === 'employee' ? (
        <Stack.Screen name="EmployeeApp" component={EmployeeNavigator} />
      ) : role === 'manager' ? (
        <Stack.Screen name="ManagerApp" component={ManagerNavigator} />
      ) : (
        <Stack.Screen name="OwnerApp" component={OwnerNavigator} />
      )}
    </Stack.Navigator>
  );
};
