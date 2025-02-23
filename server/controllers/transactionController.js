import Transaction from '../models/Transaction.js';

// Get all transactions with filters
export const getTransactions = async (req, res) => {
  try {
    const { filter = 'all', page = 1, limit = 5 } = req.query;
    let query = {};

    if (filter !== 'all') {
      query.type = filter;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    // Get paginated transactions
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email picture')
      .lean();

    res.json({
      transactions,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

// Create new transaction
export const createTransaction = async (req, res) => {
  try {
    const { amount, type, description, category } = req.body;
    const userId = req.user._id;

    const transaction = new Transaction({
      userId,
      amount,
      type,
      description,
      category
    });

    const savedTransaction = await transaction.save();
    const populatedTransaction = await Transaction.findById(savedTransaction._id)
      .populate('userId', 'name email picture')
      .lean();

    res.status(201).json(populatedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
};

// Update transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, description, category } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, type, description, category },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Error updating transaction' });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
}; 