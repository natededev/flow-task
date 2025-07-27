import { ArrowLeft, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';

interface SecuritySettingsProps {
  onBack: () => void;
}

export const SecuritySettings = ({ onBack }: SecuritySettingsProps) => {
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
            <Shield className="h-6 w-6" />
            Security & Privacy
          </h1>
        </div>
        <p className="text-muted-foreground text-sm ml-11">
          Manage security settings and privacy options
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                <input type="hidden" id="two-factor-auth" name="twoFactorAuth" autoComplete="off" />
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" id="enable-2fa" name="enable2FA" aria-labelledby="two-factor-auth" onClick={() => toast('Feature coming soon!')}>
                Enable 2FA
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-export">Data Export</Label>
                <input type="hidden" id="data-export" name="dataExport" autoComplete="off" />
                <p className="text-xs text-muted-foreground">Download your data</p>
              </div>
              <Button variant="outline" size="sm" id="export-data" name="exportData" aria-labelledby="data-export" onClick={() => toast('Feature coming soon!')}>
                Export Data
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="delete-account">Delete Account</Label>
                <input type="hidden" id="delete-account" name="deleteAccount" autoComplete="off" />
                <p className="text-xs text-muted-foreground">Permanently delete your account</p>
              </div>
              <Button variant="destructive" size="sm" id="delete-account-btn" name="deleteAccountBtn" aria-labelledby="delete-account" onClick={() => toast('Feature coming soon!')}>
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
