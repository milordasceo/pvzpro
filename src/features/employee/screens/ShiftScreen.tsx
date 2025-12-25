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

<<<<<<< Updated upstream
  const { tasks } = useTasksStore();

  const [timer, setTimer] = useState('00:00:00');
  const [breakTimer, setBreakBreakTimer] = useState('00:00');
  const [remainingTime, setRemainingTime] = useState('--:--');

  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  // Animation Values
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const shimmerValue = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (!isShiftOpen) {
      shimmerValue.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        false
      );
      cancelAnimation(pulseScale);
      pulseScale.value = 1;
    } else {
      shimmerValue.value = 0;
      // Start a subtle pulse on the knob to attract attention
      pulseScale.value = withRepeat(
        withTiming(1.05, { duration: 1500 }),
        -1,
        true
      );
    }
  }, [isShiftOpen]);

  const handleAction = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (!isShiftOpen) {
      startShift();
    } else {
      endShift();
    }
    translateX.value = withSpring(0);
  }, [isShiftOpen, startShift, endShift]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      let newVal = startX.value + event.translationX;
      if (newVal < 0) newVal = 0;
      if (newVal > TRAVEL_DISTANCE) newVal = TRAVEL_DISTANCE;
      translateX.value = newVal;
    })
    .onEnd(() => {
      if (translateX.value > TRAVEL_DISTANCE * 0.8) {
        translateX.value = withSpring(TRAVEL_DISTANCE);
        runOnJS(handleAction)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: pulseScale.value }
    ],
  }));

  const sliderTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, TRAVEL_DISTANCE * 0.4], [1, 0], Extrapolate.CLAMP),
    transform: [{ translateX: interpolate(translateX.value, [0, TRAVEL_DISTANCE], [0, 40], Extrapolate.CLAMP) }]
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    if (isShiftOpen) return { opacity: 1, transform: [{ translateX: 0 }] };
    return {
      opacity: interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 1, 0.3]),
      transform: [{ translateX: interpolate(shimmerValue.value, [0, 1], [-10, 10]) }]
    };
=======
  const { timer, activeBreak, breakTimer } = useShiftTimer({
    isShiftOpen,
    shiftStartTime,
    shiftEndTime: shift.endTime,
    breaks,
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color={theme.colors.white} />
              </View>
              <View>
                <Text style={{ ...theme.typography.presets.label, color: theme.colors.white, fontWeight: '800' }}>{employee.name.split(' ')[0]}</Text>
                <Text style={{ ...theme.typography.presets.caption, color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>{getMarketplaceName(pvz.marketplace)}</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 4, backgroundColor: 'rgba(255,255,255,0.1)', padding: 3, borderRadius: theme.borderRadius.lg }}>
              {(['wb', 'ozon', 'yandex'] as MarketplaceType[]).map((m) => (
                <TouchableOpacity key={m} onPress={() => setMarketplace(m)} style={{ 
                  paddingHorizontal: 10, paddingVertical: 5, borderRadius: theme.borderRadius.md, 
                  backgroundColor: pvz.marketplace === m ? theme.colors.white : 'transparent',
                }}>
                  <Text style={{ ...theme.typography.presets.caption, color: pvz.marketplace === m ? currentTheme.primary : theme.colors.white, fontWeight: '900', fontSize: 11 }}>{m.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* MASTER TIMER CARD */}
          <View style={{ 
            backgroundColor: theme.colors.white, borderRadius: 24, padding: theme.spacing.lg, 
            shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 15, elevation: 6,
            marginBottom: theme.spacing.md
          }}>
            <View style={{ alignItems: 'center', marginBottom: theme.spacing.md }}>
              <Text style={{ 
                fontSize: 52, 
                fontWeight: '800', 
                color: isShiftOpen ? theme.colors.text.primary : theme.colors.text.muted, 
                fontVariant: ['tabular-nums'], 
                letterSpacing: -1,
                lineHeight: 56
              }}>
                {timer}
              </Text>
              <View style={{ 
                flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4,
                backgroundColor: isShiftOpen ? `${theme.colors.success}10` : `${theme.colors.text.muted}10`,
                paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100
              }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isShiftOpen ? theme.colors.success : theme.colors.text.muted }} />
                <Text style={{ ...theme.typography.presets.caption, color: isShiftOpen ? theme.colors.success : theme.colors.text.muted, fontSize: 11 }}>
                  {isShiftOpen ? 'ИДЕТ РАБОЧАЯ СМЕНА' : 'СМЕНА НЕ ОТКРЫТА'}
                </Text>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
              <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border.light }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Clock size={14} color={theme.colors.warning} />
                  <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.secondary, fontSize: 11 }}>ГРАФИК</Text>
                </View>
                <Text style={{ ...theme.typography.presets.bodyLarge, color: theme.colors.text.primary }}>{shift.startTime}—{shift.endTime}</Text>
                <Text style={{ ...theme.typography.presets.label, color: theme.colors.warning, fontSize: 11, marginTop: 2 }}>
                  {isShiftOpen ? `До конца ${remainingTime}` : '12-часовая смена'}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border.light }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Wallet size={14} color={theme.colors.success} />
                  <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.secondary, fontSize: 11 }}>ДОХОД</Text>
                </View>
                <Text style={{ ...theme.typography.presets.bodyLarge, color: theme.colors.text.primary }}>~{shift.salary} ₽</Text>
                <Text style={{ ...theme.typography.presets.label, color: theme.colors.success, fontSize: 11, marginTop: 2 }}>
                  {isShiftOpen ? `За сегодня +${earnedSoFar} ₽` : `${hourlyRate} ₽ в час`}
                </Text>
              </View>
            </View>

            {/* ACTION AREA (SLIDER) */}
            <View style={{ 
              height: 64, backgroundColor: isShiftOpen ? '#FFF1F2' : '#F5F3FF', 
              borderRadius: 18, padding: 4, justifyContent: 'center',
              borderWidth: 1, borderColor: isShiftOpen ? '#FFE4E6' : '#EDE9FE'
            }}>
              <View style={{ position: 'absolute', width: '100%', paddingLeft: KNOB_SIZE + 20, zIndex: 0 }}>
                <Animated.View style={sliderTextStyle}>
                  <Animated.View style={shimmerStyle}>
                    <Text style={{ ...theme.typography.presets.label, color: isShiftOpen ? theme.colors.danger : currentTheme.primary }}>
                      {isShiftOpen ? 'ЗАВЕРШИТЬ РАБОТУ' : 'НАЧАТЬ РАБОТУ'}
                    </Text>
                  </Animated.View>
                </Animated.View>
              </View>
              
              <GestureDetector gesture={panGesture}>
                <Animated.View style={[knobStyle, { 
                  width: KNOB_SIZE, height: KNOB_SIZE, borderRadius: 14, 
                  backgroundColor: isShiftOpen ? theme.colors.danger : currentTheme.primary,
                  alignItems: 'center', justifyContent: 'center',
                  shadowColor: isShiftOpen ? theme.colors.danger : currentTheme.primary,
                  shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4,
                  zIndex: 1
                }]}>
                  {isShiftOpen ? (
                    <Power size={22} color={theme.colors.white} strokeWidth={2.5} />
                  ) : (
                    <ChevronRight size={28} color={theme.colors.white} strokeWidth={3} />
                  )}
                </Animated.View>
              </GestureDetector>
            </View>
          </View>

          {/* ACTIVE CONTENT AREA */}
          {isShiftOpen ? (
            <Animated.View entering={FadeInDown.duration(400)} exiting={FadeOutUp.duration(300)}>
              {/* TASKS BLOCK */}
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Tasks')}
                style={{ 
                  backgroundColor: theme.colors.white, padding: 16, borderRadius: 20, marginBottom: 12,
                  borderWidth: 1, borderColor: theme.colors.border.DEFAULT,
                  shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${theme.colors.success}10`, alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={18} color={theme.colors.success} />
                    </View>
                    <View>
                      <Text style={{ ...theme.typography.presets.h4, color: theme.colors.text.primary }}>Задачи на смену</Text>
                      <Text style={{ ...theme.typography.presets.bodySmall, color: theme.colors.text.secondary }}>Выполнено {tasks.filter(t => t.status === 'completed').length} из {tasks.length}</Text>
                    </View>
                  </View>
                  <ArrowRight size={18} color={theme.colors.text.muted} />
                </View>
                
                <View style={{ height: 10, backgroundColor: theme.colors.background, borderRadius: 5, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${taskProgress}%`, backgroundColor: theme.colors.success }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                  <Text style={{ ...theme.typography.presets.caption, color: theme.colors.success }}>{taskProgress}% ГОТОВО</Text>
                </View>
              </TouchableOpacity>

              {/* BREAKS SECTION */}
              <View style={{ backgroundColor: theme.colors.white, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border.DEFAULT }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <Text style={{ ...theme.typography.presets.h4, color: theme.colors.text.primary }}>Перерывы</Text>
                  <View style={{ backgroundColor: `${currentTheme.primary}10`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ ...theme.typography.presets.caption, color: currentTheme.primary }}>3 ПЕРЕРЫВА ПО 10 МИН</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {breaks.map((b, index) => {
                    const isActive = b.status === 'active';
                    const isCompleted = b.status === 'completed';
                    const isAvailable = b.status === 'available';

                    return (
                      <TouchableOpacity 
                        key={b.id}
                        onPress={isActive ? endBreak : (isAvailable ? startBreak : undefined)}
                        disabled={isCompleted || (!isActive && activeBreak !== undefined)}
                        activeOpacity={0.8}
                        style={{ 
                          flex: 1, height: 86, borderRadius: 16, 
                          backgroundColor: isActive ? theme.colors.danger : (isCompleted ? theme.colors.success : theme.colors.background),
                          padding: 12, justifyContent: 'space-between',
                          borderWidth: isAvailable ? 1 : 0, borderColor: theme.colors.border.light
                        }}
                      >
                        <View style={{ 
                          width: 28, height: 28, borderRadius: 9, 
                          backgroundColor: isActive || isCompleted ? 'rgba(255,255,255,0.2)' : theme.colors.white,
                          alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isCompleted ? <CheckCircle2 size={16} color={theme.colors.white} /> : (isActive ? <Timer size={16} color={theme.colors.white} /> : <Coffee size={16} color={currentTheme.primary} />)}
                        </View>
                        <View>
                          <Text numberOfLines={1} adjustsFontSizeToFit style={{ ...theme.typography.presets.label, color: isActive || isCompleted ? theme.colors.white : theme.colors.text.primary }}>
                            {isActive ? breakTimer : (isCompleted ? 'Отработан' : 'Доступен')}
                          </Text>
                          <Text style={{ ...theme.typography.presets.caption, color: isActive || isCompleted ? 'rgba(255,255,255,0.8)' : theme.colors.text.secondary }}>
                            {isCompleted ? 'Отдых' : (isActive ? 'Идет' : `${index + 1}-й слот`)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Animated.View>
          ) : (
            /* LOCKED STATE */
            <Animated.View 
              entering={FadeInDown.delay(200)}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}
=======
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
>>>>>>> Stashed changes
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
