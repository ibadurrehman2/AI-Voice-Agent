import { Tenant, User, UserRole, AgentStat, CallLog } from './types';

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tenant_a',
    name: 'Acme Corp',
    plan: 'Enterprise',
  },
  {
    id: 'tenant_b',
    name: 'Startup Inc',
    plan: 'Pro',
  },
  {
    id: 'tenant_c',
    name: 'Personal Sandbox',
    plan: 'Free',
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u_1',
    email: 'admin@nexus.ai',
    name: 'Alice Administrator',
    role: UserRole.ADMIN,
    avatarUrl: 'https://picsum.photos/100/100',
  },
  {
    id: 'u_2',
    email: 'viewer@nexus.ai',
    name: 'Bob Viewer',
    role: UserRole.VIEWER,
    avatarUrl: 'https://picsum.photos/101/101',
  },
];

// Mock data specific to tenants to demonstrate switching
export const TENANT_DATA: Record<string, AgentStat[]> = {
  tenant_a: [
    { id: 'ag_1', name: 'Support Bot Alpha', status: 'active', callsHandled: 1240, avgDuration: '2m 30s' },
    { id: 'ag_2', name: 'Sales Closer V1', status: 'idle', callsHandled: 450, avgDuration: '5m 12s' },
    { id: 'ag_3', name: 'Onboarding Assistant', status: 'active', callsHandled: 890, avgDuration: '3m 45s' },
  ],
  tenant_b: [
    { id: 'ag_4', name: 'Lead Gen X', status: 'offline', callsHandled: 12, avgDuration: '1m 10s' },
    { id: 'ag_5', name: 'Meeting Scheduler', status: 'active', callsHandled: 56, avgDuration: '0m 45s' },
  ],
  tenant_c: [
    { id: 'ag_6', name: 'My First Agent', status: 'idle', callsHandled: 0, avgDuration: '0s' },
  ],
};

const SAMPLE_OUTCOMES = ['Sale Closed', 'Follow-up Scheduled', 'Voicemail Left', 'Information Provided', 'Issue Resolved'];
const SAMPLE_AGENTS = ['Support Bot Alpha', 'Sales Closer V1', 'Onboarding Assistant', 'Lead Gen X', 'Meeting Scheduler'];
const SAMPLE_BRANDS = ['Sales Team A', 'Support Center', 'Marketing Campaign', 'Retention'];

// Generate some mock call logs
export const MOCK_CALL_LOGS: CallLog[] = Array.from({ length: 50 }).map((_, i) => {
  const isCompleted = Math.random() > 0.2;
  const status = isCompleted ? 'Completed' : (Math.random() > 0.5 ? 'Missed' : 'Failed');
  const tenantId = i % 3 === 0 ? 'tenant_b' : (i % 5 === 0 ? 'tenant_c' : 'tenant_a');
  
  return {
    id: `call_${1000 + i}`,
    tenantId,
    brand: SAMPLE_BRANDS[Math.floor(Math.random() * SAMPLE_BRANDS.length)],
    callerNumber: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    agentName: SAMPLE_AGENTS[Math.floor(Math.random() * SAMPLE_AGENTS.length)],
    startTime: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    duration: isCompleted ? `${Math.floor(Math.random() * 10)}m ${Math.floor(Math.random() * 60)}s` : '0s',
    status: status as 'Completed' | 'Missed' | 'Failed',
    recordingUrl: isCompleted ? '#' : undefined,
    sentiment: (Math.random() > 0.6 ? 'Positive' : (Math.random() > 0.3 ? 'Neutral' : 'Negative')) as 'Positive' | 'Neutral' | 'Negative',
    outcome: isCompleted ? SAMPLE_OUTCOMES[Math.floor(Math.random() * SAMPLE_OUTCOMES.length)] : 'None',
    summary: 'Customer called inquiring about the latest pricing tier. Agent explained the Pro plan benefits. Customer seemed interested but wanted to check with their manager.',
    transcript: 'Agent: Hello, this is Nexus AI.\nCustomer: Hi, looking for pricing info.\nAgent: Sure, our Pro plan is $29/mo...'
  };
}).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());