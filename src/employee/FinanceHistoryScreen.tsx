import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, Card, Button, MetaRow, EmptyState, ErrorState, Title, Body, Label, Caption } from '../ui';
import { ShiftPayment } from '../types/finance';
import { financeService } from '../services';
import { useAuthStore } from '../store/auth.store';

export const FinanceHistoryScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();

  const [shifts, setShifts] = useState<ShiftPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const allShifts = await financeService.getShiftPayments(user.id);
      setShifts(allShifts);
    } catch (err) {
      setError('Не удалось загрузить историю');
      console.error('Finance history load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatRUB = (n: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(n);

  const weekdayShort = (d: Date) => ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d.getDay()];

  // Статистика за год
  const yearStats = useMemo(() => {
    const now = new Date();
    const yearShifts = shifts.filter((s) => s.shiftDate.getFullYear() === now.getFullYear());
    const totalEarned = yearShifts.reduce((s, x) => s + x.totalAmount, 0);
    const totalBonuses = yearShifts.reduce((s, x) => s + x.bonuses, 0);
    const totalPenalties = yearShifts.reduce((s, x) => s + x.penalties, 0);
    const totalHours = yearShifts.reduce((s, x) => s + x.hoursWorked, 0);
    return { totalEarned, totalBonuses, totalPenalties, shiftsCount: yearShifts.length, totalHours };
  }, [shifts]);

  // Группировка по двухнедельным периодам
  const periods = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        label: string;
        startDate: Date;
        endDate: Date;
        paymentDate: Date;
        isPaid: boolean;
        shifts: ShiftPayment[];
      }
    >();

    shifts.forEach((shift) => {
      const d = shift.shiftDate;
      const y = d.getFullYear();
      const m = d.getMonth();
      const day = d.getDate();
      const isFirstHalf = day <= 14;

      const startDate = new Date(y, m, isFirstHalf ? 1 : 15);
      const endDate = new Date(y, m, isFirstHalf ? 14 : new Date(y, m + 1, 0).getDate());

      // Дата выплаты: 15 число или 1 число следующего месяца
      let paymentDate: Date;
      if (isFirstHalf) {
        paymentDate = new Date(y, m, 15);
      } else {
        paymentDate = new Date(y, m + 1, 1);
      }

      const isPaid = paymentDate < new Date();

      const label = `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })} г.`;
      const key = `${y}-${String(m + 1).padStart(2, '0')}-${isFirstHalf ? 'H1' : 'H2'}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          label,
          startDate,
          endDate,
          paymentDate,
          isPaid,
          shifts: [shift],
        });
      } else {
        map.get(key)!.shifts.push(shift);
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => b.startDate.getTime() - a.startDate.getTime(),
    );
  }, [shifts]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Загрузка истории...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Ошибка загрузки"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={{ padding: 16, gap: 16 }}>
          {/* Список периодов */}
          <View style={{ gap: 12 }}>
            {periods.length === 0 ? (
              <EmptyState
                icon="cash-remove"
                title="Нет истории"
                description="История финансовых операций пока пуста. Данные появятся после первой выплаты."
              />
            ) : (
              periods.map((period) => {
                const totalEarned = period.shifts.reduce((s, x) => s + x.totalAmount, 0);
                const totalHours = period.shifts.reduce((s, x) => s + x.hoursWorked, 0);
                const totalPenalties = period.shifts.reduce((s, x) => s + x.penalties, 0);
                const isExpanded = expandedPeriods[period.key];

                return (
                  <Card key={period.key}>
                    <View style={{ gap: 12 }}>
                      {/* Заголовок периода */}
                      <View style={{ gap: 4 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Body size="large" style={{ fontWeight: '600' }}>
                              {period.label}
                            </Body>
                            <Caption style={{ marginTop: 2 }}>
                              {period.isPaid ? 'Выплачено' : 'К выплате'}{' '}
                              {period.paymentDate.toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                              })}
                            </Caption>
                          </View>
                          <View
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 10,
                              backgroundColor: period.isPaid ? tokens.colors.success.light : tokens.colors.warning.light,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '600',
                                color: period.isPaid ? tokens.colors.success.dark : tokens.colors.warning.main,
                              }}
                            >
                              {period.isPaid ? 'Выплачено' : 'Ожидает'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Разделитель */}
                      <View style={{ height: 1, backgroundColor: tokens.colors.border }} />

                      {/* Итоговая сумма - акцент */}
                      <View
                        style={{
                          backgroundColor: tokens.colors.primary.light,
                          padding: 12,
                          borderRadius: 8,
                          borderLeftWidth: 3,
                          borderLeftColor: theme.colors.primary,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Body size="small" style={{ fontWeight: '500' }}>
                            {period.isPaid ? 'Получено' : 'Заработано'}
                          </Body>
                          <Text
                            style={{
                              fontSize: 24,
                              fontWeight: '700',
                              color: theme.colors.primary,
                            }}
                          >
                            {formatRUB(totalEarned)}
                          </Text>
                        </View>
                      </View>

                      {/* Детали с иконками */}
                      <View style={{ gap: 8, marginTop: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <MaterialCommunityIcons name="briefcase-clock" size={16} color={tokens.colors.text.secondary} />
                          <Caption style={{ flex: 1 }}>
                            Смен отработано
                          </Caption>
                          <Body size="small" style={{ fontWeight: '600' }}>
                            {period.shifts.length}
                          </Body>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <MaterialCommunityIcons name="clock-outline" size={16} color={tokens.colors.text.secondary} />
                          <Caption style={{ flex: 1 }}>Часов</Caption>
                          <Body size="small" style={{ fontWeight: '600' }}>
                            {totalHours} ч
                          </Body>
                        </View>
                        {totalPenalties !== 0 && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 8,
                              backgroundColor: tokens.colors.error.light,
                              padding: 8,
                              borderRadius: 6,
                              marginTop: 4,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="alert-circle-outline"
                              size={16}
                              color={tokens.colors.error.main}
                            />
                            <Body size="small" style={{ color: tokens.colors.error.main, flex: 1, fontWeight: '500' }}>
                              Штрафы
                            </Body>
                            <Body size="small" style={{ color: tokens.colors.error.main, fontWeight: '700' }}>
                              {formatRUB(totalPenalties)}
                            </Body>
                          </View>
                        )}
                      </View>

                      {/* Кнопка раскрытия */}
                      <Button
                        mode="text"
                        onPress={() =>
                          setExpandedPeriods((prev) => ({ ...prev, [period.key]: !isExpanded }))
                        }
                        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                        contentStyle={{ flexDirection: 'row-reverse' }}
                      >
                        {isExpanded ? 'Скрыть' : 'Подробнее'}
                      </Button>

                      {/* Список смен */}
                      {isExpanded && (
                        <View style={{ gap: 10, marginTop: 8 }}>
                          {period.shifts
                            .sort((a, b) => b.shiftDate.getTime() - a.shiftDate.getTime())
                            .map((shift) => {
                              const baseEarnings = shift.hoursWorked * shift.baseRate;
                              const overtimeEarnings = shift.overtimeHours * shift.overtimeRate;
                              
                              return (
                                <View
                                  key={shift.shiftId}
                                  style={{
                                    backgroundColor: shift.penalties < 0 ? tokens.colors.warning.lighter : tokens.colors.gray[50],
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: shift.penalties < 0 ? tokens.colors.warning.light : tokens.colors.border,
                                    overflow: 'hidden',
                                  }}
                                >
                                  {/* Шапка смены */}
                                  <View
                                    style={{
                                      backgroundColor: shift.penalties < 0 ? tokens.colors.warning.light : tokens.colors.gray[100],
                                      padding: 10,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                      <MaterialCommunityIcons
                                        name="calendar"
                                        size={16}
                                        color={shift.penalties < 0 ? tokens.colors.warning.dark : tokens.colors.text.secondary}
                                      />
                                      <Text
                                        style={{
                                          fontSize: 14,
                                          fontWeight: '600',
                                          color: shift.penalties < 0 ? tokens.colors.warning.dark : tokens.colors.text.primary,
                                        }}
                                      >
                                        {shift.shiftDate.toLocaleDateString('ru-RU', {
                                          day: 'numeric',
                                          month: 'short',
                                        })}{' '}
                                        ({weekdayShort(shift.shiftDate)})
                                      </Text>
                                      {shift.penalties < 0 && (
                                        <View
                                          style={{
                                            backgroundColor: tokens.colors.warning.main,
                                            paddingHorizontal: 6,
                                            paddingVertical: 2,
                                            borderRadius: 6,
                                          }}
                                        >
                                          <Text
                                            style={{
                                              fontSize: 10,
                                              fontWeight: '600',
                                              color: tokens.colors.warning.dark,
                                            }}
                                          >
                                            Штраф
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                    <Text
                                      style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: shift.penalties < 0 ? tokens.colors.warning.main : theme.colors.primary,
                                      }}
                                    >
                                      {formatRUB(shift.totalAmount)}
                                    </Text>
                                  </View>

                                  {/* Детали смены */}
                                  <View style={{ padding: 10, gap: 8 }}>
                                    {/* ПВЗ */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                      <MaterialCommunityIcons
                                        name="map-marker"
                                        size={14}
                                        color={tokens.colors.text.muted}
                                      />
                                      <Text style={{ fontSize: 12, color: tokens.colors.text.secondary, flex: 1 }}>
                                        {shift.pvzAddress}
                                      </Text>
                                    </View>

                                    {/* Разбивка начислений */}
                                    <View
                                      style={{
                                        backgroundColor: '#FFF',
                                        borderRadius: 6,
                                        padding: 8,
                                        gap: 6,
                                      }}
                                    >
                                      {/* База */}
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                          <MaterialCommunityIcons
                                            name="clock-check-outline"
                                            size={12}
                                            color={tokens.colors.success.main}
                                          />
                                          <Text style={{ fontSize: 12, color: tokens.colors.text.secondary }}>
                                            Основные часы ({shift.hoursWorked} ч)
                                          </Text>
                                        </View>
                                        <Text style={{ fontSize: 12, color: tokens.colors.text.primary, fontWeight: '500' }}>
                                          {formatRUB(baseEarnings)}
                                        </Text>
                                      </View>

                                      {/* Переработка */}
                                      {shift.overtimeHours > 0 && (
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <View
                                            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                                          >
                                            <MaterialCommunityIcons
                                              name="clock-plus-outline"
                                              size={12}
                                              color={tokens.colors.primary.main}
                                            />
                                            <Text style={{ fontSize: 12, color: tokens.colors.text.secondary }}>
                                              Переработка ({shift.overtimeHours} ч)
                                            </Text>
                                          </View>
                                          <Text
                                            style={{ fontSize: 12, color: tokens.colors.primary.main, fontWeight: '500' }}
                                          >
                                            +{formatRUB(overtimeEarnings)}
                                          </Text>
                                        </View>
                                      )}

                                      {/* Премии */}
                                      {shift.bonuses > 0 && (
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <View
                                            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                                          >
                                            <MaterialCommunityIcons
                                              name="star-circle"
                                              size={12}
                                              color={tokens.colors.success.main}
                                            />
                                            <Text style={{ fontSize: 12, color: tokens.colors.text.secondary }}>Премия</Text>
                                          </View>
                                          <Text
                                            style={{ fontSize: 12, color: tokens.colors.success.main, fontWeight: '500' }}
                                          >
                                            +{formatRUB(shift.bonuses)}
                                          </Text>
                                        </View>
                                      )}

                                      {/* Штрафы */}
                                      {shift.penalties < 0 && (
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: tokens.colors.error.light,
                                            padding: 6,
                                            borderRadius: 4,
                                            marginTop: 2,
                                          }}
                                        >
                                          <View
                                            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                                          >
                                            <MaterialCommunityIcons
                                              name="alert-circle"
                                              size={12}
                                              color={tokens.colors.error.main}
                                            />
                                            <Text
                                              style={{ fontSize: 12, color: tokens.colors.error.main, fontWeight: '500' }}
                                            >
                                              Штраф
                                            </Text>
                                          </View>
                                          <Text
                                            style={{ fontSize: 12, color: tokens.colors.error.main, fontWeight: '600' }}
                                          >
                                            {formatRUB(shift.penalties)}
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                </View>
                              );
                            })}
                        </View>
                      )}
                    </View>
                  </Card>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
