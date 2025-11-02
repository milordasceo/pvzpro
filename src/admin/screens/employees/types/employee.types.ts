/**
 * Типы для модуля "Сотрудники"
 */

/**
 * Данные формы сотрудника
 */
export interface EmployeeFormData {
  // Основная информация
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  
  // Должность и статус
  position: 'trainee' | 'employee' | 'senior' | 'manager';
  employmentStatus: 'working' | 'day_off' | 'sick_leave' | 'vacation' | 'fired';
  isActive: boolean;
  
  // ПВЗ
  pvzId: string;
  
  // Даты
  hiredAt: Date;
  
  // Финансы
  baseSalary?: number;
}

/**
 * Ошибки валидации формы
 */
export interface EmployeeFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  pvzId?: string;
  position?: string;
  [key: string]: string | undefined;
}

/**
 * Тип действия над сотрудником
 */
export type EmployeeActionType =
  | 'edit'           // Редактировать
  | 'delete'         // Удалить
  | 'chat'           // Открыть чат
  | 'call'           // Позвонить
  | 'email'          // Написать email
  | 'viewHistory'    // Посмотреть историю
  | 'viewStats'      // Посмотреть статистику
  | 'changeStatus'   // Изменить статус
  | 'assignTask';    // Назначить задачу

/**
 * Действие над сотрудником
 */
export interface EmployeeAction {
  type: EmployeeActionType;
  label: string;
  icon: string;
  color?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

/**
 * Элемент информационной секции
 */
export interface EmployeeInfoItem {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}
