import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Task, TaskStatus } from '../../types';
import { KanbanSquare, CheckCircle2, Clock, User, ArrowRight, ArrowLeft } from 'lucide-react';

export const TaskKanban: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    apiService.getTasks().then(setTasks).catch(console.error);
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await apiService.updateTaskStatus(taskId, newStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const columns: { name: TaskStatus; color: string }[] = [
    { name: 'Todo', color: '#64748B' },
    { name: 'In Progress', color: '#38E8FF' },
    { name: 'Review', color: '#9B7CFF' },
    { name: 'Completed', color: '#54E38E' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10">
        <h1 className="text-2xl font-extrabold text-white">Freelancer Task Kanban Board</h1>
        <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
          Move active engineering and design tasks through Todo ➔ In Progress ➔ Review ➔ Completed.
        </p>
      </div>

      {/* 4 Column Kanban Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.name);
          return (
            <div key={col.name} className="p-4 rounded-2xl bg-[#0D1118]/80 border border-white/10 space-y-3 min-h-[450px]">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  {col.name}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#9BA7B7]">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {colTasks.map(t => (
                  <div key={t.id} className="p-4 rounded-xl bg-[#111722] border border-white/10 hover:border-white/20 transition-all space-y-3">
                    
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#38E8FF] font-bold">{t.project}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white">{t.priority}</span>
                    </div>

                    <div className="text-sm font-bold text-white">{t.taskName}</div>

                    <div className="flex items-center justify-between text-xs font-mono text-[#9BA7B7]">
                      <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#C7FF3D]" /> {t.assignedMember}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#64748B]" /> {t.actualHours}/{t.estimatedHours}h</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono">
                      {col.name !== 'Todo' && (
                        <button
                          onClick={() => handleStatusChange(t.id, col.name === 'Completed' ? 'Review' : col.name === 'Review' ? 'In Progress' : 'Todo')}
                          className="text-[#9BA7B7] hover:text-white flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                      )}
                      {col.name !== 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(t.id, col.name === 'Todo' ? 'In Progress' : col.name === 'In Progress' ? 'Review' : 'Completed')}
                          className="text-[#C7FF3D] hover:underline flex items-center gap-1 ml-auto"
                        >
                          Next <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
