const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, productController.getAll);
router.get('/:id', authMiddleware, productController.getById);

router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ma_sp').notEmpty().withMessage('Mã sản phẩm không được để trống'),
  body('ten_sp').notEmpty().withMessage('Tên sản phẩm không được để trống'),
  body('ma_dm').notEmpty().withMessage('Danh mục không được để trống'),
  validate
], productController.create);

router.put('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ten_sp').notEmpty().withMessage('Tên sản phẩm không được để trống'),
  validate
], productController.update);

router.delete('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], productController.delete);

module.exports = router;
