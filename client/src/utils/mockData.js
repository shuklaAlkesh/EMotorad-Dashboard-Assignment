export const mockDashboardData = {
  stats: {
    totalRevenue: 250000,
    totalTransactions: 1234,
    totalUsers: 892,
    revenueGrowth: 12.5
  },
  activityData: [
    { name: 'Mon', guest: 20, user: 35 },
    { name: 'Tue', guest: 40, user: 45 },
    { name: 'Wed', guest: 35, user: 30 },
    { name: 'Thu', guest: 50, user: 45 },
    { name: 'Fri', guest: 30, user: 40 },
    { name: 'Sat', guest: 25, user: 35 },
    { name: 'Sun', guest: 15, user: 25 }
  ],
  productData: [
    { name: 'Basic Tees', value: 55 },
    { name: 'Custom Short Pants', value: 31 },
    { name: 'Super Hoodies', value: 14 }
  ],
  schedules: [
    {
      title: 'Meeting with suppliers',
      time: '14:00-15:00',
      location: 'Meeting Room 1'
    },
    {
      title: 'Check operation at Giga Factory 1',
      time: '18:00-20:00',
      location: 'Giga Factory 1'
    }
  ]
}; 