export const marketplaceThemes = {
  wb: {
    primary: '#7828C8',
    secondary: '#CB11AB',
    bg: '#7828C8',
    surface: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#F3F4F6',
  },
  ozon: {
    primary: '#005BFF',
    secondary: '#F50049',
    bg: '#005BFF',
    surface: '#FFFFFF',
    text: '#001A34',
    textSecondary: '#808D9A',
    border: '#E0E5E9',
  },
  yandex: {
    primary: '#FFCC00',
    secondary: '#000000',
    bg: '#FFCC00',
    surface: '#FFFFFF',
    text: '#21201F',
    textSecondary: '#8B8986',
    border: '#EBE8E4',
  }
};

export const colors = {
  // Динамические цвета (зависят от выбранного маркетплейса)
  primary: marketplaceThemes.wb.primary,
  secondary: marketplaceThemes.wb.secondary,
  
  // Функциональные цвета (остаются стабильными)
  success: '#17C964',
  warning: '#F5A524',
  danger: '#F31260',
  
  // Нейтральные цвета
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8F9FB',
  
  // Тема текста
  text: {
    DEFAULT: '#111827',
    primary: '#111827',
    secondary: '#6B7280',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },

  // Границы
  border: {
    DEFAULT: '#F1F5F9',
    light: '#F8FAFC',
  },

  // Специфичные компоненты
  tabBar: {
    active: '#7828C8',
    inactive: '#9CA3AF',
    border: '#F1F5F9',
    background: '#FFFFFF',
  },
  header: {
    background: '#FFFFFF',
    text: '#111827',
    border: '#F1F5F9',
  }
};
