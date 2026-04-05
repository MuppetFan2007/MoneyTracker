import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  List, ListItem, ListItemText, Chip, Divider, MenuItem, Tooltip,
  InputAdornment, Switch, FormControlLabel, Avatar, LinearProgress,
  useTheme, useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { PieChart, Pie, Cell, Tooltip as ReTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import dayjs from 'dayjs';

const FREQUENCIES = ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually'];
const BILL_CATEGORIES = ['Housing', 'Utilities', 'Insurance', 'Subscriptions', 'Loans', 'Phone', 'Internet', 'Transportation', 'Other'];
const COLORS = ['#6C63FF', '#FF6584', '#43D9AD', '#FFB547', '#FF5252', '#64B5F6', '#A5D6A7', '#FFF176', '#CE93D8'];
const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

const EMPTY = { name: '', amount: '', frequency: 'Monthly', dueDay: '', category: 'Other', notes: '' };

function BillForm({ open, onClose, onSave, initial }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState(initial || EMPTY);
  React.useEffect(() => { setForm(initial || EMPTY); }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.amount && Number(form.amount) > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>{initial ? 'Edit Bill' : 'Add Bill'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Bill Name" value={form.name} onChange={e => set('name', e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount" value={form.amount} onChange={e => set('amount', e.target.value)}
              fullWidth required type="number" inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Frequency" value={form.frequency} onChange={e => set('frequency', e.target.value)} fullWidth>
              {FREQUENCIES.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Category" value={form.category} onChange={e => set('category', e.target.value)} fullWidth>
              {BILL_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Day of Month" value={form.dueDay} onChange={e => set('dueDay', e.target.value)}
              fullWidth type="number" inputProps={{ min: 1, max: 31 }}
              helperText="1–31, leave blank if varies"
            />
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

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 1.5 }}>
      <Typography variant="body2" fontWeight={600}>{payload[0].name}: {fmt(payload[0].value)}</Typography>
    </Box>
  );
}

export default function Bills() {
  const { bills, addBill, updateBill, deleteBill, toggleBill, totalBills, totalIncome } = useFinance();
  const [dialog, setDialog] = useState(null); // null | { editing: null | bill }

  const activeBills = bills.filter(b => b.active);
  const pieData = activeBills.map(b => ({ name: b.name, value: Number(b.amount) }));

  const billRatio = totalIncome > 0 ? (totalBills / totalIncome) * 100 : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Bills</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage your recurring static bills
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#FFB54722', color: 'warning.main' }}><ReceiptLongIcon /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Monthly Bills Total</Typography>
                  <Typography variant="h5" fontWeight={700} color="warning.main">{fmt(totalBills)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>Bills vs Income</Typography>
              <Typography variant="h6" fontWeight={700} color={billRatio > 50 ? 'error.main' : 'text.primary'}>
                {billRatio.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(billRatio, 100)}
                color={billRatio > 50 ? 'error' : billRatio > 30 ? 'warning' : 'success'}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" color="text.secondary">of your income</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Active / Total Bills</Typography>
              <Typography variant="h5" fontWeight={700}>
                {activeBills.length} <Typography component="span" color="text.secondary">/ {bills.length}</Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {fmt(bills.filter(b => !b.active).reduce((s, b) => s + Number(b.amount), 0))} paused
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Bills</Typography>
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setDialog({ editing: null })}>
                  Add Bill
                </Button>
              </Box>
              {bills.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No bills added yet. Click Add Bill to start.</Typography>
              ) : (
                <List disablePadding>
                  {bills.map((bill, i) => (
                    <React.Fragment key={bill.id}>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <Box sx={{ mr: 1 }}>
                          <Switch size="small" checked={bill.active} onChange={() => toggleBill(bill.id)} color="success" />
                        </Box>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontWeight={600} sx={{ opacity: bill.active ? 1 : 0.5 }}>
                                {bill.name}
                              </Typography>
                              {!bill.active && <Chip label="Paused" size="small" color="default" />}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                              <Chip label={bill.category || 'Other'} size="small" variant="outlined" />
                              <Chip label={bill.frequency} size="small" variant="outlined" />
                              {bill.dueDay && <Chip label={`Due day ${bill.dueDay}`} size="small" variant="outlined" />}
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.25 }}>
                          <Typography variant="body2" fontWeight={700} color={bill.active ? 'warning.main' : 'text.disabled'}>
                            {fmt(bill.amount)}
                          </Typography>
                          <Box sx={{ display: 'flex' }}>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => setDialog({ editing: bill })}><EditIcon fontSize="small" /></IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => deleteBill(bill.id)}><DeleteIcon fontSize="small" /></IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </ListItem>
                      {i < bills.length - 1 && <Divider sx={{ opacity: 0.1 }} />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: { xs: 280, md: 380 } }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>Bill Breakdown</Typography>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <ReTooltip content={<CustomTooltip />} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                  <Typography color="text.secondary" variant="body2">No active bills to display</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <BillForm
        open={!!dialog}
        onClose={() => setDialog(null)}
        onSave={form => {
          if (dialog?.editing) updateBill(dialog.editing.id, form);
          else addBill(form);
        }}
        initial={dialog?.editing}
      />
    </Box>
  );
}
