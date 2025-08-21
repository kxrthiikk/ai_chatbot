import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TimeSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/time-slots');
      setSlots(response.data);
    } catch (err) {
      console.error('Failed to load time slots:', err);
      setError('Failed to load time slots');
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
      <h2 className="mb-4">Time Slots</h2>
      <div className="table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Available Time Slots</h5>
          <button className="btn btn-primary" onClick={loadTimeSlots}>
            <i className="fas fa-refresh me-2"></i>Refresh
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No time slots found</td>
                </tr>
              ) : (
                slots.map(slot => (
                  <tr key={slot.id}>
                    <td>{slot.id}</td>
                    <td>{capitalizeFirst(slot.day_of_week)}</td>
                    <td>{formatTime(slot.start_time)}</td>
                    <td>{formatTime(slot.end_time)}</td>
                    <td>
                      <span className={`badge ${slot.is_available ? 'bg-success' : 'bg-danger'}`}>
                        {slot.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
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

function formatTime(timeString) {
  if (!timeString) return 'N/A';
  return timeString.substring(0, 5); // Format as HH:MM
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default TimeSlots;
