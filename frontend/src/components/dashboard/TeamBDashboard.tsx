import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { apiService } from '../../services/api';
import { Lead } from '../../types';
import { PhoneCall, Calendar, CheckCircle2, Clock, Phone, AlertCircle, Play, Square, ArrowRight, UserCheck } from 'lucide-react';

export const TeamBDashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeCallLead, setActiveCallLead] = useState<Lead | null>(null);
  
  // Call state
  const [callTimer, setCallTimer] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [callOutcome, setCallOutcome] = useState('Interested');
  const [callNotes, setCallNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Calendar filter tab
  const [calendarTab, setCalendarTab] = useState<'today' | 'upcoming' | 'overdue'>('today');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isCalling) {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const loadLeads = () => {
    apiService.getLeads().then(setLeads).catch(console.error);
  };

  const startCall = (lead: Lead) => {
    setActiveCallLead(lead);
    setIsCalling(true);
    setCallTimer(0);
    setCallNotes('');
    setCallOutcome('Interested');
  };

  const handleEndCall = async () => {
    if (!activeCallLead) return;
    setIsCalling(false);

    const minutes = Math.floor(callTimer / 60);
    const seconds = callTimer % 60;
    const durationStr = `${minutes}m ${seconds}s`;

    try {
      await apiService.logCall(activeCallLead.id, {
        outcome: callOutcome,
        notes: callNotes || 'Outreach call completed',
        followUpDate: followUpDate || undefined,
        agent: user?.name || 'Rahul M',
        duration: durationStr
      });

      showToast(`Call logged for ${activeCallLead.id} (${durationStr}). Outcome: ${callOutcome}`, 'success');
      loadLeads();
    } catch (err: any) {
      showToast('Error logging call', 'error');
    }
  };

  const handleQualifyLead = async (leadId: string) => {
    try {
      await apiService.qualifyLead(leadId, user?.name || 'Rahul M');
      showToast(`Lead ${leadId} qualified! ₹200 commission awarded & sent to admin conversion desk.`, 'success');
      if (activeCallLead?.id === leadId) setActiveCallLead(null);
      loadLeads();
    } catch (err: any) {
      showToast('Qualification failed', 'error');
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const incomingLeads = leads.filter(l => l.status === 'Submitted' || l.status === 'Accepted' || l.status === 'Calling');
  const followUpLeads = leads.filter(l => l.status === 'Follow-up');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0D1118] via-[#111722] to-[#161D29] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9B7CFF]/10 border border-[#9B7CFF]/30 text-[#9B7CFF] text-xs font-mono font-semibold">
            TEAM B — CALLING & FOLLOW-UP
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Outreach & Qualification Hub</h1>
          <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
            Conduct client discovery calls, record outcome notes, schedule follow-ups, and dispatch qualified deals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#080A0F] border border-white/10 text-right">
            <div className="text-[10px] font-mono text-[#9BA7B7]">QUALIFIED CALL COMMISSION</div>
            <div className="text-lg font-extrabold font-mono text-[#9B7CFF]">
              ₹7,200
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Incoming Leads + Live Calling Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Incoming Queue */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#9B7CFF]" />
              <span>Incoming Leads Queue ({incomingLeads.length})</span>
            </h2>
            <span className="text-xs font-mono text-[#9BA7B7]">Stage: Team B</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {incomingLeads.map(l => (
              <div key={l.id} className="p-4 rounded-2xl bg-[#111722]/90 backdrop-blur-md border border-white/10 hover:border-yellow-400/60 hover:bg-white/10 hover:backdrop-blur-xl hover:shadow-[0_8px_30px_rgba(255,215,0,0.25)] transition-all duration-300 transform hover:-translate-y-1 space-y-3 group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#9B7CFF] group-hover:text-yellow-300 transition-colors">{l.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">
                    {l.priority}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-bold text-white">{l.company}</div>
                  <div className="text-xs text-[#9BA7B7]">{l.name} • {l.phone}</div>
                </div>

                <div className="text-xs text-[#9BA7B7] bg-[#0D1118] p-2 rounded-lg line-clamp-2">
                  {l.requirement}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => startCall(l)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#9B7CFF] text-black font-bold text-xs hover:bg-[#8b65ff] transition-all flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>START CALL</span>
                  </button>

                  <button
                    onClick={() => handleQualifyLead(l.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#54E38E]/20 border border-[#54E38E]/40 text-[#54E38E] text-xs font-semibold hover:bg-[#54E38E]/30"
                  >
                    Qualify Now ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Live Call Workspace */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C7FF3D]" />
              <span>Interactive Calling Console</span>
            </h2>
            {isCalling && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold animate-pulse flex items-center gap-1">
                ● LIVE CALL ({formatTimer(callTimer)})
              </span>
            )}
          </div>

          {activeCallLead ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#111722] border border-[#9B7CFF]/30 space-y-2">
                <div className="text-xs font-mono text-[#9B7CFF] font-bold">{activeCallLead.id}</div>
                <div className="text-lg font-bold text-white">{activeCallLead.company}</div>
                <div className="text-xs text-[#9BA7B7]">Contact: {activeCallLead.name} ({activeCallLead.phone})</div>
                <div className="text-xs text-[#C7FF3D] font-mono">Estimated Budget: ₹{activeCallLead.estimatedBudget.toLocaleString('en-IN')}</div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[#9BA7B7] font-mono">CALL OUTCOME STATUS</label>
                  <select
                    value={callOutcome}
                    onChange={(e) => setCallOutcome(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#9B7CFF]"
                  >
                    <option value="Interested">Interested (Advance Proposal)</option>
                    <option value="Call Later">Call Later (Reschedule)</option>
                    <option value="Busy">Customer Busy</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#9BA7B7] font-mono">FOLLOW-UP SCHEDULE DATE</label>
                  <input
                    type="datetime-local"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#9B7CFF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#9BA7B7] font-mono">DISCOVERY NOTES & FEEDBACK</label>
                  <textarea
                    rows={3}
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Enter customer expectations, timeline constraints, tech stack preferences..."
                    className="w-full p-2.5 rounded-xl bg-[#111722] border border-white/10 text-white outline-none focus:border-[#9B7CFF]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleEndCall}
                    className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/30 flex items-center justify-center gap-2"
                  >
                    <Square className="w-4 h-4" /> Log Call Summary
                  </button>

                  <button
                    onClick={() => handleQualifyLead(activeCallLead.id)}
                    className="flex-1 py-3 rounded-xl bg-[#C7FF3D] text-black font-bold hover:bg-[#b5f027] flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" /> Qualify & Dispatch
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#64748B] space-y-2 border border-dashed border-white/10 rounded-xl">
              <PhoneCall className="w-8 h-8 mx-auto text-[#64748B] opacity-50" />
              <div>Select a lead from the left queue and click "START CALL" to open the interactive dialer console.</div>
            </div>
          )}
        </div>

      </div>

      {/* Follow-up Scheduler Calendar View */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#38E8FF]" />
            <span>Follow-up Calendar Schedule</span>
          </h2>

          <div className="flex gap-1 p-1 bg-[#111722] rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setCalendarTab('today')}
              className={`px-3 py-1 rounded-lg ${calendarTab === 'today' ? 'bg-[#38E8FF] text-black font-bold' : 'text-[#9BA7B7]'}`}
            >
              Today (5)
            </button>
            <button
              onClick={() => setCalendarTab('upcoming')}
              className={`px-3 py-1 rounded-lg ${calendarTab === 'upcoming' ? 'bg-[#38E8FF] text-black font-bold' : 'text-[#9BA7B7]'}`}
            >
              Upcoming (8)
            </button>
            <button
              onClick={() => setCalendarTab('overdue')}
              className={`px-3 py-1 rounded-lg ${calendarTab === 'overdue' ? 'bg-[#38E8FF] text-black font-bold' : 'text-[#9BA7B7]'}`}
            >
              Overdue (2)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {followUpLeads.map(l => (
            <div key={l.id} className="p-4 rounded-xl bg-[#111722] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#38E8FF] font-bold">{l.id}</span>
                <span className="text-[#FFC857]">{l.followUpDate ? new Date(l.followUpDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '11:00 AM'}</span>
              </div>
              <div className="text-sm font-bold text-white">{l.company}</div>
              <div className="text-xs text-[#9BA7B7]">{l.notes || 'Follow-up call scheduled'}</div>
              <button
                onClick={() => startCall(l)}
                className="w-full mt-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#38E8FF] text-xs text-white hover:text-[#38E8FF] transition-colors"
              >
                Call Customer Now
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
