import { memo, useMemo } from 'react';
import { taskScheduler } from '@/utils/performance';
import { VirtualizedList } from '@/components/ui/virtualized-list';
import { TaskCard } from '@/components/Task/TaskCard';
import { ProjectCard } from '@/components/Project/ProjectCard';
import { Task, Project } from '@/types';

interface VirtualizedTaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  listMode?: boolean;
  className?: string;
}

interface VirtualizedProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  listMode?: boolean;
  className?: string;
}

// Memoized task item renderer
const TaskItemRenderer = memo(({ 
  task, 
  onEdit, 
  onDelete,
  listMode = false
}: { 
  task: Task; 
  onEdit: (task: Task) => void; 
  onDelete: (taskId: string) => void;
  listMode?: boolean;
}) => (
  <div className="p-2">
    <TaskCard
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      listMode={listMode}
    />
  </div>
));

// Memoized project item renderer
const ProjectItemRenderer = memo(({ 
  project, 
  onEdit, 
  onDelete,
  listMode = false
}: { 
  project: Project; 
  onEdit: (project: Project) => void; 
  onDelete: (projectId: string) => void;
  listMode?: boolean;
}) => (
  <div className="p-2">
    <ProjectCard
      project={project}
      onEdit={onEdit}
      onDelete={onDelete}
      listMode={listMode}
    />
  </div>
));

// Virtualized task list for better performance with large datasets
export const VirtualizedTaskList = memo(({ 
  tasks, 
  onEdit, 
  onDelete,
  listMode = false,
  className = ""
}: VirtualizedTaskListProps) => {
  // Use virtualization only for large lists (>20 items)
  const shouldVirtualize = tasks.length > 20;
  
  // Memoized task processing to prevent recalculation
  const processedTasks = useMemo(() => 
    tasks.map(task => ({
      ...task,
      // Pre-calculate any heavy operations here
    })), 
    [tasks]
  );

  if (!shouldVirtualize) {
    // For small lists, render normally with chunked processing
    return (
      <div className={className || "space-y-4"}>
        {processedTasks.map((task) => (
          <TaskItemRenderer
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            listMode={listMode}
          />
        ))}
      </div>
    );
  }

  // For large lists, use virtualization
  return (
    <VirtualizedList
      items={processedTasks}
      itemHeight={listMode ? 120 : 200} // Adjust height based on mode
      containerHeight={600} // Container height
      renderItem={(task) => (
        <TaskItemRenderer
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          listMode={listMode}
        />
      )}
    />
  );
});

// Virtualized project list for better performance with large datasets
export const VirtualizedProjectList = memo(({ 
  projects, 
  onEdit, 
  onDelete,
  listMode = false,
  className = ""
}: VirtualizedProjectListProps) => {
  // Use virtualization only for large lists (>15 items)
  const shouldVirtualize = projects.length > 15;
  
  // Memoized project processing
  const processedProjects = useMemo(() => 
    projects.map(project => ({
      ...project,
      // Pre-calculate any heavy operations here
    })), 
    [projects]
  );

  if (!shouldVirtualize) {
    // For small lists, render normally
    return (
      <div className={className || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {processedProjects.map((project) => (
          <ProjectItemRenderer
            key={project.id}
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
            listMode={listMode}
          />
        ))}
      </div>
    );
  }

  // For large lists, use virtualization
  return (
    <VirtualizedList
      items={processedProjects}
      itemHeight={listMode ? 150 : 250} // Adjust height based on mode
      containerHeight={600} // Container height
      renderItem={(project) => (
        <ProjectItemRenderer
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          listMode={listMode}
        />
      )}
    />
  );
});

// Performance-optimized task grid with chunked rendering
export const OptimizedTaskGrid = memo(({ tasks, onEdit, onDelete }: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) => {
  // Chunk tasks for incremental rendering
  const renderTasksInChunks = useMemo(() => {
    const chunks: Task[][] = [];
    const chunkSize = 10;
    
    for (let i = 0; i < tasks.length; i += chunkSize) {
      chunks.push(tasks.slice(i, i + chunkSize));
    }
    
    return chunks;
  }, [tasks]);

  return (
    <div className="space-y-4">
      {renderTasksInChunks.map((chunk, chunkIndex) => (
        <div key={chunkIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chunk.map((task) => (
            <TaskItemRenderer
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

VirtualizedTaskList.displayName = 'VirtualizedTaskList';
VirtualizedProjectList.displayName = 'VirtualizedProjectList';
OptimizedTaskGrid.displayName = 'OptimizedTaskGrid';
