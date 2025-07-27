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
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onNewProject: () => void;
}

export const MobileNavigation = ({ isOpen, onClose, onNewProject }: MobileNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const [expandedProjects, setExpandedProjects] = useState(false);
  
  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', count: 0 },
    { icon: CheckSquare, label: 'My Tasks', path: '/tasks', count: tasks.length },
    { icon: FolderOpen, label: 'Projects', path: '/projects', count: projects.length },
    { icon: Calendar, label: 'Calendar', path: '/calendar', count: 0 },
    { icon: Users, label: 'Team', path: '/team', count: 0 },
    { icon: BarChart3, label: 'Reports', path: '/reports', count: 0 },
    { icon: Settings, label: 'Settings', path: '/settings', count: 0 },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleProjects = () => {
    setExpandedProjects(!expandedProjects);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleNewProject = () => {
    onNewProject();
    onClose();
  };

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Mobile Navigation Overlay */}
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="flex h-full bg-card">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-primary">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <Button
                      key={item.path}
                      variant={active ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-12 text-base",
                        active && "bg-secondary/80 text-secondary-foreground"
                      )}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.count}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </nav>
              
              {/* Recent Projects Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleProjects}
                    className="p-0 h-auto font-medium text-muted-foreground hover:text-foreground"
                  >
                    {expandedProjects ? (
                      <ChevronDown className="mr-1 h-4 w-4" />
                    ) : (
                      <ChevronRight className="mr-1 h-4 w-4" />
                    )}
                    Recent Projects
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNewProject}
                    className="h-6 w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                {expandedProjects && (
                  <div className="space-y-1 ml-4">
                    {projects.slice(0, 5).map((project) => (
                      <Button
                        key={project.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-10 text-sm"
                        onClick={() => handleNavigation(`/projects/${project.id}`)}
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full mr-3 flex-shrink-0",
                          project.priority === 'high' && "bg-red-500",
                          project.priority === 'medium' && "bg-yellow-400",
                          project.priority === 'low' && "bg-green-500"
                        )} />
                        <span className="truncate">{project.title}</span>
                      </Button>
                    ))}
                    
                    {projects.length === 0 && (
                      <p className="text-sm text-muted-foreground py-2">
                        No projects yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
