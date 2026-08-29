import { db } from '../db';

export class ExpenseService {
  static getAllExpenses() {
    return db.getExpenses();
  }

  static createExpense(data: { expense_name: string, amount: number, type: 'Fixed' | 'Variable', date_logged: string }) {
    return db.addExpense(data);
  }

  static updateExpense(id: string, data: Partial<{ expense_name: string, amount: number, type: 'Fixed' | 'Variable', date_logged: string }>) {
    return db.updateExpense(id, data);
  }

  static deleteExpense(id: string) {
    return db.deleteExpense(id);
  }

  static resetDatabase() {
    return db.resetDb();
  }
}
