import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdDashboard, 
  MdPayment,
  MdSchedule,
  MdPeople,
  MdSettings,
  MdLogout 
} from 'react-icons/md';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
    { path: '/transactions', icon: <MdPayment />, label: 'Transactions' },
    { path: '/schedules', icon: <MdSchedule />, label: 'Schedules' },
    { path: '/users', icon: <MdPeople />, label: 'Users' },
    { path: '/settings', icon: <MdSettings />, label: 'Settings' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>BOARD.</h2>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="help-section">
          <NavLink to="/help" className="nav-link">
            Help
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact Us
          </NavLink>
        </div>
        <button className="logout-btn">
          <MdLogout />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 