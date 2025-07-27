import { useState } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface NotificationSettingsProps {
  onBack: () => void;
}

export const NotificationSettings = ({ onBack }: NotificationSettingsProps) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskUpdates: true,
    projectDeadlines: true,
    teamInvites: true,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-2 sm:p-4 w-full">
      {/* Mobile Header with Back Button */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
          </h1>
        </div>
        <p className="text-muted-foreground text-sm ml-11">
          Configure your notification preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch 
                id="email-notifications"
                name="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Switch 
                id="push-notifications"
                name="push-notifications"
                checked={notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="task-updates">Task Updates</Label>
                <p className="text-xs text-muted-foreground">Notify when tasks are updated</p>
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
                <p className="text-xs text-muted-foreground">Notify about approaching deadlines</p>
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
                <p className="text-xs text-muted-foreground">Notify about team invitations</p>
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
    </div>
  );
};
