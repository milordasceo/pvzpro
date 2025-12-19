import React from 'react';
import { View, Text } from 'react-native';

export const FinanceScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold">Финансы</Text>
      <Text className="text-gray-500 mt-2">Здесь будут выплаты и штрафы</Text>
    </View>
  );
};
