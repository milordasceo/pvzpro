// Финансовые типы данных для учёта заработка сотрудника ПВЗ
// Деньги НЕ проходят через приложение — только учёт и отображение

/**
 * Тип финансовой операции
 */
export type FinanceOperationType =
  | 'shift'        // Оплата за смену
  | 'overtime'     // Переработка
  | 'bonus'        // Премия/бонус
  | 'penalty';     // Штраф

/**
 * Категория штрафа
 */
export type PenaltyCategory =
  | 'late'              // Опоздание
  | 'early_leave'       // Ранний уход
  | 'defect'            // Брак товара
  | 'substitution'      // Подмена товара
  | 'bad_rating'        // Плохая оценка клиента
  | 'inventory_error'   // Ошибка инвентаризации
  | 'other';            // Прочее

/**
 * Категория бонуса
 */
export type BonusCategory =
  | 'plan_completion'   // Выполнение плана
  | 'efficiency'        // Эффективность
  | 'no_penalties'      // Без штрафов за период
  | 'extra_shift'       // Дополнительная смена
  | 'holiday'           // Праздничные
  | 'other';            // Прочее

/**
 * Финансовая операция (начисление или списание)
 */
export interface FinanceOperation {
  id: string;
  type: FinanceOperationType;
  amount: number;           // Положительная для начислений, отрицательная для штрафов
  description: string;
  date: string;             // YYYY-MM-DD
  createdAt: string;        // ISO timestamp

  // Связь со сменой (для type === 'shift' | 'overtime')
  shiftId?: string;
  hoursWorked?: number;
  hourlyRate?: number;

  // Детали бонуса
  bonusCategory?: BonusCategory;

  // Детали штрафа
  penaltyCategory?: PenaltyCategory;
  penaltyComment?: string;  // Комментарий менеджера
}

/**
 * Расчётный период (1-15 или 16-конец месяца)
 */
export interface PayoutPeriod {
  id: string;
  startDate: string;        // YYYY-MM-DD
  endDate: string;          // YYYY-MM-DD
  label: string;            // "1–15 декабря"

  // Суммы
  shiftsTotal: number;      // Сумма за смены
  overtimeTotal: number;    // Сумма за переработки
  bonusesTotal: number;     // Сумма бонусов
  penaltiesTotal: number;   // Сумма штрафов (отрицательная)
  grandTotal: number;       // Итого к выплате

  // Статистика
  shiftsCount: number;      // Кол-во смен
  hoursWorked: number;      // Часов отработано

  // Статус
  status: 'current' | 'pending_payout' | 'paid';
  paidAt?: string;          // Дата выплаты (ISO)
  expectedPayoutDate?: string; // Ожидаемая дата выплаты
}

/**
 * Сводка по финансам сотрудника
 */
export interface FinanceSummary {
  // Текущий период (ещё не выплачен)
  currentPeriod: PayoutPeriod;

  // Статистика
  totalEarnedAllTime: number;   // Всего заработано за всё время
  totalEarnedThisMonth: number; // Заработано в этом месяце
  averageMonthly: number;       // Средний заработок в месяц
  currentHourlyRate: number;    // Текущая почасовая ставка

  // История операций текущего периода
  currentOperations: FinanceOperation[];

  // История выплат (прошлые периоды)
  payoutHistory: PayoutPeriod[];
}

/**
 * Фильтр для просмотра операций
 */
export interface FinanceFilter {
  period?: 'current' | 'last_period' | 'this_month' | 'last_month' | 'custom';
  type?: FinanceOperationType[];
  dateRange?: {
    start: string;
    end: string;
  };
}
