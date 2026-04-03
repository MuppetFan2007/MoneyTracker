import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

export default function StatCard({ title, value, subtitle, icon, color = 'primary.main', trend }) {
  const formatted = typeof value === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          {icon && (
            <Avatar sx={{ bgcolor: `${color}22`, color, width: 36, height: 36 }}>
              {icon}
            </Avatar>
          )}
        </Box>
        <Typography variant="h5" fontWeight={700} color={color} gutterBottom>
          {formatted}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {trend !== undefined && (
          <Typography variant="caption" color={trend >= 0 ? 'success.main' : 'error.main'} sx={{ display: 'block', mt: 0.5 }}>
            {trend >= 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(trend)} projected
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
