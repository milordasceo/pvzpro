/**
 * 📏 Система отступов и размеров
 * 
 * Используется для padding, margin, gap и других отступов
 */

export const spacing = {
  // Базовые отступы
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,

  // Специальные отступы
  screenPadding: 16,    // Горизонтальный padding экрана
  cardGap: 12,          // Расстояние между карточками
  sectionGap: 16,       // Расстояние между секциями
  elementGap: 8,        // Расстояние между элементами

  // Высоты элементов
  controlHeight: 48,    // Высота основных контролов
  buttonHeight: 44,     // Высота кнопок
  inputHeight: 48,      // Высота input полей
  tabBarHeight: 44,     // Высота таб бара
  headerHeight: 56,     // Высота хедера
} as const;

export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const elevation = {
  none: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
} as const;

export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Elevation = typeof elevation;

