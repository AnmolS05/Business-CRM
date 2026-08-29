import React from 'react';
import { Sparkles, X, TrendingUp } from 'lucide-react';
import { Deal, DealStage } from '../types';
import { formatLakhsCrores } from '../utils/currency';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingDeal: Deal | null;
  formData: {
    client_name: string;
    phone_number: string;
    deal_value: number;
    stage: DealStage;
    product_category: string;
    close_date: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  stages: { key: DealStage; label: string }[];
}

export const DealFormModal: React.FC<DealFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingDeal,
  formData,
  setFormData,
  stages
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-[#0a0f1c]/80 backdrop-blur-3xl transition-opacity duration-300" onClick={onClose} />
      
      <div className="relative bg-slate-900/60 rounded-[3rem] shadow-[0_8px_40px_rgb(0,0,0,0.3)] max-w-lg w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-300 border border-indigo-500/20 backdrop-blur-3xl">
        {/* Decorative Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="px-10 py-10 border-b border-indigo-500/20 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-inner">
              <Sparkles className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-3xl text-white tracking-tight drop-shadow-md">
                {editingDeal ? 'Edit Sales Deal' : 'Add New Pipeline Lead'}
              </h3>
              <p className="text-[10px] font-black text-indigo-400 flex items-center gap-2 mt-2 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" /> Pipeline Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-10 space-y-6 relative z-10">
          <div className="relative group/input">
            <input
              type="text"
              required
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 placeholder-transparent peer"
              placeholder="Client Name"
            />
            <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none transition-all peer-placeholder-shown:text-slate-500 peer-focus:text-indigo-500">
              Client Name *
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="relative group/input">
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={formData.deal_value}
                  onChange={(e) => setFormData({ ...formData, deal_value: Number(e.target.value) })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 placeholder-transparent peer"
                  placeholder="Deal Value"
                />
                <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none transition-all peer-placeholder-shown:text-slate-500 peer-focus:text-indigo-500">
                  Deal Value (in ₹) *
                </label>
              </div>
              <span className="text-[10px] text-indigo-400 mt-2 block font-serif font-bold pl-2">
                {formatLakhsCrores(formData.deal_value)}
              </span>
            </div>

            <div className="relative group/input">
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                className="w-full h-[60px] bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 appearance-none"
              >
                {stages.map((s) => (
                  <option key={s.key} value={s.key} className="bg-slate-800">
                    {s.label}
                  </option>
                ))}
              </select>
              <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none">
                Stage
              </label>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative group/input">
              <select
                value={formData.product_category}
                onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
                className="w-full h-[60px] bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 appearance-none"
              >
                <option value="Software" className="bg-slate-800">Software</option>
                <option value="Consulting" className="bg-slate-800">Consulting</option>
                <option value="Support" className="bg-slate-800">Support</option>
                <option value="Hardware" className="bg-slate-800">Hardware</option>
                <option value="AMC Services" className="bg-slate-800">AMC Services</option>
                <option value="General" className="bg-slate-800">General</option>
              </select>
              <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none">
                Product Category
              </label>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative group/input">
              <input
                type="date"
                value={formData.close_date}
                onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                className="w-full h-[60px] bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 peer"
              />
               <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none transition-all">
                Target Close Date
              </label>
            </div>
          </div>

          <div className="relative group/input">
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 placeholder-transparent peer"
              placeholder="Phone Number"
            />
            <label className="absolute top-2 left-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest pointer-events-none transition-all peer-placeholder-shown:text-slate-500 peer-focus:text-indigo-500">
              WhatsApp Phone Number
            </label>
          </div>

          <div className="pt-8 flex flex-wrap-reverse sm:flex-nowrap justify-end items-center gap-5 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-4 text-[13px] font-black tracking-widest uppercase text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 text-[13px] font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)] active:scale-95 border border-indigo-400/20 transition-all flex justify-center items-center gap-3"
            >
              {editingDeal ? 'Save Changes' : 'Initialize Deal'}
              <TrendingUp className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
