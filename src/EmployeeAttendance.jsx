import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeAttendance.css';

const EmployeeAttendance = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Render Backend Live URL
  const API_BASE_URL = 'https://diginexacrm-backend.onrender.com';

  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Backend-lenthum attendance records-ah fetch panrom
  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/attendance`);
      if (response.data) {
        const valid = response.data.filter(r => r.empId && r.empName);
        setRecords([...valid].reverse());
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = '') =>
    name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  // Time without seconds
  const formatTime = (timeStr) => {
    if (!timeStr) return '--';
    const match = timeStr.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*([APap][Mm])?/);
    if (!match) return timeStr;
    const [, h, m, ap] = match;
    return ap ? `${h}:${m} ${ap.toUpperCase()}` : `${h}:${m}`;
  };

  const getDuration = (rec) => {
    if (!rec.checkInTimestamp) return '--';
    const end = rec.checkOutTimestamp || Date.now();
    const totalMin = Math.floor((end - rec.checkInTimestamp) / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h ${m}m`;
  };

  const getStatus = (rec) => (rec.checkInTime ? 'PRESENT' : 'ABSENT');

  const checkoutRequestsCount = records.filter(r => r.checkInTime && !r.checkOutTime).length;

  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      const matchesSearch =
        !search ||
        rec.empName?.toLowerCase().includes(search.toLowerCase()) ||
        rec.empId?.toLowerCase().includes(search.toLowerCase());

      const recDate = rec.dateKey;
      const matchesFrom = !fromDate || (recDate && recDate >= fromDate);
      const matchesTo = !toDate || (recDate && recDate <= toDate);

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [records, search, fromDate, toDate]);

  const handleClear = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
  };

  const handleDeleteAll = async () => {
    if (window.confirm(`Delete all ${records.length} attendance records from server? This cannot be undone.`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/attendance`);
        setRecords([]);
      } catch (error) {
        console.error('Error deleting attendance:', error);
        alert('Failed to delete records from server.');
      }
    }
  };

  const handleExportPDF = () => window.print();

  const formatDateDisplay = (rec) => {
    if (rec.dateKey) {
      const [y, m, d] = rec.dateKey.split('-');
      return `${d}/${m}/${y}`;
    }
    return rec.dateDisplay || '--';
  };

  return (
    <div className="att-page">
      {/* Header */}
      <div className="att-header">
        <div className="att-header-top">
          <button className="att-back-btn" onClick={() => navigate('/')}>← Back</button>
          <div className="att-header-actions">
            <button className="att-btn att-btn-warning">
              ⚠️ Check-Out Requests ({checkoutRequestsCount})
            </button>
            <button className="att-btn att-btn-dark" onClick={handleDeleteAll}>
              🗑️ Delete ({records.length})
            </button>
            <button className="att-btn att-btn-light" onClick={handleExportPDF}>📄 PDF</button>
          </div>
        </div>
        <h1 className="att-title">EMPLOYEE ATTENDANCE</h1>
        <p className="att-subtitle">📄 Manage and track employee attendance records</p>
      </div>

      {/* Filters */}
      <div className="att-filter-bar">
        <div className="att-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="att-date-box">
          <span>📅</span>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <span className="att-to-label">to</span>
        <div className="att-date-box">
          <span>📅</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <button className="att-clear-btn" onClick={handleClear}>↺ Clear</button>
      </div>

      {/* Desktop Table */}
      <div className="att-table-wrapper">
        <table className="att-table">
          <thead>
            <tr>
              <th>👤 NAME</th>
              <th>DATE</th>
              <th>🕐 IN</th>
              <th>OUT</th>
              <th>DURATION</th>
              <th>STATUS</th>
              <th>WORK SUMMARY</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="att-empty">Loading attendance from server...</td></tr>
            ) : filteredRecords.length === 0 ? (
              <tr><td colSpan="7" className="att-empty">No attendance records found.</td></tr>
            ) : (
              filteredRecords.map((rec, i) => (
                <tr key={i}>
                  <td>
                    <div className="att-name-cell">
                      <div className="att-avatar">{getInitials(rec.empName)}</div>
                      <span className="att-name-text">{rec.empName}</span>
                    </div>
                  </td>
                  <td>{formatDateDisplay(rec)}</td>
                  <td className="att-in-time">{formatTime(rec.checkInTime)}</td>
                  <td className="att-out-time">
                    {rec.checkOutTime ? formatTime(rec.checkOutTime) : 'Working...'}
                  </td>
                  <td><span className="att-duration-pill">{getDuration(rec)}</span></td>
                  <td>
                    <span className={`att-status-badge ${getStatus(rec) === 'PRESENT' ? 'present' : 'absent'}`}>
                      {getStatus(rec)}
                    </span>
                  </td>
                  <td className="att-summary">{rec.task || '--'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="att-mobile-list">
        {loading ? (
          <div className="att-empty-mobile">Loading attendance from server...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="att-empty-mobile">No attendance records found.</div>
        ) : (
          filteredRecords.map((rec, i) => (
            <div className="att-mobile-card" key={i}>
              <div className="att-mobile-top">
                <div className="att-name-cell">
                  <div className="att-avatar">{getInitials(rec.empName)}</div>
                  <span className="att-name-text">{rec.empName}</span>
                </div>
                <span className={`att-status-badge ${getStatus(rec) === 'PRESENT' ? 'present' : 'absent'}`}>
                  {getStatus(rec)}
                </span>
              </div>

              <div className="att-mobile-grid">
                <div><span className="att-mobile-label">Date</span><span>{formatDateDisplay(rec)}</span></div>
                <div><span className="att-mobile-label">In</span><span className="att-in-time">{formatTime(rec.checkInTime)}</span></div>
                <div><span className="att-mobile-label">Out</span><span className="att-out-time">{rec.checkOutTime ? formatTime(rec.checkOutTime) : 'Working...'}</span></div>
                <div><span className="att-mobile-label">Duration</span><span>{getDuration(rec)}</span></div>
              </div>

              <div className="att-mobile-summary">
                <span className="att-mobile-label">Work Summary</span>
                <p>{rec.task || '--'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;