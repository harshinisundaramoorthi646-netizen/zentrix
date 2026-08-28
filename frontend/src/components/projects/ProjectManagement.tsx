import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Project } from '../../types';
import { Briefcase, Clock, Calendar, CheckCircle2, Users, AlertCircle } from 'lucide-react';

export const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiService.getProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10">
        <h1 className="text-2xl font-extrabold text-white">Active Agency Projects</h1>
        <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
          Monitor project progress bars, milestone deadlines, budgets, and assigned developer teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(prj => (
          <div key={prj.id} className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#38E8FF]">{prj.client}</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">
                {prj.priority}
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-white">{prj.name}</h2>
              <p className="text-xs text-[#9BA7B7] mt-1 line-clamp-2">{prj.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Completion Progress</span>
                <span className="text-[#C7FF3D] font-bold">{prj.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#38E8FF] to-[#C7FF3D] rounded-full transition-all duration-500"
                  style={{ width: `${prj.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
              <div className="flex items-center gap-1 text-[#9BA7B7]">
                <Calendar className="w-3.5 h-3.5 text-[#64748B]" /> Due: {prj.deadline}
              </div>
              <div className="text-[#C7FF3D] font-bold">
                ₹{prj.budget.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
