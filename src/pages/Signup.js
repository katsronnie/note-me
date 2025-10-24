import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
  PersonRounded,
  EmailRounded,
  LockRounded,
  Visibility,
  VisibilityOff,
  CheckCircleRounded,
  AutoStoriesRounded,
  PsychologyRounded,
} from '@mui/icons-material';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authType, setAuthType] = useState('signup');
  const navigate = useNavigate();

  // Orange theme colors
  const orangeTheme = {
    primary: '#3557ffff',
    primaryLight: '#3557ffff',
    primaryDark: '#3557ffff',
    background: '#FFF8F2',
    text: '#2D3748',
    success: '#4CAF50',
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
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

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleAuthTypeChange = (event, newAuthType) => {
    if (newAuthType !== null) {
      setAuthType(newAuthType);
      if (newAuthType === 'login') {
        navigate('/login');
      }
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, color: orangeTheme.primary, text: '' };
    if (password.length < 6) return { strength: 33, color: '#ff4444', text: 'Weak' };
    if (password.length < 8) return { strength: 66, color: '#3557ffff', text: 'Medium' };
    return { strength: 100, color: orangeTheme.success, text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength();

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
          background: `radial-gradient(circle at 30% 70%, ${alpha(orangeTheme.primary, 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 70% 30%, ${alpha(orangeTheme.primary, 0.05)} 0%, transparent 50%)`,
        }
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(orangeTheme.primary, 0.15)} 0%, transparent 70%)`,
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '8%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(orangeTheme.primary, 0.1)} 0%, transparent 70%)`,
          animation: 'float 8s ease-in-out infinite 1s',
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
                    Join thousands of writers and thinkers organizing their ideas
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
                      '🚀 Start your writing journey',
                      '🤖 AI-powered assistance',
                      '📚 Unlimited note storage',
                      '🔐 Enterprise-grade security',
                      '💫 Beautiful interface',
                      '📱 Access anywhere',
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
                        <CheckCircleRounded sx={{ fontSize: 20 }} />
                        <Typography variant="body1">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Right Column - Signup Form */}
              <Box
                sx={{
                  flex: 1,
                  p: { xs: 4, md: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  overflow: 'auto',
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
                    Join Note Me
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
                      component={Link}
                      to="/login"
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

                <form onSubmit={handleSignup}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonRounded sx={{ color: orangeTheme.primary }} />
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

                  <Box sx={{ mt: 2 }}>
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

                    {/* Password Strength Indicator */}
                    {password.length > 0 && (
                      <Box sx={{ mt: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: orangeTheme.text, opacity: 0.7 }}>
                            Password strength
                          </Typography>
                          <Typography variant="caption" sx={{ color: passwordStrength.color, fontWeight: 600 }}>
                            {passwordStrength.text}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                            height: 4,
                            backgroundColor: alpha(orangeTheme.primary, 0.1),
                            borderRadius: 2,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${passwordStrength.strength}%`,
                              height: '100%',
                              backgroundColor: passwordStrength.color,
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            sx={{ color: orangeTheme.primary }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                  {/* Password Match Indicator */}
                  {confirmPassword.length > 0 && password.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1,
                        mb: 2,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: password === confirmPassword ? alpha(orangeTheme.success, 0.1) : alpha('#ff4444', 0.1),
                        border: `1px solid ${password === confirmPassword ? alpha(orangeTheme.success, 0.2) : alpha('#ff4444', 0.2)}`,
                      }}
                    >
                      <CheckCircleRounded
                        sx={{
                          fontSize: 20,
                          color: password === confirmPassword ? orangeTheme.success : '#ff4444',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: password === confirmPassword ? orangeTheme.success : '#ff4444',
                          fontWeight: 600,
                        }}
                      >
                        {password === confirmPassword ? 'Passwords match!' : 'Passwords do not match'}
                      </Typography>
                    </Box>
                  )}

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
                        Creating Your Account...
                      </Box>
                    ) : (
                      'Start Your Journey'
                    )}
                  </Button>
                </form>

                <Divider sx={{ my: 3, borderColor: alpha(orangeTheme.primary, 0.2) }}>
                  <Typography variant="body2" sx={{ color: alpha(orangeTheme.text, 0.6), px: 2 }}>
                    Already with us?
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
                    Welcome back to Note Me
                  </Typography>
                  <Button
                    component={Link}
                    to="/login"
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
                    Sign In to Your Account
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