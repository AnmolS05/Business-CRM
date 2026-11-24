import React from 'react';
import { Cpu, RefreshCw } from 'lucide-react';

interface LeadScoringPredictorProps {
  leadIndustry: string;
  setLeadIndustry: (val: string) => void;
  leadBudget: string;
  setLeadBudget: (val: string) => void;
  loadingCustomMl: boolean;
  fetchCustomMlPrediction: () => void;
  customMlPrediction: string;
}

export const LeadScoringPredictor: React.FC<LeadScoringPredictorProps> = ({
  leadIndustry,
  setLeadIndustry,
  leadBudget,
  setLeadBudget,
  loadingCustomMl,
  fetchCustomMlPrediction,
  customMlPrediction,
}) => {
  return (
    <div className="bg-[#FCFBF9] dark:bg-[#010844] rounded-[12px] p-5 sm:p-6 border border-[#D6DAE3] dark:border-white/10 shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.06)] transition-all">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[#D6DAE3] dark:border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[7.2px] bg-[#00C3F0] text-[#010844] flex items-center justify-center font-bold shadow-sm">
            <Cpu className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-[#010844] dark:text-white tracking-tight">
              Lead Scoring Predictor
            </h2>
            <p className="text-[11px] text-[#969CAF]">
              Predictive closing probabilities using firmographic machine learning
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Input Form */}
        <div className="flex-1 space-y-4 bg-white dark:bg-[#040B46] p-4 sm:p-5 rounded-[8px] border border-[#D6DAE3] dark:border-white/10">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#969CAF]">
            Lead Parameters
          </h3>
          
          <div>
            <label className="block text-[11px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
              Industry Sector
            </label>
            <select 
              value={leadIndustry}
              onChange={(e) => setLeadIndustry(e.target.value)}
              className="w-full bg-[#FCFBF9] dark:bg-[#010844] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] cursor-pointer"
            >
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Retail">Retail</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
              Estimated Budget (INR)
            </label>
            <input 
              type="number"
              value={leadBudget}
              onChange={(e) => setLeadBudget(e.target.value)}
              className="w-full bg-[#FCFBF9] dark:bg-[#010844] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0]"
              placeholder="50000"
            />
          </div>

          <button
            onClick={fetchCustomMlPrediction}
            disabled={loadingCustomMl}
            className="btn-secondary w-full mt-2"
          >
            <RefreshCw className={`w-4 h-4 stroke-[2.5] ${loadingCustomMl ? 'animate-spin' : ''}`} />
            <span>{loadingCustomMl ? 'Scoring Lead...' : 'Calculate Conversion Score'}</span>
          </button>
        </div>

        {/* Prediction Output */}
        <div className="flex-1 bg-white dark:bg-[#040B46] p-4 sm:p-5 rounded-[8px] border border-[#D6DAE3] dark:border-white/10 flex flex-col justify-center min-h-[200px]">
          {loadingCustomMl ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <div className="w-8 h-8 border-3 border-[#00C3F0] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-[#969CAF]">Evaluating conversion signals...</p>
            </div>
          ) : customMlPrediction ? (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-semibold text-[#00C3F0] tracking-wider block">
                Model Evaluation Output
              </span>
              <p className="text-sm font-medium text-[#010844] dark:text-white whitespace-pre-line leading-relaxed">
                {customMlPrediction}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-[#969CAF]">
              <Cpu className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium text-[#545B6D] dark:text-[#CBD5E1]">Ready to Score</p>
              <p className="text-[11px] text-[#969CAF]">Select industry and budget then click Calculate Score.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
