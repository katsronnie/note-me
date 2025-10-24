import React from 'react';
import { Grid, Box, Typography, Button, Divider } from '@mui/material';
import { AutoStoriesRounded, CheckCircleRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function AuthCard({ active = 'login', children, orangeTheme }) {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
      {/* Left: Branding */}
      <Grid item xs={12} md={5}>
        <Box sx={{ height: '100%', p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: alphaOr('#FFF8F2', orangeTheme?.background) }}>
          <AutoStoriesRounded sx={{ fontSize: 72, color: orangeTheme?.primary || '#FF6B35', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            MindScribe
          </Typography>
          <Typography variant="body2" sx={{ color: orangeTheme?.text || '#2D3748', textAlign: 'center', mb: 2 }}>
            Capture ideas, build knowledge — beautiful notes, everywhere.
          </Typography>

          <Divider sx={{ width: '60%', my: 2 }} />

          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: orangeTheme?.text || '#2D3748' }}>Features</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><CheckCircleRounded sx={{ fontSize: 18, color: orangeTheme?.primary }} /> AI writing help</Typography>
              <Typography variant="body2" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><CheckCircleRounded sx={{ fontSize: 18, color: orangeTheme?.primary }} /> Markdown support</Typography>
              <Typography variant="body2" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><CheckCircleRounded sx={{ fontSize: 18, color: orangeTheme?.primary }} /> Secure cloud sync</Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Right: Form + Switch */}
      <Grid item xs={12} md={7}>
        <Box sx={{ height: '100%', p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
            <Button
              variant={active === 'login' ? 'contained' : 'outlined'}
              onClick={() => navigate('/login')}
              size="small"
            >
              Login
            </Button>
            <Button
              variant={active === 'signup' ? 'contained' : 'outlined'}
              onClick={() => navigate('/signup')}
              size="small"
            >
              Sign Up
            </Button>
          </Box>

          <Box>
            {children}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

// small helper to safely read optional theme prop
function alphaOr(fallback, value){
  return value || fallback;
}
