import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useSettings } from '../context/SettingsContext';
import { getTranslation } from '../utils/translations';
import {
  Box,
  Container,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Card,
  CardContent,
  Button,
  alpha,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import Layout from '../components/Layout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudIcon from '@mui/icons-material/Cloud';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const { 
    settings, 
    isDarkMode,
    updateSettingCategory, 
    updateSingleSetting,
    requestNotificationPermission,
    showNotification
  } = useSettings();

  const settingsTheme = {
    primary: isDarkMode ? '#818cf8' : '#667eea',
    secondary: isDarkMode ? '#8b5cf6' : '#764ba2',
    accent: '#10b981',
    background: isDarkMode ? '#1e293b' : '#f8fafc',
    cardBackground: isDarkMode ? '#334155' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#1e293b',
    textLight: isDarkMode ? '#cbd5e1' : '#64748b',
    border: isDarkMode ? '#475569' : '#e2e8f0',
  };

  const t = (key) => getTranslation(settings.language, key);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSettingChange = async (category, setting, value) => {
    // Handle push notifications permission request
    if (category === 'notifications' && setting === 'push' && value) {
      const granted = await requestNotificationPermission();
      if (granted) {
        updateSettingCategory(category, setting, value);
        showNotification('Notifications Enabled', {
          body: 'You will now receive push notifications!',
        });
      } else {
        alert('Please enable notifications in your browser settings.');
        return;
      }
    } else {
      updateSettingCategory(category, setting, value);
    }
  };

  const handleSingleSettingChange = (setting, value) => {
    updateSingleSetting(setting, value);
  };

  const handleSaveSettings = () => {
    setSaveMessage(t('settingsSaved'));
    showNotification(t('settingsSaved'), {
      body: 'Your preferences have been updated.',
    });
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleDeleteAccount = async () => {
    // In a real app, you would implement account deletion here
    alert('Account deletion would be implemented here. This is a demo.');
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Layout showSearch={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: settingsTheme.primary }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout showSearch={false}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                background: `linear-gradient(135deg, ${settingsTheme.primary} 0%, ${settingsTheme.secondary} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              Settings
            </Typography>
            <Typography variant="body1" sx={{ color: settingsTheme.textLight }}>
              Customize your MindScribe experience
            </Typography>
          </Box>

          {saveMessage && (
            <Alert 
              severity="success" 
              icon={<CheckCircleIcon />}
              sx={{ mb: 3, borderRadius: 3 }}
            >
              {saveMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Notifications Settings */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: settingsTheme.cardBackground,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  border: `1px solid ${settingsTheme.border}`,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${settingsTheme.primary} 0%, ${settingsTheme.secondary} 100%)`,
                      mr: 2,
                    }}
                  >
                    <NotificationsIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Notifications
                  </Typography>
                </Box>

                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Email Notifications"
                      secondary="Receive updates via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Push Notifications"
                      secondary="Browser push notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.push}
                        onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Product Updates"
                      secondary="Get notified about new features"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.updates}
                        onChange={(e) => handleSettingChange('notifications', 'updates', e.target.checked)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Appearance Settings */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: settingsTheme.cardBackground,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  border: `1px solid ${settingsTheme.border}`,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, #f59e0b 0%, #f97316 100%)`,
                      mr: 2,
                    }}
                  >
                    <DarkModeIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Appearance
                  </Typography>
                </Box>

                <List>
                  <ListItem>
                    <ListItemText 
                      primary={t('darkMode')}
                      secondary="Switch between light and dark theme"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.appearance.darkMode}
                        onChange={(e) => handleSettingChange('appearance', 'darkMode', e.target.checked)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Compact View"
                      secondary="Show more content at once"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.appearance.compactView}
                        onChange={(e) => handleSettingChange('appearance', 'compactView', e.target.checked)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <FormControl fullWidth size="small">
                      <InputLabel>{t('language')}</InputLabel>
                      <Select
                        value={settings.language}
                        label={t('language')}
                        onChange={(e) => handleSingleSettingChange('language', e.target.value)}
                        startAdornment={<LanguageIcon sx={{ mr: 1, color: settingsTheme.textLight }} />}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Español</MenuItem>
                        <MenuItem value="fr">Français</MenuItem>
                        <MenuItem value="de">Deutsch</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Privacy Settings */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: settingsTheme.cardBackground,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  border: `1px solid ${settingsTheme.border}`,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
                      mr: 2,
                    }}
                  >
                    <SecurityIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Privacy & Security
                  </Typography>
                </Box>

                <List>
                  <ListItem>
                    <FormControl fullWidth size="small">
                      <InputLabel>Default Note Privacy</InputLabel>
                      <Select
                        value={settings.privacy.defaultPrivacy}
                        label="Default Note Privacy"
                        onChange={(e) => handleSettingChange('privacy', 'defaultPrivacy', e.target.value)}
                        startAdornment={<LockIcon sx={{ mr: 1, color: settingsTheme.textLight }} />}
                      >
                        <MenuItem value="private">Private</MenuItem>
                        <MenuItem value="public">Public</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Show Profile Publicly"
                      secondary="Allow others to see your profile"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.privacy.showProfile}
                        onChange={(e) => handleSettingChange('privacy', 'showProfile', e.target.checked)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Editor Settings */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: settingsTheme.cardBackground,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  border: `1px solid ${settingsTheme.border}`,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)`,
                      mr: 2,
                    }}
                  >
                    <CloudIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Editor Preferences
                  </Typography>
                </Box>

                <List>
                  <ListItem>
                    <ListItemText 
                      primary={t('autoSave')}
                      secondary="Automatically save notes as you type"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.autoSave}
                        onChange={(e) => handleSingleSettingChange('autoSave', e.target.checked)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary={t('aiAssistant')}
                      secondary="Enable AI writing suggestions and assistance"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.aiAssistant}
                        onChange={(e) => handleSingleSettingChange('aiAssistant', e.target.checked)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Danger Zone */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: alpha('#ef4444', 0.05),
                  border: `2px solid ${alpha('#ef4444', 0.2)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ mr: 1, color: '#ef4444' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>
                    {t('dangerZone')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2, color: settingsTheme.textLight }}>
                  These actions are irreversible. Please be certain before proceeding.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForeverIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Delete Account
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* Save Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${settingsTheme.primary} 0%, ${settingsTheme.secondary} 100%)`,
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: `linear-gradient(135deg, ${settingsTheme.secondary} 0%, ${settingsTheme.primary} 100%)`,
                  boxShadow: '0 6px 24px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Save All Settings
            </Button>
          </Box>
        </Box>

        {/* Delete Account Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            }
          }}
        >
          <DialogTitle sx={{ color: '#ef4444', fontWeight: 700 }}>
            Delete Account?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action cannot be undone. All your notes, data, and account information will be permanently deleted.
              Are you absolutely sure you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteAccount} 
              color="error" 
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Yes, Delete My Account
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
