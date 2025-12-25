import React from 'react';
import { Button as HeroButton } from 'heroui-native';
import { logger } from '../lib/logger';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  onPress?: (event: any) => void;
  children?: React.ReactNode;
  logLabel?: string;
  disableHaptics?: boolean;
  [key: string]: any; // Allow pass-through props
}

export const Button = ({ onPress, children, logLabel, disableHaptics, ...props }: ButtonProps) => {
  const handlePress = (event: any) => {
    // Пытаемся определить название кнопки для логов
    const label = logLabel || (typeof children === 'string' ? children : 'Unknown Button');

    logger.action('Button', 'Pressed', { label });

    // Профессиональная тактильная отдача по умолчанию
    if (!disableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (onPress) {
      onPress(event);
    }
  };

  return (
    <HeroButton onPress={handlePress} {...props}>
      {children}
    </HeroButton>
  );
};
