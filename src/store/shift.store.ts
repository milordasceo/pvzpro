import { create } from 'zustand';
import { persist, subscribeWithSelector, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shift, ShiftStatus, ShiftBreak } from '../types';
import { createStateStorage } from '../utils/storage';

interface ShiftState {
  // Состояние
  currentShift: Shift | null;
  shifts: Shift[];
  isLoading: boolean;
  error: string | null;

  // Действия
  startShift: (
    shiftData: Omit<
      Shift,
      'id' | 'status' | 'startTime' | 'breaks' | 'totalBreakTime' | 'createdAt' | 'updatedAt'
    >,
  ) => Promise<void>;
  endShift: () => Promise<void>;
  takeBreak: (duration?: number) => Promise<void>;
  endBreak: () => Promise<void>;
  loadShifts: (employeeId: string) => Promise<void>;
  updateShift: (shiftId: string, updates: Partial<Shift>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Store для управления сменами сотрудников
 */
export const useShiftStore = create<ShiftState>()(
  persist(
    subscribeWithSelector((set, get) => ({
      // Начальное состояние
      currentShift: null,
      shifts: [],
      isLoading: false,
      error: null,

      // Действия
      startShift: async (shiftData) => {
        set({ isLoading: true, error: null });

        try {
          const newShift: Shift = {
            ...shiftData,
            id: `shift_${Date.now()}`,
            status: 'active',
            startTime: new Date(),
            breaks: [],
            totalBreakTime: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            currentShift: newShift,
            shifts: [newShift, ...state.shifts],
            isLoading: false,
          }));

          // Здесь можно добавить вызов API для сохранения смены
          console.log('Shift started:', newShift);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to start shift',
            isLoading: false,
          });
        }
      },

      endShift: async () => {
        const currentShift = get().currentShift;
        if (!currentShift) return;

        set({ isLoading: true, error: null });

        try {
          const updatedShift: Shift = {
            ...currentShift,
            status: 'finished',
            endTime: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            currentShift: null,
            shifts: state.shifts.map((shift) =>
              shift.id === currentShift.id ? updatedShift : shift,
            ),
            isLoading: false,
          }));

          console.log('Shift ended:', updatedShift);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to end shift',
            isLoading: false,
          });
        }
      },

      takeBreak: async (duration = 10) => {
        const currentShift = get().currentShift;
        if (!currentShift || currentShift.status !== 'active') return;

        set({ isLoading: true, error: null });

        try {
          const newBreak: ShiftBreak = {
            id: `break_${Date.now()}`,
            startTime: new Date(),
            duration,
            isAutoEnded: false,
          };

          const updatedShift: Shift = {
            ...currentShift,
            status: 'break',
            breaks: [...currentShift.breaks, newBreak],
            updatedAt: new Date(),
          };

          set((state) => ({
            currentShift: updatedShift,
            shifts: state.shifts.map((shift) =>
              shift.id === currentShift.id ? updatedShift : shift,
            ),
            isLoading: false,
          }));

          console.log('Break started:', newBreak);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to start break',
            isLoading: false,
          });
        }
      },

      endBreak: async () => {
        const currentShift = get().currentShift;
        if (!currentShift || currentShift.status !== 'break') return;

        set({ isLoading: true, error: null });

        try {
          const lastBreak = currentShift.breaks[currentShift.breaks.length - 1];
          if (!lastBreak) return;

          const endTime = new Date();
          const duration = Math.floor(
            (endTime.getTime() - lastBreak.startTime.getTime()) / (1000 * 60),
          );

          const updatedBreak: ShiftBreak = {
            ...lastBreak,
            endTime,
          };

          const updatedShift: Shift = {
            ...currentShift,
            status: 'active',
            breaks: currentShift.breaks.map((breakItem) =>
              breakItem.id === lastBreak.id ? updatedBreak : breakItem,
            ),
            totalBreakTime: currentShift.totalBreakTime + duration,
            updatedAt: new Date(),
          };

          set((state) => ({
            currentShift: updatedShift,
            shifts: state.shifts.map((shift) =>
              shift.id === currentShift.id ? updatedShift : shift,
            ),
            isLoading: false,
          }));

          console.log('Break ended:', updatedBreak);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to end break',
            isLoading: false,
          });
        }
      },

      loadShifts: async (employeeId: string) => {
        set({ isLoading: true, error: null });

        try {
          // Здесь должен быть вызов API
          // Для демо используем моковые данные
          const mockShifts: Shift[] = [];

          set({
            shifts: mockShifts,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load shifts',
            isLoading: false,
          });
        }
      },

      updateShift: async (shiftId: string, updates: Partial<Shift>) => {
        set({ isLoading: true, error: null });

        try {
          set((state) => ({
            shifts: state.shifts.map((shift) =>
              shift.id === shiftId ? { ...shift, ...updates, updatedAt: new Date() } : shift,
            ),
            currentShift:
              state.currentShift?.id === shiftId
                ? { ...state.currentShift, ...updates, updatedAt: new Date() }
                : state.currentShift,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update shift',
            isLoading: false,
          });
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
    })),
    {
      name: 'shift-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentShift: state.currentShift,
        shifts: state.shifts,
      }),
    },
  ),
);

// Селекторы
export const useCurrentShift = () => useShiftStore((state) => state.currentShift);
export const useShifts = () => useShiftStore((state) => state.shifts);
export const useShiftStatus = (): ShiftStatus | null => {
  const currentShift = useShiftStore((state) => state.currentShift);
  return currentShift?.status || null;
};
export const useIsOnBreak = () => {
  const status = useShiftStatus();
  return status === 'break';
};
export const useTotalBreakTime = () => {
  const currentShift = useShiftStore((state) => state.currentShift);
  return currentShift?.totalBreakTime || 0;
};
