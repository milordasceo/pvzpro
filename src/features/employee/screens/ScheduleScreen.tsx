import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  AlertCircle,
  Plus,
  Minus,
  X,
  Check
} from 'lucide-react-native';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useShiftStore } from '../model/shift.store';
import { useScheduleStore, ScheduleShift } from '../model/schedule.store';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { HoldToConfirm } from '../../../shared/ui/HoldToConfirm';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const ScheduleScreen = () => {
  const { pvz } = useShiftStore();
  const { 
    shifts, 
    pendingChanges, 
    isEditing, 
    setEditing, 
    toggleShift, 
    submitRequest 
  } = useScheduleStore();
  
  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [month, year]);
  const firstDayOfMonth = useMemo(() => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust to start from Monday
  }, [month, year]);

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
    const today = new Date().toISOString().split('T')[0];
    
    if (isEditing) {
      if (dateStr <= today) {
        // Cannot edit past or today
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      toggleShift(dateStr);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      setSelectedDate(dateStr);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const selectedShift = useMemo(() => 
    shifts.find(s => s.date === selectedDate), 
    [shifts, selectedDate]
  );

  const dayWidth = useMemo(() => (Dimensions.get('window').width - theme.spacing['3xl'] - theme.layout.calendar.gridGap * 6) / 7, []);

  const renderDay = (day: number | null, index: number) => {
    if (day === null) return <View key={`empty-${index}`} style={[styles.dayContainer, { width: dayWidth }]} />;

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const isToday = dateStr === today;
    const isPast = dateStr < today;
    const isSelected = selectedDate === dateStr && !isEditing;
    
    const hasShift = shifts.some(s => s.date === dateStr);
    const pendingAdded = pendingChanges.added.includes(dateStr);
    const pendingRemoved = pendingChanges.removed.includes(dateStr);

    let backgroundColor = theme.colors.background;
    let textColor = theme.colors.text.primary;
    let borderWidth = 0;
    let borderColor = 'transparent';

    if (isEditing) {
      if (isPast || isToday) {
        textColor = theme.colors.text.muted;
      } else if (pendingAdded) {
        backgroundColor = `${currentTheme.primary}40`; // Light primary for pending add
        borderWidth = 2;
        borderColor = currentTheme.primary;
      } else if (pendingRemoved) {
        backgroundColor = `${theme.colors.danger}20`;
        borderWidth = 2;
        borderColor = theme.colors.danger;
      } else if (hasShift) {
        backgroundColor = currentTheme.primary;
        textColor = pvz.marketplace === 'yandex' ? theme.colors.black : theme.colors.white;
      }
    } else {
      if (hasShift) {
        backgroundColor = currentTheme.primary;
        textColor = pvz.marketplace === 'yandex' ? theme.colors.black : theme.colors.white;
      }
      if (isSelected) {
        borderWidth = 2;
        borderColor = currentTheme.secondary;
      }
      if (isToday && !hasShift) {
        borderWidth = 1;
        borderColor = currentTheme.primary;
        textColor = currentTheme.primary;
      }
    }

    return (
      <TouchableOpacity 
        key={dateStr}
        onPress={() => handleDayPress(day)}
        disabled={isEditing && (isPast || isToday)}
        style={[
          styles.dayContainer, 
          { 
            width: dayWidth,
            backgroundColor, 
            borderWidth, 
            borderColor,
            opacity: isEditing && (isPast || isToday) ? 0.4 : 1
          }
        ]}
      >
        <Text style={[styles.dayText, { color: textColor }]}>{day}</Text>
        {isToday && <View style={[styles.todayDot, { backgroundColor: hasShift ? theme.colors.white : currentTheme.primary }]} />}
      </TouchableOpacity>
    );
  };

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} translucent />
      
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.white }} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomWidth: 1, borderBottomColor: theme.colors.border.light, paddingBottom: 12 }]}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>График работы</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.text.muted }]}>{MONTHS[month].toUpperCase()} {year}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={[styles.iconButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.border.light }]}
          >
            <Info size={theme.layout.icon.lg} color={currentTheme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.colors.background, paddingTop: 20 }]} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Calendar Card */}
            <View style={styles.card}>
              <View style={styles.monthNavigator}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                  <ChevronLeft size={theme.layout.icon['2xl']} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
                  <TouchableOpacity onPress={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}>
                    <Text style={{ ...theme.typography.presets.caption, color: currentTheme.primary, fontWeight: '700', marginTop: theme.spacing.xs }}>СЕГОДНЯ</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                  <ChevronRight size={theme.layout.icon['2xl']} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.weekDays}>
                {DAYS.map(day => (
                  <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {calendarDays.map((day, i) => renderDay(day, i))}
              </View>

              {isEditing && (
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.editLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: `${currentTheme.primary}40`, borderColor: currentTheme.primary, borderWidth: 1 }]} />
                    <Text style={styles.legendText}>Добавить</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: `${theme.colors.danger}20`, borderColor: theme.colors.danger, borderWidth: 1 }]} />
                    <Text style={styles.legendText}>Удалить</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.colors.background, opacity: 0.4 }]} />
                    <Text style={styles.legendText}>Недоступно</Text>
                  </View>
                </Animated.View>
              )}
            </View>

            {/* Shift Details or Edit Controls */}
            {isEditing ? (
              <Animated.View entering={FadeInDown} style={styles.editControls}>
                <View style={styles.editHeader}>
                  <Text style={styles.editTitle}>Редактирование графика</Text>
                  <TouchableOpacity onPress={() => setEditing(false)} style={styles.closeButton}>
                    <X size={theme.layout.icon.lg} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.editHint}>
                  Нажмите на пустой день для добавления смены, или на рабочий для удаления.
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Добавлено</Text>
                    <Text style={[styles.statValue, { color: currentTheme.primary }]}>+{pendingChanges.added.length}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Удалено</Text>
                    <Text style={[styles.statValue, { color: theme.colors.danger }]}>-{pendingChanges.removed.length}</Text>
                  </View>
                </View>

                {(pendingChanges.added.length > 0 || pendingChanges.removed.length > 0) && (
                  <HoldToConfirm 
                    onConfirm={submitRequest}
                    label="Отправить запрос"
                    holdingLabel="Отправка..."
                    color={currentTheme.primary}
                    style={{ marginTop: theme.spacing.xl }}
                  />
                )}
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInDown} style={styles.card}>
                {selectedShift ? (
                  <>
                    <View style={styles.shiftHeader}>
                      <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}10` }]}>
                        <Clock size={theme.layout.icon.lg} color={currentTheme.primary} />
                      </View>
                      <View>
                        <Text style={styles.shiftLabel}>Смена {selectedDate === new Date().toISOString().split('T')[0] ? 'сегодня' : (selectedDate === new Date(Date.now() + 86400000).toISOString().split('T')[0] ? 'завтра' : '')}</Text>
                        <Text style={styles.shiftTime}>{selectedShift.startTime} — {selectedShift.endTime}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Адрес:</Text>
                      <Text style={styles.infoValue}>{selectedShift.pvzAddress}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Оплата:</Text>
                      <Text style={styles.infoValue}>{selectedShift.salary} ₽</Text>
                    </View>

                    <TouchableOpacity 
                      onPress={() => setEditing(true)}
                      style={[styles.actionButton, { backgroundColor: `${currentTheme.primary}10` }]}
                    >
                      <Text style={[styles.actionButtonText, { color: currentTheme.primary }]}>Запросить изменение</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.emptyShift}>
                    <AlertCircle size={theme.layout.icon['3xl']} color={theme.colors.text.muted} />
                    <Text style={styles.emptyText}>На этот день нет смен</Text>
                    <TouchableOpacity 
                      onPress={() => setEditing(true)}
                      style={[styles.actionButton, { backgroundColor: `${currentTheme.primary}10`, width: '100%', marginTop: theme.spacing.lg }]}
                    >
                      <Text style={[styles.actionButtonText, { color: currentTheme.primary }]}>Добавить смену</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            )}

            {!isEditing && (
              <View style={styles.warningBox}>
                <AlertCircle size={theme.layout.icon.md} color={theme.colors.warning} />
                <Text style={styles.warningText}>
                  Если не сможете выйти, сообщите менеджеру минимум за 24 часа.
                </Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.presets.h3,
    color: theme.colors.white,
  },
  headerSubtitle: {
    ...theme.typography.presets.caption,
    color: `${theme.colors.white}B3`,
  },
  iconButton: {
    width: theme.layout.calendar.daySize,
    height: theme.layout.calendar.daySize,
    backgroundColor: `${theme.colors.white}33`,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${theme.colors.white}4D`,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.layout.calendar.cardPadding * 2,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.layout.calendar.cardRadius,
    padding: theme.layout.calendar.cardPadding,
    marginBottom: theme.layout.calendar.cardPadding,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    ...theme.shadows.sm,
  },
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.layout.calendar.cardPadding,
  },
  monthTitle: {
    ...theme.typography.presets.bodyLarge,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  navButton: {
    width: theme.layout.calendar.daySize,
    height: theme.layout.calendar.daySize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  weekDayText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    width: 38,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.layout.calendar.gridGap,
    justifyContent: 'flex-start',
  },
  dayContainer: {
    height: theme.layout.calendar.daySize,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '700',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 4,
  },
  editLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.layout.calendar.cardPadding,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.DEFAULT,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.secondary,
  },
  editControls: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.layout.calendar.cardRadius,
    padding: theme.layout.calendar.cardPadding + 4,
    marginBottom: theme.layout.calendar.cardPadding,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  editTitle: {
    ...theme.typography.presets.h4,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  editHint: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.secondary,
    marginBottom: theme.layout.calendar.cardPadding,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  statLabel: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    ...theme.typography.presets.bodyLarge,
    fontWeight: '800',
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.layout.calendar.cardPadding,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftLabel: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.secondary,
  },
  shiftTime: {
    ...theme.typography.presets.bodyLarge,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    ...theme.typography.presets.bodySmall,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'right',
    marginLeft: theme.spacing.xl,
  },
  actionButton: {
    height: 50,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  actionButtonText: {
    ...theme.typography.presets.bodyLarge,
    fontWeight: '700',
  },
  emptyShift: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  emptyText: {
    ...theme.typography.presets.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  warningBox: {
    padding: theme.spacing.lg,
    backgroundColor: `${theme.colors.warning}10`,
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: `${theme.colors.warning}20`,
  },
  warningText: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.secondary,
    flex: 1,
    lineHeight: 16,
  },
});
