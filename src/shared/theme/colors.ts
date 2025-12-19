export const marketplaceThemes = {
  wb: {
    primary: '#7828C8', // Фиолетовый WB
    secondary: '#CB11AB', // Розовый акцент WB
    bg: '#7828C8',
  },
  ozon: {
    primary: '#005BFF', // Синий Ozon
    secondary: '#F50049', // Розовый Ozon
    bg: '#005BFF',
  },
  yandex: {
    primary: '#FFCC00', // Желтый Яндекс
    secondary: '#000000', // Черный Яндекс
    bg: '#FFCC00',
  }
};

export const colors = {
  // Brand Colors (Default - WB)
  primary: marketplaceThemes.wb.primary,
  secondary: marketplaceThemes.wb.secondary,
  success: '#17C964',
  warning: '#F5A524',
  danger: '#F31260',
  
  // Neutral Colors (Zinc)
  white: '#FFFFFF',
  black: '#000000',
  background: '#F9FAFB',
  content1: '#FFFFFF',
  content2: '#F4F4F5',
  content3: '#E4E4E7',
  content4: '#D4D4D8',
  
  // Text Colors
  text: {
    DEFAULT: '#111827',
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Border Colors
  border: {
    DEFAULT: '#F3F4F6',
    dark: '#E5E7EB',
  },
  
  // Tab Bar
  tabBar: {
    active: '#7828C8',
    inactive: '#9CA3AF',
    border: '#F3F4F6',
    background: '#FFFFFF',
  },
  
  // Header
  header: {
    background: '#FFFFFF',
    text: '#111827',
    border: '#F3F4F6',
  }
};
