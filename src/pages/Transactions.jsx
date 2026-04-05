import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Avatar, Chip, Divider,
  List, ListItem, ListItemText, IconButton, Tooltip, TextField,
  MenuItem, Select, FormControl, InputLabel, Button, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, alpha,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import NorthRoundedIcon from '@mui/icons-material/NorthRounded';
import SouthRoundedIcon from '@mui/icons-material/SouthRounded';

import { useFinance } from '../context/FinanceContext';
import { getCategoryConfig, ALL_CATEGORIES } from '../utils/categoryConfig';
import EmptyState from '../components/EmptyState';
import dayjs from 'dayjs';

const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

const EMPTY_EXP = { description:'', amount:'', category:'Food', date: dayjs().format('YYYY-MM-DD'), payee:'', notes:'' };

function AddExpenseDialog({ open, onClose, onSave, initial, categories }) {
  const [form, setForm] = useState(initial || EMPTY_EXP);
  React.useEffect(() => { setForm(initial || EMPTY_EXP); }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.description && form.amount && Number(form.amount) > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Transaction' : 'Add Expense'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Description" value={form.description} onChange={e => set('description', e.target.value)} fullWidth required size="small" />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Amount" value={form.amount} onChange={e => set('amount', e.target.value)} fullWidth required size="small" type="number"
              inputProps={{ min:0, step:0.01 }} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Date" type="date" value={form.date} onChange={e => set('date', e.target.value)} fullWidth size="small" InputLabelProps={{ shrink:true }} />
          </Grid>
          <Grid item xs={6}>
            <TextField select label="Category" value={form.category} onChange={e => set('category', e.target.value)} fullWidth size="small">
              {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Payee" value={form.payee} onChange={e => set('payee', e.target.value)} fullWidth size="small" />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} fullWidth size="small" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px:3, pb:2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!valid} onClick={() => { onSave(form); onClose(); }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function groupByDate(items) {
  const groups = {};
  items.forEach(item => {
    const date = item.date || item.createdAt?.slice(0,10) || '';
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return Object.entries(groups).sort(([a],[b]) => b.localeCompare(a));
}

function dateLabel(dateStr) {
  if (!dateStr) return 'Unknown Date';
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  const itemDay = new Date(d); itemDay.setHours(0,0,0,0);
  if (itemDay.getTime() === today.getTime())     return 'Today';
  if (itemDay.getTime() === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday:'short', month:'long', day:'numeric' });
}

export default function Transactions() {
  const { expenses, addExpense, updateExpense, deleteExpense, incomes, categories } = useFinance();
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [dialog, setDialog]       = useState(null);

  // Build unified transaction list
  const allTx = useMemo(() => [
    ...expenses.map(e => ({ ...e, txType: 'expense' })),
    ...incomes.map(i  => ({ ...i, txType: 'income', description: i.name, date: i.date || i.createdAt?.slice(0,10) })),
  ], [expenses, incomes]);

  const filtered = useMemo(() => {
    return allTx.filter(tx => {
      const matchSearch = !search || [tx.description, tx.payee, tx.notes, tx.category].some(f => f?.toLowerCase().includes(search.toLowerCase()));
      const matchCat  = filterCat  === 'All' || tx.category === filterCat;
      const matchType = filterType === 'All' || tx.txType   === filterType;
      return matchSearch && matchCat && matchType;
    }).sort((a,b) => {
      const da = a.date || a.createdAt || '';
      const db = b.date || b.createdAt || '';
      return db.localeCompare(da);
    });
  }, [allTx, search, filterCat, filterType]);

  const grouped = groupByDate(filtered);

  const totalFiltered = filtered.reduce((s, tx) => tx.txType === 'expense' ? s - Number(tx.amount) : s + Number(tx.amount), 0);

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3, flexWrap:'wrap', gap:1.5 }}>
        <Box>
          <Typography variant="h4">Transactions</Typography>
          <Typography variant="body2" color="text.secondary">{filtered.length} records · Net {fmt(totalFiltered)}</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialog({ editing: null })}>
          Add Expense
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb:2.5, '&:hover':{ transform:'none' } }}>
        <CardContent sx={{ p:2, '&:last-child':{pb:2} }}>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)}
                fullWidth size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize:18, color:'text.secondary' }} /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField select label="Category" value={filterCat} onChange={e => setFilterCat(e.target.value)} fullWidth size="small">
                <MenuItem value="All">All Categories</MenuItem>
                {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField select label="Type" value={filterType} onChange={e => setFilterType(e.target.value)} fullWidth size="small">
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button size="small" onClick={() => { setSearch(''); setFilterCat('All'); setFilterType('All'); }} fullWidth sx={{ height:40 }}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Transaction groups */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description={search || filterCat !== 'All' || filterType !== 'All' ? "Try adjusting your filters" : "Add your first expense to get started"}
          action={!search && filterCat === 'All' && filterType === 'All' ? "Add Expense" : undefined}
          onAction={() => setDialog({ editing: null })}
        />
      ) : (
        grouped.map(([date, txs]) => (
          <Box key={date} sx={{ mb:2 }}>
            <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:1 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform:'uppercase', letterSpacing:'0.08em' }}>
                {dateLabel(date)}
              </Typography>
              <Box sx={{ flex:1, height:1, bgcolor:'divider' }} />
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                {fmt(txs.reduce((s,tx) => tx.txType==='expense' ? s-Number(tx.amount) : s+Number(tx.amount), 0))}
              </Typography>
            </Box>
            <Card sx={{ '&:hover':{ transform:'none', boxShadow:'none' } }}>
              <List disablePadding>
                {txs.map((tx, i) => {
                  const cfg = getCategoryConfig(tx.category || (tx.txType==='income' ? 'Income' : 'Other'));
                  const isIncome = tx.txType === 'income';
                  return (
                    <React.Fragment key={tx.id}>
                      <ListItem
                        disablePadding
                        sx={{
                          px:2, py:1.25,
                          '&:hover .tx-actions': { opacity:1 },
                          '&:hover': { bgcolor: 'background.elevated' },
                          transition: 'background 0.15s',
                          gap: 1.5,
                        }}
                      >
                        <Avatar sx={{ width:40, height:40, borderRadius:3, bgcolor: cfg.bg, fontSize:18, flexShrink:0 }}>
                          {isIncome ? '💵' : cfg.emoji}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display:'flex', alignItems:'center', gap:0.75 }}>
                              <Typography variant="body2" fontWeight={600}>{tx.description}</Typography>
                              {tx.payee && <Typography variant="caption" color="text.secondary">· {tx.payee}</Typography>}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display:'flex', gap:0.5, alignItems:'center', mt:0.3 }}>
                              <Chip label={tx.category || (isIncome ? 'Income' : 'Other')} size="small"
                                sx={{ height:18, fontSize:'0.65rem', bgcolor: cfg.bg, color: cfg.color }} />
                              <Chip label={isIncome ? 'Income' : 'Expense'} size="small"
                                sx={{ height:18, fontSize:'0.65rem', bgcolor: isIncome ? alpha('#10B981',0.15) : alpha('#F43F5E',0.12), color: isIncome?'success.main':'error.main' }} />
                              {tx.notes && <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth:200 }}>{tx.notes}</Typography>}
                            </Box>
                          }
                        />
                        <Box className="tx-actions" sx={{ display:'flex', alignItems:'center', gap:0.5, opacity:0, transition:'opacity 0.15s', flexShrink:0 }}>
                          {!isIncome && (
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => setDialog({ editing: tx })}>
                                <EditRoundedIcon sx={{ fontSize:16 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => isIncome ? null : deleteExpense(tx.id)}>
                              <DeleteRoundedIcon sx={{ fontSize:16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box sx={{ textAlign:'right', flexShrink:0 }}>
                          <Typography variant="body2" fontWeight={700} color={isIncome ? 'success.main' : 'error.main'}>
                            {isIncome ? '+' : '-'}{fmt(tx.amount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tx.frequency || ''}
                          </Typography>
                        </Box>
                      </ListItem>
                      {i < txs.length-1 && <Divider sx={{ opacity:0.5, ml:7 }} />}
                    </React.Fragment>
                  );
                })}
              </List>
            </Card>
          </Box>
        ))
      )}

      <AddExpenseDialog
        open={!!dialog}
        onClose={() => setDialog(null)}
        onSave={form => { dialog?.editing ? updateExpense(dialog.editing.id, form) : addExpense(form); }}
        initial={dialog?.editing}
        categories={categories}
      />
    </Box>
  );
}
