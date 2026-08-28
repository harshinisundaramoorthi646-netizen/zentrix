import { Lead, Client, Project, Task, TimeEntry, Invoice, AuditLog, NotificationItem, User, CommissionRulesConfig } from '../types';

export const mockUsers: User[] = [
  {
    id: "usr_admin",
    email: "admin@zentrix.com",
    name: "Vikram Malhotra",
    role: "ADMIN",
    team: "MANAGEMENT",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active",
    performanceScore: 98,
  },
  {
    id: "usr_team_a_primary",
    email: "teama@zentrix.com",
    name: "Team A Lead",
    role: "TEAM_A",
    team: "TEAM_A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "active",
    performanceScore: 95,
    leadsSubmitted: 50,
    conversions: 18,
    earnedCommission: 5000,
  },
  {
    id: "usr_team_a_1",
    email: "team.a@zentrix.com",
    name: "Arun Kumar",
    role: "TEAM_A",
    team: "TEAM_A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "active",
    performanceScore: 92,
    leadsSubmitted: 42,
    conversions: 14,
    earnedCommission: 4200,
  },
  {
    id: "usr_team_a_2",
    email: "priya.s@zentrix.com",
    name: "Priya S",
    role: "TEAM_A",
    team: "TEAM_A",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "active",
    performanceScore: 89,
    leadsSubmitted: 38,
    conversions: 11,
    earnedCommission: 3800,
  },
  {
    id: "usr_team_b_primary",
    email: "teamb@zentrix.com",
    name: "Team B Lead",
    role: "TEAM_B",
    team: "TEAM_B",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    status: "active",
    performanceScore: 96,
    callsCompleted: 140,
    qualifiedLeads: 40,
    earnedCommission: 8000,
  },
  {
    id: "usr_team_b_1",
    email: "team.b@zentrix.com",
    name: "Rahul M",
    role: "TEAM_B",
    team: "TEAM_B",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    status: "active",
    performanceScore: 95,
    callsCompleted: 128,
    qualifiedLeads: 36,
    earnedCommission: 7200,
  }
];

export const mockCommissionRules: CommissionRulesConfig = {
  teamA: { type: "FIXED", amount: 100, unit: "per valid lead" },
  teamB: { type: "FIXED", amount: 200, unit: "per qualified follow-up" },
};

export const mockLeads: Lead[] = [
  {
    id: "ZX-LD-2026-00128",
    name: "Rohan Verma",
    phone: "+91 98765 43210",
    email: "rohan@vertexdigital.in",
    company: "Vertex Digital Labs",
    location: "Bengaluru, KA",
    source: "LinkedIn Direct",
    requirement: "Full-stack Enterprise SaaS platform with custom microservices architecture and automated client onboarding.",
    estimatedBudget: 250000,
    notes: "Client urgently needs redesign & API overhaul before Q4 launch.",
    status: "Negotiation",
    priority: "HIGH",
    assignedTeamA: "Arun Kumar",
    assignedTeamB: "Rahul M",
    createdDate: "2026-08-15T10:30:00Z",
    calls: [
      { date: "2026-08-16T11:00:00Z", agent: "Rahul M", outcome: "Interested", notes: "Reviewed scope document. Client interested in AI module additions.", duration: "14m" },
      { date: "2026-08-18T14:15:00Z", agent: "Rahul M", outcome: "Qualified", notes: "Budget approved. Sent to the admin conversion desk.", duration: "22m" }
    ],
    followUpDate: "2026-08-21T10:00:00Z",
    journey: [
      { timestamp: "2026-08-15T10:30:00Z", stage: "Submitted", author: "Arun Kumar", details: "Lead generated via LinkedIn" },
      { timestamp: "2026-08-16T09:00:00Z", stage: "Accepted", author: "Rahul M", details: "Assigned to qualification call" },
      { timestamp: "2026-08-18T14:15:00Z", stage: "Qualified", author: "Rahul M", details: "Lead qualified with ₹2,50,000 budget" },
      { timestamp: "2026-08-19T11:00:00Z", stage: "Negotiation", author: "Aditya P", details: "Sent final SOW and agreement draft" }
    ]
  },
  {
    id: "ZX-LD-2026-00127",
    name: "Ananya Deshmukh",
    phone: "+91 98220 11982",
    email: "ananya@blueorbit.io",
    company: "BlueOrbit Technologies",
    location: "Mumbai, MH",
    source: "Upwork Agency",
    requirement: "Mobile Expense Tracking application with OCR receipt scanning and multi-currency payouts.",
    estimatedBudget: 180000,
    notes: "Requires quick prototype within 3 weeks.",
    status: "Converted",
    priority: "URGENT",
    assignedTeamA: "Priya S",
    assignedTeamB: "Sneha V",
    createdDate: "2026-08-10T09:15:00Z",
    convertedDealValue: 180000,
    convertedDate: "2026-08-18T16:45:00Z",
    calls: [
      { date: "2026-08-11T16:00:00Z", agent: "Sneha V", outcome: "Qualified", notes: "Demo presentation complete. Client signed contract.", duration: "35m" }
    ],
    journey: [
      { timestamp: "2026-08-10T09:15:00Z", stage: "Submitted", author: "Priya S", details: "Lead generated via Upwork" },
      { timestamp: "2026-08-11T16:00:00Z", stage: "Qualified", author: "Sneha V", details: "Demo approved" },
      { timestamp: "2026-08-18T16:45:00Z", stage: "Converted", author: "Vikram Malhotra", details: "Project ZX-PRJ-2026-004 created" }
    ]
  }
];

export const mockClients: Client[] = [
  {
    id: "ZX-CL-001",
    companyName: "Vertex Digital Labs",
    contactPerson: "Rohan Verma",
    email: "rohan@vertexdigital.in",
    phone: "+91 98765 43210",
    location: "Bengaluru, KA",
    activeProjects: 2,
    completedProjects: 1,
    totalRevenue: 450000,
    outstandingInvoices: 0,
    status: "Active",
    joinedDate: "2026-01-15T00:00:00Z"
  },
  {
    id: "ZX-CL-002",
    companyName: "BlueOrbit Technologies",
    contactPerson: "Ananya Deshmukh",
    email: "ananya@blueorbit.io",
    phone: "+91 98220 11982",
    location: "Mumbai, MH",
    activeProjects: 1,
    completedProjects: 0,
    totalRevenue: 180000,
    outstandingInvoices: 90000,
    status: "Active",
    joinedDate: "2026-02-01T00:00:00Z"
  }
];

export const mockProjects: Project[] = [
  {
    id: "ZX-PRJ-2026-004",
    name: "BlueOrbit Expense Mobile App",
    client: "BlueOrbit Technologies",
    description: "Mobile Expense Tracking application with OCR receipt scanning and multi-currency payouts.",
    status: "Active",
    progress: 45,
    budget: 180000,
    startDate: "2026-08-19T00:00:00Z",
    deadline: "2026-09-30T00:00:00Z",
    assignedTeam: "TEAM_A",
    members: ["Arun Kumar", "Sneha V", "Priya S"],
    priority: "HIGH"
  }
];

export const mockTasks: Task[] = [
  {
    id: "ZX-TSK-101",
    taskName: "Setup OCR Receipt Processing Pipeline",
    project: "BlueOrbit Expense Mobile App",
    assignedMember: "Arun Kumar",
    status: "In Progress",
    priority: "HIGH",
    dueDate: "2026-09-05T00:00:00Z",
    estimatedHours: 40,
    actualHours: 18
  }
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: "ZX-TE-501",
    member: "Arun Kumar",
    project: "BlueOrbit Expense Mobile App",
    task: "Setup OCR Receipt Processing Pipeline",
    date: "2026-08-27T00:00:00Z",
    hours: 4.5,
    billable: true,
    description: "Integrated Tesseract OCR Engine & NodeJS parser endpoints."
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: "ZX-INV-2026-088",
    clientName: "BlueOrbit Technologies",
    projectName: "BlueOrbit Expense Mobile App",
    amount: 90000,
    tax: 16200,
    totalAmount: 106200,
    status: "Paid",
    dueDate: "2026-09-02T00:00:00Z"
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "ZX-LOG-901",
    timestamp: "2026-08-28T14:30:00Z",
    action: "USER_LOGIN",
    user: "teama@zentrix.com",
    details: "User authenticated into Zentrix Workspace"
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "ZX-NOTIF-01",
    title: "New Lead Assigned",
    message: "Lead ZX-LD-2026-00128 assigned to Team A",
    type: "info",
    timestamp: "2026-08-28T10:00:00Z",
    read: false
  }
];
