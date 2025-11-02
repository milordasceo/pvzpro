import { useState } from 'react';

/**
 * Хук для действий над сотрудником
 */
export const useEmployeeActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Удалить сотрудника
   */
  const deleteEmployee = async (employeeId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Симуляция задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));

      // В реальном приложении здесь будет API запрос
      console.log('Employee deleted:', employeeId);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении сотрудника';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Изменить статус сотрудника
   */
  const changeStatus = async (
    employeeId: string, 
    status: 'working' | 'day_off' | 'sick_leave' | 'vacation' | 'fired'
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Симуляция задержки запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      // В реальном приложении здесь будет API запрос
      console.log('Status changed:', { employeeId, status });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при изменении статуса';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Назначить задачу сотруднику
   */
  const assignTask = async (employeeId: string, taskData: any) => {
    try {
      setLoading(true);
      setError(null);

      // Симуляция задержки запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      // В реальном приложении здесь будет API запрос
      console.log('Task assigned:', { employeeId, taskData });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при назначении задачи';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteEmployee,
    changeStatus,
    assignTask,
    loading,
    error,
  };
};
