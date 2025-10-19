import React from 'react';
import { Button } from 'react-native-paper';
import { tokens } from '../ui';

export interface StyledButtonProps {
  children: React.ReactNode;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: any;
  style?: any;
  contentStyle?: any;
  labelStyle?: any;
  compact?: boolean;
  buttonColor?: string;
  textColor?: string;
}

/**
 * Унифицированная кнопка с предустановленными стилями
 * Заменяет повторяющиеся Button компоненты с одинаковыми стилями
 */
export const StyledButton: React.FC<StyledButtonProps> = React.memo(
  ({
    children,
    mode = 'contained',
    onPress,
    disabled = false,
    loading = false,
    icon,
    style,
    contentStyle,
    labelStyle,
    compact = false,
    buttonColor,
    textColor,
  }) => {
    const defaultStyle = {
      borderRadius: tokens.radius.md,
      ...style,
    };

    const defaultContentStyle = {
      height: compact ? 36 : tokens.spacing.buttonHeight,
      ...contentStyle,
    };

    return (
      <Button
        mode={mode}
        onPress={onPress}
        disabled={disabled}
        loading={loading}
        icon={icon}
        style={defaultStyle}
        contentStyle={defaultContentStyle}
        labelStyle={labelStyle}
        buttonColor={buttonColor}
        textColor={textColor}
      >
        {children}
      </Button>
    );
  },
);
