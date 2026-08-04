import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Lightbulb,
  IndianRupee,
} from 'lucide-react';
import { Deal, Expense } from '../types';
import { formatLakhsCrores, formatINR } from '../utils/currency';
import { generateBusinessRecommendationsApi } from '../api/apiClient';

/**
 * Props for StatisticsDashboard component.
 */
interface StatisticsDashboardProps {
  /** Array of deals */
  deals: Deal[];
  /** Array of expenses */
  expenses: Expense[];
  /** Dark mode flag */
  isDarkMode?: boolean;
}

/**
 * Executive Analytics & Gemini 2.5 Flash Lite Advisor Dashboard component.
 * Features line charts, category bar charts, cash flow comparison charts, and AI business recommendation generator.
 *
 * @param {StatisticsDashboardProps} props Component properties.
 * @returns {React.ReactElement} Statistics dashboard layout.
 */
export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ deals, expenses, isDarkMode = false }) => {
  const [recommendations, setRecommendations] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filter Won deals
  const wonDeals = deals.filter((d) => d.stage === 'Won');
  const totalSales = wonDeals.reduce((sum, d) => sum + d.deal_value, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Top Product Category calculation
  const categoryRevenueMap: Record<string, number> = {};
  wonDeals.forEach((d) => {
    categoryRevenueMap[d.product_category] =
      (categoryRevenueMap[d.product_category] || 0) + d.deal_value;
  });

  let topProduct = 'Software';
  let topProductRevenue = 0;
  Object.entries(categoryRevenueMap).forEach(([cat, rev]) => {
    if (rev > topProductRevenue) {
      topProduct = cat;
      topProductRevenue = rev;
    }
  });

  /**
   * Triggers API request to fetch Gemini 2.5 Flash Lite business strategy recommendations.
   */
  const fetchAiRecommendations = async (): Promise<void> => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const recs = await generateBusinessRecommendationsApi({
        topProduct,
        topProductRevenue,
        totalSales,
        totalExpenses,
      });

      setRecommendations(recs || '');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error communicating with Gemini 2.5 Flash Lite';
      setAiError(msg);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiRecommendations();
  }, [totalSales, totalExpenses]);

  // Data Preparation for Charts

  // Chart 1: Month vs. Sales (Line Chart)
  const monthMap: Record<string, number> = {};
  wonDeals.forEach((d) => {
    const month = d.close_date ? d.close_date.substring(0, 7) : '2026-07';
    monthMap[month] = (monthMap[month] || 0) + d.deal_value;
  });

  const monthVsSalesData = Object.keys(monthMap)
    .sort()
    .map((m) => {
      const [year, monthNum] = m.split('-');
      const dateObj = new Date(parseInt(year, 10), parseInt(monthNum, 10) - 1, 1);
      const label = dateObj.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      return {
        month: label,
        rawMonth: m,
        revenue: monthMap[m],
        revenueFormatted: formatLakhsCrores(monthMap[m]),
      };
    });

  // Chart 2: Product vs. Sales (Bar Chart)
  const productVsSalesData = Object.entries(categoryRevenueMap).map(([cat, rev]) => ({
    category: cat,
    revenue: rev,
    revenueFormatted: formatLakhsCrores(rev),
  }));

  // Chart 3: Revenue vs. Expenses Comparison Bar Chart
  const expenseMonthMap: Record<string, number> = {};
  expenses.forEach((e) => {
    const month = e.date_logged ? e.date_logged.substring(0, 7) : '2026-07';
    expenseMonthMap[month] = (expenseMonthMap[month] || 0) + e.amount;
  });

  const allMonths = Array.from(
    new Set([...Object.keys(monthMap), ...Object.keys(expenseMonthMap)])
  ).sort();

  const comparisonData = allMonths.map((m) => {
    const [year, monthNum] = m.split('-');
    const dateObj = new Date(parseInt(year, 10), parseInt(monthNum, 10) - 1, 1);
    const label = dateObj.toLocaleString('en-US', { month: 'short', year: '2-digit' });

    const rev = monthMap[m] || 0;
    const exp = expenseMonthMap[m] || 0;
    return {
      month: label,
      Revenue: rev,
      Expenses: exp,
      NetProfit: rev - exp,
    };
  });

  /**
   * Custom Recharts Tooltip component formatting raw monetary values into Indian currency notation.
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-gray-200/80 dark:border-slate-700/80 space-y-3 min-w-[200px]">
          <p className="font-black uppercase tracking-widest text-[11px] text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-800 pb-3">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between items-center gap-6 font-mono">
              <span className="font-bold text-sm">{entry.name}:</span>
              <span className="font-black text-base">{formatLakhsCrores(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const gridStroke = isDarkMode ? '#334155' : '#f1f5f9';
  const axisStroke = isDarkMode ? '#94a3b8' : '#64748b';
  const primaryFill = isDarkMode ? '#60a5fa' : '#4f46e5';
  const dangerFill = isDarkMode ? '#fb7185' : '#ef4444';

  return (
    <div className="space-y-6">
      {/* Feature 5: Gemini 2.5 Flash Lite Business Advisor Card */}
      <div className="relative rounded-[2.5rem] p-[1px] overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/20 transition-all duration-500">
        {/* Animated Gradient Border Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 via-purple-300 to-indigo-400 dark:from-indigo-500/50 dark:via-purple-500/50 dark:to-blue-500/50 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Inner Card Background */}
        <div className="relative h-full bg-white/95 dark:bg-slate-900/90 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-2xl flex flex-col gap-6">
          {/* Subtle Background Pattern & Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent dark:from-indigo-900/30 pointer-events-none rounded-[2.5rem]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-700" />
          
          <div className="absolute -top-10 -right-10 p-8 opacity-[0.04] dark:opacity-[0.02] pointer-events-none transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000">
            <Sparkles className="w-96 h-96 text-indigo-500 dark:text-indigo-400" />
          </div>

          <div className="relative z-10 flex flex-wrap justify-between items-center gap-6 border-b border-gray-100/80 dark:border-slate-800/80 pb-8">
            <div className="flex items-center gap-8">
              <div className="p-5 bg-indigo-50/80 dark:bg-blue-900/40 rounded-[1.5rem] border border-indigo-100 dark:border-blue-800/60 text-indigo-600 dark:text-blue-400 shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-4xl font-serif font-black text-gray-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
                  Gemini 2.5 Flash Lite Advisor
                </h2>
                <p className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                  Real-time sales & expense intelligence
                </p>
              </div>
            </div>

            <button
              onClick={fetchAiRecommendations}
              disabled={loadingAi}
              className="px-8 py-5 text-[14px] font-black tracking-widest uppercase bg-indigo-600 hover:bg-indigo-500 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl border-2 border-transparent transition-all shadow-xl shadow-indigo-500/30 dark:shadow-blue-500/20 flex items-center gap-3 hover:-translate-y-1 active:scale-95"
            >
              <RefreshCw className={`w-6 h-6 stroke-[3] ${loadingAi ? 'animate-spin' : ''}`} />
              {loadingAi ? 'Synthesizing...' : 'Refresh Insights'}
            </button>
          </div>

          <div className="relative z-10">
            {/* Quick Metrics Strip */}
            <div className="flex flex-wrap md:flex-nowrap gap-6 bg-gray-50/50 dark:bg-slate-950/40 p-10 rounded-[2.5rem] border border-gray-200/80 dark:border-slate-800/80 shadow-inner backdrop-blur-sm text-xs divide-y md:divide-y-0 md:divide-x divide-gray-200/80 dark:divide-slate-700/80">
              <div className="w-full md:w-1/4 pt-2 md:pt-0 md:pl-10 first:pt-0 first:pl-0">
                <span className="text-gray-400 dark:text-slate-500 block text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500 stroke-[3]"/> Top Category
                </span>
                <strong className="font-serif font-black text-3xl text-gray-900 dark:text-slate-100">{topProduct}</strong>
              </div>
              <div className="w-full md:w-1/4 pt-8 md:pt-0 md:pl-10">
                <span className="text-gray-400 dark:text-slate-500 block text-[11px] font-black uppercase tracking-widest mb-4">Category Revenue</span>
                <strong className="font-serif font-black text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">{formatLakhsCrores(topProductRevenue)}</strong>
              </div>
              <div className="w-full md:w-1/4 pt-8 md:pt-0 md:pl-10">
                <span className="text-gray-400 dark:text-slate-500 block text-[11px] font-black uppercase tracking-widest mb-4">Total Won Sales</span>
                <strong className="font-serif font-black text-3xl text-gray-900 dark:text-slate-100">{formatLakhsCrores(totalSales)}</strong>
              </div>
              <div className="w-full md:w-1/4 pt-8 md:pt-0 md:pl-10">
                <span className="text-gray-400 dark:text-slate-500 block text-[11px] font-black uppercase tracking-widest mb-4">Total Expenses</span>
                <strong className="font-serif font-black text-3xl text-rose-600 dark:text-rose-500">{formatLakhsCrores(totalExpenses)}</strong>
              </div>
            </div>

            {/* Recommendations Box */}
            <div className="mt-8">
              {loadingAi ? (
                <div className="p-16 bg-white/60 dark:bg-slate-800/60 rounded-[2.5rem] border border-indigo-100 dark:border-slate-700/80 flex flex-col items-center justify-center gap-8 min-h-[300px] backdrop-blur-md shadow-inner">
                  <div className="relative">
                    <div className="w-20 h-20 border-[4px] border-indigo-100 dark:border-blue-900 rounded-full"></div>
                    <div className="w-20 h-20 border-[4px] border-indigo-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="text-[15px] font-black text-gray-500 dark:text-slate-400 animate-pulse tracking-widest uppercase">Synthesizing Strategic Intelligence...</p>
                </div>
              ) : aiError ? (
                <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-3xl text-sm font-medium flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  {aiError}
                </div>
              ) : (
                <div className="p-10 bg-white/80 dark:bg-slate-800/60 rounded-[2.5rem] border border-indigo-100/80 dark:border-slate-700/80 text-sm leading-relaxed text-gray-900 dark:text-slate-200 backdrop-blur-md shadow-xl shadow-indigo-500/5 relative overflow-hidden group/box">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                  <div className="font-black text-[13px] text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3 pl-2">
                    <Lightbulb className="w-6 h-6 stroke-[3] text-indigo-500 dark:text-indigo-400" />
                    Actionable Strategic Recommendations
                  </div>
                  <div className="whitespace-pre-wrap font-serif text-[17px] text-gray-700 dark:text-slate-300 leading-[1.8] pl-4 font-medium">
                    {recommendations || 'Click refresh to generate AI insights.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature 4: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Month vs. Sales (Line Chart) */}
        <div className="relative overflow-hidden bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-indigo-100 dark:border-slate-800/80 rounded-[3rem] p-10 shadow-xl shadow-indigo-500/5 dark:shadow-none hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/10 transition-all duration-500 group flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-700" />
          <div className="relative z-10 flex flex-wrap justify-between items-center mb-8 border-b border-gray-100/80 dark:border-slate-800/60 pb-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-50/80 dark:bg-blue-900/40 text-indigo-600 dark:text-blue-400 rounded-[1.5rem] border border-indigo-100 dark:border-blue-800/60 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-serif font-black text-3xl text-gray-900 dark:text-slate-100 tracking-tight">
                  Month vs. Sales Revenue
                </h3>
                <p className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-2">Won deals grouped by close date</p>
              </div>
            </div>
          </div>

          <div className="h-72 w-full bg-gray-50/50 dark:bg-slate-950/40 border border-gray-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-inner backdrop-blur-sm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthVsSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" stroke={axisStroke} fontSize={12} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis
                  stroke={axisStroke}
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => formatLakhsCrores(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridStroke, strokeWidth: 2 }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Sales Revenue"
                  stroke={primaryFill}
                  strokeWidth={3}
                  dot={{ r: 5, fill: primaryFill, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Product vs. Sales (Bar Chart) */}
        <div className="relative overflow-hidden bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-blue-100 dark:border-slate-800/80 rounded-[3rem] p-10 shadow-xl shadow-blue-500/5 dark:shadow-none hover:shadow-blue-500/10 dark:hover:shadow-blue-500/10 transition-all duration-500 group flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/15 transition-all duration-700" />
          <div className="relative z-10 flex flex-wrap justify-between items-center mb-8 border-b border-gray-100/80 dark:border-slate-800/60 pb-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-blue-50/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-[1.5rem] border border-blue-100 dark:border-blue-800/60 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <BarChart3 className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-serif font-black text-3xl text-gray-900 dark:text-slate-100 tracking-tight">
                  Category Revenue
                </h3>
                <p className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-2">Revenue generation per category</p>
              </div>
            </div>
          </div>

          <div className="h-72 w-full bg-gray-50/50 dark:bg-slate-950/40 border border-gray-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-inner backdrop-blur-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productVsSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="category" stroke={axisStroke} fontSize={12} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis
                  stroke={axisStroke}
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => formatLakhsCrores(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: gridStroke, opacity: 0.4 }} />
                <Bar dataKey="revenue" name="Category Sales" fill={primaryFill} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Revenue vs. Expenses Comparison (Comparison Bar Chart) */}
        <div className="relative overflow-hidden bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-orange-100 dark:border-slate-800/80 rounded-[3rem] p-10 shadow-xl shadow-orange-500/5 dark:shadow-none lg:col-span-2 hover:shadow-orange-500/10 dark:hover:shadow-orange-500/10 transition-all duration-500 group flex flex-col">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 dark:bg-orange-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-orange-500/15 transition-all duration-700" />
          <div className="relative z-10 flex flex-wrap justify-between items-center mb-8 border-b border-gray-100/80 dark:border-slate-800/60 pb-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-orange-50/80 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-[1.5rem] border border-orange-100 dark:border-orange-800/60 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <IndianRupee className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-serif font-black text-3xl text-gray-900 dark:text-slate-100 tracking-tight">
                  Revenue vs. Expenses Cash Flow
                </h3>
                <p className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-2">Monthly comparison of incoming revenue vs operational expenses</p>
              </div>
            </div>
          </div>

          <div className="h-80 w-full bg-gray-50/50 dark:bg-slate-950/40 border border-gray-200/80 dark:border-slate-800/80 rounded-[2rem] p-8 shadow-inner backdrop-blur-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" stroke={axisStroke} fontSize={12} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis
                  stroke={axisStroke}
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => formatLakhsCrores(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: axisStroke }} />
                <Bar dataKey="Revenue" fill={primaryFill} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill={dangerFill} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
