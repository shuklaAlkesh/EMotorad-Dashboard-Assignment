import React, { useState, useEffect } from 'react';
import Settings from './Settings';
import { 
  LineChart, 
  Line,
  PieChart, 
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { MdTrendingUp, MdPeople, MdShoppingCart, MdAttachMoney, MdAdd } from 'react-icons/md';
import DashboardLayout from '../Layout/DashboardLayout';
import TransactionModal from './TransactionModal';
import api from '../../utils/axios';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalUsers: 0,
    revenueGrowth: 0
  });

  const [activityData, setActivityData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([
          fetchDashboardData(),
          fetchTransactions()
        ]);
      } catch (err) {
        setError(err.message);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      
      // Update all states with real data
      setStats(response.data.stats);
      setActivityData(response.data.activityData);
      setProductData(response.data.productData);
      setSchedules(response.data.schedules);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  const fetchTransactions = async (loadMore = false) => {
    try {
      const response = await api.get('/transactions', {
        params: {
          page: loadMore ? currentPage + 1 : 1,
          limit: ITEMS_PER_PAGE
        }
      });

      if (loadMore) {
        setTransactions(prev => [...prev, ...response.data.transactions]);
        setCurrentPage(prev => prev + 1);
      } else {
        setTransactions(response.data.transactions);
        setCurrentPage(1);
      }

      setHasMore(response.data.transactions.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const handleAddTransaction = async (formData) => {
    try {
      const response = await api.post('/transactions', formData);
      if (response.data) {
        // Show success message
        alert('Transaction added successfully');
        // Refresh data
        fetchDashboardData();
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(error.response?.data?.message || 'Error adding transaction');
    }
  };

  const handleEditTransaction = async (id, formData) => {
    try {
      await api.put(`/transactions/${id}`, formData);
      fetchDashboardData();
      fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchDashboardData();
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">Loading...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="error-message">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <input 
              type="text" 
              placeholder="Search..."
              className="search-input"
            />
            <Settings />
            <button className="notification-btn">
              <span className="notification-badge">3</span>
              🔔
            </button>
            <div className="user-profile">
              <img 
                src={currentUser?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'US')}&background=4CAF50&color=fff`}
                alt={currentUser?.name} 
                className="profile-image"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'US')}&background=4CAF50&color=fff`;
                }}
              />
              <div className="user-info">
                <span className="user-name">{currentUser?.name}</span>
                <span className="user-email">{currentUser?.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stats-container">
          <div className="stat-card revenue">
            <MdShoppingCart className="stat-icon" />
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p>${stats.totalRevenue.toLocaleString()}</p>
              <span className={`growth ${stats.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                <MdTrendingUp />
                {stats.revenueGrowth}%
              </span>
            </div>
          </div>
          
          <div className="stat-card transactions">
            <MdShoppingCart className="stat-icon" />
            <div className="stat-content">
              <h3>Total Transactions</h3>
              <p>{stats.totalTransactions.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="stat-card users">
            <MdPeople className="stat-icon" />
            <div className="stat-content">
              <h3>Total Users</h3>
              <p>{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card activities">
            <div className="chart-header">
              <h3>Activities</h3>
              <select className="time-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="guest" 
                  stroke="#E9A0A0" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="user" 
                  stroke="#9BDD7C" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card products">
            <div className="chart-header">
              <h3>Top Products</h3>
              <select className="time-select">
                <option>May - June 2024</option>
                <option>March - April 2024</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {productData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#98D89E', '#F6DC7D', '#EE8484'][index % 3]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bottom-container">
          <div className="schedules-container">
            <div className="section-header">
              <h3>Today's Schedule</h3>
              <button>See All &gt;</button>
            </div>
            <div className="schedule-list">
              {schedules.map((schedule, index) => (
                <div 
                  key={index} 
                  className="schedule-item"
                  style={{ borderColor: index % 2 ? '#6972C3' : '#9BDD7C' }}
                >
                  <h4>{schedule.title}</h4>
                  <p className="time">{schedule.time}</p>
                  <p className="location">{schedule.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="transactions-section">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <button 
              className="add-btn"
              onClick={() => {
                setSelectedTransaction(null);
                setIsModalOpen(true);
              }}
            >
              <MdAdd /> Add Transaction
            </button>
          </div>
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <span className={`type ${transaction.type}`}>
                    {transaction.type}
                  </span>
                  <span className="amount">
                    ${transaction.amount.toLocaleString()}
                  </span>
                  <span className="description">{transaction.description}</span>
                  <span className="category">{transaction.category}</span>
                </div>
                <div className="transaction-actions">
                  <button
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(transaction._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {hasMore && (
              <button 
                className="load-more-btn"
                onClick={() => fetchTransactions(true)}
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSubmit={(formData) => {
          if (selectedTransaction) {
            handleEditTransaction(selectedTransaction._id, formData);
          } else {
            handleAddTransaction(formData);
          }
        }}
        transaction={selectedTransaction}
      />
      </DashboardLayout>
  );
};

export default Dashboard;
