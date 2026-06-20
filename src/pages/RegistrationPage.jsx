import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockVerifyAadhaar, mockPincodeData } from '../utils/mockData';
import { getUsers, setUsers } from '../utils/localStorage';
import { fileToBase64 } from '../utils/helpers';
import Toast from '../components/common/Toast';

function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    dob: '',
    gender: '',
    aadhaar: '',
    email: '',
    mobile: '',
    address: '',
    pincode: '',
    state: '',
    username: '',
    password: '',
  });
  const [addressProofFile, setAddressProofFile] = useState(null);
  const [aadhaarStatus, setAadhaarStatus] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Ensure users seeded (done in AuthContext)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, JPEG, or PDF files are allowed.');
        setAddressProofFile(null);
        fileInputRef.current.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        setAddressProofFile(null);
        fileInputRef.current.value = '';
        return;
      }
      setAddressProofFile(file);
      setError('');
      // Show preview (as original)
      const previewContainer = document.getElementById('addressProofPreview');
      if (previewContainer) {
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100px';
          img.style.marginTop = '5px';
          img.style.borderRadius = '4px';
          previewContainer.innerHTML = '';
          previewContainer.appendChild(img);
        } else {
          previewContainer.innerHTML = `<small>📄 ${file.name} (${(file.size/1024).toFixed(1)} KB)</small>`;
        }
      }
    }
  };

  const handlePincodeBlur = () => {
    const pincode = formData.pincode.trim();
    if (pincode.length === 6 && /^\d+$/.test(pincode) && mockPincodeData[pincode]) {
      const data = mockPincodeData[pincode];
      setFormData(prev => ({ ...prev, state: data.state }));
      // Also update address field? Original adds city to address if not present.
      // We'll replicate: if address doesn't contain city, append.
      const addressField = document.getElementById('address');
      if (addressField && !addressField.value.includes(data.city)) {
        const current = addressField.value;
        if (current.trim() === '') {
          addressField.value = data.city;
        } else {
          addressField.value = current + ', ' + data.city;
        }
        setFormData(prev => ({ ...prev, address: addressField.value }));
      }
      setToast({ message: `📍 Pincode ${pincode} → ${data.city}, ${data.state}`, type: 'info' });
    } else if (pincode.length === 6) {
      setToast({ message: '❌ Pincode not found in demo records', type: 'error' });
    }
  };

const handleVerifyAadhaar = async () => {
  const aadhaar = formData.aadhaar.trim();
  if (!aadhaar || aadhaar.length !== 12 || isNaN(aadhaar)) {
    setAadhaarStatus('❌ Enter a valid 12‑digit Aadhaar number.');
    return;
  }
  setAadhaarStatus('⏳ Verifying Aadhaar...');
  try {
    const data = await mockVerifyAadhaar(aadhaar);
    setFormData(prev => ({
      ...prev,
      fullname: data.name,
      dob: data.dob,
      gender: data.gender,
      mobile: data.mobile || '',
      email: data.email || '',
    }));
    setAadhaarStatus('✅ Aadhaar verified! OTP sent.');
    
    // Generate OTP and auto‑fill the input
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpCode(otp);                     // <-- auto‑fill
    setOtpSent(true);
    setOtpStatus('');
    setToast({ message: `📱 OTP sent to ${data.mobile || data.email}`, type: 'info' });
    
    // Start resend countdown
    setResendDisabled(true);
    setResendCountdown(30);
    const timer = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  } catch (err) {
    setAadhaarStatus(`❌ ${err}`);
  }
};

  const handleVerifyOtp = () => {
    if (!otpCode) {
      setOtpStatus('❌ Please enter OTP.');
      return;
    }
    if (otpCode === generatedOtp) {
      setOtpStatus('✅ OTP verified successfully! You can now register.');
      setOtpVerified(true);
    } else {
      setOtpStatus('❌ Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    if (formData.aadhaar && mockVerifyAadhaar) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      setOtpStatus('🔄 New OTP sent.');
      setResendDisabled(true);
      setResendCountdown(30);
      const timer = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setOtpStatus('❌ Please verify Aadhaar first.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!otpVerified) {
      setError('❌ Please verify Aadhaar and OTP before registering.');
      return;
    }
    const { fullname, username, password, mobile, email, address, dob, gender, aadhaar, state, pincode } = formData;
    if (!fullname || !username || !password || !mobile || !email) {
      setError('Please fill all required fields (Name, Username, Password, Mobile, Email).');
      return;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
      setError('Mobile must be 10 digits.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Enter a valid email.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (!addressProofFile) {
      setError('Please upload address proof (Aadhaar / PAN).');
      return;
    }

    let addressProofBase64 = '';
    try {
      addressProofBase64 = await fileToBase64(addressProofFile);
    } catch (err) {
      setError('Error reading file. Please try again.');
      return;
    }

    const users = getUsers();
    if (users.find(u => u.username === username)) {
      setError('Username already taken.');
      return;
    }
    if (users.find(u => u.mobile === mobile)) {
      setError('Mobile already registered.');
      return;
    }

    const newUser = {
      fullname,
      mobile,
      email,
      username,
      password,
      role: 'citizen',
      address: address || '',
      dob: dob || '',
      gender: gender || '',
      aadhaar: aadhaar || '',
      pincode: pincode || '',
      state: state || '',
      addressProof: addressProofBase64,
      registeredDate: new Date().toLocaleString()
    };
    users.push(newUser);
    setUsers(users);
    localStorage.setItem('currentUser', JSON.stringify({ ...newUser, loggedInAt: new Date().toISOString() }));
    setToast({ message: '✅ Registration successful! Redirecting...', type: 'success' });
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} id="registrationForm" encType="multipart/form-data">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date of Birth *</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Gender *</label>
            <div className="gender-box">
              {['Male','Female','Other'].map(g => (
                <label key={g}>
                  <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} required /> {g}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Aadhaar Number *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" id="aadhaar" name="aadhaar" value={formData.aadhaar} onChange={handleChange} placeholder="12-digit Aadhaar" style={{ flex: 1 }} required />
              <button type="button" id="verifyAadhaarBtn" onClick={handleVerifyAadhaar} style={{ width: 'auto', padding: '0 20px' }}>Verify</button>
            </div>
            <div id="aadhaarStatus" style={{ fontSize: '12px', marginTop: '5px', color: aadhaarStatus.includes('✅') ? '#10b981' : '#ef4444' }}>{aadhaarStatus}</div>
          </div>
          {otpSent && (
            <div className="form-group" id="otpGroup" style={{ display: 'block' }}>
              <label>OTP <span id="otpSentTo"></span></label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" id="otpCode" value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="6-digit OTP" maxLength="6" />
                <button type="button" id="verifyOtpBtn" onClick={handleVerifyOtp} style={{ width: 'auto', padding: '0 20px' }}>Verify OTP</button>
              </div>
              <button type="button" id="resendOtpBtn" onClick={handleResendOtp} disabled={resendDisabled} style={{ background: '#6c757d', marginTop: '5px', width: 'auto', padding: '5px 15px' }}>
                {resendDisabled ? `Resend OTP (${resendCountdown}s)` : 'Resend OTP'}
              </button>
              <div id="otpStatus" style={{ fontSize: '12px', marginTop: '5px', color: otpStatus.includes('✅') ? '#10b981' : '#ef4444' }}>{otpStatus}</div>
            </div>
          )}
          <div className="form-group">
            <label>Email *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mobile Number *</label>
            <input type="tel" id="mobile" name="mobile" maxLength="10" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <label>Address *</label>
              <textarea id="address" name="address" rows="4" value={formData.address} onChange={handleChange} required></textarea>
            </div>
            <div style={{ flex: 1 }}>
              <label>Address Proof (Aadhaar / PAN) *</label>
              <input type="file" id="addressProof" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
              <small style={{ display: 'block', marginTop: '5px' }}>Upload Aadhaar or PAN Card (PDF, JPG, JPEG, PNG)</small>
              <div id="addressProofPreview" style={{ marginTop: '8px' }}></div>
            </div>
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} onBlur={handlePincodeBlur} />
          </div>
          <div className="form-group">
            <label>State *</label>
            <select id="state" name="state" value={formData.state} onChange={handleChange} required>
              <option value="">Select State</option>
              {['Andhra Pradesh','Telangana','Tamil Nadu','Karnataka','Kerala'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Username *</label>
            <input type="text" id="regUsername" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input type="password" id="regPassword" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit">Register</button>
          {error && <div className="error" style={{ marginTop: '10px' }}>{error}</div>}
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default RegistrationPage;