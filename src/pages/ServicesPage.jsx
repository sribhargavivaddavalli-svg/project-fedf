import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApplications, setApplications, getUsers, setUsers } from '../utils/localStorage';
import { generateRefId } from '../utils/helpers';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';

function ServicesPage() {
  const { currentUser } = useAuth();
  const [displayedService, setDisplayedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.fullname || '',
    mobile: currentUser?.mobile || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
  });
  const [modalMessage, setModalMessage] = useState({ text: '', type: '' });
  const [toast, setToast] = useState(null);

  const serviceData = {
    'Certificates': { title: '📃 Certificates', items: ['Income Certificate', 'Caste Certificate', 'Domicile Certificate', 'Birth Certificate', 'Marriage Certificate', 'EWS Certificate'] },
    'Land Records': { title: '🏞️ Land Records', items: ['Encumbrance Certificate - (2-3 days)', 'Patta/Chitta - (Instant)', 'Land Mutation - (15-20 days)', 'Records of Rights (RoR) - (Instant)'] },
    'Welfare Schemes': { title: '🤝 Welfare Schemes', items: ['Old Age Pension', 'Widow Pension', 'Disability Pension'] },
    'Education': { title: '🎓 Education', items: ['Transfer Certificate - 3 days', 'Scholarship - 30 days'] },
    'RTO Services': { title: '🚗 RTO Services', items: ['Driving License - (30 days)', 'RC Download - (Instant)', 'Vehicle Fitness - (7 days)'] },
    'Health Services': { title: '🏥 Health Services', items: ['Ayushman Card - (₹5 lakh cover)', 'ABHA ID', 'Telemedicine'] },
    'Police & Legal': { title: '⚖️ Police & Legal', items: ['Police Clearance Certificate', 'Legal Heir Certificate'] },
    'Employment': { title: '👷 Employment', items: ['Job Seeker Registration', 'Skill Certificate'] },
    'Agriculture': { title: '🌾 Agriculture', items: ['Crop Insurance', 'Farm Subsidy'] },
    'Housing': { title: '🏘️ Housing', items: ['Housing Loan Subsidy', 'Building Plan Approval'] },
    'Minority Welfare': { title: '🕌 Minority Welfare', items: ['Minority Scholarship', 'Haj Subsidy'] },
  };

  const handleDisplay = (serviceName) => {
    const data = serviceData[serviceName] || { title: serviceName, items: ['Service details coming soon...'] };
    setDisplayedService({ name: serviceName, ...data });
  };

  const handleApply = () => {
    if (!currentUser) {
      setToast({ message: 'Please login to apply for services.', type: 'error' });
      return;
    }
    setFormData({
      name: currentUser.fullname || '',
      mobile: currentUser.mobile || '',
      email: currentUser.email || '',
      address: currentUser.address || '',
    });
    setModalMessage({ text: '', type: '' });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, mobile, email, address } = formData;
    if (!name || !mobile || !email) {
      setModalMessage({ text: '❌ Please fill all required fields.', type: 'error' });
      return;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
      setModalMessage({ text: '❌ Mobile must be 10 digits.', type: 'error' });
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setModalMessage({ text: '❌ Enter a valid email.', type: 'error' });
      return;
    }

    const refId = generateRefId();
    const today = new Date().toLocaleString();
    const allApplications = getApplications();
    allApplications.unshift({
      referenceId: refId,
      service: displayedService.name,
      name,
      mobile,
      email,
      address,
      appliedDate: today,
      status: 'Processing',
      remarks: ''
    });
    setApplications(allApplications);

    // Save user if new
    const users = getUsers();
    if (!users.some(u => u.mobile === mobile)) {
      users.push({ fullname: name, mobile, email, address, registeredDate: today });
      setUsers(users);
    }

    setModalMessage({ text: `✅ Application submitted! Ref: ${refId}`, type: 'success' });
    // Disable submit button briefly? Not needed.

    // Auto-close after 2 seconds
    setTimeout(() => {
      setShowModal(false);
      setToast({ message: `📄 Application submitted! Ref: ${refId}`, type: 'success' });
    }, 2000);
  };

  return (
    <div>
      <h2 className="section-title" style={{ marginLeft: '8%' }}>Services</h2>
      <div className="services-tags" style={{ margin: '0 8%' }}>
        {Object.keys(serviceData).map(svc => (
          <span className="tag" key={svc} onClick={() => handleDisplay(svc)} style={{ cursor: 'pointer' }}>
            {svc}
          </span>
        ))}
      </div>

      <div className="service-display" id="ServiceDisplay">
        {displayedService ? (
          <div>
            <h3>{displayedService.title}</h3>
            <ul>
              {displayedService.items.map((item, idx) => <li key={idx}>✔️ {item}</li>)}
            </ul>
            <button className="apply-btn" onClick={handleApply}>Apply Now →</button>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#999' }}>Click on any service to view details</p>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Apply for ${displayedService?.name || ''}`}>
        <form onSubmit={handleSubmit} id="applicationForm">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mobile Number *</label>
            <input type="tel" name="mobile" maxLength="10" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address (optional)</label>
            <textarea name="address" rows="2" value={formData.address} onChange={handleChange}></textarea>
          </div>
          <div className="modal-buttons">
            <button type="submit" className="btn-submit">Submit</button>
            <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
          {modalMessage.text && (
            <div className={`modal-message ${modalMessage.type}`} style={{ display: 'block' }}>
              {modalMessage.text}
            </div>
          )}
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default ServicesPage;