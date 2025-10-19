import React from 'react';
import { Card } from 'react-native-paper';
import { tokens } from '../ui';

export interface StyledCardProps {
  children: React.ReactNode;
  mode?: 'outlined' | 'elevated' | 'contained';
  style?: any;
  contentStyle?: any;
  title?: string;
  titleStyle?: any;
  subtitle?: string;
  subtitleStyle?: any;
  onPress?: () => void;
  right?: React.ReactNode;
}

/**
 * Унифицированная карточка с предустановленными стилями
 * Заменяет повторяющиеся Card компоненты с одинаковыми стилями
 */
export const StyledCard: React.FC<StyledCardProps> = React.memo(
  ({
    children,
    mode = 'outlined',
    style,
    contentStyle,
    title,
    titleStyle,
    subtitle,
    subtitleStyle,
    onPress,
    right,
  }) => {
    const defaultStyle = {
      borderRadius: tokens.radius.lg,
      backgroundColor: tokens.colors.surface,
      ...style,
    };

    if (title) {
      return (
        <Card mode={mode} style={defaultStyle} onPress={onPress}>
          <Card.Title
            title={title}
            titleStyle={[{ fontSize: 22, color: '#111827' }, titleStyle]}
            subtitle={subtitle}
            subtitleStyle={[{ fontSize: 14, color: '#6B7280' }, subtitleStyle]}
            right={right ? () => <>{right}</> : undefined}
          />
          <Card.Content style={[{ gap: tokens.spacing.cardGap }, contentStyle]}>{children}</Card.Content>
        </Card>
      );
    }

    return (
      <Card mode={mode} style={defaultStyle} onPress={onPress}>
        <Card.Content style={[{ gap: tokens.spacing.cardGap }, contentStyle]}>{children}</Card.Content>
      </Card>
    );
  },
);
