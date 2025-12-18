import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'heroui-native';
import { useAuthStore, UserRole } from '../../features/auth/model/auth.store';

export const LoginScreen = () => {
  const setRole = useAuthStore((state) => state.setRole);

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="w-full max-w-sm mx-auto gap-6">
        <View className="items-center mb-8">
          <Text className="text-4xl font-bold text-black mb-2">ПВЗ Про</Text>
          <Text className="text-gray-500 text-lg">Выберите роль для входа</Text>
        </View>

        <View className="gap-4">
          <Button 
            color="primary" 
            size="lg" 
            className="w-full"
            onPress={() => handleRoleSelect('employee')}
          >
            Сотрудник
          </Button>

          <Button 
            color="secondary" 
            size="lg" 
            className="w-full"
            onPress={() => handleRoleSelect('manager')}
          >
            Менеджер
          </Button>

          <Button 
            color="warning" 
            size="lg" 
            className="w-full"
            onPress={() => handleRoleSelect('owner')}
          >
            Владелец
          </Button>
        </View>
      </View>
    </View>
  );
};
