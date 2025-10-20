import React from 'react';
import { View, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, Card, ScrollView, EmptyState } from '../../../ui';

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
    <ScrollView
      style={{ backgroundColor: tokens.colors.gray[100] }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {requests.length > 0 ? (
        <Card>
          <View style={{ gap: 0 }}>
            {/* Заголовок */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: tokens.colors.text.primary }}>
                Запросы
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color={tokens.colors.text.muted} />
            </View>

            {/* Количество */}
            <Text style={{ fontSize: 14, color: tokens.colors.text.secondary, marginBottom: 16 }}>
              Требуют рассмотрения: {requests.length}
            </Text>

            {/* Список запросов - белые карточки с рамкой */}
            {requests.map((request, index) => (
              <View
                key={request.id}
                style={{
                  backgroundColor: tokens.colors.surface,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: index < requests.length - 1 ? 12 : 0,
                  borderWidth: 1,
                  borderColor: tokens.colors.border,
                }}
              >
                {/* Информация о сотруднике */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                  <Avatar.Image
                    size={48}
                    source={{ uri: request.employeePhoto || 'https://via.placeholder.com/48' }}
                  />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: '400', color: tokens.colors.text.primary }}>
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
                        color={tokens.colors.primary.main} 
                      />
                      <Text style={{ fontSize: 13, fontWeight: '600', color: tokens.colors.primary.main, textTransform: 'uppercase' }}>
                        {request.type === 'day_off' ? 'выходной' :
                         request.type === 'shift_swap' ? 'обмен сменой' :
                         request.type === 'vacation' ? 'отпуск' :
                         'больничный'}
                      </Text>
                    </View>

                    {/* Дата под типом запроса */}
                    <Text style={{ fontSize: 13, color: tokens.colors.text.muted }}>
                      {request.date}
                    </Text>
                  </View>
                </View>

                {/* Комментарий в светло-сером блоке */}
                {request.comment && (
                  <View style={{ backgroundColor: tokens.colors.gray[50], borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    <Text style={{ fontSize: 13, color: tokens.colors.text.secondary, lineHeight: 18 }}>
                      "{request.comment}"
                    </Text>
                  </View>
                )}

                {/* Кнопка "Рассмотреть запрос" */}
                <TouchableOpacity
                  style={{
                    backgroundColor: tokens.colors.surface,
                    borderRadius: 8,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    borderWidth: 1,
                    borderColor: tokens.colors.border,
                  }}
                >
                  <MaterialCommunityIcons name="eye-outline" size={18} color={tokens.colors.primary.main} />
                  <Text style={{ fontSize: 14, fontWeight: '500', color: tokens.colors.primary.main }}>
                    Рассмотреть запрос
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Card>
      ) : (
        <EmptyState
          icon="check-circle"
          title="Нет запросов"
          description="Все запросы рассмотрены. Новые запросы появятся здесь."
        />
      )}
    </ScrollView>
  );
});

RequestsTab.displayName = 'RequestsTab';

