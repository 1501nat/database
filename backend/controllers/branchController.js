const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chi_nhanh ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chi_nhanh WHERE ma_cn = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy chi nhánh' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const { ma_cn, ten_cn, dia_chi, so_nha_duong, phuong_xa, quan_huyen, tinh_thanh, sdt, ngay_mo_cua, trang_thai_hoat_dong } = req.body;

    // Check if branch code exists
    const [existing] = await db.query('SELECT ma_cn FROM chi_nhanh WHERE ma_cn = ?', [ma_cn]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Mã chi nhánh đã tồn tại' });
    }

    await db.query(
      `INSERT INTO chi_nhanh (ma_cn, ten_cn, dia_chi, so_nha_duong, phuong_xa, quan_huyen, tinh_thanh, sdt, ngay_mo_cua, trang_thai_hoat_dong, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [ma_cn, ten_cn, dia_chi, so_nha_duong, phuong_xa, quan_huyen, tinh_thanh, sdt, ngay_mo_cua, trang_thai_hoat_dong || 'đang hoạt động']
    );

    res.status(201).json({ message: 'Tạo chi nhánh thành công', ma_cn });
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const { ten_cn, dia_chi, so_nha_duong, phuong_xa, quan_huyen, tinh_thanh, sdt, ngay_mo_cua, trang_thai_hoat_dong } = req.body;

    const [result] = await db.query(
      `UPDATE chi_nhanh SET ten_cn = ?, dia_chi = ?, so_nha_duong = ?, phuong_xa = ?, quan_huyen = ?, tinh_thanh = ?, sdt = ?, ngay_mo_cua = ?, trang_thai_hoat_dong = ?, updated_at = NOW() 
       WHERE ma_cn = ?`,
      [ten_cn, dia_chi, so_nha_duong, phuong_xa, quan_huyen, tinh_thanh, sdt, ngay_mo_cua, trang_thai_hoat_dong, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy chi nhánh' });
    }

    res.json({ message: 'Cập nhật chi nhánh thành công' });
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM chi_nhanh WHERE ma_cn = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy chi nhánh' });
    }

    res.json({ message: 'Xóa chi nhánh thành công' });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
