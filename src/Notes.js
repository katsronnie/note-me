import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

function Notes({ user }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for user's notes
    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      if (editingId) {
        // Update existing note
        const noteRef = doc(db, 'notes', editingId);
        await updateDoc(noteRef, {
          title: title.trim(),
          content: content.trim(),
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
      } else {
        // Create new note
        await addDoc(collection(db, 'notes'), {
          title: title.trim(),
          content: content.trim(),
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Error saving note:', err);
      alert('Failed to save note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note. Please try again.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.formSection}>
        <h2 style={styles.formTitle}>
          {editingId ? 'Edit Note' : 'Create New Note'}
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="6"
            style={{...styles.input, ...styles.textarea}}
          />
          <div style={styles.buttonGroup}>
            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? 'Saving...' : (editingId ? 'Update Note' : 'Add Note')}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={cancelEdit}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.notesSection}>
        <h2 style={styles.notesTitle}>My Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No notes yet. Create your first note above!</p>
          </div>
        ) : (
          <div style={styles.notesGrid}>
            {notes.map((note) => (
              <div key={note.id} style={styles.noteCard}>
                <h3 style={styles.noteTitle}>{note.title}</h3>
                <p style={styles.noteContent}>{note.content}</p>
                <div style={styles.noteFooter}>
                  <span style={styles.noteDate}>
                    {note.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                  </span>
                  <div style={styles.noteActions}>
                    <button
                      onClick={() => handleEdit(note)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  formTitle: {
    marginTop: '0',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '120px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  notesSection: {
    marginTop: '30px',
  },
  notesTitle: {
    marginBottom: '20px',
    color: '#333',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#6c757d',
  },
  notesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  noteCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  noteTitle: {
    marginTop: '0',
    marginBottom: '10px',
    color: '#333',
    fontSize: '18px',
  },
  noteContent: {
    flex: 1,
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '15px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  noteFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
  },
  noteDate: {
    fontSize: '12px',
    color: '#999',
  },
  noteActions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Notes;
