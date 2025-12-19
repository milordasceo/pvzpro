import React from 'react';
import { Button as HeroButton, ButtonProps as HeroButtonProps } from 'heroui-native';
import { logger } from '../lib/logger';

interface ButtonProps extends HeroButtonProps {
  logLabel?: string; // Название кнопки для логов (если нет children-текста)
}

export const Button = ({ onPress, children, logLabel, ...props }: ButtonProps) => {
  const handlePress = (event: any) => {
    // Пытаемся определить название кнопки для логов
    const label = logLabel || (typeof children === 'string' ? children : 'Unknown Button');
    
    logger.action('Button', 'Pressed', { label });
    
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
