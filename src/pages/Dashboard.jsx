import React, { useState } from 'react';
import {
  Grid, Typography, Card, CardContent, Box, Chip, LinearProgress,
  List, ListItem, ListItemText, Divider, Avatar, IconButton, Tooltip,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area, LineChart, Line, ComposedChart, ReferenceLine,
} from 'recharts';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import StatCard from '../components/StatCard';
import { useFinance } from '../context/FinanceContext';

const COLORS = ['#6C63FF', '#FF6584', '#43D9AD', '#FFB547', '#FF5252', '#64B5F6', '#A5D6A7', '#FFF176', '#CE93D8', '#FFAB40'];
const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 1.5, minWidth: 140 }}>
      {label && <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{label}</Typography>}
      {payload.map((p, i) => (
        <Typography key={i} variant="body2" fontWeight={600} sx={{ color: p.color || p.fill || 'text.primary' }}>
          {p.name}: {fmt(p.value)}
        </Typography>
      ))}
    </Box>
  );
}

// ── Individual chart panels ──────────────────────────────────────────────────

function ChartIncomeVsSpending({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
        <ReTooltip content={<ChartTooltip />} />
        <Legend />
        <Bar dataKey="Actual" fill="#43D9AD" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Projected" fill="#6C63FF" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartExpensePie({ data }) {
  if (!data.length) return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Typography color="text.secondary">No expenses yet</Typography></Box>;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius="35%" outerRadius="60%" paddingAngle={3} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <ReTooltip content={<ChartTooltip />} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ChartTrend({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#43D9AD" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#43D9AD" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6584" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FF6584" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
        <ReTooltip content={<ChartTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="Income" stroke="#43D9AD" fill="url(#incG)" strokeWidth={2} dot={{ fill: '#43D9AD', r: 3 }} />
        <Area type="monotone" dataKey="Expenses" stroke="#FF6584" fill="url(#expG)" strokeWidth={2} dot={{ fill: '#FF6584', r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ChartSavingsGrowth({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="savG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFB547" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#FFB547" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" tick={{ fill: '#9E9EBF', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
        <ReTooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="Balance" stroke="#FFB547" fill="url(#savG)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ChartBillPie({ data }) {
  if (!data.length) return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Typography color="text.secondary">No active bills</Typography></Box>;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius="35%" outerRadius="60%" paddingAngle={3} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <ReTooltip content={<ChartTooltip />} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ChartRollover({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
        <ReTooltip content={<ChartTooltip />} />
        <Legend />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
        <Bar dataKey="Projected" fill="#6C63FF" radius={[4, 4, 0, 0]} opacity={0.6} />
        <Bar dataKey="Spent" fill="#FF6584" radius={[4, 4, 0, 0]} opacity={0.6} />
        <Line type="monotone" dataKey="Surplus" stroke="#43D9AD" strokeWidth={2} dot={{ fill: '#43D9AD', r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function ChartRunningBalance({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="balG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
        <ReTooltip content={<ChartTooltip />} />
        <ReferenceLine y={0} stroke="rgba(255,82,82,0.5)" strokeDasharray="4 4" />
        <Area type="monotone" dataKey="Balance" stroke="#6C63FF" fill="url(#balG)" strokeWidth={2} dot={{ fill: '#6C63FF', r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Chart carousel ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const {
    incomes, projectedIncomes, bills, expenses,
    totalIncome, totalProjected, totalBills, totalExpenses,
    netBalance, projectedNet, categories,
    savings, monthlyRollover, rolloverWithBalance,
  } = useFinance();

  const [chartIdx, setChartIdx] = useState(0);

  const now = new Date();

  // Overview bar data
  const overviewData = [
    { name: 'Income',   Actual: totalIncome,   Projected: totalProjected },
    { name: 'Bills',    Actual: totalBills,    Projected: totalBills },
    { name: 'Expenses', Actual: totalExpenses,  Projected: totalExpenses },
    { name: 'Net',      Actual: netBalance,    Projected: projectedNet },
  ];

  // Expense by category
  const expenseByCategory = categories
    .map(cat => ({ name: cat, value: expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0) }))
    .filter(c => c.value > 0);

  // 6-month trend
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      Expenses: expenses.filter(e => { const ed = new Date(e.date || e.createdAt); return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear(); }).reduce((s, e) => s + Number(e.amount), 0),
      Income: totalIncome,
    };
  });

  // Savings growth - 12 months
  const savingsGrowth = Array.from({ length: 13 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      Balance: savings.startingBalance + (savings.monthly + Math.max(0, netBalance)) * i,
    };
  });

  // Bill breakdown
  const billPieData = bills.filter(b => b.active).map(b => ({ name: b.name, value: Number(b.amount) }));

  const CHARTS = [
    { title: 'Income vs Spending',       subtitle: 'Actual vs projected monthly overview' },
    { title: 'Expense Breakdown',         subtitle: 'Spending by category' },
    { title: '6-Month Trend',             subtitle: 'Income vs expenses over time' },
    { title: 'Savings Growth (12 mo)',    subtitle: 'Projected savings balance' },
    { title: 'Bill Breakdown',            subtitle: 'Active recurring bills' },
    { title: 'Projected vs Spent',        subtitle: 'Monthly surplus / deficit' },
    { title: 'Running Balance',           subtitle: 'Cumulative balance over 6 months' },
  ];

  const total = CHARTS.length;
  const prev = () => setChartIdx(i => (i - 1 + total) % total);
  const next = () => setChartIdx(i => (i + 1) % total);

  function renderChart(idx) {
    switch (idx) {
      case 0: return <ChartIncomeVsSpending data={overviewData} />;
      case 1: return <ChartExpensePie data={expenseByCategory} />;
      case 2: return <ChartTrend data={monthlyTrend} />;
      case 3: return <ChartSavingsGrowth data={savingsGrowth} />;
      case 4: return <ChartBillPie data={billPieData} />;
      case 5: return <ChartRollover data={monthlyRollover} />;
      case 6: return <ChartRunningBalance data={rolloverWithBalance} />;
      default: return null;
    }
  }

  const spendingProgress = totalIncome > 0 ? ((totalBills + totalExpenses) / totalIncome) * 100 : 0;
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // This-month expenses
  const thisMonthExp = expenses
    .filter(e => { const d = new Date(e.date || e.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, e) => s + Number(e.amount), 0);
  const projectedVsSpent = totalProjected - thisMonthExp - totalBills;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Your financial overview — {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={6} lg={2.4}>
          <StatCard title="Monthly Income" value={totalIncome} subtitle={`${incomes.length} sources`} icon={<AccountBalanceWalletIcon fontSize="small" />} color="success.main" />
        </Grid>
        <Grid item xs={6} lg={2.4}>
          <StatCard title="Projected" value={totalProjected} subtitle={`${projectedIncomes.length} expected`} icon={<TrendingUpIcon fontSize="small" />} color="primary.main" />
        </Grid>
        <Grid item xs={6} lg={2.4}>
          <StatCard title="Bills" value={totalBills} subtitle={`${bills.filter(b => b.active).length} active`} icon={<ReceiptLongIcon fontSize="small" />} color="warning.main" />
        </Grid>
        <Grid item xs={6} lg={2.4}>
          <StatCard title="Expenses" value={totalExpenses} subtitle={`${expenses.length} total`} icon={<PaymentsIcon fontSize="small" />} color="error.main" />
        </Grid>
        <Grid item xs={12} lg={2.4}>
          <StatCard title="Monthly Savings" value={savings.monthly} subtitle={`Balance: ${fmt(savings.startingBalance)}`} icon={<SavingsIcon fontSize="small" />} color="warning.main" />
        </Grid>
      </Grid>

      {/* Net Balance Banner + Projected vs Spent breakdown */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', background: netBalance >= 0 ? 'linear-gradient(135deg, #1a2744 0%, #1e3a2f 100%)' : 'linear-gradient(135deg, #2a1a1a 0%, #3a1e1e 100%)' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Net Balance</Typography>
                  <Typography variant="h4" fontWeight={700} color={netBalance >= 0 ? 'success.main' : 'error.main'}>{fmt(netBalance)}</Typography>
                  <Typography variant="caption" color="text.secondary">/month after bills</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">Projected Net</Typography>
                  <Typography variant="h5" fontWeight={700} color={projectedNet >= 0 ? 'primary.main' : 'error.main'}>{fmt(projectedNet)}</Typography>
                  <Typography variant="caption" color="text.secondary">including pending income</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Spending vs Income</Typography>
                    <Typography variant="caption" color={spendingProgress > 100 ? 'error.main' : 'text.secondary'}>{spendingProgress.toFixed(1)}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Math.min(spendingProgress, 100)} color={spendingProgress > 90 ? 'error' : spendingProgress > 70 ? 'warning' : 'success'} sx={{ height: 8, borderRadius: 4 }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Projected vs Spent (This Month)</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { label: 'Projected Income', val: totalProjected, color: 'primary.main' },
                  { label: 'Bills (fixed)',     val: -totalBills,    color: 'warning.main' },
                  { label: 'Expenses so far',   val: -thisMonthExp,  color: 'error.main' },
                ].map(row => (
                  <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                    <Typography variant="body2" fontWeight={700} color={row.color}>{row.val >= 0 ? '+' : ''}{fmt(row.val)}</Typography>
                  </Box>
                ))}
                <Divider sx={{ opacity: 0.15 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" fontWeight={700}>Rollover</Typography>
                  <Typography variant="body1" fontWeight={700} color={projectedVsSpent >= 0 ? 'success.main' : 'error.main'}>
                    {projectedVsSpent >= 0 ? '+' : ''}{fmt(projectedVsSpent)}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: projectedVsSpent >= 0 ? 'rgba(67,217,173,0.08)' : 'rgba(255,82,82,0.08)', borderRadius: 2, p: 1, textAlign: 'center' }}>
                  <Typography variant="caption" color={projectedVsSpent >= 0 ? 'success.main' : 'error.main'} fontWeight={600}>
                    {projectedVsSpent >= 0 ? `${fmt(projectedVsSpent)} carries forward` : `${fmt(Math.abs(projectedVsSpent))} over budget`}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Carousel */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
              <Typography variant="h6">{CHARTS[chartIdx].title}</Typography>
              <Typography variant="caption" color="text.secondary">{CHARTS[chartIdx].subtitle}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {CHARTS.map((_, i) => (
                <Box key={i} onClick={() => setChartIdx(i)} sx={{ width: 8, height: 8, borderRadius: '50%', cursor: 'pointer', bgcolor: i === chartIdx ? 'primary.main' : 'rgba(255,255,255,0.15)', transition: 'all 0.2s' }} />
              ))}
              <IconButton size="small" onClick={prev} sx={{ ml: 1 }}><ChevronLeftIcon /></IconButton>
              <IconButton size="small" onClick={next}><ChevronRightIcon /></IconButton>
            </Box>
          </Box>
          <Box sx={{ height: 300 }}>
            {renderChart(chartIdx)}
          </Box>
        </CardContent>
      </Card>

      {/* Rollover Table + Recent Expenses */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>6-Month Rollover</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Projected</TableCell>
                    <TableCell align="right">Spent</TableCell>
                    <TableCell align="right">Surplus</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rolloverWithBalance.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell><Typography variant="body2" fontWeight={500}>{row.month}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2" color="primary.main">{fmt(row.Projected)}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2" color="error.main">{fmt(row.Spent)}</Typography></TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color={row.Surplus >= 0 ? 'success.main' : 'error.main'}>
                          {row.Surplus >= 0 ? '+' : ''}{fmt(row.Surplus)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700} color={row.Balance >= 0 ? 'text.primary' : 'error.main'}>
                          {fmt(row.Balance)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
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
                        <Typography variant="body2" fontWeight={700} color="error.main">-{fmt(e.amount)}</Typography>
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
