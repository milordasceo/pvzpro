import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StyledScrollView } from '../../../components';
import type { AdminTabParamList } from '../../../types/navigation';

interface StatisticsTabProps {
  data: {
    pvzCount: number;
    employeesCount: number;
    onShiftCount: number;
    plannedTodayCount: number;
    requests: any[];
    lateEmployees?: number;
    pvzWithShortage?: number;
  };
  loading: boolean;
  onRefresh: () => void;
}

type NavigationProp = BottomTabNavigationProp<AdminTabParamList>;

/**
 * Вкладка "Контроль" Dashboard
 * Показывает что требует внимания и что в норме
 */
export const StatisticsTab = React.memo<StatisticsTabProps>(({ data, loading, onRefresh }) => {
  const navigation = useNavigation<NavigationProp>();

  // Подсчёт проблем
  const issuesCount = useMemo(() => {
    let count = 0;
    if (data.lateEmployees && data.lateEmployees > 0) count++;
    if (data.requests.length > 0) count++;
    if (data.pvzWithShortage && data.pvzWithShortage > 0) count++;
    return count;
  }, [data.lateEmployees, data.requests.length, data.pvzWithShortage]);

  // Обработчик клика на "Запросы"
  const handleRequestsPress = useCallback(() => {
    navigation.navigate('График', { screen: 'requests' } as any);
  }, [navigation]);

  // Обработчик клика на "Опоздания"
  const handleLatePress = useCallback(() => {
    navigation.navigate('Обзор', { screen: 'on-shift' } as any);
  }, [navigation]);

  return (
    <StyledScrollView
      style={{ backgroundColor: '#F3F4F6' }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {/* Шапка */}
      <View style={{ 
        backgroundColor: '#FFFFFF', 
        padding: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: '#E5E7EB',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
            Контроль
          </Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="tune" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          {issuesCount > 0 
            ? `${issuesCount} ${issuesCount === 1 ? 'момент требует' : 'момента требуют'} внимания`
            : 'Всё под контролем'}
        </Text>
      </View>

      <View style={{ padding: 16, paddingTop: 12, gap: 12 }}>
        {/* ТРЕБУЮТ ВНИМАНИЯ */}
        {issuesCount > 0 && (
          <View>
            <Text style={{ 
              fontSize: 11, 
              fontWeight: '700', 
              color: '#DC2626', 
              letterSpacing: 0.5, 
              marginBottom: 12,
              textTransform: 'uppercase',
            }}>
              ⚠️ ТРЕБУЮТ ВНИМАНИЯ
            </Text>

            <View style={{ gap: 8 }}>
              {/* Опоздания */}
              {data.lateEmployees && data.lateEmployees > 0 && (
                <TouchableOpacity
                  onPress={handleLatePress}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: '#FEF2F2',
                    borderLeftWidth: 4,
                    borderLeftColor: '#DC2626',
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <MaterialCommunityIcons name="clock-alert-outline" size={24} color="#DC2626" />
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                        Опоздания
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#991B1B', marginLeft: 34 }}>
                      {data.lateEmployees} {data.lateEmployees === 1 ? 'сотрудник опоздал' : 'сотрудника опоздали'} на смену
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#DC2626" />
                </TouchableOpacity>
              )}

              {/* Запросы */}
              {data.requests.length > 0 && (
                <TouchableOpacity
                  onPress={handleRequestsPress}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: '#FEF3C7',
                    borderLeftWidth: 4,
                    borderLeftColor: '#F59E0B',
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <MaterialCommunityIcons name="message-alert-outline" size={24} color="#F59E0B" />
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                        Запросы на рассмотрение
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#92400E', marginLeft: 34 }}>
                      {data.requests.length} {data.requests.length === 1 ? 'запрос ожидает' : 'запросов ожидают'} решения
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#F59E0B" />
                </TouchableOpacity>
              )}

              {/* Нехватка персонала */}
              {data.pvzWithShortage && data.pvzWithShortage > 0 && (
                <TouchableOpacity
                  onPress={handleLatePress}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: '#FEF2F2',
                    borderLeftWidth: 4,
                    borderLeftColor: '#DC2626',
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <MaterialCommunityIcons name="account-alert-outline" size={24} color="#DC2626" />
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                        Нехватка персонала
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#991B1B', marginLeft: 34 }}>
                      {data.pvzWithShortage} {data.pvzWithShortage === 1 ? 'ПВЗ не укомплектован' : 'ПВЗ не укомплектованы'}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#DC2626" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ВСЁ В НОРМЕ */}
        <View>
          <Text style={{ 
            fontSize: 11, 
            fontWeight: '700', 
            color: '#10B981', 
            letterSpacing: 0.5, 
            marginBottom: 12,
            textTransform: 'uppercase',
            marginTop: issuesCount > 0 ? 12 : 0,
          }}>
            ✓ ВСЁ В НОРМЕ
          </Text>

          <View style={{ gap: 8 }}>
            {/* Работают сейчас */}
            <View style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <MaterialCommunityIcons name="account-check-outline" size={24} color="#10B981" />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                    Работают сейчас
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 34 }}>
                  {data.onShiftCount} из {data.plannedTodayCount} запланированных
                </Text>
              </View>
              <View style={{ 
                backgroundColor: '#ECFDF5', 
                paddingHorizontal: 12, 
                paddingVertical: 6, 
                borderRadius: 8 
              }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#10B981' }}>
                  {data.onShiftCount}
                </Text>
              </View>
            </View>

            {/* ПВЗ под управлением */}
            <View style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <MaterialCommunityIcons name="store-check-outline" size={24} color="#10B981" />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                    ПВЗ под управлением
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 34 }}>
                  {data.pvzCount - (data.pvzWithShortage || 0)} из {data.pvzCount} укомплектованы
                </Text>
              </View>
              <View style={{ 
                backgroundColor: '#ECFDF5', 
                paddingHorizontal: 12, 
                paddingVertical: 6, 
                borderRadius: 8 
              }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#10B981' }}>
                  {data.pvzCount}
                </Text>
              </View>
            </View>

            {/* Смены идут по плану */}
            {issuesCount === 0 && (
              <View style={{
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <MaterialCommunityIcons name="clock-check-outline" size={24} color="#10B981" />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                      Смены идут по плану
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 34 }}>
                    Нет опозданий и срывов графика
                  </Text>
                </View>
                <MaterialCommunityIcons name="check-circle" size={28} color="#10B981" />
              </View>
            )}
          </View>
        </View>

      </View>
    </StyledScrollView>
  );
});

StatisticsTab.displayName = 'StatisticsTab';
