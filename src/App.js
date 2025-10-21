import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './Auth';
import Notes from './Notes';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>📝 Note Me</h1>
        <p style={styles.subtitle}>
          Your personal note-sharing application
        </p>
      </header>
      
      <Auth user={user} />
      
      {user && <Notes user={user} />}
      
      {!user && (
        <div style={styles.welcomeSection}>
          <h2>Welcome to Note Me!</h2>
          <p>A simple yet powerful note-sharing application designed to help you easily create, organize, and manage your personal notes in one place.</p>
          <ul style={styles.featureList}>
            <li>✅ Create and organize notes effortlessly</li>
            <li>🔒 Secure authentication with Firebase</li>
            <li>☁️ Real-time synchronization across devices</li>
            <li>🔐 Private notes - only you can access your data</li>
            <li>✏️ Easy editing and deletion of notes</li>
          </ul>
          <p>Sign in or create an account to get started!</p>
        </div>
      )}
      
      <footer style={styles.footer}>
        <p>&copy; 2025 Note Me App. Built with React & Firebase.</p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '36px',
  },
  subtitle: {
    margin: '0',
    fontSize: '16px',
    opacity: '0.9',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  loader: {
    fontSize: '24px',
    color: '#007bff',
    fontWeight: 'bold',
  },
  welcomeSection: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  featureList: {
    textAlign: 'left',
    maxWidth: '500px',
    margin: '20px auto',
    lineHeight: '2',
    listStyle: 'none',
    padding: '0',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    marginTop: '40px',
    color: '#666',
    fontSize: '14px',
  },
};

export default App;
