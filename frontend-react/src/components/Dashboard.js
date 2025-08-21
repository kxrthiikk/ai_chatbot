import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    totalUsers: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, appointmentsResponse] = await Promise.all([
        axios.get('/stats'),
        axios.get('/appointments?limit=5')
      ]);

      setStats(statsResponse.data);
      setRecentAppointments(appointmentsResponse.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Appointments</h6>
                  <h3>{stats.totalAppointments}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-calendar fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Today's Appointments</h6>
                  <h3>{stats.todayAppointments}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-clock fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Pending</h6>
                  <h3>{stats.pendingAppointments}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-hourglass-half fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Users</h6>
                  <h3>{stats.totalUsers}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Recent Appointments</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No appointments found</td>
                  </tr>
                ) : (
                  recentAppointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.user_name || 'N/A'}</td>
                      <td>{formatDate(appointment.appointment_date)}</td>
                      <td>{formatTime(appointment.start_time)}</td>
                      <td>{appointment.service_type || 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
}

function formatTime(timeString) {
  if (!timeString) return 'N/A';
  return timeString.substring(0, 5); // Format as HH:MM
}

export default Dashboard;
