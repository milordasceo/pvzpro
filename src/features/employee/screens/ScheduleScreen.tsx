import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet, Dimensions, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  X,
  AlertCircle,
  Plus,
  Send,
} from 'lucide-react-native';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useShiftStore } from '../model/shift.store';
import { useScheduleStore } from '../model/schedule.store';
import Animated, { FadeInDown, FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const CANCEL_REASONS = [
  { id: 'sick', label: 'Болезнь' },
  { id: 'family', label: 'Семейные обстоятельства' },
  { id: 'personal', label: 'Личные причины' },
  { id: 'other', label: 'Другое' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_SIZE = (SCREEN_WIDTH - 48 - 24) / 7; // padding + gaps

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const ScheduleScreen = () => {
  const { pvz } = useShiftStore();
  const { shifts } = useScheduleStore();
  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Request modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [pendingCancellations, setPendingCancellations] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const today = new Date().toISOString().split('T')[0];

  // Get current week days
  const currentWeekDays = useMemo(() => {
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(todayDate);
    monday.setDate(todayDate.getDate() + mondayOffset);

    const weekDays: { date: Date; dateStr: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push({
        date: d,
        dateStr: d.toISOString().split('T')[0]
      });
    }
    return weekDays;
  }, []);

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [month, year]);
  const firstDayOfMonth = useMemo(() => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }, [month, year]);

  // Stats
  const monthStats = useMemo(() => {
    const monthShifts = shifts.filter(s => {
      const [y, m] = s.date.split('-').map(Number);
      return y === year && m === month + 1;
    });
    const totalHours = monthShifts.reduce((acc, s) => {
      const start = parseInt(s.startTime.split(':')[0]);
      const end = parseInt(s.endTime.split(':')[0]);
      return acc + (end - start);
    }, 0);
    const futureShifts = monthShifts.filter(s => s.date >= today).length;
    return { totalHours, futureShifts, totalShifts: monthShifts.length };
  }, [shifts, month, year, today]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDayPress = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCancelShift = () => {
    // Check if shift is within 24 hours
    const shiftDate = new Date(selectedDate);
    const now = new Date();
    const hoursUntilShift = (shiftDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilShift < 24) {
      Alert.alert(
        '⚠️ Внимание',
        `До начала смены осталось менее 24 часов.\n\nОтмена в последний момент может повлечь штрафные санкции. Рекомендуем связаться с менеджером напрямую.`,
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Всё равно отменить',
            style: 'destructive',
            onPress: () => {
              setShowCancelModal(true);
              setSelectedReason(null);
            }
          },
        ]
      );
    } else {
      setShowCancelModal(true);
      setSelectedReason(null);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const submitCancelRequest = () => {
    if (!selectedReason) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPendingCancellations(prev => [...prev, selectedDate]);
    setShowCancelModal(false);
    setSelectedReason(null);

    Alert.alert(
      'Запрос отправлен',
      'Менеджер рассмотрит вашу заявку и уведомит о решении.',
      [{ text: 'OK' }]
    );
  };

  const handleRequestShift = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Запрос на смену',
      `Вы хотите запросить смену на ${formatShiftDate(selectedDate)}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Запросить',
          onPress: () => {
            setPendingRequests(prev => [...prev, selectedDate]);
            Alert.alert('Отправлено', 'Запрос на дополнительную смену отправлен менеджеру.');
          }
        },
      ]
    );
  };

  const isPendingCancellation = (dateStr: string) => pendingCancellations.includes(dateStr);
  const isPendingRequest = (dateStr: string) => pendingRequests.includes(dateStr);

  const revokeCancellation = (dateStr: string) => {
    Alert.alert(
      'Отозвать заявку',
      'Вы хотите отменить запрос на отмену смены?',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да, отозвать',
          onPress: () => {
            setPendingCancellations(prev => prev.filter(d => d !== dateStr));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      ]
    );
  };

  const revokeRequest = (dateStr: string) => {
    Alert.alert(
      'Отозвать заявку',
      'Вы хотите отменить запрос на смену?',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да, отозвать',
          onPress: () => {
            setPendingRequests(prev => prev.filter(d => d !== dateStr));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      ]
    );
  };

  const selectedShift = useMemo(() =>
    shifts.find(s => s.date === selectedDate),
    [shifts, selectedDate]
  );

  // Upcoming shifts (next 3)
  const upcomingShifts = useMemo(() =>
    shifts
      .filter(s => s.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3),
    [shifts, today]
  );

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const renderDay = (day: number | null, index: number) => {
    if (day === null) return <View key={`empty-${index}`} style={styles.dayEmpty} />;

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateStr === today;
    const isPast = dateStr < today;
    const isSelected = selectedDate === dateStr;
    const hasShift = shifts.some(s => s.date === dateStr);
    const isPastShift = hasShift && isPast;

    return (
      <TouchableOpacity
        key={dateStr}
        onPress={() => handleDayPress(day)}
        activeOpacity={0.7}
        style={[
          styles.dayContainer,
          hasShift && !isPast && { backgroundColor: `${currentTheme.primary}20` },
          isPastShift && { backgroundColor: `${theme.colors.success}20` },
          isSelected && { borderWidth: 2, borderColor: isToday ? currentTheme.primary : theme.colors.text.secondary },
        ]}
      >
        <Text style={[
          styles.dayText,
          isPast && !hasShift && { color: theme.colors.text.muted },
          (hasShift && !isPast) && { color: currentTheme.primary, fontWeight: '600' },
          isPastShift && { color: theme.colors.success, fontWeight: '600' },
          isToday && !hasShift && { color: currentTheme.primary, fontWeight: '700' },
        ]}>
          {day}
        </Text>
        {isToday && (
          <View style={[
            styles.todayDot,
            { backgroundColor: currentTheme.primary }
          ]} />
        )}
      </TouchableOpacity>
    );
  };

  const formatShiftDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
    const day = date.getDate();
    const monthName = MONTHS[date.getMonth()].slice(0, 3).toLowerCase();
    return `${dayOfWeek}, ${day} ${monthName}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>График</Text>
            <View style={styles.statsRow}>
              <View style={[styles.statBadge, { backgroundColor: `${theme.colors.success}15` }]}>
                <Text style={[styles.statText, { color: theme.colors.success }]}>
                  {monthStats.totalHours}ч отработано
                </Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: `${currentTheme.primary}15` }]}>
                <Text style={[styles.statText, { color: currentTheme.primary }]}>
                  {monthStats.futureShifts} впереди
                </Text>
              </View>
            </View>
          </View>

          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Calendar Card */}
            <Animated.View layout={Layout.springify()} style={styles.calendarCard}>
              {/* Week or Month Navigation */}
              {isExpanded ? (
                <View style={styles.monthNav}>
                  <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                    <ChevronLeft size={20} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentDate(new Date());
                      setSelectedDate(today);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                  >
                    <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                    <ChevronRight size={20} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.weekHeader}>
                  <Text style={styles.weekHeaderText}>Эта неделя</Text>
                </View>
              )}

              {/* Weekday Headers */}
              <View style={styles.weekDays}>
                {DAYS.map((day, i) => (
                  <Text
                    key={day}
                    style={[
                      styles.weekDayText,
                      (i === 5 || i === 6) && { color: theme.colors.text.muted }
                    ]}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid - Week or Month */}
              {isExpanded ? (
                <View style={styles.calendarGrid}>
                  {calendarDays.map((day, i) => renderDay(day, i))}
                </View>
              ) : (
                <View style={styles.weekGrid}>
                  {currentWeekDays.map((weekDay) => {
                    const day = weekDay.date.getDate();
                    const dateStr = weekDay.dateStr;
                    const isToday = dateStr === today;
                    const hasShift = shifts.some(s => s.date === dateStr);
                    const isPast = dateStr < today;
                    const isPastShift = hasShift && isPast;
                    const isSelected = selectedDate === dateStr;

                    return (
                      <TouchableOpacity
                        key={dateStr}
                        onPress={() => {
                          setSelectedDate(dateStr);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        activeOpacity={0.7}
                        style={[
                          styles.dayContainer,
                          hasShift && !isPast && { backgroundColor: `${currentTheme.primary}20` },
                          isPastShift && { backgroundColor: `${theme.colors.success}20` },
                          isSelected && { borderWidth: 2, borderColor: isToday ? currentTheme.primary : theme.colors.text.secondary },
                        ]}
                      >
                        <Text style={[
                          styles.dayText,
                          isPast && !hasShift && { color: theme.colors.text.muted },
                          hasShift && !isPast && { color: currentTheme.primary, fontWeight: '600' },
                          isPastShift && { color: theme.colors.success, fontWeight: '600' },
                          isToday && !hasShift && { color: currentTheme.primary, fontWeight: '700' },
                        ]}>
                          {day}
                        </Text>
                        {isToday && (
                          <View style={[
                            styles.todayDot,
                            { backgroundColor: currentTheme.primary }
                          ]} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Expand/Collapse Button */}
              <TouchableOpacity
                onPress={() => {
                  setIsExpanded(!isExpanded);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={styles.expandButton}
              >
                {isExpanded ? (
                  <ChevronUp size={20} color={theme.colors.text.muted} />
                ) : (
                  <ChevronDown size={20} color={theme.colors.text.muted} />
                )}
                <Text style={styles.expandText}>
                  {isExpanded ? 'Свернуть' : 'Весь месяц'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Selected Day Details */}
            {selectedShift && selectedDate >= today ? (
              isPendingCancellation(selectedDate) ? (
                // Pending cancellation request card
                <View style={[styles.detailsCard, styles.pendingCard, { borderColor: theme.colors.warning }]}>
                  <View style={styles.requestHeader}>
                    <View style={[styles.requestIconBox, { backgroundColor: `${theme.colors.warning}15` }]}>
                      <AlertCircle size={24} color={theme.colors.warning} />
                    </View>
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestTitle}>Заявка на отмену смены</Text>
                      <Text style={styles.requestStatus}>Ожидает решения менеджера</Text>
                    </View>
                  </View>

                  <View style={styles.requestDetails}>
                    <View style={styles.requestRow}>
                      <Text style={styles.requestLabel}>Дата:</Text>
                      <Text style={styles.requestValue}>{formatShiftDate(selectedDate)}</Text>
                    </View>
                    <View style={styles.requestRow}>
                      <Text style={styles.requestLabel}>Время:</Text>
                      <Text style={[styles.requestValue, { textDecorationLine: 'line-through', color: theme.colors.text.muted }]}>
                        {selectedShift.startTime} — {selectedShift.endTime}
                      </Text>
                    </View>
                    <View style={styles.requestRow}>
                      <Text style={styles.requestLabel}>Адрес:</Text>
                      <Text style={styles.requestValue} numberOfLines={1}>{selectedShift.pvzAddress}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => revokeCancellation(selectedDate)}
                    style={styles.revokeButton}
                    activeOpacity={0.7}
                  >
                    <X size={16} color={theme.colors.danger} />
                    <Text style={styles.revokeButtonText}>Отозвать заявку</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Normal shift card
                <View style={styles.detailsCard}>
                  <View style={styles.detailsHeader}>
                    <View style={[styles.detailsIcon, { backgroundColor: `${currentTheme.primary}15` }]}>
                      <Clock size={20} color={currentTheme.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.detailsLabel}>
                        {selectedDate === today ? 'Сегодня' : formatShiftDate(selectedDate)}
                      </Text>
                      <Text style={styles.detailsTime}>
                        {selectedShift.startTime} — {selectedShift.endTime}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailsAddress}>
                    <MapPin size={14} color={theme.colors.text.muted} />
                    <Text style={styles.detailsAddressText}>{selectedShift.pvzAddress}</Text>
                  </View>

                  {selectedDate > today && (
                    <TouchableOpacity
                      onPress={handleCancelShift}
                      style={styles.cancelButton}
                      activeOpacity={0.7}
                    >
                      <X size={16} color={theme.colors.danger} />
                      <Text style={styles.cancelButtonText}>Отменить смену</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )
            ) : !selectedShift && selectedDate > today ? (
              isPendingRequest(selectedDate) ? (
                // Pending shift request card
                <View style={[styles.detailsCard, styles.pendingCard, { borderColor: currentTheme.primary }]}>
                  <View style={styles.requestHeader}>
                    <View style={[styles.requestIconBox, { backgroundColor: `${currentTheme.primary}15` }]}>
                      <Plus size={24} color={currentTheme.primary} />
                    </View>
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestTitle}>Заявка на смену</Text>
                      <Text style={[styles.requestStatus, { color: currentTheme.primary }]}>
                        Ожидает решения менеджера
                      </Text>
                    </View>
                  </View>

                  <View style={styles.requestDetails}>
                    <View style={styles.requestRow}>
                      <Text style={styles.requestLabel}>Дата:</Text>
                      <Text style={styles.requestValue}>{formatShiftDate(selectedDate)}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => revokeRequest(selectedDate)}
                    style={styles.revokeButton}
                    activeOpacity={0.7}
                  >
                    <X size={16} color={theme.colors.danger} />
                    <Text style={styles.revokeButtonText}>Отозвать заявку</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Empty day - offer to request shift
                <View style={styles.detailsCard}>
                  <View style={styles.emptyDay}>
                    <Text style={styles.emptyDayText}>Нет смены на {formatShiftDate(selectedDate)}</Text>
                    <TouchableOpacity
                      onPress={handleRequestShift}
                      style={[styles.requestButton, { backgroundColor: `${currentTheme.primary}15` }]}
                      activeOpacity={0.7}
                    >
                      <Plus size={16} color={currentTheme.primary} />
                      <Text style={[styles.requestButtonText, { color: currentTheme.primary }]}>
                        Запросить смену
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            ) : null}

            {/* Upcoming Shifts */}
            {upcomingShifts.length > 0 && (
              <View style={styles.upcomingSection}>
                <Text style={styles.sectionTitle}>Ближайшие смены</Text>
                {upcomingShifts.map((shift) => (
                  <TouchableOpacity
                    key={shift.date}
                    style={styles.upcomingCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedDate(shift.date);
                      const [y, m] = shift.date.split('-').map(Number);
                      if (m !== month + 1 || y !== year) {
                        setCurrentDate(new Date(y, m - 1, 1));
                      }
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View style={styles.upcomingDate}>
                      <Text style={styles.upcomingDay}>
                        {new Date(shift.date).getDate()}
                      </Text>
                      <Text style={styles.upcomingMonth}>
                        {MONTHS[new Date(shift.date).getMonth()].slice(0, 3)}
                      </Text>
                    </View>
                    <View style={styles.upcomingInfo}>
                      <Text style={styles.upcomingTime}>
                        {shift.startTime} — {shift.endTime}
                      </Text>
                      <Text style={styles.upcomingAddress} numberOfLines={1}>
                        {shift.pvzAddress}
                      </Text>
                    </View>
                    <View style={[styles.upcomingIndicator, { backgroundColor: currentTheme.primary }]} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Cancel Shift Modal */}
      <Modal
        visible={showCancelModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Отмена смены</Text>
              <TouchableOpacity
                onPress={() => setShowCancelModal(false)}
                style={styles.modalClose}
              >
                <X size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Вы отменяете смену на {formatShiftDate(selectedDate)}
            </Text>

            <Text style={styles.modalLabel}>Причина отмены:</Text>
            <View style={styles.reasonsContainer}>
              {CANCEL_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reasonButton,
                    selectedReason === reason.id && styles.reasonButtonActive,
                    selectedReason === reason.id && { borderColor: currentTheme.primary }
                  ]}
                  onPress={() => {
                    setSelectedReason(reason.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={[
                    styles.reasonText,
                    selectedReason === reason.id && { color: currentTheme.primary, fontWeight: '600' }
                  ]}>
                    {reason.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={submitCancelRequest}
              disabled={!selectedReason}
              style={[
                styles.submitButton,
                { backgroundColor: selectedReason ? currentTheme.primary : theme.colors.text.muted }
              ]}
            >
              <Send size={18} color={theme.colors.white} />
              <Text style={styles.submitButtonText}>Отправить запрос</Text>
            </TouchableOpacity>

            <Text style={styles.modalNote}>
              Запрос будет отправлен менеджеру. Вы получите уведомление о решении.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  headerTitle: {
    ...theme.typography.presets.h1,
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statText: {
    ...theme.typography.presets.caption,
    fontWeight: '500',
  },

  // Calendar
  calendarCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    width: 36, height: 36,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  monthTitle: {
    ...theme.typography.presets.body,
    fontWeight: '600',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    width: DAY_SIZE,
    textAlign: 'center',
    ...theme.typography.presets.caption,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  dayEmpty: {
    width: DAY_SIZE,
    height: DAY_SIZE,
  },
  dayContainer: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToday: {
    borderWidth: 2,
  },
  daySelected: {
    transform: [{ scale: 1.1 }],
  },
  dayText: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Week View
  weekHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  weekHeaderText: {
    ...theme.typography.presets.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  expandText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8, height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },

  // Details Card
  detailsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailsIcon: {
    width: 44, height: 44,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  detailsLabel: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },
  detailsTime: {
    ...theme.typography.presets.body,
    fontWeight: '600',
  },
  detailsSalary: {
    ...theme.typography.presets.body,
    fontWeight: '700',
    color: theme.colors.success,
  },
  detailsAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  detailsAddressText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.secondary,
    flex: 1,
  },

  // Upcoming
  upcomingSection: {
    marginTop: 8,
  },
  sectionTitle: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    marginBottom: 12,
    marginLeft: 4,
  },
  upcomingCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  upcomingDate: {
    width: 44,
    alignItems: 'center',
  },
  upcomingDay: {
    ...theme.typography.presets.h4,
    fontWeight: '700',
    lineHeight: 24,
  },
  upcomingMonth: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    textTransform: 'lowercase',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTime: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '500',
  },
  upcomingAddress: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  upcomingIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },

  // Request Card styles
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  requestIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    ...theme.typography.presets.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  requestStatus: {
    ...theme.typography.presets.caption,
    color: theme.colors.warning,
  },
  requestDetails: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  requestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestLabel: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
  },
  requestValue: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },

  // Cancel & Request buttons
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  cancelButtonText: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.danger,
    fontWeight: '500',
  },
  revokeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: `${theme.colors.danger}15`,
  },
  revokeButtonText: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.danger,
    fontWeight: '600',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
  },
  requestButtonText: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '600',
  },
  emptyDay: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyDayText: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.muted,
  },

  // Pending state
  pendingCard: {
    borderWidth: 1,
  },
  pendingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingBadgeText: {
    ...theme.typography.presets.caption,
    fontWeight: '600',
  },
  pendingRequestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    ...theme.typography.presets.h4,
  },
  modalClose: {
    padding: 4,
  },
  modalSubtitle: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.secondary,
    marginBottom: 20,
  },
  modalLabel: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    marginBottom: 12,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  reasonButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reasonButtonActive: {
    backgroundColor: theme.colors.white,
  },
  reasonText: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.secondary,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  submitButtonText: {
    ...theme.typography.presets.body,
    color: theme.colors.white,
    fontWeight: '600',
  },
  modalNote: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});
