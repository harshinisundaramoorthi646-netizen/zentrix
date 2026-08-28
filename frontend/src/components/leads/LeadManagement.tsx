import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Lead } from '../../types';
import { LeadTimeline } from './LeadTimeline';
import { Search, Grid, List, Eye, Trash2, Plus, Loader2 } from 'lucide-react';

export const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Lead Form State
  const [newCompany, setNewCompany] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newBudget, setNewBudget] = useState(100000);
  const [creating, setCreating] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await apiService.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string, company: string) => {
    if (!window.confirm(`Are you sure you want to delete lead for ${company}?`)) return;
    try {
      await apiService.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newName) return;
    setCreating(true);
    try {
      const created = await apiService.createLead(
        {
          company: newCompany,
          name: newName,
          phone: newPhone,
          email: newEmail,
          requirement: newRequirement,
          estimatedBudget: Number(newBudget) || 100000,
        },
        'Admin'
      );
      setLeads(prev => [created, ...prev]);
      setShowCreateModal(false);
      setNewCompany('');
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewRequirement('');
      setNewBudget(100000);
    } catch (err) {
      console.error('Failed to create lead:', err);
    } finally {
      setCreating(false);
    }
  };

  const filteredLeads = leads.filter(l => {
    const q = (search || '').toLowerCase();
    const matchesSearch = (l?.company || '').toLowerCase().includes(q) ||
                          (l?.id || '').toLowerCase().includes(q) ||
                          (l?.name || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || l?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Bar Controls */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Master Leads Directory</h1>
          <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
            Search, filter, and trace the full journey of every freelance lead across Team A, B, & C.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#C7FF3D] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#b5eb2b] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>

          {/* Search bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, client..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111722] border border-white/10 text-xs text-white placeholder-[#64748B] outline-none focus:border-[#C7FF3D]"
            />
          </div>

          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-xl bg-[#111722] border border-white/10 text-xs text-white outline-none font-mono"
          >
            <option value="ALL">All Stages</option>
            <option value="Submitted">Submitted (Team A)</option>
            <option value="Calling">Calling (Team B)</option>
            <option value="Follow-up">Follow-up (Team B)</option>
            <option value="Qualified">Qualified (Team B)</option>
            <option value="Converted">Converted</option>
          </select>

          {/* View switcher */}
          <div className="flex bg-[#111722] rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg ${viewMode === 'card' ? 'bg-[#C7FF3D] text-black font-bold' : 'text-[#9BA7B7]'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-[#C7FF3D] text-black font-bold' : 'text-[#9BA7B7]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-[#0D1118]/80 rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 text-[#C7FF3D] animate-spin" />
          <span className="ml-3 text-sm text-[#9BA7B7] font-mono">Fetching live MongoDB leads data...</span>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map(l => (
            <div
              key={l.id}
              className="p-5 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#C7FF3D]">{l.id}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    l.status === 'Converted' ? 'bg-[#54E38E]/20 text-[#54E38E] border-[#54E38E]/40' :
                    l.status === 'Qualified' ? 'bg-[#FF7A8A]/20 text-[#FF7A8A] border-[#FF7A8A]/40' :
                    'bg-white/5 text-[#9BA7B7] border-white/10'
                  }`}>
                    {l.status}
                  </span>
                  <button
                    onClick={() => handleDelete(l.id, l.company)}
                    className="p-1 text-[#64748B] hover:text-red-400 transition-colors"
                    title="Delete lead"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="text-base font-bold text-white group-hover:text-[#C7FF3D] transition-colors">{l.company}</div>
                <div className="text-xs text-[#9BA7B7]">{l.name} • {l.location}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#111722] text-xs text-[#9BA7B7] line-clamp-2">
                {l.requirement}
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
                <div>
                  <span className="text-[#64748B]">Budget: </span>
                  <span className="text-white font-bold">₹{l.estimatedBudget.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => setSelectedLead(l)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#C7FF3D] text-xs text-white hover:text-[#C7FF3D] transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[#64748B]">
                <th className="py-3 px-3">LEAD ID</th>
                <th className="py-3 px-3">COMPANY & CONTACT</th>
                <th className="py-3 px-3">SOURCE</th>
                <th className="py-3 px-3">BUDGET</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(l => (
                <tr key={l.id} className="border-b border-white/5 text-white hover:bg-white/5">
                  <td className="py-3.5 px-3 text-[#C7FF3D] font-bold">{l.id}</td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold font-sans text-sm">{l.company}</div>
                    <div className="text-[11px] text-[#9BA7B7]">{l.name}</div>
                  </td>
                  <td className="py-3.5 px-3 text-[#9BA7B7]">{l.source}</td>
                  <td className="py-3.5 px-3 font-bold text-white">₹{l.estimatedBudget.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 font-bold text-[#38E8FF]">{l.status}</td>
                  <td className="py-3.5 px-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLead(l)}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#C7FF3D]"
                    >
                      View Journey
                    </button>
                    <button
                      onClick={() => handleDelete(l.id, l.company)}
                      className="p-1 text-[#64748B] hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Lead Journey Timeline Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#111722] border border-white/20 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-mono font-bold text-[#C7FF3D]">{selectedLead.id}</div>
                <h3 className="text-xl font-bold text-white">{selectedLead.company} Journey History</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-[#64748B] hover:text-white font-bold text-lg">✕</button>
            </div>

            <LeadTimeline lead={selectedLead} />
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleCreateLead} className="w-full max-w-lg bg-[#111722] border border-white/20 p-6 rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Prospect Lead</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-[#64748B] hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#9BA7B7] mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div>
                <label className="block text-[#9BA7B7] mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Shah"
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9BA7B7] mb-1">Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div>
                  <label className="block text-[#9BA7B7] mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9BA7B7] mb-1">Project Requirement</label>
                <textarea
                  value={newRequirement}
                  onChange={e => setNewRequirement(e.target.value)}
                  placeholder="Describe custom development requirement..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div>
                <label className="block text-[#9BA7B7] mb-1">Estimated Budget (₹)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={e => setNewBudget(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#0D1118] border border-white/10 text-white outline-none focus:border-[#C7FF3D]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-[#9BA7B7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 rounded-xl bg-[#C7FF3D] text-black font-bold text-xs flex items-center gap-2 hover:bg-[#b5eb2b]"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Lead'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
