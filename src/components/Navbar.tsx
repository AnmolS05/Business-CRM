import React from 'react';
import {
  IndianRupee,
  Layers,
  Receipt,
  BarChart3,
  FileSpreadsheet,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';

/**
 * Props for the Navbar component.
 */
interface NavbarProps {
  /** Active navigation tab identifier */
  activeTab: 'kanban' | 'expenses' | 'analytics' | 'docs';
  /** Tab state setter callback */
  setActiveTab: (tab: 'kanban' | 'expenses' | 'analytics' | 'docs') => void;
  /** Callback to trigger database reset */
  onResetDb: () => void;
  /** Total count of sales deals */
  totalDealsCount: number;
  /** Calculated net profit figure in INR */
  netProfit: number;
  /** Whether dark mode is active */
  isDarkMode: boolean;
  /** Function to toggle dark mode */
  toggleDarkMode: () => void;
}

/**
 * Navigation bar header providing branding, KPI overview metrics, database reset, and tab selection.
 *
 * @param {NavbarProps} props Component properties.
 * @returns {React.ReactElement} Header navigation layout.
 */
export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetDb,
  totalDealsCount,
  netProfit,
  isDarkMode,
  toggleDarkMode,
}) => {
  const getTabClass = (tabId: string) => {
    const baseClass = "px-6 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto ";
    if (activeTab === tabId) {
      return baseClass + "bg-indigo-600 text-white shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-400/50 scale-105 z-10 relative";
    }
    return baseClass + "text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80 border border-transparent hover:scale-[1.02] active:scale-95";
  };

  return (
    <div className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <header className="mx-auto max-w-7xl bg-[#0a0f1c]/80 backdrop-blur-3xl border border-indigo-500/20 rounded-[3rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] overflow-hidden relative group/nav">
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        
        <div className="relative px-8 py-5 flex flex-col lg:flex-row justify-between items-center gap-6 z-10">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-5 cursor-pointer group">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl shadow-inner border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black group-hover:scale-110 group-hover:rotate-6 group-hover:bg-indigo-500/20 transition-all duration-500 ease-out">
              <IndianRupee className="w-7 h-7 stroke-[3]" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-serif text-3xl font-black tracking-tight text-white drop-shadow-md">
                  CapitalFlow
                </h1>
                <span className="relative flex h-5 w-auto items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-sm">
                    Pro
                  </span>
                </span>
              </div>
              <p className="text-[10px] font-black text-indigo-500 flex items-center gap-2 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                AI Powered Intelligence
              </p>
            </div>
          </div>

          {/* Premium Dock Navigation */}
          <div className="flex justify-center flex-1 w-full sm:w-auto">
            <div className="inline-flex space-x-2 p-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-[2rem] shadow-inner scrollbar-none w-full sm:w-auto overflow-x-auto relative">
              <button
                onClick={() => setActiveTab('kanban')}
                className={getTabClass('kanban')}
              >
                <Layers className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden lg:inline">Pipeline</span>
              </button>

              <button
                onClick={() => setActiveTab('expenses')}
                className={getTabClass('expenses')}
              >
                <Receipt className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden lg:inline">Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={getTabClass('analytics')}
              >
                <BarChart3 className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden lg:inline">Stats & AI</span>
              </button>

              <button
                onClick={() => setActiveTab('docs')}
                className={getTabClass('docs')}
              >
                <FileSpreadsheet className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden lg:inline">Parser</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Reset */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative group/stat text-right text-xs pr-6 border-r border-indigo-500/20 cursor-default">
              <span className="text-slate-500 block text-[9px] font-black uppercase tracking-widest mb-1 transition-colors group-hover/stat:text-indigo-400">Active Deals</span>
              <strong className="font-serif text-white font-black text-xl transition-colors drop-shadow-md">
                {totalDealsCount}
              </strong>
              
              {/* Premium Hover Tooltip */}
              <div className="absolute top-[120%] right-6 w-56 bg-slate-900/90 backdrop-blur-xl text-white p-5 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.5)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 pointer-events-none z-50 border border-slate-700/80">
                <div className="absolute -top-2 right-8 w-4 h-4 bg-slate-900/90 rotate-45 border-t border-l border-slate-700/80" />
                <div className="relative z-10 text-left">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Profit</span>
                  <span className={`font-mono text-xl font-black drop-shadow-md ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{(netProfit / 100000).toFixed(2)}L
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset database to default sample Indian business deals & expenses?')) {
                  onResetDb();
                }
              }}
              className="p-4 text-slate-400 hover:text-rose-400 bg-slate-900/50 hover:bg-slate-800 border border-slate-700/60 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-inner"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
