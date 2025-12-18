import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

const createFallbackStorage = (): StateStorage => {
  const memory: Record<string, string> = {};
  return {
    getItem: async (name) => memory[name] ?? null,
    setItem: async (name, value) => {
      memory[name] = value;
    },
    removeItem: async (name) => {
      delete memory[name];
    },
  };
};

export const createStateStorage = (): StateStorage => {
  try {
    if (AsyncStorage) {
      return AsyncStorage as unknown as StateStorage;
    }
  } catch {
    // ignore
  }

  return createFallbackStorage();
};
