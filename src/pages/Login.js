import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  alpha,
  Fade,
  InputAdornment,
  IconButton,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  EmailRounded,
  LockRounded,
  Visibility,
  VisibilityOff,
  PsychologyRounded,
  AutoStoriesRounded,
} from '@mui/icons-material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authType, setAuthType] = useState('login');
  const navigate = useNavigate();

  // Orange theme colors
  const orangeTheme = {
    primary: '#3557ffff',
    primaryLight: '#3557ffff',
    primaryDark: '#3557ffff',
    background: '#FFF8F2',
    text: '#2D3748',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAuthTypeChange = (event, newAuthType) => {
    if (newAuthType !== null) {
      setAuthType(newAuthType);
      if (newAuthType === 'signup') {
        navigate('/signup');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${orangeTheme.background} 0%, ${alpha('#FFFFFF', 0.9)} 50%, ${alpha(orangeTheme.primary, 0.1)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(orangeTheme.primary, 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${alpha(orangeTheme.primary, 0.05)} 0%, transparent 50%)`,
        }
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(orangeTheme.primary, 0.2)} 0%, transparent 70%)`,
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(orangeTheme.primary, 0.15)} 0%, transparent 70%)`,
          animation: 'float 8s ease-in-out infinite 2s',
        }}
      />

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            py: 4,
          }}
        >
          <Fade in={true} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                width: '100%',
                maxWidth: 1000,
                minHeight: 600,
                background: `linear-gradient(135deg, ${alpha('#FFFFFF', 0.95)} 0%, ${alpha('#FFFFFF', 0.98)} 100%)`,
                border: `1px solid ${alpha(orangeTheme.primary, 0.2)}`,
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 25px 80px ${alpha(orangeTheme.primary, 0.15)}`,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 30px 100px ${alpha(orangeTheme.primary, 0.2)}`,
                },
              }}
            >
              {/* Left Column - Branding */}
              <Box
                sx={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${orangeTheme.primary} 0%, ${orangeTheme.primaryDark} 100%)`,
                  color: 'white',
                  p: 6,
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.1)} 0%, transparent 70%)`,
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: 400,
                  }}
                >
                  <AutoStoriesRounded
                    sx={{
                      fontSize: 80,
                      mb: 3,
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                      animation: 'bookOpen 2s ease-in-out infinite alternate',
                    }}
                  />
                  <Typography
                    variant="h2"
                    component="h1"
                    fontWeight="800"
                    sx={{
                      mb: 2,
                      fontSize: { md: '2.5rem', lg: '3rem' },
                      textShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    Note Me
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      opacity: 0.9,
                      fontWeight: 400,
                      mb: 4,
                      fontSize: { md: '1.1rem', lg: '1.25rem' },
                    }}
                  >
                    Where your thoughts find purpose and creativity flows freely
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      mt: 4,
                    }}
                  >
                    {[
                      '✨ AI-powered writing assistant',
                      '📝 Beautiful note organization',
                      '🔒 Secure cloud storage',
                      '🌐 Access from any device',
                    ].map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          fontSize: '1rem',
                          opacity: 0.9,
                        }}
                      >
                        <PsychologyRounded sx={{ fontSize: 20 }} />
                        <Typography variant="body1">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Right Column - Login Form */}
              <Box
                sx={{
                  flex: 1,
                  p: { xs: 4, md: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {/* Auth Type Toggle */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="700"
                    sx={{
                      background: `linear-gradient(135deg, ${orangeTheme.primary} 0%, ${orangeTheme.primaryDark} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      mb: 3,
                    }}
                  >
                    Welcome Back
                  </Typography>
                  
                  <ToggleButtonGroup
                    value={authType}
                    exclusive
                    onChange={handleAuthTypeChange}
                    aria-label="authentication type"
                    sx={{
                      background: alpha(orangeTheme.primary, 0.05),
                      borderRadius: 3,
                      p: 0.5,
                      border: `1px solid ${alpha(orangeTheme.primary, 0.1)}`,
                    }}
                  >
                    <ToggleButton
                      value="login"
                      sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 600,
                        color: authType === 'login' ? 'white' : orangeTheme.primary,
                        background: authType === 'login' 
                          ? `linear-gradient(135deg, ${orangeTheme.primary} 0%, ${orangeTheme.primaryDark} 100%)`
                          : 'transparent',
                        '&:hover': {
                          background: authType === 'login' 
                            ? `linear-gradient(135deg, ${orangeTheme.primary} 0%, ${orangeTheme.primaryDark} 100%)`
                            : alpha(orangeTheme.primary, 0.05),
                        },
                      }}
                    >
                      Sign In
                    </ToggleButton>
                    <ToggleButton
                      value="signup"
                      component={Link}
                      to="/signup"
                      sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 600,
                        color: authType === 'signup' ? 'white' : orangeTheme.primary,
                        background: authType === 'signup' 
                          ? `linear-gradient(135deg, ${orangeTheme.primary} 0%, ${orangeTheme.primaryDark} 100%)`
                          : 'transparent',
                        '&:hover': {
                          background: authType === 'signup' 
                            ? `linear-gradient(135deg, ${orangeTheme.primary} 0%, ${orangeTheme.primaryDark} 100%)`
                            : alpha(orangeTheme.primary, 0.05),
                        },
                      }}
                    >
                      Sign Up
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      border: `1px solid ${alpha('#ff4444', 0.2)}`,
                      background: `linear-gradient(135deg, ${alpha('#ff4444', 0.05)} 0%, ${alpha('#ff4444', 0.02)} 100%)`,
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailRounded sx={{ color: orangeTheme.primary }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover fieldset': {
                          borderColor: orangeTheme.primaryLight,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: orangeTheme.primary,
                          boxShadow: `0 0 0 2px ${alpha(orangeTheme.primary, 0.2)}`,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: orangeTheme.primary,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockRounded sx={{ color: orangeTheme.primary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: orangeTheme.primary }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover fieldset': {
                          borderColor: orangeTheme.primaryLight,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: orangeTheme.primary,
                          boxShadow: `0 0 0 2px ${alpha(orangeTheme.primary, 0.2)}`,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: orangeTheme.primary,
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      mt: 4,
                      mb: 3,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${orangeTheme.primary} 0%, ${orangeTheme.primaryDark} 100%)`,
                      boxShadow: `0 8px 32px ${alpha(orangeTheme.primary, 0.3)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 48px ${alpha(orangeTheme.primary, 0.4)}`,
                        background: `linear-gradient(135deg, ${orangeTheme.primaryLight} 0%, ${orangeTheme.primary} 100%)`,
                      },
                      '&:disabled': {
                        background: alpha(orangeTheme.primary, 0.5),
                        transform: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            border: `2px solid ${alpha('#FFFFFF', 0.3)}`,
                            borderTop: `2px solid #FFFFFF`,
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                        Signing in...
                      </Box>
                    ) : (
                      'Sign In to Your Account'
                    )}
                  </Button>
                </form>

                <Divider sx={{ my: 3, borderColor: alpha(orangeTheme.primary, 0.2) }}>
                  <Typography variant="body2" sx={{ color: alpha(orangeTheme.text, 0.6), px: 2 }}>
                    New to Note Me?
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: orangeTheme.text,
                      mb: 2,
                      opacity: 0.8,
                    }}
                  >
                    Don't have an account yet?
                  </Typography>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      border: `2px solid ${alpha(orangeTheme.primary, 0.3)}`,
                      color: orangeTheme.primary,
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: `2px solid ${orangeTheme.primary}`,
                        background: alpha(orangeTheme.primary, 0.05),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 8px 24px ${alpha(orangeTheme.primary, 0.2)}`,
                      },
                    }}
                  >
                    Create New Account
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bookOpen {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(5deg) scale(1.05); }
        }
      `}</style>
    </Box>
  );
}