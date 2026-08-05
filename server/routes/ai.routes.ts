import { Router } from 'express';
import { uploadMiddleware } from '../middleware/upload';
import {
  getWhatsAppFollowUp,
  getBusinessRecommendations,
  analyzeDocument,
} from '../controllers/ai.controller';

const router = Router();

/**
 * Express Router defining API endpoints for Gemini AI services.
 */
router.post('/whatsapp-followup', getWhatsAppFollowUp);
router.post('/business-recommendations', getBusinessRecommendations);
router.post('/analyze-document', uploadMiddleware.single('file'), analyzeDocument);

export default router;
