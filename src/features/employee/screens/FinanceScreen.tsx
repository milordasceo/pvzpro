import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react-native';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useShiftStore } from '../model/shift.store';
import { useFinanceStore } from '../model/finance.store';
import Animated, { FadeInDown, FadeIn, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { FinanceOperation, PayoutPeriod } from '../../../shared/types/finance';

// ================================
// ТИПЫ
// ================================

interface DayGroup {
  date: string;
  operations: FinanceOperation[];
  totalAmount: number;
  hasShift: boolean;
  hasBonuses: boolean;
  hasPenalties: boolean;
}

// ================================
// ФОРМАТИРОВАНИЕ
// ================================

const formatMoney = (amount: number, showSign = true): string => {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('ru-RU');
  if (!showSign) return `${formatted} ₽`;
  const sign = amount < 0 ? '−' : amount > 0 ? '+' : '';
  return `${sign}${formatted} ₽`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return `${day} ${months[date.getMonth()]}`;
};

const formatDayWithWeekday = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return `${weekdays[date.getDay()]}, ${day} ${months[date.getMonth()]}`;
};

const formatFullDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// ================================
// ГРУППИРОВКА ОПЕРАЦИЙ ПО ДАТАМ
// ================================

const groupOperationsByDate = (operations: FinanceOperation[]): DayGroup[] => {
  const groups: Record<string, DayGroup> = {};

  operations.forEach(op => {
    if (!groups[op.date]) {
      groups[op.date] = {
        date: op.date,
        operations: [],
        totalAmount: 0,
        hasShift: false,
        hasBonuses: false,
        hasPenalties: false,
      };
    }

    groups[op.date].operations.push(op);
    groups[op.date].totalAmount += op.amount;

    if (op.type === 'shift' || op.type === 'overtime') {
      groups[op.date].hasShift = true;
    }
    if (op.type === 'bonus') {
      groups[op.date].hasBonuses = true;
    }
    if (op.type === 'penalty') {
      groups[op.date].hasPenalties = true;
    }
  });

  // Сортировка по дате (новые сверху)
  return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
};

// ================================
// КОМПОНЕНТЫ
// ================================

interface CurrentPeriodCardProps {
  period: PayoutPeriod;
  themeColor: string;
}

const CurrentPeriodCard = ({ period, themeColor }: CurrentPeriodCardProps) => {
  const expectedDate = period.expectedPayoutDate
    ? formatFullDate(period.expectedPayoutDate)
    : 'Скоро';

  return (
    <View style={styles.mainCard}>
      {/* Заголовок */}
      <View style={styles.mainCardHeader}>
        <View style={[styles.mainCardIcon, { backgroundColor: `${themeColor}15` }]}>
          <Wallet size={24} color={themeColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.mainCardLabel}>К выплате</Text>
          <Text style={styles.mainCardPeriod}>Период: {period.label}</Text>
        </View>
      </View>

      {/* Сумма */}
      <Text style={[styles.mainCardAmount, period.grandTotal < 0 && { color: theme.colors.danger }]}>
        {period.grandTotal.toLocaleString('ru-RU')} ₽
      </Text>

      {/* Разбивка */}
      <View style={styles.breakdown}>
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <Clock size={14} color={theme.colors.text.muted} />
            <Text style={styles.breakdownLabel}>Смен</Text>
            <Text style={styles.breakdownValue}>{period.shiftsCount}</Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownItem}>
            <TrendingUp size={14} color={theme.colors.success} />
            <Text style={styles.breakdownLabel}>Бонусы</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.success }]}>
              {period.bonusesTotal > 0 ? `+${period.bonusesTotal.toLocaleString('ru-RU')}` : '0'} ₽
            </Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownItem}>
            <TrendingDown size={14} color={period.penaltiesTotal < 0 ? theme.colors.danger : theme.colors.text.muted} />
            <Text style={styles.breakdownLabel}>Штрафы</Text>
            <Text style={[styles.breakdownValue, period.penaltiesTotal < 0 && { color: theme.colors.danger }]}>
              {period.penaltiesTotal < 0 ? `${period.penaltiesTotal.toLocaleString('ru-RU')}` : '0'} ₽
            </Text>
          </View>
        </View>
      </View>

      {/* Дата выплаты */}
      <View style={styles.payoutInfo}>
        <Calendar size={14} color={theme.colors.text.muted} />
        <Text style={styles.payoutText}>Ожидаемая выплата: ~ {expectedDate}</Text>
      </View>
    </View>
  );
};

interface DayGroupItemProps {
  group: DayGroup;
  themeColor: string;
  isLast: boolean;
}

const DayGroupItem = ({ group, themeColor, isLast }: DayGroupItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPositive = group.totalAmount >= 0;

  // Есть ли аномалии (бонусы или штрафы)?
  const hasAnomalies = group.hasBonuses || group.hasPenalties;

  // Определяем основную иконку и цвет
  let IconComponent = Clock;
  let iconColor = themeColor;

  // Если есть аномалии, меняем цвет иконки
  if (group.hasPenalties) {
    iconColor = theme.colors.warning;
  } else if (group.hasBonuses && !group.hasShift) {
    IconComponent = Award;
    iconColor = theme.colors.success;
  }

  // Формируем краткое описание
  const shiftOps = group.operations.filter(op => op.type === 'shift');
  const bonusOps = group.operations.filter(op => op.type === 'bonus');
  const penaltyOps = group.operations.filter(op => op.type === 'penalty');

  let shortDescription = '';
  if (shiftOps.length > 0) {
    const hours = shiftOps.reduce((sum, op) => sum + (op.hoursWorked || 0), 0);
    shortDescription = `Смена ${hours}ч`;
    if (hasAnomalies) {
      const parts = [];
      if (bonusOps.length > 0) parts.push(`+${bonusOps.length} бонус`);
      if (penaltyOps.length > 0) parts.push(`${penaltyOps.length} штраф`);
      shortDescription += ` • ${parts.join(', ')}`;
    }
  } else if (bonusOps.length > 0) {
    shortDescription = bonusOps[0].description;
  } else if (penaltyOps.length > 0) {
    shortDescription = penaltyOps[0].description;
  }

  const handlePress = () => {
    if (hasAnomalies) {
      setIsExpanded(!isExpanded);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={[styles.dayGroupWrapper, !isLast && styles.dayGroupWrapperBorder]}>
      <TouchableOpacity
        activeOpacity={hasAnomalies ? 0.7 : 1}
        onPress={handlePress}
        style={styles.dayGroupItem}
      >
        <View style={[styles.dayGroupIcon, { backgroundColor: `${iconColor}15` }]}>
          <IconComponent size={18} color={iconColor} />
        </View>
        <View style={styles.dayGroupContent}>
          <Text style={styles.dayGroupDate}>{formatDayWithWeekday(group.date)}</Text>
          <Text style={styles.dayGroupDescription} numberOfLines={1}>
            {shortDescription}
          </Text>
        </View>
        <View style={styles.dayGroupRight}>
          <Text style={[
            styles.dayGroupAmount,
            { color: isPositive ? theme.colors.success : theme.colors.danger }
          ]}>
            {formatMoney(group.totalAmount)}
          </Text>
          {hasAnomalies && (
            <View style={styles.expandIcon}>
              {isExpanded ? (
                <ChevronUp size={16} color={theme.colors.text.muted} />
              ) : (
                <ChevronDown size={16} color={theme.colors.text.muted} />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Развёрнутые детали */}
      {isExpanded && hasAnomalies && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={styles.dayGroupDetails}
        >
          {group.operations.map((op, idx) => {
            const opColor = op.type === 'bonus'
              ? theme.colors.success
              : op.type === 'penalty'
                ? theme.colors.danger
                : themeColor;
            const OpIcon = op.type === 'bonus'
              ? Award
              : op.type === 'penalty'
                ? AlertTriangle
                : Clock;

            return (
              <View
                key={op.id}
                style={[
                  styles.detailRow,
                  idx < group.operations.length - 1 && styles.detailRowBorder
                ]}
              >
                <View style={[styles.detailIcon, { backgroundColor: `${opColor}10` }]}>
                  <OpIcon size={14} color={opColor} />
                </View>
                <Text style={styles.detailText} numberOfLines={1}>
                  {op.description}
                </Text>
                <Text style={[
                  styles.detailAmount,
                  { color: op.amount >= 0 ? theme.colors.success : theme.colors.danger }
                ]}>
                  {formatMoney(op.amount)}
                </Text>
              </View>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
};

interface PayoutHistoryItemProps {
  period: PayoutPeriod;
  themeColor: string;
  isLast: boolean;
}

const PayoutHistoryItem = ({ period, themeColor, isLast }: PayoutHistoryItemProps) => {
  const paidDate = period.paidAt ? formatFullDate(period.paidAt) : '';

  return (
    <View style={[styles.historyItem, !isLast && styles.historyItemBorder]}>
      <View style={styles.historyIcon}>
        <CheckCircle2 size={20} color={theme.colors.success} />
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.historyDate}>{paidDate}</Text>
        <Text style={styles.historyPeriod}>Период: {period.label}</Text>
      </View>
      <Text style={styles.historyAmount}>
        {period.grandTotal.toLocaleString('ru-RU')} ₽
      </Text>
    </View>
  );
};

// ================================
// MAIN COMPONENT
// ================================

export const FinanceScreen = () => {
  const { pvz } = useShiftStore();
  const {
    operations,
    currentPeriod,
    payoutHistory,
    totalEarnedAllTime,
    totalEarnedThisMonth,
    averageMonthly,
    currentHourlyRate,
    isLoading,
    loadFinanceData,
  } = useFinanceStore();

  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  const [showAllDays, setShowAllDays] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    loadFinanceData();
  }, []);

  // Группировка операций по датам
  const dayGroups = useMemo(() => {
    return groupOperationsByDate(operations);
  }, [operations]);

  // Отображаемые дни (первые 5 или все)
  const displayedDays = useMemo(() => {
    return showAllDays ? dayGroups : dayGroups.slice(0, 5);
  }, [dayGroups, showAllDays]);

  // Отображаемая история (первые 3 или все)
  const displayedHistory = useMemo(() => {
    return showAllHistory ? payoutHistory : payoutHistory.slice(0, 3);
  }, [payoutHistory, showAllHistory]);

  const handleToggleDays = () => {
    setShowAllDays(!showAllDays);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleToggleHistory = () => {
    setShowAllHistory(!showAllHistory);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (isLoading || !currentPeriod) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Загрузка...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Финансы</Text>
              <Text style={styles.headerSubtitle}>Учёт заработка</Text>
            </View>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={[styles.infoButton, { backgroundColor: `${currentTheme.primary}15` }]}
            >
              <Info size={20} color={currentTheme.primary} />
            </TouchableOpacity>
          </View>

          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Main Card - К выплате */}
            <CurrentPeriodCard period={currentPeriod} themeColor={currentTheme.primary} />

            {/* Статистика */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Всего заработано</Text>
                <Text style={styles.statValue}>{totalEarnedAllTime.toLocaleString('ru-RU')} ₽</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Этот месяц</Text>
                <Text style={styles.statValue}>{totalEarnedThisMonth.toLocaleString('ru-RU')} ₽</Text>
              </View>
            </View>

            {/* Детализация периода - сгруппировано по дням */}
            <Animated.View layout={Layout.springify()} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Детализация периода</Text>
                <Text style={styles.sectionSubtitle}>{dayGroups.length} дней</Text>
              </View>

              <View style={styles.dayGroupsList}>
                {displayedDays.map((group, idx) => (
                  <Animated.View key={group.date} entering={FadeIn.delay(idx * 50)}>
                    <DayGroupItem
                      group={group}
                      themeColor={currentTheme.primary}
                      isLast={idx === displayedDays.length - 1}
                    />
                  </Animated.View>
                ))}
              </View>

              {dayGroups.length > 5 && (
                <TouchableOpacity
                  onPress={handleToggleDays}
                  style={styles.showMoreButton}
                  activeOpacity={0.7}
                >
                  {showAllDays ? (
                    <ChevronUp size={18} color={theme.colors.text.muted} />
                  ) : (
                    <ChevronDown size={18} color={theme.colors.text.muted} />
                  )}
                  <Text style={styles.showMoreText}>
                    {showAllDays ? 'Свернуть' : `Показать ещё ${dayGroups.length - 5}`}
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* История выплат */}
            <Animated.View layout={Layout.springify()} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>История выплат</Text>
              </View>

              <View style={styles.historyList}>
                {displayedHistory.map((period, idx) => (
                  <Animated.View key={period.id} entering={FadeIn.delay(idx * 50)}>
                    <PayoutHistoryItem
                      period={period}
                      themeColor={currentTheme.primary}
                      isLast={idx === displayedHistory.length - 1}
                    />
                  </Animated.View>
                ))}
              </View>

              {payoutHistory.length > 3 && (
                <TouchableOpacity
                  onPress={handleToggleHistory}
                  style={styles.showMoreButton}
                  activeOpacity={0.7}
                >
                  {showAllHistory ? (
                    <ChevronUp size={18} color={theme.colors.text.muted} />
                  ) : (
                    <ChevronDown size={18} color={theme.colors.text.muted} />
                  )}
                  <Text style={styles.showMoreText}>
                    {showAllHistory ? 'Свернуть' : `Показать ещё ${payoutHistory.length - 3}`}
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* Примечание */}
            <View style={styles.noteCard}>
              <Info size={16} color={theme.colors.text.muted} />
              <Text style={styles.noteText}>
                Данные носят информационный характер. Фактические выплаты осуществляются работодателем вне приложения.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ================================
// STYLES
// ================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...theme.typography.presets.body,
    color: theme.colors.text.muted,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  headerTitle: {
    ...theme.typography.presets.h1,
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main Card
  mainCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.md,
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  mainCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCardLabel: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.secondary,
  },
  mainCardPeriod: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  mainCardAmount: {
    ...theme.typography.presets.h1,
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },

  // Breakdown
  breakdown: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  breakdownDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border.light,
  },
  breakdownLabel: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    fontSize: 10,
  },
  breakdownValue: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },

  // Payout Info
  payoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payoutText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 14,
  },
  statLabel: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    fontSize: 10,
    marginBottom: 4,
  },
  statValue: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },

  // Section
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...theme.typography.presets.label,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  sectionSubtitle: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },

  // Day Groups List
  dayGroupsList: {},
  dayGroupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  dayGroupItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  dayGroupWrapper: {
    marginBottom: 8,
  },
  dayGroupWrapperBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    paddingBottom: 8,
  },
  dayGroupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 12,
  },
  dayGroupIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayGroupContent: {
    flex: 1,
  },
  dayGroupDate: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  dayGroupDescription: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.secondary,
    textTransform: 'none',
  },
  dayGroupRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  expandIcon: {
    marginTop: 2,
  },
  dayGroupAmount: {
    ...theme.typography.presets.body,
    fontWeight: '700',
  },

  // Accordion Details
  dayGroupDetails: {
    marginTop: 8,
    marginLeft: 48, // Indent to align with content
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  detailIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
    ...theme.typography.presets.caption,
    color: theme.colors.text.secondary,
    textTransform: 'none',
    fontSize: 12,
  },
  detailAmount: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '600',
  },

  // History List
  historyList: {},
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  historyIcon: {
    opacity: 0.7,
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  historyPeriod: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },
  historyAmount: {
    ...theme.typography.presets.body,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },

  // Show More Button
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  showMoreText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },

  // Note Card
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },
  noteText: {
    flex: 1,
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    lineHeight: 18,
  },
});
