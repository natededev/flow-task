import { useState } from 'react';
import { Plus, LayoutGrid, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard } from '@/components/Project/ProjectCard';
import { VirtualizedProjectList } from '@/components/VirtualizedLists';
import { ProjectForm } from '@/components/Project/ProjectForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types';

export const Projects = () => {
  const { projects, deleteProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const activeProjects = projects.filter(project => project.status === 'active');
  const completedProjects = projects.filter(project => project.status === 'completed');
  const archivedProjects = projects.filter(project => project.status === 'archived');
  
  const handleProjectEdit = (project: Project) => {
    setSelectedProject(project);
    setIsProjectFormOpen(true);
  };
  
  const handleProjectDelete = (projectId: string) => {
    deleteProject(projectId);
  };
  
  const handleNewProject = () => {
    setSelectedProject(null);
    setIsProjectFormOpen(true);
  };
  
  const handleProjectFormClose = () => {
    setIsProjectFormOpen(false);
    setSelectedProject(null);
  };
  
  const ProjectGrid = ({ projects }: { projects: Project[] }) => {
    if (projects.length > 15) {
      // Use virtualized list for performance with large datasets
      return (
        <div className="h-96 overflow-auto">
          <VirtualizedProjectList
            projects={projects}
            onEdit={handleProjectEdit}
            onDelete={handleProjectDelete}
            listMode={viewMode === 'list'}
            className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          />
        </div>
      );
    }
    
    // Regular rendering for smaller datasets
    return (
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleProjectEdit}
            onDelete={handleProjectDelete}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Organize your work into projects and track progress
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
          <Button variant="outline" onClick={() => toast('Feature coming soon!')} size="sm" className="w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleNewProject} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All ({projects.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm">Active ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed ({completedProjects.length})</TabsTrigger>
          <TabsTrigger value="archived" className="text-xs sm:text-sm">Archived ({archivedProjects.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <ProjectGrid projects={projects} />
          
          {projects.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">No projects found</h2>
                  <p className="text-muted-foreground mb-4">
                    Create your first project to get started
                  </p>
                  <Button onClick={handleNewProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <ProjectGrid projects={activeProjects} />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <ProjectGrid projects={completedProjects} />
        </TabsContent>
        
        <TabsContent value="archived" className="space-y-4">
          <ProjectGrid projects={archivedProjects} />
        </TabsContent>
      </Tabs>
      
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