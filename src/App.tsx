import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { KanbanPipeline } from './components/KanbanPipeline';
import { ExpenseTracker } from './components/ExpenseTracker';
import { StatisticsDashboard } from './components/StatisticsDashboard';
import { DocumentParser } from './components/DocumentParser';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useAppData } from './hooks/useAppData';

/**
 * Main Application root component orchestrating state, tab navigation, and API synchronizations.
 * Redesigned with the Bridgement finance-forward design system.
 *
 * @returns {React.ReactElement} Main App layout.
 */
export default function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<'kanban' | 'expenses' | 'analytics' | 'docs'>('kanban');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const {
    deals,
    expenses,
    loading,
    error,
    notification,
    handleAddDeal,
    handleUpdateDeal,
    handleDeleteDeal,
    handleAddExpense,
    handleDeleteExpense,
    handleResetDb,
    fetchData,
  } = useAppData();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Metric calculation for Navbar KPI
  const grossRevenue = deals
    .filter((d) => d.stage === 'Won')
    .reduce((sum, d) => sum + d.deal_value, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossRevenue - totalExpenses;

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#545B6D] font-sans antialiased flex flex-col selection:bg-[#D20C54] selection:text-white dark:bg-[#05081E] dark:text-[#FDF5F8] transition-colors duration-300 relative overflow-hidden">
      
      {/* Bridgement Ambient Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Magenta Brand Accent Orb */}
        <div 
          className="absolute top-0 right-0 w-[35vw] h-[35vw] bg-[#D20C54]/5 dark:bg-[#D20C54]/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" 
          style={{ animationDuration: '9s' }} 
        />
        {/* Soft Cyan Data Accent Orb */}
        <div 
          className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#00C3F0]/5 dark:bg-[#00C3F0]/10 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-60 animate-pulse" 
          style={{ animationDuration: '13s' }} 
        />
        {/* Deep Navy Atmosphere */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] bg-[#00006E]/3 dark:bg-[#010844]/40 rounded-full blur-[160px] pointer-events-none" 
        />
        
        {/* Interactive Subtle Cursor Follower */}
        <div 
          className="absolute w-[360px] h-[360px] bg-[#99AFFD]/10 dark:bg-[#00C3F0]/5 rounded-full blur-[100px] pointer-events-none transition-transform duration-700 ease-out"
          style={{ transform: `translate(${mousePos.x - 180}px, ${mousePos.y - 180}px)` }}
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1 w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onResetDb={handleResetDb}
          totalDealsCount={deals.length}
          netProfit={netProfit}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-[12px] shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.12)] border text-[13px] font-medium flex items-center gap-4 animate-in slide-in-from-bottom-6 fade-in duration-300 backdrop-blur-xl transition-all ${
              notification.type === 'error'
                ? 'bg-white/95 text-rose-700 border-rose-200 dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-900/50'
                : 'bg-white/95 text-[#010844] border-[#D6DAE3] dark:bg-[#010844]/95 dark:text-white dark:border-white/10'
            }`}
          >
            {notification.type === 'error' ? (
              <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
              </div>
            ) : (
              <div className="relative flex items-center justify-center p-2 bg-[#D20C54]/10 dark:bg-[#D20C54]/20 rounded-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D20C54]" />
              </div>
            )}
            <span className="pr-2">{notification.message}</span>
          </div>
        )}

        <main className="flex-1 w-full py-4 mt-1">
          {loading ? (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 bg-[#FCFBF9] dark:bg-[#010844]/60 border border-[#D6DAE3] dark:border-white/10 rounded-[12px] p-12 text-center shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.06)] relative overflow-hidden">
              <div className="relative w-28 h-28 flex items-center justify-center z-10">
                <div className="absolute inset-0 bg-[#D20C54]/15 rounded-full blur-[30px] animate-pulse" />
                <div className="absolute inset-0 border-4 border-[#EAF1FF] dark:border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#D20C54] border-t-transparent rounded-full animate-spin" style={{ animationDuration: '1.2s' }} />
                <RefreshCw className="w-8 h-8 text-[#D20C54] relative z-10 animate-pulse" />
              </div>
              <div className="space-y-2 z-10 relative">
                <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#545B6D] dark:text-[#FDF5F8] tracking-tight">
                  Loading CapitalFlow
                </h3>
                <p className="text-[13px] text-[#969CAF] dark:text-slate-400">
                  Initializing Indian enterprise pipeline & AI analytics...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-10 bg-white dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-[12px] text-rose-700 dark:text-rose-300 gap-6 text-center shadow-lg relative overflow-hidden">
              <div className="p-4 bg-rose-50 dark:bg-rose-900/50 rounded-xl relative z-10">
                <AlertCircle className="w-10 h-10 text-rose-500 dark:text-rose-400" />
              </div>
              <p className="font-medium text-2xl font-display relative z-10">{error}</p>
              <button
                onClick={fetchData}
                className="btn-primary relative z-10"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {activeTab === 'kanban' && (
                <KanbanPipeline
                  deals={deals}
                  onAddDeal={handleAddDeal}
                  onUpdateDeal={handleUpdateDeal}
                  onDeleteDeal={handleDeleteDeal}
                />
              )}

              {activeTab === 'expenses' && (
                <ExpenseTracker
                  expenses={expenses}
                  deals={deals}
                  onAddExpense={handleAddExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              )}

              {activeTab === 'analytics' && (
                <StatisticsDashboard deals={deals} expenses={expenses} isDarkMode={isDarkMode} />
              )}

              {activeTab === 'docs' && <DocumentParser isDarkMode={isDarkMode} />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
