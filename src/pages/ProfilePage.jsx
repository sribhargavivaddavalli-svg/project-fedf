import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, setUsers } from '../utils/localStorage';
import Toast from '../components/Toast';

function ProfilePage() {
  const { currentUser, updateUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const users = getUsers();
      const found = users.find(u => u.username === currentUser.username);
      if (found) {
        setUser(found);
        setFormData({
          fullname: found.fullname || '',
          mobile: found.mobile || '',
          email: found.email || '',
          address: found.address || '',
          dob: found.dob || '',
          gender: found.gender || '',
          aadhaar: found.aadhaar || '',
          state: found.state || '',
          pincode: found.pincode || '',
        });
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const { fullname, mobile, email, address, dob, gender, aadhaar, state, pincode } = formData;
    if (mobile && (mobile.length !== 10 || isNaN(mobile))) {
      setMessage({ text: 'Mobile must be 10 digits.', type: 'error' });
      return;
    }
    if (email && (!email.includes('@') || !email.includes('.'))) {
      setMessage({ text: 'Invalid email.', type: 'error' });
      return;
    }
    if (aadhaar && (aadhaar.length !== 12 || isNaN(aadhaar))) {
      setMessage({ text: 'Aadhaar must be 12 digits.', type: 'error' });
      return;
    }

    const updatedUser = {
      ...user,
      fullname,
      mobile,
      email,
      address,
      dob,
      gender,
      aadhaar,
      state,
      pincode,
    };
    const users = getUsers();
    const idx = users.findIndex(u => u.username === user.username);
    if (idx !== -1) {
      users[idx] = updatedUser;
      setUsers(users);
      updateUser(updatedUser);
      setUser(updatedUser);
      setEditMode(false);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setToast({ message: 'Profile updated!', type: 'success' });
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container" id="profileContainer">
      <div className={`profile-card ${editMode ? 'edit-mode' : ''}`}>
        <div className="profile-header">
          <h2><i className="fas fa-user-circle"></i> My Profile</h2>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
        <div className="profile-body">
          <div className="info-row">
            <div className="info-label">Full Name</div>
            <div className="info-value">{user.fullname}</div>
            <div className="edit-field"><input type="text" id="editFullname" name="fullname" value={formData.fullname} onChange={handleChange} /></div>
          </div>
          <div className="info-row">
            <div className="info-label">Username</div>
            <div className="info-value">{user.username}</div>
            <div className="edit-field"><input type="text" id="editUsername" value={user.username} disabled /></div>
          </div>
          <div className="info-row">
            <div className="info-label">Mobile</div>
            <div className="info-value">{user.mobile}</div>
            <div className="edit-field"><input type="tel" id="editMobile" name="mobile" value={formData.mobile} onChange={handleChange} maxLength="10" /></div>
          </div>
          <div className="info-row">
            <div className="info-label">Email</div>
            <div className="info-value">{user.email}</div>
            <div className="edit-field"><input type="email" id="editEmail" name="email" value={formData.email} onChange={handleChange} /></div>
          </div>
          <div className="info-row">
            <div className="info-label">Address</div>
            <div className="info-value">{user.address || ''}</div>
            <div className="edit-field"><textarea id="editAddress" name="address" value={formData.address} onChange={handleChange}></textarea></div>
          </div>
          <div className="info-row">
            <div className="info-label">Date of Birth</div>
            <div className="info-value">{user.dob || ''}</div>
            <div className="edit-field"><input type="date" id="editDob" name="dob" value={formData.dob} onChange={handleChange} /></div>
          </div>
          <div className="info-row">
            <div className="info-label">Gender</div>
            <div className="info-value">{user.gender || ''}</div>
            <div className="edit-field">
              <select id="editGender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="info-row">
            <div className="info-label">Aadhaar Number</div>
            <div className="info-value">{user.aadhaar ? '**** **** ' + user.aadhaar.slice(-4) : 'Not provided'}</div>
            <div className="edit-field"><input type="text" id="editAadhaar" name="aadhaar" value={formData.aadhaar} onChange={handleChange} maxLength="12" placeholder="12-digit Aadhaar" /></div>
          </div>
          <div className="info-row">
            <div className="info-label">State</div>
            <div className="info-value">{user.state || ''}</div>
            <div className="edit-field"><input type="text" id="editState" name="state" value={formData.state} onChange={handleChange} /></div>
          </div>
          <div className="info-row">
            <div className="info-label">Pincode</div>
            <div className="info-value">{user.pincode || ''}</div>
            <div className="edit-field"><input type="text" id="editPincode" name="pincode" value={formData.pincode} onChange={handleChange} /></div>
          </div>
          <div className="action-buttons">
            {!editMode ? (
              <button className="btn-edit" id="editBtn" onClick={() => setEditMode(true)}><i className="fas fa-pen"></i> Edit Profile</button>
            ) : (
              <>
                <button className="btn-save" id="saveBtn" onClick={handleSave}><i className="fas fa-save"></i> Save</button>
                <button className="btn-cancel" id="cancelBtn" onClick={() => { setEditMode(false); setFormData({...user}); }}><i className="fas fa-times"></i> Cancel</button>
              </>
            )}
          </div>
          {message.text && (
            <div id="profileMessage" className={`message ${message.type}`} style={{ display: 'block' }}>
              {message.text}
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default ProfilePage;