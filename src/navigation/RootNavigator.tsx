import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../features/auth/model/auth.store';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { EmployeeNavigator } from './stacks/EmployeeNavigator';
import { ManagerNavigator } from './stacks/ManagerNavigator';
import { OwnerNavigator } from './stacks/OwnerNavigator';
import { UserRole } from '../shared/types';

const Stack = createNativeStackNavigator();

// Маппинг ролей на навигаторы
const roleNavigators: Record<NonNullable<UserRole>, React.ComponentType> = {
  employee: EmployeeNavigator,
  manager: ManagerNavigator,
  owner: OwnerNavigator,
};

export const RootNavigator = () => {
  const role = useAuthStore((state) => state.role);

  const Navigator = role ? roleNavigators[role] : null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' }
      }}
    >
      {!role ? (
        <Stack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <Stack.Screen name="App" component={Navigator!} />
      )}
    </Stack.Navigator>
  );
};
