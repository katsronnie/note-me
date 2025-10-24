import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Container, 
  InputBase, 
  alpha,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useSettings } from '../context/SettingsContext';
import { getTranslation } from '../utils/translations';

const Search = styled('div')(({ theme, darkMode }) => ({
  position: 'relative',
  borderRadius: 25,
  backgroundColor: darkMode ? alpha('#ffffff', 0.1) : alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: darkMode ? alpha('#ffffff', 0.15) : alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.8),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '12ch',
    '&:focus': {
      width: '20ch',
    },
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const OrangeAppBar = styled(AppBar)(({ theme, darkMode }) => ({
  background: darkMode 
    ? `linear-gradient(135deg, #1e293b 0%, #334155 100%)`
    : `linear-gradient(135deg, #3557ffff 0%, #3557ffff 100%)`,
  boxShadow: darkMode 
    ? '0 4px 20px rgba(0, 0, 0, 0.5)'
    : '0 4px 20px rgba(255, 107, 53, 0.3)',
  borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}`,
}));

export default function Layout({ children, showSearch = true }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  const { settings, isDarkMode } = useSettings();
  const t = (key) => getTranslation(settings.language, key);

  // Theme colors that adapt to dark mode
  const orangeTheme = {
    primary: isDarkMode ? '#818cf8' : '#FF6B35',
    primaryLight: isDarkMode ? '#a5b4fc' : '#FF8E53',
    primaryDark: isDarkMode ? '#6366f1' : '#E55A2B',
    background: isDarkMode ? '#0f172a' : '#FFF8F2',
    text: isDarkMode ? '#f1f5f9' : '#2D3748',
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleCreateNote = () => {
    navigate('/note/new');
  };

  const handleAIAssistant = () => {
    navigate('/note/new', { state: { withAI: true } });
  };

  const getUserInitials = () => {
    const user = auth.currentUser;
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: orangeTheme.background, transition: 'background 0.3s ease' }}>
      <OrangeAppBar position="static" darkMode={isDarkMode}>
        <Toolbar sx={{ minHeight: 70 }}>
          {/* Logo/Brand */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              mr: 3,
              '&:hover': {
                transform: 'translateX(-2px)',
              },
              transition: 'transform 0.2s ease'
            }} 
            onClick={() => navigate('/home')}
          >
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE8D6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Note Me
            </Typography>

          </Box>

          {/* Search Bar */}
          {showSearch && (
            <Search darkMode={isDarkMode}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase 
                placeholder={t('searchNotes')} 
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            

            {/* New Note Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNote}
              sx={{
                background: 'rgba(255,255,255,0.9)',
                color: orangeTheme.primary,
                borderRadius: 3,
                px: 3,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  background: 'rgba(255,255,255,1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {t('newNote')}
            </Button>

            {/* User Menu */}
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                ml: 1,
                background: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: `1px solid ${alpha(orangeTheme.primary, 0.1)}`,
                  minWidth: 180,
                  background: isDarkMode ? '#334155' : '#ffffff',
                }
              }}
            >
              <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
                <AccountCircleIcon sx={{ mr: 2, color: orangeTheme.primary }} />
                <Typography sx={{ color: orangeTheme.text }}>{t('profile')}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleUserMenuClose(); navigate('/settings'); }}>
                <SettingsIcon sx={{ mr: 2, color: orangeTheme.primary }} />
                <Typography sx={{ color: orangeTheme.text }}>{t('settings')}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleUserMenuClose(); handleLogout(); }}>
                <ExitToAppIcon sx={{ mr: 2, color: orangeTheme.primary }} />
                <Typography sx={{ color: orangeTheme.text }}>{t('logout')}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </OrangeAppBar>

      <Container 
        maxWidth={false} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: '100% !important',
          flex: 1,
        }}
      >
        {children}
      </Container>

      {/* Optional: Footer */}
      <Box 
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          background: `linear-gradient(135deg, ${alpha(orangeTheme.primary, 0.05)} 0%, transparent 100%)`,
          borderTop: `1px solid ${alpha(orangeTheme.primary, 0.1)}`,
          textAlign: 'center',
        }}
      >
        
      </Box>
    </Box>
  );
}