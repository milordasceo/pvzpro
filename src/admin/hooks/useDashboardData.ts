import { useState, useCallback, useEffect } from 'react';
import { getDashboardData, type DashboardData } from '../services/mockData';

/**
 * Хук для загрузки данных Dashboard
 */
export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>(getDashboardData());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Получаем свежие данные
    setData(getDashboardData());
    
    setLoading(false);
  }, []);

  useEffect(() => {
    // Автообновление каждые 30 секунд
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { data, loading, refresh };
};

