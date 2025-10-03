import React from 'react';
import { Dialog, Portal } from 'react-native-paper';
import { UI_TOKENS } from '../ui/themeTokens';

export interface StyledDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  usePortal?: boolean;
}

/**
 * Унифицированный диалог с предустановленными стилями
 * Заменяет повторяющиеся Dialog компоненты
 */
export const StyledDialog: React.FC<StyledDialogProps> = React.memo(
  ({ visible, onDismiss, title, children, actions, usePortal = true }) => {
    const dialogContent = (
      <Dialog visible={visible} onDismiss={onDismiss} style={{ borderRadius: UI_TOKENS.radius }}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>{children}</Dialog.Content>
        {actions && <Dialog.Actions>{actions}</Dialog.Actions>}
      </Dialog>
    );

    if (usePortal) {
      return <Portal>{dialogContent}</Portal>;
    }

    return dialogContent;
  },
);
