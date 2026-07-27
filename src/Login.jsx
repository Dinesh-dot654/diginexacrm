import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [officeId, setOfficeId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // --- 1. ADMIN LOGIN ---
    if (officeId === 'digi_nexa' && password === 'dinesh@123') {
      localStorage.setItem('crm_logged_user', JSON.stringify({ role: 'admin', fullName: 'Admin Dinesh', empId: 'digi_nexa' }));
      navigate('/'); 
      return;
    }

    // --- 2. EMPLOYEE LOGIN (Checking against Local DB) ---
    const storedEmployees = JSON.parse(localStorage.getItem('crm_employees')) || [];
    const validEmployee = storedEmployees.find(emp => emp.empId === officeId && emp.password === password);

    if (validEmployee) {
      // Correct aana aal thaan nu confirm pannitu current user-ah save pandrom
      localStorage.setItem('crm_logged_user', JSON.stringify({ role: 'employee', ...validEmployee }));
      navigate('/employee-dashboard'); 
      return;
    }

    setErrorMsg('Invalid Office ID or Password! Access Denied.');
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
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;