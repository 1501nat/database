const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT hd.*, nv.ho_ten as ten_nv, cn.ten_cn, kh.ho_ten as ten_kh 
      FROM hoa_don_ban_hang hd 
      LEFT JOIN nhan_vien nv ON hd.ma_nv_bh = nv.ma_nv 
      LEFT JOIN chi_nhanh cn ON hd.ma_cn = cn.ma_cn 
      LEFT JOIN khach_hang kh ON hd.ma_kh = kh.ma_kh 
      ORDER BY hd.ngay_gio_giao_dich DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT hd.*, nv.ho_ten as ten_nv, cn.ten_cn, kh.ho_ten as ten_kh 
      FROM hoa_don_ban_hang hd 
      LEFT JOIN nhan_vien nv ON hd.ma_nv_bh = nv.ma_nv 
      LEFT JOIN chi_nhanh cn ON hd.ma_cn = cn.ma_cn 
      LEFT JOIN khach_hang kh ON hd.ma_kh = kh.ma_kh 
      WHERE hd.ma_hdbh = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hóa đơn' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get sale error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getInvoiceDetails = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ct.*, sp.ten_sp, sp.don_vi_tinh 
      FROM chi_tiet_hdbh ct 
      LEFT JOIN san_pham sp ON ct.ma_sp = sp.ma_sp 
      WHERE ct.ma_hdbh = ? 
      ORDER BY ct.stt_dong
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Get invoice details error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getByBranch = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT hd.*, nv.ho_ten as ten_nv, kh.ho_ten as ten_kh 
      FROM hoa_don_ban_hang hd 
      LEFT JOIN nhan_vien nv ON hd.ma_nv_bh = nv.ma_nv 
      LEFT JOIN khach_hang kh ON hd.ma_kh = kh.ma_kh 
      WHERE hd.ma_cn = ? 
      ORDER BY hd.ngay_gio_giao_dich DESC
    `, [req.params.ma_cn]);
    res.json(rows);
  } catch (error) {
    console.error('Get branch sales error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getByDateRange = async (req, res) => {
  try {
    const { start_date, end_date, ma_cn } = req.query;
    
    let query = `
      SELECT hd.*, nv.ho_ten as ten_nv, cn.ten_cn, kh.ho_ten as ten_kh 
      FROM hoa_don_ban_hang hd 
      LEFT JOIN nhan_vien nv ON hd.ma_nv_bh = nv.ma_nv 
      LEFT JOIN chi_nhanh cn ON hd.ma_cn = cn.ma_cn 
      LEFT JOIN khach_hang kh ON hd.ma_kh = kh.ma_kh 
      WHERE DATE(hd.ngay_gio_giao_dich) BETWEEN ? AND ?
    `;
    const params = [start_date, end_date];
    
    if (ma_cn) {
      query += ' AND hd.ma_cn = ?';
      params.push(ma_cn);
    }
    
    query += ' ORDER BY hd.ngay_gio_giao_dich DESC';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get date range sales error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { 
      ma_hdbh, ma_cn, ma_nv_bh, ma_kh, 
      tong_gia_tri_truoc_giam, so_tien_giam_gia, tong_tien_thanh_toan,
      so_tien_khach_dua, so_tien_thoi_lai, hinh_thuc_thanh_toan, ghi_chu,
      items 
    } = req.body;

    // Check if invoice exists
    const [existing] = await connection.query('SELECT ma_hdbh FROM hoa_don_ban_hang WHERE ma_hdbh = ?', [ma_hdbh]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Mã hóa đơn đã tồn tại' });
    }

    // Create invoice
    await connection.query(
      `INSERT INTO hoa_don_ban_hang (ma_hdbh, ma_cn, ma_nv_bh, ma_kh, ngay_gio_giao_dich, 
        tong_gia_tri_truoc_giam, so_tien_giam_gia, tong_tien_thanh_toan, so_tien_khach_dua, 
        so_tien_thoi_lai, hinh_thuc_thanh_toan, ghi_chu, trang_thai_hoa_don, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, 'hoàn thành', NOW(), NOW())`,
      [ma_hdbh, ma_cn, ma_nv_bh, ma_kh || null, tong_gia_tri_truoc_giam, so_tien_giam_gia || 0, 
       tong_tien_thanh_toan, so_tien_khach_dua, so_tien_thoi_lai || 0, hinh_thuc_thanh_toan, ghi_chu]
    );

    // Create invoice details and update inventory
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      await connection.query(
        `INSERT INTO chi_tiet_hdbh (ma_hdbh, stt_dong, ma_sp, so_luong_ban, don_gia_ban, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [ma_hdbh, i + 1, item.ma_sp, item.so_luong_ban, item.don_gia_ban]
      );

      // Update inventory
      await connection.query(
        `UPDATE ton_kho SET so_luong_ton = so_luong_ton - ?, ngay_cap_nhat = CURDATE(), updated_at = NOW() 
         WHERE ma_cn = ? AND ma_sp = ?`,
        [item.so_luong_ban, ma_cn, item.ma_sp]
      );
    }

    // Update customer points if customer exists
    if (ma_kh) {
      const points = Math.floor(tong_tien_thanh_toan / 10000);
      await connection.query(
        'UPDATE khach_hang SET diem_tich_luy = diem_tich_luy + ?, updated_at = NOW() WHERE ma_kh = ?',
        [points, ma_kh]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Tạo hóa đơn thành công', ma_hdbh });
  } catch (error) {
    await connection.rollback();
    console.error('Create sale error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  } finally {
    connection.release();
  }
};

exports.update = async (req, res) => {
  try {
    const { trang_thai_hoa_don, ghi_chu } = req.body;

    const [result] = await db.query(
      `UPDATE hoa_don_ban_hang SET trang_thai_hoa_don = ?, ghi_chu = ?, updated_at = NOW() 
       WHERE ma_hdbh = ?`,
      [trang_thai_hoa_don, ghi_chu, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hóa đơn' });
    }

    res.json({ message: 'Cập nhật hóa đơn thành công' });
  } catch (error) {
    console.error('Update sale error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Delete details first
    await connection.query('DELETE FROM chi_tiet_hdbh WHERE ma_hdbh = ?', [req.params.id]);
    
    // Delete invoice
    const [result] = await connection.query('DELETE FROM hoa_don_ban_hang WHERE ma_hdbh = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Không tìm thấy hóa đơn' });
    }

    await connection.commit();
    res.json({ message: 'Xóa hóa đơn thành công' });
  } catch (error) {
    await connection.rollback();
    console.error('Delete sale error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  } finally {
    connection.release();
  }
};
