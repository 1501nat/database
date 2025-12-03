const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT tk.*, sp.ten_sp, cn.ten_cn 
      FROM ton_kho tk 
      LEFT JOIN san_pham sp ON tk.ma_sp = sp.ma_sp 
      LEFT JOIN chi_nhanh cn ON tk.ma_cn = cn.ma_cn 
      ORDER BY tk.updated_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { ma_cn, ma_sp } = req.params;
    const [rows] = await db.query(`
      SELECT tk.*, sp.ten_sp, cn.ten_cn 
      FROM ton_kho tk 
      LEFT JOIN san_pham sp ON tk.ma_sp = sp.ma_sp 
      LEFT JOIN chi_nhanh cn ON tk.ma_cn = cn.ma_cn 
      WHERE tk.ma_cn = ? AND tk.ma_sp = ?
    `, [ma_cn, ma_sp]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tồn kho' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getByBranch = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT tk.*, sp.ten_sp, sp.don_vi_tinh, sp.gia_ban_le 
      FROM ton_kho tk 
      LEFT JOIN san_pham sp ON tk.ma_sp = sp.ma_sp 
      WHERE tk.ma_cn = ? 
      ORDER BY sp.ten_sp
    `, [req.params.ma_cn]);
    res.json(rows);
  } catch (error) {
    console.error('Get branch inventory error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT tk.*, sp.ten_sp, cn.ten_cn 
      FROM ton_kho tk 
      LEFT JOIN san_pham sp ON tk.ma_sp = sp.ma_sp 
      LEFT JOIN chi_nhanh cn ON tk.ma_cn = cn.ma_cn 
      WHERE tk.so_luong_ton <= tk.so_luong_toi_thieu 
      ORDER BY tk.so_luong_ton ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const { ma_cn, ma_sp, so_luong_ton, so_luong_toi_thieu, so_luong_toi_da } = req.body;

    const [existing] = await db.query('SELECT * FROM ton_kho WHERE ma_cn = ? AND ma_sp = ?', [ma_cn, ma_sp]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Tồn kho đã tồn tại cho sản phẩm này tại chi nhánh này' });
    }

    await db.query(
      `INSERT INTO ton_kho (ma_cn, ma_sp, so_luong_ton, so_luong_toi_thieu, so_luong_toi_da, ngay_cap_nhat, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, CURDATE(), NOW(), NOW())`,
      [ma_cn, ma_sp, so_luong_ton || 0, so_luong_toi_thieu, so_luong_toi_da]
    );

    res.status(201).json({ message: 'Tạo tồn kho thành công' });
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const { ma_cn, ma_sp } = req.params;
    const { so_luong_ton, so_luong_toi_thieu, so_luong_toi_da } = req.body;

    const [result] = await db.query(
      `UPDATE ton_kho SET so_luong_ton = ?, so_luong_toi_thieu = ?, so_luong_toi_da = ?, ngay_cap_nhat = CURDATE(), updated_at = NOW() 
       WHERE ma_cn = ? AND ma_sp = ?`,
      [so_luong_ton, so_luong_toi_thieu, so_luong_toi_da, ma_cn, ma_sp]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tồn kho' });
    }

    res.json({ message: 'Cập nhật tồn kho thành công' });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { ma_cn, ma_sp } = req.params;
    const [result] = await db.query('DELETE FROM ton_kho WHERE ma_cn = ? AND ma_sp = ?', [ma_cn, ma_sp]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tồn kho' });
    }

    res.json({ message: 'Xóa tồn kho thành công' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
