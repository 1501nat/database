const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, categoryController.getAll);
router.get('/:id', authMiddleware, categoryController.getById);

router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ma_dm').notEmpty().withMessage('Mã danh mục không được để trống'),
  body('ten_danh_muc').notEmpty().withMessage('Tên danh mục không được để trống'),
  validate
], categoryController.create);

router.put('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ten_danh_muc').notEmpty().withMessage('Tên danh mục không được để trống'),
  validate
], categoryController.update);

router.delete('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], categoryController.delete);

module.exports = router;
