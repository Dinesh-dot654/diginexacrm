import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();

  // Thelivaana Logout Function
  const handleLogout = () => {
    // Ithu login session-ah mattum thaan azhikkum, Employee data-va azhikkathu!
    localStorage.removeItem('crm_logged_user');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Diginexa CRM <span>Admin</span></h2>
        {/* Ippo thelivaana logout function-ah call pandrom */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-content">
        
        <div className="dashboard-card">
          <h3>Add Employee</h3>
          <p>Create a new employee profile, assign User ID and generate password.</p>
          <button className="card-btn" onClick={() => navigate('/add-employee')}>Go to Add Employee</button>
        </div>

        <div className="dashboard-card">
          <h3>Employee Details</h3>
          <p>View, edit, or remove existing employee records and information.</p>
          <button className="card-btn" onClick={() => navigate('/employee-details')}>View Details</button>
        </div>

        <div className="dashboard-card">
          <h3>Employee Attendance</h3>
          <p>Track daily check-in and check-out times for all employees.</p>
          <button className="card-btn" onClick={() => navigate('/employee-attendance')}>View Attendance</button>
        </div>

        {/* --- PUDHUSA ADD PANNA PAYMENT DETAILS CARD --- */}
        <div className="dashboard-card">
          <h3>Payment Details</h3>
          <p>Manage income, expenses, profit analysis and generate invoices.</p>
          <button className="card-btn" onClick={() => navigate('/payment-details')}>View Accounts</button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;