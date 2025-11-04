import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { tokens, Title, Body, Label, Caption, Heading } from '../../../ui';
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
    employeesOnShift: any[];
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
    if (data.requests && data.requests.length > 0) count++;
    if (data.pvzWithShortage && data.pvzWithShortage > 0) count++;
    return count;
  }, [data.lateEmployees, data.requests, data.pvzWithShortage]);

  return (
    <ScrollView
      style={{ backgroundColor: tokens.colors.gray[100] }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View style={{ gap: 12 }}>
        {/* ТРЕБУЮТ ВНИМАНИЯ */}
        {issuesCount > 0 && (
          <View>
            <Label 
              size="small"
              style={{ 
                color: tokens.colors.error.main, 
                letterSpacing: 0.5, 
                marginBottom: 12,
                textTransform: 'uppercase',
              }}>
              ТРЕБУЮТ ВНИМАНИЯ
            </Label>

            <View style={{ gap: 8 }}>
              {/* Опоздания */}
              {!!(data.lateEmployees && data.lateEmployees > 0) && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: tokens.colors.error.light,
                    borderLeftWidth: 4,
                    borderLeftColor: tokens.colors.error.main,
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <MaterialCommunityIcons name="clock-alert-outline" size={24} color={tokens.colors.error.main} />
                      <Title size="medium">
                        Опоздания
                      </Title>
                    </View>
                    <Body style={{ color: tokens.colors.error.main, marginLeft: 34 }}>
                      {`${data.lateEmployees} ${data.lateEmployees === 1 ? 'сотрудник опоздал' : 'сотрудника опоздали'} на смену`}
                    </Body>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={tokens.colors.error.main} />
                </TouchableOpacity>
              )}

              {/* Запросы */}
              {!!(data.requests && data.requests.length > 0) && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: tokens.colors.warning.light,
                    borderLeftWidth: 4,
                    borderLeftColor: tokens.colors.warning.main,
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <MaterialCommunityIcons name="message-alert-outline" size={24} color={tokens.colors.warning.main} />
                      <Title size="medium">
                        Запросы на рассмотрение
                      </Title>
                    </View>
                    <Body style={{ color: tokens.colors.warning.main, marginLeft: 34 }}>
                      {`${data.requests.length} ${data.requests.length === 1 ? 'запрос ожидает' : 'запросов ожидают'} решения`}
                    </Body>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={tokens.colors.warning.main} />
                </TouchableOpacity>
              )}

              {/* Нехватка персонала */}
              {!!(data.pvzWithShortage && data.pvzWithShortage > 0) && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: tokens.colors.error.light,
                    borderLeftWidth: 4,
                    borderLeftColor: tokens.colors.error.main,
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <MaterialCommunityIcons name="account-alert-outline" size={24} color={tokens.colors.error.main} />
                      <Title size="medium">
                        Нехватка персонала
                      </Title>
                    </View>
                    <Body style={{ color: tokens.colors.error.main, marginLeft: 34 }}>
                      {`${data.pvzWithShortage} ${data.pvzWithShortage === 1 ? 'ПВЗ не укомплектован' : 'ПВЗ не укомплектованы'}`}
                    </Body>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={tokens.colors.error.main} />
                </TouchableOpacity>
              )}

            </View>
          </View>
        )}

        {/* ВСЁ В НОРМЕ */}
        <View>
          <Label 
            size="small"
            style={{ 
              color: tokens.colors.success.main, 
              letterSpacing: 0.5, 
              marginBottom: 12,
              textTransform: 'uppercase',
            }}>
            ВСЁ В НОРМЕ
          </Label>

          <View style={{ gap: 8 }}>
            {/* Всего ПВЗ */}
            <View style={{
              backgroundColor: tokens.colors.surface,
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <MaterialCommunityIcons name="store" size={24} color={tokens.colors.primary.main} />
                  <Title size="medium">
                    Всего ПВЗ
                  </Title>
                </View>
                <Body color="secondary" style={{ marginLeft: 34 }}>
                  {`${data.pvzCount} ${data.pvzCount === 1 ? 'пункт' : 'пунктов'} выдачи`}
                </Body>
              </View>
              <Heading level={3} style={{ color: tokens.colors.primary.main }}>
                {data.pvzCount}
              </Heading>
            </View>

            {/* Всего сотрудников */}
            <View style={{
              backgroundColor: tokens.colors.surface,
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <MaterialCommunityIcons name="account-group" size={24} color={tokens.colors.primary.main} />
                  <Title size="medium">
                    Всего сотрудников
                  </Title>
                </View>
                <Body color="secondary" style={{ marginLeft: 34 }}>
                  {`${data.employeesCount} ${data.employeesCount === 1 ? 'человек' : 'человек'} в базе`}
                </Body>
              </View>
              <Heading level={3} style={{ color: tokens.colors.primary.main }}>
                {data.employeesCount}
              </Heading>
            </View>

            {/* На смене */}
            <View
              style={{
                backgroundColor: tokens.colors.surface,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <MaterialCommunityIcons name="account-clock" size={24} color={tokens.colors.success.main} />
                  <Title size="medium">
                    На смене
                  </Title>
                </View>
                <Body color="secondary" style={{ marginLeft: 34 }}>
                  {`${data.onShiftCount} ${data.onShiftCount === 1 ? 'сотрудник работает' : 'сотрудников работают'} сейчас`}
                </Body>
              </View>
              <Heading level={3} style={{ color: tokens.colors.success.main }}>
                {data.onShiftCount}
              </Heading>
            </View>

            {/* Запланировано */}
            <View style={{
              backgroundColor: tokens.colors.surface,
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <MaterialCommunityIcons name="calendar-check" size={24} color={tokens.colors.primary.main} />
                  <Title size="medium">
                    Запланировано
                  </Title>
                </View>
                <Body color="secondary" style={{ marginLeft: 34 }}>
                  {`${data.plannedTodayCount} ${data.plannedTodayCount === 1 ? 'смена' : 'смен'} на сегодня`}
                </Body>
              </View>
              <Heading level={3} style={{ color: tokens.colors.primary.main }}>
                {data.plannedTodayCount}
              </Heading>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
});

StatisticsTab.displayName = 'StatisticsTab';
