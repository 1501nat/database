const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Get user role
    const [roles] = await db.query(
      'SELECT * FROM user_roles WHERE user_id = ?',
      [user.id]
    );

    const token = generateToken(user);

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: roles[0]?.role || 'ban_hang',
        ma_nv: roles[0]?.ma_nv
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, ma_nv } = req.body;

    // Check if user exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.query(
      'INSERT INTO users (email, password, created_at) VALUES (?, ?, NOW())',
      [email, hashedPassword]
    );

    const userId = result.insertId;

    // Assign default role
    await db.query(
      'INSERT INTO user_roles (user_id, role, ma_nv) VALUES (?, ?, ?)',
      [userId, 'ban_hang', ma_nv || null]
    );

    const token = generateToken({ id: userId, email });

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: userId,
        email,
        role: 'ban_hang',
        ma_nv
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        ...users[0],
        role: req.user.role,
        ma_nv: req.user.ma_nv
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.logout = async (req, res) => {
  // In a more complete implementation, you might want to blacklist the token
  res.json({ message: 'Đăng xuất thành công' });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
