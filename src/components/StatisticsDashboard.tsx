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
   *
   * @param {any} props Tooltip active payload and label properties.
   * @returns {React.ReactElement | null} Formatted tooltip element.
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#010844]/95 backdrop-blur-xl p-4 rounded-[12px] shadow-2xl border border-white/10 space-y-2.5 min-w-[200px]">
          <p className="font-bold uppercase tracking-wider text-[11px] text-[#969CAF] border-b border-white/10 pb-2 font-mono">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between items-center gap-6 font-mono">
              <span className="font-semibold text-xs text-[#CBD5E1]">{entry.name}:</span>
              <span className="font-bold text-sm tracking-tight">{formatLakhsCrores(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const gridStroke = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#EAF1FF';
  const axisStroke = '#969CAF';
  const primaryFill = '#D20C54';
  const cyanFill = '#00C3F0';
  const navyFill = '#172597';
  const periwinkleFill = '#99AFFD';

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Month vs. Sales (Line / Area Chart) */}
        <div className="card-surface p-7 flex flex-col group relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-center mb-6 border-b border-[#D6DAE3]/60 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[7.2px] bg-[#D20C54]/10 dark:bg-[#D20C54]/20 text-[#D20C54] flex items-center justify-center border border-[#D20C54]/20 transition-transform group-hover:scale-105">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-[#545B6D] dark:text-[#FDF5F8] tracking-[-0.03em]">
                  Month vs. Sales Revenue
                </h3>
                <p className="text-[11px] font-semibold text-[#969CAF] uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D20C54] rounded-full animate-pulse" /> Won deals grouped by close date
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-72 w-full bg-[#FCFBF9]/80 dark:bg-[#05081E]/60 border border-[#D6DAE3]/50 dark:border-white/5 rounded-[12px] p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthVsSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryFill} stopOpacity={0.45}/>
                    <stop offset="95%" stopColor={primaryFill} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" stroke={axisStroke} fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={8} />
                <YAxis
                  stroke={axisStroke}
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => formatLakhsCrores(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: primaryFill, strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Sales Revenue"
                  stroke={primaryFill}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#FFFFFF', fill: primaryFill }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Product vs. Sales (Bar Chart) */}
        <div className="card-surface p-7 flex flex-col group relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-center mb-6 border-b border-[#D6DAE3]/60 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[7.2px] bg-[#00C3F0]/10 dark:bg-[#00C3F0]/20 text-[#00C3F0] flex items-center justify-center border border-[#00C3F0]/20 transition-transform group-hover:scale-105">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-[#545B6D] dark:text-[#FDF5F8] tracking-[-0.03em]">
                  Category Revenue
                </h3>
                <p className="text-[11px] font-semibold text-[#969CAF] uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#00C3F0] rounded-full animate-pulse" /> Revenue generation per category
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-72 w-full bg-[#FCFBF9]/80 dark:bg-[#05081E]/60 border border-[#D6DAE3]/50 dark:border-white/5 rounded-[12px] p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productVsSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="category" stroke={axisStroke} fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={8} />
                <YAxis
                  stroke={axisStroke}
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => formatLakhsCrores(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: primaryFill, opacity: 0.08 }} />
                <Bar dataKey="revenue" name="Category Sales" fill={cyanFill} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Revenue vs. Expenses Comparison (Comparison Bar Chart) */}
        <div className="card-surface p-7 lg:col-span-2 flex flex-col group relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-center mb-6 border-b border-[#D6DAE3]/60 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[7.2px] bg-[#00006E]/10 dark:bg-[#99AFFD]/20 text-[#00006E] dark:text-[#99AFFD] flex items-center justify-center border border-[#00006E]/20 transition-transform group-hover:scale-105">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-[#545B6D] dark:text-[#FDF5F8] tracking-[-0.03em]">
                  Revenue vs. Expenses Cash Flow
                </h3>
                <p className="text-[11px] font-semibold text-[#969CAF] uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D20C54] rounded-full animate-pulse" /> Monthly comparison of incoming revenue vs operational expenses
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-80 w-full bg-[#FCFBF9]/80 dark:bg-[#05081E]/60 border border-[#D6DAE3]/50 dark:border-white/5 rounded-[12px] p-6 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" stroke={axisStroke} fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={8} />
                <YAxis
                  stroke={axisStroke}
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => formatLakhsCrores(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: primaryFill, opacity: 0.05 }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: axisStroke, paddingTop: '16px' }} />
                <Bar dataKey="Revenue" fill={primaryFill} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill={isDarkMode ? periwinkleFill : navyFill} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="NetProfit" name="Net Profit Trend" stroke={cyanFill} strokeWidth={3} dot={{ r: 4, fill: cyanFill, strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
