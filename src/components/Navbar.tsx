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
 * Styled to Bridgement design specifications (Deep Navy #010844 + Magenta #D20C54 + Cyan #00C3F0).
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
    const baseClass = "h-[38px] sm:h-[43.2px] px-3 sm:px-4 rounded-[7.2px] text-[13px] sm:text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2 shrink-0 cursor-pointer ";
    if (activeTab === tabId) {
      return baseClass + "bg-[#D20C54] text-white shadow-sm";
    }
    return baseClass + "text-[#EAF1FF]/80 hover:text-white hover:bg-white/10 active:scale-95";
  };

  return (
    <div className="sticky top-2 z-40 w-full transition-all duration-200 py-1">
      <header className="w-full bg-[#010844] border border-white/10 rounded-[12px] shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.15)] overflow-hidden relative text-white">
        
        <div className="px-4 sm:px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3.5 cursor-pointer">
            <div className="w-10 h-10 bg-[#D20C54] rounded-[7.2px] flex items-center justify-center text-white font-bold shadow-sm">
              <IndianRupee className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  CapitalFlow
                </h1>
                <span className="inline-flex rounded-[4px] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#00C3F0] text-[#010844]">
                  Pro
                </span>
                <span className="inline-flex rounded-[4px] px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#99AFFD] bg-white/10 border border-white/10">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-[#99AFFD] font-normal tracking-tight">
                Indian Enterprise CRM & AI Advisor
              </p>
            </div>
          </div>

          {/* Bridgement Pill Navigation Dock */}
          <div className="flex justify-center flex-1 w-full md:w-auto">
            <nav className="inline-flex space-x-1.5 p-1 bg-[#040B46] border border-white/10 rounded-[9px] w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('kanban')}
                className={getTabClass('kanban')}
              >
                <Layers className="w-4 h-4" />
                <span>Pipeline</span>
              </button>

              <button
                onClick={() => setActiveTab('expenses')}
                className={getTabClass('expenses')}
              >
                <Receipt className="w-4 h-4" />
                <span>Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={getTabClass('analytics')}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & AI</span>
              </button>

              <button
                onClick={() => setActiveTab('docs')}
                className={getTabClass('docs')}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Doc Parser</span>
              </button>
            </nav>
          </div>

          {/* Quick Metrics, Theme Toggle & Reset */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {/* Net Profit Pill */}
            <div className="hidden sm:flex flex-col text-right px-3 py-1 bg-[#040B46] border border-white/10 rounded-[7.2px]">
              <span className="text-[10px] text-[#969CAF] uppercase font-medium tracking-wider">Net Profit</span>
              <span className={`font-mono text-sm font-semibold ${netProfit >= 0 ? 'text-[#00C3F0]' : 'text-[#ff547e]'}`}>
                ₹{(netProfit / 100000).toFixed(2)}L
              </span>
            </div>

            {/* Active Deals Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#040B46] border border-white/10 rounded-[7.2px] text-xs">
              <span className="text-[#969CAF]">Deals:</span>
              <strong className="text-white font-semibold">{totalDealsCount}</strong>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-[#EAF1FF]/80 hover:text-white bg-[#040B46] hover:bg-white/10 border border-white/10 rounded-[7.2px] transition-all cursor-pointer"
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset Database Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset database to default sample Indian business deals & expenses?')) {
                  onResetDb();
                }
              }}
              className="p-2 text-[#EAF1FF]/80 hover:text-[#ff547e] bg-[#040B46] hover:bg-rose-500/10 border border-white/10 rounded-[7.2px] transition-all cursor-pointer"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
