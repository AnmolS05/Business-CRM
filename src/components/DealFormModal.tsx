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
      <div className="absolute inset-0 bg-[#010844]/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-[#FCFBF9] dark:bg-[#010844] rounded-[12px] shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.15)] max-w-lg w-full overflow-hidden transition-all border border-[#D6DAE3] dark:border-white/15">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#D6DAE3] dark:border-white/10 flex justify-between items-center bg-[#FCFBF9] dark:bg-[#040B46]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[7.2px] bg-[#D20C54] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[#010844] dark:text-white tracking-tight">
                {editingDeal ? 'Edit Sales Deal' : 'Add New Pipeline Lead'}
              </h3>
              <p className="text-[11px] text-[#969CAF] dark:text-[#99AFFD]">
                Enter enterprise client & deal metadata
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[5px] text-[#969CAF] hover:text-[#010844] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
              Client Enterprise Name *
            </label>
            <input
              type="text"
              required
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2.5 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] transition-all"
              placeholder="e.g. Tata Consultancy Services"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
                Deal Value (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                step={1000}
                value={formData.deal_value}
                onChange={(e) => setFormData({ ...formData, deal_value: Number(e.target.value) })}
                className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2.5 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] transition-all"
                placeholder="500000"
              />
              <span className="text-[11px] text-[#00006E] dark:text-[#00C3F0] mt-1 block font-mono font-medium">
                {formatLakhsCrores(formData.deal_value)}
              </span>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
                Pipeline Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2.5 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] transition-all cursor-pointer"
              >
                {stages.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
                Product Category
              </label>
              <select
                value={formData.product_category}
                onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
                className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2.5 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] transition-all cursor-pointer"
              >
                <option value="Software">Software</option>
                <option value="Consulting">Consulting</option>
                <option value="Support">Support</option>
                <option value="Hardware">Hardware</option>
                <option value="AMC Services">AMC Services</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
                Target Close Date
              </label>
              <input
                type="date"
                value={formData.close_date}
                onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#545B6D] dark:text-[#CBD5E1] mb-1">
              WhatsApp Phone Number
            </label>
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full bg-white dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2.5 text-sm text-[#010844] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] transition-all"
              placeholder="919876543210"
            />
          </div>

          <div className="pt-4 flex justify-end items-center gap-3 border-t border-[#D6DAE3] dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <span>{editingDeal ? 'Save Changes' : 'Initialize Deal'}</span>
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
