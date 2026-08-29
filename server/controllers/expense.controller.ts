import { Request, Response } from 'express';
import { ExpenseService } from '../services/expense.service';

/**
 * Controller handling retrieval of all company expense records.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 */
export function getExpenses(req: Request, res: Response): void {
  try {
    const expenses = ExpenseService.getAllExpenses();
    res.json(expenses);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch expenses';
    res.status(500).json({ error: message });
  }
}

/**
 * Controller handling creation of a new company expense record.
 *
 * @param {Request} req Express request object containing expense properties in body.
 * @param {Response} res Express response object returning created expense entity.
 */
export function createExpense(req: Request, res: Response): void {
  try {
    const { expense_name, amount, type, date_logged } = req.body;
    if (!expense_name || amount === undefined) {
      res.status(400).json({ error: 'expense_name and amount are required fields.' });
      return;
    }
    const newExpense = ExpenseService.createExpense({
      expense_name: String(expense_name),
      amount: Number(amount),
      type: type === 'Variable' ? 'Variable' : 'Fixed',
      date_logged: String(date_logged || new Date().toISOString().split('T')[0]),
    });
    res.status(201).json(newExpense);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add expense';
    res.status(500).json({ error: message });
  }
}

/**
 * Controller handling updates to an existing expense record by ID.
 *
 * @param {Request} req Express request object containing expense ID in params and updates in body.
 * @param {Response} res Express response object returning updated expense entity or 404.
 */
export function updateExpense(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const updated = ExpenseService.updateExpense(id, req.body);
    if (!updated) {
      res.status(404).json({ error: `Expense with ID ${id} not found.` });
      return;
    }
    res.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update expense';
    res.status(500).json({ error: message });
  }
}

/**
 * Controller handling deletion of an expense record by ID.
 *
 * @param {Request} req Express request object containing expense ID in params.
 * @param {Response} res Express response object returning deletion status or 404.
 */
export function deleteExpense(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const success = ExpenseService.deleteExpense(id);
    if (!success) {
      res.status(404).json({ error: `Expense with ID ${id} not found.` });
      return;
    }
    res.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete expense';
    res.status(500).json({ error: message });
  }
}

/**
 * Controller handling resetting the database back to default sample records.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object returning initial database schema.
 */
export function resetDatabase(req: Request, res: Response): void {
  try {
    const initial = ExpenseService.resetDatabase();
    res.json({ success: true, ...initial });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reset database';
    res.status(500).json({ error: message });
  }
}
