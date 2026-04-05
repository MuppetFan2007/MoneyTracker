import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Tooltip, Popover, Card,
  Chip, alpha,
} from '@mui/material';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useThemeMode } from '../context/ThemeContext';
import { THEME_META, THEME_IDS } from '../context/ThemeContext';

const DESCRIPTIONS = {
  dark:          'Clean midnight UI',
  light:         'Bright & minimal',
  'racing-miku': 'Neon cyan speed',
  nier:          'YoRHa terminal gold',
  bunny:         'Kawaii pastel soft',
};

export default function ThemePicker({ mini }) {
  const { themeId, setThemeId } = useThemeMode();
  const [anchor, setAnchor] = useState(null);

  return (
    <>
      <Tooltip title="Change theme" placement="right">
        <IconButton
          size="small"
          onClick={e => setAnchor(e.currentTarget)}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <PaletteRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              p: 2,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              backgroundImage: 'none',
              ml: 1.5,
            },
          },
        }}
      >
        <Typography variant="caption" fontWeight={700} color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}>
          Choose Theme
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {THEME_IDS.map(id => {
            const meta = THEME_META[id];
            const active = themeId === id;
            return (
              <Box
                key={id}
                onClick={() => { setThemeId(id); setAnchor(null); }}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: 1.25, borderRadius: 2.5, cursor: 'pointer',
                  border: '1.5px solid',
                  borderColor: active ? 'primary.main' : 'divider',
                  bgcolor: active ? alpha('#7C6EFA', 0.08) : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha('#7C6EFA', 0.06),
                    transform: 'translateX(3px)',
                  },
                }}
              >
                {/* Color swatches */}
                <Box sx={{ display: 'flex', gap: 0.4, flexShrink: 0 }}>
                  {meta.palette.map((c, i) => (
                    <Box key={i} sx={{
                      width: i === 0 ? 28 : 14,
                      height: 28,
                      borderRadius: i === 0 ? '6px 0 0 6px' : i === meta.palette.length - 1 ? '0 6px 6px 0' : 0,
                      bgcolor: c,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }} />
                  ))}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography sx={{ fontSize: 14 }}>{meta.emoji}</Typography>
                    <Typography variant="body2" fontWeight={700}>{meta.name}</Typography>
                    {active && (
                      <Chip label="Active" size="small" color="primary"
                        sx={{ height: 18, fontSize: '0.6rem', ml: 'auto', borderRadius: 99 }} />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">{DESCRIPTIONS[id]}</Typography>
                </Box>

                {active && (
                  <CheckRoundedIcon sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
                )}
              </Box>
            );
          })}
        </Box>

        <Typography variant="caption" color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 1.5, opacity: 0.6 }}>
          Theme saved automatically
        </Typography>
      </Popover>
    </>
  );
}
