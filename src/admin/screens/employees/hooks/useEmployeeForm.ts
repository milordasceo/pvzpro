import { useState, useEffect } from 'react';
import { EmployeeFormData, EmployeeFormErrors } from '../types/employee.types';

/**
 * Хук для управления формой сотрудника
 */
export const useEmployeeForm = (employeeId?: string) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    phone: '',
    email: '',
    avatar: undefined,
    position: 'employee',
    employmentStatus: 'working',
    isActive: true,
    pvzId: '',
    hiredAt: new Date(),
    baseSalary: undefined,
  });

  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employeeId) {
      // Загрузка данных существующего сотрудника
      loadEmployee(employeeId);
    }
  }, [employeeId]);

  const loadEmployee = async (id: string) => {
    try {
      setLoading(true);

      // Симуляция задержки запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      // Моковые данные
      // В реальном приложении здесь будет API запрос
      const mockData: EmployeeFormData = {
        name: 'Анна Смирнова',
        phone: '+7 (999) 123-45-67',
        email: 'anna.smirnova@example.com',
        avatar: undefined,
        position: 'employee',
        employmentStatus: 'working',
        isActive: true,
        pvzId: 'pvz-1',
        hiredAt: new Date(2024, 6, 15),
        baseSalary: 40000,
      };

      setFormData(mockData);
    } catch (err) {
      console.error('Error loading employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: EmployeeFormErrors = {};

    // Проверка имени
    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя сотрудника';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    // Проверка телефона
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }

    // Проверка email (опционально)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    // Проверка ПВЗ
    if (!formData.pvzId) {
      newErrors.pvzId = 'Выберите ПВЗ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = <K extends keyof EmployeeFormData>(
    field: K,
    value: EmployeeFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очистить ошибку для этого поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const submitForm = async (): Promise<{ success: boolean; error?: string }> => {
    // Валидация
    if (!validateForm()) {
      return { success: false, error: 'Пожалуйста, исправьте ошибки в форме' };
    }

    try {
      setSubmitting(true);

      // Симуляция задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));

      // В реальном приложении здесь будет API запрос
      if (employeeId) {
        console.log('Updating employee:', { id: employeeId, data: formData });
      } else {
        console.log('Creating employee:', formData);
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при сохранении';
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      avatar: undefined,
      position: 'employee',
      employmentStatus: 'working',
      isActive: true,
      pvzId: '',
      hiredAt: new Date(),
      baseSalary: undefined,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    loading,
    submitting,
    updateField,
    submitForm,
    resetForm,
  };
};
