import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { apiService } from '../../services/api';
import { Lead, RequirementCategory } from '../../types';
import { LeadTimeline } from '../leads/LeadTimeline';
import {
  PhoneCall,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  Square,
  FileText,
  CreditCard,
  Send,
  Building2
} from 'lucide-react';

export const TeamBDashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeCallLead, setActiveCallLead] = useState<Lead | null>(null);
  
  // Interactive Call State
  const [callTimer, setCallTimer] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [callOutcome, setCallOutcome] = useState<'Interested' | 'Not Interested' | 'Call Later' | 'No Response' | 'Waiting' | 'Selected' | 'Rejected'>('Interested');
  const [callNotes, setCallNotes] = useState('');
  const [callStartTime, setCallStartTime] = useState<string>('');

  // Modals State
  const [selectedLeadForReq, setSelectedLeadForReq] = useState<Lead | null>(null);
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState<Lead | null>(null);
  const [selectedLeadForTimeline, setSelectedLeadForTimeline] = useState<Lead | null>(null);

  // Client Requirements Form State
  const [reqCategory, setReqCategory] = useState<RequirementCategory>('Website Development');
  const [reqDetails, setReqDetails] = useState('');
  const [reqBudget, setReqBudget] = useState('150000');
  const [reqDeliveryDate, setReqDeliveryDate] = useState('2026-09-25');
  const [reqNotes, setReqNotes] = useState('');

  // Payment Confirmation Form State
  const [payStatus, setPayStatus] = useState<'Pending' | 'Partially Paid' | 'Paid'>('Paid');
  const [payAmount, setPayAmount] = useState('50000');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payTxnId, setPayTxnId] = useState('TXN-' + Math.floor(100000 + Math.random() * 900000));
  const [payNotes, setPayNotes] = useState('Advance deposit received');

  // Follow-up Schedule State
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('11:00 AM');

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
    apiService.getLeads().then(data => setLeads(data || [])).catch(console.error);
  };

  const startCall = (lead: Lead) => {
    setActiveCallLead(lead);
    setIsCalling(true);
    setCallTimer(0);
    setCallStartTime(new Date().toLocaleTimeString());
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
        notes: callNotes || 'Discovery outreach call completed',
        followUpDate: followUpDate || undefined,
        agent: user?.name || 'Rahul M',
        duration: durationStr
      });

      if (['Selected', 'Rejected', 'Waiting'].includes(callOutcome)) {
        await apiService.updateLeadStatus(activeCallLead.id, callOutcome, user?.name || 'Rahul M');
      }

      showToast(`Call ended for ${activeCallLead.id} (${durationStr}). Outcome: ${callOutcome}`, 'success');
      loadLeads();
    } catch (err: any) {
      showToast('Error logging call', 'error');
    }
  };

  const handleStatusUpdate = async (leadId: string, status: 'Selected' | 'Rejected' | 'Waiting') => {
    try {
      await apiService.updateLeadStatus(leadId, status, user?.name || 'Rahul M');
      loadLeads();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveRequirements = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForReq) return;
    try {
      await apiService.saveClientRequirements(selectedLeadForReq.id, {
        clientName: selectedLeadForReq.name,
        companyName: selectedLeadForReq.company,
        category: reqCategory,
        detailedRequirement: reqDetails,
        budget: Number(reqBudget),
        expectedDeliveryDate: reqDeliveryDate,
        additionalNotes: reqNotes
      }, user?.name || 'Rahul M');
      
      setSelectedLeadForReq(null);
      loadLeads();
    } catch (err) {
      showToast('Failed to save requirements', 'error');
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForPayment) return;
    try {
      await apiService.savePaymentConfirmation(selectedLeadForPayment.id, {
        status: payStatus,
        amount: Number(payAmount),
        paymentDate: payDate,
        transactionId: payTxnId,
        notes: payNotes
      }, user?.name || 'Rahul M');

      setSelectedLeadForPayment(null);
      loadLeads();
    } catch (err) {
      showToast('Failed to record payment', 'error');
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totalTalkTimeStr = '3h 42m';

  // Individual Team B Call Activity
  const memberCallActivity = [
    { member: 'Rahul M', calls: 128, talkTime: '3h 42m', selected: 14 },
    { member: 'Sneha V', calls: 98, talkTime: '2h 38m', selected: 11 },
    { member: 'Aditya P', calls: 84, talkTime: '2h 10m', selected: 9 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#2B1720] border border-[#3A1F2B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017] text-xs font-mono font-semibold uppercase">
            ZENTRIX — TEAM B
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFF9F2] mt-1">Outreach & Client Scoping Portal</h1>
          <p className="text-xs text-[#C9B8BE] font-mono mt-0.5">
            Conduct client discovery calls, lock technical requirements, schedule follow-ups, and record payment deposits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-right font-mono">
            <div className="text-[10px] text-[#C9B8BE]">TOTAL TALK TIME</div>
            <div className="text-lg font-extrabold text-[#D4A017]">{totalTalkTimeStr}</div>
          </div>
        </div>
      </div>

      {/* Individual Member Call Activity Roster */}
      <div className="p-6 rounded-2xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] hover:border-[#D4A017]/40 transition-all space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
          <h2 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2 font-mono">
            <Phone className="w-4 h-4 text-[#D4A017]" />
            <span>INDIVIDUAL OUTREACH & CALLING LOGS</span>
          </h2>
          <span className="text-xs font-mono text-[#D4A017] font-bold">Total Talk Time: {totalTalkTimeStr}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {memberCallActivity.map(m => (
            <div key={m.member} className="p-4 rounded-xl bg-[#1F1117] border border-[#3A1F2B] flex items-center justify-between font-mono text-xs hover:border-[#D4A017]/30 transition-all">
              <div>
                <div className="text-sm font-bold text-[#FFF9F2]">{m.member}</div>
                <div className="text-[10px] text-[#C9B8BE]">Calls Logged: <strong className="text-[#FFF9F2]">{m.calls}</strong></div>
              </div>
              <div className="text-right">
                <div className="text-[#D4A017] font-bold">{m.talkTime}</div>
                <div className="text-[10px] text-[#E8C766] font-bold">{m.selected} Selected</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Incoming Leads Received from Team A + Live Calling Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Leads Received from Team A */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
            <h2 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2 font-mono">
              <PhoneCall className="w-4 h-4 text-[#D4A017]" />
              <span>Leads Received from Team A ({leads.length})</span>
            </h2>
          </div>

          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {leads.map(l => (
              <div key={l.id} className="p-4 rounded-2xl bg-[#1F1117] border border-[#3A1F2B] space-y-3 hover:border-[#D4A017]/40 transition-all">
                
                {/* Lead Header */}
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#D4A017]">{l.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#2B1720] text-[#C9B8BE] border border-[#3A1F2B]">
                      Area: {l.location || l.area || 'Chennai'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    l.status === 'Selected' || l.status === 'Completed'
                      ? 'bg-[#D4A017]/20 text-[#D4A017] border-[#D4A017]/40'
                      : l.status === 'Rejected'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {l.status}
                  </span>
                </div>

                {/* Lead Details */}
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-sm font-bold text-[#FFF9F2]">{l.company}</div>
                  <div className="text-[#C9B8BE]">Client Name: <strong className="text-[#FFF9F2]">{l.name}</strong></div>
                  <div className="text-[#C9B8BE]">Contact: <strong className="text-[#FFF9F2]">{l.phone}</strong> | {l.email}</div>
                  <div className="text-[#C9B8BE]">Generated By: <strong className="text-[#E8C766]">{l.assignedTeamA || 'Priya'}</strong> on {new Date(l.createdDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                </div>

                {/* Requirement & Payment Badges if filled */}
                {l.requirements && (
                  <div className="p-2.5 rounded-xl bg-[#2B1720] border border-[#D4A017]/30 text-xs font-mono space-y-1">
                    <div className="text-[#D4A017] font-bold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Category: {l.requirements.category}
                    </div>
                    <div className="text-[#FFF9F2]">{l.requirements.detailedRequirement}</div>
                  </div>
                )}

                {l.payment && (
                  <div className="p-2.5 rounded-xl bg-[#2B1720] border border-[#E8C766]/30 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#E8C766] font-bold">Payment: ₹{l.payment.amount.toLocaleString('en-IN')}</span>
                    <span className="px-2 py-0.5 rounded bg-[#E8C766]/10 text-[#E8C766] border border-[#E8C766]/30 font-bold">
                      Status: {l.payment.status}
                    </span>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#3A1F2B] font-mono text-xs">
                  
                  <button
                    onClick={() => startCall(l)}
                    className="px-3 py-1.5 rounded-xl bg-[#D4A017] text-[#1F1117] font-bold flex items-center gap-1.5 hover:bg-[#B8860B] transition-all cursor-pointer shadow-[0_0_12px_rgba(212,160,23,0.3)]"
                  >
                    <Phone className="w-3.5 h-3.5" /> <span>📞 Call</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStatusUpdate(l.id, 'Selected')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        l.status === 'Selected' ? 'bg-[#D4A017] text-[#1F1117] border-[#D4A017]' : 'bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/30 hover:bg-[#D4A017]/20'
                      }`}
                    >
                      SELECTED
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(l.id, 'Waiting')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        l.status === 'Waiting' ? 'bg-amber-500 text-[#1F1117] border-amber-500' : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      WAITING
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(l.id, 'Rejected')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        l.status === 'Rejected' ? 'bg-red-500 text-[#FFF9F2] border-red-500' : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                      }`}
                    >
                      REJECTED
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 w-full pt-1">
                    <button
                      onClick={() => {
                        setSelectedLeadForReq(l);
                        setReqDetails(l.requirement || '');
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-[#1F1117] border border-[#3A1F2B] hover:border-[#D4A017] text-[11px] text-[#D4A017] flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <FileText className="w-3 h-3" /> Requirements
                    </button>

                    <button
                      onClick={() => {
                        setSelectedLeadForPayment(l);
                        setPayAmount(String(l.estimatedBudget || 50000));
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-[#1F1117] border border-[#3A1F2B] hover:border-[#E8C766] text-[11px] text-[#E8C766] flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <CreditCard className="w-3 h-3" /> Payment Conf.
                    </button>

                    <button
                      onClick={() => setSelectedLeadForTimeline(l)}
                      className="py-1.5 px-2.5 rounded-lg bg-[#1F1117] border border-[#3A1F2B] hover:border-[#D4A017] text-[11px] text-[#FFF9F2] cursor-pointer transition-all"
                      title="View Lead Journey"
                    >
                      Journey ➔
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Calling Console & Follow-Up Section */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#2B1720] backdrop-blur-xl border border-[#3A1F2B] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
            <h2 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2 font-mono">
              <Phone className="w-4 h-4 text-[#D4A017]" />
              <span>Interactive Call Console & Follow-up</span>
            </h2>
            {isCalling && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold animate-pulse">
                ● CALL IN PROGRESS ({formatTimer(callTimer)})
              </span>
            )}
          </div>

          {activeCallLead ? (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#1F1117] border border-[#D4A017]/40 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#D4A017] font-bold">{activeCallLead.id}</span>
                  <span className="text-[#C9B8BE]">Start Time: {callStartTime}</span>
                </div>
                <div className="text-base font-bold text-[#FFF9F2]">{activeCallLead.company}</div>
                <div className="text-[#C9B8BE]">Contact: {activeCallLead.name} ({activeCallLead.phone})</div>
                <div className="text-[#E8C766]">Area: {activeCallLead.location || activeCallLead.area || 'Chennai'}</div>
              </div>

              {/* Call Outcomes Selection */}
              <div className="space-y-1">
                <label className="text-[#C9B8BE]">CALL OUTCOME *</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                >
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Call Later">Call Later</option>
                  <option value="No Response">No Response</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Follow-up Section */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#1F1117] border border-[#3A1F2B]">
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">FOLLOW-UP DATE</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#2B1720] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">FOLLOW-UP TIME</label>
                  <input
                    type="text"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                    placeholder="11:00 AM"
                    className="w-full p-2 rounded-lg bg-[#2B1720] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">CALL NOTES & FOLLOW-UP NOTES *</label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Record call summary, client expectations, follow-up notes..."
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleEndCall}
                  className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Square className="w-4 h-4" /> End & Save Call Record
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#C9B8BE] space-y-2 border border-dashed border-[#3A1F2B] rounded-xl font-mono">
              <PhoneCall className="w-8 h-8 mx-auto text-[#C9B8BE] opacity-50" />
              <div>Select a lead from the left list and click "📞 Call" to launch the call recording interface.</div>
            </div>
          )}
        </div>

      </div>

      {/* REQUIREMENTS FORM MODAL */}
      {selectedLeadForReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl bg-[#2B1720] border border-[#3A1F2B] p-6 space-y-4 shadow-2xl animate-in zoom-in-95 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
              <h3 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4A017]" />
                <span>Client Technical Requirements ({selectedLeadForReq.id})</span>
              </h3>
              <button onClick={() => setSelectedLeadForReq(null)} className="text-[#C9B8BE] hover:text-[#FFF9F2] font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveRequirements} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">PROJECT CATEGORY *</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Advertisement / Ad Management">Advertisement / Ad Management</option>
                    <option value="Testing">Testing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">BUDGET (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={reqBudget}
                    onChange={(e) => setReqBudget(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">DETAILED REQUIREMENTS SPECIFICATION *</label>
                <textarea
                  rows={4}
                  required
                  value={reqDetails}
                  onChange={(e) => setReqDetails(e.target.value)}
                  placeholder="Specify technology stack, pages required, features, integrations..."
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none focus:border-[#D4A017]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">EXPECTED DELIVERY DATE *</label>
                  <input
                    type="date"
                    required
                    value={reqDeliveryDate}
                    onChange={(e) => setReqDeliveryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">ADDITIONAL NOTES</label>
                  <input
                    type="text"
                    value={reqNotes}
                    onChange={(e) => setReqNotes(e.target.value)}
                    placeholder="e.g. Needs staging preview link"
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3A1F2B]">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForReq(null)}
                  className="px-4 py-2 rounded-xl bg-[#1F1117] text-[#FFF9F2] hover:bg-[#3A1F2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4A017] text-[#1F1117] font-bold hover:bg-[#B8860B] cursor-pointer shadow-[0_0_15px_rgba(212,160,23,0.35)]"
                >
                  Save Requirements
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT CONFIRMATION MODAL */}
      {selectedLeadForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#2B1720] border border-[#3A1F2B] p-6 space-y-4 shadow-2xl animate-in zoom-in-95 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#3A1F2B] pb-3">
              <h3 className="text-base font-bold text-[#FFF9F2] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#E8C766]" />
                <span>Payment Deposit Receipt ({selectedLeadForPayment.id})</span>
              </h3>
              <button onClick={() => setSelectedLeadForPayment(null)} className="text-[#C9B8BE] hover:text-[#FFF9F2] font-bold">✕</button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">PAYMENT STATUS *</label>
                  <select
                    value={payStatus}
                    onChange={(e) => setPayStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">AMOUNT RECEIVED (₹) *</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">PAYMENT DATE *</label>
                  <input
                    type="date"
                    required
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#C9B8BE]">TRANSACTION ID *</label>
                  <input
                    type="text"
                    required
                    value={payTxnId}
                    onChange={(e) => setPayTxnId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#C9B8BE]">RECEIPT NOTES</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="Advance deposit via UPI / Bank Transfer"
                  className="w-full p-2.5 rounded-xl bg-[#1F1117] border border-[#3A1F2B] text-[#FFF9F2] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3A1F2B]">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForPayment(null)}
                  className="px-4 py-2 rounded-xl bg-[#1F1117] text-[#FFF9F2] hover:bg-[#3A1F2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4A017] text-[#1F1117] font-bold hover:bg-[#B8860B] cursor-pointer shadow-[0_0_15px_rgba(212,160,23,0.35)]"
                >
                  Confirm & Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAD JOURNEY TIMELINE MODAL */}
      {selectedLeadForTimeline && (
        <LeadTimeline lead={selectedLeadForTimeline} onClose={() => setSelectedLeadForTimeline(null)} />
      )}

    </div>
  );
};
