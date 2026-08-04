import React, { useState } from 'react';
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
  { key: 'New Lead', label: 'New Lead', color: 'border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-900/50 dark:text-blue-400 dark:bg-blue-500/10', badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-900/50', topBorder: 'border-t-2 border-t-blue-400 dark:border-t-blue-500' },
  { key: 'Contacted', label: 'Contacted', color: 'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:bg-amber-500/10', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/50', topBorder: 'border-t-2 border-t-amber-400 dark:border-t-amber-500' },
  { key: 'Proposal Sent', label: 'Proposal Sent', color: 'border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-900/50 dark:text-purple-400 dark:bg-purple-500/10', badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-900/50', topBorder: 'border-t-2 border-t-purple-400 dark:border-t-purple-500' },
  { key: 'Won', label: 'Won', color: 'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-500/10', badgeColor: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-900/50', topBorder: 'border-t-2 border-t-green-400 dark:border-t-green-500' },
  { key: 'Lost', label: 'Lost', color: 'border-gray-200 text-gray-500 bg-gray-50 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-800/50', badgeColor: 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', topBorder: 'border-t-2 border-t-gray-400 dark:border-t-slate-500' },
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
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /**
   * Drop event handler updating deal stage to column target stage.
   */
  const handleDrop = async (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
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
      <div className="relative group bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-xl shadow-indigo-900/5 dark:shadow-none border border-indigo-100/50 dark:border-slate-800/80 flex flex-wrap justify-between items-center gap-6 transition-all duration-500 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 group-hover:scale-150 transition-all duration-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 w-full lg:w-auto">
          <div>
            <h2 className="font-serif text-3xl font-black text-gray-900 dark:text-slate-100 flex items-center gap-4 tracking-tight">
              <div className="p-3 bg-indigo-50 dark:bg-blue-900/30 text-indigo-600 dark:text-blue-400 rounded-[1.25rem] shadow-inner border border-indigo-100 dark:border-blue-800/50 group-hover:scale-110 transition-transform duration-500">
                <Layers className="w-6 h-6 stroke-[2.5]" />
              </div>
              Lakhs & Crores Workflow
            </h2>
            <p className="text-[11px] font-black text-gray-400 dark:text-slate-500 mt-2 ml-1 uppercase tracking-widest">
              Visual pipeline execution
            </p>
          </div>

          {/* Metric Chips */}
          <div className="flex gap-4 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <div className="px-5 py-3 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-700 shadow-inner flex flex-col gap-1 shrink-0 min-w-[140px]">
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-slate-500">Total Deals</span>
              <div className="flex items-baseline gap-2">
                <strong className="font-serif text-2xl font-black text-indigo-600 dark:text-blue-400 tracking-tight">{deals.length}</strong>
                <span className="font-mono text-[10px] font-bold text-gray-400">({formatLakhsCrores(totalPipelineValue)})</span>
              </div>
            </div>
            
            <div className="px-5 py-3 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-700 shadow-inner flex flex-col gap-1 shrink-0 min-w-[140px]">
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-slate-500">Won Revenue</span>
              <strong className="font-serif text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{formatLakhsCrores(wonPipelineValue)}</strong>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm font-bold border border-gray-200 dark:border-slate-700/80 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-blue-500/20 transition-all shadow-inner"
            />
          </div>

          {/* Category Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-5 py-3 text-sm font-bold border border-gray-200 dark:border-slate-700/80 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-blue-500/20 cursor-pointer transition-all shadow-inner appearance-none pr-10"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <button
            onClick={() => openAddModal('New Lead')}
            className="w-full sm:w-auto px-6 py-3 text-sm font-black tracking-widest uppercase text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-indigo-500/30 dark:shadow-blue-500/20 flex items-center justify-center gap-3 shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
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
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.key)}
              className="bg-gray-50/50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-4 flex flex-col min-h-[550px] transition-colors shadow-inner"
            >
              {/* Premium Column Header Pill */}
              <div className={`flex justify-between items-center px-5 py-4 rounded-[1.5rem] mb-5 shadow-sm backdrop-blur-md ${column.badgeColor}`}>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-sm font-black tracking-widest uppercase">
                      {column.label}
                    </h3>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-sm shadow-inner">
                      {columnDeals.length}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[11px] font-mono font-bold opacity-80">
                    {formatLakhsCrores(columnTotal)}
                  </div>
                </div>

                <button
                  onClick={() => openAddModal(column.key)}
                  className="p-2 rounded-xl bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/40 transition-all hover:scale-110 active:scale-95 shadow-sm"
                  title={`Add deal to ${column.label}`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Column Deals List */}
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {columnDeals.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-gray-300 dark:border-slate-700/80 rounded-[1.5rem] flex flex-col items-center justify-center text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 p-4 text-center gap-2">
                    <div className="p-2 bg-gray-100 dark:bg-slate-800/50 rounded-full">
                       <Layers className="w-5 h-5 opacity-40" />
                    </div>
                    Drag deals here
                  </div>
                ) : (
                  columnDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl p-0 border border-gray-200/80 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-blue-500/70 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-blue-500/10 transition-all duration-300 cursor-grab active:cursor-grabbing group relative overflow-hidden"
                    >
                      {/* Ambient card glow on hover */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 dark:bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Top Accent Bar based on stage */}
                      <div className={`h-1 w-full ${deal.stage === 'Won' ? 'bg-emerald-500' : deal.stage === 'Lost' ? 'bg-rose-500' : 'bg-indigo-500 dark:bg-blue-500'}`} />
                      
                      <div className="p-4 pb-3 relative z-10">
                        {/* Deal Header & Value */}
                        <div className="flex justify-between items-start mb-3 gap-3">
                          <h4 className="font-sans font-bold text-[13px] text-gray-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                            {deal.client_name}
                          </h4>
                          <div className="text-right shrink-0">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-serif font-black text-indigo-700 dark:text-blue-300 bg-indigo-50/80 dark:bg-blue-500/10 border border-indigo-100 dark:border-blue-500/20 shadow-inner">
                              {formatLakhsCrores(deal.deal_value)}
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] font-mono font-bold text-gray-400 dark:text-slate-500 mb-4 opacity-80">
                          Raw: {formatINR(deal.deal_value)}
                        </div>

                        {/* Category & Close Date Chips */}
                        <div className="flex flex-wrap gap-2 items-center text-[10px] font-bold text-gray-500 dark:text-slate-400 mb-3">
                          <span className="px-2 py-1 rounded-md bg-white/50 dark:bg-slate-700/50 border border-gray-200/50 dark:border-slate-600/30 text-gray-600 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
                            <Tag className="w-3 h-3 text-indigo-400 dark:text-blue-400" />
                            {deal.product_category}
                          </span>
                          {deal.close_date && (
                            <span className="px-2 py-1 rounded-md bg-white/50 dark:bg-slate-700/50 border border-gray-200/50 dark:border-slate-600/30 text-gray-600 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
                              <Calendar className="w-3 h-3 text-orange-400 dark:text-orange-500" />
                              {deal.close_date}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Unified Elegant Bottom Action Bar */}
                      <div className="relative z-10 flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50/80 dark:bg-slate-900/60 backdrop-blur-md border-t border-gray-100/80 dark:border-slate-700/50">
                        <select
                          value={deal.stage}
                          onChange={(e) => onUpdateDeal(deal.id, { stage: e.target.value as DealStage })}
                          className="text-[10px] font-bold py-1 px-2 border border-gray-200 dark:border-slate-600/80 rounded-lg bg-white/80 dark:bg-slate-800 text-gray-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-sm"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              Move: {s.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setActiveWhatsAppDeal(deal)}
                            className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all hover:scale-110 active:scale-95"
                            title="Generate WhatsApp Follow-up (AI)"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(deal)}
                            className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-blue-400 hover:bg-indigo-50 dark:hover:bg-blue-500/10 rounded-lg transition-all hover:scale-110 active:scale-95"
                            title="Edit deal"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteDeal(deal.id)}
                            className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all hover:scale-110 active:scale-95"
                            title="Delete deal"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Deal Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsFormOpen(false)} />
          
          <div className="relative bg-white/95 dark:bg-slate-900/90 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-300 border border-white/40 dark:border-slate-700/60 backdrop-blur-2xl">
            {/* Decorative Glow */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/15 dark:bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="bg-indigo-50/60 dark:bg-indigo-900/20 px-10 py-8 border-b border-indigo-100/80 dark:border-indigo-800/40 flex justify-between items-center relative z-10 backdrop-blur-sm">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-indigo-100/80 dark:bg-indigo-800/40 text-indigo-600 dark:text-blue-400 rounded-2xl border border-indigo-200/80 dark:border-indigo-700/60 shadow-inner">
                  <Sparkles className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-2xl text-indigo-950 dark:text-slate-100 tracking-tight">
                    {editingDeal ? 'Edit Sales Deal' : 'Add New Pipeline Lead'}
                  </h3>
                  <p className="text-[11px] font-black text-indigo-600/80 dark:text-blue-400/80 flex items-center gap-1.5 mt-1.5 uppercase tracking-widest">
                    Pipeline Management
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 rounded-xl text-indigo-800/40 dark:text-slate-400/60 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all hover:scale-110 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-10 space-y-8 relative z-10">
              <div>
                <label className="block text-[11px] font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest pl-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reliance Retail Expansion"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-6 py-4 text-sm font-bold border border-gray-200/80 dark:border-slate-700/80 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-blue-500/20 outline-none transition-all shadow-inner backdrop-blur-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest pl-2">
                    Deal Value (in ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={formData.deal_value}
                    onChange={(e) => setFormData({ ...formData, deal_value: Number(e.target.value) })}
                    className="w-full px-6 py-4 text-sm font-bold border border-gray-200/80 dark:border-slate-700/80 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner backdrop-blur-sm"
                  />
                  <span className="text-[10px] text-orange-500 mt-1.5 block font-serif font-bold pl-1">
                    {formatLakhsCrores(formData.deal_value)}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest pl-2">
                    Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                    className="w-full px-6 py-4 text-sm font-bold border border-gray-200/80 dark:border-slate-700/80 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-500/10 outline-none cursor-pointer transition-all shadow-inner backdrop-blur-sm appearance-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key} className="bg-white dark:bg-slate-800">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest pl-2">
                    Product Category
                  </label>
                  <select
                    value={formData.product_category}
                    onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
                    className="w-full px-6 py-4 text-sm font-bold border border-gray-200/80 dark:border-slate-700/80 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-500/10 outline-none cursor-pointer transition-all shadow-inner backdrop-blur-sm appearance-none"
                  >
                    <option value="Software" className="bg-white dark:bg-slate-800">Software</option>
                    <option value="Consulting" className="bg-white dark:bg-slate-800">Consulting</option>
                    <option value="Support" className="bg-white dark:bg-slate-800">Support</option>
                    <option value="Hardware" className="bg-white dark:bg-slate-800">Hardware</option>
                    <option value="AMC Services" className="bg-white dark:bg-slate-800">AMC Services</option>
                    <option value="General" className="bg-white dark:bg-slate-800">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest pl-2">
                    Target Close Date
                  </label>
                  <input
                    type="date"
                    value={formData.close_date}
                    onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                    className="w-full px-6 py-4 text-sm font-bold border border-gray-200/80 dark:border-slate-700/80 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest pl-2">
                  WhatsApp Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 919876543210"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-6 py-4 text-sm font-bold border border-gray-200/80 dark:border-slate-700/80 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner backdrop-blur-sm"
                />
              </div>

              <div className="pt-8 flex flex-wrap-reverse sm:flex-nowrap justify-end items-center gap-5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-full sm:w-auto px-6 py-4 text-sm font-black tracking-widest uppercase text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 text-sm font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-2xl shadow-xl shadow-indigo-500/30 dark:shadow-blue-500/20 active:scale-95 transition-all flex justify-center items-center gap-3"
                >
                  {editingDeal ? 'Save Changes' : 'Initialize Deal'}
                  <TrendingUp className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 2: WhatsApp Modal */}
      <WhatsAppModal
        deal={activeWhatsAppDeal}
        isOpen={!!activeWhatsAppDeal}
        onClose={() => setActiveWhatsAppDeal(null)}
      />
    </div>
  );
};
