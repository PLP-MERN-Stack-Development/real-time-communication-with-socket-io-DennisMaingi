import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Login } from './pages/Login.jsx';
import { Chat } from './pages/Chat.jsx';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <Chat /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;