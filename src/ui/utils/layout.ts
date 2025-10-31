import { ViewStyle } from 'react-native';
import { tokens } from '../theme';

export const screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: tokens.colors.screenBackground,
};

export const sectionContainer: ViewStyle = {
  padding: tokens.spacing.screenPadding,
  gap: tokens.spacing.sectionGap,
};

export const cardInner: ViewStyle = {
  padding: tokens.spacing.lg,
};

export const horizontalStack = (gap: number = tokens.spacing.sm): ViewStyle => ({
  flexDirection: 'row',
  gap,
});

export const verticalStack = (gap: number = tokens.spacing.sm): ViewStyle => ({
  gap,
});

export const centerContent: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};

export const spaceBetween: ViewStyle = {
  justifyContent: 'space-between',
};

export const flexRow: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

export const scrollViewContent = (padding: number = tokens.spacing.screenPadding): ViewStyle => ({
  padding,
  gap: tokens.spacing.cardGap,
});
