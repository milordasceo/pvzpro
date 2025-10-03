/**
 * Store для управления текущим ПВЗ и фильтрами администратора
 * Использует Zustand с persist для сохранения выбранного ПВЗ
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdminPvz, AdminFilters } from '../../types/admin';
import { MOCK_PVZS } from '../services/mockData';

interface PvzState {
  // Текущий выбранный ПВЗ ('all' или ID конкретного ПВЗ)
  currentPvzId: string;
  
  // Список всех управляемых ПВЗ
  pvzList: AdminPvz[];
  
  // Фильтры для различных экранов
  filters: AdminFilters;
  
  // Actions
  setCurrentPvz: (pvzId: string) => void;
  getCurrentPvz: () => AdminPvz | null;
  setPvzList: (pvzList: AdminPvz[]) => void;
  setFilters: (filters: Partial<AdminFilters>) => void;
  resetFilters: () => void;
}

/**
 * Дефолтные фильтры
 */
const DEFAULT_FILTERS: AdminFilters = {
  pvzId: 'all',
  search: '',
  employeeStatus: 'all',
  shiftStatus: 'all',
  taskStatus: 'all',
  taskPriority: 'all',
  requestStatus: 'all',
  requestType: 'all',
  transactionType: 'all',
  transactionStatus: 'all',
};

/**
 * Store для управления ПВЗ администратора
 */
export const usePvzStore = create<PvzState>()(
  persist(
    (set, get) => ({
      // Начальные значения
      currentPvzId: 'all',
      pvzList: MOCK_PVZS,
      filters: DEFAULT_FILTERS,

      /**
       * Установить текущий ПВЗ
       */
      setCurrentPvz: (pvzId: string) => {
        set({ currentPvzId: pvzId });
        
        // Обновляем фильтр pvzId
        set((state) => ({
          filters: {
            ...state.filters,
            pvzId,
          },
        }));
      },

      /**
       * Получить текущий ПВЗ
       * Возвращает null если выбраны "Все ПВЗ"
       */
      getCurrentPvz: () => {
        const { currentPvzId, pvzList } = get();
        
        if (currentPvzId === 'all') {
          return null;
        }
        
        return pvzList.find((pvz) => pvz.id === currentPvzId) || null;
      },

      /**
       * Установить список ПВЗ
       */
      setPvzList: (pvzList: AdminPvz[]) => {
        set({ pvzList });
      },

      /**
       * Установить фильтры
       */
      setFilters: (filters: Partial<AdminFilters>) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
        }));
      },

      /**
       * Сбросить фильтры к дефолтным значениям
       */
      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS });
      },
    }),
    {
      name: 'admin-pvz-storage', // Ключ в AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      
      // Сохраняем только выбранный ПВЗ (не фильтры, не список)
      // Это уменьшает размер сохраняемых данных на 95%
      partialize: (state) => ({
        currentPvzId: state.currentPvzId,
      }),
    },
  ),
);

