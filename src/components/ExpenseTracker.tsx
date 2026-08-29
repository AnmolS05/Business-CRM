import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Receipt,
  TrendingUp,
  TrendingDown,
  Search,
  PieChart,
} from 'lucide-react';
import { Expense, ExpenseType, Deal } from '../types';
import { formatINR, formatLakhsCrores, formatIndianFullWithCompact } from '../utils/currency';
import { ExpenseForm } from './ExpenseForm';

/**
 * Props for ExpenseTracker component.
 */
interface ExpenseTrackerProps {
  /** Array of expense records */
  expenses: Expense[];
  /** Array of sales deals */
  deals: Deal[];
  /** Handler to create a new expense */
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  /** Handler to delete an expense */
  onDeleteExpense: (id: string) => Promise<void>;
}

/**
 * Enterprise Expense Ledger & Profitability Component.
 * Tracks itemized company expenses, calculates net profit against won sales revenue, and filters expenditures.
 *
 * @param {ExpenseTrackerProps} props Component properties.
 * @returns {React.ReactElement} Expense tracking layout.
 */
export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  deals,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Fixed' | 'Variable'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Form State
  const [formData, setFormData] = useState({
    expense_name: '',
    amount: 15000,
    type: 'Fixed' as ExpenseType,
    date_logged: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial KPI Calculations
  const grossRevenue = deals
    .filter((d) => d.stage === 'Won')
    .reduce((sum, d) => sum + d.deal_value, 0);

  const totalExpenditures = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fixedExpensesTotal = expenses
    .filter((e) => e.type === 'Fixed')
    .reduce((sum, e) => sum + e.amount, 0);
  const variableExpensesTotal = expenses
    .filter((e) => e.type === 'Variable')
    .reduce((sum, e) => sum + e.amount, 0);

  const netProfit = grossRevenue - totalExpenditures;
  const profitMarginPercent =
    grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0';

  /**
   * Handles expense creation submission.
   *
   * @param {React.FormEvent} e Form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.expense_name.trim() || formData.amount <= 0) return;

    setIsSubmitting(true);
    try {
      await onAddExpense(formData);
      setFormData({
        expense_name: '',
        amount: 15000,
        type: 'Fixed',
        date_logged: new Date().toISOString().split('T')[0],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExpenses = expenses
    .filter((e) => {
      const matchesSearch = e.expense_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || e.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date_logged).getTime();
        const dateB = new Date(b.date_logged).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  return (
    <div className="space-y-6">
      {/* KPI Financial Overview Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Gross Revenue Card */}
        <div className="relative group rounded-[2.5rem] p-8 overflow-hidden bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-blue-100/50 dark:border-slate-800/80 shadow-xl shadow-blue-900/5 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
              Gross Revenue
            </span>
            <div className="p-3.5 rounded-[1.25rem] bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/60 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-4xl font-serif font-black text-gray-900 dark:text-slate-100 tracking-tight">
              {formatLakhsCrores(grossRevenue)}
            </div>
            <div className="text-xs font-bold text-gray-400 dark:text-slate-500 mt-2.5 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {deals.filter((d) => d.stage === 'Won').length} Won Deals</span>
            </div>
          </div>
        </div>

        {/* Total Expenditures Card */}
        <div className="relative group rounded-[2.5rem] p-8 overflow-hidden bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-rose-100/50 dark:border-slate-800/80 shadow-xl shadow-rose-900/5 dark:shadow-none hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-rose-500/10 dark:bg-rose-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
              Total Expenses
            </span>
            <div className="p-3.5 rounded-[1.25rem] bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-800/60 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <TrendingDown className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-4xl font-serif font-black text-rose-600 dark:text-rose-400 tracking-tight">
              <span className="animate-in zoom-in-95 duration-300 inline-block">{formatLakhsCrores(totalExpenditures)}</span>
            </div>
            <div className="text-xs font-bold text-gray-400 dark:text-slate-500 mt-2.5 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600" /> Across all categories
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="relative md:col-span-2 group rounded-[2.5rem] p-8 overflow-hidden bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-indigo-100/50 dark:border-slate-800/80 shadow-xl shadow-indigo-900/5 dark:shadow-none hover:shadow-2xl transition-all duration-500">
          <div className={`absolute -top-10 -right-10 w-64 h-64 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 group-hover:scale-150 ${netProfit >= 0 ? 'bg-emerald-500/10 dark:bg-emerald-500/15 group-hover:bg-emerald-500/20' : 'bg-rose-500/10 dark:bg-rose-500/15 group-hover:bg-rose-500/20'}`} />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
              Net Profit Margin
            </span>
            <div className="text-right">
              <span className={`text-4xl font-serif font-black tracking-tight drop-shadow-sm ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {profitMarginPercent}%
              </span>
            </div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className={`text-3xl font-serif font-black tracking-tight ${netProfit >= 0 ? 'text-gray-900 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'}`}>
                {formatLakhsCrores(netProfit)}
              </div>
              <div className="text-xs font-bold text-gray-400 dark:text-slate-500 mt-2 flex items-center gap-1.5 uppercase tracking-wide">
                 <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600" /> Net Earnings After Operating Costs
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 dark:bg-slate-950/40 px-4 py-2 rounded-[1rem] border border-gray-100 dark:border-slate-800 shadow-inner">
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-0.5">Fixed OpEx</span>
                <span className="text-sm font-bold font-mono text-gray-900 dark:text-slate-300">{formatLakhsCrores(fixedExpensesTotal)}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-950/40 px-4 py-2 rounded-[1rem] border border-gray-100 dark:border-slate-800 shadow-inner">
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-0.5">Variable</span>
                <span className="text-sm font-bold font-mono text-gray-900 dark:text-slate-300">{formatLakhsCrores(variableExpensesTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Input Form & Expense Ledger Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Expense Form */}
        <ExpenseForm 
          formData={formData} 
          setFormData={setFormData} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />

        {/* Expense Ledger Table */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-gray-200 dark:border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-gray-900/5 dark:shadow-none transition-all duration-500 lg:col-span-2 flex flex-col h-fit">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 pb-6 border-b border-gray-100 dark:border-slate-800/80">
            <div>
              <h3 className="font-serif font-black text-3xl text-gray-900 dark:text-slate-100 flex items-center gap-4 tracking-tight">
                Expense Ledger
                <span className="text-[11px] font-black px-4 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30 shadow-inner tracking-widest">
                  {filteredExpenses.length}
                </span>
              </h3>
              <p className="text-[11px] font-black text-gray-400 dark:text-slate-500 mt-2 uppercase tracking-widest">Itemized Company Expenditures</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="w-5 h-5 stroke-[2.5] absolute left-5 top-[18px] text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-72 pl-14 pr-6 py-4 text-sm font-bold border border-gray-200 dark:border-slate-700/80 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-blue-500/20 outline-none transition-all shadow-inner"
                />
              </div>

              <div className="flex rounded-[1.5rem] bg-gray-50/80 dark:bg-slate-950/40 p-2 border border-gray-200/80 dark:border-slate-700/80 shadow-inner w-full sm:w-auto">
                {(['All', 'Fixed', 'Variable'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all ${
                      filterType === t
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-blue-400 shadow-md border border-gray-200/50 dark:border-slate-600/50'
                        : 'text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex rounded-[1.5rem] bg-gray-50/80 dark:bg-slate-950/40 p-2 border border-gray-200/80 dark:border-slate-700/80 shadow-inner w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (sortBy === 'date') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortBy('date'); setSortOrder('desc'); }
                  }}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all ${
                    sortBy === 'date'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-blue-400 shadow-md border border-gray-200/50 dark:border-slate-600/50'
                      : 'text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  Date {sortBy === 'date' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </button>
                <button
                  onClick={() => {
                    if (sortBy === 'amount') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortBy('amount'); setSortOrder('desc'); }
                  }}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all ${
                    sortBy === 'amount'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-blue-400 shadow-md border border-gray-200/50 dark:border-slate-600/50'
                      : 'text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  Amount {sortBy === 'amount' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-[1.5rem] border border-gray-200/80 dark:border-slate-700/80 shadow-inner flex-1 bg-white/40 dark:bg-slate-950/20">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200/80 dark:border-slate-700/80 text-[10px] font-black tracking-widest uppercase text-gray-400 dark:text-slate-500 bg-gray-50/80 dark:bg-slate-900/90 backdrop-blur-md">
                  <th className="p-6 pl-8">Expense Item</th>
                  <th className="p-6">Category</th>
                  <th className="p-6">Date Logged</th>
                  <th className="p-6 text-right">Amount (₹)</th>
                  <th className="p-6 pr-8 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center relative overflow-hidden group">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 dark:bg-rose-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                      <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="relative p-10 bg-white/70 dark:bg-slate-900/60 rounded-full border border-gray-200/50 dark:border-slate-700/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl group-hover:-translate-y-3 group-hover:shadow-[0_30px_60px_-15px_rgba(244,63,94,0.15)] transition-all duration-500">
                          <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/50 to-transparent dark:from-rose-900/20 dark:to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          <Receipt className="w-14 h-14 text-gray-400 dark:text-slate-500 stroke-[2] relative z-10 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors duration-500" />
                        </div>
                        <div className="space-y-3 relative z-10">
                          <h4 className="font-serif font-black text-3xl text-gray-900 dark:text-slate-100 tracking-tight">Ledger Empty</h4>
                          <p className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed px-4">
                            No expenditures found. Log an expense on the left to start tracking profitability.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="hover:bg-gray-50/90 dark:hover:bg-slate-800/80 transition-all duration-200 group relative"
                    >
                      <td className="p-6 pl-8 font-black text-gray-900 dark:text-slate-200 text-[15px]">
                        {exp.expense_name}
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border shadow-sm ${
                          exp.type === 'Fixed' 
                            ? 'bg-blue-50/80 text-blue-600 border-blue-200/80 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800/60' 
                            : 'bg-amber-50/80 text-amber-600 border-amber-200/80 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/60'
                        }`}>
                          {exp.type}
                        </span>
                      </td>
                      <td className="p-6 text-gray-500 dark:text-slate-400 text-xs font-bold tracking-widest uppercase">
                        {exp.date_logged}
                      </td>
                      <td className="p-6 text-right">
                        <div className="font-mono font-black text-rose-600 dark:text-rose-400 text-base">
                          {formatINR(exp.amount)}
                        </div>
                      </td>
                      <td className="p-6 pr-8 text-center">
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-3.5 rounded-xl text-gray-400 dark:text-slate-500 opacity-50 group-hover:opacity-100 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-all duration-300 hover:scale-110 active:scale-95 mx-auto block shadow-inner border border-transparent hover:border-rose-100 dark:hover:border-rose-500/30"
                          title="Delete expense"
                        >
                          <Trash2 className="w-5 h-5 stroke-[2.5]" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredExpenses.length > 0 && (
                <tfoot className="bg-gray-50/50 dark:bg-slate-900/50 border-t-2 border-gray-200/80 dark:border-slate-700/80">
                  <tr>
                    <td colSpan={3} className="p-6 pl-8 text-right font-black tracking-widest uppercase text-gray-500 dark:text-slate-400 text-[11px]">
                      Filtered Total:
                    </td>
                    <td className="p-6 text-right font-mono font-black text-rose-600 dark:text-rose-400 text-lg">
                      {formatINR(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
