import React, { useState, useEffect } from 'react';
import { leadPredictor } from '../utils/mlPredictor';
import {
  Plus,
  Search,
  MessageSquare,
  Calendar,
  Tag,
  Trash2,
  Edit2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Deal, DealStage } from '../types';
import { formatLakhsCrores, formatINR } from '../utils/currency';
import { WhatsAppModal } from './WhatsAppModal';
import { DealFormModal } from './DealFormModal';

/**
 * Props for KanbanPipeline component.
 */
interface KanbanPipelineProps {
  /** Array of deal entities */
  deals: Deal[];
  /** Handler to create a new deal */
  onAddDeal: (deal: Omit<Deal, 'id'>) => Promise<void>;
  /** Handler to update an existing deal */
  onUpdateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  /** Handler to delete a deal */
  onDeleteDeal: (id: string) => Promise<void>;
}

/**
 * Stage configuration mapping keys to labels, colors, and badge styles.
 * Styled with Bridgement color palette (Cyan #00C3F0, Periwinkle #99AFFD, Sky #5BD6F5, Magenta #D20C54, Slate #545B6D).
 */
const STAGES: { key: DealStage; label: string; color: string; badgeColor: string; topBorder: string; progressColor: string }[] = [
  { key: 'New Lead', label: 'New Lead', color: 'text-[#00C3F0]', badgeColor: 'bg-[#00C3F0]/10 text-[#00C3F0] border border-[#00C3F0]/30', topBorder: 'border-t-[3px] border-t-[#00C3F0]', progressColor: 'bg-[#00C3F0]' },
  { key: 'Contacted', label: 'Contacted', color: 'text-[#99AFFD]', badgeColor: 'bg-[#99AFFD]/15 text-[#99AFFD] border border-[#99AFFD]/30', topBorder: 'border-t-[3px] border-t-[#99AFFD]', progressColor: 'bg-[#99AFFD]' },
  { key: 'Proposal Sent', label: 'Proposal Sent', color: 'text-[#5BD6F5]', badgeColor: 'bg-[#5BD6F5]/15 text-[#5BD6F5] border border-[#5BD6F5]/30', topBorder: 'border-t-[3px] border-t-[#5BD6F5]', progressColor: 'bg-[#5BD6F5]' },
  { key: 'Won', label: 'Won', color: 'text-[#D20C54]', badgeColor: 'bg-[#D20C54]/15 text-[#D20C54] border border-[#D20C54]/30', topBorder: 'border-t-[3px] border-t-[#D20C54]', progressColor: 'bg-[#D20C54]' },
  { key: 'Lost', label: 'Lost', color: 'text-[#545B6D] dark:text-[#969CAF]', badgeColor: 'bg-[#545B6D]/15 text-[#545B6D] dark:text-[#969CAF] border border-[#545B6D]/30', topBorder: 'border-t-[3px] border-t-[#545B6D]', progressColor: 'bg-[#545B6D]' },
];

/**
 * Product category filtering options.
 */
const CATEGORIES = ['All', 'Software', 'Consulting', 'Support', 'Hardware', 'AMC Services', 'General'];

/**
 * Interactive Lakhs & Crores Kanban Pipeline Board.
 * Supports drag-and-drop deal stage progression, filtering, editing, and WhatsApp follow-up generation.
 * Styled per Bridgement Design System.
 *
 * @param {KanbanPipelineProps} props Component props.
 * @returns {React.ReactElement} Kanban board layout.
 */
export const KanbanPipeline: React.FC<KanbanPipelineProps> = ({
  deals,
  onAddDeal,
  onUpdateDeal,
  onDeleteDeal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeWhatsAppDeal, setActiveWhatsAppDeal] = useState<Deal | null>(null);

  // Modal State for New / Edit Deal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    phone_number: '',
    deal_value: 500000,
    stage: 'New Lead' as DealStage,
    product_category: 'Software',
    close_date: new Date().toISOString().split('T')[0],
  });

  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  // Train the custom ML model on historical deals whenever data changes
  useEffect(() => {
    leadPredictor.train(deals);
  }, [deals]);

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.product_category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || deal.product_category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = (initialStage: DealStage = 'New Lead') => {
    setEditingDeal(null);
    setFormData({
      client_name: '',
      phone_number: '919876543210',
      deal_value: 500000,
      stage: initialStage,
      product_category: 'Software',
      close_date: new Date().toISOString().split('T')[0],
    });
    setIsFormOpen(true);
  };

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      client_name: deal.client_name,
      phone_number: deal.phone_number,
      deal_value: deal.deal_value,
      stage: deal.stage,
      product_category: deal.product_category,
      close_date: deal.close_date,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name.trim()) return;

    if (editingDeal) {
      await onUpdateDeal(editingDeal.id, formData);
    } else {
      await onAddDeal(formData);
    }
    setIsFormOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedDealId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    if (dragOverStage !== targetStage) {
      setDragOverStage(targetStage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const id = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (id) {
      await onUpdateDeal(id, { stage: targetStage });
    }
    setDraggedDealId(null);
  };

  const totalPipelineValue = deals.reduce((acc, d) => acc + d.deal_value, 0);
  const wonPipelineValue = deals.filter(d => d.stage === 'Won').reduce((acc, d) => acc + d.deal_value, 0);

  return (
    <div className="space-y-5">
      {/* Top Controls & Metrics Bar */}
      <div className="bg-[#FCFBF9] dark:bg-[#010844] border border-[#D6DAE3] dark:border-white/10 rounded-[12px] p-5 shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.06)] flex flex-wrap justify-between items-center gap-4 transition-all">
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 w-full lg:w-auto">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[7.2px] bg-[#D20C54]/10 dark:bg-[#D20C54]/20 flex items-center justify-center text-[#D20C54]">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#545B6D] dark:text-white">
                Sales Pipeline
              </h2>
            </div>
            <p className="text-[12px] text-[#969CAF] dark:text-[#CBD5E1] mt-0.5">
              Indian Rupee (Lakhs & Crores) deal flow execution
            </p>
          </div>

          {/* Metric Chips */}
          <div className="flex gap-3 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="px-4 py-2 rounded-[7.2px] bg-[#EAF1FF] dark:bg-[#040B46] border border-[#D6DAE3] dark:border-white/10 flex flex-col min-w-[140px]">
              <span className="text-[10px] uppercase font-semibold text-[#545B6D] dark:text-[#969CAF] tracking-wider">Total Pipeline</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <strong className="text-base font-semibold text-[#010844] dark:text-white">{deals.length}</strong>
                <span className="text-xs font-medium text-[#00006E] dark:text-[#00C3F0]">({formatLakhsCrores(totalPipelineValue)})</span>
              </div>
            </div>
            
            <div className="px-4 py-2 rounded-[7.2px] bg-[#D20C54]/10 dark:bg-[#D20C54]/20 border border-[#D20C54]/30 flex flex-col min-w-[140px]">
              <span className="text-[10px] uppercase font-semibold text-[#D20C54] tracking-wider">Won Revenue</span>
              <strong className="text-base font-semibold text-[#D20C54] mt-0.5">{formatLakhsCrores(wonPipelineValue)}</strong>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#969CAF]" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] bg-white dark:bg-[#040B46] text-[#545B6D] dark:text-[#FDF5F8] placeholder-[#969CAF] focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 text-sm border border-[#D6DAE3] dark:border-white/15 rounded-[7.2px] bg-white dark:bg-[#040B46] text-[#545B6D] dark:text-[#FDF5F8] focus:outline-none focus:ring-2 focus:ring-[#00006E] dark:focus:ring-[#00C3F0] cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => openAddModal('New Lead')}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Deal</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {STAGES.map((column) => {
          const columnDeals = filteredDeals.filter((d) => d.stage === column.key);
          const columnTotal = columnDeals.reduce((sum, d) => sum + d.deal_value, 0);

          return (
            <div
              key={column.key}
              onDragOver={(e) => handleDragOver(e, column.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.key)}
              className={`border rounded-[12px] p-3.5 flex flex-col min-h-[580px] transition-all duration-200 ${column.topBorder} ${
                dragOverStage === column.key
                  ? 'bg-[#EAF1FF] dark:bg-[#010844] border-[#00C3F0]'
                  : 'bg-[#FCFBF9] dark:bg-[#010844]/60 border-[#D6DAE3] dark:border-white/10 shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.04)]'
              }`}
            >
              {/* Column Header */}
              <div className={`flex justify-between items-center px-3.5 py-2.5 rounded-[7.2px] mb-3.5 ${column.badgeColor}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-[13px] font-semibold uppercase tracking-wider">
                      {column.label}
                    </h3>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/40 dark:bg-black/40">
                      {columnDeals.length}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-mono font-medium">
                      {formatLakhsCrores(columnTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openAddModal(column.key)}
                  className="p-1.5 rounded-[5px] hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
                  title={`Add deal to ${column.label}`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Deal Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                {columnDeals.length === 0 ? (
                  <div className="h-28 border border-dashed border-[#D6DAE3] dark:border-white/15 rounded-[12px] flex flex-col items-center justify-center text-[11px] font-medium text-[#969CAF] p-3 text-center gap-2">
                    <Layers className="w-5 h-5 opacity-40" />
                    <span>Drop deals here</span>
                  </div>
                ) : (
                  columnDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-white dark:bg-[#040B46] rounded-[12px] border border-[#D6DAE3] dark:border-white/10 hover:shadow-[0px_3.6px_14.4px_rgba(0,13,39,0.1)] transition-all duration-200 cursor-grab active:cursor-grabbing group overflow-hidden"
                    >
                      <div className="p-4 pb-3">
                        {/* Deal Header & Value */}
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h4 className="font-sans font-semibold text-[14px] text-[#010844] dark:text-[#FDF5F8] group-hover:text-[#D20C54] transition-colors leading-snug">
                            {deal.client_name}
                          </h4>
                          <span className="inline-block px-2.5 py-1 rounded-[6px] text-xs font-semibold text-[#00006E] dark:text-[#00C3F0] bg-[#EAF1FF] dark:bg-[#00C3F0]/15 shrink-0">
                            {formatLakhsCrores(deal.deal_value)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-mono text-[#969CAF]">
                            {formatINR(deal.deal_value)}
                          </span>
                          {(deal.stage === 'New Lead' || deal.stage === 'Contacted') && leadPredictor.predict(deal) !== null && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#D20C54]/10 text-[#D20C54] text-[10px] font-medium" title="AI Product Pitch">
                              <Sparkles className="w-3 h-3" />
                              <span>Pitch {leadPredictor.predict(deal)}</span>
                            </div>
                          )}
                        </div>

                        {/* Category & Close Date Chips */}
                        <div className="flex flex-wrap gap-1.5 items-center text-[10px] text-[#545B6D] dark:text-[#969CAF]">
                          <span className="px-2 py-0.5 rounded-[4px] bg-[#FCFBF9] dark:bg-white/5 border border-[#D6DAE3] dark:border-white/10 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-[#00C3F0]" />
                            {deal.product_category}
                          </span>
                          {deal.close_date && (
                            <span className="px-2 py-0.5 rounded-[4px] bg-[#FCFBF9] dark:bg-white/5 border border-[#D6DAE3] dark:border-white/10 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#D20C54]" />
                              {deal.close_date}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Bar */}
                      <div className="flex items-center justify-between gap-1 px-3.5 py-2 bg-[#FCFBF9] dark:bg-[#010844]/80 border-t border-[#D6DAE3] dark:border-white/10">
                        <select
                          value={deal.stage}
                          onChange={(e) => onUpdateDeal(deal.id, { stage: e.target.value as DealStage })}
                          className="text-[11px] py-1 px-2 border border-[#D6DAE3] dark:border-white/15 rounded-[5px] bg-white dark:bg-[#040B46] text-[#545B6D] dark:text-[#FDF5F8] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00006E]"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setActiveWhatsAppDeal(deal)}
                            className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-[5px] transition-all"
                            title="Generate WhatsApp Follow-up (AI)"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(deal)}
                            className="p-1.5 text-[#545B6D] dark:text-[#969CAF] hover:text-[#00006E] dark:hover:text-[#00C3F0] rounded-[5px] transition-all"
                            title="Edit deal"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteDeal(deal.id)}
                            className="p-1.5 text-[#545B6D] dark:text-[#969CAF] hover:text-rose-500 rounded-[5px] transition-all"
                            title="Delete deal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DealFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingDeal={editingDeal}
        formData={formData}
        setFormData={setFormData}
        stages={STAGES}
      />

      {/* WhatsApp Modal */}
      <WhatsAppModal
        deal={activeWhatsAppDeal}
        isOpen={!!activeWhatsAppDeal}
        onClose={() => setActiveWhatsAppDeal(null)}
      />
    </div>
  );
};
