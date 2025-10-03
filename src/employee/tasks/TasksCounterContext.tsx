import React, { createContext, useContext, useState } from 'react';

interface TasksCounterContextType {
  pendingCount: number;
  completedCount: number;
  setPendingCount: (n: number) => void;
  setCompletedCount: (n: number) => void;
}

const TasksCounterContext = createContext<TasksCounterContextType | undefined>(undefined);

// Начальное количество задач (2 чек-листа + 1 задание)
const INITIAL_PENDING_COUNT = 3;
const INITIAL_COMPLETED_COUNT = 0;

export const TasksCounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingCount, setPendingCount] = useState(INITIAL_PENDING_COUNT);
  const [completedCount, setCompletedCount] = useState(INITIAL_COMPLETED_COUNT);
  return (
    <TasksCounterContext.Provider value={{ pendingCount, setPendingCount, completedCount, setCompletedCount }}>
      {children}
    </TasksCounterContext.Provider>
  );
};

export function useTasksCounter(): TasksCounterContextType {
  const ctx = useContext(TasksCounterContext);
  if (!ctx) throw new Error('useTasksCounter must be used within TasksCounterProvider');
  return ctx;
}
