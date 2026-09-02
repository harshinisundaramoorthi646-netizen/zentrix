import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { User, UserRole } from '../../types';
import { useAuth } from '../../services/authContext';
import { Users, UserPlus, Shield, CheckCircle2, Phone, Briefcase, TrendingUp, Mail, PhoneCall, FileText } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const TeamManagement: React.FC = () => {
  const { user, showToast } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [activeTeamTab, setActiveTeamTab] = useState<'ALL' | 'TEAM_A' | 'TEAM_B' | 'TEAM_C'>('ALL');
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [teamRole, setTeamRole] = useState<UserRole>('TEAM_A');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    apiService.getUsers().then(data => setUsers(data || [])).catch(console.error);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.createUser({
        name,
        email,
        contactNumber,
        aadhaarNumber,
        avatar,
        role: teamRole,
        team: teamRole as any,
        status: 'active',
        performanceScore: 90
      });

      setShowAddModal(false);
      resetForm();
      loadUsers();
    } catch (err: any) {
      showToast('Failed to add team member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setContactNumber('');
    setAadhaarNumber('');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    setTeamRole('TEAM_A');
  };

  const totalMembers = users.length;
  const teamACount = users.filter(u => u.role === 'TEAM_A' || u.team === 'TEAM_A').length;
  const teamBCount = users.filter(u => u.role === 'TEAM_B' || u.team === 'TEAM_B').length;
  const teamCCount = users.filter(u => u.role === 'TEAM_C' || u.team === 'TEAM_C').length;

  const filteredUsers = users.filter(u => activeTeamTab === 'ALL' || u.team === activeTeamTab);

  const getRoleBadge = (r: UserRole) => {
    const map: Record<string, string> = {
      ADMIN: 'bg-[#D4A017]/10 border-[#D4A017]/40 text-[#D4A017]',
      TEAM_A: 'bg-[#E8C766]/10 border-[#E8C766]/40 text-[#E8C766]',
      TEAM_B: 'bg-[#B8860B]/10 border-[#B8860B]/40 text-[#B8860B]',
      TEAM_C: 'bg-[#D4A017]/10 border-[#D4A017]/40 text-[#D4A017]',
    };
    return map[r] || 'bg-white/5 border-white/10 text-white';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017] text-xs font-mono font-semibold uppercase">
            HUMAN RESOURCES & FREELANCER ROSTER
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFF9F2] mt-1">Freelance Team Roster Directory</h1>
          <p className="text-xs text-[#C9B8BE] font-mono mt-0.5">
            Manage Team A, Team B, and Team C member rosters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-xl bg-[#D4A017] text-[#1F1117] font-extrabold text-xs font-mono tracking-wider uppercase hover:bg-[#B8860B] transition-all shadow-[0_0_20px_rgba(212,160,23,0.35)] flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Member</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Team Members" value={totalMembers} change="Active Staff" isPositive={true} icon={Users} accentColor="gold" />
        <StatCard title="Team A Members" value={teamACount} change="Lead Gen" isPositive={true} icon={TrendingUp} accentColor="gold" />
        <StatCard title="Team B Members" value={teamBCount} change="Outreach" isPositive={true} icon={PhoneCall} accentColor="gold" />
        <StatCard title="Team C Members" value={teamCCount} change="Execution" isPositive={true} icon={Briefcase} accentColor="gold" />
      </div>

      {/* TEAM FILTER TABS */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <button
          onClick={() => setActiveTeamTab('ALL')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTeamTab === 'ALL' ? 'bg-[#D4A017] text-[#1F1117] shadow-[0_0_15px_rgba(212,160,23,0.35)]' : 'bg-[#2B1720] text-[#C9B8BE] border border-[#3A1F2B] hover:text-[#FFF9F2]'
          }`}
        >
          All Members ({users.length})
        </button>
        <button
          onClick={() => setActiveTeamTab('TEAM_A')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTeamTab === 'TEAM_A' ? 'bg-[#D4A017] text-[#1F1117] shadow-[0_0_15px_rgba(212,160,23,0.35)]' : 'bg-[#2B1720] text-[#C9B8BE] border border-[#3A1F2B] hover:text-[#FFF9F2]'
          }`}
        >
          Team A ({teamACount})
        </button>
        <button
          onClick={() => setActiveTeamTab('TEAM_B')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTeamTab === 'TEAM_B' ? 'bg-[#D4A017] text-[#1F1117] shadow-[0_0_15px_rgba(212,160,23,0.35)]' : 'bg-[#2B1720] text-[#C9B8BE] border border-[#3A1F2B] hover:text-[#FFF9F2]'
          }`}
        >
          Team B ({teamBCount})
        </button>
        <button
          onClick={() => setActiveTeamTab('TEAM_C')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTeamTab === 'TEAM_C' ? 'bg-[#D4A017] text-[#1F1117] shadow-[0_0_15px_rgba(212,160,23,0.35)]' : 'bg-[#2B1720] text-[#C9B8BE] border border-[#3A1F2B] hover:text-[#FFF9F2]'
          }`}
        >
          Team C ({teamCCount})
        </button>
      </div>

      {/* TEAM MEMBERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(u => (
          <div key={u.id} className="p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] space-y-4 hover:border-[#D4A017] hover:shadow-[0_10px_30px_rgba(212,160,23,0.3)] transition-all">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover border border-[#3A1F2B]" />
                <div>
                  <h3 className="text-base font-bold text-[#FFF9F2]">{u.name}</h3>
                  <div className="text-xs text-[#C9B8BE] font-mono">{u.email}</div>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${getRoleBadge(u.role)}`}>
                {u.role}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#1F1117] border border-[#3A1F2B] space-y-2 text-xs font-mono text-[#C9B8BE]">
              <div className="flex justify-between">
                <span>Phone:</span>
                <strong className="text-[#FFF9F2]">{u.contactNumber || '+91 98765 43210'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Aadhaar Verif:</span>
                <strong className="text-[#D4A017]">{u.aadhaarNumber || 'Verified ✓'}</strong>
              </div>
            </div>

            {/* Role-Specific Stats */}
            {u.role === 'TEAM_A' && (
              <div className="text-xs text-[#C9B8BE] font-mono flex justify-between border-t border-[#3A1F2B] pt-2">
                <span>Leads Submitted: <strong className="text-[#FFF9F2]">{u.leadsSubmitted || 38}</strong></span>
                <span>Rate: <strong className="text-[#D4A017]">₹100/lead</strong></span>
              </div>
            )}

            {u.role === 'TEAM_B' && (
              <div className="text-xs text-[#C9B8BE] font-mono flex justify-between border-t border-[#3A1F2B] pt-2">
                <span>Calls Logged: <strong className="text-[#FFF9F2]">{u.callsCompleted || 128}</strong></span>
                <span>Rate: <strong className="text-[#E8C766]">₹200/qual</strong></span>
              </div>
            )}

            {u.role === 'TEAM_C' && (
              <div className="text-xs text-[#C9B8BE] font-mono flex justify-between border-t border-[#3A1F2B] pt-2">
                <span>Projects Execution: <strong className="text-[#FFF9F2]">{u.projectsAssigned || 8} Active</strong></span>
                <span>Share: <strong className="text-[#D4A017]">5% Payout</strong></span>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* ADD MEMBER MODAL FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#2B1720] border border-[#3A1F2B] p-6 space-y-5 shadow-2xl animate-in zoom-in-95 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
              <h3 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#D4A017]" />
                <span>Add New Member to Roster</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#C9B8BE] hover:text-[#FFF9F2] font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[#C9B8BE]">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arun@zentrix.com"
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">CONTACT NUMBER *</label>
                  <input
                    type="text"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">AADHAAR VERIFICATION NUMBER *</label>
                <input
                  type="text"
                  required
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="7849-2039-1120"
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">ASSIGNED ROLE & TEAM *</label>
                <select
                  value={teamRole}
                  onChange={(e) => setTeamRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                >
                  <option value="TEAM_A">Team A (Lead Generation)</option>
                  <option value="TEAM_B">Team B (Calling & Outreach)</option>
                  <option value="TEAM_C">Team C (Project Execution)</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3A1F2B]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1F1117] text-[#FFF9F2] hover:bg-[#3A1F2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#D4A017] text-[#1F1117] font-bold hover:bg-[#B8860B] cursor-pointer shadow-[0_0_15px_rgba(212,160,23,0.35)]"
                >
                  {submitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
