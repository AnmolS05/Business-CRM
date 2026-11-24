import React from 'react';
import { Plus, Receipt } from 'lucide-react';
import { ExpenseType } from '../types';
import { formatINR } from '../utils/currency';

interface ExpenseFormProps {
  formData: {
    expense_name: string;
    amount: number;
    type: ExpenseType;
    date_logged: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="bg-[#FCFBF9] dark:bg-[#010844] border border-[#D6DAE3] dark:border-white/10 rounded-[12px] p-5 sm:p-6 shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.06)] h-fit">
      
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#D6DAE3] dark:border-white/10">
        <div className="w-9 h-9 rounded-[7.2px] bg-[#D20C54] text-white flex items-center justify-center shadow-sm">
          <Receipt className="w-5 h-5 stroke-[2]" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-[#010844] dark:text-white tracking-tight">
            Log Expense
          </h3>
          <p className="text-[11px] text-[#969CAF]">
            Record fixed or variable expenditure
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
            Expense Item Description *
          </label>
          <input
            type="text"
            required
            value={formData.expense_name}
            onChange={(e) => setFormData({ ...formData, expense_name: e.target.value })}
            className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] transition-all"
            placeholder="e.g. Office Rent or AWS Hosting"
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
            Amount (₹) *
          </label>
          <input
            type="number"
            required
            min={0}
            step={100}
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] transition-all"
            placeholder="15000"
          />
          <span className="text-[11px] font-mono font-medium text-[#00006E] dark:text-[#00C3F0] mt-1 block">
            Formatted: {formatINR(formData.amount)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
              Expense Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ExpenseType })}
              className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] cursor-pointer"
            >
              <option value="Fixed">Fixed (Rent, Salaries)</option>
              <option value="Variable">Variable (Travel, Ads)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
              Date Logged
            </label>
            <input
              type="date"
              value={formData.date_logged}
              onChange={(e) => setFormData({ ...formData, date_logged: e.target.value })}
              className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0]"
            />
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Save Expense Record</span>
          </button>
        </div>
      </form>
    </div>
  );
};
