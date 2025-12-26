import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Coffee, Timer, CheckCircle2, MapPin, ChevronRight } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useShiftStore, MarketplaceType } from '../model/shift.store';
import { useShiftTimer } from '../model/useShiftTimer';
import { useGeolocation } from '../../../shared/hooks/useGeolocation';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { SlideToAction } from '../../../shared/ui/SlideToAction';

const getMarketplaceName = (type: MarketplaceType) => {
  switch (type) {
    case 'wb': return 'Wildberries';
    case 'ozon': return 'Ozon';
    case 'yandex': return 'Яндекс';
    default: return '';
  }
};

export const ShiftScreen = () => {
  const navigation = useNavigation<any>();

  const {
    isShiftOpen,
    shiftStartTime,
    startShift,
    endShift,
    employee,
    pvz,
    shift,
    breaks,
    startBreak,
    endBreak,
  } = useShiftStore();

  const { timer, activeBreak, breakTimer } = useShiftTimer({
    isShiftOpen,
    shiftStartTime,
    shiftEndTime: shift.endTime,
    breaks,
  });

  const geo = useGeolocation({ pvzCoordinates: pvz.coordinates });
  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  // Handle shift start with geo check
  const handleStartShift = () => {
    const isDev = __DEV__;
    if (isDev || geo.isInZone || geo.error) {
      startShift();
      return;
    }
    if (!geo.isInZone && !geo.isLoading) {
      Alert.alert(
        'Вы вне зоны ПВЗ',
        'Для начала смены рекомендуется находиться в радиусе 100 метров от пункта выдачи.',
        [
          { text: 'Обновить', onPress: geo.refresh },
          { text: 'Начать всё равно', onPress: startShift, style: 'destructive' },
          { text: 'Отмена', style: 'cancel' },
        ]
      );
      return;
    }
    startShift();
  };

  if (!employee || !pvz) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: theme.spacing.lg }}>

        {/* HEADER: Date, Name (Clickable) & Avatar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing['3xl'], marginTop: theme.spacing.sm }}>
          <View>
            <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.6}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
            >
              <Text style={{ fontSize: 24, color: theme.colors.text.primary, fontWeight: '400', letterSpacing: -0.5 }}>
                Привет, {employee.name.split(' ')[0]}
              </Text>
              <ChevronRight size={24} color={theme.colors.text.muted} style={{ marginTop: 2 }} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
            style={{
              width: 48, height: 48, borderRadius: theme.layout.radius['3xl'],
              backgroundColor: currentTheme.primary,
              alignItems: 'center', justifyContent: 'center',
              ...theme.shadows.sm
            }}
          >
            <Text style={{ ...theme.typography.presets.h4, color: theme.colors.white }}>
              {employee.name.split(' ')[0][0]}
            </Text>
          </TouchableOpacity>
        </View>

        {isShiftOpen ? (
          <Animated.View entering={FadeInDown} style={{ flex: 1 }}>
            {/* MAIN STATS: Timer (Center) */}
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginBottom: theme.spacing['3xl'] }}>
              <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.muted, letterSpacing: 2, marginBottom: 8 }}>
                {activeBreak ? 'ПЕРЕРЫВ' : 'ВРЕМЯ НА СМЕНЕ'}
              </Text>
              <Text style={{ fontSize: 64, fontWeight: '200', color: activeBreak ? theme.colors.warning : theme.colors.text.primary, fontVariant: ['tabular-nums'] }}>
                {activeBreak ? breakTimer : timer.split(':').slice(0, 2).join(':')}
                <Text style={{ fontSize: 24, color: theme.colors.text.muted }}>{activeBreak ? '' : `:${timer.split(':')[2]}`}</Text>
              </Text>

              {!activeBreak && (
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.muted }}>
                    <Text style={{ fontWeight: '700' }}>{shift.startTime} — {shift.endTime}</Text> • {pvz.address}
                  </Text>
                </View>
              )}
            </View>

            {/* BREAKS - Compact */}
            <View style={{ marginBottom: theme.spacing['3xl'] }}>
              <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.muted, marginBottom: 12 }}>УПРАВЛЕНИЕ ПЕРЕРЫВАМИ</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {breaks.map((b, i) => {
                  const isActive = b.status === 'active';
                  const isDone = b.status === 'completed';
                  const isAvail = b.status === 'available';

                  return (
                    <TouchableOpacity
                      key={b.id}
                      onPress={isActive ? endBreak : (isAvail ? startBreak : undefined)}
                      disabled={isDone || (!isActive && activeBreak !== undefined)}
                      style={{
                        flex: 1, height: 60, borderRadius: theme.layout.radius.xl,
                        backgroundColor: isActive ? theme.colors.warning : (isDone ? theme.colors.background : theme.colors.white),
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: isAvail ? 1 : 0, borderColor: theme.colors.border.DEFAULT,
                        opacity: (activeBreak && !isActive) ? 0.3 : 1
                      }}
                    >
                      {isDone ? <CheckCircle2 size={24} color={theme.colors.success} /> :
                        isActive ? <Text style={{ fontWeight: '700', color: theme.colors.white }}>STOP</Text> :
                          <Coffee size={24} color={isAvail ? theme.colors.text.primary : theme.colors.text.muted} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* SLIDER */}
            <View style={{ marginBottom: theme.spacing.xl }}>
              <SlideToAction
                onAction={endShift}
                label="ЗАВЕРШИТЬ СМЕНУ"
                variant="danger"
              />
            </View>
          </Animated.View>
        ) : (
          /* CLOSED SHIFT STATE */
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: `${currentTheme.primary}10`, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing['3xl'] }}>
              <Timer size={48} color={currentTheme.primary} />
            </View>
            <Text style={{ ...theme.typography.presets.h2, textAlign: 'center', marginBottom: 8 }}>Смена закрыта</Text>
            <Text style={{ ...theme.typography.presets.body, textAlign: 'center', color: theme.colors.text.secondary, maxWidth: 250, marginBottom: 48 }}>
              Хорошего отдыха! Не забудьте отметиться при входе в ПВЗ.
            </Text>

            <View style={{ width: '100%', paddingHorizontal: theme.spacing.xl }}>
              <SlideToAction
                onAction={handleStartShift}
                label="НАЧАТЬ РАБОТУ"
                variant="primary"
                primaryColor={currentTheme.primary}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
