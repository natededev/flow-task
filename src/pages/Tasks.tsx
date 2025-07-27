import { useState } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskCard } from '@/components/Task/TaskCard';
import { VirtualizedTaskList } from '@/components/VirtualizedLists';
import { TaskForm } from '@/components/Task/TaskForm';
import { TaskFilters } from '@/components/Task/TaskFilters';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';

export const Tasks = () => {
  const { filteredTasks, deleteTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');
  
  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };
  
  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId);
  };
  
  const handleNewTask = () => {
    setSelectedTask(null);
    setIsTaskFormOpen(true);
  };
  
  const handleTaskFormClose = () => {
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  };
  
  const TaskGrid = ({ tasks }: { tasks: Task[] }) => {
    if (tasks.length > 20) {
      // Use virtualized list for performance with large datasets
      return (
        <div className="h-96 overflow-auto">
          <VirtualizedTaskList
            tasks={tasks}
            onEdit={handleTaskEdit}
            onDelete={handleTaskDelete}
            listMode={viewMode === 'list'}
            className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          />
        </div>
      );
    }
    
    // Regular rendering for smaller datasets
    return (
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleTaskEdit}
            onDelete={handleTaskDelete}
            listMode={viewMode === 'list'}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage and track all your tasks in one place
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 sm:gap-0">
          <div className="hidden lg:flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <TaskFilters />
          <Button onClick={handleNewTask} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All ({filteredTasks.length})</TabsTrigger>
          <TabsTrigger value="todo" className="text-xs sm:text-sm">Todo ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value="in-progress" className="text-xs sm:text-sm">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="done" className="text-xs sm:text-sm">Done ({doneTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <TaskGrid tasks={filteredTasks} />
          
          {filteredTasks.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">No tasks found</h2>
                  <p className="text-muted-foreground mb-4">
                    Create your first task or adjust your filters
                  </p>
                  <Button onClick={handleNewTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="todo" className="space-y-4">
          <TaskGrid tasks={todoTasks} />
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          <TaskGrid tasks={inProgressTasks} />
        </TabsContent>
        
        <TabsContent value="done" className="space-y-4">
          <TaskGrid tasks={doneTasks} />
        </TabsContent>
      </Tabs>
      
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
    </div>
  );
};