
"use client";

import { useState, useEffect } from 'react';
import { Expense, Category, DEFAULT_CATEGORIES } from '@/lib/types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [currency, setCurrency] = useState<string>('Rs');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('spendwise_expenses');
    const savedCategories = localStorage.getItem('spendwise_categories');
    const savedCurrency = localStorage.getItem('spendwise_currency');

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendwise_expenses', JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendwise_categories', JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendwise_currency', currency);
    }
  }, [currency, isLoaded]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: crypto.randomUUID() };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCategory = (id: string) => {
    // Basic check: don't delete if expenses are attached? 
    // For now, allow deletion but warn or just let it happen (UI reassigns to Misc).
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    expenses,
    categories,
    currency,
    setCurrency,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    isLoaded
  };
}
