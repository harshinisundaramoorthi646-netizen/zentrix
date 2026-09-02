import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { apiService } from '../../services/api';
import { Project, RequirementCategory } from '../../types';
import { Briefcase, CheckCircle2, Clock, Calendar, FileText, Upload, Sparkles, Award } from 'lucide-react';

export const TeamCDashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Milestone Update Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProgress, setNewProgress] = useState<number>(50);
  const [progressNotes, setProgressNotes] = useState<string>('');
  const [deliverableFile, setDeliverableFile] = useState<string>('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    apiService.getProjects()
      .then(data => setProjects(data || []))
      .catch(console.error);
  };

  const handleUpdateProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      let updatedMilestone = editingProject.milestones || 'In Progress';
      if (newProgress === 100) {
        updatedMilestone = 'Completed & Handed Over';
      } else if (newProgress >= 75) {
        updatedMilestone = 'QA Testing & UAT';
      } else if (newProgress >= 50) {
        updatedMilestone = 'Core Modules Developed';
      }

      await apiService.updateProjectProgress(
        editingProject.id,
        newProgress,
        updatedMilestone,
        {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          progress: newProgress,
          notes: progressNotes || `Progress updated to ${newProgress}%`,
          author: user?.name || 'Suresh K',
          deliverableLink: deliverableFile || undefined
        }
      );

      setEditingProject(null);
      setProgressNotes('');
      setDeliverableFile('');
      loadProjects();
    } catch (err) {
      showToast('Failed to update progress', 'error');
    }
  };

  const categories = ['ALL', 'Website Development', 'E-commerce', 'Advertisement / Ad Management', 'Testing'];

  const filteredProjects = projects.filter(p => {
    if (categoryFilter === 'ALL') return true;
    return (p.category || '').toLowerCase() === categoryFilter.toLowerCase();
  });

  // Individual Team C Performance Stats
  const teamCPerformance = [
    { member: 'Suresh K', assigned: 8, completed: 6, payout: '₹12,500' },
    { member: 'Nisha R', assigned: 6, completed: 5, payout: '₹9,800' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* Team C Header Banner */}
      <div className="p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017] text-xs font-mono font-bold uppercase">
            ⚡ TEAM C WORKBENCH
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFF9F2]">Project Execution & Deliverables Catalog</h1>
          <p className="text-xs text-[#C9B8BE] font-mono">
            Build applications across Web Development, E-Commerce, Ad Campaigns, and QA Testing. Update milestone progress % live.
          </p>
        </div>
      </div>

      {/* TEAM C INDIVIDUAL EXECUTION ROSTER */}
      <div className="p-6 rounded-2xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] hover:border-[#D4A017]/40 transition-all space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
          <h2 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2 font-mono">
            <Award className="w-4 h-4 text-[#D4A017]" />
            <span>TEAM C INDIVIDUAL EXECUTION METRICS</span>
          </h2>
          <span className="text-xs font-mono text-[#D4A017] font-bold">
            Total Projects Handled: {projects.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {teamCPerformance.map((p, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#1F1117] border border-[#3A1F2B] flex items-center justify-between hover:border-[#D4A017]/30 transition-all">
              <div>
                <div className="text-[#FFF9F2] font-bold">{p.member} (Team C)</div>
                <div className="text-[10px] text-[#C9B8BE] mt-0.5">
                  Assigned: <strong className="text-[#FFF9F2]">{p.assigned}</strong> | Completed: <strong className="text-[#E8C766]">{p.completed}</strong>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#D4A017] font-bold">{p.payout} Payout</div>
                <div className="text-[10px] text-[#C9B8BE]">5% Share</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#D4A017] text-[#1F1117] shadow-[0_0_15px_rgba(212,160,23,0.35)]'
                : 'bg-[#2B1720] text-[#C9B8BE] border border-[#3A1F2B] hover:text-[#FFF9F2] hover:border-[#D4A017]/40'
            }`}
          >
            {cat === 'ALL' ? 'All Deliverables' : cat}
          </button>
        ))}
      </div>

      {/* PROJECTS CATALOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(p => (
          <div
            key={p.id}
            className="group p-5 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] hover:border-[#D4A017] hover:shadow-[0_10px_30px_rgba(212,160,23,0.3)] transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              
              {/* Header */}
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-[#D4A017]">{p.id}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1F1117] text-[#E8C766] border border-[#D4A017]/30 font-bold">
                  {p.category || 'Website Development'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#FFF9F2] group-hover:text-[#D4A017] transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-[#C9B8BE] font-mono mt-0.5">Client: {p.clientName}</p>
              </div>

              {/* Requirements snippet */}
              <div className="p-3 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-xs font-mono space-y-1">
                <div className="text-[10px] text-[#C9B8BE] uppercase font-bold">TECHNICAL SCOPE:</div>
                <p className="text-[#FFF9F2] line-clamp-2">{p.clientRequirements?.detailedRequirement || 'Full stack web application development and responsive UI design.'}</p>
              </div>

              {/* Progress Bar & Milestone */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#C9B8BE] text-[11px]">Milestone Progress:</span>
                  <span className="font-bold text-[#D4A017]">{p.progress}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#1F1117] border border-[#3A1F2B] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4A017] to-[#E8C766] transition-all duration-500 rounded-full"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>

                <div className="text-[11px] text-[#E8C766] font-bold truncate">
                  Current: {p.milestones || 'Core Modules Developed'}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#3A1F2B] flex items-center justify-between gap-2 font-mono text-xs">
              <div className="text-[10px] text-[#C9B8BE]">
                Deadline: <strong className="text-[#FFF9F2]">{p.deadline || '2026-09-25'}</strong>
              </div>

              <button
                onClick={() => {
                  setEditingProject(p);
                  setNewProgress(p.progress || 50);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#D4A017] text-[#1F1117] font-bold text-xs hover:bg-[#B8860B] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(212,160,23,0.35)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Update % Progress</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* UPDATE PROGRESS MODAL FORM */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#2B1720] border border-[#3A1F2B] p-6 space-y-5 shadow-2xl animate-in zoom-in-95 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
              <h3 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4A017]" />
                <span>Update Project Milestone ({editingProject.id})</span>
              </h3>
              <button onClick={() => setEditingProject(null)} className="text-[#C9B8BE] hover:text-[#FFF9F2] font-bold">✕</button>
            </div>

            <form onSubmit={handleUpdateProgressSubmit} className="space-y-4">
              
              <div className="p-3 rounded-xl bg-[#1F1117] border border-[#3A1F2B]">
                <div className="text-sm font-bold text-[#FFF9F2]">{editingProject.name}</div>
                <div className="text-[#C9B8BE]">Client: {editingProject.clientName}</div>
              </div>

              {/* Slider for % Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[#C9B8BE]">MILESTONE PROGRESS (%) *</label>
                  <span className="text-lg font-bold text-[#D4A017]">{newProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-[#D4A017] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">PROGRESS WORK LOG & SUMMARY *</label>
                <textarea
                  rows={3}
                  required
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="Describe recent code commits, module additions, or bug fixes..."
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">DELIVERABLE FILE / DEMO URL (OPTIONAL)</label>
                <input
                  type="text"
                  value={deliverableFile}
                  onChange={(e) => setDeliverableFile(e.target.value)}
                  placeholder="https://github.com/... or staging build link"
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3A1F2B]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-[#1F1117] text-[#FFF9F2] hover:bg-[#3A1F2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4A017] text-[#1F1117] font-bold hover:bg-[#B8860B] cursor-pointer shadow-[0_0_15px_rgba(212,160,23,0.35)]"
                >
                  Save Milestone Progress
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
