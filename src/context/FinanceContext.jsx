import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';

const FinanceContext = createContext();

const DEFAULT_CATEGORIES = [
  'Housing', 'Food', 'Transportation', 'Utilities', 'Healthcare',
  'Entertainment', 'Shopping', 'Subscriptions', 'Insurance', 'Savings', 'Other',
];

// How many times each frequency occurs per month
const MONTHLY_MULT = {
  'Weekly':     52 / 12,   // ~4.33
  'Bi-weekly':  26 / 12,   // ~2.167
  'Monthly':    1,
  'Quarterly':  1 / 3,
  'Annually':   1 / 12,
  'One-time':   0,          // one-time doesn't recur monthly
};

export function toMonthly(amount, frequency) {
  return Number(amount || 0) * (MONTHLY_MULT[frequency] ?? 1);
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function FinanceProvider({ children }) {
  const [incomes, setIncomes] = useState(() => load('mt_incomes', []));
  const [projectedIncomes, setProjectedIncomes] = useState(() => load('mt_projected', []));
  const [bills, setBills] = useState(() => load('mt_bills', []));
  const [expenses, setExpenses] = useState(() => load('mt_expenses', []));
  const [savings, setSavings] = useState(() => load('mt_savings', { monthly: 0, startingBalance: 0 }));

  useEffect(() => { save('mt_incomes', incomes); }, [incomes]);
  useEffect(() => { save('mt_projected', projectedIncomes); }, [projectedIncomes]);
  useEffect(() => { save('mt_bills', bills); }, [bills]);
  useEffect(() => { save('mt_expenses', expenses); }, [expenses]);
  useEffect(() => { save('mt_savings', savings); }, [savings]);

  // ---- Income ----
  function addIncome(income) {
    setIncomes(prev => [...prev, { ...income, id: crypto.randomUUID(), createdAt: dayjs().toISOString() }]);
  }
  function updateIncome(id, updates) {
    setIncomes(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }
  function deleteIncome(id) {
    setIncomes(prev => prev.filter(i => i.id !== id));
  }

  // ---- Projected Income ----
  function addProjectedIncome(income) {
    setProjectedIncomes(prev => [...prev, { ...income, id: crypto.randomUUID(), createdAt: dayjs().toISOString() }]);
  }
  function updateProjectedIncome(id, updates) {
    setProjectedIncomes(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }
  function deleteProjectedIncome(id) {
    setProjectedIncomes(prev => prev.filter(i => i.id !== id));
  }

  // ---- Bills ----
  function addBill(bill) {
    setBills(prev => [...prev, { ...bill, id: crypto.randomUUID(), active: true, createdAt: dayjs().toISOString() }]);
  }
  function updateBill(id, updates) {
    setBills(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }
  function deleteBill(id) {
    setBills(prev => prev.filter(b => b.id !== id));
  }
  function toggleBill(id) {
    setBills(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  }

  // ---- Expenses ----
  function addExpense(expense) {
    setExpenses(prev => [...prev, { ...expense, id: crypto.randomUUID(), createdAt: dayjs().toISOString() }]);
  }
  function updateExpense(id, updates) {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }
  function deleteExpense(id) {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  // ---- Savings ----
  function updateSavings(updates) {
    setSavings(prev => ({ ...prev, ...updates }));
  }

  // ---- Computed monthly totals (all normalized to /month) ----
  const totalIncome    = incomes.reduce((s, i) => s + toMonthly(i.amount, i.frequency), 0);
  const totalProjected = projectedIncomes.reduce((s, i) => s + toMonthly(i.amount, i.frequency), 0);
  const totalBills     = bills.filter(b => b.active).reduce((s, b) => s + toMonthly(b.amount, b.frequency), 0);
  const totalExpenses  = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const netBalance     = totalIncome - totalBills - totalExpenses;
  const projectedNet   = totalProjected - totalBills - totalExpenses;

  return (
    <FinanceContext.Provider value={{
      incomes, addIncome, updateIncome, deleteIncome,
      projectedIncomes, addProjectedIncome, updateProjectedIncome, deleteProjectedIncome,
      bills, addBill, updateBill, deleteBill, toggleBill,
      expenses, addExpense, updateExpense, deleteExpense,
      savings, updateSavings,
      totalIncome, totalProjected, totalBills, totalExpenses,
      netBalance, projectedNet,
      categories: DEFAULT_CATEGORIES,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
