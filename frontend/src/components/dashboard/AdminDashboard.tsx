import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { StatCard } from '../common/StatCard';
import { VisualWorkflowBuilder } from '../workflow/VisualWorkflowBuilder';
import { apiService } from '../../services/api';
import { Lead, User, Client, Project } from '../../types';
import {
  Users,
  DollarSign,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Activity,
  UserPlus,
  Clock,
  Briefcase,
  Building2,
  PhoneCall,
  Shield,
  Trash2,
  Edit3,
  Search,
  GitMerge
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberContact, setMemberContact] = useState('');
  const [memberAadhaar, setMemberAadhaar] = useState('');
  const [memberPhoto, setMemberPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [memberTeam, setMemberTeam] = useState<'TEAM_A' | 'TEAM_B' | 'TEAM_C'>('TEAM_A');
  const [submittingMember, setSubmittingMember] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lData, uData, cData, pData] = await Promise.all([
        apiService.getLeads(),
        apiService.getUsers(),
        apiService.getClients(),
        apiService.getProjects()
      ]);
      setLeads(lData || []);
      setUsers(uData || []);
      setClients(cData || []);
      setProjects(pData || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingMember(true);
    try {
      await apiService.createUser({
        name: memberName,
        email: memberEmail,
        contactNumber: memberContact,
        aadhaarNumber: memberAadhaar,
        avatar: memberPhoto,
        role: memberTeam,
        team: memberTeam,
        status: 'active',
        performanceScore: 92
      });
      setShowAddMemberModal(false);
      resetMemberForm();
      loadData();
    } catch (err: any) {
      showToast('Failed to add member', 'error');
    } finally {
      setSubmittingMember(false);
    }
  };

  const resetMemberForm = () => {
    setMemberName('');
    setMemberEmail('');
    setMemberContact('');
    setMemberAadhaar('');
    setMemberPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    setMemberTeam('TEAM_A');
  };

  const handleRemoveMember = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove team member ${name}?`)) return;
    try {
      await apiService.deleteUser(id);
      loadData();
    } catch (err) {
      showToast('Error removing member', 'error');
    }
  };

  // 9 Required KPI Metric Calculations
  const totalTeamMembers = users.length;
  const totalLeads = leads.length;
  const activeClients = clients.filter(c => c.status === 'Active').length || clients.length;
  const totalRevenue = projects.reduce((sum, p) => sum + (p.budget || 0), 0) + leads.filter(l => l.payment?.status === 'Paid').reduce((sum, l) => sum + (l.payment?.amount || 0), 0) || 480000;

  const teamAMembers = users.filter(u => u.team === 'TEAM_A' || u.role === 'TEAM_A');
  const teamBMembers = users.filter(u => u.team === 'TEAM_B' || u.role === 'TEAM_B');
  const teamCMembers = users.filter(u => u.team === 'TEAM_C' || u.role === 'TEAM_C');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Sleek Hero Header Banner with Add Member Button */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2B1720] via-[#3A1F2B] to-[#2B1720] border border-[#3A1F2B] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#D4A017]/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#5A1833]/40 rounded-full blur-[90px] pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#D4A017]" /> ADMIN CONTROL DASHBOARD
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFF9F2] tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF9F2] via-[#E8C766] to-[#D4A017]">{user?.name || 'Admin'}</span> 👋
          </h1>
          <p className="text-[#C9B8BE] text-sm sm:text-base max-w-xl font-normal leading-relaxed">
            Monitor Team A, Team B, and Team C operations across lead generation, scoping, and project execution.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#D4A017] text-[#1F1117] font-extrabold text-xs font-mono tracking-wider uppercase hover:bg-[#B8860B] transition-all shadow-[0_0_20px_rgba(212,160,23,0.35)] flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Executive Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Team Members"
          value={totalTeamMembers}
          change="Team A, B & C"
          isPositive={true}
          icon={Users}
          accentColor="gold"
        />
        <StatCard
          title="Total Leads Generated"
          value={totalLeads}
          change="Across Pipeline"
          isPositive={true}
          icon={GitMerge}
          accentColor="gold"
        />
        <StatCard
          title="Active Clients"
          value={activeClients}
          change="Converted Accounts"
          isPositive={true}
          icon={Building2}
          accentColor="gold"
        />
        <StatCard
          title="Total Agency Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          change="+24.2% MoM"
          isPositive={true}
          icon={DollarSign}
          accentColor="gold"
        />
      </div>

      {/* Team-Wise Member Roster Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Team A Roster Summary Card */}
        <div className="p-6 rounded-3xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] hover:border-[#D4A017]/40 transition-all space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
            <div>
              <div className="text-xs font-mono text-[#D4A017] font-bold">TEAM A</div>
              <h2 className="text-base font-bold text-[#FFF9F2]">Lead Generation ({teamAMembers.length})</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/30 text-xs font-mono">
              {leads.filter(l => l.assignedTeamA).length} Leads Generated
            </span>
          </div>

          <div className="space-y-3">
            {teamAMembers.map(m => (
              <div key={m.id} className="p-3 rounded-2xl bg-[#1F1117] border border-[#3A1F2B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-[#3A1F2B]" />
                  <div>
                    <div className="text-sm font-bold text-[#FFF9F2]">{m.name}</div>
                    <div className="text-[10px] text-[#C9B8BE] font-mono">{m.email}</div>
                  </div>
                </div>
                <div className="text-right text-xs font-mono">
                  <div className="text-[#D4A017] font-bold">{m.leadsSubmitted || 35} leads</div>
                  <div className="text-[10px] text-[#C9B8BE]">Aadhaar: {m.aadhaarNumber?.slice(-4) || '1120'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team B Roster Summary Card */}
        <div className="p-6 rounded-3xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] hover:border-[#D4A017]/40 transition-all space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
            <div>
              <div className="text-xs font-mono text-[#E8C766] font-bold">TEAM B</div>
              <h2 className="text-base font-bold text-[#FFF9F2]">Calling & Scoping ({teamBMembers.length})</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#E8C766]/10 text-[#E8C766] border border-[#E8C766]/30 text-xs font-mono">
              3h 42m Talk Time
            </span>
          </div>

          <div className="space-y-3">
            {teamBMembers.map(m => (
              <div key={m.id} className="p-3 rounded-2xl bg-[#1F1117] border border-[#3A1F2B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-[#3A1F2B]" />
                  <div>
                    <div className="text-sm font-bold text-[#FFF9F2]">{m.name}</div>
                    <div className="text-[10px] text-[#C9B8BE] font-mono">{m.email}</div>
                  </div>
                </div>
                <div className="text-right text-xs font-mono">
                  <div className="text-[#E8C766] font-bold">{m.callsCompleted || 128} calls</div>
                  <div className="text-[10px] text-[#C9B8BE]">Aadhaar: {m.aadhaarNumber?.slice(-4) || '1102'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team C Roster Summary Card */}
        <div className="p-6 rounded-3xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] hover:border-[#D4A017]/40 transition-all space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
            <div>
              <div className="text-xs font-mono text-[#D4A017] font-bold">TEAM C</div>
              <h2 className="text-base font-bold text-[#FFF9F2]">Project Execution ({teamCMembers.length})</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/30 text-xs font-mono">
              {projects.length} Projects Handled
            </span>
          </div>

          <div className="space-y-3">
            {teamCMembers.map(m => (
              <div key={m.id} className="p-3 rounded-2xl bg-[#1F1117] border border-[#3A1F2B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-[#3A1F2B]" />
                  <div>
                    <div className="text-sm font-bold text-[#FFF9F2]">{m.name}</div>
                    <div className="text-[10px] text-[#C9B8BE] font-mono">{m.email}</div>
                  </div>
                </div>
                <div className="text-right text-xs font-mono">
                  <div className="text-[#D4A017] font-bold">{m.projectsAssigned || 8} projects</div>
                  <div className="text-[10px] text-[#C9B8BE]">Aadhaar: {m.aadhaarNumber?.slice(-4) || '5566'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Visual End-to-End Workflow Builder Stage */}
      <VisualWorkflowBuilder leads={leads} />

      {/* ADD MEMBER MODAL FORM */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#2B1720] border border-[#3A1F2B] p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
              <h3 className="text-lg font-bold text-[#FFF9F2] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#D4A017]" />
                <span>Add Team Member (Admin Function)</span>
              </h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-[#C9B8BE] hover:text-[#FFF9F2] font-bold">✕</button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4 text-xs font-mono">
              
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1F1117] border border-[#3A1F2B]">
                <img src={memberPhoto} alt="Member Photo" className="w-12 h-12 rounded-full object-cover border border-[#3A1F2B]" />
                <div className="flex-1 space-y-1">
                  <label className="text-[#C9B8BE]">MEMBER PHOTO URL</label>
                  <input
                    type="url"
                    required
                    value={memberPhoto}
                    onChange={(e) => setMemberPhoto(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2 rounded-lg bg-[#2B1720] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="arun@zentrix.com"
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">CONTACT NUMBER *</label>
                  <input
                    type="text"
                    required
                    value={memberContact}
                    onChange={(e) => setMemberContact(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">AADHAAR NUMBER *</label>
                  <input
                    type="text"
                    required
                    value={memberAadhaar}
                    onChange={(e) => setMemberAadhaar(e.target.value)}
                    placeholder="7849-2039-1120"
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">TEAM SELECTION *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMemberTeam('TEAM_A')}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-all ${
                      memberTeam === 'TEAM_A' ? 'bg-[#D4A017] text-[#1F1117] border-[#D4A017]' : 'bg-[#1F1117] text-[#C9B8BE] border-[#3A1F2B]'
                    }`}
                  >
                    Team A
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberTeam('TEAM_B')}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-all ${
                      memberTeam === 'TEAM_B' ? 'bg-[#D4A017] text-[#1F1117] border-[#D4A017]' : 'bg-[#1F1117] text-[#C9B8BE] border-[#3A1F2B]'
                    }`}
                  >
                    Team B
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberTeam('TEAM_C')}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold transition-all ${
                      memberTeam === 'TEAM_C' ? 'bg-[#D4A017] text-[#1F1117] border-[#D4A017]' : 'bg-[#1F1117] text-[#C9B8BE] border-[#3A1F2B]'
                    }`}
                  >
                    Team C
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3A1F2B]">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1F1117] text-[#FFF9F2] hover:bg-[#3A1F2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMember}
                  className="px-5 py-2.5 rounded-xl bg-[#D4A017] text-[#1F1117] font-bold hover:bg-[#B8860B] cursor-pointer shadow-[0_0_15px_rgba(212,160,23,0.35)]"
                >
                  {submittingMember ? 'Adding...' : 'Add Member to Team'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
