import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddEmployee.css';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Render Backend Live URL
  const API_BASE_URL = 'https://diginexacrm-backend.onrender.com';

  const [formData, setFormData] = useState({
    empId: 'digi_',
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    photo: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const getInitials = (name = '') =>
    name.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.empId.trim() === 'digi_' || !formData.fullName.trim()) {
      alert('Please fill the complete Emp ID and Full Name!');
      return;
    }

    setLoading(true);

    try {
      // Backend schema-kku etha mathiri data-va map pandrom
      const payload = {
        empId: formData.empId,
        name: formData.fullName, // Inga thaan 'fullName' ah 'name' nu maathi anuppurom!
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        photo: formData.photo
      };

      // Corrected route to match backend /add-employee endpoint with payload
      const response = await axios.post(`${API_BASE_URL}/add-employee`, payload);

      if (response.data) {
        setFormData({ empId: 'digi_', fullName: '', email: '', mobile: '', password: '', photo: '' });
        setPhotoPreview(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert(error.response?.data?.error || error.response?.data?.message || 'Failed to save employee to server. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ae-page">
      {/* Header */}
      <div className="ae-header">
        <div className="ae-header-top">
          <button className="ae-back-btn" onClick={() => navigate('/')}>← Back</button>
        </div>
        <h1 className="ae-title">ADD NEW EMPLOYEE</h1>
        <p className="ae-subtitle">👤 Create a new employee profile and login access</p>
      </div>

      {/* Form Card */}
      <div className="ae-form-card">
        <form onSubmit={handleSave}>
          {/* Photo Upload */}
          <div className="ae-photo-section">
            <label htmlFor="photoInput" className="ae-photo-circle">
              {photoPreview ? (
                <img src={photoPreview} alt="preview" />
              ) : formData.fullName ? (
                <span>{getInitials(formData.fullName)}</span>
              ) : (
                <span className="ae-camera-icon">📷</span>
              )}
            </label>
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="photoInput" className="ae-upload-btn">Upload Photo</label>
          </div>

          <div className="ae-divider">EMPLOYEE INFORMATION</div>

          <div className="ae-form-grid">
            <div className="ae-input-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="empId"
                value={formData.empId}
                onChange={handleChange}
                placeholder="e.g. digi_001"
                required
              />
            </div>

            <div className="ae-input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="ae-input-group">
              <label>Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="employee@company.com"
                required
              />
            </div>

            <div className="ae-input-group">
              <label>Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="98765 43210"
                required
              />
            </div>

            <div className="ae-input-group ae-full-width">
              <label>Login Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Set a login password"
                required
              />
            </div>
          </div>

          <div className="ae-submit-section">
            <button type="submit" className={`ae-submit-btn ${saved ? 'saved' : ''}`} disabled={loading}>
              {loading ? 'Saving...' : saved ? '✔ Saved!' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;