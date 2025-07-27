import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/lib/api/tasks';
import { Task, TaskFilter } from '@/types';
import { useMemo, useState } from 'react';

// React Query keys
export const tasksKeys = {
  all: ['tasks'] as const,
  lists: () => [...tasksKeys.all, 'list'] as const,
  list: (filters: TaskFilter) => [...tasksKeys.lists(), filters] as const,
  details: () => [...tasksKeys.all, 'detail'] as const,
  detail: (id: string) => [...tasksKeys.details(), id] as const,
} as const;

// Tasks hooks using React Query
export function useTasks() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TaskFilter>({});

  // Get all tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: tasksKeys.lists(),
    queryFn: () => tasksApi.getTasks().then(res => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Apply filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter.status && task.status !== filter.status) return false;
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.assignee && task.assigneeId !== filter.assignee) return false;
      if (filter.project && task.projectId !== filter.project) return false;
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase()) && 
          !task.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
      
      if (filter.dueDate) {
        if (filter.dueDate.from && task.dueDate && task.dueDate < filter.dueDate.from) return false;
        if (filter.dueDate.to && task.dueDate && task.dueDate > filter.dueDate.to) return false;
      }
      
      return true;
    });
  }, [tasks, filter]);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) =>
      tasksApi.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      tasksApi.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
  });

  // Helper functions
  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return {
    // Data
    tasks,
    filteredTasks,
    filter,
    isLoading,
    
    // Actions
    setFilter,
    clearFilter: () => setFilter({}),
    
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) =>
      createTaskMutation.mutateAsync(task),
    
    updateTask: (id: string, updates: Partial<Task>) =>
      updateTaskMutation.mutateAsync({ id, updates }),
    
    deleteTask: (id: string) => deleteTaskMutation.mutateAsync(id),
    
    // Helpers
    getTasksByProject,
    getTasksByStatus,
    
    // Mutation states
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
}

// Individual task hook
export function useTask(id: string) {
  return useQuery({
    queryKey: tasksKeys.detail(id),
    queryFn: () => tasksApi.getTask(id).then(res => res.data),
    enabled: !!id,
  });
}