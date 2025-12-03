const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM nha_cung_cap ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM nha_cung_cap WHERE ma_ncc = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getSupplierProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT spncc.*, sp.ten_sp, sp.don_vi_tinh 
      FROM san_pham_nha_cung_cap spncc 
      LEFT JOIN san_pham sp ON spncc.ma_sp = sp.ma_sp 
      WHERE spncc.ma_ncc = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Get supplier products error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const { ma_ncc, ten_cong_ty, dia_chi, sdt, email, nguoi_lien_he, ma_so_thue, trang_thai_hop_tac } = req.body;

    const [existing] = await db.query('SELECT ma_ncc FROM nha_cung_cap WHERE ma_ncc = ?', [ma_ncc]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Mã NCC đã tồn tại' });
    }

    await db.query(
      `INSERT INTO nha_cung_cap (ma_ncc, ten_cong_ty, dia_chi, sdt, email, nguoi_lien_he, ma_so_thue, trang_thai_hop_tac, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [ma_ncc, ten_cong_ty, dia_chi, sdt, email, nguoi_lien_he, ma_so_thue, trang_thai_hop_tac || 'đang hợp tác']
    );

    res.status(201).json({ message: 'Tạo nhà cung cấp thành công', ma_ncc });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const { ten_cong_ty, dia_chi, sdt, email, nguoi_lien_he, ma_so_thue, trang_thai_hop_tac } = req.body;

    const [result] = await db.query(
      `UPDATE nha_cung_cap SET ten_cong_ty = ?, dia_chi = ?, sdt = ?, email = ?, nguoi_lien_he = ?, ma_so_thue = ?, trang_thai_hop_tac = ?, updated_at = NOW() 
       WHERE ma_ncc = ?`,
      [ten_cong_ty, dia_chi, sdt, email, nguoi_lien_he, ma_so_thue, trang_thai_hop_tac, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp' });
    }

    res.json({ message: 'Cập nhật nhà cung cấp thành công' });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM nha_cung_cap WHERE ma_ncc = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp' });
    }

    res.json({ message: 'Xóa nhà cung cấp thành công' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
