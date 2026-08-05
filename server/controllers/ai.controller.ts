import { Request, Response } from 'express';
import {
  generateWhatsAppFollowUp,
  generateBusinessRecommendations,
  analyzeDocumentFile,
} from '../services/gemini.service';

/**
