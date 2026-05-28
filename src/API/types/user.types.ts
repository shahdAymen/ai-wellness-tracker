export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  gender?: string;
  birthDate?: string;
  height?: number;
  weight?: number;
  activityLevel?: string;
  goal?: string;
}

export interface ProfileSetupData {
  gender: string;
  birthDate: string;
  height: number;
  weight: number;
  activityLevelId: number;
  goalId: number;
}