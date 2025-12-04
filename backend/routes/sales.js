const express = require('express');
const { body } = require('express-validator');
const salesController = require('../controllers/salesController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Invoices
router.get('/', authMiddleware, salesController.getAll);
router.get('/:id', authMiddleware, salesController.getById);
router.get('/:id/details', authMiddleware, salesController.getInvoiceDetails);

router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly', 'ban_hang'),
  body('ma_hdbh').notEmpty().withMessage('Mã hóa đơn không được để trống'),
  body('ma_cn').notEmpty().withMessage('Chi nhánh không được để trống'),
  body('ma_nv_bh').notEmpty().withMessage('Nhân viên bán hàng không được để trống'),
  body('items').isArray({ min: 1 }).withMessage('Phải có ít nhất 1 sản phẩm'),
  validate
], salesController.create);

router.put('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly', 'ban_hang'),
  validate
], salesController.update);

router.delete('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], salesController.delete);

// Get sales by branch
router.get('/branch/:ma_cn', authMiddleware, salesController.getByBranch);

// Get sales by date range
router.get('/report/date-range', authMiddleware, salesController.getByDateRange);

module.exports = router;
