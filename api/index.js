// server/app.ts
import express from "express";
import cors from "cors";
import compression from "compression";

// server/routes/index.ts
import { Router as Router4 } from "express";

// server/routes/deal.routes.ts
import { Router } from "express";

// server/db.ts
import fs from "fs";
import path from "path";
import os from "os";
var isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
var DATA_DIR = isServerless ? path.join(os.tmpdir(), "crm-data") : path.join(process.cwd(), "data");
var DB_FILE = path.join(DATA_DIR, "db.json");
var SEED_FILE = path.join(process.cwd(), "data", "db.json");
var INITIAL_DEALS = [
  {
    id: "deal-1",
    client_name: "Tata Digital Ltd",
    phone_number: "919876543210",
    deal_value: 25e5,
    stage: "Won",
    product_category: "Software",
    close_date: "2026-05-15"
  },
  {
    id: "deal-2",
    client_name: "Reliance Retail",
    phone_number: "919812345678",
    deal_value: 125e4,
    stage: "Won",
    product_category: "Software",
    close_date: "2026-06-10"
  },
  {
    id: "deal-3",
    client_name: "Infosys Tech Systems",
    phone_number: "919711223344",
    deal_value: 8e5,
    stage: "Won",
    product_category: "Consulting",
    close_date: "2026-07-02"
  },
  {
    id: "deal-4",
    client_name: "Mahindra Logistics",
    phone_number: "919655443322",
    deal_value: 45e4,
    stage: "Proposal Sent",
    product_category: "Software",
    close_date: "2026-08-20"
  },
  {
    id: "deal-5",
    client_name: "Adani Green Energy",
    phone_number: "919544332211",
    deal_value: 18e5,
    stage: "Contacted",
    product_category: "AMC Services",
    close_date: "2026-09-01"
  },
  {
    id: "deal-6",
    client_name: "Zomato Merchant Ops",
    phone_number: "919433221100",
    deal_value: 25e4,
    stage: "New Lead",
    product_category: "Support",
    close_date: "2026-08-15"
  },
  {
    id: "deal-7",
    client_name: "Wipro Digital Services",
    phone_number: "919322110099",
    deal_value: 6e5,
    stage: "Won",
    product_category: "Support",
    close_date: "2026-04-18"
  },
  {
    id: "deal-8",
    client_name: "Apollo Healthcare",
    phone_number: "919211009988",
    deal_value: 35e4,
    stage: "Lost",
    product_category: "Hardware",
    close_date: "2026-03-30"
  }
];
var INITIAL_EXPENSES = [
  {
    id: "exp-1",
    expense_name: "Office Rent (Koramangala HQ)",
    amount: 85e3,
    type: "Fixed",
    date_logged: "2026-07-01"
  },
  {
    id: "exp-2",
    expense_name: "AWS & Cloud Hosting",
    amount: 28e3,
    type: "Fixed",
    date_logged: "2026-07-05"
  },
  {
    id: "exp-3",
    expense_name: "Engineering & Sales Payroll",
    amount: 35e4,
    type: "Fixed",
    date_logged: "2026-07-01"
  },
  {
    id: "exp-4",
    expense_name: "Client Lunch with Tata Team",
    amount: 12500,
    type: "Variable",
    date_logged: "2026-07-12"
  },
  {
    id: "exp-5",
    expense_name: "Sales Flight to Mumbai",
    amount: 24e3,
    type: "Variable",
    date_logged: "2026-07-18"
  },
  {
    id: "exp-6",
    expense_name: "SaaS Subscriptions & Tools",
    amount: 15e3,
    type: "Fixed",
    date_logged: "2026-07-10"
  },
  {
    id: "exp-7",
    expense_name: "Google Ads & Lead Gen Campaign",
    amount: 45e3,
    type: "Variable",
    date_logged: "2026-07-22"
  }
];
function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (dirErr) {
      console.warn("[DB Warning]: Could not create database directory, continuing:", dirErr);
    }
  }
  if (!fs.existsSync(DB_FILE)) {
    let seedData = null;
    if (fs.existsSync(SEED_FILE)) {
      try {
        const seedContent = fs.readFileSync(SEED_FILE, "utf-8");
        seedData = JSON.parse(seedContent);
      } catch (seedErr) {
        console.warn("[DB Warning]: Failed reading seed file from repo, using hardcoded defaults:", seedErr);
      }
    }
    const initial = seedData || {
      deals: INITIAL_DEALS,
      expenses: INITIAL_EXPENSES
    };
    try {
      saveDb(initial);
    } catch (saveErr) {
      console.warn("[DB Warning]: Could not persist initial seed to disk:", saveErr);
    }
    return initial;
  }
  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("[DB Error]: Failed reading DB file. Resetting to seed defaults:", err);
    const initial = {
      deals: INITIAL_DEALS,
      expenses: INITIAL_EXPENSES
    };
    try {
      saveDb(initial);
    } catch (saveErr) {
      console.warn("[DB Warning]: Could not persist reset schema to disk:", saveErr);
    }
    return initial;
  }
}
function saveDb(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempPath = path.join(DATA_DIR, `db.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.json`);
    const serialized = JSON.stringify(data, null, 2);
    try {
      fs.writeFileSync(tempPath, serialized, "utf-8");
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      fs.writeFileSync(DB_FILE, serialized, "utf-8");
      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
        } catch (_) {
        }
      }
    }
  } catch (fsErr) {
    console.error("[DB Error]: Failed to write database state to disk:", fsErr);
  }
}
var db = {
  /**
   * Retrieves all sales deal records from the database.
   *
   * @returns {Deal[]} Array of deals.
   */
  getDeals() {
    const data = ensureDbExists();
    return data.deals;
  },
  /**
   * Finds a specific sales deal by unique ID.
   *
   * @param {string} id Deal identifier string.
   * @returns {Deal | undefined} Found deal object or undefined if not found.
   */
  getDealById(id) {
    const data = ensureDbExists();
    return data.deals.find((d) => d.id === id);
  },
  /**
   * Inserts a new sales deal record into the database.
   *
   * @param {Omit<Deal, 'id'>} deal Deal data excluding ID.
   * @returns {Deal} Newly created deal object with unique ID.
   */
  addDeal(deal) {
    const data = ensureDbExists();
    const newDeal = {
      id: `deal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...deal
    };
    data.deals.push(newDeal);
    saveDb(data);
    return newDeal;
  },
  /**
   * Updates an existing sales deal record by ID with partial fields.
   *
   * @param {string} id Unique identifier of target deal.
   * @param {Partial<Deal>} updates Partial deal fields to update.
   * @returns {Deal | null} Updated deal object or null if ID was not found.
   */
  updateDeal(id, updates) {
    const data = ensureDbExists();
    const idx = data.deals.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    data.deals[idx] = { ...data.deals[idx], ...updates };
    saveDb(data);
    return data.deals[idx];
  },
  /**
   * Deletes a sales deal record from the database by ID.
   *
   * @param {string} id Unique deal identifier.
   * @returns {boolean} True if a record was removed, false otherwise.
   */
  deleteDeal(id) {
    const data = ensureDbExists();
    const lenBefore = data.deals.length;
    data.deals = data.deals.filter((d) => d.id !== id);
    if (data.deals.length !== lenBefore) {
      saveDb(data);
      return true;
    }
    return false;
  },
  /**
   * Retrieves all company expense records from the database.
   *
   * @returns {Expense[]} Array of expenses.
   */
  getExpenses() {
    const data = ensureDbExists();
    return data.expenses;
  },
  /**
   * Inserts a new expense record into the database.
   *
   * @param {Omit<Expense, 'id'>} expense Expense data excluding ID.
   * @returns {Expense} Newly created expense object with unique ID.
   */
  addExpense(expense) {
    const data = ensureDbExists();
    const newExp = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...expense
    };
    data.expenses.push(newExp);
    saveDb(data);
    return newExp;
  },
  /**
   * Updates an existing expense record by ID with partial fields.
   *
   * @param {string} id Unique identifier of target expense.
   * @param {Partial<Expense>} updates Partial expense fields to update.
   * @returns {Expense | null} Updated expense object or null if ID was not found.
   */
  updateExpense(id, updates) {
    const data = ensureDbExists();
    const idx = data.expenses.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    data.expenses[idx] = { ...data.expenses[idx], ...updates };
    saveDb(data);
    return data.expenses[idx];
  },
  /**
   * Deletes an expense record from the database by ID.
   *
   * @param {string} id Unique expense identifier.
   * @returns {boolean} True if a record was deleted, false otherwise.
   */
  deleteExpense(id) {
    const data = ensureDbExists();
    const lenBefore = data.expenses.length;
    data.expenses = data.expenses.filter((e) => e.id !== id);
    if (data.expenses.length !== lenBefore) {
      saveDb(data);
      return true;
    }
    return false;
  },
  /**
   * Resets database state back to initial seed defaults.
   *
   * @returns {DatabaseSchema} Reset schema containing seed data.
   */
  resetDb() {
    const initial = {
      deals: INITIAL_DEALS,
      expenses: INITIAL_EXPENSES
    };
    saveDb(initial);
    return initial;
  }
};

// server/services/deal.service.ts
var DealService = class {
  static getAllDeals() {
    return db.getDeals();
  }
  static createDeal(data) {
    return db.addDeal(data);
  }
  static updateDeal(id, data) {
    return db.updateDeal(id, data);
  }
  static deleteDeal(id) {
    return db.deleteDeal(id);
  }
};

// server/controllers/deal.controller.ts
function getDeals(req, res) {
  try {
    const deals = DealService.getAllDeals();
    res.json(deals);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch deals";
    res.status(500).json({ error: message });
  }
}
function createDeal(req, res) {
  try {
    const { client_name, phone_number, deal_value, stage, product_category, close_date } = req.body;
    if (!client_name || deal_value === void 0) {
      res.status(400).json({ error: "client_name and deal_value are required fields." });
      return;
    }
    const newDeal = DealService.createDeal({
      client_name: String(client_name),
      phone_number: String(phone_number || ""),
      deal_value: Number(deal_value),
      stage: stage || "New Lead",
      product_category: String(product_category || "General"),
      close_date: String(close_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0])
    });
    res.status(201).json(newDeal);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add deal";
    res.status(500).json({ error: message });
  }
}
function updateDeal(req, res) {
  try {
    const { id } = req.params;
    const updated = DealService.updateDeal(id, req.body);
    if (!updated) {
      res.status(404).json({ error: `Deal with ID ${id} not found.` });
      return;
    }
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update deal";
    res.status(500).json({ error: message });
  }
}
function deleteDeal(req, res) {
  try {
    const { id } = req.params;
    const success = DealService.deleteDeal(id);
    if (!success) {
      res.status(404).json({ error: `Deal with ID ${id} not found.` });
      return;
    }
    res.json({ success: true, message: "Deal deleted successfully." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete deal";
    res.status(500).json({ error: message });
  }
}

// server/routes/deal.routes.ts
var router = Router();
router.get("/", getDeals);
router.post("/", createDeal);
router.put("/:id", updateDeal);
router.delete("/:id", deleteDeal);
var deal_routes_default = router;

// server/routes/expense.routes.ts
import { Router as Router2 } from "express";

// server/services/expense.service.ts
var ExpenseService = class {
  static getAllExpenses() {
    return db.getExpenses();
  }
  static createExpense(data) {
    return db.addExpense(data);
  }
  static updateExpense(id, data) {
    return db.updateExpense(id, data);
  }
  static deleteExpense(id) {
    return db.deleteExpense(id);
  }
  static resetDatabase() {
    return db.resetDb();
  }
};

// server/controllers/expense.controller.ts
function getExpenses(req, res) {
  try {
    const expenses = ExpenseService.getAllExpenses();
    res.json(expenses);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch expenses";
    res.status(500).json({ error: message });
  }
}
function createExpense(req, res) {
  try {
    const { expense_name, amount, type, date_logged } = req.body;
    if (!expense_name || amount === void 0) {
      res.status(400).json({ error: "expense_name and amount are required fields." });
      return;
    }
    const newExpense = ExpenseService.createExpense({
      expense_name: String(expense_name),
      amount: Number(amount),
      type: type === "Variable" ? "Variable" : "Fixed",
      date_logged: String(date_logged || (/* @__PURE__ */ new Date()).toISOString().split("T")[0])
    });
    res.status(201).json(newExpense);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add expense";
    res.status(500).json({ error: message });
  }
}
function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const updated = ExpenseService.updateExpense(id, req.body);
    if (!updated) {
      res.status(404).json({ error: `Expense with ID ${id} not found.` });
      return;
    }
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update expense";
    res.status(500).json({ error: message });
  }
}
function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const success = ExpenseService.deleteExpense(id);
    if (!success) {
      res.status(404).json({ error: `Expense with ID ${id} not found.` });
      return;
    }
    res.json({ success: true, message: "Expense deleted successfully." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete expense";
    res.status(500).json({ error: message });
  }
}
function resetDatabase(req, res) {
  try {
    const initial = ExpenseService.resetDatabase();
    res.json({ success: true, ...initial });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reset database";
    res.status(500).json({ error: message });
  }
}

// server/routes/expense.routes.ts
var router2 = Router2();
router2.get("/", getExpenses);
router2.post("/", createExpense);
router2.put("/:id", updateExpense);
router2.delete("/:id", deleteExpense);
router2.post("/reset-db", resetDatabase);
var expense_routes_default = router2;

// server/routes/ai.routes.ts
import { Router as Router3 } from "express";

// server/middleware/upload.ts
import multer from "multer";
var uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

// server/services/gemini.service.ts
import { GoogleGenAI } from "@google/genai";

// server/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var envConfig = {
  /**
   * Port on which the HTTP server listens.
   */
  port: parseInt(process.env.PORT || "3000", 10),
  /**
   * Current execution environment ('development' | 'production' | 'test').
   */
  nodeEnv: process.env.NODE_ENV || "development",
  /**
   * Retrieves the Gemini API key from environment variables.
   *
   * @throws {Error} If GEMINI_API_KEY environment variable is not configured.
   * @returns {string} Configured Gemini API key.
   */
  getGeminiApiKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return apiKey;
  }
};

// server/config/prompts.ts
var PROMPTS = {
  WHATSAPP_FOLLOW_UP: (client_name, product_category, deal_value, stage) => `Write a polite, warm, and brief WhatsApp follow-up message to ${client_name} regarding their interest in ${product_category} valued at ${deal_value} INR. Stage: ${stage}. Keep it in a respectful Indian business tone. Do not use placeholders. Keep it under 60 words and suitable for direct sending via WhatsApp.`,
  BUSINESS_RECOMMENDATIONS: (topProduct, topProductRevenue, totalSales, totalExpenses) => `Here is my business summary: Top Product Category is ${topProduct} generating ${topProductRevenue} INR. Total sales are ${totalSales} INR. Total expenses are ${totalExpenses} INR. Provide 2 highly specific, actionable recommendations in bullet points for a business owner in India to improve margins or increase sales.`,
  DOCUMENT_ANALYSIS: (fileName) => `Analyze this financial document (${fileName}).

Provide your response in TWO distinct parts within a single output:

PART 1: A clean markdown text summary containing:
- Executive Overview & Total Value
- Key Highlights & Financial Breakdown
- Key Trends, Anomalies, or Risks
Format all monetary values in Indian Rupees (\u20B9) using Lakhs/Crores format where appropriate. Keep the written analysis clear, structured, and concise.

PART 2: If the document contains numerical, financial, or comparative data that can be visually compared (e.g., line items, subtotal vs tax, projected vs actual, Q1 vs Q2, expense categories, revenue streams, year-over-year figures, etc.), provide a strictly formatted JSON block wrapped in \`\`\`json ... \`\`\` code blocks containing the comparison data.

Structure the JSON EXACTLY like this:
\`\`\`json
{
  "chartTitle": "Descriptive Chart Title (e.g., Q1 vs Q2 Expense Comparison)",
  "chartType": "bar",
  "labels": ["Label 1", "Label 2", "Label 3"],
  "datasets": [
    {
      "label": "Series 1 Name (e.g., Projected (\u20B9))",
      "data": [100000, 150000, 200000]
    },
    {
      "label": "Series 2 Name (e.g., Actual (\u20B9))",
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

// server/services/gemini.service.ts
var GeminiService = class _GeminiService {
  constructor() {
    this.client = null;
  }
  /**
   * Retrieves the singleton instance of GeminiService.
   */
  static getInstance() {
    if (!_GeminiService.instance) {
      _GeminiService.instance = new _GeminiService();
    }
    return _GeminiService.instance;
  }
  /**
   * Lazy-initializes and retrieves the underlying GoogleGenAI client.
   */
  getClient() {
    if (!this.client) {
      const apiKey = envConfig.getGeminiApiKey();
      this.client = new GoogleGenAI({ apiKey });
    }
    return this.client;
  }
  /**
   * Generates a polite, respectful WhatsApp follow-up draft tailored to Indian enterprise clients.
   *
   * @param {WhatsAppFollowUpRequest} params Deal details including client name, product category, and value.
   * @returns {Promise<string>} Generated text message suitable for WhatsApp communication.
   */
  async generateWhatsAppFollowUp(params) {
    const ai = this.getClient();
    const { client_name, product_category, deal_value, stage } = params;
    const prompt = PROMPTS.WHATSAPP_FOLLOW_UP(
      client_name,
      product_category || "our services",
      deal_value || 0,
      stage || "Lead"
    );
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt
    });
    return response.text || "";
  }
  /**
   * Synthesizes business performance data into actionable strategic recommendations.
   *
   * @param {BusinessRecommendationsRequest} params Summary figures including top category and totals.
   * @returns {Promise<string>} Concise bulleted strategic recommendations.
   */
  async generateBusinessRecommendations(params) {
    const ai = this.getClient();
    const { topProduct, topProductRevenue, totalSales, totalExpenses } = params;
    const prompt = PROMPTS.BUSINESS_RECOMMENDATIONS(
      topProduct || "General",
      topProductRevenue || 0,
      totalSales || 0,
      totalExpenses || 0
    );
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt
    });
    return response.text || "";
  }
  /**
   * Analyzes financial document files (PDFs, images, CSVs, TXT) and returns structured analysis.
   *
   * @param {FileAnalysisPayload} file File payload containing buffer, MIME type, and filename.
   * @returns {Promise<string>} Raw output text combining Markdown summary and optional JSON chart data.
   */
  async analyzeDocumentFile(file) {
    const ai = this.getClient();
    const base64Data = file.buffer.toString("base64");
    let mimeType = file.mimeType;
    if (!mimeType || mimeType === "application/octet-stream") {
      const ext = file.originalname.toLowerCase();
      if (ext.endsWith(".pdf")) mimeType = "application/pdf";
      else if (ext.endsWith(".png")) mimeType = "image/png";
      else if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) mimeType = "image/jpeg";
      else if (ext.endsWith(".csv")) mimeType = "text/csv";
      else mimeType = "text/plain";
    }
    const prompt = PROMPTS.DOCUMENT_ANALYSIS(file.originalname);
    const inlinePart = {
      inlineData: {
        mimeType,
        data: base64Data
      }
    };
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: { parts: [inlinePart, { text: prompt }] }
    });
    return response.text || "Unable to parse document summary.";
  }
};
var geminiService = GeminiService.getInstance();

// server/controllers/ai.controller.ts
async function getWhatsAppFollowUp(req, res) {
  try {
    const { client_name, product_category, deal_value, stage } = req.body;
    if (!client_name) {
      res.status(400).json({ error: "client_name is a required parameter." });
      return;
    }
    const draft = await geminiService.generateWhatsAppFollowUp({
      client_name: String(client_name),
      product_category: product_category ? String(product_category) : void 0,
      deal_value: deal_value !== void 0 ? Number(deal_value) : void 0,
      stage: stage ? String(stage) : void 0
    });
    res.json({ draft });
  } catch (err) {
    console.error("[AI WhatsApp Follow-up Error]:", err);
    const message = err instanceof Error ? err.message : "Failed to generate WhatsApp follow-up draft.";
    res.status(500).json({ error: message });
  }
}
async function getBusinessRecommendations(req, res) {
  try {
    const { topProduct, topProductRevenue, totalSales, totalExpenses } = req.body;
    const recommendations = await geminiService.generateBusinessRecommendations({
      topProduct: topProduct ? String(topProduct) : void 0,
      topProductRevenue: topProductRevenue !== void 0 ? Number(topProductRevenue) : void 0,
      totalSales: totalSales !== void 0 ? Number(totalSales) : void 0,
      totalExpenses: totalExpenses !== void 0 ? Number(totalExpenses) : void 0
    });
    res.json({ recommendations });
  } catch (err) {
    console.error("[AI Recommendations Error]:", err);
    const message = err instanceof Error ? err.message : "Failed to generate business recommendations.";
    res.status(500).json({ error: message });
  }
}
async function analyzeDocument(req, res) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No document file was uploaded." });
      return;
    }
    const markdownSummary = await geminiService.analyzeDocumentFile({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      originalname: req.file.originalname
    });
    res.json({
      markdownSummary,
      filename: req.file.originalname
    });
  } catch (err) {
    console.error("[AI Document Analysis Error]:", err);
    const message = err instanceof Error ? err.message : "Failed to analyze document.";
    res.status(500).json({ error: message });
  }
}

// server/routes/ai.routes.ts
var router3 = Router3();
router3.post("/whatsapp-followup", getWhatsAppFollowUp);
router3.post("/business-recommendations", getBusinessRecommendations);
router3.post("/analyze-document", uploadMiddleware.single("file"), analyzeDocument);
var ai_routes_default = router3;

// server/routes/index.ts
var router4 = Router4();
router4.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
router4.use("/deals", deal_routes_default);
router4.use("/expenses", expense_routes_default);
router4.use("/ai", ai_routes_default);
router4.post("/reset-db", resetDatabase);
var routes_default = router4;

// server/middleware/errorHandler.ts
function apiNotFoundHandler(req, res) {
  res.status(404).json({ error: `API route not found: ${req.originalUrl}` });
}
function globalErrorHandler(err, req, res, next) {
  console.error("[API Error]:", err);
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.status || 500;
  const message = err.message || "An internal server error occurred.";
  res.status(statusCode).json({ error: message });
}

// server/app.ts
function createApp() {
  const app2 = express();
  app2.use(cors());
  app2.use(compression());
  app2.use(express.json({ limit: "20mb" }));
  app2.use(express.urlencoded({ extended: true, limit: "20mb" }));
  app2.use("/api", routes_default);
  app2.use(routes_default);
  app2.use("/api/*", apiNotFoundHandler);
  app2.use(globalErrorHandler);
  return app2;
}
var app = createApp();

// server/serverless.ts
var serverless_default = app;
export {
  serverless_default as default
};
//# sourceMappingURL=index.js.map
