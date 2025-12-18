import { NavigatorScreenParams } from '@react-navigation/native';

// Типы для навигации
export type RootStackParamList = {
  ChatList: undefined;
  Chat: { 
    chatId: string; 
    title: string; 
    initialMessage?: string;
    penaltyData?: {
      amount: number;
      description: string;
      category: string;
      color: string;
      date: string;
      relatedItemPrice?: number;
      itemName?: string;
      adminComment?: string;
    };
  };
  FinanceHistory: undefined;
  FinanceBreakdown: { period?: string };
  PvzSettings: undefined;
};

export type EmployeeTabParamList = {
  'Моя смена': undefined;
  График: undefined;
  Финансы: undefined;
  Чат: NavigatorScreenParams<RootStackParamList> | undefined;
};

export type AdminTabParamList = {
  Обзор: undefined;
  ПВЗ: undefined;
  PvzDetails: { pvzId: string }; // Детали конкретного ПВЗ (новый экран)
  PvzSettings: { pvzId: string }; // Настройки конкретного ПВЗ (старый, оставлен для совместимости)
  Сотрудники: undefined;
  EmployeeDetails: { employeeId: string }; // Детали сотрудника
  EmployeeForm: { employeeId?: string }; // Форма добавления/редактирования сотрудника
  График: { screen?: string } | undefined; // Поддержка вложенных экранов (Календарь, Запросы)
  Чат: NavigatorScreenParams<RootStackParamList> | undefined;
};

export type OwnerTabParamList = {
  Дашборд: undefined;
  ПВЗ: undefined;
  Правила: undefined;
};

export type RoleType = 'owner' | 'admin' | 'employee';
