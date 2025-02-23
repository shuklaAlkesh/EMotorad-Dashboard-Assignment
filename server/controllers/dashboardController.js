import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();

    // Get transactions data
    const transactions = await Transaction.find();
    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Calculate revenue growth (compare with last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthTransactions = await Transaction.find({
      createdAt: { $gte: lastMonth }
    });
    const lastMonthRevenue = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const revenueGrowth = lastMonthRevenue ? 
      ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0;

    // Get activity data (last 7 days)
    const activityData = await getActivityData();

    // Get top products/categories
    const productData = await getTopProducts();

    // Get today's schedules
    const schedules = await getTodaySchedules();

    res.json({
      stats: {
        totalRevenue,
        totalTransactions,
        totalUsers,
        revenueGrowth
      },
      activityData,
      productData,
      schedules
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

// Helper function to get activity data
async function getActivityData() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];
  
  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];
    
    // Get user and guest counts for this day
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const userCount = await Transaction.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd },
      type: 'credit'
    });
    
    const guestCount = await Transaction.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd },
      type: 'debit'
    });
    
    result.push({
      name: dayName,
      user: userCount,
      guest: guestCount
    });
  }
  
  return result;
}

// Helper function to get top products/categories
async function getTopProducts() {
  const categories = await Transaction.aggregate([
    {
      $group: {
        _id: '$category',
        value: { $sum: '$amount' }
      }
    },
    {
      $sort: { value: -1 }
    },
    {
      $limit: 3
    },
    {
      $project: {
        name: '$_id',
        value: 1,
        _id: 0
      }
    }
  ]);
  
  return categories;
}

// Helper function to get today's schedules
async function getTodaySchedules() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const schedules = await Transaction.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  })
  .sort('-amount')
  .limit(2)
  .select('description amount createdAt')
  .lean();
  
  return schedules.map(schedule => ({
    title: schedule.description || 'Transaction Review',
    time: new Date(schedule.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    location: `$${schedule.amount.toLocaleString()}`
  }));
} 