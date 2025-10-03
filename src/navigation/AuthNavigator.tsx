import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyledButton } from '../components';

/**
 * Навигация для неавторизованных пользователей
 * Содержит экраны входа и регистрации
 */
export const AuthNavigator: React.FC = () => {
  // Пока что просто возвращаем заглушку
  // В будущем здесь будут экраны логина, регистрации и т.д.
  return <AuthPlaceholder />;
};

/**
 * Заглушка для экранов аутентификации
 */
const AuthPlaceholder: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBFCFE',
      }}
    >
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        Добро пожаловать в WB ПВЗ
      </Text>
      <Text style={{ color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
        Экраны аутентификации находятся в разработке
      </Text>
      <StyledButton
        mode="contained"
        onPress={() => {
          // Временная заглушка - автоматический вход как сотрудник
          const { login } = require('../store/auth.store').useAuthStore.getState();
          login({
            id: 'demo-employee',
            name: 'Демо Сотрудник',
            role: 'employee',
            email: 'demo@wb-pvz.ru',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }}
      >
        Войти как демо-пользователь
      </StyledButton>
    </View>
  );
};
