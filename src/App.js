import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import NoteEditor from './pages/NoteEditor';
import Profile from './pages/Profile';
import Settings from './pages/Settings';


function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          {/* Main route set to Signup as requested */}
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />

          {/* Note routes */}
          <Route path="/note/new" element={<NoteEditor />} />
          <Route path="/note/edit/:id" element={<NoteEditor />} />
          
          {/* Profile and Settings routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          
          

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}


export default App;
