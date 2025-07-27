export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'completed' | 'archived';
  createdBy: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assigneeId?: string;
  assignee?: User;
  projectId: string;
  project?: Project;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'deadline_approaching' | 'project_shared';
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  relatedId?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TaskFilter {
  status?: Task['status'];
  priority?: Task['priority'];
  assignee?: string;
  project?: string;
  search?: string;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionPercentage: number;
}