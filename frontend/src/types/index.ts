export type UserRole = 'ADMIN' | 'TEAM_A' | 'TEAM_B' | 'TEAM_C';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  team: 'TEAM_A' | 'TEAM_B' | 'TEAM_C' | 'MANAGEMENT' | string;
  avatar: string;
  aadhaarNumber?: string;
  contactNumber?: string;
  status: 'active' | 'inactive';
  performanceScore?: number;
  leadsSubmitted?: number;
  conversions?: number;
  callsCompleted?: number;
  qualifiedLeads?: number;
  dealsClosed?: number;
  revenueGenerated?: number;
  earnedCommission?: number;
  talkTimeSeconds?: number;
  projectsAssigned?: number;
  projectsCompleted?: number;
}

export type RequirementCategory =
  | 'Website Development'
  | 'E-commerce'
  | 'Advertisement / Ad Management'
  | 'Testing'
  | 'Other';

export interface ClientRequirement {
  id?: string;
  clientName: string;
  companyName: string;
  category: RequirementCategory;
  detailedRequirement: string;
  budget?: number;
  expectedDeliveryDate?: string;
  additionalNotes?: string;
  recordedBy?: string;
  date?: string;
}

export interface PaymentConfirmation {
  status: 'Pending' | 'Partially Paid' | 'Paid';
  amount: number;
  paymentDate: string;
  transactionId: string;
  notes?: string;
  recordedBy?: string;
}

export type CallOutcome =
  | 'Interested'
  | 'Not Interested'
  | 'Call Later'
  | 'No Response'
  | 'Waiting'
  | 'Selected'
  | 'Rejected';

export interface CallRecord {
  id: string;
  startTime: string;
  endTime?: string;
  duration: string;
  durationSeconds: number;
  outcome: CallOutcome;
  notes: string;
  agent: string;
  date: string;
}

export interface FollowUp {
  id: string;
  date: string;
  time: string;
  notes: string;
  status: 'Pending' | 'Completed';
  agent: string;
  rescheduledDate?: string;
}

export type LeadStatus =
  | 'New'
  | 'Forwarded to Team B'
  | 'Selected'
  | 'Rejected'
  | 'Waiting'
  | 'Submitted'
  | 'Accepted'
  | 'Calling'
  | 'Follow-up'
  | 'Qualified'
  | 'Negotiation'
  | 'In Execution'
  | 'Converted'
  | 'Completed'
  | 'Lost';

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
  stage: string;
  author: string;
  details: string;
}

export interface Lead {
  id: string; // e.g. LD-1001
  name: string; // Lead Name
  company: string; // Company Name
  phone: string;
  email: string;
  location: string; // Area e.g. Chennai, Bengaluru
  area?: string;
  source: string;
  requirement: string;
  estimatedBudget: number;
  notes: string;
  status: LeadStatus;
  priority: Priority;
  assignedTeamA?: string;
  assignedTeamB?: string;
  assignedTeamC?: string;
  createdDate: string;
  forwardedToTeamB?: boolean;
  forwardedDate?: string;
  convertedDealValue?: number;
  convertedDate?: string;
  followUpDate?: string;
  calls: CallLog[];
  callRecords?: CallRecord[];
  followUps?: FollowUp[];
  requirements?: ClientRequirement;
  payment?: PaymentConfirmation;
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
  requirements?: ClientRequirement;
  payment?: PaymentConfirmation;
}

export type ProjectStatus = 'Not Started' | 'Active' | 'On Hold' | 'Pending' | 'Completed' | 'Planning' | 'Cancelled';

export interface Project {
  id: string; // e.g. PRJ-3001
  name: string;
  client: string;
  clientName?: string;
  companyName?: string;
  description: string;
  category?: RequirementCategory;
  budget: number;
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  progress: number; // 0-100%
  milestones?: string;
  milestone?: string;
  assignedTeam: string;
  assignedMember?: string;
  members: string[];
  priority: Priority;
  clientRequirements?: ClientRequirement;
  paymentStatus?: 'Pending' | 'Partially Paid' | 'Paid';
  payment?: PaymentConfirmation;
  notesList?: { id: string; date: string; author: string; text: string }[];
  history?: JourneyStep[];
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

