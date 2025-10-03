import React from 'react';
import { View } from 'react-native';
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
  const log = (title: string) => setFeed((prev) => [{ title, at: Date.now() }, ...prev]);

  const startShift = useShiftStore((s) => s.startShift);
  const takeBreak = useShiftStore((s) => s.takeBreak);
  const endBreak = useShiftStore((s) => s.endBreak);
  const endShift = useShiftStore((s) => s.endShift);
  const { pendingCount } = useTasksCounter();

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

  return (
    <>
      <StyledScrollView>
        {/* 1) Информация о смене */}
        <StyledCard title="Информация о смене">
          <View style={{ gap: 6 }}>
            <MetaRow icon="calendar" label={start.toLocaleDateString()} />
            <MetaRow icon="store-outline" label={'Герцена 12'} />
            <MetaRow icon="clock-outline" label={timeRange} />
            <MetaRow icon="cash" label={'2 200 ₽'} />
            <MetaRow
              icon={
                status === 'active' || onBreak
                  ? 'clock-outline'
                  : status === 'finished'
                    ? 'check'
                    : 'progress-clock'
              }
              label={
                status === 'planned'
                  ? 'Не начата'
                  : onBreak
                    ? 'В процессе'
                    : status === 'active'
                      ? 'В процессе'
                      : 'Завершена'
              }
            />
            {startedAtMs ? (
              <MetaRow
                icon="play"
                label={`Начата: ${new Date(startedAtMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              />
            ) : null}
          </View>
          {status === 'planned' ? (
            <StyledButton
              mode="contained"
              icon="qrcode"
              onPress={async () => {
                setScannerVisible(true);
              }}
              style={{ marginTop: 8 }}
            >
              Начать смену
            </StyledButton>
          ) : null}
        </StyledCard>

        {/* 2) Перерывы */}
        <StyledCard title="Перерывы">
          <View style={{ gap: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialCommunityIcons name="coffee" size={16} color="#6B7280" />
                <Text
                  style={{ color: '#6B7280' }}
                >{`Перерывы: ${breaksUsed} / ${BREAKS_ALLOWED}`}</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{ color: '#6B7280', fontWeight: '600' }}
                >{`${Math.floor(BREAK_DURATION_MS / 60000)} мин`}</Text>
              </View>
            </View>
          </View>
          {status === 'active' && !onBreak ? (
            <StyledButton
              mode="outlined"
              icon="coffee"
              onPress={async () => {
                if (breaksUsed >= BREAKS_ALLOWED) {
                  setSnack('Лимит перерывов');
                  return;
                }
                await takeBreak(10); // Используем метод store
                const ts = Date.now();
                setBreakStartedAtMs(ts);
                setBreaksUsed((u) => u + 1);
                setSnack('Перерыв начат');
                log('Взят перерыв');
              }}
              disabled={breaksUsed >= BREAKS_ALLOWED}
              style={{ marginTop: 8 }}
            >
              Взять перерыв
            </StyledButton>
          ) : null}
          {onBreak ? (
            <StyledButton
              mode="contained"
              icon="play"
              onPress={async () => {
                await endBreak(); // Используем метод store
                setBreakStartedAtMs(null);
                setSnack('Перерыв завершён');
              }}
              style={{ marginTop: 8 }}
            >
              Продолжить · {formatLeft(breakLeftMs)}
            </StyledButton>
          ) : null}
          {status === 'planned' ? (
            <Text style={{ color: '#6B7280' }}>Доступно после старта</Text>
          ) : null}
        </StyledCard>

        {/* 3) Завершение смены */}
        <StyledCard title="Завершить смену">
          <StyledButton
            mode="contained"
            icon="stop"
            onPress={() => {
              setFinishConfirmOpen(true);
            }}
            disabled={!(status === 'active') || onBreak}
            style={{ marginTop: 8 }}
          >
            Завершить смену
          </StyledButton>
          {onBreak ? (
            <Text style={{ color: '#6B7280' }}>Нельзя завершить во время перерыва</Text>
          ) : null}
          {status === 'active' && !onBreak && pendingCount > 0 ? (
            <Text style={{ color: '#F59E0B', marginTop: 4 }}>
              ⚠️ У вас {pendingCount} незавершённых задач
            </Text>
          ) : null}
        </StyledCard>

        {/* 4) История */}
        <StyledCard title="История">
          {feed.length === 0 ? (
            <Text style={{ color: '#6B7280' }}>Событий пока нет</Text>
          ) : (
            <View style={{ gap: 6 }}>
              {feed.slice(0, 5).map((e, idx) => (
                <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>{e.title}</Text>
                  <Text style={{ color: '#6B7280' }}>
                    {new Date(e.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </StyledCard>
      </StyledScrollView>

      {/* Диалог подтверждения завершения */}
      <StyledDialog
        visible={finishConfirmOpen}
        onDismiss={() => setFinishConfirmOpen(false)}
        title="Завершить смену?"
        actions={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <StyledButton onPress={() => setFinishConfirmOpen(false)}>Отмена</StyledButton>
            <StyledButton
              mode="contained"
              onPress={async () => {
                if (!onBreak && status === 'active') {
                  await endShift(); // Используем метод store
                  setSnack('Смена завершена');
                  log('Смена завершена');
                }
                setFinishConfirmOpen(false);
              }}
            >
              Завершить
            </StyledButton>
          </View>
        }
      >
        <View style={{ gap: 8 }}>
          <Text>Проверьте, что вы на рабочем месте.</Text>
          {pendingCount > 0 ? (
            <View
              style={{
                backgroundColor: '#FEF3C7',
                padding: 12,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#F59E0B',
              }}
            >
              <Text style={{ color: '#92400E', fontWeight: '600', marginBottom: 4 }}>
                ⚠️ Внимание
              </Text>
              <Text style={{ color: '#92400E' }}>
                У вас осталось {pendingCount} незавершённых {pendingCount === 1 ? 'задача' : pendingCount < 5 ? 'задачи' : 'задач'}.
                Вы уверены, что хотите завершить смену?
              </Text>
            </View>
          ) : null}
          {!canFinishByTime ? (
            <View
              style={{
                backgroundColor: '#DBEAFE',
                padding: 12,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#3B82F6',
              }}
            >
              <Text style={{ color: '#1E40AF', fontWeight: '600', marginBottom: 4 }}>
                ℹ️ Ранее планового времени
              </Text>
              <Text style={{ color: '#1E40AF' }}>
                Плановое время окончания: {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ) : null}
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
