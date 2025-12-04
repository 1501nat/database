const express = require('express');
const { body } = require('express-validator');
const purchaseController = require('../controllers/purchaseController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, purchaseController.getAll);
router.get('/:id', authMiddleware, purchaseController.getById);
router.get('/:id/details', authMiddleware, purchaseController.getDetails);

router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly', 'kho'),
  body('ma_phieu_nhap').notEmpty().withMessage('Mã phiếu nhập không được để trống'),
  body('ma_cn').notEmpty().withMessage('Mã chi nhánh không được để trống'),
  body('ma_ncc').notEmpty().withMessage('Mã NCC không được để trống'),
  body('ma_nv_kho').notEmpty().withMessage('Mã nhân viên không được để trống'),
  validate
], purchaseController.create);

router.put('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly', 'kho')
], purchaseController.update);

router.delete('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], purchaseController.delete);

module.exports = router;