import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function EmptyState({ icon, title, description, action, onAction }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, px: 3, textAlign: 'center' }}>
      {/* SVG illustration */}
      <Box sx={{ mb: 3, opacity: 0.7 }}>
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="100" height="65" rx="8" fill="none" stroke="#7C6EFA" strokeWidth="2" strokeDasharray="6 3" opacity="0.4" />
          <rect x="25" y="35" width="30" height="4" rx="2" fill="#7C6EFA" opacity="0.3" />
          <rect x="25" y="45" width="50" height="3" rx="1.5" fill="#7C6EFA" opacity="0.2" />
          <rect x="25" y="53" width="40" height="3" rx="1.5" fill="#7C6EFA" opacity="0.2" />
          <circle cx="85" cy="42" r="12" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.4" />
          <path d="M81 42 L84 45 L89 39" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          <circle cx="20" cy="15" r="4" fill="#7C6EFA" opacity="0.2" />
          <circle cx="100" cy="88" r="5" fill="#06B6D4" opacity="0.2" />
          <circle cx="110" cy="18" r="3" fill="#F59E0B" opacity="0.3" />
        </svg>
      </Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, mb: action ? 3 : 0 }}>
        {description}
      </Typography>
      {action && (
        <Button variant="contained" onClick={onAction}>{action}</Button>
      )}
    </Box>
  );
}
