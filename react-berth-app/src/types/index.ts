// Core type definitions for the Berth Planning Application

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  avatar?: string;
}

export type UserRole = 'admin' | 'planner' | 'viewer' | 'agent';

export interface Terminal {
  id: string;
  name: string;
  tenantId: string;
  location?: string;
  isActive: boolean;
}

export interface Berth {
  id: string;
  name: string;
  terminalId: string;
  lengthM: number;
  maxDraft?: number;
  isActive: boolean;
  position?: number; // For visual ordering
}

export interface Vessel {
  id: string;
  voyageNumber: string;
  vesselName: string;
  vesselType: VesselType;
  operator?: string;
  routeInfo?: string;
  eta: string; // ISO date string
  etd: string; // ISO date string
  loa: number; // Length Overall in meters
  draft: number; // Draft in meters
  terminalId: string;
  berthId: string;
  status: VesselStatus;
  createdAt: string;
  updatedAt: string;
}

export type VesselType = 'Container' | 'RoRo' | 'Bulk';

export type VesselStatus = 
  | 'planned' 
  | 'confirmed' 
  | 'at_berth' 
  | 'completed' 
  | 'delayed' 
  | 'cancelled';

export interface ConflictDetection {
  vesselId: string;
  conflictType: 'berth_overlap' | 'draft_violation' | 'length_violation';
  conflictingVesselId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface DashboardMetrics {
  totalVessels: number;
  upcomingArrivals: number;
  berthUtilization: number;
  operationalDelays: number;
  vesselsByType: Record<VesselType, number>;
  dailyThroughput: Array<{
    date: string;
    count: number;
  }>;
}

export interface TimelineEvent {
  id: string;
  vesselId: string;
  start: Date;
  end: Date;
  resource: string; // berth ID
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface VesselFormData {
  voyageNumber: string;
  vesselName: string;
  vesselType: VesselType;
  operator?: string;
  routeInfo?: string;
  eta: string;
  etd: string;
  loa: number;
  draft: number;
  terminalId: string;
  berthId: string;
}

// Filter types
export interface VesselFilters {
  terminalId?: string;
  vesselType?: VesselType;
  status?: VesselStatus;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

// Authentication types
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  jobTitle: string;
  organizationName: string;
  organizationType: string;
  phoneNumber: string;
  agreement: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  avatar?: string;
  jobTitle?: string;
  organizationName?: string;
  phoneNumber?: string;
  bio?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

// Export types
export interface ExportOptions {
  format: 'pdf' | 'csv' | 'png';
  dateRange?: {
    start: string;
    end: string;
  };
  terminalId?: string;
  includeMetrics?: boolean;
}