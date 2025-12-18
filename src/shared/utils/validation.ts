/**
 * Утилиты для валидации форм
 * Унифицированные функции валидации для часто используемых случаев
 */

export const validateRequired = (value: string, fieldName: string = 'Поле'): string | undefined => {
  if (!value || value.trim() === '') {
    return `${fieldName} обязательно для заполнения`;
  }
  return undefined;
};

export const validateEmail = (value: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Введите корректный email';
  }
  return undefined;
};

export const validatePhone = (value: string): string | undefined => {
  const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
  if (!phoneRegex.test(value)) {
    return 'Введите корректный номер телефона';
  }
  return undefined;
};

export const validateMinLength =
  (minLength: number, fieldName: string = 'Поле') =>
  (value: string): string | undefined => {
    if (value.length < minLength) {
      return `${fieldName} должно содержать минимум ${minLength} символов`;
    }
    return undefined;
  };

export const validateMaxLength =
  (maxLength: number, fieldName: string = 'Поле') =>
  (value: string): string | undefined => {
    if (value.length > maxLength) {
      return `${fieldName} должно содержать максимум ${maxLength} символов`;
    }
    return undefined;
  };

export const validateNumeric = (value: string, fieldName: string = 'Поле'): string | undefined => {
  if (isNaN(Number(value))) {
    return `${fieldName} должно содержать только цифры`;
  }
  return undefined;
};

export const validateRange =
  (min: number, max: number, fieldName: string = 'Поле') =>
  (value: string): string | undefined => {
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) {
      return `${fieldName} должно быть в диапазоне от ${min} до ${max}`;
    }
    return undefined;
  };

export const composeValidators =
  (...validators: ((value: string) => string | undefined)[]) =>
  (value: string): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        return error;
      }
    }
    return undefined;
  };
