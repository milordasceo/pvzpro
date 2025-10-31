import React from 'react';
import { Text as PaperText, TextProps as PaperTextProps } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

type HeadingLevel = 1 | 2 | 3;

interface HeadingProps extends Omit<PaperTextProps<never>, 'variant'> {
  level?: HeadingLevel;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const variantMap: Record<HeadingLevel, PaperTextProps<never>['variant']> = {
  1: 'headlineLarge',
  2: 'headlineMedium',
  3: 'headlineSmall',
};

export const Heading: React.FC<HeadingProps> = ({ 
  level = 1, 
  style,
  children,
  ...rest 
}) => {
  return (
    <PaperText 
      variant={variantMap[level]}
      style={style}
      {...rest}
    >
      {children}
    </PaperText>
  );
};
