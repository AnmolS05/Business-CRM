import React, { useState, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Upload,
  Sparkles,
  AlertCircle,
  FileCheck,
  Zap,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatINR, formatLakhsCrores } from '../utils/currency';
import { analyzeDocumentApi } from '../api/apiClient';
import { DynamicChartData, ChartDataset } from '../types';
import { UploadDropzone } from './UploadDropzone';

/**
 * Palette of colors assigned to dynamic chart datasets.
 */
const CHART_COLORS = ['#3b82f6', '#fbbf24', '#3b82f6', '#a855f7', '#ec4899', '#06b6d4'];

interface DocumentParserProps {
  isDarkMode?: boolean;
}

/**
 * Gemini 2.5 Flash Lite "Drop & Analyze" Document Parser component.
 * Allows file upload or sample invoice/report testing, sending files to Gemini 2.5 Flash Lite for Markdown insights & dynamic chart extraction.
 *
 * @returns {React.ReactElement} Document parser layout.
 */
export const DocumentParser: React.FC<DocumentParserProps> = ({ isDarkMode = false }) => {
  const [, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [markdownSummary, setMarkdownSummary] = useState<string | null>(null);
  const [chartData, setChartData] = useState<DynamicChartData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * File selection input change handler.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      analyzeFile(selected);
    }
  };

  /**
   * File drag and drop handler.
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      analyzeFile(selected);
    }
  };

  /**
   * Drag over event handler preventing browser drop navigation.
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /**
   * Parses raw Gemini 2.5 Flash Lite response text to extract clean Markdown and embedded JSON chart structures.
   *
   * @param {string} rawText Raw text string returned by Gemini 2.5 Flash Lite API model.
   * @returns {{ cleanText: string; parsedChart: DynamicChartData | null }} Separated markdown text and chart payload.
   */
  const parseResponse = (rawText: string): { cleanText: string; parsedChart: DynamicChartData | null } => {
    if (!rawText) return { cleanText: '', parsedChart: null };

    const jsonRegex = /```json\s*([\s\S]*?)\s*```/i;
    const match = rawText.match(jsonRegex);

    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1].trim());

        if (
          parsed &&
          typeof parsed.chartTitle === 'string' &&
          Array.isArray(parsed.labels) &&
          parsed.labels.length > 0 &&
          Array.isArray(parsed.datasets) &&
          parsed.datasets.length > 0
        ) {
          const cleanText = rawText.replace(jsonRegex, '').trim();
          return {
            cleanText,
            parsedChart: {
              chartTitle: parsed.chartTitle || 'Financial Data Comparison',
              chartType: parsed.chartType === 'line' ? 'line' : 'bar',
              labels: parsed.labels,
              datasets: parsed.datasets,
            },
          };
        }
      } catch (e) {
        console.warn('Could not parse Gemini 2.5 Flash Lite chart JSON structure:', e);
      }
    }

    return { cleanText: rawText, parsedChart: null };
  };

  /**
   * Executes document analysis API request via apiClient.
   *
   * @param {File} fileToAnalyze Target document file.
   */
  const analyzeFile = async (fileToAnalyze: File): Promise<void> => {
    setLoading(true);
    setLoadingStage(0);
    setError(null);
    setMarkdownSummary(null);
    setChartData(null);
    setFileName(fileToAnalyze.name);

    // Simulate progress stages
    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 800);

    try {
      const data = await analyzeDocumentApi(fileToAnalyze);
      const { cleanText, parsedChart } = parseResponse(data.markdownSummary);
      setMarkdownSummary(cleanText);
      setChartData(parsedChart);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error analyzing document';
      setError(msg);
    } finally {
      clearInterval(stageInterval);
      setLoading(false);
    }
  };

  /**
   * Recharts data transformation converting column dataset representation into row-based array.
   */
  const rechartsData = useMemo(() => {
    if (!chartData) return [];
    return chartData.labels.map((label, idx) => {
      const row: Record<string, any> = { name: label };
      chartData.datasets.forEach((dataset) => {
        row[dataset.label] = dataset.data[idx] ?? 0;
      });
      return row;
    });
  }, [chartData]);

  /**
   * Generates mock sample files for quick 1-click feature testing.
   *
   * @param {'invoice' | 'report'} sampleType Type of sample document to synthesize.
   */
  const handleSampleDoc = (sampleType: 'invoice' | 'report') => {
    let content = '';
    let filename = '';
    const type = 'text/plain';

    if (sampleType === 'invoice') {
      filename = 'Invoice_IN-2026-884.txt';
      content = `
INVOICE - TATA DIGITAL LOGISTICS
Invoice Date: 2026-07-28
Bill To: Indian CRM Software Solutions

Line Items:
1. Enterprise Cloud Infrastructure Setup - ₹15,00,000
2. Annual Maintenance Contract (AMC) Year 1 - ₹5,00,000
3. Security Audit & Pen-testing - ₹2,50,000

Total Taxable Value: ₹22,50,000
GST (18%): ₹4,05,000
Grand Total: ₹26,55,000 (₹26.55 Lakhs)

Itemized Value Breakdown:
- Infrastructure: ₹15,00,000
- AMC Maintenance: ₹5,00,000
- Security Audit: ₹2,50,000
- Tax (GST 18%): ₹4,05,000
`;
    } else {
      filename = 'Q2_Financial_Audit_Report.txt';
      content = `
QUARTERLY FINANCIAL PERFORMANCE REPORT (Q2 2026)
Company: South Asia Tech Ventures Pvt Ltd

Quarterly Revenue vs Expense Breakdown:
- Gross Revenues: ₹1,20,00,000 (₹1.20 Crores)
- Operating Expenses: ₹35,00,000 (₹35 Lakhs)
- Employee Payroll: ₹45,00,000 (₹45 Lakhs)
- Marketing & Sales: ₹12,00,000 (₹12 Lakhs)
- Net EBITDA Profit: ₹28,00,000 (₹28 Lakhs)

Comparison across Categories (Projected vs Actual):
- Software Revenues: Projected ₹1,00,00,000, Actual ₹1,20,00,000
- Operating Costs: Projected ₹30,00,000, Actual ₹35,00,000
- Payroll Costs: Projected ₹45,00,000, Actual ₹45,00,000
- Marketing: Projected ₹15,00,000, Actual ₹12,00,000
`;
    }

    const sampleFile = new File([content], filename, { type });
    setFile(sampleFile);
    analyzeFile(sampleFile);
  };

  /**
   * Tooltip component formatting raw numbers in dynamic charts.
   */
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 text-xs space-y-1">
          <p className="font-serif font-semibold border-b border-gray-100 dark:border-slate-700 pb-1 text-gray-900 dark:text-slate-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4 font-mono">
              <span>{entry.name}:</span>
              <span className="font-semibold">{formatINR(entry.value)} ({formatLakhsCrores(entry.value)})</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const gridStroke = isDarkMode ? '#334155' : '#f1f5f9';
  const axisStroke = isDarkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="relative overflow-hidden bg-[#0a0f1c]/80 backdrop-blur-2xl border border-indigo-500/20 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.15)] hover:border-indigo-500/40 transition-all duration-500 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-[1.25rem] shadow-inner flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
              <Zap className="w-8 h-8 stroke-[2.5] group-hover:animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-black text-white tracking-tight drop-shadow-md">
                Gemini 3.1 Flash Lite "Drop & Analyze"
              </h2>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                Extract insights, breakdowns, and dynamic interactive charts
              </p>
            </div>
          </div>

          {/* Quick Sample Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 shadow-inner backdrop-blur-sm group/samples">
            <span className="text-slate-400 font-black flex items-center gap-2 text-[10px] uppercase tracking-widest pl-2 group-hover/samples:text-slate-300 transition-colors">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Try Samples
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => handleSampleDoc('invoice')}
                disabled={loading}
                className="px-5 py-2.5 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white rounded-xl font-bold transition-all text-xs shadow-sm hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Invoice (₹26.55L)
              </button>
              <button
                onClick={() => handleSampleDoc('report')}
                disabled={loading}
                className="px-5 py-2.5 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white rounded-xl font-bold transition-all text-xs shadow-sm hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Q2 Report (₹1.2Cr)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <UploadDropzone 
        handleDrop={handleDrop} 
        handleDragOver={handleDragOver} 
        fileInputRef={fileInputRef} 
        handleFileChange={handleFileChange} 
      />

      {/* Processing Loader */}
      {loading && (
        <div className="relative bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-indigo-100/50 dark:border-slate-800 rounded-[2.5rem] p-12 text-center shadow-2xl dark:shadow-none animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse pointer-events-none" />
          <div className="relative z-10 space-y-8 max-w-lg mx-auto">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 border-[4px] border-indigo-100 dark:border-blue-900 rounded-full" />
              <div className="w-20 h-20 border-[4px] border-indigo-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
            </div>
            <div>
              <h4 className="font-serif font-black text-2xl text-gray-900 dark:text-slate-100 tracking-tight">
                Gemini 2.5 Flash Lite Synthesizing...
              </h4>
            </div>
            
            {/* Sequential Progress Indicators */}
            <div className="space-y-4 pt-4 text-left">
              {[
                { stage: 0, text: 'Uploading secure document payload...' },
                { stage: 1, text: 'Processing multi-modal structures...' },
                { stage: 2, text: 'Extracting semantic charts & JSON...' },
                { stage: 3, text: 'Finalizing actionable business insights...' }
              ].map((step) => (
                <div key={step.stage} className={`flex items-center gap-4 transition-all duration-500 ${loadingStage >= step.stage ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${loadingStage > step.stage ? 'bg-emerald-500 border-emerald-500 text-white' : loadingStage === step.stage ? 'bg-indigo-100 border-indigo-500 text-indigo-500' : 'border-gray-300 dark:border-slate-700 text-transparent'}`}>
                    {loadingStage > step.stage ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : loadingStage === step.stage ? (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    ) : null}
                  </div>
                  <span className={`text-sm font-bold tracking-wide ${loadingStage >= step.stage ? 'text-gray-900 dark:text-slate-200' : 'text-gray-400 dark:text-slate-600'}`}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 bg-rose-50/80 dark:bg-rose-950/40 backdrop-blur-md border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-inner">
          <AlertCircle className="w-6 h-6 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Result Card */}
      {markdownSummary && !loading && (
        <div className="relative group bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-indigo-200/80 dark:border-blue-800/60 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-500/10 dark:shadow-none hover:shadow-indigo-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 mt-10 overflow-hidden">
          {/* Success Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-700" />
          
          <div className="relative z-10 flex flex-wrap justify-between items-center border-b border-gray-100/80 dark:border-slate-800/80 pb-8 mb-8 gap-6">
            <div className="flex items-center gap-8">
              <div className="p-5 bg-indigo-50/80 dark:bg-blue-900/40 text-indigo-600 dark:text-blue-400 rounded-[1.5rem] border border-indigo-100 dark:border-blue-800/60 shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <FileCheck className="w-10 h-10 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-serif font-black text-4xl text-gray-900 dark:text-slate-100 tracking-tight">
                  Analysis Complete
                </h3>
                <div className="text-[11px] font-black text-gray-400 dark:text-slate-500 flex items-center gap-2 mt-2 uppercase tracking-widest">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
                  Source Document: <span className="text-gray-900 dark:text-slate-300 font-mono tracking-normal normal-case text-xs">{fileName}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 text-[13px] font-black uppercase tracking-widest text-indigo-700 dark:text-blue-300 bg-indigo-50 dark:bg-blue-900/30 border-2 border-indigo-200 dark:border-blue-800/50 rounded-2xl hover:bg-indigo-100 hover:text-indigo-800 dark:hover:bg-blue-800/60 transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center gap-2"
            >
              Analyze Another Document
            </button>
          </div>

          {/* Dynamic Interactive Recharts Visual Comparison */}
          {chartData && (
            <div className="relative z-10 bg-gray-50/50 dark:bg-slate-950/40 border border-gray-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-10 mb-10 shadow-inner backdrop-blur-sm">
              <div className="flex flex-wrap justify-between items-center pb-6 mb-10 border-b border-gray-200/60 dark:border-slate-700/60 gap-4">
                <h4 className="font-serif font-black text-2xl text-gray-900 dark:text-slate-100 flex items-center gap-4 tracking-tight">
                  {chartData.chartType === 'line' ? (
                    <div className="p-3 rounded-2xl bg-white dark:bg-blue-900/40 text-indigo-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700">
                      <TrendingUp className="w-6 h-6 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-white dark:bg-blue-900/40 text-indigo-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700">
                      <BarChart3 className="w-6 h-6 stroke-[3]" />
                    </div>
                  )}
                  {chartData.chartTitle}
                </h4>
                <span className="text-[11px] font-black text-indigo-600 dark:text-blue-400 bg-indigo-50/80 dark:bg-blue-900/40 px-4 py-2 rounded-xl border border-indigo-100 dark:border-blue-800/50 uppercase tracking-widest shadow-inner">
                  {chartData.chartType === 'line' ? 'Trend Analysis' : 'Comparison Chart'}
                </span>
              </div>

              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {chartData.chartType === 'line' ? (
                    <LineChart data={rechartsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="name" stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} dy={10} fontWeight={600} />
                      <YAxis stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatLakhsCrores(v)} fontWeight={600} />
                      <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: gridStroke, strokeWidth: 2 }} />
                      <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 'bold', color: axisStroke, paddingTop: '24px' }} />
                      {chartData.datasets.map((dataset, idx) => (
                        <Line
                          key={dataset.label}
                          type="monotone"
                          dataKey={dataset.label}
                          stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                          strokeWidth={4}
                          dot={{ r: 5, fill: CHART_COLORS[idx % CHART_COLORS.length], strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 8, strokeWidth: 0 }}
                        />
                      ))}
                    </LineChart>
                  ) : (
                    <BarChart data={rechartsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="name" stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} dy={10} fontWeight={600} />
                      <YAxis stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatLakhsCrores(v)} fontWeight={600} />
                      <Tooltip content={<CustomChartTooltip />} cursor={{ fill: gridStroke, opacity: 0.4 }} />
                      <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 'bold', color: axisStroke, paddingTop: '24px' }} />
                      {chartData.datasets.map((dataset, idx) => (
                        <Bar
                          key={dataset.label}
                          dataKey={dataset.label}
                          fill={CHART_COLORS[idx % CHART_COLORS.length]}
                          radius={[6, 6, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Render Written Markdown Analysis */}
          <div className="relative z-10 p-8 sm:p-10 bg-white/50 dark:bg-slate-950/40 rounded-3xl border border-indigo-100/50 dark:border-slate-800/80 shadow-inner backdrop-blur-md">
            <div className="document-markdown prose prose-sm sm:prose-base dark:prose-invert max-w-none font-serif leading-[1.8] text-gray-800 dark:text-slate-300">
              <ReactMarkdown>{markdownSummary}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
