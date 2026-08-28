export type UserRole = 'ADMIN' | 'TEAM_A' | 'TEAM_B';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  team: string;
  avatar: string;
  status: 'active' | 'inactive';
  performanceScore?: number;
  leadsSubmitted?: number;
  callsCompleted?: number;
  qualifiedLeads?: number;
  dealsClosed?: number;
  revenueGenerated?: number;
  earnedCommission?: number;
}

export type LeadStatus = 'Submitted' | 'Accepted' | 'Calling' | 'Follow-up' | 'Qualified' | 'Negotiation' | 'Converted' | 'Lost';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CallLog {
  date: string;
  agent: string;
  outcome: string;
  notes: string;
  duration?: string;
}

export interface JourneyStep {
  timestamp: string;
  stage: LeadStatus;
  author: string;
  details: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  location: string;
  source: string;
  requirement: string;
  estimatedBudget: number;
  notes: string;
  status: LeadStatus;
  priority: Priority;
  assignedTeamA?: string;
  assignedTeamB?: string;
  createdDate: string;
  convertedDealValue?: number;
  convertedDate?: string;
  followUpDate?: string;
  calls: CallLog[];
  journey: JourneyStep[];
}

export interface CommissionRule {
  type: 'FIXED' | 'PERCENTAGE';
  amount?: number;
  percentage?: number;
  unit: string;
}

export interface CommissionRulesConfig {
  teamA: CommissionRule;
  teamB: CommissionRule;
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  outstandingInvoices: number;
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  budget: number;
  startDate: string;
  deadline: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  progress: number;
  assignedTeam: string;
  members: string[];
  priority: Priority;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Completed';

export interface Task {
  id: string;
  taskName: string;
  project: string;
  assignedMember: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
  estimatedHours: number;
  actualHours: number;
}

export interface TimeEntry {
  id: string;
  member: string;
  project: string;
  task: string;
  date: string;
  hours: number;
  billable: boolean;
  description: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  projectName: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  dueDate: string;
  paidDate?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}
