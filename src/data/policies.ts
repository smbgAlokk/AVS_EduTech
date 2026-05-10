/* ============================================
   AVS EduConnect — Attendance Policies
   ============================================
   Editable policies that govern attendance behavior
   network-wide. "Mandatory" policies are govt-floored
   (Sangathan can raise the bar above govt minimum but
   cannot drop below it). All other policies are
   discretionary at HQ level.
   ============================================ */

export type PolicyType   = 'percent' | 'number' | 'time' | 'toggle' | 'select' | 'multiselect';
export type PolicyCategory = 'eligibility' | 'notification' | 'timing' | 'escalation' | 'integration' | 'leave';
export type PolicyGovernance = 'mandatory' | 'recommended' | 'optional';

export interface Policy {
  id: string;
  category: PolicyCategory;
  name: string;
  description: string;
  helpText?: string;
  type: PolicyType;
  value: number | string | boolean | string[];
  defaultValue: number | string | boolean | string[];
  govtFloor?: number;       /* For percent/number with mandatory governance */
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  governance: PolicyGovernance;
  lastChangedBy?: string;
  lastChangedOn?: string;
}

export const POLICY_CATEGORIES: { key: PolicyCategory; label: string; description: string; iconKey: string }[] = [
  { key: 'eligibility',  label: 'Academic Eligibility', description: 'Thresholds for exams, promotion and appeals', iconKey: 'GraduationCap' },
  { key: 'notification', label: 'Notifications',         description: 'How parents and staff are alerted',           iconKey: 'Bell' },
  { key: 'timing',       label: 'Timing & Marking',      description: 'Cut-offs, grace periods, half-day windows',   iconKey: 'Clock' },
  { key: 'escalation',   label: 'Escalation Rules',      description: 'Auto-actions when patterns are flagged',      iconKey: 'AlertTriangle' },
  { key: 'integration',  label: 'Govt Integration',      description: 'State Education Department reporting',        iconKey: 'Building2' },
  { key: 'leave',        label: 'Leave Policy',          description: 'Application rules and auto-approval',         iconKey: 'CalendarOff' },
];

export const initialPolicies: Policy[] = [
  /* ─── ACADEMIC ELIGIBILITY ─── */
  {
    id: 'POL-001', category: 'eligibility', governance: 'mandatory',
    name: 'Minimum attendance for exam eligibility',
    description: 'Govt mandate sets a 75% floor. Sangathan may raise the bar but not lower it.',
    helpText: 'Per CBSE Bye-laws Sec 6.1 and Govt of Assam Edu Order 2024/SE/14.',
    type: 'percent', value: 75, defaultValue: 75, govtFloor: 75, unit: '%', min: 75, max: 95, step: 1,
  },
  {
    id: 'POL-002', category: 'eligibility', governance: 'recommended',
    name: 'Minimum attendance for promotion to next class',
    description: 'Used when reviewing border-line cases at year-end.',
    type: 'percent', value: 60, defaultValue: 60, unit: '%', min: 50, max: 80, step: 5,
  },
  {
    id: 'POL-003', category: 'eligibility', governance: 'optional',
    name: 'Allow attendance shortfall appeals',
    description: 'Students below the threshold may petition principal with valid reasons.',
    type: 'toggle', value: true, defaultValue: true,
  },

  /* ─── NOTIFICATIONS ─── */
  {
    id: 'POL-010', category: 'notification', governance: 'recommended',
    name: 'Auto-notify parent on absence',
    description: 'Sends notification the moment a student is marked absent.',
    type: 'toggle', value: true, defaultValue: true,
  },
  {
    id: 'POL-011', category: 'notification', governance: 'recommended',
    name: 'Notification channels',
    description: 'Where parent alerts are delivered. SMS works on every Indian phone — keep it on.',
    type: 'multiselect', value: ['sms', 'in_app'], defaultValue: ['sms', 'in_app'],
    options: [
      { value: 'sms',      label: 'SMS' },
      { value: 'in_app',   label: 'In-app' },
      { value: 'email',    label: 'Email' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'voice',    label: 'IVR call' },
    ],
  },
  {
    id: 'POL-012', category: 'notification', governance: 'optional',
    name: 'Daily attendance digest sent at',
    description: 'Time at which the parent receives a daily summary (presence + homework + notices).',
    type: 'time', value: '17:30', defaultValue: '17:30',
  },
  {
    id: 'POL-013', category: 'notification', governance: 'recommended',
    name: 'Alert principal on chronic late teacher',
    description: 'Notify principal if a teacher is late more than the threshold count this month.',
    type: 'toggle', value: true, defaultValue: true,
  },

  /* ─── TIMING ─── */
  {
    id: 'POL-020', category: 'timing', governance: 'recommended',
    name: 'Late marking cut-off time',
    description: 'Students arriving after this time are marked late instead of present.',
    type: 'time', value: '09:15', defaultValue: '09:15',
  },
  {
    id: 'POL-021', category: 'timing', governance: 'optional',
    name: 'Grace period for late entry',
    description: 'Minutes after first bell where students are marked present (not late).',
    type: 'number', value: 5, defaultValue: 5, unit: 'min', min: 0, max: 30, step: 1,
  },
  {
    id: 'POL-022', category: 'timing', governance: 'optional',
    name: 'Allow half-day attendance',
    description: 'When enabled, students can be marked present for morning OR afternoon only.',
    type: 'toggle', value: false, defaultValue: false,
  },
  {
    id: 'POL-023', category: 'timing', governance: 'optional',
    name: 'Half-day boundary time',
    description: 'Cut-off between morning and afternoon for half-day marking.',
    type: 'time', value: '12:30', defaultValue: '12:30',
  },

  /* ─── ESCALATION ─── */
  {
    id: 'POL-030', category: 'escalation', governance: 'recommended',
    name: 'Auto-escalate after consecutive absent days',
    description: 'Triggers principal review if a student is absent for this many days in a row.',
    type: 'number', value: 3, defaultValue: 3, unit: 'days', min: 1, max: 10, step: 1,
  },
  {
    id: 'POL-031', category: 'escalation', governance: 'recommended',
    name: 'Auto-escalate when attendance drops below',
    description: 'Sangathan HQ alert raised when a student crosses below this %.',
    type: 'percent', value: 70, defaultValue: 70, unit: '%', min: 50, max: 85, step: 1,
  },
  {
    id: 'POL-032', category: 'escalation', governance: 'optional',
    name: 'Auto-issue show-cause when teacher AWOL exceeds',
    description: 'Pre-fills a show-cause notice in the principal/HQ inbox when count crosses this.',
    type: 'number', value: 3, defaultValue: 3, unit: 'incidents', min: 1, max: 10, step: 1,
  },

  /* ─── GOVT INTEGRATION ─── */
  {
    id: 'POL-040', category: 'integration', governance: 'mandatory',
    name: 'Daily push to State Edu Department portal',
    description: 'Sangathan-wide attendance pushed every working day to the State Edu Dept dashboard.',
    helpText: 'Required under SSA-Assam MoU (2024). Cannot be disabled without written exemption.',
    type: 'toggle', value: true, defaultValue: true,
  },
  {
    id: 'POL-041', category: 'integration', governance: 'optional',
    name: 'Sync schedule time',
    description: 'IST clock at which the daily push runs.',
    type: 'time', value: '02:00', defaultValue: '02:00',
  },

  /* ─── LEAVE ─── */
  {
    id: 'POL-050', category: 'leave', governance: 'recommended',
    name: 'Max consecutive leave days without medical certificate',
    description: 'Beyond this, a medical certificate is mandatory for sick leave.',
    type: 'number', value: 3, defaultValue: 3, unit: 'days', min: 1, max: 10, step: 1,
  },
  {
    id: 'POL-051', category: 'leave', governance: 'optional',
    name: 'Advance notice required for planned leave',
    description: 'Minimum days in advance for non-emergency leave applications.',
    type: 'number', value: 2, defaultValue: 2, unit: 'days', min: 0, max: 14, step: 1,
  },
  {
    id: 'POL-052', category: 'leave', governance: 'optional',
    name: 'Auto-approve sick leave under',
    description: 'Single-day sick leave with parent declaration auto-approves up to this many days.',
    type: 'number', value: 1, defaultValue: 1, unit: 'days', min: 0, max: 5, step: 1,
  },
];

export function getPolicyDefault(p: Policy) { return p.defaultValue; }
