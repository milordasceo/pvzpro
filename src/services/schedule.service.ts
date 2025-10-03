export type DayState = 'work' | 'off';

function anchorDate(): Date {
  const d = new Date(2025, 0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isWorkDayTwoOnTwoOff(d: Date): boolean {
  const anchor = anchorDate();
  const msPerDay = 24 * 60 * 60 * 1000;
  const onlyDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.floor((onlyDate.getTime() - anchor.getTime()) / msPerDay);
  const mod = ((diff % 4) + 4) % 4; // 0,1 — работа; 2,3 — выходной
  return mod === 0 || mod === 1;
}

export function getDayState(d: Date): DayState {
  return isWorkDayTwoOnTwoOff(d) ? 'work' : 'off';
}

export function findNextWorkDay(from: Date = new Date(), limitDays: number = 60): Date | null {
  for (let i = 0; i < limitDays; i++) {
    const date = new Date(from);
    date.setDate(from.getDate() + i);
    if (isWorkDayTwoOnTwoOff(date)) return date;
  }
  return null;
}
