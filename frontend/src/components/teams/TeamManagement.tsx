import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { User, UserRole } from '../../types';
import { UserPlus, Trash2, Edit3, Loader2 } from 'lucide-react';

export const TeamManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTeamTab, setActiveTeamTab] = useState<'ALL' | 'TEAM_A' | 'TEAM_B'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123');
  const [role, setRole] = useState<UserRole>('TEAM_A');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      const newUser = await apiService.createUser({
        name,
        email,
        password,
        role,
        team: role === 'ADMIN' ? 'MANAGEMENT' : role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        performanceScore: 90
      });
      setUsers(prev => [...prev, newUser]);
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('Password123');
      setRole('TEAM_A');
    } catch (err) {
      console.error('Error adding user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove team member ${userName}?`)) return;
    try {
      await apiService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error removing user:', err);
    }
  };

  const filteredUsers = users.filter(u => activeTeamTab === 'ALL' || u.team === activeTeamTab);

  const getRoleBadge = (r: UserRole) => {
    const map = {
      ADMIN: 'bg-[#C7FF3D]/10 border-[#C7FF3D]/40 text-[#C7FF3D]',
      TEAM_A: 'bg-[#38E8FF]/10 border-[#38E8FF]/40 text-[#38E8FF]',
      TEAM_B: 'bg-[#9B7CFF]/10 border-[#9B7CFF]/40 text-[#9B7CFF]',
    };
    return map[r] || 'bg-white/5 border-white/10 text-white';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Freelancer Team Rosters</h1>
          <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
            Manage Team A (Lead Gen) and Team B (Outreach) member workloads and commissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#C7FF3D] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#b5eb2b] transition-colors font-mono"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>

          <div className="flex gap-2 bg-[#111722] p-1 rounded-xl border border-white/10 text-xs font-mono">
            {(['ALL', 'TEAM_A', 'TEAM_B'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTeamTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTeamTab === tab ? 'bg-[#C7FF3D] text-black font-bold' : 'text-[#9BA7B7] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-[#0D1118]/80 rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 text-[#C7FF3D] animate-spin" />
          <span className="ml-3 text-sm text-[#9BA7B7] font-mono">Fetching team members from MongoDB...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(u => (
            <div key={u.id} className="p-5 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 hover:border-white/20 transition-all relative group">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-white truncate">{u.name}</div>
                    <div className="text-xs text-[#9BA7B7] font-mono truncate">{u.email}</div>
                    <div className={`mt-1 inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteUser(u.id, u.name)}
                  className="p-1.5 text-[#64748B] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove team member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#111722] grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <div className="text-[#64748B]">Performance Score</div>
                  <div className="text-[#C7FF3D] font-bold text-sm">{u.performanceScore || 90}%</div>
                </div>
                <div>
                  <div className="text-[#64748B]">Earned Commission</div>
                  <div className="text-white font-bold text-sm">₹{(u.earnedCommission || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>

              {u.role === 'TEAM_A' && (
                <div className="text-xs text-[#9BA7B7] font-mono flex justify-between">
                  <span>Leads Submitted: <strong className="text-white">{u.leadsSubmitted || 0}</strong></span>
                  <span>Rate: <strong className="text-[#C7FF3D]">₹100/lead</strong></span>
                </div>
              )}

              {u.role === 'TEAM_B' && (
                <div className="text-xs text-[#9BA7B7] font-mono flex justify-between">
                  <span>Calls Completed: <strong className="text-white">{u.callsCompleted || 0}</strong></span>
                  <span>Rate: <strong className="text-[#9B7CFF]">₹200/qual</strong></span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleAddUser} className="w-full max-w-md bg-[#111722] border border-white/20 p-6 rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add Freelancer Team Member</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-[#64748B] hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#9BA7B7] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div>
                <label className="block text-[#9BA7B7] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@zentrix.com"
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div>
                <label className="block text-[#9BA7B7] mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div>
                <label className="block text-[#9BA7B7] mb-1">Assigned Role & Team *</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                >
                  <option value="TEAM_A">Team A (Lead Generation)</option>
                  <option value="TEAM_B">Team B (Outreach & Qualification)</option>
                  <option value="ADMIN">Admin / Management</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-[#9BA7B7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-[#C7FF3D] text-black font-bold text-xs flex items-center gap-2 hover:bg-[#b5eb2b]"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
