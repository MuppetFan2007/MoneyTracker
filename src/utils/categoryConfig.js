// Color, gradient, and label config per spending category
export const CATEGORY_CONFIG = {
  Housing:        { color: '#60A5FA', bg: 'rgba(96,165,250,0.15)',  gradient: 'linear-gradient(135deg,#1e3a5f,#0d2040)', emoji: '🏠' },
  Food:           { color: '#34D399', bg: 'rgba(52,211,153,0.15)',  gradient: 'linear-gradient(135deg,#1e4620,#0d2a10)', emoji: '🍔' },
  Transportation: { color: '#FB923C', bg: 'rgba(251,146,60,0.15)',  gradient: 'linear-gradient(135deg,#3e2010,#2a1505)', emoji: '🚗' },
  Utilities:      { color: '#A78BFA', bg: 'rgba(167,139,250,0.15)', gradient: 'linear-gradient(135deg,#1e1a40,#0d0d28)', emoji: '⚡' },
  Healthcare:     { color: '#F87171', bg: 'rgba(248,113,113,0.15)', gradient: 'linear-gradient(135deg,#3e0a1e,#28050f)', emoji: '🏥' },
  Entertainment:  { color: '#E879F9', bg: 'rgba(232,121,249,0.15)', gradient: 'linear-gradient(135deg,#2e0a40,#1a0528)', emoji: '🎬' },
  Shopping:       { color: '#2DD4BF', bg: 'rgba(45,212,191,0.15)',  gradient: 'linear-gradient(135deg,#0a3030,#051e1e)', emoji: '🛍️' },
  Subscriptions:  { color: '#38BDF8', bg: 'rgba(56,189,248,0.15)',  gradient: 'linear-gradient(135deg,#0a2040,#051428)', emoji: '📺' },
  Insurance:      { color: '#86EFAC', bg: 'rgba(134,239,172,0.15)', gradient: 'linear-gradient(135deg,#0a3020,#051e10)', emoji: '🛡️' },
  Savings:        { color: '#FCD34D', bg: 'rgba(252,211,77,0.15)',  gradient: 'linear-gradient(135deg,#3a2a00,#201800)', emoji: '💰' },
  Other:          { color: '#94A3B8', bg: 'rgba(148,163,184,0.15)', gradient: 'linear-gradient(135deg,#1e2028,#131518)', emoji: '📦' },
  // Income category
  Income:         { color: '#10B981', bg: 'rgba(16,185,129,0.15)',  gradient: 'linear-gradient(135deg,#0a3020,#051e10)', emoji: '💵' },
  Salary:         { color: '#10B981', bg: 'rgba(16,185,129,0.15)',  gradient: 'linear-gradient(135deg,#0a3020,#051e10)', emoji: '💼' },
  Freelance:      { color: '#06B6D4', bg: 'rgba(6,182,212,0.15)',   gradient: 'linear-gradient(135deg,#0a2030,#051428)', emoji: '💻' },
};

export function getCategoryConfig(cat) {
  return CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Other;
}

export const ALL_CATEGORIES = [
  'Housing', 'Food', 'Transportation', 'Utilities', 'Healthcare',
  'Entertainment', 'Shopping', 'Subscriptions', 'Insurance', 'Savings', 'Other',
];
