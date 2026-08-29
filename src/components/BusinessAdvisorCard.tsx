import React from 'react';
import { Sparkles, TrendingUp, RefreshCw, Lightbulb, AlertCircle } from 'lucide-react';
import { formatLakhsCrores } from '../utils/currency';

interface BusinessAdvisorCardProps {
  topProduct: string;
  topProductRevenue: number;
  totalSales: number;
  totalExpenses: number;
  loadingAi: boolean;
  aiError: string | null;
  recommendations: string;
  fetchAiRecommendations: () => void;
}

export const BusinessAdvisorCard: React.FC<BusinessAdvisorCardProps> = ({
  topProduct,
  topProductRevenue,
  totalSales,
  totalExpenses,
  loadingAi,
  aiError,
  recommendations,
  fetchAiRecommendations,
}) => {
  return (
    <div className="relative rounded-[2.5rem] p-[1px] overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/20 transition-all duration-500">
      {/* Animated Gradient Border Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 via-purple-300 to-indigo-400 dark:from-indigo-500/50 dark:via-purple-500/50 dark:to-blue-500/50 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Inner Card Background */}
      <div className="relative h-full bg-[#0a0f1c]/90 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-3xl flex flex-col gap-6">
        {/* Subtle Background Pattern & Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 group-hover:scale-125 transition-all duration-1000" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/20 group-hover:scale-125 transition-all duration-1000" />
        
        <div className="absolute -top-10 -right-10 p-8 opacity-[0.02] pointer-events-none transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000">
          <Sparkles className="w-96 h-96 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-wrap justify-between items-center gap-6 border-b border-indigo-500/20 pb-8">
          <div className="flex items-center gap-8">
            <div className="p-5 bg-indigo-500/10 rounded-[1.5rem] border border-indigo-500/20 text-indigo-400 shadow-inner flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
              <Sparkles className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-4xl font-serif font-black text-white flex items-center gap-2 tracking-tight drop-shadow-md">
                Gemini 2.5 Flash Lite Advisor
              </h2>
              <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" /> Real-time sales & expense intelligence
              </p>
            </div>
          </div>

          <button
            onClick={fetchAiRecommendations}
            disabled={loadingAi}
            className="px-8 py-5 text-[14px] font-black tracking-widest uppercase bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)] flex items-center gap-3 hover:-translate-y-1 active:scale-95 border border-indigo-400/20"
          >
            <RefreshCw className={`w-6 h-6 stroke-[3] ${loadingAi ? 'animate-spin' : ''}`} />
            {loadingAi ? 'Synthesizing...' : 'Refresh Insights'}
          </button>
        </div>

        <div className="relative z-10">
          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap md:flex-nowrap gap-6 bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-700/50 shadow-inner backdrop-blur-sm text-xs divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
            <div className="w-full md:w-1/4 pt-2 md:pt-0 md:pl-10 first:pt-0 first:pl-0">
              <span className="text-slate-400 block text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500 stroke-[3]"/> Top Category
              </span>
              <strong className="font-serif font-black text-3xl text-white">{topProduct}</strong>
            </div>
            <div className="w-full md:w-1/4 pt-8 md:pt-0 md:pl-10">
              <span className="text-slate-400 block text-[11px] font-black uppercase tracking-widest mb-4">Category Revenue</span>
              <strong className="font-serif font-black text-3xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{formatLakhsCrores(topProductRevenue)}</strong>
            </div>
            <div className="w-full md:w-1/4 pt-8 md:pt-0 md:pl-10">
              <span className="text-slate-400 block text-[11px] font-black uppercase tracking-widest mb-4">Total Won Sales</span>
              <strong className="font-serif font-black text-3xl text-white">{formatLakhsCrores(totalSales)}</strong>
            </div>
            <div className="w-full md:w-1/4 pt-8 md:pt-0 md:pl-10">
              <span className="text-slate-400 block text-[11px] font-black uppercase tracking-widest mb-4">Total Expenses</span>
              <strong className="font-serif font-black text-3xl text-rose-500">{formatLakhsCrores(totalExpenses)}</strong>
            </div>
          </div>

          {/* Recommendations Box */}
          <div className="mt-8">
            {loadingAi ? (
              <div className="p-16 bg-slate-900/60 rounded-[2.5rem] border border-indigo-500/20 flex flex-col items-center justify-center gap-8 min-h-[300px] backdrop-blur-xl shadow-inner relative overflow-hidden">
                 <div className="absolute inset-0 bg-indigo-500/5 blur-[50px] rounded-full animate-pulse pointer-events-none" />
                 <div className="relative z-10">
                   <div className="w-20 h-20 border-[4px] border-indigo-900/50 rounded-full"></div>
                   <div className="w-20 h-20 border-[4px] border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                 </div>
                 <p className="text-[11px] font-black text-indigo-400/80 animate-pulse tracking-widest uppercase relative z-10">Synthesizing Strategic Intelligence...</p>
              </div>
            ) : aiError ? (
              <div className="p-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-3xl text-[13px] font-bold tracking-wide flex items-center gap-3 backdrop-blur-md">
                <AlertCircle className="w-6 h-6 stroke-[2.5]" />
                {aiError}
              </div>
            ) : (
              <div className="p-10 bg-slate-900/60 rounded-[2.5rem] border border-indigo-500/30 text-sm leading-relaxed text-slate-200 backdrop-blur-xl shadow-inner relative overflow-hidden group/box transition-all hover:border-indigo-400/50 hover:shadow-[0_0_40px_rgba(79,70,229,0.1)]">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-400 to-purple-600" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none group-hover/box:bg-indigo-500/10 transition-colors duration-1000" />
                
                <div className="font-black text-[11px] text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <Lightbulb className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  Actionable Strategic Recommendations
                </div>
                <div className="whitespace-pre-wrap font-serif text-[17px] text-slate-300 leading-[1.8] relative z-10">
                  {recommendations || 'Click refresh to generate AI insights.'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
