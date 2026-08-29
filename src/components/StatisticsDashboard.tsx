import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
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
  Cpu,
} from 'lucide-react';
import { Deal, Expense } from '../types';
import { formatLakhsCrores, formatINR } from '../utils/currency';
import { generateBusinessRecommendationsApi } from '../api/apiClient';
import { LeadScoringPredictor } from './LeadScoringPredictor';
import { BusinessAdvisorCard } from './BusinessAdvisorCard';

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

  const [customMlPrediction, setCustomMlPrediction] = useState<string>('');
  const [loadingCustomMl, setLoadingCustomMl] = useState<boolean>(false);
  const [leadIndustry, setLeadIndustry] = useState<string>('Technology');
  const [leadBudget, setLeadBudget] = useState<string>('50000');

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

  const fetchCustomMlPrediction = async (): Promise<void> => {
    setLoadingCustomMl(true);
    try {
      // TODO: Replace with actual call to external Kaggle-trained model API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mockup logic for demonstration
      let score = 45;
      if (leadIndustry === 'Technology' || leadIndustry === 'Finance') score += 20;
      if (parseInt(leadBudget) > 100000) score += 25;
      
      setCustomMlPrediction(`Lead Conversion Score: ${score}%\n\nThis lead has a ${score > 70 ? 'high' : 'moderate'} probability of closing based on historical firmographic data.`);
    } catch (err: unknown) {
      setCustomMlPrediction('Error fetching ML predictions.');
    } finally {
      setLoadingCustomMl(false);
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
        <div className="bg-[#0a0f1c]/90 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.2)] border border-indigo-500/30 space-y-3 min-w-[200px]">
          <p className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-800/80 pb-3">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between items-center gap-6 font-mono">
              <span className="font-bold text-sm">{entry.name}:</span>
              <span className="font-black text-base drop-shadow-sm">{formatLakhsCrores(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const gridStroke = '#334155';
  const axisStroke = '#94a3b8';
  const primaryFill = '#60a5fa';
  const dangerFill = '#fb7185';
  const successFill = '#34d399';

  return (
    <div className="space-y-6">
      {/* Feature 6: Custom ML Model Insights (Kaggle Integration) */}
      <LeadScoringPredictor 
        leadIndustry={leadIndustry} 
        setLeadIndustry={setLeadIndustry} 
        leadBudget={leadBudget} 
        setLeadBudget={setLeadBudget} 
        loadingCustomMl={loadingCustomMl} 
        fetchCustomMlPrediction={fetchCustomMlPrediction} 
        customMlPrediction={customMlPrediction} 
      />

      {/* Feature 5: Gemini 2.5 Flash Lite Business Advisor Card */}
      <BusinessAdvisorCard 
        topProduct={topProduct} 
        topProductRevenue={topProductRevenue} 
        totalSales={totalSales} 
        totalExpenses={totalExpenses} 
        loadingAi={loadingAi} 
        aiError={aiError} 
        recommendations={recommendations} 
        fetchAiRecommendations={fetchAiRecommendations} 
      />

      {/* Feature 4: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Month vs. Sales (Line Chart) */}
        <div className="relative overflow-hidden bg-[#0a0f1c]/90 backdrop-blur-3xl border border-indigo-500/20 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.15)] hover:border-indigo-500/40 transition-all duration-500 group flex flex-col">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-wrap justify-between items-center mb-8 border-b border-indigo-500/20 pb-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 text-indigo-400 rounded-[1.5rem] border border-indigo-500/20 shadow-inner group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                <TrendingUp className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-serif font-black text-3xl text-white tracking-tight drop-shadow-md">
                  Month vs. Sales Revenue
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" /> Won deals grouped by close date
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-72 w-full bg-slate-900/50 border border-slate-700/50 rounded-[2rem] p-6 shadow-inner backdrop-blur-sm z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthVsSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryFill} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={primaryFill} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} opacity={0.3} />
                <XAxis dataKey="month" stroke={axisStroke} fontSize={12} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis
                  stroke={axisStroke}
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => formatLakhsCrores(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridStroke, strokeWidth: 2, strokeOpacity: 0.5 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Sales Revenue"
                  stroke={primaryFill}
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 8, strokeWidth: 0, fill: primaryFill }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Product vs. Sales (Bar Chart) */}
        <div className="relative overflow-hidden bg-[#0a0f1c]/90 backdrop-blur-3xl border border-blue-500/20 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:border-blue-500/40 transition-all duration-500 group flex flex-col">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-wrap justify-between items-center mb-8 border-b border-blue-500/20 pb-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-blue-500/10 text-blue-400 rounded-[1.5rem] border border-blue-500/20 shadow-inner group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                <BarChart3 className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-serif font-black text-3xl text-white tracking-tight drop-shadow-md">
                  Category Revenue
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Revenue generation per category
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-72 w-full bg-slate-900/50 border border-slate-700/50 rounded-[2rem] p-6 shadow-inner backdrop-blur-sm z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productVsSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} opacity={0.3} />
                <XAxis dataKey="category" stroke={axisStroke} fontSize={12} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis
                  stroke={axisStroke}
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => formatLakhsCrores(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: gridStroke, opacity: 0.1 }} />
                <Bar dataKey="revenue" name="Category Sales" fill={primaryFill} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Revenue vs. Expenses Comparison (Comparison Bar Chart) */}
        <div className="relative overflow-hidden bg-[#0a0f1c]/90 backdrop-blur-3xl border border-orange-500/20 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(249,115,22,0.15)] hover:border-orange-500/40 lg:col-span-2 transition-all duration-500 group flex flex-col">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-wrap justify-between items-center mb-8 border-b border-orange-500/20 pb-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-orange-500/10 text-orange-400 rounded-[1.5rem] border border-orange-500/20 shadow-inner group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-500">
                <IndianRupee className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-serif font-black text-3xl text-white tracking-tight drop-shadow-md">
                  Revenue vs. Expenses Cash Flow
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" /> Monthly comparison of incoming revenue vs operational expenses
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-80 w-full bg-slate-900/50 border border-slate-700/50 rounded-[2rem] p-8 shadow-inner backdrop-blur-sm z-10">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} opacity={0.3} />
                <XAxis dataKey="month" stroke={axisStroke} fontSize={12} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis
                  stroke={axisStroke}
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => formatLakhsCrores(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: gridStroke, opacity: 0.1 }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: axisStroke, paddingTop: '20px' }} />
                <Bar dataKey="Revenue" fill={primaryFill} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expenses" fill={dangerFill} radius={[6, 6, 0, 0]} />
                <Line type="monotone" dataKey="NetProfit" name="Net Profit Trend" stroke={successFill} strokeWidth={4} dot={{ r: 6, fill: successFill, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
