import { colors } from './colors';

export const typography = {
  fontFamily: {
    black: 'System',
    bold: 'System',
    semibold: 'System',
    medium: 'System',
    regular: 'System',
  },
  // Базовая шкала размеров
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 19,
    '2xl': 21,
    '3xl': 26,
    '4xl': 34,
  },
  // Семантические стили (использовать в проекте вместо size.*)
  presets: {
    h1: {
      fontSize: 34,
      fontWeight: '800' as const,
      lineHeight: 40,
      letterSpacing: -1,
    },
    h2: {
      fontSize: 26,
      fontWeight: '800' as const,
      lineHeight: 32,
      letterSpacing: -0.5,
    },
    h3: {
      fontSize: 21,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    h4: {
      fontSize: 19,
      fontWeight: '700' as const,
      lineHeight: 24,
    },
    bodyLarge: {
      fontSize: 17,
      fontWeight: '500' as const,
      lineHeight: 22,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    bodySmall: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
    caption: {
      fontSize: 11,
      fontWeight: '600' as const,
      lineHeight: 14,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
    label: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
    }
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.4,
    normal: 1.5,
    relaxed: 1.7,
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
};
