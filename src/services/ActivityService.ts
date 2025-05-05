// Activity tracking service to record user activities across the application

export interface ActivityItem {
  id: string;
  type: 'search' | 'analysis' | 'download' | 'view' | 'other';
  description: string;
  details?: string;
  timestamp: number;
}

const STORAGE_KEY = 'user_activities';
const MAX_ACTIVITIES = 20;

export const ActivityService = {
  // Add a new activity to the tracking system
  addActivity: (type: ActivityItem['type'], description: string, details?: string) => {
    try {
      // Get existing activities
      const existingActivities = ActivityService.getActivities();
      
      // Create new activity
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type,
        description,
        details,
        timestamp: Date.now()
      };
      
      // Add to beginning of array (newest first) and limit size
      const updatedActivities = [newActivity, ...existingActivities].slice(0, MAX_ACTIVITIES);
      
      // Save back to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities));
      
      return newActivity;
    } catch (error) {
      console.error('Error adding activity:', error);
      return null;
    }
  },
  
  // Get all activities
  getActivities: (): ActivityItem[] => {
    try {
      const activitiesJson = localStorage.getItem(STORAGE_KEY);
      if (!activitiesJson) return [];
      
      return JSON.parse(activitiesJson);
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  },
  
  // Clear all activities
  clearActivities: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export default ActivityService; 