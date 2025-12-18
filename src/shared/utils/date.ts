export const WEEKDAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Реализуем addMonths вручную, чтобы не зависеть от date-fns
export function addMonths(d: Date, months: number): Date {
  const x = new Date(d);
  const origDay = x.getDate();
  // Ставим 1-е число, чтобы избежать переполнения при смене месяца
  x.setDate(1);
  x.setMonth(x.getMonth() + months);
  // Возвращаем исходный день, но не превышая последнего дня нового месяца
  const lastDay = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
  x.setDate(Math.min(origDay, lastDay));
  return x;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function startOfWeekMon(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - day);
  return x;
}

export function endOfWeekSun(d: Date): Date {
  const x = startOfWeekMon(d);
  x.setDate(x.getDate() + 6);
  return x;
}

export function weekdayMonIndex(d: Date): number {
  return (d.getDay() + 6) % 7; // Mon=0
}

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
