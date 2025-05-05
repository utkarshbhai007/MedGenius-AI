import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  LogOut,
  Trash2,
  UserCog,
  AlertTriangle
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';

export default function Settings() {
  const { user, updateUserRole, updateUserSettings, signOut, clearHistory } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
  });
  const [isClearing, setIsClearing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleRoleChange = async (role: UserRole) => {
    try {
      await updateUserRole(role);
      toast.success(`Role updated to ${role}`);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleSettingChange = async (key: string, value: any) => {
    try {
      setSettings(prev => ({ ...prev, [key]: value }));
      await updateUserSettings({ [key]: value });
      toast({
        title: 'Success',
        description: 'Settings updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings.',
        variant: 'destructive',
      });
    }
  };

  const handleClearHistory = async () => {
    try {
      setIsClearing(true);
      await clearHistory();
      toast.success('Search history cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    } finally {
      setIsClearing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      setIsSigningOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <div className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
          
          <div className="space-y-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={user.role} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive updates and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications for important updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => 
                      handleSettingChange('notifications', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Updates</Label>
                    <p className="text-sm text-gray-500">Get regular updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailUpdates}
                    onCheckedChange={(checked) =>
                      handleSettingChange('emailUpdates', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Customize your application appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => 
                      handleSettingChange('darkMode', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
