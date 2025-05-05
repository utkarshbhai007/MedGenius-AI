import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/dashboard');
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin dashboard.',
        variant: 'destructive',
      });
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-semibold">Loading...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Sessions</span>
                <span className="font-semibold">Loading...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">System Status</span>
                <span className="font-semibold text-green-600">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button onClick={() => navigate('/admin/users')}>
                  Manage Users
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/roles')}>
                  Manage Roles
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button onClick={() => navigate('/admin/settings')}>
                  General Settings
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/security')}>
                  Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button onClick={() => navigate('/admin/analytics')}>
                  View Analytics
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/reports')}>
                  Generate Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button onClick={() => navigate('/admin/backup')}>
                  Backup System
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/logs')}>
                  View System Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 