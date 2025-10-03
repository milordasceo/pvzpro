// Типы для навигации
export type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: string; title: string };
  FinanceHistory: undefined;
  FinanceBreakdown: { period?: string };
  PvzSettings: undefined;
};

export type EmployeeTabParamList = {
  'Моя смена': undefined;
  График: undefined;
  Финансы: undefined;
  Чат: undefined;
};

export type AdminTabParamList = {
  Главная: undefined;
  Сотрудники: undefined;
  Чат: undefined;
};

export type OwnerTabParamList = {
  Дашборд: undefined;
  ПВЗ: undefined;
  Правила: undefined;
};

export type RoleType = 'owner' | 'admin' | 'employee';
