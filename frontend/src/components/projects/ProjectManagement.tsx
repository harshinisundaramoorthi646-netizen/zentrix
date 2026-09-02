import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Project } from '../../types';
import { Briefcase, Clock, Calendar, CheckCircle2, Users, Search, DollarSign, Tag, TrendingUp, AlertCircle } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    apiService.getProjects().then(data => setProjects(data || [])).catch(console.error);
  }, []);

  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const activeCount = projects.filter(p => p.status === 'Active').length;
  const completedCount = projects.filter(p => p.status === 'Completed').length;
  const avgProgress = projects.length ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length) : 0;

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      (p.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.client || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017] text-xs font-mono font-semibold uppercase">
            AGENCY PORTFOLIO & CATALOG
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFF9F2] mt-1">Client Projects & Deliverables</h1>
          <p className="text-xs text-[#C9B8BE] font-mono mt-0.5">
            Full agency overview of client engagements across Web Dev, E-Commerce, Digital Ads, and QA Testing.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#1F1117] border border-[#3A1F2B] px-4 py-2.5 rounded-xl font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#C9B8BE]">TOTAL PORTFOLIO BUDGET</div>
            <div className="text-sm font-bold text-[#D4A017]">₹{totalBudget.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Agency Projects" value={projects.length} change="All Categories" isPositive={true} icon={Briefcase} accentColor="gold" />
        <StatCard title="Active In-Execution" value={activeCount} change="Development Stage" isPositive={true} icon={Clock} accentColor="gold" />
        <StatCard title="Deliveries Completed" value={completedCount} change="Delivered to Client" isPositive={true} icon={CheckCircle2} accentColor="gold" />
        <StatCard title="Average Progress" value={`${avgProgress}%`} change="Cross-project" isPositive={true} icon={TrendingUp} accentColor="gold" />
      </div>

      {/* Project Directory Catalog */}
      <div className="p-6 rounded-2xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] space-y-4 shadow-xl">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3A1F2B] pb-4">
          <h2 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2 font-mono">
            <Briefcase className="w-4 h-4 text-[#D4A017]" />
            <span>Project Directory ({filteredProjects.length})</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#C9B8BE]">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#1F1117] text-[#FFF9F2] p-2 rounded-xl border border-[#3A1F2B] outline-none focus:border-[#D4A017]"
              >
                <option value="ALL">All Categories</option>
                <option value="Website Development">Website Development</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Advertisement / Ad Management">Ad Management</option>
                <option value="Testing">Testing</option>
              </select>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#C9B8BE]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search project..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-xs text-[#FFF9F2] placeholder-[#C9B8BE] outline-none focus:border-[#D4A017]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(prj => (
            <div key={prj.id} className="p-6 rounded-2xl bg-[#1F1117] border border-[#3A1F2B] space-y-4 hover:border-[#D4A017] hover:shadow-[0_10px_30px_rgba(212,160,23,0.3)] transition-all font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D4A017]">{prj.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  prj.status === 'Completed' ? 'bg-[#D4A017]/20 text-[#D4A017] border-[#D4A017]/40' : 'bg-[#E8C766]/10 text-[#E8C766] border-[#E8C766]/30'
                }`}>
                  {prj.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#FFF9F2]">{prj.name}</h3>
                <div className="text-xs text-[#C9B8BE] mt-0.5">Client: <strong className="text-[#FFF9F2]">{prj.client}</strong></div>
                <div className="text-[11px] text-[#D4A017] font-bold mt-1">Category: {prj.category || 'Website Development'}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#2B1720] text-xs text-[#C9B8BE] line-clamp-2 border border-[#3A1F2B]">
                {prj.description}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-[#C9B8BE]">Completion Progress</span>
                  <span className="text-[#D4A017]">{prj.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#2B1720] overflow-hidden p-0.5 border border-[#3A1F2B]">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4A017] to-[#E8C766] rounded-full transition-all duration-500"
                    style={{ width: `${prj.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#3A1F2B]">
                <div className="text-[#C9B8BE]">
                  Assigned: <strong className="text-[#E8C766]">{prj.assignedMember || 'Suresh K'}</strong>
                </div>
                <div className="text-[#D4A017] font-bold">
                  ₹{prj.budget.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
