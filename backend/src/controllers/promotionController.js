const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chuong_trinh_khuyen_mai ORDER BY ngay_bat_dau DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getActive = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM chuong_trinh_khuyen_mai 
      WHERE trang_thai_ct = 'đang diễn ra' 
        AND ngay_bat_dau <= CURDATE() 
        AND ngay_ket_thuc >= CURDATE() 
      ORDER BY ngay_bat_dau DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get active promotions error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chuong_trinh_khuyen_mai WHERE ma_ctkm = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy chương trình khuyến mãi' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get promotion error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getPromotionProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT csp.*, sp.ten_sp, sp.gia_ban_le 
      FROM ctkm_san_pham csp 
      LEFT JOIN san_pham sp ON csp.ma_sp = sp.ma_sp 
      WHERE csp.ma_ctkm = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Get promotion products error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const { ma_ctkm, ten_chuong_trinh, mo_ta, ngay_bat_dau, ngay_ket_thuc, loai_khuyen_mai, gia_tri_khuyen_mai, trang_thai_ct } = req.body;

    const [existing] = await db.query('SELECT ma_ctkm FROM chuong_trinh_khuyen_mai WHERE ma_ctkm = ?', [ma_ctkm]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Mã CTKM đã tồn tại' });
    }

    await db.query(
      `INSERT INTO chuong_trinh_khuyen_mai (ma_ctkm, ten_chuong_trinh, mo_ta, ngay_bat_dau, ngay_ket_thuc, loai_khuyen_mai, gia_tri_khuyen_mai, trang_thai_ct, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [ma_ctkm, ten_chuong_trinh, mo_ta, ngay_bat_dau, ngay_ket_thuc, loai_khuyen_mai, gia_tri_khuyen_mai, trang_thai_ct || 'chưa bắt đầu']
    );

    res.status(201).json({ message: 'Tạo chương trình khuyến mãi thành công', ma_ctkm });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const { ten_chuong_trinh, mo_ta, ngay_bat_dau, ngay_ket_thuc, loai_khuyen_mai, gia_tri_khuyen_mai, trang_thai_ct } = req.body;

    const [result] = await db.query(
      `UPDATE chuong_trinh_khuyen_mai SET ten_chuong_trinh = ?, mo_ta = ?, ngay_bat_dau = ?, ngay_ket_thuc = ?, loai_khuyen_mai = ?, gia_tri_khuyen_mai = ?, trang_thai_ct = ?, updated_at = NOW() 
       WHERE ma_ctkm = ?`,
      [ten_chuong_trinh, mo_ta, ngay_bat_dau, ngay_ket_thuc, loai_khuyen_mai, gia_tri_khuyen_mai, trang_thai_ct, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy chương trình khuyến mãi' });
    }

    res.json({ message: 'Cập nhật chương trình khuyến mãi thành công' });
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Delete product associations first
    await connection.query('DELETE FROM ctkm_san_pham WHERE ma_ctkm = ?', [req.params.id]);
    
    // Delete promotion
    const [result] = await connection.query('DELETE FROM chuong_trinh_khuyen_mai WHERE ma_ctkm = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Không tìm thấy chương trình khuyến mãi' });
    }

    await connection.commit();
    res.json({ message: 'Xóa chương trình khuyến mãi thành công' });
  } catch (error) {
    await connection.rollback();
    console.error('Delete promotion error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  } finally {
    connection.release();
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { ma_sp } = req.body;
    
    const [existing] = await db.query(
      'SELECT * FROM ctkm_san_pham WHERE ma_ctkm = ? AND ma_sp = ?',
      [req.params.id, ma_sp]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Sản phẩm đã có trong chương trình khuyến mãi' });
    }

    await db.query(
      'INSERT INTO ctkm_san_pham (ma_ctkm, ma_sp, created_at) VALUES (?, ?, NOW())',
      [req.params.id, ma_sp]
    );

    res.status(201).json({ message: 'Thêm sản phẩm vào CTKM thành công' });
  } catch (error) {
    console.error('Add product to promotion error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM ctkm_san_pham WHERE ma_ctkm = ? AND ma_sp = ?',
      [req.params.id, req.params.ma_sp]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm trong CTKM' });
    }

    res.json({ message: 'Xóa sản phẩm khỏi CTKM thành công' });
  } catch (error) {
    console.error('Remove product from promotion error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
