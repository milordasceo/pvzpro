import React from 'react';
import { Text as PaperText, TextProps as PaperTextProps } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';
import { tokens } from '../../../ui/theme';

interface CaptionProps extends Omit<PaperTextProps<never>, 'variant'> {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const Caption: React.FC<CaptionProps> = ({ 
  style,
  children,
  ...rest 
}) => {
  return (
    <PaperText 
      variant="bodySmall"
      style={[
        { color: tokens.colors.text.secondary },
        style
      ]}
      {...rest}
    >
      {children}
    </PaperText>
  );
};
