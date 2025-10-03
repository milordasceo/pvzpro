import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type ShiftInfo = {
  date: Date;
  startHour: number; // 0-23
  startMinute?: number; // 0-59, default 0
  title?: string;
  body?: string;
};

export async function initializeNotifications(): Promise<boolean> {
  // Android: показать уведомления, когда приложение на переднем плане
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      // поля новых SDK для Android 14+ уведомлений (могут игнорироваться на iOS)
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Общие уведомления',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    } catch {}
  }

  // Обработчик нажатий — навигационные данные в payload
  Notifications.addNotificationResponseReceivedListener((response) => {
    try {
      const data = response.notification.request.content.data as any;
      const route = data?.route as string | undefined;
      const tab = data?.tab as string | undefined;
      const subtab = data?.subtab as string | undefined;
      // навигация делается в App через глобальный ref (см. addNotificationTapNavigator)
      if (typeof addNotificationTapNavigator === 'function') {
        addNotificationTapNavigator({ route, tab, subtab });
      }
    } catch (e) {
      console.warn('notification tap handler error', e);
    }
  });

  const settings = await Notifications.getPermissionsAsync();
  if (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED
  ) {
    return true;
  }
  const req = await Notifications.requestPermissionsAsync();
  return req.granted || req.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
}

export async function scheduleShiftReminder(shift: ShiftInfo): Promise<string | null> {
  try {
    const start = new Date(shift.date);
    start.setHours(shift.startHour, shift.startMinute ?? 0, 0, 0);

    const triggerAt = new Date(start.getTime() - 10 * 60 * 1000);
    const now = new Date();
    if (triggerAt.getTime() <= now.getTime()) {
      // Если уже прошло — не планируем
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: shift.title ?? 'Смена скоро начнётся',
        body: shift.body ?? 'Через 10 минут начало смены. Подготовьтесь к открытию.',
        data: {
          type: 'shift_reminder',
          startAt: start.toISOString(),
          route: 'Main',
          tab: 'Моя смена',
          subtab: 'Обзор',
        },
      },
      trigger: {
        seconds: Math.max(1, Math.floor((triggerAt.getTime() - now.getTime()) / 1000)),
        repeats: false,
        channelId: Platform.OS === 'android' ? 'default' : undefined,
      } as any,
    });
    return id;
  } catch (e) {
    console.warn('scheduleShiftReminder error', e);
    return null;
  }
}

export async function cancelAllShiftReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Планирует ближайшее напоминание на основе двух через два с началом в 10:00.
 * Ищет ближайшие 4 дня, пока не найдёт рабочий день в будущем.
 */
export async function scheduleNextShiftReminderTwoOnTwo(
  startHour: number = 10,
): Promise<string | null> {
  const now = new Date();
  for (let i = 0; i < 4; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    const isWork = isWorkDayTwoOnTwoOff(date);
    if (!isWork) continue;
    const id = await scheduleShiftReminder({
      date,
      startHour,
      title: `Смена в ${String(startHour).padStart(2, '0')}:00`,
    });
    if (id) return id;
  }
  return null;
}

// Локальная копия правила двух через два (якорь 2025-01-01)
function isWorkDayTwoOnTwoOff(d: Date): boolean {
  const anchor = new Date(2025, 0, 1);
  anchor.setHours(0, 0, 0, 0);
  const msPerDay = 24 * 60 * 60 * 1000;
  const onlyDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.floor((onlyDate.getTime() - anchor.getTime()) / msPerDay);
  const mod = ((diff % 4) + 4) % 4; // 0,1 — работа; 2,3 — выходной
  return mod === 0 || mod === 1;
}

// Глобальный колбэк регистрируется в App для выполнения навигации из контекста уведомлений
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let addNotificationTapNavigator:
  | ((payload: { route?: string; tab?: string; subtab?: string }) => void)
  | undefined;
export function registerNotificationTapNavigator(fn: typeof addNotificationTapNavigator) {
  addNotificationTapNavigator = fn;
}
