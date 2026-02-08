export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'RBAC_CHANGE' | 'VIEW' | 'EXPORT';
export type EventStatus = 'SUCCESS' | 'FAILURE';
export type SourceChannel = 'UI' | 'API' | 'SYSTEM' | 'BACKGROUND_JOB';
export type ModuleType = 'AUTHENTICATION' | 'RBAC' | 'USER_MANAGEMENT' | 'COURSE_MANAGEMENT' | 'BATCH_MANAGEMENT' | 'PAYMENT' | 'REPORT' | 'SYSTEM';

export interface AuditEvent {
  id: string;
  correlationId: string;
  timestamp: string;
  timestampUTC: string;
  
  // Actor Information
  actorUserId: string;
  actorUserName: string;
  actorEmail: string;
  actorRole: string;
  
  // Target Information
  targetEntity: string;
  targetEntityId?: string;
  targetEntityType?: string;
  
  // Action Details
  actionType: ActionType;
  actionDescription: string;
  module: ModuleType;
  severity: SeverityLevel;
  status: EventStatus;
  
  // Technical Context
  ipAddress: string;
  geoLocation?: {
    country: string;
    city: string;
    lat?: number;
    lon?: number;
  };
  device: string;
  browser: string;
  userAgent: string;
  sourceChannel: SourceChannel;
  
  // Change Details
  changeData?: {
    oldValue: any;
    newValue: any;
    changedFields: string[];
  };
  
  // Additional Context
  metadata?: Record<string, any>;
  errorMessage?: string;
  sessionId?: string;
}

export interface AuditSummary {
  totalEventsToday: number;
  totalEventsWeek: number;
  totalEventsMonth: number;
  criticalEvents: number;
  permissionChanges: number;
  failedLogins: number;
  suspiciousActivities: number;
}

export interface TimelineActivity {
  hour: string;
  count: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface SeverityDistribution {
  severity: SeverityLevel;
  count: number;
  percentage: number;
}

export interface ModuleActivity {
  module: ModuleType;
  count: number;
  criticalCount: number;
}

export interface SuspiciousActivity {
  id: string;
  type: 'PERMISSION_ESCALATION' | 'RAPID_RBAC_CHANGE' | 'FAILED_LOGIN_BURST' | 'LOCATION_ANOMALY' | 'BULK_MODIFICATION';
  severity: SeverityLevel;
  detectedAt: string;
  actorUserId: string;
  actorUserName: string;
  description: string;
  eventCount: number;
  relatedEventIds: string[];
  resolved: boolean;
}

export interface RBACTraceEvent {
  id: string;
  timestamp: string;
  actorUserName: string;
  targetRole: string;
  changeType: 'ROLE_CREATED' | 'ROLE_MODIFIED' | 'ROLE_DELETED' | 'PERMISSION_ADDED' | 'PERMISSION_REMOVED' | 'USER_ASSIGNED' | 'USER_UNASSIGNED';
  description: string;
  changeDetails: {
    before?: any;
    after?: any;
  };
}

export interface AuditFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  actorUsers?: string[];
  actorRoles?: string[];
  targetEntities?: string[];
  modules?: ModuleType[];
  severities?: SeverityLevel[];
  actionTypes?: ActionType[];
  ipAddresses?: string[];
  deviceTypes?: string[];
  correlationIds?: string[];
  sourceChannels?: SourceChannel[];
  status?: EventStatus[];
}

export interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  filter: AuditFilter;
  createdBy: string;
  createdAt: string;
}
