/**
 * Утилиты для форматирования данных
 */

/**
 * Форматирует время в формат HH:MM
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Форматирует дату в формат DD.MM.YYYY
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Форматирует дату и время в формат DD.MM.YYYY HH:MM
 */
export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Форматирует сумму в рубли
 */
export const formatMoney = (amount: number): string => {
  return `${amount.toLocaleString('ru-RU')} ₽`;
};

