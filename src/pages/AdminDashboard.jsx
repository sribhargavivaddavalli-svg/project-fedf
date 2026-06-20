import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, getApplications, setApplications, setNotifications } from '../utils/localStorage';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const loadData = () => {
    const allUsers = getUsers();
    const allApps = getApplications();
    setUsers(allUsers);
    setApps(allApps);
    setFilteredApps(allApps);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = apps.filter(app => {
      const matchSearch = app.referenceId.toLowerCase().includes(search.toLowerCase()) ||
                          app.mobile.includes(search);
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
    setFilteredApps(filtered);
  }, [apps, search, statusFilter]);

  const handleStatusChange = (refId, newStatus) => {
    const idx = apps.findIndex(a => a.referenceId === refId);
    if (idx !== -1) {
      const updatedApps = [...apps];
      updatedApps[idx].status = newStatus;
      setApplications(updatedApps);
      setApps(updatedApps);

      // Add notification
      const notifs = JSON.parse(localStorage.getItem('sevaTrackNotifications') || '[]');
      notifs.unshift({
        id: Date.now(),
        title: `Application ${newStatus}`,
        message: `Your application ${refId} has been ${newStatus}.`,
        icon: newStatus === 'Approved' ? 'fa-check-circle' : 'fa-times-circle',
        time: new Date().toLocaleString(),
        mobile: updatedApps[idx].mobile
      });
      setNotifications(notifs);

      setToast({ message: `Application ${refId} ${newStatus}`, type: 'success' });
    }
  };

  const viewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const citizenCount = users.filter(u => u.role !== 'admin').length;
  const totalApps = apps.length;
  const pending = apps.filter(a => a.status === 'Pending').length;
  const approved = apps.filter(a => a.status === 'Approved').length;

  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <div><h2><i className="fas fa-user-shield"></i> Admin Panel</h2><p>Manage citizens and applications</p></div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="stats-grid" id="statsGrid">
        <div className="stat-card"><div className="stat-number">{citizenCount}</div><div>Total Citizens</div></div>
        <div className="stat-card"><div className="stat-number">{totalApps}</div><div>Total Applications</div></div>
        <div className="stat-card"><div className="stat-number">{pending}</div><div>Pending Approval</div></div>
        <div className="stat-card"><div className="stat-number">{approved}</div><div>Approved</div></div>
      </div>

      <h3 className="section-title"><i className="fas fa-users"></i> Registered Citizens</h3>
      <div className="applications-table">
        <table>
          <thead><tr><th>Name</th><th>Mobile</th><th>Email</th><th>Registered Date</th></tr></thead>
          <tbody id="usersTableBody">
            {users.filter(u => u.role !== 'admin').map(u => (
              <tr key={u.username}>
                <td>{u.fullname || ''}</td>
                <td>{u.mobile}</td>
                <td>{u.email}</td>
                <td>{u.registeredDate || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="section-title"><i className="fas fa-file-alt"></i> All Applications</h3>
      <div className="filter-bar">
        <input type="text" id="searchInput" placeholder="Search by Ref ID or Mobile" value={search} onChange={e => setSearch(e.target.value)} />
        <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="applications-table">
        <table>
          <thead><tr><th>Ref ID</th><th>Service</th><th>Applicant</th><th>Mobile</th><th>Applied Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody id="appsTableBody">
            {filteredApps.map(app => (
              <tr key={app.referenceId}>
                <td>{app.referenceId}</td>
                <td>{app.service}</td>
                <td>{app.name}</td>
                <td>{app.mobile}</td>
                <td>{app.appliedDate}</td>
                <td><span className={`status-${app.status.toLowerCase()}`}>{app.status}</span></td>
                <td>
                  <button className="btn-approve" onClick={() => handleStatusChange(app.referenceId, 'Approved')}>Approve</button>
                  <button className="btn-reject" onClick={() => handleStatusChange(app.referenceId, 'Rejected')}>Reject</button>
                  <button className="btn-view" onClick={() => viewDetails(app)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Application Details" className="large-modal">
        {selectedApp && (
          <div id="modalDetails">
            <div><strong>Reference ID:</strong> {selectedApp.referenceId}</div>
            <div><strong>Service:</strong> {selectedApp.service}</div>
            <div><strong>Name:</strong> {selectedApp.name}</div>
            <div><strong>Mobile:</strong> {selectedApp.mobile}</div>
            <div><strong>Email:</strong> {selectedApp.email || 'N/A'}</div>
            <div><strong>Address:</strong> {selectedApp.address || 'N/A'}</div>
            <div><strong>Applied Date:</strong> {selectedApp.appliedDate}</div>
            <div><strong>Status:</strong> <span className={`status-${selectedApp.status.toLowerCase()}`}>{selectedApp.status}</span></div>
            <div><strong>Remarks:</strong> {selectedApp.remarks || 'No remarks'}</div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default AdminDashboard;