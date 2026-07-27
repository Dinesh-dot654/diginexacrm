import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeDetails.css';

function EmployeeDetails() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Render Backend Live URL
  const API_BASE_URL = 'https://diginexacrm.onrender.com';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employees`);
      if (response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = '') =>
    name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const filteredEmployees = employees.filter(emp =>
    !search ||
    emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    emp.empId?.toLowerCase().includes(search.toLowerCase()) ||
    emp.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (empId) => {
    if (window.confirm('Delete this employee record from server?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/employees/${empId}`);
        const updated = employees.filter(e => e.empId !== empId);
        setEmployees(updated);
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee from server.');
      }
    }
  };

  return (
    <div className="ed-page">
      {/* Header */}
      <div className="ed-header">
        <div className="ed-header-top">
          <button className="ed-back-btn" onClick={() => navigate('/')}>← Back</button>
          <button className="ed-btn ed-btn-light" onClick={() => navigate('/add-employee')}>
            ➕ Add Employee
          </button>
        </div>
        <h1 className="ed-title">EMPLOYEE DETAILS</h1>
        <p className="ed-subtitle">📄 View and manage staff records</p>
      </div>

      {/* Search */}
      <div className="ed-filter-bar">
        <div className="ed-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search employee by name, ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="ed-count">{filteredEmployees.length} employee(s)</span>
      </div>

      {/* Desktop Table */}
      <div className="ed-table-wrapper">
        <table className="ed-table">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Photo</th>
              <th>Full Name</th>
              <th>Email ID</th>
              <th>Mobile Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="ed-empty">Loading employees from server...</td></tr>
            ) : filteredEmployees.length === 0 ? (
              <tr><td colSpan="6" className="ed-empty">No employees found. Click "Add Employee" to create one.</td></tr>
            ) : (
              filteredEmployees.map((emp, i) => (
                <tr key={i}>
                  <td className="ed-id">{emp.empId}</td>
                  <td>
                    <div className="ed-photo">
                      {emp.photo ? <img src={emp.photo} alt={emp.fullName} /> : getInitials(emp.fullName)}
                    </div>
                  </td>
                  <td className="ed-name">{emp.fullName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.mobile}</td>
                  <td className="ed-actions">
                    <button className="ed-action-btn view" onClick={() => navigate(`/employee-details/${emp.empId}`)}>View</button>
                    <button className="ed-action-btn delete" onClick={() => handleDelete(emp.empId)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="ed-mobile-list">
        {loading ? (
          <div className="ed-empty-mobile">Loading employees from server...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="ed-empty-mobile">No employees found. Click "Add Employee" to create one.</div>
        ) : (
          filteredEmployees.map((emp, i) => (
            <div className="ed-mobile-card" key={i}>
              <div className="ed-mobile-top">
                <div className="ed-photo">
                  {emp.photo ? <img src={emp.photo} alt={emp.fullName} /> : getInitials(emp.fullName)}
                </div>
                <div>
                  <div className="ed-name">{emp.fullName}</div>
                  <div className="ed-id">{emp.empId}</div>
                </div>
              </div>
              <div className="ed-mobile-grid">
                <div><span className="ed-mobile-label">Email</span><span>{emp.email}</span></div>
                <div><span className="ed-mobile-label">Mobile</span><span>{emp.mobile}</span></div>
              </div>
              <div className="ed-mobile-actions">
                <button className="ed-action-btn view" onClick={() => navigate(`/employee-details/${emp.empId}`)}>View</button>
                <button className="ed-action-btn delete" onClick={() => handleDelete(emp.empId)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmployeeDetails;