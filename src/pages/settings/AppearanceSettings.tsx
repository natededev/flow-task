import { useState, useEffect } from 'react';
import { ArrowLeft, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { useClientStore } from '@/store/clientStore';

interface AppearanceSettingsProps {
  onBack: () => void;
}

export const AppearanceSettings = ({ onBack }: AppearanceSettingsProps) => {
  const theme = useClientStore(state => state.theme);
  const setTheme = useClientStore(state => state.setTheme);
  const [preferences, setPreferences] = useState({
    theme: theme,
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });

  useEffect(() => {
    setPreferences(prev => ({ ...prev, theme }));
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system: match prefers-color-scheme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const handlePreferenceChange = (key: string, value: string) => {
    if (key === 'theme') {
      setTheme(value as 'light' | 'dark' | 'system');
    }
    setPreferences(prev => ({ ...prev, [key]: value }));
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
            <Palette className="h-6 w-6" />
            Appearance
          </h1>
        </div>
        <p className="text-muted-foreground text-sm ml-11">
          Customize theme, language, and display settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appearance & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                <SelectTrigger id="theme" name="theme">
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
              <Label htmlFor="language">Language</Label>
              <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                <SelectTrigger id="language" name="language">
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
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                <SelectTrigger id="timezone" name="timezone">
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
              <Label htmlFor="date-format">Date Format</Label>
              <Select value={preferences.dateFormat} onValueChange={(value) => handlePreferenceChange('dateFormat', value)}>
                <SelectTrigger id="date-format" name="dateFormat">
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
          
          <Button 
            onClick={() => toast('Feature coming soon!')} 
            className="w-full"
          >
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
