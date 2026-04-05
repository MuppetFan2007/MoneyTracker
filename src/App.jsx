import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { ThemeContextProvider, useThemeMode } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import { buildTheme } from './theme';
import Layout from './components/Layout';

import Dashboard    from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Income       from './pages/Income';
import Bills        from './pages/Bills';
import Charts       from './pages/Charts';

const PAGES = { dashboard: Dashboard, transactions: Transactions, income: Income, bills: Bills, charts: Charts };

function AppInner() {
  const [page, setPage] = useState('dashboard');
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
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

export default function App() {
  return (
    <ThemeContextProvider>
      <AppInner />
    </ThemeContextProvider>
  );
}
