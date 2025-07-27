import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';
import { Project, ProjectStats } from '@/types';
import { useClientStore } from '@/store/clientStore';

// React Query keys
export const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  details: () => [...projectsKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
  stats: (id: string) => [...projectsKeys.detail(id), 'stats'] as const,
} as const;

// Projects hooks using React Query
export function useProjects() {
  const queryClient = useQueryClient();
  const { currentProject, setCurrentProject } = useClientStore();

  // Get all projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: projectsKeys.lists(),
    queryFn: () => projectsApi.getProjects().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
      projectsApi.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) =>
      projectsApi.updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });

  return {
    // Data
    projects,
    currentProject,
    isLoading,
    
    // Actions
    setCurrentProject,
    
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
      createProjectMutation.mutateAsync(project),
    
    updateProject: (id: string, updates: Partial<Project>) =>
      updateProjectMutation.mutateAsync({ id, updates }),
    
    deleteProject: (id: string) => deleteProjectMutation.mutateAsync(id),
    
    // Mutation states
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
}

// Individual project hook
export function useProject(id: string) {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => projectsApi.getProject(id).then(res => res.data),
    enabled: !!id,
  });
}

// Project stats hook
export function useProjectStats(projectId: string) {
  return useQuery({
    queryKey: projectsKeys.stats(projectId),
    queryFn: () => projectsApi.getProjectStats(projectId).then(res => res.data),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}