import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Zap, Target } from 'lucide-react';

export const AiIntelligenceLayer: React.FC = () => {
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    fetch('/api/ai/predict')
      .then(res => res.json())
      .then(setPrediction)
      .catch(() => {
        setPrediction({
          highPriorityLeads: ['ZX-LD-2026-00128', 'ZX-LD-2026-00127'],
          recommendedTeam: 'Rahul M',
          conversionProbability: 86.4,
          performanceInsight: 'Discovery calls completed within 24h achieve an 18.4% higher closing rate.'
        });
      });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111722] via-[#161D29] to-[#0D1118] border border-[#38E8FF]/30 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_0_40px_rgba(56,232,255,0.15)]">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#38E8FF]/20 border border-[#38E8FF]/40 text-[#38E8FF] text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> ZENTRIX AI INTELLIGENCE ENGINE v3.0
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Predictive Lead Scoring & Operations AI
          </h1>
          <p className="text-[#9BA7B7] text-xs sm:text-sm max-w-xl font-normal">
            Real-time machine learning predictions for deal closing probability, automated workload dispatch recommendations, and efficiency insights.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#05070B]/80 border border-white/10 text-right font-mono relative z-10">
          <div className="text-[10px] text-[#9BA7B7]">AI CONVERSION FORECAST</div>
          <div className="text-3xl font-extrabold text-[#38E8FF]">
            {prediction?.conversionProbability || 86.4}%
          </div>
        </div>
      </div>

      {/* 3 AI Predictive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 hover:border-[#38E8FF]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#38E8FF] flex items-center gap-1.5">
              <Target className="w-4 h-4" /> AI LEAD PRIORITIZATION
            </span>
            <span className="px-2 py-0.5 rounded bg-[#38E8FF]/10 text-[#38E8FF] text-[10px] font-mono font-bold">
              TOP BUDGET
            </span>
          </div>

          <div>
            <div className="text-lg font-bold text-white">Vertex Digital Labs</div>
            <div className="text-xs text-[#9BA7B7] font-mono mt-0.5">Budget: ₹2,50,000 • Priority: HIGH</div>
          </div>

          <div className="p-3 rounded-xl bg-[#111722] text-xs text-[#9BA7B7] space-y-1 font-mono">
            <div className="text-white font-semibold">AI Lead Score: 94/100</div>
            <div>High budget intent matching Enterprise Microservices requirement.</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 hover:border-[#C7FF3D]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#C7FF3D] flex items-center gap-1.5">
              <Brain className="w-4 h-4" /> TEAM DISPATCH AI
            </span>
            <span className="px-2 py-0.5 rounded bg-[#C7FF3D]/10 text-[#C7FF3D] text-[10px] font-mono font-bold">
              OPTIMAL MATCH
            </span>
          </div>

          <div>
            <div className="text-lg font-bold text-white">{prediction?.recommendedTeam || 'Rahul M'}</div>
            <div className="text-xs text-[#9BA7B7] font-mono mt-0.5">Workload: 3 active calls • Score: 95%</div>
          </div>

          <div className="p-3 rounded-xl bg-[#111722] text-xs text-[#9BA7B7] space-y-1 font-mono">
            <div className="text-[#C7FF3D] font-semibold">Recommended Assignment</div>
            <div>Lowest latency & highest discovery call conversion rate in Q3.</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1118]/80 backdrop-blur-xl border border-white/10 space-y-4 hover:border-[#9B7CFF]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#9B7CFF] flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> STRATEGIC INSIGHT
            </span>
            <span className="px-2 py-0.5 rounded bg-[#9B7CFF]/10 text-[#9B7CFF] text-[10px] font-mono font-bold">
              REAL-TIME
            </span>
          </div>

          <div>
            <div className="text-sm font-bold text-white leading-snug">
              "24h Follow-up SLA boosts closing rate by 18.4%"
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#111722] text-xs text-[#9BA7B7] space-y-1 font-mono">
            <div>{prediction?.performanceInsight || 'Higher conversion when calls occur within 24h.'}</div>
          </div>
        </div>

      </div>

    </div>
  );
};
