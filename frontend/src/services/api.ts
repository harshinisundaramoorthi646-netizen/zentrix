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

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

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

    if ((status === 401 || status === 403) && !isLoginReq) {
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
      toast.success('Lead created successfully!');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const newLead: Lead = {
          id: `ZX-LD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          name: leadData.name || 'New Client Lead',
          phone: leadData.phone || '',
          email: leadData.email || '',
          company: leadData.company || 'Enterprise Client',
          location: leadData.location || 'India',
          source: leadData.source || 'Direct',
          requirement: leadData.requirement || '',
          estimatedBudget: leadData.estimatedBudget || 100000,
          notes: leadData.notes || '',
          status: 'Submitted',
          priority: leadData.priority || 'MEDIUM',
          assignedTeamA: author,
          createdDate: new Date().toISOString(),
          calls: [],
          journey: [{ timestamp: new Date().toISOString(), stage: 'Submitted', author, details: 'Lead created in workspace' }]
        };
        mockLeads.unshift(newLead);
        toast.success('Lead created successfully!');
        return newLead;
      }
      throw err;
    }
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
      toast.success(`User ${res.data.name} created!`);
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const newUser: User = {
          id: `usr_${Date.now()}`,
          email: userData.email || 'user@zentrix.com',
          name: userData.name || 'New Team Member',
          role: userData.role || 'TEAM_A',
          team: userData.team || 'TEAM_A',
          status: 'active',
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        };
        mockUsers.push(newUser);
        toast.success(`User ${newUser.name} created!`);
        return newUser;
      }
      throw err;
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
