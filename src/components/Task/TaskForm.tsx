import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from '@/lib/icons';
import { Task } from '@/types';
import { taskSchema, TaskFormData } from '@/schemas';
import { TASK_STATUSES, TASK_PRIORITIES, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export const TaskForm = ({ task, onSubmit, onCancel }: TaskFormProps) => {
  const { projects } = useProjects();
  const { addTask, updateTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      projectId: task?.projectId || '',
    },
  });
  
  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      if (task) {
        updateTask(task.id, data);
      } else {
        addTask({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate,
          projectId: data.projectId,
          assigneeId: '1', // Current user - would come from auth context
          createdBy: '1',
        });
      }
      onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="task-title">Title</FormLabel>
              <FormControl>
                <Input id="task-title" name="title" autoComplete="off" placeholder="Enter task title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="task-description">Description</FormLabel>
              <FormControl>
                <Textarea 
                  id="task-description"
                  name="description"
                  autoComplete="off"
                  placeholder="Enter task description..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="task-status">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="task-status" name="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TASK_STATUSES.TODO}>{TASK_STATUS_LABELS[TASK_STATUSES.TODO]}</SelectItem>
                    <SelectItem value={TASK_STATUSES.IN_PROGRESS}>{TASK_STATUS_LABELS[TASK_STATUSES.IN_PROGRESS]}</SelectItem>
                    <SelectItem value={TASK_STATUSES.DONE}>{TASK_STATUS_LABELS[TASK_STATUSES.DONE]}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="task-priority">Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="task-priority" name="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TASK_PRIORITIES.LOW}>{TASK_PRIORITY_LABELS[TASK_PRIORITIES.LOW]}</SelectItem>
                    <SelectItem value={TASK_PRIORITIES.MEDIUM}>{TASK_PRIORITY_LABELS[TASK_PRIORITIES.MEDIUM]}</SelectItem>
                    <SelectItem value={TASK_PRIORITIES.HIGH}>{TASK_PRIORITY_LABELS[TASK_PRIORITIES.HIGH]}</SelectItem>
                    <SelectItem value={TASK_PRIORITIES.URGENT}>{TASK_PRIORITY_LABELS[TASK_PRIORITIES.URGENT]}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="task-project">Project</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="task-project" name="projectId">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel htmlFor="task-due-date">Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        id="task-due-date"
                        name="dueDate"
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};