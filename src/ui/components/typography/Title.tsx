import React from 'react';
import { Text as PaperText, TextProps as PaperTextProps } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

type TitleSize = 'large' | 'medium' | 'small';

interface TitleProps extends Omit<PaperTextProps<never>, 'variant'> {
  size?: TitleSize;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const variantMap: Record<TitleSize, PaperTextProps<never>['variant']> = {
  large: 'titleLarge',
  medium: 'titleMedium',
  small: 'titleSmall',
};

export const Title: React.FC<TitleProps> = ({ 
  size = 'medium', 
  style,
  children,
  ...rest 
}) => {
  return (
    <PaperText 
      variant={variantMap[size]}
      style={style}
      {...rest}
    >
      {children}
    </PaperText>
  );
};
