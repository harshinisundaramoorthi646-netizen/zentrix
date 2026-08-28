import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { apiService } from '../../services/api';
import { TimeEntry } from '../../types';
import { Clock, Play, Square, Plus, CheckCircle2, DollarSign } from 'lucide-react';

export const TimeTrackerWidget: React.FC = () => {
  const { user, showToast } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  const [project, setProject] = useState('BlueOrbit Mobile Expense App');
  const [task, setTask] = useState('Setup OCR Receipt Processing Pipeline');
  const [description, setDescription] = useState('');
  const [isBillable, setIsBillable] = useState(true);

  useEffect(() => {
    apiService.getTimeEntries().then(setEntries).catch(console.error);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = async () => {
    if (isRunning) {
      // Stop timer and log work
      setIsRunning(false);
      const hoursLogged = Math.max(0.1, Number((seconds / 3600).toFixed(2)));

      try {
        const newEntry = await apiService.addTimeEntry({
          member: user?.name || 'Aditya P',
          project,
          task,
          hours: hoursLogged,
          billable: isBillable,
          description: description || 'Logged live work session'
        });

        setEntries(prev => [newEntry, ...prev]);
        showToast(`Logged ${hoursLogged} hrs for "${project}".`, 'success');
        setSeconds(0);
        setDescription('');
      } catch (err) {
        showToast('Failed to log time entry', 'error');
      }
    } else {
      setIsRunning(true);
    }
  };

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const billableHours = entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0);
  const utilization = totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Freelancer Time Tracker</h1>
          <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
            Track live billable development hours, log client work sessions, and calculate agency utilization.
          </p>
        </div>

        <div className="flex gap-4 font-mono text-right">
          <div className="px-4 py-2 rounded-xl bg-[#080A0F] border border-white/10">
            <div className="text-[10px] text-[#9BA7B7]">TOTAL HOURS</div>
            <div className="text-lg font-bold text-white">{totalHours.toFixed(1)}h</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#080A0F] border border-white/10">
            <div className="text-[10px] text-[#9BA7B7]">UTILIZATION RATE</div>
            <div className="text-lg font-bold text-[#C7FF3D]">{utilization}%</div>
          </div>
        </div>
      </div>

      {/* Live Timer Console Widget */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-[#C7FF3D]/30 space-y-4 shadow-[0_0_30px_rgba(199,255,61,0.1)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-mono font-bold text-[#C7FF3D] flex items-center gap-2">
            <Clock className="w-4 h-4" /> Live Work Session Tracker
          </span>
          <span className="text-3xl font-extrabold font-mono text-white tracking-wider">
            {formatTimer(seconds)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[#9BA7B7] font-mono">SELECT PROJECT</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#111722] border border-white/10 text-white outline-none"
            >
              <option value="BlueOrbit Mobile Expense App">BlueOrbit Mobile Expense App</option>
              <option value="Apex Omnichannel POS Sync Engine">Apex Omnichannel POS Sync Engine</option>
              <option value="Zenith Core Banking Dashboard UI">Zenith Core Banking Dashboard UI</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[#9BA7B7] font-mono">TASK / FEATURE</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. OCR API Handler"
              className="w-full p-2.5 rounded-xl bg-[#111722] border border-white/10 text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#9BA7B7] font-mono">WORK LOG DESCRIPTION</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of code implemented..."
              className="w-full p-2.5 rounded-xl bg-[#111722] border border-white/10 text-white outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-xs text-[#9BA7B7] cursor-pointer">
            <input
              type="checkbox"
              checked={isBillable}
              onChange={(e) => setIsBillable(e.target.checked)}
              className="w-4 h-4 rounded bg-[#111722] border-white/20 text-[#C7FF3D]"
            />
            <span>Billable Client Session</span>
          </label>

          <button
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-xl font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              isRunning
                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
                : 'bg-[#C7FF3D] text-black hover:bg-[#b5f027] shadow-[0_0_20px_rgba(199,255,61,0.3)]'
            }`}
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'STOP & SAVE SESSION' : 'START TIMER'}</span>
          </button>
        </div>
      </div>

      {/* Logged Work Sessions Table */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#38E8FF]" />
          <span>Work Sessions History</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[#64748B]">
                <th className="py-3 px-3">FREELANCER</th>
                <th className="py-3 px-3">PROJECT</th>
                <th className="py-3 px-3">TASK</th>
                <th className="py-3 px-3">HOURS</th>
                <th className="py-3 px-3">BILLABLE</th>
                <th className="py-3 px-3">DATE</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} className="border-b border-white/5 text-white hover:bg-white/5">
                  <td className="py-3.5 px-3 font-sans font-bold">{e.member}</td>
                  <td className="py-3.5 px-3 text-[#38E8FF]">{e.project}</td>
                  <td className="py-3.5 px-3 text-[#9BA7B7]">{e.task}</td>
                  <td className="py-3.5 px-3 text-[#C7FF3D] font-bold">{e.hours} hrs</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${e.billable ? 'bg-[#54E38E]/20 text-[#54E38E]' : 'bg-white/5 text-[#9BA7B7]'}`}>
                      {e.billable ? 'Billable' : 'Non-Billable'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#64748B]">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
