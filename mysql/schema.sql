-- Dental WhatsApp Bot Database Schema
-- This file contains all the necessary tables for the dental appointment booking system

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS dental_bot;
USE dental_bot;

-- Users table to store patient information
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT DEFAULT 1,
    updated_by INT DEFAULT 1
);

-- Time slots table to store available appointment times
CREATE TABLE IF NOT EXISTS time_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT DEFAULT 1,
    updated_by INT DEFAULT 1
);

-- Appointments table to store booking information
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    service_type VARCHAR(100),
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT DEFAULT 1,
    updated_by INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Conversation states table to track user conversation progress
CREATE TABLE IF NOT EXISTS conversation_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    current_state VARCHAR(100),
    context_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT DEFAULT 1,
    updated_by INT DEFAULT 1
);

-- Admin users table for dashboard access
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT DEFAULT 1,
    updated_by INT DEFAULT 1
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email, role, created_by, updated_by) 
VALUES ('admin', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fG4hI5jK6lM7nO8pQ', 'admin@dentalbot.com', 'admin', 1, 1)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert sample time slots
INSERT INTO time_slots (day_of_week, start_time, end_time, is_available, created_by, updated_by) VALUES
('monday', '09:00:00', '10:00:00', TRUE, 1, 1),
('monday', '10:00:00', '11:00:00', TRUE, 1, 1),
('monday', '11:00:00', '12:00:00', TRUE, 1, 1),
('monday', '14:00:00', '15:00:00', TRUE, 1, 1),
('monday', '15:00:00', '16:00:00', TRUE, 1, 1),
('monday', '16:00:00', '17:00:00', TRUE, 1, 1),
('tuesday', '09:00:00', '10:00:00', TRUE, 1, 1),
('tuesday', '10:00:00', '11:00:00', TRUE, 1, 1),
('tuesday', '11:00:00', '12:00:00', TRUE, 1, 1),
('tuesday', '14:00:00', '15:00:00', TRUE, 1, 1),
('tuesday', '15:00:00', '16:00:00', TRUE, 1, 1),
('tuesday', '16:00:00', '17:00:00', TRUE, 1, 1),
('wednesday', '09:00:00', '10:00:00', TRUE, 1, 1),
('wednesday', '10:00:00', '11:00:00', TRUE, 1, 1),
('wednesday', '11:00:00', '12:00:00', TRUE, 1, 1),
('wednesday', '14:00:00', '15:00:00', TRUE, 1, 1),
('wednesday', '15:00:00', '16:00:00', TRUE, 1, 1),
('wednesday', '16:00:00', '17:00:00', TRUE, 1, 1),
('thursday', '09:00:00', '10:00:00', TRUE, 1, 1),
('thursday', '10:00:00', '11:00:00', TRUE, 1, 1),
('thursday', '11:00:00', '12:00:00', TRUE, 1, 1),
('thursday', '14:00:00', '15:00:00', TRUE, 1, 1),
('thursday', '15:00:00', '16:00:00', TRUE, 1, 1),
('thursday', '16:00:00', '17:00:00', TRUE, 1, 1),
('friday', '09:00:00', '10:00:00', TRUE, 1, 1),
('friday', '10:00:00', '11:00:00', TRUE, 1, 1),
('friday', '11:00:00', '12:00:00', TRUE, 1, 1),
('friday', '14:00:00', '15:00:00', TRUE, 1, 1),
('friday', '15:00:00', '16:00:00', TRUE, 1, 1),
('friday', '16:00:00', '17:00:00', TRUE, 1, 1)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_conversation_states_phone ON conversation_states(phone_number);
CREATE INDEX idx_time_slots_day ON time_slots(day_of_week);
CREATE INDEX idx_time_slots_available ON time_slots(is_available);
