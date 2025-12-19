import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Dimensions, StatusBar, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Square, Coffee, Wallet, MapPin, Clock, User, ChevronRight, CheckCircle2, Timer, Lock, Zap } from 'lucide-react-native';
import { useShiftStore, MarketplaceType } from '../model/shift.store';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolate,
  FadeInDown,
  FadeOutUp,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDER_WIDTH = SCREEN_WIDTH - (theme.layout.spacing.lg * 4); // Based on horizontal padding
const KNOB_SIZE = 56;
const TRAVEL_DISTANCE = SLIDER_WIDTH - KNOB_SIZE - theme.layout.spacing.md;

export const ShiftScreen = () => {
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
    setMarketplace
  } = useShiftStore();

  const [timer, setTimer] = useState('00:00:00');
  const [breakTimer, setBreakBreakTimer] = useState('00:00');
  const [remainingTime, setRemainingTime] = useState('--:--');

  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  // Animation Values
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    if (!isShiftOpen) {
      shimmerValue.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        false
      );
    } else {
      shimmerValue.value = 0;
    }
  }, [isShiftOpen]);

  const handleAction = useCallback(() => {
    if (isShiftOpen) endShift();
    else startShift();
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
    transform: [{ translateX: translateX.value }],
  }));

  const sliderTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, TRAVEL_DISTANCE * 0.4], [1, 0], Extrapolate.CLAMP),
    transform: [{ translateX: interpolate(translateX.value, [0, TRAVEL_DISTANCE], [0, 40], Extrapolate.CLAMP) }]
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    if (isShiftOpen) return {};
    return {
      opacity: interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 1, 0.3]),
      transform: [{ translateX: interpolate(shimmerValue.value, [0, 1], [-20, 20]) }]
    };
  });

  // Business Logic
  const hourlyRate = Math.round(shift.salary / 12);
  const earnedSoFar = useMemo(() => {
    if (!isShiftOpen || !shiftStartTime) return 0;
    const hours = (Date.now() - shiftStartTime) / 3600000;
    return Math.round(hours * hourlyRate);
  }, [isShiftOpen, shiftStartTime, hourlyRate]);

  useEffect(() => {
    let interval: any;
    if (isShiftOpen && shiftStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = now - shiftStartTime;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setTimer(`${h}:${m}:${s}`);

        const [endH, endM] = shift.endTime.split(':').map(Number);
        const endTime = new Date();
        endTime.setHours(endH, endM, 0, 0);
        if (endTime.getTime() < now && diff < 3600000) endTime.setDate(endTime.getDate() + 1);

        const rem = endTime.getTime() - now;
        if (rem > 0) {
          const rh = Math.floor(rem / 3600000);
          const rm = Math.floor((rem % 3600000) / 60000);
          setRemainingTime(`${rh}ч ${rm}м`);
        } else {
          setRemainingTime('Завершена');
        }
      }, 1000);
    } else {
      setTimer('00:00:00');
      setRemainingTime('--:--');
    }
    return () => clearInterval(interval);
  }, [isShiftOpen, shiftStartTime, shift.endTime]);

  const activeBreak = breaks.find(b => b.status === 'active');
  useEffect(() => {
    let interval: any;
    if (activeBreak && activeBreak.startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsedMs = now - activeBreak.startTime!;
        const limitMs = activeBreak.durationLimit * 60 * 1000;
        const remainingMs = limitMs - elapsedMs;
        
        if (remainingMs <= 0) {
          setBreakBreakTimer('00:00');
          return;
        }

        const m = Math.floor(remainingMs / 60000).toString().padStart(2, '0');
        const s = Math.floor((remainingMs % 60000) / 1000).toString().padStart(2, '0');
        setBreakBreakTimer(`${m}:${s}`);
      }, 1000);
    } else {
      setBreakBreakTimer('00:00');
    }
    return () => clearInterval(interval);
  }, [activeBreak]);

  const getMarketplaceName = (type: MarketplaceType) => {
    switch (type) {
      case 'wb': return 'Wildberries';
      case 'ozon': return 'Ozon';
      case 'yandex': return 'Яндекс';
      default: return '';
    }
  };

  if (!employee || !pvz) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={currentTheme.primary} translucent />
      
      {/* Brand Background */}
      <View style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, 
        height: 260, 
        backgroundColor: currentTheme.bg, 
        borderBottomLeftRadius: theme.layout.radius['6xl'], 
        borderBottomRightRadius: theme.layout.radius['6xl'] 
      }} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flex: 1, paddingHorizontal: theme.layout.spacing.lg }}>
          
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.layout.spacing.sm, marginBottom: theme.layout.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacing.sm }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}>
                <User size={theme.layout.icon.xl} color={theme.colors.white} />
              </View>
              <View>
                <Text style={{ color: theme.colors.white, fontSize: 18, fontWeight: 'bold' }}>{employee.name.split(' ')[0]}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }}>{getMarketplaceName(pvz.marketplace).toUpperCase()}</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', gap: theme.layout.spacing.xs }}>
              {(['wb', 'ozon', 'yandex'] as MarketplaceType[]).map((m) => (
                <TouchableOpacity key={m} onPress={() => setMarketplace(m)} style={{ 
                  paddingHorizontal: theme.layout.spacing.md, paddingVertical: theme.layout.spacing.sm, borderRadius: theme.layout.radius.lg, 
                  backgroundColor: pvz.marketplace === m ? theme.colors.white : 'rgba(255,255,255,0.15)',
                }}>
                  <Text style={{ color: pvz.marketplace === m ? currentTheme.primary : theme.colors.white, fontWeight: '900', fontSize: 10 }}>{m.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* MASTER TIMER CARD */}
          <View style={{ 
            backgroundColor: theme.colors.white, borderRadius: theme.layout.radius['5xl'], padding: theme.layout.spacing.xl, 
            shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 15,
            marginBottom: theme.layout.spacing.lg
          }}>
            <View style={{ alignItems: 'center', marginBottom: theme.layout.spacing.lg }}>
              <Text style={{ 
                fontSize: 64, 
                fontWeight: '900', 
                color: isShiftOpen ? theme.colors.text.primary : theme.colors.text.disabled, 
                fontVariant: ['tabular-nums'], 
                letterSpacing: -2 
              }}>
                {timer}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacing.xs, marginTop: -6 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isShiftOpen ? theme.colors.success : theme.colors.text.disabled }} />
                <Text style={{ color: isShiftOpen ? theme.colors.success : theme.colors.text.disabled, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }}>{isShiftOpen ? 'СМЕНА АКТИВНА' : 'СМЕНА ЗАКРЫТА'}</Text>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', gap: theme.layout.spacing.sm, marginBottom: theme.layout.spacing.xl }}>
              <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.layout.spacing.lg, borderRadius: theme.layout.radius['3xl'] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacing.xs, marginBottom: 4 }}>
                  <Clock size={theme.layout.icon.sm} color={theme.colors.warning} />
                  <Text style={{ color: theme.colors.text.disabled, fontSize: 9, fontWeight: '900' }}>ГРАФИК</Text>
                </View>
                <Text style={{ color: theme.colors.text.primary, fontWeight: '800', fontSize: 14 }}>{shift.startTime}—{shift.endTime}</Text>
                <Text style={{ color: theme.colors.warning, fontSize: 10, fontWeight: '700', marginTop: 2 }}>{isShiftOpen ? `Ост. ${remainingTime}` : '12ч смена'}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.layout.spacing.lg, borderRadius: theme.layout.radius['3xl'] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacing.xs, marginBottom: 4 }}>
                  <Wallet size={theme.layout.icon.sm} color={theme.colors.success} />
                  <Text style={{ color: theme.colors.text.disabled, fontSize: 9, fontWeight: '900' }}>ДОХОД</Text>
                </View>
                <Text style={{ color: theme.colors.text.primary, fontWeight: '800', fontSize: 14 }}>~{shift.salary} ₽</Text>
                <Text style={{ color: theme.colors.success, fontSize: 10, fontWeight: '700', marginTop: 2 }}>{isShiftOpen ? `+${earnedSoFar} ₽` : `${hourlyRate}₽/час`}</Text>
              </View>
            </View>

            {/* ACTION SLIDER */}
            <View style={{ height: 72, backgroundColor: isShiftOpen ? '#FEF2F2' : '#F5F3FF', borderRadius: theme.layout.radius['3xl'], padding: theme.layout.spacing.sm, justifyContent: 'center' }}>
              <View style={{ position: 'absolute', width: '100%', paddingLeft: KNOB_SIZE + 20, zIndex: 0 }}>
                <Animated.View style={sliderTextStyle}>
                  {!isShiftOpen ? (
                    <Animated.View style={shimmerStyle}>
                      <Text style={{ color: currentTheme.primary, fontWeight: '900', fontSize: 14, letterSpacing: 0.5 }}>НАЧАТЬ СМЕНУ</Text>
                    </Animated.View>
                  ) : (
                    <Text style={{ color: theme.colors.danger, fontWeight: '900', fontSize: 14, letterSpacing: 0.5 }}>ЗАВЕРШИТЬ СМЕНУ</Text>
                  )}
                </Animated.View>
              </View>
              
              <GestureDetector gesture={panGesture}>
                <Animated.View style={[knobStyle, { 
                  width: KNOB_SIZE, height: KNOB_SIZE, borderRadius: theme.layout.radius.xl, 
                  backgroundColor: isShiftOpen ? theme.colors.danger : currentTheme.primary,
                  alignItems: 'center', justifyContent: 'center',
                  shadowColor: isShiftOpen ? theme.colors.danger : currentTheme.primary,
                  shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
                  zIndex: 1
                }]}>
                  {isShiftOpen ? <Square size={theme.layout.icon['2xl']} color={theme.colors.white} fill={theme.colors.white} /> : <ChevronRight size={theme.layout.icon['3xl']} color={theme.colors.white} strokeWidth={3} />}
                </Animated.View>
              </GestureDetector>
            </View>
          </View>

          {/* ACTIVE CONTENT AREA */}
          {isShiftOpen ? (
            <Animated.View entering={FadeInDown.duration(400)} exiting={FadeOutUp.duration(300)}>
              {/* TASKS BLOCK */}
              <View style={{ 
                backgroundColor: theme.colors.white, padding: theme.layout.spacing.lg, borderRadius: theme.layout.radius['3xl'], marginBottom: theme.layout.spacing.md,
                borderWidth: 1, borderColor: theme.colors.border.DEFAULT,
                shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacing.sm }}>
                    <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${theme.colors.success}15`, alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={theme.layout.icon.sm} color={theme.colors.success} />
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: theme.colors.text.primary }}>ПЛАН ЗАДАЧ</Text>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: theme.colors.success }}>65%</Text>
                </View>
                <View style={{ height: 8, backgroundColor: theme.colors.background, borderRadius: 4, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: '65%', backgroundColor: theme.colors.success }} />
                </View>
              </View>

              {/* BREAKS SECTION */}
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: theme.colors.text.primary }}>ПЕРЕРЫВЫ</Text>
                  <Text style={{ color: theme.colors.text.disabled, fontWeight: '900', fontSize: 10, letterSpacing: 0.5 }}>3 ПО 10 МИН</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: theme.layout.spacing.sm }}>
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
                          flex: 1, minHeight: 88, borderRadius: theme.layout.radius['3xl'], 
                          backgroundColor: isActive ? theme.colors.danger : (isCompleted ? theme.colors.success : theme.colors.white),
                          borderWidth: isAvailable ? 1 : 0, borderColor: theme.colors.border.DEFAULT,
                          padding: 10, justifyContent: 'space-between',
                        }}
                      >
                        <View style={{ 
                          width: 28, height: 28, borderRadius: 8, 
                          backgroundColor: isActive || isCompleted ? 'rgba(255,255,255,0.2)' : `${currentTheme.primary}10`,
                          alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isCompleted ? <CheckCircle2 size={theme.layout.icon.sm} color={theme.colors.white} /> : (isActive ? <Timer size={theme.layout.icon.sm} color={theme.colors.white} /> : <Coffee size={theme.layout.icon.sm} color={currentTheme.primary} />)}
                        </View>
                        <View>
                          <Text numberOfLines={1} adjustsFontSizeToFit style={{ color: isActive || isCompleted ? theme.colors.white : theme.colors.text.primary, fontWeight: '900', fontSize: 12 }}>
                            {isActive ? breakTimer : (isCompleted ? 'Завершён' : 'Доступен')}
                          </Text>
                          <Text style={{ color: isActive || isCompleted ? 'rgba(255,255,255,0.7)' : theme.colors.text.disabled, fontSize: 8, fontWeight: '700' }}>
                            {isCompleted ? 'Отдых' : (isActive ? 'Идёт' : `${index + 1}-й слот`)}
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
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 }}
            >
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Lock size={theme.layout.icon['3xl']} color={currentTheme.primary} strokeWidth={2.5} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '900', color: theme.colors.text.primary, marginBottom: 8 }}>Доступ закрыт</Text>
              <Text style={{ textAlign: 'center', color: theme.colors.text.disabled, fontSize: 14, lineHeight: 20, paddingHorizontal: 40 }}>
                Чтобы увидеть задачи и управлять перерывами, необходимо сначала открыть рабочую смену
              </Text>
              
              <View style={{ position: 'absolute', bottom: -50, opacity: 0.02, zIndex: -1 }}>
                <Zap size={280} color={currentTheme.primary} />
              </View>
            </Animated.View>
          )}

        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
