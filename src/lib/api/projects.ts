import { Project, ProjectStats } from '@/types';
import { ApiResponse, delay } from './base.ts';

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Task Manager App',
    description: 'Build a comprehensive task management application with React and TypeScript',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    priority: 'high',
    status: 'active',
    createdBy: '1',
    members: ['1'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'API Development',
    description: 'Develop RESTful API endpoints for the task management system',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    priority: 'medium',
    status: 'active',
    createdBy: '1',
    members: ['1'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Mobile App',
    description: 'Create mobile version of the task manager using React Native',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    priority: 'low',
    status: 'active',
    createdBy: '1',
    members: ['1'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const projectsApi = {
  async getProjects(): Promise<ApiResponse<Project[]>> {
    await delay(600);
    return { data: mockProjects, success: true };
  },

  async getProject(id: string): Promise<ApiResponse<Project>> {
    await delay(400);
    const project = mockProjects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return { data: project, success: true };
  },

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Project>> {
    await delay(900);
    const newProject: Project = {
      ...project,
      id: (Date.now() + Math.random()).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockProjects.push(newProject);
    return { data: newProject, success: true };
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<ApiResponse<Project>> {
    await delay(700);
    const projectIndex = mockProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updates,
      updatedAt: new Date()
    };
    mockProjects[projectIndex] = updatedProject;
    return { data: updatedProject, success: true };
  },

  async deleteProject(id: string): Promise<ApiResponse<null>> {
    await delay(500);
    const projectIndex = mockProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    mockProjects.splice(projectIndex, 1);
    return { data: null, success: true };
  },

  async getProjectStats(projectId: string): Promise<ApiResponse<ProjectStats>> {
    await delay(300);
    // Mock stats - in a real app, this would calculate from tasks
    const stats: ProjectStats = {
      totalTasks: 10,
      completedTasks: 4,
      inProgressTasks: 3,
      todoTasks: 3,
      completionPercentage: 40
    };
    return { data: stats, success: true };
  },
};
