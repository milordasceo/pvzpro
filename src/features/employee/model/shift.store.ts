import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStateStorage } from '../../../shared/utils/storage';
import { MOCK_EMPLOYEE, MOCK_PVZ, MOCK_SHIFT } from './mocks';

export type MarketplaceType = 'wb' | 'ozon' | 'yandex';

interface EmployeeInfo {
  name: string;
  role: string;
  avatarUrl?: string;
}

interface PVZInfo {
  address: string;
  rating: number;
  marketplace: MarketplaceType;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface ShiftInfo {
  startTime: string;
  endTime: string;
  salary: number;
}

export interface BreakSession {
  id: number;
  status: 'available' | 'active' | 'completed';
  startTime: number | null;
  endTime: number | null;
  durationLimit: number;
}

interface ShiftState {
  isShiftOpen: boolean;
  shiftStartTime: number | null;

  // Break Management
  breaks: BreakSession[];

  // Mock Data
  employee: EmployeeInfo;
  pvz: PVZInfo;
  shift: ShiftInfo;

  startShift: () => void;
  endShift: () => void;

  startBreak: () => void;
  endBreak: () => void;
  setMarketplace: (type: MarketplaceType) => void;
}

const INITIAL_BREAKS: BreakSession[] = [
  { id: 1, status: 'available', startTime: null, endTime: null, durationLimit: 10 },
  { id: 2, status: 'available', startTime: null, endTime: null, durationLimit: 10 },
  { id: 3, status: 'available', startTime: null, endTime: null, durationLimit: 10 },
];

export const useShiftStore = create<ShiftState>()(
  persist(
    (set, get) => ({
      isShiftOpen: false,
      shiftStartTime: null,
      breaks: INITIAL_BREAKS,

      // Используем mock-данные из отдельного файла
      employee: MOCK_EMPLOYEE,
      pvz: MOCK_PVZ,
      shift: MOCK_SHIFT,

      setMarketplace: (type) => set((state) => ({
        pvz: { ...state.pvz, marketplace: type }
      })),

      startShift: () => set({
        isShiftOpen: true,
        shiftStartTime: Date.now(),
        breaks: INITIAL_BREAKS.map(b => ({ ...b, status: 'available', startTime: null, endTime: null }))
      }),

      endShift: () => {
        // Reset tasks when ending shift (for testing)
        import('../model/tasks.store').then(({ useTasksStore }) => {
          useTasksStore.getState().resetTasks();
        });
        set({
          isShiftOpen: false,
          shiftStartTime: null
        });
      },

      startBreak: () => {
        const { breaks } = get();
        const nextBreakIndex = breaks.findIndex(b => b.status === 'available');
        if (nextBreakIndex === -1) return;

        const updatedBreaks = [...breaks];
        updatedBreaks[nextBreakIndex] = {
          ...updatedBreaks[nextBreakIndex],
          status: 'active',
          startTime: Date.now(),
        };

        set({ breaks: updatedBreaks });
      },

      endBreak: () => {
        const { breaks } = get();
        const activeBreakIndex = breaks.findIndex(b => b.status === 'active');
        if (activeBreakIndex === -1) return;

        const updatedBreaks = [...breaks];
        updatedBreaks[activeBreakIndex] = {
          ...updatedBreaks[activeBreakIndex],
          status: 'completed',
          endTime: Date.now(),
        };

        set({ breaks: updatedBreaks });
      }
    }),
    {
      name: 'shift-storage-v3',
      storage: createJSONStorage(() => createStateStorage()),
      version: 1,
    }
  )
);
