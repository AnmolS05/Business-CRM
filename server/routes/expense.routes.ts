import { Router } from 'express';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  resetDatabase,
} from '../controllers/expense.controller';

const router = Router();

/**
 * Express Router defining API endpoints for expense ledger and DB management.
 */
router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.post('/reset-db', resetDatabase);

export default router;
