import { Router } from 'express';
import {
  getDeals,
  createDeal,
  updateDeal,
  deleteDeal,
} from '../controllers/deal.controller';

const router = Router();

/**
 * Express Router defining API endpoints for sales deals management.
 */
router.get('/', getDeals);
router.post('/', createDeal);
router.put('/:id', updateDeal);
router.delete('/:id', deleteDeal);

export default router;
