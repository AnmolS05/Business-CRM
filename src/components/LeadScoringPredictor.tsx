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
    <div className="relative rounded-[2.5rem] p-[1px] overflow-hidden group hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/20 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-teal-300 to-emerald-400 dark:from-emerald-500/50 dark:via-teal-500/50 dark:to-cyan-500/50 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative h-full bg-[#0a0f1c]/90 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-3xl flex flex-col gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 group-hover:scale-125 transition-all duration-1000" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-teal-500/20 group-hover:scale-125 transition-all duration-1000" />
        
        <div className="relative z-10 flex flex-wrap justify-between items-center gap-6 border-b border-emerald-500/20 pb-8">
          <div className="flex items-center gap-8">
            <div className="p-5 bg-emerald-500/10 rounded-[1.5rem] border border-emerald-500/20 text-emerald-400 shadow-inner flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
              <Cpu className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-4xl font-serif font-black text-white flex items-center gap-2 tracking-tight drop-shadow-md">
                Lead Scoring Predictor
              </h2>
              <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Powered by Custom ML Model
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          {/* Input Form */}
          <div className="flex-1 space-y-6 bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700/50 shadow-inner backdrop-blur-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" /> Lead Parameters
            </h3>
            
            <div className="relative group/input">
              <select 
                value={leadIndustry}
                onChange={(e) => setLeadIndustry(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-white appearance-none shadow-inner transition-all group-hover/input:border-slate-600"
              >
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
              <label className="absolute top-2 left-5 text-[10px] font-black text-emerald-500 uppercase tracking-widest pointer-events-none">Industry</label>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative group/input">
              <input 
                type="number"
                value={leadBudget}
                onChange={(e) => setLeadBudget(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 placeholder-transparent peer"
                placeholder="Budget"
              />
              <label className="absolute top-2 left-5 text-[10px] font-black text-emerald-500 uppercase tracking-widest pointer-events-none transition-all peer-placeholder-shown:text-slate-500 peer-focus:text-emerald-500">Estimated Budget (INR)</label>
            </div>

            <button
              onClick={fetchCustomMlPrediction}
              disabled={loadingCustomMl}
              className="w-full mt-6 px-6 py-4 text-[13px] font-black tracking-widest uppercase bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 active:scale-95 border border-emerald-400/20"
            >
              <RefreshCw className={`w-5 h-5 stroke-[3] ${loadingCustomMl ? 'animate-spin' : ''}`} />
              {loadingCustomMl ? 'Scoring Lead...' : 'Calculate Score'}
            </button>
          </div>

          {/* Prediction Output */}
          <div className="flex-1">
            {loadingCustomMl ? (
              <div className="h-full w-full bg-slate-900/60 rounded-[2rem] border border-emerald-500/20 flex flex-col items-center justify-center gap-6 min-h-[300px] backdrop-blur-xl shadow-inner relative overflow-hidden">
                 <div className="absolute inset-0 bg-emerald-500/5 blur-[50px] rounded-full animate-pulse pointer-events-none" />
                 <div className="relative z-10">
                   <div className="w-16 h-16 border-[4px] border-emerald-900/50 rounded-full"></div>
                   <div className="w-16 h-16 border-[4px] border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                 </div>
                 <p className="text-[11px] font-black text-emerald-400/80 animate-pulse tracking-widest uppercase relative z-10">Running ML Model...</p>
              </div>
            ) : (
              <div className="h-full w-full bg-slate-900/60 rounded-[2rem] border border-emerald-500/30 text-sm leading-relaxed text-slate-200 backdrop-blur-xl shadow-inner relative overflow-hidden group/box p-10 flex flex-col justify-center transition-all hover:border-emerald-400/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-teal-600" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none group-hover/box:bg-emerald-500/10 transition-colors duration-1000" />
                <div className="font-black text-[11px] text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Cpu className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  Model Output Prediction
                </div>
                <div className="whitespace-pre-wrap font-serif text-[17px] text-slate-300 leading-[1.8] relative z-10">
                  {customMlPrediction || 'Enter lead parameters and run the model to get a conversion score.'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
