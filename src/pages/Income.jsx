import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  List, ListItem, ListItemText, Chip, Divider, MenuItem, Tooltip,
  InputAdornment, ToggleButtonGroup, ToggleButton, Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useFinance } from '../context/FinanceContext';
import dayjs from 'dayjs';

const FREQUENCIES = ['One-time', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually'];
const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

const EMPTY_FORM = { name: '', amount: '', frequency: 'Monthly', date: dayjs().format('YYYY-MM-DD'), notes: '' };

function IncomeForm({ open, onClose, onSave, initial, title }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  React.useEffect(() => { setForm(initial || EMPTY_FORM); }, [initial, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.amount && Number(form.amount) > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Source Name" value={form.name} onChange={e => set('name', e.target.value)} fullWidth required />
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
          <Grid item xs={12}>
            <TextField label="Date" type="date" value={form.date} onChange={e => set('date', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
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
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  <Chip label={item.frequency} size="small" variant="outlined" />
                  {item.date && <Chip label={new Date(item.date).toLocaleDateString()} size="small" variant="outlined" />}
                  {item.notes && <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>{item.notes}</Typography>}
                </Box>
              }
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" fontWeight={700} color={color}>{fmt(item.amount)}</Typography>
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
  } = useFinance();

  const [dialog, setDialog] = useState(null); // { type: 'actual'|'projected', editing: null|item }

  function openAdd(type) { setDialog({ type, editing: null }); }
  function openEdit(type, item) { setDialog({ type, editing: item }); }
  function close() { setDialog(null); }

  function handleSave(form) {
    if (dialog.type === 'actual') {
      if (dialog.editing) updateIncome(dialog.editing.id, form);
      else addIncome(form);
    } else {
      if (dialog.editing) updateProjectedIncome(dialog.editing.id, form);
      else addProjectedIncome(form);
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Income</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage your actual and projected income sources
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#43D9AD22', color: 'success.main' }}><AccountBalanceWalletIcon /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Actual Income</Typography>
                  <Typography variant="h5" fontWeight={700} color="success.main">{fmt(totalIncome)}</Typography>
                  <Typography variant="caption" color="text.secondary">{fmt(annualActual)} / year</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#6C63FF22', color: 'primary.main' }}><TrendingUpIcon /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Projected Income</Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">{fmt(totalProjected)}</Typography>
                  <Typography variant="caption" color="text.secondary">{fmt(annualProjected)} / year</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Actual Income</Typography>
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => openAdd('actual')}>
                  Add
                </Button>
              </Box>
              <IncomeList
                items={incomes}
                onEdit={item => openEdit('actual', item)}
                onDelete={deleteIncome}
                color="success.main"
                emptyText="No income sources added yet. Click Add to get started."
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Projected Income</Typography>
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => openAdd('projected')}>
                  Add
                </Button>
              </Box>
              <IncomeList
                items={projectedIncomes}
                onEdit={item => openEdit('projected', item)}
                onDelete={deleteProjectedIncome}
                color="primary.main"
                emptyText="No projected income added yet. Click Add to get started."
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
