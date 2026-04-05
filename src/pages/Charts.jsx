import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, LinearProgress,
  ToggleButtonGroup, ToggleButton, alpha,
} from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, ComposedChart, ReferenceLine,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { getCategoryConfig, ALL_CATEGORIES } from '../utils/categoryConfig';
import { useThemeMode } from '../context/ThemeContext';

const COLORS = ['#7C6EFA','#06B6D4','#10B981','#F59E0B','#F43F5E','#60A5FA','#A78BFA','#34D399','#FB923C','#E879F9'];
const fmt = v => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(v);
const fmtShort = v => v >= 1000 ? `$${(v/1000).toFixed(1)}k` : `$${v}`;

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor:'background.paper', border:'1px solid', borderColor:'divider', borderRadius:3, p:1.5, boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}>
      {label && <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{label}</Typography>}
      {payload.map((p,i) => (
        <Typography key={i} variant="body2" fontWeight={700} sx={{ color: p.color||p.fill }}>
          {p.name}: {fmt(p.value)}
        </Typography>
      ))}
    </Box>
  );
}

export default function Charts() {
  const { mode } = useThemeMode();
  const dark = mode === 'dark';
  const { expenses, incomes, bills, categories, totalIncome, totalBills, totalExpenses, savings, rolloverWithBalance } = useFinance();
  const [trendRange, setTrendRange] = useState('6');

  const axisProps = { tick:{ fill: dark ? '#6B7280':'#9CA3AF', fontSize:11 }, axisLine:false, tickLine:false };
  const gridProps = { strokeDasharray:'3 3', stroke: dark ? 'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)' };

  const now = new Date();
  const months = Number(trendRange);

  // ── Monthly income vs expenses trend ────────────────────────────────────
  const trend = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months-1-i), 1);
    return {
      month: d.toLocaleString('default', { month:'short', year: months > 6 ? '2-digit' : undefined }),
      Income: totalIncome,
      Expenses: expenses
        .filter(e => { const ed = new Date(e.date||e.createdAt); return ed.getMonth()===d.getMonth()&&ed.getFullYear()===d.getFullYear(); })
        .reduce((s,e) => s+Number(e.amount), 0),
    };
  });

  // ── Category breakdown ───────────────────────────────────────────────────
  const byCategory = ALL_CATEGORIES
    .map(cat => ({ name:cat, value: expenses.filter(e=>e.category===cat).reduce((s,e)=>s+Number(e.amount),0) }))
    .filter(c => c.value > 0)
    .sort((a,b) => b.value-a.value);

  const totalCatSpend = byCategory.reduce((s,c) => s+c.value, 0);

  // ── Budget bars ──────────────────────────────────────────────────────────
  // Simple budget: assume each category budget = equal share of (income - bills)
  const available = Math.max(0, totalIncome - totalBills);
  const perCatBudget = byCategory.length ? available / byCategory.length : 0;

  // ── Savings growth ───────────────────────────────────────────────────────
  const savingsGrowth = Array.from({ length: 13 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth()+i, 1);
    return {
      month: d.toLocaleString('default', { month:'short', year:'2-digit' }),
      Balance: savings.startingBalance + (savings.monthly + Math.max(0, totalIncome-totalBills-totalExpenses)) * i,
      Savings: savings.startingBalance + savings.monthly * i,
    };
  });

  // ── Income vs bills vs expenses overview bar ─────────────────────────────
  const overview = [
    { name: 'Income',   value: totalIncome },
    { name: 'Bills',    value: totalBills },
    { name: 'Expenses', value: totalExpenses },
    { name: 'Net',      value: Math.max(0, totalIncome-totalBills-totalExpenses) },
  ];

  // ── Radar: spending across categories ───────────────────────────────────
  const radarData = byCategory.slice(0,7).map(c => ({
    category: c.name.length > 8 ? c.name.slice(0,8)+'…' : c.name,
    Spent: c.value,
    Budget: perCatBudget,
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Charts & Analytics</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Visual breakdown of your financial data</Typography>

      <Grid container spacing={2.5}>
        {/* Trend chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: { xs: 300, md: 380 } }}>
            <CardContent sx={{ height:'100%', display:'flex', flexDirection:'column', p:2.5,'&:last-child':{pb:2.5} }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:1, mb:2 }}>
                <Box>
                  <Typography variant="h6">Income vs Expenses</Typography>
                  <Typography variant="caption" color="text.secondary">Monthly comparison over time</Typography>
                </Box>
                <ToggleButtonGroup value={trendRange} exclusive onChange={(_,v)=>v&&setTrendRange(v)} size="small">
                  {['3','6','12'].map(v => <ToggleButton key={v} value={v}>{v}M</ToggleButton>)}
                </ToggleButtonGroup>
              </Box>
              <Box sx={{ flex:1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top:5, right:5, left:0, bottom:5 }}>
                    <defs>
                      <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/><stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...gridProps}/>
                    <XAxis dataKey="month" {...axisProps}/>
                    <YAxis {...axisProps} tickFormatter={fmtShort}/>
                    <ReTooltip content={<ChartTip />}/>
                    <Legend wrapperStyle={{ fontSize:12 }}/>
                    <Area type="monotone" dataKey="Income"   stroke="#10B981" fill="url(#gI)" strokeWidth={2.5} dot={{ r:4, fill:'#10B981' }}/>
                    <Area type="monotone" dataKey="Expenses" stroke="#F43F5E" fill="url(#gE)" strokeWidth={2.5} dot={{ r:4, fill:'#F43F5E' }}/>
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category donut */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: { xs: 300, md: 380 } }}>
            <CardContent sx={{ height:'100%', display:'flex', flexDirection:'column', p:2.5,'&:last-child':{pb:2.5} }}>
              <Typography variant="h6" gutterBottom>Spending by Category</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>{fmt(totalCatSpend)} total</Typography>
              {byCategory.length === 0 ? (
                <Box sx={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Typography color="text.secondary" variant="body2">No expenses yet</Typography>
                </Box>
              ) : (
                <Box sx={{ flex:1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={byCategory} cx="50%" cy="45%" innerRadius="38%" outerRadius="62%" paddingAngle={3} dataKey="value">
                        {byCategory.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                      </Pie>
                      <ReTooltip content={<ChartTip />}/>
                      <Legend iconSize={10} wrapperStyle={{ fontSize:11 }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Budget Progress Bars */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p:2.5,'&:last-child':{pb:2.5} }}>
              <Typography variant="h6" gutterBottom>Budget Utilization</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                {fmt(available)} available after bills
              </Typography>
              {byCategory.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No expenses to show</Typography>
              ) : (
                <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {byCategory.slice(0,7).map((cat, i) => {
                    const cfg = getCategoryConfig(cat.name);
                    const pct = perCatBudget > 0 ? Math.min((cat.value / perCatBudget) * 100, 100) : 0;
                    const over = cat.value > perCatBudget;
                    return (
                      <Box key={cat.name}>
                        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:0.5 }}>
                          <Box sx={{ display:'flex', alignItems:'center', gap:0.75 }}>
                            <Typography sx={{ fontSize:14 }}>{cfg.emoji}</Typography>
                            <Typography variant="body2" fontWeight={600}>{cat.name}</Typography>
                          </Box>
                          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                            <Typography variant="caption" fontWeight={700} color={over ? 'error.main' : 'text.secondary'}>
                              {fmt(cat.value)}
                            </Typography>
                            {over && <Chip label="Over" size="small" color="error" sx={{ height:16, fontSize:'0.6rem' }}/>}
                          </Box>
                        </Box>
                        <LinearProgress variant="determinate" value={pct}
                          sx={{ height:6, bgcolor: alpha(cfg.color, 0.15), '& .MuiLinearProgress-bar':{ background: cfg.color } }}/>
                        <Typography variant="caption" color="text.secondary">
                          {pct.toFixed(0)}% of {fmt(perCatBudget)} budget
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Savings growth */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: { xs: 260, md: 320 } }}>
            <CardContent sx={{ height:'100%', display:'flex', flexDirection:'column', p:2.5,'&:last-child':{pb:2.5} }}>
              <Box sx={{ mb:1.5 }}>
                <Typography variant="h6">Savings Projection</Typography>
                <Typography variant="caption" color="text.secondary">12-month growth with contributions + net surplus</Typography>
              </Box>
              <Box sx={{ flex:1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={savingsGrowth} margin={{ top:5, right:5, left:0, bottom:5 }}>
                    <defs>
                      <linearGradient id="gSav2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C6EFA" stopOpacity={0.4}/><stop offset="95%" stopColor="#7C6EFA" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gSav3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/><stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...gridProps}/>
                    <XAxis dataKey="month" {...axisProps}/>
                    <YAxis {...axisProps} tickFormatter={fmtShort}/>
                    <ReTooltip content={<ChartTip />}/>
                    <Legend wrapperStyle={{ fontSize:12 }}/>
                    <Area type="monotone" dataKey="Balance" stroke="#7C6EFA" fill="url(#gSav2)" strokeWidth={2.5} dot={false} name="Total Balance"/>
                    <Area type="monotone" dataKey="Savings" stroke="#F59E0B" fill="url(#gSav3)" strokeWidth={2} dot={false} name="Savings Only" strokeDasharray="5 3"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Overview bar */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: { xs: 240, md: 300 } }}>
            <CardContent sx={{ height:'100%', display:'flex', flexDirection:'column', p:2.5,'&:last-child':{pb:2.5} }}>
              <Typography variant="h6" gutterBottom>Monthly Overview</Typography>
              <Box sx={{ flex:1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview} layout="vertical" margin={{ top:5, right:40, left:20, bottom:5 }}>
                    <CartesianGrid {...gridProps} horizontal={false}/>
                    <XAxis type="number" {...axisProps} tickFormatter={fmtShort}/>
                    <YAxis type="category" dataKey="name" {...axisProps} width={65}/>
                    <ReTooltip content={<ChartTip />}/>
                    <Bar dataKey="value" radius={[0,6,6,0]}>
                      {overview.map((_,i) => <Cell key={i} fill={COLORS[i]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Radar */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: { xs: 240, md: 300 } }}>
            <CardContent sx={{ height:'100%', display:'flex', flexDirection:'column', p:2.5,'&:last-child':{pb:2.5} }}>
              <Typography variant="h6" gutterBottom>Spending Radar</Typography>
              {radarData.length < 3 ? (
                <Box sx={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Typography color="text.secondary" variant="body2">Need at least 3 categories</Typography>
                </Box>
              ) : (
                <Box sx={{ flex:1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={dark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)'}/>
                      <PolarAngleAxis dataKey="category" tick={{ fill: dark?'#6B7280':'#9CA3AF', fontSize:10 }}/>
                      <Radar name="Spent"  dataKey="Spent"  stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.25}/>
                      <Radar name="Budget" dataKey="Budget" stroke="#7C6EFA" fill="#7C6EFA" fillOpacity={0.15}/>
                      <ReTooltip content={<ChartTip />}/>
                      <Legend wrapperStyle={{ fontSize:11 }}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
