import { useState, useCallback, useEffect } from 'react';

export interface FormField {
  value: string;
  error?: string;
  touched?: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface UseFormReturn<T extends FormState> {
  formState: T;
  setValue: (field: keyof T, value: string) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  isValid: boolean;
  hasErrors: boolean;
  touchedFields: (keyof T)[];
}

/**
 * Хук для управления состоянием формы с валидацией
 * Унифицирует работу с формами и валидацией полей
 */
export const useForm = <T extends FormState>(
  initialState: T,
  validators?: Partial<Record<keyof T, (value: string) => string | undefined>>,
): UseFormReturn<T> => {
  const [formState, setFormState] = useState<T>(initialState);

  const setValue = useCallback(
    (field: keyof T, value: string) => {
      setFormState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value,
          touched: true,
          error: validators?.[field]?.(value),
        },
      }));
    },
    [validators],
  );

  const setError = useCallback((field: keyof T, error: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        error,
      },
    }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setFormState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        error: undefined,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(initialState);
  }, [initialState]);

  const validateForm = useCallback(() => {
    let isValid = true;
    const newState = { ...formState };

    Object.keys(validators || {}).forEach((key) => {
      const field = key as keyof T;
      const validator = validators?.[field];
      if (validator) {
        const error = validator(newState[field].value);
        if (error) {
          isValid = false;
          newState[field] = {
            ...newState[field],
            error,
            touched: true,
          };
        }
      }
    });

    setFormState(newState);
    return isValid;
  }, [formState, validators]);

  const isValid = Object.values(formState).every(
    (field) => !field.error && (!validators || !field.touched || field.value.trim() !== ''),
  );

  const hasErrors = Object.values(formState).some((field) => field.error);
  const touchedFields = Object.keys(formState).filter(
    (key) => formState[key as keyof T].touched,
  ) as (keyof T)[];

  return {
    formState,
    setValue,
    setError,
    clearError,
    resetForm,
    validateForm,
    isValid,
    hasErrors,
    touchedFields,
  };
};
