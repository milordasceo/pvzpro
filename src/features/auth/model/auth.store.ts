import { create } from 'zustand';

export type UserRole = 'employee' | 'manager' | 'owner' | null;

interface AuthState {
  role: UserRole;
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  isLoading: false,
  setRole: (role) => set({ role }),
  logout: () => set({ role: null }),
}));
