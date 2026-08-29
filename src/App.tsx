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
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 relative overflow-hidden">
      
      {/* Global Ambient OS-level Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/20">
        {/* Animated Particles & Glows */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60 animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse" style={{ animationDuration: '10s' }} />
        
        {/* Interactive Cursor Tracking Orb */}
        <div 
          className="absolute w-[400px] h-[400px] bg-indigo-400/20 dark:bg-blue-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen transition-transform duration-700 ease-out"
          style={{ transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)` }}
        />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTU2LCAxNjMsIDE3NSwgMC4xNSkiLz48L3N2Zz4=')] opacity-50 dark:opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 w-full max-w-[1920px] mx-auto">
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
            className={`fixed bottom-8 right-8 z-[100] px-8 py-5 rounded-[2rem] shadow-2xl border text-[13px] font-black uppercase tracking-widest flex items-center gap-5 animate-in slide-in-from-bottom-10 fade-in duration-500 backdrop-blur-3xl transition-all ${
              notification.type === 'error'
                ? 'bg-white/95 text-rose-700 border-rose-200 shadow-rose-500/30 dark:bg-rose-950/90 dark:text-rose-400 dark:border-rose-900/50'
                : 'bg-white/95 text-indigo-900 border-indigo-200 shadow-indigo-500/30 dark:bg-slate-900/90 dark:text-blue-400 dark:border-blue-900/50'
            }`}
          >
            {notification.type === 'error' ? (
              <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-2xl shadow-inner">
                <AlertCircle className="w-6 h-6 shrink-0 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
              </div>
            ) : (
              <div className="relative flex items-center justify-center p-3 bg-indigo-100/50 dark:bg-blue-900/30 rounded-2xl shadow-inner">
                <div className="w-3 h-3 rounded-full bg-emerald-500 absolute shadow-[0_0_15px_rgba(16,185,129,1)] animate-ping opacity-75" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 relative z-10" />
              </div>
            )}
            <span className="pr-4">{notification.message}</span>
          </div>
        )}

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 mt-2">
          {loading ? (
            <div className="min-h-[75vh] flex flex-col items-center justify-center gap-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/50 dark:border-slate-800/50 rounded-[3rem] p-12 text-center shadow-2xl shadow-indigo-900/5 dark:shadow-none relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 pointer-events-none" />
              
              <div className="relative w-40 h-40 flex items-center justify-center z-10">
                <div className="absolute inset-0 bg-indigo-500/20 dark:bg-blue-500/20 blur-[80px] rounded-full animate-pulse" />
                <div className="absolute inset-0 border-[8px] border-indigo-100 dark:border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-[8px] border-indigo-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                <RefreshCw className="w-12 h-12 text-indigo-600 dark:text-blue-400 relative z-10 animate-pulse stroke-[2.5]" />
              </div>
              <div className="space-y-4 z-10 relative">
                <h3 className="font-serif font-black text-4xl text-gray-900 dark:text-slate-100 tracking-tight">
                  Initializing CapitalFlow
                </h3>
                <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-blue-400 animate-pulse">
                  Connecting to secure database & loading AI models...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="min-h-[75vh] flex flex-col items-center justify-center p-12 bg-rose-50/80 dark:bg-rose-950/40 backdrop-blur-3xl border border-rose-200 dark:border-rose-900/50 rounded-[3rem] text-rose-700 dark:text-rose-300 gap-8 text-center shadow-2xl shadow-rose-500/10 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-rose-900/5 dark:from-rose-500/10 dark:to-rose-900/10 pointer-events-none" />
              
              <div className="p-8 bg-white dark:bg-rose-900/50 rounded-[2.5rem] shadow-2xl shadow-rose-500/20 relative z-10">
                <AlertCircle className="w-16 h-16 text-rose-500 dark:text-rose-400 stroke-[2.5]" />
              </div>
              <p className="font-black text-3xl font-serif relative z-10">{error}</p>
              <button
                onClick={fetchData}
                className="px-10 py-5 text-sm font-black uppercase tracking-widest bg-rose-600 dark:bg-rose-500 text-white rounded-2xl shadow-2xl shadow-rose-500/30 hover:bg-rose-500 dark:hover:bg-rose-400 hover:-translate-y-1 active:scale-95 transition-all relative z-10"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
