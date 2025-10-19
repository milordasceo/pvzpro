import React from 'react';
import { View } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '../ui';

export interface SquareIconButtonProps {
  icon: any;
  onPress: () => void;
  disabled?: boolean;
  bg?: string;
  color?: string;
  size?: number;
}

export const SquareIconButton: React.FC<SquareIconButtonProps> = React.memo(({
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
          backgroundColor: disabled ? theme.colors.surfaceVariant : bg || theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialCommunityIcons name={icon} size={22} color={color || '#FFFFFF'} />
      </View>
    </TouchableRipple>
  );
});
