import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  List, ListItem, ListItemText, Chip, Divider, MenuItem, Tooltip,
  InputAdornment, Avatar, ToggleButton, ToggleButtonGroup, Stack,
  useTheme, useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import { useFinance, toMonthly } from '../context/FinanceContext';
import dayjs from 'dayjs';

const FREQUENCIES = ['One-time', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually'];
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

const EMPTY_FORM = {
  name: '', amount: '', frequency: 'Monthly',
  date: dayjs().format('YYYY-MM-DD'), notes: '',
  paycheckDays: [], paycheckDayOfMonth: '',
};

function PaycheckDaysPicker({ frequency, paycheckDays, paycheckDayOfMonth, onChange }) {
  if (frequency === 'Weekly' || frequency === 'Bi-weekly') {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
          Paycheck Day{frequency === 'Bi-weekly' ? 's' : ''}
        </Typography>
        <ToggleButtonGroup
          value={paycheckDays}
          onChange={(_, val) => onChange('paycheckDays', val)}
          size="small"
          sx={{ flexWrap: 'wrap', gap: 0.5 }}
        >
          {DAYS_OF_WEEK.map(d => (
            <ToggleButton key={d} value={d} sx={{ px: 1.5, py: 0.5, fontSize: 12 }}>{d}</ToggleButton>
          ))}
        </ToggleButtonGroup>
        {frequency === 'Bi-weekly' && paycheckDays.length > 0 && (
          <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
            Every other {paycheckDays.join(' & ')}
          </Typography>
        )}
      </Box>
    );
  }
  if (frequency === 'Monthly') {
    return (
      <TextField
        label="Paycheck Day of Month"
        type="number"
        value={paycheckDayOfMonth}
        onChange={e => onChange('paycheckDayOfMonth', e.target.value)}
        fullWidth
        inputProps={{ min: 1, max: 31 }}
        helperText="Day of month you get paid (e.g. 15, 30)"
      />
    );
  }
  return null;
}

function IncomeForm({ open, onClose, onSave, initial, title }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState(initial || EMPTY_FORM);
  React.useEffect(() => { setForm(initial || EMPTY_FORM); }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.amount && Number(form.amount) > 0;

  const showDayPicker = ['Weekly', 'Bi-weekly', 'Monthly'].includes(form.frequency);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Source Name" value={form.name} onChange={e => set('name', e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount (per paycheck)" value={form.amount} onChange={e => set('amount', e.target.value)}
              fullWidth required type="number" inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Frequency" value={form.frequency} onChange={e => set('frequency', e.target.value)} fullWidth>
              {FREQUENCIES.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </TextField>
          </Grid>
          {showDayPicker && (
            <Grid item xs={12}>
              <PaycheckDaysPicker
                frequency={form.frequency}
                paycheckDays={form.paycheckDays || []}
                paycheckDayOfMonth={form.paycheckDayOfMonth || ''}
                onChange={set}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField label="Start Date" type="date" value={form.date} onChange={e => set('date', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} fullWidth multiline rows={2} />
          </Grid>
          {form.amount && form.frequency && form.frequency !== 'One-time' && (
            <Grid item xs={12}>
              <Box sx={{ bgcolor: 'rgba(108,99,255,0.08)', borderRadius: 2, p: 1.5 }}>
                <Typography variant="caption" color="text.secondary">Monthly equivalent</Typography>
                <Typography variant="body1" fontWeight={700} color="primary.main">
                  {fmt(toMonthly(form.amount, form.frequency))} / month
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fmt(toMonthly(form.amount, form.frequency) * 12)} / year
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!valid} onClick={() => { onSave(form); onClose(); }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function IncomeList({ items, onEdit, onDelete, color, emptyText }) {
  if (items.length === 0) {
    return <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>{emptyText}</Typography>;
  }
  return (
    <List disablePadding>
      {items.map((item, i) => (
        <React.Fragment key={item.id}>
          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText
              primary={<Typography variant="body1" fontWeight={600}>{item.name}</Typography>}
              secondary={
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5, alignItems: 'center' }}>
                  <Chip label={item.frequency} size="small" variant="outlined" />
                  {item.paycheckDays?.length > 0 && (
                    <Chip label={`Every other ${item.paycheckDays.join('/')}`} size="small" variant="outlined" color="primary" />
                  )}
                  {item.paycheckDayOfMonth && (
                    <Chip label={`Day ${item.paycheckDayOfMonth}`} size="small" variant="outlined" color="primary" />
                  )}
                  {item.notes && <Typography variant="caption" color="text.secondary">{item.notes}</Typography>}
                </Box>
              }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 1 }}>
              <Typography variant="body2" fontWeight={700} color={color}>{fmt(item.amount)}</Typography>
              <Typography variant="caption" color="text.secondary">
                {fmt(toMonthly(item.amount, item.frequency))}/mo
              </Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => onEdit(item)}><EditIcon fontSize="small" /></IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => onDelete(item.id)}><DeleteIcon fontSize="small" /></IconButton>
              </Tooltip>
            </Box>
          </ListItem>
          {i < items.length - 1 && <Divider sx={{ opacity: 0.1 }} />}
        </React.Fragment>
      ))}
    </List>
  );
}

export default function Income() {
  const {
    incomes, addIncome, updateIncome, deleteIncome,
    projectedIncomes, addProjectedIncome, updateProjectedIncome, deleteProjectedIncome,
    totalIncome, totalProjected,
    savings, updateSavings,
  } = useFinance();

  const [dialog, setDialog] = useState(null);
  const [savingsForm, setSavingsForm] = useState({ monthly: savings.monthly, startingBalance: savings.startingBalance });

  React.useEffect(() => {
    setSavingsForm({ monthly: savings.monthly, startingBalance: savings.startingBalance });
  }, [savings]);

  function openAdd(type) { setDialog({ type, editing: null }); }
  function openEdit(type, item) { setDialog({ type, editing: item }); }
  function close() { setDialog(null); }

  function handleSave(form) {
    if (dialog.type === 'actual') {
      dialog.editing ? updateIncome(dialog.editing.id, form) : addIncome(form);
    } else {
      dialog.editing ? updateProjectedIncome(dialog.editing.id, form) : addProjectedIncome(form);
    }
  }

  const annualActual = incomes.reduce((s, i) => {
    const m = { 'Weekly': 52, 'Bi-weekly': 26, 'Monthly': 12, 'Quarterly': 4, 'Annually': 1, 'One-time': 1 };
    return s + Number(i.amount) * (m[i.frequency] || 1);
  }, 0);

  const annualProjected = projectedIncomes.reduce((s, i) => {
    const m = { 'Weekly': 52, 'Bi-weekly': 26, 'Monthly': 12, 'Quarterly': 4, 'Annually': 1, 'One-time': 1 };
    return s + Number(i.amount) * (m[i.frequency] || 1);
  }, 0);

  function saveSavings() {
    updateSavings({ monthly: Number(savingsForm.monthly) || 0, startingBalance: Number(savingsForm.startingBalance) || 0 });
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Income</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage your income sources and savings goals
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#43D9AD22', color: 'success.main' }}><AccountBalanceWalletIcon /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Monthly Income</Typography>
                  <Typography variant="h5" fontWeight={700} color="success.main">{fmt(totalIncome)}</Typography>
                  <Typography variant="caption" color="text.secondary">{fmt(annualActual)} / year</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#6C63FF22', color: 'primary.main' }}><TrendingUpIcon /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Projected Monthly</Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">{fmt(totalProjected)}</Typography>
                  <Typography variant="caption" color="text.secondary">{fmt(annualProjected)} / year</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#FFB54722', color: 'warning.main' }}><SavingsIcon /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Monthly Savings</Typography>
                  <Typography variant="h5" fontWeight={700} color="warning.main">{fmt(savings.monthly)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Balance: {fmt(savings.startingBalance)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Savings Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Savings Settings</Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Monthly Savings Contribution"
                type="number"
                value={savingsForm.monthly}
                onChange={e => setSavingsForm(f => ({ ...f, monthly: e.target.value }))}
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                helperText="How much you put into savings each month"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Current Savings Balance"
                type="number"
                value={savingsForm.startingBalance}
                onChange={e => setSavingsForm(f => ({ ...f, startingBalance: e.target.value }))}
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                helperText="What you already have saved"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" onClick={saveSavings} fullWidth sx={{ height: 40 }}>
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Income Lists */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Actual Income</Typography>
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => openAdd('actual')}>Add</Button>
              </Box>
              <IncomeList
                items={incomes}
                onEdit={item => openEdit('actual', item)}
                onDelete={deleteIncome}
                color="success.main"
                emptyText="No income sources yet. Click Add to get started."
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Projected Income</Typography>
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => openAdd('projected')}>Add</Button>
              </Box>
              <IncomeList
                items={projectedIncomes}
                onEdit={item => openEdit('projected', item)}
                onDelete={deleteProjectedIncome}
                color="primary.main"
                emptyText="No projected income yet. Click Add to get started."
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <IncomeForm
        open={!!dialog}
        onClose={close}
        onSave={handleSave}
        initial={dialog?.editing}
        title={dialog ? `${dialog.editing ? 'Edit' : 'Add'} ${dialog.type === 'actual' ? 'Actual' : 'Projected'} Income` : ''}
      />
    </Box>
  );
}
