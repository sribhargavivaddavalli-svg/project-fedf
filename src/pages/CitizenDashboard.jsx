import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApplications, getNotifications } from '../utils/localStorage';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { jsPDF } from 'jspdf';

function CitizenDashboard() {
  const { currentUser, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const loadData = () => {
    if (!currentUser) return;
    const allApps = getApplications();
    const filtered = allApps.filter(app =>
      app.mobile === currentUser.mobile ||
      app.email === currentUser.email ||
      (app.name && app.name.toLowerCase() === (currentUser.fullname || '').toLowerCase())
    );
    setApps(filtered);

    const allNotifs = getNotifications();
    const filteredNotifs = allNotifs.filter(n => n.mobile === currentUser.mobile).slice(0, 8);
    setNotifs(filteredNotifs);
  };

  useEffect(() => {
    loadData();
    // Polling every 5 seconds
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const getStatusClass = (status) => {
    const s = (status || 'Pending').toLowerCase();
    if (s === 'pending') return 'status-pending';
    if (s === 'processing') return 'status-processing';
    if (s === 'approved') return 'status-approved';
    return 'status-rejected';
  };

  const viewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const downloadCertificate = (app) => {
    if (app.status !== 'Approved') {
      setToast({ message: 'Certificate only available for approved applications.', type: 'error' });
      return;
    }
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 95);
    doc.text('SEVATRACK CERTIFICATE', 105, 30, { align: 'center' });
    doc.setDrawColor(32, 201, 181);
    doc.setLineWidth(1);
    doc.rect(15, 15, 180, 270);
    doc.setDrawColor(200, 200, 200);
    doc.rect(18, 18, 174, 264);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const issueDate = new Date().toLocaleDateString('en-IN');
    const lines = [
      'This is to certify that', '',
      `Name: ${app.name}`,
      `Service: ${app.service}`,
      `Reference ID: ${app.referenceId}`,
      `Date of Issue: ${issueDate}`,
      'Status: APPROVED', '',
      'This certificate is generated as an official demo document',
      'for the Meeseva Citizen Registration Portal (SevaTrack).', '',
      'For verification, please visit:',
      `https://sevatrack.gov.in/verify/${app.referenceId}`, '',
      'Digitally signed by SevaTrack Authority'
    ];
    let y = 80;
    lines.forEach(line => {
      if (line === '') y += 8;
      else { doc.text(line, 25, y); y += 10; }
    });
    doc.save(`Certificate_${app.referenceId}.pdf`);
    setToast({ message: `📄 Certificate downloaded: ${app.referenceId}.pdf`, type: 'success' });
  };

  const total = apps.length;
  const pending = apps.filter(a => a.status === 'Pending').length;
  const processing = apps.filter(a => a.status === 'Processing').length;
  const approved = apps.filter(a => a.status === 'Approved').length;

  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <div>
          <h2>Welcome, {currentUser?.fullname || 'Citizen'}!</h2>
          <p>Track your applications & get updates</p>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-number">{total}</div><div>Total Applications</div></div>
        <div className="stat-card"><div className="stat-number">{pending}</div><div>Pending</div></div>
        <div className="stat-card"><div className="stat-number">{processing}</div><div>Processing</div></div>
        <div className="stat-card"><div className="stat-number">{approved}</div><div>Approved</div></div>
      </div>

      <h3 className="section-title">My Applications</h3>
      <div className="applications-table">
        <table>
          <thead><tr><th>Ref ID</th><th>Service</th><th>Applied Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {apps.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No applications found. <a href="/services">Apply now</a></td></tr>
            ) : (
              apps.map(app => (
                <tr key={app.referenceId}>
                  <td><strong>{app.referenceId}</strong></td>
                  <td>{app.service}</td>
                  <td>{app.appliedDate}</td>
                  <td><span className={getStatusClass(app.status)}>{app.status}</span></td>
                  <td>
                    <button className="btn-sm" onClick={() => viewDetails(app)}>View</button>
                    {app.status === 'Approved' && (
                      <button className="btn-sm-outline" onClick={() => downloadCertificate(app)}>Cert.</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 className="section-title"><i className="fas fa-certificate"></i> My Certificates</h3>
      <div className="applications-table" style={{ background: 'white', padding: '20px' }}>
        {apps.filter(a => a.status === 'Approved').length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>No certificates issued yet.</p>
        ) : (
          <table>
            <thead><tr><th>Certificate ID</th><th>Service</th><th>Issue Date</th><th>Action</th></tr></thead>
            <tbody>
              {apps.filter(a => a.status === 'Approved').map(app => (
                <tr key={app.referenceId}>
                  <td>{app.referenceId}</td>
                  <td>{app.service}</td>
                  <td>{app.appliedDate}</td>
                  <td><button className="btn-sm" onClick={() => downloadCertificate(app)}><i className="fas fa-download"></i> Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h3 className="section-title">Recent Notifications</h3>
      <div className="notifications-list">
        {notifs.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No notifications</p>
        ) : (
          notifs.map(n => (
            <div className="notification-item" key={n.id}>
              <div className="notification-icon"><i className={`fas ${n.icon || 'fa-bell'}`}></i></div>
              <div><strong>{n.title || 'Status Update'}</strong><p>{n.message}</p><small>{n.time || 'Just now'}</small></div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Application Details">
        {selectedApp && (
          <div id="modalDetailContent">
            <div className="detail-row"><strong>Ref ID:</strong> {selectedApp.referenceId}</div>
            <div className="detail-row"><strong>Service:</strong> {selectedApp.service}</div>
            <div className="detail-row"><strong>Applicant:</strong> {selectedApp.name}</div>
            <div className="detail-row"><strong>Mobile:</strong> {selectedApp.mobile}</div>
            <div className="detail-row"><strong>Email:</strong> {selectedApp.email || '—'}</div>
            <div className="detail-row"><strong>Applied:</strong> {selectedApp.appliedDate}</div>
            <div className="detail-row"><strong>Status:</strong> <span className={getStatusClass(selectedApp.status)}>{selectedApp.status}</span></div>
            <div className="detail-row"><strong>Remarks:</strong> {selectedApp.remarks || 'Under process'}</div>
            <div className="timeline-simple">
              <h4>Progress</h4>
              {[
                { name: 'Application Submitted', completed: true },
                { name: 'Document Verification', completed: selectedApp.status !== 'Pending' },
                { name: 'Officer Review', completed: selectedApp.status === 'Approved' || selectedApp.status === 'Processing' },
                { name: 'Certificate Issued', completed: selectedApp.status === 'Approved' }
              ].map((step, idx) => (
                <div className="timeline-step" key={idx}>
                  <div className={`step-bullet ${step.completed ? 'completed' : ''}`}>{step.completed ? '✓' : '○'}</div>
                  <div className="step-text"><strong>{step.name}</strong><small>{step.completed ? 'Completed' : 'Pending'}</small></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default CitizenDashboard;