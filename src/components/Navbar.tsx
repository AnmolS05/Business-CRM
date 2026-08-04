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
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
    <div className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <header className="mx-auto max-w-7xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-slate-700/50 rounded-[2.5rem] shadow-2xl dark:shadow-indigo-900/20 overflow-hidden relative group/nav">
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 pointer-events-none" />
        
        <div className="relative px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-5 cursor-pointer group">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center justify-center text-white font-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
              <IndianRupee className="w-7 h-7 stroke-[3]" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-serif text-2xl font-black tracking-tight text-gray-900 dark:text-slate-100">
                  CapitalFlow
                </h1>
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 shadow-sm">
                  Pro
                </span>
              </div>
              <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                AI Powered Intelligence
              </p>
            </div>
          </div>

          {/* Premium Dock Navigation */}
          <div className="flex justify-center flex-1 w-full sm:w-auto">
            <div className="inline-flex space-x-2 p-2 bg-gray-100/60 dark:bg-slate-950/40 backdrop-blur-md border border-gray-200/80 dark:border-slate-800/80 rounded-[2rem] shadow-inner scrollbar-none w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`px-6 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto ${
                  activeTab === 'kanban'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-blue-400 shadow-lg border border-gray-200/80 dark:border-slate-700/60'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Layers className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden lg:inline">Pipeline</span>
              </button>

              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-6 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto ${
                  activeTab === 'expenses'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-blue-400 shadow-lg border border-gray-200/80 dark:border-slate-700/60'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Receipt className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden lg:inline">Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto ${
                  activeTab === 'analytics'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-blue-400 shadow-lg border border-gray-200/80 dark:border-slate-700/60'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <BarChart3 className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden lg:inline">Stats & AI</span>
              </button>

              <button
                onClick={() => setActiveTab('docs')}
                className={`px-6 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto ${
                  activeTab === 'docs'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-blue-400 shadow-lg border border-gray-200/80 dark:border-slate-700/60'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden lg:inline">Parser</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Reset */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right text-xs pr-4 border-r border-gray-200/80 dark:border-slate-700/80">
              <span className="text-gray-500 dark:text-slate-400 block text-[9px] font-black uppercase tracking-widest mb-0.5">Active Deals</span>
              <strong className="font-serif text-gray-900 dark:text-slate-100 font-bold text-sm">
                {totalDealsCount}
              </strong>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-4 text-gray-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-blue-400 bg-gray-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-gray-200/80 dark:border-slate-700/60 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-inner"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400 stroke-[2.5]" /> : <Moon className="w-5 h-5 stroke-[2.5]" />}
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset database to default sample Indian business deals & expenses?')) {
                  onResetDb();
                }
              }}
              className="p-4 text-gray-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-gray-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-gray-200/80 dark:border-slate-700/60 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-inner"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
