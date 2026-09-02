import {
  Lead,
  Client,
  Project,
  Task,
  TimeEntry,
  Invoice,
  AuditLog,
  NotificationItem,
  User,
  CommissionRulesConfig
} from '../types';

export const mockUsers: User[] = [
  {
    id: "usr_admin",
    email: "admin@zentrix.com",
    name: "Zentrix Admin",
    role: "ADMIN",
    team: "MANAGEMENT",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    status: "active",
    aadhaarNumber: "8899-2233-4455",
    contactNumber: "+91 98989 00112",
    performanceScore: 98,
    revenueGenerated: 1250000
  },
  {
    id: "usr_team_a_1",
    email: "arun.k@zentrix.com",
    name: "Arun",
    role: "TEAM_A",
    team: "TEAM_A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "active",
    aadhaarNumber: "7849-2039-1120",
    contactNumber: "+91 98765 43210",
    performanceScore: 95,
    leadsSubmitted: 35,
    conversions: 14,
    earnedCommission: 3500
  },
  {
    id: "usr_team_a_2",
    email: "priya.s@zentrix.com",
    name: "Priya",
    role: "TEAM_A",
    team: "TEAM_A",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "active",
    aadhaarNumber: "4521-8890-3341",
    contactNumber: "+91 98123 45678",
    performanceScore: 92,
    leadsSubmitted: 28,
    conversions: 11,
    earnedCommission: 2800
  },
  {
    id: "usr_team_a_3",
    email: "karthik.r@zentrix.com",
    name: "Karthik",
    role: "TEAM_A",
    team: "TEAM_A",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "active",
    aadhaarNumber: "9912-4451-6672",
    contactNumber: "+91 97890 12345",
    performanceScore: 97,
    leadsSubmitted: 42,
    conversions: 18,
    earnedCommission: 4200
  },
  {
    id: "usr_team_b_1",
    email: "rahul.m@zentrix.com",
    name: "Rahul M",
    role: "TEAM_B",
    team: "TEAM_B",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    status: "active",
    aadhaarNumber: "3341-9982-1102",
    contactNumber: "+91 96789 01234",
    performanceScore: 95,
    callsCompleted: 128,
    qualifiedLeads: 36,
    talkTimeSeconds: 13320, // 3h 42m
    earnedCommission: 7200
  },
  {
    id: "usr_team_b_2",
    email: "sneha.v@zentrix.com",
    name: "Sneha V",
    role: "TEAM_B",
    team: "TEAM_B",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    status: "active",
    aadhaarNumber: "6612-4451-7789",
    contactNumber: "+91 95678 90123",
    performanceScore: 90,
    callsCompleted: 98,
    qualifiedLeads: 24,
    talkTimeSeconds: 9480, // 2h 38m
    earnedCommission: 4800
  },
  {
    id: "usr_team_c_1",
    email: "suresh.k@zentrix.com",
    name: "Suresh K",
    role: "TEAM_C",
    team: "TEAM_C",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    status: "active",
    aadhaarNumber: "1122-3344-5566",
    contactNumber: "+91 93456 78901",
    performanceScore: 96,
    projectsAssigned: 8,
    projectsCompleted: 6
  },
  {
    id: "usr_team_c_2",
    email: "deepa.m@zentrix.com",
    name: "Deepa M",
    role: "TEAM_C",
    team: "TEAM_C",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    status: "active",
    aadhaarNumber: "7788-9900-1122",
    contactNumber: "+91 92345 67890",
    performanceScore: 94,
    projectsAssigned: 6,
    projectsCompleted: 5
  }
];

export const mockCommissionRules: CommissionRulesConfig = {
  teamA: { type: "FIXED", amount: 100, unit: "per generated lead" },
  teamB: { type: "FIXED", amount: 200, unit: "per qualified client" },
};

export const mockLeads: Lead[] = [
  {
    id: "LD-1001",
    name: "ABC",
    company: "XYZ Solutions",
    phone: "+91 98765 43210",
    email: "contact@xyzsolutions.com",
    location: "Chennai",
    area: "Chennai",
    source: "Direct Prospecting",
    requirement: "Complete modern responsive corporate website with client portal & payment integration.",
    estimatedBudget: 150000,
    notes: "High potential client requesting quick turn-around for Q4 product launch.",
    status: "Selected",
    priority: "HIGH",
    assignedTeamA: "Priya",
    assignedTeamB: "Rahul M",
    assignedTeamC: "Suresh K",
    createdDate: "2026-08-19T09:30:00Z",
    forwardedToTeamB: true,
    forwardedDate: "2026-08-19T11:00:00Z",
    followUpDate: "2026-08-21T10:00:00Z",
    calls: [
      { date: "2026-08-20T10:30:00Z", agent: "Rahul M", outcome: "Interested", notes: "Detailed 15-minute scoping call. Client confirmed interest in full website dev package.", duration: "15m 30s" }
    ],
    callRecords: [
      {
        id: "call-101",
        startTime: "2026-08-20T10:15:00Z",
        endTime: "2026-08-20T10:30:30Z",
        duration: "15m 30s",
        durationSeconds: 930,
        outcome: "Interested",
        notes: "Client agreed to proceed with full custom React website development.",
        agent: "Rahul M",
        date: "2026-08-20T10:30:30Z"
      }
    ],
    followUps: [
      {
        id: "fu-201",
        date: "2026-08-21",
        time: "11:00 AM",
        notes: "Finalize technical requirement document & collect initial deposit",
        status: "Completed",
        agent: "Rahul M"
      }
    ],
    requirements: {
      id: "req-1001",
      clientName: "ABC",
      companyName: "XYZ Solutions",
      category: "Website Development",
      detailedRequirement: "Build responsive 10-page custom website with user dashboard, dynamic blog, contact form, and payment gateway integration.",
      budget: 150000,
      expectedDeliveryDate: "2026-09-25",
      additionalNotes: "Client requested dark-themed UI matching corporate branding.",
      recordedBy: "Rahul M",
      date: "2026-08-22T14:00:00Z"
    },
    payment: {
      status: "Paid",
      amount: 50000,
      paymentDate: "2026-08-23T11:30:00Z",
      transactionId: "TXN-9982341",
      notes: "Advance 33% payment received via Bank Transfer",
      recordedBy: "Rahul M"
    },
    journey: [
      { timestamp: "2026-08-19T09:30:00Z", stage: "Lead Generated", author: "Priya (Team A)", details: "Lead LD-1001 created for XYZ Solutions, Chennai" },
      { timestamp: "2026-08-19T11:00:00Z", stage: "Forwarded to Team B", author: "Priya (Team A)", details: "Forwarded lead LD-1001 to Team B calling pool" },
      { timestamp: "2026-08-20T10:30:00Z", stage: "Call Completed", author: "Rahul M (Team B)", details: "15-minute discovery call completed. Outcome: Interested" },
      { timestamp: "2026-08-21T11:00:00Z", stage: "Follow-up Completed", author: "Rahul M (Team B)", details: "Follow-up session completed. Scope approved." },
      { timestamp: "2026-08-22T12:00:00Z", stage: "Client Selected", author: "Rahul M (Team B)", details: "Client marked as SELECTED" },
      { timestamp: "2026-08-22T14:00:00Z", stage: "Requirements Collected", author: "Rahul M (Team B)", details: "Website Development specs recorded" },
      { timestamp: "2026-08-23T11:30:00Z", stage: "Payment Confirmed", author: "Rahul M (Team B)", details: "Payment of ₹50,000 confirmed (Status: Paid)" },
      { timestamp: "2026-08-23T15:00:00Z", stage: "Assigned to Team C", author: "System", details: "Project PRJ-3001 created and assigned to Suresh K" }
    ]
  },
  {
    id: "LD-1002",
    name: "Ananya Deshmukh",
    company: "BlueOrbit Technologies",
    phone: "+91 98220 11982",
    email: "ananya@blueorbit.io",
    location: "Mumbai",
    area: "Mumbai",
    source: "Upwork Prospecting",
    requirement: "E-commerce platform with automated inventory sync and mobile receipt scanner.",
    estimatedBudget: 180000,
    notes: "Requires fast-track development and automated payment gateways.",
    status: "Completed",
    priority: "URGENT",
    assignedTeamA: "Arun",
    assignedTeamB: "Sneha V",
    assignedTeamC: "Deepa M",
    createdDate: "2026-08-18T08:15:00Z",
    forwardedToTeamB: true,
    forwardedDate: "2026-08-18T09:00:00Z",
    calls: [
      { date: "2026-08-19T14:00:00Z", agent: "Sneha V", outcome: "Selected", notes: "Client confirmed deal and agreed to ₹1,80,000 budget.", duration: "25m" }
    ],
    requirements: {
      id: "req-1002",
      clientName: "Ananya Deshmukh",
      companyName: "BlueOrbit Technologies",
      category: "E-commerce",
      detailedRequirement: "E-commerce web application featuring product catalog, cart, Razorpay payment processing, and admin dashboard.",
      budget: 180000,
      expectedDeliveryDate: "2026-09-15",
      additionalNotes: "Include automated SMS notification on purchase.",
      recordedBy: "Sneha V",
      date: "2026-08-19T16:00:00Z"
    },
    payment: {
      status: "Paid",
      amount: 180000,
      paymentDate: "2026-08-20T10:00:00Z",
      transactionId: "TXN-7761928",
      notes: "Full payment received",
      recordedBy: "Sneha V"
    },
    journey: [
      { timestamp: "2026-08-18T08:15:00Z", stage: "Lead Generated", author: "Arun (Team A)", details: "Lead generated for BlueOrbit Technologies" },
      { timestamp: "2026-08-18T09:00:00Z", stage: "Forwarded to Team B", author: "Arun (Team A)", details: "Forwarded lead to Team B" },
      { timestamp: "2026-08-19T14:00:00Z", stage: "Call Completed", author: "Sneha V (Team B)", details: "25-minute call completed. Client Selected." },
      { timestamp: "2026-08-19T16:00:00Z", stage: "Requirements Collected", author: "Sneha V (Team B)", details: "E-commerce requirements logged" },
      { timestamp: "2026-08-20T10:00:00Z", stage: "Payment Confirmed", author: "Sneha V (Team B)", details: "Full payment ₹1,80,000 confirmed" },
      { timestamp: "2026-08-20T11:30:00Z", stage: "Project Assigned to Team C", author: "System", details: "Project assigned to Deepa M" },
      { timestamp: "2026-08-25T16:00:00Z", stage: "Project Completed", author: "Deepa M (Team C)", details: "Project completed successfully" }
    ]
  },
  {
    id: "LD-1003",
    name: "Karthik Raja",
    company: "Apex Global",
    phone: "+91 97890 12345",
    email: "karthik@apexglobal.in",
    location: "Hyderabad",
    area: "Hyderabad",
    source: "LinkedIn Direct",
    requirement: "Performance Ad Management campaign setup with Meta & Google Ads dashboard tracking.",
    estimatedBudget: 95000,
    notes: "Client looking for social media advertisement optimization.",
    status: "Forwarded to Team B",
    priority: "MEDIUM",
    assignedTeamA: "Karthik",
    assignedTeamB: "Rahul M",
    createdDate: "2026-08-20T11:00:00Z",
    forwardedToTeamB: true,
    forwardedDate: "2026-08-20T11:30:00Z",
    calls: [
      { date: "2026-08-21T15:00:00Z", agent: "Rahul M", outcome: "Call Later", notes: "Client in meeting. Scheduled follow-up call.", duration: "3m" }
    ],
    followUps: [
      {
        id: "fu-202",
        date: "2026-08-28",
        time: "02:30 PM",
        notes: "Follow up regarding Ad Management campaign package options",
        status: "Pending",
        agent: "Rahul M"
      }
    ],
    journey: [
      { timestamp: "2026-08-20T11:00:00Z", stage: "Lead Generated", author: "Karthik (Team A)", details: "Lead created for Apex Global" },
      { timestamp: "2026-08-20T11:30:00Z", stage: "Forwarded to Team B", author: "Karthik (Team A)", details: "Forwarded to Team B" },
      { timestamp: "2026-08-21T15:00:00Z", stage: "Call Completed", author: "Rahul M (Team B)", details: "Called client. Status set to Call Later." }
    ]
  },
  {
    id: "LD-1004",
    name: "Ramesh Babu",
    company: "Nova Retailers",
    phone: "+91 98761 23456",
    email: "ramesh@novaretail.com",
    location: "Coimbatore",
    area: "Coimbatore",
    source: "Direct Referral",
    requirement: "Automated QA & Security Testing suite for existing billing software.",
    estimatedBudget: 80000,
    notes: "Requires load testing & vulnerability assessment.",
    status: "New",
    priority: "MEDIUM",
    assignedTeamA: "Priya",
    createdDate: "2026-08-21T14:20:00Z",
    forwardedToTeamB: false,
    calls: [],
    journey: [
      { timestamp: "2026-08-21T14:20:00Z", stage: "Lead Generated", author: "Priya (Team A)", details: "Lead generated by Priya for Nova Retailers" }
    ]
  },
  {
    id: "LD-1005",
    name: "Divya Sharma",
    company: "Zen Cloud Inc",
    phone: "+91 96543 21098",
    email: "divya@zencloud.io",
    location: "Bengaluru",
    area: "Bengaluru",
    source: "Website Form",
    requirement: "Custom Mobile App Development & cloud API integrations.",
    estimatedBudget: 220000,
    notes: "Waiting for client internal board approval before final scope locking.",
    status: "Waiting",
    priority: "HIGH",
    assignedTeamA: "Arun",
    assignedTeamB: "Sneha V",
    createdDate: "2026-08-22T10:00:00Z",
    forwardedToTeamB: true,
    forwardedDate: "2026-08-22T10:30:00Z",
    calls: [
      { date: "2026-08-22T16:00:00Z", agent: "Sneha V", outcome: "Waiting", notes: "Client requested 1 week to discuss budget with finance team.", duration: "12m" }
    ],
    journey: [
      { timestamp: "2026-08-22T10:00:00Z", stage: "Lead Generated", author: "Arun (Team A)", details: "Lead generated for Zen Cloud Inc" },
      { timestamp: "2026-08-22T10:30:00Z", stage: "Forwarded to Team B", author: "Arun (Team A)", details: "Forwarded to Team B" },
      { timestamp: "2026-08-22T16:00:00Z", stage: "Call Completed", author: "Sneha V (Team B)", details: "Outcome: Waiting for internal board approval" }
    ]
  }
];

export const mockClients: Client[] = [
  {
    id: "CL-501",
    companyName: "XYZ Solutions",
    contactPerson: "ABC",
    email: "contact@xyzsolutions.com",
    phone: "+91 98765 43210",
    location: "Chennai",
    activeProjects: 1,
    completedProjects: 0,
    totalRevenue: 150000,
    outstandingInvoices: 100000,
    status: "Active",
    joinedDate: "2026-08-23T00:00:00Z",
    requirements: mockLeads[0].requirements,
    payment: mockLeads[0].payment
  },
  {
    id: "CL-502",
    companyName: "BlueOrbit Technologies",
    contactPerson: "Ananya Deshmukh",
    email: "ananya@blueorbit.io",
    phone: "+91 98220 11982",
    location: "Mumbai",
    activeProjects: 0,
    completedProjects: 1,
    totalRevenue: 180000,
    outstandingInvoices: 0,
    status: "Active",
    joinedDate: "2026-08-20T00:00:00Z",
    requirements: mockLeads[1].requirements,
    payment: mockLeads[1].payment
  }
];

export const mockProjects: Project[] = [
  {
    id: "PRJ-3001",
    name: "XYZ Corporate Website Development",
    client: "XYZ Solutions",
    companyName: "XYZ Solutions",
    description: "Complete modern responsive corporate website with user portal, payment integration & admin panel.",
    category: "Website Development",
    budget: 150000,
    startDate: "2026-08-23",
    deadline: "2026-09-25",
    status: "Active",
    progress: 65,
    assignedTeam: "TEAM_C",
    assignedMember: "Suresh K",
    members: ["Suresh K", "Deepa M"],
    priority: "HIGH",
    clientRequirements: mockLeads[0].requirements,
    paymentStatus: "Paid",
    payment: mockLeads[0].payment,
    notesList: [
      { id: "note-1", date: "2026-08-24", author: "Suresh K", text: "Figma UI mockups completed and approved by client." },
      { id: "note-2", date: "2026-08-26", author: "Suresh K", text: "Frontend components & responsive design implemented." }
    ],
    history: mockLeads[0].journey
  },
  {
    id: "PRJ-3002",
    name: "BlueOrbit E-commerce Store",
    client: "BlueOrbit Technologies",
    companyName: "BlueOrbit Technologies",
    description: "E-commerce web application featuring product catalog, cart, Razorpay payment processing & admin dashboard.",
    category: "E-commerce",
    budget: 180000,
    startDate: "2026-08-20",
    deadline: "2026-09-15",
    status: "Completed",
    progress: 100,
    assignedTeam: "TEAM_C",
    assignedMember: "Deepa M",
    members: ["Deepa M"],
    priority: "URGENT",
    clientRequirements: mockLeads[1].requirements,
    paymentStatus: "Paid",
    payment: mockLeads[1].payment,
    notesList: [
      { id: "note-3", date: "2026-08-25", author: "Deepa M", text: "Final testing completed. Handed over to client." }
    ],
    history: mockLeads[1].journey
  }
];

export const mockTasks: Task[] = [
  {
    id: "TSK-801",
    taskName: "Develop React Client Portal Components",
    project: "XYZ Corporate Website Development",
    assignedMember: "Suresh K",
    status: "In Progress",
    priority: "HIGH",
    dueDate: "2026-09-10",
    estimatedHours: 35,
    actualHours: 22
  }
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: "TE-901",
    member: "Suresh K",
    project: "XYZ Corporate Website Development",
    task: "Develop React Client Portal Components",
    date: "2026-08-27",
    hours: 6.5,
    billable: true,
    description: "Building responsive table grid & payment modal."
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: "INV-1001",
    clientName: "XYZ Solutions",
    projectName: "XYZ Corporate Website Development",
    amount: 50000,
    tax: 9000,
    totalAmount: 59000,
    status: "Paid",
    dueDate: "2026-08-23",
    paidDate: "2026-08-23"
  }
];

export const mockAuditLogs: AuditLog[] = [
  { id: "LOG-1", timestamp: "2026-08-19 09:30 AM", user: "Priya", action: "LEAD_CREATED", details: "Priya created Lead LD-1001" },
  { id: "LOG-2", timestamp: "2026-08-19 11:00 AM", user: "Priya", action: "LEAD_FORWARDED", details: "Priya forwarded Lead LD-1001 to Team B" },
  { id: "LOG-3", timestamp: "2026-08-20 10:30 AM", user: "Rahul M", action: "CALL_COMPLETED", details: "Rahul M completed a 15-minute call for LD-1001" },
  { id: "LOG-4", timestamp: "2026-08-22 02:00 PM", user: "Rahul M", action: "REQUIREMENTS_ADDED", details: "Rahul M added client requirements for LD-1001" },
  { id: "LOG-5", timestamp: "2026-08-23 11:30 AM", user: "Rahul M", action: "PAYMENT_CONFIRMED", details: "Payment marked as Paid (₹50,000)" },
  { id: "LOG-6", timestamp: "2026-08-23 03:00 PM", user: "Admin", action: "PROJECT_ASSIGNED", details: "Project PRJ-3001 assigned to Team C (Suresh K)" },
  { id: "LOG-7", timestamp: "2026-08-25 04:00 PM", user: "Deepa M", action: "PROJECT_COMPLETED", details: "Project PRJ-3002 marked Completed by Deepa M" }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "NOTIF-1",
    title: "Lead Forwarded",
    message: "Priya forwarded Lead LD-1001 to Team B",
    timestamp: "2026-08-19T11:00:00Z",
    read: false,
    type: "info"
  },
  {
    id: "NOTIF-2",
    title: "Payment Confirmed",
    message: "₹50,000 payment received for XYZ Solutions",
    timestamp: "2026-08-23T11:30:00Z",
    read: false,
    type: "success"
  }
];

