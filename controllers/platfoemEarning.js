

const PlatformEarnings = require('../models/platformEarning ');
const Transaction = require('../models/Transaction');
const Project = require('../models/project' );

const adminController = {
  // Get platform earnings dashboard
  getPlatformEarnings: async (req, res) => {
    try {
      // Get date range from query params or default to last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      // Get all earnings within date range
      const earnings = await PlatformEarnings.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).populate('project transaction');

      // Calculate totals
      const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
      
      // Group by type
      const earningsByType = earnings.reduce((acc, earning) => {
        if (!acc[earning.type]) {
          acc[earning.type] = 0;
        }
        acc[earning.type] += earning.amount;
        return acc;
      }, {});

      // Get daily earnings for chart
      const dailyEarnings = await PlatformEarnings.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$amount" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      res.json({
        totalEarnings,
        earningsByType,
        dailyEarnings,
        recentTransactions: earnings.slice(0, 10) // Last 10 transactions
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get detailed earnings report
  getEarningsReport: async (req, res) => {
    try {
      const { startDate, endDate, type } = req.query;
      
      const query = {};
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      if (type) {
        query.type = type;
      }

      const earnings = await PlatformEarnings.find(query)
        .populate('project transaction')
        .sort('-createdAt');

      const summary = {
        totalAmount: earnings.reduce((sum, e) => sum + e.amount, 0),
        totalTransactions: earnings.length,
        averageAmount: earnings.length > 0 ? 
          earnings.reduce((sum, e) => sum + e.amount, 0) / earnings.length : 0
      };

      res.json({
        summary,
        earnings
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = adminController;