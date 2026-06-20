import React, { useEffect } from 'react';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#1e3a5f';

  return (
    <div style={{
      position: 'fixed',
      bottom: '25px',
      right: '25px',
      background: bgColor,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '40px',
      zIndex: 9999,
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(4px)',
      fontFamily: "'Poppins', sans-serif",
    }}>
      {message}
    </div>
  );
}

export default Toast;