import { useState, useEffect } from 'react';
import { AdminEmployee } from '../../../../types/admin';

/**
 * Хук для получения деталей сотрудника
 */
export const useEmployeeDetails = (employeeId: string) => {
  const [employee, setEmployee] = useState<AdminEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);

      // Симуляция задержки запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      // Моковые данные сотрудника
      // В реальном приложении здесь будет API запрос
      const mockEmployee: AdminEmployee = {
        id: employeeId,
        name: 'Анна Смирнова',
        email: 'anna.smirnova@example.com',
        phone: '+7 (999) 123-45-67',
        avatar: undefined,
        role: 'employee',
        pvzId: 'pvz-1',
        pvzName: 'ПВЗ Московская, 12',
        stats: {
          totalShifts: 45,
          currentMonthShifts: 12,
          totalHours: 360,
          averageRating: 4.7,
          completedTasks: 89,
          pendingRequests: 2,
        },
        salary: {
          earned: 45000,
          bonuses: 5000,
          penalties: 1000,
          total: 49000,
        },
        isActive: true,
        isOnShift: true,
        employmentStatus: 'working',
        position: 'employee',
        lastShiftDate: new Date(2025, 10, 2),
        hiredAt: new Date(2024, 6, 15),
        createdAt: new Date(2024, 6, 15),
        updatedAt: new Date(2025, 10, 2),
      };

      setEmployee(mockEmployee);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных сотрудника');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  return {
    employee,
    loading,
    error,
    refresh: fetchEmployee,
  };
};
