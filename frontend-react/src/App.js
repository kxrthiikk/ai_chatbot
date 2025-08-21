import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Users from './components/Users';
import TimeSlots from './components/TimeSlots';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:3000/api';

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <div className="col-md-9 col-lg-10 main-content p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/users" element={<Users />} />
              <Route path="/slots" element={<TimeSlots />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

function Sidebar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="col-md-3 col-lg-2 sidebar p-0">
      <div className="p-4">
        <h4 className="text-white mb-4">
          <i className="fas fa-tooth me-2"></i>
          Dental Bot
        </h4>
        <nav className="nav flex-column">
          <Link className={`nav-link ${isActive('/')}`} to="/">
            <i className="fas fa-tachometer-alt me-2"></i>Dashboard
          </Link>
          <Link className={`nav-link ${isActive('/appointments')}`} to="/appointments">
            <i className="fas fa-calendar-check me-2"></i>Appointments
          </Link>
          <Link className={`nav-link ${isActive('/users')}`} to="/users">
            <i className="fas fa-users me-2"></i>Users
          </Link>
          <Link className={`nav-link ${isActive('/slots')}`} to="/slots">
            <i className="fas fa-clock me-2"></i>Time Slots
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default App;
