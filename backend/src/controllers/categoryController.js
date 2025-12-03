const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT dm.*, parent.ten_danh_muc as ten_danh_muc_cha 
      FROM danh_muc_san_pham dm 
      LEFT JOIN danh_muc_san_pham parent ON dm.ma_dm_super = parent.ma_dm 
      ORDER BY dm.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM danh_muc_san_pham WHERE ma_dm = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const { ma_dm, ten_danh_muc, mo_ta, ma_dm_super } = req.body;

    const [existing] = await db.query('SELECT ma_dm FROM danh_muc_san_pham WHERE ma_dm = ?', [ma_dm]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Mã danh mục đã tồn tại' });
    }

    await db.query(
      `INSERT INTO danh_muc_san_pham (ma_dm, ten_danh_muc, mo_ta, ma_dm_super, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [ma_dm, ten_danh_muc, mo_ta, ma_dm_super || null]
    );

    res.status(201).json({ message: 'Tạo danh mục thành công', ma_dm });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const { ten_danh_muc, mo_ta, ma_dm_super } = req.body;

    const [result] = await db.query(
      `UPDATE danh_muc_san_pham SET ten_danh_muc = ?, mo_ta = ?, ma_dm_super = ?, updated_at = NOW() 
       WHERE ma_dm = ?`,
      [ten_danh_muc, mo_ta, ma_dm_super || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    }

    res.json({ message: 'Cập nhật danh mục thành công' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM danh_muc_san_pham WHERE ma_dm = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    }

    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
