import { create } from 'zustand';
import type { FinanceOperation, PayoutPeriod, FinanceSummary } from '../../../shared/types/finance';

// ================================
// MOCK DATA
// ================================

const generateMockOperations = (): FinanceOperation[] => {
    const operations: FinanceOperation[] = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Текущий период: смены
    const shiftDates = [27, 26, 25, 24, 22, 21, 20, 18, 17, 16];
    shiftDates.forEach((day, idx) => {
        if (day <= now.getDate()) {
            operations.push({
                id: `shift-${day}`,
                type: 'shift',
                amount: 2200,
                description: 'Смена 10:00–22:00',
                date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                createdAt: new Date(currentYear, currentMonth, day, 22, 30).toISOString(),
                shiftId: `shift-${currentYear}${currentMonth}${day}`,
                hoursWorked: 12,
                hourlyRate: 183,
            });
        }
    });

    // Бонусы
    operations.push({
        id: 'bonus-1',
        type: 'bonus',
        amount: 1500,
        description: 'Выполнение плана приёмки',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-23`,
        createdAt: new Date(currentYear, currentMonth, 23, 18, 0).toISOString(),
        bonusCategory: 'plan_completion',
    });

    operations.push({
        id: 'bonus-2',
        type: 'bonus',
        amount: 800,
        description: 'Высокий рейтинг клиентов',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-19`,
        createdAt: new Date(currentYear, currentMonth, 19, 18, 0).toISOString(),
        bonusCategory: 'efficiency',
    });

    // Штрафы
    operations.push({
        id: 'penalty-1',
        type: 'penalty',
        amount: -300,
        description: 'Опоздание 20 минут',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-21`,
        createdAt: new Date(currentYear, currentMonth, 21, 10, 25).toISOString(),
        penaltyCategory: 'late',
        penaltyComment: 'Зафиксировано системой геолокации',
    });

    // Сортировка по дате (новые сверху)
    return operations.sort((a, b) => b.date.localeCompare(a.date));
};

const generateCurrentPeriod = (operations: FinanceOperation[]): PayoutPeriod => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();

    // Определяем период: 1-15 или 16-конец месяца
    const isFirstHalf = currentDay <= 15;
    const startDay = isFirstHalf ? 1 : 16;
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const endDay = isFirstHalf ? 15 : lastDayOfMonth;

    const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
    const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

    // Фильтруем операции текущего периода
    const periodOps = operations.filter(op => op.date >= startDate && op.date <= endDate);

    // Подсчёт сумм
    const shiftsTotal = periodOps.filter(op => op.type === 'shift').reduce((sum, op) => sum + op.amount, 0);
    const overtimeTotal = periodOps.filter(op => op.type === 'overtime').reduce((sum, op) => sum + op.amount, 0);
    const bonusesTotal = periodOps.filter(op => op.type === 'bonus').reduce((sum, op) => sum + op.amount, 0);
    const penaltiesTotal = periodOps.filter(op => op.type === 'penalty').reduce((sum, op) => sum + op.amount, 0);

    const shiftsCount = periodOps.filter(op => op.type === 'shift').length;
    const hoursWorked = periodOps.filter(op => op.type === 'shift').reduce((sum, op) => sum + (op.hoursWorked || 0), 0);

    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    return {
        id: `period-${startDate}`,
        startDate,
        endDate,
        label: `${startDay}–${endDay} ${months[currentMonth]}`,
        shiftsTotal,
        overtimeTotal,
        bonusesTotal,
        penaltiesTotal,
        grandTotal: shiftsTotal + overtimeTotal + bonusesTotal + penaltiesTotal,
        shiftsCount,
        hoursWorked,
        status: 'current',
        expectedPayoutDate: isFirstHalf
            ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-16`
            : `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`,
    };
};

const generatePayoutHistory = (): PayoutPeriod[] => {
    const now = new Date();
    const history: PayoutPeriod[] = [];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    // Генерируем 6 прошлых периодов
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();
    let isFirstHalf = now.getDate() > 15 ? true : false; // Начинаем с предыдущего периода

    for (let i = 0; i < 6; i++) {
        if (isFirstHalf) {
            // Период 1-15
            isFirstHalf = false;
        } else {
            // Период 16-конец, переходим к предыдущему месяцу
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            isFirstHalf = true;
        }

        const startDay = isFirstHalf ? 16 : 1;
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const endDay = isFirstHalf ? lastDayOfMonth : 15;

        const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
        const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

        // Случайные суммы
        const shiftsTotal = Math.floor(Math.random() * 8000) + 15000;
        const bonusesTotal = Math.floor(Math.random() * 2000);
        const penaltiesTotal = Math.random() > 0.7 ? -Math.floor(Math.random() * 500) : 0;

        history.push({
            id: `period-${startDate}`,
            startDate,
            endDate,
            label: `${startDay}–${endDay} ${months[currentMonth]}`,
            shiftsTotal,
            overtimeTotal: 0,
            bonusesTotal,
            penaltiesTotal,
            grandTotal: shiftsTotal + bonusesTotal + penaltiesTotal,
            shiftsCount: Math.floor(Math.random() * 5) + 6,
            hoursWorked: Math.floor(Math.random() * 40) + 60,
            status: 'paid',
            paidAt: new Date(currentYear, currentMonth, isFirstHalf ? 1 : 16).toISOString(),
        });
    }

    return history;
};

// ================================
// STORE
// ================================

interface FinanceState {
    // Данные
    operations: FinanceOperation[];
    currentPeriod: PayoutPeriod | null;
    payoutHistory: PayoutPeriod[];

    // Статистика
    totalEarnedAllTime: number;
    totalEarnedThisMonth: number;
    averageMonthly: number;
    currentHourlyRate: number;

    // UI состояние
    isLoading: boolean;
    selectedOperationId: string | null;

    // Действия
    loadFinanceData: () => void;
    selectOperation: (id: string | null) => void;
    getOperationsByType: (type: FinanceOperation['type']) => FinanceOperation[];
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
    // Начальное состояние
    operations: [],
    currentPeriod: null,
    payoutHistory: [],
    totalEarnedAllTime: 0,
    totalEarnedThisMonth: 0,
    averageMonthly: 0,
    currentHourlyRate: 183,
    isLoading: true,
    selectedOperationId: null,

    loadFinanceData: () => {
        const operations = generateMockOperations();
        const currentPeriod = generateCurrentPeriod(operations);
        const payoutHistory = generatePayoutHistory();

        // Подсчёт статистики
        const totalEarnedAllTime = payoutHistory.reduce((sum, p) => sum + p.grandTotal, 0) + currentPeriod.grandTotal;
        const now = new Date();
        const thisMonthOps = operations.filter(op => {
            const opDate = new Date(op.date);
            return opDate.getMonth() === now.getMonth() && opDate.getFullYear() === now.getFullYear();
        });
        const totalEarnedThisMonth = thisMonthOps.reduce((sum, op) => sum + op.amount, 0);
        const averageMonthly = Math.round(totalEarnedAllTime / (payoutHistory.length / 2 + 1));

        set({
            operations,
            currentPeriod,
            payoutHistory,
            totalEarnedAllTime,
            totalEarnedThisMonth,
            averageMonthly,
            isLoading: false,
        });
    },

    selectOperation: (id) => set({ selectedOperationId: id }),

    getOperationsByType: (type) => get().operations.filter(op => op.type === type),
}));
