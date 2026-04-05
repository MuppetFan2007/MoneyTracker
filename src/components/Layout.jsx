import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, Avatar, Tooltip, Divider,
  InputBase, Badge, useMediaQuery, useTheme, alpha,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { useThemeMode } from '../context/ThemeContext';

const DRAWER_FULL = 250;
const DRAWER_MINI = 72;

const NAV = [
  { label: 'Dashboard',    icon: <DashboardRoundedIcon />,             value: 'dashboard'    },
  { label: 'Transactions', icon: <SwapHorizRoundedIcon />,             value: 'transactions' },
  { label: 'Income',       icon: <AccountBalanceWalletRoundedIcon />,  value: 'income'       },
  { label: 'Bills',        icon: <ReceiptLongRoundedIcon />,           value: 'bills'        },
  { label: 'Charts',       icon: <BarChartRoundedIcon />,              value: 'charts'       },
];

export default function Layout({ page, setPage, children }) {
  const muiTheme = useTheme();
  const { mode, toggle } = useThemeMode();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mini, setMini]           = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dark = mode === 'dark';
  const drawerW = mini && !isMobile ? DRAWER_MINI : DRAWER_FULL;

  const sidebarContent = (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      bgcolor: dark ? '#0F1119' : '#FAFBFF',
      borderRight: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 64 }}>
        <Avatar sx={{
          width: 36, height: 36, flexShrink: 0,
          background: 'linear-gradient(135deg, #7C6EFA 0%, #5B4EF5 100%)',
          boxShadow: '0 4px 14px rgba(124,110,250,0.4)',
        }}>
          <TrendingUpRoundedIcon sx={{ fontSize: 20 }} />
        </Avatar>
        {!mini && (
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{
              background: 'linear-gradient(135deg, #7C6EFA, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}>
              MoneyTracker
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
              Personal Finance
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ opacity: 0.5 }} />

      {/* Nav */}
      <List sx={{ flex: 1, px: 1.5, pt: 1.5 }}>
        {NAV.map(item => {
          const active = page === item.value;
          return (
            <ListItem key={item.value} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={mini ? item.label : ''} placement="right">
                <ListItemButton
                  onClick={() => { setPage(item.value); setMobileOpen(false); }}
                  sx={{
                    borderRadius: 3,
                    minHeight: 44,
                    px: mini ? 1.5 : 2,
                    justifyContent: mini ? 'center' : 'flex-start',
                    position: 'relative',
                    background: active
                      ? 'linear-gradient(135deg, rgba(124,110,250,0.18) 0%, rgba(91,78,245,0.12) 100%)'
                      : 'transparent',
                    '&::before': active ? {
                      content: '""', position: 'absolute', left: 0, top: '20%', bottom: '20%',
                      width: 3, borderRadius: '0 3px 3px 0',
                      background: 'linear-gradient(180deg, #7C6EFA, #5B4EF5)',
                    } : {},
                    '&:hover': {
                      background: active
                        ? 'linear-gradient(135deg, rgba(124,110,250,0.22) 0%, rgba(91,78,245,0.16) 100%)'
                        : dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    },
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: mini ? 0 : 36,
                    color: active ? '#7C6EFA' : 'text.secondary',
                    '& svg': { fontSize: 20 },
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!mini && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: active ? 700 : 500,
                        fontSize: '0.875rem',
                        color: active ? '#7C6EFA' : 'text.primary',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ opacity: 0.5 }} />

      {/* Bottom */}
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, justifyContent: mini ? 'center' : 'space-between' }}>
        {!mini && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}>M</Avatar>
            <Box>
              <Typography variant="caption" fontWeight={600} display="block" sx={{ lineHeight: 1.2 }}>My Account</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Local Storage</Typography>
            </Box>
          </Box>
        )}
        <Tooltip title={dark ? 'Light mode' : 'Dark mode'} placement="right">
          <IconButton size="small" onClick={toggle} sx={{ color: 'text.secondary' }}>
            {dark ? <LightModeRoundedIcon sx={{ fontSize: 18 }} /> : <DarkModeRoundedIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box sx={{ width: drawerW, flexShrink: 0, transition: 'width 0.25s ease' }}>
          <Box sx={{ width: drawerW, height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1200, transition: 'width 0.25s ease' }}>
            {sidebarContent}
          </Box>
        </Box>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_FULL, border: 'none' } }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Header */}
        <Box sx={{
          height: 60, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 1.5,
          px: 2.5,
          bgcolor: dark ? alpha('#0F1119', 0.8) : alpha('#FFFFFF', 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          zIndex: 100,
        }}>
          {isMobile ? (
            <IconButton size="small" onClick={() => setMobileOpen(true)}>
              <MenuRoundedIcon />
            </IconButton>
          ) : (
            <Tooltip title={mini ? 'Expand sidebar' : 'Collapse sidebar'}>
              <IconButton size="small" onClick={() => setMini(m => !m)}>
                {mini ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
              </IconButton>
            </Tooltip>
          )}

          <Typography variant="h6" fontWeight={700} sx={{ mr: 'auto', display: { xs: 'block', md: 'none' } }}>
            {NAV.find(n => n.value === page)?.label || 'Dashboard'}
          </Typography>

          {/* Search */}
          <Box sx={{
            display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1,
            bgcolor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            borderRadius: 3, px: 1.5, py: 0.6,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            width: 240,
            '&:focus-within': { borderColor: '#7C6EFA', bgcolor: dark ? 'rgba(124,110,250,0.08)' : 'rgba(124,110,250,0.05)' },
            transition: 'all 0.2s',
          }}>
            <SearchRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <InputBase placeholder="Quick search…" sx={{ fontSize: '0.85rem', flex: 1 }} />
          </Box>

          {/* Page title (desktop) */}
          <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            {NAV.find(n => n.value === page)?.label || 'Dashboard'}
          </Typography>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
