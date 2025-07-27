import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  FolderOpen, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { preloadRouteOnHover } from '@/hooks/usePreloadRoute';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNewProject: () => void;
}

export const Sidebar = ({ onNewProject }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const [expandedProjects, setExpandedProjects] = useState(true);
  
  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', count: 0, routeKey: 'dashboard' },
    { icon: CheckSquare, label: 'My Tasks', path: '/tasks', count: tasks.length, routeKey: 'tasks' },
    { icon: FolderOpen, label: 'Projects', path: '/projects', count: projects.length, routeKey: 'projects' },
    { icon: Calendar, label: 'Calendar', path: '/calendar', count: 0, routeKey: 'calendar' },
    { icon: Users, label: 'Team', path: '/team', count: 0, routeKey: 'team' },
    { icon: BarChart3, label: 'Reports', path: '/reports', count: 0, routeKey: 'reports' },
    { icon: Settings, label: 'Settings', path: '/settings', count: 0, routeKey: 'settings' },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleProjects = () => {
    setExpandedProjects(!expandedProjects);
  };
  
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate(item.path)}
              onMouseEnter={() => preloadRouteOnHover(item.routeKey)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {item.count}
                </Badge>
              )}
            </Button>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto font-medium text-muted-foreground hover:text-foreground"
                onClick={toggleProjects}
              >
                {expandedProjects ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                Recent Projects
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onNewProject}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {expandedProjects && (
              <div className="space-y-1">
                {projects.slice(0, 5).map((project) => {
                  const projectPath = `/projects/${project.id}`;
                  return (
                    <Button
                      key={project.id}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => navigate(projectPath)}
                    >
                      <div className={cn(
                        'w-2 h-2 rounded-full mr-3',
                        project.priority === 'urgent' && 'bg-priority-urgent-foreground',
                        project.priority === 'high' && 'bg-priority-high-foreground',
                        project.priority === 'medium' && 'bg-priority-medium-foreground',
                        project.priority === 'low' && 'bg-priority-low-foreground'
                      )} />
                      <span className="flex-1 text-left truncate">
                        {project.title}
                      </span>
                    </Button>
                  );
                })}
                
                {projects.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted-foreground"
                    onClick={() => navigate('/projects')}
                  >
                    View all projects
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};