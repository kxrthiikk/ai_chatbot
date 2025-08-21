import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const viewUserAppointments = async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}/appointments`);
      const appointments = response.data;
      
      let appointmentsHtml = appointments.map(appointment => `
        <tr>
          <td>${appointment.id}</td>
          <td>${formatDate(appointment.appointment_date)}</td>
          <td>${formatTime(appointment.start_time)}</td>
          <td>${appointment.service_type || 'N/A'}</td>
          <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
        </tr>
      `).join('');

      if (appointments.length === 0) {
        appointmentsHtml = '<tr><td colspan="5" class="text-center">No appointments found</td></tr>';
      }

      const modal = `
        <div class="modal fade" id="userAppointmentsModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">User Appointments</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Service</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>${appointmentsHtml}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      // Remove existing modal if any
      const existingModal = document.getElementById('userAppointmentsModal');
      if (existingModal) existingModal.remove();

      // Add new modal
      document.body.insertAdjacentHTML('beforeend', modal);
      
      // Show modal
      const modalElement = new window.bootstrap.Modal(document.getElementById('userAppointmentsModal'));
      modalElement.show();
    } catch (err) {
      console.error('Failed to load user appointments:', err);
      alert('Failed to load user appointments');
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
      <h2 className="mb-4">Users</h2>
      <div className="table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>All Users</h5>
          <button className="btn btn-primary" onClick={loadUsers}>
            <i className="fas fa-refresh me-2"></i>Refresh
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => viewUserAppointments(user.id)}
                      >
                        <i className="fas fa-eye"></i> View Appointments
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

export default Users;
