// Report number generation
export const generateReportNumber = (tenantSlug: string, date: Date = new Date()): string => {
  const year = date.getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `${tenantSlug.toUpperCase()}-SR-${year}-${timestamp}`;
};

// Risk score calculation
export const calculateRiskScore = (
  severity: number,
  likelihood: number,
  exposure: number
): number => {
  return severity * likelihood * exposure;
};

// Risk level determination
export const getRiskLevel = (riskScore: number): string => {
  if (riskScore <= 25) return 'low';
  if (riskScore <= 75) return 'medium';
  if (riskScore <= 100) return 'high';
  return 'critical';
};

// Format date
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format datetime
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get initials from name
export const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return `${first}${last}`.toUpperCase();
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
