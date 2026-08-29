export type DealStage = 'New Lead' | 'Contacted' | 'Proposal Sent' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  client_name: string;
  phone_number: string;
  deal_value: number; // Integer in ₹
  stage: DealStage;
  product_category: string;
  close_date: string; // YYYY-MM-DD
}

export type ExpenseType = 'Fixed' | 'Variable';

export interface Expense {
  id: string;
  expense_name: string;
  amount: number; // Integer in ₹
  type: ExpenseType;
  date_logged: string; // YYYY-MM-DD
}

export interface BusinessSummary {
  topProduct: string;
  topProductRevenue: number;
  totalSales: number;
  totalExpenses: number;
  fixedExpenses: number;
  variableExpenses: number;
  netProfit: number;
  wonDealsCount: number;
}

export interface DocumentAnalysisResponse {
  markdownSummary: string;
  parsedDeals?: Omit<Deal, 'id'>[];
  parsedExpenses?: Omit<Expense, 'id'>[];
}

export interface ChartDataset {
  label: string;
  data: number[];
}

export interface DynamicChartData {
  chartTitle: string;
  chartType: 'bar' | 'line';
  labels: string[];
  datasets: ChartDataset[];
}
