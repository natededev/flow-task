import { useEffect, useRef, useCallback } from 'react';
import { Task, Project } from '@/types';

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number;
  priorityDistribution: Record<string, number>;
  activeProjects: number;
}

interface TaskFilters {
  status?: string;
  priority?: string;
  project?: string;
  search?: string;
}

interface UseTaskWorkerReturn {
  calculateStats: (tasks: Task[], projects: Project[]) => Promise<TaskStats | null>;
  filterTasks: (tasks: Task[], filters: TaskFilters) => Promise<Task[] | null>;
  sortTasks: (tasks: Task[], sortBy: string, sortOrder: 'asc' | 'desc') => Promise<Task[] | null>;
  cleanup: () => void;
}

export const useTaskWorker = (): UseTaskWorkerReturn => {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (result: unknown) => void>>(new Map());

  useEffect(() => {
    const callbacks = callbacksRef.current;
    
    // Only create worker in production or when needed
    if (typeof Worker !== 'undefined') {
      try {
        workerRef.current = new Worker(
          new URL('../workers/taskWorker.ts', import.meta.url),
          { type: 'module' }
        );

        workerRef.current.onmessage = (event) => {
          const { type, payload } = event.data;
          const callback = callbacks.get(type);
          if (callback) {
            callback(payload);
            callbacks.delete(type);
          }
        };

        workerRef.current.onerror = (error) => {
          console.warn('Task worker error:', error);
        };
      } catch (error) {
        console.warn('Web Worker not supported or failed to load:', error);
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      callbacks.clear();
    };
  }, []);

  const postMessage = useCallback((type: string, payload: unknown): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        // Fallback to main thread if worker not available
        resolve(null);
        return;
      }

      const resultType = `${type}_RESULT`;
      callbacksRef.current.set(resultType, resolve);
      callbacksRef.current.set('ERROR', reject);

      try {
        workerRef.current.postMessage({ type, payload });
      } catch (error) {
        callbacksRef.current.delete(resultType);
        callbacksRef.current.delete('ERROR');
        reject(error);
      }
    });
  }, []);

  const calculateStats = useCallback(async (tasks: Task[], projects: Project[]): Promise<TaskStats | null> => {
    const result = await postMessage('CALCULATE_STATS', { tasks, projects });
    return result as TaskStats | null;
  }, [postMessage]);

  const filterTasks = useCallback(async (tasks: Task[], filters: TaskFilters): Promise<Task[] | null> => {
    const result = await postMessage('FILTER_TASKS', { tasks, filters });
    return result as Task[] | null;
  }, [postMessage]);

  const sortTasks = useCallback(async (tasks: Task[], sortBy: string, sortOrder: 'asc' | 'desc'): Promise<Task[] | null> => {
    const result = await postMessage('SORT_TASKS', { tasks, sortBy, sortOrder });
    return result as Task[] | null;
  }, [postMessage]);

  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    callbacksRef.current.clear();
  }, []);

  return {
    calculateStats,
    filterTasks,
    sortTasks,
    cleanup
  };
};
