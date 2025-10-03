import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { useNavigation } from '@react-navigation/native';

const DiagnosticScreen: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigation = useNavigation<any>();

  console.log('DiagnosticScreen:', {
    user,
    isAuthenticated,
    isLoading,
    navigation: !!navigation,
  });

  const handleTestNavigation = () => {
    Alert.alert('Навигация', 'Тестируем навигацию к финансам', [
      {
        text: 'Перейти к Финансам',
        onPress: () => {
          try {
            // Типобезопасность: используем нижние табы напрямую
            navigation.navigate('Финансы');
          } catch (error) {
            console.error('Navigation error:', error);
            Alert.alert('Ошибка', 'Не удалось перейти к финансам');
          }
        },
      },
      { text: 'Отмена' },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#FF6B6B',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        🔍 ДИАГНОСТИКА (ОБНОВЛЕНО!)
      </Text>

      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          width: '100%',
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1F2937' }}>
          Состояние приложения:
        </Text>

        <Text style={{ fontSize: 14, marginBottom: 8 }}>
          🔐 Аутентификация: {isAuthenticated ? '✅' : '❌'}
        </Text>

        <Text style={{ fontSize: 14, marginBottom: 8 }}>
          ⏳ Загрузка: {isLoading ? '⏳' : '✅'}
        </Text>

        <Text style={{ fontSize: 14, marginBottom: 8 }}>
          👤 Пользователь: {user ? user.name : 'Отсутствует'}
        </Text>

        <Text style={{ fontSize: 14, marginBottom: 8 }}>🏷️ Роль: {user?.role || 'Не указана'}</Text>

        <Text style={{ fontSize: 14, marginBottom: 8 }}>🆔 ID: {user?.id || 'Не указан'}</Text>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          width: '100%',
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1F2937' }}>
          Навигация:
        </Text>

        <Text style={{ fontSize: 14, marginBottom: 8 }}>
          🧭 Навигация доступна: {navigation ? '✅' : '❌'}
        </Text>

        <Text style={{ fontSize: 14, marginBottom: 8 }}>📱 Текущий экран: Диагностика</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Text
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
            fontWeight: '600',
          }}
          onPress={handleTestNavigation}
        >
          Тест Навигации
        </Text>

        <Text
          style={{
            backgroundColor: '#10B981',
            color: 'white',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
            fontWeight: '600',
          }}
          onPress={() => {
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
            Alert.alert(
              'Успех',
              'Вошли как демо-пользователь. Теперь попробуйте перейти к финансам снова.',
            );
          }}
        >
          Войти как Демо
        </Text>

        <Text
          style={{
            backgroundColor: '#8B5CF6',
            color: 'white',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
            fontWeight: '600',
          }}
          onPress={() => {
            Alert.alert('Переключение экрана', 'Переключить на нормальный финансовый экран?', [
              {
                text: 'Да',
                onPress: () => {
                  Alert.alert(
                    'Готово!',
                    'В следующем обновлении вкладка будет переключена на нормальный финансовый экран.\n\nСейчас вы можете протестировать основную функциональность.',
                  );
                },
              },
              { text: 'Отмена' },
            ]);
          }}
        >
          Переключить на Финансы
        </Text>
      </View>

      <Text style={{ marginTop: 20, color: '#6B7280', textAlign: 'center', fontSize: 12 }}>
        🎯 Этот экран помогает диагностировать проблемы с модулем Финансы.{'\n'}
        {'\n'}
        📋 Что делать:{'\n'}
        1. Проверьте состояние приложения выше{'\n'}
        2. Если не авторизованы - нажмите «Войти как Демо»{'\n'}
        3. Нажмите «Тест Навигации» для проверки{'\n'}
        4. Сообщите результаты для исправления
      </Text>
    </View>
  );
};

export default DiagnosticScreen;
