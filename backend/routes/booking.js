const express = require('express');
const { pool } = require('../db');
const moment = require('moment');

const router = express.Router();

// Get all appointments
router.get('/appointments', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [appointments] = await connection.execute(`
      SELECT 
        a.id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.service_type,
        a.status,
        a.notes,
        a.created_at,
        u.name as patient_name,
        u.phone_number,
        u.email
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.appointment_date DESC, a.start_time DESC
    `);

    connection.release();

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments'
    });
  }
});

// Get appointments by date range
router.get('/appointments/range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const connection = await pool.getConnection();
    
    const [appointments] = await connection.execute(`
      SELECT 
        a.id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.service_type,
        a.status,
        a.notes,
        a.created_at,
        u.name as patient_name,
        u.phone_number,
        u.email
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      WHERE a.appointment_date BETWEEN ? AND ?
      ORDER BY a.appointment_date ASC, a.start_time ASC
    `, [start_date, end_date]);

    connection.release();

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('❌ Error fetching appointments by range:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments'
    });
  }
});

// Get appointment by ID
router.get('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    const [appointments] = await connection.execute(`
      SELECT 
        a.id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.service_type,
        a.status,
        a.notes,
        a.created_at,
        a.updated_at,
        u.name as patient_name,
        u.phone_number,
        u.email
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `, [id]);

    connection.release();

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointments[0]
    });
  } catch (error) {
    console.error('❌ Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointment'
    });
  }
});

// Update appointment status
router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const connection = await pool.getConnection();
    
    await connection.execute(`
      UPDATE appointments 
      SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP, updated_by = 1
      WHERE id = ?
    `, [status, notes || null, id]);

    connection.release();

    res.json({
      success: true,
      message: 'Appointment status updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment status'
    });
  }
});

// Delete appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM appointments WHERE id = ?',
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete appointment'
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [users] = await connection.execute(`
      SELECT 
        id,
        name,
        phone_number,
        email,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    connection.release();

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    const [users] = await connection.execute(`
      SELECT 
        id,
        name,
        phone_number,
        email,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
    `, [id]);

    connection.release();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// Get user appointments
router.get('/users/:id/appointments', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    const [appointments] = await connection.execute(`
      SELECT 
        id,
        appointment_date,
        start_time,
        end_time,
        service_type,
        status,
        notes,
        created_at
      FROM appointments
      WHERE user_id = ?
      ORDER BY appointment_date DESC, start_time DESC
    `, [id]);

    connection.release();

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('❌ Error fetching user appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user appointments'
    });
  }
});

// Get time slots
router.get('/time-slots', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [timeSlots] = await connection.execute(`
      SELECT 
        id,
        day_of_week,
        start_time,
        end_time,
        is_available,
        created_at,
        updated_at
      FROM time_slots
      ORDER BY 
        FIELD(day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        start_time
    `);

    connection.release();

    res.json({
      success: true,
      data: timeSlots
    });
  } catch (error) {
    console.error('❌ Error fetching time slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch time slots'
    });
  }
});

// Create time slot
router.post('/time-slots', async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, is_available = true } = req.body;
    
    if (!day_of_week || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        error: 'Day of week, start time, and end time are required'
      });
    }

    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(`
      INSERT INTO time_slots (day_of_week, start_time, end_time, is_available, created_by, updated_by)
      VALUES (?, ?, ?, ?, 1, 1)
    `, [day_of_week, start_time, end_time, is_available]);

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Time slot created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('❌ Error creating time slot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create time slot'
    });
  }
});

// Update time slot
router.patch('/time-slots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time, is_available } = req.body;
    
    const connection = await pool.getConnection();
    
    const updateFields = [];
    const updateValues = [];
    
    if (day_of_week !== undefined) {
      updateFields.push('day_of_week = ?');
      updateValues.push(day_of_week);
    }
    
    if (start_time !== undefined) {
      updateFields.push('start_time = ?');
      updateValues.push(start_time);
    }
    
    if (end_time !== undefined) {
      updateFields.push('end_time = ?');
      updateValues.push(end_time);
    }
    
    if (is_available !== undefined) {
      updateFields.push('is_available = ?');
      updateValues.push(is_available);
    }
    
    if (updateFields.length === 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }
    
    updateValues.push(id);
    
    await connection.execute(`
      UPDATE time_slots 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP, updated_by = 1
      WHERE id = ?
    `, updateValues);

    connection.release();

    res.json({
      success: true,
      message: 'Time slot updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating time slot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update time slot'
    });
  }
});

// Delete time slot
router.delete('/time-slots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM time_slots WHERE id = ?',
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Time slot not found'
      });
    }

    res.json({
      success: true,
      message: 'Time slot deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting time slot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete time slot'
    });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Total appointments
    const [totalAppointments] = await connection.execute(
      'SELECT COUNT(*) as total FROM appointments'
    );
    
    // Today's appointments
    const [todayAppointments] = await connection.execute(
      'SELECT COUNT(*) as total FROM appointments WHERE appointment_date = CURDATE()'
    );
    
    // Pending appointments
    const [pendingAppointments] = await connection.execute(
      'SELECT COUNT(*) as total FROM appointments WHERE status = "pending"'
    );
    
    // Total users
    const [totalUsers] = await connection.execute(
      'SELECT COUNT(*) as total FROM users'
    );
    
    // Recent appointments (last 7 days)
    const [recentAppointments] = await connection.execute(`
      SELECT 
        a.appointment_date,
        a.service_type,
        a.status,
        u.name as patient_name
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      WHERE a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      ORDER BY a.appointment_date DESC, a.start_time DESC
      LIMIT 10
    `);

    connection.release();

    res.json({
      success: true,
      data: {
        totalAppointments: totalAppointments[0].total,
        todayAppointments: todayAppointments[0].total,
        pendingAppointments: pendingAppointments[0].total,
        totalUsers: totalUsers[0].total,
        recentAppointments
      }
    });
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
