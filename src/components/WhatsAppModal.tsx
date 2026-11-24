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
      <div className="absolute inset-0 bg-[#010844]/80 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#010844] rounded-[12px] shadow-2xl max-w-lg w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200 border border-[#D6DAE3] dark:border-white/10">
        {/* Header */}
        <div className="bg-[#FCFBF9] dark:bg-[#05081E]/80 px-6 py-5 border-b border-[#D6DAE3] dark:border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[7.2px] bg-[#00C3F0]/10 dark:bg-[#00C3F0]/20 text-[#00C3F0] flex items-center justify-center border border-[#00C3F0]/20">
              <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-[#545B6D] dark:text-[#FDF5F8] tracking-[-0.03em]">WhatsApp Follow-up</h3>
              <p className="text-[10px] font-bold text-[#00C3F0] flex items-center gap-1.5 mt-0.5 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[7.2px] text-[#969CAF] hover:text-[#545B6D] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Deal Metadata Banner */}
          <div className="bg-[#FCFBF9] dark:bg-[#05081E]/60 border border-[#D6DAE3]/80 dark:border-white/10 rounded-[7.2px] p-4 flex justify-between items-center shadow-inner">
            <div>
              <span className="font-heading font-bold text-lg block text-[#545B6D] dark:text-[#FDF5F8] tracking-[-0.03em]">{deal.client_name}</span>
              <span className="text-[#969CAF] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 mt-0.5">
                {deal.product_category}
                <span className="w-1 h-1 rounded-full bg-[#D6DAE3] dark:bg-white/20" />
                <span className="text-[#00C3F0]">{deal.stage}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-base block text-[#545B6D] dark:text-[#FDF5F8]">
                {formatIndianFullWithCompact(deal.deal_value)}
              </span>
            </div>
          </div>

          {/* Phone input */}
          <div>
            <label className="block text-xs font-bold text-[#545B6D] dark:text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-white dark:bg-[#05081E] border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#D20C54]/20 focus:border-[#D20C54] outline-none text-[#545B6D] dark:text-[#FDF5F8] shadow-inner transition-colors"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Draft text section */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-[#545B6D] dark:text-[#CBD5E1] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#D20C54] rounded-full animate-pulse" />
                AI Generated Message
              </label>
              <button
                onClick={() => generateFollowUp(deal)}
                disabled={loading}
                className="text-[10px] font-bold text-[#00006E] dark:text-[#00C3F0] hover:underline uppercase tracking-wider"
              >
                Regenerate
              </button>
            </div>

            {loading ? (
              <div className="min-h-[160px] bg-[#FCFBF9] dark:bg-[#05081E]/60 border border-[#D6DAE3] dark:border-white/10 rounded-[7.2px] p-6 flex flex-col items-center justify-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 border-2 border-[#EAF1FF] dark:border-white/10 rounded-full" />
                  <div className="w-10 h-10 border-2 border-[#D20C54] border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
                </div>
                <p className="text-xs font-semibold text-[#969CAF] animate-pulse">Drafting personalized follow-up message...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-[7.2px] text-xs font-semibold flex items-center gap-2">
                <X className="w-4 h-4 shrink-0" />
                {error}
              </div>
            ) : (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                className="w-full p-3.5 text-sm leading-relaxed border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] bg-white dark:bg-[#05081E] text-[#545B6D] dark:text-[#FDF5F8] focus:border-[#D20C54] focus:ring-2 focus:ring-[#D20C54]/20 outline-none resize-none shadow-inner transition-colors"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FCFBF9] dark:bg-[#05081E]/80 border-t border-[#D6DAE3] dark:border-white/10 flex flex-wrap justify-between items-center gap-3">
          <button
            onClick={handleCopy}
            disabled={!draft || loading}
            className="btn-secondary h-[40px] px-3.5 text-xs inline-flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-[#010844]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="btn-ghost h-[40px] px-3 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSendWhatsApp}
              disabled={!draft || loading}
              className="btn-primary h-[40px] px-4 text-xs inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
