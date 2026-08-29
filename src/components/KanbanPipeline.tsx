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
  X,
  TrendingUp
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
 */
const STAGES: { key: DealStage; label: string; color: string; badgeColor: string; topBorder: string }[] = [
  { key: 'New Lead', label: 'New Lead', color: 'border-blue-500/20 text-blue-400 bg-blue-500/10', badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-md', topBorder: 'border-t-2 border-t-blue-500 shadow-[0_-2px_10px_rgba(59,130,246,0.5)]' },
  { key: 'Contacted', label: 'Contacted', color: 'border-amber-500/20 text-amber-400 bg-amber-500/10', badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 backdrop-blur-md', topBorder: 'border-t-2 border-t-amber-500 shadow-[0_-2px_10px_rgba(245,158,11,0.5)]' },
  { key: 'Proposal Sent', label: 'Proposal Sent', color: 'border-purple-500/20 text-purple-400 bg-purple-500/10', badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20 backdrop-blur-md', topBorder: 'border-t-2 border-t-purple-500 shadow-[0_-2px_10px_rgba(168,85,247,0.5)]' },
  { key: 'Won', label: 'Won', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10', badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md', topBorder: 'border-t-2 border-t-emerald-500 shadow-[0_-2px_10px_rgba(16,185,129,0.5)]' },
  { key: 'Lost', label: 'Lost', color: 'border-slate-700/50 text-slate-400 bg-slate-800/50', badgeColor: 'bg-slate-800/50 text-slate-400 border border-slate-700/50 backdrop-blur-md', topBorder: 'border-t-2 border-t-slate-500' },
];

/**
 * Product category filtering options.
 */
const CATEGORIES = ['All', 'Software', 'Consulting', 'Support', 'Hardware', 'AMC Services', 'General'];

/**
 * Interactive Lakhs & Crores Kanban Pipeline Board.
 * Supports drag-and-drop deal stage progression, filtering, editing, and WhatsApp follow-up generation.
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

  /**
   * Opens modal configured to add a new deal.
   *
   * @param {DealStage} initialStage Initial stage for the deal.
   */
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

  /**
   * Opens modal pre-populated with an existing deal's properties for editing.
   *
   * @param {Deal} deal Target deal object.
   */
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

  /**
   * Handles deal create or update form submission.
   *
   * @param {React.FormEvent} e Form event.
   */
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

  /**
   * Drag start event handler capturing deal ID.
   */
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedDealId(id);
  };

  /**
   * Drag over event handler preventing browser default drop blocking.
   */
  const handleDragOver = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    if (dragOverStage !== targetStage) {
      setDragOverStage(targetStage);
    }
  };

  /**
   * Drag leave event handler.
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStage(null);
  };

  /**
   * Drop event handler updating deal stage to column target stage.
   */
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
    <div className="space-y-6">
      {/* Top Controls & Metrics Bar */}
      <div className="relative group bg-[#0a0f1c]/80 backdrop-blur-3xl rounded-[3rem] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.5)] border border-indigo-500/20 flex flex-wrap justify-between items-center gap-6 transition-all duration-500 overflow-hidden hover:shadow-[0_8px_40px_rgb(79,70,229,0.15)]">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none group-hover:scale-110 group-hover:bg-indigo-500/25 transition-all duration-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 w-full lg:w-auto">
          <div>
            <h2 className="font-serif text-3xl font-black text-white flex items-center gap-4 tracking-tight drop-shadow-md">
              <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl shadow-inner border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Layers className="w-6 h-6 stroke-[3]" />
              </div>
              Lakhs & Crores Workflow
            </h2>
            <p className="text-[10px] font-black text-indigo-400 mt-2 ml-1 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> Visual pipeline execution
            </p>
          </div>

          {/* Metric Chips */}
          <div className="flex gap-4 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <div className="px-5 py-3.5 rounded-[1.5rem] bg-slate-900/60 border border-slate-700/50 shadow-inner flex flex-col gap-1.5 shrink-0 min-w-[160px] relative overflow-hidden group/metric hover:-translate-y-1 transition-transform backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-[10px] uppercase font-black tracking-widest text-slate-400">Total Deals</span>
              <div className="relative z-10 flex items-baseline gap-2">
                <strong className="font-serif text-2xl font-black text-indigo-400 tracking-tight drop-shadow-md">{deals.length}</strong>
                <span className="font-mono text-[11px] font-bold text-slate-500">({formatLakhsCrores(totalPipelineValue)})</span>
              </div>
            </div>
            
            <div className="px-5 py-3.5 rounded-[1.5rem] bg-emerald-900/10 border border-emerald-500/20 shadow-inner flex flex-col gap-1.5 shrink-0 min-w-[160px] relative overflow-hidden group/metric hover:-translate-y-1 transition-transform backdrop-blur-sm hover:border-emerald-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-[10px] uppercase font-black tracking-widest text-emerald-500">Won Revenue</span>
              <strong className="relative z-10 font-serif text-2xl font-black text-emerald-400 tracking-tight drop-shadow-md">{formatLakhsCrores(wonPipelineValue)}</strong>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400 stroke-[3]" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm font-bold border border-slate-700/50 rounded-[1.5rem] bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-inner backdrop-blur-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-5 py-3 text-sm font-bold border border-slate-700/50 rounded-[1.5rem] bg-slate-900/60 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 cursor-pointer transition-all shadow-inner appearance-none pr-10 backdrop-blur-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <button
            onClick={() => openAddModal('New Lead')}
            className="w-full sm:w-auto px-6 py-3 text-xs font-black tracking-widest uppercase text-white bg-indigo-600 hover:bg-indigo-500 rounded-[1.5rem] transition-all hover:-translate-y-1 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-3 shrink-0 group/btn border border-indigo-400/50"
          >
            <div className="p-1 rounded-md bg-white/20 group-hover/btn:bg-white/30 transition-colors">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            Add Deal
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((column) => {
          const columnDeals = filteredDeals.filter((d) => d.stage === column.key);
          const columnTotal = columnDeals.reduce((sum, d) => sum + d.deal_value, 0);

          return (
            <div
              key={column.key}
              onDragOver={(e) => handleDragOver(e, column.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.key)}
              className={`border rounded-[2.5rem] p-5 flex flex-col min-h-[600px] transition-all duration-300 shadow-inner backdrop-blur-xl ${
                dragOverStage === column.key
                  ? 'bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-700/50'
              }`}
            >
              {/* Premium Column Header Pill */}
              <div className={`flex justify-between items-center px-6 py-5 rounded-[2rem] mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl border border-white/5 ${column.badgeColor}`}>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-[15px] font-black tracking-widest uppercase drop-shadow-md">
                      {column.label}
                    </h3>
                    <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-black/40 backdrop-blur-sm shadow-inner border border-white/10">
                      {columnDeals.length}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col gap-2 w-full">
                    <div className="text-xs font-mono font-black opacity-90 drop-shadow-sm">
                      {formatLakhsCrores(columnTotal)}
                    </div>
                    {/* Pipeline Value Progress Bar */}
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden mt-1 shadow-inner">
                      <div 
                        className={`h-full rounded-full ${column.key === 'Won' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : column.key === 'Lost' ? 'bg-slate-500' : 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]'} transition-all duration-1000`} 
                        style={{ width: `${totalPipelineValue > 0 ? Math.round((columnTotal / totalPipelineValue) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openAddModal(column.key)}
                  className="p-3 rounded-2xl bg-black/20 hover:bg-black/40 transition-all hover:scale-110 active:scale-95 shadow-inner border border-white/10"
                  title={`Add deal to ${column.label}`}
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {columnDeals.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-700/80 rounded-[1.5rem] flex flex-col items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-500 p-4 text-center gap-3">
                    <div className="p-2.5 bg-slate-800/50 rounded-xl">
                       <Layers className="w-5 h-5 opacity-40 stroke-[2.5]" />
                    </div>
                    Drag deals here
                  </div>
                ) : (
                  columnDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-0 border border-slate-700/50 hover:border-indigo-500/50 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(79,70,229,0.2)] transition-all duration-300 cursor-grab active:cursor-grabbing group relative overflow-hidden"
                    >
                      {/* Ambient card glow on hover */}
                      <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/15 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                      {/* Top Accent Bar based on stage */}
                      <div className={`h-1.5 w-full ${deal.stage === 'Won' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : deal.stage === 'Lost' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`} />
                      
                      <div className="p-5 pb-4 relative z-10">
                        {/* Deal Header & Value */}
                        <div className="flex justify-between items-start mb-4 gap-3">
                          <h4 className="font-sans font-black text-sm text-slate-100 group-hover:text-indigo-400 transition-colors leading-tight drop-shadow-md">
                            {deal.client_name}
                          </h4>
                          <div className="text-right shrink-0">
                            <span className="inline-block px-3 py-1.5 rounded-xl text-xs font-serif font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 shadow-inner">
                              {formatLakhsCrores(deal.deal_value)}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-5">
                          <div className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-500">
                            Raw: {formatINR(deal.deal_value)}
                          </div>
                          {(deal.stage === 'New Lead' || deal.stage === 'Contacted') && leadPredictor.predict(deal) !== null && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500/10 to-indigo-500/10 border border-fuchsia-500/20 shadow-inner backdrop-blur-sm" title="AI Product Recommendation">
                              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 stroke-[3]" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400">
                                Pitch {leadPredictor.predict(deal)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Category & Close Date Chips */}
                        <div className="flex flex-wrap gap-2 items-center text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">
                          <span className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 flex items-center gap-2 shadow-inner">
                            <Tag className="w-3.5 h-3.5 text-indigo-400 stroke-[3]" />
                            {deal.product_category}
                          </span>
                          {deal.close_date && (
                            <span className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 flex items-center gap-2 shadow-inner">
                              <Calendar className="w-3.5 h-3.5 text-orange-400 stroke-[3]" />
                              {deal.close_date}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Unified Elegant Bottom Action Bar */}
                      <div className="relative z-10 flex items-center justify-between gap-2 px-5 py-3 bg-[#0a0f1c]/80 backdrop-blur-md border-t border-slate-700/50">
                        <select
                          value={deal.stage}
                          onChange={(e) => onUpdateDeal(deal.id, { stage: e.target.value as DealStage })}
                          className="text-[10px] font-black uppercase tracking-widest py-1.5 px-3 border border-slate-600/80 rounded-xl bg-slate-900/80 text-slate-300 cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              Move: {s.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setActiveWhatsAppDeal(deal)}
                            className="p-2 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-xl transition-all hover:scale-110 active:scale-95"
                            title="Generate WhatsApp Follow-up (AI)"
                          >
                            <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => openEditModal(deal)}
                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/20 rounded-xl transition-all hover:scale-110 active:scale-95"
                            title="Edit deal"
                          >
                            <Edit2 className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => onDeleteDeal(deal.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all hover:scale-110 active:scale-95"
                            title="Delete deal"
                          >
                            <Trash2 className="w-4 h-4 stroke-[2.5]" />
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

      {/* Feature 2: WhatsApp Modal */}
      <WhatsAppModal
        deal={activeWhatsAppDeal}
        isOpen={!!activeWhatsAppDeal}
        onClose={() => setActiveWhatsAppDeal(null)}
      />
    </div>
  );
};
