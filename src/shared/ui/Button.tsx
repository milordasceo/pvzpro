import React from 'react';
import { Button as HeroButton, ButtonProps as HeroButtonProps } from 'heroui-native';
import { logger } from '../lib/logger';
import * as Haptics from 'expo-haptics';

interface ButtonProps extends HeroButtonProps {
  logLabel?: string; // Название кнопки для логов (если нет children-текста)
  disableHaptics?: boolean;
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
