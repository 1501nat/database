const express = require('express');
const { body } = require('express-validator');
const inventoryController = require('../controllers/inventoryController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, inventoryController.getAll);
router.get('/:ma_cn/:ma_sp', authMiddleware, inventoryController.getById);

router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly', 'kho'),
  body('ma_cn').notEmpty().withMessage('Chi nhánh không được để trống'),
  body('ma_sp').notEmpty().withMessage('Sản phẩm không được để trống'),
  validate
], inventoryController.create);

router.put('/:ma_cn/:ma_sp', [
  authMiddleware,
  requireRole('admin', 'quan_ly', 'kho'),
  validate
], inventoryController.update);

router.delete('/:ma_cn/:ma_sp', [
  authMiddleware,
  requireRole('admin', 'quan_ly', 'kho')
], inventoryController.delete);

// Get inventory by branch
router.get('/branch/:ma_cn', authMiddleware, inventoryController.getByBranch);

// Get low stock items
router.get('/alerts/low-stock', authMiddleware, inventoryController.getLowStock);

module.exports = router;
