import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { apiService } from '../../services/api';
import { Lead } from '../../types';
import { Plus, Award, Search, Building2, Send, UserPlus } from 'lucide-react';

export const TeamADashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [search, setSearch] = useState('');

  // Add Lead Form Fields
  const [leadName, setLeadName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactOrEmail, setContactOrEmail] = useState('');
  const [area, setArea] = useState('Chennai');
  const [requirementText, setRequirementText] = useState('Website Development');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    apiService.getLeads()
      .then(data => {
        setLeads(data || []);
      })
      .catch(console.error);
  };

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isPhone = /^[0-9+\s-]{8,}$/.test(contactOrEmail.trim());
      await apiService.createLead(
        {
          name: leadName,
          company: companyName,
          phone: isPhone ? contactOrEmail : '+91 98765 43210',
          email: !isPhone ? contactOrEmail : `${leadName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          location: area,
          area: area,
          requirement: requirementText || 'Website Development',
          estimatedBudget: 150000,
          source: 'Direct Prospecting'
        },
        user?.name || 'Priya'
      );

      setShowSubmitModal(false);
      resetForm();
      loadLeads();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit lead', 'error');
    }
  };

  const resetForm = () => {
    setLeadName('');
    setCompanyName('');
    setContactOrEmail('');
    setArea('Chennai');
    setRequirementText('Website Development');
  };

  // Individual Team A Member Performance Stats
  const teamAPerformance = [
    { member: 'Arun', leadsGenerated: 35 },
    { member: 'Priya', leadsGenerated: 28 },
    { member: 'Karthik', leadsGenerated: 42 },
  ];
  const totalTeamALeadCount = teamAPerformance.reduce((acc, curr) => acc + curr.leadsGenerated, 0) + leads.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Team A Header Banner */}
      <div className="p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017] text-xs font-mono font-bold uppercase">
            🚀 TEAM A WORKBENCH
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFF9F2]">Prospect Pipeline & Lead Submissions</h1>
          <p className="text-xs text-[#C9B8BE] font-mono">
            Submit new client leads and track qualification metrics per verified prospect.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-5 py-3 rounded-xl bg-[#D4A017] text-[#1F1117] font-extrabold text-xs font-mono tracking-wider uppercase hover:bg-[#B8860B] transition-all shadow-[0_0_20px_rgba(212,160,23,0.35)] flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ ADD NEW LEAD PROSPECT</span>
        </button>
      </div>

      {/* TEAM A PERFORMANCE & PROSPECTOR LEADERBOARD */}
      <div className="p-6 rounded-2xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] space-y-4 hover:border-[#D4A017]/40 transition-all">
        <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
          <h2 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2 font-mono">
            <Award className="w-4 h-4 text-[#D4A017]" />
            <span>TEAM A PROSPECTOR PERFORMANCE</span>
          </h2>
          <span className="text-xs font-mono text-[#D4A017] font-bold">
            Total Leads Generated: {totalTeamALeadCount}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          {teamAPerformance.map((p, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#1F1117] border border-[#3A1F2B] flex items-center justify-between hover:border-[#D4A017]/30 transition-all">
              <div>
                <div className="text-[#C9B8BE]">{p.member} (Team A)</div>
                <div className="text-lg font-bold text-[#FFF9F2] mt-0.5">{p.leadsGenerated} Leads</div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-[#D4A017]/10 text-[#D4A017] font-bold border border-[#D4A017]/30 text-[10px]">
                ₹{(p.leadsGenerated * 100).toLocaleString('en-IN')} Earned
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROSPECT LEADS SUBMITTED TABLE */}
      <div className="p-6 rounded-2xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3A1F2B] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#FFF9F2] font-mono">My Lead Submissions Roster</h2>
            <p className="text-xs text-[#C9B8BE] font-mono">List of client prospects submitted by Team A</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#C9B8BE]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Lead ID, name, area..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-xs text-[#FFF9F2] placeholder-[#C9B8BE] focus:border-[#D4A017] outline-none font-mono transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#3A1F2B] text-[#C9B8BE] uppercase tracking-wider bg-[#1F1117]">
                <th className="p-3">Lead ID</th>
                <th className="p-3">Lead Name</th>
                <th className="p-3">Company Name</th>
                <th className="p-3">Contact / Email</th>
                <th className="p-3">Area / Location</th>
                <th className="p-3">Generated By</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A1F2B] text-[#FFF9F2]">
              {leads
                .filter(l =>
                  (l.id || '').toLowerCase().includes(search.toLowerCase()) ||
                  (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
                  (l.company || '').toLowerCase().includes(search.toLowerCase()) ||
                  (l.location || '').toLowerCase().includes(search.toLowerCase()) ||
                  (l.area || '').toLowerCase().includes(search.toLowerCase())
                )
                .map(l => (
                  <tr key={l.id} className="hover-row hover:bg-[#5A1833]/40 transition-colors">
                    <td className="p-3 font-bold text-[#D4A017] font-mono">{l.id}</td>
                    <td className="p-3 font-bold text-[#FFF9F2]">{l.name}</td>
                    <td className="p-3 text-[#C9B8BE]">{l.company}</td>
                    <td className="p-3 text-[#C9B8BE] font-mono">{l.phone || l.email}</td>
                    <td className="p-3 text-[#FFF9F2]">{l.location || l.area || 'Chennai'}</td>
                    <td className="p-3 text-[#D4A017] font-bold font-mono">{l.assignedTeamA || 'Priya'}</td>
                    <td className="p-3 text-[#C9B8BE] font-mono">
                      {new Date(l.createdDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD LEAD MODAL FORM */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#2B1720] border border-[#3A1F2B] p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
              <h3 className="text-lg font-bold text-[#FFF9F2] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4A017]" />
                <span>Add New Lead (Team A)</span>
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-[#C9B8BE] hover:text-[#FFF9F2] font-bold">✕</button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#C9B8BE]">LEAD NAME *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. ABC / Rohan Verma"
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">COMPANY NAME *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. XYZ Solutions"
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">CONTACT NUMBER OR EMAIL ID *</label>
                <input
                  type="text"
                  required
                  value={contactOrEmail}
                  onChange={(e) => setContactOrEmail(e.target.value)}
                  placeholder="e.g. 9876543210 or contact@xyz.com"
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">AREA / LOCATION *</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Chennai, Bengaluru"
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">REQUIREMENT CATEGORY</label>
                  <select
                    value={requirementText}
                    onChange={(e) => setRequirementText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Advertisement / Ad Management">Advertisement / Ad Management</option>
                    <option value="Testing">Testing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1F1117] border border-[#D4A017]/30 text-[11px] text-[#D4A017]">
                💡 Lead ID will be auto-generated upon submission.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3A1F2B]">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1F1117] text-[#FFF9F2] hover:bg-[#3A1F2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4A017] text-[#1F1117] font-bold hover:bg-[#B8860B] cursor-pointer shadow-[0_0_15px_rgba(212,160,23,0.35)]"
                >
                  Generate Lead ID & Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
