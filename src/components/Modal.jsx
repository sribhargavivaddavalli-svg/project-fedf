import React, { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, title, children, className = '' }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className={`modal-content ${className}`} ref={modalRef}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;