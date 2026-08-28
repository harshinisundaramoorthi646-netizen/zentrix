import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Client } from '../../types';
import { Building2, Mail, Phone, MapPin, Briefcase, DollarSign } from 'lucide-react';

export const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    apiService.getClients().then(setClients).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10">
        <h1 className="text-2xl font-extrabold text-white">Client Directory & Accounts</h1>
        <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
          Manage converted clients, active project portfolios, lifetime value, and outstanding invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(cli => (
          <div key={cli.id} className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#38E8FF]/10 border border-[#38E8FF]/30 text-[#38E8FF] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-[#54E38E] px-2.5 py-0.5 rounded-full bg-[#54E38E]/10 border border-[#54E38E]/30">
                {cli.status}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{cli.companyName}</h2>
              <div className="text-xs text-[#9BA7B7]">{cli.contactPerson} • {cli.location}</div>
            </div>

            <div className="space-y-1.5 text-xs text-[#9BA7B7] font-mono">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#64748B]" /> {cli.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#64748B]" /> {cli.phone}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#111722] grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <div className="text-[#64748B]">Total Lifetime Value</div>
                <div className="text-[#C7FF3D] font-bold">₹{cli.totalRevenue.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div className="text-[#64748B]">Active Projects</div>
                <div className="text-white font-bold">{cli.activeProjects} active</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
