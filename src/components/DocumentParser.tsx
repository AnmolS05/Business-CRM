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
 * Palette of colors assigned to dynamic chart datasets using Bridgement design tokens.
 */
const CHART_COLORS = ['#D20C54', '#00C3F0', '#172597', '#5BD6F5', '#99AFFD', '#545B6D'];

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
  const [part2Header, setPart2Header] = useState<string>('Part 2: Visual Comparison');
  const [part2Body, setPart2Body] = useState<string>('');
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
   * Parses raw Gemini response text to extract clean Part 1 markdown, Part 2 section headers, and embedded JSON chart structures.
   *
   * @param {string} rawText Raw text string returned by Gemini API model.
   * @returns {{ part1Text: string; part2Header: string; part2Body: string; parsedChart: DynamicChartData | null }} Separated markdown text, Part 2 metadata, and chart payload.
   */
  const parseResponse = (
    rawText: string
  ): {
    part1Text: string;
    part2Header: string;
    part2Body: string;
    parsedChart: DynamicChartData | null;
  } => {
    if (!rawText) return { part1Text: '', part2Header: '', part2Body: '', parsedChart: null };

    const jsonRegex = /```json\s*([\s\S]*?)\s*```/i;
    const match = rawText.match(jsonRegex);
    let parsedChart: DynamicChartData | null = null;

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
          parsedChart = {
            chartTitle: parsed.chartTitle || 'Financial Data Comparison',
            chartType: parsed.chartType === 'line' ? 'line' : 'bar',
            labels: parsed.labels,
            datasets: parsed.datasets,
          };
        }
      } catch (e) {
        console.warn('Could not parse Gemini chart JSON structure:', e);
      }
    }

    // Split text into Part 1 and Part 2 sections
    const part2Regex = /(?:^|\n)(#{1,4}\s*(?:PART|Part)\s*2[^\n]*|(?:\*\*|__)?(?:PART|Part)\s*2(?:\*\*|__)?[^\n]*)([\s\S]*)$/i;
    const part2Match = rawText.match(part2Regex);

    if (part2Match && part2Match.index !== undefined) {
      const part1Text = rawText.substring(0, part2Match.index).trim();
      const rawHeader = part2Match[1].replace(/^#+\s*/, '').replace(/^[*_]+|[*_]+$/g, '').trim();
      const part2Body = part2Match[2].replace(jsonRegex, '').trim();

      return {
        part1Text: part1Text || rawText.replace(jsonRegex, '').trim(),
        part2Header: rawHeader || 'Part 2: Visual Comparison',
        part2Body,
        parsedChart,
      };
    }

    const cleanText = rawText.replace(jsonRegex, '').trim();
    return {
      part1Text: cleanText,
      part2Header: parsedChart ? 'Part 2: Visual Comparison' : '',
      part2Body: '',
      parsedChart,
    };
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
    setPart2Header('Part 2: Visual Comparison');
    setPart2Body('');
    setChartData(null);
    setFileName(fileToAnalyze.name);

    // Simulate progress stages
    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 800);

    try {
      const data = await analyzeDocumentApi(fileToAnalyze);
      const { part1Text, part2Header: header, part2Body: body, parsedChart } = parseResponse(data.markdownSummary);
      setMarkdownSummary(part1Text);
      setPart2Header(header);
      setPart2Body(body);
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
   *
   * @param {any} props Tooltip active payload and label properties.
   * @returns {React.ReactElement | null} Formatted tooltip element.
   */
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#010844]/95 text-[#FDF5F8] p-3.5 rounded-[12px] shadow-2xl border border-white/10 text-xs space-y-1.5 min-w-[180px]">
          <p className="font-heading font-bold border-b border-white/10 pb-1.5 text-[#FDF5F8]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4 font-mono">
              <span className="text-[#CBD5E1]">{entry.name}:</span>
              <span className="font-bold">{formatINR(entry.value)} ({formatLakhsCrores(entry.value)})</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const gridStroke = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#EAF1FF';
  const axisStroke = '#969CAF';

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="card-surface p-7 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[7.2px] bg-[#D20C54]/10 dark:bg-[#D20C54]/20 text-[#D20C54] border border-[#D20C54]/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Zap className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-[#545B6D] dark:text-[#FDF5F8] tracking-[-0.03em]">
              Gemini 3.1 Flash Lite "Drop & Analyze"
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#969CAF] mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C3F0] animate-pulse"></span>
              Extract insights, breakdowns, and dynamic interactive charts
            </p>
          </div>
        </div>

        {/* Quick Sample Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#FCFBF9] dark:bg-[#05081E]/60 p-3 rounded-[7.2px] border border-[#D6DAE3]/60 dark:border-white/10">
          <span className="text-[#969CAF] font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider pl-1">
            <Sparkles className="w-3.5 h-3.5 text-[#00C3F0]" />
            Try Samples
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSampleDoc('invoice')}
              disabled={loading}
              className="btn-secondary h-[36px] px-3.5 text-xs inline-flex items-center"
            >
              Invoice (₹26.55L)
            </button>
            <button
              onClick={() => handleSampleDoc('report')}
              disabled={loading}
              className="btn-secondary h-[36px] px-3.5 text-xs inline-flex items-center"
            >
              Q2 Report (₹1.2Cr)
            </button>
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
        <div className="card-surface p-10 text-center rounded-[12px] animate-in fade-in zoom-in-95 duration-300">
          <div className="space-y-6 max-w-md mx-auto">
            <div className="relative w-14 h-14 mx-auto">
              <div className="w-14 h-14 border-[3px] border-[#EAF1FF] dark:border-white/10 rounded-full" />
              <div className="w-14 h-14 border-[3px] border-[#D20C54] border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xl text-[#545B6D] dark:text-[#FDF5F8] tracking-[-0.03em]">
                Gemini 3.1 Flash Lite Synthesizing...
              </h4>
            </div>
            
            {/* Sequential Progress Indicators */}
            <div className="space-y-3 pt-2 text-left">
              {[
                { stage: 0, text: 'Uploading secure document payload...' },
                { stage: 1, text: 'Processing multi-modal structures...' },
                { stage: 2, text: 'Extracting semantic charts & JSON...' },
                { stage: 3, text: 'Finalizing actionable business insights...' }
              ].map((step) => (
                <div key={step.stage} className={`flex items-center gap-3 transition-all duration-300 ${loadingStage >= step.stage ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${loadingStage > step.stage ? 'bg-[#00C3F0] border-[#00C3F0] text-[#010844]' : loadingStage === step.stage ? 'bg-[#D20C54]/10 border-[#D20C54] text-[#D20C54]' : 'border-[#D6DAE3] dark:border-white/20 text-transparent'}`}>
                    {loadingStage > step.stage ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : loadingStage === step.stage ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D20C54] animate-pulse" />
                    ) : null}
                  </div>
                  <span className={`text-xs font-semibold tracking-wide ${loadingStage >= step.stage ? 'text-[#545B6D] dark:text-[#CBD5E1]' : 'text-[#969CAF]'}`}>
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
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-[7.2px] text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Result Card */}
      {markdownSummary && !loading && (
        <div className="card-surface p-8 sm:p-10 rounded-[12px] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-wrap justify-between items-center border-b border-[#D6DAE3]/60 dark:border-white/10 pb-6 mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[7.2px] bg-[#00C3F0]/10 dark:bg-[#00C3F0]/20 text-[#00C3F0] flex items-center justify-center border border-[#00C3F0]/20">
                <FileCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-2xl text-[#545B6D] dark:text-[#FDF5F8] tracking-[-0.03em]">
                  Analysis Complete
                </h3>
                <div className="text-xs font-semibold text-[#969CAF] flex items-center gap-2 mt-0.5 uppercase tracking-wider">
                  <span className="w-2 h-2 bg-[#00C3F0] rounded-full animate-pulse" />
                  Source: <span className="text-[#545B6D] dark:text-[#CBD5E1] font-mono tracking-normal normal-case">{fileName}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary h-[40px] px-4 text-xs inline-flex items-center"
            >
              Analyze Another Document
            </button>
          </div>

          {/* Section 1: Written Markdown Analysis (Part 1) */}
          {markdownSummary && (
            <div className="p-6 bg-[#FCFBF9]/60 dark:bg-[#05081E]/40 rounded-[12px] border border-[#D6DAE3]/50 dark:border-white/10 mb-6">
              <div className="document-markdown prose prose-sm dark:prose-invert max-w-none font-sans leading-relaxed text-[#545B6D] dark:text-[#CBD5E1]">
                <ReactMarkdown>{markdownSummary}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Section 2: Dynamic Interactive Recharts Visual Comparison (Part 2) */}
          {chartData && (
            <div className="bg-[#FCFBF9]/80 dark:bg-[#05081E]/60 border border-[#D6DAE3]/60 dark:border-white/10 rounded-[12px] p-6 shadow-inner">
              <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-[#D6DAE3]/60 dark:border-white/10 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#00C3F0] bg-[#00C3F0]/10 px-2.5 py-0.5 rounded-[7.2px] border border-[#00C3F0]/20 uppercase tracking-wider inline-block">
                    {part2Header || 'Part 2: Visual Comparison'}
                  </span>
                  <h4 className="font-heading font-bold text-xl text-[#545B6D] dark:text-[#FDF5F8] flex items-center gap-3 tracking-[-0.03em]">
                    {chartData.chartType === 'line' ? (
                      <TrendingUp className="w-5 h-5 text-[#D20C54]" />
                    ) : (
                      <BarChart3 className="w-5 h-5 text-[#00C3F0]" />
                    )}
                    {chartData.chartTitle}
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-[#545B6D] dark:text-[#CBD5E1] bg-black/5 dark:bg-white/5 px-3 py-1 rounded-[7.2px] border border-[#D6DAE3]/60 dark:border-white/10 uppercase tracking-wider">
                  {chartData.chartType === 'line' ? 'Trend Analysis' : 'Comparison Chart'}
                </span>
              </div>

              {part2Body && (
                <div className="text-xs text-[#545B6D] dark:text-[#CBD5E1] font-medium mb-4 leading-relaxed document-markdown prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{part2Body}</ReactMarkdown>
                </div>
              )}

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartData.chartType === 'line' ? (
                    <LineChart data={rechartsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="name" stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} dy={8} fontWeight={600} />
                      <YAxis stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatLakhsCrores(v)} fontWeight={600} />
                      <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: gridStroke, strokeWidth: 1.5 }} />
                      <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: axisStroke, paddingTop: '16px' }} />
                      {chartData.datasets.map((dataset, idx) => (
                        <Line
                          key={dataset.label}
                          type="monotone"
                          dataKey={dataset.label}
                          stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                          strokeWidth={3}
                          dot={{ r: 4, fill: CHART_COLORS[idx % CHART_COLORS.length], strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      ))}
                    </LineChart>
                  ) : (
                    <BarChart data={rechartsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="name" stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} dy={8} fontWeight={600} />
                      <YAxis stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatLakhsCrores(v)} fontWeight={600} />
                      <Tooltip content={<CustomChartTooltip />} cursor={{ fill: '#D20C54', opacity: 0.05 }} />
                      <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: axisStroke, paddingTop: '16px' }} />
                      {chartData.datasets.map((dataset, idx) => (
                        <Bar
                          key={dataset.label}
                          dataKey={dataset.label}
                          fill={CHART_COLORS[idx % CHART_COLORS.length]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
