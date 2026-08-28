import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Invoice } from '../../types';
import { StatCard } from '../common/StatCard';
import { Receipt, DollarSign, TrendingUp, AlertCircle, Plus, FileText, CheckCircle2 } from 'lucide-react';

export const BillingRevenue: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    apiService.getInvoices().then(setInvoices).catch(console.error);
  }, []);

  const totalRevenue = 1248000;
  const outstanding = 240000;
  const expenses = 320000;
  const netProfit = 928000;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Billing, Invoices & Financials</h1>
          <p className="text-xs text-[#9BA7B7] font-mono mt-0.5">
            Manage client invoices, outstanding payments, agency operating expenses, and net profit.
          </p>
        </div>

        <button
          onClick={() => alert("Create Invoice modal initialized.")}
          className="px-4 py-2.5 rounded-xl bg-[#C7FF3D] text-black font-bold text-xs hover:bg-[#b5f027] transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>GENERATE INVOICE</span>
        </button>
      </div>

      {/* 4 Key Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
          accentColor="lime"
        />
        <StatCard
          title="Outstanding Payments"
          value={`₹${outstanding.toLocaleString('en-IN')}`}
          change="-2.1%"
          isPositive={true}
          icon={AlertCircle}
          accentColor="coral"
        />
        <StatCard
          title="Operating Expenses"
          value={`₹${expenses.toLocaleString('en-IN')}`}
          change="+5.0%"
          isPositive={false}
          icon={Receipt}
          accentColor="violet"
        />
        <StatCard
          title="Net Operating Profit"
          value={`₹${netProfit.toLocaleString('en-IN')}`}
          change="+24.2%"
          isPositive={true}
          icon={TrendingUp}
          accentColor="cyan"
        />
      </div>

      {/* Invoices Directory */}
      <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#C7FF3D]" />
            <span>Client Invoices Directory</span>
          </h2>
          <span className="text-xs font-mono text-[#9BA7B7]">GST Included (18%)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[#64748B]">
                <th className="py-3 px-3">INVOICE ID</th>
                <th className="py-3 px-3">CLIENT & PROJECT</th>
                <th className="py-3 px-3">BASE AMOUNT</th>
                <th className="py-3 px-3">TOTAL (INC. GST)</th>
                <th className="py-3 px-3">DUE DATE</th>
                <th className="py-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-white/5 text-white hover:bg-white/5">
                  <td className="py-3.5 px-3 text-[#38E8FF] font-bold">{inv.id}</td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold font-sans text-sm">{inv.clientName}</div>
                    <div className="text-[11px] text-[#9BA7B7]">{inv.projectName}</div>
                  </td>
                  <td className="py-3.5 px-3 text-[#9BA7B7]">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 text-[#C7FF3D] font-bold">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 text-[#64748B]">{inv.dueDate}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                      inv.status === 'Paid' ? 'bg-[#54E38E]/20 text-[#54E38E] border-[#54E38E]/40' :
                      inv.status === 'Overdue' ? 'bg-[#FF7A8A]/20 text-[#FF7A8A] border-[#FF7A8A]/40' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
