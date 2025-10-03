import React from 'react';
import { View, Pressable } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  StyledCard,
  StyledButton,
  StyledScrollView,
  StyledDialog,
  MetaRow,
} from '../../components';
import { QrScanner } from '../QrScanner';
import { parseQrPayload, isExpired, verifyParsedQr } from '../../utils/qr';
import { APP_CONFIG } from '../../config/app';
import {
  distanceMeters,
  ensureLocationPermission,
  getCurrentLocation,
} from '../../attendance/geofence';
import { useShiftStore, useShiftStatus, useCurrentShift } from '../../store/shift.store';
import { cancelAllShiftReminders } from '../../services/notifications';
import { useTasksCounter } from '../tasks/TasksCounterContext';

export const ProcessTab: React.FC = () => {
  const now = new Date();
  const start = React.useMemo(() => {
    const d = new Date(now);
    d.setHours(10, 0, 0, 0);
    return d;
  }, [now]);
  const end = React.useMemo(() => {
    const d = new Date(start);
    d.setHours(22, 0, 0, 0);
    return d;
  }, [start]);

  // Используем статус из zustand store вместо локального useState
  const currentShift = useCurrentShift();
  const shiftStatus = useShiftStatus();
  const status = shiftStatus || 'planned'; // 'active' | 'break' | 'finished' | null -> 'planned'
  
  const [startedAtMs, setStartedAtMs] = React.useState<number | null>(null);
  const [breakStartedAtMs, setBreakStartedAtMs] = React.useState<number | null>(null);
  const BREAKS_ALLOWED = 3;
  const BREAK_DURATION_MS = 10 * 60 * 1000;
  const [breaksUsed, setBreaksUsed] = React.useState<number>(0);
  const [scannerVisible, setScannerVisible] = React.useState(false);
  const [snack, setSnack] = React.useState<string | null>(null);
  const [feed, setFeed] = React.useState<Array<{ title: string; at: number }>>([]);
  const [historyExpanded, setHistoryExpanded] = React.useState(false);
  const log = (title: string) => setFeed((prev) => [{ title, at: Date.now() }, ...prev]);

  const startShift = useShiftStore((s) => s.startShift);
  const takeBreak = useShiftStore((s) => s.takeBreak);
  const endBreak = useShiftStore((s) => s.endBreak);
  const endShift = useShiftStore((s) => s.endShift);
  const { pendingCount, completedCount } = useTasksCounter();

  function formatLeft(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }

  const timeRange = `с 10:00 – 22:00`;
  const onBreak = status === 'break';
  const canEnd = status === 'active';

  const [nowTick, setNowTick] = React.useState(Date.now());
  const [finishConfirmOpen, setFinishConfirmOpen] = React.useState(false);
  React.useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const canFinishByTime = nowTick >= end.getTime();
  const breakLeftMs = Math.max(0, BREAK_DURATION_MS - (nowTick - (breakStartedAtMs ?? nowTick)));
  React.useEffect(() => {
    if (onBreak && breakLeftMs === 0) {
      endBreak(); // Используем метод store
      setBreakStartedAtMs(null);
      setSnack('Перерыв завершён');
      log('Перерыв завершён (авто)');
    }
  }, [onBreak, breakLeftMs]);

  // Вычисления для прогресса
  const shiftDurationMs = end.getTime() - start.getTime(); // 12 часов
  const elapsedMs = startedAtMs ? Math.min(nowTick - startedAtMs, shiftDurationMs) : 0;
  const progressPercent = shiftDurationMs > 0 ? (elapsedMs / shiftDurationMs) * 100 : 0;
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
  const totalHours = Math.floor(shiftDurationMs / (1000 * 60 * 60));
  const totalTasksCount = pendingCount + completedCount;

  return (
    <>
      <StyledScrollView>
        {/* 1) Статус смены (Hero Card) */}
        <StyledCard>
          <View style={{ gap: 12 }}>
            {/* Заголовок и локация */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>
                  {start.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
                  Герцена 12
                </Text>
                <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                  {timeRange}
                </Text>
              </View>
              {/* Статус-бейдж */}
              <View
                style={{
                  backgroundColor:
                    status === 'finished'
                      ? '#DCFCE7'
                      : status === 'active' || onBreak
                        ? '#DBEAFE'
                        : '#F3F4F6',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color:
                      status === 'finished'
                        ? '#166534'
                        : status === 'active' || onBreak
                          ? '#1E40AF'
                          : '#6B7280',
                  }}
                >
                  {status === 'planned'
                    ? 'Не начата'
                    : onBreak
                      ? 'Перерыв'
                      : status === 'active'
                        ? 'В процессе'
                        : 'Завершена'}
                </Text>
              </View>
            </View>

            {/* Прогресс-бар (показываем только если смена начата) */}
            {(status === 'active' || onBreak || status === 'finished') && startedAtMs ? (
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    height: 8,
                    backgroundColor: '#F3F4F6',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${Math.min(progressPercent, 100)}%`,
                      backgroundColor: onBreak ? '#F59E0B' : '#4F46E5',
                      borderRadius: 999,
                    }}
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>
                    {elapsedHours}ч {elapsedMinutes}м отработано
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>
                    {totalHours}ч всего
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Главная кнопка */}
            {status === 'planned' ? (
              <View style={{ gap: 8 }}>
                <StyledButton
                  mode="contained"
                  icon="qrcode"
                  onPress={async () => {
                    setScannerVisible(true);
                  }}
                >
                  Начать смену
                </StyledButton>
                {/* DEV: Быстрый старт без QR */}
                <StyledButton
                  mode="outlined"
                  icon="flash"
                  onPress={async () => {
                    // Быстрый старт для разработки
                    await startShift({
                      employeeId: 'demo-employee',
                      pvzId: 'pvz-dev',
                      date: new Date(),
                      isOvertime: false,
                      notes: 'DEV: старт без QR',
                    } as any);
                    await cancelAllShiftReminders();
                    setSnack('Смена начата (DEV режим)');
                    setStartedAtMs(Date.now());
                    log('Смена начата (DEV)');
                  }}
                  compact
                  buttonColor="#FEF3C7"
                  textColor="#92400E"
                >
                  🚀 DEV: Старт без QR
                </StyledButton>
              </View>
            ) : null}
          </View>
        </StyledCard>

        {/* 2) Живая панель достижений - только после начала смены */}
        {(status === 'active' || onBreak || status === 'finished') ? (
        <StyledCard>
          <View style={{ gap: 12 }}>
            {/* Заголовок */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="chart-line" size={20} color="#6B7280" />
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                Статистика смены
              </Text>
            </View>

            {/* Карточки с прогрессом */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {/* Задачи */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#F9FAFB',
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <MaterialCommunityIcons
                    name="checkbox-marked-circle-outline"
                    size={18}
                    color={completedCount > 0 ? '#10B981' : '#6B7280'}
                  />
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
                    {completedCount}/{totalTasksCount}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Задачи</Text>
                {/* Прогресс-бар */}
                <View
                  style={{
                    height: 4,
                    backgroundColor: '#E5E7EB',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${totalTasksCount > 0 ? (completedCount / totalTasksCount) * 100 : 0}%`,
                      backgroundColor: '#10B981',
                      borderRadius: 2,
                    }}
                  />
                </View>
              </View>

              {/* Время */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#F9FAFB',
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={18}
                    color={(status === 'active' || onBreak) ? (onBreak ? '#F59E0B' : '#4F46E5') : '#6B7280'}
                  />
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
                    {(status === 'active' || onBreak || status === 'finished')
                      ? `${elapsedHours}ч ${elapsedMinutes}м`
                      : '0ч 0м'}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Время</Text>
                {/* Прогресс-бар */}
                <View
                  style={{
                    height: 4,
                    backgroundColor: '#E5E7EB',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${Math.min(progressPercent, 100)}%`,
                      backgroundColor: onBreak ? '#F59E0B' : '#4F46E5',
                      borderRadius: 2,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Оплата - крупно */}
            <View
              style={{
                backgroundColor: '#DCFCE7',
                padding: 14,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#10B981',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <MaterialCommunityIcons name="cash-multiple" size={24} color="#059669" />
                  <View>
                    <Text style={{ fontSize: 12, color: '#065F46', marginBottom: 2 }}>
                      Заработано сегодня
                    </Text>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: '#065F46' }}>
                      2 200₽
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Напоминание о невыполненных задачах */}
            {(status === 'active' || onBreak) && pendingCount > 0 ? (
              <View
                style={{
                  backgroundColor: '#FEF3C7',
                  padding: 12,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: '#F59E0B',
                }}
              >
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#92400E" />
                <Text style={{ fontSize: 13, color: '#92400E', flex: 1 }}>
                  У вас {pendingCount} {pendingCount === 1 ? 'невыполненная задача' : pendingCount < 5 ? 'невыполненные задачи' : 'невыполненных задач'}
                </Text>
              </View>
            ) : null}
          </View>
        </StyledCard>
        ) : null}

        {/* 3) Перерывы - Визуальный прогресс - только после начала смены */}
        {(status === 'active' || onBreak || status === 'finished') ? (
        <StyledCard>
          <View style={{ gap: 12 }}>
            {/* Заголовок */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="coffee" size={20} color="#6B7280" />
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                Перерывы
              </Text>
            </View>

            {/* Визуальные индикаторы */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {/* Точки-индикаторы */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[...Array(BREAKS_ALLOWED)].map((_, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: idx < breaksUsed ? '#10B981' : '#F3F4F6',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: idx < breaksUsed ? '#059669' : '#E5E7EB',
                    }}
                  >
                    {idx < breaksUsed ? (
                      <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                    ) : (
                      <MaterialCommunityIcons name="coffee" size={16} color="#9CA3AF" />
                    )}
                  </View>
                ))}
              </View>
              {/* Текстовый счётчик */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                  {breaksUsed} из {BREAKS_ALLOWED} использовано
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                  По {Math.floor(BREAK_DURATION_MS / 60000)} минут каждый
                </Text>
              </View>
            </View>

            {/* Состояние перерыва */}
            {onBreak ? (
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    backgroundColor: '#FEF3C7',
                    padding: 12,
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: '#F59E0B',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <MaterialCommunityIcons name="timer-sand" size={16} color="#92400E" />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#92400E' }}>
                      На перерыве
                    </Text>
                  </View>
                  {/* Прогресс-бар перерыва */}
                  <View
                    style={{
                      height: 6,
                      backgroundColor: '#FDE68A',
                      borderRadius: 3,
                      overflow: 'hidden',
                      marginTop: 4,
                    }}
                  >
                    <View
                      style={{
                        height: '100%',
                        width: `${((BREAK_DURATION_MS - breakLeftMs) / BREAK_DURATION_MS) * 100}%`,
                        backgroundColor: '#F59E0B',
                        borderRadius: 3,
                      }}
                    />
                  </View>
                  <Text style={{ fontSize: 12, color: '#92400E', marginTop: 6, textAlign: 'center' }}>
                    {formatLeft(breakLeftMs)} осталось
                  </Text>
                </View>
                <StyledButton
                  mode="contained"
                  icon="play"
                  onPress={async () => {
                    await endBreak();
                    setBreakStartedAtMs(null);
                    setSnack('Перерыв завершён');
                    log('Перерыв завершён');
                  }}
                >
                  Продолжить работу
                </StyledButton>
              </View>
            ) : (
              <StyledButton
                mode="outlined"
                icon="coffee"
                onPress={async () => {
                  if (breaksUsed >= BREAKS_ALLOWED) {
                    setSnack('Лимит перерывов');
                    return;
                  }
                  await takeBreak(10);
                  const ts = Date.now();
                  setBreakStartedAtMs(ts);
                  setBreaksUsed((u) => u + 1);
                  setSnack('Перерыв начат');
                  log('Взят перерыв');
                }}
                disabled={breaksUsed >= BREAKS_ALLOWED}
              >
                Взять перерыв
              </StyledButton>
            )}
          </View>
        </StyledCard>
        ) : null}

        {/* 4) Завершение смены */}
        <StyledCard title="Завершение смены">
          <View style={{ gap: 8 }}>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>
              После завершения смены будут подведены итоги и начислена оплата.
            </Text>
            <View
              style={{
                backgroundColor: '#F3F4F6',
                padding: 12,
                borderRadius: 8,
                marginTop: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <MaterialCommunityIcons name="information-outline" size={16} color="#6B7280" />
                <Text style={{ color: '#6B7280', fontSize: 13, fontWeight: '600' }}>
                  Обязательно проверьте:
                </Text>
              </View>
              <Text style={{ color: '#6B7280', fontSize: 13, marginLeft: 24 }}>
                • Все задачи выполнены{'\n'}
                • Вы находитесь на рабочем месте
              </Text>
            </View>
            
            {/* Кнопка завершения (показываем только когда смена активна и не на перерыве) */}
            {status === 'active' && !onBreak ? (
              <StyledButton
                mode="contained"
                icon="stop"
                onPress={() => {
                  setFinishConfirmOpen(true);
                }}
                buttonColor="#DC2626"
                textColor="#FFFFFF"
              >
                Завершить смену
              </StyledButton>
            ) : status === 'planned' ? (
              <Text style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>
                Кнопка появится после начала смены
              </Text>
            ) : onBreak ? (
              <Text style={{ color: '#F59E0B', fontSize: 13, marginTop: 4 }}>
                ⏸️ Завершите перерыв, чтобы закрыть смену
              </Text>
            ) : null}
          </View>
        </StyledCard>

        {/* 5) История (сворачиваемая) */}
        {feed.length > 0 ? (
          <StyledCard>
            <View>
              <Pressable
                onPress={() => setHistoryExpanded(!historyExpanded)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 4,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialCommunityIcons name="history" size={20} color="#6B7280" />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                    История событий
                  </Text>
                  <View
                    style={{
                      backgroundColor: '#F3F4F6',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '600' }}>
                      {feed.length}
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                  name={historyExpanded ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#6B7280"
                />
              </Pressable>
              {historyExpanded ? (
                <View style={{ gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                  {feed.map((e, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#4F46E5',
                          }}
                        />
                        <Text style={{ fontSize: 14, color: '#111827' }}>{e.title}</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        {new Date(e.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </StyledCard>
        ) : null}
      </StyledScrollView>

      {/* Диалог подтверждения завершения - с драмой! */}
      <StyledDialog
        visible={finishConfirmOpen}
        onDismiss={() => setFinishConfirmOpen(false)}
        title="Завершить смену?"
        actions={
          <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
            <View style={{ flex: 1 }}>
              <StyledButton 
                mode="outlined"
                onPress={() => setFinishConfirmOpen(false)}
                icon="arrow-left"
              >
                Продолжить работу
              </StyledButton>
            </View>
            <View style={{ flex: 1 }}>
              <StyledButton
                mode="contained"
                onPress={async () => {
                  if (!onBreak && status === 'active') {
                    await endShift();
                    setSnack('Смена завершена');
                    log('Смена завершена');
                  }
                  setFinishConfirmOpen(false);
                }}
                icon="check-bold"
                buttonColor={pendingCount > 0 || !canFinishByTime ? '#EF4444' : '#10B981'}
              >
                Завершить
              </StyledButton>
            </View>
          </View>
        }
      >
        <View style={{ gap: 12 }}>
          {/* Главный вопрос */}
          {pendingCount > 0 || !canFinishByTime ? (
            <View>
              {/* Драматичный блок с предупреждением */}
              <View
                style={{
                  backgroundColor: '#FEE2E2',
                  padding: 14,
                  borderRadius: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: '#EF4444',
                }}
              >
                <Text style={{ fontSize: 15, color: '#991B1B', fontWeight: '600', marginBottom: 8 }}>
                  ⚠️ Внимание!
                </Text>
                <Text style={{ fontSize: 14, color: '#7F1D1D', lineHeight: 20 }}>
                  Вы действительно хотите завершить смену сейчас?
                </Text>
              </View>
              
              {/* Перечисление проблем с иконками */}
              <View style={{ marginTop: 12, gap: 10 }}>
                {pendingCount > 0 ? (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                    <MaterialCommunityIcons name="alert-octagon" size={20} color="#F59E0B" />
                    <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20, flex: 1 }}>
                      У вас ещё <Text style={{ fontWeight: '700', color: '#DC2626' }}>{pendingCount} {pendingCount === 1 ? 'незавершённая задача' : pendingCount < 5 ? 'незавершённые задачи' : 'незавершённых задач'}</Text>
                    </Text>
                  </View>
                ) : null}
                
                {!canFinishByTime ? (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                    <MaterialCommunityIcons name="clock-alert" size={20} color="#3B82F6" />
                    <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20, flex: 1 }}>
                      Смена завершается <Text style={{ fontWeight: '700', color: '#1E40AF' }}>раньше планового времени</Text> ({end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : (
            <View>
              {/* Позитивный блок */}
              <View
                style={{
                  backgroundColor: '#D1FAE5',
                  padding: 14,
                  borderRadius: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: '#10B981',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <MaterialCommunityIcons name="check-circle" size={24} color="#059669" />
                <Text style={{ fontSize: 15, color: '#065F46', fontWeight: '600', flex: 1 }}>
                  Все задачи выполнены! Отличная работа!
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 12, lineHeight: 20 }}>
                Вы можете завершить смену
              </Text>
            </View>
          )}
        </View>
      </StyledDialog>

      {/* Сканер + проверки */}
      {scannerVisible ? (
        <QrScanner
          onClose={() => setScannerVisible(false)}
          onScanned={async (data) => {
            setScannerVisible(false);
            const parsed = parseQrPayload(data);
            if (!parsed) {
              setSnack('Некорректный QR-код');
              return;
            }
            if (isExpired(parsed.exp)) {
              setSnack('QR истёк');
              return;
            }
            if (!verifyParsedQr(parsed)) {
              setSnack('Подпись QR недействительна');
              return;
            }
            // Серверная валидация QR на pvzqr.ru
            // TODO: Временно отключено для тестирования без сервера
            // try {
            //   const resp = await fetch(
            //     `${APP_CONFIG.QR.VALIDATE_URL}?payload=${encodeURIComponent(data)}`,
            //     { method: 'GET' },
            //   );
            //   const json = await resp.json();
            //   if (!json?.isValid) {
            //     setSnack('Неверный QR');
            //     return;
            //   }
            // } catch {
            //   setSnack('Сервер валидации недоступен');
            //   return;
            // }

            const granted = await ensureLocationPermission();
            if (!granted) {
              setSnack('Нет доступа к геолокации');
              return;
            }
            const current = await getCurrentLocation();
            if (!current) {
              setSnack('Не удалось получить геопозицию');
              return;
            }
            const currentLat = current.lat ?? current.latitude;
            const currentLon = current.lon ?? current.longitude;
            if (currentLat == null || currentLon == null) {
              setSnack('Нет координат текущего положения');
              return;
            }

            const pvzCoords: Record<string, { lat: number; lon: number }> = {
              'pvz-001': { lat: 55.026, lon: 82.921 },
              'pvz-002': { lat: 54.982, lon: 82.897 },
            };
            const pvz =
              parsed.pvzId === 'pvz-dev'
                ? { lat: currentLat, lon: currentLon }
                : pvzCoords[parsed.pvzId];
            if (!pvz) {
              setSnack('Неизвестный ПВЗ');
              return;
            }
            const dist = distanceMeters({ lat: currentLat, lon: currentLon }, pvz);
            if (dist > 100) {
              setSnack('Вне зоны ПВЗ (>100м)');
              return;
            }

            // 1) Запускаем смену в сторе
            await startShift({
              employeeId: 'demo-employee',
              pvzId: parsed.pvzId,
              date: new Date(),
              isOvertime: false,
              notes: undefined,
            } as any);

            // 2) Чистим все напоминания
            await cancelAllShiftReminders();

            setSnack(`Смена начата · ${parsed.pvzId}`);
            // setStatus теперь не нужен - startShift уже обновил store
            setStartedAtMs(Date.now());
            log('Смена начата');
          }}
        />
      ) : null}

      <Snackbar visible={!!snack} onDismiss={() => setSnack(null)} duration={2500}>
        {snack}
      </Snackbar>
    </>
  );
};
