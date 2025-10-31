import React from 'react';
import { Card as PaperCard } from 'react-native-paper';
import { tokens } from '../../theme';
import { Title, Body } from '../typography';

export interface CardProps {
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
 * 📦 Card - Унифицированная карточка
 * 
 * Обёртка над React Native Paper Card с предустановленными стилями
 * и поддержкой design tokens.
 * 
 * @example
 * ```tsx
 * <Card title="Заголовок" subtitle="Подзаголовок">
 *   <Text>Содержимое карточки</Text>
 * </Card>
 * ```
 * 
 * @example
 * ```tsx
 * <Card mode="elevated" onPress={handlePress}>
 *   <Text>Кликабельная карточка</Text>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = React.memo(
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
        <PaperCard mode={mode} style={defaultStyle} onPress={onPress}>
          <PaperCard.Title
            title={title}
            subtitle={subtitle}
            right={right ? () => <>{right}</> : undefined}
          />
          <PaperCard.Content style={[{ gap: tokens.spacing.cardGap }, contentStyle]}>
            {children}
          </PaperCard.Content>
        </PaperCard>
      );
    }

    return (
      <PaperCard mode={mode} style={defaultStyle} onPress={onPress}>
        <PaperCard.Content style={[{ gap: tokens.spacing.cardGap }, contentStyle]}>
          {children}
        </PaperCard.Content>
      </PaperCard>
    );
  },
);

Card.displayName = 'Card';

