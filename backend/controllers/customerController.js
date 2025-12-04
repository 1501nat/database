const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM khach_hang ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM khach_hang WHERE ma_kh = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const { ma_kh, ho_ten, sdt, email, dia_chi, gioi_tinh, ngay_sinh, hang_thanh_vien, diem_tich_luy } = req.body;

    const [existing] = await db.query('SELECT ma_kh FROM khach_hang WHERE ma_kh = ?', [ma_kh]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Mã khách hàng đã tồn tại' });
    }

    await db.query(
      `INSERT INTO khach_hang (ma_kh, ho_ten, sdt, email, dia_chi, gioi_tinh, ngay_sinh, hang_thanh_vien, diem_tich_luy, ngay_dang_ky, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), NOW(), NOW())`,
      [ma_kh, ho_ten, sdt, email, dia_chi, gioi_tinh, ngay_sinh, hang_thanh_vien || 'thường', diem_tich_luy || 0]
    );

    res.status(201).json({ message: 'Tạo khách hàng thành công', ma_kh });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const { ho_ten, sdt, email, dia_chi, gioi_tinh, ngay_sinh, hang_thanh_vien, diem_tich_luy } = req.body;

    const [result] = await db.query(
      `UPDATE khach_hang SET ho_ten = ?, sdt = ?, email = ?, dia_chi = ?, gioi_tinh = ?, ngay_sinh = ?, hang_thanh_vien = ?, diem_tich_luy = ?, updated_at = NOW() 
       WHERE ma_kh = ?`,
      [ho_ten, sdt, email, dia_chi, gioi_tinh, ngay_sinh, hang_thanh_vien, diem_tich_luy, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    res.json({ message: 'Cập nhật khách hàng thành công' });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM khach_hang WHERE ma_kh = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    res.json({ message: 'Xóa khách hàng thành công' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
