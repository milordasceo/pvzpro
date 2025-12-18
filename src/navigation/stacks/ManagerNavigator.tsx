import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ManagerHomeScreen } from '../../features/manager/screens/ManagerHomeScreen';

const Stack = createNativeStackNavigator();

export const ManagerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManagerHome" component={ManagerHomeScreen} />
    </Stack.Navigator>
  );
};
