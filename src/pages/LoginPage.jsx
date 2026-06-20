import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { seedDefaultUsers } from '../utils/localStorage';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    seedDefaultUsers(); // ensure admin and sample users exist
    if (currentUser) {
      if (currentUser.role === 'admin') navigate('/admin');
      else if (currentUser.role === 'citizen') navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    const result = login(username, password);
    if (result.success) {
      setError('');
      // Redirect happens via useEffect after currentUser changes
    } else {
      setError(result.error || 'Invalid username or password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form id="adminLoginForm" onSubmit={handleSubmit}>
          <input type="text" id="loginUsername" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" id="loginPassword" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          {error && <div id="loginError" className="error">{error}</div>}
        </form>
        <p style={{ marginTop: '15px', fontSize: '14px' }}>
          Demo: admin / admin123 &nbsp;|&nbsp; ramesh123 / user123 &nbsp;|&nbsp; sita_dev / sita@123
        </p>
      </div>
    </div>
  );
}

export default LoginPage;