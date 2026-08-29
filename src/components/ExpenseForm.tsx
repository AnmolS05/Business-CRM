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
    <div className="relative group bg-slate-900/60 backdrop-blur-3xl border border-indigo-500/20 rounded-[3rem] p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.3)] transition-all duration-500 h-fit overflow-hidden">
      {/* Form Ambient Glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:scale-125 transition-all duration-1000" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-125 transition-all duration-1000" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-indigo-500/20">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-inner group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
            <Receipt className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-serif text-3xl font-black text-white tracking-tight drop-shadow-md">
              Log Expense
            </h3>
            <p className="text-[10px] font-black text-indigo-400 flex items-center gap-2 mt-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" /> Financial Tracking
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative group/input">
            <input
              type="text"
              required
              value={formData.expense_name}
              onChange={(e) => setFormData({ ...formData, expense_name: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 placeholder-transparent peer"
              placeholder="Expense Item"
            />
             <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none transition-all peer-placeholder-shown:text-slate-500 peer-focus:text-indigo-500">
              Expense Item *
            </label>
          </div>

          <div>
             <div className="relative group/input">
              <input
                type="number"
                required
                min={0}
                step={100}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 placeholder-transparent peer"
                placeholder="Amount"
              />
               <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none transition-all peer-placeholder-shown:text-slate-500 peer-focus:text-indigo-500">
                Amount (in ₹) *
              </label>
            </div>
            <span className="text-[10px] font-black text-emerald-400 mt-3 ml-2 block bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit border border-emerald-500/30 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              Value: {formatINR(formData.amount)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative group/input">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExpenseType })}
                className="w-full h-[60px] bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 appearance-none"
              >
                <option value="Fixed" className="bg-slate-800">Fixed (Rent)</option>
                <option value="Variable" className="bg-slate-800">Variable (Travel)</option>
              </select>
               <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none">
                Expense Type
              </label>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative group/input">
              <input
                type="date"
                value={formData.date_logged}
                onChange={(e) => setFormData({ ...formData, date_logged: e.target.value })}
                className="w-full h-[60px] bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 peer"
              />
               <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none transition-all">
                Date Logged
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700/50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 px-6 text-[13px] font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all hover:-translate-y-1 active:scale-95 shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)] border border-indigo-400/20 flex items-center justify-center gap-3"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
