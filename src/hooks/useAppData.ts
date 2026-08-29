import { useState, useEffect, useCallback } from 'react';
import { Deal, Expense } from '../types';
import {
  fetchDealsApi,
  createDealApi,
  updateDealApi,
  deleteDealApi,
  fetchExpensesApi,
  createExpenseApi,
  deleteExpenseApi,
  resetDatabaseApi,
} from '../api/apiClient';

export interface AppDataResult {
  deals: Deal[];
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  notification: { message: string; type: 'success' | 'error' } | null;
  handleAddDeal: (newDeal: Omit<Deal, 'id'>) => Promise<void>;
  handleUpdateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  handleDeleteDeal: (id: string) => Promise<void>;
  handleAddExpense: (newExpense: Omit<Expense, 'id'>) => Promise<void>;
  handleDeleteExpense: (id: string) => Promise<void>;
  handleResetDb: () => Promise<void>;
  fetchData: () => Promise<void>;
  clearNotification: () => void;
}

export function useAppData(): AppDataResult {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const clearNotification = useCallback(() => setNotification(null), []);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const [dealsData, expData] = await Promise.all([
        fetchDealsApi(),
        fetchExpensesApi(),
      ]);

      setDeals(dealsData);
      setExpenses(expData);
    } catch (err: unknown) {
      console.error('[App Data Fetch Error]:', err);
      const msg = err instanceof Error ? err.message : 'Error connecting to database';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddDeal = async (newDeal: Omit<Deal, 'id'>): Promise<void> => {
    try {
      const created = await createDealApi(newDeal);
      setDeals((prev) => [...prev, created]);
      showNotification(`Deal for "${created.client_name}" added successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding deal';
      showNotification(msg, 'error');
    }
  };

  const handleUpdateDeal = async (id: string, updates: Partial<Deal>): Promise<void> => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    try {
      await updateDealApi(id, updates);
    } catch (err: unknown) {
      console.error('[Update Deal Error]:', err);
      fetchData();
      showNotification('Failed to update deal on server.', 'error');
    }
  };

  const handleDeleteDeal = async (id: string): Promise<void> => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    try {
      await deleteDealApi(id);
      showNotification('Deal deleted successfully.');
    } catch (err: unknown) {
      console.error('[Delete Deal Error]:', err);
      fetchData();
      showNotification('Failed to delete deal from server.', 'error');
    }
  };

  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>): Promise<void> => {
    try {
      const created = await createExpenseApi(newExpense);
      setExpenses((prev) => [created, ...prev]);
      showNotification(`Expense "${created.expense_name}" logged successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding expense';
      showNotification(msg, 'error');
    }
  };

  const handleDeleteExpense = async (id: string): Promise<void> => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteExpenseApi(id);
      showNotification('Expense removed successfully.');
    } catch (err: unknown) {
      console.error('[Delete Expense Error]:', err);
      fetchData();
      showNotification('Failed to delete expense from server.', 'error');
    }
  };

  const handleResetDb = async (): Promise<void> => {
    try {
      const data = await resetDatabaseApi();
      setDeals(data.deals || []);
      setExpenses(data.expenses || []);
      showNotification('Database reset to sample Indian business data defaults.');
    } catch (err: unknown) {
      console.error('[Reset DB Error]:', err);
      showNotification('Failed to reset database.', 'error');
    }
  };

  return {
    deals,
    expenses,
    loading,
    error,
    notification,
    handleAddDeal,
    handleUpdateDeal,
    handleDeleteDeal,
    handleAddExpense,
    handleDeleteExpense,
    handleResetDb,
    fetchData,
    clearNotification,
  };
}
