import { Router } from 'express';
import dealRoutes from './deal.routes';
import expenseRoutes from './expense.routes';
import aiRoutes from './ai.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/deals', dealRoutes);
router.use('/expenses', expenseRoutes);
router.use('/ai', aiRoutes);

export default router;
