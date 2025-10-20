import { useState, useCallback, useEffect } from 'react';
import { getDashboardData, type DashboardData } from '../services/mockData';

/**
 * Хук для загрузки данных Dashboard
 */
export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>(getDashboardData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Имитация загрузки
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Получаем свежие данные
      setData(getDashboardData());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Автообновление каждые 30 секунд
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { data, loading, error, refresh };
};

