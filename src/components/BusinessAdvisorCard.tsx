import React from 'react';
import { Sparkles, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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
    <div className="bg-[#FCFBF9] dark:bg-[#010844] rounded-[12px] p-5 sm:p-6 border border-[#D6DAE3] dark:border-white/10 shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.06)] transition-all">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[#D6DAE3] dark:border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[7.2px] bg-[#D20C54] text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-[#010844] dark:text-white tracking-tight">
              Gemini AI Business Advisor
            </h2>
            <p className="text-[11px] text-[#969CAF]">
              Strategic financial intelligence & revenue optimization recommendations
            </p>
          </div>
        </div>

        <button
          onClick={fetchAiRecommendations}
          disabled={loadingAi}
          className="btn-primary"
        >
          <RefreshCw className={`w-4 h-4 stroke-[2.5] ${loadingAi ? 'animate-spin' : ''}`} />
          <span>{loadingAi ? 'Synthesizing...' : 'Refresh Insights'}</span>
        </button>
      </div>

      <div>
        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-[#040B46] p-4 rounded-[8px] border border-[#D6DAE3] dark:border-white/10 text-xs mb-5">
          <div>
            <span className="text-[#969CAF] block text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#00C3F0]"/> Top Category
            </span>
            <strong className="font-display font-semibold text-lg text-[#010844] dark:text-white">{topProduct}</strong>
          </div>
          <div>
            <span className="text-[#969CAF] block text-[10px] font-semibold uppercase tracking-wider mb-1">Category Revenue</span>
            <strong className="font-mono font-semibold text-lg text-[#00006E] dark:text-[#00C3F0]">{formatLakhsCrores(topProductRevenue)}</strong>
          </div>
          <div>
            <span className="text-[#969CAF] block text-[10px] font-semibold uppercase tracking-wider mb-1">Won Pipeline</span>
            <strong className="font-mono font-semibold text-lg text-[#010844] dark:text-white">{formatLakhsCrores(totalSales)}</strong>
          </div>
          <div>
            <span className="text-[#969CAF] block text-[10px] font-semibold uppercase tracking-wider mb-1">Total Expenditures</span>
            <strong className="font-mono font-semibold text-lg text-[#D20C54]">{formatLakhsCrores(totalExpenses)}</strong>
          </div>
        </div>

        {/* Recommendations Box */}
        <div>
          {loadingAi ? (
            <div className="p-8 bg-white dark:bg-[#040B46] rounded-[8px] border border-[#D6DAE3] dark:border-white/10 flex flex-col items-center justify-center gap-3 min-h-[160px]">
              <div className="w-8 h-8 border-3 border-[#D20C54] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-[#969CAF]">Generating executive advisory analysis with Gemini...</p>
            </div>
          ) : aiError ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-[8px] flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{aiError}</span>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#040B46] p-5 sm:p-6 rounded-[8px] border border-[#D6DAE3] dark:border-white/10 prose dark:prose-invert max-w-none text-sm leading-relaxed text-[#545B6D] dark:text-[#CBD5E1]">
              <ReactMarkdown>{recommendations}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
