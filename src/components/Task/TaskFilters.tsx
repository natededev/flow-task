import { useState } from 'react';
import { Filter, X } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { TaskFilter } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';

export const TaskFilters = () => {
  const { filter, setFilter, clearFilter } = useTasks();
  const { projects } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  
  const activeFilters = Object.entries(filter).filter(([_, value]) => value !== undefined && value !== '');
  
  const handleFilterChange = (key: keyof TaskFilter, value: string | undefined) => {
    if (value === 'all' || value === '') {
      const newFilter = { ...filter };
      delete newFilter[key];
      setFilter(newFilter);
    } else {
      setFilter({ [key]: value });
    }
  };
  
  const handleClearAll = () => {
    clearFilter();
    setIsOpen(false);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">Filter</span>
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 sm:w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="filter-status" className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={filter.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger id="filter-status" name="status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="filter-priority" className="text-sm font-medium mb-2 block">Priority</label>
                <Select
                  value={filter.priority || 'all'}
                  onValueChange={(value) => handleFilterChange('priority', value)}
                >
                  <SelectTrigger id="filter-priority" name="priority">
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="filter-project" className="text-sm font-medium mb-2 block">Project</label>
                <Select
                  value={filter.project || 'all'}
                  onValueChange={(value) => handleFilterChange('project', value)}
                >
                  <SelectTrigger id="filter-project" name="project">
                    <SelectValue placeholder="All projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All projects</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {activeFilters.length > 0 && (
        <div className="flex items-center space-x-2">
          {activeFilters.map(([key, value]) => (
            <Badge 
              key={key} 
              variant="secondary" 
              className="flex items-center space-x-1"
            >
              <span className="text-xs">
                {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 w-4 h-4"
                onClick={() => handleFilterChange(key as keyof TaskFilter, undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};