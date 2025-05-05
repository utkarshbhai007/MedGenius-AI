export type UserRole = 'patient' | 'doctor' | 'researcher';

export interface UserSettings {
  smartSuggestions: boolean;
  emailSummaries: boolean;
}

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  settings: UserSettings;
}

export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  clearHistory: () => Promise<void>;
} 