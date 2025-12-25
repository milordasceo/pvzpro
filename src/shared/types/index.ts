// Общие типы приложения
export * from './navigation';
export * from './finance';
export * from './admin';

// Роли пользователей
export type UserRole = 'employee' | 'manager' | 'owner' | null;

// Статусы смены
export type ShiftStatus = 'planned' | 'active' | 'break' | 'finished';

// Статусы задач
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'skipped';

// Типы задач
export type TaskType = 'routine' | 'assigned';

// Координаты
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Пользователь
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Пункт выдачи заказов
export interface Pvz {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  managerId?: string;
  employees: string[]; // IDs сотрудников
  isActive: boolean;
  workingHours: {
    start: number; // час (0-23)
    end: number; // час (0-23)
  };
}

// Смена сотрудника
export interface Shift {
  id: string;
  employeeId: string;
  pvzId: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  status: ShiftStatus;
  breaks: ShiftBreak[];
  totalBreakTime: number; // минуты
  isOvertime: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Перерыв
export interface ShiftBreak {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // минуты
  isAutoEnded: boolean;
}

// Задача
export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description?: string;
  pvzId: string;
  assignedTo: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completedAt?: Date;
  attachments: TaskAttachment[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Вложение к задаче
export interface TaskAttachment {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
}

// QR код
export interface QrCode {
  id: string;
  pvzId: string;
  payload: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
}

// Запрос сотрудника
export interface EmployeeRequest {
  id: string;
  employeeId: string;
  type: 'overtime' | 'shift_swap' | 'penalty_dispute' | 'vacation' | 'sick_leave';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  attachments: TaskAttachment[];
  response?: string;
  respondedBy?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Финансовые данные
export interface FinancialRecord {
  id: string;
  employeeId: string;
  type: 'salary' | 'bonus' | 'penalty' | 'advance';
  amount: number;
  currency: string;
  description: string;
  date: Date;
  shiftId?: string;
  isPaid: boolean;
  paidAt?: Date;
  createdAt: Date;
}

// Чат сообщение
export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachments: TaskAttachment[];
  isRead: boolean;
  readBy: string[];
  replyTo?: string;
  createdAt: Date;
}

// Чат
export interface Chat {
  id: string;
  type: 'direct' | 'group' | 'system';
  participants: string[];
  title?: string;
  lastMessage?: ChatMessage;
  unreadCount: Record<string, number>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Геозона
export interface Geofence {
  id: string;
  pvzId: string;
  center: Coordinates;
  radius: number; // метров
  isActive: boolean;
  createdAt: Date;
}

// Уведомление
export interface Notification {
  id: string;
  userId: string;
  type: 'shift_reminder' | 'task_deadline' | 'request_approved' | 'system_alert';
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  actionUrl?: string;
  createdAt: Date;
}

// Настройки приложения
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    shiftReminders: boolean;
    taskDeadlines: boolean;
    messages: boolean;
  };
  privacy: {
    locationTracking: boolean;
    analytics: boolean;
  };
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// API Error
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number,
    public details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// События приложения
export type AppEvent =
  | { type: 'SHIFT_STARTED'; payload: { shiftId: string } }
  | { type: 'SHIFT_ENDED'; payload: { shiftId: string } }
  | { type: 'TASK_COMPLETED'; payload: { taskId: string } }
  | { type: 'QR_SCANNED'; payload: { qrId: string; employeeId: string } }
  | { type: 'LOCATION_UPDATED'; payload: Coordinates }
  | { type: 'NOTIFICATION_RECEIVED'; payload: Notification }
  | { type: 'USER_LOGGED_IN'; payload: User }
  | { type: 'USER_LOGGED_OUT' };
