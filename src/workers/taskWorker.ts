// Web Worker for heavy calculations to reduce main thread work
import { Task, Project } from '@/types';

interface WorkerMessage {
  type: 'CALCULATE_STATS' | 'FILTER_TASKS' | 'SORT_TASKS';
  payload: TaskStatsPayload | FilterTasksPayload | SortTasksPayload;
}

interface TaskStatsPayload {
  tasks: Task[];
  projects: Project[];
}

interface FilterTasksPayload {
  tasks: Task[];
  filters: {
    status?: string;
    priority?: string;
    project?: string;
    search?: string;
  };
}

interface SortTasksPayload {
  tasks: Task[];
  sortBy: 'priority' | 'dueDate' | 'status' | 'title';
  sortOrder: 'asc' | 'desc';
}

// Heavy computation functions
const calculateTaskStats = (tasks: Task[], projects: Project[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const priorityDistribution = {
    urgent: tasks.filter(task => task.priority === 'urgent').length,
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length,
  };

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    completionRate,
    priorityDistribution,
    activeProjects: projects.filter(p => p.status === 'active').length
  };
};

const filterTasks = (tasks: Task[], filters: FilterTasksPayload['filters']) => {
  return tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.project && task.projectId !== filters.project) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!task.title.toLowerCase().includes(searchLower) && 
          !task.description.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });
};

const sortTasks = (tasks: Task[], sortBy: SortTasksPayload['sortBy'], sortOrder: SortTasksPayload['sortOrder']) => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'priority': {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      }
      case 'dueDate':
        comparison = new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
        break;
      case 'status': {
        const statusOrder = { 'todo': 1, 'in-progress': 2, 'done': 3 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      }
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

// Worker message handler
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;
  
  try {
    switch (type) {
      case 'CALCULATE_STATS': {
        const { tasks, projects } = payload as TaskStatsPayload;
        const stats = calculateTaskStats(tasks, projects);
        self.postMessage({ type: 'CALCULATE_STATS_RESULT', payload: stats });
        break;
      }
      
      case 'FILTER_TASKS': {
        const { tasks, filters } = payload as FilterTasksPayload;
        const filteredTasks = filterTasks(tasks, filters);
        self.postMessage({ type: 'FILTER_TASKS_RESULT', payload: filteredTasks });
        break;
      }
      
      case 'SORT_TASKS': {
        const { tasks, sortBy, sortOrder } = payload as SortTasksPayload;
        const sortedTasks = sortTasks(tasks, sortBy, sortOrder);
        self.postMessage({ type: 'SORT_TASKS_RESULT', payload: sortedTasks });
        break;
      }
    }
  } catch (error) {
    self.postMessage({ type: 'ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export {};
