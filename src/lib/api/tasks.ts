import { Task } from '@/types';
import { ApiResponse, delay } from './base.ts';

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user interface',
    description: 'Create mockups and wireframes for the new dashboard',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    assigneeId: '1',
    projectId: '1',
    createdBy: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Set up JWT-based authentication system',
    status: 'todo',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    assigneeId: '1',
    projectId: '1',
    createdBy: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Write unit tests',
    description: 'Create comprehensive test suite for the API endpoints',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    assigneeId: '1',
    projectId: '2',
    createdBy: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Database migration',
    description: 'Update database schema to support new features',
    status: 'done',
    priority: 'low',
    assigneeId: '1',
    projectId: '2',
    createdBy: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const tasksApi = {
  async getTasks(): Promise<ApiResponse<Task[]>> {
    await delay(500);
    return { data: mockTasks, success: true };
  },

  async getTask(id: string): Promise<ApiResponse<Task>> {
    await delay(300);
    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { data: task, success: true };
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Task>> {
    await delay(800);
    const newTask: Task = {
      ...task,
      id: (Date.now() + Math.random()).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockTasks.push(newTask);
    return { data: newTask, success: true };
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    await delay(600);
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };
    mockTasks[taskIndex] = updatedTask;
    return { data: updatedTask, success: true };
  },

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    await delay(400);
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks.splice(taskIndex, 1);
    return { data: null, success: true };
  },
};
