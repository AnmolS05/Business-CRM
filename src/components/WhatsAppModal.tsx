import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, X, Check, Copy } from 'lucide-react';
import { Deal } from '../types';
import { formatIndianFullWithCompact } from '../utils/currency';
import { generateWhatsAppFollowUpApi } from '../api/apiClient';

/**
 * Props for WhatsAppModal component.
 */
interface WhatsAppModalProps {
  /** Target deal object */
  deal: Deal | null;
  /** Modal visibility flag */
  isOpen: boolean;
  /** Modal close callback */
  onClose: () => void;
}

/**
 * WhatsApp Follow-up Modal component utilizing Gemini 2.5 Flash Lite to draft context-aware sales messages.
 *
 * @param {WhatsAppModalProps} props Component properties.
 * @returns {React.ReactElement | null} Modal element or null when closed.
 */
export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ deal, isOpen, onClose }) => {
  const [draft, setDraft] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  useEffect(() => {
    if (deal && isOpen) {
      setPhoneNumber(deal.phone_number || '');
      generateFollowUp(deal);
    } else {
      setDraft('');
      setError(null);
    }
  }, [deal, isOpen]);

  /**
   * Invokes Gemini 2.5 Flash Lite via apiClient to synthesize a WhatsApp message draft.
   *
   * @param {Deal} currentDeal Target deal details.
   */
  const generateFollowUp = async (currentDeal: Deal): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const generatedDraft = await generateWhatsAppFollowUpApi({
        client_name: currentDeal.client_name,
        product_category: currentDeal.product_category,
        deal_value: currentDeal.deal_value,
        stage: currentDeal.stage,
      });

      setDraft(generatedDraft || '');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating AI message';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cleans phone number and redirects browser to WhatsApp Web/App wa.me URL.
   */
  const handleSendWhatsApp = (): void => {
    if (!draft) return;
    let cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length === 10) {
      cleanedPhone = `91${cleanedPhone}`;
    }

    const encodedText = encodeURIComponent(draft);
    const waUrl = `https://wa.me/${cleanedPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  /**
   * Copies current draft text to user system clipboard.
   */
  const handleCopy = (): void => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !deal) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />
      
      <div className="relative bg-white/95 dark:bg-slate-900/90 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-300 border border-white/40 dark:border-slate-700/60 backdrop-blur-2xl">
        {/* WhatsApp Brand Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/15 dark:bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="bg-emerald-50/60 dark:bg-emerald-900/20 px-10 py-8 border-b border-emerald-100/80 dark:border-emerald-800/40 flex justify-between items-center relative z-10 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-100/80 dark:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-200/80 dark:border-emerald-700/60 shadow-inner">
              <MessageSquare className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-2xl text-emerald-950 dark:text-emerald-100 tracking-tight">WhatsApp Follow-up</h3>
              <p className="text-[11px] font-black text-emerald-600/80 dark:text-emerald-400/80 flex items-center gap-1.5 mt-1.5 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-800/40 dark:text-emerald-200/40 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 space-y-8 relative z-10">
          {/* Deal Metadata Banner */}
          <div className="bg-gray-50/80 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/80 rounded-[1.25rem] p-6 text-sm flex justify-between items-center shadow-inner backdrop-blur-sm">
            <div>
              <span className="font-serif font-black text-xl block text-gray-900 dark:text-slate-100 mb-2">{deal.client_name}</span>
              <span className="text-gray-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                {deal.product_category} • <span className="text-emerald-600 dark:text-emerald-400">{deal.stage}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-base block text-gray-900 dark:text-slate-200">
                {formatIndianFullWithCompact(deal.deal_value)}
              </span>
            </div>
          </div>

          {/* Phone input */}
          <div>
            <label className="block text-[11px] font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest pl-2">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 919876543210"
              className="w-full px-6 py-4 text-sm font-bold border border-gray-200/80 dark:border-slate-700/80 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner backdrop-blur-sm"
            />
          </div>

          {/* Draft text section */}
          <div>
            <div className="flex justify-between items-center mb-2 pl-1">
              <label className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                AI Generated Message
              </label>
              <button
                onClick={() => generateFollowUp(deal)}
                disabled={loading}
                className="text-xs font-bold text-gray-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase tracking-wide"
              >
                Regenerate
              </button>
            </div>

            {loading ? (
              <div className="min-h-[180px] bg-white/50 dark:bg-slate-800/50 border border-gray-200/80 dark:border-slate-700/80 rounded-[1.25rem] p-6 flex flex-col items-center justify-center gap-5 shadow-inner backdrop-blur-sm">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-emerald-100 dark:border-emerald-900 rounded-full"></div>
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-[10px] font-black text-gray-500 dark:text-slate-400 animate-pulse uppercase tracking-widest">Drafting personalized message...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-[1.25rem] text-sm font-bold flex items-center gap-4 shadow-inner">
                <X className="w-6 h-6 shrink-0" />
                {error}
              </div>
            ) : (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={6}
                className="w-full p-6 text-sm leading-relaxed border border-gray-200/80 dark:border-slate-700/80 rounded-[1.25rem] bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none resize-none font-sans shadow-inner backdrop-blur-sm transition-all"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-gray-50/80 dark:bg-slate-800/40 border-t border-gray-100/80 dark:border-slate-800 flex flex-wrap-reverse sm:flex-nowrap justify-between items-center gap-5 relative z-10 backdrop-blur-md">
          <button
            onClick={handleCopy}
            disabled={!draft || loading}
            className="w-full sm:w-auto px-6 py-4 text-sm font-black uppercase tracking-widest text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex justify-center items-center gap-3 shadow-sm active:scale-95 disabled:opacity-50"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-500 stroke-[3]" /> : <Copy className="w-5 h-5 stroke-[2.5]" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>

          <div className="flex w-full sm:w-auto items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-4 text-sm font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors hidden sm:block"
            >
              Cancel
            </button>
            <button
              onClick={handleSendWhatsApp}
              disabled={!draft || loading}
              className="w-full sm:w-auto px-10 py-4 text-sm font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-2xl transition-all shadow-xl shadow-emerald-500/30 active:scale-95 flex justify-center items-center gap-3"
            >
              <Send className="w-5 h-5 stroke-[2.5]" />
              Send via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
