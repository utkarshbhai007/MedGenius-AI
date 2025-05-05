import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Activity, User, Microscope, Pill, Clipboard, Shield, Users, Settings, Clock, Download, Search, FileBarChart } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import ActivityService, { ActivityItem } from '@/services/ActivityService';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load recent activities
    const userActivities = ActivityService.getActivities();
    setActivities(userActivities);
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account.',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'search':
        return <Search className="h-4 w-4 text-blue-500" />;
      case 'analysis':
        return <FileBarChart className="h-4 w-4 text-green-500" />;
      case 'download':
        return <Download className="h-4 w-4 text-purple-500" />;
      case 'view':
        return <Activity className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatActivityDate = (timestamp: number) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Unknown date';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <div className="px-4 py-6">
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.displayName || user.email}</h1>
                  <p className="text-gray-600">
                    You are logged in as a {user.role || 'user'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-xl font-semibold">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] max-h-[300px] overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-gray-500 italic">No recent activity to display.</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-2 pb-3 border-b border-gray-100">
                        <div className="p-1.5 rounded-full bg-gray-50">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                          {activity.details && (
                            <p className="text-xs text-gray-500 truncate">{activity.details}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">{formatActivityDate(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {activities.length > 0 && (
                <div className="mt-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      ActivityService.clearActivities();
                      setActivities([]);
                      toast({
                        title: "Activities cleared",
                        description: "Your activity history has been cleared."
                      });
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear History
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-xl font-semibold">
                <User className="h-5 w-5 mr-2 text-green-500" />
                Profile Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 min-h-[100px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>

          {user.role === 'admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-8 w-8 mb-2 text-blue-500" />
                <span>Manage Users</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="h-8 w-8 mb-2 text-blue-500" />
                <span>System Settings</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/admin')}
              >
                <Shield className="h-8 w-8 mb-2 text-blue-500" />
                <span>Admin Dashboard</span>
              </Button>
            </div>
          )}

          {user.role === 'doctor' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/patient-analysis')}
              >
                <Clipboard className="h-8 w-8 mb-2 text-blue-500" />
                <span>Patient Analysis</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/drug-discovery')}
              >
                <Microscope className="h-8 w-8 mb-2 text-blue-500" />
                <span>Drug Discovery</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/drug-recommendation')}
              >
                <Pill className="h-8 w-8 mb-2 text-blue-500" />
                <span>Drug Recommendation</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/side-effects')}
              >
                <Shield className="h-8 w-8 mb-2 text-blue-500" />
                <span>Side Effects</span>
              </Button>
            </div>
          )}

          {user.role === 'researcher' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/drug-discovery')}
              >
                <Microscope className="h-8 w-8 mb-2 text-blue-500" />
                <span>Drug Discovery</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/side-effects')}
              >
                <Pill className="h-8 w-8 mb-2 text-blue-500" />
                <span>Side Effects Analysis</span>
              </Button>
            </div>
          )}

          {user.role === 'patient' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/patient-dashboard')}
              >
                <Clipboard className="h-8 w-8 mb-2 text-blue-500" />
                <span>View My Analysis</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200"
                onClick={() => navigate('/side-effects')}
              >
                <Pill className="h-8 w-8 mb-2 text-blue-500" />
                <span>Check Side Effects</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
} 