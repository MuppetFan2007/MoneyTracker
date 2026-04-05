import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export default function StatCard({ title, value, subtitle, icon, color = 'primary.main', trend, trendLabel, compact }) {
  const trendPositive = trend >= 0;

  return (
    <Card sx={{
      height: '100%',
      background: 'background.paper',
      cursor: 'default',
    }}>
      <CardContent sx={{ p: compact ? 2 : 2.5, '&:last-child': { pb: compact ? 2 : 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {title}
          </Typography>
          {icon && (
            <Avatar sx={{
              width: 34, height: 34, borderRadius: 2,
              bgcolor: typeof color === 'string' && !color.includes('.') ? `${color}22` : undefined,
              color,
              background: `${typeof color === 'string' ? color : '#7C6EFA'}18`,
            }}>
              {React.cloneElement(icon, { sx: { fontSize: 18 } })}
            </Avatar>
          )}
        </Box>

        <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em', color }}>
          {typeof value === 'number' ? fmt(value) : value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          {trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: trendPositive ? 'success.main' : 'error.main' }}>
              {trendPositive ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
              <Typography variant="caption" fontWeight={600}>{fmt(Math.abs(trend))}</Typography>
            </Box>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
