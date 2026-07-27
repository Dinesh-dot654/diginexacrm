import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [officeId, setOfficeId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Render Backend Live URL
  const API_BASE_URL = 'https://diginexacrm.onrender.com';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // --- 1. ADMIN HARDCODED LOGIN (Or Backend Check) ---
      if (officeId === 'digi_nexa' && password === 'dinesh@123') {
        localStorage.setItem('crm_logged_user', JSON.stringify({ role: 'admin', fullName: 'Admin Dinesh', empId: 'digi_nexa' }));
        setLoading(false);
        navigate('/'); 
        return;
      }

      // --- 2. BACKEND API LOGIN CHECK ---
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        officeId,
        password
      });

      if (response.data && response.data.success) {
        // Server kitta irunthu vantha user data-vum role-um save panrom
        localStorage.setItem('crm_logged_user', JSON.stringify(response.data.user));
        
        if (response.data.user.role === 'admin') {
          navigate('/');
        } else {
          navigate('/employee-dashboard');
        }
      } else {
        setErrorMsg('Invalid Office ID or Password! Access Denied.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(error.response?.data?.message || 'Server connection failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Diginexa CRM</h2>
        <p>Login Portal</p>
        
        {errorMsg && (
          <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', border: '1px solid #ef4444' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Office ID</label>
            <input type="text" value={officeId} onChange={(e) => setOfficeId(e.target.value)} placeholder="E.g. digi_nexa or digi_001" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" required />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;