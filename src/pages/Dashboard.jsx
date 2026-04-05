import React, { useState } from 'react';
import {
  Grid, Typography, Card, CardContent, Box, Chip, LinearProgress,
  List, ListItem, ListItemText, Divider, Avatar, IconButton, alpha,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, ComposedChart, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
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
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
      {label && <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{label}</Typography>}
      {payload.map((p, i) => (
        <Typography key={i} variant="body2" fontWeight={700} sx={{ color: p.color || p.fill }}>
          {p.name}: {fmt(p.value)}
        </Typography>
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
    monthlyRollover, rolloverWithBalance,
  } = useFinance();

  const [chartIdx, setChartIdx] = useState(0);
  const now = new Date();

  // This-month expenses
  const thisMonthExp = expenses
    .filter(e => { const d = new Date(e.date || e.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, e) => s + Number(e.amount), 0);

  // Category breakdown
  const byCategory = categories
    .map(cat => ({ name: cat, value: expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0) }))
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value);

  // 6-month trend
  const trend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      Income: totalIncome,
      Expenses: expenses.filter(e => { const ed = new Date(e.date || e.createdAt); return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear(); }).reduce((s, e) => s + Number(e.amount), 0),
    };
  });

  // Savings projection 12 mo
  const savingsProj = Array.from({ length: 13 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return { month: d.toLocaleString('default', { month: 'short', year: '2-digit' }), Balance: savings.startingBalance + (savings.monthly + Math.max(0, netBalance)) * i };
  });

  const billPie = bills.filter(b => b.active).map(b => ({ name: b.name, value: Number(b.amount) }));
  const spendPct = totalIncome > 0 ? Math.min(((totalBills + thisMonthExp) / totalIncome) * 100, 100) : 0;
  const projVsSpent = totalProjected - thisMonthExp - totalBills;
  const recentExp = [...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  const CHARTS = [
    { title: '6-Month Income vs Expenses', sub: 'Recurring income compared to monthly spending' },
    { title: 'Spending by Category', sub: 'Where your money goes' },
    { title: 'Projected vs Actual', sub: 'Projected income, bills, and spending per month' },
    { title: 'Savings Growth', sub: '12-month projection with monthly contributions' },
    { title: 'Bill Breakdown', sub: 'Active recurring bills' },
    { title: 'Running Balance', sub: 'Cumulative balance with savings over 6 months' },
  ];

  function renderChart(i) {
    const axisProps = { tick: { fill: dark ? '#6B7280' : '#9CA3AF', fontSize: 11 }, axisLine: false, tickLine: false };
    const gridProps = { strokeDasharray: '3 3', stroke: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' };
    switch (i) {
      case 0: return (
        <AreaChart data={trend} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/><stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} /><XAxis dataKey="month" {...axisProps} /><YAxis {...axisProps} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
          <ReTooltip content={<ChartTip />} /><Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="Income" stroke="#10B981" fill="url(#gInc)" strokeWidth={2} dot={{ r: 4, fill: '#10B981' }} />
          <Area type="monotone" dataKey="Expenses" stroke="#F43F5E" fill="url(#gExp)" strokeWidth={2} dot={{ r: 4, fill: '#F43F5E' }} />
        </AreaChart>
      );
      case 1: return byCategory.length ? (
        <PieChart>
          <Pie data={byCategory} cx="50%" cy="50%" innerRadius="35%" outerRadius="62%" paddingAngle={3} dataKey="value">
            {byCategory.map((_, j) => <Cell key={j} fill={COLORS[j % COLORS.length]} />)}
          </Pie>
          <ReTooltip content={<ChartTip />} /><Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      ) : <Box sx={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%' }}><Typography color="text.secondary">No expenses yet</Typography></Box>;
      case 2: return (
        <ComposedChart data={monthlyRollover} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid {...gridProps}/><XAxis dataKey="month" {...axisProps}/><YAxis {...axisProps} tickFormatter={v => `$${(v/1000).toFixed(0)}k`}/>
          <ReTooltip content={<ChartTip />}/><Legend wrapperStyle={{ fontSize: 12 }}/>
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
          <Bar dataKey="Projected" fill="#7C6EFA" radius={[4,4,0,0]} opacity={0.7}/>
          <Bar dataKey="Spent" fill="#F43F5E" radius={[4,4,0,0]} opacity={0.7}/>
          <Line type="monotone" dataKey="Surplus" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }}/>
        </ComposedChart>
      );
      case 3: return (
        <AreaChart data={savingsProj} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gSav" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/><stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps}/><XAxis dataKey="month" {...axisProps}/><YAxis {...axisProps} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
          <ReTooltip content={<ChartTip />}/>
          <Area type="monotone" dataKey="Balance" stroke="#F59E0B" fill="url(#gSav)" strokeWidth={2.5} dot={false}/>
        </AreaChart>
      );
      case 4: return billPie.length ? (
        <PieChart>
          <Pie data={billPie} cx="50%" cy="50%" innerRadius="35%" outerRadius="62%" paddingAngle={3} dataKey="value">
            {billPie.map((_, j) => <Cell key={j} fill={COLORS[j % COLORS.length]} />)}
          </Pie>
          <ReTooltip content={<ChartTip />}/><Legend iconSize={10} wrapperStyle={{ fontSize: 11 }}/>
        </PieChart>
      ) : <Box sx={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%' }}><Typography color="text.secondary">No bills yet</Typography></Box>;
      case 5: return (
        <AreaChart data={rolloverWithBalance} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C6EFA" stopOpacity={0.4}/><stop offset="95%" stopColor="#7C6EFA" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps}/><XAxis dataKey="month" {...axisProps}/><YAxis {...axisProps} tickFormatter={v=>`$${(v/1000).toFixed(1)}k`}/>
          <ReTooltip content={<ChartTip />}/>
          <ReferenceLine y={0} stroke="#F43F5E" strokeDasharray="4 4" opacity={0.5}/>
          <Area type="monotone" dataKey="Balance" stroke="#7C6EFA" fill="url(#gBal)" strokeWidth={2.5} dot={{ r: 4, fill: '#7C6EFA' }}/>
        </AreaChart>
      );
      default: return null;
    }
  }

  return (
    <Box>
      {/* Hero Balance Card */}
      <Card sx={{
        mb: 2.5,
        background: dark
          ? 'linear-gradient(135deg, #1a1040 0%, #0d1a38 50%, #0a1428 100%)'
          : 'linear-gradient(135deg, #6C63FF 0%, #4FACFE 100%)',
        border: 'none',
        position: 'relative', overflow: 'hidden',
        '&:hover': { transform: 'none' },
      }}>
        {/* Decorative blobs */}
        <Box sx={{ position:'absolute', right:-80, top:-80, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,110,250,0.25) 0%, transparent 70%)', pointerEvents:'none' }} />
        <Box sx={{ position:'absolute', left:-40, bottom:-60, width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />

        <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, position:'relative', zIndex:1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="caption" sx={{ color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600 }}>
                Net Monthly Balance
              </Typography>
              <Typography variant="h3" fontWeight={800} sx={{ color:'#fff', letterSpacing:'-0.03em', my:0.5 }}>
                {fmt(netBalance)}
              </Typography>
              <Box sx={{ display:'flex', alignItems:'center', gap:0.75 }}>
                {netBalance >= 0
                  ? <NorthRoundedIcon sx={{ fontSize:16, color:'#34D399' }} />
                  : <SouthRoundedIcon sx={{ fontSize:16, color:'#FB7185' }} />}
                <Typography variant="body2" sx={{ color: netBalance >= 0 ? '#34D399' : '#FB7185', fontWeight:600 }}>
                  {netBalance >= 0 ? 'Surplus' : 'Deficit'} this month
                </Typography>
                <Typography variant="body2" sx={{ color:'rgba(255,255,255,0.5)', ml:1 }}>
                  Projected: {fmt(projectedNet)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {[
                  { label:'Monthly Income',  val: totalIncome,   color:'#34D399', icon:'↑' },
                  { label:'Monthly Bills',   val: totalBills,    color:'#FCD34D', icon:'↓' },
                  { label:'Total Expenses',  val: totalExpenses, color:'#FB7185', icon:'↓' },
                  { label:'Savings / mo',    val: savings.monthly, color:'#93C5FD', icon:'→' },
                ].map(item => (
                  <Grid item xs={6} key={item.label}>
                    <Box sx={{ bgcolor:'rgba(255,255,255,0.08)', borderRadius:3, p:1.5, backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)' }}>
                      <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.6)', display:'block', mb:0.25 }}>{item.label}</Typography>
                      <Typography variant="body1" fontWeight={700} sx={{ color: item.color }}>
                        {item.icon} {fmt(item.val)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Spending progress */}
          <Box sx={{ mt: 2.5 }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.75 }}>
              <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.6)', fontWeight:600 }}>Monthly budget used</Typography>
              <Typography variant="caption" sx={{ color: spendPct > 90 ? '#FB7185' : spendPct > 70 ? '#FCD34D' : '#34D399', fontWeight:700 }}>{spendPct.toFixed(0)}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate" value={spendPct}
              sx={{
                height:6, borderRadius:99,
                bgcolor:'rgba(255,255,255,0.15)',
                '& .MuiLinearProgress-bar': {
                  background: spendPct > 90 ? '#F43F5E' : spendPct > 70 ? '#F59E0B' : '#10B981',
                  borderRadius: 99,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <Grid container spacing={2} mb={2.5}>
        <Grid item xs={6} lg={2.4}>
          <StatCard title="Monthly Income"    value={totalIncome}    subtitle={`${incomes.length} sources`}                   icon={<AccountBalanceWalletRoundedIcon />} color="#10B981" />
        </Grid>
        <Grid item xs={6} lg={2.4}>
          <StatCard title="Projected Income"  value={totalProjected} subtitle={`${projectedIncomes.length} expected`}          icon={<TrendingUpRoundedIcon />}           color="#7C6EFA" />
        </Grid>
        <Grid item xs={6} lg={2.4}>
          <StatCard title="Monthly Bills"     value={totalBills}     subtitle={`${bills.filter(b=>b.active).length} active`}   icon={<ReceiptLongRoundedIcon />}          color="#F59E0B" />
        </Grid>
        <Grid item xs={6} lg={2.4}>
          <StatCard title="Total Expenses"    value={totalExpenses}  subtitle={`${expenses.length} transactions`}              icon={<PaymentsRoundedIcon />}             color="#F43F5E" />
        </Grid>
        <Grid item xs={12} lg={2.4}>
          <StatCard title="Savings Balance"   value={savings.startingBalance} subtitle={`+${fmt(savings.monthly)}/mo`}         icon={<SavingsRoundedIcon />}              color="#F59E0B" />
        </Grid>
      </Grid>

      {/* Chart Carousel + Projected vs Spent */}
      <Grid container spacing={2} mb={2.5}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 360 }}>
            <CardContent sx={{ height:'100%', display:'flex', flexDirection:'column', p:2.5, '&:last-child':{pb:2.5} }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:1.5 }}>
                <Box>
                  <Typography variant="h6">{CHARTS[chartIdx].title}</Typography>
                  <Typography variant="caption" color="text.secondary">{CHARTS[chartIdx].sub}</Typography>
                </Box>
                <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                  {CHARTS.map((_, i) => (
                    <Box key={i} onClick={() => setChartIdx(i)} sx={{ width:7, height:7, borderRadius:'50%', cursor:'pointer', bgcolor: i===chartIdx ? 'primary.main' : 'divider', transition:'all 0.2s', '&:hover':{bgcolor:'primary.light'} }} />
                  ))}
                  <IconButton size="small" onClick={() => setChartIdx(i => (i-1+CHARTS.length)%CHARTS.length)} sx={{ ml:0.5 }}><ChevronLeftRoundedIcon sx={{ fontSize:18 }} /></IconButton>
                  <IconButton size="small" onClick={() => setChartIdx(i => (i+1)%CHARTS.length)}><ChevronRightRoundedIcon sx={{ fontSize:18 }} /></IconButton>
                </Box>
              </Box>
              <Box sx={{ flex:1 }}>
                <ResponsiveContainer width="100%" height="100%">{renderChart(chartIdx)}</ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: 360 }}>
            <CardContent sx={{ p:2.5, '&:last-child':{pb:2.5} }}>
              <Typography variant="h6" gutterBottom>This Month</Typography>
              <Box sx={{ display:'flex', flexDirection:'column', gap:1.5, mt:1 }}>
                {[
                  { label:'Projected Income', val: totalProjected,  color:'#7C6EFA', positive:true },
                  { label:'Fixed Bills',       val: -totalBills,    color:'#F59E0B', positive:false },
                  { label:'Expenses so far',   val: -thisMonthExp,  color:'#F43F5E', positive:false },
                ].map(row => (
                  <Box key={row.label}>
                    <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.5 }}>
                      <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: row.color }}>
                        {row.val >= 0 ? '+' : ''}{fmt(row.val)}
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={Math.min(Math.abs(row.val)/totalProjected*100, 100)||0}
                      sx={{ height:5, bgcolor:'divider', '& .MuiLinearProgress-bar':{ background: row.color } }} />
                  </Box>
                ))}
                <Divider sx={{ my:0.5 }} />
                <Box sx={{ bgcolor: projVsSpent>=0 ? alpha('#10B981',0.1) : alpha('#F43F5E',0.1), borderRadius:3, p:2, textAlign:'center', border:`1px solid ${projVsSpent>=0 ? alpha('#10B981',0.2) : alpha('#F43F5E',0.2)}` }}>
                  <Typography variant="caption" color="text.secondary">Rollover</Typography>
                  <Typography variant="h5" fontWeight={800} color={projVsSpent>=0?'success.main':'error.main'}>
                    {projVsSpent>=0?'+':''}{fmt(projVsSpent)}
                  </Typography>
                  <Typography variant="caption" color={projVsSpent>=0?'success.main':'error.main'}>
                    {projVsSpent>=0?'carries forward':'over budget'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rollover Table + Recent Transactions */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p:2.5,'&:last-child':{pb:2.5} }}>
              <Typography variant="h6" gutterBottom>6-Month Rollover</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Projected</TableCell>
                    <TableCell align="right">Spent</TableCell>
                    <TableCell align="right">Surplus</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rolloverWithBalance.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell><Typography variant="body2" fontWeight={500}>{row.month}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2" color="primary.main" fontWeight={600}>{fmt(row.Projected)}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2" color="error.main" fontWeight={600}>{fmt(row.Spent)}</Typography></TableCell>
                      <TableCell align="right">
                        <Chip label={`${row.Surplus>=0?'+':''}${fmt(row.Surplus)}`} size="small"
                          sx={{ bgcolor: row.Surplus>=0 ? alpha('#10B981',0.15) : alpha('#F43F5E',0.15), color: row.Surplus>=0 ? 'success.main' : 'error.main', fontWeight:700 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p:2.5,'&:last-child':{pb:2.5} }}>
              <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
              {recentExp.length === 0 ? (
                <Typography color="text.secondary" variant="body2" py={2}>No expenses recorded yet</Typography>
              ) : (
                <List disablePadding>
                  {recentExp.map((e, i) => {
                    const cfg = getCategoryConfig(e.category);
                    return (
                      <React.Fragment key={e.id}>
                        <ListItem disablePadding sx={{ py:1, gap:1.5 }}>
                          <Avatar sx={{ width:38, height:38, borderRadius:2.5, bgcolor: cfg.bg, fontSize:18, flexShrink:0 }}>
                            {cfg.emoji}
                          </Avatar>
                          <ListItemText
                            primary={<Typography variant="body2" fontWeight={600} noWrap>{e.description}</Typography>}
                            secondary={
                              <Box sx={{ display:'flex', gap:0.5, alignItems:'center', mt:0.25 }}>
                                <Chip label={e.category} size="small" sx={{ height:18, fontSize:'0.65rem', bgcolor: cfg.bg, color: cfg.color }} />
                                <Typography variant="caption" color="text.secondary">
                                  {e.date ? new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' }) : ''}
                                </Typography>
                              </Box>
                            }
                          />
                          <Typography variant="body2" fontWeight={700} color="error.main" sx={{ flexShrink:0 }}>
                            -{fmt(e.amount)}
                          </Typography>
                        </ListItem>
                        {i < recentExp.length-1 && <Divider sx={{ opacity:0.5 }} />}
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
