import { useState, useEffect } from 'react';
import { useClientStore } from '@/store/clientStore';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SettingsMenu } from './settings/SettingsMenu';
import { AccountSettings } from './settings/AccountSettings';
import { NotificationSettings } from './settings/NotificationSettings';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { SecuritySettings } from './settings/SecuritySettings';
import { Profile } from './Profile';
import { LogOut } from '@/lib/icons';
import { useAuth } from '@/hooks/useAuth';

export const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskUpdates: true,
    projectDeadlines: true,
    teamInvites: true,
  });
  
  // Mobile navigation state
  const [currentMobilePage, setCurrentMobilePage] = useState<string | null>(null);
  
  // Use global theme from client store
  const theme = useClientStore(state => state.theme);
  const setTheme = useClientStore(state => state.setTheme);
  const [preferences, setPreferences] = useState({
    theme: theme,
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });

  const { logout } = useAuth();

  useEffect(() => {
    setPreferences(prev => ({ ...prev, theme }));
  }, [theme]);

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    if (key === 'theme') {
      setTheme(value as 'light' | 'dark' | 'system');
    }
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Mobile navigation handlers
  const handleMobileNavigate = (page: string) => {
    setCurrentMobilePage(page);
  };

  const handleMobileBack = () => {
    setCurrentMobilePage(null);
  };

  // Render mobile sub-pages
  if (currentMobilePage) {
    switch (currentMobilePage) {
      case 'account':
        return <AccountSettings onBack={handleMobileBack} />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <NotificationSettings onBack={handleMobileBack} />;
      case 'appearance':
        return <AppearanceSettings onBack={handleMobileBack} />;
      case 'security':
        return <SecuritySettings onBack={handleMobileBack} />;
      default:
        setCurrentMobilePage(null);
        break;
    }
  }
  
  return (
    <>
      {/* Mobile View: Show navigation menu */}
      <div className="block md:hidden">
        <SettingsMenu onNavigate={handleMobileNavigate} />
      </div>

      {/* Desktop View: Show full settings page */}
      <div className="hidden md:block">
        <div className="p-2 sm:p-4 md:p-6 w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Manage your account and application preferences</p>
      </div>
      
      <div className="space-y-2 sm:space-y-4 md:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" name="company" placeholder="Your company name" autoComplete="organization" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" placeholder="https://yourwebsite.com" autoComplete="url" />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Change Password</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current-password" className="sr-only">Current password</Label>
                  <Input id="current-password" name="current-password" type="password" placeholder="Current password" autoComplete="current-password" />
                </div>
                <div>
                  <Label htmlFor="new-password" className="sr-only">New password</Label>
                  <Input id="new-password" name="new-password" type="password" placeholder="New password" autoComplete="new-password" />
                </div>
              </div>
            </div>
            
            <Button onClick={() => toast('Feature coming soon!')}>Update Account</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                </div>
                <Switch 
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-updates">Task Updates</Label>
                  <p className="text-sm text-muted-foreground">Notify when tasks are updated</p>
                </div>
                <Switch 
                  id="task-updates"
                  checked={notifications.taskUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('taskUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="project-deadlines">Project Deadlines</Label>
                  <p className="text-sm text-muted-foreground">Notify about approaching deadlines</p>
                </div>
                <Switch 
                  id="project-deadlines"
                  checked={notifications.projectDeadlines}
                  onCheckedChange={(checked) => handleNotificationChange('projectDeadlines', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="team-invites">Team Invitations</Label>
                  <p className="text-sm text-muted-foreground">Notify about team invitations</p>
                </div>
                <Switch 
                  id="team-invites"
                  checked={notifications.teamInvites}
                  onCheckedChange={(checked) => handleNotificationChange('teamInvites', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme-select">Theme</Label>
                <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                  <SelectTrigger id="theme-select">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language-select">Language</Label>
                <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone-select">Timezone</Label>
                <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                  <SelectTrigger id="timezone-select">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format-select">Date Format</Label>
                <Select value={preferences.dateFormat} onValueChange={(value) => handlePreferenceChange('dateFormat', value)}>
                  <SelectTrigger id="date-format-select">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={() => toast('Feature coming soon!')}>Save Preferences</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-2fa-btn">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button id="enable-2fa-btn" variant="outline" onClick={() => toast('Feature coming soon!')}>Enable 2FA</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="export-data-btn">Data Export</Label>
                <p className="text-sm text-muted-foreground">Download your data</p>
              </div>
              <Button id="export-data-btn" variant="outline" onClick={() => toast('Feature coming soon!')}>Export Data</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="delete-account-btn">Delete Account</Label>
                <p className="text-sm text-muted-foreground">Permanently delete your account</p>
              </div>
              <Button id="delete-account-btn" variant="destructive" onClick={() => toast('Feature coming soon!')}>Delete Account</Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-end mt-8">
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
        </div>
      </div>
    </>
  );
};