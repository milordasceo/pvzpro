import { Dimensions } from 'react-native';
import { typography } from './tokens';

const { width, height } = Dimensions.get('window');

export const layout = {
  // Screen
  screen: {
    width,
    height,
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 50,
  },

  // Radius
  radius: {
    xs: 8,
    sm: 10,
    md: 12,
    lg: 14,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
    '5xl': 40,
    '6xl': 50,
    full: 9999,
  },

  // Components
  header: {
    height: 64,
    titleFontSize: typography.presets.h3.fontSize,
  },

  tabBar: {
    height: 60,
    paddingTop: 5,
    paddingBottom: 10,
    iconSize: 24,
  },

  icon: {
    xs: 12,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  // Calendar
  calendar: {
    daySize: 40,
    gridGap: 8,
    cardPadding: 20,
    cardRadius: 24,
  },

  // Slider
  slider: {
    height: 64,
    knobSize: 52,
    padding: 4,
    borderRadius: 18,
    knobRadius: 14,
  },

  // Cards
  card: {
    padding: 16,
    radius: 20,
    radiusLg: 24,
  },
};
