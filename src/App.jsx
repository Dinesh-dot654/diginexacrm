import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Unga pages import
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import AddEmployee from './AddEmployee';
import EmployeeDetails from './EmployeeDetails'; 
import EmployeeAttendance from './EmployeeAttendance'; 
import EmployeeDashboard from './EmployeeDashboard';
import PaymentDetails from './PaymentDetails'; // <-- PUTHUSA ADD PANNA IMPORT

// --- SECURITY LOGIC (PROTECTED ROUTE) ---
// Ithu entha link click pannalum munnadi ninnu check pannum
const ProtectedRoute = ({ children, allowedRole }) => {
  const userStr = localStorage.getItem('crm_logged_user');
  const user = userStr ? JSON.parse(userStr) : null;

  // 1. Login aagala na, direct-aah Login page-kku thurathividu
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. Tappaana aal thappaana page-kku poga try panna thaduknum
  if (allowedRole && user.role !== allowedRole) {
    // Admin poyi employee link pottal, admin page ke anuppu
    if (user.role === 'admin') return <Navigate to="/" />;
    // Employee poyi admin link pottal, employee page ke anuppu
    if (user.role === 'employee') return <Navigate to="/employee-dashboard" />;
  }

  // Ellam correct-aah iruntha mattum page-ah kaattu
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Open Route - Yaru venaalum login page paarkalam */}
        <Route path="/login" element={<Login />} /> 
        
        {/* === ADMIN SECURED PAGES === */}
        <Route path="/" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/add-employee" element={
          <ProtectedRoute allowedRole="admin">
            <AddEmployee />
          </ProtectedRoute>
        } />
        
        <Route path="/employee-details" element={
          <ProtectedRoute allowedRole="admin">
            <EmployeeDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/employee-attendance" element={
          <ProtectedRoute allowedRole="admin">
            <EmployeeAttendance />
          </ProtectedRoute>
        } />

        {/* PUTHUSA ADD PANNA PAYMENT DETAILS ROUTE */}
        <Route path="/payment-details" element={
          <ProtectedRoute allowedRole="admin">
            <PaymentDetails />
          </ProtectedRoute>
        } />

        {/* === EMPLOYEE SECURED PAGES === */}
        <Route path="/employee-dashboard" element={
          <ProtectedRoute allowedRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        } />

        {/* Oruvela yethavathu thappana link (404) pottal, login page ke thiruppi vidu */}
        <Route path="*" element={<Navigate to="/login" />} />
        
      </Routes>
    </Router>
  );
}

export default App;