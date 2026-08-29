export const PROMPTS = {
  WHATSAPP_FOLLOW_UP: (client_name: string, product_category: string, deal_value: number, stage: string) => 
    `Write a polite, warm, and brief WhatsApp follow-up message to ${client_name} regarding their interest in ${product_category} valued at ${deal_value} INR. Stage: ${stage}. Keep it in a respectful Indian business tone. Do not use placeholders. Keep it under 60 words and suitable for direct sending via WhatsApp.`,
    
  BUSINESS_RECOMMENDATIONS: (topProduct: string, topProductRevenue: number, totalSales: number, totalExpenses: number) => 
    `Here is my business summary: Top Product Category is ${topProduct} generating ${topProductRevenue} INR. Total sales are ${totalSales} INR. Total expenses are ${totalExpenses} INR. Provide 2 highly specific, actionable recommendations in bullet points for a business owner in India to improve margins or increase sales.`,

  DOCUMENT_ANALYSIS: (fileName: string) => 
    `Analyze this financial document (${fileName}).

Provide your response in TWO distinct parts within a single output:

PART 1: A clean markdown text summary containing:
- Executive Overview & Total Value
- Key Highlights & Financial Breakdown
- Key Trends, Anomalies, or Risks
Format all monetary values in Indian Rupees (₹) using Lakhs/Crores format where appropriate. Keep the written analysis clear, structured, and concise.

PART 2: If the document contains numerical, financial, or comparative data that can be visually compared (e.g., line items, subtotal vs tax, projected vs actual, Q1 vs Q2, expense categories, revenue streams, year-over-year figures, etc.), provide a strictly formatted JSON block wrapped in \`\`\`json ... \`\`\` code blocks containing the comparison data.

Structure the JSON EXACTLY like this:
\`\`\`json
{
  "chartTitle": "Descriptive Chart Title (e.g., Q1 vs Q2 Expense Comparison)",
  "chartType": "bar",
  "labels": ["Label 1", "Label 2", "Label 3"],
  "datasets": [
    {
      "label": "Series 1 Name (e.g., Projected (₹))",
      "data": [100000, 150000, 200000]
    },
    {
      "label": "Series 2 Name (e.g., Actual (₹))",
      "data": [95000, 160000, 210000]
    }
  ]
}
\`\`\`

Notes:
1. "chartType" MUST be either "bar" or "line".
2. All numbers inside "data" arrays must be raw numeric integers or floats (no currency symbols or string values).
3. If there are no numerical or comparative figures in the document to plot, omit the \`\`\`json block entirely.`
};
