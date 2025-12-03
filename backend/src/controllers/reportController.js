const db = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    // Total revenue
    const [revenueResult] = await db.query(`
      SELECT COALESCE(SUM(tong_tien_thanh_toan), 0) as total_revenue 
      FROM hoa_don_ban_hang 
      WHERE trang_thai_hoa_don = 'hoàn thành'
    `);

    // Total orders
    const [ordersResult] = await db.query(`
      SELECT COUNT(*) as total_orders FROM hoa_don_ban_hang
    `);

    // Total products
    const [productsResult] = await db.query(`
      SELECT COUNT(*) as total_products FROM san_pham WHERE trang_thai_sp = 'đang KD'
    `);

    // Total customers
    const [customersResult] = await db.query(`
      SELECT COUNT(*) as total_customers FROM khach_hang
    `);

    // Today's revenue
    const [todayRevenue] = await db.query(`
      SELECT COALESCE(SUM(tong_tien_thanh_toan), 0) as today_revenue 
      FROM hoa_don_ban_hang 
      WHERE DATE(ngay_gio_giao_dich) = CURDATE() AND trang_thai_hoa_don = 'hoàn thành'
    `);

    // Today's orders
    const [todayOrders] = await db.query(`
      SELECT COUNT(*) as today_orders 
      FROM hoa_don_ban_hang 
      WHERE DATE(ngay_gio_giao_dich) = CURDATE()
    `);

    res.json({
      total_revenue: revenueResult[0].total_revenue,
      total_orders: ordersResult[0].total_orders,
      total_products: productsResult[0].total_products,
      total_customers: customersResult[0].total_customers,
      today_revenue: todayRevenue[0].today_revenue,
      today_orders: todayOrders[0].today_orders
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getDailySales = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const [rows] = await db.query(`
      SELECT 
        DATE(ngay_gio_giao_dich) as date,
        COUNT(*) as total_orders,
        SUM(tong_tien_thanh_toan) as total_revenue
      FROM hoa_don_ban_hang 
      WHERE ngay_gio_giao_dich >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        AND trang_thai_hoa_don = 'hoàn thành'
      GROUP BY DATE(ngay_gio_giao_dich)
      ORDER BY date DESC
    `, [parseInt(days)]);
    
    res.json(rows);
  } catch (error) {
    console.error('Get daily sales error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getMonthlySales = async (req, res) => {
  try {
    const { months = 12 } = req.query;
    
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(ngay_gio_giao_dich, '%Y-%m') as month,
        COUNT(*) as total_orders,
        SUM(tong_tien_thanh_toan) as total_revenue
      FROM hoa_don_ban_hang 
      WHERE ngay_gio_giao_dich >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
        AND trang_thai_hoa_don = 'hoàn thành'
      GROUP BY DATE_FORMAT(ngay_gio_giao_dich, '%Y-%m')
      ORDER BY month DESC
    `, [parseInt(months)]);
    
    res.json(rows);
  } catch (error) {
    console.error('Get monthly sales error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getSalesByBranch = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        cn.ma_cn,
        cn.ten_cn,
        COUNT(hd.ma_hdbh) as total_orders,
        COALESCE(SUM(hd.tong_tien_thanh_toan), 0) as total_revenue
      FROM chi_nhanh cn
      LEFT JOIN hoa_don_ban_hang hd ON cn.ma_cn = hd.ma_cn AND hd.trang_thai_hoa_don = 'hoàn thành'
      GROUP BY cn.ma_cn, cn.ten_cn
      ORDER BY total_revenue DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Get sales by branch error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getSalesByEmployee = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        nv.ma_nv,
        nv.ho_ten,
        COUNT(hd.ma_hdbh) as total_orders,
        COALESCE(SUM(hd.tong_tien_thanh_toan), 0) as total_revenue
      FROM nhan_vien nv
      LEFT JOIN hoa_don_ban_hang hd ON nv.ma_nv = hd.ma_nv_bh AND hd.trang_thai_hoa_don = 'hoàn thành'
      GROUP BY nv.ma_nv, nv.ho_ten
      ORDER BY total_revenue DESC
      LIMIT 10
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Get sales by employee error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const [rows] = await db.query(`
      SELECT 
        sp.ma_sp,
        sp.ten_sp,
        COALESCE(SUM(ct.so_luong_ban), 0) as total_sold,
        COALESCE(SUM(ct.so_luong_ban * ct.don_gia_ban), 0) as total_revenue
      FROM san_pham sp
      LEFT JOIN chi_tiet_hdbh ct ON sp.ma_sp = ct.ma_sp
      LEFT JOIN hoa_don_ban_hang hd ON ct.ma_hdbh = hd.ma_hdbh AND hd.trang_thai_hoa_don = 'hoàn thành'
      GROUP BY sp.ma_sp, sp.ten_sp
      ORDER BY total_sold DESC
      LIMIT ?
    `, [parseInt(limit)]);
    
    res.json(rows);
  } catch (error) {
    console.error('Get top selling products error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        tk.ma_sp,
        sp.ten_sp,
        tk.ma_cn,
        cn.ten_cn,
        tk.so_luong_ton,
        tk.so_luong_toi_thieu
      FROM ton_kho tk
      LEFT JOIN san_pham sp ON tk.ma_sp = sp.ma_sp
      LEFT JOIN chi_nhanh cn ON tk.ma_cn = cn.ma_cn
      WHERE tk.so_luong_ton <= tk.so_luong_toi_thieu
      ORDER BY tk.so_luong_ton ASC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getTopCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const [rows] = await db.query(`
      SELECT 
        kh.ma_kh,
        kh.ho_ten,
        kh.sdt,
        kh.hang_thanh_vien,
        kh.diem_tich_luy,
        COUNT(hd.ma_hdbh) as total_orders,
        COALESCE(SUM(hd.tong_tien_thanh_toan), 0) as total_spent
      FROM khach_hang kh
      LEFT JOIN hoa_don_ban_hang hd ON kh.ma_kh = hd.ma_kh AND hd.trang_thai_hoa_don = 'hoàn thành'
      GROUP BY kh.ma_kh, kh.ho_ten, kh.sdt, kh.hang_thanh_vien, kh.diem_tich_luy
      ORDER BY total_spent DESC
      LIMIT ?
    `, [parseInt(limit)]);
    
    res.json(rows);
  } catch (error) {
    console.error('Get top customers error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
