import fs from 'fs';
import path from 'path';
import os from 'os';
import { Deal, Expense } from '../src/types';

// In serverless environments like Vercel, the root filesystem is read-only.
// We write to os.tmpdir() when running under Vercel or Lambda execution environments.
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join(os.tmpdir(), 'crm-data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED_FILE = path.join(process.cwd(), 'data', 'db.json');

/**
 * Interface representing the complete JSON database schema structure.
 */
interface DatabaseSchema {
  deals: Deal[];
  expenses: Expense[];
}

/**
 * Initial seed records for Indian enterprise sales deals.
 */
const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-1',
    client_name: 'Tata Digital Ltd',
    phone_number: '919876543210',
    deal_value: 2500000,
    stage: 'Won',
    product_category: 'Software',
    close_date: '2026-05-15',
  },
  {
    id: 'deal-2',
    client_name: 'Reliance Retail',
    phone_number: '919812345678',
    deal_value: 1250000,
    stage: 'Won',
    product_category: 'Software',
    close_date: '2026-06-10',
  },
  {
    id: 'deal-3',
    client_name: 'Infosys Tech Systems',
    phone_number: '919711223344',
    deal_value: 800000,
    stage: 'Won',
    product_category: 'Consulting',
    close_date: '2026-07-02',
  },
  {
    id: 'deal-4',
    client_name: 'Mahindra Logistics',
    phone_number: '919655443322',
    deal_value: 450000,
    stage: 'Proposal Sent',
    product_category: 'Software',
    close_date: '2026-08-20',
  },
  {
    id: 'deal-5',
    client_name: 'Adani Green Energy',
    phone_number: '919544332211',
    deal_value: 1800000,
    stage: 'Contacted',
    product_category: 'AMC Services',
    close_date: '2026-09-01',
  },
  {
    id: 'deal-6',
    client_name: 'Zomato Merchant Ops',
    phone_number: '919433221100',
    deal_value: 250000,
    stage: 'New Lead',
    product_category: 'Support',
    close_date: '2026-08-15',
  },
  {
    id: 'deal-7',
    client_name: 'Wipro Digital Services',
    phone_number: '919322110099',
    deal_value: 600000,
    stage: 'Won',
    product_category: 'Support',
    close_date: '2026-04-18',
  },
  {
    id: 'deal-8',
    client_name: 'Apollo Healthcare',
    phone_number: '919211009988',
    deal_value: 350000,
    stage: 'Lost',
    product_category: 'Hardware',
    close_date: '2026-03-30',
  },
];

/**
 * Initial seed records for enterprise company expenditures.
 */
const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    expense_name: 'Office Rent (Koramangala HQ)',
    amount: 85000,
    type: 'Fixed',
    date_logged: '2026-07-01',
  },
  {
    id: 'exp-2',
    expense_name: 'AWS & Cloud Hosting',
    amount: 28000,
    type: 'Fixed',
    date_logged: '2026-07-05',
  },
  {
    id: 'exp-3',
    expense_name: 'Engineering & Sales Payroll',
    amount: 350000,
    type: 'Fixed',
    date_logged: '2026-07-01',
  },
  {
    id: 'exp-4',
    expense_name: 'Client Lunch with Tata Team',
    amount: 12500,
    type: 'Variable',
    date_logged: '2026-07-12',
  },
  {
    id: 'exp-5',
    expense_name: 'Sales Flight to Mumbai',
    amount: 24000,
    type: 'Variable',
    date_logged: '2026-07-18',
  },
  {
    id: 'exp-6',
    expense_name: 'SaaS Subscriptions & Tools',
    amount: 15000,
    type: 'Fixed',
    date_logged: '2026-07-10',
  },
  {
    id: 'exp-7',
    expense_name: 'Google Ads & Lead Gen Campaign',
    amount: 45000,
    type: 'Variable',
    date_logged: '2026-07-22',
  },
];

/**
 * Ensures the database directory and file exist, seeding initial data if missing.
 * Supports read-only serverless environments by falling back to template data and /tmp storage.
 *
 * @returns {DatabaseSchema} Complete current database schema.
 */
function ensureDbExists(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (dirErr) {
      console.warn('[DB Warning]: Could not create database directory, continuing:', dirErr);
    }
  }

  if (!fs.existsSync(DB_FILE)) {
    let seedData: DatabaseSchema | null = null;
    if (fs.existsSync(SEED_FILE)) {
      try {
        const seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
        seedData = JSON.parse(seedContent);
      } catch (seedErr) {
        console.warn('[DB Warning]: Failed reading seed file from repo, using hardcoded defaults:', seedErr);
      }
    }

    const initial: DatabaseSchema = seedData || {
      deals: INITIAL_DEALS,
      expenses: INITIAL_EXPENSES,
    };
    try {
      saveDb(initial);
    } catch (saveErr) {
      console.warn('[DB Warning]: Could not persist initial seed to disk:', saveErr);
    }
    return initial;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[DB Error]: Failed reading DB file. Resetting to seed defaults:', err);
    const initial: DatabaseSchema = {
      deals: INITIAL_DEALS,
      expenses: INITIAL_EXPENSES,
    };
    try {
      saveDb(initial);
    } catch (saveErr) {
      console.warn('[DB Warning]: Could not persist reset schema to disk:', saveErr);
    }
    return initial;
  }
}

/**
 * Atomically writes database content to disk using a temporary file to prevent corruption.
 * Gracefully catches filesystem write restrictions in serverless execution environments.
 *
 * @param {DatabaseSchema} data Database schema object to serialize and save.
 */
function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempPath = path.join(DATA_DIR, `db.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.json`);
    const serialized = JSON.stringify(data, null, 2);
    try {
      fs.writeFileSync(tempPath, serialized, 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      // Fallback to direct write if atomic rename is restricted by OS locks
      fs.writeFileSync(DB_FILE, serialized, 'utf-8');
      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
        } catch (_) {
          // Ignore temporary file cleanup errors
        }
      }
    }
  } catch (fsErr) {
    console.error('[DB Error]: Failed to write database state to disk:', fsErr);
  }
}

/**
 * Database repository service providing type-safe CRUD operations for deals and expenses.
 */
export const db = {
  /**
   * Retrieves all sales deal records from the database.
   *
   * @returns {Deal[]} Array of deals.
   */
  getDeals(): Deal[] {
    const data = ensureDbExists();
    return data.deals;
  },

  /**
   * Finds a specific sales deal by unique ID.
   *
   * @param {string} id Deal identifier string.
   * @returns {Deal | undefined} Found deal object or undefined if not found.
   */
  getDealById(id: string): Deal | undefined {
    const data = ensureDbExists();
    return data.deals.find((d) => d.id === id);
  },

  /**
   * Inserts a new sales deal record into the database.
   *
   * @param {Omit<Deal, 'id'>} deal Deal data excluding ID.
   * @returns {Deal} Newly created deal object with unique ID.
   */
  addDeal(deal: Omit<Deal, 'id'>): Deal {
    const data = ensureDbExists();
    const newDeal: Deal = {
      id: `deal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...deal,
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
  updateDeal(id: string, updates: Partial<Deal>): Deal | null {
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
  deleteDeal(id: string): boolean {
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
  getExpenses(): Expense[] {
    const data = ensureDbExists();
    return data.expenses;
  },

  /**
   * Inserts a new expense record into the database.
   *
   * @param {Omit<Expense, 'id'>} expense Expense data excluding ID.
   * @returns {Expense} Newly created expense object with unique ID.
   */
  addExpense(expense: Omit<Expense, 'id'>): Expense {
    const data = ensureDbExists();
    const newExp: Expense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...expense,
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
  updateExpense(id: string, updates: Partial<Expense>): Expense | null {
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
  deleteExpense(id: string): boolean {
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
  resetDb(): DatabaseSchema {
    const initial: DatabaseSchema = {
      deals: INITIAL_DEALS,
      expenses: INITIAL_EXPENSES,
    };
    saveDb(initial);
    return initial;
  },
};
