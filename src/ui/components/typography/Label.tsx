import React from 'react';
import { Text as PaperText, TextProps as PaperTextProps } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

type LabelSize = 'large' | 'medium' | 'small';

interface LabelProps extends Omit<PaperTextProps<never>, 'variant'> {
  size?: LabelSize;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const variantMap: Record<LabelSize, PaperTextProps<never>['variant']> = {
  large: 'labelLarge',
  medium: 'labelMedium',
  small: 'labelSmall',
};

export const Label: React.FC<LabelProps> = ({ 
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
