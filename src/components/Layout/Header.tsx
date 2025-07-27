import { useState } from 'react';
import { Search, Bell, Plus, User, LogOut, Settings, Menu } from '@/lib/icons';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';

interface HeaderProps {
  onNewTask: () => void;
  onNewProject: () => void;
  onMobileMenuToggle?: () => void;
}

export const Header = ({ onNewTask, onNewProject, onMobileMenuToggle }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { setFilter } = useTasks();
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilter({ search: value });
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const mockNotifications = [
    { id: 1, message: 'Task "Complete project" is due tomorrow', time: '2 hours ago', type: 'deadline' },
    { id: 2, message: 'New comment on "Website redesign"', time: '4 hours ago', type: 'comment' },
    { id: 3, message: 'You were assigned to "Database migration"', time: '6 hours ago', type: 'assignment' },
  ];
  
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMobileMenuToggle}
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 className="text-lg sm:text-xl font-bold text-primary">TaskFlow</h1>
        
        {/* Search - Hidden on mobile, shown on larger screens */}
        <div className="relative hidden sm:block">
          <label htmlFor="global-search" className="sr-only">Search tasks and projects</label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="global-search"
            name="global-search"
            placeholder="Search tasks, projects..."
            className="pl-10 w-60 lg:w-80"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search tasks and projects"
            autoComplete="off"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* New Button - Responsive */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
              aria-label="Create new task or project"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background border z-50">
            <DropdownMenuItem onClick={onNewTask}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onNewProject}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notifications - Mobile optimized */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative h-10 w-10 sm:h-10 sm:w-10"
              aria-label={`Notifications (${mockNotifications.length} unread)`}
            >
              <Bell className="h-5 w-5 sm:h-4 sm:w-4" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs">
                {mockNotifications.length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80 bg-background border z-50">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                <div className="font-medium text-sm">{notification.message}</div>
                <div className="text-xs text-muted-foreground">{notification.time}</div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User Avatar - Mobile optimized */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-8 w-8 rounded-full"
              aria-label={`User menu for ${user?.name || 'user'}`}
            >
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarImage src={user?.avatar} alt={user?.name || 'User avatar'} />
                <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-background border z-50" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};