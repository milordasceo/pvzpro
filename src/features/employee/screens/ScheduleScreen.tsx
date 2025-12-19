import React from 'react';
import { View, Text } from 'react-native';

export const ScheduleScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold">График</Text>
      <Text className="text-gray-500 mt-2">Здесь будет календарь смен</Text>
    </View>
  );
};
