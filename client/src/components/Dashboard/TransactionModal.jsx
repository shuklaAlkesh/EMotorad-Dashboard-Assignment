import React, { useState, useEffect } from 'react';
import './TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, onSubmit, transaction }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    amount: '',
    type: 'credit',
    description: '',
    category: '',
    userId: currentUser?._id,
    userName: currentUser?.name
  });

  // Update form data when transaction prop changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount || '',
        type: transaction.type || 'credit',
        description: transaction.description || '',
        category: transaction.category || '',
        userId: transaction.userId || '',
        userName: transaction.userName || ''
      });
    } else {
      // Reset form when adding new transaction
      setFormData({
        amount: '',
        type: 'credit',
        description: '',
        category: '',
        userId: currentUser?._id,
        userName: currentUser?.name
      });
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{transaction ? 'Edit' : 'Add'} Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter description"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="Enter category"
            />
          </div>
          <div className="user-info-section">
            <img 
              src={currentUser?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'US')}&background=4CAF50&color=fff`}
              alt={currentUser?.name}
              className="modal-user-avatar"
            />
            <div>
              <span className="modal-user-name">{currentUser?.name}</span>
              <span className="modal-user-email">{currentUser?.email}</span>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {transaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal; 