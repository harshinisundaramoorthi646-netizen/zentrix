import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { apiService } from '../../services/api';
import { Lead } from '../../types';
import { Plus, GitMerge, Award, AlertTriangle, CheckCircle2, Search, Building2, Phone, Mail } from 'lucide-react';

export const TeamADashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [search, setSearch] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Bengaluru, KA');
  const [source, setSource] = useState('LinkedIn Direct');
  const [requirement, setRequirement] = useState('');
  const [budget, setBudget] = useState('150000');
  const [notes, setNotes] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    apiService.getLeads().then(setLeads).catch(console.error);
  };

  const handleCompanyChange = (val: string) => {
    setCompany(val);
    const existing = leads.find(l => l.company.toLowerCase() === val.trim().toLowerCase());
    if (existing) {
      setDuplicateWarning(`Potential duplicate detected! Lead ${existing.id} already exists for "${existing.company}".`);
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiService.createLead(
        {
          name,
          company,
          phone,
          email,
          location,
          source,
          requirement,
          estimatedBudget: Number(budget),
          notes
        },
        user?.name || 'Arun Kumar'
      );

      showToast(`Lead ${created.id} submitted successfully! ₹100 commission credit added.`, 'success');
      setShowSubmitModal(false);
      resetForm();
      loadLeads();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit lead', 'error');
    }
  };

  const resetForm = () => {
    setName('');
    setCompany('');
    setPhone('');
    setEmail('');
    setRequirement('');
    setBudget('150000');
    setNotes('');
    setDuplicateWarning(null);
  };

  const myLeads = leads.filter(l => l.assignedTeamA === user?.name || true);
  const earnedCommission = myLeads.length * 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0D1118] via-[#111722] to-[#161D29] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38E8FF]/10 border border-[#38E8FF]/30 text-[#38E8FF] text-xs font-mono font-semibold">
            TEAM A — LEAD GENERATION
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Lead Prospecting Portal</h1>
          <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
            Submit new client leads, verify non-duplicate status, and track your ₹100/lead commission balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#080A0F] border border-white/10 text-right">
            <div className="text-[10px] font-mono text-[#9BA7B7]">EARNED COMMISSION</div>
            <div className="text-lg font-extrabold font-mono text-[#C7FF3D]">
              ₹{earnedCommission.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-3 rounded-xl bg-[#C7FF3D] text-black font-bold text-sm hover:bg-[#b5f027] transition-all shadow-[0_0_20px_rgba(199,255,61,0.3)] flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>SUBMIT NEW LEAD</span>
          </button>
        </div>
      </div>

      {/* Leads List Directory */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-[#38E8FF]" />
            <span>My Submitted Leads ({myLeads.length})</span>
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lead or company..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#111722] border border-white/10 text-xs text-white placeholder-[#64748B] focus:border-[#38E8FF] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myLeads
            .filter(l => l.company.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase()))
            .map(l => (
              <div key={l.id} className="p-4 rounded-2xl bg-[#111722]/90 backdrop-blur-md border border-white/10 hover:border-yellow-400/60 hover:bg-white/10 hover:backdrop-blur-xl hover:shadow-[0_8px_30px_rgba(255,215,0,0.25)] transition-all duration-300 transform hover:-translate-y-1 space-y-3 group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#38E8FF] group-hover:text-yellow-300 transition-colors">{l.id}</span>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                    l.status === 'Converted' ? 'bg-[#54E38E]/20 text-[#54E38E] border-[#54E38E]/40' : 'bg-white/5 text-[#9BA7B7] border-white/10'
                  }`}>
                    {l.status}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-bold text-white">{l.company}</div>
                  <div className="text-xs text-[#9BA7B7]">{l.name} • {l.location}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0D1118] text-xs text-[#9BA7B7] line-clamp-2">
                  {l.requirement}
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-white/5">
                  <span className="text-[#64748B]">Est. Budget:</span>
                  <span className="text-[#C7FF3D] font-bold">₹{l.estimatedBudget.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Submit Lead Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl bg-[#111722] border border-white/20 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C7FF3D]" />
                <span>Submit New Freelance Lead</span>
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-[#64748B] hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-4 text-xs">
              
              {duplicateWarning && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{duplicateWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9BA7B7] font-mono">COMPANY NAME</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    placeholder="e.g. Vertex Digital Labs"
                    className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#9BA7B7] font-mono">PRIMARY CONTACT PERSON</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan Verma"
                    className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9BA7B7] font-mono">PHONE NUMBER</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#9BA7B7] font-mono">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rohan@vertex.in"
                    className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9BA7B7] font-mono">ESTIMATED BUDGET (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="150000"
                    className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#9BA7B7] font-mono">LEAD SOURCE</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                  >
                    <option value="LinkedIn Direct">LinkedIn Direct</option>
                    <option value="Upwork Agency">Upwork Agency</option>
                    <option value="Website Form">Website Form</option>
                    <option value="Direct Referral">Direct Referral</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#9BA7B7] font-mono">PROJECT REQUIREMENT</label>
                <textarea
                  rows={2}
                  required
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Describe technical stack and client requirements..."
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C7FF3D] text-black font-bold hover:bg-[#b5f027]"
                >
                  Generate Lead & Award Commission
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
