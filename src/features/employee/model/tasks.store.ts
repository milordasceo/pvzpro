import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStateStorage } from '../../../shared/utils/storage';

export type TaskType = 'checklist' | 'custom';
export type TaskStatus = 'pending' | 'completed';

export interface ChecklistItem {
  id: string;
  title: string;
  photoUrl?: string;
  completed: boolean;
}

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description?: string;
  deadline?: string;
  status: TaskStatus;
  items?: ChecklistItem[]; // Только для чек-листов
  photoUrl?: string; // Для кастомных задач
  completedAt?: number;
}

interface TasksState {
  tasks: Task[];
  setTaskPhoto: (taskId: string, photoUrl: string, itemId?: string) => void;
  completeTask: (taskId: string) => void;
  resetTasks: () => void;
}

const MOCK_TASKS: Task[] = [
  {
    id: 'ch-1',
    type: 'checklist',
    title: 'Ежедневная уборка (Утро)',
    description: 'Необходимо сделать фото каждого этапа для подтверждения.',
    deadline: '10:00',
    status: 'pending',
    items: [
      { id: 'i1', title: 'Протереть пол в клиентской зоне', completed: false },
      { id: 'i2', title: 'Очистить стойку выдачи от пыли', completed: false },
      { id: 'i3', title: 'Протереть зеркала в примерочных', completed: false },
      { id: 'i4', title: 'Вынести мусор из корзин', completed: false },
      { id: 'i5', title: 'Проверить наличие ложек для обуви', completed: false },
    ],
  },
  {
    id: 'ch-2',
    type: 'checklist',
    title: 'Санитарный час',
    description: 'Дезинфекция поверхностей и проветривание.',
    deadline: '14:00',
    status: 'pending',
    items: [
      { id: 's1', title: 'Дезинфекция дверных ручек', completed: false },
      { id: 's2', title: 'Проветривание (15 минут)', completed: false },
    ],
  },
  {
    id: 't-1',
    type: 'custom',
    title: 'Инвентаризация пакетов',
    description: 'Посчитайте количество больших фирменных пакетов на складе. Прикрепите фото полки.',
    deadline: '18:00',
    status: 'pending',
  },
];

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: MOCK_TASKS,

      setTaskPhoto: (taskId, photoUrl, itemId) => set((state) => {
        const newTasks = state.tasks.map(task => {
          if (task.id === taskId) {
            if (task.type === 'checklist' && itemId) {
              const newItems = task.items?.map(item =>
                item.id === itemId ? { ...item, photoUrl, completed: true } : item
              );
              return { ...task, items: newItems };
            } else {
              return { ...task, photoUrl, status: 'completed' as const, completedAt: Date.now() };
            }
          }
          return task;
        });
        return { tasks: newTasks };
      }),

      completeTask: (taskId) => set((state) => {
        const newTasks = state.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, status: 'completed' as const, completedAt: Date.now() };
          }
          return task;
        });
        return { tasks: newTasks };
      }),

      resetTasks: () => set({ tasks: MOCK_TASKS }),
    }),
    {
      name: 'tasks-storage-v1',
      storage: createJSONStorage(() => createStateStorage()),
    }
  )
);

