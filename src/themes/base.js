import { createTheme, alpha } from '@mui/material/styles';

export function buildTheme(mode) {
  const dark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary:    { main: '#7C6EFA', light: '#A89BFB', dark: '#5B4EF5', contrastText: '#fff' },
      secondary:  { main: '#06B6D4', light: '#22D3EE', dark: '#0891B2', contrastText: '#fff' },
      success:    { main: '#10B981', light: '#34D399', dark: '#059669' },
      warning:    { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
      error:      { main: '#F43F5E', light: '#FB7185', dark: '#E11D48' },
      info:       { main: '#60A5FA', light: '#93C5FD', dark: '#3B82F6' },
      background: {
        default:  dark ? '#0C0E14' : '#F0F2F8',
        paper:    dark ? '#13151E' : '#FFFFFF',
        elevated: dark ? '#1C1F2E' : '#F8F9FC',
      },
      divider: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
      text: {
        primary:   dark ? '#E8EAF6' : '#1A1D2E',
        secondary: dark ? '#6B7280' : '#6B7280',
        disabled:  dark ? '#374151' : '#D1D5DB',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h3: { fontWeight: 800, letterSpacing: '-0.025em' },
      h4: { fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      body1: { fontSize: '0.9375rem' },
      body2: { fontSize: '0.875rem' },
      caption: { fontSize: '0.75rem', letterSpacing: '0.02em' },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': { boxSizing: 'border-box' },
          '::-webkit-scrollbar': { width: 6, height: 6 },
          '::-webkit-scrollbar-track': { background: 'transparent' },
          '::-webkit-scrollbar-thumb': {
            background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
            borderRadius: 99,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(0,0,0,0.1)',
              borderColor: dark ? 'rgba(124,110,250,0.3)' : 'rgba(124,110,250,0.2)',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 10, letterSpacing: 0 },
          containedPrimary: {
            background: 'linear-gradient(135deg, #7C6EFA 0%, #5B4EF5 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #9D91FB 0%, #7C73FF 100%)' },
          },
          outlined: {
            borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
            '&:hover': { borderColor: '#7C6EFA', color: '#7C6EFA', backgroundColor: alpha('#7C6EFA', 0.08) },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            '&:hover': { backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 8 },
          sizeSmall: { fontSize: '0.7rem' },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '& fieldset': { borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' },
              '&:hover fieldset': { borderColor: '#7C6EFA' },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            borderRadius: 20,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: { root: { fontWeight: 700, fontSize: '1.1rem' } },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 99, backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
          bar: { borderRadius: 99 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? '#6B7280' : '#9CA3AF' },
          root: { borderBottomColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none', fontWeight: 600, borderRadius: '8px !important',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important`,
            '&.Mui-selected': { backgroundColor: alpha('#7C6EFA', 0.2), color: '#7C6EFA', borderColor: `${alpha('#7C6EFA', 0.4)} !important` },
          },
        },
      },
    },
  });
}
