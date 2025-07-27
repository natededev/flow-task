import { useState } from 'react';
import { format } from 'date-fns';
import { 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Clock, 
  User, 
  Calendar,
  MessageSquare,
  Flag
} from 'lucide-react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTasks } from '@/hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClick?: (task: Task) => void;
  listMode?: boolean;
}

export const TaskCard = ({ task, onEdit, onDelete, onClick, listMode }: TaskCardProps) => {
  const { updateTask } = useTasks();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getPriorityColor = (priority: Task['priority']) => {
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
  
  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Flag className="h-3 w-3 fill-current" />;
      case 'high':
        return <Flag className="h-3 w-3" />;
      default:
        return null;
    }
  };
  
  const handleStatusChange = async (newStatus: Task['status']) => {
    setIsUpdating(true);
    try {
      updateTask(task.id, { status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isOverdue && 'border-destructive/50',
        task.status === 'done' && 'opacity-75',
        listMode ? 'flex flex-row items-stretch gap-4 p-2' : ''
      )}
      onClick={() => onClick?.(task)}
    >
      <CardHeader className={cn('pb-3', listMode ? 'flex-1 pr-0' : '')}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getStatusColor(task.status)}>
              <span className="sr-only">Status: </span>
              <span className="font-semibold text-black bg-yellow-300 px-1 rounded">{task.status.replace('-', ' ')}</span>
            </Badge>
            <Badge variant="outline" className={cn(getPriorityColor(task.priority), 'flex items-center space-x-1')}>
              {getPriorityIcon(task.priority)}
              <span className="font-semibold text-black bg-blue-200 px-1 rounded">{task.priority}</span>
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open task menu" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleStatusChange('todo'); }}
                disabled={task.status === 'todo' || isUpdating}
              >
                Mark as Todo
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleStatusChange('in-progress'); }}
                disabled={task.status === 'in-progress' || isUpdating}
              >
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleStatusChange('done'); }}
                disabled={task.status === 'done' || isUpdating}
              >
                Mark as Done
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h2 className="font-semibold text-lg leading-none tracking-tight">
          {task.title}
        </h2>
      </CardHeader>
      
      <CardContent className={cn('space-y-3', listMode ? 'flex-1 flex flex-col justify-between' : '')}>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {task.dueDate && (
              <div className={cn(
                'flex items-center space-x-1',
                isOverdue && 'text-destructive'
              )}>
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}
            
            {task.assignee && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <Avatar className="h-5 w-5">
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{task.assignee.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">0</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">
                {format(new Date(task.updatedAt), 'MMM d')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};