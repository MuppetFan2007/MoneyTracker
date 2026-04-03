import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, MenuItem, Tooltip, InputAdornment, Avatar, Select, FormControl, InputLabel,
  TableSortLabel, Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentsIcon from '@mui/icons-material/Payments';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import dayjs from 'dayjs';

const COLORS = ['#6C63FF', '#FF6584', '#43D9AD', '#FFB547', '#FF5252', '#64B5F6', '#A5D6A7', '#FFF176', '#CE93D8', '#FFAB40', '#80CBC4'];
const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
const EMPTY = { description: '', amount: '', category: 'Other', date: dayjs().format('YYYY-MM-DD'), notes: '', payee: '' };

function ExpenseForm({ open, onClose, onSave, initial, categories }) {
  const [form, setForm] = useState(initial || EMPTY);
  React.useEffect(() => { setForm(initial || EMPTY); }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.description && form.amount && Number(form.amount) > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Description" value={form.description} onChange={e => set('description', e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount" value={form.amount} onChange={e => set('amount', e.target.value)}
              fullWidth required type="number" inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Date" type="date" value={form.date} onChange={e => set('date', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Category" value={form.category} onChange={e => set('category', e.target.value)} fullWidth>
              {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Payee (optional)" value={form.payee} onChange={e => set('payee', e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} fullWidth multiline rows={2} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!valid} onClick={() => { onSave(form); onClose(); }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 1.5 }}>
      {label && <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>}
      {payload.map((p, i) => (
        <Typography key={i} variant="body2" fontWeight={600} color={p.fill || 'text.primary'}>
          {p.name}: {fmt(p.value)}
        </Typography>
      ))}
    </Box>
  );
}

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense, totalExpenses, totalIncome, categories } = useFinance();
  const [dialog, setDialog] = useState(null);
  const [filterCat, setFilterCat] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = col => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let list = filterCat === 'All' ? expenses : expenses.filter(e => e.category === filterCat);
    return [...list].sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (sortBy === 'amount') { av = Number(av); bv = Number(bv); }
      if (sortBy === 'date') { av = new Date(av || a.createdAt); bv = new Date(bv || b.createdAt); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [expenses, filterCat, sortBy, sortDir]);

  const byCategory = categories.map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0),
  })).filter(c => c.value > 0);

  // Monthly bar
  const now = new Date();
  const monthlyBar = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      Amount: expenses
        .filter(e => { const ed = new Date(e.date || e.createdAt); return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear(); })
        .reduce((s, e) => s + Number(e.amount), 0),
    };
  });

  const catColors = {};
  byCategory.forEach((c, i) => { catColors[c.name] = COLORS[i % COLORS.length]; });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Expenses</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Track and manage all your spending
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#FF525222', color: 'error.main' }}><PaymentsIcon /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
                  <Typography variant="h5" fontWeight={700} color="error.main">{fmt(totalExpenses)}</Typography>
                  <Typography variant="caption" color="text.secondary">{expenses.length} transactions</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">This Month</Typography>
              <Typography variant="h5" fontWeight={700}>
                {fmt(expenses.filter(e => {
                  const d = new Date(e.date || e.createdAt);
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).reduce((s, e) => s + Number(e.amount), 0))}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {expenses.filter(e => { const d = new Date(e.date || e.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length} transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Top Category</Typography>
              {byCategory.length > 0 ? (
                <>
                  <Typography variant="h6" fontWeight={700}>{byCategory.sort((a, b) => b.value - a.value)[0].name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fmt(byCategory[0].value)} spent
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">No expenses yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: 280 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>Monthly Spending</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={monthlyBar} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9E9EBF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <ReTooltip content={<CustomTooltip />} />
                  <Bar dataKey="Amount" fill="#FF6584" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: 280 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>By Category</Typography>
              {byCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={byCategory} cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <ReTooltip content={<CustomTooltip />} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                  <Typography color="text.secondary" variant="body2">No data yet</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6">Transactions</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Category</InputLabel>
                <Select value={filterCat} label="Category" onChange={e => setFilterCat(e.target.value)}>
                  <MenuItem value="All">All Categories</MenuItem>
                  {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setDialog({ editing: null })}>
                Add Expense
              </Button>
            </Box>
          </Box>

          {filtered.length === 0 ? (
            <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>
              {expenses.length === 0 ? 'No expenses recorded yet. Click Add Expense to start.' : 'No expenses match the selected filter.'}
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel active={sortBy === 'description'} direction={sortBy === 'description' ? sortDir : 'asc'} onClick={() => handleSort('description')}>
                        Description
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Payee</TableCell>
                    <TableCell>
                      <TableSortLabel active={sortBy === 'date'} direction={sortBy === 'date' ? sortDir : 'asc'} onClick={() => handleSort('date')}>
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel active={sortBy === 'amount'} direction={sortBy === 'amount' ? sortDir : 'asc'} onClick={() => handleSort('amount')}>
                        Amount
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(expense => (
                    <TableRow key={expense.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{expense.description}</Typography>
                          {expense.notes && <Typography variant="caption" color="text.secondary">{expense.notes}</Typography>}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={expense.category || 'Other'}
                          size="small"
                          sx={{ bgcolor: `${catColors[expense.category] || '#6C63FF'}22`, color: catColors[expense.category] || '#6C63FF', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{expense.payee || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {expense.date ? new Date(expense.date).toLocaleDateString() : new Date(expense.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700} color="error.main">{fmt(expense.amount)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => setDialog({ editing: expense })}><EditIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => deleteExpense(expense.id)}><DeleteIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <ExpenseForm
        open={!!dialog}
        onClose={() => setDialog(null)}
        onSave={form => {
          if (dialog?.editing) updateExpense(dialog.editing.id, form);
          else addExpense(form);
        }}
        initial={dialog?.editing}
        categories={categories}
      />
    </Box>
  );
}
