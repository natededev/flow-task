import { Settings as SettingsIcon, User, Bell, Shield, Palette, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { User as UserIcon } from 'lucide-react';

interface SettingsMenuProps {
  onNavigate: (page: string) => void;
}

export const SettingsMenu = ({ onNavigate }: SettingsMenuProps) => {
  const menuItems = [
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Manage your personal information and account details',
      icon: User,
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Edit your avatar and profile info',
      icon: UserIcon,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure your notification preferences',
      icon: Bell,
    },
    {
      id: 'appearance',
      title: 'Appearance & Preferences',
      description: 'Customize theme, language, and display settings',
      icon: Palette,
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Manage security settings and privacy options',
      icon: Shield,
    },
  ];

  return (
    <div className="p-2 sm:p-4 w-full">
      <div className="mb-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your account and application preferences
        </p>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={item.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onNavigate(item.id)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
