import { useState, useMemo, useCallback, startTransition } from 'react';
import { Plus, TrendingUp, Clock, CheckCircle, Users, LayoutGrid, List } from '@/lib/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TaskCard } from '@/components/Task/TaskCard';
import { ProjectCard } from '@/components/Project/ProjectCard';
import { VirtualizedTaskList, VirtualizedProjectList } from '@/components/VirtualizedLists';
import { TaskForm } from '@/components/Task/TaskForm';
import { ProjectForm } from '@/components/Project/ProjectForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { taskScheduler } from '@/utils/performance';
import { Task, Project } from '@/types';

export const Dashboard = () => {
  const { tasks, deleteTask } = useTasks();
  const { projects, deleteProject } = useProjects();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  // grid/list selector for dashboard cards
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Memoized calculations to prevent unnecessary re-calculations
  const taskStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionRate,
      overdueTasks
    };
  }, [tasks]);
  
  // Memoized recent tasks and projects
  const recentTasks = useMemo(() => 
    tasks
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5),
    [tasks]
  );
  
  const recentProjects = useMemo(() => 
    projects
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3),
    [projects]
  );
  
  // Memoized callbacks to prevent unnecessary re-renders
  const handleTaskEdit = useCallback((task: Task) => {
    startTransition(() => {
      setSelectedTask(task);
      setIsTaskFormOpen(true);
    });
  }, []);
  
  const handleTaskDelete = useCallback((taskId: string) => {
    startTransition(() => {
      deleteTask(taskId);
    });
  }, [deleteTask]);
  
  const handleProjectEdit = useCallback((project: Project) => {
    startTransition(() => {
      setSelectedProject(project);
      setIsProjectFormOpen(true);
    });
  }, []);
  
  const handleProjectDelete = useCallback((projectId: string) => {
    startTransition(() => {
      deleteProject(projectId);
    });
  }, [deleteProject]);

  // Debounced view mode change to prevent rapid re-renders
  const debouncedSetViewMode = useMemo(
    () => taskScheduler.debounceTask((mode: 'grid' | 'list') => {
      startTransition(() => {
        setViewMode(mode);
      });
    }, 100),
    []
  );

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    debouncedSetViewMode(mode);
  }, [debouncedSetViewMode]);
  
  const handleNewTask = useCallback(() => {
    setSelectedTask(null);
    setIsTaskFormOpen(true);
  }, []);
  
  const handleNewProject = useCallback(() => {
    setSelectedProject(null);
    setIsProjectFormOpen(true);
  }, []);
  
  const handleTaskFormClose = useCallback(() => {
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  }, []);
  
  const handleProjectFormClose = useCallback(() => {
    setIsProjectFormOpen(false);
    setSelectedProject(null);
  }, []);
  
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Welcome back! Here's what's happening with your tasks.
          </p>
        </div>
        
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 sm:gap-0">
        {/* Grid/List Selector for wide screens */}
        <div className="hidden lg:flex items-center border border-border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleNewTask} size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
        <Button variant="outline" onClick={handleNewProject} size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.completedTasks} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.todoTasks} waiting to start
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(taskStats.completionRate)}%</div>
            <Progress 
              value={taskStats.completionRate} 
              className="mt-2" 
              aria-label={`Task completion rate: ${Math.round(taskStats.completionRate)}%`}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.overdueTasks > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {taskStats.overdueTasks} overdue
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      

      {/* Recent Tasks - grid/list view */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 20 ? (
              // Use virtualized list for performance with large datasets
              viewMode === 'grid' ? (
                <div className="h-96 overflow-auto">
                  <VirtualizedTaskList
                    tasks={recentTasks}
                    onEdit={handleTaskEdit}
                    onDelete={handleTaskDelete}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                  />
                </div>
              ) : (
                <div className="h-96 overflow-auto">
                  <VirtualizedTaskList
                    tasks={recentTasks}
                    onEdit={handleTaskEdit}
                    onDelete={handleTaskDelete}
                    listMode
                    className="flex flex-col gap-4"
                  />
                </div>
              )
            ) : (
              // Regular rendering for smaller datasets
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {recentTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleTaskEdit}
                      onDelete={handleTaskDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleTaskEdit}
                      onDelete={handleTaskDelete}
                      listMode
                    />
                  ))}
                </div>
              )
            )}
            {recentTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Create your first task to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Task Form Dialog */}
      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={selectedTask || undefined}
            onSubmit={handleTaskFormClose}
            onCancel={handleTaskFormClose}
          />
        </DialogContent>
      </Dialog>
      
      {/* Project Form Dialog */}
      <Dialog open={isProjectFormOpen} onOpenChange={setIsProjectFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={selectedProject || undefined}
            onSubmit={handleProjectFormClose}
            onCancel={handleProjectFormClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};