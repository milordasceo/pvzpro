import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OwnerHomeScreen } from '../../features/owner/screens/OwnerHomeScreen';

const Stack = createNativeStackNavigator();

export const OwnerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerHome" component={OwnerHomeScreen} />
    </Stack.Navigator>
  );
};
