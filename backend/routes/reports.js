const express = require('express');
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', authMiddleware, reportController.getDashboardStats);

// Sales reports
router.get('/sales/daily', authMiddleware, reportController.getDailySales);
router.get('/sales/monthly', authMiddleware, reportController.getMonthlySales);
router.get('/sales/by-branch', authMiddleware, reportController.getSalesByBranch);
router.get('/sales/by-employee', authMiddleware, reportController.getSalesByEmployee);

// Product reports
router.get('/products/top-selling', authMiddleware, reportController.getTopSellingProducts);
router.get('/products/low-stock', authMiddleware, reportController.getLowStockProducts);

// Customer reports
router.get('/customers/top', authMiddleware, reportController.getTopCustomers);

module.exports = router;
