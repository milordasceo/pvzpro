import React from 'react';
import { View } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UI_TOKENS } from '../ui/themeTokens';

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
      style={{ borderRadius: UI_TOKENS.radius }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: UI_TOKENS.radius,
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
