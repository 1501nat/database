const express = require('express');
const { body } = require('express-validator');
const employeeController = require('../controllers/employeeController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, employeeController.getAll);
router.get('/:id', authMiddleware, employeeController.getById);

router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ma_nv').notEmpty().withMessage('Mã nhân viên không được để trống'),
  body('ho_ten').notEmpty().withMessage('Họ tên không được để trống'),
  body('ma_cn').notEmpty().withMessage('Chi nhánh không được để trống'),
  validate
], employeeController.create);

router.put('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ho_ten').notEmpty().withMessage('Họ tên không được để trống'),
  validate
], employeeController.update);

router.delete('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], employeeController.delete);

module.exports = router;
