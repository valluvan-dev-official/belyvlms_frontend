import { 
  AuditEvent, 
  AuditSummary, 
  TimelineActivity, 
  SeverityDistribution, 
  ModuleActivity,
  SuspiciousActivity,
  RBACTraceEvent
} from './types';

// Helper to generate random IPs
const randomIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// Helper to generate timestamps
const hoursAgo = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

export const auditSummary: AuditSummary = {
  totalEventsToday: 2847,
  totalEventsWeek: 18934,
  totalEventsMonth: 76542,
  criticalEvents: 12,
  permissionChanges: 47,
  failedLogins: 156,
  suspiciousActivities: 8
};

export const timelineActivity: TimelineActivity[] = [
  { hour: '00:00', count: 45, critical: 1, high: 8, medium: 18, low: 18 },
  { hour: '01:00', count: 32, critical: 0, high: 5, medium: 12, low: 15 },
  { hour: '02:00', count: 28, critical: 1, high: 3, medium: 10, low: 14 },
  { hour: '03:00', count: 24, critical: 0, high: 2, medium: 8, low: 14 },
  { hour: '04:00', count: 31, critical: 0, high: 4, medium: 11, low: 16 },
  { hour: '05:00', count: 58, critical: 1, high: 9, medium: 22, low: 26 },
  { hour: '06:00', count: 124, critical: 2, high: 18, medium: 48, low: 56 },
  { hour: '07:00', count: 198, critical: 1, high: 28, medium: 76, low: 93 },
  { hour: '08:00', count: 287, critical: 2, high: 42, medium: 110, low: 133 },
  { hour: '09:00', count: 324, critical: 3, high: 48, medium: 125, low: 148 },
  { hour: '10:00', count: 298, critical: 2, high: 44, medium: 115, low: 137 },
  { hour: '11:00', count: 276, critical: 1, high: 39, medium: 106, low: 130 },
  { hour: '12:00', count: 245, critical: 1, high: 35, medium: 94, low: 115 },
  { hour: '13:00', count: 289, critical: 2, high: 42, medium: 111, low: 134 },
  { hour: '14:00', count: 312, critical: 3, high: 46, medium: 120, low: 143 },
  { hour: '15:00', count: 298, critical: 2, high: 44, medium: 115, low: 137 },
  { hour: '16:00', count: 267, critical: 1, high: 38, medium: 103, low: 125 },
  { hour: '17:00', count: 234, critical: 2, high: 34, medium: 90, low: 108 },
  { hour: '18:00', count: 178, critical: 1, high: 26, medium: 68, low: 83 },
  { hour: '19:00', count: 142, critical: 0, high: 20, medium: 55, low: 67 },
  { hour: '20:00', count: 98, critical: 1, high: 14, medium: 38, low: 45 },
  { hour: '21:00', count: 76, critical: 0, high: 11, medium: 29, low: 36 },
  { hour: '22:00', count: 64, critical: 1, high: 9, medium: 24, low: 30 },
  { hour: '23:00', count: 52, critical: 0, high: 7, medium: 20, low: 25 }
];

export const severityDistribution: SeverityDistribution[] = [
  { severity: 'CRITICAL', count: 12, percentage: 0.4 },
  { severity: 'HIGH', count: 487, percentage: 17.1 },
  { severity: 'MEDIUM', count: 1256, percentage: 44.1 },
  { severity: 'LOW', count: 1092, percentage: 38.4 }
];

export const moduleActivity: ModuleActivity[] = [
  { module: 'AUTHENTICATION', count: 1247, criticalCount: 3 },
  { module: 'RBAC', count: 156, criticalCount: 8 },
  { module: 'USER_MANAGEMENT', count: 423, criticalCount: 1 },
  { module: 'COURSE_MANAGEMENT', count: 687, criticalCount: 0 },
  { module: 'BATCH_MANAGEMENT', count: 234, criticalCount: 0 },
  { module: 'PAYMENT', count: 78, criticalCount: 0 },
  { module: 'REPORT', count: 198, criticalCount: 0 },
  { module: 'SYSTEM', count: 824, criticalCount: 0 }
];

export const auditEvents: AuditEvent[] = [
  {
    id: 'evt_001',
    correlationId: 'corr_001',
    timestamp: hoursAgo(1),
    timestampUTC: hoursAgo(1),
    actorUserId: 'usr_001',
    actorUserName: 'John Anderson',
    actorEmail: 'john.anderson@belyv.com',
    actorRole: 'Super Admin',
    targetEntity: 'Admin Role',
    targetEntityId: 'role2',
    targetEntityType: 'Role',
    actionType: 'RBAC_CHANGE',
    actionDescription: 'Modified role permissions for Admin role',
    module: 'RBAC',
    severity: 'CRITICAL',
    status: 'SUCCESS',
    ipAddress: '203.45.67.89',
    geoLocation: { country: 'United States', city: 'San Francisco' },
    device: 'Desktop',
    browser: 'Chrome 120.0',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sourceChannel: 'UI',
    changeData: {
      oldValue: { capabilities: ['cap1', 'cap2', 'cap3'] },
      newValue: { capabilities: ['cap1', 'cap2', 'cap3', 'cap5'] },
      changedFields: ['capabilities']
    },
    sessionId: 'sess_001'
  },
  {
    id: 'evt_002',
    correlationId: 'corr_002',
    timestamp: hoursAgo(2),
    timestampUTC: hoursAgo(2),
    actorUserId: 'usr_002',
    actorUserName: 'Sarah Mitchell',
    actorEmail: 'sarah.mitchell@belyv.com',
    actorRole: 'Admin',
    targetEntity: 'User: Michael Chen',
    targetEntityId: 'usr_145',
    targetEntityType: 'User',
    actionType: 'DELETE',
    actionDescription: 'Deleted user account',
    module: 'USER_MANAGEMENT',
    severity: 'HIGH',
    status: 'SUCCESS',
    ipAddress: '192.168.1.45',
    geoLocation: { country: 'United States', city: 'New York' },
    device: 'Desktop',
    browser: 'Firefox 121.0',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0)',
    sourceChannel: 'UI',
    sessionId: 'sess_002'
  },
  {
    id: 'evt_003',
    correlationId: 'corr_003',
    timestamp: hoursAgo(2),
    timestampUTC: hoursAgo(2),
    actorUserId: 'usr_003',
    actorUserName: 'David Park',
    actorEmail: 'david.park@external.com',
    actorRole: 'Student',
    targetEntity: 'System Login',
    actionType: 'LOGIN',
    actionDescription: 'Failed login attempt - Invalid credentials',
    module: 'AUTHENTICATION',
    severity: 'MEDIUM',
    status: 'FAILURE',
    ipAddress: '45.123.78.234',
    geoLocation: { country: 'China', city: 'Shanghai' },
    device: 'Mobile',
    browser: 'Safari 17.0',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    sourceChannel: 'UI',
    errorMessage: 'Invalid username or password',
    sessionId: 'sess_003'
  },
  {
    id: 'evt_004',
    correlationId: 'corr_004',
    timestamp: hoursAgo(3),
    timestampUTC: hoursAgo(3),
    actorUserId: 'usr_001',
    actorUserName: 'John Anderson',
    actorEmail: 'john.anderson@belyv.com',
    actorRole: 'Super Admin',
    targetEntity: 'Finance Manager Role',
    targetEntityId: 'role7',
    targetEntityType: 'Role',
    actionType: 'RBAC_CHANGE',
    actionDescription: 'Created new custom role',
    module: 'RBAC',
    severity: 'HIGH',
    status: 'SUCCESS',
    ipAddress: '203.45.67.89',
    geoLocation: { country: 'United States', city: 'San Francisco' },
    device: 'Desktop',
    browser: 'Chrome 120.0',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sourceChannel: 'UI',
    changeData: {
      oldValue: null,
      newValue: { 
        name: 'Finance Manager', 
        capabilities: ['cap5', 'cap6'],
        description: 'Manage payments and financial reports'
      },
      changedFields: ['created']
    },
    sessionId: 'sess_001'
  },
  {
    id: 'evt_005',
    correlationId: 'corr_005',
    timestamp: hoursAgo(4),
    timestampUTC: hoursAgo(4),
    actorUserId: 'usr_004',
    actorUserName: 'Emma Thompson',
    actorEmail: 'emma.thompson@belyv.com',
    actorRole: 'Trainer',
    targetEntity: 'Course: Advanced React Development',
    targetEntityId: 'crs_234',
    targetEntityType: 'Course',
    actionType: 'UPDATE',
    actionDescription: 'Updated course content and schedule',
    module: 'COURSE_MANAGEMENT',
    severity: 'LOW',
    status: 'SUCCESS',
    ipAddress: '172.16.45.12',
    geoLocation: { country: 'United Kingdom', city: 'London' },
    device: 'Tablet',
    browser: 'Edge 120.0',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edge/120.0',
    sourceChannel: 'UI',
    changeData: {
      oldValue: { schedule: '2025-02-01', duration: '4 weeks' },
      newValue: { schedule: '2025-02-15', duration: '6 weeks' },
      changedFields: ['schedule', 'duration']
    },
    sessionId: 'sess_004'
  },
  {
    id: 'evt_006',
    correlationId: 'corr_006',
    timestamp: hoursAgo(5),
    timestampUTC: hoursAgo(5),
    actorUserId: 'usr_002',
    actorUserName: 'Sarah Mitchell',
    actorEmail: 'sarah.mitchell@belyv.com',
    actorRole: 'Admin',
    targetEntity: 'User: James Wilson',
    targetEntityId: 'usr_167',
    targetEntityType: 'User',
    actionType: 'RBAC_CHANGE',
    actionDescription: 'Assigned Trainer role to user',
    module: 'RBAC',
    severity: 'HIGH',
    status: 'SUCCESS',
    ipAddress: '192.168.1.45',
    geoLocation: { country: 'United States', city: 'New York' },
    device: 'Desktop',
    browser: 'Firefox 121.0',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0)',
    sourceChannel: 'UI',
    changeData: {
      oldValue: { role: 'Student' },
      newValue: { role: 'Trainer' },
      changedFields: ['role']
    },
    sessionId: 'sess_002'
  },
  {
    id: 'evt_007',
    correlationId: 'corr_007',
    timestamp: hoursAgo(6),
    timestampUTC: hoursAgo(6),
    actorUserId: 'system',
    actorUserName: 'System Scheduler',
    actorEmail: 'system@belyv.com',
    actorRole: 'System',
    targetEntity: 'Compliance Report',
    targetEntityId: 'rpt_456',
    targetEntityType: 'Report',
    actionType: 'CREATE',
    actionDescription: 'Generated automated compliance report',
    module: 'REPORT',
    severity: 'LOW',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
    geoLocation: { country: 'Internal', city: 'Server' },
    device: 'Server',
    browser: 'System',
    userAgent: 'BeLyv-System/1.0',
    sourceChannel: 'BACKGROUND_JOB',
    metadata: {
      reportType: 'compliance',
      recordCount: 15678
    },
    sessionId: 'sys_job_001'
  },
  {
    id: 'evt_008',
    correlationId: 'corr_008',
    timestamp: hoursAgo(7),
    timestampUTC: hoursAgo(7),
    actorUserId: 'usr_005',
    actorUserName: 'Robert Kumar',
    actorEmail: 'robert.kumar@belyv.com',
    actorRole: 'Finance Manager',
    targetEntity: 'Payment Transaction',
    targetEntityId: 'pay_789',
    targetEntityType: 'Payment',
    actionType: 'CREATE',
    actionDescription: 'Processed student payment',
    module: 'PAYMENT',
    severity: 'MEDIUM',
    status: 'SUCCESS',
    ipAddress: '10.0.1.78',
    geoLocation: { country: 'India', city: 'Bangalore' },
    device: 'Desktop',
    browser: 'Chrome 120.0',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sourceChannel: 'UI',
    metadata: {
      amount: 299.99,
      currency: 'USD',
      paymentMethod: 'credit_card'
    },
    sessionId: 'sess_005'
  },
  {
    id: 'evt_009',
    correlationId: 'corr_003',
    timestamp: hoursAgo(2.1),
    timestampUTC: hoursAgo(2.1),
    actorUserId: 'usr_003',
    actorUserName: 'David Park',
    actorEmail: 'david.park@external.com',
    actorRole: 'Student',
    targetEntity: 'System Login',
    actionType: 'LOGIN',
    actionDescription: 'Failed login attempt - Invalid credentials',
    module: 'AUTHENTICATION',
    severity: 'MEDIUM',
    status: 'FAILURE',
    ipAddress: '45.123.78.234',
    geoLocation: { country: 'China', city: 'Shanghai' },
    device: 'Mobile',
    browser: 'Safari 17.0',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    sourceChannel: 'UI',
    errorMessage: 'Invalid username or password',
    sessionId: 'sess_003'
  },
  {
    id: 'evt_010',
    correlationId: 'corr_003',
    timestamp: hoursAgo(2.2),
    timestampUTC: hoursAgo(2.2),
    actorUserId: 'usr_003',
    actorUserName: 'David Park',
    actorEmail: 'david.park@external.com',
    actorRole: 'Student',
    targetEntity: 'System Login',
    actionType: 'LOGIN',
    actionDescription: 'Failed login attempt - Invalid credentials',
    module: 'AUTHENTICATION',
    severity: 'HIGH',
    status: 'FAILURE',
    ipAddress: '45.123.78.234',
    geoLocation: { country: 'China', city: 'Shanghai' },
    device: 'Mobile',
    browser: 'Safari 17.0',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    sourceChannel: 'UI',
    errorMessage: 'Account temporarily locked due to multiple failed attempts',
    sessionId: 'sess_003'
  }
];

export const suspiciousActivities: SuspiciousActivity[] = [
  {
    id: 'susp_001',
    type: 'FAILED_LOGIN_BURST',
    severity: 'HIGH',
    detectedAt: hoursAgo(2),
    actorUserId: 'usr_003',
    actorUserName: 'David Park',
    description: 'Multiple failed login attempts detected from unusual location',
    eventCount: 5,
    relatedEventIds: ['evt_003', 'evt_009', 'evt_010'],
    resolved: false
  },
  {
    id: 'susp_002',
    type: 'PERMISSION_ESCALATION',
    severity: 'CRITICAL',
    detectedAt: hoursAgo(1),
    actorUserId: 'usr_001',
    actorUserName: 'John Anderson',
    description: 'Critical permission changes to Admin role detected',
    eventCount: 2,
    relatedEventIds: ['evt_001'],
    resolved: false
  },
  {
    id: 'susp_003',
    type: 'RAPID_RBAC_CHANGE',
    severity: 'HIGH',
    detectedAt: hoursAgo(3),
    actorUserId: 'usr_001',
    actorUserName: 'John Anderson',
    description: 'Multiple RBAC modifications in short time period',
    eventCount: 3,
    relatedEventIds: ['evt_001', 'evt_004'],
    resolved: true
  },
  {
    id: 'susp_004',
    type: 'LOCATION_ANOMALY',
    severity: 'MEDIUM',
    detectedAt: hoursAgo(5),
    actorUserId: 'usr_002',
    actorUserName: 'Sarah Mitchell',
    description: 'User accessed from unusual geographic location',
    eventCount: 1,
    relatedEventIds: ['evt_002'],
    resolved: true
  }
];

export const rbacTraceEvents: RBACTraceEvent[] = [
  {
    id: 'rbac_001',
    timestamp: hoursAgo(1),
    actorUserName: 'John Anderson',
    targetRole: 'Admin',
    changeType: 'PERMISSION_ADDED',
    description: 'Added Payment Management capability to Admin role',
    changeDetails: {
      before: { capabilities: ['cap1', 'cap2', 'cap3'] },
      after: { capabilities: ['cap1', 'cap2', 'cap3', 'cap5'] }
    }
  },
  {
    id: 'rbac_002',
    timestamp: hoursAgo(3),
    actorUserName: 'John Anderson',
    targetRole: 'Finance Manager',
    changeType: 'ROLE_CREATED',
    description: 'Created new Finance Manager role',
    changeDetails: {
      before: null,
      after: { 
        name: 'Finance Manager',
        capabilities: ['cap5', 'cap6']
      }
    }
  },
  {
    id: 'rbac_003',
    timestamp: hoursAgo(5),
    actorUserName: 'Sarah Mitchell',
    targetRole: 'Trainer',
    changeType: 'USER_ASSIGNED',
    description: 'Assigned James Wilson to Trainer role',
    changeDetails: {
      before: { assignedUsers: 22 },
      after: { assignedUsers: 23 }
    }
  },
  {
    id: 'rbac_004',
    timestamp: hoursAgo(24),
    actorUserName: 'John Anderson',
    targetRole: 'Content Manager',
    changeType: 'ROLE_MODIFIED',
    description: 'Updated Content Manager permissions',
    changeDetails: {
      before: { capabilities: ['cap1'] },
      after: { capabilities: ['cap1', 'cap6'] }
    }
  },
  {
    id: 'rbac_005',
    timestamp: hoursAgo(48),
    actorUserName: 'Sarah Mitchell',
    targetRole: 'Student',
    changeType: 'USER_UNASSIGNED',
    description: 'Removed user from Student role (graduation)',
    changeDetails: {
      before: { assignedUsers: 488 },
      after: { assignedUsers: 487 }
    }
  }
];

// Generate more events for testing
for (let i = 11; i <= 100; i++) {
  const hourOffset = Math.random() * 168; // Last week
  auditEvents.push({
    id: `evt_${String(i).padStart(3, '0')}`,
    correlationId: `corr_${String(Math.floor(i / 3)).padStart(3, '0')}`,
    timestamp: hoursAgo(hourOffset),
    timestampUTC: hoursAgo(hourOffset),
    actorUserId: `usr_${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`,
    actorUserName: ['John Anderson', 'Sarah Mitchell', 'David Park', 'Emma Thompson', 'Robert Kumar'][Math.floor(Math.random() * 5)],
    actorEmail: 'user@belyv.com',
    actorRole: ['Super Admin', 'Admin', 'Trainer', 'Student'][Math.floor(Math.random() * 4)],
    targetEntity: ['User Account', 'Course', 'Batch', 'Payment', 'Role'][Math.floor(Math.random() * 5)],
    targetEntityId: `ent_${i}`,
    targetEntityType: 'Various',
    actionType: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW'][Math.floor(Math.random() * 6)] as any,
    actionDescription: 'Performed action on entity',
    module: ['AUTHENTICATION', 'RBAC', 'USER_MANAGEMENT', 'COURSE_MANAGEMENT', 'BATCH_MANAGEMENT', 'PAYMENT', 'REPORT', 'SYSTEM'][Math.floor(Math.random() * 8)] as any,
    severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)] as any,
    status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILURE',
    ipAddress: randomIP(),
    device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
    browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
    userAgent: 'Mozilla/5.0',
    sourceChannel: ['UI', 'API', 'SYSTEM'][Math.floor(Math.random() * 3)] as any,
    sessionId: `sess_${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`
  });
}
