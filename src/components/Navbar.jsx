import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header>
      <nav>
        <div className="logo">SevaTrack</div>
        <ul>
          {/* Show Home & About only when NOT logged in */}
          {!currentUser && (
            <>
              <li><Link to="/" className={isActive('/')}>Home</Link></li>
              <li><Link to="/about" className={isActive('/about')}>About</Link></li>
            </>
          )}

          {/* Services – visible to everyone except admin */}
          {currentUser?.role !== 'admin' && (
            <li><Link to="/services" className={isActive('/services')}>Services</Link></li>
          )}

          {/* Registration & Login – only when not logged in */}
          {!currentUser && (
            <>
              <li><Link to="/register" className={isActive('/register')}>Registration</Link></li>
              <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
            </>
          )}

          {/* Citizen navigation */}
          {currentUser && currentUser.role === 'citizen' && (
            <>
              <li><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
              <li><Link to="/profile" className={isActive('/profile')}>Profile</Link></li>
              <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1F2937', fontWeight: 500 }}>Logout</button></li>
            </>
          )}

          {/* Admin navigation */}
          {currentUser && currentUser.role === 'admin' && (
            <>
              <li><Link to="/admin" className={isActive('/admin')}>Admin</Link></li>
              <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1F2937', fontWeight: 500 }}>Logout</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;