// Сервис для работы с финансовыми данными сотрудника

import { Payment, ShiftPayment, FinancialSummary, Period, PaymentFilter } from '../types/finance';

// Реалистичная генерация исторических данных (последние ~6 месяцев),
// разбивка по двухнедельным периодам, разнообразные типы выплат
function generateMockPayments(): Payment[] {
  const result: Payment[] = [];
  let idCounter = 1;
  const now = new Date();

  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const chance = (p: number) => Math.random() < p;

  for (let back = 0; back < 2; back++) {
    const d = new Date(now.getFullYear(), now.getMonth() - back, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const endOfMonth = new Date(y, m + 1, 0).getDate();
    const periodStr = `${y}-${String(m + 1).padStart(2, '0')}`;

    // Аванс в начале месяца (в прошлом всегда выплачен)
    result.push({
      id: `p${idCounter++}`,
      type: 'advance',
      amount: randInt(1000, 3000),
      description: 'Аванс',
      date: new Date(y, m, 1),
      period: periodStr,
      pvzId: 'pvz1',
      status: 'paid',
    });

    // Две половины месяца: 1–14 и 15–конец
    const halves: Array<{ start: number; end: number }> = [
      { start: 1, end: Math.min(14, endOfMonth) },
      { start: 15, end: endOfMonth },
    ];

    halves.forEach(({ start, end }) => {
      // Кол-во смен в половине месяца
      const shifts = randInt(5, 8);
      const usedDays = new Set<number>();
      for (let i = 0; i < shifts; i++) {
        let day = randInt(start, end);
        // гарантируем, что в один день только одна зарплата
        let guard = 0;
        while (usedDays.has(day) && guard < 10) {
          day = randInt(start, end);
          guard++;
        }
        usedDays.add(day);
        const base = randInt(2100, 2600); // Зарплата за смену
        result.push({
          id: `p${idCounter++}`,
          type: 'salary',
          amount: base,
          description: 'Зарплата за смену',
          date: new Date(y, m, day),
          period: periodStr,
          shiftId: `shift_${periodStr}_${day}`,
          pvzId: 'pvz1',
          status: 'paid',
        });
      }

      // Переработка (иногда)
      if (chance(0.5)) {
        const day = randInt(start, end);
        result.push({
          id: `p${idCounter++}`,
          type: 'overtime',
          amount: randInt(300, 1200),
          description: 'Переработка',
          date: new Date(y, m, day),
          period: periodStr,
          pvzId: 'pvz1',
          status: 'paid',
        });
      }

      // Премия (иногда)
      if (chance(0.4)) {
        const day = randInt(start, end);
        result.push({
          id: `p${idCounter++}`,
          type: 'bonus',
          amount: randInt(300, 1500),
          description: 'Премия',
          date: new Date(y, m, day),
          period: periodStr,
          pvzId: 'pvz1',
          status: 'paid',
        });
      }

      // Штрафы: для текущего месяца (back=0) гарантируем несколько штрафов для тестирования
      const penaltyChance = back === 0 ? 0.8 : 0.25; // 80% для текущего, 25% для прошлых
      if (chance(penaltyChance)) {
        const day = randInt(start, end);
        if (chance(0.5)) {
          result.push({
            id: `p${idCounter++}`,
            type: 'penalty',
            amount: -randInt(300, 800),
            description: 'Штраф',
            penaltyCategory: 'bad_rating',
            date: new Date(y, m, day),
            period: periodStr,
            pvzId: 'pvz1',
            status: 'paid',
          });
        } else {
          const itemPrice = randInt(2000, 10000);
          const fifty = Math.round(itemPrice * 0.5);
          result.push({
            id: `p${idCounter++}`,
            type: 'penalty',
            amount: -fifty,
            description: 'Брак – удержание 50% стоимости',
            penaltyCategory: 'defect_50',
            relatedItemPrice: itemPrice,
            date: new Date(y, m, day),
            period: periodStr,
            pvzId: 'pvz1',
            status: 'paid',
          });
        }
      }
    });

    // Гарантируем разнообразие на уровне месяца: минимум один штраф, бонус и переработка
    const hasPenalty = result.some((p) => p.period === periodStr && p.type === 'penalty');
    if (!hasPenalty) {
      const day = randInt(5, Math.max(5, endOfMonth - 5));
      const itemPrice = randInt(2000, 10000);
      const fifty = Math.round(itemPrice * 0.5);
      result.push({
        id: `p${idCounter++}`,
        type: 'penalty',
        amount: chance(0.5) ? -randInt(300, 800) : -fifty,
        description: chance(0.5) ? 'Штраф' : 'Брак – удержание 50% стоимости',
        penaltyCategory: chance(0.5) ? 'bad_rating' : 'defect_50',
        relatedItemPrice: fifty ? itemPrice : undefined,
        date: new Date(y, m, day),
        period: periodStr,
        pvzId: 'pvz1',
        status: 'paid',
      });
    }

    // Для текущего месяца (back=0) добавляем дополнительные штрафы для тестирования
    if (back === 0) {
      // Подмена товара (100% стоимости)
      const itemPrice1 = randInt(3000, 8000);
      result.push({
        id: `p${idCounter++}`,
        type: 'penalty',
        amount: -itemPrice1,
        description: 'Подмена товара',
        penaltyCategory: 'substitution_100',
        relatedItemPrice: itemPrice1,
        date: new Date(y, m, randInt(1, endOfMonth)),
        period: periodStr,
        pvzId: 'pvz1',
        status: 'paid',
      });

      // Зависший товар (100% стоимости)
      const itemPrice2 = randInt(2500, 6000);
      result.push({
        id: `p${idCounter++}`,
        type: 'penalty',
        amount: -itemPrice2,
        description: 'Зависший товар',
        penaltyCategory: 'stuck_100',
        relatedItemPrice: itemPrice2,
        date: new Date(y, m, randInt(1, endOfMonth)),
        period: periodStr,
        pvzId: 'pvz1',
        status: 'paid',
      });

      // Еще один штраф за плохую оценку
      result.push({
        id: `p${idCounter++}`,
        type: 'penalty',
        amount: -randInt(400, 900),
        description: 'Плохая оценка от клиента',
        penaltyCategory: 'bad_rating',
        date: new Date(y, m, randInt(1, endOfMonth)),
        period: periodStr,
        pvzId: 'pvz1',
        status: 'paid',
      });
    }

    const hasBonus = result.some((p) => p.period === periodStr && p.type === 'bonus');
    if (!hasBonus) {
      const day = randInt(3, Math.max(3, endOfMonth - 3));
      result.push({
        id: `p${idCounter++}`,
        type: 'bonus',
        amount: randInt(300, 1500),
        description: 'Премия',
        date: new Date(y, m, day),
        period: periodStr,
        pvzId: 'pvz1',
        status: 'paid',
      });
    }

    const hasOvertime = result.some((p) => p.period === periodStr && p.type === 'overtime');
    if (!hasOvertime) {
      const day = randInt(7, Math.max(7, endOfMonth - 2));
      result.push({
        id: `p${idCounter++}`,
        type: 'overtime',
        amount: randInt(300, 1200),
        description: 'Переработка',
        date: new Date(y, m, day),
        period: periodStr,
        pvzId: 'pvz1',
        status: 'paid',
      });
    }
  }

  // Отсортируем по дате по убыванию для удобства
  return result.sort((a, b) => b.date.getTime() - a.date.getTime());
}

const mockPayments: Payment[] = generateMockPayments();

// Динамическая генерация смен для текущего месяца
function generateMockShiftPayments(): ShiftPayment[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Начало текущего периода (1 или 15 число)
  const periodStart = now.getDate() <= 15
    ? new Date(currentYear, currentMonth, 1)
    : new Date(currentYear, currentMonth, 15);
  
  // Конец текущего периода (14 или последнее число месяца)
  const periodEnd = now.getDate() <= 15
    ? new Date(currentYear, currentMonth, 14)
    : new Date(currentYear, currentMonth + 1, 0);
  
  const shifts: ShiftPayment[] = [];
  let shiftId = 1;
  
  // Генерируем смены для каждого дня текущего периода (кроме воскресений)
  for (let d = new Date(periodStart); d <= periodEnd && d <= now; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    // Пропускаем воскресенье (0)
    if (dayOfWeek === 0) continue;
    
    const shiftDate = new Date(d);
    const hours = 12;
    const baseRate = 200;
    const base = baseRate * hours;
    
    // Случайно добавляем переработку (30% вероятность)
    const hasOvertime = Math.random() < 0.3;
    const overtimeHours = hasOvertime ? Math.floor(Math.random() * 3) + 1 : 0;
    
    // Случайно добавляем премию (20% вероятность)
    const hasBonus = Math.random() < 0.2;
    const bonus = hasBonus ? Math.floor(Math.random() * 700) + 300 : 0;
    
    // Штрафы с разной вероятностью и типами
    let penalty = 0;
    let penaltyDetails: ShiftPayment['penaltyDetails'] = undefined;
    
    const penaltyRand = Math.random();
    if (penaltyRand < 0.15) {
      // 15% - серьёзный штраф (подмена, брак, зависший)
      const penaltyType = Math.random();
      if (penaltyType < 0.33) {
        // Подмена товара (100%)
        const itemPrice = Math.floor(Math.random() * 4000) + 3000;
        penalty = -itemPrice;
        penaltyDetails = [{
          category: 'substitution_100',
          amount: -itemPrice,
          relatedItemPrice: itemPrice,
          description: 'Подмена товара',
        }];
      } else if (penaltyType < 0.66) {
        // Брак (50%)
        const itemPrice = Math.floor(Math.random() * 6000) + 2000;
        const penaltyAmount = Math.floor(itemPrice * 0.5);
        penalty = -penaltyAmount;
        penaltyDetails = [{
          category: 'defect_50',
          amount: -penaltyAmount,
          relatedItemPrice: itemPrice,
          description: 'Брак – не проверено под камерой',
        }];
      } else {
        // Зависший товар (100%)
        const itemPrice = Math.floor(Math.random() * 5000) + 2500;
        penalty = -itemPrice;
        penaltyDetails = [{
          category: 'stuck_100',
          amount: -itemPrice,
          relatedItemPrice: itemPrice,
          description: 'Зависший товар',
        }];
      }
    } else if (penaltyRand < 0.25) {
      // 10% - средний штраф (плохая оценка, опоздание)
      const amount = Math.floor(Math.random() * 400) + 200;
      penalty = -amount;
      penaltyDetails = [{
        category: 'bad_rating',
        amount: -amount,
        description: 'Плохая оценка клиента',
      }];
    }
    
    shifts.push({
      shiftId: `shift${shiftId++}`,
      shiftDate,
      hoursWorked: hours,
      baseRate,
      overtimeHours,
      overtimeRate: 200,
      bonuses: bonus,
      penalties: penalty,
      totalAmount: base + (overtimeHours * 200) + bonus + penalty,
      pvzName: 'ПВЗ Герцена 12',
      pvzAddress: 'г. Новосибирск, ул. Герцена, 12',
      penaltyDetails,
    });
  }
  
  return shifts;
}

export class FinanceService {
  /**
   * Получить сводку финансов сотрудника
   */
  async getFinancialSummary(employeeId: string): Promise<FinancialSummary> {
    // Имитация API запроса
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthPayments = mockPayments.filter(
      (p) => p.date.getMonth() === currentMonth && p.date.getFullYear() === currentYear,
    );

    const totalEarned = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = currentMonthPayments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = currentMonthPayments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const bonuses = currentMonthPayments
      .filter((p) => p.type === 'bonus')
      .reduce((sum, p) => sum + p.amount, 0);

    const penalties = currentMonthPayments
      .filter((p) => p.type === 'penalty')
      .reduce((sum, p) => sum + p.amount, 0);

    // Генерируем смены для расчётов
    const mockShiftPayments = generateMockShiftPayments();

    // Расчет переработок и смен
    const overtimeHours = mockShiftPayments
      .filter((s) => s.shiftDate.getMonth() === currentMonth)
      .reduce((sum, s) => sum + s.overtimeHours, 0);
    const shiftsCount = mockShiftPayments.filter(
      (s) => s.shiftDate.getMonth() === currentMonth,
    ).length;

    // Следующая выплата — раз в 2 недели (би-вайкли). Для простоты: 1 и 15 число
    const now = new Date();
    const nextPaymentDate = (() => {
      const y = now.getFullYear();
      const m = now.getMonth();
      const day = now.getDate();
      if (day <= 1) return new Date(y, m, 1);
      if (day <= 15) return new Date(y, m, 15);
      // иначе — 1 число следующего месяца
      if (m === 11) return new Date(y + 1, 0, 1);
      return new Date(y, m + 1, 1);
    })();

    // Текущий расчетный период: от предыдущей выплаты (1 или 15 число) до сегодня
    const periodStart = (() => {
      const y = now.getFullYear();
      const m = now.getMonth();
      const day = now.getDate();
      if (day <= 15) {
        // c 1 по 15
        return new Date(y, m, 1);
      }
      // c 16 по 31 — старт 15 числа
      return new Date(y, m, 15);
    })();

    const isInCurrentPayoutPeriod = (date: Date) => date >= periodStart && date <= now;

    const periodPayments = mockPayments.filter((p) => isInCurrentPayoutPeriod(p.date));
    const periodToPay = periodPayments.reduce((sum, p) => sum + p.amount, 0);
    const periodBonuses = periodPayments
      .filter((p) => p.type === 'bonus')
      .reduce((s, p) => s + p.amount, 0);
    const periodPenalties = periodPayments
      .filter((p) => p.type === 'penalty')
      .reduce((s, p) => s + p.amount, 0);
    const periodShifts = mockShiftPayments.filter((s) =>
      isInCurrentPayoutPeriod(s.shiftDate),
    ).length;

    return {
      currentMonth: {
        totalEarned,
        totalPaid,
        pendingPayments,
        bonuses,
        penalties,
        overtimeHours,
        shiftsCount,
      },
      currentPayoutPeriod: {
        startDate: periodStart,
        endDate: now,
        toPay: periodToPay,
        bonuses: periodBonuses,
        penalties: periodPenalties,
        shiftsCount: periodShifts,
      },
      yearToDate: {
        totalEarned: 45000,
        totalPaid: 42000,
        totalBonuses: 5000,
        totalPenalties: -1200,
      },
      averageMonthly: 3750,
      nextPaymentDate,
      payoutPolicy: 'biweekly',
    };
  }

  /**
   * Получить список платежей с фильтрами
   */
  async getPayments(employeeId: string, filter?: PaymentFilter): Promise<Payment[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredPayments = [...mockPayments];

    if (filter) {
      // Фильтр по периоду
      if (filter.period) {
        const now = new Date();
        switch (filter.period) {
          case 'current_month':
            filteredPayments = filteredPayments.filter(
              (p) =>
                p.date.getMonth() === now.getMonth() && p.date.getFullYear() === now.getFullYear(),
            );
            break;
          case 'last_month': {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            filteredPayments = filteredPayments.filter(
              (p) =>
                p.date.getMonth() === lastMonth.getMonth() &&
                p.date.getFullYear() === lastMonth.getFullYear(),
            );
            break;
          }
          case 'year_to_date':
            filteredPayments = filteredPayments.filter(
              (p) => p.date.getFullYear() === now.getFullYear(),
            );
            break;
          case 'last_3_months':
            {
              const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
              const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
              filteredPayments = filteredPayments.filter((p) => p.date >= start && p.date <= end);
            }
            break;
        }
      }

      // Фильтр по типу
      if (filter.type && filter.type.length > 0) {
        filteredPayments = filteredPayments.filter((p) => filter.type!.includes(p.type));
      }

      // Диапазон дат
      if (filter.dateRange) {
        const { start, end } = filter.dateRange;
        filteredPayments = filteredPayments.filter((p) => p.date >= start && p.date <= end);
      }

      // Фильтр по статусу
      if (filter.status && filter.status.length > 0) {
        filteredPayments = filteredPayments.filter((p) => filter.status!.includes(p.status));
      }
    }

    return filteredPayments.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Получить расчеты по сменам
   */
  async getShiftPayments(employeeId: string, month?: Date): Promise<ShiftPayment[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Генерируем смены каждый раз при запросе
    const mockShiftPayments = generateMockShiftPayments();

    if (month) {
      return mockShiftPayments.filter(
        (s) =>
          s.shiftDate.getMonth() === month.getMonth() &&
          s.shiftDate.getFullYear() === month.getFullYear(),
      );
    }

    return mockShiftPayments;
  }

  /**
   * Получить доступные периоды
   */
  async getAvailablePeriods(employeeId: string): Promise<Period[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Собираем доступные месяцы по данным mockPayments
    const map = new Map<string, Period>();
    for (const p of mockPayments) {
      const [y, mm] = p.period.split('-');
      const year = Number(y);
      const monthIndex = Number(mm) - 1; // 0-based
      const id = p.period;
      const label = new Date(year, monthIndex, 1).toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric',
      });
      const exist = map.get(id);
      if (!exist) {
        map.set(id, {
          id,
          label: label.charAt(0).toUpperCase() + label.slice(1),
          startDate: new Date(year, monthIndex, 1),
          endDate: new Date(year, monthIndex + 1, 0),
          totalAmount: p.amount,
          paymentCount: 1,
        });
      } else {
        exist.totalAmount += p.amount;
        exist.paymentCount += 1;
      }
    }
    const periods = Array.from(map.values()).sort(
      (a, b) => b.startDate.getTime() - a.startDate.getTime(),
    );
    return periods;
  }

  /**
   * Экспорт финансового отчета
   */
  async exportReport(
    employeeId: string,
    periodId: string,
    format: 'pdf' | 'excel' | 'csv' = 'pdf',
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Имитация генерации файла
    const fileName = `finance_report_${periodId}.${format}`;
    return fileName;
  }
}

export const financeService = new FinanceService();
