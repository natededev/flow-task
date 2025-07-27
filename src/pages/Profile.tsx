import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Save } from '@/lib/icons';
import { useClientStore } from '@/store/clientStore';

export const Profile = () => {
  const { user } = useAuth();
  const setAuth = useClientStore(state => state.setAuth);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const handleSave = () => {
    // TODO: Implement profile update logic
    console.log('Saving profile:', { name, email });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarPreview(dataUrl);
      // Update Zustand user
      if (user) setAuth({ ...user, avatar: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="sr-only">Account Information</h2>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview || user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-lg">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <label htmlFor="avatar-upload">
                <Button asChild variant="outline" size="sm">
                  <span>Change Avatar</span>
                </Button>
                <input
                  id="avatar-upload"
                  name="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  aria-label="Upload avatar"
                />
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG, or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
                autoComplete="email"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => toast('Feature coming soon!')} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};