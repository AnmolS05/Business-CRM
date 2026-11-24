import React, { useState } from 'react';
import {
  Trash2,
  Receipt,
  TrendingUp,
  TrendingDown,
  Search,
} from 'lucide-react';
import { Expense, ExpenseType, Deal } from '../types';
import { formatINR, formatLakhsCrores } from '../utils/currency';
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
 * Styled per Bridgement Design System.
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
    <div className="space-y-5">
      {/* KPI Financial Overview Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Gross Revenue Card */}
        <div className="rounded-[12px] p-5 bg-[#FCFBF9] dark:bg-[#010844] border border-[#D6DAE3] dark:border-white/10 shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.06)] transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#969CAF]">
              Gross Revenue
            </span>
            <div className="p-2 rounded-[7.2px] bg-[#00C3F0]/10 text-[#00C3F0]">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-display font-semibold text-[#010844] dark:text-white tracking-tight">
              {formatLakhsCrores(grossRevenue)}
            </div>
            <div className="text-xs text-[#969CAF] mt-1 flex items-center gap-1">
              <span className="text-[#00C3F0] font-medium">{deals.filter((d) => d.stage === 'Won').length} Won Deals</span>
            </div>
          </div>
        </div>

        {/* Total Expenditures Card */}
        <div className="rounded-[12px] p-5 bg-[#FCFBF9] dark:bg-[#010844] border border-[#D6DAE3] dark:border-white/10 shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.06)] transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#969CAF]">
              Total Expenses
            </span>
            <div className="p-2 rounded-[7.2px] bg-[#D20C54]/10 text-[#D20C54]">
              <TrendingDown className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-display font-semibold text-[#D20C54] tracking-tight">
              {formatLakhsCrores(totalExpenditures)}
            </div>
            <div className="text-xs text-[#969CAF] mt-1">
              Fixed & Variable Expenditures
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="md:col-span-2 rounded-[12px] p-5 bg-[#FCFBF9] dark:bg-[#010844] border border-[#D6DAE3] dark:border-white/10 shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.06)] transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#969CAF]">
              Net Profit Margin
            </span>
            <span className={`text-2xl sm:text-3xl font-display font-semibold tracking-tight ${netProfit >= 0 ? 'text-[#00C3F0]' : 'text-[#D20C54]'}`}>
              {profitMarginPercent}%
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className={`text-2xl sm:text-3xl font-display font-semibold tracking-tight ${netProfit >= 0 ? 'text-[#010844] dark:text-white' : 'text-[#D20C54]'}`}>
                {formatLakhsCrores(netProfit)}
              </div>
              <div className="text-xs text-[#969CAF] mt-1">
                Net earnings after operational overhead
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white dark:bg-[#040B46] px-3 py-1.5 rounded-[7.2px] border border-[#D6DAE3] dark:border-white/10">
                <span className="block text-[10px] uppercase font-semibold text-[#969CAF]">Fixed</span>
                <span className="text-xs font-mono font-medium text-[#010844] dark:text-white">{formatLakhsCrores(fixedExpensesTotal)}</span>
              </div>
              <div className="bg-white dark:bg-[#040B46] px-3 py-1.5 rounded-[7.2px] border border-[#D6DAE3] dark:border-white/10">
                <span className="block text-[10px] uppercase font-semibold text-[#969CAF]">Variable</span>
                <span className="text-xs font-mono font-medium text-[#010844] dark:text-white">{formatLakhsCrores(variableExpensesTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Input Form & Expense Ledger Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Log Expense Form */}
        <ExpenseForm 
          formData={formData} 
          setFormData={setFormData} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />

        {/* Expense Ledger Table */}
        <div className="bg-[#FCFBF9] dark:bg-[#010844] border border-[#D6DAE3] dark:border-white/10 rounded-[12px] p-5 sm:p-6 shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.06)] lg:col-span-2 flex flex-col h-fit">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-4 border-b border-[#D6DAE3] dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-lg sm:text-xl text-[#010844] dark:text-white tracking-tight">
                  Expense Ledger
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#EAF1FF] text-[#00006E] dark:bg-[#00C3F0]/20 dark:text-[#00C3F0]">
                  {filteredExpenses.length}
                </span>
              </div>
              <p className="text-[11px] text-[#969CAF] mt-0.5">Itemized corporate expenditures</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#969CAF]" />
                <input
                  type="text"
                  placeholder="Filter expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] bg-white dark:bg-[#040B46] text-[#010844] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00006E]"
                />
              </div>

              <div className="flex rounded-[7.2px] bg-white dark:bg-[#040B46] p-0.5 border border-[#D6DAE3] dark:border-white/10">
                {(['All', 'Fixed', 'Variable'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1 rounded-[5px] text-xs font-medium transition-all cursor-pointer ${
                      filterType === t
                        ? 'bg-[#D20C54] text-white shadow-sm'
                        : 'text-[#969CAF] hover:text-[#010844] dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-[8px] border border-[#D6DAE3] dark:border-white/10 bg-white dark:bg-[#040B46]/60">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[#D6DAE3] dark:border-white/10 text-[11px] font-semibold uppercase tracking-wider text-[#969CAF] bg-[#FCFBF9] dark:bg-[#040B46]">
                  <th className="py-3 px-4">Expense Item</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date Logged</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6DAE3]/50 dark:divide-white/5 text-[13px]">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-[#969CAF]">
                      <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium text-sm text-[#545B6D] dark:text-[#CBD5E1]">No expenses found</p>
                      <p className="text-xs text-[#969CAF]">Log an operational expense on the left to track ledger data.</p>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="hover:bg-[#FCFBF9] dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[#010844] dark:text-white">
                        {exp.expense_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${
                          exp.type === 'Fixed' 
                            ? 'bg-[#EAF1FF] text-[#00006E] dark:bg-[#00C3F0]/20 dark:text-[#00C3F0]' 
                            : 'bg-[#D20C54]/10 text-[#D20C54]'
                        }`}>
                          {exp.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#969CAF] text-xs">
                        {exp.date_logged}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-[#D20C54]">
                        {formatINR(exp.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1 text-[#969CAF] hover:text-[#D20C54] rounded-[4px] transition-all cursor-pointer"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredExpenses.length > 0 && (
                <tfoot className="bg-[#FCFBF9] dark:bg-[#040B46] border-t border-[#D6DAE3] dark:border-white/10 text-xs">
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-right font-medium text-[#969CAF]">
                      Filtered Total:
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#D20C54] text-sm">
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
