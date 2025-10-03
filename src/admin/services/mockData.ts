/**
 * Моковые данные для функционала администратора
 * Используются для разработки и тестирования UI
 */

import {
  Admin,
  AdminPvz,
  AdminEmployee,
  AdminShift,
  AdminTransaction,
  AdminTask,
  ScheduleRequest,
  AdminPermissions,
} from '../../types/admin';

// ============================================
// БАЗОВЫЕ ПРАВА АДМИНИСТРАТОРА
// ============================================

export const DEFAULT_ADMIN_PERMISSIONS: AdminPermissions = {
  // Базовые права
  canManageEmployees: true,
  canManageSchedule: true,
  canManageFinance: true,
  canEditPvzSettings: true,
  
  // Расширенные права
  canCreatePvz: true,
  canDeletePvz: false,
  canInviteAdmins: false,
};

// ============================================
// АДМИНИСТРАТОР
// ============================================

export const MOCK_ADMIN: Admin = {
  id: 'admin-001',
  userId: 'user-admin-001',
  name: 'Мария Петрова',
  email: 'maria.petrova@example.com',
  phone: '+7 (900) 123-45-67',
  avatar: 'https://i.pravatar.cc/150?img=5',
  role: 'admin',
  managedPvzIds: ['pvz-001', 'pvz-002', 'pvz-003'],
  permissions: DEFAULT_ADMIN_PERMISSIONS,
  isActive: true,
  hiredAt: new Date('2024-01-15'),
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date(),
};

// ============================================
// ПВЗ (ПУНКТЫ ВЫДАЧИ ЗАКАЗОВ)
// ============================================

export const MOCK_PVZS: AdminPvz[] = [
  {
    id: 'pvz-001',
    name: 'ПВЗ · Герцена 12',
    address: 'ул. Герцена, 12',
    coordinates: {
      latitude: 55.7558,
      longitude: 37.6173,
    },
    ownerId: 'owner-001',
    managerId: 'admin-001',
    managerName: 'Мария Петрова',
    employeeIds: ['emp-001', 'emp-002', 'emp-003', 'emp-004', 'emp-005'],
    settings: {
      workingHours: {
        start: 9,
        end: 21,
      },
      shiftRules: {
        minShiftDuration: 240, // 4 часа
        maxShiftDuration: 720, // 12 часов
        maxBreakDuration: 60, // 1 час
        overtimeThreshold: 480, // 8 часов
      },
      geofence: {
        enabled: true,
        radius: 100,
      },
      qrCodes: {
        enabled: true,
        regenerateDaily: true,
      },
    },
    stats: {
      totalEmployees: 5,
      activeEmployees: 5,
      onShiftNow: 2,
      totalShiftsToday: 3,
      completedShiftsToday: 1,
      activeShiftsNow: 2,
      totalTasks: 12,
      completedTasks: 8,
      pendingTasks: 3,
      overdueTasks: 1,
      pendingRequests: 2,
      approvedRequestsToday: 1,
      totalSalary: 185000,
      totalBonuses: 12000,
      totalPenalties: 3000,
      lastUpdated: new Date(),
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'pvz-002',
    name: 'ПВЗ · Ленина 5',
    address: 'пр. Ленина, 5',
    coordinates: {
      latitude: 55.7610,
      longitude: 37.6087,
    },
    ownerId: 'owner-001',
    managerId: 'admin-001',
    managerName: 'Мария Петрова',
    employeeIds: ['emp-006', 'emp-007', 'emp-008', 'emp-009'],
    settings: {
      workingHours: {
        start: 10,
        end: 22,
      },
      shiftRules: {
        minShiftDuration: 240,
        maxShiftDuration: 720,
        maxBreakDuration: 60,
        overtimeThreshold: 480,
      },
      geofence: {
        enabled: true,
        radius: 150,
      },
      qrCodes: {
        enabled: true,
        regenerateDaily: true,
      },
    },
    stats: {
      totalEmployees: 4,
      activeEmployees: 4,
      onShiftNow: 1,
      totalShiftsToday: 2,
      completedShiftsToday: 1,
      activeShiftsNow: 1,
      totalTasks: 8,
      completedTasks: 6,
      pendingTasks: 2,
      overdueTasks: 0,
      pendingRequests: 1,
      approvedRequestsToday: 0,
      totalSalary: 145000,
      totalBonuses: 8000,
      totalPenalties: 1500,
      lastUpdated: new Date(),
    },
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(),
  },
  {
    id: 'pvz-003',
    name: 'ПВЗ · Мира 28',
    address: 'ул. Мира, 28',
    coordinates: {
      latitude: 55.7698,
      longitude: 37.6390,
    },
    ownerId: 'owner-001',
    managerId: 'admin-001',
    managerName: 'Мария Петрова',
    employeeIds: ['emp-010'],
    settings: {
      workingHours: {
        start: 8,
        end: 20,
      },
      shiftRules: {
        minShiftDuration: 240,
        maxShiftDuration: 720,
        maxBreakDuration: 60,
        overtimeThreshold: 480,
      },
      geofence: {
        enabled: false,
        radius: 100,
      },
      qrCodes: {
        enabled: true,
        regenerateDaily: false,
      },
    },
    stats: {
      totalEmployees: 1,
      activeEmployees: 1,
      onShiftNow: 0,
      totalShiftsToday: 1,
      completedShiftsToday: 0,
      activeShiftsNow: 0,
      totalTasks: 3,
      completedTasks: 2,
      pendingTasks: 1,
      overdueTasks: 0,
      pendingRequests: 0,
      approvedRequestsToday: 0,
      totalSalary: 35000,
      totalBonuses: 2000,
      totalPenalties: 0,
      lastUpdated: new Date(),
    },
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(),
  },
];

// ============================================
// СОТРУДНИКИ
// ============================================

export const MOCK_EMPLOYEES: AdminEmployee[] = [
  // ПВЗ · Герцена 12
  {
    id: 'emp-001',
    name: 'Иван Иванов',
    email: 'ivan.ivanov@example.com',
    phone: '+7 (900) 111-11-11',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'employee',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    stats: {
      totalShifts: 48,
      currentMonthShifts: 18,
      totalHours: 384,
      averageRating: 4.8,
      completedTasks: 142,
      pendingRequests: 1,
    },
    salary: {
      earned: 42000,
      bonuses: 3000,
      penalties: 0,
      total: 45000,
    },
    isActive: true,
    isOnShift: true,
    lastShiftDate: new Date(),
    hiredAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: 'emp-002',
    name: 'Елена Смирнова',
    phone: '+7 (900) 222-22-22',
    avatar: 'https://i.pravatar.cc/150?img=9',
    role: 'employee',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    stats: {
      totalShifts: 52,
      currentMonthShifts: 20,
      totalHours: 416,
      averageRating: 4.9,
      completedTasks: 156,
      pendingRequests: 0,
    },
    salary: {
      earned: 45000,
      bonuses: 5000,
      penalties: 500,
      total: 49500,
    },
    isActive: true,
    isOnShift: true,
    lastShiftDate: new Date(),
    hiredAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
  },
  {
    id: 'emp-003',
    name: 'Петр Сидоров',
    phone: '+7 (900) 333-33-33',
    avatar: 'https://i.pravatar.cc/150?img=13',
    role: 'employee',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    stats: {
      totalShifts: 45,
      currentMonthShifts: 16,
      totalHours: 360,
      averageRating: 4.5,
      completedTasks: 128,
      pendingRequests: 1,
    },
    salary: {
      earned: 38000,
      bonuses: 2000,
      penalties: 1500,
      total: 38500,
    },
    isActive: true,
    isOnShift: false,
    lastShiftDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    hiredAt: new Date('2024-02-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  {
    id: 'emp-004',
    name: 'Ольга Кузнецова',
    phone: '+7 (900) 444-44-44',
    avatar: 'https://i.pravatar.cc/150?img=10',
    role: 'employee',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    stats: {
      totalShifts: 40,
      currentMonthShifts: 15,
      totalHours: 320,
      averageRating: 4.7,
      completedTasks: 115,
      pendingRequests: 0,
    },
    salary: {
      earned: 35000,
      bonuses: 2000,
      penalties: 1000,
      total: 36000,
    },
    isActive: true,
    isOnShift: false,
    lastShiftDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    hiredAt: new Date('2024-02-15'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(),
  },
  {
    id: 'emp-005',
    name: 'Дмитрий Морозов',
    phone: '+7 (900) 555-55-55',
    avatar: 'https://i.pravatar.cc/150?img=14',
    role: 'employee',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    stats: {
      totalShifts: 38,
      currentMonthShifts: 14,
      totalHours: 304,
      averageRating: 4.6,
      completedTasks: 108,
      pendingRequests: 0,
    },
    salary: {
      earned: 32000,
      bonuses: 0,
      penalties: 1500,
      total: 30500,
    },
    isActive: true,
    isOnShift: false,
    lastShiftDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    hiredAt: new Date('2024-03-01'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(),
  },

  // ПВЗ · Ленина 5
  {
    id: 'emp-006',
    name: 'Анна Волкова',
    phone: '+7 (900) 666-66-66',
    avatar: 'https://i.pravatar.cc/150?img=20',
    role: 'employee',
    pvzId: 'pvz-002',
    pvzName: 'ПВЗ · Ленина 5',
    stats: {
      totalShifts: 42,
      currentMonthShifts: 17,
      totalHours: 336,
      averageRating: 4.9,
      completedTasks: 135,
      pendingRequests: 1,
    },
    salary: {
      earned: 40000,
      bonuses: 4000,
      penalties: 0,
      total: 44000,
    },
    isActive: true,
    isOnShift: true,
    lastShiftDate: new Date(),
    hiredAt: new Date('2024-02-20'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date(),
  },
  {
    id: 'emp-007',
    name: 'Сергей Лебедев',
    phone: '+7 (900) 777-77-77',
    avatar: 'https://i.pravatar.cc/150?img=15',
    role: 'employee',
    pvzId: 'pvz-002',
    pvzName: 'ПВЗ · Ленина 5',
    stats: {
      totalShifts: 35,
      currentMonthShifts: 13,
      totalHours: 280,
      averageRating: 4.4,
      completedTasks: 98,
      pendingRequests: 0,
    },
    salary: {
      earned: 30000,
      bonuses: 1500,
      penalties: 1000,
      total: 30500,
    },
    isActive: true,
    isOnShift: false,
    lastShiftDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    hiredAt: new Date('2024-03-05'),
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date(),
  },
  {
    id: 'emp-008',
    name: 'Мария Соколова',
    phone: '+7 (900) 888-88-88',
    avatar: 'https://i.pravatar.cc/150?img=23',
    role: 'employee',
    pvzId: 'pvz-002',
    pvzName: 'ПВЗ · Ленина 5',
    stats: {
      totalShifts: 50,
      currentMonthShifts: 19,
      totalHours: 400,
      averageRating: 4.8,
      completedTasks: 148,
      pendingRequests: 0,
    },
    salary: {
      earned: 43000,
      bonuses: 2500,
      penalties: 500,
      total: 45000,
    },
    isActive: true,
    isOnShift: false,
    lastShiftDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    hiredAt: new Date('2024-02-25'),
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date(),
  },
  {
    id: 'emp-009',
    name: 'Александр Новиков',
    phone: '+7 (900) 999-99-99',
    avatar: 'https://i.pravatar.cc/150?img=16',
    role: 'employee',
    pvzId: 'pvz-002',
    pvzName: 'ПВЗ · Ленина 5',
    stats: {
      totalShifts: 28,
      currentMonthShifts: 11,
      totalHours: 224,
      averageRating: 4.3,
      completedTasks: 82,
      pendingRequests: 0,
    },
    salary: {
      earned: 28000,
      bonuses: 0,
      penalties: 0,
      total: 28000,
    },
    isActive: true,
    isOnShift: false,
    lastShiftDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    hiredAt: new Date('2024-03-15'),
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date(),
  },

  // ПВЗ · Мира 28
  {
    id: 'emp-010',
    name: 'Виктория Павлова',
    phone: '+7 (900) 101-01-01',
    avatar: 'https://i.pravatar.cc/150?img=24',
    role: 'employee',
    pvzId: 'pvz-003',
    pvzName: 'ПВЗ · Мира 28',
    stats: {
      totalShifts: 22,
      currentMonthShifts: 9,
      totalHours: 176,
      averageRating: 4.5,
      completedTasks: 65,
      pendingRequests: 0,
    },
    salary: {
      earned: 25000,
      bonuses: 1000,
      penalties: 0,
      total: 26000,
    },
    isActive: true,
    isOnShift: false,
    lastShiftDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    hiredAt: new Date('2024-03-20'),
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date(),
  },
];

// ============================================
// СМЕНЫ (последние 7 дней)
// ============================================

const generateShifts = (): AdminShift[] => {
  const shifts: AdminShift[] = [];
  const now = new Date();
  
  // Генерируем смены за последние 7 дней
  MOCK_EMPLOYEES.forEach((employee) => {
    for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
      // Не каждый день есть смены
      if (Math.random() > 0.6) continue;
      
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(9 + Math.floor(Math.random() * 4), 0, 0, 0);
      
      const startTime = new Date(date);
      const duration = 360 + Math.floor(Math.random() * 240); // 6-10 часов
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      
      // Текущие смены (сегодня)
      const isToday = daysAgo === 0;
      const isActive = isToday && employee.isOnShift;
      
      shifts.push({
        id: `shift-${employee.id}-${daysAgo}`,
        employeeId: employee.id,
        employeeName: employee.name,
        employeeAvatar: employee.avatar,
        pvzId: employee.pvzId,
        pvzName: employee.pvzName || '',
        date,
        startTime,
        endTime: isActive ? undefined : endTime,
        plannedDuration: 480, // 8 часов
        actualDuration: isActive ? undefined : duration,
        status: isActive ? 'active' : 'finished',
        breaks: [
          {
            id: `break-${employee.id}-${daysAgo}-1`,
            startTime: new Date(startTime.getTime() + 180 * 60 * 1000),
            endTime: new Date(startTime.getTime() + 210 * 60 * 1000),
            duration: 30,
          },
        ],
        totalBreakTime: 30,
        isOvertime: duration > 480,
        isLate: Math.random() > 0.9,
        isEarlyLeave: Math.random() > 0.95,
        notes: Math.random() > 0.8 ? 'Всё прошло отлично' : undefined,
        createdAt: new Date(date.getTime() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
    }
  });
  
  return shifts.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const MOCK_SHIFTS: AdminShift[] = generateShifts();

// ============================================
// ЗАПРОСЫ НА ИЗМЕНЕНИЕ ГРАФИКА
// ============================================

export const MOCK_SCHEDULE_REQUESTS: ScheduleRequest[] = [
  {
    id: 'req-001',
    employeeId: 'emp-001',
    employeeName: 'Иван Иванов',
    employeeAvatar: 'https://i.pravatar.cc/150?img=12',
    pvzId: 'pvz-001',
    type: 'day_off',
    title: 'Отгул на 15 октября',
    description: 'Прошу предоставить выходной на 15 октября по семейным обстоятельствам.',
    requestedDate: new Date('2025-10-15'),
    status: 'pending',
    priority: 'medium',
    attachments: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'req-002',
    employeeId: 'emp-003',
    employeeName: 'Петр Сидоров',
    employeeAvatar: 'https://i.pravatar.cc/150?img=13',
    pvzId: 'pvz-001',
    type: 'shift_swap',
    title: 'Обмен сменой 10 октября',
    description: 'Могу ли я поменяться сменой с кем-то на 10 октября? Готов взять любую другую дату.',
    requestedDate: new Date('2025-10-10'),
    status: 'pending',
    priority: 'low',
    attachments: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 часов назад
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'req-003',
    employeeId: 'emp-006',
    employeeName: 'Анна Волкова',
    employeeAvatar: 'https://i.pravatar.cc/150?img=20',
    pvzId: 'pvz-002',
    type: 'vacation',
    title: 'Отпуск с 20 по 27 октября',
    description: 'Прошу предоставить отпуск на неделю с 20 по 27 октября.',
    requestedDate: new Date('2025-10-20'),
    status: 'pending',
    priority: 'high',
    attachments: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // вчера
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'req-004',
    employeeId: 'emp-002',
    employeeName: 'Елена Смирнова',
    employeeAvatar: 'https://i.pravatar.cc/150?img=9',
    pvzId: 'pvz-001',
    type: 'schedule_change',
    title: 'Изменение времени смены',
    description: 'Можно ли начинать смены с 10:00 вместо 9:00 в следующем месяце?',
    requestedDate: new Date('2025-11-01'),
    status: 'approved',
    priority: 'low',
    response: {
      adminId: 'admin-001',
      adminName: 'Мария Петрова',
      message: 'Одобрено. С 1 ноября можете приходить к 10:00.',
      respondedAt: new Date(Date.now() - 60 * 60 * 1000),
    },
    attachments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
  },
];

// ============================================
// ФИНАНСОВЫЕ ТРАНЗАКЦИИ (текущий месяц)
// ============================================

export const MOCK_TRANSACTIONS: AdminTransaction[] = [
  // Премии
  {
    id: 'trans-001',
    employeeId: 'emp-002',
    employeeName: 'Елена Смирнова',
    employeeAvatar: 'https://i.pravatar.cc/150?img=9',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    type: 'bonus',
    category: 'Отличная работа',
    amount: 2000,
    currency: '₽',
    description: 'Премия за выполнение плана',
    shiftId: 'shift-emp-002-0',
    createdBy: {
      id: 'admin-001',
      name: 'Мария Петрова',
      role: 'admin',
    },
    status: 'approved',
    isPaid: false,
    date: new Date(),
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  
  // Штрафы
  {
    id: 'trans-002',
    employeeId: 'emp-003',
    employeeName: 'Петр Сидоров',
    employeeAvatar: 'https://i.pravatar.cc/150?img=13',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    type: 'penalty',
    category: 'Опоздание',
    amount: -500,
    currency: '₽',
    description: 'Опоздание на 30 минут',
    shiftId: 'shift-emp-003-1',
    createdBy: {
      id: 'admin-001',
      name: 'Мария Петрова',
      role: 'admin',
    },
    status: 'approved',
    isPaid: false,
    dispute: {
      isDisputed: false,
      reason: '',
      status: 'pending',
    },
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  
  {
    id: 'trans-003',
    employeeId: 'emp-005',
    employeeName: 'Дмитрий Морозов',
    employeeAvatar: 'https://i.pravatar.cc/150?img=14',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    type: 'penalty',
    category: 'Нарушение правил',
    amount: -1000,
    currency: '₽',
    description: 'Невыполнение задачи',
    createdBy: {
      id: 'admin-001',
      name: 'Мария Петрова',
      role: 'admin',
    },
    status: 'approved',
    isPaid: false,
    dispute: {
      isDisputed: true,
      reason: 'Задача была выполнена, но не была отмечена в системе из-за технического сбоя',
      status: 'pending',
    },
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  
  // Авансы
  {
    id: 'trans-004',
    employeeId: 'emp-001',
    employeeName: 'Иван Иванов',
    employeeAvatar: 'https://i.pravatar.cc/150?img=12',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    type: 'advance',
    amount: 10000,
    currency: '₽',
    description: 'Аванс по запросу сотрудника',
    createdBy: {
      id: 'admin-001',
      name: 'Мария Петрова',
      role: 'admin',
    },
    status: 'paid',
    isPaid: true,
    paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// ============================================
// ЗАДАЧИ
// ============================================

export const MOCK_TASKS: AdminTask[] = [
  {
    id: 'task-001',
    type: 'urgent',
    title: 'Принять крупную партию товара',
    description: 'Ожидается поставка 200+ коробок',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    assignedTo: 'emp-001',
    assignedToName: 'Иван Иванов',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(),
    createdBy: {
      id: 'admin-001',
      name: 'Мария Петрова',
      role: 'admin',
    },
    attachments: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'task-002',
    type: 'routine',
    title: 'Проверить сроки годности',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    assignedTo: 'emp-002',
    assignedToName: 'Елена Смирнова',
    status: 'done',
    priority: 'medium',
    completedAt: new Date(Date.now() - 60 * 60 * 1000),
    createdBy: {
      id: 'system',
      name: 'Система',
      role: 'admin',
    },
    attachments: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 'task-003',
    type: 'assigned',
    title: 'Навести порядок на складе',
    description: 'Пересортировать товары по зонам',
    pvzId: 'pvz-002',
    pvzName: 'ПВЗ · Ленина 5',
    assignedTo: 'emp-006',
    assignedToName: 'Анна Волкова',
    status: 'todo',
    priority: 'low',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdBy: {
      id: 'admin-001',
      name: 'Мария Петрова',
      role: 'admin',
    },
    attachments: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'task-004',
    type: 'urgent',
    title: 'Обработать жалобу клиента',
    description: 'Клиент не получил заказ, разобраться',
    pvzId: 'pvz-001',
    pvzName: 'ПВЗ · Герцена 12',
    assignedTo: 'emp-003',
    assignedToName: 'Петр Сидоров',
    status: 'overdue',
    priority: 'high',
    dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdBy: {
      id: 'admin-001',
      name: 'Мария Петрова',
      role: 'admin',
    },
    attachments: [],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/**
 * Получить ПВЗ по ID
 */
export const getPvzById = (pvzId: string): AdminPvz | undefined => {
  return MOCK_PVZS.find((pvz) => pvz.id === pvzId);
};

/**
 * Получить сотрудников по ID ПВЗ
 */
export const getEmployeesByPvzId = (pvzId: string): AdminEmployee[] => {
  if (pvzId === 'all') return MOCK_EMPLOYEES;
  return MOCK_EMPLOYEES.filter((emp) => emp.pvzId === pvzId);
};

/**
 * Получить смены по ID ПВЗ
 */
export const getShiftsByPvzId = (pvzId: string): AdminShift[] => {
  if (pvzId === 'all') return MOCK_SHIFTS;
  return MOCK_SHIFTS.filter((shift) => shift.pvzId === pvzId);
};

/**
 * Получить запросы по ID ПВЗ
 */
export const getRequestsByPvzId = (pvzId: string): ScheduleRequest[] => {
  if (pvzId === 'all') return MOCK_SCHEDULE_REQUESTS;
  return MOCK_SCHEDULE_REQUESTS.filter((req) => req.pvzId === pvzId);
};

/**
 * Получить транзакции по ID ПВЗ
 */
export const getTransactionsByPvzId = (pvzId: string): AdminTransaction[] => {
  if (pvzId === 'all') return MOCK_TRANSACTIONS;
  return MOCK_TRANSACTIONS.filter((trans) => trans.pvzId === pvzId);
};

/**
 * Получить задачи по ID ПВЗ
 */
export const getTasksByPvzId = (pvzId: string): AdminTask[] => {
  if (pvzId === 'all') return MOCK_TASKS;
  return MOCK_TASKS.filter((task) => task.pvzId === pvzId);
};

/**
 * Получить агрегированную статистику по всем ПВЗ
 */
export const getAllPvzStats = (): PvzStats => {
  return MOCK_PVZS.reduce(
    (acc, pvz) => ({
      totalEmployees: acc.totalEmployees + pvz.stats.totalEmployees,
      activeEmployees: acc.activeEmployees + pvz.stats.activeEmployees,
      onShiftNow: acc.onShiftNow + pvz.stats.onShiftNow,
      totalShiftsToday: acc.totalShiftsToday + pvz.stats.totalShiftsToday,
      completedShiftsToday: acc.completedShiftsToday + pvz.stats.completedShiftsToday,
      activeShiftsNow: acc.activeShiftsNow + pvz.stats.activeShiftsNow,
      totalTasks: acc.totalTasks + pvz.stats.totalTasks,
      completedTasks: acc.completedTasks + pvz.stats.completedTasks,
      pendingTasks: acc.pendingTasks + pvz.stats.pendingTasks,
      overdueTasks: acc.overdueTasks + pvz.stats.overdueTasks,
      pendingRequests: acc.pendingRequests + pvz.stats.pendingRequests,
      approvedRequestsToday: acc.approvedRequestsToday + pvz.stats.approvedRequestsToday,
      totalSalary: acc.totalSalary + pvz.stats.totalSalary,
      totalBonuses: acc.totalBonuses + pvz.stats.totalBonuses,
      totalPenalties: acc.totalPenalties + pvz.stats.totalPenalties,
      lastUpdated: new Date(),
    }),
    {
      totalEmployees: 0,
      activeEmployees: 0,
      onShiftNow: 0,
      totalShiftsToday: 0,
      completedShiftsToday: 0,
      activeShiftsNow: 0,
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      overdueTasks: 0,
      pendingRequests: 0,
      approvedRequestsToday: 0,
      totalSalary: 0,
      totalBonuses: 0,
      totalPenalties: 0,
      lastUpdated: new Date(),
    } as PvzStats,
  );
};

