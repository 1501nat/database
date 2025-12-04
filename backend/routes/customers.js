const express = require('express');
const { body } = require('express-validator');
const customerController = require('../controllers/customerController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, customerController.getAll);
router.get('/:id', authMiddleware, customerController.getById);

router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ma_kh').notEmpty().withMessage('Mã khách hàng không được để trống'),
  body('ho_ten').notEmpty().withMessage('Họ tên không được để trống'),
  body('sdt').notEmpty().withMessage('Số điện thoại không được để trống'),
  validate
], customerController.create);

router.put('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ho_ten').notEmpty().withMessage('Họ tên không được để trống'),
  validate
], customerController.update);

router.delete('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], customerController.delete);

module.exports = router;
