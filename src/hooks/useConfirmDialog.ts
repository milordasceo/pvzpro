import { useState, useCallback } from 'react';

export interface ConfirmDialogState {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface UseConfirmDialogReturn {
  dialogState: ConfirmDialogState | null;
  showConfirmDialog: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => void;
  hideConfirmDialog: () => void;
}

/**
 * Хук для управления диалогами подтверждения
 * Унифицирует логику показа/скрытия диалогов подтверждения
 */
export const useConfirmDialog = (): UseConfirmDialogReturn => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState | null>(null);

  const showConfirmDialog = useCallback(
    (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
      setDialogState({
        visible: true,
        title,
        message,
        onConfirm,
        onCancel,
      });
    },
    [],
  );

  const hideConfirmDialog = useCallback(() => {
    setDialogState(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialogState?.onConfirm) {
      dialogState.onConfirm();
    }
    hideConfirmDialog();
  }, [dialogState, hideConfirmDialog]);

  const handleCancel = useCallback(() => {
    if (dialogState?.onCancel) {
      dialogState.onCancel();
    }
    hideConfirmDialog();
  }, [dialogState, hideConfirmDialog]);

  return {
    dialogState: dialogState
      ? {
          ...dialogState,
          onConfirm: handleConfirm,
          onCancel: handleCancel,
        }
      : null,
    showConfirmDialog,
    hideConfirmDialog,
  };
};
