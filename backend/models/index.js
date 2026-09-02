import mongoose from 'mongoose';

// User Schema & Model
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'TEAM_A', 'TEAM_B', 'TEAM_C'], default: 'TEAM_A' },
  team: { type: String, default: 'TEAM_A' },
  avatar: { type: String },
  status: { type: String, default: 'active' },
  performanceScore: { type: Number, default: 0 },
  leadsSubmitted: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  callsCompleted: { type: Number, default: 0 },
  qualifiedLeads: { type: Number, default: 0 },
  projectsAssigned: { type: Number, default: 0 },
  earnedCommission: { type: Number, default: 0 },
  aadhaarNumber: { type: String }
}, { timestamps: true });

// Lead Schema & Model (Includes Lead Follow-ups & Journey)
const callSchema = new mongoose.Schema({
  date: { type: String, default: () => new Date().toISOString() },
  agent: { type: String },
  outcome: { type: String },
  notes: { type: String },
  duration: { type: String }
});

const journeySchema = new mongoose.Schema({
  timestamp: { type: String, default: () => new Date().toISOString() },
  stage: { type: String },
  author: { type: String },
  details: { type: String }
});

const leadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  company: { type: String, required: true },
  location: { type: String },
  source: { type: String },
  requirement: { type: String },
  estimatedBudget: { type: Number, default: 0 },
  notes: { type: String },
  status: { type: String, default: 'Submitted' },
  priority: { type: String, default: 'MEDIUM' },
  assignedTeamA: { type: String },
  assignedTeamB: { type: String },
  createdDate: { type: String, default: () => new Date().toISOString() },
  convertedDealValue: { type: Number },
  convertedDate: { type: String },
  followUpDate: { type: String },
  calls: [callSchema],
  journey: [journeySchema]
}, { timestamps: true });

// Commission Rule Schema & Model
const ruleSchema = new mongoose.Schema({
  type: { type: String, default: 'FIXED' },
  amount: { type: Number, required: true },
  unit: { type: String }
});

const commissionRuleSchema = new mongoose.Schema({
  teamA: ruleSchema,
  teamB: ruleSchema
}, { timestamps: true });

// Client Schema & Model
const clientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  activeProjects: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  outstandingInvoices: { type: Number, default: 0 },
  status: { type: String, default: 'Active' },
  joinedDate: { type: String }
}, { timestamps: true });

// Project Schema & Model
const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  client: { type: String, required: true },
  description: { type: String },
  budget: { type: Number, default: 0 },
  startDate: { type: String },
  deadline: { type: String },
  status: { type: String, default: 'Active' },
  progress: { type: Number, default: 0 },
  assignedTeam: { type: String },
  members: [{ type: String }],
  priority: { type: String, default: 'MEDIUM' }
}, { timestamps: true });

// Task Schema & Model
const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  taskName: { type: String, required: true },
  project: { type: String, required: true },
  assignedMember: { type: String },
  priority: { type: String, default: 'MEDIUM' },
  dueDate: { type: String },
  status: { type: String, default: 'Pending' },
  estimatedHours: { type: Number, default: 0 },
  actualHours: { type: Number, default: 0 }
}, { timestamps: true });

// Time Entry Schema & Model
const timeEntrySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  member: { type: String, required: true },
  project: { type: String, required: true },
  task: { type: String },
  date: { type: String },
  hours: { type: Number, default: 0 },
  billable: { type: Boolean, default: true },
  description: { type: String }
}, { timestamps: true });

// Invoice Schema & Model
const invoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  projectName: { type: String },
  amount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' },
  dueDate: { type: String },
  paidDate: { type: String }
}, { timestamps: true });

// Audit Log Schema & Model
const auditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  user: { type: String },
  action: { type: String },
  details: { type: String }
}, { timestamps: true });

// Notification Schema & Model
const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String },
  timestamp: { type: String },
  read: { type: Boolean, default: false },
  type: { type: String, default: 'info' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Lead = mongoose.model('Lead', leadSchema);
export const CommissionRule = mongoose.model('CommissionRule', commissionRuleSchema);
export const Client = mongoose.model('Client', clientSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Task = mongoose.model('Task', taskSchema);
export const TimeEntry = mongoose.model('TimeEntry', timeEntrySchema);
export const Invoice = mongoose.model('Invoice', invoiceSchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
