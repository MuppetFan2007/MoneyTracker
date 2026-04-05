import { createTheme, alpha } from '@mui/material/styles';

// ═══════════════════════════════════════════════════════════════
//  BUNNY 🐰  — Kawaii · Pastel · Fluffy · Spring
//  Ultra-round · Soft pink · Lavender dreams
// ═══════════════════════════════════════════════════════════════

export const bunny = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#FF6BB5', light: '#FF9ECC', dark: '#E0448E', contrastText: '#fff' },
    secondary: { main: '#C77DFF', light: '#DBA6FF', dark: '#9B50DD', contrastText: '#fff' },
    success:   { main: '#5DC9A8', light: '#88D9BF', dark: '#3CA882', contrastText: '#fff' },
    warning:   { main: '#FFB347', light: '#FFC978', dark: '#E08A18', contrastText: '#fff' },
    error:     { main: '#FF7BAC', light: '#FFA0C2', dark: '#E04E82', contrastText: '#fff' },
    info:      { main: '#74C0FC', light: '#A5D5FD', dark: '#4BA3DA', contrastText: '#fff' },
    background: {
      default:  '#FFF0F7',
      paper:    '#FFFFFF',
      elevated: '#FFF7FC',
    },
    divider: 'rgba(255,107,181,0.15)',
    text: {
      primary:   '#3D2244',
      secondary: '#9A6FA8',
      disabled:  '#DBBDE8',
    },
  },

  typography: {
    fontFamily: '"Nunito", "Quicksand", "Inter", sans-serif',
    h3: { fontWeight: 900, letterSpacing: '-0.01em', color: '#3D2244' },
    h4: { fontWeight: 800, letterSpacing: '-0.01em' },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600, color: '#9A6FA8' },
    body1: { fontWeight: 500, fontSize: '0.9375rem' },
    body2: { fontWeight: 500 },
    caption: { fontWeight: 600, letterSpacing: '0.02em' },
    button: { fontWeight: 800, letterSpacing: '0.03em' },
  },

  shape: { borderRadius: 20 }, // VERY round — fluffy!

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

        @keyframes bunny-float {
          0%,100% { transform: translateY(0px) rotate(-3deg); }
          50%      { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes bunny-pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.12); }
          70%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes bunny-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bunny-heartbeat {
          0%,100% { transform: scale(1); }
          14%     { transform: scale(1.15); }
          28%     { transform: scale(1); }
          42%     { transform: scale(1.08); }
          70%     { transform: scale(1); }
        }
        @keyframes sparkle-spin {
          0%   { transform: rotate(0deg) scale(1); opacity: 1; }
          50%  { transform: rotate(180deg) scale(1.3); opacity: 0.7; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }

        html, body {
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255,107,181,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(199,125,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(93,201,168,0.04) 0%, transparent 60%);
        }

        /* Bubbly scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #FFF0F7; border-radius: 99px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #FF6BB5, #C77DFF); border-radius: 99px; }

        /* Sparkle on table row hover */
        .MuiTableRow-root:hover td {
          color: #FF6BB5 !important;
          transition: color 0.15s;
        }

        /* Input caret is pink */
        input { caret-color: #FF6BB5 !important; }

        /* Card hover: bounce pop */
        .MuiCard-root:hover {
          animation: bunny-pop 0.35s cubic-bezier(0.36,0.07,0.19,0.97) !important;
        }
      `,
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(255,107,181,0.15)',
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          boxShadow: '0 4px 20px rgba(255,107,181,0.08)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #FF6BB5 0%, #C77DFF 50%, #74C0FC 100%)',
            borderRadius: '20px 20px 0 0',
          },
          '&:hover': {
            transform: 'none',
            boxShadow: '0 8px 32px rgba(255,107,181,0.22)',
            borderColor: 'rgba(255,107,181,0.3)',
          },
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 800,
          borderRadius: 50, // pill shape!
          letterSpacing: '0.01em',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:active': { transform: 'scale(0.96)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6BB5 0%, #E0448E 100%)',
          boxShadow: '0 4px 15px rgba(255,107,181,0.4)',
          '&:hover': { boxShadow: '0 6px 20px rgba(255,107,181,0.55)', transform: 'translateY(-1px)' },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #C77DFF 0%, #9B50DD 100%)',
          boxShadow: '0 4px 15px rgba(199,125,255,0.4)',
          '&:hover': { boxShadow: '0 6px 20px rgba(199,125,255,0.55)', transform: 'translateY(-1px)' },
        },
        outlined: {
          borderColor: 'rgba(255,107,181,0.4)',
          borderWidth: 2,
          color: '#FF6BB5',
          borderRadius: 50,
          '&:hover': { borderColor: '#FF6BB5', backgroundColor: 'rgba(255,107,181,0.06)', borderWidth: 2 },
        },
        text: {
          color: '#9A6FA8',
          borderRadius: 50,
          '&:hover': { backgroundColor: 'rgba(255,107,181,0.08)', color: '#FF6BB5' },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          color: '#9A6FA8',
          transition: 'transform 0.15s ease, background 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,107,181,0.12)',
            color: '#FF6BB5',
            transform: 'scale(1.1)',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 99,
          fontWeight: 700,
          fontSize: '0.72rem',
          border: '1.5px solid transparent',
        },
        colorPrimary: {
          backgroundColor: 'rgba(255,107,181,0.12)',
          color: '#E0448E',
          border: '1.5px solid rgba(255,107,181,0.25)',
        },
        colorSuccess: {
          backgroundColor: 'rgba(93,201,168,0.12)',
          color: '#3CA882',
          border: '1.5px solid rgba(93,201,168,0.25)',
        },
        colorError: {
          backgroundColor: 'rgba(255,123,172,0.12)',
          color: '#E04E82',
          border: '1.5px solid rgba(255,123,172,0.25)',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 99,
          height: 8,
          backgroundColor: 'rgba(255,107,181,0.12)',
        },
        bar: {
          borderRadius: 99,
          background: 'linear-gradient(90deg, #FF6BB5 0%, #C77DFF 50%, #74C0FC 100%)',
          backgroundSize: '200% 100%',
          animation: 'bunny-shimmer 3s linear infinite',
        },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            '& fieldset': { borderColor: 'rgba(255,107,181,0.25)', borderWidth: 1.5 },
            '&:hover fieldset': { borderColor: 'rgba(255,107,181,0.5)', borderWidth: 1.5 },
            '&.Mui-focused fieldset': {
              borderColor: '#FF6BB5',
              boxShadow: '0 0 0 3px rgba(255,107,181,0.12)',
              borderWidth: 1.5,
            },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          borderRadius: 24,
          border: '2px solid rgba(255,107,181,0.2)',
          boxShadow: '0 20px 60px rgba(255,107,181,0.2)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          fontSize: '1.1rem',
          color: '#3D2244',
          borderBottom: '2px solid rgba(255,107,181,0.12)',
          '&::after': { content: '" 🐰"' },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 800,
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: '#9A6FA8',
          borderBottomColor: 'rgba(255,107,181,0.2)',
          borderBottomWidth: 2,
        },
        root: { borderBottomColor: 'rgba(255,107,181,0.1)' },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '99px !important',
          border: '2px solid rgba(255,107,181,0.2) !important',
          color: '#9A6FA8',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,107,181,0.12)',
            color: '#E0448E',
            borderColor: 'rgba(255,107,181,0.4) !important',
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,107,181,0.15)', borderWidth: 1.5 },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: { borderRadius: 14 },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px !important',
          '&:hover': { backgroundColor: 'rgba(255,107,181,0.07)' },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 20 },
      },
    },

    MuiSelect: {
      styleOverrides: {
        outlined: { borderRadius: 16 },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 16, border: '2px solid rgba(255,107,181,0.15)', boxShadow: '0 8px 32px rgba(255,107,181,0.15)' },
      },
    },
  },
});
