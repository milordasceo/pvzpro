import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStateStorage } from '../utils/storage';

export type RequestType = 'swap' | 'overtime' | 'schedule_change';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface RequestItem {
  id: string;
  type: RequestType;
  employeeId: string;
  date: string; // YYYY-MM-DD, исходная дата
  targetDate?: string; // для обмена/подработки
  reason?: string;
  addDates?: string[];
  removeDates?: string[];
  status: RequestStatus;
  createdAt: number; // ms
  updatedAt: number; // ms
}

export interface RequestsState {
  items: Record<string, RequestItem>; // id -> item
  indexByDate: Record<string, string[]>; // dateKey -> [id]

  submit: (payload: Omit<RequestItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => string;
  cancel: (id: string) => void;
  listByDate: (dateKey: string) => RequestItem[];
  hasPendingOnDate: (dateKey: string) => boolean;
}

function dateKeyOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set, get) => ({
      items: {},
      indexByDate: {},

      submit: (payload) => {
        const id = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const now = Date.now();
        const item: RequestItem = {
          id,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          ...payload,
        };
        set((state) => {
          const items = { ...state.items, [id]: item };
          const idx = { ...state.indexByDate };
          const list = idx[item.date] ? [...idx[item.date]] : [];
          list.unshift(id);
          idx[item.date] = list;
          return { items, indexByDate: idx };
        });
        return id;
      },

      cancel: (id) => {
        const item = get().items[id];
        if (!item || item.status !== 'pending') return;
        const updated: RequestItem = { ...item, status: 'cancelled', updatedAt: Date.now() };
        set((state) => ({ items: { ...state.items, [id]: updated } }));
      },

      listByDate: (dateKey) => {
        const { indexByDate, items } = get();
        const ids = indexByDate[dateKey] || [];
        return ids.map((i) => items[i]).filter(Boolean);
      },

      hasPendingOnDate: (dateKey) => {
        const list = get().listByDate(dateKey);
        return list.some((r) => r.status === 'pending');
      },
    }),
    {
      name: 'requests-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items, indexByDate: state.indexByDate }),
    },
  ),
);

export function buildDateKey(d: Date): string {
  return dateKeyOf(d);
}
