import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

// Get all users with their transaction counts
export const getUsers = async (req, res) => {
  try {
    const { filter = 'all' } = req.query;
    let query = {};

    if (filter !== 'all') {
      query.status = filter;
    }

    // Get users with their transaction counts
    const users = await User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'userId',
          as: 'transactions'
        }
      },
      {
        $addFields: {
          transactionCount: { $size: '$transactions' },
          lastTransaction: { $max: '$transactions.createdAt' },
          totalTransactionAmount: { $sum: '$transactions.amount' }
        }
      },
      {
        $project: {
          password: 0,
          transactions: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user details with transactions
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transactions = await Transaction.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = await Transaction.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      user,
      transactions,
      stats: stats[0] || { totalAmount: 0, avgAmount: 0, count: 0 }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
}; 