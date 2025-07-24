import { VesselType, VesselStatus } from '../types';

// Application constants
export const APP_NAME = 'BerthBoard';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Professional Vessel Berth Planning & Management System';

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'berth_app_user',
  TENANT: 'berth_app_tenant',
  THEME: 'berth_app_theme',
  SETTINGS: 'berth_app_settings',
  LAST_TERMINAL: 'berth_app_last_terminal',
} as const;

// API endpoints (will be configured based on environment)
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  TENANTS: '/api/tenants',
  TERMINALS: '/api/terminals',
  BERTHS: '/api/berths',
  VESSELS: '/api/vessels',
  DASHBOARD: '/api/dashboard',
  EXPORTS: '/api/exports',
} as const;

// Vessel types with display labels
export const VESSEL_TYPES: Array<{ value: VesselType; label: string; icon: string }> = [
  { value: 'Container', label: 'Container Ship', icon: '🚢' },
  { value: 'RoRo', label: 'RoRo Ferry', icon: '⛴️' },
  { value: 'Bulk', label: 'Bulk Carrier', icon: '🚛' },
];

// Vessel statuses with display information
export const VESSEL_STATUSES: Array<{ 
  value: VesselStatus; 
  label: string; 
  color: string;
  icon: string;
}> = [
  { value: 'planned', label: 'Planned', color: '#8c8c8c', icon: '📋' },
  { value: 'confirmed', label: 'Confirmed', color: '#1890ff', icon: '✅' },
  { value: 'at_berth', label: 'At Berth', color: '#52c41a', icon: '⚓' },
  { value: 'completed', label: 'Completed', color: '#13c2c2', icon: '🏁' },
  { value: 'delayed', label: 'Delayed', color: '#ff4d4f', icon: '⏰' },
  { value: 'cancelled', label: 'Cancelled', color: '#f5222d', icon: '❌' },
];

// User roles with permissions
export const USER_ROLES = {
  admin: {
    label: 'Administrator',
    permissions: ['all'],
    icon: '👑',
  },
  planner: {
    label: 'Terminal Planner',
    permissions: ['vessels.create', 'vessels.edit', 'vessels.delete', 'berths.manage'],
    icon: '👨‍💼',
  },
  viewer: {
    label: 'HQ Viewer',
    permissions: ['vessels.view', 'reports.view'],
    icon: '👁️',
  },
  agent: {
    label: 'Line Agent',
    permissions: ['vessels.view_own', 'vessels.edit_own'],
    icon: '🚢',
  },
} as const;

// Date/time formats
export const DATE_FORMATS = {
  SHORT_DATE: 'MMM DD',
  LONG_DATE: 'MMMM DD, YYYY',
  SHORT_DATETIME: 'MMM DD HH:mm',
  LONG_DATETIME: 'MMMM DD, YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DD HH:mm',
} as const;

// Timeline view scales
export const TIMELINE_SCALES = [
  { value: 'hour', label: 'Hourly View', duration: 1, unit: 'hour' },
  { value: 'day', label: 'Daily View', duration: 1, unit: 'day' },
  { value: 'week', label: 'Weekly View', duration: 1, unit: 'week' },
  { value: 'month', label: 'Monthly View', duration: 1, unit: 'month' },
] as const;

// Export formats
export const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF Report', icon: '📄' },
  { value: 'csv', label: 'CSV Data', icon: '📊' },
  { value: 'png', label: 'PNG Image', icon: '🖼️' },
] as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
} as const;

// Form validation rules
export const VALIDATION_RULES = {
  VOYAGE_NUMBER: /^\d{4}-\d{3}-[EWNS]$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_VESSEL_LENGTH: 10, // meters
  MAX_VESSEL_LENGTH: 500, // meters
  MIN_DRAFT: 0.1, // meters
  MAX_DRAFT: 30, // meters
  MIN_BERTH_LENGTH: 50, // meters
  MAX_BERTH_LENGTH: 500, // meters
} as const;

// Chart colors for dashboard
export const CHART_COLORS = [
  '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
  '#13c2c2', '#eb2f96', '#fa8c16', '#a0d911', '#1890ff',
] as const;

// Notification durations
export const NOTIFICATION_DURATION = {
  SUCCESS: 3, // seconds
  INFO: 4,
  WARNING: 5,
  ERROR: 6,
} as const;

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/csv', 'application/vnd.ms-excel'],
} as const;

// Feature flags (for gradual rollout)
export const FEATURE_FLAGS = {
  ENABLE_DRAG_DROP: true,
  ENABLE_REAL_TIME: true,
  ENABLE_MOBILE_APP: false,
  ENABLE_TOS_INTEGRATION: false,
  ENABLE_ADVANCED_ANALYTICS: true,
} as const;

// Default values
export const DEFAULTS = {
  TERMINAL_VIEW_HOURS: 24,
  REFRESH_INTERVAL: 30000, // 30 seconds
  DEBOUNCE_DELAY: 300, // milliseconds
  CONFLICT_CHECK_INTERVAL: 5000, // 5 seconds
} as const;