import React, { useState } from 'react';
import {
  Grid, Typography, Card, CardContent, Box, Chip, LinearProgress,
  List, ListItem, ListItemText, Divider, Avatar, IconButton, alpha,
} from '@mui/material';
import {
  AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import NorthRoundedIcon from '@mui/icons-material/NorthRounded';
import SouthRoundedIcon from '@mui/icons-material/SouthRounded';

import StatCard from '../components/StatCard';
import { useFinance } from '../context/FinanceContext';
import { getCategoryConfig } from '../utils/categoryConfig';
import { useThemeMode } from '../context/ThemeContext';

const COLORS = ['#7C6EFA','#06B6D4','#10B981','#F59E0B','#F43F5E','#60A5FA','#A78BFA','#34D399','#FB923C','#E879F9'];
const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
      {label && <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{label}</Typography>}
      {payload.map((p, i) => (
        <Typography key={i} variant="body2" fontWeight={700} sx={{ color: p.color || p.fill }}>{p.name}: {fmt(p.value)}</Typography>
      ))}
    </Box>
  );
}

export default function Dashboard() {
  const { mode } = useThemeMode();
  const dark = mode === 'dark';
  const {
    incomes, expenses, bills, projectedIncomes,
    totalIncome, totalProjected, totalBills, totalExpenses,
    netBalance, projectedNet, categories, savings,
    monthlyRollover,
  } = useFinance();

  const [chartIdx, setChartIdx] = useState(0);
  const now = new Date();

  const thisMonthExp = expenses
    .filter(e => { const d = new Date(e.date || e.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, e) => s + Number(e.amount), 0);

  const byCategory = categories
    .map(cat => ({ name: cat, value: expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0) }))
    .filter(c => c.value > 0).sort((a, b) => b.value - a.value).slice(0, 6);

  const trend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      Income: totalIncome,
      Expenses: expenses.filter(e => { const ed = new Date(e.date || e.createdAt); return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear(); }).reduce((s, e) => s + Number(e.amount), 0),
    };
  });

  const savingsProj = Array.from({ length: 13 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return { month: d.toLocaleString('default', { month: 'short' }), Balance: savings.startingBalance + (savings.monthly + Math.max(0, netBalance)) * i };
  });

  const billPie = bills.filter(b => b.active).map(b => ({ name: b.name, value: Number(b.amount) }));
  const spendPct = totalIncome > 0 ? Math.min(((totalBills + thisMonthExp) / totalIncome) * 100, 100) : 0;
  const projVsSpent = totalProjected - thisMonthExp - totalBills;
  const recentExp = [...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const ap = { tick: { fill: dark ? '#6B7280' : '#9CA3AF', fontSize: 11 }, axisLine: false, tickLine: false };
  const gp = { strokeDasharray: '3 3', stroke: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' };

  const CHARTS = [
    { title: '6-Month Trend',       sub: 'Income vs expenses over time' },
    { title: 'Spending Breakdown',  sub: 'Expenses by category' },
    { title: 'Projected vs Actual', sub: 'Monthly surplus & deficit' },
    { title: 'Savings Projection',  sub: '12-month balance forecast' },
    { title: 'Bill Breakdown',      sub: 'Active recurring bills' },
  ];

  function renderChart(i) {
    switch (i) {
      case 0: return (
        <AreaChart data={trend} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
            <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/><stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/></linearGradient>
          </defs>
          <CartesianGrid {...gp}/><XAxis dataKey="month" {...ap}/><YAxis {...ap} tickFormatter={v => `$${(v/1000).toFixed(0)}k`}/>
          <ReTooltip content={<ChartTip />}/><Legend wrapperStyle={{ fontSize: 11 }}/>
          <Area type="monotone" dataKey="Income" stroke="#10B981" fill="url(#gI)" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }}/>
          <Area type="monotone" dataKey="Expenses" stroke="#F43F5E" fill="url(#gE)" strokeWidth={2} dot={{ r: 3, fill: '#F43F5E' }}/>
        </AreaChart>
      );
      case 1: return byCategory.length ? (
        <PieChart>
          <Pie data={byCategory} cx="50%" cy="50%" innerRadius="32%" outerRadius="58%" paddingAngle={3} dataKey="value">
            {byCategory.map((_, j) => <Cell key={j} fill={COLORS[j % COLORS.length]}/>)}
          </Pie>
          <ReTooltip content={<ChartTip />}/><Legend iconSize={10} wrapperStyle={{ fontSize: 11 }}/>
        </PieChart>
      ) : <Box sx={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%' }}><Typography color="text.secondary" variant="body2">No expenses yet</Typography></Box>;
      case 2: return (
        <ComposedChart data={monthlyRollover} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid {...gp}/><XAxis dataKey="month" {...ap}/><YAxis {...ap} tickFormatter={v => `$${(v/1000).toFixed(0)}k`}/>
          <ReTooltip content={<ChartTip />}/><Legend wrapperStyle={{ fontSize: 11 }}/>
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)"/>
          <Bar dataKey="Projected" fill="#7C6EFA" radius={[3,3,0,0]} opacity={0.7}/>
          <Bar dataKey="Spent" fill="#F43F5E" radius={[3,3,0,0]} opacity={0.7}/>
          <Line type="monotone" dataKey="Surplus" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }}/>
        </ComposedChart>
      );
      case 3: return (
        <AreaChart data={savingsProj} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs><linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/><stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/></linearGradient></defs>
          <CartesianGrid {...gp}/><XAxis dataKey="month" {...ap}/><YAxis {...ap} tickFormatter={v => `$${(v/1000).toFixed(0)}k`}/>
          <ReTooltip content={<ChartTip />}/>
          <Area type="monotone" dataKey="Balance" stroke="#F59E0B" fill="url(#gS)" strokeWidth={2} dot={false}/>
        </AreaChart>
      );
      case 4: return billPie.length ? (
        <PieChart>
          <Pie data={billPie} cx="50%" cy="50%" innerRadius="32%" outerRadius="58%" paddingAngle={3} dataKey="value">
            {billPie.map((_, j) => <Cell key={j} fill={COLORS[j % COLORS.length]}/>)}
          </Pie>
          <ReTooltip content={<ChartTip />}/><Legend iconSize={10} wrapperStyle={{ fontSize: 11 }}/>
        </PieChart>
      ) : <Box sx={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%' }}><Typography color="text.secondary" variant="body2">No bills yet</Typography></Box>;
      default: return null;
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* ── Hero Card ─────────────────────────────────────────── */}
      <Card sx={{
        background: dark
          ? 'linear-gradient(135deg, #1a1040 0%, #0d1a38 50%, #0a1428 100%)'
          : 'linear-gradient(135deg, #6C63FF 0%, #4FACFE 100%)',
        border: 'none', position: 'relative', overflow: 'hidden',
        '&:hover': { transform: 'none' },
      }}>
        <Box sx={{ position:'absolute', right:-60, top:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,110,250,0.22) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <Box sx={{ position:'absolute', left:-30, bottom:-50, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)', pointerEvents:'none' }}/>

        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 }, position:'relative', zIndex:1 }}>
          {/* Balance + mini stats in one row */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5} md={4}>
              <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600 }}>
                Net Monthly Balance
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ color:'#fff', letterSpacing:'-0.025em', my: 0.25, fontSize: { xs: '1.6rem', sm: '2rem' } }}>
                {fmt(netBalance)}
              </Typography>
              <Box sx={{ display:'flex', alignItems:'center', gap:0.5, flexWrap:'wrap' }}>
                {netBalance >= 0
                  ? <NorthRoundedIcon sx={{ fontSize:14, color:'#34D399' }}/>
                  : <SouthRoundedIcon sx={{ fontSize:14, color:'#FB7185' }}/>}
                <Typography variant="caption" sx={{ color: netBalance >= 0 ? '#34D399' : '#FB7185', fontWeight:700 }}>
                  {netBalance >= 0 ? 'Surplus' : 'Deficit'}
                </Typography>
                <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.45)' }}>
                  · Projected {fmt(projectedNet)}
                </Typography>
              </Box>
            </Grid>

            {/* 4 mini-stat boxes */}
            <Grid item xs={12} sm={7} md={8}>
              <Grid container spacing={1}>
                {[
                  { label:'Income',    val: totalIncome,     color:'#34D399', icon:'↑' },
                  { label:'Bills',     val: totalBills,      color:'#FCD34D', icon:'↓' },
                  { label:'Expenses',  val: totalExpenses,   color:'#FB7185', icon:'↓' },
                  { label:'Savings',   val: savings.monthly, color:'#93C5FD', icon:'→' },
                ].map(item => (
                  <Grid item xs={6} sm={3} key={item.label}>
                    <Box sx={{ bgcolor:'rgba(255,255,255,0.08)', borderRadius:2, p: { xs: 1, sm: 1.25 }, border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(8px)' }}>
                      <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.55)', display:'block', fontSize: '0.65rem', mb: 0.2 }}>{item.label}</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: item.color, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        {item.icon} {fmt(item.val)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Budget progress */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.5 }}>
              <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.55)', fontWeight:600 }}>Budget used this month</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: spendPct > 90 ? '#FB7185' : spendPct > 70 ? '#FCD34D' : '#34D399' }}>
                {spendPct.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={spendPct} sx={{
              height: 5, borderRadius: 99, bgcolor:'rgba(255,255,255,0.15)',
              '& .MuiLinearProgress-bar': { background: spendPct > 90 ? '#F43F5E' : spendPct > 70 ? '#F59E0B' : '#10B981', borderRadius: 99 },
            }}/>
          </Box>
        </CardContent>
      </Card>

      {/* ── 4 Stat Cards ──────────────────────────────────────── */}
      <Grid container spacing={1.5}>
        <Grid item xs={6} sm={3}>
          <StatCard title="Monthly Income"   value={totalIncome}    subtitle={`${incomes.length} sources`}                  icon={<AccountBalanceWalletRoundedIcon />} color="#10B981" compact />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Projected Income" value={totalProjected} subtitle={`${projectedIncomes.length} expected`}         icon={<TrendingUpRoundedIcon />}           color="#7C6EFA" compact />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Monthly Bills"    value={totalBills}     subtitle={`${bills.filter(b=>b.active).length} active`}  icon={<ReceiptLongRoundedIcon />}          color="#F59E0B" compact />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Total Expenses"   value={totalExpenses}  subtitle={`${expenses.length} transactions`}             icon={<PaymentsRoundedIcon />}             color="#F43F5E" compact />
        </Grid>
      </Grid>

      {/* ── Chart Carousel + This Month ───────────────────────── */}
      <Grid container spacing={2} alignItems="stretch">
        {/* Chart carousel */}
        <Grid item xs={12} md={8} sx={{ display:'flex', flexDirection:'column' }}>
          <Card sx={{ flex: 1, display:'flex', flexDirection:'column' }}>
            <CardContent sx={{ flex: 1, display:'flex', flexDirection:'column', p: { xs: 1.5, sm: 2, md: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } } }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb: 1.5, gap: 1, flexWrap:'wrap' }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>{CHARTS[chartIdx].title}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>{CHARTS[chartIdx].sub}</Typography>
                </Box>
                <Box sx={{ display:'flex', alignItems:'center', gap:0.5, flexShrink: 0 }}>
                  {CHARTS.map((_, i) => (
                    <Box key={i} onClick={() => setChartIdx(i)} sx={{ width:6, height:6, borderRadius:'50%', cursor:'pointer', bgcolor: i===chartIdx ? 'primary.main' : 'divider', transition:'all 0.2s', '&:hover':{bgcolor:'primary.light'} }}/>
                  ))}
                  <IconButton size="small" onClick={() => setChartIdx(i => (i-1+CHARTS.length)%CHARTS.length)}><ChevronLeftRoundedIcon sx={{ fontSize:16 }}/></IconButton>
                  <IconButton size="small" onClick={() => setChartIdx(i => (i+1)%CHARTS.length)}><ChevronRightRoundedIcon sx={{ fontSize:16 }}/></IconButton>
                </Box>
              </Box>
              <Box sx={{ flex: 1, minHeight: { xs: 200, sm: 240, md: 270 } }}>
                <ResponsiveContainer width="100%" height="100%">{renderChart(chartIdx)}</ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* This Month breakdown — stretches to match chart height */}
        <Grid item xs={12} md={4} sx={{ display:'flex', flexDirection:'column' }}>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }, height:'100%', display:'flex', flexDirection:'column', gap: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={700}>This Month</Typography>

              {/* Three budget rows */}
              {[
                { label:'Projected Income', val: totalProjected,  color:'#7C6EFA' },
                { label:'Fixed Bills',      val: totalBills,      color:'#F59E0B' },
                { label:'Spent so far',     val: thisMonthExp,    color:'#F43F5E' },
              ].map(row => {
                const pct = totalProjected > 0 ? Math.min((row.val / totalProjected) * 100, 100) : 0;
                return (
                  <Box key={row.label}>
                    <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.4 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>{row.label}</Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ color: row.color }}>{fmt(row.val)}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={pct} sx={{ height:5, bgcolor:'divider', '& .MuiLinearProgress-bar':{ background: row.color, borderRadius:99 } }}/>
                  </Box>
                );
              })}

              <Divider/>

              {/* Rollover result */}
              <Box sx={{ bgcolor: projVsSpent>=0 ? alpha('#10B981',0.1) : alpha('#F43F5E',0.1), borderRadius:2, p: 1.5, textAlign:'center', border:`1px solid ${projVsSpent>=0 ? alpha('#10B981',0.2) : alpha('#F43F5E',0.2)}` }}>
                <Typography variant="caption" color="text.secondary" display="block">Rollover</Typography>
                <Typography variant="h6" fontWeight={800} color={projVsSpent>=0 ? 'success.main' : 'error.main'} sx={{ my: 0.25 }}>
                  {projVsSpent>=0?'+':''}{fmt(projVsSpent)}
                </Typography>
                <Typography variant="caption" color={projVsSpent>=0 ? 'success.main' : 'error.main'} fontWeight={600}>
                  {projVsSpent>=0 ? 'carries forward' : 'over budget'}
                </Typography>
              </Box>

              {/* Top categories fill remaining space */}
              {byCategory.length > 0 && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform:'uppercase', letterSpacing:'0.06em', display:'block', mb: 0.75 }}>
                    Top Categories
                  </Typography>
                  <Box sx={{ display:'flex', flexDirection:'column', gap: 0.75 }}>
                    {byCategory.slice(0,3).map(cat => {
                      const cfg = getCategoryConfig(cat.name);
                      const pct = byCategory[0].value > 0 ? (cat.value / byCategory[0].value) * 100 : 0;
                      return (
                        <Box key={cat.name} sx={{ display:'flex', alignItems:'center', gap: 1 }}>
                          <Typography sx={{ fontSize: 14, flexShrink: 0 }}>{cfg.emoji}</Typography>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display:'flex', justifyContent:'space-between', mb: 0.2 }}>
                              <Typography variant="caption" fontWeight={600} noWrap>{cat.name}</Typography>
                              <Typography variant="caption" fontWeight={700} color="error.main">{fmt(cat.value)}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={pct} sx={{ height:3, bgcolor:'divider', '& .MuiLinearProgress-bar':{ background: cfg.color, borderRadius:99 } }}/>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Recent Transactions ───────────────────────────────── */}
      <Card>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } } }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>Recent Transactions</Typography>
          {recentExp.length === 0 ? (
            <Typography color="text.secondary" variant="body2" py={1}>No expenses recorded yet</Typography>
          ) : (
            <List disablePadding>
              {recentExp.map((e, i) => {
                const cfg = getCategoryConfig(e.category);
                return (
                  <React.Fragment key={e.id}>
                    <ListItem disablePadding sx={{ py: 0.75, gap: 1.25 }}>
                      <Avatar sx={{ width:36, height:36, borderRadius:2, bgcolor: cfg.bg, fontSize:16, flexShrink:0 }}>{cfg.emoji}</Avatar>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={600} noWrap>{e.description}</Typography>}
                        secondary={
                          <Box sx={{ display:'flex', gap:0.5, alignItems:'center', mt: 0.15, flexWrap:'nowrap', overflow:'hidden' }}>
                            <Chip label={e.category} size="small" sx={{ height:16, fontSize:'0.6rem', bgcolor: cfg.bg, color: cfg.color, flexShrink:0 }}/>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {e.date ? new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' }) : ''}
                            </Typography>
                          </Box>
                        }
                      />
                      <Typography variant="body2" fontWeight={700} color="error.main" sx={{ flexShrink:0, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        -{fmt(e.amount)}
                      </Typography>
                    </ListItem>
                    {i < recentExp.length-1 && <Divider sx={{ opacity:0.4 }}/>}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

    </Box>
  );
}
