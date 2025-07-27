// React optimization utilities
// These components help reduce re-renders and improve performance

import { memo, useMemo, useCallback } from 'react';
import { TaskCard } from '@/components/Task/TaskCard';
import { ProjectCard } from '@/components/Project/ProjectCard';
import { Task, Project } from '@/types';

// Memoized TaskCard to prevent unnecessary re-renders
export const MemoizedTaskCard = memo(TaskCard, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.updatedAt === nextProps.task.updatedAt &&
    prevProps.listMode === nextProps.listMode
  );
});

// Memoized ProjectCard to prevent unnecessary re-renders
export const MemoizedProjectCard = memo(ProjectCard, (prevProps, nextProps) => {
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.project.status === nextProps.project.status &&
    prevProps.project.updatedAt === nextProps.project.updatedAt
  );
});

// Performance optimized task list component
interface OptimizedTaskListProps {
  tasks: Task[];
  viewMode: 'grid' | 'list';
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const OptimizedTaskList = memo<OptimizedTaskListProps>(({ 
  tasks, 
  viewMode, 
  onEdit, 
  onDelete 
}) => {
  // Memoize the grid/list classes
  const containerClasses = useMemo(() => {
    return viewMode === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      : 'space-y-4';
  }, [viewMode]);

  // Memoize the render function
  const renderTasks = useMemo(() => {
    return tasks.map((task) => (
      <MemoizedTaskCard
        key={task.id}
        task={task}
        onEdit={() => onEdit(task)}
        onDelete={() => onDelete(task.id)}
        listMode={viewMode === 'list'}
      />
    ));
  }, [tasks, viewMode, onEdit, onDelete]);

  return (
    <div className={containerClasses}>
      {renderTasks}
    </div>
  );
});

// Performance optimized project list component
interface OptimizedProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export const OptimizedProjectList = memo<OptimizedProjectListProps>(({ 
  projects, 
  onEdit, 
  onDelete 
}) => {
  const renderProjects = useMemo(() => {
    return projects.map((project) => (
      <MemoizedProjectCard
        key={project.id}
        project={project}
        onEdit={() => onEdit(project)}
        onDelete={() => onDelete(project.id)}
      />
    ));
  }, [projects, onEdit, onDelete]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {renderProjects}
    </div>
  );
});

// Display names for debugging
MemoizedTaskCard.displayName = 'MemoizedTaskCard';
MemoizedProjectCard.displayName = 'MemoizedProjectCard';
OptimizedTaskList.displayName = 'OptimizedTaskList';
OptimizedProjectList.displayName = 'OptimizedProjectList';
