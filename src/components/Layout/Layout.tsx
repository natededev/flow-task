import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { TaskForm } from '@/components/Task/TaskForm';
import { ProjectForm } from '@/components/Project/ProjectForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Task, Project } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  const handleNewTask = () => {
    setSelectedTask(null);
    setIsTaskFormOpen(true);
  };
  
  const handleNewProject = () => {
    setSelectedProject(null);
    setIsProjectFormOpen(true);
  };
  
  const handleTaskFormClose = () => {
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  };
  
  const handleProjectFormClose = () => {
    setIsProjectFormOpen(false);
    setSelectedProject(null);
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };
  
  return (
    <div className="flex min-h-dvh bg-background mobile-vh-fix">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar onNewProject={handleNewProject} />
      </div>
      
      {/* Mobile Navigation Overlay */}
      <MobileNavigation 
        isOpen={isMobileNavOpen}
        onClose={closeMobileNav}
        onNewProject={handleNewProject}
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          onNewTask={handleNewTask} 
          onNewProject={handleNewProject}
          onMobileMenuToggle={toggleMobileNav}
        />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
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