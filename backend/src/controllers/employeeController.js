const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT nv.*, cn.ten_cn as ten_chi_nhanh 
      FROM nhan_vien nv 
      LEFT JOIN chi_nhanh cn ON nv.ma_cn = cn.ma_cn 
      ORDER BY nv.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT nv.*, cn.ten_cn as ten_chi_nhanh 
      FROM nhan_vien nv 
      LEFT JOIN chi_nhanh cn ON nv.ma_cn = cn.ma_cn 
      WHERE nv.ma_nv = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const { ma_nv, ho_ten, sdt, email, gioi_tinh, ngay_sinh, cccd, dia_chi_thuong_tru, ngay_vao_lam, ma_cn, ma_giam_sat, trang_thai_lam_viec } = req.body;

    const [existing] = await db.query('SELECT ma_nv FROM nhan_vien WHERE ma_nv = ?', [ma_nv]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Mã nhân viên đã tồn tại' });
    }

    await db.query(
      `INSERT INTO nhan_vien (ma_nv, ho_ten, sdt, email, gioi_tinh, ngay_sinh, cccd, dia_chi_thuong_tru, ngay_vao_lam, ma_cn, ma_giam_sat, trang_thai_lam_viec, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [ma_nv, ho_ten, sdt, email, gioi_tinh, ngay_sinh, cccd, dia_chi_thuong_tru, ngay_vao_lam, ma_cn, ma_giam_sat, trang_thai_lam_viec || 'đang làm']
    );

    res.status(201).json({ message: 'Tạo nhân viên thành công', ma_nv });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const { ho_ten, sdt, email, gioi_tinh, ngay_sinh, cccd, dia_chi_thuong_tru, ngay_vao_lam, ma_cn, ma_giam_sat, trang_thai_lam_viec } = req.body;

    const [result] = await db.query(
      `UPDATE nhan_vien SET ho_ten = ?, sdt = ?, email = ?, gioi_tinh = ?, ngay_sinh = ?, cccd = ?, dia_chi_thuong_tru = ?, ngay_vao_lam = ?, ma_cn = ?, ma_giam_sat = ?, trang_thai_lam_viec = ?, updated_at = NOW() 
       WHERE ma_nv = ?`,
      [ho_ten, sdt, email, gioi_tinh, ngay_sinh, cccd, dia_chi_thuong_tru, ngay_vao_lam, ma_cn, ma_giam_sat, trang_thai_lam_viec, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }

    res.json({ message: 'Cập nhật nhân viên thành công' });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM nhan_vien WHERE ma_nv = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }

    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
