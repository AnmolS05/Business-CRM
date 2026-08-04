import React, { useState, useEffect } from 'react';
import { Deal, Expense } from './types';
import { Navbar } from './components/Navbar';
import { KanbanPipeline } from './components/KanbanPipeline';
import { ExpenseTracker } from './components/ExpenseTracker';
import { StatisticsDashboard } from './components/StatisticsDashboard';
import { DocumentParser } from './components/DocumentParser';
import { RefreshCw, AlertCircle } from 'lucide-react';
import {
  fetchDealsApi,
  createDealApi,
  updateDealApi,
  deleteDealApi,
  fetchExpensesApi,
  createExpenseApi,
  deleteExpenseApi,
  resetDatabaseApi,
} from './api/apiClient';

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
  const [deals, setDeals] = useState<Deal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /**
   * Helper function to display transient toast notifications.
   *
   * @param {string} message Text message to display.
   * @param {'success' | 'error'} type Notification severity.
   */
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  /**
   * Fetches initial sales deals and expenses from backend API.
   */
  const fetchData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const [dealsData, expData] = await Promise.all([
        fetchDealsApi(),
        fetchExpensesApi(),
      ]);

      setDeals(dealsData);
      setExpenses(expData);
    } catch (err: unknown) {
      console.error('[App Data Fetch Error]:', err);
      const msg = err instanceof Error ? err.message : 'Error connecting to database';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  /**
   * Handles creating a new sales deal record via API.
   *
   * @param {Omit<Deal, 'id'>} newDeal Deal parameters.
   */
  const handleAddDeal = async (newDeal: Omit<Deal, 'id'>): Promise<void> => {
    try {
      const created = await createDealApi(newDeal);
      setDeals((prev) => [...prev, created]);
      showNotification(`Deal for "${created.client_name}" added successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding deal';
      showNotification(msg, 'error');
    }
  };

  /**
   * Handles updating an existing deal by ID with optimistic state update.
   *
   * @param {string} id Target deal ID.
   * @param {Partial<Deal>} updates Modified deal properties.
   */
  const handleUpdateDeal = async (id: string, updates: Partial<Deal>): Promise<void> => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );

    try {
      await updateDealApi(id, updates);
    } catch (err: unknown) {
      console.error('[Update Deal Error]:', err);
      fetchData();
      showNotification('Failed to update deal on server.', 'error');
    }
  };

  /**
   * Handles deleting a deal record by ID.
   *
   * @param {string} id Unique deal identifier.
   */
  const handleDeleteDeal = async (id: string): Promise<void> => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    try {
      await deleteDealApi(id);
      showNotification('Deal deleted successfully.');
    } catch (err: unknown) {
      console.error('[Delete Deal Error]:', err);
      fetchData();
      showNotification('Failed to delete deal from server.', 'error');
    }
  };

  /**
   * Handles adding a new expense item via API.
   *
   * @param {Omit<Expense, 'id'>} newExpense New expense fields.
   */
  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>): Promise<void> => {
    try {
      const created = await createExpenseApi(newExpense);
      setExpenses((prev) => [created, ...prev]);
      showNotification(`Expense "${created.expense_name}" logged successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding expense';
      showNotification(msg, 'error');
    }
  };

  /**
   * Handles deleting an expense item by ID.
   *
   * @param {string} id Unique expense identifier.
   */
  const handleDeleteExpense = async (id: string): Promise<void> => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteExpenseApi(id);
      showNotification('Expense removed successfully.');
    } catch (err: unknown) {
      console.error('[Delete Expense Error]:', err);
      fetchData();
      showNotification('Failed to delete expense from server.', 'error');
    }
  };

  /**
   * Resets database state to default sample Indian business data records.
   */
  const handleResetDb = async (): Promise<void> => {
    try {
      const data = await resetDatabaseApi();
      setDeals(data.deals || []);
      setExpenses(data.expenses || []);
      showNotification('Database reset to sample Indian business data defaults.');
    } catch (err: unknown) {
      console.error('[Reset DB Error]:', err);
      showNotification('Failed to reset database.', 'error');
    }
  };

  // Metric calculation for Navbar KPI
  const grossRevenue = deals
    .filter((d) => d.stage === 'Won')
    .reduce((sum, d) => sum + d.deal_value, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossRevenue - totalExpenses;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 relative overflow-hidden">
      
      {/* Global Ambient OS-level Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Right Glow */}
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Bottom Left Glow */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '12s' }} />
        {/* Center Accent */}
        <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-30" />
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
