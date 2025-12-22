import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStateStorage } from '../../../shared/utils/storage';

export interface ScheduleShift {
  date: string; // ISO string YYYY-MM-DD
  startTime: string;
  endTime: string;
  pvzAddress: string;
  salary: number;
}

interface ScheduleState {
  shifts: ScheduleShift[];
  pendingChanges: {
    added: string[]; // dates
    removed: string[]; // dates
  };
  isEditing: boolean;
  
  // Actions
  setEditing: (isEditing: boolean) => void;
  toggleShift: (date: string) => void;
  clearPendingChanges: () => void;
  submitRequest: () => void;
}

// Mock initial shifts
const MOCK_SHIFTS: ScheduleShift[] = [
  { date: '2025-12-21', startTime: '09:00', endTime: '21:00', pvzAddress: 'г. Москва, ул. Ленина, д. 1', salary: 3500 },
  { date: '2025-12-23', startTime: '09:00', endTime: '21:00', pvzAddress: 'г. Москва, ул. Ленина, д. 1', salary: 3500 },
  { date: '2025-12-24', startTime: '09:00', endTime: '21:00', pvzAddress: 'г. Москва, ул. Ленина, д. 1', salary: 3500 },
  { date: '2025-12-26', startTime: '09:00', endTime: '21:00', pvzAddress: 'г. Москва, ул. Ленина, д. 1', salary: 3500 },
  { date: '2025-12-27', startTime: '09:00', endTime: '21:00', pvzAddress: 'г. Москва, ул. Ленина, д. 1', salary: 3500 },
];

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      shifts: MOCK_SHIFTS,
      pendingChanges: {
        added: [],
        removed: [],
      },
      isEditing: false,

      setEditing: (isEditing) => set({ 
        isEditing,
        pendingChanges: isEditing ? get().pendingChanges : { added: [], removed: [] }
      }),

      toggleShift: (date) => {
        const { shifts, pendingChanges, isEditing } = get();
        if (!isEditing) return;

        const isExisting = shifts.some(s => s.date === date);
        const isAdded = pendingChanges.added.includes(date);
        const isRemoved = pendingChanges.removed.includes(date);

        if (isExisting) {
          if (isRemoved) {
            // Undo removal
            set({
              pendingChanges: {
                ...pendingChanges,
                removed: pendingChanges.removed.filter(d => d !== date)
              }
            });
          } else {
            // Mark for removal
            set({
              pendingChanges: {
                ...pendingChanges,
                removed: [...pendingChanges.removed, date]
              }
            });
          }
        } else {
          if (isAdded) {
            // Undo addition
            set({
              pendingChanges: {
                ...pendingChanges,
                added: pendingChanges.added.filter(d => d !== date)
              }
            });
          } else {
            // Mark for addition
            set({
              pendingChanges: {
                ...pendingChanges,
                added: [...pendingChanges.added, date]
              }
            });
          }
        }
      },

      clearPendingChanges: () => set({
        pendingChanges: { added: [], removed: [] }
      }),

      submitRequest: () => {
        // In a real app, this would send an API request
        // For now, we just clear pending changes and exit edit mode
        set({
          isEditing: false,
          pendingChanges: { added: [], removed: [] }
        });
      }
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => createStateStorage()),
    }
  )
);


