import { useState, useEffect, useCallback } from 'react';
import { AdminEmployee } from '../../types/admin';
import { MOCK_EMPLOYEES } from '../services/mockData';

interface EmployeeFilters {
  status: 'all' | 'active' | 'inactive';
  pvzId: string;
  onShift?: boolean;
}

export const useEmployees = (filters: EmployeeFilters) => {
  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Симуляция API запроса
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Применение фильтров к централизованным данным
      let filtered = [...MOCK_EMPLOYEES];

      if (filters.status !== 'all') {
        filtered = filtered.filter((emp) =>
          filters.status === 'active' ? emp.isActive : !emp.isActive
        );
      }

      if (filters.onShift !== undefined) {
        filtered = filtered.filter((emp) => emp.isOnShift === filters.onShift);
      }

      if (filters.pvzId && filters.pvzId !== 'all') {
        filtered = filtered.filter((emp) => emp.pvzId === filters.pvzId);
      }

      setEmployees(filtered);
    } catch (err) {
      setError('Не удалось загрузить список сотрудников');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refresh = useCallback(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  return {
    employees,
    loading,
    error,
    refresh,
  };
};

