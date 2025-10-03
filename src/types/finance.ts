// Финансовые типы данных для сотрудника ПВЗ

export type PenaltyCategory =
  | 'speed' // Скорость приёмки
  | 'defect_50' // Брак – 50% стоимости
  | 'substitution_100' // Подмена – 100% стоимости
  | 'bad_rating' // Плохая оценка клиента (300–600 ₽)
  | 'stuck_100'; // Зависший товар – 100% стоимости

export interface Payment {
  id: string;
  type: 'salary' | 'bonus' | 'penalty' | 'overtime' | 'advance';
  amount: number; // Отрицательная сумма для штрафов
  description: string;
  date: Date;
  period: string; // YYYY-MM
  shiftId?: string;
  pvzId: string;
  status: 'pending' | 'paid' | 'cancelled';
  // Детализация штрафов (только для type === 'penalty')
  penaltyCategory?: PenaltyCategory;
  // Исходная стоимость товара, если штраф процентный
  relatedItemPrice?: number;
}

export interface ShiftPayment {
  shiftId: string;
  shiftDate: Date;
  hoursWorked: number;
  baseRate: number;
  overtimeHours: number;
  overtimeRate: number;
  bonuses: number;
  penalties: number;
  totalAmount: number;
  pvzName: string;
  pvzAddress?: string;
  penaltyDetails?: Array<{
    category: PenaltyCategory;
    amount: number; // отрицательное
    relatedItemPrice?: number;
    description?: string;
  }>;
}

export interface FinancialSummary {
  currentMonth: {
    totalEarned: number;
    totalPaid: number;
    pendingPayments: number;
    bonuses: number;
    penalties: number;
    overtimeHours: number;
    shiftsCount: number; // Количество смен за период
  };
  // Текущий расчетный период (с последней выплаты до сегодня)
  currentPayoutPeriod: {
    startDate: Date; // включительно
    endDate: Date; // сегодня
    toPay: number; // К выплате: сумма всех начислений минус штрафы за период
    bonuses: number; // Сумма премий
    penalties: number; // Сумма штрафов (отрицательная)
    shiftsCount: number; // Кол-во смен в периоде
  };
  yearToDate: {
    totalEarned: number;
    totalPaid: number;
    totalBonuses: number;
    totalPenalties: number;
  };
  averageMonthly: number;
  nextPaymentDate?: Date;
  payoutPolicy?: 'biweekly'; // 1 и 15 числа месяца
}

export interface Period {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  paymentCount: number;
}

export interface PaymentFilter {
  period?: 'current_month' | 'last_month' | 'last_3_months' | 'year_to_date' | 'custom';
  type?: Payment['type'][];
  status?: Payment['status'][];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  period: Period;
  includeDetails: boolean;
  includeShifts: boolean;
}
