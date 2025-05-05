import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { User as UserIcon, Mail, Phone, Briefcase, MapPin, Calendar } from 'lucide-react';
import { db } from '@/config/firebase';
import PageContainer from '@/components/layout/PageContainer';

interface ProfileFormValues {
  displayName: string;
  phoneNumber: string;
  occupation: string;
  location: string;
  dateOfBirth: string;
  bio: string;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormValues>({
    displayName: user?.displayName || '',
    phoneNumber: '',
    occupation: '',
    location: '',
    dateOfBirth: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    defaultValues: profileData
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        if (!user.uid) return;
        
        // Simulating a Firestore fetch in our mock environment
        // In a real implementation, this would use getDoc from Firestore
        const userData = {
          phoneNumber: '',
          occupation: '',
          location: '',
          dateOfBirth: '',
          bio: ''
        };
        
        // Simulate fetching user data from localStorage or another source
        const storedUserData = localStorage.getItem(`user_profile_${user.uid}`);
        if (storedUserData) {
          Object.assign(userData, JSON.parse(storedUserData));
        }
        
        const newProfileData = {
          displayName: user.displayName || '',
          phoneNumber: userData.phoneNumber || '',
          occupation: userData.occupation || '',
          location: userData.location || '',
          dateOfBirth: userData.dateOfBirth || '',
          bio: userData.bio || ''
        };
        
        setProfileData(newProfileData);
        form.reset(newProfileData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      }
    };

    fetchProfileData();
  }, [user, navigate, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    try {
      // Simulating Firestore updateDoc in our mock environment
      // In a real implementation, this would use updateDoc from Firestore
      const profileData = {
        phoneNumber: data.phoneNumber,
        occupation: data.occupation,
        location: data.location,
        dateOfBirth: data.dateOfBirth,
        bio: data.bio
      };
      
      // Store in localStorage as a temporary solution
      localStorage.setItem(`user_profile_${user.uid}`, JSON.stringify(profileData));
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <div className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
          
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-semibold">{profileData.displayName || 'User'}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <Button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Add your professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 