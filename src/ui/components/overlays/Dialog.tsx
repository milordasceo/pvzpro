import React from 'react';
import { Dialog as PaperDialog, Portal } from 'react-native-paper';
import { tokens } from '../../theme';

export interface DialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  usePortal?: boolean;
}

/**
 * 💬 Dialog - Унифицированный диалог
 * 
 * Обёртка над React Native Paper Dialog с предустановленными стилями
 * и поддержкой Portal для корректного отображения.
 * 
 * @example
 * ```tsx
 * <Dialog
 *   visible={isVisible}
 *   onDismiss={handleClose}
 *   title="Подтверждение"
 *   actions={
 *     <>
 *       <Button mode="text" onPress={handleClose}>Отмена</Button>
 *       <Button mode="contained" onPress={handleConfirm}>OK</Button>
 *     </>
 *   }
 * >
 *   <Text>Вы уверены?</Text>
 * </Dialog>
 * ```
 * 
 * @example
 * ```tsx
 * <Dialog
 *   visible={isVisible}
 *   onDismiss={handleClose}
 *   title="Информация"
 *   usePortal={false}
 * >
 *   <Text>Простой диалог без Portal</Text>
 * </Dialog>
 * ```
 */
export const Dialog: React.FC<DialogProps> = React.memo(
  ({ visible, onDismiss, title, children, actions, usePortal = true }) => {
    const dialogContent = (
      <PaperDialog 
        visible={visible} 
        onDismiss={onDismiss} 
        style={{ borderRadius: tokens.radius.lg }}
      >
        <PaperDialog.Title>{title}</PaperDialog.Title>
        <PaperDialog.Content>{children}</PaperDialog.Content>
        {actions && <PaperDialog.Actions>{actions}</PaperDialog.Actions>}
      </PaperDialog>
    );

    if (usePortal) {
      return <Portal>{dialogContent}</Portal>;
    }

    return dialogContent;
  },
);

Dialog.displayName = 'Dialog';

