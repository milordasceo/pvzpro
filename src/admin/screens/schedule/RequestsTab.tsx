import React from 'react';
import { View, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyledCard, StyledScrollView } from '../../../components';

interface Request {
  id: string;
  employeeName: string;
  employeePhoto?: string;
  type: 'day_off' | 'shift_swap' | 'vacation' | 'sick_leave';
  date: string;
  comment: string;
}

interface RequestsTabProps {
  requests: Request[];
  loading: boolean;
  onRefresh: () => void;
}

/**
 * Вкладка "Запросы" в модуле График
 * Показывает запросы от сотрудников на изменение графика
 */
export const RequestsTab = React.memo<RequestsTabProps>(({ requests, loading, onRefresh }) => {
  return (
    <StyledScrollView
      style={{ backgroundColor: '#F3F4F6' }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {requests.length > 0 ? (
        <StyledCard>
          <View style={{ gap: 0 }}>
            {/* Заголовок */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
                Запросы
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </View>

            {/* Количество */}
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
              Требуют рассмотрения: {requests.length}
            </Text>

            {/* Список запросов - белые карточки с рамкой */}
            {requests.map((request, index) => (
              <View
                key={request.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: index < requests.length - 1 ? 12 : 0,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                {/* Информация о сотруднике */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                  <Avatar.Image
                    size={48}
                    source={{ uri: request.employeePhoto || 'https://via.placeholder.com/48' }}
                  />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: '400', color: '#111827' }}>
                      {request.employeeName}
                    </Text>
                    
                    {/* Тип запроса с иконкой */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <MaterialCommunityIcons 
                        name={
                          request.type === 'day_off' ? 'umbrella-beach' :
                          request.type === 'shift_swap' ? 'swap-horizontal' :
                          request.type === 'vacation' ? 'airplane' :
                          'medical-bag'
                        } 
                        size={14} 
                        color="#4F46E5" 
                      />
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#4F46E5', textTransform: 'uppercase' }}>
                        {request.type === 'day_off' ? 'выходной' :
                         request.type === 'shift_swap' ? 'обмен сменой' :
                         request.type === 'vacation' ? 'отпуск' :
                         'больничный'}
                      </Text>
                    </View>

                    {/* Дата под типом запроса */}
                    <Text style={{ fontSize: 13, color: '#9CA3AF' }}>
                      {request.date}
                    </Text>
                  </View>
                </View>

                {/* Комментарий в светло-сером блоке */}
                {request.comment && (
                  <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 18 }}>
                      "{request.comment}"
                    </Text>
                  </View>
                )}

                {/* Кнопка "Рассмотреть запрос" */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                  }}
                >
                  <MaterialCommunityIcons name="eye-outline" size={18} color="#4F46E5" />
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#4F46E5' }}>
                    Рассмотреть запрос
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </StyledCard>
      ) : (
        <StyledCard>
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <MaterialCommunityIcons 
              name="check-circle" 
              size={64} 
              color="#10B981" 
              style={{ marginBottom: 16 }}
            />
            <Text variant="headlineSmall" style={{ marginBottom: 8, color: '#111827' }}>
              Нет запросов
            </Text>
            <Text variant="bodyMedium" style={{ color: '#6B7280', textAlign: 'center' }}>
              Все запросы рассмотрены
            </Text>
          </View>
        </StyledCard>
      )}
    </StyledScrollView>
  );
});

RequestsTab.displayName = 'RequestsTab';

