import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/appointments');
      setAppointments(response.data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/appointments/${id}/status`, { status: newStatus });
      loadAppointments(); // Reload data
      alert('Status updated successfully');
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await axios.delete(`/appointments/${id}`);
      loadAppointments(); // Reload data
      alert('Appointment deleted successfully');
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      alert('Failed to delete appointment');
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
      <h2 className="mb-4">Appointments</h2>
      <div className="table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>All Appointments</h5>
          <button className="btn btn-primary" onClick={loadAppointments}>
            <i className="fas fa-refresh me-2"></i>Refresh
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No appointments found</td>
                </tr>
              ) : (
                appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>{appointment.user_name || 'N/A'}</td>
                    <td>{formatDate(appointment.appointment_date)}</td>
                    <td>{formatTime(appointment.start_time)}</td>
                    <td>{appointment.service_type || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          const newStatus = prompt('Enter new status (pending/confirmed/cancelled/completed):');
                          if (newStatus) updateStatus(appointment.id, newStatus);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteAppointment(appointment.id)}
                      >
                        <i className="fas fa-trash"></i>
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

export default Appointments;
