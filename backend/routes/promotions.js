const express = require('express');
const { body } = require('express-validator');
const promotionController = require('../controllers/promotionController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, promotionController.getAll);
router.get('/active', authMiddleware, promotionController.getActive);
router.get('/:id', authMiddleware, promotionController.getById);
router.get('/:id/products', authMiddleware, promotionController.getPromotionProducts);

router.post('/', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ma_ctkm').notEmpty().withMessage('Mã CTKM không được để trống'),
  body('ten_chuong_trinh').notEmpty().withMessage('Tên chương trình không được để trống'),
  body('ngay_bat_dau').notEmpty().withMessage('Ngày bắt đầu không được để trống'),
  body('ngay_ket_thuc').notEmpty().withMessage('Ngày kết thúc không được để trống'),
  validate
], promotionController.create);

router.put('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ten_chuong_trinh').notEmpty().withMessage('Tên chương trình không được để trống'),
  validate
], promotionController.update);

router.delete('/:id', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], promotionController.delete);

// Add/remove products from promotion
router.post('/:id/products', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('ma_sp').notEmpty().withMessage('Mã sản phẩm không được để trống'),
  validate
], promotionController.addProduct);

router.delete('/:id/products/:ma_sp', [
  authMiddleware,
  requireRole('admin', 'quan_ly')
], promotionController.removeProduct);

module.exports = router;
