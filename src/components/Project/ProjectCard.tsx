import { useState } from 'react';
import { format } from 'date-fns';
import { 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Users, 
  Calendar,
  BarChart3,
  Clock,
  Star,
  Archive
} from 'lucide-react';
import { Project } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onClick?: (project: Project) => void;
  listMode?: boolean;
}

export const ProjectCard = ({ project, onEdit, onDelete, onClick, listMode = false }: ProjectCardProps) => {
  const { updateProject } = useProjects();
  const { getTasksByProject } = useTasks();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const tasks = getTasksByProject(project.id);
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const handleStatusChange = async (newStatus: Project['status']) => {
    setIsUpdating(true);
    try {
      updateProject(project.id, { status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'completed';
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isOverdue && 'border-destructive/50',
        project.status === 'archived' && 'opacity-60'
      )}
      onClick={() => onClick?.(project)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <Badge variant="outline" className={cn(getPriorityColor(project.priority), 'flex items-center space-x-1')}>
              {project.priority === 'urgent' && <Star className="h-3 w-3 mr-1" />}
              <span>{project.priority}</span>
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open project menu" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleStatusChange('active'); }}
                disabled={project.status === 'active' || isUpdating}
              >
                Mark as Active
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleStatusChange('completed'); }}
                disabled={project.status === 'completed' || isUpdating}
              >
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleStatusChange('archived'); }}
                disabled={project.status === 'archived' || isUpdating}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="font-semibold text-lg leading-none tracking-tight">
          {project.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <Progress 
            value={completionPercentage} 
            className="h-2" 
            aria-label={`Project progress: ${completedTasks} of ${totalTasks} tasks completed (${Math.round(completionPercentage)}%)`}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{project.members.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <span>{Math.round(completionPercentage)}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {project.deadline && (
              <div className={cn(
                'flex items-center space-x-1',
                isOverdue && 'text-destructive'
              )}>
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(project.deadline), 'MMM d')}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(project.updatedAt), 'MMM d')}</span>
            </div>
          </div>
        </div>

        <div className="flex -space-x-2">
          {project.members.slice(0, 3).map((memberId, index) => (
            <Avatar key={memberId} className="h-6 w-6 border-2 border-background">
              <AvatarFallback className="text-xs">
                U{index + 1}
              </AvatarFallback>
            </Avatar>
          ))}
          {project.members.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-xs text-muted-foreground">+{project.members.length - 3}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};