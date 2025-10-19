import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { tokens } from '../../theme';

export interface ButtonProps {
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
 * 🔘 Button - Унифицированная кнопка
 * 
 * Обёртка над React Native Paper Button с предустановленными стилями
 * и поддержкой design tokens.
 * 
 * @example
 * ```tsx
 * <Button mode="contained" onPress={handleSubmit}>
 *   Сохранить
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * <Button 
 *   mode="outlined" 
 *   icon="plus" 
 *   loading={isLoading}
 *   onPress={handleAdd}
 * >
 *   Добавить
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * <Button 
 *   mode="text" 
 *   compact 
 *   onPress={handleCancel}
 * >
 *   Отмена
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = React.memo(
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
      <PaperButton
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
      </PaperButton>
    );
  },
);

Button.displayName = 'Button';

