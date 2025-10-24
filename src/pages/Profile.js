import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { auth } from '../firebase';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
  alpha,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import Layout from '../components/Layout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import VerifiedIcon from '@mui/icons-material/Verified';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const profileTheme = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#10b981',
    background: '#f8fafc',
    cardBackground: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setEmail(currentUser.email || '');
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSaveProfile = async () => {
    setMessage({ type: '', text: '' });
    setSaving(true);

    try {
      // Update display name
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Update email (requires recent authentication)
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setMessage({ type: 'error', text: 'Passwords do not match!' });
          setSaving(false);
          return;
        }
        if (newPassword.length < 6) {
          setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
          setSaving(false);
          return;
        }
        await updatePassword(user, newPassword);
        setNewPassword('');
        setConfirmPassword('');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: 'error', text: 'Please logout and login again to update your email or password.' });
      } else {
        setMessage({ type: 'error', text: error.message });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user.displayName || '');
    setEmail(user.email || '');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const getAccountAge = () => {
    if (user?.metadata?.creationTime) {
      const created = new Date(user.metadata.creationTime);
      const now = new Date();
      const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      return days > 0 ? `${days} days` : 'Today';
    }
    return 'N/A';
  };

  if (loading) {
    return (
      <Layout showSearch={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: profileTheme.primary }} />
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
                background: `linear-gradient(135deg, ${profileTheme.primary} 0%, ${profileTheme.secondary} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              My Profile
            </Typography>
            <Typography variant="body1" sx={{ color: profileTheme.textLight }}>
              Manage your account information and preferences
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Profile Card */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${profileTheme.primary} 0%, ${profileTheme.secondary} 100%)`,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)',
                  border: `1px solid ${alpha(profileTheme.primary, 0.2)}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '3rem',
                        fontWeight: 700,
                        border: '4px solid rgba(255,255,255,0.3)',
                        mb: 2,
                      }}
                    >
                      {getUserInitials()}
                    </Avatar>
                    
                  </Box>

                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                    {user?.displayName || 'User'}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    {user?.email}
                  </Typography>

                  {user?.emailVerified && (
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Verified"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                        mb: 2
                      }}
                    />
                  )}

                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 0.5 }}>
                      Account Age
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      {getAccountAge()}
                    </Typography>
                  </Box>
                </Box>

                {/* Decorative background */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0,
                  }}
                />
              </Paper>
            </Grid>

            {/* Profile Information */}
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: profileTheme.cardBackground,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  border: `1px solid ${profileTheme.border}`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: profileTheme.text }}>
                    Profile Information
                  </Typography>
                  {!isEditing ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        borderColor: profileTheme.primary,
                        color: profileTheme.primary,
                        '&:hover': {
                          borderColor: profileTheme.secondary,
                          background: alpha(profileTheme.primary, 0.05),
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                        variant="contained"
                        disabled={saving}
                        sx={{
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${profileTheme.primary} 0%, ${profileTheme.secondary} 100%)`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${profileTheme.secondary} 0%, ${profileTheme.primary} 100%)`,
                          }
                        }}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        variant="outlined"
                        disabled={saving}
                        sx={{
                          borderRadius: 3,
                          borderColor: profileTheme.textLight,
                          color: profileTheme.textLight,
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                {message.text && (
                  <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
                    {message.text}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  {/* Display Name */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: profileTheme.textLight }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: profileTheme.primary,
                          }
                        }
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: profileTheme.textLight }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: profileTheme.primary,
                          }
                        }
                      }}
                    />
                  </Grid>

                  {isEditing && (
                    <>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }}>
                          <Chip label="Change Password (Optional)" size="small" />
                        </Divider>
                      </Grid>

                      {/* New Password */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          InputProps={{
                            startAdornment: <LockIcon sx={{ mr: 1, color: profileTheme.textLight }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&.Mui-focused fieldset': {
                                borderColor: profileTheme.primary,
                              }
                            }
                          }}
                          helperText="Leave blank to keep current password"
                        />
                      </Grid>

                      {/* Confirm Password */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm Password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          InputProps={{
                            startAdornment: <LockIcon sx={{ mr: 1, color: profileTheme.textLight }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&.Mui-focused fieldset': {
                                borderColor: profileTheme.primary,
                              }
                            }
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>

              {/* Account Stats */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ borderRadius: 3, background: alpha(profileTheme.primary, 0.05), border: `1px solid ${alpha(profileTheme.primary, 0.1)}` }}>
                    <CardContent>
                      <Typography variant="caption" sx={{ color: profileTheme.textLight }}>
                        User ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: profileTheme.text, wordBreak: 'break-all' }}>
                        {user?.uid.substring(0, 12)}...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ borderRadius: 3, background: alpha(profileTheme.accent, 0.05), border: `1px solid ${alpha(profileTheme.accent, 0.1)}` }}>
                    <CardContent>
                      <Typography variant="caption" sx={{ color: profileTheme.textLight }}>
                        Last Sign In
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: profileTheme.text }}>
                        {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ borderRadius: 3, background: alpha(profileTheme.secondary, 0.05), border: `1px solid ${alpha(profileTheme.secondary, 0.1)}` }}>
                    <CardContent>
                      <Typography variant="caption" sx={{ color: profileTheme.textLight }}>
                        Account Status
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: profileTheme.text }}>
                        {user?.emailVerified ? '✓ Verified' : 'Unverified'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
}
