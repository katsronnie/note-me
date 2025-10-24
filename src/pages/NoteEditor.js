import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import ReactMarkdown from 'react-markdown';
import {
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  Paper,
  alpha,
  useTheme,
  Tabs,
  Tab,
  Chip,
  Tooltip,
  Fade,
  Zoom,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SendIcon from '@mui/icons-material/Send';
import Layout from '../components/Layout';

export default function NoteEditor() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const textAreaRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Blue theme colors to match Home page
  const blueTheme = {
    primary: '#3557ffff',
    primaryLight: '#3557ffff',
    primaryDark: '#3557ffff',
    background: '#F5F7FA',
    text: '#1A202C',
  };

  useEffect(() => {
    if (id) {
      loadNote();
    }
  }, [id]);

  useEffect(() => {
    // Calculate word count
    const words = content.trim() ? content.split(/\s+/).filter(word => word.length > 0).length : 0;
    setWordCount(words);
  }, [content]);

  const loadNote = async () => {
    try {
      const docRef = doc(db, 'notes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || '');
        setContent(data.content || '');
        setIsPublic(!!data.isPublic);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setLoading(true);

    try {
      if (id) {
        // Update existing note
        const noteRef = doc(db, 'notes', id);
        await updateDoc(noteRef, {
          title: title.trim(),
          content: content.trim(),
          isPublic,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new note
        await addDoc(collection(db, 'notes'), {
          userId: auth.currentUser.uid,
          title: title.trim(),
          content: content.trim(),
          isPublic,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      navigate('/home');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setImageUploading(true);

    try {
      // Create a unique filename
      const filename = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `note-images/${auth.currentUser.uid}/${filename}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const imageUrl = await getDownloadURL(storageRef);
      
      // Insert markdown image syntax with the actual URL
      const markdownImage = `\n![${file.name}](${imageUrl})\n`;
      setContent(prev => prev + markdownImage);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleAIAssist = () => {
    setAiDialogOpen(true);
  };

  const handleAISubmit = async () => {
    if (!aiPrompt.trim()) return;

    setAiProcessing(true);

    try {
      // Simulate AI processing (replace with actual AI API call)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock AI responses based on common requests
      let aiResponse = '';
      const prompt = aiPrompt.toLowerCase();

      if (prompt.includes('summarize') || prompt.includes('summary')) {
        aiResponse = `## Summary\n\n${content ? 'Here is a concise summary of your note:\n\n' + content.substring(0, 200) + '...' : 'Your note is empty. Start writing to get a summary.'}`;
      } else if (prompt.includes('improve') || prompt.includes('enhance') || prompt.includes('better')) {
        aiResponse = `✨ **Enhanced Version:**\n\n${content}\n\n*This version includes improved clarity and structure.*`;
      } else if (prompt.includes('bullet') || prompt.includes('list')) {
        const lines = content.split('\n').filter(l => l.trim());
        aiResponse = '## Key Points:\n\n' + lines.slice(0, 5).map(line => `- ${line.trim()}`).join('\n');
      } else if (prompt.includes('expand') || prompt.includes('elaborate')) {
        aiResponse = content + '\n\n**Additional Context:** ' + prompt;
      } else if (prompt.includes('title') || prompt.includes('heading')) {
        const words = content.split(' ').slice(0, 5).join(' ');
        setTitle(words || 'New Title');
        aiResponse = '✓ Title updated!';
      } else if (prompt.includes('format') || prompt.includes('structure')) {
        aiResponse = `# ${title || 'Document Title'}\n\n## Introduction\n\n${content}\n\n## Conclusion\n\nYour thoughts here.`;
      } else {
        // General AI response
        aiResponse = `📝 **AI Response to "${aiPrompt}":**\n\n${content || 'Based on your request, I can help you with:\n- Writing assistance\n- Content improvement\n- Formatting suggestions\n- Summarization\n\nPlease add some content first, then ask me to help!'}`;
      }

      setContent(aiResponse);
      setAiPrompt('');
      setAiDialogOpen(false);
    } catch (error) {
      console.error('AI Error:', error);
      alert('AI processing failed. Please try again.');
    } finally {
      setAiProcessing(false);
    }
  };

  // Keyboard shortcuts handler
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + B for Bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertMarkdown('**', '**', 'bold text');
    }
    // Ctrl/Cmd + I for Italic
    else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertMarkdown('*', '*', 'italic text');
    }
    // Ctrl/Cmd + K for Code
    else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      insertMarkdown('`', '`', 'code');
    }
    // Ctrl/Cmd + L for List
    else if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      insertMarkdown('- ', '', 'list item');
    }
    // Ctrl/Cmd + H for Heading
    else if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
      e.preventDefault();
      insertMarkdown('## ', '', 'Heading');
    }
    // Ctrl/Cmd + S for Save
    else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  // Insert markdown formatting at cursor position
  const insertMarkdown = (before, after, placeholder) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newContent = 
      content.substring(0, start) + 
      before + textToInsert + after + 
      content.substring(end);
    
    setContent(newContent);

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const getReadingTime = () => {
    return Math.ceil(wordCount / 200) || 1;
  };

  const markdownComponents = {
    h1: ({node, ...props}) => <Typography variant="h3" component="h1" sx={{ color: blueTheme.text, mt: 3, mb: 2, fontWeight: 700 }} {...props} />,
    h2: ({node, ...props}) => <Typography variant="h4" component="h2" sx={{ color: blueTheme.text, mt: 2.5, mb: 1.5, fontWeight: 600 }} {...props} />,
    h3: ({node, ...props}) => <Typography variant="h5" component="h3" sx={{ color: blueTheme.text, mt: 2, mb: 1, fontWeight: 600 }} {...props} />,
    p: ({node, ...props}) => <Typography variant="body1" sx={{ color: alpha(blueTheme.text, 0.9), lineHeight: 1.7, mb: 2 }} {...props} />,
    code: ({node, inline, ...props}) => 
      inline ? 
        <code style={{ background: alpha(blueTheme.primary, 0.1), padding: '2px 6px', borderRadius: 4, color: blueTheme.primaryDark, fontSize: '0.9em' }} {...props} /> :
        <pre style={{ background: alpha(blueTheme.primary, 0.05), padding: 16, borderRadius: 8, overflow: 'auto', border: `1px solid ${alpha(blueTheme.primary, 0.2)}`, marginBottom: 16 }} {...props} />,
    blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: `4px solid ${blueTheme.primary}`, background: alpha(blueTheme.primary, 0.05), margin: '16px 0', padding: '12px 20px', fontStyle: 'italic', color: alpha(blueTheme.text, 0.8) }} {...props} />,
    img: ({node, ...props}) => (
      <Box
        component="img"
        {...props}
        sx={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 2,
          my: 2,
          boxShadow: `0 4px 12px ${alpha(blueTheme.primary, 0.15)}`,
          border: `1px solid ${alpha(blueTheme.primary, 0.1)}`,
        }}
      />
    ),
  };

  return (
    <Layout showSearch={false}>
      <Box sx={{ 
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pb: 3,
      }}>
        {/* Header */}
        <Fade in={true} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Back to notes">
                  <IconButton 
                    onClick={() => navigate('/home')}
                    sx={{
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.15)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.25)',
                        transform: 'translateX(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="700">
                    {id ? 'Edit Note' : 'Create New Note'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    {wordCount} words • {getReadingTime()} min read
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'white',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {isPublic ? 'Public' : 'Private'}
                    </Typography>
                  }
                />
                
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'Saving...' : 'Save Note'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Editor and Preview */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Editor Panel */}
          <Zoom in={true} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              {/* Editor Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: `1px solid ${alpha(blueTheme.primary, 0.1)}`,
                background: alpha(blueTheme.primary, 0.05),
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <EditIcon sx={{ color: blueTheme.primary, fontSize: 20 }} />
                <Typography variant="h6" sx={{ color: blueTheme.text, fontWeight: 600 }}>
                  Editor
                </Typography>
                
                
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                />
                <Tooltip title={imageUploading ? "Uploading..." : "Add Image"}>
                  <label htmlFor="image-upload">
                    <IconButton 
                      size="small" 
                      component="span"
                      disabled={imageUploading}
                      sx={{
                        color: blueTheme.primary,
                        '&:hover': {
                          background: alpha(blueTheme.primary, 0.1),
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {imageUploading ? <CircularProgress size={20} /> : <ImageIcon />}
                    </IconButton>
                  </label>
                </Tooltip>
              </Box>

              {/* Editor Content */}
              <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                  placeholder="Enter a captivating title..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: blueTheme.primary,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: blueTheme.primary,
                    },
                  }}
                />

                {/* Formatting Toolbar */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  p: 1.5, 
                  background: alpha(blueTheme.primary, 0.05), 
                  borderRadius: 2,
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  <Tooltip title="Bold (Ctrl+B)">
                    <IconButton 
                      size="small" 
                      onClick={() => insertMarkdown('**', '**', 'bold text')}
                      sx={{ color: blueTheme.primary }}
                    >
                      <FormatBoldIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Italic (Ctrl+I)">
                    <IconButton 
                      size="small" 
                      onClick={() => insertMarkdown('*', '*', 'italic text')}
                      sx={{ color: blueTheme.primary }}
                    >
                      <FormatItalicIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Code (Ctrl+K)">
                    <IconButton 
                      size="small" 
                      onClick={() => insertMarkdown('`', '`', 'code')}
                      sx={{ color: blueTheme.primary }}
                    >
                      <CodeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="List (Ctrl+L)">
                    <IconButton 
                      size="small" 
                      onClick={() => insertMarkdown('- ', '', 'list item')}
                      sx={{ color: blueTheme.primary }}
                    >
                      <FormatListBulletedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                  <Tooltip title="Keyboard Shortcuts">
                    <IconButton 
                      size="small" 
                      onClick={() => setShowShortcuts(true)}
                      sx={{ color: blueTheme.textLight }}
                    >
                      <KeyboardIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  inputRef={textAreaRef}
                  variant="outlined"
                  placeholder="Start writing your thoughts... (Markdown supported)"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      alignItems: 'flex-start',
                      fontFamily: 'monospace',
                      '&.Mui-focused fieldset': {
                        borderColor: blueTheme.primary,
                      },
                    },
                  }}
                />

                {/* Markdown Tips */}
                <Paper sx={{ p: 2, background: alpha(blueTheme.primary, 0.05), borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: blueTheme.primary, fontWeight: 600 }}>
                    📝 Quick Tips:
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha(blueTheme.text, 0.7), ml: 1 }}>
                    Use toolbar buttons or keyboard shortcuts • Ctrl+S to save
                  </Typography>
                </Paper>
              </Box>
            </Paper>
          </Zoom>

          {/* Preview Panel */}
          <Zoom in={true} timeout={1000} style={{ transitionDelay: '200ms' }}>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              {/* Preview Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: `1px solid ${alpha(blueTheme.primary, 0.1)}`,
                background: alpha(blueTheme.primary, 0.05),
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <VisibilityIcon sx={{ color: blueTheme.primary, fontSize: 20 }} />
                <Typography variant="h6" sx={{ color: blueTheme.text, fontWeight: 600 }}>
                  Preview
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Chip 
                  label="Live" 
                  size="small" 
                  sx={{ 
                    fontSize: '0.7rem', 
                    height: 24,
                    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Preview Content */}
              <Box sx={{ flex: 1, p: 4, overflow: 'auto', maxHeight: '70vh' }}>
                {content || title ? (
                  <Box>
                    {title && (
                      <Typography variant="h3" component="h1" sx={{ mb: 3, color: blueTheme.text, fontWeight: 700 }}>
                        {title}
                      </Typography>
                    )}
                    <ReactMarkdown components={markdownComponents}>
                      {content}
                    </ReactMarkdown>
                  </Box>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 8, 
                    color: alpha(blueTheme.text, 0.4),
                  }}>
                    <AutoStoriesIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" gutterBottom>
                      Your preview will appear here
                    </Typography>
                    <Typography variant="body2">
                      Start typing in the editor to see the live preview
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Zoom>
        </Box>

        

        {/* Keyboard Shortcuts Dialog */}
        <Dialog 
          open={showShortcuts} 
          onClose={() => setShowShortcuts(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ 
            background: `linear-gradient(135deg, ${blueTheme.primary} 0%, ${blueTheme.primaryDark} 100%)`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <KeyboardIcon />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <FormatBoldIcon sx={{ color: blueTheme.primary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Bold Text" 
                  secondary="Ctrl + B or Cmd + B"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FormatItalicIcon sx={{ color: blueTheme.primary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Italic Text" 
                  secondary="Ctrl + I or Cmd + I"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CodeIcon sx={{ color: blueTheme.primary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Code Block" 
                  secondary="Ctrl + K or Cmd + K"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FormatListBulletedIcon sx={{ color: blueTheme.primary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Bullet List" 
                  secondary="Ctrl + L or Cmd + L"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography sx={{ color: blueTheme.primary, fontWeight: 'bold' }}>H</Typography>
                </ListItemIcon>
                <ListItemText 
                  primary="Heading" 
                  secondary="Ctrl + H or Cmd + H"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SaveIcon sx={{ color: blueTheme.primary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Save Note" 
                  secondary="Ctrl + S or Cmd + S"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setShowShortcuts(false)}
              variant="contained"
              sx={{
                borderRadius: 2,
                background: `linear-gradient(135deg, ${blueTheme.primary} 0%, ${blueTheme.primaryDark} 100%)`,
              }}
            >
              Got it!
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}