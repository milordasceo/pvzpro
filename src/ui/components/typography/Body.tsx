import React from 'react';
import { Text as PaperText, TextProps as PaperTextProps } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

type BodySize = 'large' | 'medium' | 'small';

interface BodyProps extends Omit<PaperTextProps<never>, 'variant'> {
  size?: BodySize;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const variantMap: Record<BodySize, PaperTextProps<never>['variant']> = {
  large: 'bodyLarge',
  medium: 'bodyMedium',
  small: 'bodySmall',
};

export const Body: React.FC<BodyProps> = ({ 
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
