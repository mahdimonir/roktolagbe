export type Role = 'DONOR' | 'MANAGER' | 'ADMIN';

export type BloodGroup = 
  | 'A_POS' | 'A_NEG' 
  | 'B_POS' | 'B_NEG' 
  | 'AB_POS' | 'AB_NEG' 
  | 'O_POS' | 'O_NEG';

export type RequestStatus = 'OPEN' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED';
export type DonationStatus = 'COMMITTED' | 'VERIFIED' | 'DECLINED';

// Wrapper for Axios interceptor outputs (since trailing .data is stripped)
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  donorProfile?: DonorProfile;
  managerProfile?: ManagerProfile;
}

export interface DonorProfile {
  id: string;
  userId: string;
  name: string;
  bloodGroup: BloodGroup;
  division?: string;
  district?: string;
  thana?: string;
  isAvailable: boolean;
  lastDonationDate?: string;
  totalDonations: number;
  points: number;
  address?: string;
  profileImage?: string;
  bio?: string;
  occupation?: string;
  fbUrl?: string;
  linkedinUrl?: string;
  user?: User;
  badges?: Badge[];
}

export interface ManagerProfile {
  id: string;
  userId: string;
  name: string;
  type: string;
  district: string;
  contactPhone: string;
  isVerified: boolean;
  logoUrl?: string;
  inviteToken: string;
  description?: string;
  website?: string;
  address?: string;
  user?: User;
  _count?: {
    members: number;
    bloodRequests: number;
  };
  bloodRequests?: BloodRequest[];
}

export interface BloodRequest {
  id: string;
  bloodGroup: BloodGroup;
  units: number;
  division?: string;
  district: string;
  thana?: string;
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL';
  deadline: string;
  notes?: string;
  patientCondition?: string;
  hemoglobin?: string;
  hospitalName: string;
  detailedAddress?: string;
  status: RequestStatus;
  contactPhone?: string;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
  managerId?: string;
  donations?: DonationHistory[];
}

export interface DonationHistory {
  id: string;
  donorId: string;
  status: DonationStatus;
  requestId?: string;
  donatedAt: string;
  pointsEarned: number;
  imagePath?: string;
  cardPath?: string;
  notes?: string;
  donor?: DonorProfile;
  request?: BloodRequest;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  totalStock: number;
  isActive: boolean;
  createdAt: string;
  managerId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  createdAt: string;
}

export interface RedeemedReward {
  id: string;
  userId: string;
  rewardId: string;
  voucherCode: string;
  isUsed: boolean;
  redeemedAt: string;
  reward: Reward;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  createdAt: string;
  actor?: User;
}

export interface InventoryItem {
  id: string;
  managerId: string;
  group: BloodGroup;
  units: number;
  updatedAt: string;
}

export interface OrgMember {
  id: string;
  managerId: string;
  donorId: string;
  joinedAt: string;
  donor: DonorProfile;
  manager?: ManagerProfile;
}

export interface SystemConfig {
  globalAlertActive: boolean;
  globalAlertTitle: string;
  globalAlertMessage: string;
  globalAlertType: 'INFO' | 'WARNING' | 'EMERGENCY';
  maintenanceMode: boolean;
  apiVersion: string;
}

export interface AdminAnalytics {
  donors: {
    total: number;
    available: number;
  };
  managers: {
    total: number;
    verified: number;
  };
  donations: {
    total: number;
    trends: { date: string; count: number }[];
    distribution: { group: string; count: number }[];
  };
  requests: {
    total: number;
    fulfilled: number;
    open: number;
  };
  resolutionRate: number;
}
