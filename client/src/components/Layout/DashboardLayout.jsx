import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdAccountBalanceWallet, 
  MdPeople, 
  MdSettings,
  MdLogout 
} from 'react-icons/md';
import './DashboardLayout.css';
import api from '../../utils/axios';

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-layout">
      <nav className="sidebar">
        <div className="logo">
          <h2>BOARD.</h2>
        </div>
        <ul className="nav-links">
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li className={location.pathname === '/transactions' ? 'active' : ''}>
            <Link to="/transactions">
              <MdAccountBalanceWallet /> Transactions
            </Link>
          </li>
          <li className={location.pathname === '/users' ? 'active' : ''}>
            <Link to="/users">
              <MdPeople /> Users
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <MdSettings /> Settings
            </Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <MdLogout /> Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 