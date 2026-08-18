import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Check for stored session on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (e) {
        // Clear corrupt state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      user,
      token,
      isAuthenticated: true,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return authState.isAuthenticated ? (
    <Dashboard
      user={authState.user}
      token={authState.token}
      onLogout={handleLogout}
    />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} />
  );
}

export default App;
