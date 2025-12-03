const express = require('express');
const { body, param } = require('express-validator');
const branchController = require('../controllers/branchController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all branches
router.get('/', authMiddleware, branchController.getAll);

// Get single branch
router.get('/:id', authMiddleware, branchController.getById);

// Create branch (admin/manager only)
router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ma_cn').notEmpty().withMessage('Mã chi nhánh không được để trống'),
  body('ten_cn').notEmpty().withMessage('Tên chi nhánh không được để trống'),
  validate
], branchController.create);

// Update branch (admin/manager only)
router.put('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ten_cn').notEmpty().withMessage('Tên chi nhánh không được để trống'),
  validate
], branchController.update);

// Delete branch (admin/manager only)
router.delete('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], branchController.delete);

module.exports = router;
