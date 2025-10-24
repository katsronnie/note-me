import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import {
  Typography,
  Box,
  Fab,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Grid,
  Chip,
  Paper,
  alpha,
  Fade,
  Zoom,
  Tooltip,
  Container,
  Avatar,
  AvatarGroup,
  LinearProgress,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ShareIcon from '@mui/icons-material/Share';
import LockIcon from '@mui/icons-material/Lock';
import NotesIcon from '@mui/icons-material/Notes';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import IosShareIcon from '@mui/icons-material/IosShare';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Layout from '../components/Layout';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filterPublic, setFilterPublic] = useState('all');
  const [activeSection, setActiveSection] = useState('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();

  // Enhanced theme colors
  const notesTheme = {
    primary: '#3557ffff',
    primaryLight: '#3557ffff',
    primaryDark: '#3557ffff',
    secondary: '#3557ffff',
    accent: '#10b981',
    background: '#f8fafc',
    cardBackground: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
        navigate('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Load notes when user is authenticated
  useEffect(() => {
    if (!user) {
      return;
    }

    console.log('Loading notes for user:', user.uid);

    const q = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => notesData.push({ id: doc.id, ...doc.data() }));
      console.log('Loaded notes:', notesData.length);
      setNotes(notesData);
    }, (error) => {
      console.error('Error listening to notes:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // If it's an index error, try without orderBy
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        console.log('Trying without orderBy...');
        const simpleQuery = query(
          collection(db, 'notes'),
          where('userId', '==', user.uid)
        );
        
        const unsubscribe2 = onSnapshot(simpleQuery, (querySnapshot) => {
          const notesData = [];
          querySnapshot.forEach((doc) => notesData.push({ id: doc.id, ...doc.data() }));
          console.log('Loaded notes (without orderBy):', notesData.length);
          // Sort manually
          notesData.sort((a, b) => {
            const aTime = a.updatedAt?.toDate?.() || new Date(0);
            const bTime = b.updatedAt?.toDate?.() || new Date(0);
            return bTime - aTime;
          });
          setNotes(notesData);
        });
        
        return () => unsubscribe2();
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    let filtered = notes;

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeSection === 'shared') {
      filtered = filtered.filter(note => note.isPublic);
    } else if (activeSection === 'private') {
      filtered = filtered.filter(note => !note.isPublic);
    }

    if (filterPublic === 'public') {
      filtered = filtered.filter(note => note.isPublic);
    } else if (filterPublic === 'private') {
      filtered = filtered.filter(note => !note.isPublic);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title?.localeCompare(b.title || '');
      } else if (sortBy === 'createdAt') {
        return b.createdAt?.toDate() - a.createdAt?.toDate();
      } else {
        return b.updatedAt?.toDate() - a.updatedAt?.toDate();
      }
    });

    setFilteredNotes(filtered);
  }, [searchQuery, notes, sortBy, filterPublic, activeSection]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteDoc(doc(db, 'notes', id));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleShare = async (note) => {
    const shareUrl = note.isPublic 
      ? `${window.location.origin}/public/${note.id}`
      : `${window.location.origin}/note/${note.id}`;
    
    const shareText = `Check out my note: "${note.title || 'Untitled'}"`;
    
    // Check if Web Share API is available (works on mobile and some modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title || 'Untitled Note',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback to copy to clipboard
          copyToClipboard(shareUrl, note);
        }
      }
    } else {
      // Fallback: Show share options
      shareViaOptions(note, shareUrl);
    }
  };

  const handleMenuOpen = (event, note) => {
    setMenuAnchor(event.currentTarget);
    setSelectedNote(note);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedNote(null);
  };

  const handleMenuShare = () => {
    if (selectedNote) {
      handleShare(selectedNote);
    }
    handleMenuClose();
  };

  const copyToClipboard = async (url, note) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard! You can now paste it anywhere to share.');
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Link copied to clipboard!');
      } catch (err) {
        alert(`Share this link: ${url}`);
      }
      document.body.removeChild(textArea);
    }
  };

  const shareViaOptions = (note, shareUrl) => {
    const title = encodeURIComponent(note.title || 'Untitled Note');
    const text = encodeURIComponent(`Check out my note: "${note.title || 'Untitled'}"`);
    const url = encodeURIComponent(shareUrl);

    // Create a simple menu with share options
    const shareOptions = [
      {
        name: 'Copy Link',
        action: () => copyToClipboard(shareUrl, note)
      },
      {
        name: 'Email',
        action: () => window.open(`mailto:?subject=${title}&body=${text}%0A%0A${url}`)
      },
      {
        name: 'WhatsApp',
        action: () => window.open(`https://wa.me/?text=${text}%20${url}`)
      },
      {
        name: 'Twitter',
        action: () => window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`)
      },
      {
        name: 'Facebook',
        action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
      }
    ];

    // Show options as a browser prompt (simple fallback)
    const choice = window.prompt(
      `Share "${note.title || 'Untitled'}" via:\n\n` +
      shareOptions.map((opt, i) => `${i + 1}. ${opt.name}`).join('\n') +
      '\n\nEnter number (or press Cancel to copy link):'
    );

    if (choice) {
      const index = parseInt(choice) - 1;
      if (index >= 0 && index < shareOptions.length) {
        shareOptions[index].action();
      } else {
        copyToClipboard(shareUrl, note);
      }
    } else {
      copyToClipboard(shareUrl, note);
    }
  };

  // Debug function to load all notes (ignoring userId)
  const loadAllNotesDebug = async () => {
    console.log('DEBUG: Loading ALL notes from database...');
    const allNotesQuery = query(collection(db, 'notes'));
    
    const unsubscribe = onSnapshot(allNotesQuery, (querySnapshot) => {
      const allNotes = [];
      querySnapshot.forEach((doc) => {
        const noteData = { id: doc.id, ...doc.data() };
        allNotes.push(noteData);
        console.log('Note found:', {
          id: doc.id,
          title: noteData.title,
          userId: noteData.userId,
          currentUserId: user?.uid
        });
      });
      console.log('Total notes in database:', allNotes.length);
      console.log('Notes matching current user:', allNotes.filter(n => n.userId === user?.uid).length);
      setNotes(allNotes); // Show all notes for debugging
      setDebugMode(true);
    });

    return unsubscribe;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWordCount = (content) => {
    return content ? content.split(/\s+/).filter(word => word.length > 0).length : 0;
  };

  const getReadingTime = (content) => {
    const words = getWordCount(content);
    return Math.ceil(words / 200) || 1;
  };

  const getNoteStatistics = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalNotes = notes.length;
    const sharedNotes = notes.filter(note => note.isPublic).length;
    const privateNotes = totalNotes - sharedNotes;
    
    const thisWeekNotes = notes.filter(note => {
      if (!note.updatedAt) return false;
      const noteDate = note.updatedAt.toDate();
      return noteDate >= oneWeekAgo;
    }).length;

    const thisMonthNotes = notes.filter(note => {
      if (!note.updatedAt) return false;
      const noteDate = note.updatedAt.toDate();
      return noteDate >= oneMonthAgo;
    }).length;

    const totalWords = notes.reduce((sum, note) => sum + getWordCount(note.content), 0);
    const avgWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;

    return {
      totalNotes,
      sharedNotes,
      privateNotes,
      thisWeekNotes,
      thisMonthNotes,
      totalWords,
      avgWordsPerNote
    };
  };

  const stats = getNoteStatistics();

  const StatCard = ({ icon, value, label, color, gradient }) => (
    <Paper
      sx={{
        p: 3,
        background: gradient || `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(color, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px ${alpha(color, 0.15)}`,
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
            color: 'white',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, color: color }}>
          {value}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: notesTheme.text, fontWeight: 600 }}>
        {label}
      </Typography>
    </Paper>
  );

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <Layout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ color: notesTheme.primary, mb: 2 }} />
            <Typography variant="h6" sx={{ color: notesTheme.text }}>
              Loading your notes...
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${notesTheme.background} 0%, ${alpha(notesTheme.primary, 0.02)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: `linear-gradient(135deg, ${alpha(notesTheme.primary, 0.03)} 0%, transparent 100%)`,
          zIndex: 0,
        }
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          {/* Header Section */}
          <Fade in={true} timeout={800}>
            <Box sx={{ mb: 6 }}>
              
              {/* Statistics Grid */}
              <Grid container spacing={10} sx={{ mb: 10 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    icon={<NotesIcon sx={{ fontSize: 24 }} />}
                    value={stats.totalNotes}
                    label="Total Notes"
                    color={notesTheme.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    icon={<CalendarTodayIcon sx={{ fontSize: 24 }} />}
                    value={stats.thisWeekNotes}
                    label="This Week"
                    color={notesTheme.accent}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    icon={<GroupIcon sx={{ fontSize: 24 }} />}
                    value={stats.sharedNotes}
                    label="Sharable Notes"
                    color="#10b981"
                  />
                </Grid>
                
              </Grid>
            </Box>
          </Fade>

          {/* Main Content Area */}
          <Box sx={{ mb: 4 }}>
            {/* Controls Section */}
            <Fade in={true} timeout={1000}>
              <Paper
                
              >
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: { xs: 'stretch', md: 'center' } }}>
                  {/* Section Tabs */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[
                      { key: 'all', label: 'All Notes', icon: <NotesIcon sx={{ fontSize: 20 }} /> },
                      { key: 'shared', label: 'Sharable', icon: <ShareIcon sx={{ fontSize: 20 }} /> },
                      { key: 'private', label: 'Private', icon: <LockIcon sx={{ fontSize: 20 }} /> },
                    ].map((section) => (
                      <Button
                        key={section.key}
                        variant={activeSection === section.key ? 'contained' : 'outlined'}
                        startIcon={section.icon}
                        onClick={() => setActiveSection(section.key)}
                        sx={{
                          borderRadius: 3,
                          px: 3,
                          py: 1.5,
                          fontWeight: 600,
                          background: activeSection === section.key 
                            ? `linear-gradient(135deg, ${notesTheme.primary} 0%, ${notesTheme.primaryDark} 100%)`
                            : 'transparent',
                          border: `2px solid ${notesTheme.primary}`,
                          color: activeSection === section.key ? 'white' : notesTheme.primary,
                          flex: { xs: 1, md: 'none' },
                          minWidth: { xs: 'auto', md: 120 },
                        }}
                      >
                        {section.label}
                      </Button>
                    ))}
                  </Box>

                  <Box sx={{ flex: 1 }} />

                 

                  {/* Search and Filters */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ color: notesTheme.textLight, mr: 1 }} />,
                        sx: {
                          borderRadius: 3,
                          background: alpha(notesTheme.primary, 0.03),
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${alpha(notesTheme.primary, 0.1)}`,
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${alpha(notesTheme.primary, 0.2)}`,
                          }
                        }
                      }}
                      sx={{
                        minWidth: 280,
                        flex: 1,
                      }}
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={`Sort by ${sortBy === 'updatedAt' ? 'Title' : 'Recent'}`}>
                        <IconButton
                          onClick={() => setSortBy(sortBy === 'updatedAt' ? 'title' : 'updatedAt')}
                          sx={{
                            border: `1px solid ${alpha(notesTheme.primary, 0.2)}`,
                            color: notesTheme.primary,
                            borderRadius: 2,
                            '&:hover': {
                              background: alpha(notesTheme.primary, 0.05),
                            }
                          }}
                        >
                          <SortIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={`Filter: ${filterPublic === 'all' ? 'All' : filterPublic === 'public' ? 'Sharable' : 'Private'}`}>
                        <IconButton
                          onClick={() => setFilterPublic(filterPublic === 'all' ? 'public' : filterPublic === 'public' ? 'private' : 'all')}
                          sx={{
                            border: `1px solid ${alpha(notesTheme.primary, 0.2)}`,
                            color: notesTheme.primary,
                            borderRadius: 2,
                            '&:hover': {
                              background: alpha(notesTheme.primary, 0.05),
                            }
                          }}
                        >
                          <FilterListIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Fade>

            {/* Notes Grid Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ color: notesTheme.text, fontWeight: 700, mb: 1 }}>
                  {activeSection === 'all' ? 'All Notes' : activeSection === 'shared' ? 'Sharable Notes' : 'Private Notes'}
                </Typography>
                <Typography variant="body1" sx={{ color: notesTheme.textLight }}>
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} • Sorted by {sortBy === 'updatedAt' ? 'recent' : 'title'}
                </Typography>
              </Box>
            </Box>

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
              <Fade in={true} timeout={800}>
                <Paper
                  sx={{
                    textAlign: 'center',
                    p: 8,
                    background: notesTheme.cardBackground,
                    borderRadius: 4,
                    border: `2px dashed ${alpha(notesTheme.primary, 0.1)}`,
                    boxShadow: 'none',
                  }}
                >
                  <AutoStoriesIcon sx={{ fontSize: 80, color: alpha(notesTheme.primary, 0.3), mb: 3 }} />
                  <Typography variant="h5" sx={{ color: notesTheme.text, mb: 2, fontWeight: 600 }}>
                    {searchQuery ? 'No notes found' : 'Your notebook is empty'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: notesTheme.textLight, mb: 4, maxWidth: 400, mx: 'auto' }}>
                    {searchQuery ? 'Try adjusting your search terms or explore different categories.' : 'Start capturing your ideas, thoughts, and inspirations. Your first note is just a click away!'}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/note/new')}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      background: `linear-gradient(135deg, ${notesTheme.primary} 0%, ${notesTheme.primaryDark} 100%)`,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: `0 8px 32px ${alpha(notesTheme.primary, 0.3)}`,
                    }}
                  >
                    Create Your First Note
                  </Button>
                </Paper>
              </Fade>
            ) : (
              <Grid container spacing={3}>
                {filteredNotes.map((note, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                    <Zoom in={true} timeout={500 + (index * 100)}>
                      <Card 
                        onMouseEnter={() => setHoveredCard(note.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: notesTheme.cardBackground,
                          border: `1px solid ${alpha(notesTheme.primary, 0.1)}`,
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: `linear-gradient(90deg, ${notesTheme.primary} 0%, ${notesTheme.accent} 100%)`,
                            transform: 'scaleX(0)',
                            transition: 'transform 0.3s ease',
                          },
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                            border: `1px solid ${alpha(notesTheme.primary, 0.2)}`,
                            '&::before': {
                              transform: 'scaleX(1)',
                            }
                          }
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          {/* Note Header */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography 
                              variant="h6" 
                              component="h2"
                              sx={{
                                fontWeight: 700,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                color: notesTheme.text,
                                fontSize: '1.1rem',
                                lineHeight: 1.4,
                                pr: 1,
                              }}
                            >
                              {note.title || 'Untitled Note'}
                            </Typography>
                            <IconButton
                              size="small"
                              sx={{
                                color: hoveredCard === note.id ? notesTheme.secondary : alpha(notesTheme.text, 0.3),
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  color: notesTheme.secondary,
                                  transform: 'scale(1.2)',
                                }
                              }}
                            >
                              {hoveredCard === note.id ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                            </IconButton>
                          </Box>
                          
                          {/* Debug Info */}
                          {debugMode && (
                            <Box sx={{ mb: 2, p: 1.5, background: alpha('#f44336', 0.1), borderRadius: 2, border: '1px dashed #f44336' }}>
                              <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600, display: 'block' }}>
                                Note ID: {note.id}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600, display: 'block' }}>
                                User ID: {note.userId || 'MISSING!'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600, display: 'block' }}>
                                Current User: {user?.uid}
                              </Typography>
                              <Typography variant="caption" sx={{ color: note.userId === user?.uid ? '#4caf50' : '#f44336', fontWeight: 600, display: 'block' }}>
                                Match: {note.userId === user?.uid ? '✓ YES' : '✗ NO'}
                              </Typography>
                            </Box>
                          )}
                          
                          {/* Note Content Preview */}
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.6,
                              mb: 3,
                              color: notesTheme.textLight,
                              fontSize: '0.9rem'
                            }}
                          >
                            {note.content || 'No content yet. Start writing your thoughts and ideas...'}
                          </Typography>
                          
                          {/* Note Metadata */}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mt: 'auto',
                            pt: 2,
                            borderTop: `1px solid ${alpha(notesTheme.border, 0.5)}`
                          }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: notesTheme.textLight, fontWeight: 600, display: 'block', fontSize: '0.75rem' }}>
                                {formatDate(note.updatedAt)}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 12, color: notesTheme.textLight }} />
                                <Typography variant="caption" sx={{ color: notesTheme.textLight, fontSize: '0.7rem' }}>
                                  {getReadingTime(note.content)} min read
                                </Typography>
                              </Box>
                            </Box>
                            <Chip 
                              icon={note.isPublic ? <ShareIcon /> : <LockIcon />}
                              label={note.isPublic ? "Sharable" : "Private"} 
                              size="small"
                              variant="filled"
                              sx={{ 
                                fontSize: '0.7rem', 
                                height: 24,
                                background: note.isPublic 
                                  ? `linear-gradient(135deg, ${notesTheme.accent} 0%, #34d399 100%)`
                                  : `linear-gradient(135deg, ${notesTheme.primary} 0%, ${notesTheme.primaryLight} 100%)`,
                                fontWeight: 600,
                                color: 'white'
                              }}
                            />
                          </Box>
                        </CardContent>
                        
                        {/* Actions */}
                        <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/note/edit/${note.id}`)}
                            variant="outlined"
                            sx={{ 
                              flex: 1,
                              borderRadius: 2,
                              fontWeight: 600,
                              border: `1px solid ${alpha(notesTheme.primary, 0.3)}`,
                              color: notesTheme.primary,
                              fontSize: '0.8rem',
                              '&:hover': {
                                border: `1px solid ${notesTheme.primary}`,
                                background: alpha(notesTheme.primary, 0.05),
                                transform: 'translateY(-1px)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            Edit
                          </Button>
                          
                          {/* Share button - only for public notes */}
                          {note.isPublic && (
                            <Tooltip title="Share note">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(note);
                                }}
                                sx={{
                                  borderRadius: 2,
                                  border: `1px solid ${alpha(notesTheme.accent, 0.3)}`,
                                  color: notesTheme.accent,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    border: `1px solid ${alpha(notesTheme.accent, 0.5)}`,
                                    background: alpha(notesTheme.accent, 0.05),
                                    transform: 'translateY(-1px)'
                                  }
                                }}
                              >
                                <IosShareIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="More options">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, note);
                              }}
                              sx={{
                                borderRadius: 2,
                                border: `1px solid ${alpha(notesTheme.textLight, 0.2)}`,
                                color: notesTheme.textLight,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  border: `1px solid ${alpha(notesTheme.textLight, 0.4)}`,
                                  background: alpha(notesTheme.textLight, 0.05),
                                  transform: 'translateY(-1px)'
                                }
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Container>

        {/* Menu for more options */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 200,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: `1px solid ${notesTheme.border}`,
            }
          }}
        >
          {selectedNote?.isPublic && (
            <MenuItem onClick={handleMenuShare}>
              <ListItemIcon>
                <IosShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share</ListItemText>
            </MenuItem>
          )}
          <MenuItem 
            onClick={() => {
              if (selectedNote) {
                handleDelete(selectedNote.id);
              }
              handleMenuClose();
            }}
            sx={{ color: '#ef4444' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Floating Action Buttons */}
        <Box sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          zIndex: 1000 
        }}>
 
        </Box>
      </Box>
    </Layout>
  );
}