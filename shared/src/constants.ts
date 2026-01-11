export const REPORT_TYPES = {
  UNSAFE_ACT: 'unsafe_act',
  UNSAFE_CONDITION: 'unsafe_condition',
} as const;

export const REPORT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  UNDER_REVIEW: 'under_review',
  CLOSED: 'closed',
} as const;

export const USER_ROLES = {
  FIELD_WORKER: 'field_worker',
  SUPERVISOR: 'supervisor',
  SAFETY_OFFICER: 'safety_officer',
  ADMIN: 'admin',
} as const;

export const ACTION_TYPES = {
  IMMEDIATE: 'immediate',
  CORRECTIVE: 'corrective',
  PREVENTIVE: 'preventive',
} as const;

export const ACTION_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  VERIFIED: 'verified',
} as const;

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const INDUSTRIES = {
  OIL_GAS: 'oil_gas',
  CONSTRUCTION: 'construction',
  MANUFACTURING: 'manufacturing',
  GENERAL: 'general',
} as const;

export const SEVERITY_LABELS = ['Minor', 'Low', 'Moderate', 'High', 'Fatal'];
export const LIKELIHOOD_LABELS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
export const EXPOSURE_LABELS = ['Few', 'Some', 'Several', 'Many', 'Continuous'];
