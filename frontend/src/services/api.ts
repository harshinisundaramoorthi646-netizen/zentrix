import axios from 'axios';
import toast from 'react-hot-toast';
import { Lead, Client, Project, Task, TimeEntry, Invoice, AuditLog, NotificationItem, User, CommissionRulesConfig } from '../types';
import {
  mockUsers,
  mockCommissionRules,
  mockLeads,
  mockClients,
  mockProjects,
  mockTasks,
  mockTimeEntries,
  mockInvoices,
  mockAuditLogs,
  mockNotifications
} from './mockData';

const getApiBaseUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL || (import.meta as any).env?.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token securely
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zentrix_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle HTTP Errors & Auto-redirect on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginReq = error.config?.url?.includes('/auth/login');
    const token = localStorage.getItem('zentrix_token');
    const isDemoSession = !token || token.startsWith('demo_token_');

    if ((status === 401 || status === 403) && !isLoginReq && !isDemoSession) {
      localStorage.removeItem('zentrix_token');
      localStorage.removeItem('zentrix_user');
      window.dispatchEvent(new Event('zentrix_unauthorized'));
    }
    return Promise.reject(error);
  }
);


// Helper for handling fallbacks when backend endpoint returns 404 or network error
async function handleRequest<T>(apiCall: () => Promise<T>, fallbackData: T): Promise<T> {
  try {
    return await apiCall();
  } catch (err: any) {
    if (err.response?.status === 404 || !err.response) {
      console.warn('⚠️ API endpoint unavailable (404/Offline). Using client fallback data.');
      return fallbackData;
    }
    throw err;
  }
}

export const apiService = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('zentrix_token', res.data.token);
      }
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        console.warn('⚠️ Live API offline or 404. Authenticating via local demo fallback store.');
        const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        const user: User = found || {
          id: `usr_${Date.now()}`,
          email,
          name: email.split('@')[0].toUpperCase(),
          role: email.toLowerCase().includes('admin') ? 'ADMIN' : (email.toLowerCase().includes('teamb') ? 'TEAM_B' : 'TEAM_A'),
          team: email.toLowerCase().includes('admin') ? 'MANAGEMENT' : (email.toLowerCase().includes('teamb') ? 'TEAM_B' : 'TEAM_A'),
          status: 'active',
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        };
        const token = `demo_token_${user.id}`;
        localStorage.setItem('zentrix_token', token);
        return { user, token };
      }
      throw err;
    }
  },

  async getMe(): Promise<User> {
    return handleRequest(
      async () => (await apiClient.get('/auth/me')).data,
      mockUsers[0]
    );
  },

  // Leads CRUD
  async getLeads(): Promise<Lead[]> {
    return handleRequest(
      async () => (await apiClient.get('/leads')).data,
      mockLeads
    );
  },

  async getLeadById(id: string): Promise<Lead> {
    return handleRequest(
      async () => (await apiClient.get(`/leads/${id}`)).data,
      mockLeads.find(l => l.id === id) || mockLeads[0]
    );
  },

  async createLead(leadData: Partial<Lead>, author: string): Promise<Lead> {
    try {
      const res = await apiClient.post('/leads', { ...leadData, author });
      const created = res.data;
      // Also add to mockLeads so local UI views sync immediately
      if (created && created.id) {
        const idx = mockLeads.findIndex(l => l.id === created.id);
        if (idx === -1) mockLeads.unshift(created);
        else mockLeads[idx] = created;
      }
      toast.success(`Lead ${created.id || 'created'} successfully!`);
      return created;
    } catch (err: any) {
      console.warn('⚠️ Server createLead call failed. Creating lead in local state:', err.message);
      const nextIdNumber = 1001 + mockLeads.length;
      const newLead: Lead = {
        id: `LD-${nextIdNumber}`,
        name: leadData.name || 'New Lead Prospect',
        company: leadData.company || 'New Company',
        phone: leadData.phone || '+91 98765 43210',
        email: leadData.email || 'lead@prospect.com',
        location: leadData.location || leadData.area || 'Chennai',
        area: leadData.area || leadData.location || 'Chennai',
        source: leadData.source || 'Direct Prospecting',
        requirement: leadData.requirement || 'Website Development',
        estimatedBudget: leadData.estimatedBudget || 150000,
        notes: leadData.notes || '',
        status: 'New',
        priority: leadData.priority || 'MEDIUM',
        assignedTeamA: author || 'Team A Member',
        createdDate: new Date().toISOString(),
        forwardedToTeamB: false,
        calls: [],
        journey: [
          {
            timestamp: new Date().toISOString(),
            stage: 'Lead Generated',
            author: author || 'Team A',
            details: `Lead ${leadData.name || ''} submitted for ${leadData.company || ''}`
          }
        ]
      };
      mockLeads.unshift(newLead);
      mockAuditLogs.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: author || 'Team A',
        action: 'LEAD_GENERATED',
        details: `${author} created Lead ${newLead.id}`
      });
      toast.success(`Lead ${newLead.id} created successfully!`);
      return newLead;
    }
  },

  async forwardLeadToTeamB(id: string, author: string): Promise<Lead> {
    const lead = mockLeads.find(l => l.id === id);
    if (lead) {
      lead.status = 'Forwarded to Team B';
      lead.forwardedToTeamB = true;
      lead.forwardedDate = new Date().toISOString();
      lead.assignedTeamB = lead.assignedTeamB || 'Rahul M';
      lead.journey.push({
        timestamp: new Date().toISOString(),
        stage: 'Forwarded to Team B',
        author,
        details: `Lead ${id} forwarded to Team B calling queue`
      });
      mockAuditLogs.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: author,
        action: 'LEAD_FORWARDED',
        details: `${author} forwarded Lead ${id} to Team B`
      });
      toast.success(`Lead ${id} forwarded to Team B!`);
      return lead;
    }
    throw new Error('Lead not found');
  },

  async updateLeadStatus(id: string, status: any, author: string): Promise<Lead> {
    const lead = mockLeads.find(l => l.id === id);
    if (lead) {
      lead.status = status;
      lead.journey.push({
        timestamp: new Date().toISOString(),
        stage: `Status: ${status}`,
        author,
        details: `Status updated to ${status}`
      });
      toast.success(`Lead ${id} status updated to ${status}`);
      return lead;
    }
    throw new Error('Lead not found');
  },

  async saveClientRequirements(id: string, reqData: any, author: string): Promise<Lead> {
    const lead = mockLeads.find(l => l.id === id);
    if (lead) {
      lead.requirements = {
        id: `req-${Date.now()}`,
        clientName: reqData.clientName || lead.name,
        companyName: reqData.companyName || lead.company,
        category: reqData.category || 'Website Development',
        detailedRequirement: reqData.detailedRequirement || '',
        budget: Number(reqData.budget) || lead.estimatedBudget,
        expectedDeliveryDate: reqData.expectedDeliveryDate || '',
        additionalNotes: reqData.additionalNotes || '',
        recordedBy: author,
        date: new Date().toISOString()
      };
      lead.journey.push({
        timestamp: new Date().toISOString(),
        stage: 'Requirements Collected',
        author,
        details: `Client requirements recorded (${reqData.category})`
      });
      mockAuditLogs.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: author,
        action: 'REQUIREMENTS_SAVED',
        details: `${author} recorded requirements for ${lead.company}`
      });
      toast.success('Client requirements saved! Visible to Team C.');
      return lead;
    }
    throw new Error('Lead not found');
  },

  async savePaymentConfirmation(id: string, payData: any, author: string): Promise<Lead> {
    const lead = mockLeads.find(l => l.id === id);
    if (lead) {
      lead.payment = {
        status: payData.status || 'Paid',
        amount: Number(payData.amount) || 50000,
        paymentDate: payData.paymentDate || new Date().toISOString().split('T')[0],
        transactionId: payData.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        notes: payData.notes || '',
        recordedBy: author
      };
      lead.journey.push({
        timestamp: new Date().toISOString(),
        stage: 'Payment Confirmed',
        author,
        details: `Payment of ₹${lead.payment.amount.toLocaleString('en-IN')} confirmed (${lead.payment.status})`
      });

      // Auto check if Project exists or create new Project for Team C
      let proj = mockProjects.find(p => p.companyName === lead.company || p.client === lead.company);
      if (!proj) {
        proj = {
          id: `PRJ-${3001 + mockProjects.length}`,
          name: `${lead.company} ${lead.requirements?.category || 'Project'}`,
          client: lead.company,
          companyName: lead.company,
          description: lead.requirements?.detailedRequirement || lead.requirement,
          category: lead.requirements?.category || 'Website Development',
          budget: lead.estimatedBudget,
          startDate: new Date().toISOString().split('T')[0],
          deadline: lead.requirements?.expectedDeliveryDate || '2026-09-30',
          status: 'Not Started',
          progress: 0,
          assignedTeam: 'TEAM_C',
          assignedMember: 'Suresh K',
          members: ['Suresh K'],
          priority: lead.priority,
          clientRequirements: lead.requirements,
          paymentStatus: lead.payment.status,
          payment: lead.payment,
          notesList: [],
          history: lead.journey
        };
        mockProjects.unshift(proj);
        lead.assignedTeamC = 'Suresh K';
        lead.journey.push({
          timestamp: new Date().toISOString(),
          stage: 'Project Assigned to Team C',
          author: 'System',
          details: `Project ${proj.id} assigned to Team C (Suresh K)`
        });
      } else {
        proj.paymentStatus = lead.payment.status;
        proj.payment = lead.payment;
      }

      mockAuditLogs.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: author,
        action: 'PAYMENT_CONFIRMED',
        details: `Payment marked as ${payData.status} (₹${Number(payData.amount).toLocaleString('en-IN')})`
      });
      toast.success('Payment confirmation recorded!');
      return lead;
    }
    throw new Error('Lead not found');
  },

  async updateProjectProgress(id: string, progress: number, milestone: string, logNote?: any): Promise<Project> {
    const proj = mockProjects.find(p => p.id === id);
    if (proj) {
      proj.progress = progress;
      proj.milestones = milestone;
      proj.milestone = milestone;
      if (progress === 100) {
        proj.status = 'Completed';
      } else if (progress > 0) {
        proj.status = 'Active';
      }
      toast.success(`Project ${id} progress updated to ${progress}%`);
      return proj;
    }
    throw new Error('Project not found');
  },

  async updateLead(id: string, leadData: Partial<Lead>): Promise<Lead> {
    try {
      const res = await apiClient.put(`/leads/${id}`, leadData);
      toast.success('Lead updated successfully!');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const index = mockLeads.findIndex(l => l.id === id);
        if (index !== -1) {
          mockLeads[index] = { ...mockLeads[index], ...leadData };
          toast.success('Lead updated successfully!');
          return mockLeads[index];
        }
      }
      throw err;
    }
  },

  async deleteLead(id: string): Promise<{ message: string; lead: Lead }> {
    try {
      const res = await apiClient.delete(`/leads/${id}`);
      toast.success('Lead deleted successfully!');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const index = mockLeads.findIndex(l => l.id === id);
        const removed = mockLeads.splice(index, 1)[0];
        toast.success('Lead deleted successfully!');
        return { message: 'Deleted', lead: removed };
      }
      throw err;
    }
  },

  async logCall(id: string, callData: { outcome: string; notes: string; followUpDate?: string; agent: string; duration?: string }): Promise<Lead> {
    try {
      const res = await apiClient.post(`/leads/${id}/call`, callData);
      toast.success('Call outcome recorded!');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const lead = mockLeads.find(l => l.id === id);
        if (lead) {
          lead.calls.push({ date: new Date().toISOString(), ...callData });
          toast.success('Call outcome recorded!');
          return lead;
        }
      }
      throw err;
    }
  },

  async qualifyLead(id: string, agent: string): Promise<Lead> {
    try {
      const res = await apiClient.post(`/leads/${id}/qualify`, { agent });
      toast.success('Lead qualified successfully!');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const lead = mockLeads.find(l => l.id === id);
        if (lead) {
          lead.status = 'Qualified';
          toast.success('Lead qualified successfully!');
          return lead;
        }
      }
      throw err;
    }
  },

  async convertLead(id: string, dealValue: number, notes: string, agent: string): Promise<{ lead: Lead; project?: Project; invoice?: Invoice }> {
    try {
      const res = await apiClient.post(`/leads/${id}/convert`, { dealValue, notes, agent });
      toast.success('🎉 Deal converted successfully!');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const lead = mockLeads.find(l => l.id === id);
        if (lead) {
          lead.status = 'Converted';
          lead.convertedDealValue = dealValue;
          toast.success('🎉 Deal converted successfully!');
          return { lead };
        }
      }
      throw err;
    }
  },

  // Users CRUD
  async getUsers(): Promise<User[]> {
    return handleRequest(
      async () => (await apiClient.get('/users')).data,
      mockUsers
    );
  },

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const res = await apiClient.post('/users', userData);
      const created = res.data;
      if (created && created.id) {
        const idx = mockUsers.findIndex(u => u.id === created.id);
        if (idx === -1) mockUsers.unshift(created);
        else mockUsers[idx] = created;
      }
      toast.success(`User ${created.name || 'Member'} created!`);
      return created;
    } catch (err: any) {
      console.warn('⚠️ Server createUser call failed. Creating user in local state:', err.message);
      const newUser: User = {
        id: `usr_${Date.now()}`,
        email: userData.email || 'user@zentrix.com',
        name: userData.name || 'New Team Member',
        role: userData.role || 'TEAM_A',
        team: userData.team || userData.role || 'TEAM_A',
        aadhaarNumber: userData.aadhaarNumber || '1234-5678-9012',
        contactNumber: userData.contactNumber || '+91 98765 43210',
        status: 'active',
        avatar: userData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        performanceScore: 90
      };
      mockUsers.unshift(newUser);
      mockAuditLogs.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: 'Admin',
        action: 'MEMBER_ADDED',
        details: `Admin added new member ${newUser.name} to ${newUser.team}`
      });
      toast.success(`User ${newUser.name} added to ${newUser.team}!`);
      return newUser;
    }
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const res = await apiClient.put(`/users/${id}`, userData);
      toast.success(`User updated!`);
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const user = mockUsers.find(u => u.id === id);
        if (user) {
          Object.assign(user, userData);
          toast.success('User updated!');
          return user;
        }
      }
      throw err;
    }
  },

  async deleteUser(id: string): Promise<{ message: string; user: User }> {
    try {
      const res = await apiClient.delete(`/users/${id}`);
      toast.success('User removed!');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const index = mockUsers.findIndex(u => u.id === id);
        const removed = mockUsers.splice(index, 1)[0];
        toast.success('User removed!');
        return { message: 'Removed', user: removed };
      }
      throw err;
    }
  },

  // Commission Rules
  async getCommissionRules(): Promise<CommissionRulesConfig> {
    return handleRequest(
      async () => (await apiClient.get('/commission-rules')).data,
      mockCommissionRules
    );
  },

  async updateCommissionRules(rules: Partial<CommissionRulesConfig>): Promise<CommissionRulesConfig> {
    try {
      const res = await apiClient.put('/commission-rules', rules);
      toast.success('Commission rules updated!');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        Object.assign(mockCommissionRules, rules);
        toast.success('Commission rules updated!');
        return mockCommissionRules;
      }
      throw err;
    }
  },

  // Clients & Projects & Tasks
  async getClients(): Promise<Client[]> {
    return handleRequest(
      async () => (await apiClient.get('/clients')).data,
      mockClients
    );
  },

  async getProjects(): Promise<Project[]> {
    return handleRequest(
      async () => (await apiClient.get('/projects')).data,
      mockProjects
    );
  },

  async getTasks(): Promise<Task[]> {
    return handleRequest(
      async () => (await apiClient.get('/tasks')).data,
      mockTasks
    );
  },

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    try {
      const res = await apiClient.put(`/tasks/${id}/status`, { status });
      toast.success(`Task status updated to ${status}`);
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const task = mockTasks.find(t => t.id === id);
        if (task) {
          task.status = status as any;
          toast.success(`Task status updated to ${status}`);
          return task;
        }
      }
      throw err;
    }
  },

  // Time Entries
  async getTimeEntries(): Promise<TimeEntry[]> {
    return handleRequest(
      async () => (await apiClient.get('/time-entries')).data,
      mockTimeEntries
    );
  },

  async addTimeEntry(entry: Partial<TimeEntry>): Promise<TimeEntry> {
    try {
      const res = await apiClient.post('/time-entries', entry);
      toast.success('Time entry logged!');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const newEntry: TimeEntry = {
          id: `ZX-TE-${Date.now()}`,
          member: entry.member || 'User',
          project: entry.project || 'General Project',
          task: entry.task || 'General Task',
          date: entry.date || new Date().toISOString(),
          hours: entry.hours || 1,
          billable: entry.billable !== undefined ? entry.billable : true,
          description: entry.description || 'Logged work'
        };
        mockTimeEntries.push(newEntry);
        toast.success('Time entry logged!');
        return newEntry;
      }
      throw err;
    }
  },

  // Invoices, Audit Logs, Notifications, AI
  async getInvoices(): Promise<Invoice[]> {
    return handleRequest(
      async () => (await apiClient.get('/invoices')).data,
      mockInvoices
    );
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return handleRequest(
      async () => (await apiClient.get('/audit-logs')).data,
      mockAuditLogs
    );
  },

  async getNotifications(): Promise<NotificationItem[]> {
    return handleRequest(
      async () => (await apiClient.get('/notifications')).data,
      mockNotifications
    );
  },

  async getAiPredict(): Promise<{ highPriorityLeads: string[]; recommendedTeam: string; conversionProbability: number; performanceInsight: string }> {
    return handleRequest(
      async () => (await apiClient.get('/ai/predict')).data,
      {
        highPriorityLeads: ["ZX-LD-2026-00128", "ZX-LD-2026-00127"],
        recommendedTeam: "TEAM_A",
        conversionProbability: 88,
        performanceInsight: "High conversion probability. 88% match for Enterprise SaaS requirements."
      }
    );
  }
};
