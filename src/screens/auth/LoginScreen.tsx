import React from 'react';
import { View, Text } from 'react-native';
import { Button, TextField } from 'heroui-native';

export const LoginScreen = () => {
  return (
    <View className="flex-1 justify-center p-6 bg-background">
      <View className="w-full max-w-sm mx-auto space-y-6">
        <View className="items-center mb-4">
          <Text className="text-3xl font-bold text-foreground">WB App</Text>
          <Text className="text-gray-500">Вход в систему</Text>
        </View>

        <TextField
          label="Email"
          placeholder="user@example.com"
          variant="bordered"
        />

        <TextField
          label="Пароль"
          placeholder="********"
          variant="bordered"
          secureTextEntry
        />

        <Button 
          color="primary" 
          size="lg" 
          className="w-full font-medium"
          onPress={() => console.log('Login pressed')}
        >
          Войти
        </Button>
      </View>
    </View>
  );
};
