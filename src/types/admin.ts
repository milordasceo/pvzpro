// Типы для функционала администратора

import { Coordinates, UserRole } from './index';

/**
 * Права администратора (настраиваются владельцем)
 */
export interface AdminPermissions {
  // Базовые права (всегда есть)
  canManageEmployees: boolean; // Управление сотрудниками назначенных ПВЗ
  canManageSchedule: boolean; // Управление графиком
  canManageFinance: boolean; // Начисление премий/штрафов
  canEditPvzSettings: boolean; // Настройка существующих ПВЗ

  // Расширенные права (опционально)
  canCreatePvz: boolean; // Создание новых ПВЗ
  canDeletePvz: boolean; // Удаление ПВЗ
  canInviteAdmins: boolean; // Приглашение других администраторов
}

/**
 * Администратор ПВЗ
 * Управляет одним или несколькими точками выдачи заказов
 */
export interface Admin {
  id: string;
  userId: string; // Связь с User
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'admin'; // Всегда 'admin'
  
  // ПВЗ которыми управляет
  managedPvzIds: string[];
  
  // Права доступа
  permissions: AdminPermissions;
  
  // Статус
  isActive: boolean;
  
  // Даты
  hiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Расширенная версия Employee для администратора
 * (включает дополнительные поля для управления)
 */
export interface AdminEmployee {
  id: string;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  role: 'employee';
  
  // Привязка к ПВЗ
  pvzId: string;
  pvzName?: string;
  
  // Статистика
  stats: {
    totalShifts: number; // Всего смен за всё время
    currentMonthShifts: number; // Смен в текущем месяце
    totalHours: number; // Всего часов отработано
    averageRating: number; // Средний рейтинг (0-5)
    completedTasks: number; // Выполненных задач
    pendingRequests: number; // Запросов на рассмотрении
  };
  
  // Финансы (текущий месяц)
  salary: {
    earned: number; // Заработано за месяц
    bonuses: number; // Премии
    penalties: number; // Штрафы
    total: number; // Итого к выплате
  };
  
  // Статусы
  isActive: boolean; // Активен ли сотрудник
  isOnShift: boolean; // Сейчас на смене
  lastShiftDate?: Date; // Последняя смена
  
  // Даты
  hiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Статистика ПВЗ
 */
export interface PvzStats {
  // Сотрудники
  totalEmployees: number;
  activeEmployees: number;
  onShiftNow: number;
  
  // Смены
  totalShiftsToday: number;
  completedShiftsToday: number;
  activeShiftsNow: number;
  
  // Задачи
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  
  // Запросы
  pendingRequests: number;
  approvedRequestsToday: number;
  
  // Финансы (текущий месяц)
  totalSalary: number;
  totalBonuses: number;
  totalPenalties: number;
  
  // Обновлено
  lastUpdated: Date;
}

/**
 * Расширенная версия Pvz для администратора
 */
export interface AdminPvz {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  
  // Управление
  ownerId: string; // Владелец
  managerId: string; // Текущий администратор
  managerName?: string;
  
  // Сотрудники
  employeeIds: string[];
  
  // Настройки
  settings: {
    // Рабочие часы
    workingHours: {
      start: number; // час (0-23)
      end: number; // час (0-23)
    };
    
    // Правила смен
    shiftRules: {
      minShiftDuration: number; // минут (например, 240 = 4 часа)
      maxShiftDuration: number; // минут (например, 720 = 12 часов)
      maxBreakDuration: number; // минут (например, 60)
      overtimeThreshold: number; // минут (например, 480 = 8 часов)
    };
    
    // Геозона
    geofence: {
      enabled: boolean;
      radius: number; // метров
    };
    
    // QR-коды
    qrCodes: {
      enabled: boolean;
      regenerateDaily: boolean;
    };
  };
  
  // Статистика
  stats: PvzStats;
  
  // Статусы
  isActive: boolean;
  
  // Даты
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Запрос сотрудника на изменение графика
 */
export interface ScheduleRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  pvzId: string;
  
  // Тип запроса
  type: 'shift_swap' | 'day_off' | 'vacation' | 'sick_leave' | 'schedule_change';
  
  // Детали
  title: string;
  description: string;
  requestedDate: Date; // Дата, на которую запрос
  alternativeDate?: Date; // Альтернативная дата (для обмена сменами)
  
  // Статус
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  
  // Ответ администратора
  response?: {
    adminId: string;
    adminName: string;
    message: string;
    respondedAt: Date;
  };
  
  // Вложения
  attachments: Array<{
    type: 'image' | 'document';
    url: string;
    filename: string;
  }>;
  
  // Даты
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Смена с деталями для администратора
 */
export interface AdminShift {
  id: string;
  
  // Сотрудник
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  
  // ПВЗ
  pvzId: string;
  pvzName: string;
  
  // Время
  date: Date;
  startTime: Date;
  endTime?: Date;
  plannedDuration: number; // минут
  actualDuration?: number; // минут
  
  // Статус
  status: 'planned' | 'active' | 'break' | 'finished' | 'cancelled';
  
  // Перерывы
  breaks: Array<{
    id: string;
    startTime: Date;
    endTime?: Date;
    duration: number; // минут
  }>;
  totalBreakTime: number; // минут
  
  // Флаги
  isOvertime: boolean;
  isLate: boolean; // Опоздал на смену
  isEarlyLeave: boolean; // Ушёл раньше
  
  // Заметки
  notes?: string;
  adminNotes?: string;
  
  // Даты
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Финансовая транзакция с деталями для администратора
 */
export interface AdminTransaction {
  id: string;
  
  // Сотрудник
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  
  // ПВЗ
  pvzId: string;
  pvzName?: string;
  
  // Детали транзакции
  type: 'salary' | 'bonus' | 'penalty' | 'advance' | 'deduction';
  category?: string; // Категория (например, "Опоздание", "Отличная работа")
  amount: number;
  currency: string;
  description: string;
  
  // Связь со сменой/задачей
  shiftId?: string;
  taskId?: string;
  
  // Кто начислил
  createdBy: {
    id: string;
    name: string;
    role: UserRole;
  };
  
  // Статус
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  isPaid: boolean;
  paidAt?: Date;
  
  // Оспаривание (для штрафов)
  dispute?: {
    isDisputed: boolean;
    reason: string;
    status: 'pending' | 'resolved';
    resolvedBy?: string;
    resolution?: string;
    resolvedAt?: Date;
  };
  
  // Даты
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Задача с деталями для администратора
 */
export interface AdminTask {
  id: string;
  
  // Детали
  type: 'routine' | 'assigned' | 'urgent';
  title: string;
  description?: string;
  
  // ПВЗ и сотрудник
  pvzId: string;
  pvzName?: string;
  assignedTo: string;
  assignedToName: string;
  
  // Статус и приоритет
  status: 'todo' | 'in_progress' | 'done' | 'skipped' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  
  // Даты
  dueDate?: Date;
  completedAt?: Date;
  
  // Создатель
  createdBy: {
    id: string;
    name: string;
    role: UserRole;
  };
  
  // Вложения
  attachments: Array<{
    id: string;
    type: 'image' | 'document' | 'video';
    url: string;
    filename: string;
  }>;
  
  // Даты
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Фильтры для списков
 */
export interface AdminFilters {
  // Общие
  pvzId?: string | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  
  // Сотрудники
  employeeStatus?: 'all' | 'active' | 'inactive';
  employeeOnShift?: boolean;
  
  // Смены
  shiftStatus?: 'all' | 'planned' | 'active' | 'finished' | 'cancelled';
  
  // Задачи
  taskStatus?: 'all' | 'todo' | 'in_progress' | 'done' | 'overdue';
  taskPriority?: 'all' | 'low' | 'medium' | 'high';
  
  // Запросы
  requestStatus?: 'all' | 'pending' | 'approved' | 'rejected';
  requestType?: 'all' | 'shift_swap' | 'day_off' | 'vacation' | 'sick_leave';
  
  // Транзакции
  transactionType?: 'all' | 'salary' | 'bonus' | 'penalty' | 'advance';
  transactionStatus?: 'all' | 'pending' | 'approved' | 'paid';
}

