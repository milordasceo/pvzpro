import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyledCard, StyledButton, MetaRow } from '../components';
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 16, textAlign: 'center' }}>{error}</Text>
        <StyledButton mode="contained" onPress={loadData} style={{ marginTop: 16 }}>
          Повторить
        </StyledButton>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={{ padding: 16, gap: 16 }}>
          {/* Статистика за год */}
          <StyledCard title={`За ${new Date().getFullYear()} год`}>
            <View style={{ gap: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, color: '#6B7280' }}>Заработано</Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: theme.colors.primary,
                  }}
                >
                  {formatRUB(yearStats.totalEarned)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 4,
                }}
              >
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                  Премий: {formatRUB(yearStats.totalBonuses)}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                  Штрафов: {formatRUB(yearStats.totalPenalties)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 4 }}>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                  Смен отработано: {yearStats.shiftsCount}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                  Часов: {yearStats.totalHours}
                </Text>
              </View>
            </View>
          </StyledCard>

          {/* Список периодов */}
          <View style={{ gap: 12 }}>
            {periods.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 32 }}>
                <MaterialCommunityIcons name="cash-remove" size={48} color="#9CA3AF" />
                <Text style={{ marginTop: 16, color: '#9CA3AF', textAlign: 'center' }}>
                  Нет данных о сменах
                </Text>
              </View>
            ) : (
              periods.map((period) => {
                const totalEarned = period.shifts.reduce((s, x) => s + x.totalAmount, 0);
                const totalHours = period.shifts.reduce((s, x) => s + x.hoursWorked, 0);
                const totalPenalties = period.shifts.reduce((s, x) => s + x.penalties, 0);
                const isExpanded = expandedPeriods[period.key];

                return (
                  <StyledCard
                    key={period.key}
                    title={period.label}
                    titleStyle={{ fontSize: 15, color: '#4B5563', fontWeight: '600' }}
                    right={
                      period.isPaid ? (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color="#10B981"
                          style={{ marginRight: 12 }}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={20}
                          color="#F59E0B"
                          style={{ marginRight: 12 }}
                        />
                      )
                    }
                  >
                    <View style={{ gap: 12 }}>
                      {/* Статус */}
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        {period.isPaid
                          ? `Выплачено ${period.paymentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`
                          : `К выплате ${period.paymentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`}
                      </Text>

                      {/* Итого */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 14, color: '#111827' }}>
                          {period.isPaid ? 'Получено' : 'Заработано'}
                        </Text>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: theme.colors.primary,
                          }}
                        >
                          {formatRUB(totalEarned)}
                        </Text>
                      </View>

                      {/* Краткая инфо */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                          Смен: {period.shifts.length} • Часов: {totalHours}
                        </Text>
                        {totalPenalties !== 0 && (
                          <Text style={{ fontSize: 12, color: '#EF4444' }}>
                            Штрафы: {formatRUB(totalPenalties)}
                          </Text>
                        )}
                      </View>

                      {/* Кнопка раскрытия */}
                      <StyledButton
                        mode="text"
                        onPress={() =>
                          setExpandedPeriods((prev) => ({ ...prev, [period.key]: !isExpanded }))
                        }
                        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                        contentStyle={{ flexDirection: 'row-reverse' }}
                      >
                        {isExpanded ? 'Скрыть' : 'Подробнее'}
                      </StyledButton>

                      {/* Список смен */}
                      {isExpanded && (
                        <View style={{ gap: 8, marginTop: 8 }}>
                          {period.shifts
                            .sort((a, b) => b.shiftDate.getTime() - a.shiftDate.getTime())
                            .map((shift) => (
                              <View
                                key={shift.shiftId}
                                style={{
                                  padding: 12,
                                  backgroundColor: '#F9FAFB',
                                  borderRadius: 8,
                                  gap: 6,
                                }}
                              >
                                {/* Дата + сумма */}
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <MaterialCommunityIcons
                                      name="calendar"
                                      size={16}
                                      color="#6B7280"
                                    />
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                                      {shift.shiftDate.toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'short',
                                      })}{' '}
                                      ({weekdayShort(shift.shiftDate)})
                                    </Text>
                                    {shift.penalties < 0 && (
                                      <MaterialCommunityIcons name="alert" size={16} color="#EF4444" />
                                    )}
                                  </View>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      fontWeight: '700',
                                      color: theme.colors.primary,
                                    }}
                                  >
                                    {formatRUB(shift.totalAmount)}
                                  </Text>
                                </View>

                                {/* ПВЗ + часы */}
                                <View style={{ gap: 2 }}>
                                  <Text style={{ fontSize: 12, color: '#6B7280' }}>
                                    {shift.pvzAddress} • {shift.hoursWorked} часов
                                  </Text>
                                  {shift.penalties < 0 && (
                                    <Text style={{ fontSize: 12, color: '#EF4444' }}>
                                      Штраф: {formatRUB(shift.penalties)}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            ))}
                        </View>
                      )}
                    </View>
                  </StyledCard>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
