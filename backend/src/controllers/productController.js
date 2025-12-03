const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sp.*, dm.ten_danh_muc 
      FROM san_pham sp 
      LEFT JOIN danh_muc_san_pham dm ON sp.ma_dm = dm.ma_dm 
      ORDER BY sp.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sp.*, dm.ten_danh_muc 
      FROM san_pham sp 
      LEFT JOIN danh_muc_san_pham dm ON sp.ma_dm = dm.ma_dm 
      WHERE sp.ma_sp = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const { ma_sp, ten_sp, mo_ta, don_vi_tinh, gia_ban_le, ma_dm, ma_vach, trang_thai_sp } = req.body;

    const [existing] = await db.query('SELECT ma_sp FROM san_pham WHERE ma_sp = ?', [ma_sp]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Mã sản phẩm đã tồn tại' });
    }

    await db.query(
      `INSERT INTO san_pham (ma_sp, ten_sp, mo_ta, don_vi_tinh, gia_ban_le, ma_dm, ma_vach, trang_thai_sp, ngay_them_vao, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), NOW(), NOW())`,
      [ma_sp, ten_sp, mo_ta, don_vi_tinh, gia_ban_le, ma_dm, ma_vach, trang_thai_sp || 'đang KD']
    );

    res.status(201).json({ message: 'Tạo sản phẩm thành công', ma_sp });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const { ten_sp, mo_ta, don_vi_tinh, gia_ban_le, ma_dm, ma_vach, trang_thai_sp } = req.body;

    const [result] = await db.query(
      `UPDATE san_pham SET ten_sp = ?, mo_ta = ?, don_vi_tinh = ?, gia_ban_le = ?, ma_dm = ?, ma_vach = ?, trang_thai_sp = ?, updated_at = NOW() 
       WHERE ma_sp = ?`,
      [ten_sp, mo_ta, don_vi_tinh, gia_ban_le, ma_dm, ma_vach, trang_thai_sp, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM san_pham WHERE ma_sp = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
