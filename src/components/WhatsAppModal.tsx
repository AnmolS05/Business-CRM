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
      <div className="absolute inset-0 bg-[#0a0f1c]/80 backdrop-blur-3xl transition-opacity duration-300" onClick={onClose} />
      
      <div className="relative bg-slate-900/60 rounded-[3rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] max-w-lg w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-300 border border-emerald-500/20 backdrop-blur-3xl">
        {/* WhatsApp Brand Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="bg-emerald-500/5 px-10 py-8 border-b border-emerald-500/20 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-inner">
              <MessageSquare className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-3xl text-white tracking-tight drop-shadow-md">WhatsApp Follow-up</h3>
              <p className="text-[10px] font-black text-emerald-400 flex items-center gap-2 mt-2 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-500/20 transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-rose-500/30"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 space-y-8 relative z-10">
          {/* Deal Metadata Banner */}
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 flex justify-between items-center shadow-inner group hover:border-emerald-500/30 transition-colors">
            <div>
              <span className="font-serif font-black text-2xl block text-white mb-2 tracking-tight">{deal.client_name}</span>
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                {deal.product_category}
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-emerald-400">{deal.stage}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-xl block text-white drop-shadow-md">
                {formatIndianFullWithCompact(deal.deal_value)}
              </span>
            </div>
          </div>

          {/* Phone input */}
          <div className="relative group/input">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-5 py-4 pt-6 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-white shadow-inner transition-all group-hover/input:border-slate-600 placeholder-transparent peer"
              placeholder="WhatsApp Number"
            />
            <label className="absolute top-2 left-5 text-[10px] font-black text-emerald-500 uppercase tracking-widest pointer-events-none transition-all peer-placeholder-shown:text-slate-500 peer-focus:text-emerald-500">
              WhatsApp Number
            </label>
          </div>

          {/* Draft text section */}
          <div>
            <div className="flex justify-between items-center mb-4 pl-1">
              <label className="text-[10px] font-black text-emerald-500 flex items-center gap-2 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                AI Generated Message
              </label>
              <button
                onClick={() => generateFollowUp(deal)}
                disabled={loading}
                className="text-[10px] font-black text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/80 hover:border-emerald-500/30"
              >
                Regenerate
              </button>
            </div>

            {loading ? (
              <div className="min-h-[200px] bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 shadow-inner">
                <div className="relative">
                  <div className="w-14 h-14 border-4 border-emerald-900 rounded-full"></div>
                  <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
                <p className="text-[10px] font-black text-emerald-500/70 animate-pulse uppercase tracking-widest">Drafting personalized message...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl text-sm font-black flex items-center gap-4 shadow-inner">
                <X className="w-6 h-6 shrink-0 stroke-[3]" />
                {error}
              </div>
            ) : (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={6}
                className="w-full p-6 text-sm leading-relaxed border border-slate-700/80 rounded-2xl bg-slate-800/80 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none shadow-inner transition-all hover:border-slate-600"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-slate-900/80 border-t border-emerald-500/20 flex flex-wrap-reverse sm:flex-nowrap justify-between items-center gap-5 relative z-10">
          <button
            onClick={handleCopy}
            disabled={!draft || loading}
            className="w-full sm:w-auto px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all flex justify-center items-center gap-3 shadow-sm active:scale-95 disabled:opacity-50 hover:border-slate-600"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400 stroke-[3]" /> : <Copy className="w-5 h-5 stroke-[2.5]" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>

          <div className="flex w-full sm:w-auto items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              Cancel
            </button>
            <button
              onClick={handleSendWhatsApp}
              disabled={!draft || loading}
              className="w-full sm:w-auto px-8 py-4 text-[13px] font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] active:scale-95 flex justify-center items-center gap-3 border border-emerald-400/20"
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
