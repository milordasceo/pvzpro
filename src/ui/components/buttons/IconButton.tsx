import React from 'react';
import { View } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../../theme';

export interface IconButtonProps {
  icon: any;
  onPress: () => void;
  disabled?: boolean;
  bg?: string;
  color?: string;
  size?: number;
}

/**
 * 🔲 IconButton - Квадратная кнопка с иконкой
 * 
 * Кнопка с иконкой в квадратной форме с rounded углами.
 * Использует Material Community Icons.
 * 
 * @example
 * ```tsx
 * <IconButton 
 *   icon="pencil" 
 *   onPress={handleEdit}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <IconButton 
 *   icon="delete" 
 *   onPress={handleDelete}
 *   bg={tokens.colors.error.main}
 *   color="#FFFFFF"
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <IconButton 
 *   icon="check" 
 *   onPress={handleConfirm}
 *   size={56}
 *   disabled={!isValid}
 * />
 * ```
 */
export const IconButton: React.FC<IconButtonProps> = React.memo(({
  icon,
  onPress,
  disabled = false,
  bg,
  color,
  size = 44,
}) => {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={onPress}
      disabled={disabled}
      borderless={false}
      style={{ borderRadius: tokens.radius.md }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: tokens.radius.md,
          backgroundColor: disabled 
            ? theme.colors.surfaceVariant 
            : bg || theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialCommunityIcons 
          name={icon} 
          size={22} 
          color={color || tokens.colors.surface} 
        />
      </View>
    </TouchableRipple>
  );
});

IconButton.displayName = 'IconButton';

