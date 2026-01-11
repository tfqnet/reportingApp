// User roles
export type UserRole = 'field_worker' | 'supervisor' | 'safety_officer' | 'admin';

// Report types
export type ReportType = 'unsafe_act' | 'unsafe_condition';

// Report status
export type ReportStatus = 'open' | 'in_progress' | 'under_review' | 'closed';

// Action types
export type ActionType = 'immediate' | 'corrective' | 'preventive';

// Action status
export type ActionStatus = 'open' | 'in_progress' | 'completed' | 'verified';

// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Industry types
export type IndustryType = 'oil_gas' | 'construction' | 'manufacturing' | 'general';

// Subscription plans
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';

// Tenant
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  subdomain?: string;
  logoUrl?: string;
  settings: TenantSettings;
  subscriptionPlan: SubscriptionPlan;
  maxUsers: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tenant settings
export interface TenantSettings {
  branding?: {
    primaryColor?: string;
    logoUrl?: string;
    companyName?: string;
  };
  workflow?: {
    requireSupervisorApproval?: boolean;
    autoAssignByLocation?: boolean;
    customFields?: CustomField[];
  };
  notifications?: {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
  };
}

export interface CustomField {
  name: string;
  type: 'text' | 'number' | 'select' | 'date';
  required?: boolean;
  options?: string[];
}

// User
export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  department?: string;
  employeeId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Site
export interface Site {
  id: string;
  tenantId: string;
  name: string;
  code?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category
export interface Category {
  id: string;
  tenantId: string;
  name: string;
  type: ReportType;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

// Report
export interface Report {
  id: string;
  tenantId: string;
  reportNumber: string;
  submittedBy: string;
  submittedAt: Date;
  siteId: string;
  locationDescription?: string;
  latitude?: number;
  longitude?: number;
  type: ReportType;
  categoryId?: string;
  title: string;
  description: string;
  immediateActionTaken?: string;
  severity?: number;
  likelihood?: number;
  exposure?: number;
  riskScore?: number;
  riskLevel?: RiskLevel;
  assignedTo?: string;
  assignedAt?: Date;
  status: ReportStatus;
  closedAt?: Date;
  closedBy?: string;
  tags: string[];
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Media
export interface Media {
  id: string;
  tenantId: string;
  reportId: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  caption?: string;
  uploadedAt: Date;
}

// Action
export interface Action {
  id: string;
  tenantId: string;
  reportId: string;
  title: string;
  description?: string;
  actionType: ActionType;
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
  dueDate?: Date;
  status: ActionStatus;
  completedAt?: Date;
  completedBy?: string;
  completionNotes?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Comment
export interface Comment {
  id: string;
  tenantId: string;
  reportId: string;
  userId: string;
  commentText: string;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: UserRole;
  sites: string[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
