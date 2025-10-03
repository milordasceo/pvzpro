import { MD3LightTheme as PaperMD3LightTheme } from 'react-native-paper';
import { UI_TOKENS } from './ui/themeTokens';

export const placeholderColor = '#6B7280'; // Tailwind gray-500 close

export const AppTheme = {
  ...PaperMD3LightTheme,
  roundness: UI_TOKENS.radius,
  colors: {
    ...PaperMD3LightTheme.colors,
    primary: '#4F46E5', // indigo-600
    secondary: '#7C3AED', // violet-600
    background: '#FBFCFE',
    surface: '#FFFFFF',
    onSurfaceVariant: placeholderColor,
    outline: '#E5E7EB',
  },
} as const;
