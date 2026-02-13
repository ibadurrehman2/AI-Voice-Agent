export enum UserRole {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  logoUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Mock Data Types for Dashboard
export interface AgentStat {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
  callsHandled: number;
  avgDuration: string;
}

export interface CallLog {
  id: string;
  tenantId: string;
  brand: string;
  callerNumber: string;
  agentName: string;
  startTime: string; // ISO string
  duration: string;
  status: 'Completed' | 'Missed' | 'Failed';
  recordingUrl?: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  outcome: string;
  summary?: string;
  transcript?: string;
}
