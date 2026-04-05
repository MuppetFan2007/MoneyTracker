import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, AppBar, Typography, IconButton, useMediaQuery, useTheme, Avatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import MenuIcon from '@mui/icons-material/Menu';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
  { label: 'Income', icon: <AccountBalanceWalletIcon />, value: 'income' },
  { label: 'Bills', icon: <ReceiptLongIcon />, value: 'bills' },
  { label: 'Expenses', icon: <PaymentsIcon />, value: 'expenses' },
];

export default function Layout({ page, setPage, children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
          <TrendingUpIcon fontSize="small" />
        </Avatar>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          MoneyTracker
        </Typography>
      </Box>
      <List sx={{ flex: 1, px: 1 }}>
        {NAV_ITEMS.map(item => (
          <ListItem key={item.value} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={page === item.value}
              onClick={() => { setPage(item.value); setMobileOpen(false); }}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: page === item.value ? 'white' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          All data stored locally
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', bgcolor: 'background.default', overflow: 'hidden' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: 'background.paper', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700} color="primary.main">MoneyTracker</Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none', borderRight: '1px solid rgba(255,255,255,0.06)' } }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 }, mt: { xs: 8, md: 0 }, overflow: 'auto', height: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
