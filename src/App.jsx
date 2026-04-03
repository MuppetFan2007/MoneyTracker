import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Bills from './pages/Bills';
import Expenses from './pages/Expenses';

const PAGES = {
  dashboard: Dashboard,
  income: Income,
  bills: Bills,
  expenses: Expenses,
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const Page = PAGES[page] || Dashboard;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FinanceProvider>
          <Layout page={page} setPage={setPage}>
            <Page />
          </Layout>
        </FinanceProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
