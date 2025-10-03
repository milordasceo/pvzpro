import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, Divider, List } from 'react-native-paper';
import { StyledCard, MetaRow, StyledButton } from '../components';
import { financeService } from '../services';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth.store';
import { Payment, ShiftPayment } from '../types/finance';

export const FinanceCurrentPeriodScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [shifts, setShifts] = useState<ShiftPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [periodLabel, setPeriodLabel] = useState<string>('');
  const [summary, setSummary] = useState<{
    toPay: number;
    bonuses: number;
    penalties: number;
    shifts: number;
  }>({ toPay: 0, bonuses: 0, penalties: 0, shifts: 0 });
  const [disputedKeys, setDisputedKeys] = useState<Set<string>>(new Set());
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const formatRUB = (n: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(n);
  const weekdayShort = (d: Date) => ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d.getDay()];
  const ymd = (d: Date) => d.toISOString().slice(0, 10);
  const dayLabelFromCategory = (c?: string) => {
    switch (c) {
      case 'defect_50':
        return 'Штраф: Брак (50%)';
      case 'substitution_100':
        return 'Штраф: Подмена (100%)';
      case 'bad_rating':
        return 'Штраф: Плохая оценка';
      case 'stuck_100':
        return 'Штраф: Зависший товар (100%)';
      default:
        return 'Штраф';
    }
  };

  const loadData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const summaryData = await financeService.getFinancialSummary(user.id);
    const { startDate, endDate, toPay, bonuses, penalties, shiftsCount } =
      summaryData.currentPayoutPeriod;
    setSummary({ toPay, bonuses, penalties, shifts: shiftsCount });
    setPeriodLabel(
      `${startDate.toLocaleDateString('ru-RU')} — ${endDate.toLocaleDateString('ru-RU')}`,
    );
    const list = await financeService.getPayments(user.id, {
      dateRange: { start: startDate, end: endDate },
    });
    setPayments(list);
    const allShifts = await financeService.getShiftPayments(user.id);
    const periodShifts = allShifts.filter(
      (s) => s.shiftDate >= startDate && s.shiftDate <= endDate,
    );
    setShifts(periodShifts);
    const toPayCalc = periodShifts.reduce((s, x) => s + x.totalAmount, 0);
    const bonusesCalc = periodShifts.reduce((s, x) => s + x.bonuses, 0);
    const penaltiesCalc = periodShifts.reduce((s, x) => s + x.penalties, 0);
    setSummary({
      toPay: toPayCalc,
        bonuses: bonusesCalc,
        penalties: penaltiesCalc,
        shifts: periodShifts.length,
      });
      setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  type DayRow = { id: string; icon: string; label: string; amount: number };
  const days = useMemo(() => {
    const map = new Map<
      string,
      {
        date: Date;
        total: number;
        base: number;
        overtime: number;
        bonus: number;
        penalty: number;
        rows: DayRow[];
        pvzName?: string;
        pvzAddress?: string;
        penaltyDetails?: any[];
      }
    >();
    // Берём последние 8 смен по дате (новые сверху)
    const sorted = [...shifts]
      .sort((a, b) => b.shiftDate.getTime() - a.shiftDate.getTime())
      .slice(0, 8);
    sorted.forEach((shift) => {
      const key = shift.shiftDate.toISOString().slice(0, 10);
      const hours = shift.hoursWorked;
      const baseAmount = Math.round(shift.baseRate * hours);
      const overtimeAmount = Math.round(shift.overtimeHours * shift.overtimeRate);
      if (!map.has(key))
        map.set(key, {
          date: shift.shiftDate,
          total: 0,
          base: 0,
          overtime: 0,
          bonus: 0,
          penalty: 0,
          rows: [],
          pvzName: shift.pvzName,
          pvzAddress: shift.pvzAddress,
          penaltyDetails: shift.penaltyDetails,
        });
      const bucket = map.get(key)!;
      // Порядок: переработка, премия, штраф, база
      if (shift.overtimeHours > 0)
        bucket.rows.push({
          id: `${shift.shiftId}-ot`,
          icon: 'timer',
          label: `Переработка (${shift.overtimeHours} часа)`,
          amount: overtimeAmount,
        });
      if (shift.bonuses > 0)
        bucket.rows.push({
          id: `${shift.shiftId}-bn`,
          icon: 'gift',
          label: 'Премия',
          amount: shift.bonuses,
        });
      if (shift.penalties < 0)
        bucket.rows.push({
          id: `${shift.shiftId}-pn`,
          icon: 'alert',
          label: 'Штраф',
          amount: shift.penalties,
        });
      bucket.rows.push({
        id: `${shift.shiftId}-base`,
        icon: 'cash',
        label: 'Базовая ставка',
        amount: baseAmount,
      });
      bucket.base += baseAmount;
      bucket.overtime += overtimeAmount;
      bucket.bonus += shift.bonuses;
      bucket.penalty += shift.penalties;
      bucket.total += baseAmount + overtimeAmount + shift.bonuses + shift.penalties;
    });
    return Array.from(map.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [shifts]);

  // Вычисляем дополнительную статистику
  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const monthShifts = shifts.filter((s) => {
      const d = s.shiftDate;
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const totalEarned = monthShifts.reduce((s, x) => s + x.totalAmount, 0);
    const bonuses = monthShifts.reduce((s, x) => s + x.bonuses, 0);
    const penalties = monthShifts.reduce((s, x) => s + x.penalties, 0);
    return { totalEarned, bonuses, penalties, shiftsCount: monthShifts.length };
  }, [shifts]);

  const yearStats = useMemo(() => {
    const now = new Date();
    const yearShifts = shifts.filter((s) => s.shiftDate.getFullYear() === now.getFullYear());
    const totalEarned = yearShifts.reduce((s, x) => s + x.totalAmount, 0);
    const totalBonuses = yearShifts.reduce((s, x) => s + x.bonuses, 0);
    const totalPenalties = yearShifts.reduce((s, x) => s + x.penalties, 0);
    return { totalEarned, totalBonuses, totalPenalties };
  }, [shifts]);

  const getNextPaymentDate = () => {
    const now = new Date();
    const day = now.getDate();
    let nextDate: Date;
    if (day < 15) {
      nextDate = new Date(now.getFullYear(), now.getMonth(), 15);
    } else {
      nextDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    return nextDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={{ padding: 16, gap: 16 }}>
          {/* Компактные карточки статистики */}
          <View style={{ gap: 12 }}>
            {/* Текущий месяц */}
            <StyledCard>
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>Текущий месяц</Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '700',
                      color: theme.colors.primary,
                    }}
                  >
                    {formatRUB(currentMonthStats.totalEarned)}
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
                    Премии: {formatRUB(currentMonthStats.bonuses)}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                    Штрафы: {formatRUB(currentMonthStats.penalties)}
                  </Text>
                </View>
              </View>
            </StyledCard>

            {/* Следующая выплата */}
            <StyledCard>
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>Следующая выплата</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#111827',
                    }}
                  >
                    {getNextPaymentDate()}
                  </Text>
                </View>
              </View>
            </StyledCard>
          </View>

          {/* Плашка К выплате */}
          <StyledCard
            title="К выплате"
            right={
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: theme.colors.primary,
                  marginRight: 16,
                }}
              >
                {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0,
                }).format(summary.toPay)}
              </Text>
            }
          >
            <View style={{ gap: 8 }}>
              <MetaRow icon="calendar-range" label={`${periodLabel}`} subdued />
              <MetaRow
                icon="account-check-outline"
                label="Смен за период"
                rightValue={String(summary.shifts)}
              />
              <MetaRow
                icon="gift-outline"
                label="Премии"
                rightValue={new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0,
                }).format(summary.bonuses)}
                rightColor={theme.colors.primary}
              />
              <MetaRow
                icon="alert-outline"
                label="Штрафы"
                rightValue={new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0,
                }).format(summary.penalties)}
                rightColor="#EF4444"
              />
            </View>
          </StyledCard>

          {/* По дням */}
          {/* Вертикальный таймлайн: новые сверху */}
          <View style={{ position: 'relative' }}>
            <View
              style={{
                position: 'absolute',
                left: 12,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#E5E7EB',
              }}
            />
            <View>
              {days.map((day, index) => (
                <View
                  key={day.date.toISOString()}
                  style={{ flexDirection: 'row', marginBottom: 16 }}
                >
                  <View style={{ width: 24, alignItems: 'center' }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#4F46E5',
                        marginTop: 6,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <StyledCard>
                      <View style={{ gap: 8 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                            {day.date.toLocaleDateString('ru-RU')}
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#EEF2FF',
                              borderRadius: 12,
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                            }}
                          >
                            <Text style={{ color: '#4F46E5', fontSize: 12 }}>
                              {weekdayShort(day.date)}
                            </Text>
                          </View>
                        </View>
                        {day.pvzAddress ? (
                          <MetaRow icon="map-marker" label={day.pvzAddress} />
                        ) : null}

                        <Divider style={{ marginVertical: 6 }} />

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ color: '#6B7280' }}>Итого за смену</Text>
                          <Text
                            style={{
                              color: day.total >= 0 ? theme.colors.primary : '#EF4444',
                              fontWeight: '700',
                            }}
                          >
                            {formatRUB(day.total)}
                          </Text>
                        </View>

                        {/* Структурированный список */}
                        <View style={{ gap: 4, marginTop: 4 }}>
                          {day.base !== 0 && (
                            <MetaRow
                              icon="cash"
                              label={`Базовая ставка`}
                              rightValue={formatRUB(day.base)}
                              rightColor={theme.colors.primary}
                            />
                          )}
                          {day.overtime !== 0 && (
                            <MetaRow
                              icon="timer"
                              label={`Переработка`}
                              rightValue={formatRUB(day.overtime)}
                              rightColor={theme.colors.primary}
                            />
                          )}
                          {day.bonus !== 0 && (
                            <MetaRow
                              icon="gift"
                              label={`Премии`}
                              rightValue={formatRUB(day.bonus)}
                              rightColor={theme.colors.primary}
                            />
                          )}
                          {day.penalty !== 0 && (
                            <MetaRow
                              icon="alert"
                              label={`Штрафы`}
                              rightValue={formatRUB(day.penalty)}
                              rightColor="#EF4444"
                            />
                          )}
                        </View>

                        {/* Детали штрафов: сворачиваемый список */}
                        {(() => {
                          const penalties =
                            (day as any).penaltyDetails ??
                            payments.filter(
                              (p) => p.type === 'penalty' && ymd(p.date) === ymd(day.date),
                            );
                          if (!penalties || penalties.length === 0) return null;
                          const dayKey = ymd(day.date);
                          const expanded = expandedDays.has(dayKey);
                          return (
                            <View style={{ marginTop: 6 }}>
                              <List.Accordion
                                title={`Подробности штрафов (${penalties.length})`}
                                titleStyle={{ color: '#111827' }}
                                expanded={expanded}
                                onPress={() =>
                                  setExpandedDays((prev) => {
                                    const next = new Set(Array.from(prev));
                                    if (next.has(dayKey)) next.delete(dayKey);
                                    else next.add(dayKey);
                                    return next;
                                  })
                                }
                              >
                                {penalties.map((p: any, idx: number) => {
                                  const key = `${dayKey}:${p.category ?? p.penaltyCategory ?? 'x'}:${p.amount}:${idx}`;
                                  const disputed = disputedKeys.has(key);
                                  const base = p.description
                                    ? p.description
                                    : dayLabelFromCategory(p.category ?? p.penaltyCategory);
                                  const longText = `Удержание за ${base}${p.relatedItemPrice ? `; стоимость товара: ${formatRUB(p.relatedItemPrice)}` : ''}`;
                                  return (
                                    <View key={key} style={{ paddingVertical: 6 }}>
                                      <MetaRow
                                        icon="file-document"
                                        label={longText}
                                        rightValue={formatRUB(p.amount)}
                                        rightColor="#EF4444"
                                      />
                                      <StyledButton
                                        mode="contained"
                                        onPress={() =>
                                          setDisputedKeys((prev) => {
                                            const next = new Set(Array.from(prev));
                                            if (next.has(key)) next.delete(key);
                                            else next.add(key);
                                            return next;
                                          })
                                        }
                                        style={{ marginTop: 8 }}
                                        icon="comment-alert"
                                      >
                                        {disputed ? 'Оспаривается' : 'Оспорить'}
                                      </StyledButton>
                                      <Divider style={{ marginTop: 6 }} />
                                    </View>
                                  );
                                })}
                              </List.Accordion>
                            </View>
                          );
                        })()}
                      </View>
                    </StyledCard>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
