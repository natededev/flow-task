import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Project } from '@/types';
import { projectSchema, ProjectFormData } from '@/schemas';
import { PROJECT_STATUSES, PROJECT_PRIORITIES, PROJECT_STATUS_LABELS, PROJECT_PRIORITY_LABELS } from '@/constants';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useProjects } from '@/hooks/useProjects';
import { cn } from '@/lib/utils';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

export const ProjectForm = ({ project, onSubmit, onCancel }: ProjectFormProps) => {
  const { addProject, updateProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      priority: project?.priority || 'medium',
      deadline: project?.deadline ? new Date(project.deadline) : undefined,
      status: project?.status || 'active',
    },
  });
  
  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      if (project) {
        updateProject(project.id, data);
      } else {
        addProject({
          title: data.title,
          description: data.description,
          priority: data.priority,
          deadline: data.deadline,
          status: data.status,
          createdBy: '1', // Current user - would come from auth context
          members: ['1'], // Current user as initial member
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
              <FormLabel htmlFor="project-title">Title</FormLabel>
              <FormControl>
                <Input id="project-title" name="title" autoComplete="off" placeholder="Enter project title..." {...field} />
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
              <FormLabel htmlFor="project-description">Description</FormLabel>
              <FormControl>
                <Textarea 
                  id="project-description"
                  name="description"
                  autoComplete="off"
                  placeholder="Enter project description..." 
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="project-priority">Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="project-priority" name="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PROJECT_PRIORITIES.LOW}>{PROJECT_PRIORITY_LABELS[PROJECT_PRIORITIES.LOW]}</SelectItem>
                    <SelectItem value={PROJECT_PRIORITIES.MEDIUM}>{PROJECT_PRIORITY_LABELS[PROJECT_PRIORITIES.MEDIUM]}</SelectItem>
                    <SelectItem value={PROJECT_PRIORITIES.HIGH}>{PROJECT_PRIORITY_LABELS[PROJECT_PRIORITIES.HIGH]}</SelectItem>
                    <SelectItem value={PROJECT_PRIORITIES.URGENT}>{PROJECT_PRIORITY_LABELS[PROJECT_PRIORITIES.URGENT]}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="project-status">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="project-status" name="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PROJECT_STATUSES.ACTIVE}>{PROJECT_STATUS_LABELS[PROJECT_STATUSES.ACTIVE]}</SelectItem>
                    <SelectItem value={PROJECT_STATUSES.COMPLETED}>{PROJECT_STATUS_LABELS[PROJECT_STATUSES.COMPLETED]}</SelectItem>
                    <SelectItem value={PROJECT_STATUSES.ARCHIVED}>{PROJECT_STATUS_LABELS[PROJECT_STATUSES.ARCHIVED]}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel htmlFor="project-deadline">Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      id="project-deadline"
                      name="deadline"
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a deadline</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
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
        
        <div className="flex items-center space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};