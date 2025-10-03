import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, Divider, List } from 'react-native-paper';
import { StyledCard, MetaRow, StyledButton } from '../components';
import { financeService } from '../services';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth.store';
import { Payment, ShiftPayment } from '../types/finance';
import { useNavigation } from '@react-navigation/native';

export const FinanceCurrentPeriodScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
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
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
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

                        {/* Детали штрафов: компактное отображение */}
                        {(() => {
                          const penalties = day.penaltyDetails;
                          if (!penalties || penalties.length === 0) return null;
                          const dayKey = ymd(day.date);
                          const expanded = expandedDays.has(dayKey);
                          
                          // Подсчёт оспариваемых штрафов
                          const disputedCount = penalties.filter((p: any, idx: number) => {
                            const key = `${dayKey}:${p.category ?? p.penaltyCategory ?? 'x'}:${p.amount}:${idx}`;
                            return disputedKeys.has(key);
                          }).length;
                          
                          // Функция для получения иконки и цвета по типу штрафа
                          const getPenaltyMeta = (category?: string) => {
                            switch (category) {
                              case 'substitution_100':
                                return { icon: 'swap-horizontal', color: '#DC2626', label: 'Критический' };
                              case 'stuck_100':
                                return { icon: 'package-variant-closed', color: '#DC2626', label: 'Критический' };
                              case 'defect_50':
                                return { icon: 'alert-circle', color: '#F59E0B', label: 'Серьёзный' };
                              case 'bad_rating':
                                return { icon: 'star-off', color: '#F59E0B', label: 'Средний' };
                              default:
                                return { icon: 'alert', color: '#EF4444', label: 'Средний' };
                            }
                          };
                          
                          return (
                            <View style={{ marginTop: 8 }}>
                              {/* Кнопка раскрытия с счётчиком */}
                              <StyledButton
                                mode="text"
                                onPress={() =>
                                  setExpandedDays((prev) => {
                                    const next = new Set(Array.from(prev));
                                    if (next.has(dayKey)) next.delete(dayKey);
                                    else next.add(dayKey);
                                    return next;
                                  })
                                }
                                icon={expanded ? 'chevron-up' : 'chevron-down'}
                                contentStyle={{ flexDirection: 'row-reverse' }}
                              >
                                {expanded ? 'Скрыть детали' : `Подробности (${penalties.length})`}
                                {disputedCount > 0 && !expanded && ` • ${disputedCount} оспаривается`}
                              </StyledButton>
                              
                              {/* Карточки штрафов */}
                              {expanded && (
                                <View style={{ gap: 8, marginTop: 4 }}>
                                  {penalties.map((p: any, idx: number) => {
                                    const key = `${dayKey}:${p.category ?? p.penaltyCategory ?? 'x'}:${p.amount}:${idx}`;
                                    const disputed = disputedKeys.has(key);
                                    const meta = getPenaltyMeta(p.category ?? p.penaltyCategory);
                                    
                                    return (
                                      <View
                                        key={key}
                                        style={{
                                          backgroundColor: disputed ? '#FFFBEB' : '#FFF',
                                          borderWidth: 1,
                                          borderColor: disputed ? '#FCD34D' : '#FEE2E2',
                                          borderRadius: 8,
                                          padding: 10,
                                          gap: 8,
                                        }}
                                      >
                                        {/* Заголовок */}
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                                            <MaterialCommunityIcons
                                              name={meta.icon as any}
                                              size={18}
                                              color={meta.color}
                                            />
                                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827', flex: 1 }}>
                                              {p.description || dayLabelFromCategory(p.category ?? p.penaltyCategory)}
                                            </Text>
                                          </View>
                                        </View>
                                        
                                        {/* Детали штрафа */}
                                        <View style={{ gap: 6 }}>
                                          {/* Название товара */}
                                          {p.itemName && (
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                                              <MaterialCommunityIcons name="package-variant" size={14} color="#6B7280" style={{ marginTop: 2 }} />
                                              <Text style={{ fontSize: 12, color: '#111827', flex: 1 }}>
                                                {p.itemName}
                                              </Text>
                                            </View>
                                          )}
                                          
                                          {/* Стоимость товара */}
                                          {p.relatedItemPrice && (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                              <MaterialCommunityIcons name="cash" size={14} color="#6B7280" />
                                              <Text style={{ fontSize: 11, color: '#6B7280' }}>
                                                Стоимость: {formatRUB(p.relatedItemPrice)}
                                              </Text>
                                            </View>
                                          )}
                                          
                                          {/* Комментарий администратора */}
                                          {p.adminComment && (
                                            <View
                                              style={{
                                                backgroundColor: '#FEF3C7',
                                                padding: 8,
                                                borderRadius: 6,
                                                borderLeftWidth: 3,
                                                borderLeftColor: '#F59E0B',
                                              }}
                                            >
                                              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                                                <MaterialCommunityIcons name="comment-text" size={14} color="#D97706" style={{ marginTop: 1 }} />
                                                <View style={{ flex: 1 }}>
                                                  <Text style={{ fontSize: 10, fontWeight: '600', color: '#92400E', marginBottom: 2 }}>
                                                    Комментарий администратора:
                                                  </Text>
                                                  <Text style={{ fontSize: 11, color: '#78350F', lineHeight: 16 }}>
                                                    {p.adminComment}
                                                  </Text>
                                                </View>
                                              </View>
                                            </View>
                                          )}
                                          
                                          {/* Статус оспаривания */}
                                          {disputed && (
                                            <View
                                              style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 6,
                                                backgroundColor: '#FCD34D',
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                borderRadius: 6,
                                                alignSelf: 'flex-start',
                                              }}
                                            >
                                              <MaterialCommunityIcons name="clock-outline" size={12} color="#78350F" />
                                              <Text style={{ fontSize: 11, fontWeight: '600', color: '#78350F' }}>
                                                На рассмотрении
                                              </Text>
                                            </View>
                                          )}
                                        </View>
                                        
                                        {/* Кнопка оспаривания */}
                                        <StyledButton
                                          mode={disputed ? 'outlined' : 'contained'}
                                          onPress={() => {
                                            if (disputed) {
                                              // Отменяем оспаривание
                                              setDisputedKeys((prev) => {
                                                const next = new Set(Array.from(prev));
                                                next.delete(key);
                                                return next;
                                              });
                                            } else {
                                              // Открываем чат с данными штрафа
                                              setDisputedKeys((prev) => new Set(prev).add(key));
                                              
                                              const penaltyDescription = p.description || dayLabelFromCategory(p.category ?? p.penaltyCategory);
                                              const dateFormatted = day.date.toLocaleDateString('ru-RU', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                              });
                                              
                                              // Навигация к чату через вложенные навигаторы
                                              navigation.getParent()?.navigate('Чат', {
                                                screen: 'Chat',
                                                params: {
                                                  chatId: 'admin-chat',
                                                  title: 'Чат с администратором',
                                                  initialMessage: `Хочу оспорить штраф от ${dateFormatted}`,
                                                  penaltyData: {
                                                    amount: p.amount,
                                                    description: penaltyDescription,
                                                    category: p.category ?? p.penaltyCategory ?? 'unknown',
                                                    color: meta.color,
                                                    date: dateFormatted,
                                                    relatedItemPrice: p.relatedItemPrice,
                                                    itemName: p.itemName,
                                                    adminComment: p.adminComment,
                                                  },
                                                },
                                              });
                                            }
                                          }}
                                          icon={disputed ? 'check-circle' : 'message-text-outline'}
                                          buttonColor={disputed ? undefined : '#3B82F6'}
                                          textColor={disputed ? '#78350F' : '#FFF'}
                                          compact
                                          style={{
                                            borderColor: disputed ? '#FCD34D' : undefined,
                                          }}
                                        >
                                          {disputed ? 'Отменить' : 'Обсудить'}
                                        </StyledButton>
                                      </View>
                                    );
                                  })}
                                </View>
                              )}
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
    </ScrollView>
  );
};
