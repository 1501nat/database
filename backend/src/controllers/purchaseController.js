const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pn.*, 
             ncc.ten_cong_ty as nha_cung_cap_ten,
             cn.ten_cn as chi_nhanh_ten,
             nv.ho_ten as nhan_vien_ten
      FROM phieu_nhap pn
      LEFT JOIN nha_cung_cap ncc ON pn.ma_ncc = ncc.ma_ncc
      LEFT JOIN chi_nhanh cn ON pn.ma_cn = cn.ma_cn
      LEFT JOIN nhan_vien nv ON pn.ma_nv_kho = nv.ma_nv
      ORDER BY pn.ngay_gio_nhap DESC
    `);
    
    // Transform data for frontend
    const result = rows.map(row => ({
      ...row,
      nha_cung_cap: { ten_cong_ty: row.nha_cung_cap_ten },
      chi_nhanh: { ten_cn: row.chi_nhanh_ten },
      nhan_vien: { ho_ten: row.nhan_vien_ten }
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pn.*, 
             ncc.ten_cong_ty as nha_cung_cap_ten,
             cn.ten_cn as chi_nhanh_ten,
             nv.ho_ten as nhan_vien_ten
      FROM phieu_nhap pn
      LEFT JOIN nha_cung_cap ncc ON pn.ma_ncc = ncc.ma_ncc
      LEFT JOIN chi_nhanh cn ON pn.ma_cn = cn.ma_cn
      LEFT JOIN nhan_vien nv ON pn.ma_nv_kho = nv.ma_nv
      WHERE pn.ma_phieu_nhap = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phiếu nhập' });
    }

    const row = rows[0];
    res.json({
      ...row,
      nha_cung_cap: { ten_cong_ty: row.nha_cung_cap_ten },
      chi_nhanh: { ten_cn: row.chi_nhanh_ten },
      nhan_vien: { ho_ten: row.nhan_vien_ten }
    });
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getDetails = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ct.*, sp.ten_sp, sp.don_vi_tinh
      FROM chi_tiet_phieu_nhap ct
      LEFT JOIN san_pham sp ON ct.ma_sp = sp.ma_sp
      WHERE ct.ma_phieu_nhap = ?
      ORDER BY ct.stt_dong
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Get purchase details error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { ma_phieu_nhap, ma_cn, ma_ncc, ma_nv_kho, ngay_gio_nhap, tong_gia_tri, so_tien_da_thanh_toan, trang_thai_thanh_toan, ghi_chu, items } = req.body;

    // Check if ID exists
    const [existing] = await connection.query('SELECT ma_phieu_nhap FROM phieu_nhap WHERE ma_phieu_nhap = ?', [ma_phieu_nhap]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Mã phiếu nhập đã tồn tại' });
    }

    // Create purchase receipt
    await connection.query(
      `INSERT INTO phieu_nhap (ma_phieu_nhap, ma_cn, ma_ncc, ma_nv_kho, ngay_gio_nhap, tong_gia_tri, so_tien_da_thanh_toan, trang_thai_thanh_toan, ghi_chu, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [ma_phieu_nhap, ma_cn, ma_ncc, ma_nv_kho, ngay_gio_nhap, tong_gia_tri, so_tien_da_thanh_toan || 0, trang_thai_thanh_toan || 'còn nợ', ghi_chu]
    );

    // Create detail items
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await connection.query(
          `INSERT INTO chi_tiet_phieu_nhap (ma_phieu_nhap, stt_dong, ma_sp, so_luong_nhap, don_gia_nhap, created_at)
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [ma_phieu_nhap, i + 1, item.ma_sp, item.so_luong_nhap, item.don_gia_nhap]
        );
        
        // Update inventory
        const [existingStock] = await connection.query(
          'SELECT * FROM ton_kho WHERE ma_cn = ? AND ma_sp = ?',
          [ma_cn, item.ma_sp]
        );
        
        if (existingStock.length > 0) {
          await connection.query(
            'UPDATE ton_kho SET so_luong_ton = so_luong_ton + ?, ngay_cap_nhat = CURDATE(), updated_at = NOW() WHERE ma_cn = ? AND ma_sp = ?',
            [item.so_luong_nhap, ma_cn, item.ma_sp]
          );
        } else {
          await connection.query(
            'INSERT INTO ton_kho (ma_cn, ma_sp, so_luong_ton, ngay_cap_nhat, created_at, updated_at) VALUES (?, ?, ?, CURDATE(), NOW(), NOW())',
            [ma_cn, item.ma_sp, item.so_luong_nhap]
          );
        }
        
        // Update product's last import info
        await connection.query(
          'UPDATE san_pham SET ma_phieu_nhap_cuoi = ?, stt_dong_nhap_cuoi = ?, gia_cap_nhat_gan_nhat = ?, updated_at = NOW() WHERE ma_sp = ?',
          [ma_phieu_nhap, i + 1, item.don_gia_nhap, item.ma_sp]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: 'Tạo phiếu nhập thành công', id: ma_phieu_nhap });
  } catch (error) {
    await connection.rollback();
    console.error('Create purchase error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  } finally {
    connection.release();
  }
};

exports.update = async (req, res) => {
  try {
    const { so_tien_da_thanh_toan, trang_thai_thanh_toan, ghi_chu } = req.body;

    const [result] = await db.query(
      `UPDATE phieu_nhap SET so_tien_da_thanh_toan = ?, trang_thai_thanh_toan = ?, ghi_chu = ?, updated_at = NOW()
       WHERE ma_phieu_nhap = ?`,
      [so_tien_da_thanh_toan, trang_thai_thanh_toan, ghi_chu, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phiếu nhập' });
    }

    res.json({ message: 'Cập nhật phiếu nhập thành công' });
  } catch (error) {
    console.error('Update purchase error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Delete detail items first
    await connection.query('DELETE FROM chi_tiet_phieu_nhap WHERE ma_phieu_nhap = ?', [req.params.id]);
    
    // Delete purchase
    const [result] = await connection.query('DELETE FROM phieu_nhap WHERE ma_phieu_nhap = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Không tìm thấy phiếu nhập' });
    }

    await connection.commit();
    res.json({ message: 'Xóa phiếu nhập thành công' });
  } catch (error) {
    await connection.rollback();
    console.error('Delete purchase error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  } finally {
    connection.release();
  }
};