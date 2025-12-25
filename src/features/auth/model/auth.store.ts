import { create } from 'zustand';
import { UserRole } from '../../../shared/types';

// Re-export for backward compatibility
export { UserRole };

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
