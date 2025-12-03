const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
  validate
], authController.login);

// Register
router.post('/register', [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('ma_nv').optional().isString(),
  validate
], authController.register);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Logout (client-side token removal, but we can track it)
router.post('/logout', authMiddleware, authController.logout);

// Change password
router.post('/change-password', [
  authMiddleware,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  validate
], authController.changePassword);

module.exports = router;
