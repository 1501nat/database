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

// Các role mà từng loại user có thể tạo
const ROLE_PERMISSIONS = {
  admin: ['admin', 'quan_ly', 'ban_hang', 'kho', 'ke_toan'],
  quan_ly: ['ban_hang', 'kho', 'ke_toan'],
  ban_hang: [],
  kho: [],
  ke_toan: []
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

// API tạo tài khoản cho nhân viên (chỉ admin và quản lý được sử dụng)
exports.createUser = async (req, res) => {
  try {
    const { email, password, role, ma_nv } = req.body;
    const currentUserRole = req.user.role;

    // Kiểm tra quyền tạo tài khoản
    const allowedRoles = ROLE_PERMISSIONS[currentUserRole] || [];
    
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ 
        error: `Bạn không có quyền tạo tài khoản với role "${role}"` 
      });
    }

    // Check if user exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    // Kiểm tra ma_nv có tồn tại không
    if (ma_nv) {
      const [employees] = await db.query(
        'SELECT * FROM nhan_vien WHERE ma_nv = ?',
        [ma_nv]
      );
      
      if (employees.length === 0) {
        return res.status(400).json({ error: 'Mã nhân viên không tồn tại' });
      }

      // Kiểm tra ma_nv đã được gán cho tài khoản khác chưa
      const [existingRole] = await db.query(
        'SELECT * FROM user_roles WHERE ma_nv = ?',
        [ma_nv]
      );
      
      if (existingRole.length > 0) {
        return res.status(400).json({ error: 'Mã nhân viên đã được gán cho tài khoản khác' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.query(
      'INSERT INTO users (email, password, created_at) VALUES (?, ?, NOW())',
      [email, hashedPassword]
    );

    const userId = result.insertId;

    // Assign role
    await db.query(
      'INSERT INTO user_roles (user_id, role, ma_nv) VALUES (?, ?, ?)',
      [userId, role, ma_nv || null]
    );

    res.status(201).json({
      message: 'Tạo tài khoản thành công',
      user: {
        id: userId,
        email,
        role,
        ma_nv
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Lấy danh sách tài khoản
exports.getUsers = async (req, res) => {
  try {
    const currentUserRole = req.user.role;

    // Chỉ admin và quản lý được xem danh sách
    if (!['admin', 'quan_ly'].includes(currentUserRole)) {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }

    const [users] = await db.query(`
      SELECT u.id, u.email, u.created_at, ur.role, ur.ma_nv, nv.ho_ten
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN nhan_vien nv ON ur.ma_nv = nv.ma_nv
      ORDER BY u.created_at DESC
    `);

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Cập nhật tài khoản
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, ma_nv, password } = req.body;
    const currentUserRole = req.user.role;

    // Chỉ admin được cập nhật tất cả, quản lý chỉ được cập nhật nhân viên
    if (currentUserRole !== 'admin') {
      // Kiểm tra user được cập nhật có phải nhân viên không
      const [targetUser] = await db.query(
        'SELECT ur.role FROM user_roles ur WHERE ur.user_id = ?',
        [id]
      );

      if (targetUser.length > 0 && ['admin', 'quan_ly'].includes(targetUser[0].role)) {
        return res.status(403).json({ error: 'Không có quyền cập nhật tài khoản này' });
      }
    }

    // Cập nhật password nếu có
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    }

    // Cập nhật role và ma_nv nếu có
    if (role || ma_nv !== undefined) {
      await db.query(
        'UPDATE user_roles SET role = COALESCE(?, role), ma_nv = ? WHERE user_id = ?',
        [role, ma_nv, id]
      );
    }

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Xóa tài khoản
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserRole = req.user.role;
    const currentUserId = req.user.id;

    // Không được xóa chính mình
    if (parseInt(id) === currentUserId) {
      return res.status(400).json({ error: 'Không thể xóa tài khoản của chính mình' });
    }

    // Chỉ admin được xóa tài khoản admin/quản lý
    const [targetUser] = await db.query(
      'SELECT ur.role FROM user_roles ur WHERE ur.user_id = ?',
      [id]
    );

    if (currentUserRole !== 'admin' && targetUser.length > 0 && ['admin', 'quan_ly'].includes(targetUser[0].role)) {
      return res.status(403).json({ error: 'Không có quyền xóa tài khoản này' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'Xóa tài khoản thành công' });
  } catch (error) {
    console.error('Delete user error:', error);
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
