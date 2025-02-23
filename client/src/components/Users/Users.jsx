import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import { MdSearch, MdFilterList, MdMoreVert } from 'react-icons/md';
import api from '../../utils/axios';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users?filter=${filter}`);
      const updatedUsers = response.data.map(user => ({
        ...user,
        status: user._id === currentUser?._id ? 'Active' : 'Inactive'
      }));
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchString = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchString) ||
      user.email?.toLowerCase().includes(searchString)
    );
  });

  return (
    <DashboardLayout>
      <div className="users-page">
        <div className="users-header">
          <h1>Users</h1>
          <div className="header-actions">
            <div className="search-bar">
              <MdSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <MdFilterList className="filter-icon" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th>Transactions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="user-cell">
                      <img 
                        src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name?.slice(0, 2).toUpperCase() || 'US')}&background=4CAF50&color=fff`}
                        alt={user.name}
                        className="user-avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name?.slice(0, 2).toUpperCase() || 'US')}&background=4CAF50&color=fff`;
                        }}
                      />
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role || 'User'}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.transactionCount || 0}</td>
                    <td>
                      <span className={`status-badge ${user.status?.toLowerCase()}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn">
                        <MdMoreVert />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users; 