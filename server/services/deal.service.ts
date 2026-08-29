import { db } from '../db';
import { Deal, DealStage } from '../../src/types';
export class DealService {
  static getAllDeals() {
    return db.getDeals();
  }

  static createDeal(data: Omit<Deal, 'id'>) {
    return db.addDeal(data);
  }

  static updateDeal(id: string, data: Partial<Deal>) {
    return db.updateDeal(id, data);
  }

  static deleteDeal(id: string) {
    return db.deleteDeal(id);
  }
}
