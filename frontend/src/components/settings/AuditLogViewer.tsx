import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { AuditLog } from '../../types';
import { ShieldCheck, Clock, User, FileText } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    apiService.getAuditLogs().then(setLogs).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#C7FF3D]" />
          <span>System Audit Trails & History</span>
        </h1>
        <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
          Immutable event ledger tracking lead creation, call logs, qualification events, deal conversions, and commissions.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 text-[#64748B]">
              <th className="py-3 px-3">TIMESTAMP</th>
              <th className="py-3 px-3">USER / AUTHOR</th>
              <th className="py-3 px-3">ACTION EVENT</th>
              <th className="py-3 px-3">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-white/5 text-white hover:bg-white/5">
                <td className="py-3.5 px-3 text-[#64748B]">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="py-3.5 px-3 font-sans font-bold text-[#38E8FF]">{log.user}</td>
                <td className="py-3.5 px-3 font-bold text-[#C7FF3D]">{log.action}</td>
                <td className="py-3.5 px-3 text-[#9BA7B7]">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
