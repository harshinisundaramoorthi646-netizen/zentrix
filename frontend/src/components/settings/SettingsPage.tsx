import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { apiService } from '../../services/api';
import { mockUsers, mockAuditLogs, mockCommissionRules } from '../../services/mockData';
import { User, UserRole } from '../../types';
import {
  User as UserIcon,
  Users,
  ShieldCheck,
  Award,
  GitMerge,
  Receipt,
  Bell,
  Lock,
  Activity,
  Sliders,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  Edit3,
  Search,
  Building2,
  Clock,
  PhoneCall,
  FileText,
  DollarSign,
  ShieldAlert,
  Check,
  X,
  CreditCard,
  Briefcase
} from 'lucide-react';

interface CommissionRuleItem {
  id: string;
  name: string;
  role: UserRole;
  type: 'fixed' | 'percentage';
  value: number;
  enabled: boolean;
}

export const SettingsPage: React.FC = () => {
  const { user, role, logout, showToast } = useAuth();

  // Active Tab state based on user role
  const [activeTab, setActiveTab] = useState<string>('profile');

  // --- Profile State ---
  const [profileName, setProfileName] = useState(user?.name || 'Zentrix User');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'user@zentrix.com');
  const [profilePhone, setProfilePhone] = useState(user?.contactNumber || '+91 98765 43210');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
  const [profileAadhaar, setProfileAadhaar] = useState(user?.aadhaarNumber || '8899-2233-4455');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // --- Security State ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // --- Notification Toggles ---
  const [notifLead, setNotifLead] = useState(true);
  const [notifFollowup, setNotifFollowup] = useState(true);
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifProject, setNotifProject] = useState(true);
  const [notifSystem, setNotifSystem] = useState(true);

  // --- Team A Lead Preferences ---
  const [teamADefaultArea, setTeamADefaultArea] = useState('Chennai');
  const [teamADefaultFilter, setTeamADefaultFilter] = useState('All');
  const [teamAAutoSort, setTeamAAutoSort] = useState(true);

  // --- Team B Calling Preferences ---
  const [teamBDefaultTimer, setTeamBDefaultTimer] = useState('Live Timer');
  const [teamBReminderLeadTime, setTeamBReminderLeadTime] = useState('15 Minutes');
  const [teamBDefaultOutcome, setTeamBDefaultOutcome] = useState('Interested');

  // --- Team C Project Preferences ---
  const [teamCDefaultCategory, setTeamCDefaultCategory] = useState('ALL');
  const [teamCProgressTrackingMode, setTeamCProgressTrackingMode] = useState('Slider %');
  const [teamCCompletionAlerts, setTeamCCompletionAlerts] = useState(true);

  // --- Admin Team Management State ---
  const [teamList, setTeamList] = useState<User[]>(mockUsers);
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberAadhaar, setNewMemberAadhaar] = useState('');
  const [newMemberTeam, setNewMemberTeam] = useState<UserRole>('TEAM_A');
  const [newMemberPhoto, setNewMemberPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  // --- Admin Commission Rules State ---
  const [commissionRulesList, setCommissionRulesList] = useState<CommissionRuleItem[]>([
    { id: 'rule_1', name: 'Team A Lead Submission Bonus', role: 'TEAM_A', type: 'fixed', value: 100, enabled: true },
    { id: 'rule_2', name: 'Team B Qualified Call Bonus', role: 'TEAM_B', type: 'fixed', value: 200, enabled: true },
    { id: 'rule_3', name: 'Team C Project Completion Share', role: 'TEAM_C', type: 'percentage', value: 5, enabled: true },
  ]);
  const [ruleName, setRuleName] = useState('');
  const [ruleRole, setRuleRole] = useState<UserRole>('TEAM_A');
  const [ruleType, setRuleType] = useState<'fixed' | 'percentage'>('fixed');
  const [ruleValue, setRuleValue] = useState('100');
  const [ruleEnabled, setRuleEnabled] = useState(true);

  // --- Admin Workflow Settings State ---
  const [wfRequirePayment, setWfRequirePayment] = useState(true);
  const [wfAutoForward, setWfAutoForward] = useState(true);
  const [wfAllowScoping, setWfAllowScoping] = useState(true);
  const [wfRequireNotes, setWfRequireNotes] = useState(true);

  // --- Admin Billing Settings State ---
  const [billingPrefix, setBillingPrefix] = useState('ZNT-2026-');
  const [billingTaxRate, setBillingTaxRate] = useState('18');
  const [billingCurrency, setBillingCurrency] = useState('INR (₹)');
  const [billingDueDays, setBillingDueDays] = useState('15');
  const [gatewayUPI, setGatewayUPI] = useState(true);
  const [gatewayBank, setGatewayBank] = useState(true);

  // --- Admin System Settings State ---
  const [sysPlatformName, setSysPlatformName] = useState('ZENTRIX Freelancer Operating System');
  const [sysTimezone, setSysTimezone] = useState('(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi');
  const [sysMaintenanceMode, setSysMaintenanceMode] = useState(false);
  const [sysSupportEmail, setSysSupportEmail] = useState('support@zentrix.com');

  // --- Save Handlers ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Security password changed successfully!', 'success');
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: `usr_${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      contactNumber: newMemberPhone,
      aadhaarNumber: newMemberAadhaar || '8899-1122-3344',
      role: newMemberTeam,
      team: newMemberTeam,
      avatar: newMemberPhoto,
      status: 'active',
      performanceScore: 90
    };
    setTeamList([...teamList, created]);
    setShowAddMemberModal(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setNewMemberAadhaar('');
    showToast(`New team member ${created.name} added to ${created.role}!`, 'success');
  };

  const handleToggleUserStatus = (userId: string) => {
    setTeamList(teamList.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    showToast('User status updated', 'success');
  };

  const handleRemoveMember = (userId: string) => {
    setTeamList(teamList.filter(u => u.id !== userId));
    showToast('Member removed from team roster', 'info');
  };

  const handleSaveCommissionRule = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `rule_${Date.now()}`,
      name: ruleName || `${ruleRole} Commission Rule`,
      role: ruleRole,
      type: ruleType,
      value: Number(ruleValue),
      enabled: ruleEnabled
    };
    setCommissionRulesList([...commissionRulesList, created]);
    setRuleName('');
    setRuleValue('100');
    showToast('New commission rule saved successfully!', 'success');
  };

  // --- Role Specific Tab Configurations ---
  const isAdmin = role === 'ADMIN';
  const isTeamA = role === 'TEAM_A';
  const isTeamB = role === 'TEAM_B';
  const isTeamC = role === 'TEAM_C';

  const adminTabs = [
    { id: 'profile', label: '1. Profile', icon: UserIcon },
    { id: 'team', label: '2. Team Management', icon: Users },
    { id: 'permissions', label: '3. Permissions', icon: ShieldCheck },
    { id: 'commission', label: '4. Commission Rules', icon: Award },
    { id: 'workflow', label: '5. Workflow Settings', icon: GitMerge },
    { id: 'billing', label: '6. Billing Settings', icon: Receipt },
    { id: 'notifications', label: '7. Notifications', icon: Bell },
    { id: 'security', label: '8. Security', icon: Lock },
    { id: 'audit', label: '9. Activity Logs', icon: Activity },
    { id: 'system', label: '10. System Settings', icon: Sliders },
  ];

  const teamATabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'lead_prefs', label: 'Lead Preferences', icon: Sliders },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const teamBTabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'call_prefs', label: 'Calling Preferences', icon: PhoneCall },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const teamCTabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'proj_prefs', label: 'Project Preferences', icon: Briefcase },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const currentTabs = isAdmin ? adminTabs : isTeamA ? teamATabs : isTeamB ? teamBTabs : teamCTabs;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Header */}
      <div className="p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017] text-xs font-mono font-semibold uppercase">
            ZENTRIX — {role || 'USER'} SETTINGS PORTAL
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFF9F2] mt-1">Platform Settings & Preferences</h1>
          <p className="text-xs text-[#C9B8BE] font-mono mt-0.5">
            {isAdmin ? 'Full administrative control, team management, billing, rules & system logs.' : `Role-scoped settings for ${role}. Configure notifications, preferences & security.`}
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-xs font-mono hover:bg-red-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>LOG OUT</span>
          </button>
        )}
      </div>

      {/* Settings Navigation Sub-Bar */}
      <div className="p-2 rounded-2xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] overflow-x-auto flex gap-1.5 font-mono text-xs">
        {currentTabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#5A1833] text-[#D4A017] border border-[#D4A017]/50 shadow-[0_0_15px_rgba(212,160,23,0.3)]'
                  : 'text-[#C9B8BE] hover:text-[#FFF9F2] hover:bg-[#1F1117]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. PROFILE SECTION (AVAILABLE TO ALL 4 ROLES)             */}
      {/* ========================================================= */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <img src={profileAvatar} alt={profileName} className="w-16 h-16 rounded-full object-cover border-2 border-[#38E8FF] shadow-lg" />
              <div>
                <h2 className="text-xl font-extrabold text-white">{profileName}</h2>
                <div className="text-xs text-[#38E8FF] font-mono mt-0.5">{profileEmail} • <strong className="uppercase">{role}</strong></div>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#38E8FF] text-xs font-mono text-[#38E8FF] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#9BA7B7]">FULL NAME *</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF] disabled:opacity-60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9BA7B7]">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  disabled={!isEditingProfile}
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF] disabled:opacity-60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9BA7B7]">PHONE NUMBER *</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF] disabled:opacity-60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9BA7B7]">AADHAAR NUMBER *</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profileAadhaar}
                  onChange={(e) => setProfileAadhaar(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF] disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#9BA7B7]">PROFILE PHOTO URL</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                value={profileAvatar}
                onChange={(e) => setProfileAvatar(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF] disabled:opacity-60"
              />
            </div>

            {isEditingProfile && (
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#38E8FF] text-black font-bold flex items-center gap-2 hover:bg-[#22d6ed] transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TEAM MANAGEMENT SECTION (ADMIN ONLY)                    */}
      {/* ========================================================= */}
      {activeTab === 'team' && isAdmin && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <Users className="w-4 h-4 text-[#38E8FF]" />
                <span>Team Management ({teamList.length} Members)</span>
              </h2>
              <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">View, add, edit, or reassign members across Team A, B, and C.</p>
            </div>

            <button
              onClick={() => setShowAddMemberModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#C7FF3D] text-black font-extrabold text-xs font-mono hover:bg-[#b5f027] transition-all shadow-[0_0_20px_rgba(199,255,61,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> + Add Member
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[#9BA7B7] uppercase tracking-wider bg-[#111722]">
                  <th className="p-3">Member</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Assigned Team</th>
                  <th className="p-3">Aadhaar No.</th>
                  <th className="p-3">Contact No.</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {teamList.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
                      <span className="font-bold text-white">{u.name}</span>
                    </td>
                    <td className="p-3 text-[#9BA7B7]">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.role === 'TEAM_A' ? 'bg-[#C7FF3D]/10 text-[#C7FF3D] border-[#C7FF3D]/30' :
                        u.role === 'TEAM_B' ? 'bg-[#38E8FF]/10 text-[#38E8FF] border-[#38E8FF]/30' :
                        u.role === 'TEAM_C' ? 'bg-[#9B7CFF]/10 text-[#9B7CFF] border-[#9B7CFF]/30' :
                        'bg-white/10 text-white border-white/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-[#64748B]">{u.aadhaarNumber || '8899-2233-4455'}</td>
                    <td className="p-3 text-[#9BA7B7]">{u.contactNumber || '+91 98765 43210'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {u.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRemoveMember(u.id)}
                        className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors ml-auto flex items-center justify-center"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. USER PERMISSIONS MATRIX (ADMIN ONLY)                   */}
      {/* ========================================================= */}
      {activeTab === 'permissions' && isAdmin && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#38E8FF]" />
              <span>Role-Based Access Control & Permissions</span>
            </h2>
            <p className="text-xs text-[#9BA7B7] mt-0.5">Explicit access boundary matrix for Admin, Team A, Team B, and Team C.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[#9BA7B7] uppercase bg-[#111722]">
                  <th className="p-3">Module / Capability</th>
                  <th className="p-3 text-center text-[#C7FF3D]">ADMIN</th>
                  <th className="p-3 text-center text-[#C7FF3D]">TEAM A (Lead Gen)</th>
                  <th className="p-3 text-center text-[#38E8FF]">TEAM B (Outreach)</th>
                  <th className="p-3 text-center text-[#9B7CFF]">TEAM C (Execution)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                <tr>
                  <td className="p-3 font-bold">1. Lead Generation & Prospecting</td>
                  <td className="p-3 text-center text-emerald-400">Full Access ✓</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">Primary Owner ✓</td>
                  <td className="p-3 text-center text-gray-500">Read Only</td>
                  <td className="p-3 text-center text-gray-500">No Access</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">2. Calling, Timer & Follow-ups</td>
                  <td className="p-3 text-center text-emerald-400">Full Access ✓</td>
                  <td className="p-3 text-center text-gray-500">No Access</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">Primary Owner ✓</td>
                  <td className="p-3 text-center text-gray-500">No Access</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">3. Client Requirements & Payment Confirmation</td>
                  <td className="p-3 text-center text-emerald-400">Full Access ✓</td>
                  <td className="p-3 text-center text-gray-500">No Access</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">Lock Specs & Payment ✓</td>
                  <td className="p-3 text-center text-gray-500">Read Specs Only</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">4. Project Management & Delivery</td>
                  <td className="p-3 text-center text-emerald-400">Full Access ✓</td>
                  <td className="p-3 text-center text-gray-500">No Access</td>
                  <td className="p-3 text-center text-gray-500">No Access</td>
                  <td className="p-3 text-center text-purple-400 font-bold">Primary Owner ✓</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">5. Team Management & Adding Members</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">Exclusive Admin ✓</td>
                  <td className="p-3 text-center text-red-400">No Access ✕</td>
                  <td className="p-3 text-center text-red-400">No Access ✕</td>
                  <td className="p-3 text-center text-red-400">No Access ✕</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">6. Commission Rules & Billing</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">Exclusive Admin ✓</td>
                  <td className="p-3 text-center text-red-400">No Access ✕</td>
                  <td className="p-3 text-center text-red-400">No Access ✕</td>
                  <td className="p-3 text-center text-red-400">No Access ✕</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. COMMISSION RULES (ADMIN ONLY)                          */}
      {/* ========================================================= */}
      {activeTab === 'commission' && isAdmin && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C7FF3D]" />
              <span>Commission Rules & Payout Structure</span>
            </h2>
            <p className="text-xs text-[#9BA7B7] mt-0.5">Configure fixed amount or percentage payouts for Team A, B, and C.</p>
          </div>

          <form onSubmit={handleSaveCommissionRule} className="p-4 rounded-xl bg-[#111722] border border-white/10 space-y-4">
            <div className="text-sm font-bold text-white">Create New Commission Rule</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#9BA7B7]">RULE NAME</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Lead Submission Payout"
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9BA7B7]">TARGET TEAM / ROLE</label>
                <select
                  value={ruleRole}
                  onChange={(e) => setRuleRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                >
                  <option value="TEAM_A">Team A (Lead Generation)</option>
                  <option value="TEAM_B">Team B (Outreach)</option>
                  <option value="TEAM_C">Team C (Execution)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#9BA7B7]">COMMISSION TYPE</label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                >
                  <option value="fixed">Fixed Amount (₹ INR)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#9BA7B7]">VALUE ({ruleType === 'fixed' ? '₹' : '%'})</label>
                <input
                  type="number"
                  required
                  value={ruleValue}
                  onChange={(e) => setRuleValue(e.target.value)}
                  placeholder="100"
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-[#9BA7B7] cursor-pointer">
                <input
                  type="checkbox"
                  checked={ruleEnabled}
                  onChange={(e) => setRuleEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#C7FF3D]"
                />
                <span>Enable Rule Immediately</span>
              </label>

              <button type="submit" className="px-5 py-2 rounded-xl bg-[#C7FF3D] text-black font-bold">
                Save Commission Rule
              </button>
            </div>
          </form>

          {/* Existing Rules Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white">Active Commission Rules</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[#9BA7B7] uppercase bg-[#111722]">
                    <th className="p-3">Rule Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Payout Value</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white">
                  {commissionRulesList.map(r => (
                    <tr key={r.id} className="hover:bg-white/5">
                      <td className="p-3 font-bold">{r.name}</td>
                      <td className="p-3 text-[#38E8FF]">{r.role}</td>
                      <td className="p-3 text-[#9BA7B7] capitalize">{r.type}</td>
                      <td className="p-3 text-[#C7FF3D] font-bold">{r.type === 'fixed' ? `₹${r.value}` : `${r.value}%`}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">Active ✓</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. WORKFLOW SETTINGS (ADMIN ONLY)                          */}
      {/* ========================================================= */}
      {activeTab === 'workflow' && isAdmin && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-[#38E8FF]" />
              <span>Core Zentrix Application Workflow Pipeline</span>
            </h2>
            <p className="text-xs text-[#9BA7B7] mt-0.5">Configured Pipeline: Team A → Team B → Team C → Project Completion.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111722] border border-[#38E8FF]/30 space-y-3">
            <div className="text-xs font-bold text-[#38E8FF] uppercase">CURRENT WORKFLOW PIPELINE DIAGRAM</div>
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-[#0D1118] text-center font-bold">
              <div className="px-3 py-1.5 rounded bg-[#C7FF3D]/10 text-[#C7FF3D] border border-[#C7FF3D]/30">1. TEAM A (Lead Gen)</div>
              <span className="text-[#64748B]">➔</span>
              <div className="px-3 py-1.5 rounded bg-[#38E8FF]/10 text-[#38E8FF] border border-[#38E8FF]/30">2. TEAM B (Outreach & Payment)</div>
              <span className="text-[#64748B]">➔</span>
              <div className="px-3 py-1.5 rounded bg-[#9B7CFF]/10 text-[#9B7CFF] border border-[#9B7CFF]/30">3. TEAM C (Execution)</div>
              <span className="text-[#64748B]">➔</span>
              <div className="px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">4. COMPLETION</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-white">Stage Execution Controls</div>

            <div className="p-3.5 rounded-xl bg-[#111722] flex items-center justify-between border border-white/5">
              <div>
                <div className="font-bold text-white">Require Payment Confirmation Before Team C Kickoff</div>
                <div className="text-[11px] text-[#9BA7B7]">Team B must record deposit badge before project initiates in Team C.</div>
              </div>
              <input type="checkbox" checked={wfRequirePayment} onChange={(e) => setWfRequirePayment(e.target.checked)} className="w-5 h-5 accent-[#38E8FF]" />
            </div>

            <div className="p-3.5 rounded-xl bg-[#111722] flex items-center justify-between border border-white/5">
              <div>
                <div className="font-bold text-white">Auto-Forward New Team A Leads to Team B Calling Queue</div>
                <div className="text-[11px] text-[#9BA7B7]">Automatically dispatch new leads upon creation.</div>
              </div>
              <input type="checkbox" checked={wfAutoForward} onChange={(e) => setWfAutoForward(e.target.checked)} className="w-5 h-5 accent-[#38E8FF]" />
            </div>

            <div className="p-3.5 rounded-xl bg-[#111722] flex items-center justify-between border border-white/5">
              <div>
                <div className="font-bold text-white">Require Technical Progress Notes on Completion</div>
                <div className="text-[11px] text-[#9BA7B7]">Team C must enter technical summary note before marking 100%.</div>
              </div>
              <input type="checkbox" checked={wfRequireNotes} onChange={(e) => setWfRequireNotes(e.target.checked)} className="w-5 h-5 accent-[#38E8FF]" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. BILLING SETTINGS (ADMIN ONLY)                          */}
      {/* ========================================================= */}
      {activeTab === 'billing' && isAdmin && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#54E38E]" />
              <span>Billing Settings & Payment Preferences</span>
            </h2>
            <p className="text-xs text-[#9BA7B7] mt-0.5">Configure invoice prefixes, currency format, and payment gateway options.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">INVOICE PREFIX</label>
              <input type="text" value={billingPrefix} onChange={(e) => setBillingPrefix(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#54E38E]" />
            </div>
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">DEFAULT CURRENCY</label>
              <select value={billingCurrency} onChange={(e) => setBillingCurrency(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#54E38E]">
                <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
                <option value="USD ($)">USD ($ - US Dollar)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-white">Payment Method Preferences</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#111722] flex items-center justify-between border border-white/5">
                <span className="text-white font-bold">UPI / PhonePe / GPay</span>
                <input type="checkbox" checked={gatewayUPI} onChange={(e) => setGatewayUPI(e.target.checked)} className="w-4 h-4 accent-[#54E38E]" />
              </div>
              <div className="p-3.5 rounded-xl bg-[#111722] flex items-center justify-between border border-white/5">
                <span className="text-white font-bold">NEFT / Bank Transfer</span>
                <input type="checkbox" checked={gatewayBank} onChange={(e) => setGatewayBank(e.target.checked)} className="w-4 h-4 accent-[#54E38E]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. NOTIFICATIONS SECTION (TAILORED PER ROLE)               */}
      {/* ========================================================= */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#38E8FF]" />
              <span>Notification Preferences ({role})</span>
            </h2>
            <p className="text-xs text-[#9BA7B7] mt-0.5">Toggle alert channels and events relevant to your workflow.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#111722] flex items-center justify-between border border-white/5">
              <div>
                <div className="font-bold text-white">{isTeamA ? 'New Lead Submission Alerts' : isTeamB ? 'Incoming Lead Alerts from Team A' : isTeamC ? 'Project Assignment Alerts' : 'Lead Creation Alerts'}</div>
                <div className="text-[11px] text-[#9BA7B7]">Receive instant updates when new items enter your queue.</div>
              </div>
              <input type="checkbox" checked={notifLead} onChange={(e) => setNotifLead(e.target.checked)} className="w-5 h-5 accent-[#38E8FF]" />
            </div>

            <div className="p-3.5 rounded-xl bg-[#111722] flex items-center justify-between border border-white/5">
              <div>
                <div className="font-bold text-white">{isTeamB ? 'Call Reminder & Follow-up Alerts' : isTeamC ? 'Requirement & Spec Updates' : 'Follow-up Notifications'}</div>
                <div className="text-[11px] text-[#9BA7B7]">Reminders for upcoming schedules and requirement changes.</div>
              </div>
              <input type="checkbox" checked={notifFollowup} onChange={(e) => setNotifFollowup(e.target.checked)} className="w-5 h-5 accent-[#38E8FF]" />
            </div>

            <div className="p-3.5 rounded-xl bg-[#111722] flex items-center justify-between border border-white/5">
              <div>
                <div className="font-bold text-white">{isTeamC ? 'Milestone & Deadline Reminders' : 'Payment Deposit Confirmations'}</div>
                <div className="text-[11px] text-[#9BA7B7]">Alerts when client payment badges or delivery milestones trigger.</div>
              </div>
              <input type="checkbox" checked={notifPayment} onChange={(e) => setNotifPayment(e.target.checked)} className="w-5 h-5 accent-[#38E8FF]" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ROLE PREFERENCES (TEAM A / TEAM B / TEAM C)               */}
      {/* ========================================================= */}
      {activeTab === 'lead_prefs' && isTeamA && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 font-mono text-xs">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#C7FF3D]" />
            <span>Team A Member Preferences</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">DEFAULT LOCATION / AREA</label>
              <input type="text" value={teamADefaultArea} onChange={(e) => setTeamADefaultArea(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">DEFAULT VIEW FILTER</label>
              <select value={teamADefaultFilter} onChange={(e) => setTeamADefaultFilter(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white">
                <option value="All">All Submitted Leads</option>
                <option value="New">New Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'call_prefs' && isTeamB && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 font-mono text-xs">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#38E8FF]" />
            <span>Team B Calling & Outreach Preferences</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">DEFAULT CALL TIMER MODE</label>
              <input type="text" value={teamBDefaultTimer} onChange={(e) => setTeamBDefaultTimer(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">FOLLOW-UP REMINDER LEAD TIME</label>
              <select value={teamBReminderLeadTime} onChange={(e) => setTeamBReminderLeadTime(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white">
                <option value="15 Minutes">15 Minutes Before</option>
                <option value="30 Minutes">30 Minutes Before</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'proj_prefs' && isTeamC && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 font-mono text-xs">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#9B7CFF]" />
            <span>Team C Project Execution Preferences</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">DEFAULT CATEGORY FILTER</label>
              <select value={teamCDefaultCategory} onChange={(e) => setTeamCDefaultCategory(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white">
                <option value="ALL">All Categories</option>
                <option value="Website Development">Website Development</option>
                <option value="E-commerce">E-commerce</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">PROGRESS TRACKING MODE</label>
              <input type="text" value={teamCProgressTrackingMode} onChange={(e) => setTeamCProgressTrackingMode(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. SECURITY SECTION (AVAILABLE TO ALL 4 ROLES)             */}
      {/* ========================================================= */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#38E8FF]" />
              <span>Security & Login Credentials</span>
            </h2>
            <p className="text-xs text-[#9BA7B7] mt-0.5">Change password and manage active session security.</p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">CURRENT PASSWORD *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#9BA7B7]">NEW PASSWORD *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#9BA7B7]">CONFIRM NEW PASSWORD *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF]"
              />
            </div>

            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#38E8FF] text-black font-bold">
              Update Password
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="text-xs font-bold text-white">Login Session Control</div>
            <button
              onClick={() => {
                showToast('Logged out from all devices successfully', 'info');
                logout();
              }}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 font-bold hover:bg-red-500/30"
            >
              Logout From All Active Devices
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. ACTIVITY LOGS AUDIT TRAIL (ADMIN ONLY)                 */}
      {/* ========================================================= */}
      {activeTab === 'audit' && isAdmin && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#38E8FF]" />
              <span>System Activity Audit Logs</span>
            </h2>
            <p className="text-xs text-[#9BA7B7] mt-0.5">Chronological record of Admin and Team actions across the platform.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[#9BA7B7] uppercase bg-[#111722]">
                  <th className="p-3">User</th>
                  <th className="p-3">Action Description</th>
                  <th className="p-3">Date / Time</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {mockAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-[#38E8FF]">{log.user}</td>
                    <td className="p-3">{log.action}</td>
                    <td className="p-3 text-[#9BA7B7]">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">Success ✓</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. SYSTEM SETTINGS (ADMIN ONLY)                          */}
      {/* ========================================================= */}
      {activeTab === 'system' && isAdmin && (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-6 font-mono text-xs">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#38E8FF]" />
              <span>Zentrix General System Settings</span>
            </h2>
            <p className="text-xs text-[#9BA7B7] mt-0.5">Platform configurations, timezone, maintenance mode, and support email.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">PLATFORM NAME</label>
              <input type="text" value={sysPlatformName} onChange={(e) => setSysPlatformName(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF]" />
            </div>
            <div className="space-y-1">
              <label className="text-[#9BA7B7]">SUPPORT EMAIL</label>
              <input type="email" value={sysSupportEmail} onChange={(e) => setSysSupportEmail(e.target.value)} className="w-full p-3 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#38E8FF]" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111722] flex items-center justify-between border border-white/5">
            <div>
              <div className="font-bold text-white">Enable Platform Maintenance Mode</div>
              <div className="text-[11px] text-[#9BA7B7]">Temporarily restrict access for non-admin team members.</div>
            </div>
            <input type="checkbox" checked={sysMaintenanceMode} onChange={(e) => setSysMaintenanceMode(e.target.checked)} className="w-5 h-5 accent-amber-500" />
          </div>

          <button onClick={() => showToast('System settings saved successfully!', 'success')} className="px-6 py-2.5 rounded-xl bg-[#38E8FF] text-black font-bold">
            Save System Settings
          </button>
        </div>
      )}

      {/* ADD MEMBER MODAL (FOR ADMIN TEAM MANAGEMENT) */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#111722] border border-white/20 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C7FF3D]" />
                <span>Add New Member to Zentrix</span>
              </h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-[#64748B] hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[#9BA7B7]">FULL NAME *</label>
                <input type="text" required value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} placeholder="e.g. Ramesh Kumar" className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]" />
              </div>

              <div className="space-y-1">
                <label className="text-[#9BA7B7]">EMAIL ADDRESS *</label>
                <input type="email" required value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} placeholder="ramesh@zentrix.com" className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9BA7B7]">CONTACT NUMBER *</label>
                  <input type="text" required value={newMemberPhone} onChange={(e) => setNewMemberPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[#9BA7B7]">AADHAAR NUMBER *</label>
                  <input type="text" required value={newMemberAadhaar} onChange={(e) => setNewMemberAadhaar(e.target.value)} placeholder="8899-1122-3344" className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#9BA7B7]">TEAM / ROLE SELECTION *</label>
                <select value={newMemberTeam} onChange={(e) => setNewMemberTeam(e.target.value as UserRole)} className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]">
                  <option value="TEAM_A">Team A (Lead Generation)</option>
                  <option value="TEAM_B">Team B (Calling & Scoping)</option>
                  <option value="TEAM_C">Team C (Project Execution)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAddMemberModal(false)} className="px-4 py-2 rounded-xl bg-white/5 text-white">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#C7FF3D] text-black font-bold">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
