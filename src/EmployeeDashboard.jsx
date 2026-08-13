import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const getDateKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getDateDisplay = (d = new Date()) =>
  d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

const ROCKET_DURATION_MS = 2600;

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTimestamp, setCheckInTimestamp] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const [rocketPhase, setRocketPhase] = useState(null);
  const [percent, setPercent] = useState(1);
  const rocketTimer = useRef(null);
  const percentInterval = useRef(null);

  // Thani Thani States
  const [liveTask, setLiveTask] = useState(''); // Team-kku kaata
  const [workSummary, setWorkSummary] = useState(''); // Admin Attendance-kku anuppa
  const [taskSaved, setTaskSaved] = useState(false);

  const [teamToday, setTeamToday] = useState([]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // Render Backend Live URL
  const API_BASE_URL = 'https://diginexacrm-backend.onrender.com';

  const getInitials = (name = '') =>
    name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const loadTeamToday = async (myEmpId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/attendance`);
      const todayKey = getDateKey();
      const todayRecords = response.data.filter(
        (r) => r.dateKey === todayKey && r.empId && r.empId !== myEmpId && r.empId.startsWith('digi_')
      );
      setTeamToday(todayRecords);
    } catch (error) {
      console.error('Error loading team attendance:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem('crm_logged_user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user || user.role !== 'employee') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const fetchMyStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/attendance`);
        const todayKey = getDateKey();
        const record = response.data.find(a => a.empId === user.empId && a.dateKey === todayKey);

        if (record) {
          setLiveTask(record.liveTask || '');
          setWorkSummary(record.task || '');
          if (record.checkInTimestamp && !record.checkOutTimestamp) {
            setIsCheckedIn(true);
            setCheckInTimestamp(record.checkInTimestamp);
            setElapsed(Math.floor((Date.now() - record.checkInTimestamp) / 1000));
            setPercent(100);
          }
        }
      } catch (error) {
        console.error('Error fetching employee status:', error);
      }
    };

    fetchMyStatus();
    loadTeamToday(user.empId);
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => loadTeamToday(currentUser.empId), 15000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    let interval;
    if (isCheckedIn && checkInTimestamp) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - checkInTimestamp) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTimestamp]);

  useEffect(() => {
    return () => {
      clearTimeout(rocketTimer.current);
      clearInterval(percentInterval.current);
    };
  }, []);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const hoursToday = (elapsed / 3600).toFixed(1);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const upsertAttendance = async (updates) => {
    try {
      const todayKey = getDateKey();
      await axios.post(`${API_BASE_URL}/api/attendance`, {
        empId: currentUser.empId,
        empName: currentUser.fullName,
        dateKey: todayKey,
        dateDisplay: getDateDisplay(),
        ...updates
      });
    } catch (error) {
      console.error('Error updating attendance on server:', error);
    }
  };

  const animatePercent = (from, to, onDone) => {
    clearInterval(percentInterval.current);
    const steps = Math.abs(to - from);
    if (steps === 0) { onDone && onDone(); return; }
    const stepTime = ROCKET_DURATION_MS / steps;
    let current = from;
    const dir = to > from ? 1 : -1;
    setPercent(current);
    percentInterval.current = setInterval(() => {
      current += dir;
      setPercent(current);
      if (current === to) {
        clearInterval(percentInterval.current);
        onDone && onDone();
      }
    }, stepTime);
  };

  const handleCheckIn = async () => {
    const now = Date.now();
    setRocketPhase('in');
    setPercent(1);
    animatePercent(1, 100);
    clearTimeout(rocketTimer.current);
    rocketTimer.current = setTimeout(() => setRocketPhase(null), ROCKET_DURATION_MS);

    setIsCheckedIn(true);
    setCheckInTimestamp(now);
    setElapsed(0);

    await upsertAttendance({
      checkInTime: new Date(now).toLocaleTimeString(),
      checkInTimestamp: now,
      checkOutTime: '',
      checkOutTimestamp: null,
      status: 'Present',
    });

    showToast(`✅ Checked in at ${new Date(now).toLocaleTimeString()}`);
    loadTeamToday(currentUser.empId);
  };

  // CHECKOUT LOGIC WITH STRICT WORK SUMMARY VALIDATION
  const handleCheckOut = async () => {
    if (!workSummary || workSummary.trim() === '') {
      showToast('⚠️ Please enter your Work Summary to check out!');
      return; 
    }

    const now = Date.now();
    const finalElapsed = checkInTimestamp ? Math.floor((now - checkInTimestamp) / 1000) : elapsed;
    const hrs = (finalElapsed / 3600).toFixed(1);

    // Save strictly to "task" so Admin Attendance page reads it perfectly
    await upsertAttendance({
      checkOutTime: new Date(now).toLocaleTimeString(),
      checkOutTimestamp: now,
      hoursWorked: hrs,
      task: workSummary, 
    });

    setRocketPhase('out');
    setPercent(100);
    animatePercent(100, 1);
    clearTimeout(rocketTimer.current);
    rocketTimer.current = setTimeout(() => {
      setIsCheckedIn(false);
      setCheckInTimestamp(null);
      setRocketPhase(null);
    }, ROCKET_DURATION_MS);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      showToast('🎉 Check-out Successful!');
    }, 1800);
    loadTeamToday(currentUser.empId);
  };

  const saveLiveTask = async () => {
    if (!liveTask.trim()) {
      showToast('⚠️ Type your live task first!');
      return;
    }
    // Save live status broadcast
    await upsertAttendance({ liveTask: liveTask });
    setTaskSaved(true);
    showToast('📡 Live Task broadcasted to team!');
    setTimeout(() => setTaskSaved(false), 1500);
    loadTeamToday(currentUser.empId);
  };

  const handleLeaveSubmit = async () => {
    if (!leaveFrom || !leaveTo) {
      showToast('⚠️ Select From and To date!'); return;
    }
    if (leaveTo < leaveFrom) {
      showToast('⚠️ To Date cannot be before From Date!'); return;
    }
    if (!leaveReason.trim()) {
      showToast('⚠️ Please enter a reason!'); return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/leaves`, {
        empId: currentUser.empId,
        empName: currentUser.fullName,
        fromDate: leaveFrom,
        toDate: leaveTo,
        reason: leaveReason,
        status: 'Pending',
        appliedAt: Date.now(),
      });

      setLeaveSubmitted(true);
      setTimeout(() => {
        setShowLeaveModal(false);
        setLeaveSubmitted(false);
        setLeaveFrom('');
        setLeaveTo('');
        setLeaveReason('');
        showToast('✅ Leave request submitted!');
      }, 1200);
    } catch (error) {
      console.error('Error submitting leave:', error);
      showToast('❌ Failed to submit leave request.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_logged_user');
    navigate('/login');
  };

  if (!currentUser) return null;

  const fillWidth = `${percent}%`;
  const rocketPositionStyle = { left: `calc(${(percent - 1) / 99 * 100}% - ${((percent - 1) / 99) * 1.6}rem)` };
  const rocketFacingClass = rocketPhase === 'out' ? 'facing-left' : '';

  return (
    <div className={`emp-dashboard ${mounted ? 'mounted' : ''}`}>
      <div className="emp-grid">
        {/* LEFT COLUMN */}
        <div className="emp-left">
          <div className="hello-card">
            <div className="hello-card-top">
              <div>
                <h1>Hello, <span className="accent">{currentUser.fullName}</span>! 👋</h1>
                <p className="muted">Track your work and manage tasks efficiently.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-leave" onClick={() => setShowLeaveModal(true)}>🏖️ Leave Form</button>
                <button 
                  className="btn btn-leave" 
                  style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }} 
                  onClick={handleLogout}
                >Logout</button>
              </div>
            </div>
            <div className="date-pill">📅 {getDateDisplay()}</div>
            <hr />
            <div className="hrs-today">{hoursToday}</div>
            <div className="hrs-label">HRS TODAY</div>
          </div>

          <div className="white-card">
            <h2>👥 Team Today (Live Broadcast)</h2>
            <p className="muted" style={{ marginBottom: '0.9rem' }}>What your teammates are currently working on</p>
            {teamToday.length === 0 ? (
              <p className="muted" style={{ padding: '0.5rem 0' }}>No live updates from teammates yet.</p>
            ) : (
              <div className="team-today-list">
                {teamToday.map((rec, i) => (
                  <div className="team-today-item" key={i}>
                    <div className="team-today-avatar">{getInitials(rec.empName)}</div>
                    <div className="team-today-content">
                      <div className="team-today-name">
                        {rec.empName}
                        <span className={`team-today-status ${rec.checkOutTime ? 'off' : 'on'}`}>
                          {rec.checkOutTime ? '⚪ Checked out' : '🟢 Working'}
                        </span>
                      </div>
                      <p className="team-today-text" style={{ color: '#0d9488', fontWeight: '500' }}>
                        {rec.liveTask ? `👉 ${rec.liveTask}` : 'No live status updated.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="emp-right">
          <div className="attendance-card">
            <div className="att-top">
              <div>
                <div className="att-label">ATTENDANCE</div>
                <div className="att-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className="live-timer">
                <div className="live-value">{formatTime(elapsed)}</div>
                <div className="live-label">LIVE TIMING</div>
              </div>
            </div>

            <div className="mascot-box">
              <div className="rocket-stage">
                <div className="rocket-track">
                  <div className="rocket-track-fill" style={{ width: fillWidth }} />
                </div>
                <div
                  className={`rocket-icon ${rocketFacingClass} ${!rocketPhase ? (isCheckedIn ? 'is-parked-right' : 'is-parked-left') : ''}`}
                  style={rocketPhase ? rocketPositionStyle : undefined}
                >🚀</div>
              </div>
              <div className="rocket-percent">{isCheckedIn || rocketPhase ? `${percent}%` : ''}</div>
              <p>{isCheckedIn ? 'Working...' : 'Ready to work'}</p>
            </div>

            {!isCheckedIn ? (
              <button className="btn btn-checkin" onClick={handleCheckIn}>
                <span>▶</span> CHECK IN
              </button>
            ) : (
              <div style={{ marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>
                  📝 End of Day Work Summary
                </label>
                <textarea
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Summarize your work to Check Out..."
                  value={workSummary}
                  onChange={(e) => setWorkSummary(e.target.value)}
                />
                <button className="btn btn-checkout" onClick={handleCheckOut}>
                  <span>⏹</span> CHECK OUT
                </button>
              </div>
            )}
          </div>

          <div className="white-card status-card">
            <h2>✅ Today's Status</h2>
            <div className="status-value">{hoursToday}</div>
            <div className="status-label">Hours Today</div>
            <span className={`badge ${isCheckedIn ? 'badge-green' : 'badge-yellow'}`}>
              {isCheckedIn ? '🟢 Present' : '🟡 Absent'}
            </span>
          </div>

          <div className="white-card">
            <h2>📢 Today's Task (Live Broadcast)</h2>
            <p className="muted" style={{ marginBottom: '0.8rem' }}>
              Broadcast what you're currently working on to the team.
            </p>
            <textarea
              className="task-input"
              placeholder="e.g. In a meeting with client, debugging login page..."
              value={liveTask}
              onChange={(e) => setLiveTask(e.target.value)}
            />
            <button className={`btn btn-save ${taskSaved ? 'saved' : ''}`} onClick={saveLiveTask}>
              {taskSaved ? '✔ Broadcasted' : 'Broadcast Status'}
            </button>
          </div>
        </div>
      </div>

      {showLeaveModal && (
        <div className="modal-overlay" onClick={() => !leaveSubmitted && setShowLeaveModal(false)}>
          <div className="leave-modal" onClick={(e) => e.stopPropagation()}>
            {leaveSubmitted ? (
              <div className="leave-success">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <p>Leave Request Submitted!</p>
              </div>
            ) : (
              <>
                <div className="leave-modal-header">
                  <h3>🏖️ Apply for Leave</h3>
                  <button className="leave-modal-close" onClick={() => setShowLeaveModal(false)}>✕</button>
                </div>
                <p className="muted" style={{ marginBottom: '1.2rem' }}>Select your leave dates and reason</p>

                <div className="leave-date-row">
                  <div className="leave-input-group">
                    <label>From Date</label>
                    <input type="date" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)} />
                  </div>
                  <div className="leave-input-group">
                    <label>To Date</label>
                    <input type="date" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)} />
                  </div>
                </div>

                <div className="leave-input-group" style={{ marginTop: '1rem' }}>
                  <label>Reason</label>
                  <textarea
                    className="leave-reason-input"
                    placeholder="Why do you need leave?"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                  />
                </div>

                <div className="leave-modal-actions">
                  <button className="btn-cancel" onClick={() => setShowLeaveModal(false)}>Cancel</button>
                  <button className="btn-submit" onClick={handleLeaveSubmit}>Submit Request <span>→</span></button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-overlay">
          <div className="success-box">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <p>Check-out Successful!</p>
          </div>
        </div>
      )}

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
};

export default EmployeeDashboard;