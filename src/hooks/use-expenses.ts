
"use client";

import { useState, useEffect } from 'react';
import { Expense, Category, DEFAULT_CATEGORIES } from '@/lib/types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('spendwise_expenses');
    const savedCategories = localStorage.getItem('spendwise_categories');

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
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

  return {
    expenses,
    categories,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    isLoaded
  };
}
