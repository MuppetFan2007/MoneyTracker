import { createTheme, alpha } from '@mui/material/styles';

// ═══════════════════════════════════════════════════════════════
//  NieR:AUTOMATA — YoRHa No.2 Type B
//  "Glory to Mankind."
//  Dark · Gold · Gothic · Terminal · Machine
// ═══════════════════════════════════════════════════════════════

export const nier = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#C8A84B', light: '#E2C97A', dark: '#9A7D2A', contrastText: '#0A0A0A' },
    secondary: { main: '#E8E5D7', light: '#F5F3EA', dark: '#B8B5A4', contrastText: '#0A0A0A' },
    success:   { main: '#8BB174', light: '#AECE9A', dark: '#618050', contrastText: '#0A0A0A' },
    warning:   { main: '#C8A84B', light: '#E2C97A', dark: '#9A7D2A', contrastText: '#0A0A0A' },
    error:     { main: '#CC3333', light: '#E06060', dark: '#991111', contrastText: '#fff' },
    background: {
      default:  '#080808',
      paper:    '#0F0F0F',
      elevated: '#181818',
    },
    divider: 'rgba(200,168,75,0.18)',
    text: {
      primary:   '#E8E5D7',
      secondary: '#8A8070',
      disabled:  '#3A3530',
    },
  },

  typography: {
    fontFamily: '"Share Tech Mono", "Courier New", monospace',
    h3: { fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: '"Share Tech Mono", monospace' },
    h4: { fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.20em' },
    h5: { fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.15em' },
    h6: { fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' },
    subtitle1: { letterSpacing: '0.08em', color: '#8A8070' },
    body1: { fontSize: '0.875rem', letterSpacing: '0.04em', lineHeight: 1.8 },
    body2: { fontSize: '0.8rem',   letterSpacing: '0.04em', lineHeight: 1.8 },
    caption: { letterSpacing: '0.12em', color: '#8A8070' },
    button: { letterSpacing: '0.18em', fontFamily: '"Share Tech Mono", monospace' },
  },

  shape: { borderRadius: 1 }, // almost no rounding — stark and angular

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        @keyframes nier-glitch-1 {
          0%,95%,100% { clip-path: none; transform: none; }
          96% { clip-path: polygon(0 15%, 100% 15%, 100% 30%, 0 30%); transform: translate(-3px, 0); }
          97% { clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%); transform: translate(3px, 0); }
          98% { clip-path: none; transform: none; }
          99% { clip-path: polygon(0 40%, 100% 40%, 100% 50%, 0 50%); transform: translate(-2px, 0); }
        }
        @keyframes nier-flicker {
          0%,100% { opacity: 1; }
          92%      { opacity: 1; }
          93%      { opacity: 0.4; }
          94%      { opacity: 1; }
          95%      { opacity: 0.7; }
          96%      { opacity: 1; }
        }
        @keyframes nier-scanline {
          0%   { background-position: 0 0; }
          100% { background-position: 0 8px; }
        }

        html, body {
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(200,168,75,0.012) 3px,
              rgba(200,168,75,0.012) 4px
            );
        }

        /* Scanline overlay on every card */
        .MuiCard-root::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.06) 2px,
            rgba(0,0,0,0.06) 4px
          );
          pointer-events: none;
          z-index: 0;
          border-radius: inherit;
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #C8A84B; border-radius: 0; }

        /* Terminal cursor blink on inputs */
        input { caret-color: #C8A84B !important; }

        .MuiTableRow-root:hover td {
          color: #C8A84B !important;
          transition: color 0.1s;
        }

        /* All text inputs look like terminals */
        .MuiInputBase-input::placeholder { color: #3A3530 !important; }
      `,
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0F0F0F',
          border: '1px solid rgba(200,168,75,0.18)',
          borderRadius: 1,
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          // Gold bottom accent bar
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, #C8A84B 40%, #E2C97A 60%, transparent 100%)',
            opacity: 0.6,
          },
          '&:hover': {
            transform: 'none',
            borderColor: 'rgba(200,168,75,0.5)',
            boxShadow: '0 0 20px rgba(200,168,75,0.1), inset 0 0 30px rgba(200,168,75,0.03)',
          },
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontFamily: '"Share Tech Mono", monospace',
          fontWeight: 400,
          letterSpacing: '0.18em',
          borderRadius: 1,
          transition: 'all 0.15s ease',
        },
        containedPrimary: {
          backgroundColor: '#C8A84B',
          color: '#0A0A0A',
          border: '1px solid #C8A84B',
          '&:hover': {
            backgroundColor: '#E2C97A',
            animation: 'nier-flicker 0.3s step-end',
            boxShadow: '0 0 15px rgba(200,168,75,0.3)',
          },
        },
        outlined: {
          borderColor: 'rgba(200,168,75,0.4)',
          color: '#C8A84B',
          '&::before': {
            content: '"[ "',
            color: 'rgba(200,168,75,0.5)',
          },
          '&::after': {
            content: '" ]"',
            color: 'rgba(200,168,75,0.5)',
          },
          '&:hover': { borderColor: '#C8A84B', backgroundColor: 'rgba(200,168,75,0.08)' },
        },
        text: {
          color: '#8A8070',
          '&:hover': { color: '#E8E5D7', backgroundColor: 'rgba(200,168,75,0.06)' },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 1,
          color: '#8A8070',
          '&:hover': { backgroundColor: 'rgba(200,168,75,0.1)', color: '#C8A84B' },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 1,
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
        colorPrimary: {
          backgroundColor: 'rgba(200,168,75,0.12)',
          color: '#C8A84B',
          border: '1px solid rgba(200,168,75,0.3)',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          height: 3,
          backgroundColor: 'rgba(200,168,75,0.08)',
          border: '1px solid rgba(200,168,75,0.12)',
        },
        bar: {
          borderRadius: 0,
          background: 'linear-gradient(90deg, #9A7D2A, #C8A84B, #E2C97A)',
        },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '0.85rem',
            '& fieldset': { borderColor: 'rgba(200,168,75,0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(200,168,75,0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#C8A84B' },
          },
          '& .MuiInputLabel-root': { fontFamily: '"Share Tech Mono", monospace', fontSize: '0.8rem', letterSpacing: '0.06em' },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#0F0F0F',
          borderRadius: 1,
          border: '1px solid rgba(200,168,75,0.35)',
          boxShadow: '0 0 40px rgba(200,168,75,0.08)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Share Tech Mono", monospace',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(200,168,75,0.18)',
          fontSize: '0.9rem',
          color: '#C8A84B',
          '&::before': { content: '">> "', opacity: 0.6 },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: '"Share Tech Mono", monospace',
          fontWeight: 400,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: '#8A8070',
          borderBottomColor: 'rgba(200,168,75,0.18)',
        },
        root: { borderBottomColor: 'rgba(200,168,75,0.08)', fontFamily: '"Share Tech Mono", monospace', fontSize: '0.8rem' },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Share Tech Mono", monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '0.72rem',
          borderRadius: '1px !important',
          border: '1px solid rgba(200,168,75,0.2) !important',
          color: '#8A8070',
          '&.Mui-selected': {
            backgroundColor: 'rgba(200,168,75,0.12)',
            color: '#C8A84B',
            borderColor: 'rgba(200,168,75,0.5) !important',
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(200,168,75,0.12)' },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 1,
          border: '1px solid rgba(200,168,75,0.2)',
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '1px !important',
          '&:hover': { backgroundColor: 'rgba(200,168,75,0.06)' },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: { fontFamily: '"Share Tech Mono", monospace', fontSize: '0.85rem' },
      },
    },
  },
});
