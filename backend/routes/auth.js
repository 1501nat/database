const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
  validate
], authController.login);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Logout
router.post('/logout', authMiddleware, authController.logout);

// Change password
router.post('/change-password', [
  authMiddleware,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  validate
], authController.changePassword);

// ==================== QUẢN LÝ TÀI KHOẢN ====================

// Lấy danh sách tài khoản (admin, quan_ly)
router.get('/users', 
  authMiddleware, 
  requireRole('admin', 'quan_ly'), 
  authController.getUsers
);

// Tạo tài khoản mới (admin, quan_ly)
router.post('/users', [
  authMiddleware,
  requireRole('admin', 'quan_ly'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('role').isIn(['admin', 'quan_ly', 'ban_hang', 'kho', 'ke_toan']).withMessage('Role không hợp lệ'),
  validate
], authController.createUser);

// Cập nhật tài khoản (admin, quan_ly)
router.put('/users/:id', 
  authMiddleware, 
  requireRole('admin', 'quan_ly'), 
  authController.updateUser
);

// Xóa tài khoản (admin, quan_ly)
router.delete('/users/:id', 
  authMiddleware, 
  requireRole('admin', 'quan_ly'), 
  authController.deleteUser
);

module.exports = router;
