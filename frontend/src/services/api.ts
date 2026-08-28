import axios from 'axios';
import toast from 'react-hot-toast';
import { Lead, Client, Project, Task, TimeEntry, Invoice, AuditLog, NotificationItem, User, CommissionRule } from '../types';

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

export const apiService = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('zentrix_token', res.data.token);
    }
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // Leads CRUD
  async getLeads(): Promise<Lead[]> {
    const res = await apiClient.get('/leads');
    return res.data;
  },

  async getLeadById(id: string): Promise<Lead> {
    const res = await apiClient.get(`/leads/${id}`);
    return res.data;
  },

  async createLead(leadData: Partial<Lead>, author: string): Promise<Lead> {
    const res = await apiClient.post('/leads', { ...leadData, author });
    toast.success('Lead created successfully!');
    return res.data;
  },

  async updateLead(id: string, leadData: Partial<Lead>): Promise<Lead> {
    const res = await apiClient.put(`/leads/${id}`, leadData);
    toast.success('Lead updated successfully!');
    return res.data;
  },

  async deleteLead(id: string): Promise<{ message: string; lead: Lead }> {
    const res = await apiClient.delete(`/leads/${id}`);
    toast.success('Lead deleted successfully!');
    return res.data;
  },

  async logCall(id: string, callData: { outcome: string; notes: string; followUpDate?: string; agent: string; duration?: string }): Promise<Lead> {
    const res = await apiClient.post(`/leads/${id}/call`, callData);
    toast.success('Call outcome recorded!');
    return res.data;
  },

  async qualifyLead(id: string, agent: string): Promise<Lead> {
    const res = await apiClient.post(`/leads/${id}/qualify`, { agent });
    toast.success('Lead qualified successfully!');
    return res.data;
  },

  async convertLead(id: string, dealValue: number, notes: string, agent: string): Promise<{ lead: Lead; project?: Project; invoice?: Invoice }> {
    const res = await apiClient.post(`/leads/${id}/convert`, { dealValue, notes, agent });
    toast.success('🎉 Deal converted successfully!');
    return res.data;
  },

  // Users CRUD
  async getUsers(): Promise<User[]> {
    const res = await apiClient.get('/users');
    return res.data;
  },

  async createUser(userData: Partial<User>): Promise<User> {
    const res = await apiClient.post('/users', userData);
    toast.success(`User ${res.data.name} created!`);
    return res.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const res = await apiClient.put(`/users/${id}`, userData);
    toast.success(`User updated!`);
    return res.data;
  },

  async deleteUser(id: string): Promise<{ message: string; user: User }> {
    const res = await apiClient.delete(`/users/${id}`);
    toast.success('User removed!');
    return res.data;
  },

  // Commission Rules
  async getCommissionRules(): Promise<CommissionRule> {
    const res = await apiClient.get('/commission-rules');
    return res.data;
  },

  async updateCommissionRules(rules: Partial<CommissionRule>): Promise<CommissionRule> {
    const res = await apiClient.put('/commission-rules', rules);
    toast.success('Commission rules updated!');
    return res.data;
  },

  // Clients & Projects & Tasks
  async getClients(): Promise<Client[]> {
    const res = await apiClient.get('/clients');
    return res.data;
  },

  async getProjects(): Promise<Project[]> {
    const res = await apiClient.get('/projects');
    return res.data;
  },

  async getTasks(): Promise<Task[]> {
    const res = await apiClient.get('/tasks');
    return res.data;
  },

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    const res = await apiClient.put(`/tasks/${id}/status`, { status });
    toast.success(`Task status updated to ${status}`);
    return res.data;
  },

  // Time Entries
  async getTimeEntries(): Promise<TimeEntry[]> {
    const res = await apiClient.get('/time-entries');
    return res.data;
  },

  async addTimeEntry(entry: Partial<TimeEntry>): Promise<TimeEntry> {
    const res = await apiClient.post('/time-entries', entry);
    toast.success('Time entry logged!');
    return res.data;
  },

  // Invoices, Audit Logs, Notifications, AI
  async getInvoices(): Promise<Invoice[]> {
    const res = await apiClient.get('/invoices');
    return res.data;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await apiClient.get('/audit-logs');
    return res.data;
  },

  async getNotifications(): Promise<NotificationItem[]> {
    const res = await apiClient.get('/notifications');
    return res.data;
  },

  async getAiPredict(): Promise<{ highPriorityLeads: string[]; recommendedTeam: string; conversionProbability: number; performanceInsight: string }> {
    const res = await apiClient.get('/ai/predict');
    return res.data;
  }
};
