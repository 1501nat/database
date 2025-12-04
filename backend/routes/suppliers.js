const express = require('express');
const { body } = require('express-validator');
const supplierController = require('../controllers/supplierController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, supplierController.getAll);
router.get('/:id', authMiddleware, supplierController.getById);
router.get('/:id/products', authMiddleware, supplierController.getSupplierProducts);

router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ma_ncc').notEmpty().withMessage('Mã NCC không được để trống'),
  body('ten_cong_ty').notEmpty().withMessage('Tên công ty không được để trống'),
  validate
], supplierController.create);

router.put('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ten_cong_ty').notEmpty().withMessage('Tên công ty không được để trống'),
  validate
], supplierController.update);

router.delete('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], supplierController.delete);

module.exports = router;
