import { useState } from 'react';
import { ArrowLeft, User, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';

interface AccountSettingsProps {
  onBack: () => void;
}

export const AccountSettings = ({ onBack }: AccountSettingsProps) => {
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
            <User className="h-6 w-6" />
            Account Settings
          </h1>
        </div>
        <p className="text-muted-foreground text-sm ml-11">
          Manage your personal information and account details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
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
          
          <div className="space-y-3">
            <Label>Change Password</Label>
            <div className="space-y-2">
              <Input id="current-password" name="current-password" type="password" placeholder="Current password" autoComplete="current-password" />
              <Input id="new-password" name="new-password" type="password" placeholder="New password" autoComplete="new-password" />
            </div>
          </div>
          
          <Button 
            onClick={() => toast('Feature coming soon!')} 
            className="w-full flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Update Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
