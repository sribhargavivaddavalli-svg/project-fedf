import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '72px', color: '#1e3a5f' }}>404</h1>
      <p style={{ fontSize: '24px' }}>Page Not Found</p>
      <Link to="/" className="cta-button" style={{ display: 'inline-block', marginTop: '20px' }}>Go Home</Link>
    </div>
  );
}

export default NotFoundPage;