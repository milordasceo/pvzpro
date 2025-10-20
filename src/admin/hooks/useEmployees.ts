import { useState, useEffect, useCallback } from 'react';
import { AdminEmployee } from '../../types/admin';

interface EmployeeFilters {
  status: 'all' | 'active' | 'inactive';
  pvzId: string;
  onShift?: boolean;
}

// Mock data для разработки
const mockEmployees: AdminEmployee[] = [
  {
    id: '1',
    name: 'Иванов Иван',
    email: 'ivanov@example.com',
    phone: '+7 (999) 123-45-67',
    avatar: undefined,
    role: 'employee',
    pvzId: 'pvz1',
    pvzName: 'ПВЗ на Ленина, 15',
    stats: {
      totalShifts: 45,
      currentMonthShifts: 12,
      totalHours: 180,
      averageRating: 4.5,
      completedTasks: 89,
      pendingRequests: 1,
    },
    salary: {
      earned: 45000,
      bonuses: 5000,
      penalties: 0,
      total: 50000,
    },
    isActive: true,
    isOnShift: true,
    lastShiftDate: new Date(),
    hiredAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Петрова Мария',
    email: 'petrova@example.com',
    phone: '+7 (999) 234-56-78',
    avatar: undefined,
    role: 'employee',
    pvzId: 'pvz1',
    pvzName: 'ПВЗ на Ленина, 15',
    stats: {
      totalShifts: 38,
      currentMonthShifts: 10,
      totalHours: 152,
      averageRating: 4.8,
      completedTasks: 76,
      pendingRequests: 0,
    },
    salary: {
      earned: 40000,
      bonuses: 3000,
      penalties: 500,
      total: 42500,
    },
    isActive: true,
    isOnShift: false,
    lastShiftDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    hiredAt: new Date('2024-02-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Сидоров Петр',
    email: undefined,
    phone: '+7 (999) 345-67-89',
    avatar: undefined,
    role: 'employee',
    pvzId: 'pvz2',
    pvzName: 'ПВЗ на Гагарина, 23',
    stats: {
      totalShifts: 52,
      currentMonthShifts: 15,
      totalHours: 208,
      averageRating: 4.2,
      completedTasks: 104,
      pendingRequests: 2,
    },
    salary: {
      earned: 52000,
      bonuses: 8000,
      penalties: 1000,
      total: 59000,
    },
    isActive: true,
    isOnShift: true,
    lastShiftDate: new Date(),
    hiredAt: new Date('2023-12-01'),
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Смирнова Анна',
    email: 'smirnova@example.com',
    phone: '+7 (999) 456-78-90',
    avatar: undefined,
    role: 'employee',
    pvzId: 'pvz1',
    pvzName: 'ПВЗ на Ленина, 15',
    stats: {
      totalShifts: 12,
      currentMonthShifts: 4,
      totalHours: 48,
      averageRating: 4.0,
      completedTasks: 24,
      pendingRequests: 0,
    },
    salary: {
      earned: 15000,
      bonuses: 1000,
      penalties: 0,
      total: 16000,
    },
    isActive: false,
    isOnShift: false,
    lastShiftDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    hiredAt: new Date('2024-09-01'),
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date(),
  },
];

export const useEmployees = (filters: EmployeeFilters) => {
  const [employees, setEmployees] = useState<AdminEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Симуляция API запроса
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Применение фильтров
      let filtered = [...mockEmployees];

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

