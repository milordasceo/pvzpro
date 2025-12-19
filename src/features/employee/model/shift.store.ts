import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStateStorage } from '../../../shared/utils/storage';

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
      
      // Имитация данных
      employee: {
        name: 'Александр Иванов',
        role: 'Старший смены',
      },
      pvz: {
        address: 'г. Москва, ул. Ленина, д. 1',
        rating: 4.98,
        marketplace: 'wb',
      },
      shift: {
        startTime: '09:00',
        endTime: '21:00',
        salary: 3500,
      },

      setMarketplace: (type) => set((state) => ({ 
        pvz: { ...state.pvz, marketplace: type } 
      })),

      startShift: () => set({ 
        isShiftOpen: true, 
        shiftStartTime: Date.now(),
        breaks: INITIAL_BREAKS.map(b => ({ ...b, status: 'available', startTime: null, endTime: null }))
      }),
      
      endShift: () => set({ 
        isShiftOpen: false, 
        shiftStartTime: null 
      }),

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
