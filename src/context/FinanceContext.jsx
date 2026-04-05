import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';

const FinanceContext = createContext();

const DEFAULT_CATEGORIES = [
  'Housing', 'Food', 'Transportation', 'Utilities', 'Healthcare',
  'Entertainment', 'Shopping', 'Subscriptions', 'Insurance', 'Savings', 'Other',
];

const MONTHLY_MULT = {
  'Weekly':    52 / 12,
  'Bi-weekly': 26 / 12,
  'Monthly':   1,
  'Quarterly': 1 / 3,
  'Annually':  1 / 12,
  'One-time':  0,
};

export function toMonthly(amount, frequency) {
  return Number(amount || 0) * (MONTHLY_MULT[frequency] ?? 1);
}

// ── Sample seed data (used only when localStorage is empty) ─────────────────
const YM = dayjs().format('YYYY-MM');
const p = (d) => `${YM}-${d}`;

const SEED_INCOMES = [
  { id: 'si1', name: 'Day Job', amount: '3500', frequency: 'Bi-weekly', paycheckDays: ['Fri'], paycheckDayOfMonth: '', date: p('01'), notes: 'After-tax', createdAt: p('01') + 'T00:00:00Z' },
  { id: 'si2', name: 'Freelance', amount: '850', frequency: 'Monthly', paycheckDays: [], paycheckDayOfMonth: '15', date: p('15'), notes: 'Design work', createdAt: p('15') + 'T00:00:00Z' },
];

const SEED_PROJECTED = [
  { id: 'sp1', name: 'Raise (pending)', amount: '4000', frequency: 'Bi-weekly', paycheckDays: ['Fri'], paycheckDayOfMonth: '', date: p('01'), notes: 'Expected Q2', createdAt: p('01') + 'T00:00:00Z' },
];

const SEED_BILLS = [
  { id: 'sb1', name: 'Rent',         amount: '1400', frequency: 'Monthly', category: 'Housing',       dueDay: '1',  active: true, notes: '', createdAt: p('01') + 'T00:00:00Z' },
  { id: 'sb2', name: 'Car Insurance',amount: '125',  frequency: 'Monthly', category: 'Insurance',     dueDay: '5',  active: true, notes: '', createdAt: p('01') + 'T00:00:00Z' },
  { id: 'sb3', name: 'Internet',     amount: '79.99',frequency: 'Monthly', category: 'Utilities',     dueDay: '20', active: true, notes: '', createdAt: p('01') + 'T00:00:00Z' },
  { id: 'sb4', name: 'Netflix',      amount: '15.99',frequency: 'Monthly', category: 'Subscriptions', dueDay: '12', active: true, notes: '', createdAt: p('01') + 'T00:00:00Z' },
  { id: 'sb5', name: 'Spotify',      amount: '9.99', frequency: 'Monthly', category: 'Subscriptions', dueDay: '15', active: true, notes: '', createdAt: p('01') + 'T00:00:00Z' },
  { id: 'sb6', name: 'Gym',          amount: '45',   frequency: 'Monthly', category: 'Healthcare',    dueDay: '1',  active: true, notes: '', createdAt: p('01') + 'T00:00:00Z' },
];

const SEED_EXPENSES = [
  { id: 'se1',  description: 'Whole Foods',   amount: '127.50', category: 'Food',           date: p('02'), payee: 'Whole Foods', notes: '', createdAt: p('02') + 'T12:00:00Z' },
  { id: 'se2',  description: 'Uber',          amount: '18.40',  category: 'Transportation', date: p('03'), payee: 'Uber',        notes: '', createdAt: p('03') + 'T09:00:00Z' },
  { id: 'se3',  description: 'Amazon Order',  amount: '64.99',  category: 'Shopping',       date: p('05'), payee: 'Amazon',      notes: 'Books', createdAt: p('05') + 'T14:00:00Z' },
  { id: 'se4',  description: 'Chipotle',      amount: '14.25',  category: 'Food',           date: p('07'), payee: 'Chipotle',    notes: '', createdAt: p('07') + 'T13:00:00Z' },
  { id: 'se5',  description: 'Shell Gas',     amount: '52.00',  category: 'Transportation', date: p('08'), payee: 'Shell',       notes: '', createdAt: p('08') + 'T08:00:00Z' },
  { id: 'se6',  description: 'Movie Tickets', amount: '32.00',  category: 'Entertainment',  date: p('10'), payee: 'AMC',         notes: '', createdAt: p('10') + 'T20:00:00Z' },
  { id: 'se7',  description: 'Target',        amount: '89.43',  category: 'Shopping',       date: p('12'), payee: 'Target',      notes: 'Household', createdAt: p('12') + 'T15:00:00Z' },
  { id: 'se8',  description: 'Doctor Copay',  amount: '45.00',  category: 'Healthcare',     date: p('14'), payee: 'City Medical',notes: '', createdAt: p('14') + 'T10:00:00Z' },
  { id: 'se9',  description: 'Dinner Out',    amount: '78.20',  category: 'Food',           date: p('15'), payee: 'Olive Garden',notes: '', createdAt: p('15') + 'T19:00:00Z' },
  { id: 'se10', description: 'Steam Games',   amount: '29.99',  category: 'Entertainment',  date: p('18'), payee: 'Steam',       notes: '', createdAt: p('18') + 'T21:00:00Z' },
];

const SEED_SAVINGS = { monthly: 500, startingBalance: 4200 };

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function FinanceProvider({ children }) {
  const [incomes, setIncomes]               = useState(() => load('mt_incomes',   SEED_INCOMES));
  const [projectedIncomes, setProjected]    = useState(() => load('mt_projected', SEED_PROJECTED));
  const [bills, setBills]                   = useState(() => load('mt_bills',     SEED_BILLS));
  const [expenses, setExpenses]             = useState(() => load('mt_expenses',  SEED_EXPENSES));
  const [savings, setSavings]               = useState(() => load('mt_savings',   SEED_SAVINGS));

  useEffect(() => { save('mt_incomes',   incomes); },           [incomes]);
  useEffect(() => { save('mt_projected', projectedIncomes); },  [projectedIncomes]);
  useEffect(() => { save('mt_bills',     bills); },             [bills]);
  useEffect(() => { save('mt_expenses',  expenses); },          [expenses]);
  useEffect(() => { save('mt_savings',   savings); },           [savings]);

  const addIncome    = inc  => setIncomes(p => [...p, { ...inc,  id: crypto.randomUUID(), createdAt: dayjs().toISOString() }]);
  const updateIncome = (id, u) => setIncomes(p => p.map(i => i.id === id ? { ...i, ...u } : i));
  const deleteIncome = id  => setIncomes(p => p.filter(i => i.id !== id));

  const addProjectedIncome    = inc  => setProjected(p => [...p, { ...inc,  id: crypto.randomUUID(), createdAt: dayjs().toISOString() }]);
  const updateProjectedIncome = (id, u) => setProjected(p => p.map(i => i.id === id ? { ...i, ...u } : i));
  const deleteProjectedIncome = id  => setProjected(p => p.filter(i => i.id !== id));

  const addBill    = b    => setBills(p => [...p, { ...b, id: crypto.randomUUID(), active: true, createdAt: dayjs().toISOString() }]);
  const updateBill = (id, u) => setBills(p => p.map(b => b.id === id ? { ...b, ...u } : b));
  const deleteBill = id   => setBills(p => p.filter(b => b.id !== id));
  const toggleBill = id   => setBills(p => p.map(b => b.id === id ? { ...b, active: !b.active } : b));

  const addExpense    = e    => setExpenses(p => [...p, { ...e, id: crypto.randomUUID(), createdAt: dayjs().toISOString() }]);
  const updateExpense = (id, u) => setExpenses(p => p.map(e => e.id === id ? { ...e, ...u } : e));
  const deleteExpense = id   => setExpenses(p => p.filter(e => e.id !== id));

  const updateSavings = u => setSavings(p => ({ ...p, ...u }));

  // ── Computed totals ──────────────────────────────────────────────────────
  const totalIncome    = incomes.reduce((s, i)          => s + toMonthly(i.amount, i.frequency), 0);
  const totalProjected = projectedIncomes.reduce((s, i) => s + toMonthly(i.amount, i.frequency), 0);
  const totalBills     = bills.filter(b => b.active).reduce((s, b) => s + toMonthly(b.amount, b.frequency), 0);
  const totalExpenses  = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const netBalance     = totalIncome - totalBills - totalExpenses;
  const projectedNet   = totalProjected - totalBills - totalExpenses;

  // ── 6-month rollover ────────────────────────────────────────────────────
  const now = new Date();
  const monthlyRollover = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const monthExp = expenses
      .filter(e => { const ed = new Date(e.date || e.createdAt); return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear(); })
      .reduce((s, e) => s + Number(e.amount), 0);
    const spent = monthExp + totalBills;
    return { month: label, Projected: totalIncome, Spent: spent, Surplus: totalIncome - spent };
  });

  let runningBal = savings.startingBalance;
  const rolloverWithBalance = monthlyRollover.map(m => {
    runningBal += m.Surplus + savings.monthly;
    return { ...m, Balance: runningBal };
  });

  return (
    <FinanceContext.Provider value={{
      incomes, addIncome, updateIncome, deleteIncome,
      projectedIncomes, addProjectedIncome, updateProjectedIncome, deleteProjectedIncome,
      bills, addBill, updateBill, deleteBill, toggleBill,
      expenses, addExpense, updateExpense, deleteExpense,
      savings, updateSavings,
      totalIncome, totalProjected, totalBills, totalExpenses,
      netBalance, projectedNet,
      monthlyRollover, rolloverWithBalance,
      categories: DEFAULT_CATEGORIES,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
