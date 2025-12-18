import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'heroui-native';
import { useAuthStore } from '../../auth/model/auth.store';

export const ManagerHomeScreen = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-4">Кабинет Менеджера</Text>
      <Button color="danger" onPress={logout}>
        Выйти
      </Button>
    </View>
  );
};
