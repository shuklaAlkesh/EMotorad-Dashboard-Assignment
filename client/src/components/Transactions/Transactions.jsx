import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import { MdAdd, MdSearch, MdFilterList } from 'react-icons/md';
import TransactionModal from '../Dashboard/TransactionModal';
import api from '../../utils/axios';
import './Transactions.css';
import { defaultAvatar } from '../../assets/defaultAvatar';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchTransactions();
  }, [filter, currentPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions', {
        params: {
          filter,
          page: currentPage,
          limit: ITEMS_PER_PAGE
        }
      });
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (formData) => {
    try {
      await api.post('/transactions', formData);
      fetchTransactions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleEditTransaction = async (id, formData) => {
    try {
      await api.put(`/transactions/${id}`, formData);
      fetchTransactions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const searchString = searchTerm.toLowerCase();
    return (
      transaction.description?.toLowerCase().includes(searchString) ||
      transaction.category?.toLowerCase().includes(searchString)
    );
  });

  return (
    <DashboardLayout>
      <div className="transactions-page">
        <div className="transactions-header">
          <h1>Transactions</h1>
          <div className="header-actions">
            <div className="search-bar">
              <MdSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search transactions..."
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
                <option value="all">All</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>
            <button
              className="add-transaction-btn"
              onClick={() => {
                setSelectedTransaction(null);
                setIsModalOpen(true);
              }}
            >
              <MdAdd /> Add Transaction
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="transaction-user">
                        <img 
                          src={transaction.userId?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(transaction.userId?.name || 'User')}&background=4CAF50&color=fff`}
                          alt={transaction.userId?.name} 
                          className="user-avatar"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(transaction.userId?.name || 'User')}&background=4CAF50&color=fff`;
                          }}
                        />
                        <span>{transaction.userId?.name}</span>
                      </div>
                    </td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category}</td>
                    <td>
                      <span className={`type-badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`amount ${transaction.type}`}>
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteTransaction(transaction._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}

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
      </div>
    </DashboardLayout>
  );
};

export default Transactions; 