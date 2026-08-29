import { Request, Response } from 'express';
import { DealService } from '../services/deal.service';

/**
 * Controller handling retrieval of all sales deals.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 */
export function getDeals(req: Request, res: Response): void {
  try {
    const deals = DealService.getAllDeals();
    res.json(deals);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch deals';
    res.status(500).json({ error: message });
  }
}

/**
 * Controller handling creation of a new sales deal.
 *
 * @param {Request} req Express request object containing deal properties in body.
 * @param {Response} res Express response object returning created deal entity.
 */
export function createDeal(req: Request, res: Response): void {
  try {
    const { client_name, phone_number, deal_value, stage, product_category, close_date } = req.body;
    if (!client_name || deal_value === undefined) {
      res.status(400).json({ error: 'client_name and deal_value are required fields.' });
      return;
    }
    const newDeal = DealService.createDeal({
      client_name: String(client_name),
      phone_number: String(phone_number || ''),
      deal_value: Number(deal_value),
      stage: stage || 'New Lead',
      product_category: String(product_category || 'General'),
      close_date: String(close_date || new Date().toISOString().split('T')[0]),
    });
    res.status(201).json(newDeal);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add deal';
    res.status(500).json({ error: message });
  }
}

/**
 * Controller handling partial updates to an existing sales deal by ID.
 *
 * @param {Request} req Express request object containing deal ID in params and updates in body.
 * @param {Response} res Express response object returning updated deal entity or 404.
 */
export function updateDeal(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const updated = DealService.updateDeal(id, req.body);
    if (!updated) {
      res.status(404).json({ error: `Deal with ID ${id} not found.` });
      return;
    }
    res.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update deal';
    res.status(500).json({ error: message });
  }
}

/**
 * Controller handling deletion of a sales deal by ID.
 *
 * @param {Request} req Express request object containing deal ID in params.
 * @param {Response} res Express response object returning deletion status or 404.
 */
export function deleteDeal(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const success = DealService.deleteDeal(id);
    if (!success) {
      res.status(404).json({ error: `Deal with ID ${id} not found.` });
      return;
    }
    res.json({ success: true, message: 'Deal deleted successfully.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete deal';
    res.status(500).json({ error: message });
  }
}
