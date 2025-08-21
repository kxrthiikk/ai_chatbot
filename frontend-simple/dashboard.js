// Dashboard JavaScript for Dental WhatsApp Bot
const API_BASE_URL = 'http://localhost:3000/api';

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('appointments-section').style.display = 'none';
    document.getElementById('users-section').style.display = 'none';
    document.getElementById('slots-section').style.display = 'none';

    // Show selected section
    document.getElementById(sectionName + '-section').style.display = 'block';

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    // Load data for the section
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'users':
            loadUsers();
            break;
        case 'slots':
            loadTimeSlots();
            break;
    }
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const stats = await apiCall('/stats');
        
        document.getElementById('total-appointments').textContent = stats.totalAppointments || 0;
        document.getElementById('today-appointments').textContent = stats.todayAppointments || 0;
        document.getElementById('pending-appointments').textContent = stats.pendingAppointments || 0;
        document.getElementById('total-users').textContent = stats.totalUsers || 0;

        // Load recent appointments
        const appointments = await apiCall('/appointments?limit=5');
        displayRecentAppointments(appointments);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

function displayRecentAppointments(appointments) {
    const tbody = document.querySelector('#recent-appointments-table tbody');
    
    if (!appointments || appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No appointments found</td></tr>';
        return;
    }

    tbody.innerHTML = appointments.map(appointment => `
        <tr>
            <td>${appointment.user_name || 'N/A'}</td>
            <td>${formatDate(appointment.appointment_date)}</td>
            <td>${formatTime(appointment.start_time)}</td>
            <td>${appointment.service_type || 'N/A'}</td>
            <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
        </tr>
    `).join('');
}

// Appointments Functions
async function loadAppointments() {
    try {
        const appointments = await apiCall('/appointments');
        displayAppointments(appointments);
    } catch (error) {
        console.error('Failed to load appointments:', error);
        showError('Failed to load appointments');
    }
}

function displayAppointments(appointments) {
    const tbody = document.querySelector('#appointments-table tbody');
    
    if (!appointments || appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No appointments found</td></tr>';
        return;
    }

    tbody.innerHTML = appointments.map(appointment => `
        <tr>
            <td>${appointment.id}</td>
            <td>${appointment.user_name || 'N/A'}</td>
            <td>${formatDate(appointment.appointment_date)}</td>
            <td>${formatTime(appointment.start_time)}</td>
            <td>${appointment.service_type || 'N/A'}</td>
            <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="updateAppointmentStatus(${appointment.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteAppointment(${appointment.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function updateAppointmentStatus(appointmentId) {
    const newStatus = prompt('Enter new status (pending/confirmed/cancelled/completed):');
    if (!newStatus) return;

    try {
        await apiCall(`/appointments/${appointmentId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
        });
        
        showSuccess('Appointment status updated successfully');
        loadAppointments();
    } catch (error) {
        console.error('Failed to update appointment status:', error);
        showError('Failed to update appointment status');
    }
}

async function deleteAppointment(appointmentId) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
        await apiCall(`/appointments/${appointmentId}`, {
            method: 'DELETE'
        });
        
        showSuccess('Appointment deleted successfully');
        loadAppointments();
    } catch (error) {
        console.error('Failed to delete appointment:', error);
        showError('Failed to delete appointment');
    }
}

// Users Functions
async function loadUsers() {
    try {
        const users = await apiCall('/users');
        displayUsers(users);
    } catch (error) {
        console.error('Failed to load users:', error);
        showError('Failed to load users');
    }
}

function displayUsers(users) {
    const tbody = document.querySelector('#users-table tbody');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name || 'N/A'}</td>
            <td>${user.phone_number}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewUserAppointments(${user.id})">
                    <i class="fas fa-eye"></i> View Appointments
                </button>
            </td>
        </tr>
    `).join('');
}

async function viewUserAppointments(userId) {
    try {
        const appointments = await apiCall(`/users/${userId}/appointments`);
        
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
        const modalElement = new bootstrap.Modal(document.getElementById('userAppointmentsModal'));
        modalElement.show();
    } catch (error) {
        console.error('Failed to load user appointments:', error);
        showError('Failed to load user appointments');
    }
}

// Time Slots Functions
async function loadTimeSlots() {
    try {
        const slots = await apiCall('/time-slots');
        displayTimeSlots(slots);
    } catch (error) {
        console.error('Failed to load time slots:', error);
        showError('Failed to load time slots');
    }
}

function displayTimeSlots(slots) {
    const tbody = document.querySelector('#slots-table tbody');
    
    if (!slots || slots.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No time slots found</td></tr>';
        return;
    }

    tbody.innerHTML = slots.map(slot => `
        <tr>
            <td>${slot.id}</td>
            <td>${capitalizeFirst(slot.day_of_week)}</td>
            <td>${formatTime(slot.start_time)}</td>
            <td>${formatTime(slot.end_time)}</td>
            <td>
                <span class="badge ${slot.is_available ? 'bg-success' : 'bg-danger'}">
                    ${slot.is_available ? 'Available' : 'Unavailable'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editTimeSlot(${slot.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTimeSlot(${slot.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
}

function formatTime(timeString) {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5); // Format as HH:MM
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showSuccess(message) {
    // You can implement a toast notification here
    alert('Success: ' + message);
}

function showError(message) {
    // You can implement a toast notification here
    alert('Error: ' + message);
}

// Refresh Functions
function refreshAppointments() {
    loadAppointments();
}

function refreshUsers() {
    loadUsers();
}

function refreshSlots() {
    loadTimeSlots();
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});
