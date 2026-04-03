import React from 'react';
import {
  Grid, Typography, Card, CardContent, Box, Chip, LinearProgress, List,
  ListItem, ListItemText, Divider, Avatar,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import SavingsIcon from '@mui/icons-material/Savings';

import StatCard from '../components/StatCard';
import { useFinance } from '../context/FinanceContext';

const COLORS = ['#6C63FF', '#FF6584', '#43D9AD', '#FFB547', '#FF5252', '#64B5F6', '#A5D6A7', '#FFF176', '#CE93D8'];

const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 1.5 }}>
      {label && <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{label}</Typography>}
      {payload.map((p, i) => (
        <Typography key={i} variant="body2" color={p.color || 'text.primary'} fontWeight={600}>
          {p.name}: {fmt(p.value)}
        </Typography>
      ))}
    </Box>
  );
}

export default function Dashboard() {
  const {
    incomes, projectedIncomes, bills, expenses,
    totalIncome, totalProjected, totalBills, totalExpenses,
    netBalance, projectedNet, categories,
  } = useFinance();

  // Bar chart: actual vs projected
  const overviewData = [
    { name: 'Income', Actual: totalIncome, Projected: totalProjected },
    { name: 'Bills', Actual: totalBills, Projected: totalBills },
    { name: 'Expenses', Actual: totalExpenses, Projected: totalExpenses },
    { name: 'Net', Actual: netBalance, Projected: projectedNet },
  ];

  // Pie chart: expense breakdown by category
  const expenseByCategory = categories.map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0),
  })).filter(c => c.value > 0);

  // Bill breakdown pie
  const billData = bills.filter(b => b.active).map(b => ({ name: b.name, value: Number(b.amount) }));

  // Monthly expenses trend (last 6 months)
  const now = new Date();
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString('default', { month: 'short' });
    const monthExpenses = expenses
      .filter(e => {
        const ed = new Date(e.date || e.createdAt);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      })
      .reduce((s, e) => s + Number(e.amount), 0);
    const monthIncome = incomes
      .filter(inc => {
        const id = new Date(inc.date || inc.createdAt);
        return id.getMonth() === d.getMonth() && id.getFullYear() === d.getFullYear();
      })
      .reduce((s, inc) => s + Number(inc.amount), 0);
    return { month: label, Expenses: monthExpenses, Income: monthIncome };
  });

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const spendingProgress = totalIncome > 0 ? ((totalBills + totalExpenses) / totalIncome) * 100 : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Your financial overview at a glance
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Income"
            value={totalIncome}
            subtitle={`${incomes.length} source${incomes.length !== 1 ? 's' : ''}`}
            icon={<AccountBalanceWalletIcon fontSize="small" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Projected Income"
            value={totalProjected}
            subtitle={`${projectedIncomes.length} expected`}
            icon={<TrendingUpIcon fontSize="small" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Monthly Bills"
            value={totalBills}
            subtitle={`${bills.filter(b => b.active).length} active bill${bills.filter(b => b.active).length !== 1 ? 's' : ''}`}
            icon={<ReceiptLongIcon fontSize="small" />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Expenses"
            value={totalExpenses}
            subtitle={`${expenses.length} transaction${expenses.length !== 1 ? 's' : ''}`}
            icon={<PaymentsIcon fontSize="small" />}
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* Net Balance Banner */}
      <Card sx={{ mb: 3, background: netBalance >= 0 ? 'linear-gradient(135deg, #1a2744 0%, #1e3a2f 100%)' : 'linear-gradient(135deg, #2a1a1a 0%, #3a1e1e 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Net Balance (Actual)</Typography>
              <Typography variant="h4" fontWeight={700} color={netBalance >= 0 ? 'success.main' : 'error.main'}>
                {fmt(netBalance)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">Projected Net</Typography>
              <Typography variant="h5" fontWeight={700} color={projectedNet >= 0 ? 'primary.main' : 'error.main'}>
                {fmt(projectedNet)}
              </Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">Spending vs Income</Typography>
                <Typography variant="caption" color={spendingProgress > 100 ? 'error.main' : 'text.secondary'}>
                  {spendingProgress.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(spendingProgress, 100)}
                color={spendingProgress > 90 ? 'error' : spendingProgress > 70 ? 'warning' : 'success'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Charts Row 1 */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>Income vs Spending</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={overviewData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Actual" fill="#43D9AD" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Projected" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>Expense Breakdown</Typography>
              {expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                  <Typography color="text.secondary" variant="body2">No expenses recorded yet</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 280 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>6-Month Trend</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#43D9AD" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#43D9AD" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6584" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF6584" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="Income" stroke="#43D9AD" fill="url(#incomeGrad)" strokeWidth={2} dot={{ fill: '#43D9AD', r: 4 }} />
                  <Area type="monotone" dataKey="Expenses" stroke="#FF6584" fill="url(#expenseGrad)" strokeWidth={2} dot={{ fill: '#FF6584', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 280 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Expenses</Typography>
              {recentExpenses.length > 0 ? (
                <List dense disablePadding>
                  {recentExpenses.map((e, i) => (
                    <React.Fragment key={e.id}>
                      <ListItem disablePadding sx={{ py: 0.75 }}>
                        <ListItemText
                          primary={<Typography variant="body2" noWrap>{e.description || 'Unnamed'}</Typography>}
                          secondary={
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', mt: 0.25 }}>
                              <Chip label={e.category || 'Other'} size="small" sx={{ height: 18, fontSize: 10 }} />
                              <Typography variant="caption" color="text.secondary">
                                {e.date ? new Date(e.date).toLocaleDateString() : ''}
                              </Typography>
                            </Box>
                          }
                        />
                        <Typography variant="body2" fontWeight={700} color="error.main">
                          -{fmt(e.amount)}
                        </Typography>
                      </ListItem>
                      {i < recentExpenses.length - 1 && <Divider sx={{ opacity: 0.1 }} />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" variant="body2" mt={2}>No expenses yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
