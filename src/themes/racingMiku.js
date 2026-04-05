import { createTheme, alpha } from '@mui/material/styles';

// ═══════════════════════════════════════════════════════════════
//  RACING MIKU — 39 ♪  Speed · Teal · Cyan · Neon
//  Inspired by Good Smile Racing × Hatsune Miku
// ═══════════════════════════════════════════════════════════════

export const racingMiku = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#00E5FF', light: '#80F3FF', dark: '#00B2CC', contrastText: '#001318' },
    secondary: { main: '#FF1E8E', light: '#FF70BC', dark: '#C4006A', contrastText: '#fff' },
    success:   { main: '#00FF9F', light: '#66FFB8', dark: '#00CC7D', contrastText: '#001A0D' },
    warning:   { main: '#FFCC00', light: '#FFE066', dark: '#CC9900', contrastText: '#1a1200' },
    error:     { main: '#FF2D55', light: '#FF7087', dark: '#CC001A', contrastText: '#fff' },
    background: {
      default:  '#000C0F',
      paper:    '#001318',
      elevated: '#001F28',
    },
    divider: 'rgba(0,229,255,0.15)',
    text: {
      primary:   '#CCFEFF',
      secondary: '#3DC8D8',
      disabled:  '#155566',
    },
  },

  typography: {
    fontFamily: '"Rajdhani", "Barlow Condensed", "Inter", sans-serif',
    h3: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.10em' },
    h4: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' },
    h5: { fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' },
    h6: { fontWeight: 700, letterSpacing: '0.04em' },
    subtitle1: { fontWeight: 600, letterSpacing: '0.02em' },
    caption: { letterSpacing: '0.10em', fontWeight: 700, textTransform: 'uppercase' },
    button: { fontWeight: 700, letterSpacing: '0.12em' },
  },

  shape: { borderRadius: 4 }, // angular / racing style

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');

        @keyframes miku-pulse-border {
          0%,100% { box-shadow: 0 0 6px rgba(0,229,255,0.25), inset 0 0 6px rgba(0,229,255,0.05); }
          50%      { box-shadow: 0 0 18px rgba(0,229,255,0.55), inset 0 0 12px rgba(0,229,255,0.08); }
        }
        @keyframes speed-lines {
          0%   { background-position: 0 0; }
          100% { background-position: 80px 0; }
        }
        @keyframes miku-scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        html, body {
          background-image:
            repeating-linear-gradient(
              -55deg,
              transparent,
              transparent 18px,
              rgba(0,229,255,0.018) 18px,
              rgba(0,229,255,0.018) 19px
            );
        }

        /* Neon scrollbar */
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: #000C0F; }
        ::-webkit-scrollbar-thumb { background: #00E5FF; border-radius: 0; }

        /* Headings get a left accent bar */
        h4, h5, h6 {
          position: relative;
        }

        /* Table rows pop on hover */
        .MuiTableRow-root:hover td {
          color: #00E5FF !important;
          transition: color 0.15s;
        }
      `,
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#001318',
          border: '1px solid rgba(0,229,255,0.15)',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          // Racing stripe accent top
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #00E5FF 40%, #FF1E8E 60%, transparent 100%)',
            opacity: 0.7,
          },
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 0 24px rgba(0,229,255,0.3), 0 12px 40px rgba(0,0,0,0.7)',
            borderColor: 'rgba(0,229,255,0.45)',
          },
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.12em',
          borderRadius: 2,
          fontFamily: '"Rajdhani", sans-serif',
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #00B2CC 0%, #00E5FF 50%, #00B2CC 100%)',
          backgroundSize: '200% 100%',
          color: '#000C0F',
          transition: 'background-position 0.3s ease, box-shadow 0.2s ease',
          '&:hover': {
            backgroundPosition: 'right center',
            boxShadow: '0 0 24px rgba(0,229,255,0.6)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(90deg, #C4006A, #FF1E8E, #C4006A)',
          backgroundSize: '200% 100%',
          '&:hover': { backgroundPosition: 'right center', boxShadow: '0 0 24px rgba(255,30,142,0.5)' },
        },
        outlined: {
          borderColor: 'rgba(0,229,255,0.4)',
          color: '#00E5FF',
          '&:hover': { borderColor: '#00E5FF', backgroundColor: 'rgba(0,229,255,0.08)', boxShadow: '0 0 12px rgba(0,229,255,0.25)' },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          color: '#3DC8D8',
          '&:hover': { backgroundColor: 'rgba(0,229,255,0.1)', color: '#00E5FF' },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontFamily: '"Rajdhani", sans-serif',
        },
        colorPrimary: {
          backgroundColor: 'rgba(0,229,255,0.15)',
          color: '#00E5FF',
          border: '1px solid rgba(0,229,255,0.3)',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          height: 5,
          backgroundColor: 'rgba(0,229,255,0.08)',
        },
        bar: {
          borderRadius: 0,
          background: 'linear-gradient(90deg, #00B2CC 0%, #00E5FF 50%, #FF1E8E 100%)',
        },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            fontFamily: '"Rajdhani", sans-serif',
            '& fieldset': { borderColor: 'rgba(0,229,255,0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(0,229,255,0.5)', boxShadow: '0 0 8px rgba(0,229,255,0.1)' },
            '&.Mui-focused fieldset': { borderColor: '#00E5FF', boxShadow: '0 0 12px rgba(0,229,255,0.3)' },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#001318',
          borderRadius: 4,
          border: '1px solid rgba(0,229,255,0.25)',
          boxShadow: '0 0 40px rgba(0,229,255,0.15)',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          color: '#3DC8D8',
          borderBottomColor: 'rgba(0,229,255,0.15)',
        },
        root: { borderBottomColor: 'rgba(0,229,255,0.07)' },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.06em',
          borderRadius: '3px !important',
          border: '1px solid rgba(0,229,255,0.2) !important',
          color: '#3DC8D8',
          '&.Mui-selected': {
            backgroundColor: 'rgba(0,229,255,0.15)',
            color: '#00E5FF',
            borderColor: 'rgba(0,229,255,0.5) !important',
            boxShadow: '0 0 10px rgba(0,229,255,0.2)',
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(0,229,255,0.10)' },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: { borderRadius: 3 },
      },
    },
  },
});
